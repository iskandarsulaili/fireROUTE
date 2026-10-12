import type {
  CategoryAdapter,
  ProviderAdapterConfig,
  InternalExecuteRequest,
  NormalizedUpstreamRequest,
  UpstreamResponse,
  NormalizedResponseData,
  ProviderError,
  MCPToolDefinition,
} from '../types/adapter.js';
import { AuthType } from '../types/category.js';

/**
 * Abstract base adapter providing common functionality for all category adapters.
 * Subclasses override category-specific normalization/transformation.
 */
export abstract class BaseAdapter implements CategoryAdapter {
  /** The category slug this adapter handles. */
  abstract readonly categorySlug: string;

  protected constructor(protected readonly logger: Logger) {}

  /**
   * Normalize a request for a specific provider within this category.
   * Translates the standardized ExecuteRequest into the provider's expected format.
   */
  async normalizeRequest(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Promise<NormalizedUpstreamRequest> {
    const url = this.buildUrl(provider, request);
    const headers = this.buildHeaders(provider, request);
    const body = this.buildBody(request);

    return {
      url,
      method: request.method,
      headers,
      body,
      timeout: request.timeout || provider.timeoutMs,
    };
  }

  /**
   * Transform a provider-specific response into the standardized output.
   * Subclasses MUST override to provide category-specific normalization.
   */
  abstract transformResponse(
    provider: ProviderAdapterConfig,
    upstreamResponse: UpstreamResponse,
  ): Promise<NormalizedResponseData>;

  /**
   * Extract error details from a provider-specific error response.
   * Returns null if the response is not an error.
   */
  extractError(
    _provider: ProviderAdapterConfig,
    upstreamResponse: UpstreamResponse,
  ): ProviderError | null {
    if (upstreamResponse.statusCode < 400) return null;

    const retryAfter = this.parseRetryAfter(upstreamResponse.headers['retry-after']);
    const message = this.extractErrorMessage(upstreamResponse.body);

    return {
      code: `HTTP_${upstreamResponse.statusCode}`,
      message,
      retryable: upstreamResponse.statusCode === 429 || upstreamResponse.statusCode >= 500,
      statusCode: upstreamResponse.statusCode,
      retryAfterMs: retryAfter,
    };
  }

  /** Get the MCP tool definition for this category. */
  abstract getMCPToolDefinition(): MCPToolDefinition;

  // ---- Protected helpers ----

  protected buildUrl(provider: ProviderAdapterConfig, request: InternalExecuteRequest): string {
    // Provider-declared request translation lives HERE, in the base class, because
    // every adapter needs it and the first two that needed it each grew their own
    // copy while the rest silently sent the canonical path:
    //
    //   * metadata.path          — the provider's real endpoint (7Timer answers on
    //                              /bin/api.pl, the Art Institute on
    //                              /api/v1/artworks/<id>, never on /v1/forecast).
    //   * metadata.queryDefaults — required query parameters (Open-Meteo returns
    //                              every field null without current=…).
    //   * metadata.paramAliases  — the provider's spelling of a canonical param.
    //
    // Measured 2026-10-12: art-and-design had two providers the adapter already
    // understood and still could not answer at all, because this method ignored the
    // provider's own endpoint. Applying the aliases is idempotent (a provider key
    // has no alias entry of its own), so the existing overrides that already merged
    // these values can keep delegating here safely.
    const meta = (provider.metadata ?? {}) as Record<string, unknown>;
    const metaPath = typeof meta['path'] === 'string' ? (meta['path'] as string) : null;
    const queryDefaults = (meta['queryDefaults'] ?? {}) as Record<string, unknown>;
    const paramAliases = (meta['paramAliases'] ?? {}) as Record<string, string>;
    const declaredParams: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(request.params ?? {})) {
      const mapped = paramAliases[key] ?? key;
      declaredParams[mapped] = value;
    }
    const effectiveParams = { ...queryDefaults, ...declaredParams };
    const effectivePath = metaPath ?? request.path;

    const base = provider.baseUrl.replace(/\/$/, '');
    const path = effectivePath.startsWith('/') ? effectivePath : `/${effectivePath}`;
    let url = `${base}${path}`;

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(effectiveParams)) {
      if (value) params.append(key, String(value));
    }

    if (provider.authType === AuthType.API_KEY && provider.authConfig) {
      const config = provider.authConfig as Record<string, string>;
      const keyValue = config['apiKey'] as string;

      if (config['in'] === 'path' && keyValue) {
        // Inject API key into URL path (e.g. Pirate Weather: /forecast/{apikey}/...)
        const pathKey = (config['pathKey'] as string) || '{apikey}';
        url = url.replace(pathKey, keyValue);
      } else if (config['in'] === 'query' && keyValue) {
        const keyName = (config['keyName'] as string) || 'api_key';
        params.append(keyName, keyValue);
      }
    }

    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return url;
  }

  protected buildHeaders(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'fireROUTE/1.0',
      Accept: 'application/json',
      ...request.headers,
    };

    if (provider.authType === AuthType.API_KEY && provider.authConfig) {
      const config = provider.authConfig as Record<string, string>;
      const keyName = (config['keyName'] as string) || 'api_key';
      const headerName = (config['headerName'] as string) || 'X-API-Key';
      const keyValue = config['apiKey'] as string;

      if (config['in'] !== 'query' && keyValue) {
        headers[headerName || keyName] = keyValue;
      }
    }

    // Handle HEADER auth type (e.g., Authorization: METToken <key>)
    if (provider.authType === AuthType.HEADER && provider.authConfig) {
      const config = provider.authConfig as Record<string, string>;
      const headerName = (config['header_name'] as string) || 'Authorization';
      const headerValue = (config['header_value'] as string);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    }

    if (request.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  protected buildBody(request: InternalExecuteRequest): string | undefined {
    if (!request.body) return undefined;
    if (typeof request.body === 'string') return request.body;
    return JSON.stringify(request.body);
  }

  protected parseRetryAfter(retryAfter?: string): number | undefined {
    if (!retryAfter) return undefined;
    const seconds = parseInt(retryAfter, 10);
    if (!Number.isNaN(seconds)) return seconds * 1000;
    const date = new Date(retryAfter);
    if (!Number.isNaN(date.getTime())) return Math.max(0, date.getTime() - Date.now());
    return undefined;
  }

  protected extractErrorMessage(body: unknown): string {
    if (typeof body === 'string') {
      return body;
    }

    if (!body || typeof body !== 'object') {
      return 'Provider returned an error response';
    }

    const payload = body as Record<string, unknown>;
    const directMessage = payload.message || payload.error || payload.error_message || payload.detail;
    if (typeof directMessage === 'string') {
      return directMessage;
    }

    const nestedError = payload.error;
    if (nestedError && typeof nestedError === 'object') {
      const nestedMessage = (nestedError as Record<string, unknown>).message;
      if (typeof nestedMessage === 'string') {
        return nestedMessage;
      }
    }

    return 'Provider returned an error response';
  }
}

export interface Logger {
  info(obj: any, msg?: string): void;
  warn(obj: any, msg?: string): void;
  error(obj: any, msg?: string): void;
  debug(obj: any, msg?: string): void;
}
