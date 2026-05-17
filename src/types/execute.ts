/** Request body for POST /v1/execute. */
export interface ExecuteRequest {
  /** The category slug (e.g., "weather", "finance"). */
  category: string;
  /** Provider-specific endpoint path (e.g., "/current.json"). */
  path: string;
  /** HTTP method for the upstream request. */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Query parameters to pass to the upstream API. */
  params?: Record<string, string | number | boolean | undefined>;
  /** Request headers to pass to the upstream API. */
  headers?: Record<string, string>;
  /** Request body (for POST/PUT/PATCH). */
  body?: unknown;
  /** Force a specific provider (skip normal category fallback). */
  forceProvider?: string;
  /** Timeout in ms for this specific request. */
  timeout?: number;
}

/** Standardized output envelope for all API responses. */
export interface RouterMetadata {
  /** Unique identifier for the request. */
  requestId: string;
  /** Category slug resolved for this request. */
  category: string;
  /** Provider that handled the initial attempt. */
  primaryProvider: string;
  /** Provider used as fallback, if any. */
  fallbackProvider: string | null;
  /** Total request latency across routing and upstream calls. */
  totalLatencyMs: number;
  /** Upstream provider latency if available. */
  providerLatencyMs: number | null;
  /** HTTP status code returned to the client. */
  statusCode: number;
  /** Circuit breaker status at decision time. */
  circuitBreakerStatus: string | null;
  /** Whether the response was served from cache. */
  cached: boolean;
  /** ISO timestamp when the response was generated. */
  timestamp: string;
}

/** Standardized successful response envelope. */
export interface ExecuteResponse<T = unknown> {
  /** Indicates a successful execution. */
  success: boolean;
  /** Normalized response payload. */
  data: T;
  /** Routing metadata for observability and debugging. */
  router_metadata: RouterMetadata;
}

/** Standardized error response envelope. */
export interface ExecuteErrorResponse {
  /** Indicates a failed execution. */
  success: false;
  /** Error information for the failure. */
  error: {
    /** Stable error code for programmatic handling. */
    code: string;
    /** Human-readable error message. */
    message: string;
    /** Optional structured error details from the provider or router. */
    details?: unknown;
  };
  /** Routing metadata for observability and debugging. */
  router_metadata: RouterMetadata;
}

/** Unified API response type. */
export type ExecuteResult<T = unknown> = ExecuteResponse<T> | ExecuteErrorResponse;
