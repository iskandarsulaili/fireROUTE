# Enigma Public

## Provider metadata
- Category: `Open Data`
- Provider slug: `enigma-public`
- Description: `Broadest collection of public data`
- Official docs/pages used:
  - `https://developers.enigma.com/docs` (redirects to the current Enigma documentation site)
  - `https://documentation.enigma.com/reference/graphql_api`
  - `https://documentation.enigma.com/resources/rate-limits`
  - `https://documentation.enigma.com/v1`
  - `https://documentation.enigma.com/v1/guides/data-access/api/match-endpoint`
- Confirmed public API base URL: `https://api.enigma.com/graphql`
- Auth model: `x-api-key: YOUR_API_KEY`
- Methods officially documented on the reviewed pages: `POST`
- Response formats officially documented on the reviewed pages: GraphQL JSON responses; optional file-output workflows are also described in the schema docs
- Rate limits officially documented on the reviewed pages:
  - GraphQL Trial: `10 RPS`, burst `20`, daily `100,000`
  - GraphQL Pro: `50 RPS`, burst `100`, daily `500,000`
  - GraphQL Max: `50 RPS`, burst `100`, daily `500,000`
  - GraphQL Enterprise: `100 RPS`, burst `200`, no daily limit
  - Over-limit response documented as HTTP `429 Slow Down`
- Manually confirmed route count: `1`

## API shape and behavior
- The current official Enigma platform documentation exposes one programmatic HTTP endpoint: the GraphQL endpoint at `https://api.enigma.com/graphql`.
- The indexed `developers.enigma.com/docs` entry resolves into a documentation site where the current implementation guidance focuses on the GraphQL surface.
- The legacy `v1` docs are still online for existing customers, but they are explicitly labeled `Legacy Documentation` and tell new implementations to use the contemporary platform powered by `graph-model-1`.
- Legacy pages still discuss `match`, `id`, `KYB`, and `screening` workflows, but the reviewed legacy pages did not publish a concrete route-by-route REST path inventory; the current public route count therefore remains the single confirmed GraphQL endpoint.

## Canonical endpoint
1. `POST /graphql`
   - Submit GraphQL queries against Enigma's business-data graph.
   - Official docs require the `x-api-key` request header.
   - The reviewed GraphQL reference documents the query schema, filtering rules, pagination model, and output options on this one endpoint.

## Core request model
### Authentication and transport
- Header: `x-api-key: YOUR_API_KEY`
- Base URL: `https://api.enigma.com/graphql`
- The reviewed pages describe programmatic access through standard GraphQL clients.
- The official docs do not publish additional path-level auth variants for the current platform.

### Main documented search input fields
The GraphQL reference documents `SearchInput` with these notable fields:
- `prompt` - natural-language business description; only supported when `entityType` is `BRAND`
- `id` - entity ID; takes precedence over other fields
- `name`
- `address`
- `addresses` - list form for aggregate workflows
- `person`
- `phoneNumber`
- `website`
- `conditions`
- `tin`
- `matchThreshold`
- `entityType` - defaults to `BRAND`; documented values include `BRAND`, `LEGAL_ENTITY`, `OPERATING_LOCATION`
- `output` - background-task/file-output configuration

### Conditions/filtering model
The docs describe `conditions` for list-style and search queries with:
- `filter`
- `orderBy`
- `limit`
- `pageToken`

Documented filter operators include:
- `EQ`, `NE`, `GT`, `GTE`, `LT`, `LTE`
- `IN`, `NOT_IN`
- `LIKE`, `ILIKE`
- `AND`, `OR`, `NOT`
- `ADD`, `SUB`, `MUL`, `DIV`
- `HAS`

### Output/file-generation notes
- `output.filename` is required when requesting background output.
- `output.format` may be set to `CSV` or `PARQUET` in the documented examples.
- `output.s3Path` may be supplied for result delivery to S3.

## Pagination notes
- The current GraphQL docs explicitly state that Enigma implements cursor-based pagination following the Relay Connection specification.
- Documented connection concepts:
  - `edges`
  - `pageInfo`
  - each edge contains `node` and `cursor`
- Documented `pageInfo` fields:
  - `hasNextPage`
  - `hasPreviousPage`
  - `startCursor`
  - `endCursor`
- Documented pagination arguments:
  - forward: `first`, `after`
  - backward: `last`, `before`
- Validation rules published on the reviewed page:
  - cannot use both `first` and `last`
  - `after` requires `first`
  - `before` requires `last`
  - pagination values must be `>= 0`

## Legacy-v1 notes that still matter
- The legacy docs are explicitly maintained for existing customers only.
- The reviewed legacy `Match Endpoint` page documents `x-api-key` auth plus request concepts such as `business_entity_type`, `match_threshold`, `top_n`, `show_non_matches`, and `prioritization`.
- However, the reviewed legacy page does not publish a concrete HTTP path such as `/v1/...`; it describes workflow semantics, payload shape, and query parameters without an authoritative route path table.
- Because the route path itself was not published on the reviewed legacy pages, those legacy workflows are not counted as separate confirmed HTTP routes here.

## Error and rate-limit notes
- The official rate-limit page documents HTTP `429` when a rate limit is exceeded.
- For GraphQL specifically, the page says the response is `429 Slow Down`.
- For KYB APIs, the page states limits vary by contract and tells users to contact Enigma support.
- The reviewed GraphQL reference page did not publish a detailed machine-readable HTTP error catalog or a canonical JSON error-body schema.
- The reviewed pages therefore confirm rate-limit behavior but do not confirm a fuller standardized error payload beyond GraphQL/HTTP conventions.

## Usage notes
- The GraphQL reference positions the endpoint as the current implementation surface for Enigma data access.
- The docs also point users to the Enigma Console GraphQL Playground for interactive exploration.
- Filtering on nested data uses dot-path field notation such as `operatingLocations.addresses.state` and `industries.industryType`.
- The docs explicitly distinguish text search, lookup, prompt search, and segmentation as usage patterns executed through the same GraphQL endpoint rather than through separate HTTP paths.
- The rate-limit page says all queries count toward rate limits regardless of query type.

## fireROUTE normalization notes
- Treat Enigma Public as a single GraphQL-over-HTTP provider, not a multi-path REST provider.
- Preserve the request as raw GraphQL at `POST /graphql` with `x-api-key` auth.
- Preserve Relay-style pagination semantics instead of inventing page-number wrappers.
- Do not synthesize separate REST routes for legacy `match`, `id`, `KYB`, or `screening` concepts unless Enigma republishes concrete current path documentation for them.