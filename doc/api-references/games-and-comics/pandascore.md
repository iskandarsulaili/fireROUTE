# PandaScore

## Overview
- Provider: PandaScore REST API and Live API
- Category: Games & Comics
- Official docs: `https://developers.pandascore.co/`
- REST API reference: `https://developers.pandascore.co/reference`
- Base URL: `https://api.pandascore.co`
- Live WebSocket base: `wss://live.pandascore.co`
- Auth: required on all REST routes; PandaScore accepts `Authorization: Bearer <token>` or a `token` query parameter for REST, while WebSockets only accept the `token` query parameter
- HTTPS: yes
- Response formats: JSON over HTTPS for REST; JSON messages over secure WebSockets for live feeds
- Confirmed routes: `388` documented REST routes (`388` GET operations)
- Live feed note: the `/lives` REST endpoint returns WebSocket feed URLs such as `wss://live.pandascore.co/matches/{match_id}` and `wss://live.pandascore.co/matches/{match_id}/events`; those feed URLs are documented below but are not included in the `388` REST-route count

## Global notes from the official docs
- The REST API works over HTTPS on `api.pandascore.co` and returns JSON only.
- Access to both REST and WebSocket APIs is token-gated; the authentication guide explicitly warns not to expose tokens in client-side applications.
- The current official reference exposes `388` GET endpoints across `16` route categories.
- Route families are heavily normalized across the game-specific namespaces, so most games repeat the same leagues / matches / series / teams / tournaments pattern with sport-specific extras.
- Collection endpoints are paginated by default with `50` items per page and a maximum of `100` items per page.
- Shared collection-query patterns are documented as `filter[...]`, `search[...]`, `range[...]`, `sort`, `page`, and `per_page`.
- Tournament-level field `live_supported=true` indicates live-feed availability; when enabled, PandaScore says a WebSocket opens `15 minutes` before scheduled match time.

## Route counts by category
- All Videogames: `58`
- Call of Duty: `15`
- Counter-Strike: `33`
- Dota 2: `33`
- EA Sports FC: `15`
- League of Legends: `48`
- LoL Wild Rift: `15`
- Mobile Legends: Bang Bang: `15`
- Overwatch: `27`
- PUBG: `15`
- Rainbow Six Siege: `15`
- Rocket League: `15`
- Valorant: `39`
- King of Glory: `15`
- StarCraft 2: `15`
- StarCraft Brood War: `15`

## Authentication and rate limits
- REST API auth methods from the official authentication page:
  - `Authorization: Bearer <token>` header
  - `?token=<token>` query parameter
- WebSocket auth method from the same page:
  - append `?token=<token>` to the `wss://live.pandascore.co/...` URL
- The auth docs say the access token is available in the PandaScore dashboard.
- The auth docs explicitly warn: `This token is private, do not use it in client-side applications.`
- Live anonymous check during this review: `GET https://api.pandascore.co/videogames` returned `403` with JSON body `{"error":"Token is missing"}`.
- Official REST rate-limit note: each response includes `X-Rate-Limit-Remaining`.
- Official REST hourly quotas by plan:
  - Schedules, Results & Context Data: `1k requests/hour`
  - Historical & Post-Match Data: `10k requests/hour`
  - Real-time Data (Basic): `10k requests/hour`
  - Real-time Data (Pro): `10k requests/hour`
- Official WebSocket connection limit: maximum `3` simultaneous connections to a given match, per endpoint.

## Parameters, pagination, filtering, and sorting
- Shared collection parameters confirmed from the docs and live reference schemas:
  - `filter[field]=value` for exact-match filtering; comma-separated values are allowed
  - `search[field]=value` for substring search on string fields
  - `range[field]=min,max` for numeric intervals
  - `sort=field` or `sort=-field` for ascending / descending sorting; comma-separated multi-field sort is supported
  - `page[number]` and `page[size]` for pagination
  - `per_page` as a documented alias for `page[size]`
- Pagination behavior from the official pagination guide:
  - default page size: `50`
  - maximum page size: `100`
  - first page number: `1`
  - `Link` response header carries `first`, `previous`, `next`, and `last` links as applicable
  - additional pagination headers: `X-Page`, `X-Per-Page`, and `X-Total`
- Date handling notes from the filtering docs:
  - filter dates should be supplied in UTC
  - date filtering ignores the time-of-day portion and compares on day / month / year
- Example reference-schema confirmation from `GET /matches`: the operation documents `filter`, `range`, `sort`, `search`, `page`, and `per_page` query parameters and `200/400/401/403/404/422` response codes.

## Errors and response-format notes
- REST data format notes from the official formats page:
  - data is sent and received as JSON
  - blank fields are included as `null` instead of being omitted
  - all dates are returned in ISO-8601 format, UTC time
- Error handling from the official errors guide:
  - `200` success — request worked as expected
  - `4xx` error — request failed because of request parameters or access constraints
  - `5xx` error — request failed because of PandaScore server-side issues
- Official client-error meanings:
  - `400 Bad Request` — malformed request, commonly bad query syntax
  - `401 Unauthorized` — missing token
  - `403 Forbidden` — endpoint or field not available on the current plan
  - `404 Not Found` — resource does not exist
  - `429 Too Many Requests` — plan rate limit reached
- The errors guide says client-error bodies are JSON with two fields:
  - `error` — unique identifier
  - `message` — human-readable explanation
- The reviewed reference schemas also document `422 Unprocessable Entity` on many endpoints, so fireROUTE should allow that status even though the higher-level errors page focuses on the more common codes above.

## Live API / WebSocket notes
- The Live API overview says to discover currently open live feeds via `GET /lives`.
- Each `/lives` match entry contains `endpoints` objects that include:
  - `type: "frames"` with URL pattern `wss://live.pandascore.co/matches/{match_id}`
  - `type: "events"` with URL pattern `wss://live.pandascore.co/matches/{match_id}/events`
- The overview says the server sends an initial `{"type":"hello","payload":{}}` event after a successful WebSocket connection.
- Official disconnect semantics from the disconnections guide:
  - `1000` — normal closure when the match finished
  - `4001` — unauthorized / missing token
  - `4003` — forbidden / plan does not include the socket URL
  - `4029` — too many simultaneous connections to the match (more than `3`)
  - other `1xxx` non-`1000` closures indicate server-side issues; the docs recommend reconnecting, and for the Events feed also considering events recovery

## Important usage notes
- Every REST request must be authenticated; unlike some public esports indexes, PandaScore is not anonymously browseable.
- Because many endpoints are plan-gated, a `403` can mean either a route family or a specific response field is unavailable on the current plan.
- Prefer using `/lives` plus tournament `live_supported` to discover live coverage instead of hard-coding socket assumptions.
- Preserve PandaScore's normalized route families internally; the same abstractions repeat across general endpoints and game-specific namespaces.
- Preserve `Link`, `X-Page`, `X-Per-Page`, `X-Total`, and `X-Rate-Limit-Remaining` headers when possible because the docs rely on them for pagination and quota handling.

## Confirmed endpoint inventory

### All Videogames (58)

#### Incidents (4)
- GET `/additions` — List additions.
- GET `/changes` — List changes.
- GET `/deletions` — List deletions.
- GET `/incidents` — List changes, additions and deletions.

#### Leagues (8)
- GET `/leagues` — List leagues.
- GET `/leagues/{league_id_or_slug}` — Get a league.
- GET `/leagues/{league_id_or_slug}/matches` — Get matches for a league.
- GET `/leagues/{league_id_or_slug}/matches/past` — Get past matches for league.
- GET `/leagues/{league_id_or_slug}/matches/running` — Get running matches for league.
- GET `/leagues/{league_id_or_slug}/matches/upcoming` — Get upcoming matches for league.
- GET `/leagues/{league_id_or_slug}/series` — List series of a league.
- GET `/leagues/{league_id_or_slug}/tournaments` — Get tournaments for a league.

#### Lives (1)
- GET `/lives` — List lives matches.

#### Matches (6)
- GET `/matches` — List matches.
- GET `/matches/past` — Get past matches.
- GET `/matches/running` — Get running matches.
- GET `/matches/upcoming` — Get upcoming matches.
- GET `/matches/{match_id_or_slug}` — Get a match.
- GET `/matches/{match_id_or_slug}/opponents` — Get match's opponents.

#### Players (6)
- GET `/players` — List players.
- GET `/players/{player_id_or_slug}` — Get a player.
- GET `/players/{player_id_or_slug}/leagues` — Get leagues for a player.
- GET `/players/{player_id_or_slug}/matches` — Get matches for a player.
- GET `/players/{player_id_or_slug}/series` — Get series for a player.
- GET `/players/{player_id_or_slug}/tournaments` — Get tournaments for a player.

#### Series (10)
- GET `/series` — List series.
- GET `/series/past` — Get past series.
- GET `/series/running` — Get running series.
- GET `/series/upcoming` — Get upcoming series.
- GET `/series/{serie_id_or_slug}` — Get a serie.
- GET `/series/{serie_id_or_slug}/matches` — Get matches for a serie.
- GET `/series/{serie_id_or_slug}/matches/past` — Get past matches for serie.
- GET `/series/{serie_id_or_slug}/matches/running` — Get running matches for serie.
- GET `/series/{serie_id_or_slug}/matches/upcoming` — Get upcoming matches for serie.
- GET `/series/{serie_id_or_slug}/tournaments` — Get tournaments for a serie.

#### Teams (6)
- GET `/teams` — List teams.
- GET `/teams/{team_id_or_slug}` — Get a team.
- GET `/teams/{team_id_or_slug}/leagues` — Get leagues for a team.
- GET `/teams/{team_id_or_slug}/matches` — Get matches for team.
- GET `/teams/{team_id_or_slug}/series` — Get series for a team.
- GET `/teams/{team_id_or_slug}/tournaments` — Get tournaments for a team.

#### Tournaments (10)
- GET `/tournaments` — List tournaments.
- GET `/tournaments/past` — Get past tournaments.
- GET `/tournaments/running` — Get running tournaments.
- GET `/tournaments/upcoming` — Get upcoming tournaments.
- GET `/tournaments/{tournament_id_or_slug}` — Get a tournament.
- GET `/tournaments/{tournament_id_or_slug}/brackets` — Get a tournament's brackets.
- GET `/tournaments/{tournament_id_or_slug}/matches` — Get matches for tournament.
- GET `/tournaments/{tournament_id_or_slug}/rosters` — Get rosters for a tournament.
- GET `/tournaments/{tournament_id_or_slug}/standings` — Get tournament standings.
- GET `/tournaments/{tournament_id_or_slug}/teams` — Get teams for a tournament.

#### Videogames (7)
- GET `/videogames` — List videogames.
- GET `/videogames/{videogame_id_or_slug}` — Get a videogame.
- GET `/videogames/{videogame_id_or_slug}/leagues` — List leagues for a videogame.
- GET `/videogames/{videogame_id_or_slug}/series` — List series for a videogame.
- GET `/videogames/{videogame_id_or_slug}/titles` — List videogame titles.
- GET `/videogames/{videogame_id_or_slug}/tournaments` — Get tournaments for a videogame.
- GET `/videogames/{videogame_id_or_slug}/versions` — List videogame versions.

### Call of Duty (15)

#### CODMW leagues (1)
- GET `/codmw/leagues` — Get CODMW leagues.

#### CODMW matches (4)
- GET `/codmw/matches` — List CODMW matches.
- GET `/codmw/matches/past` — Get past CODMW matches.
- GET `/codmw/matches/running` — Get running CODMW matches.
- GET `/codmw/matches/upcoming` — Get upcoming CODMW matches.

#### CODMW players (1)
- GET `/codmw/players` — List CODMW players.

#### CODMW series (4)
- GET `/codmw/series` — List CODMW series.
- GET `/codmw/series/past` — Get past CODMW series.
- GET `/codmw/series/running` — Get running CODMW series.
- GET `/codmw/series/upcoming` — Get upcoming CODMW series.

#### CODMW teams (1)
- GET `/codmw/teams` — List CODMW teams.

#### CODMW tournaments (4)
- GET `/codmw/tournaments` — List CODMW tournaments.
- GET `/codmw/tournaments/past` — Get past CODMW tournaments.
- GET `/codmw/tournaments/running` — Get running CODMW tournaments.
- GET `/codmw/tournaments/upcoming` — Get upcoming CODMW tournaments.

### Counter-Strike (33)

#### Counter-Strike games (4)
- GET `/csgo/games/{csgo_game_id}` — Get a game.
- GET `/csgo/games/{csgo_game_id}/events` — List Play-by-Play events for a given game.
- GET `/csgo/games/{csgo_game_id}/rounds` — List rounds in a Counter-Strike game.
- GET `/csgo/matches/{match_id_or_slug}/games` — List games for a given match.

#### Counter-Strike leagues (1)
- GET `/csgo/leagues` — Get Counter-Strike leagues.

#### Counter-Strike maps (2)
- GET `/csgo/maps` — List maps.
- GET `/csgo/maps/{csgo_map_id}` — Get a map.

#### Counter-Strike matches (5)
- GET `/csgo/matches` — List Counter-Strike matches.
- GET `/csgo/matches/past` — Get past Counter-Strike matches.
- GET `/csgo/matches/running` — Get running Counter-Strike matches.
- GET `/csgo/matches/upcoming` — Get upcoming Counter-Strike matches.
- GET `/csgo/matches/{match_id_or_slug}` — Get a Counter-Strike match.

#### Counter-Strike stats (9)
- GET `/csgo/matches/{match_id_or_slug}/players/stats` — Get stats for Counter-Strike players on match.
- GET `/csgo/matches/{match_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for Counter-Strike player on match.
- GET `/csgo/matches/{match_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for Counter-Strike team on match.
- GET `/csgo/players/{player_id_or_slug}/stats` — Get stats for Counter-Strike player.
- GET `/csgo/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for Counter-Strike player on serie.
- GET `/csgo/series/{serie_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for Counter-Strike team on serie.
- GET `/csgo/teams/{team_id_or_slug}/stats` — Get stats for Counter-Strike team.
- GET `/csgo/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for Counter-Strike player on tournament.
- GET `/csgo/tournaments/{tournament_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for Counter-Strike team on tournament.

#### Counter-Strike players (1)
- GET `/csgo/players` — List Counter-Strike players.

#### Counter-Strike series (4)
- GET `/csgo/series` — List Counter-Strike series.
- GET `/csgo/series/past` — Get past Counter-Strike series.
- GET `/csgo/series/running` — Get running Counter-Strike series.
- GET `/csgo/series/upcoming` — Get upcoming Counter-Strike series.

#### Counter-Strike teams (1)
- GET `/csgo/teams` — List Counter-Strike teams.

#### Counter-Strike tournaments (4)
- GET `/csgo/tournaments` — List Counter-Strike tournaments.
- GET `/csgo/tournaments/past` — Get past Counter-Strike tournaments.
- GET `/csgo/tournaments/running` — Get running Counter-Strike tournaments.
- GET `/csgo/tournaments/upcoming` — Get upcoming Counter-Strike tournaments.

#### Counter-Strike weapons (2)
- GET `/csgo/weapons` — List weapons.
- GET `/csgo/weapons/{csgo_weapon_id_or_slug}` — Get a weapon.

### Dota 2 (33)

#### Dota2 abilities (2)
- GET `/dota2/abilities` — List abilities.
- GET `/dota2/abilities/{dota2_ability_id_or_slug}` — Get an ability.

#### Dota2 games (4)
- GET `/dota2/games/{dota2_game_id}` — Get a game.
- GET `/dota2/games/{dota2_game_id}/frames` — List frames for a given game.
- GET `/dota2/matches/{match_id_or_slug}/games` — List games for a given match.
- GET `/dota2/teams/{team_id_or_slug}/games` — List finished games for a given team.

#### Dota2 heroes (2)
- GET `/dota2/heroes` — List heroes.
- GET `/dota2/heroes/{dota2_hero_id_or_slug}` — Get an hero.

#### Dota2 items (2)
- GET `/dota2/items` — List items.
- GET `/dota2/items/{dota2_item_id_or_slug}` — Get an item.

#### Dota2 leagues (1)
- GET `/dota2/leagues` — Get Dota 2 leagues.

#### Dota2 matches (4)
- GET `/dota2/matches` — List Dota 2 matches.
- GET `/dota2/matches/past` — Get past Dota 2 matches.
- GET `/dota2/matches/running` — Get running Dota 2 matches.
- GET `/dota2/matches/upcoming` — Get upcoming Dota 2 matches.

#### Dota2 stats (7)
- GET `/dota2/matches/{match_id_or_slug}/players/stats` — Get stats for Dota2 players on match.
- GET `/dota2/players/{player_id_or_slug}/stats` — Get stats for Dota2 player.
- GET `/dota2/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for Dota2 player on serie.
- GET `/dota2/series/{serie_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for Dota2 team on serie.
- GET `/dota2/teams/{team_id_or_slug}/stats` — Get stats for Dota2 team.
- GET `/dota2/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for Dota2 player on tournament.
- GET `/dota2/tournaments/{tournament_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for Dota2 team on tournament.

#### Dota2 players (1)
- GET `/dota2/players` — List Dota 2 players.

#### Dota2 series (4)
- GET `/dota2/series` — List Dota 2 series.
- GET `/dota2/series/past` — Get past Dota 2 series.
- GET `/dota2/series/running` — Get running Dota 2 series.
- GET `/dota2/series/upcoming` — Get upcoming Dota 2 series.

#### Dota2 teams (2)
- GET `/dota2/series/{serie_id_or_slug}/teams` — List Dota 2 teams for a serie.
- GET `/dota2/teams` — List Dota 2 teams.

#### Dota2 tournaments (4)
- GET `/dota2/tournaments` — List Dota 2 tournaments.
- GET `/dota2/tournaments/past` — Get past Dota 2 tournaments.
- GET `/dota2/tournaments/running` — Get running Dota 2 tournaments.
- GET `/dota2/tournaments/upcoming` — Get upcoming Dota 2 tournaments.

### EA Sports FC (15)

#### EA Sports FC leagues (1)
- GET `/fifa/leagues` — Get EA Sports FC leagues.

#### EA Sports FC matches (4)
- GET `/fifa/matches` — List EA Sports FC matches.
- GET `/fifa/matches/past` — Get past EA Sports FC matches.
- GET `/fifa/matches/running` — Get running EA Sports FC matches.
- GET `/fifa/matches/upcoming` — Get upcoming EA Sports FC matches.

#### EA Sports FC players (1)
- GET `/fifa/players` — List EA Sports FC players.

#### EA Sports FC series (4)
- GET `/fifa/series` — List EA Sports FC series.
- GET `/fifa/series/past` — Get past EA Sports FC series.
- GET `/fifa/series/running` — Get running EA Sports FC series.
- GET `/fifa/series/upcoming` — Get upcoming EA Sports FC series.

#### EA Sports FC teams (1)
- GET `/fifa/teams` — List EA Sports FC teams.

#### EA Sports FC tournaments (4)
- GET `/fifa/tournaments` — List EA Sports FC tournaments.
- GET `/fifa/tournaments/past` — Get past EA Sports FC tournaments.
- GET `/fifa/tournaments/running` — Get running EA Sports FC tournaments.
- GET `/fifa/tournaments/upcoming` — Get upcoming EA Sports FC tournaments.

### League of Legends (48)

#### LoL champions (4)
- GET `/lol/champions` — List champions.
- GET `/lol/champions/{lol_champion_id}` — Get a champion.
- GET `/lol/versions/all/champions` — List champions for all version.
- GET `/lol/versions/{lol_version_name}/champions` — List champions for version.

#### LoL games (5)
- GET `/lol/games/{lol_game_id}` — Get a game.
- GET `/lol/games/{lol_game_id}/events` — List Play-by-Play events for a given game.
- GET `/lol/games/{lol_game_id}/frames` — List Play-by-Play frames for a given game.
- GET `/lol/matches/{match_id_or_slug}/games` — List games for a given match.
- GET `/lol/teams/{team_id_or_slug}/games` — List finished games for a given team.

#### LoL items (4)
- GET `/lol/items` — List items.
- GET `/lol/items/{lol_item_id}` — Get an item.
- GET `/lol/versions/all/items` — List items for all version.
- GET `/lol/versions/{lol_version_name}/items` — List items for version.

#### LoL leagues (1)
- GET `/lol/leagues` — Get LoL leagues.

#### LoL masteries (2)
- GET `/lol/masteries` — List masteries.
- GET `/lol/masteries/{lol_mastery_id}` — Get a mastery.

#### LoL matches (5)
- GET `/lol/matches` — List LoL matches.
- GET `/lol/matches/past` — Get past LoL matches.
- GET `/lol/matches/running` — Get running LoL matches.
- GET `/lol/matches/upcoming` — Get upcoming LoL matches.
- GET `/lol/matches/{match_id_or_slug}` — Get a LoL match.

#### LoL stats (8)
- GET `/lol/matches/{match_id_or_slug}/players/stats` — Get stats for LoL players on match.
- GET `/lol/players/{player_id_or_slug}/stats` — Get stats for LoL player.
- GET `/lol/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for LoL player on serie.
- GET `/lol/series/{serie_id_or_slug}/teams/stats` — Get stats for LoL teams on serie.
- GET `/lol/series/{serie_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for LoL team on serie.
- GET `/lol/teams/{team_id_or_slug}/stats` — Get stats for LoL team.
- GET `/lol/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for LoL player on tournament.
- GET `/lol/tournaments/{tournament_id_or_slug}/teams/{team_id_or_slug}/stats` — Get stats for LoL team on tournament.

#### LoL players (1)
- GET `/lol/players` — List LoL players.

#### LoL runes (6)
- GET `/lol/runes` — List runes.
- GET `/lol/runes-reforged` — List LoL runes.
- GET `/lol/runes-reforged-paths` — List rune paths.
- GET `/lol/runes-reforged-paths/{lol_rune_path_id}` — Get a LoL rune path.
- GET `/lol/runes-reforged/{lol_rune_reforged_id}` — Get a LoL rune.
- GET `/lol/runes/{lol_rune_id}` — Get a rune.

#### LoL series (4)
- GET `/lol/series` — List LoL series.
- GET `/lol/series/past` — Get past LoL series.
- GET `/lol/series/running` — Get running LoL series.
- GET `/lol/series/upcoming` — Get upcoming LoL series.

#### LoL teams (2)
- GET `/lol/series/{serie_id_or_slug}/teams` — List LoL teams for a serie.
- GET `/lol/teams` — List LoL teams.

#### LoL spells (2)
- GET `/lol/spells` — List spells.
- GET `/lol/spells/{lol_spell_id}` — Get a spell.

#### LoL tournaments (4)
- GET `/lol/tournaments` — List LoL tournaments.
- GET `/lol/tournaments/past` — Get past LoL tournaments.
- GET `/lol/tournaments/running` — Get running LoL tournaments.
- GET `/lol/tournaments/upcoming` — Get upcoming LoL tournaments.

### LoL Wild Rift (15)

#### LoL Wild Rift leagues (1)
- GET `/lol-wild-rift/leagues` — Get LoL Wild Rift leagues.

#### LoL Wild Rift matches (4)
- GET `/lol-wild-rift/matches` — List LoL Wild Rift matches.
- GET `/lol-wild-rift/matches/past` — Get past LoL Wild Rift matches.
- GET `/lol-wild-rift/matches/running` — Get running LoL Wild Rift matches.
- GET `/lol-wild-rift/matches/upcoming` — Get upcoming LoL Wild Rift matches.

#### LoL Wild Rift players (1)
- GET `/lol-wild-rift/players` — List LoL Wild Rift players.

#### LoL Wild Rift series (4)
- GET `/lol-wild-rift/series` — List LoL Wild Rift series.
- GET `/lol-wild-rift/series/past` — Get past LoL Wild Rift series.
- GET `/lol-wild-rift/series/running` — Get running LoL Wild Rift series.
- GET `/lol-wild-rift/series/upcoming` — Get upcoming LoL Wild Rift series.

#### LoL Wild Rift teams (1)
- GET `/lol-wild-rift/teams` — List LoL Wild Rift teams.

#### LoL Wild Rift tournaments (4)
- GET `/lol-wild-rift/tournaments` — List LoL Wild Rift tournaments.
- GET `/lol-wild-rift/tournaments/past` — Get past LoL Wild Rift tournaments.
- GET `/lol-wild-rift/tournaments/running` — Get running LoL Wild Rift tournaments.
- GET `/lol-wild-rift/tournaments/upcoming` — Get upcoming LoL Wild Rift tournaments.

### Mobile Legends: Bang Bang (15)

#### Mobile Legends: Bang Bang leagues (1)
- GET `/mlbb/leagues` — Get ML:BB Leagues.

#### Mobile Legends: Bang Bang matches (4)
- GET `/mlbb/matches` — List ML:BB matches.
- GET `/mlbb/matches/past` — Get past ML:BB matches.
- GET `/mlbb/matches/running` — Get running ML:BB matches.
- GET `/mlbb/matches/upcoming` — Get upcoming ML:BB matches.

#### Mobile Legends: Bang Bang players (1)
- GET `/mlbb/players` — List ML:BB players.

#### Mobile Legends: Bang Bang series (4)
- GET `/mlbb/series` — List ML:BB series.
- GET `/mlbb/series/past` — Get past ML:BB series.
- GET `/mlbb/series/running` — Get running ML:BB series.
- GET `/mlbb/series/upcoming` — Get upcoming ML:BB series.

#### Mobile Legends: Bang Bang teams (1)
- GET `/mlbb/teams` — List ML:BB teams.

#### Mobile Legends: Bang Bang tournaments (4)
- GET `/mlbb/tournaments` — List ML:BB tournaments.
- GET `/mlbb/tournaments/past` — Get past ML:BB tournaments.
- GET `/mlbb/tournaments/running` — Get running ML:BB tournaments.
- GET `/mlbb/tournaments/upcoming` — Get upcoming ML:BB tournaments.

### Overwatch (27)

#### OW games (2)
- GET `/ow/games/{ow_game_id}` — Get a game.
- GET `/ow/matches/{match_id_or_slug}/games` — List games for a given match.

#### OW stats (6)
- GET `/ow/games/{ow_game_id}/players/{player_id_or_slug}/stats` — Get stats for OW player on game.
- GET `/ow/matches/{match_id_or_slug}/players/stats` — Get stats for OW players on match.
- GET `/ow/matches/{match_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for OW player on match.
- GET `/ow/players/{player_id_or_slug}/stats` — Get stats for OW player.
- GET `/ow/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for OW player on serie.
- GET `/ow/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats` — Get stats for OW player on tournament.

#### OW heroes (2)
- GET `/ow/heroes` — List heroes.
- GET `/ow/heroes/{ow_hero_id_or_slug}` — Get an hero.

#### OW leagues (1)
- GET `/ow/leagues` — Get Overwatch leagues.

#### OW maps (2)
- GET `/ow/maps` — List maps.
- GET `/ow/maps/{ow_map_id_or_slug}` — Get a map.

#### OW matches (4)
- GET `/ow/matches` — List Overwatch matches.
- GET `/ow/matches/past` — Get past Overwatch matches.
- GET `/ow/matches/running` — Get running Overwatch matches.
- GET `/ow/matches/upcoming` — Get upcoming Overwatch matches.

#### OW players (1)
- GET `/ow/players` — List Overwatch players.

#### OW series (4)
- GET `/ow/series` — List Overwatch series.
- GET `/ow/series/past` — Get past Overwatch series.
- GET `/ow/series/running` — Get running Overwatch series.
- GET `/ow/series/upcoming` — Get upcoming Overwatch series.

#### OW teams (1)
- GET `/ow/teams` — List Overwatch teams.

#### OW tournaments (4)
- GET `/ow/tournaments` — List Overwatch tournaments.
- GET `/ow/tournaments/past` — Get past Overwatch tournaments.
- GET `/ow/tournaments/running` — Get running Overwatch tournaments.
- GET `/ow/tournaments/upcoming` — Get upcoming Overwatch tournaments.

### PUBG (15)

#### PUBG leagues (1)
- GET `/pubg/leagues` — Get PUBG leagues.

#### PUBG matches (4)
- GET `/pubg/matches` — List PUBG matches.
- GET `/pubg/matches/past` — Get past PUBG matches.
- GET `/pubg/matches/running` — Get running PUBG matches.
- GET `/pubg/matches/upcoming` — Get upcoming PUBG matches.

#### PUBG players (1)
- GET `/pubg/players` — List PUBG players.

#### PUBG series (4)
- GET `/pubg/series` — List PUBG series.
- GET `/pubg/series/past` — Get past PUBG series.
- GET `/pubg/series/running` — Get running PUBG series.
- GET `/pubg/series/upcoming` — Get upcoming PUBG series.

#### PUBG teams (1)
- GET `/pubg/teams` — List PUBG teams.

#### PUBG tournaments (4)
- GET `/pubg/tournaments` — List PUBG tournaments.
- GET `/pubg/tournaments/past` — Get past PUBG tournaments.
- GET `/pubg/tournaments/running` — Get running PUBG tournaments.
- GET `/pubg/tournaments/upcoming` — Get upcoming PUBG tournaments.

### Rainbow Six Siege (15)

#### R6Siege leagues (1)
- GET `/r6siege/leagues` — Get R6siege leagues.

#### R6Siege matches (4)
- GET `/r6siege/matches` — List R6Siege matches.
- GET `/r6siege/matches/past` — Get past R6siege matches.
- GET `/r6siege/matches/running` — Get running R6siege matches.
- GET `/r6siege/matches/upcoming` — Get upcoming R6siege matches.

#### R6Siege players (1)
- GET `/r6siege/players` — List R6Siege players.

#### R6Siege series (4)
- GET `/r6siege/series` — List R6Siege series.
- GET `/r6siege/series/past` — Get past R6siege series.
- GET `/r6siege/series/running` — Get running R6siege series.
- GET `/r6siege/series/upcoming` — Get upcoming R6siege series.

#### R6Siege teams (1)
- GET `/r6siege/teams` — List R6Siege teams.

#### R6Siege tournaments (4)
- GET `/r6siege/tournaments` — List R6Siege tournaments.
- GET `/r6siege/tournaments/past` — Get past R6Siege tournaments.
- GET `/r6siege/tournaments/running` — Get running R6Siege tournaments.
- GET `/r6siege/tournaments/upcoming` — Get upcoming R6Siege tournaments.

### Rocket League (15)

#### RL leagues (1)
- GET `/rl/leagues` — Get RL leagues.

#### RL matches (4)
- GET `/rl/matches` — List rl matches.
- GET `/rl/matches/past` — Get past Rocket League matches.
- GET `/rl/matches/running` — Get running Rocket League matches.
- GET `/rl/matches/upcoming` — Get upcoming Rocket League matches.

#### RL players (1)
- GET `/rl/players` — List Rocket League players.

#### RL series (4)
- GET `/rl/series` — List Rocket League series.
- GET `/rl/series/past` — Get past Rocket League series.
- GET `/rl/series/running` — Get running Rocket League series.
- GET `/rl/series/upcoming` — Get upcoming Rocket League series.

#### RL teams (1)
- GET `/rl/teams` — List Rocket League teams.

#### RL tournaments (4)
- GET `/rl/tournaments` — List Rocket League tournaments.
- GET `/rl/tournaments/past` — Get past Rocket League tournaments.
- GET `/rl/tournaments/running` — Get running Rocket League tournaments.
- GET `/rl/tournaments/upcoming` — Get upcoming Rocket League tournaments.

### Valorant (39)

#### Valorant abilities (2)
- GET `/valorant/abilities` — List Valorant abilities.
- GET `/valorant/abilities/{valorant_ability_id}` — Get a Valorant ability by its ID.

#### Valorant agents (4)
- GET `/valorant/agents` — List Valorant agents.
- GET `/valorant/agents/{valorant_agent_id}` — Get a Valorant agent by its ID.
- GET `/valorant/versions/all/agents` — List Valorant agents for all versions.
- GET `/valorant/versions/{valorant_version_name}/agents` — List Valorant agents for a specific version.

#### Valorant games (4)
- GET `/valorant/games/{valorant_game_id}` — Get a game.
- GET `/valorant/games/{valorant_game_id}/events` — List Play-by-Play events for a given game.
- GET `/valorant/games/{valorant_game_id}/rounds` — List rounds in a Valorant game.
- GET `/valorant/matches/{match_id_or_slug}/games` — List games for a given match.

#### Valorant leagues (1)
- GET `/valorant/leagues` — Get Valorant leagues.

#### Valorant maps (4)
- GET `/valorant/maps` — List Valorant maps.
- GET `/valorant/maps/{valorant_map_id}` — Get a Valorant map by its ID.
- GET `/valorant/versions/all/maps` — List Valorant maps for all versions.
- GET `/valorant/versions/{valorant_version_name}/maps` — List Valorant maps for a specific version.

#### Valorant matches (4)
- GET `/valorant/matches` — List Valorant matches.
- GET `/valorant/matches/past` — Get past Valorant matches.
- GET `/valorant/matches/running` — Get running Valorant matches.
- GET `/valorant/matches/upcoming` — Get upcoming Valorant matches.

#### Valorant stats (8)
- GET `/valorant/matches/{match_id_or_slug}/players/stats` — Get players stats for a Valorant match.
- GET `/valorant/matches/{match_id_or_slug}/teams/{team_id_or_slug}/stats` — Get team stats for a Valorant match.
- GET `/valorant/players/{player_id_or_slug}/stats` — Get a Valorant player stats.
- GET `/valorant/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats` — Get player stats for a Valorant series.
- GET `/valorant/series/{serie_id_or_slug}/teams/{team_id_or_slug}/stats` — Get team stats for a Valorant series.
- GET `/valorant/teams/{team_id_or_slug}/stats` — Get a Valorant team stats.
- GET `/valorant/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats` — Get player stats for a Valorant tournament.
- GET `/valorant/tournaments/{tournament_id_or_slug}/teams/{team_id_or_slug}/stats` — Get team stats for a Valorant tournament.

#### Valorant players (1)
- GET `/valorant/players` — List Valorant players.

#### Valorant series (4)
- GET `/valorant/series` — List Valorant series.
- GET `/valorant/series/past` — Get past Valorant series.
- GET `/valorant/series/running` — Get running Valorant series.
- GET `/valorant/series/upcoming` — Get upcoming Valorant series.

#### Valorant teams (1)
- GET `/valorant/teams` — List Valorant teams.

#### Valorant tournaments (4)
- GET `/valorant/tournaments` — List Valorant tournaments.
- GET `/valorant/tournaments/past` — Get past Valorant tournaments.
- GET `/valorant/tournaments/running` — Get running Valorant tournaments.
- GET `/valorant/tournaments/upcoming` — Get upcoming Valorant tournaments.

#### Valorant weapons (2)
- GET `/valorant/weapons` — List Valorant weapons.
- GET `/valorant/weapons/{valorant_weapon_id}` — Get a Valorant weapon by its ID.

### King of Glory (15)

#### KOG leagues (1)
- GET `/kog/leagues` — Get King of Glory leagues.

#### KOG matches (4)
- GET `/kog/matches` — List King of Glory matches.
- GET `/kog/matches/past` — Get past King of Glory matches.
- GET `/kog/matches/running` — Get running King of Glory matches.
- GET `/kog/matches/upcoming` — Get upcoming King of Glory matches.

#### KOG players (1)
- GET `/kog/players` — List King of Glory players.

#### KOG series (4)
- GET `/kog/series` — List King of Glory series.
- GET `/kog/series/past` — Get past King of Glory series.
- GET `/kog/series/running` — Get running King of Glory series.
- GET `/kog/series/upcoming` — Get upcoming King of Glory series.

#### KOG teams (1)
- GET `/kog/teams` — List King of Glory teams.

#### KOG tournaments (4)
- GET `/kog/tournaments` — List King of Glory tournaments.
- GET `/kog/tournaments/past` — Get past King of Glory tournaments.
- GET `/kog/tournaments/running` — Get running King of Glory tournaments.
- GET `/kog/tournaments/upcoming` — Get upcoming King of Glory tournaments.

### StarCraft 2 (15)

#### StarCraft 2 leagues (1)
- GET `/starcraft-2/leagues` — Get StarCraft 2 leagues.

#### StarCraft 2 matches (4)
- GET `/starcraft-2/matches` — List StarCraft 2 matches.
- GET `/starcraft-2/matches/past` — Get past StarCraft 2 matches.
- GET `/starcraft-2/matches/running` — Get running StarCraft 2 matches.
- GET `/starcraft-2/matches/upcoming` — Get upcoming StarCraft 2 matches.

#### StarCraft 2 players (1)
- GET `/starcraft-2/players` — List StarCraft 2 players.

#### StarCraft 2 series (4)
- GET `/starcraft-2/series` — List StarCraft 2 series.
- GET `/starcraft-2/series/past` — Get past StarCraft 2 series.
- GET `/starcraft-2/series/running` — Get running StarCraft 2 series.
- GET `/starcraft-2/series/upcoming` — Get upcoming StarCraft 2 series.

#### StarCraft 2 teams (1)
- GET `/starcraft-2/teams` — List StarCraft 2 teams.

#### StarCraft 2 tournaments (4)
- GET `/starcraft-2/tournaments` — List StarCraft 2 tournaments.
- GET `/starcraft-2/tournaments/past` — Get past StarCraft 2 tournaments.
- GET `/starcraft-2/tournaments/running` — Get running StarCraft 2 tournaments.
- GET `/starcraft-2/tournaments/upcoming` — Get upcoming StarCraft 2 tournaments.

### StarCraft Brood War (15)

#### StarCraft Brood War leagues (1)
- GET `/starcraft-brood-war/leagues` — Get StarCraft Brood War leagues.

#### StarCraft Brood War matches (4)
- GET `/starcraft-brood-war/matches` — List StarCraft Brood War matches.
- GET `/starcraft-brood-war/matches/past` — Get past StarCraft Brood War matches.
- GET `/starcraft-brood-war/matches/running` — Get running StarCraft Brood War matches.
- GET `/starcraft-brood-war/matches/upcoming` — Get upcoming StarCraft Brood War matches.

#### StarCraft Brood War players (1)
- GET `/starcraft-brood-war/players` — List StarCraft Brood War players.

#### StarCraft Brood War series (4)
- GET `/starcraft-brood-war/series` — List StarCraft Brood War series.
- GET `/starcraft-brood-war/series/past` — Get past StarCraft Brood War series.
- GET `/starcraft-brood-war/series/running` — Get running StarCraft Brood War series.
- GET `/starcraft-brood-war/series/upcoming` — Get upcoming StarCraft Brood War series.

#### StarCraft Brood War teams (1)
- GET `/starcraft-brood-war/teams` — List StarCraft Brood War teams.

#### StarCraft Brood War tournaments (4)
- GET `/starcraft-brood-war/tournaments` — List StarCraft Brood War tournaments.
- GET `/starcraft-brood-war/tournaments/past` — Get past StarCraft Brood War tournaments.
- GET `/starcraft-brood-war/tournaments/running` — Get running StarCraft Brood War tournaments.
- GET `/starcraft-brood-war/tournaments/upcoming` — Get upcoming StarCraft Brood War tournaments.

## Integration notes for fireROUTE
- Treat PandaScore as a fully authenticated provider with plan-gated route and field access.
- Model the API as one shared schema plus per-game namespaces, rather than as unrelated providers.
- Preserve filter / search / range / sort / pagination query support because those are central to normal list usage.
- Preserve the documented WebSocket discovery flow (`/lives` plus socket URLs) separately from the REST route inventory.
- Make quota handling visible to callers by retaining `X-Rate-Limit-Remaining` and retrying carefully after `429` or transient `5xx` failures.

## Sources inspected
- `https://developers.pandascore.co/docs/introduction`
- `https://developers.pandascore.co/docs/authentication`
- `https://developers.pandascore.co/docs/rate-and-connections-limits`
- `https://developers.pandascore.co/docs/formats`
- `https://developers.pandascore.co/docs/filtering-and-sorting`
- `https://developers.pandascore.co/docs/pagination`
- `https://developers.pandascore.co/docs/errors`
- `https://developers.pandascore.co/docs/websockets-overview`
- `https://developers.pandascore.co/docs/disconnections`
- `https://developers.pandascore.co/reference`
- official sidebar metadata: `https://developers.pandascore.co/developers-pandascore/api-next/v2/branches/2/sidebar?page_type=reference`
- official per-endpoint metadata reviewed from the same docs backend, including `https://developers.pandascore.co/developers-pandascore/api-next/v2/branches/2/reference/get_additions?reduce=false`
- live unauthenticated auth check: `https://api.pandascore.co/videogames`
