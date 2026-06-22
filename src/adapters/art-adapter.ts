import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal art output. */
interface UniversalArtOutput {
  type: 'artwork' | 'emoji' | 'collection';
  title: string | null;
  artist: string | null;
  date: string | null;
  imageUrl: string | null;
  description: string | null;
  provider: string;
}

export class ArtAdapter extends BaseAdapter {
  readonly categorySlug = 'art-and-design';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const slug = provider.name.toLowerCase();
    const normalized: UniversalArtOutput = {
      type: slug.includes('emoji') ? 'emoji' : slug.includes('collection') ? 'collection' : 'artwork',
      title: this.extractTitle(slug, raw),
      artist: this.extractArtist(raw),
      date: this.extractDate(raw),
      imageUrl: this.extractImageUrl(raw),
      description: this.extractDescription(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private extractTitle(_slug: string, raw: Record<string, unknown>): string | null {
    // Art Institute: { data: { title: "..." } }
    if (raw.data && typeof raw.data === 'object') return ((raw.data as Record<string, unknown>).title as string) ?? null;
    // Met Museum: { title: "..." }
    if (raw.title) return raw.title as string;
    // EmojiHub: { name: "..." }
    if (raw.name) return raw.name as string;
    return null;
  }

  private extractArtist(raw: Record<string, unknown>): string | null {
    if (raw.data && typeof raw.data === 'object') {
      const d = raw.data as Record<string, unknown>;
      if (d.artist_display) return d.artist_display as string;
      if (d.artist_title) return d.artist_title as string;
    }
    if (raw.artistDisplayName) return raw.artistDisplayName as string;
    if (raw.artist_display) return raw.artist_display as string;
    return null;
  }

  private extractDate(raw: Record<string, unknown>): string | null {
    if (raw.data && typeof raw.data === 'object') return ((raw.data as Record<string, unknown>).date_display as string) ?? null;
    if (raw.objectDate) return raw.objectDate as string;
    if (raw.date) return raw.date as string;
    return null;
  }

  private extractImageUrl(raw: Record<string, unknown>): string | null {
    if (raw.data && typeof raw.data === 'object') {
      const d = raw.data as Record<string, unknown>;
      if (d.image_id) return `https://www.artic.edu/iiif/2/${d.image_id}/full/843,/0/default.jpg`;
    }
    if (raw.primaryImage) return raw.primaryImage as string;
    if (raw.primaryImageSmall) return raw.primaryImageSmall as string;
    return null;
  }

  private extractDescription(raw: Record<string, unknown>): string | null {
    if (raw.data && typeof raw.data === 'object') {
      const d = raw.data as Record<string, unknown>;
      if (d.description) return d.description as string;
      if (d.excerpt) return d.excerpt as string;
    }
    if (raw.creditLine) return raw.creditLine as string;
    if (raw.description) return raw.description as string;
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'art',
      description: 'Artworks, museum collections, emoji — universal output',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['artwork', 'emoji', 'collection'] },
          title: { type: 'string' },
          artist: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'ArtAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'ArtAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'ArtAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'ArtAdapter debug', obj),
};
