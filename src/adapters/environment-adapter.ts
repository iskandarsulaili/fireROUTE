import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
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
