# Lecto Translation

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `lecto-translation`
- Docs used manually:
  - `https://lecto.ai/docs`
  - `https://rapidapi.com/lecto-lecto-default/api/lecto-translation/`
- Confirmed direct API base URL: `https://api.lecto.ai`
- Confirmed RapidAPI proxy base URL: `https://lecto-translation.p.rapidapi.com`
- Primary request/response format confirmed from the reviewed pages: JSON, with optional gzip-compressed responses when `Accept-Encoding: gzip` is sent
- Authentication models confirmed in this pass:
  - direct Lecto API: `X-API-Key`
  - RapidAPI proxy: `x-rapidapi-key` plus `x-rapidapi-host: lecto-translation.p.rapidapi.com`
- Manually confirmed routes in this pass: `5`

## Authentication
The current official Lecto docs expose a direct first-party API, while the official RapidAPI listing documents a proxy surface for the same translation product.

Confirmed auth details:
- direct Lecto API requests must include `X-API-Key: YOUR_API_KEY`
- the official docs say API keys are available from the dashboard after signup
- RapidAPI requests use:
  - `x-rapidapi-key: <your-rapidapi-key>`
  - `x-rapidapi-host: lecto-translation.p.rapidapi.com`
- the RapidAPI page also notes that `Accept-Encoding: gzip` is optional and results in `Content-Encoding: gzip` responses when used

## Common request/response conventions
- direct first-party base URL: `https://api.lecto.ai`
- RapidAPI proxy base URL: `https://lecto-translation.p.rapidapi.com`
- the official docs describe support for text, JSON, and HTML translation
- supported language identifiers include ISO-639-1, some ISO-639-2 codes, and some BCP-47 codes such as `zh-CN`, `zh-TW`, `pt-BR`, and `pt-PT`
- the direct docs confirm 90+ supported languages
- the direct docs' sample validation error explicitly says source text must be at least 1 character and no more than 5000 characters

## Manually confirmed endpoint set

### 1) Translate text
- Method: `POST`
- Path: `/v1/translate/text`
- Full direct URL: `https://api.lecto.ai/v1/translate/text`
- Full RapidAPI proxy URL: `https://lecto-translation.p.rapidapi.com/v1/translate/text`
- Purpose: translate one or more source texts into one or more target languages
- Confirmed request/body fields from the reviewed pages:
  - `texts` - array of source texts
  - `to` - array of target language codes
  - `from` - optional on direct docs; if omitted, source language is auto-detected
- Confirmed response notes from the RapidAPI page:
  - response includes `from`
  - response includes `translated_characters`
  - response includes `translations`, with translated output grouped by target language

### 2) Detect language
- Method: `POST`
- Path: `/v1/detect/text`
- Full direct URL: `https://api.lecto.ai/v1/detect/text`
- Full RapidAPI proxy URL: `https://lecto-translation.p.rapidapi.com/v1/detect/text`
- Purpose: detect the language of supplied text inputs
- Confirmed request/body note:
  - official pages describe sending source text or an array of source texts in the request body
- Confirmed response note:
  - the reviewed official pages describe a JSON response containing detected language codes
- Important docs nuance:
  - the RapidAPI top endpoint badge rendered `GET` in the page chrome during review, but the prose documentation on the same page and the direct official Lecto docs both document this route as `POST`; this file follows the consistent route prose and first-party docs

### 3) Translate JSON payloads
- Method: `POST`
- Path: `/v1/translate/json`
- Full direct URL: `https://api.lecto.ai/v1/translate/json`
- Full RapidAPI proxy URL: `https://lecto-translation.p.rapidapi.com/v1/translate/json`
- Purpose: translate JSON values while preserving structure
- Confirmed request/body fields from the reviewed pages:
  - `to` - required target language array
  - `from` - required source language code for JSON translation
  - `protected_keys` - required array of JSON keys whose values should not be translated
  - `json` - required JSON-formatted string payload
- Confirmed usage note:
  - the docs explicitly say keys remain unchanged while values are translated

### 4) List supported languages
- Method: `GET`
- Path: `/v1/translate/languages`
- Full direct URL: `https://api.lecto.ai/v1/translate/languages`
- Full RapidAPI proxy URL: `https://lecto-translation.p.rapidapi.com/v1/translate/languages`
- Purpose: return the supported translation languages
- Confirmed response note:
  - returns language codes in ISO-639-1, ISO-639-2, or BCP-47 forms

### 5) Get account and subscription info
- Method: `GET`
- Path: `/v1/account/info`
- Full direct URL: `https://api.lecto.ai/v1/account/info`
- Purpose: retrieve current account plan, usage, and subscription-status information
- Important note:
  - this route is documented on the direct first-party Lecto docs page but was not listed in the RapidAPI route block reviewed in this pass

## Pagination
- None of the five reviewed routes document pagination.
- The reviewed official pages describe these as single-response translation, detection, language-list, and account-info endpoints.

## Error handling
From the first-party Lecto docs and the official RapidAPI page:
- direct docs explicitly document:
  - `200` success
  - `400` invalid input parameters
  - `401` invalid or missing API key
  - `404` endpoint does not exist
  - `429` rate limit exceeded
  - `500-504` server-side failures
- the RapidAPI page additionally describes:
  - `405` wrong HTTP method
- both reviewed surfaces describe a JSON error envelope containing:
  - `status`
  - `details`
- the direct docs' example error shows field-level validation detail such as invalid `from`, invalid `to`, and invalid source-text length

## Rate limits
- the direct first-party docs confirm throttling through documented `429 Too Many Requests`, but they do not publish a numeric requests-per-second table on the page reviewed in this pass
- the official RapidAPI listing does publish plan-level request rates:
  - Basic: `1 request/second`
  - Pro: `1 request/second`
  - Ultra: `2 requests/second`
  - Mega: `4 requests/second`
- the RapidAPI overview also explicitly says the free plan is limited to `1 request per second`

## Response format notes
- direct docs position the service as a simple REST JSON API
- the RapidAPI listing documents JSON success responses and JSON error responses
- optional gzip response compression is supported when the client sends `Accept-Encoding: gzip`
- the official docs advertise HTML translation support, but the reviewed landing pages did not expose a separate dedicated HTML route or a first-party parameter table explaining how HTML mode is selected on the direct endpoint page

## Important usage notes
- use `https://api.lecto.ai` when integrating directly with Lecto and `https://lecto-translation.p.rapidapi.com` only when integrating through RapidAPI
- JSON translation requires an explicit `from` source language and a `protected_keys` array according to the reviewed official docs
- the current direct docs expose an account-information route that is absent from the reviewed RapidAPI route summary, so the direct first-party docs are the better canonical source for the current API surface
- supported language codes include a mix of ISO-639-1, ISO-639-2, and BCP-47 identifiers rather than one single code system

## Verification notes
This file was manually rebuilt from Lecto's current first-party docs at `lecto.ai/docs` plus the official RapidAPI provider page, replacing the earlier unrelated-content blocker note.