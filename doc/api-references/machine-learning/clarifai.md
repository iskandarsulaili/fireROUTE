# Clarifai

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `clarifai`
- Docs used manually:
  - `https://docs.clarifai.com/resources/api-overview/`
  - `https://docs.clarifai.com/control/authentication/`
  - `https://docs.clarifai.com/create/inputs/manage/`
  - `https://docs.clarifai.com/create/models/manage/`
  - `https://docs.clarifai.com/resources/api-overview/pagination/`
  - `https://docs.clarifai.com/resources/api-overview/rate-limits/`
  - `https://docs.clarifai.com/resources/api-overview/status-codes/`
  - `https://documenter.getpostman.com/view/24309294/2sBXijHWuM`
- Confirmed API base URL: `https://api.clarifai.com/v2`
- Authentication model: `Authorization: Key {PAT_or_API_key}` using a Personal Access Token or app-specific API key
- Primary request/response format: JSON over HTTPS
- Manually confirmed routes in this pass: `21`

## Authentication
- Clarifai's authentication docs say API and SDK access uses either a Personal Access Token (PAT) or an app-specific API key.
- The reviewed REST examples consistently send credentials in the `Authorization` header using the `Key` scheme.
- The reviewed route examples scope most resources under both user and app identifiers:
  - `users/{user_id}`
  - `apps/{app_id}`
- The docs position PATs as broader account credentials and app-specific API keys as app-scoped credentials.

## Pricing and rate-limit notes
- The official rate-limit page says the default Clarifai API limit is `15 requests per second` for all users regardless of pricing plan.
- Clarifai says users must contact them for customized rate limits.
- The reviewed rate-limit page shows throttling responses as status code `11005` / `CONN_THROTTLED` with details like `exceeded limit of 15 requests per second`.
- Clarifai's own mitigation example recommends implementing backoff and retry behavior, including waiting `15` seconds before retrying after throttling.

## Request/response format notes
- The reviewed docs say Clarifai's API is exposed over HTTPS at `https://api.clarifai.com`.
- The reviewed REST examples use JSON responses and standard HTTP verbs: `GET`, `POST`, `PATCH`, and `DELETE`.
- `GET` pagination uses query parameters in the URL.
- `POST` pagination uses pagination fields in the request body.
- Update routes reviewed in this pass send JSON request bodies.
- The API status/error examples are JSON objects with a top-level `status` object.

## Error handling
- The official status-code page documents a large provider-specific status catalog in addition to HTTP status codes.
- Important connection/auth/request codes directly reviewed in this pass include:
  - `11001` - `CONN_TOKEN_INVALID`
  - `11002` - `CONN_CREDENTIALS_INVALID`
  - `11005` - `CONN_THROTTLED`
  - `11007` - `CONN_INSUFFICIENT_SCOPES`
  - `11008` - `CONN_KEY_INVALID`
  - `11100` - `CONN_BAD_REQUEST_FORMAT`
  - `11101` - `CONN_DOES_NOT_EXIST`
  - `11102` - `CONN_INVALID_REQUEST`
  - `11103` - `CONN_METHOD_NOT_ALLOWED`
- The docs also expose model-related status families such as `21xxx` codes for training, model existence, and evaluation failures.

## Pagination
- Clarifai's pagination docs state:
  - `page` defaults to `1`
  - `per_page` defaults to `128`
  - `per_page` can be as high as `1000`
- The docs explicitly say many `GET` and `POST` endpoints support pagination.
- The `inputs/stream` route uses iterative streaming semantics with `last_id` rather than page numbers.

## Confirmed routes

### 1) List inputs
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/inputs`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs`
- Confirmed query parameters:
  - `page`
  - `per_page`
- Notes:
  - the docs say this returns all inputs in the app and can include concepts already attached to those inputs

### 2) Stream inputs
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/inputs/stream`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs/stream`
- Confirmed query parameters:
  - `per_page`
  - `last_id`
- Confirmed behavior notes:
  - returns inputs iteratively from a given point onward
  - defaults to oldest-to-newest ordering
  - docs say `descending=true` reverses that order

### 3) Get input details
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/inputs/{input_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs/{input_id}`
- Confirmed path parameters:
  - `input_id`

### 4) Get input processing status
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/inputs/status`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs/status`
- Purpose: inspect input processing state for an app

### 5) Update inputs
- Method: `PATCH`
- Path: `/users/{user_id}/apps/{app_id}/inputs`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs`
- Confirmed JSON body fields from the reviewed example:
  - `inputs` - array of input objects to update
  - `action` - supported actions shown in the docs are `overwrite`, `merge`, and `remove`
- Confirmed nested fields shown in the reviewed example:
  - `id`
  - `data.concepts[].id`
  - `data.concepts[].value`

### 6) Delete one input
- Method: `DELETE`
- Path: `/users/{user_id}/apps/{app_id}/inputs/{input_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs/{input_id}`
- Confirmed path parameters:
  - `input_id`

### 7) Delete all inputs in an app
- Method: `DELETE`
- Path: `/users/{user_id}/apps/{app_id}/inputs`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/inputs`
- Notes:
  - this route appeared as a dedicated cURL example on the reviewed manage-inputs page

### 8) List model types
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/types`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/types`
- Confirmed query parameters from the reviewed example:
  - `per_page`
  - `page`
- Notes:
  - the docs describe this route as listing available model types and their hyperparameters

### 9) List models
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models`
- Purpose: list models inside the app scope

### 10) Get model details
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}`
- Confirmed path parameters:
  - `model_id`

### 11) Get model output info
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/output_info`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/output_info`
- Confirmed path parameters:
  - `model_id`

### 12) Get model concepts
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/concepts`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/concepts`
- Confirmed path parameters:
  - `model_id`

### 13) List model versions
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/versions`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/versions`
- Confirmed path parameters:
  - `model_id`

### 14) Get one model version
- Method: `GET`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/versions/{model_version_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/versions/{model_version_id}`
- Confirmed path parameters:
  - `model_id`
  - `model_version_id`

### 15) Update models
- Method: `PATCH`
- Path: `/users/{user_id}/apps/{app_id}/models`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models`
- Notes:
  - the reviewed manage-models page confirms this as a bulk model update route

### 16) Update model versions
- Method: `PATCH`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/versions`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/versions`
- Confirmed path parameters:
  - `model_id`

### 17) Search models
- Method: `POST`
- Path: `/users/{user_id}/apps/{app_id}/models/searches`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/searches`
- Purpose: search models within the app scope

### 18) Delete one model
- Method: `DELETE`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}`
- Confirmed path parameters:
  - `model_id`

### 19) Delete one model version
- Method: `DELETE`
- Path: `/users/{user_id}/apps/{app_id}/models/{model_id}/versions/{model_version_id}`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models/{model_id}/versions/{model_version_id}`
- Confirmed path parameters:
  - `model_id`
  - `model_version_id`

### 20) Delete all models in an app
- Method: `DELETE`
- Path: `/users/{user_id}/apps/{app_id}/models`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/models`
- Notes:
  - this route appeared as a dedicated cURL example on the reviewed manage-models page

### 21) Search annotations
- Method: `POST`
- Path: `/users/{user_id}/apps/{app_id}/annotations/searches`
- Full URL pattern: `https://api.clarifai.com/v2/users/{user_id}/apps/{app_id}/annotations/searches`
- Confirmed pagination note from the official pagination page:
  - `POST` pagination fields are sent in the request body instead of the query string
- Notes:
  - the reviewed pagination page uses this route family as the canonical POST pagination example

## Important usage notes
- Clarifai's reviewed REST documentation heavily uses user-and-app-scoped routes rather than a flat accountless path layout.
- Streaming input listing is a separate route from normal paginated input listing and uses `last_id` semantics rather than numbered pages.
- Clarifai's docs expose a provider-specific status-code system in the response body, so fireROUTE should preserve both HTTP status and Clarifai `status.code` fields.
- The reviewed docs recommend translating their cURL examples directly when integrating in languages outside the official SDKs.
- The docs surface both PATs and app-specific API keys, so adapter configuration should allow either credential source while still emitting the same `Authorization: Key ...` header format.

## Verification notes
This file was manually rebuilt from Clarifai's official docs site and official Postman public collection page, using the reviewed authentication, pagination, rate-limit, status-code, input-management, and model-management pages.