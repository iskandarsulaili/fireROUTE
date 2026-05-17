# isitdownstatus

## Provider metadata
- Category: `Development`
- Provider slug: `isitdownstatus`
- Docs used manually:
  - `https://isitdownstatus.com/en/api-docs`
  - live endpoint checks performed from the official docs origin:
    - `GET https://isitdownstatus.com/api/v1/status/discord`
    - `GET https://isitdownstatus.com/api/v1/services?limit=1`
    - `GET https://isitdownstatus.com/api/v1/outages?limit=1`
- Confirmed API base URL: `https://isitdownstatus.com/api/v1`
- Primary response/content type confirmed in this pass: JSON
- Authentication model confirmed in this pass: none
- CORS note from the official docs: enabled
- Manually confirmed routes in this pass: `3`

## Authentication
- The official Developer API page explicitly says: `No API key required.`
- The same page also says the API is public and CORS-enabled.
- The live same-origin endpoint checks in this session returned JSON without credentials.

## Common request/response conventions
- Base URL: `https://isitdownstatus.com/api/v1`
- All reviewed routes are `GET` endpoints.
- Successful responses use JSON envelopes with a top-level `ok` boolean.
- Collection-style routes return `meta` plus `data`.
- The official docs describe the service as a `Public JSON API for real-time service status`.
- The docs also explain that each `status` value is a combined signal derived from both user reports and the provider's official status page when available.
- The raw official-page signal is exposed separately as `official_indicator`.

### Status semantics confirmed from the official docs
- `operational` - report volume is within the normal range and no official incident is active
- `degraded` - elevated reports or a minor official incident
- `down` - significantly elevated reports or a major/critical official incident

## Manually confirmed endpoint set

### 1) Get current status for one service
- Method: `GET`
- Path: `/status/{slug}`
- Full URL pattern: `https://isitdownstatus.com/api/v1/status/{slug}`
- Example from the official docs: `https://isitdownstatus.com/api/v1/status/discord`
- Purpose: return the current combined status for a single monitored service.
- Path parameters:
  - `slug` - required service identifier such as `discord` or `netflix`
- Confirmed request body: none
- Confirmed success response shape from the official docs and live endpoint check:
  - top-level keys: `ok`, `data`
  - `data` fields confirmed in this pass:
    - `slug`
    - `name`
    - `category`
    - `logo_url`
    - `status`
    - `official_indicator`
    - `report_count_1h`
    - `report_count_24h`
    - `status_page_url`
    - `updated_at`
- Important field notes from the official docs:
  - `official_indicator` is `none | minor | major | critical`, or `null` if unavailable
  - `updated_at` is an ISO 8601 timestamp

### 2) List monitored services
- Method: `GET`
- Path: `/services`
- Full URL: `https://isitdownstatus.com/api/v1/services`
- Purpose: return monitored services with their current combined status.
- Query parameters confirmed from the official docs:
  - `category` - filters to `telecom`, `cloud`, `gaming`, `social`, `finance`, `streaming`, `other`, `email`, or `internet`; default `all`
  - `status` - filters to `operational`, `degraded`, or `down`; default `all`
  - `limit` - integer range `1–500`; default `100`
- Confirmed request body: none
- Confirmed success response shape from the official docs and live endpoint check:
  - top-level keys: `ok`, `meta`, `data`
  - `meta` keys confirmed: `total`, `filters`, `updated_at`
  - each service object keys confirmed in this pass:
    - `slug`
    - `name`
    - `category`
    - `logo_url`
    - `status`
    - `official_indicator`
    - `report_count_1h`
    - `report_count_24h`
    - `status_page_url`

### 3) List recent outages
- Method: `GET`
- Path: `/outages`
- Full URL: `https://isitdownstatus.com/api/v1/outages`
- Purpose: return outages detected in the last 7 days.
- Query parameters confirmed from the official docs:
  - `status` - `ongoing` or `resolved`; default `all`
  - `slug` - limit results to one service slug; default `all services`
  - `limit` - integer range `1–100`; default `20`
- Confirmed request body: none
- Confirmed success response shape from the official docs and live endpoint check:
  - top-level keys: `ok`, `meta`, `data`
  - outage object keys confirmed:
    - `id`
    - `service`
    - `started_at`
    - `resolved_at`
    - `duration_minutes`
    - `status`
    - `peak_reports`
    - `description`
    - `source`
  - nested `service` object keys confirmed:
    - `slug`
    - `name`
    - `category`
    - `logo_url`
    - `status_page_url`
- Field notes from the official docs:
  - `resolved_at` can be `null` for active incidents
  - `duration_minutes` can be `null` until the outage is resolved
  - `source` is `user_reports` or `official_status_page`

## Pagination
- The reviewed official docs do not describe cursor or page-number pagination.
- Instead, the two collection routes expose a simple `limit` query parameter.
- The collection responses do include `meta.total` and `meta.filters`.

## Rate limits and caching
- The official docs say responses are cached for `30 seconds` at the CDN level.
- The same section says there is `no hard rate limit for read endpoints`.
- The published usage guidance asks clients to avoid polling more than once per 30 seconds and to implement their own caching layer for higher-frequency usage.

## Error handling
- The official docs do not publish a full error-code table.
- The JavaScript sample on the docs page explicitly throws `Service not found` when the parsed payload has `ok: false`.
- The reviewed official docs are therefore more explicit about the JSON envelope contract than about exact HTTP status codes.

## Response format notes
- Responses are JSON only on the reviewed public API page.
- The official docs consistently present envelope shapes using `ok`, `meta`, and `data`.
- Timestamp fields shown in the docs are ISO 8601 strings.

## Important usage notes
- This API is free and public according to the official docs.
- The `status` field is not purely based on crowdsourced reports; official vendor incidents can override or upgrade the computed status.
- `official_indicator` should be preserved separately if fireROUTE needs to distinguish official incidents from user-report-only spikes.
- The outage feed only covers the last `7 days` according to the official docs.

## Verification notes
This file was manually rebuilt from DownStatus's official Developer API page plus live browser fetches against the published `/status`, `/services`, and `/outages` endpoints.