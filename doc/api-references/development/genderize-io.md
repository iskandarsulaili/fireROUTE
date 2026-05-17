# Genderize.io

## Provider metadata
- Category: `Development`
- Provider slug: `genderize-io`
- Docs used manually:
  - `https://genderize.io/documentation/api/reference`
- Confirmed REST API base URL: `https://api.genderize.io`
- Primary media type: JSON
- Authentication model surfaced in docs: optional/conditional `apikey` query parameter from the Genderize dashboard; the reference also shows unauthenticated example requests
- Manually confirmed routes in this pass: `1`

## Authentication
From the official API reference:
- the documented authentication parameter is `apikey`
- the key is passed as a query parameter, for example: `https://api.genderize.io?name=peter&apikey=<API_KEY>`
- the page says to log in to obtain the key
- the same API key works across Genderize, Agify, and Nationalize
- the reviewed reference also includes a basic example without `apikey`, so the official page does not frame the key as mandatory for every example request; I am preserving that ambiguity explicitly

## Common request/response conventions
- Base URL: `https://api.genderize.io`
- reviewed API surface uses `GET`
- responses are JSON
- there is one documented endpoint root, parameterized by query string inputs
- single-name requests return one JSON object
- batch requests return a JSON array in input order
- every successful response includes `name`, `gender`, `probability`, and `count`

## Manually confirmed endpoint set

### 1) Predict gender from a name
- Method: `GET`
- Path: `/`
- Full URL: `https://api.genderize.io`
- Purpose: predict gender and confidence for a supplied name
- Query parameters confirmed on the official page:
  - `name` - single input name
  - `name[]` - repeated parameter for batch requests of up to `10` names
  - `country_id` - optional two-letter ISO 3166-1 alpha-2 country code to localize the prediction
  - `apikey` - optional/conditional API key query parameter documented in the authentication section
- Single-response fields explicitly documented:
  - `name` - processed name string
  - `gender` - `male` or `female`, or `null` when no prediction can be made
  - `probability` - number between `0` and `1`, representing the share of data points matching the predicted gender
  - `count` - number of data points behind the prediction
  - `country_id` - echoed when localization is applied
- Batch-response behavior explicitly documented:
  - repeated `name[]` parameters return an array
  - response order matches request order
  - each element uses the same field shape as the single-name response
- Important usage notes from the official page:
  - a first name produces the most accurate prediction
  - full names are accepted and parsed using fallback logic
  - `country_id` scopes the result to a country-specific model
  - without `country_id`, the API uses the global frequency model
  - in batch mode, one `country_id` value applies to all names in the request
  - each name in a batch consumes one unit of quota

## Input-processing notes
The official `Input fallbacks` section says Genderize tries these lookups in order:
1. direct match on the provided input
2. diacritic-stripped retry if the direct match fails (`José` -> `Jose`)
3. first-name extraction from multi-word strings (`Sarah Johnson` -> `Sarah`)

## Pagination
- none documented
- the reviewed API surface is a single prediction endpoint that returns one result object or an ordered array

## Rate limits
From the official `Responses and errors` section:
- every response, including errors, includes these rate-limit headers:
  - `X-Rate-Limit-Limit`
  - `X-Rate-Limit-Remaining`
  - `X-Rate-Limit-Reset`
- the page defines those as the current window limit, remaining names, and reset time in seconds
- the reviewed reference does **not** publish hard numeric threshold values directly
- documented `429` cases are:
  - `Request limit reached`
  - `Request too low to process`

## Error and response notes
From the official error table and example:
- success status: `200 OK`
- error responses are JSON with an `error` field
- documented error statuses and messages:
  - `401` - `Invalid API key`
  - `402` - `Subscription is not active`
  - `422` - `Missing 'name' parameter`
  - `422` - `Invalid 'name' parameter`
  - `429` - `Request limit reached`
  - `429` - `Request too low to process`
- documented sample error body:
  - `{"error":"Invalid API key"}`

## Important usage notes
- Genderize's localized prediction is explicitly country-sensitive; the docs use `Andrea` as the example of a name with different country-specific gender distributions
- `probability` is not a generic confidence score; the official description says it is the share of observed data points matching the predicted gender
- `gender` can be `null` when no prediction can be made
- the maximum documented batch size is `10` names per request

## Verification notes
This file was manually rebuilt from the official Genderize API reference using browser inspection.