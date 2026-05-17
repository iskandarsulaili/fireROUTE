import { ProviderHealthStatus } from '../types/category.js';
import type {
  CircuitBreakerState,
  CircuitBreakerConfig,
  CircuitBreakerDecision,
  CircuitBreakerEvent,
} from '../types/circuit-breaker.js';
import { providerRepo } from '../lib/db/provider-repo.js';
import { fallbackConfigRepo } from '../lib/db/fallback-config-repo.js';
import { categoryRepo } from '../lib/db/category-repo.js';
import { v4 as uuidv4 } from 'uuid';

export interface Logger {
  info(obj: any, msg?: string): void;
  warn(obj: any, msg?: string): void;
  error(obj: any, msg?: string): void;
  debug(obj: any, msg?: string): void;
}

type CanaryCandidate = {
  providerId: string;
  providerName: string;
  categorySlug: string;
};

export class CircuitBreakerService {
  private readonly configs: Map<string, CircuitBreakerConfig> = new Map();
  private readonly states: Map<string, CircuitBreakerState> = new Map();
  private readonly events: CircuitBreakerEvent[] = [];
  private readonly logger: Logger;
  private canaryTimer: NodeJS.Timeout | null = null;
  private readonly CANARY_INTERVAL_MS = 30_000; // check every 30s for canary candidates
  private readonly DEAD_COOLDOWN_MULTIPLIER = 2;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /** Initialize: load configs for all categories */
  async initialize(): Promise<void> {
    try {
      const categories = await categoryRepo.findAll();
      let providerCount = 0;

      for (const category of categories) {
        await this.getConfig(category.slug);
      }

      for (const category of categories) {
        const providers = await providerRepo.findByCategory(category.slug);
        for (const provider of providers) {
          const state = this.loadStateFromDb({ ...provider, categorySlug: category.slug });
          this.states.set(provider.id, state);
          providerCount += 1;
        }
      }

      this.logger.info(
        { categoryCount: categories.length, providerCount },
        'Circuit breaker initialized',
      );
    } catch (error) {
      this.logger.error({ err: error }, 'Failed to initialize circuit breaker');
    }
  }

  /** Get config for a category, using defaults if not set */
  private async getConfig(categorySlug: string): Promise<CircuitBreakerConfig> {
    const cached = this.configs.get(categorySlug);
    if (cached) {
      return cached;
    }

    try {
      const defaults = fallbackConfigRepo.getDefaults();
      const config = await fallbackConfigRepo.findByCategory(categorySlug);
      const resolved: CircuitBreakerConfig = {
        threshold: config?.circuitBreakerThreshold ?? defaults.circuitBreakerThreshold,
        cooldownMinutes: config?.cooldownMinutes ?? defaults.cooldownMinutes,
        canaryIntervalMs: config?.canaryIntervalMs ?? defaults.canaryIntervalMs,
      };
      this.configs.set(categorySlug, resolved);
      return resolved;
    } catch (error) {
      this.logger.error(
        { err: error, categorySlug },
        'Failed to load circuit breaker config; using defaults',
      );
      const defaults = fallbackConfigRepo.getDefaults();
      const fallback: CircuitBreakerConfig = {
        threshold: defaults.circuitBreakerThreshold,
        cooldownMinutes: defaults.cooldownMinutes,
        canaryIntervalMs: defaults.canaryIntervalMs,
      };
      this.configs.set(categorySlug, fallback);
      return fallback;
    }
  }

  private resolveDefaults(): CircuitBreakerConfig {
    const defaults = fallbackConfigRepo.getDefaults();
    return {
      threshold: defaults.circuitBreakerThreshold,
      cooldownMinutes: defaults.cooldownMinutes,
      canaryIntervalMs: defaults.canaryIntervalMs,
    };
  }

  private async resolveConfig(categorySlug?: string | null): Promise<CircuitBreakerConfig> {
    if (!categorySlug) {
      return this.resolveDefaults();
    }

    return this.getConfig(categorySlug);
  }

  /**
   * Evaluate whether a request to a provider should be allowed.
   * Core decision logic:
   * - HEALTHY: always allowed
   * - DEGRADED: allowed ONLY if it's a canary probe
   * - DEAD: never allowed
   */
  async evaluate(
    providerId: string,
    providerName: string,
    categorySlug: string,
    isCanaryProbe: boolean,
  ): Promise<CircuitBreakerDecision> {
    const now = new Date();
    try {
      const existing = await this.getState(providerId);
      const state = existing ?? this.loadStateFromDb({
        id: providerId,
        name: providerName,
        categorySlug,
        healthStatus: ProviderHealthStatus.HEALTHY,
        failureCount: 0,
        cooldownUntil: null,
        lastProbedAt: null,
      });

      state.providerName = providerName;
      state.categorySlug = categorySlug;

      let allowed = true;
      let reason: string | null = null;
      let fallbackSuggested = false;

      if (state.healthStatus === ProviderHealthStatus.DEGRADED) {
        const cooldownExpired = !state.cooldownUntil || state.cooldownUntil <= now;
        if (isCanaryProbe && cooldownExpired) {
          allowed = true;
          reason = 'CANARY_PROBE_ALLOWED';
          state.isCanaryProbe = true;
          state.lastProbedAt = now;
        } else {
          allowed = false;
          reason = cooldownExpired ? 'DEGRADED_NO_CANARY' : 'COOLDOWN_ACTIVE';
          fallbackSuggested = true;
        }
      } else if (state.healthStatus === ProviderHealthStatus.DEAD) {
        allowed = false;
        reason = 'PROVIDER_DEAD';
        fallbackSuggested = true;
      } else {
        allowed = true;
        reason = null;
      }

      this.states.set(providerId, state);

      return {
        allowed,
        state,
        reason,
        fallbackSuggested,
      };
    } catch (error) {
      this.logger.error(
        { err: error, providerId, providerName, categorySlug },
        'Failed to evaluate circuit breaker; allowing request',
      );
      const state = this.loadStateFromDb({
        id: providerId,
        name: providerName,
        categorySlug,
        healthStatus: ProviderHealthStatus.HEALTHY,
        failureCount: 0,
        cooldownUntil: null,
        lastProbedAt: null,
      });
      return {
        allowed: true,
        state,
        reason: null,
        fallbackSuggested: false,
      };
    }
  }

  /**
   * Record a successful call to a provider.
   * - Resets consecutiveFailureCount to 0
   * - Sets lastSuccessAt to now
   * - If current status is DEGRADED and this was a canary probe, promote to HEALTHY
   * - Persists to database
   */
  async recordSuccess(providerId: string, isCanaryProbe = false): Promise<void> {
    try {
      const now = new Date();
      const state = (await this.getState(providerId)) ?? this.loadStateFromDb({
        id: providerId,
        name: 'unknown',
        categorySlug: 'unknown',
        healthStatus: ProviderHealthStatus.HEALTHY,
        failureCount: 0,
        cooldownUntil: null,
        lastProbedAt: null,
      });

      const previousStatus = state.healthStatus;
      state.failureCount = 0;
      state.consecutiveFailureCount = 0;
      state.lastSuccessAt = now;
      state.isCanaryProbe = isCanaryProbe;
      state.lastProbedAt = now;

      if (isCanaryProbe && state.healthStatus === ProviderHealthStatus.DEGRADED) {
        state.healthStatus = ProviderHealthStatus.HEALTHY;
        state.cooldownUntil = null;
        state.stateChangedAt = now;
        this.emitEvent({
          providerId: state.providerId,
          providerName: state.providerName,
          categorySlug: state.categorySlug,
          fromStatus: previousStatus,
          toStatus: state.healthStatus,
          reason: 'CANARY_SUCCESS',
          failureCount: state.failureCount,
        });
      } else if (previousStatus === ProviderHealthStatus.HEALTHY) {
        state.cooldownUntil = null;
      }

      this.states.set(providerId, state);
      await this.persistState(state);
    } catch (error) {
      this.logger.error({ err: error, providerId }, 'Failed to record provider success');
    }
  }

  /**
   * Record a failed call to a provider.
   * - Increments consecutiveFailureCount
   * - If consecutiveFailureCount >= threshold:
   *   - Transition from HEALTHY → DEGRADED
   *   - Set cooldownUntil = now + cooldownMinutes
   *   - Persist to database
   * - If already DEGRADED and failure count keeps growing, mark as DEAD after threshold * 2
   * - If was a canary probe and fails → DEAD immediately
   */
  async recordFailure(providerId: string, isCanaryProbe: boolean): Promise<void> {
    try {
      const now = new Date();
      const state = (await this.getState(providerId)) ?? this.loadStateFromDb({
        id: providerId,
        name: 'unknown',
        categorySlug: 'unknown',
        healthStatus: ProviderHealthStatus.HEALTHY,
        failureCount: 0,
        cooldownUntil: null,
        lastProbedAt: null,
      });

      const config: CircuitBreakerConfig = await this.resolveConfig(state.categorySlug);
      const threshold = config.threshold;
      const previousStatus = state.healthStatus;

      state.failureCount += 1;
      state.consecutiveFailureCount += 1;
      state.lastFailureAt = now;
      state.isCanaryProbe = isCanaryProbe;
      state.lastProbedAt = now;

      if (isCanaryProbe) {
        state.healthStatus = ProviderHealthStatus.DEAD;
        state.cooldownUntil = new Date(
          now.getTime() + config.cooldownMinutes * this.DEAD_COOLDOWN_MULTIPLIER * 60 * 1000,
        );
        state.stateChangedAt = now;
        this.emitEvent({
          providerId: state.providerId,
          providerName: state.providerName,
          categorySlug: state.categorySlug,
          fromStatus: previousStatus,
          toStatus: state.healthStatus,
          reason: 'CANARY_FAILURE',
          failureCount: state.failureCount,
        });
      } else if (state.healthStatus === ProviderHealthStatus.HEALTHY) {
        if (state.consecutiveFailureCount >= threshold) {
          state.healthStatus = ProviderHealthStatus.DEGRADED;
          state.cooldownUntil = new Date(now.getTime() + config.cooldownMinutes * 60 * 1000);
          state.stateChangedAt = now;
          this.emitEvent({
            providerId: state.providerId,
            providerName: state.providerName,
            categorySlug: state.categorySlug,
            fromStatus: previousStatus,
            toStatus: state.healthStatus,
            reason: 'FAILURE_THRESHOLD_REACHED',
            failureCount: state.failureCount,
          });
        }
      } else if (state.healthStatus === ProviderHealthStatus.DEGRADED) {
        if (state.consecutiveFailureCount >= threshold * 2) {
          state.healthStatus = ProviderHealthStatus.DEAD;
          state.cooldownUntil = new Date(
            now.getTime() + config.cooldownMinutes * this.DEAD_COOLDOWN_MULTIPLIER * 60 * 1000,
          );
          state.stateChangedAt = now;
          this.emitEvent({
            providerId: state.providerId,
            providerName: state.providerName,
            categorySlug: state.categorySlug,
            fromStatus: previousStatus,
            toStatus: state.healthStatus,
            reason: 'DEGRADED_FAILURE_THRESHOLD_REACHED',
            failureCount: state.failureCount,
          });
        }
      }

      this.states.set(providerId, state);
      await this.persistState(state);
    } catch (error) {
      this.logger.error({ err: error, providerId }, 'Failed to record provider failure');
    }
  }

  /**
   * Start the canary probe background timer.
   * Every CANARY_INTERVAL_MS, checks for providers whose cooldown has expired.
   * Those providers are candidates for canary probing.
   */
  startCanaryProbes(): void {
    if (this.canaryTimer) {
      return;
    }

    this.canaryTimer = setInterval(async () => {
      try {
        const candidates = await this.findCanaryCandidates();
        if (candidates.length > 0) {
          this.logger.info(
            { candidateCount: candidates.length, candidates },
            'Canary candidates ready for probing',
          );
        } else {
          this.logger.debug({ candidateCount: 0 }, 'No canary candidates found');
        }
      } catch (error) {
        this.logger.error({ err: error }, 'Failed to process canary probe interval');
      }
    }, this.CANARY_INTERVAL_MS);
  }

  /** Stop the canary probe timer */
  stopCanaryProbes(): void {
    if (!this.canaryTimer) {
      return;
    }
    clearInterval(this.canaryTimer);
    this.canaryTimer = null;
  }

  /**
   * Find providers that should be probed (cooldown expired, not already being probed).
   * Returns list of provider IDs to probe.
   */
  private async findCanaryCandidates(): Promise<CanaryCandidate[]> {
    const now = new Date();
    const candidates: CanaryCandidate[] = [];

    try {
      const degradedProviders = await providerRepo.findCanaryCandidates();
      for (const provider of degradedProviders) {
        const state = (await this.getState(provider.id)) ??
          this.loadStateFromDb({ ...provider, categorySlug: provider.category?.slug ?? '' });
        const config = await this.resolveConfig(state.categorySlug);
        const lastProbeAllowed =
          !state.lastProbedAt ||
          now.getTime() - state.lastProbedAt.getTime() >= config.canaryIntervalMs;

        if (!state.isCanaryProbe && lastProbeAllowed) {
          state.isCanaryProbe = true;
          state.lastProbedAt = now;
          this.states.set(provider.id, state);
          if (state.categorySlug) {
            candidates.push({
              providerId: state.providerId,
              providerName: state.providerName,
              categorySlug: state.categorySlug,
            });
          } else {
            this.logger.warn(
              { providerId: state.providerId, providerName: state.providerName },
              'Canary candidate missing category slug; skipping',
            );
          }
        }
      }

      for (const state of this.states.values()) {
        if (
          state.healthStatus === ProviderHealthStatus.DEAD &&
          state.cooldownUntil &&
          state.cooldownUntil <= now
        ) {
          const config = await this.resolveConfig(state.categorySlug);
          const previousStatus = state.healthStatus;
          state.healthStatus = ProviderHealthStatus.DEGRADED;
          state.cooldownUntil = new Date(now.getTime() + config.cooldownMinutes * 60 * 1000);
          state.stateChangedAt = now;
          this.emitEvent({
            providerId: state.providerId,
            providerName: state.providerName,
            categorySlug: state.categorySlug,
            fromStatus: previousStatus,
            toStatus: state.healthStatus,
            reason: 'DEAD_COOLDOWN_EXPIRED',
            failureCount: state.failureCount,
          });
          this.states.set(state.providerId, state);
          await this.persistState(state);
        }
      }
    } catch (error) {
      this.logger.error({ err: error }, 'Failed to find canary candidates');
    }

    return candidates;
  }

  /**
   * Get current state for a provider (from in-memory cache or DB).
   */
  async getState(providerId: string): Promise<CircuitBreakerState | null> {
    const cached = this.states.get(providerId);
    if (cached) {
      return cached;
    }

    try {
      const provider = await providerRepo.findById(providerId);
      if (!provider) {
        return null;
      }

      const state = this.loadStateFromDb(provider);
      this.states.set(providerId, state);
      return state;
    } catch (error) {
      this.logger.error({ err: error, providerId }, 'Failed to load provider state from DB');
      return null;
    }
  }

  /**
   * Get the health summary for a category.
   */
  async getCategorySummary(categorySlug: string): Promise<{
    healthyCount: number;
    degradedCount: number;
    deadCount: number;
    totalCount: number;
  }> {
    try {
      const summary = await categoryRepo.getCategoryHealthSummary(categorySlug);
      return {
        healthyCount: summary.healthyProviders,
        degradedCount: summary.degradedProviders,
        deadCount: summary.deadProviders,
        totalCount: summary.totalProviders,
      };
    } catch (error) {
      this.logger.error(
        { err: error, categorySlug },
        'Failed to get category health summary',
      );
      return {
        healthyCount: 0,
        degradedCount: 0,
        deadCount: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get recent circuit breaker events (for monitoring).
   */
  getRecentEvents(limit = 50): CircuitBreakerEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Manually reset a provider to HEALTHY.
   */
  async resetProvider(providerId: string): Promise<void> {
    try {
      const now = new Date();
      const state = (await this.getState(providerId)) ?? this.loadStateFromDb({
        id: providerId,
        name: 'unknown',
        categorySlug: 'unknown',
        healthStatus: ProviderHealthStatus.HEALTHY,
        failureCount: 0,
        cooldownUntil: null,
        lastProbedAt: null,
      });

      const previousStatus = state.healthStatus;
      state.healthStatus = ProviderHealthStatus.HEALTHY;
      state.failureCount = 0;
      state.consecutiveFailureCount = 0;
      state.cooldownUntil = null;
      state.lastFailureAt = null;
      state.lastSuccessAt = now;
      state.isCanaryProbe = false;
      state.lastProbedAt = now;
      state.stateChangedAt = now;

      if (previousStatus !== state.healthStatus) {
        this.emitEvent({
          providerId: state.providerId,
          providerName: state.providerName,
          categorySlug: state.categorySlug,
          fromStatus: previousStatus,
          toStatus: state.healthStatus,
          reason: 'MANUAL_RESET',
          failureCount: state.failureCount,
        });
      }

      this.states.set(providerId, state);
      await this.persistState(state);
    } catch (error) {
      this.logger.error({ err: error, providerId }, 'Failed to reset provider');
    }
  }

  // Private helpers
  private emitEvent(event: Omit<CircuitBreakerEvent, 'timestamp'>): void {
    const timestamp = new Date();
    const eventId = uuidv4();
    const fullEvent: CircuitBreakerEvent = { ...event, timestamp };
    this.events.push(fullEvent);
    if (this.events.length > 1000) {
      this.events.shift();
    }
    this.logger.info(
      {
        eventId,
        providerId: fullEvent.providerId,
        providerName: fullEvent.providerName,
        fromStatus: fullEvent.fromStatus,
        toStatus: fullEvent.toStatus,
        reason: fullEvent.reason,
        failureCount: fullEvent.failureCount,
        categorySlug: fullEvent.categorySlug,
      },
      'Circuit breaker transition',
    );
  }

  private loadStateFromDb(provider: any): CircuitBreakerState {
    const now = new Date();
    return {
      providerId: provider?.id ?? '',
      providerName: provider?.name ?? provider?.providerName ?? 'unknown',
      categorySlug: provider?.category?.slug ?? provider?.categorySlug ?? 'unknown',
      healthStatus: provider?.healthStatus ?? ProviderHealthStatus.HEALTHY,
      failureCount: provider?.failureCount ?? 0,
      consecutiveFailureCount: provider?.failureCount ?? 0,
      lastFailureAt: null,
      lastSuccessAt: null,
      cooldownUntil: provider?.cooldownUntil ?? null,
      lastProbedAt: provider?.lastProbedAt ?? null,
      isCanaryProbe: false,
      stateChangedAt: provider?.updatedAt ?? now,
    };
  }

  private async persistState(state: CircuitBreakerState): Promise<void> {
    try {
      await providerRepo.updateHealthStatus(
        state.providerId,
        state.healthStatus,
        state.failureCount,
        state.cooldownUntil,
      );
      this.logger.debug(
        {
          providerId: state.providerId,
          status: state.healthStatus,
          failureCount: state.failureCount,
          cooldownUntil: state.cooldownUntil?.toISOString() ?? null,
        },
        'Persisted circuit breaker state',
      );
    } catch (error) {
      this.logger.error(
        { err: error, providerId: state.providerId },
        'Failed to persist circuit breaker state',
      );
    }
  }
}
