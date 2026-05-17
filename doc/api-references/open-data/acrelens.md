# AcreLens

## Provider metadata
- Category: `Open Data`
- Provider slug: `acrelens`
- Description: `Land suitability scoring API for any US property: off-grid, rural, recreational, investment`
- Official docs/pages used:
  - `https://www.acrelens.com/developers`
  - `https://docs.acrelens.com/quickstart`
  - `https://docs.acrelens.com/reference/endpoint-reference`
  - `https://docs.acrelens.com/authentication`
  - `https://docs.acrelens.com/reference/rate-limits`
  - `https://docs.acrelens.com/guides/webhooks`
- Confirmed public API base URL: `https://api.acrelens.com/v1`
- Auth model:
  - `Authorization: Bearer <acrelens_api_key>` on every endpoint except `GET /v1/health`
  - The authentication guide documents both `al_live_...` and `al_test_...` key families
  - Optional `Idempotency-Key` header is recommended on POST requests
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON
- Rate limits officially documented on the reviewed pages:
  - Technical reference page: `5 requests/second` per API key on a sliding window for standard PAYG accounts
  - Enterprise: higher limits up to `100 requests/second` are available by contract
  - `GET /v1/health` is explicitly documented as not rate-limited
- Manually confirmed route count: `8`

## API shape and behavior
- AcreLens is an asynchronous land-analysis API centered on report generation rather than synchronous data lookup.
- `POST /v1/analyze` and `POST /v1/batch` return acceptance envelopes first, then callers either poll report resources or receive webhook deliveries when work finishes.
- The docs consistently present four analysis modes: `off_grid`, `rural_residential`, `recreational`, and `investment`.
- The endpoint reference is explicit that all non-health routes live under `https://api.acrelens.com/v1`.
- The dashboard/marketing page still mentions `60 req / min`, but the dedicated technical rate-limit reference documents the current enforceable API-key limit as `5 req/sec`; the reference page is the better source for implementation.

## Canonical endpoints
1. `POST /v1/analyze`
   - Submit one property for asynchronous analysis.
   - Required JSON body fields: `address`, `state`, `mode`.
   - Optional fields documented: `county`, `acreage`, `asking_price`, `lat`, `lng`, `webhook_url`, `metadata`.
   - Returns `202 Accepted` with `report_id`, `status`, `estimated_completion_seconds`, and `poll_url`.
2. `GET /v1/reports/{id}`
   - Fetch a submitted report by `report_id`.
   - Returns a lightweight processing envelope while work is still running.
   - Returns the full structured report once `status` becomes `completed`.
   - Returns a failure envelope with `failed_reason` when analysis fails.
3. `POST /v1/batch`
   - Submit `2` to `50` properties in one request.
   - Body fields documented: `items`, optional `delivery_mode`, optional `webhook_url`, optional `metadata`.
   - Returns `202 Accepted` with `batch_id`, per-report stubs, and estimated completion time.
4. `GET /v1/balance`
   - Retrieve current customer balance, free reports remaining, and the last `10` transactions.
5. `GET /v1/usage`
   - Retrieve period-bounded usage totals, current balance information, and current PAYG rate.
6. `POST /v1/billing/portal`
   - Return a Stripe customer-portal URL.
   - Optional request body field: `return_url`.
7. `GET /v1/states/{code}`
   - Fetch state-level reference intelligence used to ground report scoring.
   - Optional query parameter: `mode`.
   - Documented as edge-cached with `Cache-Control: public, max-age=3600`.
8. `GET /v1/health`
   - Unauthenticated liveness probe.
   - Returns service `status`, `version`, and `timestamp`.

## Core parameters and path conventions
### Shared request/body fields
- `address` - property street address, required on analysis requests when coordinates are not used.
- `state` - two-letter US state code.
- `mode` - one of `off_grid`, `rural_residential`, `recreational`, `investment`.
- `county` - optional county hint to improve regulation research.
- `acreage` - optional positive number.
- `asking_price` - optional USD asking price; the docs say it materially improves `investment` mode.
- `lat` and `lng` - optional coordinate pair; docs say both may be supplied to skip geocoding.
- `webhook_url` - optional per-request override for report completion delivery.
- `metadata` - optional object with up to `10` string-valued key/value pairs.

### Batch-specific fields
- `items` - array of `2` to `50` item objects shaped like `POST /v1/analyze`.
- `delivery_mode` - optional enum: `per_item` or `batch`.

### State-reference query fields
- `code` - two-letter state code in the path.
- `mode` - optional query parameter to request one mode instead of all four.

### Headers
- `Authorization` - required on all routes except health.
- `Content-Type: application/json` - required for POST JSON bodies.
- `Idempotency-Key` - recommended UUID on POST requests.
- Common response headers documented on every response: `x-request-id`, `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.
- On `429`, the docs also specify `retry-after`.

## Response and lifecycle notes
- `POST /v1/analyze` returns immediately with `status: processing` and a `poll_url`.
- `GET /v1/reports/{id}` can return `authorized`, `processing`, `failed`, or `completed` depending on lifecycle stage.
- Completed reports include `property`, `scores`, `confidence`, `summary`, `details`, `considerations`, `estimated_costs`, `sources`, optional `metadata`, and `generated_at`.
- The docs explicitly note that sub-score keys vary by analysis mode.
- The `details` object includes topical breakdowns and, for `buildability`, additional fields such as `rv_living_allowed`, `composting_toilet_allowed`, and `permit_difficulty`.
- No pagination model is documented for any of the eight public REST endpoints reviewed here.

## Webhook notes
- Webhooks are configured either as an account default in the dashboard or per request through `webhook_url`.
- Documented event types: `report.completed`, `report.failed`, `batch.completed`.
- Deliveries include `X-AcreLens-Event`, `X-AcreLens-Signature`, and `X-AcreLens-Delivery` headers.
- Signature format: `t=<unix_timestamp>,v1=<hex_hmac>`.
- Verification string: `"{t}.{raw_request_body}"` signed with HMAC-SHA256 using the webhook secret.
- Retry schedule documented: immediate, then `1 minute`, `5 minutes`, `30 minutes`, `2 hours`, `8 hours`, and `24 hours`.
- Non-2xx, timeout, and network failures are retried; `2xx`, `3xx`, and most `4xx` are not.

## Error notes
- The endpoint reference explicitly documents these error codes on `POST /v1/analyze`:
  - `unauthorized` (`401`)
  - `forbidden` (`403`)
  - `insufficient_balance` (`402`)
  - `DAILY_CAP_EXCEEDED` (`402`)
  - `MONTHLY_CAP_EXCEEDED` (`402`)
  - `idempotency_conflict` (`409`)
  - `validation_failed` (`422`)
  - `rate_limit_exceeded` (`429`)
- `GET /v1/reports/{id}` documents `not_found` (`404`) and `unauthorized` (`401`).
- `POST /v1/billing/portal` documents `not_found` (`404`) and `upstream_error` (`502`).
- `GET /v1/states/{code}` documents `not_found` (`404`) and `validation_failed` (`422`).
- `GET /v1/health` may return `503` with `internal_error` if backing services are down.
- The authentication page also shows the standardized error envelope with `error.code`, `error.message`, `request_id`, `retriable`, and `docs_url`.

## Usage notes
- The authentication guide states that test keys are recommended for CI/dev but still consume balance and count against quota/spend caps.
- Keys are shown exactly once and stored by AcreLens only as SHA-256 hashes.
- Revoked keys stop working immediately; the auth guide recommends zero-downtime rotation by overlapping deployment of old and new keys briefly.
- The quickstart explicitly recommends webhooks over polling because polling burns rate-limit budget.
- The rate-limit guide calls out webhook deliveries as not consuming rate-limit budget.
- The docs treat the public REST API as one of three integration surfaces; MCP and n8n are separate integrations and are not counted as REST routes here.

## fireROUTE normalization notes
- Preserve the asynchronous contract: `POST /v1/analyze` and `POST /v1/batch` are submission routes, not synchronous analysis responses.
- Preserve `mode` exactly as the provider documents it; score shapes and details vary by mode.
- Keep `webhook_url` and `metadata` passthrough support because both are part of the official request schema.
- Treat `GET /v1/health` separately from authenticated routes.
- Do not infer undocumented admin endpoints into fireROUTE. The docs mention `/v1/prompt-versions` for administrators, but the public reviewed pages do not publish a public CRUD inventory for them.