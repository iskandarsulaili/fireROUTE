import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.js';
import { MockUpstreamServer } from '../helpers/mock-server.js';
import { seedTestData, cleanTestData } from '../helpers/test-db.js';
import { adapterRegistry } from '../../src/adapters/registry.js';
import { WeatherAdapter } from '../../src/adapters/weather-adapter.js';

const ensureWeatherAdapter = () => {
  if (!adapterRegistry.has('weather')) {
    adapterRegistry.register(new WeatherAdapter());
  }
};

describe('GET /v1/categories', () => {
  let app: FastifyInstance;
  let mockServer: MockUpstreamServer;

  beforeAll(async () => {
    ensureWeatherAdapter();
    mockServer = new MockUpstreamServer('always_success');
    const port = await mockServer.start();
    await seedTestData(port);
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await mockServer.stop();
    await cleanTestData();
  });

  it('should list all categories', async () => {
    const response = await app.inject({ method: 'GET', url: '/v1/categories' });
    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.count).toBe('number');
    expect(body.data.some((category: { slug: string }) => category.slug === 'weather')).toBe(true);
  });

  it('should include adapter and MCP info in category listing', async () => {
    const response = await app.inject({ method: 'GET', url: '/v1/categories' });
    const body = JSON.parse(response.payload);

    const weather = body.data.find((category: { slug: string }) => category.slug === 'weather');
    expect(weather).toBeTruthy();
    expect(weather.hasAdapter).toBe(true);
    expect(weather.mcpToolDefinition).toBeTruthy();
    expect(weather.mcpToolDefinition).toHaveProperty('name');
    expect(weather.mcpToolDefinition).toHaveProperty('description');
    expect(weather.mcpToolDefinition).toHaveProperty('inputSchema');
    expect(weather.mcpToolDefinition).toHaveProperty('outputSchema');
  });

  it('should return single category by slug', async () => {
    const response = await app.inject({ method: 'GET', url: '/v1/categories/weather' });
    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe('weather');
    expect(body.data.health).toBeTruthy();
    expect(typeof body.data.health.healthyProviders).toBe('number');
    expect(typeof body.data.health.totalProviders).toBe('number');
  });

  it('should return 404 for unknown category', async () => {
    const response = await app.inject({ method: 'GET', url: '/v1/categories/nonexistent' });
    const body = JSON.parse(response.payload);

    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });
});
