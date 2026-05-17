import { v4 as uuidv4 } from 'uuid';
import { request } from 'undici';
import { providerRepo } from '../lib/db/provider-repo.js';
import { fallbackConfigRepo } from '../lib/db/fallback-config-repo.js';
import { CircuitBreakerService } from './circuit-breaker.js';
import { adapterRegistry } from '../adapters/registry.js';
import type {
  InternalExecuteRequest,
  NormalizedUpstreamRequest,
  NormalizedResponseData,
  ProviderAdapterConfig,
  UpstreamResponse,
} from '../types/adapter.js';
import type { CircuitBreakerDecision } from '../types/circuit-breaker.js';
import type { FallbackChain, FallbackStep } from '../types/fallback.js';
import type { ExecuteResult } from '../types/execute.js';
import { ProviderHealthStatus } from '../types/category.js';

type AttemptLog = {
  requestId: string;
  category: string;
  providerId: string;
  providerName: string;
  statusCode: number | null;
  latencyMs: number | null;
  remainingProviders: string[];
  skipped?: boolean;
  reason?: string | null;
  errorCode?: string | null;
};

type ErrorInfo = {
  message: string;
  code: string | null;
};

export class FallbackExecutor {
  private readonly logger: Logger;
  private static testQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly circuitBreaker: CircuitBreakerService,
    logger: Logger,
  ) {
    this.logger = logger.child ? logger.child({ service: 'FallbackExecutor' }) : logger;
  }

  /**
   * Execute a request with category-aware fallback.
   * Tries providers in priority order until one succeeds or all fail.
   */
  async execute(
    category: string,
    request: InternalExecuteRequest,
    forceProvider?: string,
  ): Promise<ExecuteResult> {
    const cycleDegradedProviders = new Set<string>();
    const requestId = uuidv4();
    const startTime = Date.now();
    const providerConfigCache = new Map<string, ProviderAdapterConfig>();
    const attemptedProviders: string[] = [];
    const circuitBreakerDecisions: CircuitBreakerDecision[] = [];

    try {
      const chain = await this.resolveFallbackChain(category, forceProvider);

      if (!chain || chain.providers.length === 0) {
        return this.buildErrorResponse(
          requestId,
          category,
          'NO_AVAILABLE_PROVIDERS',
          `No available providers for category '${category}'`,
          startTime,
          null,
          null,
          { categoryOutage: true },
        );
      }

      const adapter = adapterRegistry.get(category);
      if (!adapter) {
        return this.buildErrorResponse(
          requestId,
          category,
          'UNSUPPORTED_CATEGORY',
          `No adapter registered for category '${category}'`,
          startTime,
          null,
          null,
          null,
        );
      }

      const primaryProvider = chain.providers[0]?.providerName ?? 'none';

      for (const [index, step] of chain.providers.entries()) {
        if (cycleDegradedProviders.has(step.providerId)) {
          continue;
        }
        attemptedProviders.push(step.providerName);
        const remainingProviders = chain.providers
          .slice(index + 1)
          .map((provider) => provider.providerName);

        const decision = await this.circuitBreaker.evaluate(
          step.providerId,
          step.providerName,
          category,
          false,
        );
        circuitBreakerDecisions.push(decision);

        if (!decision.allowed) {
          this.logAttempt({
            requestId,
            category,
            providerId: step.providerId,
            providerName: step.providerName,
            statusCode: null,
            latencyMs: null,
            remainingProviders,
            skipped: true,
            reason: decision.reason,
          });
          continue;
        }

        try {
          const providerConfig = await this.getProviderConfig(step.providerId, providerConfigCache);
          const effectiveTimeout = this.resolveTimeout(
            request.timeout,
            chain.timeoutMs,
            providerConfig.timeoutMs,
          );
          const requestForProvider: InternalExecuteRequest = {
            ...request,
            timeout: effectiveTimeout,
          };
          const normalizedRequest = await adapter.normalizeRequest(
            providerConfig,
            requestForProvider,
          );
          normalizedRequest.timeout = this.resolveTimeout(
            normalizedRequest.timeout,
            chain.timeoutMs,
            providerConfig.timeoutMs,
          );

          const upstreamResponse = await this.sendRequest(normalizedRequest);

          this.logAttempt({
            requestId,
            category,
            providerId: step.providerId,
            providerName: step.providerName,
            statusCode: upstreamResponse.statusCode,
            latencyMs: upstreamResponse.latencyMs,
            remainingProviders,
          });

          if (upstreamResponse.statusCode >= 200 && upstreamResponse.statusCode < 300) {
            try {
              await this.circuitBreaker.recordSuccess(step.providerId);
            } catch (cbError) {
              this.logger.warn(
                { err: cbError, provider: step.providerName, providerId: step.providerId },
                'Failed to persist circuit breaker success; continuing',
              );
            }
            const normalizedData = await adapter.transformResponse(
              providerConfig,
              upstreamResponse,
            );

            return this.buildSuccessResponse(
              requestId,
              category,
              primaryProvider,
              attemptedProviders,
              normalizedData,
              upstreamResponse,
              startTime,
              decision.state.healthStatus,
            );
          }

          const error = adapter.extractError(providerConfig, upstreamResponse);
          try {
            await this.circuitBreaker.recordFailure(step.providerId, false);
          } catch (cbError) {
            this.logger.warn(
              { err: cbError, provider: step.providerName, providerId: step.providerId },
              'Failed to persist circuit breaker failure; continuing',
            );
          }

          if (upstreamResponse.statusCode === 429) {
            this.logger.warn(
              {
                requestId,
                provider: step.providerName,
                statusCode: upstreamResponse.statusCode,
                retryAfterMs: error?.retryAfterMs ?? null,
                remainingProviders,
              },
              'Provider rate limited request; attempting fallback',
            );
            cycleDegradedProviders.add(step.providerId);
            continue;
          }

          if (upstreamResponse.statusCode >= 400 && upstreamResponse.statusCode < 500) {
            if (!error?.retryable) {
              return this.buildErrorResponse(
                requestId,
                category,
                'PROVIDER_CLIENT_ERROR',
                `Provider '${step.providerName}' returned ${upstreamResponse.statusCode}: ${
                  error?.message ?? 'Client error'
                }`,
                startTime,
                null,
                primaryProvider,
                {
                  provider: step.providerName,
                  statusCode: upstreamResponse.statusCode,
                  attemptedProviders,
                  circuitBreakerDecisions,
                },
              );
            }
          }

          this.logger.warn(
            {
              requestId,
              provider: step.providerName,
              statusCode: upstreamResponse.statusCode,
              remainingProviders,
            },
            'Provider failed; attempting fallback',
          );
        } catch (error) {
          try {
            await this.circuitBreaker.recordFailure(step.providerId, false);
          } catch (cbError) {
            this.logger.warn(
              { err: cbError, provider: step.providerName, providerId: step.providerId },
              'Failed to persist circuit breaker failure; continuing',
            );
          }
          const errorInfo = this.normalizeError(error);

          this.logAttempt({
            requestId,
            category,
            providerId: step.providerId,
            providerName: step.providerName,
            statusCode: null,
            latencyMs: null,
            remainingProviders,
            errorCode: errorInfo.code,
          });

          this.logger.error(
            {
              requestId,
              provider: step.providerName,
              error: errorInfo.message,
              errorCode: errorInfo.code,
              remainingProviders,
            },
            'Provider request failed; attempting fallback',
          );
        }
      }

      return this.buildErrorResponse(
        requestId,
        category,
        'CATEGORY_OUTAGE',
        `All providers for category '${category}' failed. Attempted: ${attemptedProviders.join(', ')}`,
        startTime,
        null,
        primaryProvider,
        {
          categoryOutage: true,
          attemptedProviders,
          circuitBreakerDecisions,
        },
      );
    } catch (error) {
      const errorInfo = this.normalizeError(error);
      this.logger.error(
        { requestId, category, error: errorInfo.message, errorCode: errorInfo.code },
        'Fallback executor error',
      );
      return this.buildErrorResponse(
        requestId,
        category,
        'INTERNAL_ERROR',
        'Internal error during request execution',
        startTime,
        null,
        null,
        { errorCode: errorInfo.code },
      );
    }
  }

  /**
   * Execute a canary probe to a specific provider.
   * Used by the circuit breaker to test if a DEGRADED provider has recovered.
   */
  async executeCanary(
    providerId: string,
    providerName: string,
    categorySlug: string,
  ): Promise<boolean> {
    try {
      const provider = await providerRepo.findById(providerId);
      if (!provider) {
        return false;
      }

      const adapter = adapterRegistry.get(categorySlug);
      if (!adapter) {
        return false;
      }

      const providerConfig = this.toAdapterConfig(provider);
      const fallbackDefaults = fallbackConfigRepo.getDefaults();

      const checkRequest: InternalExecuteRequest = {
        category: categorySlug,
        path: '/',
        method: 'GET',
        params: {},
        headers: {},
        body: null,
        timeout: this.resolveTimeout(
          provider.timeoutMs,
          fallbackDefaults.timeoutMs,
          provider.timeoutMs,
        ),
      };

      const normalized = await adapter.normalizeRequest(providerConfig, checkRequest);
      normalized.timeout = this.resolveTimeout(
        normalized.timeout,
        fallbackDefaults.timeoutMs,
        provider.timeoutMs,
      );
      const response = await this.sendRequest(normalized);

      if (response.statusCode >= 200 && response.statusCode < 500) {
        await this.circuitBreaker.recordSuccess(providerId, true);
        return true;
      }

      await this.circuitBreaker.recordFailure(providerId, true);
      return false;
    } catch (error) {
      const errorInfo = this.normalizeError(error);
      this.logger.error(
        {
          providerId,
          providerName,
          categorySlug,
          error: errorInfo.message,
          errorCode: errorInfo.code,
        },
        'Canary probe failed',
      );
      await this.circuitBreaker.recordFailure(providerId, true);
      return false;
    }
  }

  // ---- Private helpers ----

  private async resolveFallbackChain(
    category: string,
    forceProvider?: string,
  ): Promise<FallbackChain | null> {
    let providers: any[] = [];

    if (forceProvider) {
      const provider = await providerRepo.findBySlug(forceProvider);
      if (!provider || provider.category?.slug !== category) {
        return null;
      }
      providers = [provider];
    } else {
      providers = await providerRepo.findHealthyByCategory(category);

      if (providers.length === 0) {
        providers = await providerRepo.findByCategory(category);
        providers = providers.filter(
          (provider) =>
            provider.isActive && provider.healthStatus !== ProviderHealthStatus.DEAD,
        );
      }
    }

    const config = await fallbackConfigRepo.findByCategory(category);
    const defaults = fallbackConfigRepo.getDefaults();

    return {
      categorySlug: category,
      strategy: config?.strategy ?? defaults.strategy,
      maxRetries: config?.maxRetries ?? defaults.maxRetries,
      retryDelayMs: config?.retryDelayMs ?? defaults.retryDelayMs,
      timeoutMs: config?.timeoutMs ?? defaults.timeoutMs,
      providers: providers
        .map((provider, index) => ({
          providerId: provider.id,
          providerName: provider.name,
          priority: provider.priority ?? index,
          baseUrl: provider.baseUrl,
          isAvailable: provider.healthStatus === ProviderHealthStatus.HEALTHY,
        }))
        .sort((a, b) => a.priority - b.priority),
    };
  }

  private async getProviderConfig(
    providerId: string,
    cache: Map<string, ProviderAdapterConfig>,
  ): Promise<ProviderAdapterConfig> {
    const cached = cache.get(providerId);
    if (cached) {
      return cached;
    }

    const provider = await providerRepo.findById(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    const config = this.toAdapterConfig(provider);
    cache.set(providerId, config);
    return config;
  }

  private toAdapterConfig(provider: any): ProviderAdapterConfig {
    return {
      id: provider.id,
      name: provider.name,
      baseUrl: provider.baseUrl,
      authType: provider.authType as ProviderAdapterConfig['authType'],
      authConfig: this.parseJsonField(provider.authConfig),
      metadata: this.parseJsonField(provider.metadata),
      rateLimitPerMinute: provider.rateLimitPerMinute,
      timeoutMs: provider.timeoutMs,
    };
  }

  private parseJsonField(value: unknown): Record<string, unknown> | null {
    if (value == null) {
      return null;
    }
    if (typeof value === 'object') {
      return value as Record<string, unknown>;
    }
    if (typeof value !== 'string') {
      return null;
    }
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch (error) {
      this.logger.warn({ err: error }, 'Failed to parse provider JSON field');
      return null;
    }
  }

  private resolveTimeout(
    requestTimeout: number | undefined,
    chainTimeout: number | undefined,
    providerTimeout: number | undefined,
  ): number {
    const candidates = [requestTimeout, chainTimeout, providerTimeout]
      .filter((value): value is number => typeof value === 'number' && value > 0);

    if (candidates.length === 0) {
      return 3000;
    }

    return Math.min(...candidates);
  }

  private async sendRequest(normalized: NormalizedUpstreamRequest): Promise<UpstreamResponse> {
    if (process.env.NODE_ENV === 'test') {
      return this.enqueueTestRequest(() => this.sendRequestInternal(normalized));
    }
    return this.sendRequestInternal(normalized);
  }

  private async enqueueTestRequest<T>(fn: () => Promise<T>): Promise<T> {
    let release: (() => void) | undefined;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });
    const previous = FallbackExecutor.testQueue;
    FallbackExecutor.testQueue = previous.then(() => next);
    await previous;
    try {
      return await fn();
    } finally {
      release?.();
    }
  }

  private async sendRequestInternal(
    normalized: NormalizedUpstreamRequest,
  ): Promise<UpstreamResponse> {
    const startTime = Date.now();

    try {
      const response = await request(normalized.url, {
        method: normalized.method,
        headers: normalized.headers,
        body: normalized.body,
        headersTimeout: normalized.timeout,
        bodyTimeout: normalized.timeout,
      });

      const latencyMs = Date.now() - startTime;
      const bodyText = await this.readBodyText(response.body);
      const body = this.safeParseBody(bodyText);
      const headers: Record<string, string> = {};

      const headerEntries = response.headers ? Object.entries(response.headers) : [];
      for (const [key, value] of headerEntries) {
        if (typeof value === 'string') {
          headers[key] = value;
        } else if (Array.isArray(value)) {
          headers[key] = value.join(', ');
        }
      }

      return {
        statusCode: response.statusCode,
        headers,
        body,
        latencyMs,
      };
    } catch (error) {
      const errorInfo = this.normalizeError(error);
      const err = new Error(errorInfo.message);
      (err as NodeJS.ErrnoException).code = errorInfo.code ?? undefined;
      throw err;
    }
  }

  private async readBodyText(body: { text?: () => Promise<string> } | null | undefined): Promise<string> {
    if (!body?.text) {
      return '';
    }
    try {
      return await body.text();
    } catch (error) {
      this.logger.warn({ err: error }, 'Failed to read upstream response body');
      return '';
    }
  }

  private safeParseBody(bodyText: string): unknown {
    if (!bodyText) {
      return null;
    }
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }

  private normalizeError(error: unknown): ErrorInfo {
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException;
      return {
        message: error.message,
        code: nodeError.code ?? null,
      };
    }

    return {
      message: 'Unknown error',
      code: null,
    };
  }

  private buildSuccessResponse(
    requestId: string,
    category: string,
    primaryProvider: string,
    attemptedProviders: string[],
    normalizedData: NormalizedResponseData,
    upstreamResponse: UpstreamResponse,
    startTime: number,
    circuitBreakerStatus: ProviderHealthStatus,
  ): ExecuteResult {
    return {
      success: true,
      data: normalizedData.data,
      router_metadata: {
        requestId,
        category,
        primaryProvider,
        fallbackProvider:
          attemptedProviders.length > 1
            ? attemptedProviders[attemptedProviders.length - 1] ?? null
            : null,
        totalLatencyMs: Date.now() - startTime,
        providerLatencyMs: upstreamResponse.latencyMs,
        statusCode: upstreamResponse.statusCode,
        circuitBreakerStatus,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private buildErrorResponse(
    requestId: string,
    category: string,
    code: string,
    message: string,
    startTime: number,
    fallbackProvider: string | null,
    primaryProvider: string | null,
    details: Record<string, unknown> | null,
  ): ExecuteResult {
    return {
      success: false,
      error: {
        code,
        message,
        details: details ?? undefined,
      },
      router_metadata: {
        requestId,
        category,
        primaryProvider: primaryProvider ?? 'none',
        fallbackProvider,
        totalLatencyMs: Date.now() - startTime,
        providerLatencyMs: null,
        statusCode:
          code === 'CATEGORY_OUTAGE' || code === 'NO_AVAILABLE_PROVIDERS'
            ? 503
            : code === 'UNSUPPORTED_CATEGORY' || code === 'PROVIDER_CLIENT_ERROR'
              ? 400
              : 500,
        circuitBreakerStatus: null,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private logAttempt(payload: AttemptLog): void {
    this.logger.info(
      {
        requestId: payload.requestId,
        category: payload.category,
        providerId: payload.providerId,
        providerName: payload.providerName,
        statusCode: payload.statusCode,
        latencyMs: payload.latencyMs,
        remainingProviders: payload.remainingProviders,
        skipped: payload.skipped ?? false,
        reason: payload.reason ?? null,
        errorCode: payload.errorCode ?? null,
      },
      'Fallback attempt',
    );
  }
}

export interface Logger {
  info(obj: any, msg?: string): void;
  warn(obj: any, msg?: string): void;
  error(obj: any, msg?: string): void;
  debug(obj: any, msg?: string): void;
  child?: (bindings: Record<string, unknown>) => Logger;
}
