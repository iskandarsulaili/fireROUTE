# Base

## Provider metadata
- Category: `Development`
- Provider slug: `base`
- Docs used manually:
  - `https://www.base-api.io/reference/`
- Confirmed base URL:
  - `https://api.base-api.io/v1`
- Primary response/content types confirmed from the docs: JSON request examples are shown; the rendered page presents the API as a JSON-over-HTTP service
- Authentication model confirmed from the docs used in this pass: Bearer API key in the `Authorization` header
- Manually confirmed routes in this pass: `2`

## Authentication
- The official reference states: `Authorization: Bearer TOKEN`.
- The example request for registration includes that Bearer token header plus `Content-Type: application/json`.
- The reviewed page did not show any OAuth flow, session-cookie auth, or alternate header name.

## Common request/response conventions
- The official page publishes the service base as `https://api.base-api.io/v1`.
- The visible example request uses JSON request bodies.
- The navigation on the official page references `Authentication`, `Emails`, `Images`, `Files`, and `Users`, but in this browser session only two concrete route definitions were visibly rendered on the reference page.

## Manually confirmed endpoint set

### 1) Register a new user
- Method: `POST`
- Path: `/auth/register`
- Purpose: create a new user account
- Confirmed headers:
  - `Authorization: Bearer TOKEN`
  - `Content-Type: application/json`
- Confirmed JSON body fields from the official example:
  - `email`
  - `password`
- Confirmed example target URL:
  - `https://api.base-api.io/v1/auth/register`

### 2) Send an email
- Method: `POST`
- Path: `/emails/send`
- Purpose: send an email through the Base API
- Confirmed parameters/body fields:
  - The reviewed official page exposed the path and purpose text, but it did not reveal the request-body field list in the visible rendered content during this pass.
- Confirmed example target URL:
  - route is presented under the same `https://api.base-api.io/v1` base

## Pagination
- None documented on the reviewed official reference page.

## Error handling
- The reviewed official page did not publish a status-code table, error envelope schema, or retry/backoff guidance in the rendered content visible during this pass.

## Rate limits
- No rate-limit policy or quota guidance was visible on the reviewed official reference page.

## Response format notes
- The visible docs use JSON request examples and present the service as a conventional HTTP API.
- The reviewed page did not expose example response bodies for the two visible operations.

## Important usage notes
- Every reviewed request example includes Bearer authentication, so fireROUTE should assume authenticated access even for registration unless Base publishes a public exception elsewhere.
- The reference navigation implies a larger API surface than the two routes that rendered in this session; additional route details may exist behind sections that did not fully render or were not exposed in the visible page content.

## Blockers / limitations
- The official reference page was reachable, but only `POST /auth/register` and `POST /emails/send` were actually visible in the rendered content obtained in this browser session. I did not invent additional endpoints from the navigation labels alone.
- The `/emails/send` section did not expose request fields or response examples in the visible page content I could confirm manually.

## Verification notes
This file was manually rebuilt from the official Base reference page with browser inspection, replacing the earlier generated placeholder.
