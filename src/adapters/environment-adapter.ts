import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
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
