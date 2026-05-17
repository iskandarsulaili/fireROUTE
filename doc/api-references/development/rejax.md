# Rejax

## Provider metadata
- Category: `Development`
- Provider slug: `rejax`
- Docs used manually:
  - `https://rejax.io/`
  - `https://www.rejax.io/`
  - `https://www.rejax.io/docs`
  - `https://www.rejax.io/api`
- Confirmed API base URL: `https://rejax.io`
- Primary response/content type confirmed in this pass: `application/json`
- Authentication model confirmed in this pass: none required for the confirmed route
- Manually confirmed routes in this pass: `1`
- Manual review outcome: `manually_documented`

## Manual first-party review
### Official site
- URL reviewed: `https://rejax.io/`
- The official root loaded as a bare browser JSON-viewer surface rather than a marketing or docs page.
- A full browser snapshot exposed the raw response body `{"status":"logged"}` plus the browser JSON-viewer control `Pretty-print`.
- A browser page-context check also confirmed the document content type as `application/json`.

### Additional first-party pages reviewed
- `https://www.rejax.io/`
- `https://www.rejax.io/docs`
- `https://www.rejax.io/api`
- In this pass, each of these pages surfaced the same kind of bare JSON-viewer shell and did not provide a human-readable API reference, parameter table, auth guide, or schema documentation.
- Because no distinct route contract was documented on those auxiliary URLs, they were not counted as separate confirmed fireROUTE routes.

## Authentication
- No reviewed first-party page documented an API key, bearer token, OAuth flow, cookie login, or signed-request scheme.
- The confirmed root route loaded successfully without credentials.

## Common request/response conventions
- Base URL: `https://rejax.io`
- Confirmed success response format: JSON
- Confirmed content type observed from the live root endpoint: `application/json`
- The currently visible official surface behaves like a minimal JSON endpoint, not a full developer portal.
- No versioning scheme, environment split, or alternate response formats were documented on the reviewed pages.

## Manually confirmed endpoint set

### 1) Root status response
- Method: `GET`
- Path: `/`
- Full URL: `https://rejax.io/`
- Purpose: return the minimal status payload currently exposed by the official domain.
- Confirmed query parameters: none
- Confirmed request body: none
- Confirmed success response:
  - `{"status":"logged"}`
- Confirmed response notes:
  - the payload is rendered directly by the browser's JSON viewer
  - the only observed top-level field in this pass was `status`
  - the observed value for that field was `logged`

## Additional reviewed paths with no separate confirmed contract
- `GET https://www.rejax.io/`
- `GET https://www.rejax.io/docs`
- `GET https://www.rejax.io/api`
- These URLs did not publish distinct documented operations in this pass.
- Since no separate parameters, schemas, or response semantics were confirmed for them, they were not counted as additional fireROUTE routes.

## Pagination
- None documented.
- The confirmed route returns a single JSON object, not a collection.

## Rate limits
- No numeric rate-limit policy, quota, or throttle window was documented on the reviewed first-party pages.

## Error handling
- The reviewed first-party pages did not publish a structured error schema, status-code table, or retry guidance.
- This file does not infer undocumented error formats beyond the observed successful root response.

## Response format notes
- The confirmed route returns JSON.
- The observed response body in this pass was exactly `{"status":"logged"}`.
- No alternate XML, CSV, or HTML success representation was documented for the confirmed route.

## Important usage notes
- Rejax currently exposes only a minimal route contract that can be safely confirmed from the official domain.
- The official domain did not expose a broader developer guide or operation catalogue during this review.
- fireROUTE should treat this provider as a one-route minimal JSON service until first-party docs expose additional operations.

## Verification notes
This file was manually rewritten from live official-site review using browser and file tools only. The root response was confirmed from the official domain in-browser during this pass.
