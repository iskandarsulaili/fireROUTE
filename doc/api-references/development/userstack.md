# Userstack

## Provider metadata
- Category: `Development`
- Provider slug: `userstack`
- Docs used manually:
  - `https://userstack.com/`
  - `https://docs.apilayer.com/userstack/docs/api-documentation`
- Confirmed REST API base URL: `https://api.userstack.com`
- Primary media types: JSON by default, optional XML, optional JSONP wrapper on single-lookups
- Authentication model surfaced in docs: API access key via required `access_key` query parameter
- Manually confirmed routes in this pass: `2`

## Authentication
From the official docs:
- every request requires `access_key`
- the reviewed docs did not publish a header-based bearer-token alternative
- the homepage and docs position the API as HTTPS-capable and key-based rather than OAuth-based

## Common request/response conventions
- Base URL: `https://api.userstack.com`
- both documented operations use the same path: `/detect`
- single lookups use `GET`
- bulk lookups use `POST`
- default output is JSON, with XML also documented
- the docs also expose response-shaping controls:
  - `fields` for partial responses
  - `legacy=1` for the old response shape
  - `output=json|xml`
- single-lookups additionally document `callback` for JSONP

## Manually confirmed endpoint set

### 1) Single User-Agent lookup
- Method: `GET`
- Path: `/detect`
- Full URL: `https://api.userstack.com/detect`
- Purpose: parse one User-Agent string into browser/device/OS/crawler metadata
- Query parameters confirmed in docs:
  - `access_key` - required API key
  - `ua` - required User-Agent string to analyze
  - `callback` - optional JSONP callback function name
  - `fields` - optional comma-separated field selector such as `type,device.name`
  - `legacy` - optional `0|1` legacy-format toggle
  - `output` - optional `json` or `xml`
- Response notes confirmed in docs:
  - top-level keys always include `ua`, `type`, `brand`, `name`, and `url`
  - optional nested modules include `os`, `device`, `browser`, and `crawler`

### 2) Bulk User-Agent lookup
- Method: `POST`
- Path: `/detect`
- Full URL: `https://api.userstack.com/detect`
- Purpose: parse multiple User-Agent strings in one request
- Query parameters confirmed in docs:
  - `access_key` - required API key
  - `fields` - optional partial-response selector
  - `legacy` - optional `0|1`
  - `output` - optional `json` or `xml`
- Request body confirmed in docs:
  - `ua_batch[]` - repeated array value containing up to `100` User-Agent strings
- Response notes confirmed in docs:
  - successful bulk responses return an array of `UserAgentResponse` objects, one per submitted UA string

## Pagination
- none documented
- bulk operation size is controlled by the documented `ua_batch[]` cap of `100` items rather than by pagination

## Rate limits and quotas
- the reviewed docs pages did not publish a per-minute throttle number
- the official marketing/docs surface does explicitly mention a free tier with `100` monthly requests
- bulk lookup is documented as Business-plan-and-higher functionality

## Error and response notes
From the official endpoint pages:
- documented statuses for `GET /detect`:
  - `400`
  - `401`
  - `403`
  - `404`
  - `422`
  - `429`
  - `500`
- documented statuses for `POST /detect`:
  - `400`
  - `401`
  - `403`
  - `422`
  - `429`
  - `500`
- successful single-lookups can return either `application/json` or `application/xml`
- successful bulk examples are shown as JSON arrays
- the schema pages confirm nested response modules for:
  - operating system details (`os`)
  - device details (`device`)
  - browser details (`browser`)
  - crawler/bot details (`crawler`)

## Important usage notes
- Userstack is route-light: both official operations share `/detect` and differ by method/body shape
- `fields` is the main payload-reduction tool for production use
- `legacy=1` exists specifically for backwards-compatible migrations from the older response format
- JSONP is only documented on the single-lookup GET route via `callback`
- the docs explicitly state secure HTTPS support and multi-language integration examples, but do not expose cursoring/pagination patterns

## Verification notes
This file was manually rebuilt from the official Userstack homepage and official APILayer Userstack documentation using browser inspection.