# Nationalize.io

## Provider metadata
- Category: `Development`
- Provider slug: `nationalize-io`
- Docs used manually:
  - `https://nationalize.io/documentation/api/reference`
- Confirmed REST API base URL: `https://api.nationalize.io`
- Primary media type: JSON
- Authentication model surfaced in docs: optional/conditional `apikey` query parameter from the Nationalize dashboard; the reference also shows unauthenticated example requests
- Manually confirmed routes in this pass: `1`

## Authentication
From the official API reference:
- the documented authentication parameter is `apikey`
- the key is passed as a query parameter, for example: `https://api.nationalize.io?name=nguyen&apikey=<API_KEY>`
- the page says to log in to obtain the key
- the same API key works across Nationalize, Genderize, and Agify
- the reviewed reference also includes a basic unauthenticated example, so I am documenting the key as an officially described auth option rather than assuming it is mandatory on every request

## Common request/response conventions
- Base URL: `https://api.nationalize.io`
- reviewed API surface uses `GET`
- responses are JSON
- there is one documented endpoint root, parameterized by query string inputs
- single-name requests return one JSON object
- batch requests return a JSON array in input order
- every successful response includes `name`, `country`, and `count`
- the `country` field is an array of up to five candidate countries ordered by probability

## Manually confirmed endpoint set

### 1) Predict nationality from a name
- Method: `GET`
- Path: `/`
- Full URL: `https://api.nationalize.io`
- Purpose: predict ranked nationality candidates from a supplied name
- Query parameters confirmed on the official page:
  - `name` - single input name
  - `name[]` - repeated parameter for batch requests of up to `10` names
  - `apikey` - optional/conditional API key query parameter documented in the authentication section
- Single-response fields explicitly documented:
  - `name` - processed name string
  - `country` - array of up to five candidate matches, empty when no prediction can be made
  - `country[].country_id` - two-letter ISO 3166-1 alpha-2 country code
  - `country[].probability` - number between `0` and `1` for that candidate
  - `count` - number of data points behind the prediction
- Batch-response behavior explicitly documented:
  - repeated `name[]` parameters return an array
  - response order matches request order
  - each element uses the same schema as the single-name response
- Important usage notes from the official page:
  - a last name produces the most accurate prediction
  - full names are accepted and parsed with fallback logic
  - each name in the batch counts toward quota separately

## Input-processing notes
The official `Input fallbacks` section says Nationalize tries these lookups in order:
1. direct match on the provided input
2. diacritic-stripped retry if the direct match fails (`José` -> `Jose`)
3. last-name extraction from multi-word strings (`Sarah Johnson` -> `Johnson`)

## Pagination
- none documented
- the reviewed API surface is a single prediction endpoint returning either one object or an ordered array

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
- the official docs say the `country` array is ordered by descending probability and contains at most five candidates
- the provider is surname-oriented: the docs explicitly say a last name yields the best accuracy
- `country` can be empty when no prediction can be made
- the maximum documented batch size is `10` names per request

## Verification notes
This file was manually rebuilt from the official Nationalize API reference using browser inspection.