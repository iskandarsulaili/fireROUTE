import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ExecuteRequest, ExecuteResult } from '../types/execute.js';
import type { InternalExecuteRequest } from '../types/adapter.js';
import { FallbackExecutor } from '../services/fallback-executor.js';
import { CircuitBreakerService } from '../services/circuit-breaker.js';
import { categoryRepo } from '../lib/db/category-repo.js';
import { adapterRegistry } from '../adapters/registry.js';
import { logger } from '../lib/logger.js';

/**
 * Ajv schema for /v1/execute request body validation.
 * Uses Fastify's built-in schema compiler for minimal overhead (PRD §3.1).
 */
const executeSchema = {
  body: {
    type: 'object',
    required: ['category', 'path'],
    properties: {
      category: { type: 'string', minLength: 1 },
      path: { type: 'string', minLength: 1 },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        default: 'GET',
      },
      params: { type: 'object', additionalProperties: { type: 'string' } },
      headers: { type: 'object', additionalProperties: { type: 'string' } },
      body: { type: ['object', 'string', 'number', 'boolean', 'array', 'null'] },
      forceProvider: { type: 'string' },
      timeout: { type: 'integer', minimum: 100, maximum: 30000 },
    },
    additionalProperties: false,
  },
};

/**
 * Registers the /v1/execute route.
 */
export async function v1ExecuteRoutes(
  fastify: FastifyInstance,
  _opts: unknown,
): Promise<void> {
  const circuitBreaker = new CircuitBreakerService(logger as any);
  const fallbackExecutor = new FallbackExecutor(circuitBreaker, logger as any);

  /**
   * POST /v1/execute
   * Core unified API surface. Accepts a category slug and request details,
   * routes to the appropriate provider within the category with automatic fallback.
   */
  fastify.post(
    '/v1/execute',
    { schema: executeSchema },
    async (
      request: FastifyRequest<{ Body: ExecuteRequest }>,
      reply: FastifyReply,
    ) => {
      const startTime = Date.now();

      try {
        const body = request.body;

        // Validate category exists
        const category = await categoryRepo.findBySlug(body.category);
        if (!category) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'INVALID_CATEGORY',
              message: `Category '${body.category}' is not recognized. Available categories: ${(
                await categoryRepo.findAll()
              )
                .map((c) => c.slug)
                .join(', ')}`,
            },
            router_metadata: {
              requestId: '',
              category: body.category,
              primaryProvider: 'none',
              fallbackProvider: null,
              totalLatencyMs: Date.now() - startTime,
              providerLatencyMs: null,
              statusCode: 400,
              circuitBreakerStatus: null,
              cached: false,
              timestamp: new Date().toISOString(),
            },
          } as ExecuteResult);
        }

        // Check adapter exists for this category
        if (!adapterRegistry.has(body.category)) {
          return reply.status(400).send({
            success: false,
            error: {
              code: 'UNSUPPORTED_CATEGORY',
              message: `Category '${body.category}' exists but has no adapter implementation yet`,
            },
            router_metadata: {
              requestId: '',
              category: body.category,
              primaryProvider: 'none',
              fallbackProvider: null,
              totalLatencyMs: Date.now() - startTime,
              providerLatencyMs: null,
              statusCode: 400,
              circuitBreakerStatus: null,
              cached: false,
              timestamp: new Date().toISOString(),
            },
          } as ExecuteResult);
        }

        // Convert to internal request
        const internalRequest: InternalExecuteRequest = {
          category: body.category,
          path: body.path,
          method: body.method ?? 'GET',
          params: Object.fromEntries(
            Object.entries(body.params ?? {}).map(([k, v]) => [k, String(v)]),
          ),
          headers: body.headers ?? {},
          body: body.body ?? null,
          timeout: body.timeout ?? 15000,
        };

        // Execute with fallback
        const result = await fallbackExecutor.execute(
          body.category,
          internalRequest,
          body.forceProvider,
        );

        // Set appropriate status code
        const statusCode = result.success
          ? 200
          : (result as any).error?.code === 'ALL_PROVIDERS_FAILED'
            ? 503
            : (result as any).error?.code === 'NO_AVAILABLE_PROVIDERS'
              ? 503
              : (result as any).router_metadata?.statusCode ?? 500;

        return reply.status(statusCode).send(result);
      } catch (err) {
        logger.error(
          { error: (err as Error).message, stack: (err as Error).stack },
          'Unhandled error in /v1/execute',
        );
        return reply.status(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
          },
          router_metadata: {
            requestId: '',
            category: request.body?.category ?? 'unknown',
            primaryProvider: 'none',
            fallbackProvider: null,
            totalLatencyMs: Date.now() - startTime,
            providerLatencyMs: null,
            statusCode: 500,
            circuitBreakerStatus: null,
            cached: false,
            timestamp: new Date().toISOString(),
          },
        } as ExecuteResult);
      }
    },
  );
}
