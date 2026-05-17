# PurgoMalum

Official docs manually reviewed:
- https://www.purgomalum.com/

## Overview
PurgoMalum is a simple profanity-filtering web service that removes or detects profane content in input text.

Confirmed from the official site reviewed in the browser:
- Base service path: `https://www.purgomalum.com/service`
- Authentication: none documented
- Supported response styles: plain text, XML, and JSON
- Request style: HTTP `GET` with query-string parameters

## Authentication
No API key, OAuth flow, or HTTP-auth requirement is documented on the official site.

## Confirmed endpoints
The official "Response Types" table and usage examples expose four request-type paths under `/service`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/service/containsprofanity` | Return `true`/`false` depending on whether the input contains profanity |
| GET | `/service/xml` | Return filtered text as XML |
| GET | `/service/json` | Return filtered text as JSON |
| GET | `/service/plain` | Return filtered text as plain text |

Manual route count confirmed from the official site: **4**.

## Request parameters
The reviewed official parameter table lists these query parameters:

| Parameter | Required | Notes |
|---|---|---|
| `text` | Yes | Input text to process |
| `add` | No | Comma-separated extra blocked words; accepts up to 10 words or 200 characters |
| `fill_text` | No | Replacement text for blocked words; maximum 20 characters |
| `fill_char` | No | Single replacement character repeated to the blocked-word length |

## Endpoint details

### `GET /service/containsprofanity`
Official description: returns `true` if input text contains profanity and `false` otherwise.

Confirmed example:
- `https://www.purgomalum.com/service/containsprofanity?text=this is some test input`

Response type:
- plain text

### `GET /service/xml`
Returns processed input text as XML.

Confirmed example:
- `https://www.purgomalum.com/service/xml?text=this is some test input`

Confirmed success example:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<PurgoMalum xmlns="http://www.purgomalum.com">
  <result>this is some test input</result>
</PurgoMalum>
```

### `GET /service/json`
Returns processed input text as JSON.

Confirmed example:
- `https://www.purgomalum.com/service/json?text=this is some test input`

Confirmed success example:

```json
{"result":"this is some test input"}
```

### `GET /service/plain`
Returns processed input text as plain text.

Confirmed example:
- `https://www.purgomalum.com/service/plain?text=this is some test input`

## Error handling
The official site documents an XML error response shape when invalid parameters are supplied.

Confirmed behavior:
- the normal `result` element is omitted
- an `error` element is returned instead

Confirmed example request:
- `https://www.purgomalum.com/service/xml?text=this is some test input&fill_text=this is curiously long replacement text`

Confirmed example response:

```xml
<PurgoMalum xmlns="http://www.purgomalum.com">
  <error>User Replacement Text Exceeds Limit of 20 Characters.</error>
</PurgoMalum>
```

## Rate limits
No rate-limit or quota policy is published on the reviewed official site.

## Pagination
Not applicable.

## Response format
Confirmed from the official docs:
- `/service/containsprofanity` returns plain text boolean output
- `/service/plain` returns plain text filtered content
- `/service/json` returns JSON with a `result` field
- `/service/xml` returns XML with a `result` field

## Important usage notes
- The service recognizes common character substitutions used to evade profanity filters (for example `@` as `a` and `$` as `s`).
- The official docs say PurgoMalum maintains both a profanity list and a safe-word list to avoid false positives on innocent words containing profane substrings.
- `fill_text` and `fill_char` are mutually useful customization knobs depending on whether you want a fixed replacement string or a length-preserving mask.

## fireROUTE notes
- This provider is a lightweight unauthenticated GET API and is straightforward to expose as a text-sanitization utility.
- Keep all four output-style routes available because the official service treats them as distinct entry points rather than content negotiation variants.
