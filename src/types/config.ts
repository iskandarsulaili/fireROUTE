/** Server configuration. */
export interface ServerConfig {
  /** Port the HTTP server listens on. */
  port: number;
  /** Hostname or IP address to bind. */
  host: string;
  /** Log verbosity level. */
  logLevel: string;
  /** Node environment (e.g., production, development). */
  nodeEnv: string;
  /** Database connection URL. */
  databaseUrl: string;
}

/** Logging configuration. */
export interface LoggerConfig {
  /** Log level threshold. */
  level: string;
  /** Whether to enable pretty-printed logs. */
  prettyPrint: boolean;
  /** Whether to enable pino-pretty transport. */
  prettyTransport?: boolean;
  /** List of fields to redact from logs. */
  redact: string[];
}

/** Rate limiting configuration. */
export interface RateLimitConfig {
  /** Maximum number of requests per window. */
  max: number;
  /** Time window for rate limiting (e.g., "1m"). */
  timeWindow: string;
}

/** Upstream HTTP client configuration. */
export interface HttpClientConfig {
  /** Default timeout for upstream requests in milliseconds. */
  defaultTimeout: number;
  /** Maximum retry attempts for transient failures. */
  maxRetries: number;
  /** Delay between retries in milliseconds. */
  retryDelay: number;
  /** Maximum concurrent connections to upstream providers. */
  maxConnections: number;
}
