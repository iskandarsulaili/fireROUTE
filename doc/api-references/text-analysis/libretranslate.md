# LibreTranslate

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `libretranslate`
- Docs used manually:
  - `https://libretranslate.com/docs/`
  - `https://libretranslate.com/spec`
- Confirmed base URL: `https://libretranslate.com`
- Primary response/content types confirmed from the docs: JSON for normal API responses, multipart form uploads for file translation requests
- Authentication model confirmed from the docs used in this pass: API key is optional on the public spec for several endpoints via `api_key` form field; the service also exposes `/frontend/settings` to indicate whether keys are required on the current deployment
- Manually confirmed routes in this pass: `6`

## Authentication
LibreTranslate's official Swagger docs describe API key usage as deployment-dependent.

Confirmed auth details from the official docs/spec:
- `POST /detect` accepts optional form field `api_key`
- `POST /translate` accepts optional form field `api_key`
- `POST /translate_file` accepts optional form field `api_key`
- `GET /frontend/settings` returns `keyRequired` and `apiKeys`, which indicate whether the current deployment enforces API keys
- `POST /suggest` does not list an `api_key` field in the reviewed spec and instead documents a `403 Not authorized` failure mode

## Common request/response conventions
- Base URL: `https://libretranslate.com`
- The Swagger UI reports `[ Base URL: / ]`, which resolves to the current host root
- Request parameter style in the official spec: form fields (`formData`), including for standard translation requests
- `POST /translate_file` consumes `multipart/form-data`
- Response bodies are JSON objects/arrays with UTF-8 text content
- Confirmed shared error models from the official spec:
  - `error-response` -> `{ "error": string }`
  - `error-slow-down` -> `{ "error": string }`
- Confirmed common status codes across translation endpoints:
  - `400` invalid request
  - `403` banned or unauthorized depending on endpoint
  - `429` slow down
  - `500` translation/detection error

## Manually confirmed endpoint set

### 1) Detect the language of text
- Method: `POST`
- Path: `/detect`
- Full URL: `https://libretranslate.com/detect`
- Purpose: detect the language of submitted text
- Confirmed form fields:
  - `q` - required text to detect
  - `api_key` - optional
- Confirmed response shape:
  - array of detection objects with `language` and `confidence`

### 2) List supported languages
- Method: `GET`
- Path: `/languages`
- Full URL: `https://libretranslate.com/languages`
- Purpose: retrieve supported languages and target-language mappings
- Confirmed response shape:
  - array of language objects with `code`, `name`, and optional `targets`

### 3) Translate text
- Method: `POST`
- Path: `/translate`
- Full URL: `https://libretranslate.com/translate`
- Purpose: translate one string or an array of strings
- Confirmed form fields:
  - `q` - required; accepts a string or array of strings
  - `source` - required source language code or `auto`
  - `target` - required target language code
  - `format` - optional; `text` or `html`, default `text`
  - `alternatives` - optional integer count of alternative translations, default `0`
  - `api_key` - optional
- Confirmed response fields:
  - `translatedText` - string or array
  - `detectedLanguage` - object or array when detection data is available
  - `alternatives` - optional alternative translations

### 4) Translate a file
- Method: `POST`
- Path: `/translate_file`
- Full URL: `https://libretranslate.com/translate_file`
- Content type: `multipart/form-data`
- Purpose: translate an uploaded file and return a translated-file URL
- Confirmed form fields:
  - `file` - required upload
  - `source` - required source language code or `auto`
  - `target` - required target language code
  - `api_key` - optional
- Confirmed response field:
  - `translatedFileUrl`

### 5) Retrieve frontend/deployment settings
- Method: `GET`
- Path: `/frontend/settings`
- Full URL: `https://libretranslate.com/frontend/settings`
- Purpose: expose runtime/frontend configuration for the current deployment
- Confirmed response fields:
  - `apiKeys`
  - `charLimit`
  - `frontendTimeout`
  - `keyRequired`
  - `language.source`
  - `language.target`
  - `suggestions`
  - `supportedFilesFormat`

### 6) Submit a translation suggestion
- Method: `POST`
- Path: `/suggest`
- Full URL: `https://libretranslate.com/suggest`
- Purpose: submit a suggested improved translation
- Confirmed form fields:
  - `q` - required original text
  - `s` - required suggested translation
  - `source` - required source language code
  - `target` - required target language code
- Confirmed response shape:
  - `{ "success": boolean }`
- Confirmed error behavior:
  - `403` is documented as `Not authorized`

## Pagination
- None of the six official routes confirmed in this pass document pagination.

## Error handling
From the official Swagger spec:
- translation and detection routes use JSON error objects with an `error` field
- `429` is explicitly modeled as a slow-down condition
- `403` may mean `Banned` on translation/detection routes or `Not authorized` on the suggestion route
- `500` is documented for translation/detection failures

## Rate limits
- The reviewed official Swagger UI/spec does not publish a numeric rate-limit policy.
- The presence of documented `429 Slow down` responses confirms throttling exists, but the public spec does not state a requests-per-minute quota.

## Response format notes
- JSON arrays are used for `/detect` and `/languages`
- JSON objects are used for `/translate`, `/translate_file`, `/frontend/settings`, and `/suggest`
- `/translate_file` returns a translated-file URL rather than streaming the translated file body directly in the confirmed spec

## Important usage notes
- this public instance exposes deployment settings through `/frontend/settings`, so clients can check whether API keys are required before assuming anonymous access
- the translation route accepts either a single string or an array for `q`
- HTML translation is explicitly supported through `format=html`
- the file-translation route is multipart, unlike the form-data text-translation route

## Verification notes
This file was manually rebuilt from LibreTranslate's official Swagger UI and official `/spec` document with browser inspection, replacing the earlier generated placeholder.
