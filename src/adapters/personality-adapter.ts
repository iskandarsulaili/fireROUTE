import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal personality output. */
interface UniversalPersonalityOutput {
  type: 'quote' | 'joke' | 'advice';
  text: string;
  author: string | null;
  source: string | null;
  tags: string[];
  provider: string;
}

export class PersonalityAdapter extends BaseAdapter {
  readonly categorySlug = 'personality';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const slug = provider.name.toLowerCase();
    const normalized: UniversalPersonalityOutput = {
      type: this.detectType(slug, raw),
      text: this.extractText(slug, raw),
      author: this.extractAuthor(slug, raw),
      source: this.extractSource(raw),
      tags: this.extractTags(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private detectType(_slug: string, raw: Record<string, unknown>): UniversalPersonalityOutput['type'] {
    if (_slug.includes('joke') || _slug.includes('icanhaz') || raw.joke) return 'joke';
    if (_slug.includes('advice') || _slug.includes('slip') || raw.slip) return 'advice';
    return 'quote';
  }

  private extractText(_slug: string, raw: Record<string, unknown>): string {
    // icanhazdadjoke
    if (raw.joke) return raw.joke as string;
    // JokeAPI
    if (raw.setup && raw.delivery) return `${raw.setup} ${raw.delivery}`;
    // Advice Slip
    if (raw.slip && typeof raw.slip === 'object') return (raw.slip as Record<string, unknown>).advice as string ?? '';
    // Stoicism Quote: { data: { quote: "...", author: "..." } }
    if (raw.data && typeof raw.data === 'object') {
      const d = raw.data as Record<string, unknown>;
      if (d.quote) return d.quote as string;
    }
    // Quotable
    if (raw.content) return raw.content as string;
    // They Said So / FavQs
    if (raw.quote && typeof raw.quote === 'object') return ((raw.quote as Record<string, unknown>).body ?? (raw.quote as Record<string, unknown>).quote) as string ?? '';
    if (raw.quoteText) return raw.quoteText as string;
    // Zen Quotes
    if (Array.isArray(raw) && raw.length > 0 && (raw[0] as Record<string, unknown>).q) return (raw[0] as Record<string, unknown>).q as string;
    // Plain text
    if (typeof raw === 'string') return raw;
    return JSON.stringify(raw);
  }

  private extractAuthor(_slug: string, raw: Record<string, unknown>): string | null {
    if (raw.author) return raw.author as string;
    if (raw.quoteAuthor) return raw.quoteAuthor as string;
    // Stoicism Quote: { data: { author: "...", quote: "..." } }
    if (raw.data && typeof raw.data === 'object') {
      const d = raw.data as Record<string, unknown>;
      if (d.author) return d.author as string;
    }
    if (raw.quote && typeof raw.quote === 'object') return ((raw.quote as Record<string, unknown>).author as string) ?? null;
    if (Array.isArray(raw) && raw.length > 0 && (raw[0] as Record<string, unknown>).a) return (raw[0] as Record<string, unknown>).a as string;
    return null;
  }

  private extractSource(raw: Record<string, unknown>): string | null {
    if (raw.source) return raw.source as string;
    return null;
  }

  private extractTags(raw: Record<string, unknown>): string[] {
    if (raw.tags && Array.isArray(raw.tags)) return raw.tags as string[];
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (typeof item === 'object' && item && (item as Record<string, unknown>).tag) return [(item as Record<string, unknown>).tag as string];
      }
    }
    return [];
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'personality',
      description: 'Universal quotes, jokes, advice for NPCs and game flavor',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['quote', 'joke', 'advice'] },
        },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['quote', 'joke', 'advice'] },
          text: { type: 'string' },
          author: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'PersonalityAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'PersonalityAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'PersonalityAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'PersonalityAdapter debug', obj),
};
