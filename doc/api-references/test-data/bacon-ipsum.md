# Bacon Ipsum

## Provider metadata
- Category: `Test Data`
- Provider slug: `bacon-ipsum`
- Docs used manually:
  - `https://baconipsum.com/json-api/`
- Confirmed API base URL: `https://baconipsum.com`
- Confirmed endpoint path: `/api/`
- Primary response formats: JSON by default, with optional plain text or HTML output
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
- the official JSON API page documents no authentication requirement
- requests are described as HTTPS `GET` requests

## Common request/response conventions
- Base URL: `https://baconipsum.com`
- Main route: `GET /api/`
- default response: JSON string array of generated paragraphs
- optional output formats: `json` (default), `text`, or `html`
- the API is parameter-driven rather than path-rich

## Manually confirmed endpoint set

### 1) Generate Bacon Ipsum text
- Method: `GET`
- Path: `/api/`
- Full URL: `https://baconipsum.com/api/`
- Purpose: generate meaty lorem ipsum content
- Query parameters confirmed on the official page:
  - `type` - content mode; official page documents `all-meat` for meat only or `meat-and-filler` for mixed filler text
  - `paras` - number of paragraphs; defaults to `5`
  - `sentences` - number of sentences; the docs say this overrides `paras`
  - `start-with-lorem` - pass `1` to start the first paragraph with `Bacon ipsum dolor sit amet`
  - `format` - `json` (default), `text`, or `html`
  - `callback` - shown in the official jQuery JSONP example as `callback=?`
- Response notes:
  - default response is a JSON array of paragraph strings
  - `format=text` returns plain text
  - `format=html` returns HTML

## Pagination
- none documented

## Rate limits
- the reviewed official API page did not publish numeric rate limits

## Error and response notes
- the docs focus on successful generation examples and do not publish a structured error schema
- the official examples show the same route returning different media types based on the `format` query parameter
- the official page also includes a JSONP example using `callback=?`

## Important usage notes
- `sentences` takes precedence over paragraph generation according to the official page
- the API is best modeled as one GET route with multiple output and content-shaping query parameters rather than as separate endpoints
- the docs explicitly describe the response as a JSON string array of paragraphs when using the default format

## Verification notes
This file was manually rebuilt from the official Bacon Ipsum JSON API page using browser inspection.