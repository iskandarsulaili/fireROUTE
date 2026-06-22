import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal science output. */
interface UniversalScienceOutput {
  type: 'apod' | 'space' | 'earthquake' | 'iss' | 'math' | 'species' | 'raw';
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  date: string | null;
  magnitude: number | null;
  provider: string;
}

export class ScienceAdapter extends BaseAdapter {
  readonly categorySlug = 'science-and-math';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const slug = provider.name.toLowerCase();
    const normalized: UniversalScienceOutput = {
      type: this.detectType(slug, raw),
      title: this.extractTitle(slug, raw),
      description: this.extractDescription(slug, raw),
      imageUrl: this.extractImageUrl(raw),
      date: this.extractDate(raw),
      magnitude: this.extractMagnitude(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private detectType(slug: string, raw: Record<string, unknown>): UniversalScienceOutput['type'] {
    if (slug.includes('apod') || slug.includes('nasa') || (typeof raw.url === 'string' && raw.url.includes('apod'))) return 'apod';
    if (slug.includes('earthquake') || raw.mag) return 'earthquake';
    if (slug.includes('iss') || raw.iss_position) return 'iss';
    if (slug.includes('newton') || raw.operation) return 'math';
    if (slug.includes('gbif') || slug.includes('species')) return 'species';
    if (slug.includes('launch') || slug.includes('spacex')) return 'space';
    return 'raw';
  }

  private extractTitle(_slug: string, raw: Record<string, unknown>): string | null {
    if (raw.title) return raw.title as string;
    // NASA APOD
    if (raw.url) return 'Astronomy Picture of the Day';
    // USGS Earthquake
    if (raw.properties && typeof raw.properties === 'object') return ((raw.properties as Record<string, unknown>).title as string) ?? null;
    return null;
  }

  private extractDescription(_slug: string, raw: Record<string, unknown>): string | null {
    if (raw.explanation) return raw.explanation as string;
    if (raw.properties && typeof raw.properties === 'object') return ((raw.properties as Record<string, unknown>).detail as string) ?? null;
    if (raw.operation && raw.expression && raw.result) return `${raw.expression} = ${raw.result}`;
    if (Array.isArray(raw) && raw.length > 0) {
      const item = raw[0] as Record<string, unknown>;
      if (item.occurrenceRemarks) return item.occurrenceRemarks as string;
    }
    return null;
  }

  private extractImageUrl(raw: Record<string, unknown>): string | null {
    if (raw.hdurl) return raw.hdurl as string;
    if (raw.url && typeof raw.url === 'string' && raw.media_type === 'image') return raw.url as string;
    if (raw.properties && typeof raw.properties === 'object') return ((raw.properties as Record<string, unknown>).alert as string) ?? null;
    return null;
  }

  private extractDate(raw: Record<string, unknown>): string | null {
    if (raw.date) return raw.date as string;
    if (raw.properties && typeof raw.properties === 'object') return ((raw.properties as Record<string, unknown>).time as string) ?? null;
    return null;
  }

  private extractMagnitude(raw: Record<string, unknown>): number | null {
    if (raw.mag) return raw.mag as number;
    if (raw.properties && typeof raw.properties === 'object') return ((raw.properties as Record<string, unknown>).mag as number) ?? null;
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'science',
      description: 'NASA, space, earthquakes, math — universal output',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'ScienceAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'ScienceAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'ScienceAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'ScienceAdapter debug', obj),
};
