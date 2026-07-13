import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  NormalizedUpstreamRequest,
  InternalExecuteRequest,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/**
 * Universal open-data output.
 * Normalizes Wikipedia, Wikidata, and other free public data APIs
 * into a consistent shape for PAW content pipelines.
 */
interface UniversalOpenDataOutput {
  /** Type of result: page, search_result, entity, image, random, search_results, query_results */
  type: string;
  /** Title or label of the result */
  title: string | null;
  /** Extracted text content (first ~500 chars) */
  text: string | null;
  /** Source provider name */
  source: string;
  /** Source URL for attribution */
  sourceUrl: string | null;
  /** Category tags (e.g., ["history", "science", "mythology"]) */
  tags: string[];
  /** Geographic/cultural region (e.g., "global", "asia", "europe", "americas", "africa", "oceania", "middle_east", "southeast_asia") */
  region: string;
  /** Cultural origin (e.g., "western", "eastern", "southeast_asian", "middle_eastern", "latin", "african", "indigenous", "global") */
  culture: string;
  /** Language code */
  language: string | null;
  /** Raw response preserved for advanced use */
  raw: unknown;
  /** Nested results for multi-result responses */
  results?: unknown[];
}

/** Helper to build a multi-result output that satisfies UniversalOpenDataOutput */
function multiResult(
  type: string,
  results: unknown[],
  source: string,
  raw: unknown,
): UniversalOpenDataOutput {
  return { type, title: null, text: null, source, sourceUrl: null, tags: [], region: 'global', culture: 'global', language: 'en', raw, results };
}

export class OpenDataAdapter extends BaseAdapter {
  readonly categorySlug = 'open-data';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const name = provider.name.toLowerCase();

    if (name === 'wikipedia') {
      return this.transformWikipedia(raw, provider);
    }
    if (name === 'wikidata') {
      return this.transformWikidata(raw, provider);
    }
    if (name === 'wikimedia commons') {
      return this.transformCommons(raw, provider);
    }

    // Generic passthrough for unknown open-data providers
    return {
      data: {
        type: 'raw',
        title: null,
        text: null,
        source: provider.name,
        sourceUrl: null,
        tags: [],
        region: 'global',
        culture: 'global',
        language: null,
        raw,
      } as UniversalOpenDataOutput,
      providerName: provider.name,
    };
  }

  /**
   * Override normalizeRequest to inject provider-specific auth headers
   * that don't fit the standard auth patterns (e.g., GENESIS username/password).
   */
  async normalizeRequest(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Promise<NormalizedUpstreamRequest> {
    const normalized = await super.normalizeRequest(provider, request);

    // GENESIS: inject username/password headers for guest access
    const name = provider.name.toLowerCase();
    if (name === 'genesis') {
      normalized.headers['username'] = 'GAST';
      normalized.headers['password'] = 'GAST';
    }

    return normalized;
  }

  /**
   * Transform Wikipedia REST API response.
   * Handles: page content, search results, random pages.
   */
  private transformWikipedia(
    raw: Record<string, unknown>,
    provider: ProviderAdapterConfig,
  ): { data: UniversalOpenDataOutput; providerName: string } {
    // Search results: { pages: [{ id, key, title, excerpt, description, thumbnail }] }
    if (raw.pages && Array.isArray(raw.pages)) {
      const pages = raw.pages as Record<string, unknown>[];
      const results = pages.map((page) => ({
        type: 'search_result' as const,
        title: (page.title as string) ?? null,
        text: (page.excerpt as string) ?? (page.description as string) ?? null,
        source: provider.name,
        sourceUrl: page.key
          ? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key as string)}`
          : null,
        tags: this.inferTags(page.title as string ?? '', page.excerpt as string ?? ''),
        region: this.inferRegion(page.title as string ?? '', page.excerpt as string ?? ''),
        culture: this.inferCulture(page.title as string ?? '', page.excerpt as string ?? ''),
        language: 'en',
        raw: page,
      }));
      return {
        data: results.length === 1 && results[0]
          ? (results[0] as unknown as UniversalOpenDataOutput)
          : multiResult('search_results', results, provider.name, raw),
        providerName: provider.name,
      };
    }

    // Page content: { id, key, title, latest, content_model, source }
    if (raw.source || raw.title) {
      const title = raw.title as string ?? null;
      const source = raw.source as string ?? null;
      return {
        data: {
          type: 'page',
          title,
          text: source ? source.substring(0, 2000) : null,
          source: provider.name,
          sourceUrl: raw.key
            ? `https://en.wikipedia.org/wiki/${encodeURIComponent(raw.key as string)}`
            : null,
          tags: this.inferTags(title ?? '', source ?? ''),
          region: this.inferRegion(title ?? '', source ?? ''),
          culture: this.inferCulture(title ?? '', source ?? ''),
          language: 'en',
          raw,
        } as UniversalOpenDataOutput,
        providerName: provider.name,
      };
    }

    // Fallback: return raw
    return {
      data: {
        type: 'raw',
        title: null,
        text: null,
        source: provider.name,
        sourceUrl: null,
        tags: [],
        region: 'global',
        culture: 'global',
        language: 'en',
        raw,
      } as UniversalOpenDataOutput,
      providerName: provider.name,
    };
  }

  /**
   * Transform Wikidata Action API response.
   * Handles: entity lookup (wbgetentities), query results.
   */
  private transformWikidata(
    raw: Record<string, unknown>,
    provider: ProviderAdapterConfig,
  ): { data: UniversalOpenDataOutput; providerName: string } {
    // wbgetentities: { entities: { Q123: { id, labels, descriptions, claims, ... } } }
    if (raw.entities && typeof raw.entities === 'object') {
      const entities = raw.entities as Record<string, unknown>;
      const entityIds = Object.keys(entities);
      if (entityIds.length > 0) {
        const firstId: string = entityIds[0]!;
        const entityVal: unknown = (entities as any)[firstId];
        if (!entityVal || typeof entityVal !== 'object') {
          return this.fallbackRaw(raw, provider);
        }
        const entity = entityVal as Record<string, unknown>;
        const label = this.extractLabel(entity);
        const description = this.extractDescription(entity);
        return {
          data: {
            type: 'entity',
            title: label ?? firstId,
            text: description ?? null,
            source: provider.name,
            sourceUrl: `https://www.wikidata.org/wiki/${firstId}`,
            tags: [],
            region: 'global',
            culture: 'global',
            language: 'en',
            raw: entity,
          } as UniversalOpenDataOutput,
          providerName: provider.name,
        };
      }
    }

    // Query results: { results: { bindings: [...] } }
    if (raw.results && typeof raw.results === 'object') {
      const results = raw.results as Record<string, unknown>;
      const bindings = results.bindings as Record<string, unknown>[] | undefined;
      if (bindings && bindings.length > 0) {
        const items = bindings.map((b) => {
          const item = b.item as Record<string, unknown> ?? {};
          const itemLabel = b.itemLabel as Record<string, unknown> ?? {};
          const itemDescription = b.itemDescription as Record<string, unknown> ?? {};
          return {
            type: 'query_result' as const,
            title: (itemLabel.value as string) ?? null,
            text: (itemDescription.value as string) ?? null,
            source: provider.name,
            sourceUrl: (item.value as string) ?? null,
            tags: [],
            region: this.inferRegion((itemLabel.value as string) ?? '', ''),
            culture: this.inferCulture((itemLabel.value as string) ?? '', ''),
            language: 'en',
            raw: b,
          };
        });
        return {
          data: items.length === 1 && items[0]
            ? (items[0] as unknown as UniversalOpenDataOutput)
            : multiResult('query_results', items, provider.name, raw),
          providerName: provider.name,
        };
      }
    }

    return {
      data: {
        type: 'raw',
        title: null,
        text: null,
        source: provider.name,
        sourceUrl: null,
        tags: [],
        region: 'global',
        culture: 'global',
        language: 'en',
        raw,
      } as UniversalOpenDataOutput,
      providerName: provider.name,
    };
  }

  /**
   * Transform Wikimedia Commons API response.
   */
  private transformCommons(
    raw: Record<string, unknown>,
    provider: ProviderAdapterConfig,
  ): { data: UniversalOpenDataOutput; providerName: string } {
    // Commons search results
    if (raw.query && typeof raw.query === 'object') {
      const query = raw.query as Record<string, unknown>;
      const pages = query.pages as Record<string, unknown> | undefined;
      if (pages) {
        const pageKeys = Object.keys(pages);
        if (pageKeys.length > 0) {
          const firstKey: string = pageKeys[0]!;
          const pageVal: unknown = (pages as any)[firstKey];
          if (!pageVal || typeof pageVal !== 'object') {
            return this.fallbackRaw(raw, provider);
          }
          const page = pageVal as Record<string, unknown>;
          return {
            data: {
              type: 'media',
              title: (page.title as string) ?? null,
              text: (page.description as string) ?? (page.extract as string) ?? null,
              source: provider.name,
              sourceUrl: page.imageinfo
                ? ((page.imageinfo as Record<string, unknown>[])[0]?.descriptionurl as string) ?? null
                : null,
              tags: [],
              region: 'global',
              culture: 'global',
              language: 'en',
              raw: page,
            } as UniversalOpenDataOutput,
            providerName: provider.name,
          };
        }
      }
    }

    return {
      data: {
        type: 'raw',
        title: null,
        text: null,
        source: provider.name,
        sourceUrl: null,
        tags: [],
        region: 'global',
        culture: 'global',
        language: 'en',
        raw,
      } as UniversalOpenDataOutput,
      providerName: provider.name,
    };
  }

  /**
   * Infer content tags from title and text for categorization.
   * Used by PAW to decide which content pool a reference belongs to.
   */
  private inferTags(title: string, text: string): string[] {
    const combined = `${title} ${text}`.toLowerCase();
    const tags: string[] = [];

    // Mythology
    if (/zeus|thor|odin|heracles|hercules|athena|apollo|poseidon|hades|myth|legend|folklore|fairy|tale|goddess|norse|greek|roman/.test(combined)) {
      tags.push('mythology');
    }
    // History
    if (/ancient|medieval|century|empire|kingdom|war|battle|revolution|dynasty|pharaoh|roman|greek|viking|samurai/.test(combined)) {
      tags.push('history');
    }
    // Science
    if (/science|physics|chemistry|biology|astronomy|evolution|dna|quantum|gravity|star|planet|galaxy|element|molecule/.test(combined)) {
      tags.push('science');
    }
    // Nature
    if (/forest|ocean|mountain|river|desert|animal|plant|flower|tree|bird|fish|creature|wild/.test(combined)) {
      tags.push('nature');
    }
    // Literature
    if (/shakespeare|poem|poetry|novel|author|writer|literature|book|story|tale|fable|parable/.test(combined)) {
      tags.push('literature');
    }
    // Philosophy
    if (/philosophy|wisdom|truth|justice|virtue|ethics|moral|socrates|plato|aristotle|confucius/.test(combined)) {
      tags.push('philosophy');
    }
    // Art
    if (/painting|sculpture|artist|canvas|portrait|landscape|renaissance|baroque|impressionist/.test(combined)) {
      tags.push('art');
    }
    // Music
    if (/music|song|melody|rhythm|instrument|symphony|opera|composer|orchestra/.test(combined)) {
      tags.push('music');
    }

    return tags;
  }

  /**
   * Infer geographic region from title and text content.
   * Returns a region tag that PAW can use for contextual filtering.
   */
  private inferRegion(title: string, _text: string): string {
    const titleOnly = title.toLowerCase();

    const match = (patterns: string[]): boolean =>
      patterns.some(p => {
        const regex = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(titleOnly);
      });

    if (match(['malaysia', 'kuala lumpur', 'putrajaya', 'borneo', 'sabah', 'sarawak'])) return 'southeast_asia';
    if (match(['indonesia', 'jakarta', 'bali', 'java', 'sumatra', 'sulawesi', 'nusantara'])) return 'southeast_asia';
    if (match(['philippines', 'manila', 'thailand', 'bangkok', 'vietnam', 'hanoi', 'cambodia', 'phnom penh', 'laos', 'myanmar', 'yangon', 'singapore', 'brunei', 'timor leste', 'asean'])) return 'southeast_asia';

    if (match(['japan', 'tokyo', 'china', 'beijing', 'shanghai', 'korea', 'seoul', 'taiwan', 'taipei', 'hong kong'])) return 'east_asia';
    if (match(['india', 'mumbai', 'delhi', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'himalayas', 'ganges'])) return 'south_asia';

    if (match(['france', 'paris', 'germany', 'berlin', 'italy', 'rome', 'spain', 'madrid', 'united kingdom', 'london', 'england', 'britain', 'europe', 'scandinavia', 'nordic', 'mediterranean'])) return 'europe';

    if (match(['egypt', 'cairo', 'nigeria', 'lagos', 'kenya', 'nairobi', 'south africa', 'ghana', 'ethiopia', 'sahara desert', 'nile river', 'africa'])) return 'africa';

    if (match(['united states', 'usa', 'america', 'new york', 'washington', 'california', 'canada', 'ottawa', 'mexico', 'mexico city', 'brazil', 'brasilia', 'argentina', 'amazon rainforest', 'andes'])) return 'americas';

    if (match(['australia', 'sydney', 'melbourne', 'new zealand', 'auckland', 'pacific ocean', 'oceania', 'polynesia', 'micronesia', 'melanesia'])) return 'oceania';

    if (match(['middle east', 'iran', 'iraq', 'saudi arabia', 'dubai', 'turkey', 'ankara', 'israel', 'jerusalem', 'palestine', 'syria', 'jordan', 'lebanon', 'arabia'])) return 'middle_east';

    if (match(['russia', 'moscow', 'siberia', 'ukraine', 'kyiv', 'kazakhstan', 'central asia'])) return 'central_asia';

    if (match(['arctic', 'antarctic', 'greenland', 'iceland', 'north pole', 'south pole', 'tundra'])) return 'polar';

    return 'global';
  }

  /**
   * Infer cultural origin from title and text content.
   * Helps PAW match references to player cultural context.
   */
  private inferCulture(title: string, _text: string): string {
    const titleOnly = title.toLowerCase();

    const match = (patterns: string[]): boolean =>
      patterns.some(p => {
        const regex = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(titleOnly);
      });

    if (match(['malay', 'melayu', 'wayang', 'batik', 'gamelan', 'keris', 'nusantara', 'pantun', 'silat', 'javanese', 'sundanese', 'dayak', 'iban', 'kadazan'])) return 'southeast_asian';
    if (match(['shinto', 'zen', 'tao', 'confucius', 'samurai', 'ninja', 'geisha', 'anime', 'manga', 'dynasty', 'feng shui', 'yin yang'])) return 'eastern';
    if (match(['hindu', 'veda', 'karma', 'yoga', 'ayurveda', 'sanskrit', 'guru', 'bollywood', 'sari', 'ramayana', 'mahabharata'])) return 'south_asian';
    if (match(['greek', 'roman', 'norse', 'celtic', 'slavic', 'viking', 'medieval', 'renaissance', 'enlightenment', 'baroque', 'shakespeare', 'socrates', 'plato', 'aristotle'])) return 'western';
    if (match(['islam', 'quran', 'arabic', 'caliph', 'mosque', 'minaret', 'sultan', 'bedouin', 'berber', 'ottoman', 'persian', 'sufi', 'hajj'])) return 'middle_eastern';
    if (match(['yoruba', 'zulu', 'masai', 'ashanti', 'bantu', 'swahili', 'pharaoh', 'pyramid', 'hieroglyph'])) return 'african';
    if (match(['aztec', 'maya', 'inca', 'andean', 'amazon', 'indigenous', 'shaman', 'totem', 'pueblo', 'cherokee', 'navajo'])) return 'indigenous';
    if (match(['aboriginal', 'maori', 'pacific', 'polynesian', 'haka', 'dreamtime', 'didgeridoo', 'tiki', 'moai'])) return 'pacific';

    return 'global';
  }

  private extractLabel(entity: Record<string, unknown>): string | null {
    const labels = entity.labels as Record<string, Record<string, unknown>> | undefined;
    if (labels?.en) return labels.en.value as string ?? null;
    if (labels) {
      const first = Object.values(labels)[0];
      if (first) return first.value as string ?? null;
    }
    return null;
  }

  private extractDescription(entity: Record<string, unknown>): string | null {
    const descriptions = entity.descriptions as Record<string, Record<string, unknown>> | undefined;
    if (descriptions?.en) return descriptions.en.value as string ?? null;
    if (descriptions) {
      const first = Object.values(descriptions)[0];
      if (first) return first.value as string ?? null;
    }
    return null;
  }

  private fallbackRaw(
    raw: Record<string, unknown>,
    provider: ProviderAdapterConfig,
  ): { data: UniversalOpenDataOutput; providerName: string } {
    return {
      data: {
        type: 'raw',
        title: null,
        text: null,
        source: provider.name,
        sourceUrl: null,
        tags: [],
        region: 'global',
        culture: 'global',
        language: 'en',
        raw,
      } as UniversalOpenDataOutput,
      providerName: provider.name,
    };
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'open-data',
      description: 'Free public data APIs — Wikipedia, Wikidata, Wikimedia Commons. No authentication required for read operations.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'API path (e.g., /w/rest.php/v1/page/Earth, /w/api.php)' },
          params: { type: 'object', description: 'Query parameters' },
        },
        required: ['path'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['page', 'search_result', 'entity', 'media', 'raw'] },
          title: { type: 'string' },
          text: { type: 'string' },
          source: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'OpenDataAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'OpenDataAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'OpenDataAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'OpenDataAdapter debug', obj),
};
