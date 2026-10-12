import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { CircuitBreakerService } from '../../src/services/circuit-breaker.js';
import { MockUpstreamServer } from '../helpers/mock-server.js';
import { seedTestData, cleanTestData } from '../helpers/test-db.js';
import { providerRepo } from '../../src/lib/db/provider-repo.js';
import { fallbackConfigRepo } from '../../src/lib/db/fallback-config-repo.js';
import { ProviderHealthStatus } from '../../src/types/category.js';

const logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  debug: () => undefined,
};

describe('CircuitBreakerService', () => {
  let mockServer: MockUpstreamServer;
  let circuitBreaker: CircuitBreakerService;
  let providerId: string;
  let providerName: string;
  let categorySlug: string;
  let cooldownMinutes: number;

  beforeAll(async () => {
    mockServer = new MockUpstreamServer('always_success');
    const port = await mockServer.start();
    const seeded = await seedTestData(port);
    providerId = seeded.primaryProvider.id;
    providerName = seeded.primaryProvider.name;
    categorySlug = seeded.weatherCategory.slug;
    const config = await fallbackConfigRepo.findByCategory(categorySlug);
    cooldownMinutes = config?.cooldownMinutes ?? 1;
  });

  afterAll(async () => {
    await mockServer.stop();
    await cleanTestData();
  });

  beforeEach(async () => {
    await providerRepo.recordSuccess(providerId);
    circuitBreaker = new CircuitBreakerService(logger);
  });

  it('should start as HEALTHY', async () => {
    const state = await circuitBreaker.getState(providerId);
    expect(state?.healthStatus).toBe('HEALTHY');
  });

  it('should allow HEALTHY providers', async () => {
    const decision = await circuitBreaker.evaluate(providerId, providerName, categorySlug, false);
    expect(decision.allowed).toBe(true);
    expect(decision.fallbackSuggested).toBe(false);
  });

  it('should degrade after 3 consecutive failures', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    const state = await circuitBreaker.getState(providerId);
    expect(state?.healthStatus).toBe('DEGRADED');
  });

  it('should deny degraded providers for non-canary', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    const decision = await circuitBreaker.evaluate(providerId, providerName, categorySlug, false);
    expect(decision.allowed).toBe(false);
    expect(decision.fallbackSuggested).toBe(true);
  });

  it('should allow canary probes for degraded providers', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    const pastCooldown = new Date(Date.now() - cooldownMinutes * 60 * 1000 - 1000);
    await providerRepo.updateHealthStatus(
      providerId,
      ProviderHealthStatus.DEGRADED,
      3,
      pastCooldown,
    );
    const freshBreaker = new CircuitBreakerService(logger);
    const decision = await freshBreaker.evaluate(providerId, providerName, categorySlug, true);
    expect(decision.allowed).toBe(true);
  });

  it('should recover on canary success', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordSuccess(providerId, true);
    const state = await circuitBreaker.getState(providerId);
    expect(state?.healthStatus).toBe('HEALTHY');
  });

  it('should not escalate on a canary failure, and re-arm the cooldown instead', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, true);
    const state = await circuitBreaker.getState(providerId);
    // A canary probe runs a synthetic request, so its failure says nothing about the
    // provider's real endpoints: a single transient DNS blip used to push a DEGRADED
    // provider straight to DEAD with a doubled cooldown, taking it out of service for
    // real traffic. The probe only re-arms the cooldown; escalation belongs to the
    // consecutive-failure threshold, covered by the next test.
    expect(state?.healthStatus).not.toBe('DEAD');
    expect(state?.cooldownUntil).toBeTruthy();
  });

  it('should mark DEAD after 6 consecutive failures (threshold*2)', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    const state = await circuitBreaker.getState(providerId);
    expect(state?.healthStatus).toBe('DEAD');
  });

  it('should reset provider to HEALTHY', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.resetProvider(providerId);
    const state = await circuitBreaker.getState(providerId);
    expect(state?.healthStatus).toBe('HEALTHY');
    expect(state?.failureCount).toBe(0);
  });

  it('should emit events on transitions', async () => {
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    await circuitBreaker.recordFailure(providerId, false);
    const events = circuitBreaker.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const event = events[0];
    expect(event).toBeDefined();
    if (event) {
      expect(event.providerId).toBeTruthy();
      expect(event.fromStatus).toBeTruthy();
      expect(event.toStatus).toBeTruthy();
      expect(event.reason).toBeTruthy();
      expect(event.timestamp).toBeTruthy();
    }
  });

  it('should return category summary', async () => {
    const summary = await circuitBreaker.getCategorySummary(categorySlug);
    expect(summary).toHaveProperty('healthyCount');
    expect(summary).toHaveProperty('degradedCount');
    expect(summary).toHaveProperty('deadCount');
    expect(summary).toHaveProperty('totalCount');
  });
});
