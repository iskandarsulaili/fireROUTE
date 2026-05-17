# Guild Wars 2

## Overview
- Provider: Guild Wars 2 API v2
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::5`
- Official docs attempted: `https://wiki.guildwars2.com/wiki/API:Main`
- Official route overview inspected: `https://wiki.guildwars2.com/wiki/API:2`
- Official auth page inspected: `https://wiki.guildwars2.com/wiki/API:API_key`
- Official rate-limit guidance inspected: `https://wiki.guildwars2.com/wiki/API:Best_practices#Rate_Limit`
- Official endpoint page inspected: `https://wiki.guildwars2.com/wiki/API:2/account`
- Base URL: `https://api.guildwars2.com`
- HTTPS: yes
- Response format: JSON
- Auth for authenticated routes: API key via the `Authorization` header or the `access_token` query parameter
- Confirmed routes: `171`

## What the official docs confirm
- Version 2 of the API is publicly available over HTTPS.
- The official base URL for all endpoints is `https://api.guildwars2.com`.
- The official route overview lists `171` active `/v2/...` paths.
- The inspected endpoint page for `/v2/account` documents:
  - path: `/v2/account`
  - HTTP method: `GET`
  - format: `json`
  - scope: `account`
  - additional optional scopes on response fields: `guilds`, `progression`
- The official docs describe the API as resource-oriented and document these shared request patterns:
  - collection access by direct endpoint request
  - single-resource access by subpath or `?id=`
  - multi-resource access by `?ids=` with comma-separated identifiers
  - some endpoints support `?ids=all`
- The official best-practices page says the default response from virtually every endpoint is a list of valid IDs for that endpoint.
- The same page says up to `200` individual IDs can be combined into one request.

## Confirmed route inventory from the official `API:2` page
- `/v2/account` family: `46`
- `/v2/characters` family: `15`
- `/v2/guild` family: `13`
- `/v2/wvw` family: `12`
- `/v2/pvp` family: `9`
- `/v2/commerce` family: `8`
- `/v2/achievements` family: `5`
- `/v2/homestead` family: `4`
- `/v2/backstory` family: `3`
- `/v2/emblem` family: `3`
- `/v2/home` family: `3`
- `/v2/mounts` family: `3`
- `/v2/wizardsvault` family: `3`
- `/v2/recipes` family: `2`
- `/v2/stories` family: `2`
- Single-route families listed on the official page: `/v2/build`, `/v2/colors`, `/v2/continents`, `/v2/createsubtoken`, `/v2/currencies`, `/v2/dailycrafting`, `/v2/dungeons`, `/v2/emotes`, `/v2/files`, `/v2/finishers`, `/v2/gliders`, `/v2/items`, `/v2/itemstats`, `/v2/jadebots`, `/v2/legendaryarmory`, `/v2/legends`, `/v2/logos`, `/v2/mailcarriers`, `/v2/mapchests`, `/v2/maps`, `/v2/masteries`, `/v2/materials`, `/v2/minis`, `/v2/novelties`, `/v2/outfits`, `/v2/pets`, `/v2/professions`, `/v2/quaggans`, `/v2/quests`, `/v2/races`, `/v2/raids`, `/v2/skiffs`, `/v2/skills`, `/v2/skins`, `/v2/specializations`, `/v2/titles`, `/v2/tokeninfo`, `/v2/traits`, `/v2/worldbosses`, `/v2/worlds`
- The official overview also explicitly flags some parent paths as not directly useful on their own and tells consumers to use sub-endpoints instead, including `/v2/account/wizardsvault`, `/v2/commerce`, and `/v2/guild`.

## Shared parameters, auth, and scopes
- Shared documented query parameters and selectors from the official overview and endpoint pages:
  - `id` — request one resource on endpoints that support singular lookup
  - `ids` — request multiple resources with comma-separated IDs
  - `ids=all` — supported on some endpoints
  - `page` — zero-indexed page number
  - `page_size` — page size on paginated endpoints
  - `lang` — localisation selector
  - `v` — schema version selector
  - `access_token` — API key transport for authenticated endpoints when not sent in headers
- Localisation can be supplied either via `Accept-Language: <language>` or `?lang=<language>`.
- The official docs list valid language values as `en`, `es`, `de`, `fr`, and `zh`.
- API keys are created at `https://account.arena.net/applications`.
- The official API-key page says keys are read-only and permissioned by scope.
- The official API-key page lists these scopes: `account`, `builds`, `characters`, `guilds`, `inventories`, `progression`, `pvp`, `tradingpost`, `unlocks`, `wallet`, `wvw`.
- Authenticated endpoints accept API keys in two official forms:
  - the `Authorization` header
  - the `access_token` query parameter
- The official API-key page also says there is a limit of `200` simultaneously active API keys per account.

## Pagination, schemas, and format notes
- Pagination is documented as zero-indexed.
- The official overview documents these pagination headers:
  - `X-Page-Size`
  - `X-Page-Total`
  - `X-Result-Count`
  - `X-Result-Total`
- Schema selection can be supplied either via `?v=<schema>` or `X-Schema-Version: <schema>`.
- The docs say schema selectors accept `latest` or ISO-8601 UTC timestamps.
- The official overview warns that using `X-Schema-Version` triggers a CORS preflight and that CORS preflights are not supported by the API backend.
- The official endpoint page for `/v2/account` explicitly marks the response format as `json`.

## Errors and rate limits
- The official overview documents these response/status meanings:
  - `200` — success
  - `206` — partial success when `ids` contains a mix of valid and invalid IDs
  - `403` — missing or invalid API key, or insufficient permissions
  - `404` — nonexistent endpoint or all provided IDs invalid
  - `429` — rate limit exceeded
  - `502` — invalid upstream response
  - `503` — endpoint disabled
  - `504` — gateway timeout
- The official best-practices page says the API is rate-limited per IP.
- The same page publishes these numeric limits:
  - max burst size / bucket size: `300`
  - refill rate: `5` tokens per second (`300` per minute)
- The official guidance says that staying within that 300-burst and 5-per-second refill should avoid `429` responses.

## Important usage notes
- Combine IDs into one request instead of issuing many one-by-one calls whenever an endpoint supports `ids`.
- Some account data is scope-gated even after a key is accepted; `/v2/account` specifically documents extra data behind the `guilds` and `progression` permissions.
- The official best-practices page warns that otherwise valid API keys may sometimes return `Invalid key` transiently and recommends retrying later rather than immediately treating the key as permanently bad.
- The same page warns that enum-value additions are not always treated as breaking schema changes, so consumers should tolerate unexpected enum values.
- The API-key page says deleting an API key takes effect immediately.

## Integration notes for fireROUTE
- Model Guild Wars 2 as one shared HTTPS JSON API rooted at `https://api.guildwars2.com`.
- Treat the route inventory as the `171` active `/v2/...` paths published on the official `API:2` overview.
- Preserve the distinction between public catalog-style routes and authenticated account/guild/character/trading-style routes.
- Support both bearer-header auth and query-parameter auth because both are officially documented.
- Implement zero-indexed pagination and expose the four pagination headers when present.
- Preserve the official non-200 behaviors, especially `206` partial success for mixed-validity `ids` requests and `429` for per-IP throttling.

## Sources inspected
- `https://wiki.guildwars2.com/wiki/API:Main`
- `https://wiki.guildwars2.com/wiki/API:2`
- `https://wiki.guildwars2.com/wiki/API:API_key`
- `https://wiki.guildwars2.com/wiki/API:Best_practices#Rate_Limit`
- `https://wiki.guildwars2.com/wiki/API:2/account`
