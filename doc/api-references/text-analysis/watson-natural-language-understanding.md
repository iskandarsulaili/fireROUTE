# Watson Natural Language Understanding

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `watson-natural-language-understanding`
- Docs used manually:
  - `https://cloud.ibm.com/apidocs/natural-language-understanding/natural-language-understanding`
  - section anchors reviewed on the same official IBM API docs page for endpoint URLs, authentication, versioning, error handling, and method definitions
- Confirmed service base URL pattern: `https://api.{region}.natural-language-understanding.watson.cloud.ibm.com/instances/{instance_id}`
- Example instance URL shown by IBM: `https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/{instance_id}`
- Authentication confirmed from official docs: IBM Cloud IAM using either an IAM bearer token or API-key-based basic auth (`apikey:{apikey}`)
- Primary request/response format: JSON for analysis calls; multipart form data for model-upload routes
- Manually confirmed routes in this pass: `14`

## Authentication
From the official IBM API docs:
- Authentication uses IBM Cloud IAM.
- You can authenticate with:
  - an IAM bearer token in the `Authorization` header, or
  - an API key using basic auth where the username is literally `apikey` and the password is the API key value
- IBM explicitly recommends IAM tokens for production use when you are not using an SDK.

## Versioning
- Every API request requires a `version` query parameter in `YYYY-MM-DD` format.
- The reviewed docs warn not to default this parameter to the current date.
- The current version date documented on the page reviewed in this pass is `2022-04-07`.

## Endpoint, format, and transport notes
- IBM says the base URL comes from your service instance credentials.
- All Watson services use TLS/SSL.
- The docs show JSON request bodies for analysis routes and form uploads for custom-model creation/update routes.
- IBM notes the service can return useful response headers and suggests `curl --include` or `--verbose` when troubleshooting.

## Error handling
From the official IBM API docs:
- Standard HTTP status codes are used.
- `2xx` indicates success.
- `4xx` indicates client/request failure.
- `5xx` indicates internal system error.
- The documented generic error object contains:
  - `code` - HTTP response code
  - `error` - general description of the failure

## Pagination
- The reviewed method pages did not publish a general cursor or page-number pagination model.
- The analyzed route set is mostly single-resource actions or bounded list/model-management operations.
- No provider-wide pagination section was exposed on the reviewed IBM API docs page.

## Confirmed routes

### 1) Analyze text with query parameters
- Method: `GET`
- Path: `/v1/analyze`
- Purpose: analyze raw text, HTML, or a public webpage
- Confirmed required query parameter:
  - `version`
- Confirmed input/request option families surfaced on the reviewed docs page:
  - source input such as `text`, `html`, or `url`
  - `features`
  - `clean`
  - `xpath`
  - `fallback_to_raw`
  - `language`

### 2) Analyze text with JSON body
- Method: `POST`
- Path: `/v1/analyze`
- Purpose: analyze text, HTML, or a public webpage for categories, classifications, concepts, emotion, entities, keywords, metadata, relations, semantic roles, sentiment, syntax, and summarization
- Confirmed required query parameter:
  - `version`
- Confirmed body/input fields from the reviewed docs page:
  - one source input such as `text`, `html`, or `url`
  - `features`
  - optional processing controls such as `clean`, `xpath`, `fallback_to_raw`, and `language`

### 3) List custom entities/relations models
- Method: `GET`
- Path: `/v1/models`
- Purpose: list Watson Knowledge Studio custom entities and relations models deployed to the service
- Confirmed required query parameter:
  - `version`

### 4) Delete a custom model
- Method: `DELETE`
- Path: `/v1/models/{model_id}`
- Required parameters:
  - `model_id` - path parameter
  - `version` - query parameter

### 5) Create categories model
- Method: `POST`
- Path: `/v1/models/categories`
- Notes from the reviewed docs:
  - marked `(Beta)`
  - uploads training data and metadata, then starts training/deployment
- Confirmed form parameters visible on the page:
  - `language` - required two-letter code
  - `training_data` - required binary JSON training data
  - optional metadata fields including `name`, `description`, `model_version`, `version`, `user_metadata`, and `workspace_id`
  - `version` query parameter is still required for the API call

### 6) List categories models
- Method: `GET`
- Path: `/v1/models/categories`
- Notes:
  - marked `(Beta)`
- Confirmed required query parameter:
  - `version`

### 7) Get categories model details
- Method: `GET`
- Path: `/v1/models/categories/{model_id}`
- Notes:
  - marked `(Beta)`
- Confirmed parameters:
  - `model_id`
  - `version`

### 8) Update categories model
- Method: `PUT`
- Path: `/v1/models/categories/{model_id}`
- Notes:
  - marked `(Beta)`
  - overwrites training data and retrains the model
- Confirmed parameters:
  - `model_id`
  - `version`

### 9) Delete categories model
- Method: `DELETE`
- Path: `/v1/models/categories/{model_id}`
- Notes:
  - marked `(Beta)`
  - deletes the model and associated customer data/artifacts
- Confirmed parameters:
  - `model_id`
  - `version`

### 10) Create classifications model
- Method: `POST`
- Path: `/v1/models/classifications`
- Notes:
  - creates and deploys a custom classifications model from uploaded training data
- Confirmed common parameter families:
  - `version`
  - form-upload model creation fields analogous to IBM's custom model flow

### 11) List classifications models
- Method: `GET`
- Path: `/v1/models/classifications`
- Confirmed required query parameter:
  - `version`

### 12) Get classifications model details
- Method: `GET`
- Path: `/v1/models/classifications/{model_id}`
- Confirmed parameters:
  - `model_id`
  - `version`

### 13) Update classifications model
- Method: `PUT`
- Path: `/v1/models/classifications/{model_id}`
- Notes:
  - overwrites training data and retrains the model
- Confirmed parameters:
  - `model_id`
  - `version`

### 14) Delete classifications model
- Method: `DELETE`
- Path: `/v1/models/classifications/{model_id}`
- Notes:
  - deletes the model and associated customer data/artifacts
- Confirmed parameters:
  - `model_id`
  - `version`

## Important usage notes
- The service automatically detects language if you do not provide the `language` parameter.
- IBM documents HTML cleaning as enabled by default for webpage analysis.
- `xpath` can append selected HTML fragments to the cleaned webpage text; setting `clean=false` lets you focus analysis on XPath-selected content.
- The docs include both synchronous and asynchronous SDK execution guidance, but the REST endpoints themselves are standard HTTP methods.
- Custom categories model routes are explicitly labeled `(Beta)` on the reviewed docs page.

## Verification notes
This file was manually rebuilt from IBM Cloud's official Natural Language Understanding API docs page, including the endpoint URL, authentication, versioning, error-handling, and method sections.