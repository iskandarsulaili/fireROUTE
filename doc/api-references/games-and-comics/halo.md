# Halo

## Overview
- Provider: Halo Public API (Beta)
- Category: Games & Comics
- Official portal inspected: `https://developer.haloapi.com/`
- Additional official pages inspected:
  - `https://developer.haloapi.com/apis`
  - `https://developer.haloapi.com/terms-of-use`
- Base URL: `https://s3publicapis.azure-api.net`
- API families confirmed from the official portal:
  - `Metadata`
  - `Profile`
  - `Stats`
  - `UGC`
- Auth: subscription/API key required; official portal metadata exposes header `Ocp-Apim-Subscription-Key` and query parameter `subscription-key`
- HTTPS: yes
- Response formats: JSON for metadata/profile/stats/ugc routes; the profile image routes return `302` redirects rather than inline JSON documents
- Confirmed routes: `72`

## Authentication
- The official home page says: sign up, go to `Products`, choose `Developer Access`, and `Subscribe` to get an API key.
- The official API metadata for the four published Halo API families marks `subscriptionRequired: true` and `subscriptionKeyRequired: true`.
- The official portal exposes the accepted subscription-key names as:
  - header: `Ocp-Apim-Subscription-Key`
  - query string: `subscription-key`
- The reviewed Terms of Use say Microsoft may revoke an API key without notice and that developers must keep the key confidential.

## API families and route counts
- Metadata: `37` GET routes
- Profile: `3` GET routes
- Stats: `28` GET routes
- UGC: `4` GET routes
- Total confirmed GET routes: `72`

## Common request and response notes
- Metadata routes commonly document optional header `Accept-Language` with default `en`.
- Halo 5 profile and stats routes use path placeholders such as `{player}`, `{companyId}`, `{seasonId}`, `{playlistId}`, and `{matchId}`.
- All reviewed non-image responses are documented as `application/json`.
- Profile image routes (`/emblem`, `/spartan`) return `302` on success and redirect to the image resource.
- The official Terms of Use say Microsoft may limit API calls in a given period of time, but the reviewed official pages do not publish a numeric rate-limit value.

## Pagination, windowing, and list controls
- Halo Wars 2 metadata collection routes use query parameter `startAt`.
  - when omitted, `0` is assumed
  - the reviewed operation docs say non-digit values or values not divisible by `100` return `400`
- Leaderboard routes use query parameter `count`.
  - when omitted, `200` is assumed
  - allowed range is effectively `1-250`; larger values are clamped to the maximum according to the docs
- Halo 5 and Halo Wars 2 player match-history routes use:
  - `start` (0-based offset)
  - `count` (defaults to `25`, capped at `25` according to the docs)
- UGC list routes use:
  - `start`
  - `count`
  - `sort`
  - `order`

## Error handling
- The reviewed operation definitions publish route-specific status-code sets rather than a single shared error schema.
- Confirmed status codes across the reviewed Halo routes include:
  - `200` for successful JSON responses
  - `302` for successful profile-image redirects
  - `400` for invalid parameters on routes that validate query/path input
  - `404` for missing players, variants, metadata objects, matches, or other requested entities depending on the route
  - `500` for internal server errors
  - `503` for service-unavailable conditions on many stats routes
- The reviewed portal operation definitions identify error responses as `application/json`, but the inspected docs did not expose a shared JSON error-body schema.

## Confirmed endpoints
All confirmed Halo routes are `GET` routes.

### Metadata API
Common metadata note: the official docs commonly expose optional header `Accept-Language` (`string`, default `en`) to request localized metadata.

| Path | Key parameters | Notes |
|---|---|---|
| `/h5/metadata/campaign-missions` | optional header `Accept-Language` | Halo 5 campaign mission metadata. |
| `/h5/metadata/commendations` | optional header `Accept-Language` | Halo 5 commendation metadata. |
| `/h5/metadata/company-commendations` | optional header `Accept-Language` | Halo 5 company commendation metadata. |
| `/h5/metadata/csr-designations` | optional header `Accept-Language` | Halo 5 CSR designation metadata. |
| `/h5/metadata/enemies` | optional header `Accept-Language` | Halo 5 enemy metadata. |
| `/h5/metadata/flexible-stats` | optional header `Accept-Language` | Halo 5 flexible-stat metadata. |
| `/h5/metadata/game-base-variants` | optional header `Accept-Language` | Halo 5 game base variants. |
| `/h5/metadata/game-variants/{id}` | path `id` | Fetches one official Halo 5 game variant by ID. |
| `/h5/metadata/impulses` | optional header `Accept-Language` | Halo 5 impulse metadata. |
| `/h5/metadata/map-variants/{id}` | path `id` | Fetches one official Halo 5 map variant by ID. |
| `/h5/metadata/maps` | optional header `Accept-Language` | Halo 5 map metadata. |
| `/h5/metadata/medals` | optional header `Accept-Language` | Halo 5 medal metadata. |
| `/h5/metadata/playlists` | optional header `Accept-Language` | Halo 5 playlist metadata. |
| `/h5/metadata/requisitions/{id}` | path `id` | Fetches one Halo 5 requisition by ID. |
| `/h5/metadata/requisition-packs/{id}` | path `id` | Fetches one Halo 5 requisition pack by ID. |
| `/h5/metadata/seasons` | optional header `Accept-Language` | Halo 5 season metadata. |
| `/h5/metadata/skulls` | optional header `Accept-Language` | Halo 5 skull metadata. |
| `/h5/metadata/spartan-ranks` | optional header `Accept-Language` | Halo 5 Spartan rank metadata. |
| `/h5/metadata/team-colors` | optional header `Accept-Language` | Halo 5 team-color metadata. |
| `/h5/metadata/vehicles` | optional header `Accept-Language` | Halo 5 vehicle metadata. |
| `/h5/metadata/weapons` | optional header `Accept-Language` | Halo 5 weapon metadata. |
| `/hw2/campaign-levels` | query `startAt` | Halo Wars 2 campaign-level list; `startAt` must be a multiple of `100`. |
| `/hw2/campaign-logs` | query `startAt` | Halo Wars 2 campaign-log list; docs show the same `startAt` stepping rules. |
| `/hw2/card-keywords` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 card-keyword metadata. |
| `/hw2/cards` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 card metadata. |
| `/hw2/csr-designations` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 CSR designation metadata. |
| `/hw2/difficulties` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 difficulty metadata. |
| `/hw2/game-object-categories` | query `startAt` | Halo Wars 2 game-object-category metadata. |
| `/hw2/game-objects` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 game-object metadata. |
| `/hw2/leader-powers` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 leader-power metadata. |
| `/hw2/leaders` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 leader metadata. |
| `/hw2/maps` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 map metadata. |
| `/hw2/packs` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 pack metadata. |
| `/hw2/playlists` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 playlist metadata. |
| `/hw2/seasons` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 season metadata. |
| `/hw2/spartan-ranks` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 Spartan-rank metadata. |
| `/hw2/techs` | query `startAt`; optional header `Accept-Language` | Halo Wars 2 tech metadata. |

### Profile API
| Path | Key parameters | Notes |
|---|---|---|
| `/h5/profiles/{player}/appearance` | path `player` | Returns Halo 5 player appearance/profile data. |
| `/h5/profiles/{player}/emblem` | path `player`; optional query `size` | Successful response is `302`; valid documented sizes are `95`, `128`, `190`, `256`, `512`. |
| `/h5/profiles/{player}/spartan` | path `player`; optional query `size`, `crop` | Successful response is `302`; `crop` is `full` or `portrait`, default `full`. |

### Stats API
| Path | Key parameters | Notes |
|---|---|---|
| `/h5/companies/{companyId}` | path `companyId` | Company ID can be discovered from player appearance data. |
| `/h5/companies/{companyId}/commendations` | path `companyId` | Halo 5 company commendation status. |
| `/h5/player-leaderboards/csr/{seasonId}/{playlistId}` | path `seasonId`, `playlistId`; optional query `count` | Leaderboard page size defaults to `200` and is capped at `250` by the reviewed docs. |
| `/h5/matches/{matchId}/events` | path `matchId` | Match event stream for a Halo 5 match. |
| `/h5/arena/matches/{matchId}` | path `matchId` | Arena match result. |
| `/h5/campaign/matches/{matchId}` | path `matchId` | Campaign match result. |
| `/h5/custom/matches/{matchId}` | path `matchId` | Custom match result. |
| `/h5/customlocal/matches/{matchId}` | path `matchId` | Custom-local match result. |
| `/h5/warzone/matches/{matchId}` | path `matchId` | Warzone match result. |
| `/h5/players/{player}/commendations` | path `player` | Player commendation progress. |
| `/h5/players/{player}/matches` | path `player`; optional query `modes`, `start`, `count`, `include-times` | Player match history across one or more Halo 5 modes. |
| `/h5/servicerecords/arena?players={players}` | required query `players`; optional query `seasonId` | `players` is a comma-separated gamertag list, up to `32`. |
| `/h5/servicerecords/campaign?players={players}` | required query `players` | `players` is a comma-separated gamertag list, up to `32`. |
| `/h5/servicerecords/custom?players={players}` | required query `players` | `players` is a comma-separated gamertag list, up to `32`. |
| `/h5/servicerecords/customlocal?players={players}` | required query `players` | `players` is a comma-separated gamertag list, up to `32`. |
| `/h5/servicerecords/warzone?players={players}` | required query `players` | `players` is a comma-separated gamertag list, up to `32`. |
| `/h5pc/custom/matches/{matchId}` | path `matchId` | Halo 5 PC custom match result. |
| `/h5pc/players/{player}/matches` | path `player`; optional query `modes`, `start`, `count`, `include-times` | Halo 5 PC player match history. |
| `/h5pc/servicerecords/custom?players={players}` | required query `players` | Halo 5 PC custom service records for up to `32` gamertags. |
| `/hw2/player-leaderboards/csr/{seasonId}/{playlistId}` | path `seasonId`, `playlistId`; optional query `count` | Halo Wars 2 CSR leaderboard. |
| `/hw2/matches/{matchId}/events` | path `matchId` | Halo Wars 2 match events. |
| `/hw2/matches/{matchId}` | path `matchId` | Halo Wars 2 match result. |
| `/hw2/players/{player}/campaign-progress` | path `player` | Halo Wars 2 campaign progress. |
| `/hw2/players/{player}/matches` | path `player`; optional query `matchType`, `start`, `count` | Halo Wars 2 player match history. |
| `/hw2/playlist/{playlistId}/rating?players={players}` | path `playlistId`; required query `players` | `players` accepts up to `6` gamertags. |
| `/hw2/players/{player}/stats/seasons/{seasonId}` | path `player`, `seasonId` | `seasonId` can be a real season ID or `current`. |
| `/hw2/players/{player}/stats` | path `player` | Halo Wars 2 player stats summary. |
| `/hw2/xp?players={players}` | required query `players` | `players` accepts up to `6` gamertags. |

### UGC API
| Path | Key parameters | Notes |
|---|---|---|
| `/h5/players/{player}/gamevariants/{variant}` | path `player`, `variant` | Returns one user-owned Halo 5 game variant. |
| `/h5/players/{player}/gamevariants` | path `player`; optional query `start`, `count`, `sort`, `order` | List route; docs say default primary sort is `modified` descending. |
| `/h5/players/{player}/mapvariants/{variant}` | path `player`, `variant` | Returns one user-owned Halo 5 map variant. |
| `/h5/players/{player}/mapvariants` | path `player`; optional query `start`, `count`, `sort`, `order` | List route; allowed `sort` fields include `name`, `description`, `accessibility`, `created`, `modified`, `bookmarkCount`. |

## Response-format notes
- Metadata route examples are documented as JSON arrays or JSON objects depending on the route.
- Stats routes are documented as JSON responses with route-specific schemas, including paged match-history envelopes and detailed match-result documents.
- UGC routes are documented as JSON list/detail responses for map and game variants.
- The profile image routes are special cases that redirect to the actual image rather than embedding binary image data in a JSON envelope.

## Important usage notes
- The official home page still labels the service `Halo Public API (Beta)`.
- The reviewed Terms of Use state Microsoft can limit calls in a given period, but no numeric quota was published on the reviewed official pages.
- Match-result routes rely on IDs discovered from player match-history routes.
- Company routes rely on a `companyId` that the reviewed docs say can be obtained from player appearance/profile data.
- Many stats routes cross-reference metadata routes for playlist IDs, season IDs, map IDs, and related lookup data.

## Integration notes for fireROUTE
- Preserve the official subscription-key names exactly: `Ocp-Apim-Subscription-Key` and `subscription-key`.
- Treat the profile image endpoints as redirect/image routes, not JSON data routes.
- Preserve query-bearing templates exactly where the official portal publishes them, especially the service-record, playlist-rating, and XP routes.
- Keep Halo 5, Halo 5 PC, and Halo Wars 2 route families separate in adapters because their path prefixes and parameter rules differ.
- Do not invent a numeric global rate limit; the reviewed official Halo sources only state that Microsoft may limit usage.

## Sources inspected
- `https://developer.haloapi.com/`
- `https://developer.haloapi.com/apis`
- `https://developer.haloapi.com/terms-of-use`
- official developer-portal route metadata exposed through the inspected portal for the `Metadata`, `Profile`, `Stats`, and `UGC` API families
