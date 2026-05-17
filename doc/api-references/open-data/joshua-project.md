# Joshua Project

## Provider metadata
- Category: `Open Data`
- Provider slug: `joshua-project`
- Description: `People groups of the world with the fewest followers of Christ`
- Official docs/pages used:
  - `https://api.joshuaproject.net/` (official API home and key signup entry)
  - `https://api.joshuaproject.net/getting_started` (official URL structure, auth, and format guide)
  - `https://api.joshuaproject.net/v1/docs/available_api_requests#!/continents` (official Swagger UI entry page)
  - `https://api.joshuaproject.net/api-docs.json` (official Swagger JSON loaded by the docs UI)
  - `https://api.joshuaproject.net/terms_of_use` (official API usage restrictions)
- Current public API base URL: `https://api.joshuaproject.net`
- Auth model: required `api_key=<YOUR_API_KEY>` query parameter according to the official Getting Started page
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON or XML selected by the route suffix (`.json` or `.xml`)
- Rate limits: no numeric quota policy was published on the reviewed official pages
- Manually confirmed route count: `13`

## API shape and behavior
- The official Getting Started page defines the shared URL template as `https://api.joshuaproject.net/[api_version_number]/[resource_path].[format]?api_key=[your_api_key]&[other_parameters]`.
- All routes confirmed in the official Swagger JSON are `GET` routes under version `v1`.
- The API mixes singleton detail routes (`/{id}.{format}`) with collection/search routes (`.{format}`) for continents, countries, languages, people groups, and totals.
- Collection routes rely heavily on query-string filters, usually including `limit`, `page`, filter lists, and sort controls.

## Canonical endpoints
1. `GET /v1/continents/{id}.{format}`
   - Get the details about a specific continent.
2. `GET /v1/countries/{id}.{format}`
   - Retrieve one country by FIPS code.
3. `GET /v1/countries.{format}`
   - Search/filter countries.
4. `GET /v1/languages/{id}.{format}`
   - Retrieve one language by ISO code.
5. `GET /v1/languages.{format}`
   - Search/filter languages.
6. `GET /v1/people_groups/daily_unreached.{format}`
   - Retrieve Unreached of the Day information.
7. `GET /v1/people_groups/{id}.{format}`
   - Retrieve one people group in a country context.
8. `GET /v1/people_groups.{format}`
   - Search/filter people groups in countries (PGIC).
9. `GET /v1/people_groups_global/{id}.{format}`
   - Retrieve one people group across countries (PGAC).
10. `GET /v1/people_groups_global.{format}`
    - Search/filter people groups across countries.
11. `GET /v1/regions/{id}.{format}`
    - Retrieve one region.
12. `GET /v1/totals/{id}.{format}`
    - Retrieve one named global total.
13. `GET /v1/totals.{format}`
    - Retrieve all global totals.

## Shared parameters and conventions
### Required auth/query conventions
- `api_key` - required API key in the query string.
- `{format}` - required format suffix; the official Getting Started page says valid values are `json` or `xml`.

### Shared path parameters
- `{id}` appears on the detail endpoints.
- The official docs describe these IDs as provider-specific codes such as:
  - continent ISO-style codes for continents
  - FIPS 10-4 country codes for countries
  - ISO 639-2 codes for languages
  - Joshua Project `PeopleID3` identifiers for people-group detail routes
  - provider-specific IDs for regions and totals

### Common collection/query controls shown in the official Swagger JSON
- Pagination: `limit`, `page`
- Sorting: `sort_field`, `sort_direction`
- List filters: `ids`, `continents`, `countries`, `languages`, `regions`, `primary_religions`, `jpscale`
- Numeric/range filters: `population`, percentage fields such as `pc_evangelical`, and many other dashed-range filters
- Boolean-like `Y`/`N` filters on some routes, such as `window1040`, `has_audio`, `least_reached`, `is_frontier`, `indigenous`, `include_country_list`, `include_profile_text`, `include_resources`

### Route-specific examples from the official docs
- `GET /v1/people_groups/daily_unreached.{format}` supports `month`, `day`, and `lang`.
- `GET /v1/people_groups/{id}.{format}` supports optional `country`.
- `GET /v1/people_groups_global/{id}.{format}` supports optional `include_country_list`.

## Response notes
- The official docs describe JSON/XML success responses but do not publish one universal success schema because payload fields vary by resource.
- The official Swagger JSON documents these response codes across the route set: `200`, `400`, `401`, `404`, `500`.
- A live request to `GET /v1/totals.json` without `api_key` returned HTTP `401` with JSON envelope:
  - `{"api":{"status":"error","error":{"code":401,"message":"Unauthorized","details":"You are missing your API key."}}}`
- Collection routes explicitly expose `page` and `limit` parameters in the official Swagger JSON, so pagination is route-driven rather than hidden in headers.

## Usage notes
- The official Terms of Use page says the API/data is free of charge but restricted to non-commercial use.
- The same terms page requires visible attribution: `Data provided by Joshua Project` with a link to `https://www.joshuaproject.net`.
- The terms page also prohibits direct public replication of Joshua Project's core service/presentation without added value.
- The official Getting Started page and examples use query-string API keys, not headers.
- The Swagger JSON exposes a large filter surface; adapters should preserve passthrough query support rather than attempting a narrow canonical subset only.

## fireROUTE normalization notes
- Preserve the `.json` / `.xml` suffix as part of the documented public contract.
- Preserve `api_key` in the query string because that is the official auth mechanism.
- Treat the thirteen documented GET routes as distinct route families.
- Preserve collection-query passthrough for `countries`, `languages`, `people_groups`, and `people_groups_global` because the official filter surface is extensive and provider-specific.