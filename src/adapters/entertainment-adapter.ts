import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal entertainment output. */
interface UniversalEntertainmentOutput {
  type: 'fact' | 'joke';
  text: string;
  source: string | null;
  provider: string;
}

export class EntertainmentAdapter extends BaseAdapter {
  readonly categorySlug = 'entertainment';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const normalized: UniversalEntertainmentOutput = {
      type: this.detectType(raw),
      text: this.extractText(raw),
      source: this.extractSource(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private detectType(raw: Record<string, unknown>): UniversalEntertainmentOutput['type'] {
    if (raw.joke || raw.value) return 'joke';
    return 'fact';
  }

  private extractText(raw: Record<string, unknown>): string {
    // Random Useless Facts: { text: "..." }
    if (raw.text) return raw.text as string;
    // Random Useless Facts (v1): { fact: "..." }
    if (raw.fact) return raw.fact as string;
    // chucknorris.io: { value: "..." }
    if (raw.value) return raw.value as string;
    return JSON.stringify(raw);
  }

  private extractSource(raw: Record<string, unknown>): string | null {
    if (raw.source) return raw.source as string;
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'entertainment',
      description: 'Facts and fun content — universal output with `text` field',
      inputSchema: {
        type: 'object',
        properties: { type: { type: 'string', enum: ['fact', 'joke'] } },
        required: [],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          text: { type: 'string' },
          source: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'EntertainmentAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'EntertainmentAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'EntertainmentAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'EntertainmentAdapter debug', obj),
};
