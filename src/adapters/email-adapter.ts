import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

/** Universal email validation output. */
interface UniversalEmailOutput {
  valid: boolean;
  disposable: boolean | null;
  mxFound: boolean | null;
  domain: string | null;
  normalizedEmail: string | null;
  reason: string | null;  // e.g. "invalid_syntax", "disposable_domain", "no_mx"
  provider: string;
}

export class EmailAdapter extends BaseAdapter {
  readonly categorySlug = 'email';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const normalized: UniversalEmailOutput = {
      valid: this.extractValid(raw),
      disposable: this.extractDisposable(raw),
      mxFound: this.extractMxFound(raw),
      domain: this.extractDomain(raw),
      normalizedEmail: this.extractNormalizedEmail(raw),
      reason: this.extractReason(raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private extractValid(raw: Record<string, unknown>): boolean {
    // MailCheck.ai: { status: 200, mx: true, disposable: false }
    if (raw.status === 200 && raw.mx === true) return true;
    if (raw.status !== undefined && raw.status !== 200) return false;
    return raw.valid === true || raw.format === true;
  }

  private extractDisposable(raw: Record<string, unknown>): boolean | null {
    if (typeof raw.disposable === 'boolean') return raw.disposable;
    return null;
  }

  private extractMxFound(raw: Record<string, unknown>): boolean | null {
    if (typeof raw.mx === 'boolean') return raw.mx;
    return null;
  }

  private extractDomain(raw: Record<string, unknown>): string | null {
    return (raw.domain as string) ?? null;
  }

  private extractNormalizedEmail(raw: Record<string, unknown>): string | null {
    return (raw.normalized_email as string) ?? (raw.email as string) ?? null;
  }

  private extractReason(raw: Record<string, unknown>): string | null {
    if (raw.disposable === true) return 'disposable_domain';
    if (raw.mx === false) return 'no_mx_records';
    if (raw.status === 400) return 'invalid_syntax';
    if (raw.valid === false) return 'invalid';
    return null;
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'email_validate',
      description: 'Validate email addresses — universal output',
      inputSchema: {
        type: 'object',
        properties: { email: { type: 'string', description: 'Email address to validate' } },
        required: ['email'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          disposable: { type: 'boolean' },
          mxFound: { type: 'boolean' },
          domain: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'EmailAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'EmailAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'EmailAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'EmailAdapter debug', obj),
};
