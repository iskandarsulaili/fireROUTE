import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/**
 * Provider-agnostic normalizer for the categories that never had an adapter.
 *
 * WHY GENERIC
 * -----------
 * Thirteen categories (animals, anime, calendar, cloud-storage, currency,
 * development, finance, news, open-source, security, test-data, tracking,
 * url-shorteners) each carry live, keyless providers whose upstreams answer, yet
 * every call failed with
 *
 *     UNSUPPORTED_CATEGORY — "Category 'animals' exists but has no adapter
 *     implementation yet"
 *
 * A hand-written extractor per provider would mean 87 extractors written against
 * payloads nobody has captured — guesswork dressed as support, and the first real
 * change upstream would quietly break it. Instead this adapter reports what the
 * provider actually said: it locates the useful values by their conventional names,
 * keeps the complete body under `raw` (so nothing is lost, and a later tailored
 * extractor has its fixture), and never invents a field it did not find.
 *
 * The request side needs nothing here — `BaseAdapter.buildUrl` already applies each
 * provider's declared `metadata.path`, `queryDefaults` and `paramAliases`.
 */

/** Conventional names a provider might use for a human-readable label. */
const TITLE_KEYS = ['title', 'name', 'label', 'question', 'headline', 'subject', 'word', 'term', 'symbol', 'code', 'id_str'];
/** Conventional names for the main body of text. */
const TEXT_KEYS = ['text', 'content', 'summary', 'description', 'fact', 'joke', 'quote', 'definition', 'meaning', 'value', 'message', 'body', 'detail'];
/** Conventional names for a numeric or date-ish reading. */
const VALUE_KEYS = ['price', 'amount', 'rate', 'value', 'score', 'count', 'temperature', 'number'];
/** Keys that carry no information on their own. */
const NOISE_KEYS = new Set(['success', 'status', 'timestamp', 'meta', 'metadata', 'pagination', 'page', 'links', '_links']);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export class SimpleCategoryAdapter extends BaseAdapter {
  readonly categorySlug: string;

  constructor(categorySlug: string, logger: Logger = defaultLogger) {
    super(logger);
    this.categorySlug = categorySlug;
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const body = response.body as unknown;
    const record = asRecord(body);
    const list = Array.isArray(body)
      ? body
      : record
        ? this.singleArrayField(record)
        : null;

    const data: Record<string, unknown> = {
      type: this.categorySlug,
      provider: provider.name,
      title: this.findString(record, TITLE_KEYS) ?? (list && asRecord(list[0]) ? this.findString(asRecord(list[0]) as Record<string, unknown>, TITLE_KEYS) : null),
      text: this.findString(record, TEXT_KEYS) ?? (typeof body === 'string' ? body : null),
      values: this.collectValues(record),
      // A collection payload is summarized as its entries, each trimmed to the
      // fields that usually matter, so a caller can render a list without knowing
      // the provider's schema.
      items: list ? list.slice(0, 50).map((entry) => this.summarizeEntry(entry)) : null,
      itemCount: list ? list.length : null,
      // Nothing is discarded: the full upstream body travels with the response.
      raw: body,
    };

    return { data, providerName: provider.name };
  }

  /**
   * The tool definition every adapter must publish. It describes this adapter's
   * actual contract — the normalized envelope — rather than one provider's schema,
   * because the category's providers differ and this normalizer is shape-agnostic.
   */
  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: this.categorySlug,
      description: `Providers in the '${this.categorySlug}' category, normalized to a common envelope (title, text, values, items) with the complete upstream body preserved under 'raw'.`,
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Canonical path for the category; the provider\'s own documented path is applied when it declares one.' },
          params: { type: 'object', description: 'Query parameters, mapped through the provider\'s declared aliases.' },
        },
        required: ['path'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'The category slug.' },
          provider: { type: 'string' },
          title: { type: 'string' },
          text: { type: 'string' },
          values: { type: 'object', description: 'Conventional numeric readings found in the body (price, rate, value, ...).' },
          items: { type: 'array', items: { type: 'object' }, description: 'Collection entries, trimmed to their conventional fields.' },
          itemCount: { type: 'number' },
          raw: { description: 'The complete upstream body, so no information is lost.' },
        },
      },
    };
  }

  /** A body shaped `{ data: [...] }`, `{ results: [...] }` or `{ items: [...] }`. */
  private singleArrayField(record: Record<string, unknown>): unknown[] | null {
    const candidates = ['data', 'results', 'items', 'entries', 'objects', 'records', 'list', 'rows'];
    for (const key of candidates) {
      const value = record[key];
      if (Array.isArray(value)) return value;
      const nested = asRecord(value);
      if (nested) {
        for (const inner of candidates) {
          if (Array.isArray(nested[inner])) return nested[inner] as unknown[];
        }
      }
    }
    return null;
  }

  /** Keep the conventional fields of one collection entry, plus its raw form. */
  private summarizeEntry(entry: unknown): Record<string, unknown> {
    const record = asRecord(entry);
    if (!record) return { value: entry };
    const trimmed: Record<string, unknown> = {};
    const title = this.findString(record, TITLE_KEYS);
    const text = this.findString(record, TEXT_KEYS);
    if (title !== null) trimmed['title'] = title;
    if (text !== null) trimmed['text'] = text;
    for (const [key, value] of Object.entries(record)) {
      if (NOISE_KEYS.has(key)) continue;
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        trimmed[key] = value;
      }
    }
    return trimmed;
  }

  /** Every conventional numeric reading present in the body. */
  private collectValues(record: Record<string, unknown> | null): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    if (!record) return values;
    for (const key of VALUE_KEYS) {
      const value = record[key];
      if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) {
        values[key] = value;
      }
    }
    return values;
  }

  /** First non-empty string under any of `keys`, including one level of nesting. */
  private findString(record: Record<string, unknown> | null, keys: string[]): string | null {
    const sources: Record<string, unknown>[] = [];
    if (record) {
      sources.push(record);
      for (const nested of Object.values(record)) {
        const inner = asRecord(nested);
        if (inner) sources.push(inner);
      }
    }
    for (const source of sources) {
      for (const key of keys) {
        const value = source[key];
        if (typeof value === 'string' && value.trim() !== '') return value;
        if (typeof value === 'number') return String(value);
      }
    }
    return null;
  }
}

const defaultLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
