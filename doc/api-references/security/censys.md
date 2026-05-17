# Censys

## Provider metadata
- Category: `Security`
- Provider slug: `censys`
- Docs used manually:
  - `https://docs.censys.com/reference/get-started`
  - `https://docs.censys.com/reference/v3-globaldata-asset-host`
  - `https://docs.censys.com/reference/v3-globaldata-search-query`
  - `https://docs.censys.com/reference/v3-globaldata-search-aggregate`
  - `https://docs.censys.com/reference/v3-globaldata-asset-certificate`
  - `https://docs.censys.com/reference/v3-globaldata-asset-webproperty`
  - `https://docs.censys.com/reference/v3-globaldata-asset-host-list-post`
- Confirmed API base URL families from the official docs:
  - `https://api.platform.censys.io/v3/global/`
  - `https://api.platform.censys.io/v3/threat-hunting/`
  - `https://api.platform.censys.io/v3/collections/`
  - `https://api.platform.censys.io/v3/accounts/`
- Primary response format: JSON
- Authentication model confirmed from the official docs: Personal Access Token sent as a Bearer token in the `Authorization` header, with optional organization scoping via `X-Organization-ID` header or `organization_id` query parameter
- Manually confirmed routes in this pass: `5`

## Authentication
The official Censys Platform docs describe PAT-based authentication.

Confirmed auth details from the official docs:
- required auth style: Bearer token in the `Authorization` header
- users generate Personal Access Tokens from the Censys Platform console
- organization-scoped requests may also send `X-Organization-ID: {uuid}`
- `organization_id={uuid}` query parameter is also supported
- if both header and query forms of organization ID are supplied, the query parameter takes precedence
- free users do not have an organization ID

## Plan and entitlement notes
From the reviewed official `Get Started` page:
- Censys Free users only have access to host, web property, and certificate lookup plus related multi-retrieve endpoints
- Starter users have access to all Global Data and Collections endpoints except Live Rescan
- Search and Enterprise users have access to all Global Data and Collections endpoints
- Enterprise users with the Adversary Investigation module gain access to those endpoints as well
- Starter/Search/Enterprise organization users need the API Access role for organization API usage

## Common request and response conventions
- Censys Platform is a REST API with JSON request and response bodies
- Optional `Accept` headers can request vendor-specific schema versions such as:
  - `application/vnd.censys.api.v3.host.v1+json`
  - `application/vnd.censys.api.v3.certificate.v1+json`
  - `application/vnd.censys.api.v3.webproperty.v1+json`
- if the `Accept` header is omitted, the docs say Censys returns the most recent schema version
- error responses can use `application/problem+json`

## Manually confirmed endpoint set

### 1) Get a host
- Method: `GET`
- Path: `/v3/global/asset/host/{host_id}`
- Full URL: `https://api.platform.censys.io/v3/global/asset/host/{host_id}`
- Purpose: retrieve information about a single host; host ID is an IP address
- Confirmed path parameter:
  - `host_id` - required IP address of the host
- Confirmed query parameters:
  - `organization_id` - optional organization UUID
  - `at_time` - optional RFC3339 timestamp for point-in-time host view
- Confirmed headers:
  - `X-Organization-ID` - optional organization UUID
  - `Accept` - optional; defaults to `application/vnd.censys.api.v3.host.v1+json`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`, `500`

### 2) Run a search query
- Method: `POST`
- Path: `/v3/global/search/query`
- Full URL: `https://api.platform.censys.io/v3/global/search/query`
- Purpose: run a CenQL search across Censys data
- Confirmed JSON body fields:
  - `query` - required CenQL query string
  - `fields` - optional list of fields to return
  - `page_size` - optional page size; default and maximum `100`
  - `page_token` - optional pagination token for subsequent pages
- Confirmed query parameters:
  - `organization_id` - optional organization UUID
- Confirmed headers:
  - `X-Organization-ID`
  - `Accept: application/json` by default on this route page
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `422`, `500`
- Important note from the route docs:
  - matched host services are returned in a `matched_services` object unless relevant host-service fields are omitted from the requested field set

### 3) Aggregate results for a search query
- Method: `POST`
- Path: `/v3/global/search/aggregate`
- Full URL: `https://api.platform.censys.io/v3/global/search/aggregate`
- Purpose: aggregate Platform search results; equivalent to the Report Builder in the Censys UI
- Confirmed JSON body fields:
  - `field` - required field to aggregate by
  - `number_of_buckets` - required integer from `1` to `2000`
  - `query` - required CenQL query string
  - `count_by_level` - optional nested-counting control
  - `filter_by_query` - optional boolean, defaults to `false`
- Confirmed query parameters:
  - `organization_id` - optional organization UUID
- Confirmed headers:
  - `X-Organization-ID`
- Important notes from the official docs:
  - `count_by_level` controls how nested documents are counted for nested fields such as `host.services.port`
  - `filter_by_query=true` restricts aggregation buckets to values that themselves satisfy the query constraints

### 4) Get a certificate
- Method: `GET`
- Path: `/v3/global/asset/certificate/{certificate_id}`
- Full URL: `https://api.platform.censys.io/v3/global/asset/certificate/{certificate_id}`
- Purpose: retrieve information about a single certificate by SHA-256 fingerprint
- Confirmed path parameter:
  - `certificate_id` - required SHA-256 certificate fingerprint
- Confirmed query parameters:
  - `organization_id` - optional organization UUID
- Confirmed headers:
  - `X-Organization-ID`
  - `Accept` - defaults to `application/vnd.censys.api.v3.certificate.v1+json`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`, `500`

### 5) Retrieve multiple hosts
- Method: `POST`
- Path: `/v3/global/asset/host`
- Full URL: `https://api.platform.censys.io/v3/global/asset/host`
- Purpose: retrieve information about multiple hosts in one call
- Confirmed JSON body fields:
  - `host_ids` - required array of host IP addresses
  - `at_time` - optional RFC3339 timestamp applied to all requested hosts
- Confirmed query parameters:
  - `organization_id` - optional organization UUID
- Confirmed headers:
  - `X-Organization-ID`
  - `Accept` - defaults to `application/vnd.censys.api.v3.host.v1+json`
- Confirmed responses:
  - `200`, `400`, `401`, `403`, `404`, `500`
- Important note from the official docs:
  - you can retrieve up to `100` hosts per call

## Additional route family note
I also manually confirmed the official web-property lookup page:
- `GET /v3/global/asset/webproperty/{webproperty_id}`
- web properties are identified as `hostname:port`, e.g. `platform.censys.io:80`
- the page documents optional `at_time`, optional org scoping, and the default vendor media type `application/vnd.censys.api.v3.webproperty.v1+json`

I am not counting that extra page in the route total above because the five routes listed in detail are the ones fully documented in this rewritten file, but it was manually checked while verifying Censys' Global Data structure.

## Pagination
From the official docs reviewed here:
- search queries paginate with `page_token`
- search request bodies use `page_size`
- search route docs cap `page_size` at `100`
- the general Censys docs do not describe offset-based pagination for the reviewed v3 Global Data routes

## Rate limits
The official `Get Started` page does not publish a single per-minute or per-second table, but it does publish concurrency limits by account tier:
- Free: `1` concurrent action
- Starter: `1` concurrent action
- Search and Enterprise: `25` concurrent actions
- the same page states that API rate limits are shown on the Personal Access Tokens page in the Censys Platform UI

## Error handling
Confirmed from the official pages reviewed in this pass:
- `400` - bad request
- `401` - missing or invalid authorization token
- `403` - caller lacks permission to access the data
- `404` - asset not found on lookup routes
- `422` - invalid input on the search route
- `500` - internal server error
- error payloads may be returned as `application/problem+json`

## Important usage notes
- Censys ties billing and entitlements to the authenticated user and, where applicable, an organization context; integrations should preserve organization scoping explicitly
- vendor-specific `Accept` headers matter if downstream consumers depend on stable schema versions for host, certificate, or web-property assets
- free-plan coverage is intentionally narrow, so route availability depends strongly on account tier
- the official route docs recommend using `organization_id` as a query parameter rather than `X-Organization-ID` except for atypical cases

## Blocker note
- The original README URL `https://search.censys.io/api` presented a Cloudflare bot-verification page in this browser session and was not usable for route inspection.
- I used Censys' current official alternative documentation site under `https://docs.censys.com/reference/` instead and manually documented the routes from there.

## Verification notes
This file was manually rebuilt from Censys' official documentation site and replaces the earlier placeholder summary.
