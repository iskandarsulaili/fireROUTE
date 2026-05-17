import { describe, it, expect } from 'vitest';
import type { ExecuteResponse, ExecuteErrorResponse, RouterMetadata } from '../../src/types/execute.js';
import type { HealthCheckResponse } from '../../src/types/health.js';
import type { MCPToolDefinition } from '../../src/types/adapter.js';
import { WeatherAdapter } from '../../src/adapters/weather-adapter.js';

describe('Schema contracts', () => {
  it('ExecuteResponse should have success, data, and router_metadata', () => {
    const response: ExecuteResponse = {
      success: true,
      data: { temperature: 22.5 },
      router_metadata: {
        requestId: 'req-1',
        category: 'weather',
        primaryProvider: 'WeatherAPI Test',
        fallbackProvider: null,
        totalLatencyMs: 120,
        providerLatencyMs: 50,
        statusCode: 200,
        circuitBreakerStatus: 'HEALTHY',
        cached: false,
        timestamp: new Date().toISOString(),
      },
    };

    expect(response.success).toBe(true);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('router_metadata');
  });

  it('ExecuteErrorResponse should have success false, error, and router_metadata', () => {
    const response: ExecuteErrorResponse = {
      success: false,
      error: {
        code: 'CATEGORY_OUTAGE',
        message: 'All providers failed',
      },
      router_metadata: {
        requestId: 'req-2',
        category: 'weather',
        primaryProvider: 'WeatherAPI Test',
        fallbackProvider: 'OpenWeatherMap Test',
        totalLatencyMs: 220,
        providerLatencyMs: null,
        statusCode: 503,
        circuitBreakerStatus: null,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    };

    expect(response.success).toBe(false);
    expect(typeof response.error.code).toBe('string');
    expect(typeof response.error.message).toBe('string');
    expect(response).toHaveProperty('router_metadata');
  });

  it('RouterMetadata should enforce all required fields', () => {
    const metadata: RouterMetadata = {
      requestId: 'req-3',
      category: 'weather',
      primaryProvider: 'WeatherAPI Test',
      fallbackProvider: null,
      totalLatencyMs: 100,
      providerLatencyMs: null,
      statusCode: 200,
      circuitBreakerStatus: 'HEALTHY',
      cached: false,
      timestamp: new Date().toISOString(),
    };

    expect(typeof metadata.requestId).toBe('string');
    expect(typeof metadata.category).toBe('string');
    expect(typeof metadata.primaryProvider).toBe('string');
    expect(metadata.fallbackProvider === null || typeof metadata.fallbackProvider === 'string').toBe(
      true,
    );
    expect(typeof metadata.totalLatencyMs).toBe('number');
    expect(metadata.providerLatencyMs === null || typeof metadata.providerLatencyMs === 'number').toBe(
      true,
    );
    expect(typeof metadata.statusCode).toBe('number');
    expect(metadata.circuitBreakerStatus === null || typeof metadata.circuitBreakerStatus === 'string').toBe(
      true,
    );
    expect(typeof metadata.cached).toBe('boolean');
    expect(typeof metadata.timestamp).toBe('string');
  });

  it('HealthCheckResponse should have correct shape', () => {
    const response: HealthCheckResponse = {
      status: 'healthy',
      version: '0.1.0',
      uptime: 100,
      timestamp: new Date().toISOString(),
      database: { connected: true, latencyMs: 1 },
      categories: {},
    };

    expect(['healthy', 'degraded', 'unhealthy']).toContain(response.status);
    expect(typeof response.version).toBe('string');
    expect(typeof response.uptime).toBe('number');
    expect(typeof response.timestamp).toBe('string');
    expect(typeof response.database.connected).toBe('boolean');
    expect(typeof response.database.latencyMs).toBe('number');
    expect(response.categories).toBeTypeOf('object');
  });

  it('MCPToolDefinition should have name, description, inputSchema, outputSchema', () => {
    const toolDefinition: MCPToolDefinition = new WeatherAdapter().getMCPToolDefinition();

    expect(typeof toolDefinition.name).toBe('string');
    expect(typeof toolDefinition.description).toBe('string');
    expect(toolDefinition).toHaveProperty('inputSchema');
    expect(toolDefinition).toHaveProperty('outputSchema');
  });
});
