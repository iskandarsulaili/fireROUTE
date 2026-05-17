/** Slug for every provider category, matching doc/api-references/ directories. */
export type ProviderCategorySlug = string; // e.g., "weather", "finance", "music"

/** Health status of a provider connection within a category. */
export enum ProviderHealthStatus {
  /** Provider is healthy and fully available. */
  HEALTHY = 'HEALTHY',
  /** Provider is experiencing issues but may still serve traffic. */
  DEGRADED = 'DEGRADED',
  /** Provider is unavailable and should not receive traffic. */
  DEAD = 'DEAD',
}

/** Category-aware routing strategy. */
export enum FallbackStrategy {
  /** Use explicit priority order when selecting providers. */
  PRIORITY = 'priority',
  /** Rotate providers in a round-robin fashion. */
  ROUND_ROBIN = 'round_robin',
}

/** Auth type supported by a provider. */
export enum AuthType {
  /** Static API key authentication. */
  API_KEY = 'api_key',
  /** OAuth-based authentication (client credentials or similar). */
  OAUTH = 'oauth',
  /** Provider does not require authentication. */
  NO_AUTH = 'no_auth',
}

/** Category configuration. */
export interface ProviderCategory {
  /** Unique identifier for the category. */
  id: string;
  /** Stable slug used in routing and documentation. */
  slug: ProviderCategorySlug;
  /** Human-readable category name. */
  name: string;
  /** Optional category description for UI and docs. */
  description: string | null;
  /** Creation timestamp. */
  createdAt: Date;
  /** Last update timestamp. */
  updatedAt: Date;
}

/** Provider connection with health tracking. */
export interface ProviderConnection {
  /** Unique identifier for the provider connection. */
  id: string;
  /** Foreign key to the provider category. */
  categoryId: string;
  /** Optional hydrated category relation. */
  category?: ProviderCategory;
  /** Human-readable provider name. */
  name: string;
  /** URL-safe slug for internal referencing. */
  slug: string;
  /** Base URL for upstream provider requests. */
  baseUrl: string;
  /** Authentication mechanism used by this provider. */
  authType: AuthType;
  /** Auth configuration payload (keys, secrets, tokens). */
  authConfig: Record<string, unknown> | null;
  /** Current health state used for routing decisions. */
  healthStatus: ProviderHealthStatus;
  /** Count of failures across the current tracking window. */
  failureCount: number;
  /** Timestamp until which this provider is in cooldown. */
  cooldownUntil: Date | null;
  /** Last time health probing occurred. */
  lastProbedAt: Date | null;
  /** Routing priority (lower is higher priority). */
  priority: number;
  /** Whether this provider is actively eligible for traffic. */
  isActive: boolean;
  /** Rate limit ceiling for requests per minute. */
  rateLimitPerMinute: number;
  /** Default upstream timeout for this provider in milliseconds. */
  timeoutMs: number;
  /** Arbitrary metadata for provider-specific features. */
  metadata: Record<string, unknown> | null;
  /** Creation timestamp. */
  createdAt: Date;
  /** Last update timestamp. */
  updatedAt: Date;
}

/** Fallback configuration for a category. */
export interface CategoryFallbackConfig {
  /** Unique identifier for the fallback config. */
  id: string;
  /** Foreign key to the provider category. */
  categoryId: string;
  /** Optional hydrated category relation. */
  category?: ProviderCategory;
  /** Strategy used to select providers during fallback. */
  strategy: FallbackStrategy;
  /** Maximum number of retries before failing the request. */
  maxRetries: number;
  /** Delay between retry attempts in milliseconds. */
  retryDelayMs: number;
  /** Timeout threshold for the whole fallback attempt in milliseconds. */
  timeoutMs: number;
  /** Consecutive failures before the circuit breaker trips. */
  circuitBreakerThreshold: number;
  /** Cooldown period before attempting canary probes. */
  cooldownMinutes: number;
  /** Interval in milliseconds between canary probes. */
  canaryIntervalMs: number;
  /** Creation timestamp. */
  createdAt: Date;
  /** Last update timestamp. */
  updatedAt: Date;
}
