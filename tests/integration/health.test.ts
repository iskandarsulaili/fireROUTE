import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.js';

describe('GET /health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 with health status', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('uptime');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('database');
    expect(body).toHaveProperty('categories');
  });

  it('should indicate database connectivity', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(response.payload);

    expect(body.database.connected).toBe(true);
    expect(body.database.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should have version string', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(response.payload);

    expect(body.version).toBeTruthy();
    expect(body.version).toMatch(/\d+\.\d+\.\d+/);
  });

  it('should include categories object', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(response.payload);

    expect(body.categories).toBeTypeOf('object');
    expect(Array.isArray(body.categories)).toBe(false);
  });
});
