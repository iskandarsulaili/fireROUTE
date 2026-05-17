# Infermedica

## Provider metadata
- Category: `Health`
- Provider slug: `infermedica`
- Official docs/pages used:
  - `https://developer.infermedica.com/documentation/engine-api/api/`
  - `https://developer.infermedica.com/documentation/engine-api/basics/`
  - `https://developer.infermedica.com/documentation/engine-api/faq/`
  - `https://api.infermedica.com/v3/swagger.json`
- Current public API base URL: `https://api.infermedica.com/v3`
- Auth model: application credentials in request headers
- Required auth headers from the reviewed docs: `App-Id`, `App-Key`
- Additional required correlation header from the reviewed docs: `Interview-Id`
- Optional headers documented in the reviewed docs: `Model`, `Dev-Mode`, `Interview-Token`
- Response format: JSON encoded in UTF-8
- CORS note from the reviewed docs: cross-origin requests are supported, but the docs warn not to expose credentials in public client-side code
- Public rate-limit note: no numeric rate limit is published in the reviewed docs, but the FAQ says `403` responses are most likely caused by exceeding the monthly API request limit
- Manually confirmed route count: `19`

## Authentication and access
- Every reviewed endpoint requires the custom headers `App-Id` and `App-Key`.
- The basics page says an `Interview-Id` should also be included with requests.
- The docs show `Content-Type: application/json` on `POST` requests and explicitly require it for every `POST` body.
- The optional `Model` header selects a language model, for example `infermedica-uk`.
- The optional `Dev-Mode: true` header excludes development/test traffic from Infermedica's later request analysis.
- `GET /v3/patient_education/{condition_id}` additionally documents an optional `Interview-Token` header retrieved from `/v3/diagnosis`.

## Canonical endpoints
1. `GET /v3/concepts` - list concepts, optionally filtered by IDs and types
2. `GET /v3/concepts/{id}` - fetch one concept by ID
3. `GET /v3/conditions` - list conditions for a supplied age context
4. `GET /v3/conditions/{id}` - fetch one condition by ID
5. `POST /v3/diagnosis` - query the diagnostic engine for question flow and ranked conditions
6. `POST /v3/explain` - explain supporting, conflicting, and unconfirmed evidence for a target condition
7. `GET /v3/info` - return API/model metadata such as content counts and update timestamp
8. `POST /v3/interviews/feedback` - submit intent-survey feedback
9. `POST /v3/parse` - extract observations from unstructured text
10. `GET /v3/patient_education/{condition_id}` - retrieve patient-education content for a condition
11. `POST /v3/rationale` - return rationale information for the diagnostic output
12. `POST /v3/recommend_specialist` - return recommended specialist and channel
13. `GET /v3/risk_factors` - list risk factors for a supplied age context
14. `GET /v3/risk_factors/{id}` - fetch one risk factor by ID
15. `GET /v3/search` - search symptom/risk-factor concepts from user-entered text
16. `POST /v3/suggest` - suggest possible symptoms from current interview evidence
17. `GET /v3/symptoms` - list symptoms for a supplied age context
18. `GET /v3/symptoms/{id}` - fetch one symptom by ID
19. `POST /v3/triage` - return a triage level for the current evidence set

## Parameters and request-body notes
### Shared headers
- `App-Id` - required application identifier
- `App-Key` - required application key
- `Interview-Id` - request correlation/interview identifier shown in the reviewed docs and examples
- `Model` - optional model selector; the basics page lists more than 20 language-specific `infermedica-*` models
- `Dev-Mode` - optional boolean-like header to exclude development/test calls from analysis
- `Content-Type: application/json` - required on reviewed `POST` routes

### Shared query/path parameters
- `age.value` - required on `GET /conditions`, `/conditions/{id}`, `/risk_factors`, `/risk_factors/{id}`, `/search`, `/symptoms`, and `/symptoms/{id}`
- `age.unit` - optional age unit on the same age-aware `GET` routes; enum: `year`, `month`
- `enable_triage_3` - optional boolean on condition/risk-factor/symptom catalog routes
- `id` - required path parameter on single-concept/condition/risk-factor/symptom lookups
- `ids` - optional concept-ID filter on `GET /v3/concepts`
- `types` - optional concept-type filter on `GET /v3/concepts` and `GET /v3/search`
- `phrase` - required text query on `GET /v3/search`
- `sex` - optional on `GET /v3/search`; enum values shown in the spec are `male` and `female`
- `max_results` - optional on `GET /v3/search` and `POST /v3/suggest`
- `include_pro` - optional boolean on `GET /v3/search`
- `sections` - optional patient-education section filter on `GET /v3/patient_education/{condition_id}`

### POST request-body fields
#### Shared diagnostic body shape
The reviewed OpenAPI shows these common JSON fields on `POST /v3/diagnosis`, `/v3/rationale`, `/v3/recommend_specialist`, and `/v3/triage`:
- `age`
- `sex`
- `evidence`
- `extras`

#### `POST /v3/explain`
- Same shared diagnostic body fields as above
- Additional `target` object identifying the condition/explanation target

#### `POST /v3/parse`
- Required: `age`, `text`
- Optional: `sex`, `context`, `include_tokens`, `correct_spelling`, `concept_types`

#### `POST /v3/suggest`
- Required: `age`, `sex`
- Optional: `evidence`, `extras`, `suggest_method`
- Optional query parameter: `max_results`

#### `POST /v3/interviews/feedback`
- Required JSON fields: `patient_intent_before`, `patient_intent_after`

## Response, pagination, and error notes
- The basics page says JSON is the only supported data format and that both requests and responses should use UTF-8.
- The reviewed spec exposes JSON request/response bodies for all `POST` routes and JSON responses for all `GET` routes.
- The main success code is `200`.
- The basics page documents these common error classes:
  - `400` - invalid JSON or missing/invalid parameters
  - `403` - missing/invalid credentials, and the FAQ says this also commonly indicates the monthly limit was exceeded
  - `404` - invalid URL or object not found
  - `405` - invalid HTTP method
- The reviewed OpenAPI also publishes `422` validation responses on all confirmed routes.
- No reviewed endpoint documents offset, page, or cursor pagination.

## Usage notes from the official docs
- The basics page says the API is deterministic and idempotent for the same inputs.
- Only `GET` and `POST` are documented in the reviewed engine API.
- The FAQ says `/parse` is intended for symptom/risk-factor extraction from free text and works best with simple phrases rather than long narrative stories.
- The FAQ says the NLP service is currently available only in English.
- The FAQ says `/search` is for one observation lookup, while `/parse` is for extracting one or more observations from natural-language text.
- The FAQ says `/diagnosis` returns only a single condition when fewer than three observations have been collected.
- The basics page says the free plan only includes the English model.

## fireROUTE normalization notes
- Normalize this provider as a header-authenticated JSON API rooted at `https://api.infermedica.com/v3`.
- Keep `Interview-Id` as a first-class request header rather than treating it like an optional tracing nicety, because the reviewed docs repeatedly surface it in examples and troubleshooting guidance.
- Preserve the distinction between concept-catalog search (`/concepts`, `/search`, `/symptoms`, `/risk_factors`) and interview-state engine calls (`/diagnosis`, `/triage`, `/explain`, `/rationale`, `/recommend_specialist`, `/suggest`, `/parse`).
- Treat the provider as non-paginated based on the reviewed official documentation.