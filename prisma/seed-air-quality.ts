/**
 * Register air-quality providers for the `environment` category.
 *
 * Why this exists: `air_quality` was a declared output type in the environment
 * adapter, but nothing produced it — the category's only active provider was UK
 * Carbon Intensity (UK-only), and it was DEGRADED, so every air-quality request
 * failed with CATEGORY_OUTAGE even though the upstreams below are healthy.
 *
 * Registered here:
 *   1. Open-Meteo Air Quality — global, keyless, priority 0
 *   2. OpenWeather Air Pollution — global, API key (from .env.providers), priority 1
 *
 * Run with: npx tsx prisma/seed-air-quality.ts
 */
import { readFileSync } from 'node:fs';

import { prisma } from '../src/lib/db/prisma.js';

interface AqProviderDef {
  slug: string;
  name: string;
  baseUrl: string;
  authType: string;
  priority: number;
  rateLimitPerMinute: number;
  timeoutMs: number;
  authConfig?: Record<string, string>;
  metadata: Record<string, unknown>;
}

function readEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  let content = '';
  try {
    content = readFileSync(path, 'utf-8');
  } catch {
    return out;
  }
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

async function main(): Promise<void> {
  const env = readEnvFile('.env.providers');
  const owKey = env['OPENWEATHER_API_KEY'];

  const providers: AqProviderDef[] = [
    {
      slug: 'open-meteo-air-quality',
      name: 'Open-Meteo Air Quality',
      baseUrl: 'https://air-quality-api.open-meteo.com',
      authType: 'no_auth',
      priority: 0,
      rateLimitPerMinute: 120,
      timeoutMs: 8000,
      metadata: {
        description: 'Global air quality (US AQI, PM2.5, PM10) — keyless',
        docs: 'https://open-meteo.com/en/docs/air-quality-api',
        free: true,
        global: true,
        outputType: 'air_quality',
        // The canonical path the router is called with, and this provider's own
        // path for it. The environment adapter translates between them.
        canonicalPath: '/v1/air-quality',
        path: '/v1/air-quality',
      },
    },
  ];

  if (owKey) {
    providers.push({
      slug: 'openweather-air-pollution',
      name: 'OpenWeather Air Pollution',
      baseUrl: 'https://api.openweathermap.org',
      authType: 'api_key',
      priority: 1,
      rateLimitPerMinute: 60,
      timeoutMs: 8000,
      authConfig: { apiKey: owKey, in: 'query', keyName: 'appid' },
      metadata: {
        description: 'Global air pollution (AQI band, PM2.5, PM10, O3, NO2, SO2, CO)',
        docs: 'https://openweathermap.org/api/air-pollution',
        free: true,
        global: true,
        outputType: 'air_quality',
        canonicalPath: '/v1/air-quality',
        // OpenWeather serves air pollution at a different path than Open-Meteo;
        // without this translation the fallback returns a 404 from its edge.
        path: '/data/2.5/air_pollution',
        // OpenWeather names the coordinates lat/lon, not latitude/longitude.
        paramAliases: { latitude: 'lat', longitude: 'lon' },
      },
    });
  } else {
    console.log('  OPENWEATHER_API_KEY not found in .env.providers — skipping OpenWeather');
  }

  const category = await prisma.providerCategory.findUnique({ where: { slug: 'environment' } });
  if (!category) {
    throw new Error("category 'environment' not found");
  }

  for (const def of providers) {
    const { authConfig, metadata, ...rest } = def;
    const existing = await prisma.providerConnection.findFirst({ where: { slug: def.slug } });
    const data = {
      ...rest,
      categoryId: category.id,
      authConfig: authConfig ? JSON.stringify(authConfig) : null,
      metadata: JSON.stringify(metadata),
      healthStatus: 'HEALTHY',
      failureCount: 0,
      // Active: these are the providers that make air_quality reachable.
      isActive: true,
    };

    if (existing) {
      await prisma.providerConnection.update({ where: { id: existing.id }, data });
      console.log(`  UPDATED ${def.slug} (active, priority ${def.priority})`);
    } else {
      await prisma.providerConnection.create({ data });
      console.log(`  CREATED ${def.slug} (active, priority ${def.priority})`);
    }
  }

  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
