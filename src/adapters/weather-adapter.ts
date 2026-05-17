import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

type WeatherLocation = {
  name?: string | null;
  region?: string | null;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  airportCode?: string | null;
};

/**
 * Weather category adapter.
 * Normalizes weather responses from various providers into a standardized weather output format.
 */
export class WeatherAdapter extends BaseAdapter {
  /** The category slug this adapter handles. */
  readonly categorySlug = 'weather';

  /** Create a weather adapter instance. */
  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  /**
   * Transform a provider-specific response into the standardized output.
   */
  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const rawData = response.body as Record<string, unknown>;

    const normalized = {
      temperature: this.extractTemperature(rawData),
      condition: this.extractCondition(rawData),
      humidity: this.extractHumidity(rawData),
      windSpeed: this.extractWindSpeed(rawData),
      windDirection: this.extractWindDirection(rawData),
      location: this.extractLocation(rawData),
      timestamp: this.extractTimestamp(rawData) ?? new Date().toISOString(),
      provider: provider.name,
    };

    return {
      data: normalized,
      providerName: provider.name,
    };
  }

  /**
   * Get the MCP tool definition for this category.
   */
  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'weather',
      description: 'Get current weather data for any location',
      inputSchema: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name, ZIP code, or coordinates' },
          units: { type: 'string', enum: ['metric', 'imperial'], description: 'Temperature units' },
        },
        required: ['location'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          temperature: { type: 'number' },
          condition: { type: 'string' },
          humidity: { type: 'number' },
          windSpeed: { type: 'number' },
          windDirection: { type: 'string' },
          location: { type: 'object' },
          timestamp: { type: 'string' },
          provider: { type: 'string' },
        },
      },
    };
  }

  // ---- Private extraction helpers ----

  private extractTemperature(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      return (current.temp_c as number) ?? (current.temp_f as number) ?? null;
    }

    if (data.main && typeof data.main === 'object') {
      return ((data.main as Record<string, unknown>).temp as number) ?? null;
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const tempC = this.findNumber(aviation, ['temp_c', 'tempC', 'temperature_c']);
      if (tempC !== null) return tempC;
      const tempF = this.findNumber(aviation, ['temp_f', 'tempF', 'temperature_f']);
      return tempF;
    }

    return null;
  }

  private extractCondition(data: Record<string, unknown>): string | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      const condition = current.condition as Record<string, unknown> | undefined;
      return (condition?.text as string) ?? null;
    }

    if (data.weather && Array.isArray(data.weather) && data.weather.length > 0) {
      return ((data.weather[0] as Record<string, unknown>).description as string) ?? null;
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const wx = this.findString(aviation, ['wx_string', 'weather', 'weather_code']);
      return wx;
    }

    return null;
  }

  private extractHumidity(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      return ((data.current as Record<string, unknown>).humidity as number) ?? null;
    }

    if (data.main && typeof data.main === 'object') {
      return ((data.main as Record<string, unknown>).humidity as number) ?? null;
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      return this.findNumber(aviation, ['relative_humidity', 'humidity', 'humidity_percent']);
    }

    return null;
  }

  private extractWindSpeed(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      return ((data.current as Record<string, unknown>).wind_kph as number) ?? null;
    }

    if (data.wind && typeof data.wind === 'object') {
      return ((data.wind as Record<string, unknown>).speed as number) ?? null;
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      return this.findNumber(aviation, ['wind_speed_kt', 'wind_speed', 'wind_kph']);
    }

    return null;
  }

  private extractWindDirection(data: Record<string, unknown>): string | null {
    if (data.current && typeof data.current === 'object') {
      return ((data.current as Record<string, unknown>).wind_dir as string) ?? null;
    }

    if (data.wind && typeof data.wind === 'object') {
      const degrees = (data.wind as Record<string, unknown>).deg;
      if (typeof degrees === 'number') {
        return `${degrees}`;
      }
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const direction = this.findNumber(aviation, ['wind_dir_degrees', 'wind_dir']);
      if (direction !== null) return `${direction}`;
      const textDirection = this.findString(aviation, ['wind_direction', 'wind_dir_text']);
      if (textDirection) return textDirection;
    }

    return null;
  }

  private extractLocation(data: Record<string, unknown>): WeatherLocation | null {
    if (data.location && typeof data.location === 'object') {
      const loc = data.location as Record<string, unknown>;
      return {
        name: (loc.name as string) ?? null,
        region: (loc.region as string) ?? null,
        country: (loc.country as string) ?? null,
        lat: (loc.lat as number) ?? null,
        lon: (loc.lon as number) ?? null,
      };
    }

    if (data.coord && typeof data.coord === 'object') {
      const coord = data.coord as Record<string, unknown>;
      return {
        name: (data.name as string) ?? null,
        region: null,
        country: ((data.sys as Record<string, unknown> | undefined)?.country as string) ?? null,
        lat: (coord.lat as number) ?? null,
        lon: (coord.lon as number) ?? null,
      };
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      return {
        name: this.findString(aviation, ['station', 'station_id', 'station_name']) ?? null,
        region: this.findString(aviation, ['region', 'state']) ?? null,
        country: this.findString(aviation, ['country']) ?? null,
        lat: this.findNumber(aviation, ['latitude', 'lat']),
        lon: this.findNumber(aviation, ['longitude', 'lon']),
        airportCode: this.findString(aviation, ['station_id', 'icao', 'iata']) ?? null,
      };
    }

    return null;
  }

  private extractTimestamp(data: Record<string, unknown>): string | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      if (typeof current.last_updated === 'string') {
        return new Date(current.last_updated).toISOString();
      }
    }

    if (typeof data.dt === 'number') {
      return new Date(data.dt * 1000).toISOString();
    }

    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const timestamp = this.findString(aviation, ['observation_time', 'time', 'timestamp']);
      if (timestamp) return new Date(timestamp).toISOString();
    }

    return null;
  }

  private extractAviationObservation(data: Record<string, unknown>): Record<string, unknown> | null {
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      const entry = data.data[0];
      if (entry && typeof entry === 'object') {
        return entry as Record<string, unknown>;
      }
    }

    if (data.observation && typeof data.observation === 'object') {
      return data.observation as Record<string, unknown>;
    }

    if (data.observations && Array.isArray(data.observations) && data.observations.length > 0) {
      const entry = data.observations[0];
      if (entry && typeof entry === 'object') {
        return entry as Record<string, unknown>;
      }
    }

    return null;
  }

  private findNumber(data: Record<string, unknown>, keys: string[]): number | null {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return null;
  }

  private findString(data: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'string') return value;
    }
    return null;
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'WeatherAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'WeatherAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'WeatherAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'WeatherAdapter debug', obj),
};
