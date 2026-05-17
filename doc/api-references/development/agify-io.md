# Agify.io

## Provider metadata
- Category: `Development`
- Provider slug: `agify-io`
- Docs used manually:
  - `https://agify.io/documentation/api/reference`
- Confirmed REST API base URL: `https://api.agify.io`
- Primary media type: JSON
- Authentication model surfaced in docs: optional/conditional `apikey` query parameter from the Agify dashboard; the reference also shows unauthenticated example requests
- Manually confirmed routes in this pass: `1`

## Authentication
From the official API reference:
- the documented authentication parameter is `apikey`
- the key is passed as a query parameter, for example: `https://api.agify.io?name=michael&apikey=<API_KEY>`
- the page says to log in to the Agify dashboard to obtain the key
- the same API key works across the three Demografix services: Agify, Genderize, and Nationalize
- the reference also shows basic requests without `apikey`, so the reviewed docs do **not** present the key as a strict requirement for every example call; I am documenting that ambiguity explicitly rather than guessing

## Common request/response conventions
- Base URL: `https://api.agify.io`
- reviewed API surface uses `GET`
- responses are JSON
- there is one documented endpoint root, with behavior controlled by query parameters rather than different paths
- single-name requests return one JSON object
- batch requests return a JSON array in the same order as the input names
- every successful response includes the processed `name`, an `age` prediction, and a supporting `count`

## Manually confirmed endpoint set

### 1) Predict age from a name
- Method: `GET`
- Path: `/`
- Full URL: `https://api.agify.io`
- Purpose: predict an age from a supplied name using Agify's population model
- Query parameters confirmed on the official page:
  - `name` - single input name
  - `name[]` - repeated parameter for batch requests of up to `10` names
  - `country_id` - optional two-letter ISO 3166-1 alpha-2 country code to localize the age estimate
  - `apikey` - optional/conditional account API key query parameter documented in the authentication section
- Single-response fields explicitly documented:
  - `name` - processed name string
  - `age` - integer predicted age, or `null` when no prediction can be made
  - `count` - number of data points behind the prediction
  - `country_id` - echoed back when localization is applied
- Batch-response behavior explicitly documented:
  - repeated `name[]` parameters return an array
  - the response order matches the input order
  - each entry contains the same field shape as a single-name response
- Important usage notes from the official page:
  - a first name gives the best accuracy
  - the API accepts full names and applies fallback parsing
  - when `country_id` is omitted, the API uses the global model
  - when `country_id` is supplied in a batch request, it applies to every name in that batch
  - each name in a batch counts against quota separately

## Input-processing notes
The official `Input fallbacks` section says Agify tries these lookups in order:
1. direct match on the provided input
2. diacritic-stripped retry if the direct match fails (`José` -> `Jose`)
3. first-name extraction from multi-word strings (`Sarah Johnson` -> `Sarah`)

## Pagination
- none documented
- the reviewed API surface is a single prediction endpoint returning either one object or one ordered array

## Rate limits
From the official `Responses and errors` section:
- every response, including errors, includes these rate-limit headers:
  - `X-Rate-Limit-Limit` - total names allowed in the current window
  - `X-Rate-Limit-Remaining` - names remaining in the current window
  - `X-Rate-Limit-Reset` - seconds until the window resets
- the reviewed reference page does **not** publish the numeric values of those limits directly
- documented `429` cases are:
  - `Request limit reached` - monthly quota or per-IP limit exhausted
  - `Request too low to process` - request throttled; retry after a short delay

## Error and response notes
From the official error table and examples:
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
- the service documents one endpoint only; the main integration choice is single-name versus repeated `name[]` batch usage
- localization is country-based and uses ISO alpha-2 country codes through `country_id`
- the reference is explicit that batch requests are capped at `10` names
- `age` can be `null` when the service cannot make a prediction

## Verification notes
This file was manually rebuilt from the official Agify API reference using browser inspection.