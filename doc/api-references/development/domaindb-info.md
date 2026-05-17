# DomainDb Info

## Provider metadata
- Category: `Development`
- Provider slug: `domaindb-info`
- Docs used manually:
  - `https://api.domainsdb.info/`
  - `https://domainsdb.info/docs`
- Confirmed REST API base URL: `https://api.domainsdb.info/v1`
- Primary media type: JSON
- Authentication: API key for most endpoints
- Manually confirmed routes in this pass: `14`

## Authentication
From the official docs page:
- you obtain an API key by authenticating with a Google account
- the docs say `Most endpoints require an API key for authentication`
- the documented auth transport is query-parameter based:
  - `?api_key=YOUR_API_KEY`
- the bare root endpoint at `https://api.domainsdb.info/` is publicly reachable and returns a JSON health message: `{"message":"DomainsDB API is running.","status":"OK"}`

## Common request/response conventions
- Base URL: `https://api.domainsdb.info/v1`
- reviewed routes are all documented as `GET`
- response format is `application/json`
- the official example response includes cursor-style pagination via `next_page`
- search/list responses can include timing metadata in a top-level `time` field

## Manually confirmed endpoint set

### Domain search endpoints
1. `GET /v1/domains/search` - search the domains database with various filters
2. `GET /v1/domains/tld/{zone_id}` - get TLD records for a specific zone
3. `GET /v1/domains/tld/{zone_id}/download` - download the whole dataset for a specific TLD
4. `GET /v1/domains/tld/{zone_id}/search` - search domains within a specific TLD

### Domain updates endpoints
5. `GET /v1/domains/updates/added` - get recently added domains; docs say latest is used if date is not specified
6. `GET /v1/domains/updates/added/download` - download the added-domains dataset
7. `GET /v1/domains/updates/deleted` - get recently deleted domains; docs say latest is used if date is not specified
8. `GET /v1/domains/updates/deleted/download` - download the deleted-domains dataset
9. `GET /v1/domains/updates/list` - list all available updates

### Information and statistics endpoints
10. `GET /v1/info/api` - get information about your API key
11. `GET /v1/info/stat/` - get overall database statistics
12. `GET /v1/info/stat/{zone}` - get statistics for a specific zone
13. `GET /v1/info/tld/` - get overall TLD information
14. `GET /v1/info/tld/{zone}` - get information for a specific TLD zone

## Confirmed parameters and schemas
From the officially visible example and route cards:
- Query parameters explicitly confirmed:
  - `api_key` - API key; docs say most endpoints require it
  - `domain` - used in the official `/v1/domains/search` example
  - `limit` - used in the official `/v1/domains/search` example
- Path parameters explicitly confirmed from route templates:
  - `zone_id` - used on TLD routes
  - `zone` - used on info/stat and info/tld routes
- Date selector behavior explicitly confirmed from route descriptions:
  - `added` / `deleted` endpoints state that the latest update is returned if `date` is not specified

## Example search response fields confirmed on the official docs page
The official `/v1/domains/search` example shows:
- top-level `total`
- top-level `time`
- top-level `next_page`
- top-level `domains[]`
- per-domain `domain`
- per-domain `create_date`
- per-domain `update_date`
- per-domain `country`
- per-domain `isDead`
- per-domain `A[]`
- per-domain `NS[]`
- per-domain `MX[]` with `exchange` and `priority`

## Pagination
- the official search example includes a `next_page` token-like field
- the same example also includes `limit`
- the reviewed docs page did not expose a deeper prose section explaining how `next_page` should be replayed, so I documented only the pagination fields that were directly visible on the official page

## Rate limits
- the reviewed official docs page did not publish numeric rate limits or quota tables

## Error and response notes
- the reviewed docs page focuses on route inventory plus a successful example response
- no dedicated error-code table or generic error envelope was visible on the reviewed official docs page
- the root API health endpoint returns a simple JSON service-status object

## Important usage notes
- the docs explicitly distinguish between searchable JSON endpoints and `download` dataset endpoints
- TLD routes use `zone_id` in the path, while information routes use `zone`
- because the docs state that most endpoints require an API key, clients should not assume every `GET` route is anonymously accessible even though the root health endpoint is public
- the reviewed docs UI did not expose expanded per-endpoint parameter tables in this session, so only directly visible query/path parameter names have been recorded here

## Verification notes
This file was manually rebuilt from the official DomainsDB API root and the official `domainsdb.info/docs` documentation page using browser inspection.