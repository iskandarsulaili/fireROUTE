# Hypixel

## Overview
- Provider: Hypixel Public API
- Category: Games & Comics
- Official docs: `https://api.hypixel.net/`
- Official developer dashboard: `https://developer.hypixel.net/`
- Official policies page: `https://developer.hypixel.net/policies`
- Base URL: `https://api.hypixel.net`
- Auth: `API-Key` header for protected routes
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `34`

## Global notes from the official docs
- The docs are the official Hypixel API Redoc site and expose a v2 OpenAPI definition.
- All documented routes in the inspected v2 spec use `GET`.
- UUID query parameters accept both dashed and undashed formats.
- Dates and times are generally Unix epoch timestamps in milliseconds.
- SkyBlock item and inventory blobs may contain base64-encoded gzipped NBT data.
- The docs say all API use must conform to the official API policies and that violations may lead to revoked applications or API bans.

## Auth and rate limits
- Protected routes use the `API-Key` header.
- API keys are created in the official Hypixel Developer Dashboard.
- The official docs say API keys are limited by application type over 5-minute intervals.
- Protected endpoints also return these documented rate-limit headers:
  - `RateLimit-Limit` — allowed requests per minute for the provided key
  - `RateLimit-Remaining` — remaining requests in the current minute
  - `RateLimit-Reset` — seconds until the next minute reset
- Public/open routes exist and do not require an API key; these are mainly resource catalogs and some SkyBlock public-market endpoints.
- Live behavior note: unauthenticated requests to protected endpoints currently returned `400` with `{"success":false,"cause":"Missing API-Key header"}` rather than the `403` wording emphasized in the docs. A deliberately invalid key returned documented-style `403` with `{"success":false,"cause":"Invalid API key"}`.

## Confirmed endpoints

### Player data
| Method | Path | Parameters | Auth | Statuses | Notes |
|---|---|---|---|---|---|
| GET | `/v2/player` | required query `uuid` | `API-Key` | `200`, `400`, `403`, `429` | Player profile and stats. |
| GET | `/v2/recentgames` | required query `uuid` | `API-Key` | `200`, `400`, `403`, `422`, `429` | Recent games for one player. |
| GET | `/v2/status` | required query `uuid` | `API-Key` | `200`, `400`, `403`, `429` | Current online/offline status for one player. |
| GET | `/v2/guild` | optional query `id`, `player`, or `name` | `API-Key` | `200`, `400`, `403`, `429` | Retrieve a guild by guild id, player, or guild name. |

### Resources
| Method | Path | Parameters | Auth | Statuses | Notes |
|---|---|---|---|---|---|
| GET | `/v2/resources/games` | none | none | `200` | Game metadata; docs mark it as early development. |
| GET | `/v2/resources/achievements` | none | none | `200` | Achievement metadata. |
| GET | `/v2/resources/challenges` | none | none | `200` | Challenge metadata. |
| GET | `/v2/resources/quests` | none | none | `200` | Quest metadata. |
| GET | `/v2/resources/guilds/achievements` | none | none | `200` | Guild achievement metadata. |
| GET | `/v2/resources/vanity/pets` | none | none | `200` | Vanity pet metadata. |
| GET | `/v2/resources/vanity/companions` | none | none | `200` | Vanity companion metadata. |
| GET | `/v2/resources/skyblock/collections` | none | none | `200` | SkyBlock collection metadata. |
| GET | `/v2/resources/skyblock/skills` | none | none | `200` | SkyBlock skill metadata. |
| GET | `/v2/resources/skyblock/items` | none | none | `200` | SkyBlock item metadata. |
| GET | `/v2/resources/skyblock/election` | none | none | `200` | Current mayor and election metadata. |
| GET | `/v2/resources/skyblock/bingo` | none | none | `200` | Current bingo event metadata. |

### SkyBlock
| Method | Path | Parameters | Auth | Statuses | Notes |
|---|---|---|---|---|---|
| GET | `/v2/skyblock/news` | none | `API-Key` | `200`, `403`, `429` | SkyBlock news feed. |
| GET | `/v2/skyblock/auction` | optional query `uuid`, `player`, or `profile` | `API-Key` | `200`, `400`, `403`, `422`, `429` | Docs say only one of the three query parameters may be used in a request. |
| GET | `/v2/skyblock/auctions` | optional query `page` | none | `200`, `404`, `422`, `503` | Public active-auctions feed; paginated and sorted by `lastUpdated` descending. |
| GET | `/v2/skyblock/auctions_ended` | none | none | `200` | Recently ended auctions from the last 60 seconds. |
| GET | `/v2/skyblock/bazaar` | none | none | `200`, `503` | Bazaar products with `buy_summary`, `sell_summary`, and `quick_status`. |
| GET | `/v2/skyblock/profile` | optional query `profile` | `API-Key` | `200`, `400`, `403`, `422`, `429` | One SkyBlock profile by profile id. |
| GET | `/v2/skyblock/profiles` | optional query `uuid` | `API-Key` | `200`, `400`, `403`, `422`, `429` | SkyBlock profiles by player UUID. |
| GET | `/v2/skyblock/museum` | optional query `profile` | `API-Key` | `200`, `403`, `422`, `429` | Museum data for all members of a profile. |
| GET | `/v2/skyblock/garden` | optional query `profile` | `API-Key` | `200`, `403`, `404`, `422`, `429` | Garden data for a profile. |
| GET | `/v2/skyblock/bingo` | optional query `uuid` | `API-Key` | `200`, `400`, `403`, `404`, `422`, `429` | Bingo participation history for a player. |
| GET | `/v2/skyblock/firesales` | none | none | `200` | Active or upcoming fire sales. |

### Housing
| Method | Path | Parameters | Auth | Statuses | Notes |
|---|---|---|---|---|---|
| GET | `/v2/housing/active` | none | `API-Key` | `200`, `403`, `429` | Active public houses; docs say the data may be cached briefly. |
| GET | `/v2/housing/house` | required query `house` | `API-Key` | `200`, `403`, `404`, `429` | One public house by house UUID. |
| GET | `/v2/housing/houses` | optional query `player` | `API-Key` | `200`, `403`, `429` | Public houses for a player UUID. |

### Other
| Method | Path | Parameters | Auth | Statuses | Notes |
|---|---|---|---|---|---|
| GET | `/v2/boosters` | none | `API-Key` | `200`, `403`, `429` | Active network boosters. |
| GET | `/v2/counts` | none | `API-Key` | `200`, `403`, `429` | Current player counts. |
| GET | `/v2/leaderboards` | none | `API-Key` | `200`, `403`, `429`, `503` | Current leaderboards. |
| GET | `/v2/punishmentstats` | none | `API-Key` | `200`, `403`, `429`, `503` | Network punishment statistics. |

## Pagination and response notes
- The docs describe the API as JSON.
- The common envelope in live checks includes a top-level `success` boolean.
- Only `GET /v2/skyblock/auctions` is explicitly documented as paginated in the inspected spec.
- Live check: `GET /v2/skyblock/auctions?page=0` returned `200` JSON with pagination fields including `page`, `totalPages`, `totalAuctions`, and `lastUpdated`.
- Live check: `GET /v2/resources/games` returned `200` JSON with `success: true` and a `games` object.
- The docs say resource and market endpoints are public, while player/private-data-style routes require `API-Key`.

## Errors and documented response patterns
- The official docs repeatedly document these response classes across protected routes:
  - `400` — missing or malformed required input
  - `403` — forbidden, usually invalid API key
  - `404` — resource not found on endpoints that support it
  - `422` — semantically invalid input on selected endpoints
  - `429` — request limit reached or global throttle
  - `503` — temporary backend/service problem on selected public data endpoints
- Live check: missing `API-Key` on `GET /v2/player` returned `400` with `cause: "Missing API-Key header"`.
- Live check: invalid `API-Key` on `GET /v2/player` returned `403` with `cause: "Invalid API key"`.

## Important usage notes
- The docs call out `GameTypes` with numeric IDs, internal database names, and clean names; integrations can use either database names or IDs where the API references a game type.
- The SkyBlock bazaar endpoint returns both summary books and a condensed `quick_status`, not just one market price.
- The SkyBlock auction-by-id/player/profile route is single-filter only; do not send multiple selector parameters together.
- Housing endpoints may return slightly stale data because the docs warn that the data can be cached for a short period.

## Integration notes for fireROUTE
- Model Hypixel as one shared JSON API with mixed public and protected endpoints under the same base URL.
- Require an `API-Key` credential for most player, housing, and network-stat routes.
- Mark `/v2/resources/*`, `/v2/skyblock/auctions`, `/v2/skyblock/auctions_ended`, `/v2/skyblock/bazaar`, and `/v2/skyblock/firesales` as safe public reads.
- Normalize UUID handling to accept both dashed and undashed formats before making outbound calls.
- Preserve documented endpoint-specific error/status behavior rather than assuming one universal code map.
- Handle the live missing-key `400` behavior in adapters even though the published docs primarily describe key problems as `403`.

## Sources inspected
- `https://api.hypixel.net/`
- `https://developer.hypixel.net/`
- `https://developer.hypixel.net/policies`
- Live checks via browser fetch against:
  - `https://api.hypixel.net/v2/resources/games`
  - `https://api.hypixel.net/v2/skyblock/auctions?page=0`
  - `https://api.hypixel.net/v2/player?uuid=3fa85f64-5717-4562-b3fc-2c963f66afa6`
  - `https://api.hypixel.net/v2/counts`
  - `https://api.hypixel.net/v2/player?uuid=3fa85f64-5717-4562-b3fc-2c963f66afa6` with invalid `API-Key`
