# NetworkCalc

## Provider metadata
- Category: `Development`
- Provider slug: `networkcalc`
- Docs used manually:
  - `https://networkcalc.com/api/docs/`
  - `https://networkcalc.com/api/docs/auth/`
  - `https://networkcalc.com/api/docs/binary-converter/`
  - `https://networkcalc.com/api/docs/dns/`
  - `https://networkcalc.com/api/docs/alerts/`
  - `https://networkcalc.com/api/docs/domains/`
- Confirmed API base URL: `https://networkcalc.com`
- Primary response format confirmed from the reviewed docs: JSON
- Authentication model confirmed from the reviewed docs:
  - public utility endpoints can be called anonymously
  - account/pro endpoints use `Authorization: Bearer TOKEN`
  - bearer tokens are issued by `POST /api/auth/token` using `client_id`, `client_secret`, and `grant_type=client_credentials`
- Manually confirmed routes in this pass: `19`

## Authentication
- The official `Authorization API` page documents token issuance at `POST https://networkcalc.com/api/auth/token`.
- Confirmed request requirements for token issuance:
  - `Content-Type: application/json`
  - JSON body with:
    - `client_id`
    - `client_secret`
    - `grant_type` - must be `client_credentials`
- Confirmed token response fields:
  - `status`
  - `token.access_token`
  - `token.token_type`
  - `token.expires_in`
- Confirmed auth usage for protected endpoints from the reviewed examples:
  - `Authorization: Bearer TOKEN`
- Important doc nuance:
  - the category index row previously said `Auth: No`, but the reviewed official docs clearly split the API into anonymous public utilities and bearer-protected account endpoints.

## Common request/response conventions
- Base URL: `https://networkcalc.com`
- Reviewed docs consistently use JSON request/response bodies for protected create/update routes.
- Public utility routes are mostly path-parameter-driven and return JSON objects with a top-level `status` field.
- Reviewed response samples commonly include nested objects such as `records`, `token`, `alerts`, `domain`, and `subdomains` depending on the endpoint family.

## Manually confirmed endpoint set

### Authorization

#### 1) Get an access token
- Method: `POST`
- Path: `/api/auth/token`
- Full URL: `https://networkcalc.com/api/auth/token`
- Headers:
  - `Content-Type: application/json`
- JSON body fields:
  - `client_id` - required
  - `client_secret` - required
  - `grant_type` - required; must be `client_credentials`
- Confirmed success response fields:
  - `status`
  - `token.access_token`
  - `token.token_type`
  - `token.expires_in`
- Confirmed documented errors:
  - `401 MISSING_CREDENTIALS`
  - `401 CREDENTIALS_NOT_FOUND`
  - `401 INVALID_CREDENTIALS`
  - `401 REVOKED_CREDENTIALS`
  - `401 INVALID_GRANT_TYPE`
  - `401 INVALID_GRANT`

### Binary converter

#### 2) Convert a number between bases
- Method: `GET`
- Path: `/api/binary/{number}`
- Full URL pattern: `https://networkcalc.com/api/binary/{number}`
- Path parameter:
  - `{number}` - required; the number to convert
- Confirmed query parameters:
  - `from` - optional radix; values shown: `2`, `8`, `10`, `16`
  - `to` - optional radix; values shown: `2`, `8`, `10`, `16`
- Confirmed response fields:
  - `status`
  - `original`
  - `converted`
  - `from`
  - `to`
- Confirmed documented errors:
  - `400 NO_NUMBER_SPECIFIED`
  - `400 INVALID_NUMBER_FORMAT`
  - `400 INVALID_FROM_BASE`
  - `400 INVALID_TO_BASE`

### DNS tools

#### 3) Look up DNS records
- Method: `GET`
- Path: `/api/dns/lookup/{hostname}`
- Purpose: look up public DNS records for a hostname, domain, or IP.
- Path parameter:
  - `{hostname}` - required
- Confirmed response notes:
  - sample response includes `hostname` and nested `records` buckets like `A`, `CNAME`, `MX`, `NS`, `SOA`, and `TXT`
- Confirmed documented errors:
  - `400 NO_HOST_SPECIFIED`
  - `400 INVALID_HOST`
  - `400 NO_RECORDS`
  - `400 INVALID_STRING`
  - `400 FAILED_TO_VALIDATE`

#### 4) Save a DNS lookup query to the account
- Method: `POST`
- Path: `/api/dns/lookup/save/{hostname}`
- Authentication: Bearer token required
- Path parameter:
  - `{hostname}` - required
- Response format on the reviewed page: `DNSQueryResponse`

#### 5) Look up WHOIS data
- Method: `GET`
- Path: `/api/dns/whois/{hostname}`
- Purpose: retrieve WHOIS information for the supplied hostname or domain.
- Path parameter:
  - `{hostname}` - required

#### 6) Save a WHOIS query to the account
- Method: `POST`
- Path: `/api/dns/whois/save/{hostname}`
- Authentication: Bearer token required
- Path parameter:
  - `{hostname}` - required

#### 7) Look up or validate SPF data
- Method: `POST`
- Path: `/api/dns/spf/{hostname}`
- Purpose: either look up a published SPF record or validate a supplied SPF string.
- Path parameter:
  - `{hostname}` - used for published-record lookup; ignored when body data is supplied according to the official docs
- Confirmed request body field:
  - `spf` - optional SPF record string to validate; if specified, `{hostname}` is ignored
- Response format on the reviewed page: `SPFResponse`
- Confirmed documented error called out on the page:
  - `400 NO_SPF_RECORD`

#### 8) Save an SPF query to the account
- Method: `POST`
- Path: `/api/dns/spf/save/{hostname}`
- Authentication: Bearer token required
- Path parameter:
  - `{hostname}` - required unless body-provided text is used
- Confirmed request body field:
  - `text` - optional SPF record in textual representation; if included, `{hostname}` is ignored
- Response format on the reviewed page: `DNSQueryResponse`

#### 9) Get saved DNS queries
- Method: `GET`
- Path: `/api/dns/saved/{id}`
- Authentication: Bearer token required
- Path parameter:
  - `{id}` - optional saved-query identifier according to the official docs
- Official examples visible on the reviewed page:
  - `GET https://networkcalc.com/api/dns/saved`
  - `GET https://networkcalc.com/api/dns/saved/123`
- Response format on the reviewed page: `DNSSavedQueryResponse`

#### 10) Delete a saved DNS query
- Method: `DELETE`
- Path: `/api/dns/saved/{id}`
- Authentication: Bearer token required
- Path parameter:
  - `{id}` - optional saved-query identifier according to the reviewed page text
- Important official inconsistency:
  - the reviewed docs text shows the example `https://networkcalc.com/api/dns/dns/saved/123`, which appears to contain an extra `/dns/`
  - route examples elsewhere on the same page use `/api/dns/saved/...`; this file treats `/api/dns/saved/{id}` as primary and records the visible docs typo explicitly

### Alerts

#### 11) List alerts or fetch one alert
- Method: `GET`
- Path: `/api/alerts/{alert_id}`
- Authentication: Bearer token required
- Path parameter:
  - `{alert_id}` - optional unique alert ID according to the official page
- Confirmed response notes:
  - sample response contains an `alerts` array of alert objects with fields such as `id`, `name`, `is_active`, `current_status`, `type`, `subtype`, `filter`, `filter_value`, `action`, and target domain/subdomain metadata

#### 12) Create an alert
- Method: `POST`
- Path: `/api/alerts/`
- Authentication: Bearer token required
- Headers:
  - `Content-Type: application/json`
- Confirmed JSON body fields:
  - `type` - one of `DNS Record`, `SPF Record`, or `Certificate (TLS)`
  - `subtype` - alert subtype; see type table on the docs page
  - `filter` - comparison/filter operator
  - `filter_value` - value that triggers the alert
  - `target_type` - `domain` or `subdomain`
  - `target_id` - numeric identifier for the chosen target
  - `name` - display name for the alert
- Confirmed type/filter matrix from the reviewed page:
  - `DNSRecord` supports subtypes `A`, `CNAME`, `MX`, `TXT`
  - `SPFRecord` supports filters including `validity`
  - `Certificate (TLS)` supports filters including `subject` and `expires in (days)`

#### 13) Delete an alert
- Method: `DELETE`
- Path: `/api/alerts/`
- Authentication: Bearer token required
- Important docs note:
  - the reviewed page clearly describes `Delete an alert` with an optional `{alert_id}` parameter, but the rendered route heading in this browser session showed `DELETE https://networkcalc.com/api/alerts/` without the placeholder
  - this file records the route exactly as rendered and notes that the surrounding prose strongly implies alert-scoped deletion

### Domains

#### 14) Add a domain
- Method: `POST`
- Path: `/api/domains/`
- Authentication: Bearer token required
- Headers:
  - `Content-Type: application/json`
- Confirmed body field:
  - `domain` - required domain name, for example `networkcalc.com`
- Confirmed response notes:
  - sample response returns `status` and a nested `domain` object with `id`, `domain`, `created_at`, and `updated_at`

#### 15) Add a subdomain
- Method: `POST`
- Path: `/api/domains/{domain_id}/subdomains/{subdomain_prefix}`
- Authentication: Bearer token required
- Path parameters:
  - `{domain_id}` - optional unique domain ID according to the official page text
  - `{subdomain_prefix}` - required subdomain prefix; the docs example says `my.demo` would represent `my.demo.networkcalc.com`

#### 16) List domains or fetch one domain
- Method: `GET`
- Path: `/api/domains/{domain_id}`
- Authentication: Bearer token required
- Path parameter:
  - `{domain_id}` - optional unique domain ID according to the official page
- Purpose: list one or more saved domains

#### 17) List subdomains or fetch one subdomain
- Method: `GET`
- Path: `/api/domains/{domain_id}/subdomains/{subdomain_id}`
- Authentication: Bearer token required
- Path parameters:
  - `{domain_id}` - optional domain ID
  - `{subdomain_id}` - optional subdomain ID
- Purpose: list one or more subdomains for a domain

#### 18) Delete a domain
- Method: `DELETE`
- Path: `/api/domains/{domain_id}`
- Authentication: Bearer token required
- Path parameter:
  - `{domain_id}` - optional unique domain ID according to the official page

#### 19) Delete a subdomain
- Method: `DELETE`
- Path: `/api/domains/{domain_id}/subdomains/{subdomain_id}`
- Authentication: Bearer token required
- Path parameters:
  - `{domain_id}` - optional domain ID
  - `{subdomain_id}` - optional subdomain ID

## Pagination
- No global pagination guide or pagination-specific query parameters were surfaced on the reviewed official pages for the endpoint families inspected in this pass.
- The reviewed routes are primarily lookup, save, and account-resource operations using optional path identifiers rather than page-number query parameters.

## Rate limits
- The reviewed official pages in this pass did not publish a numeric rate-limit table.
- This file therefore does not invent quotas or retry windows.

## Error handling
- The official docs publish per-route error code tables instead of one single global error schema.
- Confirmed error codes across the reviewed pages include:
  - `400 NO_NUMBER_SPECIFIED`
  - `400 INVALID_NUMBER_FORMAT`
  - `400 NO_HOST_SPECIFIED`
  - `400 INVALID_HOST`
  - `400 NO_RECORDS`
  - `400 INVALID_STRING`
  - `400 FAILED_TO_VALIDATE`
  - `400 NO_SPF_RECORD`
  - `400 MISSING_HEADER`
  - `400 MISSING_VALUES`
  - `400 INVALID_BODY`
  - `400 NOT_CREATED`
  - `400 NOT_UPDATED`
  - `400 NOT_DELETED`
  - `400 NOT_FOUND`
  - `401 MISSING_CREDENTIALS`
  - `401 CREDENTIALS_NOT_FOUND`
  - `401 INVALID_CREDENTIALS`
  - `401 REVOKED_CREDENTIALS`
  - `401 INVALID_GRANT_TYPE`
  - `401 INVALID_GRANT`
  - `401 NOT_AUTHORIZED`

## Response format notes
- Responses are JSON on the reviewed pages.
- Common top-level pattern: `status` plus a route-specific payload object or array.
- Confirmed reviewed response model names include:
  - `AuthTokenResponse`
  - `ConverterResponse`
  - `DNSResponse`
  - `DNSQueryResponse`
  - `SPFResponse`
  - `DNSSavedQueryResponse`
  - `DNSSavedQueryDeleteResponse`
  - `AlertResponse`
  - `AlertDeleteResponse`
  - `DomainCreateResponse`
  - `DomainListResponse`
  - `SubdomainListResponse`

## Important usage notes
- NetworkCalc mixes anonymous public utility APIs with paid/account APIs under one host.
- The official docs present many collection-style resources using optional path identifiers instead of separate `/list` and `/get` paths.
- The alert and DNS docs each showed at least one rendering inconsistency or typo in this browser session; those discrepancies are documented here rather than silently normalized away.

## Verification notes
This file was manually rebuilt from the current official NetworkCalc documentation pages reachable in this browser session, replacing the earlier generated placeholder file.