# Evil Insult Generator

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `evil-insult-generator`
- Docs used manually:
  - `https://evilinsult.com/api/`
- Confirmed API base URL: `https://evilinsult.com`
- Primary response formats confirmed from the official page: plain text, `application/json`, and XML
- Authentication model: none documented on the reviewed official page
- Manually confirmed routes in this pass: `1`

## Authentication
- The official API page documents the service as public and unauthenticated.
- No API key, OAuth flow, session token, or signed-request scheme is described.

## Common request/response conventions
- Base URL: `https://evilinsult.com`
- The official docs expose one insult-generation route.
- The `type` query parameter controls output format:
  - `text`
  - `XML`
  - `JSON`
- If `type` is omitted, the official page says the default response is plain text.
- If `lang` is omitted, the official page says the default language is English.

## Manually confirmed endpoint set

### 1) Generate an insult
- Method: `GET`
- Path: `/generate_insult.php`
- Full example from the official docs:
  - `https://evilinsult.com/generate_insult.php?lang=en&type=json`
- Purpose: generate an insult string in the requested language and output format
- Confirmed query parameters:
  - `lang` - optional language selector; defaults to English if omitted
  - `type` - optional response format selector; supports `text`, `XML`, and `JSON`; defaults to plain text if omitted
- Confirmed request body: none
- Confirmed success response notes:
  - the JSON example is returned with `Content-Type: application/json`
  - the JSON example includes these response fields:
    - `number`
    - `language`
    - `insult`
    - `created`
    - `shown`
    - `createdby`
    - `active`
    - `comment`

## Pagination
- None documented on the reviewed official page.

## Rate limits
- No numeric rate-limit policy is published on the reviewed official page.

## Error handling
- The official page shows only a success response and does not publish a structured error schema.
- The reviewed page labels outcomes at a high level as `2XX` and `4XX`, but does not define a detailed status-code table.

## Response format notes
- Plain-text responses are the documented default when `type` is omitted.
- JSON responses are explicitly documented and include insult metadata in addition to the insult text.
- XML is listed as a supported output format on the official page.

## Important usage notes
- This provider is a single-route utility API rather than a large REST surface.
- The docs are route-light and parameter-focused; no auth, pagination, or quota model is published.

## Verification notes
This file was manually rebuilt from the current official Evil Insult Generator API page, replacing the earlier generated summary.
