import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  NormalizedUpstreamRequest,
  UpstreamResponse,
  MCPToolDefinition,
  InternalExecuteRequest,
} from '../types/adapter.js';

/** Universal environment output. */
interface UniversalEnvironmentOutput {
  type: 'air_quality' | 'carbon_intensity' | 'water_data' | 'raw';
  value: number | null;
  hasValue: boolean;  // explicit flag: true=0 is valid, false=no data
  unit: string | null;
  location: string | null;
  timestamp: string | null;
  provider: string;
}

/**
 * How old a ground-station reading may be and still count as current air quality.
 *
 * Ground stations differ wildly: within 25 km of one city, the newest readings
 * ranged from under an hour to over three years old, so a value is only used
 * when it is recent.
 */
const OpenAqWindowMs = 6 * 60 * 60 * 1000;

/**
 * Cache of resolved OpenAQ stations, keyed by rounded coordinate.
 *
 * OpenAQ needs two requests (coordinate -> station, then station -> value), but
 * the whole HTTP request is capped at 3000ms, so paying for the lookup on every
 * call aborts the request. Stations do not move, so the mapping is cached and
 * the hot path becomes a single request like every other provider. Values are
 * still fetched fresh every time, and the `datetime_from` window means a station
 * that has gone quiet yields nothing and the caller fails over.
 */
const OpenAqStationCache = new Map<string, { sensorId: string; expiresAt: number }>();
const OpenAqStationCacheTtlMs = 60 * 60 * 1000;

/** Round to ~100m so nearby requests share a cache entry. */
function openAqCacheKey(lat: string, lng: string): string {
  return `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
}

export class EnvironmentAdapter extends BaseAdapter {
  readonly categorySlug = 'environment';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  /**
   * Translate the canonical category path into each provider's real endpoint.
   *
   * One request path cannot be correct for every provider here: Open-Meteo's air
   * quality lives at `/v1/air-quality` while OpenWeather's lives at
   * `/data/2.5/air_pollution`. The base router concatenates `baseUrl + path`
   * verbatim, so without this the fallback provider is asked for a path it does
   * not serve and returns a 404 from its edge, which surfaces as a misleading
   * CATEGORY_OUTAGE on a request the primary provider handled fine.
   *
   * Mapping comes from the provider's `metadata.path` (registered in the DB), so
   * adding a provider needs no code change.
   */
  protected buildUrl(provider: ProviderAdapterConfig, request: InternalExecuteRequest): string {
    const metaPath =
      provider.metadata && typeof provider.metadata['path'] === 'string'
        ? (provider.metadata['path'] as string)
        : null;
    const canonical =
      provider.metadata && typeof provider.metadata['canonicalPath'] === 'string'
        ? (provider.metadata['canonicalPath'] as string)
        : '/v1/air-quality';

    // Provider-specific param names (OpenWeather uses lat/lon, Open-Meteo uses
    // latitude/longitude). Declared in metadata so no code change is needed per
    // provider.
    const aliases =
      provider.metadata && typeof provider.metadata['paramAliases'] === 'object'
        ? (provider.metadata['paramAliases'] as Record<string, string>)
        : null;

    let nextRequest = request;
    if (aliases) {
      const params: Record<string, string> = {};
      for (const [k, v] of Object.entries(request.params ?? {})) {
        params[aliases[k] ?? k] = v as string;
      }
      nextRequest = { ...nextRequest, params };
    }

    // Default the fields a provider needs, when the caller did not ask for any.
    //
    // Open-Meteo returns NO `current` block unless you list the variables, and the
    // upstream then answers 200 with only coordinates. The adapter has nothing to
    // parse, so the response is `{success: true, hasValue: false}` — a
    // successful-looking empty result. Supplying the defaults turns a silent empty
    // answer into real data.
    const defaults =
      provider.metadata && typeof provider.metadata['defaultParams'] === 'object'
        ? (provider.metadata['defaultParams'] as Record<string, string>)
        : null;
    if (defaults) {
      const params: Record<string, string> = { ...(nextRequest.params ?? {}) };
      for (const [k, v] of Object.entries(defaults)) {
        if (params[k] === undefined || params[k] === '') {
          params[k] = v;
        }
      }
      nextRequest = { ...nextRequest, params };
    }

    if (metaPath && request.path === canonical && metaPath !== canonical) {
      return super.buildUrl(provider, { ...nextRequest, path: metaPath });
    }
    return super.buildUrl(provider, nextRequest);
  }

  /**
   * Resolve a coordinate to a station before delegating to ``buildUrl``.
   *
   * OpenAQ v3 cannot answer a coordinate query in one request: ``/v3/locations``
   * resolves a lat/lon to nearby stations, but values live under a location or
   * sensor. This override resolves the freshest nearby station and rewrites the
   * request to that station's hourly measurements — the one endpoint that
   * returns the value WITH its parameter name (so the response parser needs no
   * extra state) and honours a ``datetime_from`` window (so it cannot serve
   * decade-old data: ``/sensors/{id}/measurements`` without a window returned
   * 2016 readings for a station whose latest reading was under an hour old).
   *
   * Freshness is checked because nearby stations differ wildly: within 25 km of
   * one city the newest readings ranged from under an hour to over three years
   * old. When nothing nearby is fresh the request is left untouched so the
   * ordinary failover/error path applies, rather than reporting stale data as
   * current air quality.
   */
  async normalizeRequest(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Promise<NormalizedUpstreamRequest> {
    if (provider.metadata?.['requiresLocationLookup'] === true) {
      const lat = request.params?.['latitude'] ?? request.params?.['lat'];
      const lng = request.params?.['longitude'] ?? request.params?.['lon'];
      if (lat !== undefined && lat !== null && lng !== undefined && lng !== null) {
        const resolved = await this.resolveOpenAqStation(provider, String(lat), String(lng));
        if (resolved) {
          return super.normalizeRequest(provider, {
            ...request,
            path: `/sensors/${resolved.sensorId}/measurements/hourly`,
            params: { limit: '1', datetime_from: resolved.sinceIso },
          });
        }
      }
    }
    return super.normalizeRequest(provider, request);
  }

  /**
   * Resolve a coordinate to a OpenAQ station that has a RECENT pm25 reading.
   *
   * Returns null when nothing nearby is fresh; the caller then fails over
   * instead of publishing a stale number as current air quality.
   */
  private async resolveOpenAqStation(
    provider: ProviderAdapterConfig,
    lat: string,
    lng: string,
  ): Promise<{ locationId: string; sensorId: string; sinceIso: string } | null> {
    // Fast path: a station we resolved recently. Avoids the second request and
    // keeps this provider inside the endpoint's latency budget.
    const cached = OpenAqStationCache.get(openAqCacheKey(lat, lng));
    if (cached && cached.expiresAt > Date.now()) {
      this.logger.debug({ sensorId: cached.sensorId }, 'OpenAQ station cache hit');
      return {
        locationId: '',
        sensorId: cached.sensorId,
        sinceIso: new Date(Date.now() - OpenAqWindowMs - 60 * 60 * 1000).toISOString(),
      };
    }

    const config = (provider.authConfig ?? {}) as Record<string, string>;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (config['apiKey']) {
      headers[(config['headerName'] as string) || 'X-API-Key'] = config['apiKey'];
    }

    const url =
      `${provider.baseUrl}/locations?coordinates=${encodeURIComponent(`${lat},${lng}`)}`
      + '&radius=25000&limit=10';

    // OpenAQ's free tier is slow and highly variable (measured 0.4s to 15s for
    // the same query), so the lookup gets the provider's full budget. A cold
    // lookup that overruns fails over; the station cache means the lookup is
    // paid rarely, and the value request it enables is the fast part.
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(provider.timeoutMs),
    });
    if (!res.ok) {
      this.logger.warn({ status: res.status, url }, 'OpenAQ location lookup failed');
      return null;
    }
    const body = (await res.json()) as { results?: unknown[] };
    const results = Array.isArray(body.results) ? body.results : [];

    // Must match the `datetime_from` window used for the value request, or a
    // station accepted here could still return nothing (or an older bucket).
    const maxAgeMs = OpenAqWindowMs;
    const now = Date.now();
    let staleSkipped = 0;

    for (const entry of results) {
      if (!entry || typeof entry !== 'object') continue;
      const loc = entry as Record<string, unknown>;
      const sensors = Array.isArray(loc.sensors) ? loc.sensors : [];
      const pm25 = sensors.find((s) => {
        const p = (s as Record<string, unknown>)?.parameter as Record<string, unknown> | undefined;
        return p?.['name'] === 'pm25';
      }) as Record<string, unknown> | undefined;
      if (!pm25) continue;

      const lastRaw = loc['datetimeLast'];
      const lastUtc =
        lastRaw && typeof lastRaw === 'object'
          ? ((lastRaw as Record<string, unknown>)['utc'] as string | undefined)
          : (lastRaw as string | undefined);
      if (lastUtc) {
        const age = now - Date.parse(lastUtc);
        if (Number.isFinite(age) && age > maxAgeMs) {
          staleSkipped += 1;
          continue;
        }
      }

      const sensorId = pm25['id'];
      const locationId = loc['id'];
      if (sensorId === undefined || locationId === undefined) continue;

      this.logger.debug(
        { locationId, sensorId, lastUtc, staleSkipped },
        'Resolved OpenAQ station',
      );
      // Widen slightly past the freshness threshold: OpenAQ buckets hourly, so a
      // reading accepted at the edge of the window can sit one bucket earlier.
      const sinceIso = new Date(Math.max(0, now - OpenAqWindowMs - 60 * 60 * 1000)).toISOString();
      OpenAqStationCache.set(openAqCacheKey(lat, lng), {
        sensorId: String(sensorId),
        expiresAt: now + OpenAqStationCacheTtlMs,
      });
      return { locationId: String(locationId), sensorId: String(sensorId), sinceIso };
    }

    this.logger.warn(
      { lat, lng, candidates: results.length, staleSkipped },
      'OpenAQ: no fresh pm25 station near this coordinate',
    );
    return null;
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const normalized: UniversalEnvironmentOutput = {
      type: 'raw',
      value: null,
      hasValue: false,
      unit: null,
      location: null,
      timestamp: null,
      provider: provider.name,
    };
    // Air quality (Open-Meteo Air Quality / OpenWeather air_pollution).
    //
    // `air_quality` was one of the three declared output types, but nothing ever
    // produced it: the only parser here handled UK Carbon Intensity, so a call
    // for air quality normalised to `raw` with hasValue=false even when the
    // upstream returned a perfectly good reading.
    //
    // Open-Meteo Air Quality shape:
    //   { current: { time, pm2_5, pm10, us_aqi, ... } }
    // OpenWeather air_pollution shape:
    //   { list: [{ main: { aqi }, components: { pm2_5, pm10, ... } }] }
    const aqCurrent = raw.current as Record<string, unknown> | undefined;
    if (aqCurrent && (aqCurrent.us_aqi !== undefined || aqCurrent.pm2_5 !== undefined)) {
      const aqi = aqCurrent.us_aqi ?? aqCurrent.european_aqi ?? null;
      normalized.type = 'air_quality';
      // Prefer the index; fall back to PM2.5 when the provider gives no index.
      normalized.value = (aqi as number) ?? (aqCurrent.pm2_5 as number) ?? null;
      normalized.hasValue = normalized.value !== null;
      normalized.unit = aqi !== null && aqi !== undefined ? 'USAQI' : 'µg/m³';
      normalized.timestamp = (aqCurrent.time as string) ?? null;
      return { data: normalized, providerName: provider.name };
    }

    // OpenWeather air_pollution: list[0].main.aqi is a 1-5 band, not AQI; the
    // component concentration is the more useful number when there is no index.
    const owList = raw.list as Record<string, unknown>[] | undefined;
    if (owList && owList.length > 0) {
      const first = owList[0] as Record<string, unknown>;
      const main = first.main as Record<string, unknown> | undefined;
      const components = first.components as Record<string, unknown> | undefined;
      if (main || components) {
        const pm25 = components?.pm2_5 as number | undefined;
        normalized.type = 'air_quality';
        normalized.value = pm25 ?? (main?.aqi as number) ?? null;
        normalized.hasValue = normalized.value !== null;
        normalized.unit = pm25 !== undefined ? 'µg/m³' : 'OWM AQI band (1-5)';
        normalized.timestamp = null;
        return { data: normalized, providerName: provider.name };
      }
    }

    // OpenAQ v3 hourly measurement:
    //   { results: [{ value, parameter: { name, units }, period: { datetimeFrom } }] }
    //
    // Placed before the OpenWeather `list` check because both carry arrays; this
    // one identifies its pollutant via `parameter.name`, which that branch would
    // otherwise misread as a concentration.
    const oaResults = raw.results as Record<string, unknown>[] | undefined;
    if (Array.isArray(oaResults) && oaResults.length > 0) {
      const oaEntry = oaResults[0] as Record<string, unknown>;
      const oaParam = oaEntry.parameter as Record<string, unknown> | undefined;
      const oaParamName = (oaParam?.name as string) ?? '';
      if (oaParamName === 'pm25' || oaParamName === 'pm10' || oaParamName === 'pm1') {
        const oaPeriod = oaEntry.period as Record<string, unknown> | undefined;
        const oaFrom = oaPeriod?.datetimeFrom as Record<string, unknown> | undefined;
        normalized.type = 'air_quality';
        normalized.value = (oaEntry.value as number) ?? null;
        normalized.hasValue = normalized.value !== null;
        normalized.unit = (oaParam?.units as string) ?? 'µg/m³';
        normalized.timestamp = (oaFrom?.utc as string) ?? null;
        return { data: normalized, providerName: provider.name };
      }
      // Any other pollutant is not an air-quality reading for our purposes; fall
      // through so the caller fails over rather than reporting an unrelated gas.
    }

    // UK Carbon Intensity: { data: [{ from, to, regions: [{ intensity: { forecast, actual } }] }] }
    if (raw.data && Array.isArray(raw.data) && raw.data.length > 0) {
      const entry = raw.data[0] as Record<string, unknown>;
      const regions = entry.regions as Record<string, unknown>[] | undefined;
      if (regions && regions.length > 0) {
        const regionIntensity = (regions[0] as Record<string, unknown>).intensity as Record<string, unknown> | undefined;
        if (regionIntensity && (regionIntensity.actual !== undefined || regionIntensity.forecast !== undefined)) {
          normalized.type = 'carbon_intensity';
          normalized.value = (regionIntensity.actual as number) ?? (regionIntensity.forecast as number) ?? null;
          normalized.hasValue = true;
          normalized.unit = 'gCO2/kWh';
          normalized.location = (regions[0] as Record<string, unknown>).shortname as string ?? null;
          normalized.timestamp = entry.from as string ?? null;
        }
      }
    }
    return { data: normalized, providerName: provider.name };
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'environment',
      description: 'Air quality, carbon intensity, water — universal output',
      inputSchema: {
        type: 'object',
        properties: { location: { type: 'string' } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          value: { type: 'number' },
          unit: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'EnvironmentAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'EnvironmentAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'EnvironmentAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'EnvironmentAdapter debug', obj),
};
