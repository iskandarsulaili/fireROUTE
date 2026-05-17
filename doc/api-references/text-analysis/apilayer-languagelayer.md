# apilayer languagelayer

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `apilayer-languagelayer`
- Docs used manually:
  - `https://languagelayer.com/`
  - `https://docs.apilayer.com/languagelayer/docs/api-documentation`
  - `https://docs.apilayer.com/languagelayer/docs/languagelayer-api-v-1-0-0`
  - `https://languagelayer.com/pricing`
- Confirmed base URL: `https://api.languagelayer.com`
- Authentication model: API key passed as the `access_key` query parameter
- Primary response format: JSON
- Manually confirmed routes in this pass: `4`

## Authentication
- The official API endpoints reference defines one security scheme: `AccessKeyQuery`.
- Every documented request uses the `access_key` query parameter.
- The reviewed docs did not document bearer-token or header-based auth for this API.

## Rate limits and plan limits
- The reviewed docs did not publish a public per-second throttle table.
- The official pricing page instead documents plan-level request quotas.
- During this review the pricing page showed these request allowances:
  - Free: `100` API requests
  - Basic: `50,000` API requests
  - Professional: `500,000` API requests
  - Enterprise: `2,000,000` API requests
- The pricing page also indicates that `Batch Detection` is a paid-tier capability, which matches the OpenAPI error surface exposing a `403 FunctionRestricted` response.

## Error handling
From the official OpenAPI reference:
- `GET /detect` documents responses `200`, `400`, `401`, `403`, `406`, `429`, `500`.
- `GET /batch` and `POST /batch` document responses `200`, `400`, `401`, `411`, `429`, `500`.
- The shared response components identify these error families:
  - `BadRequest`
  - `MissingOrInvalidKey`
  - `FunctionRestricted`
  - `TooManyQueries`
  - `RateLimitReached`
  - `FormatError`
  - `ServerError`

## Response format notes
- The reviewed docs consistently describe JSON responses.
- The API documentation also documents optional JSONP wrapping through the `callback` parameter on GET routes.
- The single-detect response includes a `results` array ordered by confidence, with fields such as `language_code`, `language_name`, `probability`, `percentage`, and `reliable_result`.

## Pagination
- None of the reviewed routes are paginated.
- Batch processing is handled by sending multiple inputs to `/batch`, not by page-based traversal.

## Confirmed routes

### 1) Standard detection
- Method: `GET`
- Path: `/detect`
- Full URL: `https://api.languagelayer.com/detect`
- Required query parameters:
  - `access_key` - your API access key
  - `query` - text to analyze
- Optional query parameters:
  - `show_query` - set to `1` to echo the original query in the response
  - `format` - set to `1` for prettified JSON
  - `callback` - JSONP callback function name
- Notes:
  - the docs explicitly recommend URL-encoding the `query` value

### 2) Batch detection via query string
- Method: `GET`
- Path: `/batch`
- Full URL: `https://api.languagelayer.com/batch`
- Required query parameters:
  - `access_key`
  - `query[]` - repeated array parameter for each input string
- Optional query parameters:
  - `format`
  - `callback`
- Notes:
  - the official OpenAPI page documents a maximum of `100` batch entries

### 3) Batch detection via JSON body
- Method: `POST`
- Path: `/batch`
- Full URL: `https://api.languagelayer.com/batch`
- Authentication:
  - the official security scheme still requires `access_key` as a query parameter
- Request body:
  - JSON array of strings
  - maximum `100` items
- Notes:
  - the route summary explicitly recommends POST for larger payloads

### 4) List supported languages
- Method: `GET`
- Path: `/languages`
- Full URL: `https://api.languagelayer.com/languages`
- Confirmed query parameter from the main API documentation:
  - `access_key`
- Notes:
  - this route is shown in the official API documentation summary and usage example even though it was not expanded on the Swagger-style endpoint page reviewed in this pass

## Important usage notes
- The main documentation markets coverage for `170+` or `173` languages and accents.
- The API documentation summary explicitly distinguishes single detection, batch detection, and supported-language listing as separate use cases.
- Because `callback` is supported on GET routes, clients should expect both raw JSON and JSONP wrappers depending on request style.
- The pricing page suggests batch detection availability depends on plan tier.

## Verification notes
This file was manually rebuilt from the official languagelayer marketing page, APILayer documentation page, Swagger/OpenAPI endpoint page, and pricing page.