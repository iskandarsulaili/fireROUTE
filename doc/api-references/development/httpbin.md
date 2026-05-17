# Httpbin

## Provider metadata
- Category: `Development`
- Provider slug: `httpbin`
- Docs used manually:
  - `https://httpbin.org/`
- Confirmed base URL: `https://httpbin.org`
- Primary response/content types confirmed from the docs: JSON for most inspection endpoints, plain text for status responses
- Authentication model confirmed from the docs used in this pass: mostly none; the auth demo routes intentionally require Basic or Bearer credentials as part of the test surface
- Manually confirmed routes in this pass: `8`

## Authentication
- Most httpbin endpoints are unauthenticated request/response test utilities.
- The official Swagger UI also documents explicit auth-testing routes:
  - `GET /basic-auth/{user}/{passwd}` expects HTTP Basic Auth credentials matching the path parameters.
  - `GET /bearer` expects an `Authorization` header with a bearer token.
- No API key, OAuth registration flow, or account-level quota setup is documented on the reviewed page.

## Common request/response conventions
- Base URL: `https://httpbin.org`
- The official page reports `[ Base URL: httpbin.org/ ]` with HTTPS selected.
- Most confirmed endpoints return JSON echo payloads describing the request.
- Some route families support multiple verbs; the docs present them as behavior tests rather than business resources.
- The docs group routes into HTTP methods, auth, status codes, request inspection, dynamic data, and other utility categories.

## Manually confirmed endpoint set

### 1) Inspect query parameters on a GET request
- Method: `GET`
- Path: `/get`
- Full URL: `https://httpbin.org/get`
- Purpose: return the request's query parameters and other request metadata as JSON
- Confirmed response media type: `application/json`

### 2) Inspect POST payload handling
- Method: `POST`
- Path: `/post`
- Full URL: `https://httpbin.org/post`
- Purpose: return POST parameters and request metadata as JSON
- Confirmed response media type: `application/json`

### 3) Echo arbitrary requests
- Methods confirmed in the official Swagger UI: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `TRACE`
- Path: `/anything`
- Full URL: `https://httpbin.org/anything`
- Purpose: return anything passed in the request data
- Confirmed response media type: `application/json`
- Important note: the docs also expose `/anything/{anything}` as an additional path variant in the loaded spec, but this pass focused on the base `/anything` route family.

### 4) Return request headers
- Method: `GET`
- Path: `/headers`
- Full URL: `https://httpbin.org/headers`
- Purpose: return the incoming request's HTTP headers
- Confirmed response media type: `application/json`

### 5) Return a chosen status code
- Methods confirmed in the official Swagger UI: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `TRACE`
- Path: `/status/{codes}`
- Full URL: `https://httpbin.org/status/{codes}`
- Purpose: return the supplied status code, or a random status code when more than one code is given
- Path parameters:
  - `codes` - status code selector documented by the Swagger UI
- Confirmed response media type: `text/plain`
- Confirmed response classes listed in the docs:
  - `1xx` informational
  - `2xx` success
  - `3xx` redirection
  - `4xx` client error
  - `5xx` server error

### 6) Return a delayed response
- Methods confirmed in the official Swagger UI: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `TRACE`
- Path: `/delay/{delay}`
- Full URL: `https://httpbin.org/delay/{delay}`
- Purpose: delay the response before returning JSON request data
- Path parameters:
  - `delay` - integer delay value
- Important note from the docs: maximum supported delay is `10` seconds

### 7) Test HTTP Basic authentication
- Method: `GET`
- Path: `/basic-auth/{user}/{passwd}`
- Full URL: `https://httpbin.org/basic-auth/{user}/{passwd}`
- Purpose: prompt for authorization using HTTP Basic Auth and validate against the supplied path values
- Path parameters:
  - `user`
  - `passwd`
- Confirmed outcomes:
  - `200` successful authentication
  - `401` unsuccessful authentication
- Confirmed response media type: `application/json`

### 8) Test bearer authentication
- Method: `GET`
- Path: `/bearer`
- Full URL: `https://httpbin.org/bearer`
- Purpose: validate presence of bearer authentication
- Confirmed header parameter:
  - `Authorization` - bearer token header
- Confirmed outcomes:
  - `200` successful authentication
  - `401` unsuccessful authentication
- Confirmed response media type: `application/json`

## Pagination
- None of the eight confirmed routes document pagination.
- httpbin is a request/response test service rather than a collection-oriented resource API.

## Error handling
- The official Swagger UI does not publish a shared JSON error schema.
- Route-specific error behavior confirmed from the docs:
  - auth demo routes return `401` on failed authentication
  - `/status/{codes}` intentionally emits the selected status code family
- Because many routes are testing tools, some non-2xx outcomes are part of normal expected behavior rather than unexpected failures.

## Rate limits
- The reviewed official httpbin page does not publish a numeric rate-limit or quota policy.
- No `429` guidance, quota headers, or per-account throttling documentation were visible on the official page used in this pass.

## Response format notes
- JSON is the dominant response format for inspection and echo endpoints.
- `/status/{codes}` is documented as `text/plain`.
- Auth and delay routes still return JSON on successful responses in the Swagger UI.

## Important usage notes
- httpbin is primarily a testing surface for HTTP clients, not a business-data API.
- `/delay/{delay}` is explicitly capped at `10` seconds.
- `/anything` is the broadest request-echo surface and supports multiple HTTP methods.
- `/basic-auth/{user}/{passwd}` and `/bearer` are designed for verifying client auth behavior in development/test environments.

## Verification notes
This file was manually rebuilt from the live official httpbin Swagger UI at `https://httpbin.org/`, replacing the earlier placeholder that only captured a single form endpoint.