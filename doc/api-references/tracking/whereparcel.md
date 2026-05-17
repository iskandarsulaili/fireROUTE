# WhereParcel

## Provider metadata
- Category: `Tracking`
- Provider slug: `whereparcel`
- Official docs used manually:
  - `https://whereparcel.com/docs`
  - `https://whereparcel.com/docs/authentication`
  - `https://whereparcel.com/docs/quickstart`
  - `https://whereparcel.com/docs/rate-limits`
  - `https://whereparcel.com/docs/api/tracking`
  - `https://whereparcel.com/docs/api/carriers`
  - `https://whereparcel.com/docs/api/webhooks`
  - `https://whereparcel.com/docs/api/webhook-endpoints`
- Confirmed API base URL: `https://api.whereparcel.com`
- Primary response format: JSON
- Authentication:
  - `Authorization: Bearer <apiKey>:<secretKey>`
  - `Content-Type: application/json`
- Manually confirmed routes in this pass: `16`

## Authentication and onboarding
From the reviewed official docs:
- API keys are managed in the WhereParcel dashboard.
- The documented onboarding flow is:
  - sign in
  - open `Dashboard -> API Keys`
  - generate a new API key
  - save both the API key and secret key securely
- The docs explicitly warn that the secret key is only shown once.
- The reviewed authentication page recommends:
  - storing keys in environment variables
  - using different keys for development and production
  - rotating keys regularly
  - revoking compromised keys immediately
- Authentication failures return HTTP `401` with a JSON envelope like:
  - `success: false`
  - `error.code: UNAUTHORIZED`
  - `error.message: Invalid API key or secret key`

## Confirmed API surface

| Method | Path | Purpose | Key parameters / official notes |
|---|---|---|---|
| `POST` | `/v2/track` | track parcels on demand | body includes `trackingItems` array; up to `5` items per call |
| `GET` | `/v2/carriers` | list supported carriers | documented as free / non-billable |
| `GET` | `/v2/countries` | list supported countries | documented as free / non-billable |
| `GET` | `/v2/carriers/{countryCode}` | list carriers for one country | path param `countryCode` |
| `GET` | `/v2/carriers/{countryCode}/{region}` | list carriers for one country region | path params `countryCode`, `region` |
| `POST` | `/v2/webhooks/register` | register webhook tracking | body includes `trackingItems`; supports one-time and recurring modes; up to `500` items |
| `GET` | `/v2/webhooks/subscriptions` | list registered webhook subscriptions | free / non-billable |
| `GET` | `/v2/webhooks/subscriptions/{requestId}` | fetch one webhook subscription | path param `requestId` |
| `DELETE` | `/v2/webhooks/subscriptions/{requestId}` | cancel one webhook subscription | path param `requestId`; stops monitoring immediately for recurring webhooks |
| `GET` | `/v2/webhooks/subscriptions/{requestId}/changes` | list delivery-status changes for one subscription | path param `requestId` |
| `GET` | `/v2/webhooks/subscriptions/{requestId}/changes/{changeId}` | fetch one change event | path params `requestId`, `changeId` |
| `POST` | `/v2/webhooks/results` | batch search final webhook results | searches by carrier+trackingNumber and/or `clientId` |
| `POST` | `/v2/webhook-endpoints` | create a registered webhook endpoint | body includes `name`, `url`; optional `secret`, `description` |
| `GET` | `/v2/webhook-endpoints` | list webhook endpoints | free / non-billable |
| `PUT` | `/v2/webhook-endpoints/{endpointId}` | update endpoint metadata or URL | path param `endpointId`; reviewed example updates `name`, `url`, `enabled` |
| `DELETE` | `/v2/webhook-endpoints/{endpointId}` | delete a webhook endpoint | path param `endpointId`; cannot delete endpoint in use by active webhooks |

## Route details

### 1) POST /v2/track
- Purpose: one-off tracking lookups for user-initiated checks.
- Reviewed page says:
  - up to `5` parcels per request
  - average response time `5 seconds` per item
  - supports `500+` carriers according to the main docs copy
- Documented request body fields:
  - `trackingItems[].carrier` - required carrier code such as `us.usps`, `kr.cj`, `de.gls`
  - `trackingItems[].trackingNumber` - required
  - `trackingItems[].clientId` - optional client-side correlation id returned as-is
  - `trackingItems[].postalCode` - optional, needed by some carriers
  - `trackingItems[].phoneNumber` - optional, needed by some carriers
- Reviewed success shape:
  - `success: true`
  - `results` array with per-item status and data
- Official guidance: use `/v2/track` for one-off lookups, not for continuous monitoring.

### 2) GET /v2/carriers
- Purpose: return carrier codes / metadata for the full carrier catalog.
- Official note: free API and does not count toward usage quota.
- Reviewed success example returns `success: true` with `data` array of carrier codes.

### 3) GET /v2/countries
- Purpose: return supported country codes.
- Official note: free API and does not count toward usage quota.
- Reviewed success example returns `success: true` with `data` array like `kr`, `us`, `jp`, `cn`, `de`.

### 4) GET /v2/carriers/{countryCode}
- Purpose: filter carriers to one country.
- Path parameter:
  - `countryCode` - required country code used in WhereParcel carrier ids
- Official note: free API and does not count toward usage quota.

### 5) GET /v2/carriers/{countryCode}/{region}
- Purpose: filter carriers to one region inside a country.
- Path parameters:
  - `countryCode`
  - `region`
- Official usage note:
  - especially useful for large countries like the USA or China where carriers may be region-specific
  - not generally needed for countries where carriers operate nationwide
- Official note: free API and does not count toward usage quota.

### 6) POST /v2/webhooks/register
- Purpose: register tracking for webhook delivery.
- Reviewed page documents two modes:
  - `recurring: false` - default; query once only
  - `recurring: true` - continuous monitoring until delivery
- Documented request body fields:
  - `trackingItems` - required array, up to `500`
  - `trackingItems[].carrier` - required
  - `trackingItems[].trackingNumber` - required
  - `trackingItems[].clientId` - optional
  - `trackingItems[].postalCode` - optional
  - `trackingItems[].phoneNumber` - optional
  - `recurring` - optional boolean, default `false`
  - `webhookEndpointId` - optional when `recurring: false`, required when `recurring: true`
- Official note:
  - if `webhookEndpointId` is omitted in one-time mode, the request can still complete without notification delivery
  - for recurring mode, the docs explicitly say you must register a webhook endpoint first
- Reviewed success response includes:
  - `requestId`
  - `subscriptionId`
  - `status`
  - `message`

### 7) GET /v2/webhooks/subscriptions
- Purpose: list all registered subscriptions, both recurring and one-time.
- Official note: free API and does not count toward usage quota.
- The reviewed page does not publish page-number parameters for this list route.

### 8) GET /v2/webhooks/subscriptions/{requestId}
- Purpose: retrieve one subscription record by `requestId`.
- Path parameter:
  - `requestId`
- Official note: free API and does not count toward usage quota.

### 9) DELETE /v2/webhooks/subscriptions/{requestId}
- Purpose: cancel a subscription and stop monitoring.
- Path parameter:
  - `requestId`
- Official note: for recurring webhooks, monitoring stops immediately.
- Official note: free API and does not count toward usage quota.

### 10) GET /v2/webhooks/subscriptions/{requestId}/changes
- Purpose: list delivery-status change history for one subscription.
- Path parameter:
  - `requestId`
- Official note: free API and does not count toward usage quota.

### 11) GET /v2/webhooks/subscriptions/{requestId}/changes/{changeId}
- Purpose: fetch one specific change event.
- Path parameters:
  - `requestId`
  - `changeId`
- Official note: free API and does not count toward usage quota.

### 12) POST /v2/webhooks/results
- Purpose: batch search final webhook results for multiple parcels.
- Official search modes:
  - carrier + tracking number
  - `clientId`
  - both methods can be mixed in one request
- Reviewed operational notes:
  - provider searches Firestore `trackingIndex` / `clientIdIndex`
  - returns only the latest document when duplicates exist for one tracking number
  - batching is constrained by Firestore `array-contains-any` limits and the docs mention up to `10` queries for `100` items
- Official note: free API and does not count toward usage quota.
- Reviewed request body uses the same `trackingItems` object shape as tracking/webhook registration.

### 13) POST /v2/webhook-endpoints
- Purpose: create a reusable destination endpoint for notifications.
- Documented request body fields:
  - `name` - required
  - `url` - required
  - `secret` - optional
  - `description` - optional
- Reviewed success example returns:
  - `endpointId`
  - `name`
  - `url`
  - `secret`
  - `description`
  - `isActive`
  - `createdAt`
- Official note: free API and does not count toward usage quota.

### 14) GET /v2/webhook-endpoints
- Purpose: list all registered endpoints.
- Official note: free API and does not count toward usage quota.

### 15) PUT /v2/webhook-endpoints/{endpointId}
- Purpose: update endpoint information.
- Path parameter:
  - `endpointId`
- Reviewed example updates:
  - `name`
  - `url`
  - `enabled`
- Official note says this route can change URL, name, description, active status, and similar metadata.
- Official note: free API and does not count toward usage quota.

### 16) DELETE /v2/webhook-endpoints/{endpointId}
- Purpose: remove a registered endpoint.
- Path parameter:
  - `endpointId`
- Official note: you cannot delete an endpoint that is currently used by active webhooks.
- Official note: free API and does not count toward usage quota.

## Rate limits and operational guidance
From the reviewed `rate-limits` page:
- Every API key has both per-minute and per-month quotas.
- Reviewed documented plans:
  - Starter: `30` requests/minute, `10,000` requests/month
  - Pro: `60` requests/minute, `30,000` requests/month
  - Business: `200` requests/minute, `300,000` requests/month
- All plans also have a server-protection limit of `10 requests/second` per API key.
- When a limit is exceeded, the API returns HTTP `429 Too Many Requests`.
- Reviewed rate-limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- The docs' retry guidance shows honoring `Retry-After` and using exponential backoff.

## Pagination, batching, and delivery behavior
- The reviewed `/v2/track` page documents batching up to `5` tracking items per call.
- The reviewed `/v2/webhooks/register` page documents batching up to `500` items per registration.
- The reviewed `/v2/webhooks/results` page documents internal batching behavior caused by Firestore query limits.
- The reviewed pages used here do not publish page-number parameters for the WhereParcel list routes.
- The webhook docs emphasize that recurring webhooks are the recommended integration pattern for keeping internal order state synchronized.

## Error and format notes
From the reviewed official pages:
- WhereParcel consistently returns JSON.
- Success envelopes commonly use:
  - `success: true`
  - `data`, `results`, or route-specific ids like `requestId`, `subscriptionId`, `endpointId`
- Error envelopes commonly use:
  - `success: false`
  - `error.code`
  - `error.message`
- Reviewed route-specific errors include:
  - `401 Unauthorized` for invalid or missing API credentials
  - `429 Too Many Requests` on billable tracking / webhook registration routes
  - `400 Bad Request` on webhook-endpoint create/update for invalid request parameters such as malformed URL
  - `404 Not Found` on request-id / change-id routes when a resource is missing
- The reviewed docs do not expose a generalized multi-page error catalog beyond those route examples.

## Important usage notes
- The docs explicitly recommend using recurring webhook registrations instead of repeatedly polling `/v2/track`.
- The rate-limit guide quantifies this: webhook subscription mode costs one registration per parcel instead of repeated tracking calls throughout the parcel lifecycle.
- The reviewed webhooks docs say payload delivery uses automatic exponential-backoff retries and signed payloads.
- `/v2/webhooks/results` is intended as a retrieval/search helper for already-registered webhook jobs, not as a replacement for `/v2/track`.
- Free-route status matters for fireROUTE routing strategy:
  - carrier metadata routes are non-billable
  - webhook endpoint management routes are non-billable
  - webhook history/results inspection routes are non-billable
  - `/v2/track` and `/v2/webhooks/register` are the billable operational routes documented in the reviewed pages

## fireROUTE notes
- Treat WhereParcel as a single-host JSON API with header-based key/secret auth, not query auth.
- Prefer recurring webhook registration for long-lived delivery monitoring.
- Preserve the provider's distinction between billable tracking/registration routes and free metadata / management / results routes.
- Do not assume classic page-based pagination where the reviewed docs do not actually publish it.
- Keep `clientId` support exposed because the official docs use it across tracking and webhook-result retrieval as a first-class correlation mechanism.

## Verification notes
This file was manually rebuilt from the live official WhereParcel documentation pages using browser inspection.