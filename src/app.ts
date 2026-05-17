import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import rateLimit from '@fastify/rate-limit';
import { rateLimitConfig, loggerConfig } from './config/index.js';
import { registerRoutes } from './routes/index.js';

/**
 * Build and configure the Fastify application instance.
 */
export async function buildApp() {
  const app = Fastify({
    logger: loggerConfig,
    ajv: {
      customOptions: {
        coerceTypes: true,
        removeAdditional: true, // Fastify's schema compiler strips unknown fields (PRD §3.1)
      },
    },
    // 3000ms default connection timeout (PRD §3.1)
    requestTimeout: 3000,
    bodyLimit: 1_048_576, // 1MB max body
  });

  // Register plugins
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  await app.register(sensible);

  await app.register(rateLimit, {
    max: rateLimitConfig.max,
    timeWindow: rateLimitConfig.timeWindow,
    keyGenerator: (request) => request.ip,
  });

  // Register routes
  await registerRoutes(app);

  return app;
}
