import type { FastifyInstance } from 'fastify';

/**
 * Echo route for adapters that handle logic locally.
 * Returns query params and body so the adapter's transformResponse
 * can extract the original request parameters.
 */
export async function echoRoute(
  fastify: FastifyInstance,
  _opts: unknown,
): Promise<void> {
  fastify.all('/v1/echo', async (request) => {
    return {
      success: true,
      params: request.query as Record<string, string>,
      body: request.body,
    };
  });

  fastify.all('/v1/route', async (request) => {
    return {
      success: true,
      params: request.query as Record<string, string>,
      body: request.body,
    };
  });
}
