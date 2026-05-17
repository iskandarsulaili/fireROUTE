# TLE

## Provider metadata
- Category: `Science & Math`
- Provider slug: `tle`
- Description: `Satellite information`
- Official docs/pages used:
  - `https://tle.ivanstanojevic.me/#/docs`
- Current public API base URL: `https://tle.ivanstanojevic.me/api`
- Auth model: no authentication documented on the reviewed official page
- Methods officially documented on the reviewed page: `GET`
- Response formats officially documented on the reviewed page: `application/json`
- Rate limits: no numeric rate-limit policy was published on the reviewed official page
- Manually confirmed route count: `2`

## API shape and behavior
- The Redoc-powered official docs expose a single `TLE` tag with one collection route and one item route.
- The collection route returns a paginated list of `TleModel` objects plus Hydra-style pagination metadata.
- The item route returns one `TleModel` by satellite ID.

## Canonical endpoints
1. `GET /tle`
   - Return a collection of TLE records matching the supplied filters and paging controls.
2. `GET /tle/{id}`
   - Return one TLE record for the requested satellite ID.

## Core parameters and path conventions

### `GET /tle`
- `search` - string search term; default `*`
- `sort` - one of `id`, `name`, `popularity`, `inclination`, `eccentricity`, `period`; default `name`
- `sort-dir` - `asc` or `desc`; default `asc`
- `page` - integer >= `1`; default `1`
- `page-size` - integer from `1` to `100`; default `20`
- `eccentricity[gte]` - filter orbital eccentricity greater than or equal to a value
- `eccentricity[lte]` - filter orbital eccentricity less than or equal to a value
- `inclination[lt]` - filter inclination less than a value
- `inclination[gt]` - filter inclination greater than a value
- `period[lt]` - filter orbital period less than a value
- `period[gt]` - filter orbital period greater than a value

### `GET /tle/{id}`
- `id` - required integer satellite ID; the docs show example `43638`

## Response and pagination notes
- `GET /tle` returns JSON with:
  - `@context`
  - `@id`
  - `@type`
  - `totalItems`
  - `member`
  - `parameters`
  - `view`
- The `view` object carries pagination links such as `first`, `previous`, `next`, and `last`.
- `GET /tle/{id}` returns JSON with:
  - `@context`
  - `@id`
  - `@type`
  - `satelliteId`
  - `name`
  - `date`
  - `line1`
  - `line2`

## Error notes
- The collection route documents `500 Server error`.
- The item route documents `404 Resource not found` and `500 Server error`.
- No richer provider-specific error schema or rate-limit header contract was published on the reviewed official page.

## Usage notes
- The documentation page also exposes site sections such as Browse, Health, Privacy, and MCP, but the reviewed Redoc API reference under the `TLE` tag only documents the two `/api/tle` routes above.
- Keep the public base path as `/api`; the docs render route paths as `/api/tle` and `/api/tle/{id}`.
- The collection endpoint is the official discovery surface; use it for search, sorting, and filter-driven retrieval instead of scraping the site UI.

## fireROUTE normalization notes
- Preserve the documented query parameter names exactly, including bracketed filter keys such as `eccentricity[gte]`.
- Preserve the Hydra-style pagination fields from collection responses.
- Treat the provider as a small two-route REST API rather than a generic HTML site.
