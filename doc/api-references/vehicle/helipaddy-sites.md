# Helipaddy sites

## Provider metadata
- Category: `Vehicle`
- Provider slug: `helipaddy-sites`
- Official docs used manually:
  - `https://helipaddy.com/api/`
  - `https://helipaddy.com/api/partner-guide/`
- Confirmed API base URL: `https://helipaddy.com/wp-json/hp-partner/v1`
- Authentication: partner token passed as `api_key` query parameter
- Primary response format: JSON
- Manually confirmed routes in this pass: `5`

## Authentication and onboarding
From the reviewed official pages:
- each partner receives a unique token from Helipaddy
- the token is supplied as the `api_key` query parameter on every request
- the token can be suspended or rotated by Helipaddy on request
- the same token model applies to sandbox and production datasets
- partners begin on a sandbox dataset and Helipaddy flips the backend data source at go-live, with no code changes required

## Confirmed API surface
The reviewed partner guide explicitly documents these resources:
- `GET /sites`
- `GET /sites/by-tag`
- `GET /sites/{id}`
- `GET /sites/nearest`
- `GET /usage`

## 1) Search nearby sites
- Method: `GET`
- Path: `/sites`
- Purpose: return nearby landing sites ordered by distance from supplied coordinates

Documented query parameters:
- `lat` - required decimal latitude, valid range `-90` to `90`
- `lng` - required decimal longitude, valid range `-180` to `180`
- `radius` - optional search radius in kilometres; defaults to `25`; default cap `75 km` unless adjusted per partner
- `category_id` - optional internal category filter
- `tag` - optional canonical internal tag such as `~great-walks`
- `demo` - optional boolean forcing sandbox data even for live accounts
- `api_key` - required partner token

Documented response notes:
- returns an array of site records
- example fields include `id`, `category`, `name`, `region`, `country`, `icao`, `hisc`, `latitude`, `longitude`, and `helipaddy_link`
- returned latitude/longitude are intentionally obscured and should be treated as approximate only

## 2) List sites by canonical tag
- Method: `GET`
- Path: `/sites/by-tag`
- Purpose: return a global paginated feed for one canonical tag without coordinates

Documented query parameters:
- `tag` - required canonical internal tag
- `page` - optional 1-based page number, default `1`
- `per_page` - optional page size, default `200`, cap `500`
- `demo` - optional boolean forcing sandbox data
- `api_key` - required

Documented response notes:
- example response includes `tag`, `page`, `per_page`, `total`, `total_pages`, and `sites`
- `/sites/by-tag` is intentionally map-minimal and does not return `name`, `region`, or `country`

## 3) Get nearest single site
- Method: `GET`
- Path: `/sites/nearest`
- Purpose: return at most one nearest landing site within the requested radius

Documented behavior:
- request parameters are identical to `/sites`
- example response includes `distance_nm` in nautical miles
- if no site falls within the requested radius, the response body is `null`

## 4) Get a site by Helipaddy id
- Method: `GET`
- Path: `/sites/{id}`
- Purpose: fetch the canonical record for one known Helipaddy site ID

Documented access notes:
- this endpoint is disabled by default
- Helipaddy must explicitly enable it for the partner account

Documented request details:
- path parameter `id` - required Helipaddy site id
- query parameter `api_key` - required

Documented response notes:
- response body matches the single-site shape from `/sites`
- if the id is not found or outside the partner allow-list, the response body is `null`
- if the feature is not enabled, the API returns `hp_partner_api_feature_disabled` with HTTP `403`

## 5) Inspect usage counters
- Method: `GET`
- Path: `/usage`
- Purpose: return current rate-limit consumption without consuming additional quota

Documented request details:
- required query parameter `api_key`
- optional query parameter `expand=telemetry` for lightweight recent telemetry details

Documented response fields:
- top-level `timestamp`
- `partner` object including `id`, `slug`, `name`, `environment`, `is_sandbox`
- `client.ip`
- `windows.minute`, `windows.hour`, `windows.day`
  - each includes `limit`, `used`, `remaining`, `window_seconds`, `resets_in_seconds`, `resets_at`
- docs note a `rows` value is also included per window

Important usage note:
- the partner guide shows a fully-qualified example on `https://partners.helipaddy.com/wp-json/hp-partner/v1/usage?...`
- the same guide's resource table documents the logical route as `GET /usage`; use the partner-provided base URL from onboarding if Helipaddy instructs otherwise

## Rate limits, caching, and dataset rules
The reviewed official pages publish concrete standard limits:
- per minute: `30` requests by default
- per hour: `200` requests by default
- per day: `1,000` requests per 24 hours by default
- plan pages on the API landing page additionally show higher standard allocations for Growth and Scale tiers
- exceeding a limit returns HTTP `429 Too Many Requests`

Other documented operational rules:
- default query clamp is `75 km` radius and the first `100` matching pads unless partner-specific tuning is agreed
- responses are cached by Helipaddy for `60` seconds by default
- clients should cache results for at least the shortest rate-limit window, typically one minute
- `demo=true` forces sandbox data after go-live
- use the usage endpoint to confirm which environment served the request

## Errors and troubleshooting
The reviewed partner guide explicitly documents these error codes:
- `rest_missing_callback_param` - `400` - required parameters missing
- `hp_partner_api_missing_key` - `401` - missing `api_key`
- `hp_partner_api_invalid_key` - `401` - unrecognised token
- `hp_partner_api_inactive_partner` - `403` - account not approved or disabled
- `hp_partner_api_rate_limited` - `429` - one of the rate windows exceeded
- `hp_partner_api_invalid_coordinates` - `400` - invalid latitude/longitude range
- `hp_partner_api_ambiguous_coordinates` - `400` - ambiguous coordinates such as `0,0`
- `hp_partner_api_category_not_permitted` - `403` - category outside the account allow-list
- `hp_partner_api_feature_disabled` - `403` - endpoint not enabled for the partner
- `hp_partner_api_query_failed` - `500` - backend database error
- `hp_partner_api_prepare_failed` - `500` - SQL preparation failure

## Pagination and dataset notes
- `/sites/by-tag` is the only reviewed route with explicit page-style pagination.
- `/sites` returns a distance-ordered array rather than a paginated envelope in the reviewed docs.
- Category access is allow-list based; the guide says most new partners begin with Hotel (`4`) and Aerodrome (`7`) access unless onboarding says otherwise.

## fireROUTE notes
- Helipaddy is approval-driven: token issuance, live enablement, category scope, and `/sites/{id}` access all depend on partner approval.
- Treat coordinates as approximate only; the docs explicitly direct consumers to `helipaddy_link` for verified site details and permission workflows.
- Cache aggressively to respect both provider-side caching and low default quota ceilings.

## Verification notes
This file was manually rebuilt from the live official Helipaddy API landing page and partner guide using browser inspection.