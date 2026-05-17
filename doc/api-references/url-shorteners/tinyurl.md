# TinyURL

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `tinyurl`
- Docs used manually:
  - `https://tinyurl.com/app/dev`
  - `https://tinyurl.com/openapi/v2.json`
- Confirmed REST API base URL: `https://api.tinyurl.com`
- Primary media type: JSON
- Versioning note: reviewed official spec version `2.4.2`
- Manually confirmed routes in this pass: `5`

## Authentication
From the official TinyURL developer page and linked official OpenAPI document:
- the API is only available to authorized users
- the developer page says it requires an API token used for HTTP Bearer authentication
- the route definitions in the official OpenAPI document list security schemes named `bearerAuth` and `tokenAuth`
- API tokens are created from the TinyURL account `API Settings` page

## Common request/response conventions
- Base URL: `https://api.tinyurl.com`
- request and response bodies are JSON
- many response schemas inherit a common base response that includes:
  - `code`
  - `errors[]`
- base-response code meanings documented in the official spec include:
  - `0` - OK
  - `1` - Not authorized
  - `2` - Not implemented
  - `3` - Forbidden
  - `4` - Permission denied
  - `5` - Validation fails
  - `6` - Not found
  - `7` - Internal server error

## Manually confirmed endpoint set

### 1) Create a TinyURL
- Method: `POST`
- Path: `/create`
- Full URL: `https://api.tinyurl.com/create`
- Purpose: shorten a long URL into a new TinyURL
- Request body fields confirmed in the official spec:
  - `url` - required long URL
  - `domain` - optional, defaults to `tinyurl.com`
  - `alias` - optional custom alias; spec shows `minLength: 5`, `maxLength: 30`, and notes branded domains can use a minimum length of `1`
  - `description` - optional / nullable description
  - `expires_at` - optional / nullable expiration timestamp
  - `tags[]` - optional categorization tags
- Response schema notes from the official spec:
  - `200` returns `UrlAliasResponse`
  - response `data` combines alias metadata with long-URL details
- Explicitly documented error responses:
  - `401`
  - `405`
  - `422`
  - `5XX`

### 2) Receive or delete TinyURL information by alias
- Methods: `GET`, `DELETE`
- Path: `/alias/{domain}/{alias}`
- Full URL: `https://api.tinyurl.com/alias/{domain}/{alias}`
- Purpose:
  - `GET` returns TinyURL information
  - `DELETE` deletes a TinyURL
- Path parameters confirmed in the official spec:
  - `domain` - TinyURL domain, example `tinyurl.com`
  - `alias` - TinyURL alias
- `GET` response notes:
  - `200` returns `UrlAliasHitsBillableResponse`
- `DELETE` response notes:
  - `200` returns `UrlAliasResponse`
- Alias-related response fields explicitly documented via shared schemas:
  - `alias`
  - `domain`
  - `tiny_url`
  - `created_at`
  - `expires_at`
  - `tags[]`
  - `archived`
  - `deleted`
  - `analytics[]` with `enabled` and `public`
- Explicitly documented error responses for both operations:
  - `401`
  - `405`
  - `422`
  - `5XX`

### 3) List TinyURLs
- Method: `GET`
- Path: `/urls/{type}`
- Full URL: `https://api.tinyurl.com/urls/{type}`
- Purpose: list TinyURLs by state
- Path parameters:
  - `type` - required; enum includes `available` and `archived`
- Query parameters confirmed in the official spec:
  - `from` - only TinyURLs created after the given datetime
  - `to` - only TinyURLs created before the given datetime
  - `search` - search for `alias:` or `tag:` patterns
- Response notes:
  - `200` returns `AliasResponse`
- Explicitly documented error responses:
  - `401`
  - `405`
  - `422`
  - `5XX`

### 4) Return timeline analytics
- Method: `GET`
- Path: `/analytics/timeline`
- Full URL: `https://api.tinyurl.com/analytics/timeline`
- Purpose: retrieve time-bucketed TinyURL analytics
- Query parameters confirmed in the official spec:
  - `from`
  - `to`
  - `interval`
  - `alias`
  - `tag`
- Response fields explicitly documented through the response schema:
  - `data.dataset[]`
    - `datetime`
    - `human`
    - `total`
    - `unique`
  - `data.interval` - enum includes `minute`, `hour`, `day`, `week`, `month`
  - `data.timezone`
- Explicitly documented error responses:
  - `401`
  - `405`
  - `422`
  - `5XX`

### 5) Create a bulk TinyURL batch
- Method: `POST`
- Path: `/bulk`
- Full URL: `https://api.tinyurl.com/bulk`
- Purpose: create a batch request for multiple TinyURLs
- Request body fields confirmed in the official spec:
  - `items[]` - required array of bulk items
  - `domain` - optional default domain for the batch
- Response notes:
  - `200` returns `BulkStatusResponse`
- Explicitly documented error responses:
  - `401`
  - `405`
  - `422`
  - `5XX`

## Pagination
- no explicit pagination parameters were documented on the five reviewed TinyURL routes
- the reviewed list route `/urls/{type}` documents filtering by date range and search string rather than cursor/page parameters

## Rate limits
- the reviewed TinyURL developer page and linked OpenAPI document did not publish numeric rate limits or quota windows

## Error and response notes
- TinyURL uses JSON response envelopes with a shared `code` plus `errors[]`
- the official OpenAPI document consistently references reusable responses for:
  - `Unauthorized` (`401`)
  - `PermissionDenied` (`405`)
  - `UnprocessableEntity` (`422`)
  - `UnexpectedError` (`5XX`)
- successful responses are typed JSON payloads such as `UrlAliasResponse`, `AliasResponse`, `TimelineAnalyticsResponse`, and `BulkStatusResponse`

## Important usage notes
- alias creation supports both the free `tinyurl.com` domain and branded domains configured on the account
- the alias length rules differ slightly for branded-domain usage versus the default domain
- the API token should be treated as a secret and regenerated if compromised
- analytics-related routes are present directly in the public spec, but the reviewed docs did not publish any public quota guidance for those endpoints

## Verification notes
This file was manually rebuilt from the official TinyURL developer page and its linked official OpenAPI document using browser inspection.