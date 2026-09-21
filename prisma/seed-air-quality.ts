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
  /** Whether this provider should be live. Explicit per provider — see the loop. */
  isActive: boolean;
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
      isActive: true,
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
        // Open-Meteo returns no `current` block unless the variables are listed,
        // which yields a 200 with no parseable data. Default them so a caller that
        // omits `current` still gets a reading.
        defaultParams: { current: 'us_aqi,pm2_5,pm10,european_aqi' },
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
      isActive: true,
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
        // Keep the same variable list the canonical call carries.
        defaultParams: { current: 'us_aqi,pm2_5,pm10,european_aqi' },
      },
    });
  } else {
    console.log('  OPENWEATHER_API_KEY not found in .env.providers — skipping OpenWeather');
  }

  // ── Optional providers ─────────────────────────────────────────────────────
  // Both are seeded INACTIVE. Measured 2026-09-21; activate only when the
  // blocker below is cleared, and turn them off again if they cannot serve.

  // OpenAQ v3 requires a real API key (keyless requests return 401). Register a
  // key at https://explore.openaq.org (self-service, no cost) and put it in
  // .env.providers as OPENAQ_API_KEY, then flip isActive to true. Its /v3 API
  // serves measurements per location/sensor, so activating it also needs an
  // adapter mapping from lat/lon to a nearby location.
  const openaqKey = env['OPENAQ_API_KEY'];
  providers.push({
    slug: 'openaq',
    name: 'OpenAQ',
    baseUrl: 'https://api.openaq.org/v3',
    authType: 'api_key',
    priority: 2,
    rateLimitPerMinute: 60,
    // Two sequential requests (coordinate -> station, then value), and the free
    // tier is slow: measured 0.4s-15s for the same call. Needs the full budget.
    timeoutMs: 20000,
    isActive: Boolean(openaqKey),
    authConfig: {
      apiKey: openaqKey ?? '',
      in: 'header',
      headerName: 'X-API-Key',
    },
    metadata: {
      description: 'Global ground-station air quality measurements (v3 API)',
      docs: 'https://docs.openaq.org/',
      free: true,
      global: true,
      outputType: 'air_quality',
      canonicalPath: '/v1/air-quality',
      // No `path` override: the adapter resolves the coordinate to a station and
      // rewrites the URL itself (see EnvironmentAdapter.normalizeRequest).
      requiresLocationLookup: true,
      requiresKeyEnv: 'OPENAQ_API_KEY',
      coverage:
        'Global ground stations. Measured 2026-09-21: 14/20 of our cities have a '
        + 'pm25 station reporting within 24h; a few have none (Moscow, Shanghai, '
        + 'Beijing, Sao Paulo) and fail over to the next provider.',
      freshnessGuard:
        'Stations are only accepted when their latest reading is < 24h old; some '
        + 'nearby stations report data years old.',
    },
  });

  // PM2.5 Open Data Portal (LASS, Taiwan). Keyless and reachable, but measured
  // coverage is Taiwan-only: 462 stations, 0 with any coordinates outside the
  // Taiwan bounding box, and it serves one bulk snapshot rather than a
  // coordinate query. It therefore cannot serve our global city list.
  providers.push({
    slug: 'pm25-open-data',
    name: 'PM2.5 Open Data Portal',
    baseUrl: 'https://pm25.lass-net.org',
    authType: 'no_auth',
    priority: 3,
    rateLimitPerMinute: 30,
    timeoutMs: 15000,
    isActive: false,
    metadata: {
      description: 'Taiwan (LASS) AirBox PM2.5 network — regional only',
      docs: 'https://pm25.lass-net.org/',
      free: true,
      global: false,
      outputType: 'air_quality',
      canonicalPath: '/v1/air-quality',
      coverage: 'Taiwan only (462 stations, all inside the TW bounding box)',
      blockedReason:
        'Taiwan-only coverage and a bulk snapshot endpoint (no coordinate '
        + 'query), so it cannot answer air-quality calls for global cities.',
    },
  });

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
      // Taken from the definition, never hardcoded. A blanket `true` here is
      // what silently re-activated the misconfigured UK Carbon Intensity
      // provider on every seed run.
    };

    if (existing) {
      await prisma.providerConnection.update({ where: { id: existing.id }, data });
      console.log(
        `  UPDATED ${def.slug} (${def.isActive ? 'active' : 'inactive'}, priority ${def.priority})`,
      );
    } else {
      await prisma.providerConnection.create({ data });
      console.log(
        `  CREATED ${def.slug} (${def.isActive ? 'active' : 'inactive'}, priority ${def.priority})`,
      );
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
