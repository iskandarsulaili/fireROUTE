# CollegeFootballData.com

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `collegefootballdata-com`
- Official docs/pages used:
  - `https://collegefootballdata.com/`
  - `https://api.collegefootballdata.com/`
  - `https://collegefootballdata.com/api-tiers`
- Current public API base URL: `https://api.collegefootballdata.com/`
- Auth model: bearer token in the `Authorization` header; the Swagger spec exposes an `apiKey` security scheme with `type: http` and `scheme: bearer`, and the site says API keys are acquired from CollegeFootballData.com
- Response format: JSON over HTTPS; the reviewed REST reference is an OpenAPI/Swagger UI surface
- Public rate-limit note: the official tiers page publishes monthly call caps rather than a per-second limit: Free `1k/mo`, Academic `3k/mo`, Tier 1 `5k/mo`, Tier 2 `30k/mo`, Tier 3 `75k/mo`, Tier 4 `125k/mo`, Tier 5 `200k/mo`, Tier 6 `500k/mo`
- Manually confirmed route count: `60`

## Authentication and access
- The homepage directs users to request an API key before using the REST API.
- The REST docs expose a bearer-auth security scheme, so fireROUTE should send the provider-issued token as an `Authorization` bearer token unless the provider changes the auth contract.
- The same site also advertises GraphQL access, but the reviewed route list below covers only the official REST API documented at `https://api.collegefootballdata.com/`.

## Canonical endpoints
### Games
1. `GET /games`
2. `GET /games/teams`
3. `GET /games/players`
4. `GET /games/media`
5. `GET /games/weather`
6. `GET /records`
7. `GET /calendar`
8. `GET /scoreboard`
9. `GET /game/box/advanced`

### Drives and plays
10. `GET /drives`
11. `GET /plays`
12. `GET /plays/types`
13. `GET /plays/stats`
14. `GET /plays/stats/types`
15. `GET /live/plays`

### Teams, conferences, venues, coaches
16. `GET /teams`
17. `GET /teams/fbs`
18. `GET /teams/matchup`
19. `GET /teams/ats`
20. `GET /roster`
21. `GET /talent`
22. `GET /conferences`
23. `GET /venues`
24. `GET /coaches`

### Players and rankings
25. `GET /player/search`
26. `GET /player/usage`
27. `GET /player/returning`
28. `GET /player/portal`
29. `GET /rankings`

### Betting and recruiting
30. `GET /lines`
31. `GET /recruiting/players`
32. `GET /recruiting/teams`
33. `GET /recruiting/groups`

### Ratings
34. `GET /ratings/sp`
35. `GET /ratings/sp/conferences`
36. `GET /ratings/srs`
37. `GET /ratings/elo`
38. `GET /ratings/fpi`

### PPA and win-probability metrics
39. `GET /ppa/predicted`
40. `GET /ppa/teams`
41. `GET /ppa/games`
42. `GET /ppa/players/games`
43. `GET /ppa/players/season`
44. `GET /metrics/wp`
45. `GET /metrics/wp/pregame`
46. `GET /metrics/fg/ep`

### Stats
47. `GET /stats/player/season`
48. `GET /stats/season`
49. `GET /stats/categories`
50. `GET /stats/season/advanced`
51. `GET /stats/game/advanced`
52. `GET /stats/game/havoc`

### Draft and adjusted metrics
53. `GET /draft/teams`
54. `GET /draft/positions`
55. `GET /draft/picks`
56. `GET /wepa/team/season`
57. `GET /wepa/players/passing`
58. `GET /wepa/players/rushing`
59. `GET /wepa/players/kicking`

### Info
60. `GET /info`

## Parameters and path notes
### Common filters used across the API
- `year` - one of the most common filters; required on some routes such as `/calendar`, `/drives`, `/plays`, `/player/usage`, and `/games/media`
- `week` - commonly used for game-, play-, and drive-level queries
- `seasonType` - optional season phase selector on many game, play, line, rating, and metric routes
- `team` - common team-name filter across games, stats, ratings, recruiting, and roster routes
- `conference` - common conference filter across games, teams, stats, ratings, lines, and recruiting routes
- `classification` - used on roster, games, drives, media, weather, and scoreboard-style routes

### Representative required parameters
- `GET /teams/matchup` - requires `team1` and `team2`
- `GET /teams/ats` - requires `year`
- `GET /talent` - requires `year`
- `GET /rankings` - requires `year`
- `GET /plays` - requires `year` and `week`
- `GET /player/search` - requires `searchTerm`
- `GET /player/usage` - requires `year`
- `GET /player/portal` - requires `year`
- `GET /ppa/predicted` - requires `down` and `distance`
- `GET /ppa/games` - requires `year`
- `GET /ppa/players/games` - requires `year`
- `GET /metrics/wp` - requires `gameId`
- `GET /games/media` - requires `year`
- `GET /calendar` - requires `year`
- `GET /game/box/advanced` - requires `id`

### Notable route-specific filters
- `/lines` supports `gameId`, `year`, `seasonType`, `week`, `team`, `home`, `away`, `conference`, and `provider`
- `/coaches` supports `firstName`, `lastName`, `team`, `year`, `minYear`, and `maxYear`
- `/draft/picks` supports `year`, `team`, `school`, `conference`, and `position`
- `/stats/player/season` supports `startWeek`, `endWeek`, `seasonType`, and `category` in addition to `year`/team filters
- `/stats/season/advanced`, `/ppa/teams`, `/ppa/games`, `/ppa/players/games`, `/ppa/players/season`, and `/player/usage` expose `excludeGarbageTime`

## Response, pagination, and error notes
- The reviewed REST reference is Swagger UI backed by an OpenAPI 3.0 spec and JSON schemas for each response model.
- The API is read-heavy and entirely `GET`-based in the reviewed spec.
- No pagination parameters such as `page`, `offset`, or `limit` were present in the reviewed route definitions.
- The official tiers page publishes monthly usage caps, but the reviewed REST docs page did not publish a single global per-second throttle number.
- The reviewed docs exposed schemas for domain objects, but I did not find one reusable top-level pagination contract on the inspected routes.

## Usage notes from the official docs
- The homepage positions the service as structured college-football data with exporter, rankings, and analytics tools.
- The docs page says the API covers college football datasets and analytics, while the main site separately advertises GraphQL and data-exporter surfaces.
- The tiers page explicitly markets progression from a free key to higher-volume paid plans, so fireROUTE should expect account-tier-dependent access volume.

## fireROUTE normalization notes
- Normalize this provider as a bearer-authenticated read-only JSON API rooted at `https://api.collegefootballdata.com/`.
- Keep route families grouped by domain: games, plays, teams, players, recruiting, ratings, metrics, stats, draft, and info.
- Because there is no shared pagination contract in the reviewed docs, treat each endpoint as a filtered bulk fetch rather than assuming cursor pagination.
- Keep GraphQL out of the REST adapter unless a separate provider entry is created for the GraphQL surface.
