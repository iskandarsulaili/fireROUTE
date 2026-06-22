import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal dictionary output. */
interface UniversalDictionaryOutput {
  word: string | null;
  phonetic: string | null;
  definitions: string[];
  partOfSpeech: string | null;
  synonyms: string[];
  etymology: string | null;
  provider: string;
}

export class DictionaryAdapter extends BaseAdapter {
  readonly categorySlug = 'dictionaries';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const normalized: UniversalDictionaryOutput = {
      word: this.extractWord(raw),
      phonetic: this.extractPhonetic(raw),
      definitions: this.extractDefinitions(raw),
      partOfSpeech: this.extractPartOfSpeech(raw),
      synonyms: this.extractSynonyms(raw),
      etymology: this.extractEtymology(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private extractWord(raw: Record<string, unknown>): string | null {
    // Free Dictionary: [{ word: "hello" }]
    if (Array.isArray(raw) && raw.length > 0) return (raw[0] as Record<string, unknown>).word as string ?? null;
    if (raw.word) return raw.word as string;
    return null;
  }

  private extractPhonetic(raw: Record<string, unknown>): string | null {
    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      if (first.phonetic) return first.phonetic as string;
      if (first.phonetics && Array.isArray(first.phonetics) && first.phonetics.length > 0) {
        return ((first.phonetics[0] as Record<string, unknown>).text as string) ?? null;
      }
    }
    return null;
  }

  private extractDefinitions(raw: Record<string, unknown>): string[] {
    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      const meanings = first.meanings as Record<string, unknown>[] | undefined;
      if (meanings) {
        const defs: string[] = [];
        for (const meaning of meanings) {
          const definitions = meaning.definitions as Record<string, unknown>[] | undefined;
          if (definitions) {
            for (const def of definitions) {
              if (def.definition) defs.push(def.definition as string);
            }
          }
        }
        return defs;
      }
    }
    if (raw.text) return [raw.text as string];
    if (raw.definitions && Array.isArray(raw.definitions)) return raw.definitions as string[];
    return [];
  }

  private extractPartOfSpeech(raw: Record<string, unknown>): string | null {
    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      const meanings = first.meanings as Record<string, unknown>[] | undefined;
      if (meanings && meanings.length > 0) return (meanings[0] as Record<string, unknown>).partOfSpeech as string ?? null;
    }
    return null;
  }

  private extractSynonyms(raw: Record<string, unknown>): string[] {
    if (raw.synonyms && Array.isArray(raw.synonyms)) return raw.synonyms as string[];
    return [];
  }

  private extractEtymology(raw: Record<string, unknown>): string | null {
    if (raw.etymology) return raw.etymology as string;
    if (raw.etymologies && Array.isArray(raw.etymologies) && raw.etymologies.length > 0) return raw.etymologies[0] as string;
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'dictionary',
      description: 'Universal word definitions, synonyms, etymology',
      inputSchema: {
        type: 'object',
        properties: { word: { type: 'string' } },
        required: ['word'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          word: { type: 'string' },
          definitions: { type: 'array', items: { type: 'string' } },
          partOfSpeech: { type: 'string' },
          synonyms: { type: 'array', items: { type: 'string' } },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'DictionaryAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'DictionaryAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'DictionaryAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'DictionaryAdapter debug', obj),
};
