import prisma from '../../src/lib/db/prisma.js';

/**
 * Seed test database with categories and providers.
 */
export async function seedTestData(mockServerPort: number) {
  const weatherCategory = await prisma.providerCategory.upsert({
    where: { slug: 'weather' },
    update: {},
    create: {
      slug: 'weather',
      name: 'Weather Data',
      description: 'Weather and forecast data providers',
    },
  });

  await prisma.providerConnection.deleteMany({ where: { categoryId: weatherCategory.id } });

  const primaryProvider = await prisma.providerConnection.upsert({
    where: { slug: 'weather-api-test' },
    update: {},
    create: {
      categoryId: weatherCategory.id,
      name: 'WeatherAPI Test',
      slug: 'weather-api-test',
      baseUrl: `http://127.0.0.1:${mockServerPort}`,
      authType: 'api_key',
      authConfig: JSON.stringify({
        keyName: 'api_key',
        headerName: 'X-API-Key',
        apiKey: 'test-key-123',
        in: 'header',
      }),
      healthStatus: 'HEALTHY',
      failureCount: 0,
      priority: 0,
      isActive: true,
      rateLimitPerMinute: 60,
      timeoutMs: 3000,
      metadata: JSON.stringify({ provider: 'weatherapi' }),
    },
  });

  const secondaryProvider = await prisma.providerConnection.upsert({
    where: { slug: 'openweather-test' },
    update: {},
    create: {
      categoryId: weatherCategory.id,
      name: 'OpenWeatherMap Test',
      slug: 'openweather-test',
      baseUrl: `http://127.0.0.1:${mockServerPort}`,
      authType: 'api_key',
      authConfig: JSON.stringify({
        keyName: 'appid',
        headerName: 'X-API-Key',
        apiKey: 'test-key-456',
        in: 'query',
      }),
      healthStatus: 'HEALTHY',
      failureCount: 0,
      priority: 1,
      isActive: true,
      rateLimitPerMinute: 30,
      timeoutMs: 3000,
      metadata: JSON.stringify({ provider: 'openweathermap' }),
    },
  });

  await prisma.categoryFallbackConfig.upsert({
    where: { categoryId: weatherCategory.id },
    update: {},
    create: {
      categoryId: weatherCategory.id,
      strategy: 'priority',
      maxRetries: 3,
      retryDelayMs: 100,
      timeoutMs: 3000,
      circuitBreakerThreshold: 3,
      cooldownMinutes: 1,
      canaryIntervalMs: 60000,
    },
  });

  return { weatherCategory, primaryProvider, secondaryProvider };
}

/**
 * Clean all test data.
 */
export async function cleanTestData() {
  await prisma.routerMetadata.deleteMany();
  await prisma.categoryFallbackConfig.deleteMany();
  await prisma.providerConnection.deleteMany();
  await prisma.providerCategory.deleteMany();
}
