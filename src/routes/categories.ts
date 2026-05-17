import type { FastifyInstance } from 'fastify';
import { categoryRepo } from '../lib/db/category-repo.js';
import { adapterRegistry } from '../adapters/registry.js';

/**
 * Registers category listing endpoints.
 */
export async function categoryRoutes(
  fastify: FastifyInstance,
  _opts: unknown,
): Promise<void> {
  fastify.get('/v1/categories', async (_request, _reply) => {
    const categories = await categoryRepo.findAll();

    return {
      success: true,
      data: categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        hasAdapter: adapterRegistry.has(c.slug),
        mcpToolDefinition: adapterRegistry.has(c.slug)
          ? adapterRegistry.get(c.slug)!.getMCPToolDefinition()
          : null,
      })),
      count: categories.length,
    };
  });

  fastify.get('/v1/categories/:slug', async (request, _reply) => {
    const { slug } = request.params as { slug: string };
    const category = await categoryRepo.findBySlug(slug);

    if (!category) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: `Category '${slug}' not found` },
      };
    }

    const summary = await categoryRepo.getCategoryHealthSummary(slug);

    return {
      success: true,
      data: {
        ...category,
        health: summary,
        hasAdapter: adapterRegistry.has(slug),
        mcpToolDefinition: adapterRegistry.has(slug)
          ? adapterRegistry.get(slug)!.getMCPToolDefinition()
          : null,
      },
    };
  });
}
