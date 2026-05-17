# GeoScore

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `geoscore`
- Docs used manually:
  - `https://geoscoreapi.com/`
  - `https://api.geoscoreapi.com/docs`
- Confirmed base URL: `https://api.geoscoreapi.com`
- Authentication model: mixed; some routes are public, while key management and scoring routes use API-key access
- Primary request/response format: JSON
- Manually confirmed routes in this pass: `8`

## Authentication
- The public demo route is explicitly documented as requiring **no API key**.
- The homepage and docs position the service around issued API keys and usage tracking for normal integration.
- The product site advertises `50 free / month` on the free tier.

## Confirmed routes

### 1) Demo analyze endpoint
- Method: `POST`
- Path: `/api/demo`
- Purpose: public demo scoring route with no API key required
- Important usage note from the official docs: text-only, `5k` character limit

### 2) Authenticated analyze endpoint
- Method: `POST`
- Path: `/api/analyze`
- Purpose: score content for AI / GEO readability
- Notes from the official docs/site:
  - returns a `0–100` score
  - returns structural metrics and concrete fixes
  - accepts text or URL-based scoring inputs according to the product positioning and request schema naming

### 3) Health check
- Method: `GET`
- Path: `/health`
- Purpose: service health check

### 4) Create free-tier API key
- Method: `POST`
- Path: `/api/keys/create`
- Purpose: generate a new free-tier API key

### 5) Look up API key by email
- Method: `GET`
- Path: `/api/keys/lookup`
- Purpose: retrieve API key by email for self-serve post-checkout recovery

### 6) Read API-key usage
- Method: `GET`
- Path: `/api/keys/usage`
- Purpose: return usage stats for the current API key

### 7) Stripe webhook receiver
- Method: `POST`
- Path: `/webhooks/stripe`
- Purpose: handle Stripe subscription webhook events

### 8) Create checkout session
- Method: `POST`
- Path: `/api/checkout/session`
- Purpose: create a Stripe Checkout session

## Parameters and schema notes
- The OpenAPI docs publish these schema families:
  - `AnalyzeRequest`
  - `AnalyzeResponse`
  - `CheckoutRequest`
  - `CreateKeyRequest`
  - `HealthResponse`
  - `HTTPValidationError`
  - `ValidationError`
- The homepage and docs confirm the core scoring payload returns structural metrics tied to quick answers, FAQs, tables, sources, headings, and reading-grade style factors.

## Rate limits
- The public homepage explicitly advertises a free plan with `50 free / month`.
- The reviewed docs do not publish a broader per-minute or per-second table.
- The unauthenticated demo route is intentionally constrained and is not the same as the normal authenticated analyze route.

## Error handling
- The OpenAPI docs include `HTTPValidationError` and `ValidationError` schemas.
- That confirms structured validation failures are part of the official contract.
- The reviewed docs did not expose a separate narrative error-handling page beyond the OpenAPI status/schema presentation.

## Response format notes
- The homepage markets the service as `JSON in, JSON out`.
- The docs page is an OAS 3.1 reference and describes JSON request/response schemas for the surfaced operations.

## Important usage notes
- GeoScore positions itself as a content-readiness API for AI citations and generative-engine optimization rather than general-purpose NLP.
- The public demo is intentionally limited and should not be treated as the production integration path.
- Key issuance, usage lookup, checkout, and Stripe webhook routes are part of the same official API surface and are documented on the same OpenAPI page.

## Verification notes
This file was manually rebuilt from GeoScore’s official marketing site plus the live OpenAPI docs at `api.geoscoreapi.com/docs`.