# GreyNoise

## Provider metadata
- Category: `Security`
- Provider slug: `greynoise`
- Docs used manually:
  - `https://docs.greynoise.io/reference/getcommunityip`
  - `https://docs.greynoise.io/reference/v3ip`
  - `https://docs.greynoise.io/reference/v3multiip`
  - `https://docs.greynoise.io/reference/gnqlv3query`
  - `https://docs.greynoise.io/reference/ping`
- Confirmed REST API base URL: `https://api.greynoise.io`
- Primary media type: JSON
- Auth model from the official docs: the docs UI marks credentials as `Header`; authenticated endpoints require an API key, while the Community route is documented without a key in its curl example
- Manually confirmed routes in this pass: `5`

## Authentication
GreyNoise's current public docs distinguish between a free community route and authenticated routes.

Confirmed auth details from the official docs:
- the docs UI identifies credentials as `HEADER`
- `/v3/community/{ip}` is shown with an unauthenticated curl example containing only `accept: application/json`
- `/ping` returns `401 Unauthorized. Please check your API key.` when the caller is not authorized
- `/v3/ip/{ip}` documents `401` for bad credentials and `403` for invalid key or plan limitations
- some features such as personal workspace data require an authenticated workspace

Important note:
- the anonymous public docs do not expose the exact API-key header name in the sampled pages without logging in to the docs UI, so fireROUTE should record the auth family as header-based API-key auth rather than guessing a header name

## Common request/response conventions
- Base URL: `https://api.greynoise.io`
- Response format: JSON
- Path-style lookup routes are common for single-resource reads
- Query-heavy analytic routes such as GNQL return JSON objects with request metadata plus data arrays
- Plan restrictions can produce `206 Partial Content` or `403 Forbidden` depending on endpoint and entitlement

## Manually confirmed endpoint set

### 1) Community IP lookup
- Method: `GET`
- Path: `/v3/community/{ip}`
- Full URL: `https://api.greynoise.io/v3/community/{ip}`
- Purpose: free community lookup returning a subset of the full IP context data
- Path parameters:
  - `ip` - required IP address to query
- Confirmed response statuses:
  - `200` - community or RIOT record found
  - `400` - invalid routable IPv4 address
  - `404` - no record found
  - `429` - predefined rate limit reached
  - `500` - unexpected error
- Response body fields documented:
  - `ip`, `noise`, `riot`, `classification`, `name`, `link`, `last_seen`, `message`

### 2) Full IP lookup
- Method: `GET`
- Path: `/v3/ip/{ip}`
- Full URL: `https://api.greynoise.io/v3/ip/{ip}`
- Purpose: return full IP context, including scanner intelligence and business-service intelligence
- Path parameters:
  - `ip` - required IP address
- Query parameters:
  - `quick` - optional boolean, return only the IP plus classification or trust-level subset
  - `workspace_labels` - optional comma-separated dataset scopes
- `workspace_labels` values documented:
  - `greynoise`
  - `community`
  - `personal`
- Confirmed response statuses:
  - `200` - success
  - `206` - partial content due to plan limitations
  - `400` - bad request
  - `401` - unauthorized
  - `403` - invalid key or plan limitations
  - `429` - rate limit hit
- Response sections documented include:
  - `business_service_intelligence`
  - `internet_scanner_intelligence`
  - `request_metadata.restricted_fields`
  - metadata like owner, ASN, reverse DNS pointer, country, actors, tags, and raw data

### 3) Multi-IP lookup
- Method: `POST`
- Path: `/v3/ip`
- Full URL: `https://api.greynoise.io/v3/ip`
- Purpose: retrieve consolidated scanner/business-service intelligence for multiple IPs in one request
- Query parameters:
  - `quick` - optional boolean
  - `workspace_labels` - optional dataset-scope selector
- Request body:
  - `ips` - required array of IPv4 address strings
- Important usage notes from the docs:
  - can process up to `10,000` IPs per request
  - `workspace_labels` enforcement matches the single-IP lookup notes on this page
- Response notes:
  - returns `200` on success
  - uses the same plan-restriction concepts as the single-IP route, including restricted-field behavior

### 4) GNQL query
- Method: `GET`
- Path: `/v3/gnql`
- Full URL: `https://api.greynoise.io/v3/gnql`
- Purpose: execute GreyNoise Query Language searches against the dataset
- Query parameters documented:
  - `query` - required GNQL query string
  - `size` - optional integer, `1` to `10000`, default `10000`
  - `scroll` - optional pagination token, incompatible with `format=csv`
  - `quick` - optional boolean
  - `format` - optional `csv|json`, default `json`
  - `exclude` - optional comma-separated field exclusion list
- Response fields documented:
  - `request_metadata.complete`
  - `request_metadata.scroll`
  - `request_metadata.query`
  - `request_metadata.adjusted_query`
  - `request_metadata.count`
  - `request_metadata.message`
  - `request_metadata.restricted_fields`
  - `data`
- Response statuses explicitly shown:
  - `200`
  - `206`

### 5) Ping
- Method: `GET`
- Path: `/ping`
- Full URL: `https://api.greynoise.io/ping`
- Purpose: check GreyNoise service status and API access
- Response statuses:
  - `200` - ping successful
  - `401` - unauthorized, check API key
- Response body fields documented:
  - `message`
  - `expiration`
  - `offering`
  - `address`
  - `plan`
  - `modules`

## Pagination
GreyNoise's public docs show token-based pagination for GNQL:
- `scroll` is the pagination token
- GNQL responses return `request_metadata.scroll`
- `request_metadata.complete=false` indicates more pages remain
- the docs explicitly say `scroll` is incompatible with `format=csv`

## Rate limits
- The public docs used in this pass do not publish a numeric request-per-minute or request-per-day limit
- Endpoint pages do document `429` responses for community and authenticated IP routes
- the community route explicitly says `429` means the predefined rate limit has been reached
- fireROUTE should therefore treat rate limits as enforced but numerically undocumented in the public reference pages sampled here

## Error and plan-limit notes
Confirmed from the official pages used here:
- `400` is used for invalid request syntax or invalid routable IP input
- `401` is used for missing/invalid authorization on authenticated routes
- `403` is used for invalid API key or plan limitations on `/v3/ip/{ip}`
- `206 Partial Content` is used when the response is truncated by plan restrictions
- `429` indicates rate limiting

## Important usage notes
- `workspace_labels` support is entitlement-sensitive and behaves differently across endpoints
- for `/v3/ip/{ip}` and `POST /v3/ip`, supplying `workspace_labels` without the Community Dataset entitlement is documented to return `403`
- unrecognized `workspace_labels` values may yield empty results rather than an error on certain endpoints
- the community route is intentionally a subset of the richer full IP lookup response

## Verification notes
This file was manually rebuilt from GreyNoise's official reference pages. The README's original GreyNoise docs URL now 404s; I confirmed the current official replacement pages under `/reference/getcommunityip`, `/reference/v3ip`, `/reference/v3multiip`, `/reference/gnqlv3query`, and `/reference/ping`.
