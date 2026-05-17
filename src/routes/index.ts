import type { FastifyInstance } from 'fastify';
import { v1ExecuteRoutes } from './v1-execute.js';
import { healthRoutes } from './health.js';
import { categoryRoutes } from './categories.js';

/**
 * Register all HTTP routes for the server.
 */
export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(v1ExecuteRoutes);
  await fastify.register(healthRoutes);
  await fastify.register(categoryRoutes);
}
