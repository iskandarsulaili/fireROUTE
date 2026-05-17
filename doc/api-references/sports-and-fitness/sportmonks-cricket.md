# Sportmonks Cricket

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `sportmonks-cricket`
- Official docs/pages used:
  - `https://docs.sportmonks.com/v2/cricket-api`
  - `https://docs.sportmonks.com/v2/cricket-api/getting-started/getting-started`
  - `https://docs.sportmonks.com/v2/cricket-api/getting-started/all-endpoints`
  - `https://docs.sportmonks.com/v2/cricket-api/api-rate-limit`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/continents-and-countries`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/countries`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/leagues-and-seasons`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/seasons`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/fixtures`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/livescores-and-fixtures`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/teams-and-players`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/players`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/officials`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/venues`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/positions`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/stages`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/team-rankings`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/standings`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/scores`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/fixtures/get-all-fixtures`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/fixtures/get-fixture-by-id`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/livescores-and-fixtures/get-all-livescores`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/teams-and-players/get-all-teams`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/teams-and-players/get-team-by-id`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/teams-and-players/teams-and-squads`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/standings/get-standings-by-season-id`
  - `https://docs.sportmonks.com/v2/cricket-api/our-api/team-rankings/get-global-team-rankings`
- Current public API base URL: `https://cricket.sportmonks.com/api/v2.0`
- Auth model: the reviewed Cricket API 2.0 docs consistently show API-token authentication via the `api_token` query parameter.
- Response format: JSON.
- Public rate-limit note:
  - The official rate-limit page says every default plan includes `2000` API calls per endpoint per hour.
  - The same page says the counter starts on the first request and resets one hour later.
  - Exceeding the cap returns `429`.
  - The docs say current usage is exposed in the response `meta` section.
- Manually confirmed route count: `28` public `GET` routes across the official Cricket API 2.0 route families

## Canonical endpoints
### Route families and counts confirmed from the official category pages
- Continents: `1`
- Countries: `2`
- Leagues: `2`
- Seasons: `2`
- Fixtures: `2`
- Livescores: `1`
- Teams: `3`
- Players: `2`
- Officials: `2`
- Venues: `2`
- Positions: `2`
- Stages: `2`
- Team Rankings: `1`
- Standings: `2`
- Scores: `2`

### Consolidated route inventory
1. `GET /continents`
2. `GET /countries`
3. `GET /countries/{ID}`
4. `GET /leagues`
5. `GET /leagues/{ID}`
6. `GET /seasons`
7. `GET /seasons/{ID}`
8. `GET /fixtures`
9. `GET /fixtures/{ID}`
10. `GET /livescores`
11. `GET /teams`
12. `GET /teams/{ID}`
13. `GET /teams/{ID}/squad/{season_ID}`
14. `GET /players`
15. `GET /players/{ID}`
16. `GET /officials`
17. `GET /officials/{ID}`
18. `GET /venues`
19. `GET /venues/{ID}`
20. `GET /positions`
21. `GET /positions/{ID}`
22. `GET /stages`
23. `GET /stages/{ID}`
24. `GET /team-rankings`
25. `GET /standings/season/{ID}`
26. `GET /standings/stage/{ID}`
27. `GET /scores`
28. `GET /scores/{ID}`

### Concrete paths directly inspected in the official detail pages
- `GET /fixtures`
- `GET /fixtures/{ID}`
- `GET /livescores`
- `GET /teams`
- `GET /teams/{ID}`
- `GET /teams/{ID}/squad/{season_ID}`
- `GET /team-rankings`
- `GET /standings/season/{ID}`

## Parameters and filtering notes
### Shared query controls shown on the reviewed detail pages
- `api_token` - required auth token shown in every reviewed request example.
- `include` - include related objects and nested relations.
- `filter[{field}]` - field-based filtering syntax.
- `fields[object]` - sparse field selection, for example `&fields[fixtures]=id`.
- `sort` - one or more sort fields.
- `page` - pagination on paginated list endpoints.

### Filters and include options explicitly shown on the reviewed pages
- `GET /fixtures` documents filters for `season_id`, `league_id`, `localteam_id`, `visitorteam_id`, `status`, `referee_id`, `round`, `stage_id`, and `starts_between`.
- The fixtures docs explicitly describe the custom date-range filter `&filter[starts_between]=2019-03-03,2019-03-15`.
- `GET /teams` shows filters such as `name` and `country_id`.
- The Team Rankings page documents `&filter[tournament_type]=TEST` and `&filter[gender]=men`.
- The reviewed fixtures page lists include options such as `balls`, `runs`, `bowling`, `batting`, `venue`, `stage`, `season`, `league`, `visitorteam`, `localteam`, `scoreboards`, `firstumpire`, `secondumpire`, `referee`, `manofseries`, `manofmatch`, `tosswon`, and `lineup`.

### Pagination notes from the reviewed detail pages
- `GET /fixtures` explicitly says pagination is available.
- `GET /fixtures/{ID}` and `GET /teams/{ID}/squad/{season_ID}` explicitly say pagination is not available.
- The reviewed fixtures page shows `page` as the documented page selector.

## Authentication and access notes
- The getting-started page says you need a SportMonks account and a token from MySportmonks before making requests.
- The reviewed Cricket API pages consistently demonstrate auth with `?api_token={API_TOKEN}` in the request URL.
- The getting-started page says tokens do not expire automatically and remain valid until manually deleted.
- The docs warn that plan eligibility controls data access; `403` is used when requesting data outside the subscribed plan.

## Response, pagination, and error notes
- The reviewed docs describe the API as a standard REST API with JSON responses.
- The getting-started page lists the shared response codes `200`, `400`, `401`, `403`, `404`, `429`, and `500`.
- The `404` note explicitly says some records can disappear after rescheduling or deletion.
- The rate-limit page says current usage information appears in the response `meta` section.
- Relationship pages such as scoreboards, officials/umpires, and results are documented as `include=` enrichments on fixture or livescore responses rather than standalone route families.

## Usage notes from the official docs
- The getting-started page uses `GET /leagues` as the first-request example and says the free-plan sample leagues include Twenty20 International, CSA T20 Challenge, and Big Bash League.
- The all-endpoints page is the official public index page for the Cricket API 2.0 route families.
- The relationship pages are still useful for fireROUTE because they describe how to enrich fixture and livescore responses with nested data instead of calling extra endpoints.
- The Cricket docs are older than the current Football API 3.0 docs, so keep the provider separated as a v2.0 surface in any normalization layer.

## fireROUTE normalization notes
- Treat Sportmonks Cricket as an authenticated v2.0 cricket API rooted at `https://cricket.sportmonks.com/api/v2.0`.
- Keep route families separate from relationship/include documentation; scoreboards, officials/umpires, and results are documented as enrichments, not standalone endpoints.
- Preserve the docs' query-parameter names exactly: `api_token`, `include`, `filter[...]`, `fields[...]`, `sort`, and `page`.
- Preserve the official per-endpoint hourly rate-limit model instead of assuming one shared provider-wide quota bucket.