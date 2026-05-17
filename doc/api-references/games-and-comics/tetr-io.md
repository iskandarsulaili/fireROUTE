# TETR.IO

## Overview
- Provider: TETRA CHANNEL REST API
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::8`
- Official docs inspected: `https://tetr.io/about/api/`
- Official alternate page checked for scope clarification: `https://tetr.io/api/`
- Base URL: `https://ch.tetr.io/api`
- Auth: no account or bot account required for the reviewed TETRA CHANNEL routes
- HTTPS: yes
- Response format: JSON envelope with `success`, optional `error`, optional `cache`, and optional `data`
- Confirmed routes: `24`

## Scope note
- The official page explicitly says this documentation is only for the TETRA CHANNEL API at `https://ch.tetr.io/api/`.
- The same page explicitly says the main game API at `https://tetr.io/api/` is not allowed to be used without explicit written consent.
- fireROUTE should therefore model only the TETRA CHANNEL API routes documented below.

## Confirmed route inventory

### General
| Method | Path | Notes |
|---|---|---|
| GET | `/general/stats` | Service-wide statistics. |
| GET | `/general/activity` | Two-day activity graph. |

### Users
| Method | Path | Notes |
|---|---|---|
| GET | `/users/:user` | Detailed user profile. |
| GET | `/users/:user/summaries/40l` | 40 LINES summary. |
| GET | `/users/:user/summaries/blitz` | BLITZ summary. |
| GET | `/users/:user/summaries/zenith` | QUICK PLAY summary. |
| GET | `/users/:user/summaries/zenithex` | EXPERT QUICK PLAY summary. |
| GET | `/users/:user/summaries/league` | TETRA LEAGUE summary. |
| GET | `/users/:user/summaries/zen` | ZEN summary. |
| GET | `/users/:user/summaries/achievements` | Achievement summary. |
| GET | `/users/:user/summaries` | Combined summary response. |
| GET | `/users/search/:query` | Social-connection-based user lookup. |
| GET | `/users/by/:leaderboard` | Live user leaderboard. |
| GET | `/users/history/:leaderboard/:season` | Historical leaderboard by season. |
| GET | `/users/:user/records/:gamemode/:leaderboard` | Personal record history / top / recent / progression lists. |

### Records
| Method | Path | Notes |
|---|---|---|
| GET | `/records/:leaderboard` | Records leaderboard lookup. |
| GET | `/records/reverse` | Reverse lookup for one record by user, mode, and timestamp. |

### News
| Method | Path | Notes |
|---|---|---|
| GET | `/news/` | Latest news across streams. |
| GET | `/news/:stream` | Latest news for one stream. |

### Labs
| Method | Path | Notes |
|---|---|---|
| GET | `/labs/scoreflow/:user/:gamemode` | Condensed score history graph. |
| GET | `/labs/leagueflow/:user` | Condensed TETRA LEAGUE graph. |
| GET | `/labs/league_ranks` | Rank distribution / metadata snapshot. |

### Achievements
| Method | Path | Notes |
|---|---|---|
| GET | `/achievements/:k` | Achievement detail plus cutoffs and first 100 leaderboard entries. |
| GET | `/achievements/:k/entries` | Paginated achievement leaderboard entries. |

## Shared parameters and pagination
- Common path parameters documented on the official page:
  - `:user` — lowercase username or MongoID
  - `:query` — social connection lookup string for `/users/search/:query`
  - `:leaderboard` — leaderboard selector; route-specific allowed values are documented per endpoint
  - `:season` — season ID for historical leaderboard queries
  - `:gamemode` — route-specific game mode such as `40l`, `blitz`, `zenith`, `zenithex`, or `league`
  - `:stream` — `global` or `user_{userID}` for news routes
  - `:k` — achievement ID
- Pagination/query parameters documented on paginated routes:
  - `after` — upper bound prisecter for paging downward
  - `before` — lower bound prisecter for paging upward; reverses search order
  - `limit` — entry count, `1` to `100`, default `25`
- The docs explicitly say `before` and `after` may not be combined.
- TETR.IO defines a `prisecter` as three floats joined by colons. Returned entry field `p` can be used to continue pagination.
- Routes with extra documented query parameters:
  - `/users/by/:leaderboard` and `/users/history/:leaderboard/:season` also accept `country`
  - `/records/reverse` requires query `user`, `gamemode`, and `ts`
  - `/news/` and `/news/:stream` accept `limit`

## Authentication, caching, and rate guidance
- The docs explicitly say TETRA CHANNEL API usage does not require an account or bot account.
- The docs also explicitly say requests are logged.
- Official usage rules reviewed on the intro page:
  - do not flood the API
  - about one request per second is stated as fine for most cases
  - short bursts are acceptable
  - honor cache expiry instead of rerequesting unchanged data
  - send `X-Session-ID` when repeatedly rerequesting the same datasets so responses stay consistent and server-side DB calls are reduced
  - do not reuse the same `X-Session-ID` for unrelated requests
- The reference section says cache is not shared between workers; using the same `X-Session-ID` helps stay on the same cache context.

## Response and error notes
- Successful responses use a standard envelope with:
  - `success`
  - optional `cache`
  - optional `data`
- Unsuccessful responses use:
  - `success`
  - optional `error`
- The reference page documents the cache object fields:
  - `status` — `hit`, `miss`, or `awaited`
  - `cached_at`
  - `cached_until`
- The reviewed page documents endpoint-specific cache times, including:
  - `60` seconds for `/general/stats`
  - `10` minutes for `/general/activity`
  - `5` minutes for many user and achievement routes
  - `1` second for `/news/`
  - `1` minute for `/news/:stream`
  - alternate cache rule for `/labs/league_ranks`
- The reviewed docs do not publish one standalone global error-schema reference beyond the repeated `error? (object)` envelope field.

## Important usage notes
- The API may change with or without notice; the docs explicitly warn that reverse compatibility is hoped for but not guaranteed.
- Some leaderboard and record routes explicitly remind clients to use `X-Session-ID` for consistent pagination over cached data.
- The docs note that career bests for QUICK PLAY and EXPERT QUICK PLAY update on weekly revolve time rather than continuously.
- The achievement info route returns the first `100` leaderboard entries inline; the dedicated `/achievements/:k/entries` route is the paginated continuation surface.
- The reference section documents reusable structures for cache, records, achievements, stream IDs, and news objects.

## Integration notes for fireROUTE
- Keep TETRA CHANNEL and the restricted main game API separate.
- Model this provider as a public read-only JSON API rooted at `https://ch.tetr.io/api`.
- Preserve endpoint-specific cache times and expose/use `X-Session-ID` where clients need consistency.
- Implement prisecter-based pagination exactly as documented on leaderboard and record-style routes.

## Sources inspected
- `https://tetr.io/about/api/`
- `https://tetr.io/api/`
