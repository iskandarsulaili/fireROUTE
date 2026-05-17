# English Random Words

## Provider metadata
- Category: `Test Data`
- Provider slug: `english-random-words`
- Docs used manually:
  - `https://random-words-api.vercel.app/`
  - `https://random-words-api.vercel.app/swagger-ui-init.js`
  - `https://random-words-api.vercel.app/word`
- Confirmed API base URL: `https://random-words-api.vercel.app`
- Primary media type: `application/json`
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `3`

## Authentication
From the official Swagger UI root and embedded OpenAPI document:
- no API key, bearer token, OAuth flow, or account requirement is documented
- the reviewed routes are public `GET` endpoints

## Common request/response conventions
- Public deployment base URL: `https://random-words-api.vercel.app`
- The embedded official OpenAPI document identifies the API as `Random Words API` version `1.0.0`.
- The embedded OpenAPI server list still references `http://localhost:3000` as a development server, but the live official deployment currently serves the documented routes from the Vercel host.
- The reviewed responses are JSON.
- The direct `GET /word` request returned a JSON object with:
  - `word`
  - `definition`
  - `pronunciation`
- No official rate-limit policy was published in the reviewed Swagger UI or embedded OpenAPI document.

## Manually confirmed endpoint set

### 1) Get a random English word
- Method: `GET`
- Path: `/word`
- Full URL: `https://random-words-api.vercel.app/word`
- Purpose: return a random English word with definition and pronunciation
- Response fields shown by the live official response and the embedded OpenAPI doc:
  - `word`
  - `definition`
  - `pronunciation`

### 2) Get a random English word for a part of speech
- Method: `GET`
- Path: `/word/english/{pos}`
- Full URL pattern: `https://random-words-api.vercel.app/word/english/{pos}`
- Path parameters:
  - `{pos}`: part of speech such as noun, verb, adjective, etc.
- Purpose: return an English word filtered by part of speech

### 3) Get a random word for a supported language
- Method: `GET`
- Path: `/word/{language}`
- Full URL pattern: `https://random-words-api.vercel.app/word/{language}`
- Path parameters:
  - `{language}`
- Supported language values published in the embedded OpenAPI schema:
  - `spanish`
  - `french`
  - `dutch`
  - `japanese`
  - `chinese`
  - `turkish`
- Purpose: return a random word and definition for the selected language

## Parameters
- `pos` on `/word/english/{pos}`
- `language` on `/word/{language}`
- no query parameters were published on the reviewed official OpenAPI doc

## Pagination
- none documented

## Rate limits
- no official rate-limit numbers were published on the reviewed Swagger UI root or embedded OpenAPI doc

## Error and response notes
- the embedded OpenAPI doc publishes `500` server-error responses on all three routes
- the `/word/{language}` route also publishes a `404` response for unsupported languages
- the live direct call to `/word` returned JSON rather than HTML, confirming the route itself is the API response surface

## Important usage notes
- the live official deployment and the embedded OpenAPI server list do not match exactly: the spec still lists a localhost development server, while the actual public deployment is on Vercel
- because the provider exposes Swagger UI at the site root, the root URL functions as the current official API reference surface
- consumers should treat the Vercel hostname as the current production host and the localhost server entry as documentation residue

## Verification notes
This file was manually rebuilt from the official Swagger UI root, the embedded Swagger init document, and a direct call to the public `/word` endpoint using browser inspection only. The `3` routes above were directly visible in the first-party OpenAPI content.