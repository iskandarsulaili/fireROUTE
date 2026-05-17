# OpenLigaDB

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `openligadb`
- Official docs/pages used:
  - `https://www.openligadb.de/`
  - `https://api.openligadb.de/index.html`
- Current public API base URL: `https://api.openligadb.de`
- Auth model: no authentication required for public read access
- Response format: JSON
- Documented protocol: HTTPS
- Rate limits: no public rate-limit policy was exposed on the reviewed homepage or Swagger UI
- Manually confirmed route count: `22`

## Authentication and access
- The public website explicitly says data retrieval through the web service requires **no authentication**.
- The homepage describes the service as a free community project and points users to the JSON API and Swagger UI.
- All routes exposed in the reviewed Swagger UI are read-only `GET` operations.

## Canonical endpoints
### League and sport discovery
1. `GET /getavailableleagues`
2. `GET /getavailableleagues/{season}`
3. `GET /getavailablesports`

### Match retrieval
4. `GET /getmatchdata/{matchId}`
5. `GET /getmatchdata/{leagueShortcut}/{leagueSeason}/{groupOrderId}`
6. `GET /getmatchdata/{leagueShortcut}/{leagueSeason}`
7. `GET /getmatchdata/{leagueShortcut}/{leagueSeason}/{teamFilterstring}`
8. `GET /getmatchdata/{teamId1}/{teamId2}`

### Match timing and current round helpers
9. `GET /getlastchangedate/{leagueShortcut}/{leagueSeason}/{groupOrderId}`
10. `GET /getnextmatchbyleagueteam/{leagueId}/{teamId}`
11. `GET /getnextmatchbyleagueshortcut/{leagueShortcut}`
12. `GET /getlastmatchbyleagueshortcut/{leagueShortcut}`
13. `GET /getlastmatchbyleagueteam/{leagueId}/{teamId}`
14. `GET /getcurrentgroup/{leagueShortcut}`

### League metadata
15. `GET /getresultinfos/{leagueId}`
16. `GET /getavailablegroups/{leagueShortcut}/{leagueSeason}`
17. `GET /getgoalgetters/{leagueShortcut}/{leagueSeason}`
18. `GET /getavailableteams/{leagueShortcut}/{leagueSeason}`

### Tables
19. `GET /getbltable/{leagueShortcut}/{leagueSeason}`
20. `GET /getgrouptable/{leagueShortcut}/{leagueSeason}`

### Team-centric match windows
21. `GET /getmatchesbyteam/{teamFilterstring}/{weekCountPast}/{weekCountFuture}`
22. `GET /getmatchesbyteamid/{teamId}/{weekCountPast}/{weekCountFuture}`

## Parameter notes
Common path parameters published in the Swagger UI:
- `season` - integer season selector for league discovery
- `matchId` - integer match identifier
- `leagueShortcut` - string league shortcut such as `bl1`
- `leagueSeason` - integer season, e.g. `2019` for the `2019/2020` season
- `groupOrderId` - integer round/group index, e.g. matchday number in football
- `teamFilterstring` - team name or partial team name
- `teamId1`, `teamId2` - integer team identifiers for head-to-head match retrieval
- `leagueId` - integer league identifier
- `teamId` - integer team identifier
- `weekCountPast` - integer count of prior weeks to include
- `weekCountFuture` - integer count of upcoming weeks to include

## Response notes
The reviewed Swagger UI publishes JSON schemas for these resource types:
- `League`
- `Sport`
- `Match`
- `Group`
- `Team`
- `Goal`
- `GoalGetter`
- `Location`
- `MatchResult`
- `ResultInfo`
- `GlobalResultInfo`
- `BlTableTeam`

In practice, the API groups around:
- discovery lists for leagues, sports, groups, teams, and result types
- match objects for single-match and multi-match retrieval
- table rows for standings endpoints
- date/time metadata for update checks

## Usage notes from the official site
- The homepage gives the example `https://api.openligadb.de/getmatchdata/bl1/2020/1` and explains that it returns the first Bundesliga matchday for the 2020/2021 season.
- The site describes OpenLigaDB as community-maintained sports data intended for projects such as prediction games, statistics apps, and widgets.
- The site also notes that entered leagues are publicly retrievable and that contributed data are licensed under the Open Database License (ODbL).

## Pagination, filtering, and error notes
- The reviewed Swagger UI does **not** document query-string pagination parameters; the API is primarily path-driven.
- Team filtering is path-based via `teamFilterstring` rather than a query parameter.
- No shared error schema or public rate-limit page was exposed in the reviewed docs.

## fireROUTE normalization notes
- Normalize this provider as a read-only JSON REST surface with a small number of entity families: leagues, matches, teams, groups, standings, scorers, and metadata.
- Preserve `leagueShortcut` and `leagueSeason` as first-class routing dimensions because most resource access patterns depend on them.
- Treat `getbltable` and `getgrouptable` as separate operations because the Swagger UI documents them independently even though both return standings-style data.
- `getmatchdata` is overloaded across several path shapes; downstream adapters should distinguish the variants by arity and parameter semantics rather than by path prefix alone.
