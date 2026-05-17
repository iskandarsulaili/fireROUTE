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
      /** Count of healthy providers in the category. */
      healthyProviders: number;
      /** Total providers registered for the category. */
      totalProviders: number;
    }
  >;
}
