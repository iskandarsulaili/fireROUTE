import { ProviderHealthStatus } from './category.js';

/** Circuit breaker state for a single provider. */
export interface CircuitBreakerState {
  /** Provider identifier associated with this state. */
  providerId: string;
  /** Provider name for logging and reporting. */
  providerName: string;
  /** Category slug for routing context. */
  categorySlug: string;
  /** Current provider health status. */
  healthStatus: ProviderHealthStatus;
  /** Total failure count within tracking window. */
  failureCount: number;
  /** Consecutive failure count since last success. */
  consecutiveFailureCount: number;
  /** Timestamp of the most recent failure. */
  lastFailureAt: Date | null;
  /** Timestamp of the most recent success. */
  lastSuccessAt: Date | null;
  /** Cooldown end timestamp before canary probing. */
  cooldownUntil: Date | null;
  /** Last time a probe check was performed. */
  lastProbedAt: Date | null;
  /** Whether the last probe was a canary attempt. */
  isCanaryProbe: boolean;
  /** Timestamp when the state last changed. */
  stateChangedAt: Date;
}

/** Circuit breaker configuration. */
export interface CircuitBreakerConfig {
  /** Consecutive failures required to trigger DEGRADED. */
  threshold: number;
  /** Cooldown duration in minutes before allowing a probe. */
  cooldownMinutes: number;
  /** Interval in milliseconds between canary probes. */
  canaryIntervalMs: number;
}

/** Result of a circuit breaker decision. */
export interface CircuitBreakerDecision {
  /** Whether traffic is allowed to the provider. */
  allowed: boolean;
  /** State snapshot used to make the decision. */
  state: CircuitBreakerState;
  /** Optional reason for denial or degradation. */
  reason: string | null;
  /** Whether a fallback provider should be attempted. */
  fallbackSuggested: boolean;
}

/** Circuit breaker event for logging. */
export interface CircuitBreakerEvent {
  /** Provider identifier for the event. */
  providerId: string;
  /** Provider name for the event. */
  providerName: string;
  /** Category slug for the provider. */
  categorySlug: string;
  /** Previous health status. */
  fromStatus: ProviderHealthStatus;
  /** New health status after transition. */
  toStatus: ProviderHealthStatus;
  /** Reason for the transition. */
  reason: string;
  /** Timestamp when the transition occurred. */
  timestamp: Date;
  /** Failure count at the time of transition. */
  failureCount: number;
}
