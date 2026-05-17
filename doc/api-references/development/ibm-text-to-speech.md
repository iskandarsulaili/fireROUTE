# IBM Text to Speech

## Provider metadata
- Category: `Development`
- Provider slug: `ibm-text-to-speech`
- Docs used manually:
  - `https://cloud.ibm.com/apidocs/text-to-speech`
  - `https://cloud.ibm.com/docs/text-to-speech/getting-started.html`
- Confirmed REST base URL templates:
  - IBM Cloud: `https://api.{location}.text-to-speech.watson.cloud.ibm.com/instances/{instance_id}`
  - Cloud Pak for Data: `https://{cpd_cluster_host}{:port}/text-to-speech/{deployment_id}/instances/{instance_id}/api`
- Confirmed WebSocket base URL template:
  - `wss://api.{location}.text-to-speech.watson.cloud.ibm.com/instances/{instance_id}`
- Primary formats:
  - JSON for metadata, customization, pronunciation, speaker, and admin routes
  - binary audio streams for synthesis responses
  - WebSocket text messages plus binary audio frames for streaming synthesis
- Authentication models surfaced in the reviewed official docs:
  - IBM Cloud REST examples use Basic auth with `-u "apikey:{apikey}"`
  - Cloud Pak for Data uses an `Authorization` header with a Bearer token
  - Cloud Pak for Data token generation is documented via `POST /v1/authorize`
- Manually confirmed HTTP operations in this pass: `23`
- Additional confirmed streaming transport: `wss://.../v1/synthesize`

## Authentication
- IBM Cloud examples authenticate with service credentials using Basic auth syntax:
  - `-u "apikey:{apikey}"`
- Cloud Pak for Data examples use:
  - an `Authorization` header carrying a Bearer token
- The reviewed docs explicitly mention `POST /v1/authorize` for generating a token from a Cloud Pak for Data user.
- The service base URL comes from the instance credentials page; callers append the method path to the instance URL.

## Common request/response conventions
- IBM Cloud REST instance URL pattern: `https://api.{location}.text-to-speech.watson.cloud.ibm.com/instances/{instance_id}`
- Methods are appended under `/v1/...`.
- REST synthesis supports both plain text and SSML input.
- REST synthesis returns the synthesized audio stream as bytes.
- WebSocket synthesis uses:
  - a WebSocket connection to `/v1/synthesize`
  - JSON text messages for synthesis instructions
  - binary frames for returned audio
- The docs note that the service supports multiple audio MIME types via the `Accept` header or `accept` parameter.

## Manually confirmed HTTP endpoint set
1. `POST /v1/authorize`
   - Cloud Pak for Data token-generation/auth flow
2. `GET /v1/voices`
   - list all available voices
3. `GET /v1/voices/{voice}`
   - fetch a specific voice definition
4. `GET /v1/synthesize`
   - synchronous text-to-speech via query parameters
5. `POST /v1/synthesize`
   - synchronous text-to-speech via JSON request body
6. `GET /v1/pronunciation`
   - get phonetic pronunciation for a word
7. `POST /v1/customizations`
   - create a custom model
8. `GET /v1/customizations`
   - list custom models
9. `POST /v1/customizations/{customization_id}`
   - update a custom model
10. `GET /v1/customizations/{customization_id}`
   - fetch one custom model
11. `DELETE /v1/customizations/{customization_id}`
   - delete a custom model
12. `POST /v1/customizations/{customization_id}/words`
   - add multiple custom words
13. `GET /v1/customizations/{customization_id}/words`
   - list words for a custom model
14. `PUT /v1/customizations/{customization_id}/words/{word}`
   - create or replace one custom word entry
15. `GET /v1/customizations/{customization_id}/words/{word}`
   - fetch one custom word entry
16. `DELETE /v1/customizations/{customization_id}/words/{word}`
   - delete one custom word entry
17. `GET /v1/customizations/{customization_id}/prompts`
   - list prompts for a custom model
18. `GET /v1/customizations/{customization_id}/prompts/{prompt_id}`
   - fetch one prompt asset
19. `DELETE /v1/customizations/{customization_id}/prompts/{prompt_id}`
   - delete one prompt asset
20. `GET /v1/speakers`
   - list speaker models
21. `GET /v1/speakers/{speaker_id}`
   - fetch one speaker model
22. `DELETE /v1/speakers/{speaker_id}`
   - delete one speaker model
23. `DELETE /v1/user_data`
   - delete all data associated with the requesting user

## Confirmed streaming endpoint
- `wss://api.{location}.text-to-speech.watson.cloud.ibm.com/instances/{instance_id}/v1/synthesize`
  - streaming text-to-speech over WebSockets
  - supports SSML `<mark>` plus word timing metadata according to the reviewed official docs

## Parameter and request notes from the reviewed official docs

### Voices
- `GET /v1/voices`
  - no request parameters
  - returns voice metadata such as `name`, `language`, `gender`, `customizable`, `supported_features`, and `description`
- `GET /v1/voices/{voice}`
  - path parameter: `voice`
  - optional query options are documented on the method page

### REST synthesis
- `GET /v1/synthesize`
  - synthesizes text to audio from query parameters
  - key inputs are documented under query parameters, including text and voice selection
  - output format is controlled by `Accept` or the `accept` parameter
- `POST /v1/synthesize`
  - synthesizes text to audio from a JSON body
  - request body type: `SynthesizeOptions`
  - method page documents custom headers plus query parameters
- The docs explicitly say the REST interface accepts a maximum of `8 KB` of input, including text, URL, headers, and any SSML tags.

### Pronunciation
- `GET /v1/pronunciation`
  - required query parameter: `text`
  - optional selectors include `voice` and model-specific options
  - the docs note the default voice fallback behavior for IBM Cloud and Cloud Pak for Data

### Custom models and words
- `POST /v1/customizations`
  - required header: `Content-Type: application/json`
  - request body type: `CreateCustomModel`
  - required body field: `name`
  - optional body fields include `language` and `description`
- Custom-model word routes use `{customization_id}` and optionally `{word}` path variables.
- The reviewed docs describe both sounds-like translations and phonetic translations for custom words.

### Prompts and speakers
- Prompt routes hang off `/v1/customizations/{customization_id}/prompts...`.
- Speaker routes hang off `/v1/speakers...` and manage speaker model resources.

### User data
- `DELETE /v1/user_data`
  - destructive data-deletion endpoint for the caller's stored data

## Pagination
- No pagination mechanism was surfaced in the reviewed official Text to Speech method pages.
- The confirmed HTTP surface is primarily small metadata lists and direct resource-management routes rather than cursor- or page-driven collections.

## Rate limits and quotas
- No explicit numeric request-per-second rate limit was surfaced in the reviewed official IBM Text to Speech API docs.
- Explicit documented size/usage limits found during review include:
  - REST synthesis input max: `8 KB`
  - WebSocket text/SSML message max: `5 KB`
  - some audio formats require or restrict sampling-rate values

## Error and response notes
- The reviewed `GET /v1/voices` page explicitly documents these statuses:
  - `200 OK`
  - `406 Not Acceptable`
  - `415 Unsupported Media Type`
  - `500 Internal Server Error`
  - `503 Service Unavailable`
- Synthesis endpoints return binary audio content rather than JSON payloads.
- Metadata endpoints return JSON objects and collections.
- WebSocket synthesis returns streamed audio plus optional marks/timing metadata described in the official docs.

## Response format notes
- `GET /v1/voices` returns a JSON object containing a `voices` array.
- Voice detail, pronunciation, custom-model, word, prompt, and speaker routes are documented as JSON responses.
- `GET /v1/synthesize` and `POST /v1/synthesize` return audio bytes in the requested MIME type.

## Important usage notes
- IBM Cloud and Cloud Pak for Data use different base URL templates and auth schemes; callers must choose the correct pattern for their deployment.
- The instance URL comes from service credentials rather than a single universal hostname copied blindly across accounts.
- The WebSocket transport is not just a duplicate of the REST surface: it also supports marker events and word timing data.
- REST and WebSocket synthesis support both plain text and SSML, but the documented size limits differ (`8 KB` REST vs `5 KB` WebSocket messages).
- Audio format negotiation is central to correct client behavior; callers should set `Accept` carefully.

## Verification notes
This file was manually rebuilt from the official IBM Cloud Text to Speech API docs and the linked official getting-started documentation.