# Chess.com

## Overview
- Provider: Chess.com Published-Data API (PubAPI)
- Category: Games & Comics
- Official docs: `https://www.chess.com/news/view/published-data-api`
- Base URL: `https://api.chess.com/pub`
- Auth: no API key or account auth is documented for the public published-data endpoints
- HTTPS: yes
- Response format: JSON-LD for most endpoints, with one PGN download endpoint
- Pagination: no page-number pagination is documented; archive-style routes partition data by month, time control, or nested resource path
- Rate limits: serial requests are documented as unlimited; parallel/non-serial requests may receive `429 Too Many Requests`
- Confirmed routes: `30`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/player/{username}` | `username` path | Player profile. |
| GET | `/titled/{title-abbrev}` | `title-abbrev` path | List usernames for one chess title. |
| GET | `/player/{username}/stats` | `username` path | Ratings, records, tactics, lessons, and Puzzle Rush stats. |
| GET | `/player/{username}/is-online` | `username` path | Officially documented online-status route; current live request in this pass returned `404`, so treat it as a stale/broken documented route until Chess.com fixes or removes it. |
| GET | `/player/{username}/games` | `username` path | Current Daily Chess games. |
| GET | `/player/{username}/games/to-move` | `username` path | Current Daily Chess games where action is needed. |
| GET | `/player/{username}/games/archives` | `username` path | List monthly archive URLs. |
| GET | `/player/{username}/games/{YYYY}/{MM}` | `username`, `YYYY`, `MM` path | Monthly finished-games archive. |
| GET | `/player/{username}/games/live/{BASETIME}/{INCREMENT}` | `username`, `BASETIME`, `INCREMENT` path | Finished live games filtered by exact time control. |
| GET | `/player/{username}/games/{YYYY}/{MM}/pgn` | `username`, `YYYY`, `MM` path | Monthly PGN download. |
| GET | `/player/{username}/clubs` | `username` path | Clubs the player belongs to. |
| GET | `/player/{username}/matches` | `username` path | Player team matches grouped by status. |
| GET | `/player/{username}/tournaments` | `username` path | Player tournaments grouped by status. |
| GET | `/club/{url-ID}` | `url-ID` path | Club profile by club slug. |
| GET | `/club/{url-ID}/members` | `url-ID` path | Club members grouped into `weekly`, `monthly`, and `all_time`. |
| GET | `/club/{ID}/matches` | `ID` path in docs; examples use club slug | Club team matches grouped by status. The official docs label the path variable as `ID`, but the example uses a URL slug, so implementations should follow the example shape. |
| GET | `/tournament/{url-ID}` | `url-ID` path | Tournament detail. |
| GET | `/tournament/{url-ID}/{round}` | `url-ID`, `round` path | Tournament round detail. |
| GET | `/tournament/{url-ID}/{round}/{group}` | `url-ID`, `round`, `group` path | Tournament round-group detail. |
| GET | `/match/{ID}` | `ID` path | Daily team match detail. |
| GET | `/match/{ID}/{board}` | `ID`, `board` path | Daily team match board detail. |
| GET | `/match/live/{ID}` | `ID` path | Live team match detail. The official docs contain a missing-slash typo in one URL pattern (`/match/live{ID}`), but the examples and live endpoint use `/match/live/{ID}`. |
| GET | `/match/live/{ID}/{board}` | `ID`, `board` path | Live team match board detail. |
| GET | `/country/{iso}` | `iso` path | Country/region profile. |
| GET | `/country/{iso}/players` | `iso` path | Recently active/new players for a country/region. |
| GET | `/country/{iso}/clubs` | `iso` path | Clubs associated with a country/region. |
| GET | `/puzzle` | none | Daily puzzle. |
| GET | `/puzzle/random` | none | Random puzzle with short cache window. |
| GET | `/streamers` | none | Chess.com streamers list. |
| GET | `/leaderboards` | none | Top-50 leaderboard collections across multiple categories. |

## Path and query parameter notes
- Global query support:
  - `callback` is documented as a JSONP wrapper query parameter for any URL that returns JSON. A live check of `/player/hikaru?callback=myFn` returned `200` JavaScript beginning with `myFn(...)`.
- `/titled/{title-abbrev}` valid title abbreviations documented on the official page:
  - `GM`, `WGM`, `IM`, `WIM`, `FM`, `WFM`, `NM`, `WNM`, `CM`, `WCM`
- `/player/{username}/games/{YYYY}/{MM}` and `/player/{username}/games/{YYYY}/{MM}/pgn`
  - `YYYY` is the four-digit game-end year.
  - `MM` is the two-digit game-end month.
- `/player/{username}/games/live/{BASETIME}/{INCREMENT}`
  - `BASETIME` is the base time control in seconds.
  - `INCREMENT` is the increment in seconds.
- `/country/{iso}` family
  - Uses uppercase ISO 3166-1 alpha-2 country codes.
  - The official docs also list Chess.com user-assigned region codes: `XA`, `XB`, `XC`, `XE`, `XG`, `XK`, `XP`, `XS`, `XW`, `XX`.
- `/tournament/{url-ID}/{round}` and `/tournament/{url-ID}/{round}/{group}`
  - `round` and `group` are path segments exposed by the parent tournament responses.
- `/match/{ID}/{board}` and `/match/live/{ID}/{board}`
  - `board` identifies one match board and can expose one or two games depending on match state.

## Response and format notes
- The docs describe the API as read-only REST returning JSON-LD for most routes.
- JSON-LD context URLs are documented for most resource families, including player, club, country, tournament, match, and puzzle payloads.
- `/player/{username}/games/{YYYY}/{MM}/pgn` is the only documented non-JSON route and returns PGN text.
- The docs say the PGN download uses `Content-Type: application/x-chess-pgn`; a live request in this pass returned `application/vnd.chess-pgn; charset=utf-8; charset=utf-8`.
- Live fetches in this pass confirmed JSON responses from profile, titled-player list, stats, archives, monthly games, clubs, tournaments, club matches, tournament rounds/groups, match detail, live match detail, country detail, puzzles, streamers, and leaderboards.
- A live fetch of `/player/hikaru` exposed `Last-Modified` and `Cache-Control: public, max-age=5` headers.

## Endpoint-specific notes
- Player profile:
  - The docs call out `player_id` as a stable account identifier that can help detect username changes.
- Player stats:
  - Stats objects are sparse; missing activity types simply omit those objects.
- Current games and to-move games:
  - The docs say game arrays are ascending by game end time.
  - The to-move list may still include games where it is not the player's turn if a draw offer is pending; those appear with `move_by = 0`.
- Archives and monthly game exports:
  - `/games/archives` returns archive URLs, not the games themselves.
  - `/games/{YYYY}/{MM}` mixes live and daily finished games.
  - `/games/live/{BASETIME}/{INCREMENT}` narrows to one exact live time-control bucket.
- Club members:
  - The docs define activity as club-page/forum/news/settings/list interactions and explicitly say merely playing a club game does not count as club activity.
  - The docs say membership lists refresh at most every 12 hours.
  - A live request to the official example `/club/chess-com-developer-community/members` returned `404` with Chess.com error code `3024` and message `An internal error has occurred`, so this documented route currently has reliability issues.
- Country players:
  - The docs say this is not a full dump of every user in the country; it surfaces new registrants and currently active players and refreshes at most every 12 hours.
- Puzzle routes:
  - The docs require visible Chess.com credit if republishing the daily puzzle.
  - `/puzzle/random` is documented as cached for roughly 15 seconds rather than changing every request.
- Streamers:
  - The docs say the endpoint refreshes every 5 minutes.
- Leaderboards:
  - The docs describe top-50 lists for categories including `daily`, `daily960`, `live_rapid`, `live_blitz`, `live_bullet`, `live_bughouse`, `live_blitz960`, `live_threecheck`, `live_crazyhouse`, `live_kingofthehill`, `lessons`, and `tactics`.

## Auth, rate limits, caching, and errors
- Auth:
  - The official page presents the PubAPI as public read-only data with no API key requirement.
- Rate limits:
  - Serial access is documented as unlimited.
  - Parallel/non-serial access may receive `429 Too Many Requests`.
  - The docs recommend sending a recognizable user-agent with contact information if you build a higher-volume integration.
- Caching:
  - The official page documents `ETag` / `If-None-Match` and `Last-Modified` / `If-Modified-Since` cache validation behavior with possible `304 Not Modified` responses.
  - The docs also discuss CDN cache states such as `HIT`, `MISS`, `EXPIRED`, and `REVALIDATED`.
  - The official page contains two general freshness notes (`at most once every 12 hours` and later `at most once every 24 hours, if not noted otherwise`), so fireROUTE should preserve endpoint-specific cache notes instead of assuming one global TTL.
- Official documented status codes:
  - `200` — success
  - `301` — bad URL that Chess.com can redirect/correct
  - `304` — cached representation still valid
  - `404` — malformed URL or unavailable data
  - `410` — URL will never have data
  - `429` — rate-limited request
- Live behavior observed in this pass:
  - `/player/this-user-should-not-exist-zzzzzzzzzzzz` returned `404` JSON with `User ... not found.`
  - `/player/hikaru/is-online` returned `404` JSON with `Data provider not found for key "/pub/player/hikaru/is-online".`
  - `/club/chess-com-developer-community/members` returned `404` JSON with internal error code `3024`.

## Usage notes
- This API is explicitly read-only; the docs say you cannot send moves or commands through it.
- The docs emphasize that responses are language-neutral and English text in payloads/errors is shared globally.
- Chess.com warns integrators to respect its brand/IP around board palettes, piece designs, sound effects, move glyphs, and other product-specific assets.
- Tournament and match payloads often contain nested URLs to other PubAPI resources; those should be preserved as first-class links in adapters rather than flattened away.
- The docs expose a published-data Postman/Insomnia collection from the documentation page for manual exploration.

## Integration notes for fireROUTE
- Model this provider as a 30-route read-only API rooted at `https://api.chess.com/pub`.
- Preserve the single non-JSON PGN route separately from JSON/JSON-LD routes.
- Support optional JSONP `callback` only on JSON endpoints; do not force it onto PGN downloads.
- Treat `/player/{username}/is-online` and `/club/{url-ID}/members` as documented-but-currently-unreliable routes until Chess.com fixes the live behavior.
- Preserve exact path semantics for monthly archives, exact live time-control archives, tournament round/group nesting, and match board nesting.
- Do not invent pagination parameters; the official API is primarily path-partitioned rather than page-based.

## Sources inspected
- `https://www.chess.com/news/view/published-data-api`
- `https://api.chess.com/pub/player/hikaru`
- `https://api.chess.com/pub/player/hikaru?callback=myFn`
- `https://api.chess.com/pub/titled/GM`
- `https://api.chess.com/pub/player/hikaru/stats`
- `https://api.chess.com/pub/player/hikaru/is-online`
- `https://api.chess.com/pub/player/hikaru/games`
- `https://api.chess.com/pub/player/hikaru/games/to-move`
- `https://api.chess.com/pub/player/hikaru/games/archives`
- `https://api.chess.com/pub/player/hikaru/games/2025/01`
- `https://api.chess.com/pub/player/hikaru/games/live/180/2`
- `https://api.chess.com/pub/player/hikaru/games/2025/01/pgn`
- `https://api.chess.com/pub/player/hikaru/clubs`
- `https://api.chess.com/pub/player/hikaru/matches`
- `https://api.chess.com/pub/player/hikaru/tournaments`
- `https://api.chess.com/pub/club/chess-com-developer-community`
- `https://api.chess.com/pub/club/chess-com-developer-community/members`
- `https://api.chess.com/pub/club/team-usa-southwest/matches`
- `https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600`
- `https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600/1`
- `https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600/1/1`
- `https://api.chess.com/pub/match/12803`
- `https://api.chess.com/pub/match/12803/1`
- `https://api.chess.com/pub/match/live/5833`
- `https://api.chess.com/pub/match/live/5833/5`
- `https://api.chess.com/pub/country/US`
- `https://api.chess.com/pub/country/US/players`
- `https://api.chess.com/pub/country/IT/clubs`
- `https://api.chess.com/pub/puzzle`
- `https://api.chess.com/pub/puzzle/random`
- `https://api.chess.com/pub/streamers`
- `https://api.chess.com/pub/leaderboards`
- `https://api.chess.com/pub/player/this-user-should-not-exist-zzzzzzzzzzzz`
