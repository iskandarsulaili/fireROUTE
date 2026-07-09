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
  latitude?: number | null;
  longitude?: number | null;
  copyright?: string | null;
  mediaType?: string | null;
  count?: number;
  earthquakes?: unknown[];
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
    
    // Provider-specific normalization
    if (slug.includes('usgs') || slug.includes('earthquake')) {
      return this.transformEarthquake(provider, raw);
    }
    if (slug.includes('iss') || slug.includes('open')) {
      return this.transformISS(provider, raw);
    }
    if (slug.includes('nasa') || slug.includes('apod')) {
      return this.transformNASA(provider, raw);
    }
    if (slug.includes('launch') || slug.includes('spacex')) {
      return this.transformLaunch(provider, raw);
    }
    
    // Generic fallback
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

  private async transformEarthquake(
    provider: ProviderAdapterConfig,
    raw: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const features = raw.features as Record<string, unknown>[] ?? [];
    const quakes = features.slice(0, 10).map((f) => {
      const props = f.properties as Record<string, unknown> ?? {};
      const geo = f.geometry as Record<string, unknown> ?? {};
      const coords = geo.coordinates as number[] ?? [];
      return {
        magnitude: props.mag as number ?? null,
        place: props.place as string ?? null,
        time: props.time as number ?? null,
        url: props.url as string ?? null,
        detail: props.detail as string ?? null,
        tsunami: props.tsunami as number ?? 0,
        alert: props.alert as string ?? null,
        magType: props.magType as string ?? null,
        latitude: coords[1] ?? null,
        longitude: coords[0] ?? null,
        depth: coords[2] ?? null,
      };
    });
    const first = quakes.length > 0 ? quakes[0] : null;
    return {
      data: {
        type: 'earthquake',
        count: quakes.length,
        earthquakes: quakes,
        title: first ? `M ${first.magnitude} - ${first.place}` : null,
        description: quakes.length > 0 ? quakes.map((q) => `M${q.magnitude} ${q.place}`).join('; ') : null,
        magnitude: first ? first.magnitude : null,
        date: first ? new Date(first.time ?? Date.now()).toISOString() : null,
        provider: provider.name,
      },
      providerName: provider.name,
    };
  }

  private async transformISS(
    provider: ProviderAdapterConfig,
    raw: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const pos = raw.iss_position as Record<string, string> ?? {};
    const timestamp = raw.timestamp as number ?? Date.now();
    return {
      data: {
        type: 'iss',
        title: 'International Space Station',
        description: `ISS at ${pos.latitude ?? '?'}° ${pos.longitude ?? '?'}° — overhead check: lat ${pos.latitude ?? '?'}, lon ${pos.longitude ?? '?'}`,
        imageUrl: null,
        date: new Date(timestamp * 1000).toISOString(),
        magnitude: null,
        latitude: parseFloat(pos.latitude ?? '0'),
        longitude: parseFloat(pos.longitude ?? '0'),
        provider: provider.name,
      },
      providerName: provider.name,
    };
  }

  private async transformNASA(
    provider: ProviderAdapterConfig,
    raw: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    // Handle both single APOD response and array response
    const items = Array.isArray(raw) ? raw : [raw];
    const item = items[0] as Record<string, unknown> ?? raw;
    return {
      data: {
        type: 'apod',
        title: item.title as string ?? null,
        description: item.explanation as string ?? null,
        imageUrl: item.hdurl as string ?? item.url as string ?? null,
        date: item.date as string ?? null,
        magnitude: null,
        copyright: item.copyright as string ?? null,
        mediaType: item.media_type as string ?? null,
        provider: provider.name,
      },
      providerName: provider.name,
    };
  }

  private async transformLaunch(
    provider: ProviderAdapterConfig,
    raw: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const launches = raw.results as Record<string, unknown>[] ?? [];
    const launch = launches[0] ?? {};
    const name = launch.name as string ?? null;
    const net = launch.net as string ?? null;  // launch window
    const status = launch.status as Record<string, unknown> ?? {};
    return {
      data: {
        type: 'space',
        title: name ?? null,
        description: `Launch: ${name ?? 'Unknown'} at ${net ?? 'TBD'} — Status: ${(status.name as string) ?? 'Unknown'}`,
        imageUrl: launch.image as string ?? null,
        date: net ?? null,
        magnitude: null,
        provider: provider.name,
      },
      providerName: provider.name,
    };
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
