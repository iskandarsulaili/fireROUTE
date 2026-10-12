import { buildApp } from './app.js';
import { serverConfig } from './config/index.js';
import prisma from './lib/db/prisma.js';
import { logger } from './lib/logger.js';
import { circuitBreaker, fallbackExecutor } from './services/circuit-breaker.js';
import { categoryRepo } from './lib/db/category-repo.js';
import { adapterRegistry } from './adapters/registry.js';

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

  // 2b. Give every category in the database a normalizer.
  //
  // 40 of the 52 seeded categories had no tailored adapter, so a call to one of them
  // answered UNSUPPORTED_CATEGORY even when the providers behind it were live and
  // keyless (animals: 12 providers, catfact.ninja and thecatapi.com both 200). The
  // generic adapter reports what the provider actually returned and keeps the full
  // body under `raw`. Registering from the database rather than a hardcoded list
  // means a category added later is covered on the next boot.
  try {
    const categories = await prisma.providerCategory.findMany({ select: { slug: true } });
    let added = 0;
    for (const { slug } of categories) {
      if (adapterRegistry.registerGeneric(slug)) added += 1;
    }
    logger.info(
      { categories: categories.length, genericAdapters: added },
      'Adapter coverage: tailored adapters plus the generic normalizer for the rest',
    );
  } catch (err) {
    logger.warn({ error: (err as Error).message }, 'Failed to register generic adapters (non-fatal)');
  }

  // 3. Initialize circuit breaker (shared instance — see services/circuit-breaker.ts)
  try {
    await circuitBreaker.initialize();
    // Give the breaker the function that actually performs a probe, so a
    // DEGRADED provider can be brought back once it recovers. Without this the
    // canary timer only logged candidates and providers stayed open forever.
    circuitBreaker.setCanaryProbeRunner((providerId, providerName, categorySlug) =>
      fallbackExecutor.executeCanary(providerId, providerName, categorySlug),
    );
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
