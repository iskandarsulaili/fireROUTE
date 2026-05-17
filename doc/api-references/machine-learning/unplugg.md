# Unplugg

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `unplugg`
- Official pages manually reviewed:
  - `https://unplu.gg/test_api.html`
  - `https://api.unplu.gg/`
  - `https://unplu.gg/`
- Expected auth signal from the catalog/index: `apiKey`
- Confirmed API base URL: `https://api.unplu.gg`
- Authentication model: access token sent in the `x-access-token` request header
- Primary request/response formats: JSON request bodies plus JSON responses and webhook callbacks
- Manual review outcome: `manually_documented`
- Confirmed routes in this pass: `1`

## Authentication
- The official docs page says developers must first request a token.
- The reviewed docs explicitly instruct callers to authorize requests with:
  - `x-access-token: <YOUR-ACCESS-TOKEN>`
  - `Content-Type: application/json`
- The public docs page includes an API-key request form on the website, but it does not document a separate public HTTP auth/token endpoint on `api.unplu.gg` itself.

## Rate limits
- No explicit request-per-minute, request-per-hour, or concurrency limits were published on the reviewed official pages.
- The docs only state that `Access is limited to valid access tokens only.`

## Request/response format notes
- The official docs state that the API is available at `https://api.unplu.gg/`.
- The docs explicitly say forecasts are requested by making a `POST` to endpoint `/forecast`.
- The documented request body is JSON with:
  - `data` - array of time-series points
  - `callback` - webhook URL that receives the completed forecast payload
  - `forecast_to` - optional Unix timestamp defining the forecasting end date
- Each `data[]` item contains:
  - `timestamp` - Unix time in seconds
  - `value` - integer or float value for that timestamp
- The docs say that if the submitted time series is not equally spaced, the service resamples it so each interval matches the gap between the first two points.
- The docs say that if `forecast_to` is omitted, the produced forecast length defaults to `1/8` of the number of points supplied in the input series.
- The docs show two response shapes:
  - immediate acceptance body containing a `job_id`
  - completed webhook payload containing `forecast[]` and `job_id`
- The API root `https://api.unplu.gg/` itself currently returns `{"code":"ResourceNotFound","message":"/ does not exist"}`, which confirms the host but not an additional documented route.

## Pagination
- No page-number, cursor, offset, or token-based pagination scheme was documented.
- The reviewed Unplugg docs describe a single forecasting job submission flow rather than a list/query API.

## Error handling
- The docs explicitly state that malformed payloads return `422: UNPROCESSABLE ENTITY` plus a message intended to help locate the error.
- The reviewed docs do not publish a broader HTTP status table, retry policy, or named error-code catalog for `/forecast`.
- The API root currently returns a JSON error object with:
  - `code: "ResourceNotFound"`
  - `message: "/ does not exist"`

## Important usage notes
- The official homepage positions Unplugg as an energy-focused forecasting service, but the API docs say the same endpoint can also be used for temperature and other seasonal time-series data.
- The docs are example-driven rather than OpenAPI/Swagger-based.
- The public docs discuss asynchronous completion via webhook callback; callers should be prepared to receive the final forecast at the supplied `callback` URL.
- The docs also show a `200` example containing `forecast[]` and `job_id`, so integrators should validate exact synchronous-versus-webhook behavior in their own environment.

## Confirmed routes

### 1) Submit a forecasting job
- Method: `POST`
- Path: `/forecast`
- Full URL: `https://api.unplu.gg/forecast`
- Auth: `x-access-token` header
- Confirmed headers:
  - `x-access-token`
  - `Content-Type: application/json`
- Confirmed request fields:
  - `data` - array of timestamp/value points
  - `callback` - webhook URL for the completed result
  - `forecast_to` - optional forecast end timestamp
- Confirmed nested `data[]` fields:
  - `timestamp`
  - `value`
- Confirmed response/result fields from official examples:
  - immediate acceptance: `job_id`
  - completed forecast payload: `forecast[]`, `job_id`
- Usage notes:
  - the docs say malformed payloads return `422 UNPROCESSABLE ENTITY`
  - if timestamps are unevenly spaced, the service resamples the series before forecasting
  - if `forecast_to` is omitted, the forecast length defaults to one-eighth of the number of input points

## Verification notes
This file was manually rebuilt from the current official Unplugg docs page, the official API host root, and the current official homepage.
