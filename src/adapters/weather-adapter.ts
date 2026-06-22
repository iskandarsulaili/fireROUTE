import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';


/**
 * Universal weather condition (fireROUTE standard).
 * Provider A says "Sunny Day" → Provider B says "Clear" → fireROUTE output: "Sunny"
 */
type UniversalCondition =
  | 'Sunny' | 'Cloudy' | 'Overcast'
  | 'Rainy' | 'Drizzle' | 'Stormy'
  | 'Foggy' | 'Snowy'
  | 'Windy'
  | 'Hot' | 'Cold'
  | 'Unknown';

/** Universal standardized weather output every provider normalizes to. */
interface UniversalWeatherOutput {
  temperatureCelsius: number | null;
  condition: UniversalCondition;
  conditionRaw: string | null;  // original provider text for debugging
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  locationName: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  provider: string;
}

export class WeatherAdapter extends BaseAdapter {
  readonly categorySlug = 'weather';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const rawData = response.body as Record<string, unknown>;
    const rawCondition = this.extractCondition(rawData);

    const normalized: UniversalWeatherOutput = {
      temperatureCelsius: this.extractTemperature(rawData),
      condition: this.standardizeCondition(rawCondition),
      conditionRaw: rawCondition,
      humidityPercent: this.extractHumidity(rawData),
      windSpeedKmh: this.extractWindSpeed(rawData),
      windDirectionDegrees: this.extractWindDirectionDegrees(rawData),
      locationName: this.extractLocationName(rawData),
      region: this.extractRegion(rawData),
      country: this.extractCountry(rawData),
      latitude: this.extractLatitude(rawData),
      longitude: this.extractLongitude(rawData),
      timestamp: this.extractTimestamp(rawData) ?? new Date().toISOString(),
      provider: provider.name,
    };

    return {
      data: normalized,
      providerName: provider.name,
    };
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'weather',
      description: 'Get current weather data for any location — standardized universal output',
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
          temperatureCelsius: { type: 'number' },
          condition: { type: 'string', enum: ['Sunny','Cloudy','Overcast','Rainy','Drizzle','Stormy','Foggy','Snowy','Windy','Hot','Cold','Unknown'] },
          humidityPercent: { type: 'number' },
          windSpeedKmh: { type: 'number' },
          windDirectionDegrees: { type: 'number' },
          locationName: { type: 'string' },
          country: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          timestamp: { type: 'string' },
        },
      },
    };
  }

  // ── Universal condition standardizer ─────────────────────────────

  private standardizeCondition(raw: string | null): UniversalCondition {
    if (!raw) return 'Unknown';
    const c = raw.toLowerCase().trim();

    // Sunny / Clear
    if (/\b(clear|sunny|sun|bright|fair)\b/.test(c)) return 'Sunny';

    // Cloudy / Overcast
    if (/\b(overcast|cloudy|mainly clear|partly cloudy)\b/.test(c)) return c.includes('overcast') ? 'Overcast' : 'Cloudy';

    // Rainy
    if (/\b(rain|rainy|shower|downpour|precip|wet)\b/.test(c)) return 'Rainy';

    // Drizzle (light rain)
    if (/\b(drizzle|light rain|slight rain)\b/.test(c)) return 'Drizzle';

    // Stormy / Thunderstorm
    if (/\b(thunderstorm|thunder|storm|lightning|hail|tornado|tstorm)\b/.test(c)) return 'Stormy';

    // Foggy
    if (/\b(fog|foggy|mist|misty|haze|hazy|rime|smog)\b/.test(c)) return 'Foggy';

    // Snowy
    if (/\b(snow|snowy|sleet|blizzard|ice|freezing)\b/.test(c)) return 'Snowy';

    // Windy
    if (/\b(wind|windy|breezy|gust)\b/.test(c)) return 'Windy';

    // Hot
    if (/\b(hot|heat|extreme.?heat|scorch)\b/.test(c)) return 'Hot';

    // Cold
    if (/\b(cold|extreme.?cold|chill|frost)\b/.test(c)) return 'Cold';

    // MET Malaysia "no rain" -> Sunny
    if (c === 'no rain' || c === 'sunny') return 'Sunny';

    return 'Unknown';
  }

  // ── Extraction helpers ──────────────────────────────────────────

  private extractTemperature(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      const temp = current.temperature_2m ?? current.temperature_2m_max ?? current.temperature_2m_min ?? null;
      if (temp !== null) return temp as number;
      return (current.temp_c as number) ?? (current.temp_f as number) ?? null;
    }
    if (data.main && typeof data.main === 'object') {
      return ((data.main as Record<string, unknown>).temp as number) ?? null;
    }
    const metMalaysia = this.extractMetMalaysiaTemp(data);
    if (metMalaysia !== null) return metMalaysia;
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
    // Open-Meteo WMO code
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      const wmoCode = current.weather_code as number | undefined;
      if (wmoCode !== undefined) return this.wmoCodeToString(wmoCode);
      const condition = current.condition as Record<string, unknown> | undefined;
      return (condition?.text as string) ?? null;
    }
    if (data.weather && Array.isArray(data.weather) && data.weather.length > 0) {
      return ((data.weather[0] as Record<string, unknown>).description as string) ?? null;
    }
    const metMalaysia = this.extractMetMalaysiaCondition(data);
    if (metMalaysia !== null) return metMalaysia;
    const aviation = this.extractAviationObservation(data);
    if (aviation) return this.findString(aviation, ['wx_string', 'weather', 'weather_code']);
    return null;
  }

  private extractHumidity(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      return (current.relative_humidity_2m as number) ?? (current.humidity as number) ?? null;
    }
    if (data.main && typeof data.main === 'object') {
      return ((data.main as Record<string, unknown>).humidity as number) ?? null;
    }
    const aviation = this.extractAviationObservation(data);
    if (aviation) return this.findNumber(aviation, ['relative_humidity', 'humidity', 'humidity_percent']);
    return null;
  }

  private extractWindSpeed(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      return (current.wind_speed_10m as number) ?? (current.wind_kph as number) ?? null;
    }
    if (data.wind && typeof data.wind === 'object') {
      return ((data.wind as Record<string, unknown>).speed as number) ?? null;
    }
    const aviation = this.extractAviationObservation(data);
    if (aviation) return this.findNumber(aviation, ['wind_speed_kt', 'wind_speed', 'wind_kph']);
    return null;
  }

  /** Extract wind direction as numeric degrees (0-360). */
  private extractWindDirectionDegrees(data: Record<string, unknown>): number | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      const deg = current.wind_dir as number | string | undefined;
      if (typeof deg === 'number') return deg;
      if (typeof deg === 'string') {
        const parsed = parseInt(deg, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    if (data.wind && typeof data.wind === 'object') {
      const deg = (data.wind as Record<string, unknown>).deg as number | undefined;
      if (typeof deg === 'number') return deg;
    }
    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const dir = this.findNumber(aviation, ['wind_dir_degrees', 'wind_dir']);
      if (dir !== null) return dir;
    }
    return null;
  }

  private extractLocationName(data: Record<string, unknown>): string | null {
    const metLoc = this.extractMetMalaysiaFirstLoc(data);
    if (metLoc?.name) return metLoc.name;
    if (data.location && typeof data.location === 'object') {
      return ((data.location as Record<string, unknown>).name as string) ?? null;
    }
    if (data.name && typeof data.name === 'string') return data.name;
    const aviation = this.extractAviationObservation(data);
    if (aviation) return this.findString(aviation, ['station', 'station_id', 'station_name']);
    return null;
  }

  private extractRegion(data: Record<string, unknown>): string | null {
    if (data.location && typeof data.location === 'object') {
      return ((data.location as Record<string, unknown>).region as string) ?? null;
    }
    const aviation = this.extractAviationObservation(data);
    if (aviation) return this.findString(aviation, ['region', 'state']);
    return null;
  }

  private extractCountry(data: Record<string, unknown>): string | null {
    const metLoc = this.extractMetMalaysiaFirstLoc(data);
    if (metLoc?.country) return metLoc.country;
    if (data.location && typeof data.location === 'object') {
      return ((data.location as Record<string, unknown>).country as string) ?? null;
    }
    if (data.sys && typeof data.sys === 'object') {
      return ((data.sys as Record<string, unknown>).country as string) ?? null;
    }
    return null;
  }

  private extractLatitude(data: Record<string, unknown>): number | null {
    if (typeof data.latitude === 'number') return data.latitude;
    const metLoc = this.extractMetMalaysiaFirstLoc(data);
    if (metLoc?.lat !== null && metLoc?.lat !== undefined) return metLoc.lat;
    if (data.coord && typeof data.coord === 'object') return ((data.coord as Record<string, unknown>).lat as number) ?? null;
    if (data.location && typeof data.location === 'object') return ((data.location as Record<string, unknown>).lat as number) ?? null;
    return null;
  }

  private extractLongitude(data: Record<string, unknown>): number | null {
    if (typeof data.longitude === 'number') return data.longitude;
    const metLoc = this.extractMetMalaysiaFirstLoc(data);
    if (metLoc?.lon !== null && metLoc?.lon !== undefined) return metLoc.lon;
    if (data.coord && typeof data.coord === 'object') return ((data.coord as Record<string, unknown>).lon as number) ?? null;
    if (data.location && typeof data.location === 'object') return ((data.location as Record<string, unknown>).lon as number) ?? null;
    return null;
  }

  // ── Provider-specific extractors ─────────────────────────────────

  private extractMetMalaysiaTemp(data: Record<string, unknown>): number | null {
    const results = data.results;
    if (!Array.isArray(results)) return null;
    for (const r of results) {
      if (r && typeof r === 'object') {
        const row = r as Record<string, unknown>;
        if (row.datatype === 'FMAXT' || row.datatype === 'FTEMP') return (row.value as number) ?? null;
      }
    }
    for (const r of results) {
      if (r && typeof r === 'object') {
        if ((r as Record<string, unknown>).datatype === 'FMINT') return ((r as Record<string, unknown>).value as number) ?? null;
      }
    }
    return null;
  }

  private extractMetMalaysiaCondition(data: Record<string, unknown>): string | null {
    const results = data.results;
    if (!Array.isArray(results)) return null;
    for (const r of results) {
      if (r && typeof r === 'object') {
        const row = r as Record<string, unknown>;
        if (row.datatype === 'FSIGW' && row.attributes) {
          const attrs = row.attributes as Record<string, unknown>;
          const code = attrs.code as string | undefined;
          if (code) return code;
          return (row.value as string) ?? null;
        }
      }
    }
    for (const r of results) {
      if (r && typeof r === 'object') {
        const datatype = (r as Record<string, unknown>).datatype as string;
        if (datatype && datatype.startsWith('FG')) return ((r as Record<string, unknown>).value as string) ?? null;
      }
    }
    return null;
  }

  private extractMetMalaysiaFirstLoc(data: Record<string, unknown>): { name?: string; country?: string; lat?: number; lon?: number } | null {
    const results = data.results;
    if (!Array.isArray(results) || results.length === 0) return null;
    const first = results[0] as Record<string, unknown> | undefined;
    const name = (first?.name as string) ?? (first?.locationname as string) ?? null;
    if (name) {
      return { name, country: 'Malaysia', lat: first?.latitude as number | undefined, lon: first?.longitude as number | undefined };
    }
    for (const r of results) {
      if (r && typeof r === 'object') {
        const row = r as Record<string, unknown>;
        if (row.locationname) return { name: row.locationname as string, country: 'Malaysia', lat: row.latitude as number | undefined, lon: row.longitude as number | undefined };
      }
    }
    return null;
  }

  private extractTimestamp(data: Record<string, unknown>): string | null {
    if (data.current && typeof data.current === 'object') {
      const current = data.current as Record<string, unknown>;
      const time = current.time as string | undefined;
      if (time) return new Date(time).toISOString();
      if (typeof current.last_updated === 'string') return new Date(current.last_updated).toISOString();
    }
    if (typeof data.dt === 'number') return new Date(data.dt * 1000).toISOString();
    const results = data.results;
    if (Array.isArray(results) && results.length > 0) {
      const first = results[0] as Record<string, unknown>;
      const date = first.date as string | undefined;
      if (date) return new Date(date).toISOString();
    }
    const aviation = this.extractAviationObservation(data);
    if (aviation) {
      const timestamp = this.findString(aviation, ['observation_time', 'time', 'timestamp']);
      if (timestamp) return new Date(timestamp).toISOString();
    }
    return null;
  }

  /** WMO → human-readable (English) */
  private wmoCodeToString(code: number): string {
    const wmoMap: Record<number, string> = {
      0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      66: 'Light freezing rain', 67: 'Heavy freezing rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
      80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
      85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
    };
    return wmoMap[code] ?? `Weather code ${code}`;
  }

  private extractAviationObservation(data: Record<string, unknown>): Record<string, unknown> | null {
    if (data.data && Array.isArray(data.data) && data.data.length > 0) return data.data[0] as Record<string, unknown>;
    if (data.observation && typeof data.observation === 'object') return data.observation as Record<string, unknown>;
    if (data.observations && Array.isArray(data.observations) && data.observations.length > 0) return data.observations[0] as Record<string, unknown>;
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
