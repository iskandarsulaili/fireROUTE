import { AuthType } from './category.js';

/**
 * Category Adapter Interface
 * Each provider category implements this adapter to normalize
 * provider-specific request/response formats into a standardized shape.
 */
export interface CategoryAdapter {
  /** The category slug this adapter handles. */
  readonly categorySlug: string;

  /**
   * Normalize a request for a specific provider within this category.
   * Translates the standardized ExecuteRequest into the provider's expected format.
   */
  normalizeRequest(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Promise<NormalizedUpstreamRequest>;

  /**
   * Transform a provider-specific response into the standardized output.
   */
  transformResponse(
    provider: ProviderAdapterConfig,
    upstreamResponse: UpstreamResponse,
  ): Promise<NormalizedResponseData>;

  /**
   * Extract error details from a provider-specific error response.
   * Returns null if the response is not an error.
   */
  extractError(
    provider: ProviderAdapterConfig,
    upstreamResponse: UpstreamResponse,
  ): ProviderError | null;

  /**
   * Get the MCP tool definition for this category.
   */
  getMCPToolDefinition(): MCPToolDefinition;
}

/** Provider-specific adapter configuration. */
export interface ProviderAdapterConfig {
  /** Unique provider identifier. */
  id: string;
  /** Provider display name. */
  name: string;
  /** Base URL for upstream requests. */
  baseUrl: string;
  /** Authentication mechanism used by this provider. */
  authType: AuthType;
  /** Provider-specific authentication configuration. */
  authConfig: Record<string, unknown> | null;
  /** Provider metadata for adapter logic and extensions. */
  metadata: Record<string, unknown> | null;
  /** Maximum requests per minute allowed for this provider. */
  rateLimitPerMinute: number;
  /** Default timeout for upstream requests in milliseconds. */
  timeoutMs: number;
}

/** Internal execute request after parsing. */
export interface InternalExecuteRequest {
  /** Category slug resolved from the request. */
  category: string;
  /** Provider-specific endpoint path. */
  path: string;
  /** HTTP method to use for the upstream call. */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Normalized query parameters. */
  params: Record<string, string>;
  /** Normalized header map. */
  headers: Record<string, string>;
  /** Parsed request body. */
  body: unknown;
  /** Timeout for this request in milliseconds. */
  timeout: number;
}

/** Normalized upstream request ready to dispatch. */
export interface NormalizedUpstreamRequest {
  /** Fully qualified upstream URL. */
  url: string;
  /** HTTP method for the upstream request. */
  method: string;
  /** Headers to send upstream. */
  headers: Record<string, string>;
  /** Serialized request body, if present. */
  body?: string | undefined;
  /** Upstream timeout in milliseconds. */
  timeout: number;
}

/** Raw upstream HTTP response. */
export interface UpstreamResponse {
  /** HTTP status code from the provider. */
  statusCode: number;
  /** Response headers from the provider. */
  headers: Record<string, string>;
  /** Response body payload from the provider. */
  body: unknown;
  /** Measured latency for the upstream call. */
  latencyMs: number;
}

/** Normalized response data from adapter transformation. */
export interface NormalizedResponseData {
  /** Provider-specific response data, normalized to category standard. */
  data: unknown;
  /** Provider name that served this response. */
  providerName: string;
  /** Any warnings from the provider or adapter. */
  warnings?: string[];
}

/** Error extracted from provider response. */
export interface ProviderError {
  /** Stable provider error code. */
  code: string;
  /** Human-readable error message. */
  message: string;
  /** Whether this error is safe to retry. */
  retryable: boolean;
  /** HTTP status code from the provider error response. */
  statusCode: number;
  /** Optional retry-after duration in milliseconds. */
  retryAfterMs?: number;
}

/** MCP Tool definition for a category. */
export interface MCPToolDefinition {
  /** Tool name exposed to MCP clients. */
  name: string;
  /** Human-readable description of the tool. */
  description: string;
  /** Input schema for tool invocation. */
  inputSchema: {
    /** JSON schema type for input payload. */
    type: 'object';
    /** Properties accepted by the tool. */
    properties: Record<string, unknown>;
    /** Required property names. */
    required: string[];
  };
  /** Output schema for tool results. */
  outputSchema: {
    /** JSON schema type for output payload. */
    type: 'object';
    /** Properties returned by the tool. */
    properties: Record<string, unknown>;
  };
}
