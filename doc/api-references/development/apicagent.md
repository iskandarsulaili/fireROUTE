# ApicAgent

## Provider metadata
- Category: `Development`
- Provider slug: `apicagent`
- Docs used manually:
  - `https://www.apicagent.com/docs`
- Confirmed REST API base URL: `https://api.apicagent.com`
- Primary media type: JSON
- Authentication: none
- Manually confirmed routes in this pass: `2`

## Authentication
From the official docs page:
- no authentication is required
- both documented routes are publicly callable

## Common request/response conventions
- Base URL: `https://api.apicagent.com`
- response format is JSON
- the same parsing result schema is shown for both GET and POST variants
- the API is purpose-built for parsing one user-agent string per request

## Manually confirmed endpoint set

### 1) Parse a user-agent via query string
- Method: `GET`
- Path: `/`
- Full URL: `https://api.apicagent.com`
- Purpose: parse a user-agent string supplied in the query string
- Query parameters confirmed on the official docs page:
  - `ua` - required user-agent string in URL-encoded form
- Response fields explicitly shown in the official example:
  - `browser_family`
  - `client.engine`
  - `client.engine_version`
  - `client.name`
  - `client.type`
  - `client.version`
  - `device.brand`
  - `device.model`
  - `device.type`
  - `os.name`
  - `os.platform`
  - `os.version`
  - `os_family`
- Important usage notes from the official page:
  - this is the browser-friendly variant because the UA is passed directly in the URL
  - the docs explicitly say the `ua` value must be URL encoded

### 2) Parse a user-agent via JSON body
- Method: `POST`
- Path: `/`
- Full URL: `https://api.apicagent.com`
- Purpose: parse a user-agent string supplied in a JSON request body
- Required request headers confirmed on the official docs page:
  - `Content-Type: application/json`
- Request body fields confirmed on the official docs page:
  - `ua` - user-agent string
- Response fields explicitly shown in the official example:
  - `browser_family`
  - `client.engine`
  - `client.engine_version`
  - `client.name`
  - `client.type`
  - `client.version`
  - `device.brand`
  - `device.model`
  - `device.type`
  - `os.name`
  - `os.platform`
  - `os.version`
  - `os_family`
- Important usage notes from the official page:
  - the docs say this route works exactly like the GET API except the UA is carried in JSON
  - the example request uses a single top-level `ua` field

## Pagination
- none documented
- each reviewed route returns a single parsed user-agent result object

## Rate limits
- the reviewed official docs page did not publish numeric rate limits

## Error and response notes
- the official docs page only exposes successful example payloads
- no dedicated error schema or status-code table was published on the reviewed docs page
- successful responses are JSON objects containing browser, client, device, and OS breakdowns

## Important usage notes
- the docs state both routes are the same API semantically; only the transport of the `ua` input changes
- the response examples use `unknown` string values for fields that cannot be confidently derived
- the site credits `Device Detector`, which helps explain the browser/device taxonomy visible in responses

## Verification notes
This file was manually rebuilt from the official ApicAgent documentation page using browser inspection.