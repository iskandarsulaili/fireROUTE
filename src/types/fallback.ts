import { FallbackStrategy } from './category.js';
import { CircuitBreakerDecision } from './circuit-breaker.js';

/** A step in the fallback chain. */
export interface FallbackStep {
  /** Provider identifier for this step. */
  providerId: string;
  /** Provider name for logging and routing. */
  providerName: string;
  /** Priority order for selection (lower is higher priority). */
  priority: number;
  /** Base URL for the provider. */
  baseUrl: string;
  /** Whether the provider is currently available. */
  isAvailable: boolean;
}

/** Result of a fallback execution. */
export interface FallbackResult {
  /** Indicates whether a provider successfully served the request. */
  success: boolean;
  /** Provider identifier that returned the response. */
  providerId: string;
  /** Provider name that returned the response. */
  providerName: string;
  /** Normalized response data from the provider. */
  data: unknown;
  /** Upstream latency in milliseconds for the successful attempt. */
  latencyMs: number;
  /** HTTP status code returned by the provider. */
  statusCode: number;
  /** Ordered list of providers attempted. */
  attemptedProviders: string[];
  /** Circuit breaker decisions made during fallback attempts. */
  circuitBreakerDecisions: CircuitBreakerDecision[];
}

/** Fallback chain resolution. */
export interface FallbackChain {
  /** Category slug for this fallback chain. */
  categorySlug: string;
  /** Strategy used to select providers. */
  strategy: FallbackStrategy;
  /** Maximum number of retries in the chain. */
  maxRetries: number;
  /** Delay between retries in milliseconds. */
  retryDelayMs: number;
  /** Overall timeout budget for the fallback chain. */
  timeoutMs: number;
  /** Ordered list of providers in the chain. */
  providers: FallbackStep[];
}

/** Category-wide health summary. */
export interface CategoryHealthSummary {
  /** Category slug for the summary. */
  categorySlug: string;
  /** Total number of providers in the category. */
  totalProviders: number;
  /** Number of healthy providers. */
  healthyProviders: number;
  /** Number of degraded providers. */
  degradedProviders: number;
  /** Number of dead providers. */
  deadProviders: number;
  /** Whether any provider is currently available. */
  hasAvailableProvider: boolean;
}
