import { buildApp } from './app.js';
import { serverConfig } from './config/index.js';
import prisma from './lib/db/prisma.js';
import { logger } from './lib/logger.js';
import { CircuitBreakerService } from './services/circuit-breaker.js';
import { categoryRepo } from './lib/db/category-repo.js';

/**
 * Main server entrypoint.
 */
async function main() {
  logger.info('Starting fireROUTE server...');

  // 1. Initialize database connection
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (err) {
    logger.fatal({ error: (err as Error).message }, 'Failed to connect to database');
    process.exit(1);
  }

  // 2. Seed categories from doc/api-references directory
  try {
    const seeded = await categoryRepo.seedFromDirectories();
    if (seeded > 0) {
      logger.info({ categoriesCreated: seeded }, 'Categories seeded from documentation');
    } else {
      logger.info('Categories already seeded');
    }
  } catch (err) {
    logger.warn({ error: (err as Error).message }, 'Failed to seed categories (non-fatal)');
  }

  // 3. Initialize circuit breaker
  const circuitBreaker = new CircuitBreakerService(logger as any);
  try {
    await circuitBreaker.initialize();
    circuitBreaker.startCanaryProbes();
    logger.info('Circuit breaker initialized');
  } catch (err) {
    logger.warn({ error: (err as Error).message }, 'Failed to initialize circuit breaker (non-fatal)');
  }

  // 4. Build and start Fastify server
  try {
    const app = await buildApp();

    await app.listen({
      port: serverConfig.port,
      host: serverConfig.host,
    });

    logger.info(
      { port: serverConfig.port, host: serverConfig.host },
      'fireROUTE server is running',
    );
  } catch (err) {
    logger.fatal({ error: (err as Error).message }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
