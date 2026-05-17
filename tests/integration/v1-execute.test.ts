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

describe('POST /v1/execute - Valid Requests', () => {
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

  it('should return 200 for a valid weather category request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: {
        category: 'weather',
        path: '/current.json',
        params: { q: 'London' },
      },
    });

    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.router_metadata.category).toBe('weather');
    expect(body.router_metadata.primaryProvider).toBe('WeatherAPI Test');
    expect(body.router_metadata.statusCode).toBe(200);
    expect(body.router_metadata.circuitBreakerStatus).toBe('HEALTHY');
    expect(body.router_metadata.requestId).toBeTruthy();
    expect(body.router_metadata.timestamp).toBeTruthy();
  });

  it('should return normalized weather data structure', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: {
        category: 'weather',
        path: '/current.json',
        params: { q: 'London' },
      },
    });

    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body.data).toHaveProperty('temperature');
    expect(body.data).toHaveProperty('condition');
    expect(body.data).toHaveProperty('humidity');
    expect(body.data).toHaveProperty('windSpeed');
    expect(body.data).toHaveProperty('windDirection');
    expect(body.data).toHaveProperty('location');
    expect(body.data).toHaveProperty('provider');
  });

  it('should accept custom headers in the request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: {
        category: 'weather',
        path: '/current.json',
        params: { q: 'London' },
        headers: { 'X-Custom-Header': 'test-value' },
      },
    });

    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
  });
});

describe('POST /v1/execute - Invalid Requests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    ensureWeatherAdapter();
    await cleanTestData();
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await cleanTestData();
  });

  it('should return 400 for an invalid category', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: { category: 'nonexistent-category', path: '/test' },
    });

    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INVALID_CATEGORY');
  });

  it('should return 400 for missing required fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: { category: 'weather' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for empty category string', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: { category: '', path: '/test' },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('POST /v1/execute - 429 Rate Limit Fallback', () => {
  let app: FastifyInstance;
  let mockServer: MockUpstreamServer;

  beforeAll(async () => {
    ensureWeatherAdapter();
    mockServer = new MockUpstreamServer('intermittent_429');
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

  it('should fail over to secondary provider when primary returns 429', async () => {
    const payload = { category: 'weather', path: '/current.json', params: { q: 'London' } };
    const responses = await Promise.all(
      Array.from({ length: 6 }, () =>
        app.inject({ method: 'POST', url: '/v1/execute', payload }),
      ),
    );

    const bodies = responses.map((response) => JSON.parse(response.payload));

    expect(responses.some((response) => response.statusCode === 200)).toBe(true);
    expect(responses.every((response) => response.statusCode !== 429)).toBe(true);
    for (const body of bodies) {
      expect(body.router_metadata.requestId).toBeTruthy();
    }
  });
});

describe('POST /v1/execute - All Providers Fail', () => {
  let app: FastifyInstance;
  let mockServer: MockUpstreamServer;

  beforeAll(async () => {
    ensureWeatherAdapter();
    mockServer = new MockUpstreamServer('always_fail_500');
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

  it('should return 503 when all providers fail', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/execute',
      payload: { category: 'weather', path: '/current.json', params: { q: 'London' } },
    });

    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(503);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('CATEGORY_OUTAGE');
    expect(body.router_metadata.statusCode).toBe(503);
  });
});
