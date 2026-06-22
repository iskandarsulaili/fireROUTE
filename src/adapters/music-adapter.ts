import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal music output. */
interface UniversalMusicOutput {
  type: 'radio_station' | 'genre' | 'metadata';
  name: string | null;
  description: string | null;
  url: string | null;
  tags: string[];
  country: string | null;
  provider: string;
}

export class MusicAdapter extends BaseAdapter {
  readonly categorySlug = 'music';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const rawType = typeof response.body;
    const isStringResponse = rawType === 'string';
    const normalized: UniversalMusicOutput = {
      type: this.detectType(isStringResponse ? {} as Record<string, unknown> : raw),
      name: isStringResponse ? (response.body as string) : this.extractName(raw),
      description: isStringResponse ? null : this.extractDescription(raw),
      url: isStringResponse ? null : this.extractUrl(raw),
      tags: isStringResponse ? [] : this.extractTags(raw),
      country: isStringResponse ? null : this.extractCountry(raw),
      provider: provider.name,
    };
    // If Genrenator returned a plain string, set type to 'genre' and name to the string
    if (isStringResponse) normalized.type = 'genre';
    return { data: normalized, providerName: provider.name };
  }

  private detectType(raw: Record<string, unknown>): UniversalMusicOutput['type'] {
    // Radio Browser returns array of station objects
    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      if (first.stationuuid || first.name) return 'radio_station';
    }
    // Genrenator returns plain text
    if (typeof raw === 'object' && !raw.name && !raw.id) return 'genre';
    if (raw.genre) return 'genre';
    return 'metadata';
  }

  private extractName(raw: Record<string, unknown>): string | null {
    if (raw.name) return raw.name as string;
    // Radio Browser: { name: "..." }
    if (Array.isArray(raw) && raw.length > 0) return (raw[0] as Record<string, unknown>).name as string ?? null;
    return null;
  }

  private extractDescription(raw: Record<string, unknown>): string | null {
    return raw.description as string ?? null;
  }

  private extractUrl(raw: Record<string, unknown>): string | null {
    if (raw.url) return raw.url as string;
    if (raw.url_resolved) return raw.url_resolved as string;
    return null;
  }

  private extractTags(raw: Record<string, unknown>): string[] {
    if (raw.tags && typeof raw.tags === 'string') return (raw.tags as string).split(',').map(t => t.trim());
    if (raw.tag && typeof raw.tag === 'string') return [raw.tag];
    return [];
  }

  private extractCountry(raw: Record<string, unknown>): string | null {
    if (raw.country) return raw.country as string;
    if (raw.countrycode) return raw.countrycode as string;
    if (Array.isArray(raw) && raw.length > 0) return (raw[0] as Record<string, unknown>).country as string ?? null;
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'music',
      description: 'Radio stations, music metadata, genres — universal output',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          url: { type: 'string' },
          country: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'MusicAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'MusicAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'MusicAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'MusicAdapter debug', obj),
};
