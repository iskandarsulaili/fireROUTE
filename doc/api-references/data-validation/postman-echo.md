# Postman Echo

Official docs manually reviewed:
- https://www.postman-echo.com
- redirected official published collection page at `https://www.postman.com/postman/published-postman-templates/documentation/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65?ctx=documentation`

## Overview
Postman Echo is a public testing/inspection service for HTTP clients. The reviewed official published documentation exposes request-echo and header-inspection endpoints useful for validating methods, query strings, headers, and request bodies.

Confirmed from the reviewed official docs:
- Base URL: `https://postman-echo.com`
- Authentication: none required for the confirmed core echo/header routes below
- Primary response format: JSON echoes of request data
- Purpose: debugging and testing HTTP clients rather than production data retrieval

## Authentication
For the confirmed route surface below, the reviewed docs do **not** require authentication.

The official published collection page does contain an `Authentication Methods` section heading, but during manual review the browser-visible route details that loaded for the public collection clearly surfaced only the seven concrete core routes documented below. I therefore counted only the routes that were actually visible and confirmable from the official published docs page.

## Confirmed endpoints
The reviewed official published collection page visibly documents these routes.

| Method | Path |
|---|---|
| GET | `/get` |
| POST | `/post` |
| PUT | `/put` |
| PATCH | `/patch` |
| DELETE | `/delete` |
| GET | `/headers` |
| GET | `/response-headers` |

Manual route count confirmed from the reviewed official docs: **7**.

## Important parameters and request notes
Confirmed from the reviewed official docs:
- `GET /get` echoes query-string parameters and request headers
- the official example uses `foo1=bar1` and `foo2=bar2`
- `POST /post` echoes query parameters plus request-body content
- the docs explicitly mention common body MIME types including:
  - `multipart/form-data`
  - `application/x-www-form-urlencoded`
  - `application/json`
- `POST /post`, `PUT /put`, `PATCH /patch`, and `DELETE /delete` are all shown as accepting request bodies and returning debug information about headers, query arguments, and body content
- `GET /headers` returns the request headers it received
- `GET /response-headers` turns query parameters into response headers
- the reviewed official example for `/response-headers` shows use cases such as `?foo1=bar1&foo2=bar2` and `?Content-Type=text/html`

## Pagination
The reviewed official docs do **not** publish pagination for Postman Echo.

This matches the product’s role as an echo/debug utility rather than a collection-listing API.

## Errors
The reviewed official docs page does not publish a dedicated error-code table for the confirmed endpoints.

Because Postman Echo is primarily a request-inspection utility, the official examples focus on successful echo responses rather than normative error schemas. fireROUTE should therefore treat error handling as standard HTTP behavior rather than as a provider-specific structured contract.

## Rate limits
The reviewed official published docs do **not** publish a specific quota or rate-limit policy for the confirmed routes.

## Response format
Confirmed from the reviewed official examples:
- core echo endpoints return JSON bodies
- echoed fields include items such as `args`, `headers`, `url`, `data`, `form`, `files`, and `json` depending on method/body style
- `/response-headers` can alter response headers using query parameters, and the returned body may reflect the requested content type

Confirmed example response fields seen on the official page include:
- `args`
- `headers`
- `url`
- `data`
- `form`
- `files`
- `json`

## Important usage notes
- Postman Echo is best treated as a testing endpoint, not as a normal business-data provider.
- The docs explicitly frame the service as a way to test REST clients and sample API calls.
- `/response-headers` is useful for testing client handling of arbitrary response-header values.
- The visible published docs are centered on method/debug demonstrations; only the seven concrete routes above were confirmable during this manual browser review.

## fireROUTE notes
- This provider is mainly useful for diagnostics, contract tests, and request-shape validation.
- Preserve the simple method-oriented routes exactly as documented.
- Do not over-assume hidden auth/demo routes from section titles alone; only the seven routes above were directly confirmable from the reviewed official published collection.
