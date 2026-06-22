import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal book output. */
interface UniversalBooksOutput {
  type: 'book' | 'poem' | 'metadata';
  title: string | null;
  author: string | null;
  subjects: string[];
  text: string | null;  // first few lines
  language: string | null;
  downloadUrl: string | null;
  provider: string;
}

export class BooksAdapter extends BaseAdapter {
  readonly categorySlug = 'books';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const slug = provider.name.toLowerCase();
    const normalized: UniversalBooksOutput = {
      type: slug.includes('poem') || slug.includes('poetry') ? 'poem' : slug.includes('openlibrary') ? 'metadata' : 'book',
      title: this.extractTitle(raw),
      author: this.extractAuthor(raw),
      subjects: this.extractSubjects(raw),
      text: this.extractText(raw),
      language: this.extractLanguage(raw),
      downloadUrl: this.extractDownloadUrl(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private extractTitle(raw: Record<string, unknown>): string | null {
    if (raw.title) return raw.title as string;
    if (raw.name) return raw.name as string;
    // Gutendex: { results: [{ title: "..." }] }
    const results = raw.results as Record<string, unknown>[] | undefined;
    if (results && results.length > 0) return results[0]?.title as string ?? null;
    return null;
  }

  private extractAuthor(raw: Record<string, unknown>): string | null {
    if (raw.authors && Array.isArray(raw.authors) && raw.authors.length > 0) {
      const first = raw.authors[0] as Record<string, unknown>;
      if (first.name) return first.name as string;
    }
    if (raw.author) {
      if (typeof raw.author === 'object') return (raw.author as Record<string, unknown>).name as string ?? null;
      return raw.author as string;
    }
    // Gutendex: { results: [{ authors: [{ name: "Austen, Jane" }] }] }
    const results = raw.results as Record<string, unknown>[] | undefined;
    if (results && results.length > 0) {
      const firstResult = results[0] as Record<string, unknown>;
      const authors = firstResult.authors as Record<string, unknown>[] | undefined;
      if (authors && authors.length > 0) {
        return (authors[0] as Record<string, unknown>).name as string ?? null;
      }
    }
    return null;
  }

  private extractSubjects(raw: Record<string, unknown>): string[] {
    if (raw.subjects && Array.isArray(raw.subjects)) return raw.subjects as string[];
    if (raw.subject && typeof raw.subject === 'string') return [raw.subject as string];
    return [];
  }

  private extractText(raw: Record<string, unknown>): string | null {
    if (raw.text) return typeof raw.text === 'string' ? raw.text : (raw.text as string[]).join(' ') ?? null;
    if (raw.lines && Array.isArray(raw.lines)) return raw.lines.slice(0, 5).join(' ');
    // PoetryDB: [ { lines: [...] } ]
    if (Array.isArray(raw) && raw.length > 0) {
      const item = raw[0] as Record<string, unknown>;
      if (item.lines) return (item.lines as string[]).slice(0, 5).join(' ');
    }
    return null;
  }

  private extractLanguage(raw: Record<string, unknown>): string | null {
    if (raw.languages && Array.isArray(raw.languages) && raw.languages.length > 0) {
      const lang = raw.languages[0];
      if (typeof lang === 'string') return lang;
      if (typeof lang === 'object') return (lang as Record<string, unknown>).code as string ?? null;
    }
    if (raw.language) return raw.language as string;
    return null;
  }

  private extractDownloadUrl(raw: Record<string, unknown>): string | null {
    if (raw.formats && typeof raw.formats === 'object') {
      const formats = raw.formats as Record<string, unknown>;
      if (formats['text/plain; charset=utf-8']) return formats['text/plain; charset=utf-8'] as string;
      if (formats['application/epub+zip']) return formats['application/epub+zip'] as string;
    }
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'books',
      description: 'Books, poetry, literature metadata — universal output',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['book', 'poem', 'metadata'] },
          title: { type: 'string' },
          author: { type: 'string' },
          text: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'BooksAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'BooksAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'BooksAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'BooksAdapter debug', obj),
};
