# Google Cloud Natural

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `google-cloud-natural`
- Docs used manually:
  - `https://docs.cloud.google.com/natural-language/docs`
  - `https://docs.cloud.google.com/natural-language/docs/reference/rest`
  - `https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/documents/analyzeSentiment`
  - `https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/documents/classifyText`
  - `https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/documents/annotateText`
  - `https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/documents/moderateText`
  - `https://docs.cloud.google.com/natural-language/quotas`
  - `https://docs.cloud.google.com/natural-language/docs/setup`
- Confirmed API service endpoint: `https://language.googleapis.com`
- Primary media type: `application/json`
- Authentication confirmed from official docs: OAuth 2.0 / Application Default Credentials for REST and client-library usage
- Manually confirmed routes in this pass: `5`

## Authentication
From the official setup guide and route reference pages:
- REST usage is authenticated with Google Cloud credentials supplied through the Google Cloud CLI / Application Default Credentials flow.
- The setup guide explicitly directs users to `gcloud auth application-default login` for local user credentials.
- The reviewed v2 method pages list these OAuth scopes:
  - `https://www.googleapis.com/auth/cloud-language`
  - `https://www.googleapis.com/auth/cloud-platform`
- The setup guide also notes the API must be enabled in a Google Cloud project and billing must be enabled for that project.

## Common request/response conventions
- Base URL: `https://language.googleapis.com`
- REST reference page says all listed URIs are relative to that service endpoint.
- The reviewed modern REST surface is under `v2`.
- Requests use JSON bodies.
- The common request object is `Document`; reviewed method pages show it as the required `document` field.
- Successful responses are JSON objects containing feature-specific output plus language metadata.
- The REST docs explicitly note that the URLs use gRPC transcoding syntax.

## Manually confirmed endpoint set

### 1) Analyze sentiment
- Method: `POST`
- Path: `/v2/documents:analyzeSentiment`
- Full URL: `https://language.googleapis.com/v2/documents:analyzeSentiment`
- Purpose: analyze sentiment of the provided text.
- Confirmed request body fields:
  - `document` - required `Document`
  - `encodingType` - optional `EncodingType`
- Confirmed response fields shown on the route page:
  - `documentSentiment`
  - `languageCode`
  - `sentences[]`
  - `languageSupported`

### 2) Analyze entities
- Method: `POST`
- Path: `/v2/documents:analyzeEntities`
- Full URL: `https://language.googleapis.com/v2/documents:analyzeEntities`
- Purpose: find named entities and related properties in the input text.
- Confirmed request body fields from the reviewed REST resource page:
  - `document` - required `Document`
  - `encodingType` - optional `EncodingType`
- Important note from the resource page:
  - the route returns entity types, probability, mentions, and related properties.

### 3) Annotate text
- Method: `POST`
- Path: `/v2/documents:annotateText`
- Full URL: `https://language.googleapis.com/v2/documents:annotateText`
- Purpose: run multiple Natural Language features in one request.
- Confirmed request body fields:
  - `document` - required `Document`
  - `features` - required `Features`
  - `encodingType` - optional `EncodingType`
- Important note from the method page:
  - this is the convenience route that provides all features in one call.

### 4) Classify text
- Method: `POST`
- Path: `/v2/documents:classifyText`
- Full URL: `https://language.googleapis.com/v2/documents:classifyText`
- Purpose: classify a document into content categories.
- Confirmed request body fields:
  - `document` - required `Document`
- Confirmed response fields shown on the route page:
  - `categories[]`
  - `languageCode`
  - `languageSupported`

### 5) Moderate text
- Method: `POST`
- Path: `/v2/documents:moderateText`
- Full URL: `https://language.googleapis.com/v2/documents:moderateText`
- Purpose: moderate a document for harmful and sensitive categories.
- Confirmed request body fields:
  - `document` - required `Document`
  - `modelVersion` - optional `ModelVersion`
- Confirmed response fields shown on the route page:
  - `moderationCategories[]`
  - `languageCode`
  - `languageSupported`

## Parameters and object notes
From the reviewed method pages:
- `document` is the central input object across the sampled v2 routes.
- `encodingType` is used when the API needs to calculate offsets.
- `features` is required for `annotateText` and controls which analyses are enabled.
- `modelVersion` is optional for `moderateText`.
- Response objects consistently include `languageCode`; several reviewed routes also return `languageSupported`.

## Rate limits and content limits
From the official quotas page:
- Requests per minute: `600`
- Requests per day: `800,000`
- Content size limit per request: `1,000,000 bytes`
- Token quota per request: `100,000 tokens`
- Entity mentions limit: `5,000` (overflow result shown as ignored)
- Quotas apply at the Google Cloud project level and are shared across applications and IP addresses in the same project.

## Pagination
- None of the reviewed v2 document-analysis routes are paginated.
- Each reviewed route accepts one request body and returns one JSON result object.

## Error handling
- The reviewed Natural Language route pages did not publish a provider-specific error-code table inline.
- The quotas page explicitly states that exceeding the `1,000,000` byte text-content limit results in an API error.
- The quotas page also states that requests exceeding quota are blocked by Google Cloud.
- Authentication and authorization failures follow Google Cloud's standard authenticated API behavior rather than a Natural-Language-specific custom error format in the reviewed pages.

## Response format notes
- Responses are JSON.
- Feature-specific responses use structured JSON objects and arrays such as `documentSentiment`, `sentences[]`, `categories[]`, and `moderationCategories[]`.
- The REST docs also expose discovery documents for `v2`, `v1`, and `v1beta2`, but this manual pass focused on the current `v2` surface.

## Important usage notes
- The setup guide requires enabling the Cloud Natural Language API before use.
- Billing must be enabled for the Google Cloud project.
- Google recommends using Google-provided client libraries, but the REST service endpoint is fully documented.
- The service supports additional older REST versions (`v1` and `v1beta2`), but the current reference page presents `v2` first.
- Language support is limited to the languages documented on Google's Language Support page.

## Verification notes
This file was manually rebuilt from Google's official documentation, REST reference, route pages, quotas page, and setup guide.