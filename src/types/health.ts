/** Health check response. */
export interface HealthCheckResponse {
  /** Overall system health status. */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Application version string. */
  version: string;
  /** Process uptime in seconds. */
  uptime: number;
  /** ISO timestamp for the health check response. */
  timestamp: string;
  /** Database connectivity and latency metrics. */
  database: {
    /** Whether the database connection is established. */
    connected: boolean;
    /** Round-trip latency to the database in milliseconds. */
    latencyMs: number;
  };
  /** Per-category health summaries. */
  categories: Record<
    string,
    {
      /** Health status of the category. */
      status: string;
      /** Count of providers marked healthy, including those that have never been probed. */
      healthyProviders: number;
      /** Count of providers MEASURED healthy (a probe recorded a result) — the readiness number. */
      probedHealthyProviders: number;
      /** Count of providers still carrying the HEALTHY column default, i.e. never probed. */
      unprobedProviders: number;
      /** Total providers registered for the category. */
      totalProviders: number;
    }
  >;
}
