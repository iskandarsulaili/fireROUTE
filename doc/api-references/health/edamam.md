# Edamam

## Provider metadata
- Category: `Health`
- Provider slug: `edamam`
- Official docs/pages used:
  - `https://developer.edamam.com/edamam-docs-nutrition-api`
  - `https://api.edamam.com/doc/open-api/nutrition-analysis-v1.yaml`
- Current public API base URL: `https://api.edamam.com`
- Published API version in the reviewed docs: `1.4`
- Auth model: application credentials in query parameters
- Required auth parameters from the reviewed docs: `app_id`, `app_key`
- Optional account-tracking header from the reviewed docs: `Edamam-Account-User`
- Response format: JSON
- Public rate-limit note: no numeric rate limit is published in the reviewed documentation page or official OpenAPI document
- Manually confirmed route count: `2`

## Authentication and access
- Both confirmed routes require `app_id` and `app_key` query parameters.
- The docs say these credentials come from the Edamam dashboard.
- `Edamam-Account-User` is an optional header for accounts configured for active-user tracking; the docs say it should only be sent when that feature is enabled.
- The docs note that if active-user tracking is enabled for an app ID, the user-ID header becomes mandatory; if it is not enabled, sending the header causes an error.

## Canonical endpoints
1. `POST /api/nutrition-details` - full recipe analysis from a structured recipe payload
2. `GET /api/nutrition-data` - individual text-line analysis for a single ingredient-style input string

## Parameters and request-body notes
### Shared authentication inputs
- `app_id` - required query parameter
- `app_key` - required query parameter
- `Edamam-Account-User` - optional header for active-user tracking only

### `POST /api/nutrition-details`
- Purpose: analyze a full recipe and return nutrients, labels, and recipe-classification metadata
- Optional query parameters from the reviewed docs:
  - `beta` - enable beta features in request/response
  - `force` - re-evaluate even when the submitted ETag is still valid
  - `kitchen` - `home` or `commercial`
  - `field` - repeatable field selector or `*` for all fields
- Optional headers from the reviewed docs:
  - `If-None-Match` - send a previously returned ETag when resubmitting the same recipe
  - `Content-Language` - request language; the docs list `ar`, `de`, `en`, `es`, `fr`, `it`, `nl`, `pt`, `ru`, `tr`
- Required JSON body fields from the `Recipe` schema:
  - `title`
  - `ingr` - array of ingredient lines
- Optional `Recipe` body fields from the reviewed schema:
  - `url`
  - `summary`
  - `yield`
  - `time`
  - `img`
  - `prep`

### `GET /api/nutrition-data`
- Purpose: analyze one short unstructured food text line
- Required query parameter:
  - `ingr` - ingredient text
- Optional query parameters:
  - `nutrition-type` - `cooking` or `logging`; defaults to `cooking`
- Optional header:
  - `If-None-Match` - reuse ETag when resubmitting the same text

## Response, pagination, and error notes
- Both confirmed routes return the `AnalyzedRecipe` JSON shape in the reviewed OpenAPI.
- The reviewed schema includes fields such as `uri`, `url`, `yield`, `calories`, `glycemicIndex`, `inflammatoryIndex`, `co2EmissionsClass`, `totalWeight`, `dietLabels`, `healthLabels`, `cautions`, `totalNutrients`, and `totalDaily`.
- The docs explicitly describe ETag support and `304 Not Modified` behavior for both routes.
- Reviewed error/status codes:
  - `200` - successful analysis
  - `304` - not modified
  - `404` - URL not found or retrievable resource missing
  - `406` - unsupported locale request on `POST /api/nutrition-details`
  - `409` - provided ETag token does not match input data
  - `422` - input could not be parsed or nutritional info could not be extracted
  - `555` - recipe quality insufficient for correct processing
- No reviewed official page documents page-number, offset, or cursor pagination for either confirmed route.

## Usage notes from the official docs
- The docs position `POST /api/nutrition-details` for full recipe NLP + nutrition analysis and `GET /api/nutrition-data` for short ingredient-line analysis.
- The food-logging mode is enabled by setting `nutrition-type=logging` on `GET /api/nutrition-data`.
- The docs say food logging changes NLP behavior so single foods can be matched to ready-to-eat servings and quantity may be inferred.
- The docs say recipe classification fields such as cuisine, meal, and dish type are beta and require `beta=true`.
- The docs warn that non-English `Content-Language` requests may incur translation charges.
- The docs say active-user IDs may only contain `a-z`, `A-Z`, `0-9`, `-`, `_`, and `.`, with a maximum length of 30 characters.
- The docs note that some response fields are plan-dependent and may not appear on all subscriptions.

## fireROUTE normalization notes
- Normalize this provider as a query-authenticated JSON API rooted at `https://api.edamam.com`.
- Keep the two confirmed routes distinct: one full-recipe `POST` workflow and one short-text `GET` workflow.
- Preserve ETag/`If-None-Match` support because it is explicitly documented on both reviewed routes.
- Treat the provider as non-paginated based on the reviewed official docs.