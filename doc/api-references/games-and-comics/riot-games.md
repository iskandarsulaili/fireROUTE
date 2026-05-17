# Riot Games

## Overview
- Provider: Riot Games Developer APIs
- Category: Games & Comics
- Official portal: `https://developer.riotgames.com/`
- API reference: `https://developer.riotgames.com/apis`
- Shared portal guide: `https://developer.riotgames.com/docs/portal`
- League docs page used for routing and Riot ID migration notes: `https://developer.riotgames.com/docs/lol`
- Base URL model: routed Riot API hosts rather than one flat host; the official docs explicitly show hosts such as `https://americas.api.riotgames.com` and `https://na1.api.riotgames.com`, and the API reference exposes per-family routing selectors
- HTTPS: yes
- Response format: JSON for successful `200` responses
- Confirmed route count: `85` current API-reference operations across `31` families

## Base URL and routing model
Riot's official docs do not present the provider as one single global base URL. Instead, the current public reference is routed by host value.

### Explicit host examples from the official League docs
The League docs page explicitly documents these platform-routed hosts:
- `br1.api.riotgames.com`
- `eun1.api.riotgames.com`
- `euw1.api.riotgames.com`
- `jp1.api.riotgames.com`
- `kr.api.riotgames.com`
- `la1.api.riotgames.com`
- `la2.api.riotgames.com`
- `na1.api.riotgames.com`
- `oc1.api.riotgames.com`
- `tr1.api.riotgames.com`
- `ru.api.riotgames.com`
- `ph2.api.riotgames.com`
- `sg2.api.riotgames.com`
- `th2.api.riotgames.com`
- `tw2.api.riotgames.com`
- `vn2.api.riotgames.com`

The same page explicitly documents these regional hosts:
- `americas.api.riotgames.com`
- `asia.api.riotgames.com`
- `europe.api.riotgames.com`
- `sea.api.riotgames.com`

### Routing selectors exposed by the current API reference
- `account-v1`: `AMERICAS`, `ASIA`, `EUROPE`
- LoL platform families: mostly `BR1`, `EUN1`, `EUW1`, `JP1`, `KR`, `LA1`, `LA2`, `ME1`, `NA1`, `OC1`, `RU`, `SG2`, `TR1`, `TW2`, `VN2`
- `lol-challenges-v1` and `lol-status-v4` additionally expose `PBE1`
- LoL regional families: `AMERICAS`, `ASIA`, `EUROPE`, `SEA`
- LoR families: `AMERICAS`, `EUROPE`, `SEA`; `lor-match-v1` currently also exposes `APAC` in the selector while the family note says `SEA` serves the APAC shard
- Riftbound content: `AMERICAS`, `ASIA`, `EUROPE`
- TFT platform families: same platform-style selector set used across the current TFT reference
- TFT regional families: `AMERICAS`, `ASIA`, `EUROPE`, `SEA`; `tft-match-v1` also exposes `ESPORTS` and `ESPORTSEU`
- VALORANT families: `AP`, `BR`, `ESPORTS`, `EU`, `KR`, `LATAM`, `NA` depending on family
- VALORANT console families: `AP`, `BR`, `EU`, `LATAM`, `NA`, plus required `platformType` values where documented
- Tournament families: the current public reference does not expose a routing selector; provider-registration bodies include a `region` field

## Authentication and access model
### Standard API keys
- The portal guide says logging into the developer portal automatically creates a development API key tied to the Riot account.
- Development keys deactivate every `24` hours and must be reset regularly.
- Personal keys are for private/non-public use, can request Standard APIs, and cannot request the Tournaments API.
- Production keys are for public products, can request Standard APIs and Tournaments APIs, and typically require a working prototype.
- The current API reference execute UI says an API key can be included either as a query parameter or as a header parameter.
- The shared response-code guide says missing API credentials produce `401 Unauthorized`.

### Explicit bearer-token routes
The current reference explicitly marks these operations with `Authorization` header parameters:
- `GET /riot/account/v1/accounts/me`
- `GET /riot/account/v1/accounts/me` (ESPORTS variant)
- all `lol-rso-match-v1` operations
- `GET /lor/deck/v1/decks/me`
- `POST /lor/deck/v1/decks/me`
- `GET /lor/inventory/v1/cards/me`
- `GET /lol/summoner/v4/summoners/me`
- `GET /tft/summoner/v1/summoners/me`

### Key-type limits from the portal guide
- Personal key rate limit:
  - `20 requests every 1 second`
  - `100 requests every 2 minutes`
- Production key starting rate limit:
  - `500 requests every 10 seconds`
  - `30,000 requests every 10 minutes`
- The portal guide explicitly says these limits are enforced per region.
- Personal keys may not be used for public products, including public alpha/beta tests.
- Tournament APIs are not available to personal keys.

## Rate limiting details
The portal guide says Riot uses three rate-limit types:
- application rate limits — per API key, per region
- method rate limits — per endpoint, per API key, per region
- service rate limits — per service, per region, shared across applications using that service

Additional official notes:
- `429` responses must be respected using the `Retry-After` header
- some underlying services can rate-limit independently of the API edge; in those cases Riot says a `429` may be returned without an `X-Rate-Limit-Type` header
- Riot does not publish the full bucket implementation details and says callers should assume the bucket starts with the first request

## Response format and error behavior
From the shared portal guide and current per-operation reference tables:
- Riot returns valid JSON data for successful calls
- only non-empty values are returned; omitted numeric values can be treated as `0`, omitted lists as empty, omitted strings as empty/null
- only `200` responses are guaranteed to return the documented JSON response body
- non-`200` responses are not guaranteed to include a body, and if they do the body is not guaranteed to remain stable JSON
- the guide's sample non-200 envelope is:
  ```json
  {
    "status": {
      "message": "Unauthorized",
      "status_code": 401
    }
  }
  ```
- common shared-guide errors: `400`, `401`, `403`, `404`, `415`, `429`, `500`, `503`
- current per-operation tables additionally list `405`, `502`, and `504`

## Versioning and deprecation
- The portal guide says Riot follows versioned API paths and that LoL APIs are currently version `4` with no minor version in the path.
- Riot says deprecated and replacement versions are usually supported in parallel for about `60` days, though the window can be longer or shorter.
- Calls to deprecated endpoints eventually return errors once the old version is removed.

## Pagination, filtering, and parameter patterns
Common patterns confirmed in the current reference:
- League/ladder list endpoints commonly use `page` starting at `1`
- match-list endpoints use `start` and `count`; current docs cap some list counts at `100`
- time filters use epoch seconds via `startTime` and `endTime`
- several match-list routes also accept `queue` and/or `type`
- VAL ranked leaderboards use `startIndex` and `size`, with `size` capped at `200`
- tournament code creation supports `count` with max `1000`
- content endpoints may expose `locale`
- LoR deck creation uses a JSON body with deck `code` and `name`
- tournament create/update operations use structured JSON bodies for provider registration, tournament registration, and tournament code metadata

## Confirmed endpoints

### Shared Riot account APIs
Routing: `AMERICAS`, `ASIA`, `EUROPE`

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/riot/account/v1/accounts/by-puuid/{puuid}` | Path `puuid`; current reference exposes a standard operation and a separate `ESPORTS` operation on the same path. |
| GET | `/riot/account/v1/accounts/by-puuid/{puuid}` | `ESPORTS` variant of the same route; same path, separate official operation entry. |
| GET | `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` | Path `gameName`, `tagLine`; current reference exposes a standard operation and a separate `ESPORTS` operation on the same path. |
| GET | `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` | `ESPORTS` variant of the same route. |
| GET | `/riot/account/v1/accounts/me` | Requires `Authorization` header; current reference exposes a standard operation and a separate `ESPORTS` operation on the same path. |
| GET | `/riot/account/v1/accounts/me` | `ESPORTS` bearer-token variant. |
| GET | `/riot/account/v1/active-shards/by-game/{game}/by-puuid/{puuid}` | Path `game`, `puuid`; selector shows game values `val`, `lor`, `2xko`. |
| GET | `/riot/account/v1/region/by-game/{game}/by-puuid/{puuid}` | Path `game`, `puuid`; selector shows game values `lol`, `tft`. |

### League of Legends platform-routed families
Shared routing values across these families are the platform-style Riot hosts; `lol-challenges-v1` and `lol-status-v4` also expose `PBE1`.

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/lol/champion-mastery/v4/champion-masteries/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/lol/champion-mastery/v4/champion-masteries/by-puuid/{encryptedPUUID}/by-champion/{championId}` | Path `encryptedPUUID`, `championId` integer. |
| GET | `/lol/champion-mastery/v4/champion-masteries/by-puuid/{encryptedPUUID}/top` | Path `encryptedPUUID`; optional query `count`, default `3`. |
| GET | `/lol/champion-mastery/v4/scores/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/lol/platform/v3/champion-rotations` | No request parameters documented on the current public reference. |
| GET | `/lol/clash/v1/players/by-puuid/{puuid}` | Path `puuid`. |
| GET | `/lol/clash/v1/teams/{teamId}` | Path `teamId`. |
| GET | `/lol/clash/v1/tournaments` | No request parameters documented on the current public reference. |
| GET | `/lol/clash/v1/tournaments/by-team/{teamId}` | Path `teamId`. |
| GET | `/lol/clash/v1/tournaments/{tournamentId}` | Path `tournamentId` integer. |
| GET | `/lol/league-exp/v4/entries/{queue}/{tier}/{division}` | Path `queue`, `tier`, `division`; optional query `page`; queue selector includes `RANKED_SOLO_5x5`, `RANKED_TFT`, `RANKED_FLEX_SR`, `RANKED_FLEX_TT`. |
| GET | `/lol/league/v4/challengerleagues/by-queue/{queue}` | Path `queue`; queue selector includes ranked queue values. |
| GET | `/lol/league/v4/entries/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/lol/league/v4/entries/{queue}/{tier}/{division}` | Path `queue`, `tier`, `division`; optional query `page`; tier/division selectors shown in current reference. |
| GET | `/lol/league/v4/grandmasterleagues/by-queue/{queue}` | Path `queue`. |
| GET | `/lol/league/v4/leagues/{leagueId}` | Path `leagueId`. |
| GET | `/lol/league/v4/masterleagues/by-queue/{queue}` | Path `queue`. |
| GET | `/lol/challenges/v1/challenges/config` | No request parameters documented on current public reference. |
| GET | `/lol/challenges/v1/challenges/percentiles` | No request parameters documented on current public reference. |
| GET | `/lol/challenges/v1/challenges/{challengeId}/config` | Path `challengeId` long. |
| GET | `/lol/challenges/v1/challenges/{challengeId}/leaderboards/by-level/{level}` | Path `challengeId`, `level`; optional query `limit`; level selector includes `IRON` through `CHALLENGER` plus internal sentinel values shown by the docs. |
| GET | `/lol/challenges/v1/challenges/{challengeId}/percentiles` | Path `challengeId`. |
| GET | `/lol/challenges/v1/player-data/{puuid}` | Path `puuid`. |
| GET | `/lol/status/v4/platform-data` | Platform status data; current selector includes `PBE1`. |
| GET | `/lol/spectator/v5/active-games/by-summoner/{encryptedPUUID}` | Path `encryptedPUUID`; docs label the parameter as the player's PUUID. |
| GET | `/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/lol/summoner/v4/summoners/me` | Requires `Authorization` bearer token. |

### League of Legends regional and RSO families
Routing shown by the reference: `AMERICAS`, `ASIA`, `EUROPE`, `SEA`

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/lol/match/v5/matches/by-puuid/{puuid}/ids` | Path `puuid`; optional query `startTime`, `endTime`, `queue`, `type`, `start`, `count`; type selector shows `ranked`, `normal`, `tourney`, `tutorial`; docs say `count` defaults to `20` and valid values are `0` to `100`. |
| GET | `/lol/match/v5/matches/by-puuid/{puuid}/replays` | Path `puuid`. |
| GET | `/lol/match/v5/matches/{matchId}` | Path `matchId`. |
| GET | `/lol/match/v5/matches/{matchId}/timeline` | Path `matchId`. |
| GET | `/lol/rso-match/v1/matches/ids` | Requires `Authorization` bearer token; optional query `count`, `start`, `type`, `queue`, `endTime`, `startTime`; docs say `count` defaults to `20` and valid values are `0` to `100`. |
| GET | `/lol/rso-match/v1/matches/{matchId}` | Requires `Authorization` bearer token; path `matchId`. |
| GET | `/lol/rso-match/v1/matches/{matchId}/timeline` | Requires `Authorization` bearer token; path `matchId`. |

### League tournament families
The current public reference exposes no routing selector for these operations. Provider-registration request bodies include `region`, and portal docs say tournament access is not available on personal keys.

| Method | Path | Key parameters / notes |
|---|---|---|
| POST | `/lol/tournament-stub/v5/codes` | Query `tournamentId` required, optional `count` max `1000`; body `TournamentCodeParametersV5` with `allowedParticipants`, `enoughPlayers`, `mapType`, `metadata`, `pickType`, `spectatorType`, `teamSize`. |
| GET | `/lol/tournament-stub/v5/codes/{tournamentCode}` | Path `tournamentCode`. |
| GET | `/lol/tournament-stub/v5/lobby-events/by-code/{tournamentCode}` | Path `tournamentCode`. |
| POST | `/lol/tournament-stub/v5/providers` | Body `ProviderRegistrationParametersV5` with `region` and `url`. |
| POST | `/lol/tournament-stub/v5/tournaments` | Body `TournamentRegistrationParametersV5` with `name` and `providerId`. |
| POST | `/lol/tournament/v5/codes` | Query `tournamentId` required, optional `count` max `1000`; body `TournamentCodeParametersV5`. |
| GET | `/lol/tournament/v5/codes/{tournamentCode}` | Path `tournamentCode`. |
| PUT | `/lol/tournament/v5/codes/{tournamentCode}` | Path `tournamentCode`; optional body `TournamentCodeUpdateParametersV5` with `allowedParticipants`, `mapType`, `pickType`, `spectatorType`. |
| GET | `/lol/tournament/v5/games/by-code/{tournamentCode}` | Path `tournamentCode`. |
| GET | `/lol/tournament/v5/lobby-events/by-code/{tournamentCode}` | Path `tournamentCode`. |
| POST | `/lol/tournament/v5/providers` | Body `ProviderRegistrationParametersV5` with `region` and `url`. |
| POST | `/lol/tournament/v5/tournaments` | Body `TournamentRegistrationParametersV5` with `name` and `providerId`. |

### Legends of Runeterra families
Current family notes say `AMERICAS` serves the Americas shard, `EUROPE` serves Europe, and `SEA` serves the APAC shard. The `lor-match-v1` selector currently also exposes `APAC`.

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/lor/deck/v1/decks/me` | Requires `Authorization` bearer token. |
| POST | `/lor/deck/v1/decks/me` | Requires `Authorization` bearer token; body `NewDeckDto` with `code` and `name`. |
| GET | `/lor/inventory/v1/cards/me` | Requires `Authorization` bearer token. |
| GET | `/lor/match/v1/matches/by-puuid/{puuid}/ids` | Path `puuid`. |
| GET | `/lor/match/v1/matches/{matchId}` | Path `matchId`. |
| GET | `/lor/ranked/v1/leaderboards` | No request parameters documented on current public reference. |
| GET | `/lor/status/v1/platform-data` | No request parameters documented on current public reference. |

### Riftbound
Routing shown by the current reference: `AMERICAS`, `ASIA`, `EUROPE`

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/riftbound/content/v1/contents` | Optional query `locale`; docs say it defaults to `en` and that only English is available during beta. |

### Teamfight Tactics platform-routed families
Routing shown by the current reference uses Riot platform-style values.

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/lol/spectator/tft/v5/active-games/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/tft/league/v1/by-puuid/{puuid}` | Path `puuid`. |
| GET | `/tft/league/v1/challenger` | Optional query `queue`; docs say default is `RANKED_TFT`; selector also exposes `RANKED_TFT_DOUBLE_UP`. |
| GET | `/tft/league/v1/entries/{tier}/{division}` | Path `tier`, `division`; optional query `queue` and `page`; docs say `queue` defaults to `RANKED_TFT` and `page` starts at `1`. |
| GET | `/tft/league/v1/grandmaster` | Optional query `queue`; default `RANKED_TFT`. |
| GET | `/tft/league/v1/leagues/{leagueId}` | Path `leagueId`. |
| GET | `/tft/league/v1/master` | Optional query `queue`; default `RANKED_TFT`. |
| GET | `/tft/league/v1/rated-ladders/{queue}/top` | Path `queue`; selector currently shows `RANKED_TFT_TURBO`. |
| GET | `/tft/status/v1/platform-data` | No request parameters documented on current public reference. |
| GET | `/tft/summoner/v1/summoners/by-puuid/{encryptedPUUID}` | Path `encryptedPUUID`. |
| GET | `/tft/summoner/v1/summoners/me` | Requires `Authorization` bearer token. |

### Teamfight Tactics regional families
Current family note says `AMERICAS` serves NA/BR/LAN/LAS, `ASIA` serves KR/JP, `EUROPE` serves EUNE/EUW/TR/ME1/RU, and `SEA` serves OCE/SG2/TW2/VN2. The current selector also exposes `ESPORTS` and `ESPORTSEU` for `tft-match-v1`.

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/tft/match/v1/matches/by-puuid/{puuid}/ids` | Path `puuid`; optional query `start`, `endTime`, `startTime`, `count`; docs say `start` defaults to `0` and `count` defaults to `20`. |
| GET | `/tft/match/v1/matches/{matchId}` | Path `matchId`. |

### VALORANT families
Routing selectors vary by family and include `AP`, `BR`, `ESPORTS`, `EU`, `KR`, `LATAM`, and `NA` where applicable.

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/val/content/v1/contents` | Optional query `locale`. |
| GET | `/val/match/v1/matches/{matchId}` | Path `matchId`. |
| GET | `/val/match/v1/matchlists/by-puuid/{puuid}` | Path `puuid`. |
| GET | `/val/match/v1/recent-matches/by-queue/{queue}` | Path `queue`; current selector includes `competitive`, `unrated`, `spikerush`, `tournamentmode`, `deathmatch`, `onefa`, `ggteam`, `hurm`, `swiftplay`, `skirmish2v2`, `skirmishascension1v1`, `skirmishascension2v2`. |
| GET | `/val/ranked/v1/leaderboards/by-act/{actId}` | Path `actId`; optional query `size` default `200` valid `1..200`, and `startIndex` default `0`; docs say act IDs can be obtained from `val-content-v1`. |
| GET | `/val/status/v1/platform-data` | No request parameters documented on current public reference. |

### VALORANT console families
Routing selectors shown by the current public reference: `AP`, `BR`, `EU`, `LATAM`, `NA`

| Method | Path | Key parameters / notes |
|---|---|---|
| GET | `/val/match/console/v1/matches/{matchId}` | Path `matchId`. |
| GET | `/val/match/console/v1/matchlists/by-puuid/{puuid}` | Path `puuid`; required query `platformType` with selector values `playstation` or `xbox`. |
| GET | `/val/match/console/v1/recent-matches/by-queue/{queue}` | Path `queue`; selector includes `console_unrated`, `console_swiftplay`, `console_hurm`, `console_deathmatch`, `console_competitive`, `console_skirmish2v2`, `console_skirmishascension1v1`, `console_skirmishascension2v2`. |
| GET | `/val/console/ranked/v1/leaderboards/by-act/{actId}` | Path `actId`; required query `platformType` (`playstation` or `xbox`); optional `startIndex` default `0` and `size` default `200` valid `1..200`. |

## Important usage notes
- Riot's official docs recommend Riot ID (`gameName` + `tagLine`) and `PUUID` over legacy Summoner Name lookups.
- The League docs explicitly mark `/lol/summoner/v4/summoners/by-name/{summonerName}` and `/tft/summoner/v1/summoners/by-name/{summonerName}` as deprecated and recommend migrating through `account-v1` + `by-puuid` workflows instead.
- The API reference currently counts several same-path operations separately when Riot exposes distinct standard vs `ESPORTS` entries.
- The current public route count here intentionally covers the route-bearing families exposed on `https://developer.riotgames.com/apis`; it does not count auxiliary static-data surfaces like Data Dragon.
- LoR shard wording is currently inconsistent in the public reference: family notes say `SEA` serves APAC, while `lor-match-v1` still exposes `APAC` as an execution selector.
- Tournament routes are special-case operations with structured request bodies and product approval constraints; do not treat them like ordinary read-only key endpoints.
- Riot says valid API-key calls to deprecated endpoints will eventually return errors once the old version is removed.

## Integration notes for fireROUTE
- Treat Riot as a large routed multi-product API surface, not as a single-host flat REST API.
- Keep routing metadata attached to each family because the same provider mixes platform routing, regional routing, bearer-token account routes, and tournament product flows.
- Preserve the distinction between portal-issued API-key routes and explicit `Authorization: Bearer` RSO routes.
- Preserve duplicate official operations where Riot documents the same path separately, especially the `ESPORTS` variants under `account-v1`.
- Model `match-v5`, `lol-rso-match-v1`, `tft-match-v1`, and ranked leaderboard endpoints with their list/query-window parameters rather than flattening them into unparameterized lookups.

## Sources inspected
- `https://developer.riotgames.com/`
- `https://developer.riotgames.com/apis`
- `https://developer.riotgames.com/docs/portal`
- `https://developer.riotgames.com/docs/lol`
- official current-family detail pages loaded from Riot's own API reference endpoint pattern: `https://developer.riotgames.com/api-details/{family}` for the `31` families listed on the live `/apis` page
