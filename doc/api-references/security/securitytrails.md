# SecurityTrails

## Provider metadata
- Category: `Security`
- Provider slug: `securitytrails`
- Docs used manually:
  - `https://securitytrails.com/corp/apidocs`
  - `https://docs.securitytrails.com/docs/overview`
  - `https://docs.securitytrails.com/docs/authentication`
  - `https://docs.securitytrails.com/docs/quotas-rate-limits`
  - `https://docs.securitytrails.com/docs/errors`
  - `https://docs.securitytrails.com/reference`
  - representative route pages under `https://docs.securitytrails.com/reference/...`
- Confirmed API base URL family: `https://api.securitytrails.com`
- Confirmed documented surfaces reviewed in this pass:
  - `v1` public SecurityTrails API
  - `v2` Action Center / Projects / Company APIs
- Authentication model: API key in `APIKEY` header; query-string `apikey` is also supported but discouraged
- Primary response format: JSON
- Manually confirmed routes in this pass: `24`

## Authentication
From the official authentication page:
- Preferred auth is an HTTP header named `APIKEY`.
- Example: `APIKEY: your_api_key`
- SecurityTrails also supports `apikey` as a query parameter.
- The docs explicitly discourage query-string auth because query strings are often logged in clear text.
- HTTPS is mandatory; the overview page says HTTP requests are redirected to HTTPS.

## Rate limits and quotas
From the official quotas/rate-limits page:
- All subscription levels have a monthly quota.
- Exceeding monthly quota returns HTTP `429`.
- Each account also has a per-second rate limit.
- When throttled, SecurityTrails says the limit resets after a one-second interval.
- The reviewed page does not publish a public numeric requests-per-second table.
- The docs recommend client-side caching when repeatedly querying the same domain or IP.

## Error handling
From the official errors page:
- `200` - success
- `400` - bad request / invalid request parameter
- `401` - invalid or missing API key
- `403` - forbidden / inaccessible information
- `429` - quota or rate-limit reached
- `500` - internal server error

## Pagination and scrolling
From the reviewed route pages:
- `POST /v1/domains/list` exposes a `page` query parameter.
- `POST /v1/domains/list-backup` exposes `page` and `scroll` query parameters.
- `GET /v1/scroll/{scroll_id}` is the documented continuation endpoint for DSL scrolling.
- `GET /v2/company/{domain}/associated-ips` exposes `page` and `page_size`.
- `POST /v2/projects/{project_id}/assets/_search` documents body-level `pagination` and `sort` objects.

## Response format notes
- The overview page says request bodies outside headers/path/query use JSON.
- The overview page says responses are JSON.
- The docs also note gRPC-style content is not involved here; these are standard REST endpoints.

## Common parameters confirmed in reviewed pages
- `apikey` - query-string auth alternative
- `hostname` - domain name path selector for many `v1/domain/...` routes
- `ipaddress` - IP selector for `v1/ips/...` routes
- `type` - record/feed type path selector on DNS-history and feed routes
- `scroll_id` - continuation token for DSL scroll retrieval
- `project_id` - path selector for Action Center / Project / Asset routes
- `report_type` - Action Center report selector
- `domain` - company-domain selector for the reviewed `v2/company` route

## Confirmed routes with exact paths

### v1 SecurityTrails API
1. `GET /v1/ping` - auth/connectivity check
2. `GET /v1/domain/{hostname}` - current domain record
3. `GET /v1/account/usage` - account usage
4. `GET /v1/ips/nearby/{ipaddress}` - nearby IP exploration
5. `GET /v1/domain/{hostname}/whois` - domain WHOIS
6. `GET /v1/history/{hostname}/whois` - WHOIS history by domain
7. `POST /v1/domains/list` - filter-based domain search
   - confirmed extra query params: `include_ips`, `page`
   - confirmed body field: `filter`
8. `GET /v1/domain/{hostname}/subdomains` - list subdomains
9. `POST /v1/domains/stats` - search statistics
10. `GET /v1/domain/{hostname}/tags` - list tags for a domain
11. `GET /v1/history/{hostname}/dns/{type}` - DNS history by record type
12. `GET /v1/domain/{hostname}/associated` - find associated domains
13. `POST /v1/ips/list` - IP search with DSL
14. `POST /v1/ips/stats` - IP search statistics
15. `GET /v1/feeds/domains/{type}` - domain feed
16. `GET /v1/scroll/{scroll_id}` - DSL scroll continuation
17. `GET /v1/feeds/subdomains/{type}` - subdomain feed
18. `GET /v1/domain/{hostname}/ssl` - domain SSL data
19. `GET /v1/ips/{ipaddress}/whois` - IP WHOIS
20. `GET /v1/ips/{ipaddress}/useragents` - user agents for IP
21. `POST /v1/domains/list-backup` - domain search with DSL
   - confirmed extra query params: `include_ips`, `page`, `scroll`
   - confirmed body field: `query`

### v2 / newer indexed surfaces reviewed directly
22. `GET /v2/action_center/reports/{project_id}/{report_type}` - Action Center report retrieval
   - confirmed path params: `project_id`, `report_type`
   - confirmed example report types shown by the docs include `exposures-issue`, `exposures-host`, `vulnerable-products`, `admin-pages`, `remote-access`, `dns-records`, `expired-ssl`, and `expiring-ssl`
23. `POST /v2/projects/{project_id}/assets/_search` - search project assets
   - confirmed body families: `filter`, `pagination`, `enrichments`, `sort`
24. `GET /v2/company/{domain}/associated-ips` - associated IPs for company domain
   - confirmed query params: `page`, `page_size`

## Additional official index routes seen but not counted above
The official reference index also exposes these method/title entries. I did not count them in the `24` total above because I did not manually open every one of those route pages to confirm the exact path string in this pass:
- `GET` List Projects
- `GET` Find Assets
- `GET` Read Asset
- `GET` List Asset Exposures
- `GET` Get Filters
- `PUT` Apply Tag To Asset
- `DEL` Remove Tag From Asset
- `POST` Bulk Add Remove Asset Tags
- `POST` Get Filters With Filter
- `GET` Get Tags
- `GET` Get Custom Tag Task Status
- `POST` Bulk Add Remove Assets
- `POST` Add Tag
- `GET` List Exposures
- `GET` Get Exposure Assets
- `GET` Get Static Assets
- `POST` Add Static Assets

## Important usage notes
- The overview page describes the API as read-only for the classic SecurityTrails REST surface.
- The reviewed v1 pages consistently use `https://api.securitytrails.com/v1/...`.
- The newer reviewed pages consistently use `https://api.securitytrails.com/v2/...`.
- SecurityTrails recommends caching frequent lookups to reduce throttling and quota pressure.
- The DSL search flow is the main place where scrolling/continuation behavior is documented.

## Verification notes
This file was manually rebuilt from SecurityTrails' official docs site after re-checking the formerly blocked index URL and then reviewing the official guides plus representative reference pages.