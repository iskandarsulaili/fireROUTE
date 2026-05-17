# Football Standings

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `football-standings`
- Official docs/pages used:
  - `https://github.com/azharimm/football-standings-api`
- Current public API base URL shown in the official README: `https://api-football-standings.azharimm.site`
- Auth model: no authentication mentioned in the reviewed README
- Response format: JSON
- Public rate-limit note: no numeric rate limit was published in the reviewed repository README
- Manually confirmed route count: `4`

## Authentication and access
- The reviewed official README exposes public `GET` endpoints only.
- No API key, OAuth flow, or bearer-token requirement is described in the visible docs.
- The project describes itself as standings data derived from ESPN.

## Canonical endpoints
1. `GET /leagues` - list all supported leagues
2. `GET /leagues/{id}` - fetch one league's detail record
3. `GET /leagues/{id}/seasons` - list seasons available for a league
4. `GET /leagues/{id}/standings` - standings for a league and season

## Parameters and filters
### Path parameters
- `id` - league identifier such as `eng.1`

### Query parameters
- `season` - season selector for standings requests
- `sort` - standings ordering control; the README example shows `sort=asc`

## Response, pagination, and error notes
- The README examples return JSON objects with a top-level `status` boolean and `data` payload.
- No offset/page pagination model is documented in the README.
- No shared error schema is documented in the reviewed page.
- League and standings payloads include metadata such as names, abbreviations, logos, and season display text.

## Usage notes from the official docs
- The project README explicitly lists the four endpoint families above and includes concrete examples for each.
- The provider positions the service as football standings coverage across leagues such as EPL, La Liga, and Serie A.
- The data source note in the README says the standings are based on ESPN data.

## fireROUTE normalization notes
- Normalize this provider as a small public JSON API rooted at `/leagues`.
- Preserve `season` and `sort` as first-class query controls for the standings route.
- Treat `/leagues/{id}` and `/leagues/{id}/seasons` as metadata-discovery endpoints that feed `/standings` selection.