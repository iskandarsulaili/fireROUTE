# RAWG.io

## Overview
- Provider: RAWG Video Games Database API
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::5`
- Official docs landing page: `https://rawg.io/apidocs`
- Official ReDoc / OpenAPI page: `https://api.rawg.io/docs/`
- Base URL: `https://api.rawg.io/api`
- Auth: required API key in query parameter `key`
- HTTPS: yes
- Response format: `application/json`
- Pagination: list responses use `count`, `next`, `previous`, and `results`; list endpoints document `page` and `page_size`
- Rate limits / plan limits confirmed on official pages:
  - free plan card on `rawg.io/apidocs`: up to `20,000 requests per month`
  - business plan card on `rawg.io/apidocs`: up to `50,000 requests per month`
  - enterprise plan card on `rawg.io/apidocs`: up to `1,000,000 requests per month`
  - exact per-second or per-minute rate-limit headers are not documented on the inspected official pages
- Manual status: `manually_documented`
- Confirmed routes: `30`

## Auth, errors, pagination, and format notes
- The official docs say: `You must include an API key with every request.`
- The docs also warn: `If you don’t provide it, we may ban your requests.`
- A live official request to `https://api.rawg.io/api/games` without `key` returned JSON:
  - `{"error": "The key parameter is not provided"}`
- The ReDoc reference documents `application/json` response content.
- Standard paginated collection responses on the inspected routes expose:
  - `count`
  - `next`
  - `previous`
  - `results`
- The inspected official pages did not publish a global error-code table or a reusable error schema beyond the observed missing-key JSON error.

## Confirmed endpoints
All routes visible on the official ReDoc page were GET routes under `https://api.rawg.io/api`.

### Creators
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/creator-roles` | `page`, `page_size` | List creator positions / jobs. |
| GET | `/creators` | `page`, `page_size` | List game creators. |
| GET | `/creators/{id}` | path: `id` | Creator detail route. |

### Developers
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/developers` | `page`, `page_size` | List developers. |
| GET | `/developers/{id}` | path: `id` | Developer detail route. |

### Games
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/games` | `page`, `page_size`, `search`, `search_precise`, `search_exact`, `parent_platforms`, `platforms`, `stores`, `developers`, `publishers`, `genres`, `tags`, `creators`, `dates`, `updated`, `platforms_count`, `metacritic`, `exclude_collection`, `exclude_additions`, `exclude_parents`, `exclude_game_series`, `exclude_stores`, `ordering` | Main game discovery/search route. Official docs show `ordering` fields `name`, `released`, `added`, `created`, `updated`, `rating`, `metacritic`; descending order uses a leading `-`. |
| GET | `/games/{id}` | path: `id` | Game detail route. Docs say `id` can be an ID or a slug identifying the game. |
| GET | `/games/{game_pk}/additions` | path: `game_pk`; query: `page`, `page_size` | DLCs, GOTY editions, companion apps, and other additions. |
| GET | `/games/{game_pk}/development-team` | path: `game_pk`; query: `ordering`, `page`, `page_size` | Individual creators who were part of development. |
| GET | `/games/{game_pk}/game-series` | path: `game_pk`; query: `page`, `page_size` | Other games in the same series. |
| GET | `/games/{game_pk}/parent-games` | path: `game_pk`; query: `page`, `page_size` | Parent games for DLCs and editions. |
| GET | `/games/{game_pk}/screenshots` | path: `game_pk`; query: `ordering`, `page`, `page_size` | Screenshots for the game. |
| GET | `/games/{game_pk}/stores` | path: `game_pk`; query: `ordering`, `page`, `page_size` | Store links for the game. |
| GET | `/games/{id}/achievements` | path: `id` | Game achievements. |
| GET | `/games/{id}/movies` | path: `id` | Game trailers. |
| GET | `/games/{id}/reddit` | path: `id` | Recent posts from the game's subreddit. |
| GET | `/games/{id}/suggested` | path: `id` | Visually similar games; official docs say this is available only for business and enterprise API users. |
| GET | `/games/{id}/twitch` | path: `id` | Twitch streams associated with the game; official docs say this is available only for business and enterprise API users. |
| GET | `/games/{id}/youtube` | path: `id` | YouTube videos associated with the game; official docs say this is available only for business and enterprise API users. |

### Genres
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/genres` | `ordering`, `page`, `page_size` | List video game genres. |
| GET | `/genres/{id}` | path: `id` | Genre detail route. |

### Platforms
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/platforms` | `ordering`, `page`, `page_size` | List video game platforms. |
| GET | `/platforms/lists/parents` | `ordering`, `page`, `page_size` | Parent-platform list. Docs use PlayStation as the example parent for PS2 and PS4. |
| GET | `/platforms/{id}` | path: `id` | Platform detail route. |

### Publishers
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/publishers` | `page`, `page_size` | List publishers. |
| GET | `/publishers/{id}` | path: `id` | Publisher detail route. |

### Stores
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/stores` | `ordering`, `page`, `page_size` | List storefronts. |
| GET | `/stores/{id}` | path: `id` | Store detail route. |

### Tags
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/tags` | `page`, `page_size` | List tags. |
| GET | `/tags/{id}` | path: `id` | Tag detail route. |

## Important parameter notes from official docs
- `key` is required on every request and is passed as a query parameter.
- `page` is the documented page number for paginated routes.
- `page_size` controls the number of results returned per page.
- `/games` supports broad discovery filters across platforms, stores, developers, publishers, genres, tags, creators, date windows, update windows, Metacritic ranges, and exclusion flags.
- `/games` supports:
  - fuzzy or non-fuzzy search via `search`, `search_precise`, and `search_exact`
  - sort reversal with a leading hyphen in `ordering`, for example `-released` or `-metacritic`
- The official landing page examples also show practical `/games` filters such as:
  - `dates=2019-09-01,2019-09-30`
  - `platforms=18,1,7`
  - `metacritic=80,100`
  - `ordering=-metacritic`

## Important usage and licensing notes
- `rawg.io/apidocs` says RAWG is sharing `500,000+` games and related metadata.
- Official terms require attribution to RAWG and an active hyperlink from every page where RAWG data or images are used.
- `rawg.io/apidocs` says the free plan is for personal and hobby projects and labels it `Non-commercial projects only`.
- The ReDoc terms page separately says free commercial use is allowed for startups and hobby projects with not more than `100,000` monthly active users or `500,000` page views per month.
- Official terms prohibit data redistribution and warn against launching a RAWG clone.
- `rawg.io/apidocs` says the older request-signing method using the User-Agent string is being slowly deprecated in favor of API-key-based request signing.

## Integration notes for fireROUTE
- Treat RAWG as a read-only GET API rooted at `https://api.rawg.io/api`.
- Always append `key` to requests.
- Implement pagination from the documented `page` / `page_size` query parameters and the `count` / `next` / `previous` / `results` response envelope.
- Treat `/games` as the main search/filter surface and keep the wider filter set exposed.
- Mark `/games/{id}/suggested`, `/games/{id}/twitch`, and `/games/{id}/youtube` as business/enterprise-only routes per the official docs.
- Do not invent undocumented write routes or undocumented error structures.

## Sources inspected
- `https://rawg.io/apidocs`
- `https://api.rawg.io/docs/`
- `https://api.rawg.io/api/games`
