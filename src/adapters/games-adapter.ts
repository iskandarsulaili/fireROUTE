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

/** Universal games output.
 * Every games provider normalizes to one of these types. */
interface UniversalGamesOutput {
  type: 'trivia' | 'deck' | 'joke' | 'chess_puzzle' | 'game_list' | 'raw';
  payload: Record<string, unknown>;
  provider: string;
}

export class GamesAdapter extends BaseAdapter {
  readonly categorySlug = 'games-and-comics';

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  /**
   * SERVER-SIDE CONTENT SAFETY ENFORCEMENT.
   * Override normalizeRequest to inject safety params before the request goes out.
   *   - Open Trivia DB: enforce exclusion of category 23 (History) and 24 (Politics)
   *   - JokeAPI: enforce safe-mode and exclude Dark category
   */
  async normalizeRequest(
    provider: ProviderAdapterConfig,
    request: InternalExecuteRequest,
  ): Promise<NormalizedUpstreamRequest> {
    const params = { ...request.params };

    // Open Trivia DB safety: never pass category 23 (History) or 24 (Politics)
    if (params['category']) {
      const cat = parseInt(params['category'] as string, 10);
      if (cat === 23 || cat === 24) {
        params['category'] = '9'; // redirect to General Knowledge
        this.logger.warn(
          { provider: provider.name, requestedCategory: cat },
          'Content safety: Open Trivia DB category blocked. Rerouted to General Knowledge.',
        );
      }
    }

    // JokeAPI safety: always inject safe-mode, exclude Dark
    // Geek-Jokes: disabled in DB (no content safety mechanism)
    const isJokeApi =
      provider.name.toLowerCase().includes('jokeapi');
    if (isJokeApi) {
      params['safe-mode'] = '';
      params['blacklistFlags'] = 'nsfw,religious,political,racist,sexist,explicit';
    }

    return super.normalizeRequest(provider, { ...request, params });
  }

  async transformResponse(
    provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const raw = response.body as Record<string, unknown>;
    const slug = provider.name.toLowerCase();
    const normalized: UniversalGamesOutput = {
      type: this.detectType(slug, raw),
      payload: this.extractPayload(slug, raw),
      provider: provider.name,
    };
    return { data: normalized, providerName: provider.name };
  }

  private detectType(slug: string, raw: Record<string, unknown>): UniversalGamesOutput['type'] {
    if (slug.includes('trivia') || slug.includes('opentdb') || raw.response_code !== undefined) return 'trivia';
    if (slug.includes('deck') || slug.includes('card') || raw.deck_id || raw.shuffled) return 'deck';
    if (slug.includes('joke') || raw.joke || raw.setup) return 'joke';
    if (slug.includes('chess') || raw.pgn || raw.fen) return 'chess_puzzle';
    if (slug.includes('game') || raw.games || raw.data) return 'game_list';
    return 'raw';
  }

  private extractPayload(slug: string, raw: Record<string, unknown>): Record<string, unknown> {
    const type = this.detectType(slug, raw);
    switch (type) {
      case 'trivia': {
        const results = raw.results as Record<string, unknown>[] | undefined;
        const responseCode = raw.response_code as number | undefined;
        // Open Trivia DB rate limit or no results — trigger fallback
        if (responseCode === 1 || responseCode === 5) {
          throw new Error(
            responseCode === 5
              ? 'Open Trivia DB rate limited (1 req/5s). Use fallback trivia.'
              : 'Open Trivia DB returned no results. Use fallback trivia.',
          );
        }
        if (results && results.length > 0) {
          const first = results[0];
          return {
            question: first?.question,
            correct_answer: first?.correct_answer,
            incorrect_answers: first?.incorrect_answers,
            category: first?.category,
            difficulty: first?.difficulty,
          };
        }
        return raw;
      }
      case 'deck':
        return {
          deckId: raw.deck_id,
          remaining: raw.remaining,
          cards: raw.cards,
        };
      case 'joke': {
        const jokeText = (raw.joke as string) ?? ((raw.setup as string) + ' ' + (raw.delivery as string)).trim();
        return { text: jokeText, category: raw.category };
      }
      case 'chess_puzzle':
        return { pgn: raw.pgn, fen: raw.fen, rating: raw.rating };
      case 'game_list':
        return { games: raw.games ?? raw.data ?? raw };
      default:
        return raw;
    }
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'games',
      description: 'Game-related data: trivia, cards, jokes, chess, game listings — content safety enforced server-side',
      inputSchema: {
        type: 'object',
        properties: {
          provider: { type: 'string' },
          path: { type: 'string' },
        },
        required: ['path'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['trivia','deck','joke','chess_puzzle','game_list','raw'] },
          payload: { type: 'object' },
        },
      },
    };
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'GamesAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'GamesAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'GamesAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'GamesAdapter debug', obj),
};
