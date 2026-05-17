# GeographQL

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geographql`
- Official docs used manually:
  - `https://geographql.netlify.app/`
  - `https://geographql.netlify.app/docs/intro`
  - `https://geographql.netlify.app/docs/rate-limit`
  - query docs under `https://geographql.netlify.app/docs/queries/...`
  - input docs under `https://geographql.netlify.app/docs/inputs/...`
- Public API base URL documented by provider: `https://api.geographql.rudio.dev`
- Confirmed endpoint path: `/graphql`
- Transport: `HTTPS`
- Auth model: none documented; the docs say an API-key option for more points is still in development
- Response format documented: GraphQL over `JSON`

## Product and access notes
- The official homepage describes GeographQL as a `Country, State, and City GraphQL API`.
- The docs are entirely GraphQL-centric and document one endpoint plus query/schema pages rather than multiple REST resources.
- The docs emphasize cursor-based pagination conforming to the GraphQL Cursor Connections Specification.
- The live docs expose a `Playground` link that points to the same public endpoint.

## Confirmed API surface
The inspected official docs confirm `1` public HTTP endpoint:
1. `POST /graphql`

Important access note:
- The public playground link is `https://api.geographql.rudio.dev/graphql`.
- The docs do not publish any alternate versioned path, REST mirror, or separate auth endpoint.

## 1) GraphQL endpoint
- Method: `POST`
- Path: `/graphql`
- Full URL: `https://api.geographql.rudio.dev/graphql`
- Purpose: execute all GeographQL queries against countries, states, and cities

Documented top-level queries visible in the official docs sidebar and query pages:
- `cities(filter, page)`
- `city(id)`
- `countries(filter, page)`
- `country(id | iso2 | iso3 | numeric_code)`
- `state(id | locationCode)`
- `states(filter, page)`

## Query arguments and input objects
Officially documented query arguments:
- `cities`
  - `filter: CityFilterInput`
  - `pagination/page: PaginationInput`
- `city`
  - `id: Int`
- `countries`
  - `filter: CountryFilterInput`
  - `pagination/page: PaginationInput`
- `country`
  - `id: Int`
  - `iso2: ID`
  - `iso3: ID`
  - `numeric_code: ID`
- `state`
  - `id: Int`
  - `locationCode: StateCountryCodeInput`
- `states`
  - `filter: StateFilterInput`
  - `pagination/page: PaginationInput`

Officially documented input fields inspected on the docs site:
- `CityFilterInput`
  - `ciso2 (ID!)` - country ISO alpha-2 code
  - `sid (Int)` - state id within the supplied country code
  - `siso (String)` - state code within the supplied country code
- `CountryFilterInput`
  - `region (Region)`
  - `subregion (Subregion)`
  - provider note: if both are supplied, filtering is done by `subregion`
- `StateFilterInput`
  - `cid (ID)` - country id
  - `ciso2 (String)` - country code
- `PaginationInput`
  - `first (Int)`
  - `last (Int)`
  - `before (String)`
  - `after (String)`

Official pagination constraints from the docs:
- providing both `first` and `last` is not supported
- using `first` with `before` is not supported
- using `last` with `after` is not supported
- using `last` without `before` is not supported

## Pagination and rate limits
Cursor-pagination model documented by the provider:
- connection-style responses return `totalCount`, `edges`, and `pageInfo`
- `edges` contain `cursor` plus `node`
- `pageInfo` includes `hasNextPage`, `hasPreviousPage`, `endCursor`, and `startCursor`

Rate-limit and complexity rules from the official Rate Limit page:
- maximum query complexity: `1000` points
- rate limit: `10000` points per IP address per hour
- the provider distinguishes:
  - `Requested Query Cost` - max possible cost calculated before execution
  - `Actual Query Cost` - cost deducted after resolution using the actual returned data count
- the docs say API-key support for additional points is currently in development

## Response and error notes
Response format visible in the official examples:
- GraphQL success responses use a JSON `data` envelope
- paginated list queries return connection objects such as `CityConnection!`, `CountryConnection!`, and `StateConnection!`

Error / failure notes grounded in the docs:
- the Rate Limit page documents complexity-based enforcement rather than a provider-specific error catalog
- over-complex queries are checked before execution using requested query cost
- the docs do not publish a separate HTTP error/status table or custom error-code list on the pages inspected in this run

## Important usage notes from the official docs
- `country` can be addressed by internal id, ISO alpha-2, ISO alpha-3, or ISO numeric code.
- `state` requires either a numeric state id or a `StateCountryCodeInput` pair because state code alone is not unique.
- Nested queries can increase requested query cost quickly because cost multiplies across nested paginated selections.
- The sample docs show nested traversal from country to states and from state to cities, so clients should budget rate-limit points for deeply nested requests.

## Canonical fireROUTE notes
- Treat this provider as a single GraphQL passthrough endpoint rather than inventing REST-style route normalization.
- Preserve cursor-based pagination exactly as documented.
- Expose query-cost/rate-limit guidance prominently if this provider is used in shared multi-provider plans, because nested queries can exhaust point budgets faster than simple flat lists.
- No auth is documented today, but the docs explicitly say API-key expansion is in development; keep auth handling configurable.

## Verification notes
- This file was manually rebuilt from the live official GeographQL docs site using browser tools only.
