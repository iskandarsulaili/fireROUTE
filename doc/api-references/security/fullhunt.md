# FullHunt

## Provider metadata
- Category: `Security`
- Provider slug: `fullhunt`
- Docs used manually:
  - `https://docs.fullhunt.io/docs/#introduction`
  - `https://docs.fullhunt.io/docs/authentication`
  - `https://docs.fullhunt.io/docs/api/domain-apis`
  - `https://docs.fullhunt.io/docs/api/host-apis`
  - `https://docs.fullhunt.io/docs/rate-limiting`
  - `https://docs.fullhunt.io/docs/api/organizations-db-search`
- Confirmed base URLs:
  - `https://fullhunt.io/api/v1/`
  - `https://enterprise-api.fullhunt.io/api/v1/`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: `X-API-KEY` header on every request
- Manually confirmed routes in this pass: `5`

## Authentication
- FullHunt's official docs say every request must include an API key in the `X-API-KEY` header.
- The docs direct users to FullHunt profile settings to obtain the key.
- The authentication test route is documented as the way to verify that the key is valid.
- Confirmed auth-related error statuses from the authentication guide:
  - `401` invalid or missing API key
  - `403` key lacks required permissions
  - `429` rate limit exceeded

## Common request/response conventions
- Standard host: `https://fullhunt.io/api/v1/`
- Enterprise host: `https://enterprise-api.fullhunt.io/api/v1/`
- The introduction page states both hosts serve identical endpoints, with the enterprise host intended for dedicated infrastructure and higher limits.
- The official docs describe a common JSON envelope containing:
  - `status`
  - `message`
  - `metadata`
- Example `metadata` fields confirmed from the docs include:
  - `domain`
  - `all_results_count`
  - `available_results_for_user`
  - `max_results_for_user`
  - `timestamp`
  - `user_plan`
- Authentication status responses additionally include `user` and `user_credits` objects.

## Manually confirmed endpoint set

### 1) Verify API key status
- Method: `GET`
- Path: `/api/v1/auth/status`
- Full URL: `https://fullhunt.io/api/v1/auth/status`
- Purpose: validate credentials and return current user plus credit information
- Required header:
  - `X-API-KEY`
- Confirmed response fields from the auth guide:
  - `status`
  - `message`
  - `user.company`
  - `user.email`
  - `user.first_name`
  - `user.last_name`
  - `user.plan`
  - `user_credits.credits_usage`
  - `user_credits.max_results_per_request`
  - `user_credits.remaining_credits`
  - `user_credits.total_credits_per_month`

### 2) Get domain details
- Method: `GET`
- Path: `/api/v1/domain/{domain}/details`
- Full URL: `https://fullhunt.io/api/v1/domain/{domain}/details`
- Purpose: retrieve domain-wide attack-surface details including hosts, DNS data, open ports, service fingerprints, and cloud metadata
- Path parameters:
  - `domain` - domain to query, for example `kaspersky.com`
- Required header:
  - `X-API-KEY`
- Confirmed response fields include:
  - top-level `domain`, `hosts`, `status`, `message`, `metadata`
  - host-level fields such as `host`, `ip_address`, `http_status_code`, `dns`, `cert_object`, `cloud`, `ip_metadata`, `network_ports`, `network_services`, `products`, `tags`, `web`
  - metadata fields such as `all_results_count`, `available_results_for_user`, `last_scanned`, `max_results_for_user`, `timestamp`, `user_plan`

### 3) Get subdomains for a domain
- Method: `GET`
- Path: `/api/v1/domain/{domain}/subdomains`
- Full URL: `https://fullhunt.io/api/v1/domain/{domain}/subdomains`
- Purpose: list subdomains associated with the target domain
- Path parameters:
  - `domain` - domain to query
- Required header:
  - `X-API-KEY`
- Important note:
  - the route is documented on the official Domain APIs page as a separate request family from the full domain-details route

### 4) Get host details
- Method: `GET`
- Path: `/api/v1/host/{host}`
- Full URL: `https://fullhunt.io/api/v1/host/{host}`
- Purpose: retrieve detailed information for a single hostname
- Path parameters:
  - `host` - hostname to query, for example `fthub.kaspersky.com`
- Required header:
  - `X-API-KEY`
- Confirmed response fields include:
  - `host`
  - `domain`
  - `ip_address`
  - `http_status_code`
  - `http_title`
  - `dns`
  - `cert_object.sha256_fingerprint`
  - `cloud.provider`
  - `cloud.region`
  - `ip_metadata.country_code`
  - `network_ports`
  - `network_services`
  - `products`

### 5) Search the organizations database
- Method: `GET`
- Path: `/api/v1/organizations-db/search`
- Full URL: `https://fullhunt.io/api/v1/organizations-db/search`
- Purpose: search FullHunt's organizations database by company name or domain
- Required header:
  - `X-API-KEY`
- Additional access requirement explicitly documented:
  - enterprise account required
- Confirmed query parameters:
  - `query` - required search string; docs say it must be `3-100` characters long
- Confirmed response fields include:
  - top-level `response` array
  - per-result `domain`
  - `company_name`
  - `other_names`
  - `country_code`
  - `headquarters_location`
  - `market`
  - `description`
  - `year_founded`
  - `estimated_employee_count`
  - `subsidiaries`
  - `stock_info`
  - `other_domains`
  - `id`

## Pagination
- FullHunt uses metadata-driven result-limit reporting rather than the conventional page/per_page pattern on the routes reviewed in this pass.
- Confirmed metadata fields include:
  - `all_results_count`
  - `available_results_for_user`
  - `max_results_for_user`
- The auth docs also expose account-level limit information through `user_credits.max_results_per_request`.

## Rate limits
From the official `Rate Limiting` page:
- most endpoints: `60 requests per minute`
- limits apply per API key
- windows reset every minute
- documented category table shows `60 requests/minute` for:
  - Domain APIs
  - Global Search APIs
  - Data Intelligence APIs
  - Enterprise APIs
  - Nexus APIs
- OEM APIs are listed as `Custom limits`

Confirmed rate-limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset` - Unix timestamp

Confirmed rate-limit-exceeded error behavior:
- HTTP `429 Too Many Requests`
- JSON example includes:
  - `error`
  - `message`
  - `retry_after`

## Error handling
- Shared response style uses `status` and `message` in normal API envelopes.
- The auth guide confirms `401`, `403`, and `429` for authentication/rate-limit problems.
- The rate-limit guide confirms a structured `429` response with retry guidance.
- The docs emphasize that plan tier and monthly credits also influence effective usage.

## Response format notes
- JSON is used across the reviewed endpoints.
- Attack-surface endpoints return nested objects for DNS, certificates, cloud metadata, and network services.
- Organization search returns a top-level `response` array rather than the `metadata`-heavy attack-surface shape.

## Important usage notes
- Enterprise customers should switch to `https://enterprise-api.fullhunt.io/api/v1/` for better performance and higher limits.
- The organizations database search route explicitly requires an enterprise account.
- Credit consumption matters in addition to per-minute rate limits; auth status responses expose remaining monthly credits.
- Domain- and host-level responses can be large and include enrichment that reflects FullHunt's current scan state rather than purely static DNS information.

## Verification notes
This file was manually rebuilt from FullHunt's current official docs pages for introduction, authentication, rate limiting, domain APIs, host APIs, and organization search, replacing the earlier shallow placeholder.