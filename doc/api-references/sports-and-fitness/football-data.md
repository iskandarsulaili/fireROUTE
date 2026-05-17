# Football-Data

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `football-data`
- Official docs/pages used:
  - `https://www.football-data.org/documentation/quickstart`
  - `https://www.football-data.org/`
- Current public API base URL: `https://api.football-data.org/v4`
- Auth model: the quickstart page reviewed in this run focused on route inventory and filters; the visible excerpt did not publish the current header name or token-onboarding steps
- Response format: JSON examples are implied throughout the docs/site, and the homepage demonstrates `GET https://api.football-data.org/v4/matches`
- Public rate-limit note: the homepage states that top competitions remain free, while more competitions, deeper data, historical access, and more requests require paid plans; no numeric quota was visible in the manually reviewed excerpts
- Manually confirmed route count: `16`

## Canonical endpoints
1. `GET /areas/{id}` - fetch one area by numeric ID
2. `GET /areas/` - list all areas
3. `GET /competitions/PL` - fetch one competition example shown with code `PL`
4. `GET /competitions/` - list all competitions
5. `GET /competitions/{id}/standings` - standings for one competition
6. `GET /competitions/{id}/matches` - matches for one competition
7. `GET /competitions/{id}/teams` - teams for one competition
8. `GET /competitions/{id}/scorers` - top scorers for one competition
9. `GET /teams/{id}` - fetch one team by ID
10. `GET /teams/` - list teams
11. `GET /teams/{id}/matches/` - matches for one team
12. `GET /persons/{id}` - fetch one person by ID
13. `GET /persons/{id}/matches` - matches for one person
14. `GET /matches/{id}` - fetch one match by ID
15. `GET /matches` - list matches across one or more competitions
16. `GET /matches/{id}/head2head` - previous encounters for the teams in one match

## Parameters and filtering notes
### Path parameters
- `id` - numeric resource ID used across area, competition, team, person, and match resources

### Query parameters shown in the official quickstart table
- `areas` on `GET /competitions/`
- `matchday`, `season`, `date` on `GET /competitions/{id}/standings`
- `dateFrom`, `dateTo`, `stage`, `status`, `matchday`, `group`, `season` on `GET /competitions/{id}/matches`
- `season` on `GET /competitions/{id}/teams`
- `limit`, `season` on `GET /competitions/{id}/scorers`
- `limit`, `offset` on `GET /teams/`
- `dateFrom`, `dateTo`, `season`, `competitions`, `status`, `venue`, `limit` on `GET /teams/{id}/matches/`
- `dateFrom`, `dateTo`, `status`, `competitions`, `limit`, `offset` on `GET /persons/{id}/matches`
- `competitions`, `ids`, `dateFrom`, `dateTo`, `status` on `GET /matches`
- `limit`, `dateFrom`, `dateTo`, `competitions` on `GET /matches/{id}/head2head`

### Filter typing visible in the docs
- `id` and `ids` are numeric filters
- `season` is `yyyy`
- `status` is an uppercase enum value
- `limit` and `offset` are numeric pagination controls

## Authentication and access notes
- The homepage markets the API as free to use for top competitions, with paid plans for broader or deeper access.
- The manually reviewed quickstart excerpt did not expose the current auth header name, token-creation steps, or scope model.
- Before building a fireROUTE adapter, re-check the current official auth section against the live docs so the header name and plan restrictions are not inferred from stale marketplace-era metadata.

## Response, pagination, and error notes
- The public site and docs are built around REST/JSON usage.
- Pagination-related controls explicitly shown in the docs are `limit` and `offset`.
- The quickstart page exposes per-route sample links (`Open`) and a Postman collection import path for broader inspection.
- No shared error schema or numeric rate-limit table was visible in the manually reviewed excerpts.

## Usage notes from the official site
- The homepage positions the API as live scores, fixtures, tables, squads, lineups/substitutions, and related football statistics in machine-readable form.
- The homepage states that access to top competitions is free forever.
- The homepage also states that more competitions, in-depth data, historical data, and more requests are part of paid offerings.

## fireROUTE normalization notes
- Model this provider as a read-only football data API rooted at `https://api.football-data.org/v4`.
- Preserve the distinct resource families (`areas`, `competitions`, `teams`, `persons`, `matches`) because the official quickstart documents them separately.
- Preserve query-parameter names exactly as documented; several routes accept overlapping but not identical date/status/competition filters.