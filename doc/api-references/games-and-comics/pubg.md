# PUBG

## Overview
- Provider: PUBG Developer API
- Category: Games & Comics
- Official portal: `https://developer.pubg.com/`
- Official documentation hub: `https://documentation.pubg.com/en/index.html`
- Primary API host: `https://api.pubg.com`
- Auth: bearer token in the `Authorization` header for rate-limited endpoints
- HTTPS: yes
- Response format: JSON:API (`application/vnd.api+json` preferred; `application/json` also accepted)
- Confirmed routes: `17`

## Base URL and shard model
- PUBG routes are split across three server patterns documented in the official OpenAPI files:
  - root routes: `https://api.pubg.com`
  - platform shard routes: `https://api.pubg.com/shards/{platform}`
  - platform-region shard routes: `https://api.pubg.com/shards/{platform-region}`
- Documented `platform` shard values include `kakao`, `psn`, `stadia`, `steam`, `xbox`, plus `console` for some routes and `tournament` for matches.
- Documented `platform-region` shard values include: `pc-as`, `pc-eu`, `pc-jp`, `pc-krjp`, `pc-kakao`, `pc-na`, `pc-oc`, `pc-ru`, `pc-sa`, `pc-sea`, `psn-as`, `psn-eu`, `psn-na`, `psn-oc`, `xbox-as`, `xbox-eu`, `xbox-na`, `xbox-oc`, `xbox-sa`.
- The making-requests guide says platform-region shards are deprecated except for older season-stat lookups before the Survival Title system.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/status` | none | Root status check at `https://api.pubg.com/status`; official status spec does not require auth. |
| GET | `/players` | query `filter[playerIds]` = comma-separated player account IDs, up to 10; query `filter[playerNames]` = comma-separated player names, up to 10, case-sensitive | Requires exactly one of the two filters according to the official players spec. Use under `shards/{platform}`. |
| GET | `/players/{accountId}` | path `accountId` | Single-player lookup on a platform shard. |
| GET | `/seasons` | none | Lists available seasons. Official docs say apps should not query this more than once per month. Available on both platform and platform-region shards. |
| GET | `/players/{accountId}/seasons/{seasonId}` | path `accountId`; path `seasonId`; optional query `filter[gamepad]=true` for Stadia gamepad stats | Single-player season stats. Use platform-region shards for older PC/PSN/Xbox seasons as documented. |
| GET | `/players/{accountId}/seasons/{seasonId}/ranked` | path `accountId`; path `seasonId` | Ranked stats for one player and season. |
| GET | `/seasons/{seasonId}/gameMode/{gameMode}/players` | path `seasonId`; path `gameMode` in `duo`, `duo-fpp`, `solo`, `solo-fpp`, `squad`, `squad-fpp`; query `filter[playerIds]` = up to 10 account IDs; optional query `filter[gamepad]=true` | Batch season stats for up to 10 players. |
| GET | `/players/{accountId}/seasons/lifetime` | path `accountId`; optional query `filter[gamepad]=true` | Lifetime stats for one player. |
| GET | `/seasons/lifetime/gameMode/{gameMode}/players` | path `gameMode`; query `filter[playerIds]` = up to 10 account IDs; optional query `filter[gamepad]=true` | Batch lifetime stats for up to 10 players. |
| GET | `/players/{accountId}/weapon_mastery` | path `accountId` | Weapon mastery for one player. |
| GET | `/players/{accountId}/survival_mastery` | path `accountId` | Survival mastery for one player. |
| GET | `/clans/{clanId}` | path `clanId` | Clan lookup on a platform shard. |
| GET | `/matches/{id}` | path `id` = match ID | Match lookup. Official match spec says auth is not required because this route is not rate-limited. |
| GET | `/leaderboards/{seasonId}/{gameMode}` | path `seasonId`; path `gameMode` in `duo`, `duo-fpp`, `solo`, `solo-fpp`, `squad`, `squad-fpp` | Leaderboard lookup. The usage guide also documents `page[number]` pagination in 500-player pages. |
| GET | `/samples` | optional query `filter[createdAt-start]` = UTC timestamp, must be at least 24 hours in the past | Sample matches endpoint on `steam`, `console`, or `kakao` shards. |
| GET | `/tournaments` | none | Tournament list from the official published OpenAPI file at the API root. |
| GET | `/tournaments/{id}` | path `id` | Tournament detail route. Official path note says tournament matches are then fetched through `/matches`; see usage notes below. |

## Authentication and headers
- The official docs require a JWT-format API key from `https://developer.pubg.com`, passed as a bearer token in the `Authorization` header.
- The docs explicitly say you do not need to create JWTs manually; the portal issues them when you register an app.
- The making-requests guide recommends:
  - `Accept: application/vnd.api+json`
- The server also accepts `application/json` for convenience.
- For large payloads, especially matches and telemetry, the docs recommend:
  - `Accept-Encoding: gzip`
- The docs warn not to store API keys client-side; calls should be made from a secure server-side application.

## Pagination, batching, and retention
- Players batch lookup: up to `10` players per request via `filter[playerIds]` or `filter[playerNames]`.
- Batch season stats: up to `10` players via `filter[playerIds]`.
- Batch lifetime stats: up to `10` players via `filter[playerIds]`.
- Leaderboards pagination: `page[number]` with pages of `500` players, starting at `0`.
- Match retention: official docs say match data older than `14 days` is unavailable.
- Player match lists go back `14 days`.
- Season stats expose up to the `32` most recent matches within that 14-day window.

## Rate limits
- Default rate limit: `10 requests per minute` per API key.
- Exceeding the limit returns HTTP `429 Too Many Requests`.
- Official rate-limit headers:
  - `X-RateLimit-Limit` = request limit per day / per minute
  - `X-RateLimit-Remaining` = remaining requests in the current window
  - `X-RateLimit-Reset` = reset time as a UNIX timestamp
- The docs explicitly say `/matches` and telemetry downloads are not rate-limited.
- The developer portal supports higher-limit requests through the My Apps workflow if you provide working samples, traffic details, and caching strategy information.

## Errors and response-format notes
- All responses are documented as JSON:API responses with a root JSON object.
- Top-level members documented by the official guide:
  - `data`
  - `errors`
  - optional `links`
  - optional `included`
  - `meta` is documented as not currently used
- Published error responses include:
  - `401 Unauthorized` for invalid or missing API key
  - `404 Not Found` for missing resource
  - `415 Unsupported Media Type` for incorrect or missing content negotiation
  - `429 Too Many Requests` when rate-limited
- Published error body examples include a `title` field and may include `description`.

## Important usage notes
- The official docs describe the service as JSON:API-first, so adapters should preserve `data`, `included`, and relationship handling instead of flattening too early.
- Older season-stat requests may require platform-region shards; newer season-stat requests and most other endpoints use platform shards.
- The official seasons page says season IDs change infrequently, roughly once every two months, and should be cached aggressively.
- The sample endpoint requires `filter[createdAt-start]` to be at least `24 hours` in the past; if omitted, the latest sample is returned.
- Telemetry is not exposed as a fixed `api.pubg.com` route. The documented flow is:
  1. fetch a match from `/matches/{id}`
  2. find the related asset in the match response
  3. download the telemetry JSON from the asset `URL`
- The telemetry docs say telemetry downloads do not require an API key and are gzip-compressed.
- The tournament detail path notes that tournament matches are retrieved through `/matches`; the current matches OpenAPI server enum documents `tournament` as the shard value for match retrieval.
- The current docs navigation does not expose a dedicated tournaments page, but the official published OpenAPI file `tournaments.yml` is live under the same documentation host and documents the two tournament routes above.

## Integration notes for fireROUTE
- Model this provider as a multi-surface API with mixed shard requirements instead of a single flat base URL.
- Treat `/status` and `/matches/{id}` as special cases because they are documented without the standard rate-limit/auth assumptions.
- Preserve JSON:API relationships so match assets and telemetry URLs remain accessible.
- Support both single-player and batch stat workflows; batching is a first-class documented contract for season and lifetime stats.
- Cache seasons and match responses where possible to stay within the default `10 RPM` limit.

## Sources inspected
- `https://developer.pubg.com/`
- `https://documentation.pubg.com/en/index.html`
- `https://documentation.pubg.com/en/introduction.html`
- `https://documentation.pubg.com/en/api-keys.html`
- `https://documentation.pubg.com/en/rate-limits.html`
- `https://documentation.pubg.com/en/making-requests.html`
- `https://documentation.pubg.com/en/players-endpoint.html`
- `https://documentation.pubg.com/en/seasons-endpoint.html`
- `https://documentation.pubg.com/en/lifetime-stats.html`
- `https://documentation.pubg.com/en/mastery-endpoint.html`
- `https://documentation.pubg.com/en/clans-endpoint.html`
- `https://documentation.pubg.com/en/matches-endpoint.html`
- `https://documentation.pubg.com/en/leaderboards-endpoint.html`
- `https://documentation.pubg.com/en/samples-endpoint.html`
- `https://documentation.pubg.com/en/status-endpoint.html`
- `https://documentation.pubg.com/en/telemetry.html`
- Official OpenAPI files under `https://documentation.pubg.com/en/_static/swagger/en/`, including `players.yml`, `seasons.yml`, `lifetime.yml`, `mastery.yml`, `clans.yml`, `matches.yml`, `leaderboards.yml`, `samples.yml`, `status.yml`, `tournaments.yml`, the referenced `paths/*.yml`, `parameters/*.yml`, and `responses/*.yml`
