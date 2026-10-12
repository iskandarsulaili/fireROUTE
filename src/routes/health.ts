import type { FastifyInstance } from 'fastify';
import type { HealthCheckResponse } from '../types/health.js';
import prisma from '../lib/db/prisma.js';
import { categoryRepo } from '../lib/db/category-repo.js';
import pkg from '../../package.json' with { type: 'json' };

/**
 * Registers /health endpoint.
 */
export async function healthRoutes(
  fastify: FastifyInstance,
  _opts: unknown,
): Promise<void> {
  fastify.get('/health', async (_request, _reply) => {
    // const startTime = Date.now();
    let dbConnected = false;
    let dbLatency = 0;

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
      dbConnected = true;
    } catch {
      dbConnected = false;
      dbLatency = -1;
    }

    // Get category health
    const categories = await categoryRepo.findAll();
    const categoryHealth: Record<
      string,
      {
        status: string;
        healthyProviders: number;
        probedHealthyProviders: number;
        unprobedProviders: number;
        totalProviders: number;
      }
    > = {};

    for (const cat of categories) {
      const summary = await categoryRepo.getCategoryHealthSummary(cat.slug);
      categoryHealth[cat.slug] = {
        // Readiness here means a provider was MEASURED healthy. Without the split, a category whose
        // providers carry the HEALTHY column default reported 'healthy' the moment it was seeded,
        // which is how this endpoint overstated readiness while 1384 of 1504 providers had never been
        // probed.
        status:
          summary.probedHealthyProviders > 0
            ? 'healthy'
            : summary.unprobedProviders > 0
              ? 'unprobed'
              : summary.degradedProviders > 0
                ? 'degraded'
                : 'unhealthy',
        healthyProviders: summary.healthyProviders,
        probedHealthyProviders: summary.probedHealthyProviders,
        unprobedProviders: summary.unprobedProviders,
        totalProviders: summary.totalProviders,
      };
    }

    const overallStatus = dbConnected ? 'healthy' : 'unhealthy';

    const response: HealthCheckResponse = {
      status: overallStatus,
      version: (pkg as { version?: string }).version ?? '0.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        latencyMs: dbLatency,
      },
      categories: categoryHealth,
    };

    return response;
  });
}
