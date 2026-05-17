# FingerprintJS Pro

## Provider metadata
- Category: `Security`
- Provider slug: `fingerprintjs-pro`
- Docs used manually:
  - `https://docs.fingerprint.com/docs/quick-start-guide`
  - `https://docs.fingerprint.com/reference/server-api-v4`
  - `https://docs.fingerprint.com/reference/server-api-v4-get-event`
  - `https://docs.fingerprint.com/reference/server-api-v4-update-event`
  - `https://docs.fingerprint.com/reference/server-api-v4-search-events`
  - `https://docs.fingerprint.com/reference/server-api-v4-delete-visitor-id`
- Confirmed API base URLs in this pass:
  - `https://api.fpjs.io/v4`
  - `https://eu.api.fpjs.io/v4`
  - `https://ap.api.fpjs.io/v4`
  - delete-by-visitor routes are documented on the regional roots without `/v4`:
    - `https://api.fpjs.io`
    - `https://eu.api.fpjs.io`
    - `https://ap.api.fpjs.io`
- Primary media type confirmed in this pass: `application/json`
- Authentication models confirmed in this pass:
  - Server API v4 routes use `Authorization: Bearer SECRET_API_KEY`
  - visitor-deletion route documents `Auth-API-Key: <api-key>`
- Manually confirmed routes in this pass: `4`

## Authentication
From the official Quick Start and Server API pages reviewed in this pass:
- Fingerprint separates public client-side API keys from secret server-side keys
- Server API v4 must be used only from the server side
- unauthenticated Server API requests return `403 Forbidden`
- the documented v4 auth scheme is `Authorization: Bearer SECRET_API_KEY`
- the visitor-deletion route is documented with `Auth-API-Key: <api-key>` instead of the Bearer header shown on the v4 event endpoints

## Common request/response conventions
- Event routes are documented under the regional `/v4` base URLs
- The delete-by-visitor route is documented on the regional root host without the `/v4` prefix
- Responses are JSON objects
- Multi-value query parameters use repeated keys syntax such as `parameter=value1&parameter=value2`
- The Server API reference says these calls are not billed and do not count toward the monthly allowance

## Manually confirmed endpoint set

### 1) Get an event by event ID
- Method: `GET`
- Path: `/v4/events/{event_id}`
- Full URL examples:
  - `https://api.fpjs.io/v4/events/{event_id}`
  - `https://eu.api.fpjs.io/v4/events/{event_id}`
  - `https://ap.api.fpjs.io/v4/events/{event_id}`
- Purpose: retrieve a detailed payload for one identification event, including Smart Signals
- Auth: `Authorization: Bearer SECRET_API_KEY`
- Path parameters:
  - `event_id` - required unique event identifier
- Response notes directly confirmed from the official example:
  - returns event metadata such as `event_id`, `timestamp`, `url`, `ip_address`, and `user_agent`
  - returns identification data including `visitor_id` and confidence details
  - can include Smart Signals and related fields such as bot, proxy, VPN, tampering, velocity, SDK details, and raw device attributes

### 2) Update an event
- Method: `PATCH`
- Path: `/v4/events/{event_id}`
- Full URL examples:
  - `https://api.fpjs.io/v4/events/{event_id}`
  - `https://eu.api.fpjs.io/v4/events/{event_id}`
  - `https://ap.api.fpjs.io/v4/events/{event_id}`
- Purpose: update event metadata after creation or flag an event as suspicious
- Auth: `Authorization: Bearer SECRET_API_KEY`
- Content type: `application/json`
- Path parameters:
  - `event_id` - required unique event identifier
- Confirmed JSON body fields:
  - `linked_id` - optional string to assign to the existing event
  - `tags` - optional object of customer-provided values
  - `suspect` - optional boolean suspicious/fraud flag
- Response notes:
  - documented success response is `200 OK`
- Important route notes from the official page:
  - events older than one month cannot be updated
  - updating an event immediately after creation can temporarily return `409 Conflict` because the event is not mutable yet; the docs instruct callers to retry

### 3) Search events
- Method: `GET`
- Path: `/v4/events`
- Full URL examples:
  - `https://api.fpjs.io/v4/events`
  - `https://eu.api.fpjs.io/v4/events`
  - `https://ap.api.fpjs.io/v4/events`
- Purpose: search past events using built-in filters
- Auth: `Authorization: Bearer SECRET_API_KEY`
- Confirmed query parameters captured from the official overview and endpoint page:
  - `limit` - optional integer, default `10`, range `1..100`
  - `pagination_key` - optional string for the next page of results
  - `visitor_id` - optional visitor identifier filter
  - `high_recall_id` - optional supplementary high-recall visitor identifier filter
  - `linked_id` - documented on the overview page as a built-in filter
  - `start` - documented on the overview page as a built-in filter for time range searches
  - `end` - documented on the overview page as a built-in filter for time range searches
  - `reverse` - optional boolean-like sort direction control; the page explains `reverse=true` returns oldest-first
  - `suspect` - documented on the overview page as a built-in filter
  - `platform` - optional enum; reviewed page shows `js`, `android`, `ios`
  - `environment` - optional repeated-key array of environment IDs
  - `bot`, `bot_info`, `bot_info_category`, `bot_info_identity`, `bot_info_confidence` - optional bot-related filters
  - `proximity_id` - optional proximity filter
  - `total_hits` - optional integer to include match counts in the response, range `1..1000`
  - `tor_node` - optional boolean Tor-node filter
  - `incremental_identification_status` - optional enum with `partially_completed` or `completed`
  - `simulator` - optional iOS Simulator Detection filter
- Response notes directly confirmed from the official page:
  - returns an `events` array
  - can return `pagination_key` for follow-up requests
  - can return `total_hits` when the `total_hits` query parameter is supplied
- Usage notes from the official page:
  - default search window is the last 7 days
  - default ordering is newest first
  - the route is explicitly positioned for filters such as `visitor_id`, `linked_id`, `start`, `end`, and `suspect`

### 4) Delete data by visitor ID
- Method: `DELETE`
- Path: `/visitors/{visitor_id}`
- Full URL examples:
  - `https://api.fpjs.io/visitors/{visitor_id}`
  - `https://eu.api.fpjs.io/visitors/{visitor_id}`
  - `https://ap.api.fpjs.io/visitors/{visitor_id}`
- Purpose: request asynchronous deletion of all data associated with a visitor ID
- Auth: `Auth-API-Key: <api-key>`
- Path parameters:
  - `visitor_id` - required visitor ID to delete
- Response notes:
  - documented success response is `200 OK`
  - the page states the visitor ID is scheduled for deletion rather than synchronously removed inline
- Important route notes from the official page:
  - available only for Enterprise plans upon request
  - browser/device data is typically deleted within minutes
  - events from the previous 10 days are typically deleted within 24 hours
  - older events are purged according to the account retention period

## Pagination
- `GET /v4/events` uses cursor-style pagination via `pagination_key`
- the docs describe carrying the response `pagination_key` into the next request to fetch additional matching results
- the other three routes confirmed in this pass are not documented as paginated

## Rate limits
From the reviewed official pages:
- the Server API overview confirms throttling with `429 too_many_requests` and says responses may include `Retry-After`
- the reviewed Server API overview does not publish a single numeric request-per-minute limit for the v4 event endpoints
- `DELETE /visitors/{visitor_id}` has its own documented quota:
  - maximum `30` delete requests per hour
  - maximum `500` delete requests per day
  - support can raise these limits on request

## Error handling
The reviewed official pages explicitly document or describe:
- `403 Forbidden` for unauthenticated Server API v4 requests
- `409 Conflict` for event updates attempted before a newly created event becomes mutable
- `429` with JSON body `{ "error": { "code": "too_many_requests", "message": "too many requests" } }` for Server API throttling
- delete-by-visitor is asynchronous, so a `200` means the deletion was scheduled rather than fully completed immediately

## Response format notes
- event retrieval and event search return JSON objects containing detailed event payloads
- search results are wrapped in an object with an `events` array and optional `pagination_key` / `total_hits`
- update-event uses a JSON request body and returns `200 OK`
- visitor deletion returns an acknowledgement rather than a paginated resource payload

## Important usage notes
- Fingerprint's Quick Start makes clear that Smart Signals are not exposed in the client-side agent response and should be accessed through Server API, Webhooks, or Sealed Client Results
- the reviewed docs distinguish regional deployments: Global, EU, and Asia (Mumbai)
- multi-value filters must be sent with repeated keys instead of comma-separated arrays
- visitor deletion uses a different auth header and URL prefix than the `/v4/events` endpoints, so adapters should not assume one auth/base-URL pattern covers all Fingerprint security routes

## Verification notes
This file was manually rebuilt from Fingerprint's official Quick Start and Server API reference pages, including the route pages for get-event, update-event, search-events, and delete-visitor-by-ID.