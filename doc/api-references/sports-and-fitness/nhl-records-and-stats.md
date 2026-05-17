# NHL Records and Stats

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `nhl-records-and-stats`
- Official docs/pages used:
  - `https://gitlab.com/dword4/nhlapi`
  - `https://gitlab.com/dword4/nhlapi/-/raw/master/records-api.md`
- Current public API base URL: `https://records.nhl.com/site/api`
- Auth model: no authentication documented in the reviewed records API page
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed repo pages
- Manually confirmed route count: `21`

## Authentication and access
- The reviewed records API page says all documented requests are `GET` requests.
- I did not find an API key, OAuth flow, cookie requirement, or signed-request requirement on the reviewed pages.
- The records API doc explicitly says the route list was compiled from `https://records.nhl.com/static/js/client.bundle.js` and may not be exhaustive.

## Canonical endpoints
1. `GET /attendance` - season attendance records split into regular and playoff attendance
2. `GET /draft` - draft history data
3. `GET /record-detail` - record directory including `restUrl` pointers
4. `GET /all-time-record-vs-franchise` - franchise records versus every other team
5. `GET /playoff-franchise-vs-franchise` - playoff-specific franchise-vs-franchise records
6. `GET /franchise` - franchise directory; also used with `include=...` expansions for team/franchise logo and identity data
7. `GET /franchise-team-totals` - total stats for every franchise
8. `GET /franchise-season-records` - season records for one franchise
9. `GET /franchise-season-results` - season-by-season results for one franchise
10. `GET /franchise-goalie-records` - goalie records for one franchise
11. `GET /franchise-skater-records` - skater records for one franchise
12. `GET /franchise-detail` - captain, coaching, GM, and retired-number details for one franchise
13. `GET /player/byTeam/teamId` - players for one team ID
14. `GET /playoff-series` - game data for a playoff series round
15. `GET /trophy` - trophy summary with descriptions and images
16. `GET /milestone-1000-point-career` - players reaching 1000 career points
17. `GET /milestone-500-goal-career` - players reaching 500 career goals
18. `GET /milestone-100-point-season` - players reaching 100 points in a season
19. `GET /milestone-50-goal-season` - players reaching 50 goals in a season
20. `GET /milestone-5-goal-game` - players scoring 5 goals in one game
21. `GET /officials` - officials directory

## Parameters and request notes
### Shared filtering pattern
The reviewed docs repeatedly use a query parameter named `cayenneExp` for filtering.

Published examples include:
- `draftYear=2017`
- `draftYear=2017 and draftedByTeamId=15`
- `teamFranchiseId=ID`
- `gameTypeId=2`
- `franchiseId=ID`
- `mostRecentTeamId=ID`
- `seriesTitle="Stanley Cup Final" and seasonId=20172018`
- `active=true`

The same page explicitly warns that spaces inside the expression matter and that URL-encoded spaces (`%20`) must be preserved.

### Other published query controls
- `sort` - used in the published `/franchise-season-results` example (`sort=seasonId`)
- `dir` - used in the same example (`dir=DESC`)
- `include` - repeated on `/franchise` to expand team/franchise fields such as logos, common names, conference, division, and first/last season IDs

### Path/route-variable notes
- `teamId` appears as the trailing team selector in `/player/byTeam/teamId`
- several `cayenneExp` examples reference IDs such as `teamFranchiseId`, `franchiseId`, `draftedByTeamId`, and `mostRecentTeamId`

## Response, pagination, and error notes
- The reviewed records page describes JSON-style data resources and examples but does not publish a formal OpenAPI schema.
- I did not find documented page, limit, cursor, or offset controls.
- I did not find a published machine-readable error schema or documented HTTP status table.
- The records page often describes collection-style resources that can be narrowed with `cayenneExp` rather than paginated.

## Usage notes from the official docs
- The reviewed repo positions itself as community-maintained documentation for NHL data consumers.
- The records API page says the endpoint list was discovered by inspecting the NHL site's `client.bundle.js`.
- The page explicitly calls the compiled list non-exhaustive, so downstream adapters should expect the possibility of additional undocumented record resources.

## fireROUTE normalization notes
- Normalize the public records API root as `https://records.nhl.com/site/api`.
- Preserve `cayenneExp` as a raw provider-specific filter language instead of trying to force it into generic filter fields.
- Treat `/franchise` as one route family with optional `include` expansions, not as separate independent endpoints.
- Mark the documentation source as community-maintained and potentially incomplete even though the live route base is official NHL infrastructure.