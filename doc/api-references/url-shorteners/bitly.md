# Bitly

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `bitly`
- Docs used manually:
  - `https://dev.bitly.com/`
  - `https://dev.bitly.com/docs/getting-started/authentication/`
  - `https://dev.bitly.com/docs/getting-started/rate-limits/`
  - `https://dev.bitly.com/api-reference`
- Confirmed REST API base URL: `https://api-ssl.bitly.com`
- Primary media type: JSON for v4 API routes; token exchange can return URL-encoded or JSON depending on `Accept`
- Authentication model surfaced in docs: bearer access tokens for v4 routes; OAuth-related token exchange at `/oauth/access_token`
- Manually confirmed routes in this pass: `6`

## Authentication
From the official Bitly docs:
- standard API requests use `Authorization: Bearer {token}`
- a generic access token is sufficient for many server-to-server or account-owned use cases
- OAuth 2.0 is required when acting on behalf of end users
- the legacy OAuth token endpoint is `POST /oauth/access_token` on `api-ssl.bitly.com`
- the OAuth web-flow example posts:
  - `client_id`
  - `client_secret`
  - `code`
  - `redirect_uri`
- the auth guide also documents a resource-owner-password style token exchange using:
  - `grant_type=password`
  - `username`
  - `password`
  - HTTP Basic auth built from `client_id:client_secret`
- Bitly explicitly warns not to call `/oauth/access_token` frequently; repeated unnecessary calls can trigger rate limiting

## Common request/response conventions
- Base URL for reviewed v4 API routes: `https://api-ssl.bitly.com/v4`
- Reviewed management routes use JSON request bodies.
- Authenticated v4 requests use bearer tokens.
- Successful link-management responses return Bitlink objects with fields such as `link`, `id`, `long_url`, `created_at`, `custom_bitlinks`, `tags`, and optional `deeplinks`.
- Bitly distinguishes between site-facing `short links` and API-facing `Bitlinks`; custom domains are referred to as `BSDs` (Branded Short Domains).

## Manually confirmed endpoint set

### 1) Shorten a long URL
- Method: `POST`
- Path: `/v4/shorten`
- Full URL: `https://api-ssl.bitly.com/v4/shorten`
- Purpose: create a basic Bitlink from a long URL.
- Request body fields confirmed on the official page:
  - `long_url` - required
  - `domain` - optional, defaults to `bit.ly`
  - `group_guid`
  - `force_new_link`
- Response notes confirmed on the official page:
  - returns a Bitlink-style JSON object including `references`, `link`, `id`, `long_url`, `archived`, `created_at`, `custom_bitlinks`, `tags`, and `deeplinks`
  - documented statuses include `200`, `201`, `400`, `403`, `417`, `422`, `429`, `500`, and `503`
- Important route notes from the official page:
  - `BRANDED_LINK_MONTHLY_LIMIT_EXCEEDED` can occur when monthly branded-link limits are exceeded
  - `DNS_CONFIGURATION_ERROR` can occur when using a custom domain with incorrect DNS setup

### 2) Create or customize a Bitlink
- Method: `POST`
- Path: `/v4/bitlinks`
- Full URL: `https://api-ssl.bitly.com/v4/bitlinks`
- Purpose: create a Bitlink with more control, including custom keywords and expiration.
- Request body fields confirmed on the official page:
  - `long_url` - required when creating a new Bitlink; cannot be combined with `bitlink_id`
  - `domain` - defaults to `bit.ly`
  - `group_guid` - docs recommend always specifying a group and domain
  - `title`
  - `tags`
  - `deeplinks`
  - `app_id`
  - `app_uri_path`
  - `install_url`
  - `install_type` - enum `no_install`, `auto_install`, `promote_install`
  - `force_new_link`
  - `keyword` - create a keyword override at `domain/keyword`
  - `bitlink_id` - add a keyword to an existing Bitlink; cannot be combined with `long_url`
  - `expiration_at` - min 5 minutes from now, max 1 year
- Response notes confirmed on the official page:
  - returns a Bitlink object
  - route shares the same monthly-limit / DNS-configuration warnings as `/v4/shorten`

### 3) Retrieve a Bitlink
- Method: `GET`
- Path: `/v4/bitlinks/{bitlink}`
- Full URL pattern: `https://api-ssl.bitly.com/v4/bitlinks/{bitlink}`
- Purpose: fetch a Bitlink's current metadata.
- Path parameters confirmed on the official page:
  - `bitlink` - Bitlink identifier in `domain/hash` form
- Response notes confirmed on the official page:
  - returns information for the specified link

### 4) Update / redirect a Bitlink
- Method: `PATCH`
- Path: `/v4/bitlinks/{bitlink}`
- Full URL pattern: `https://api-ssl.bitly.com/v4/bitlinks/{bitlink}`
- Purpose: update metadata or change the Bitlink's destination URL.
- Path parameters confirmed on the official page:
  - `bitlink` - Bitlink identifier in `domain/hash` form
- Request body fields confirmed on the official page:
  - `title`
  - `archived`
  - `tags`
  - `deeplinks`
  - deeplink fields including `guid`, `bitlink`, `app_uri_path`, `install_url`, `app_guid`, `os`, `install_type`, `created`, `modified`, `brand_guid`
  - `long_url` - update the redirect destination; docs note this always charges an encode limit
  - `expiration_at`
  - `dynamic_routing` - replacement array of routing rules
  - dynamic-routing match fields including `country_match`, `country_exclude`, `region_match`, `region_exclude`, `device_match`, `device_exclude`, `os_match`, `os_exclude`, plus per-rule `long_url`
- Important route notes from the official page:
  - Bitly specifically says to use `long_url` on this route to redirect an existing Bitlink

### 5) Expand a Bitlink
- Method: `POST`
- Path: `/v4/expand`
- Full URL: `https://api-ssl.bitly.com/v4/expand`
- Purpose: resolve a Bitlink back to its long URL.
- Request body fields confirmed on the official page:
  - `bitlink_id`
- Response notes confirmed on the official page:
  - returns the short link and long URL for the specified link

### 6) Inspect platform limits
- Method: `GET`
- Path: `/v4/user/platform_limits`
- Full URL: `https://api-ssl.bitly.com/v4/user/platform_limits`
- Purpose: retrieve current per-endpoint platform limits and usage counters.
- Query parameters confirmed on the official page:
  - `path` - the specific API path to inspect
- Response notes confirmed on the official page:
  - described as fetching all platform limits and counts available for an organization

## OAuth/token route notes
The authentication guide separately documents this legacy auth endpoint:
- Method: `POST`
- Path: `/oauth/access_token`
- Full URL: `https://api-ssl.bitly.com/oauth/access_token`
- Purpose: exchange OAuth credentials / codes for an access token.
- Request formats confirmed on the official docs:
  - OAuth web flow with `client_id`, `client_secret`, `code`, `redirect_uri`
  - password grant with `grant_type=password`, `username`, `password`, and Basic auth credentials
- Response notes confirmed on the official docs:
  - default response is URL-encoded `access_token=%s&login=%s`
  - if the `Accept` header is `application/json`, Bitly returns JSON instead

## Pagination
- The reviewed Bitly pages do not expose a single global pagination section for every route, but the platform-limits and analytics surfaces are route-specific.
- For this pass, I only documented pagination where the official reviewed page explicitly discussed limits/usage rather than assuming list-parameter names for every endpoint.

## Rate limits
From the official Bitly rate-limits page:
- Bitly enforces both `plan limits` and `platform limits`
- platform limits apply to all accounts regardless of plan
- Bitly enforces per-hour, per-minute, and per-IP limits for each endpoint
- single-IP concurrency limit: maximum `5` concurrent connections from one IP address
- per-minute limits are one-tenth of the hourly limit for an endpoint
- official examples point to:
  - `GET /v4/user/platform_limits`
  - `GET /v4/organizations/{organization_guid}/plan_limits`
- monthly plan limits reset on the first of the month
- exceeding a per-minute or per-hour platform limit returns `RATE_LIMIT_EXCEEDED` with HTTP `429`
- exceeding the monthly API-request plan limit returns `API_USAGE_LIMIT_EXCEEDED` with HTTP `429`

## Error and response notes
- The shortening docs explicitly call out `BRANDED_LINK_MONTHLY_LIMIT_EXCEEDED` and `DNS_CONFIGURATION_ERROR` as notable route-specific failures.
- `429` is the documented status for both platform-limit and plan-limit exhaustion.
- The auth docs note that unnecessary repeated token requests can themselves cause rate limiting.
- v4 link-management responses are JSON objects; the legacy OAuth token route can return either URL-encoded or JSON output depending on `Accept`.

## Important usage notes
- Bitly recommends always including a specific `group_guid` and `domain` when creating links.
- Custom keyword creation and keyword overrides are handled through `POST /v4/bitlinks`, not only through the basic shorten endpoint.
- Updating a Bitlink's `long_url` through `PATCH /v4/bitlinks/{bitlink}` is treated as a redirect update and consumes encode quota.
- The public docs still expose the OAuth token exchange at the legacy non-`/v4` path, while normal API operations use `/v4`.

## Verification notes
This file was manually rebuilt from Bitly's official introduction, authentication, rate-limit, and API-reference pages using browser inspection.