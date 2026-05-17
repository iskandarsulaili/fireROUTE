# ImprovMX

Official docs manually reviewed:
- https://improvmx.com/api/

## Overview
ImprovMX provides a REST API for managing forwarding domains, aliases, rules, SMTP credentials, outbound mail, logs, and templates.

Confirmed from the reviewed official docs:
- Base URL: `https://api.improvmx.com/v3`
- Current version: `v3`
- `v2` is marked deprecated and removed as of June 1, 2024
- Authentication: HTTP Basic auth using username `api` and the API key as the password
- Response format: JSON

## Authentication
The official docs instruct users to fetch an API key from the dashboard and authenticate using HTTP Basic auth.

Confirmed example from the docs:

```bash
export API_KEY="your_api_key_here"
curl https://api.improvmx.com/v3/domains \
  -H "Authorization: Basic api:$API_KEY"
```

The prose on the reviewed page explicitly says:
- use HTTP Basic auth
- username is `api`
- password is your API key

## Confirmed endpoints
The reviewed v3 reference page exposes these current routes.

| Method | Path |
|---|---|
| GET | `/account` |
| GET | `/account/whitelabels` |
| GET | `/domains` |
| POST | `/domains` |
| GET | `/domains/:domain` |
| PUT | `/domains/:domain` |
| GET | `/domains/:domain/check` |
| DELETE | `/domains/:domain` |
| GET | `/domains/:domain/aliases` |
| GET | `/domains/:domain/aliases/:alias` |
| POST | `/domains/:domain/aliases` |
| POST | `/domains/:domain/aliases/batch` |
| PUT | `/domains/:domain/aliases/:alias` |
| POST | `/domains/:domain/aliases/bulk` |
| PUT | `/domains/:domain/aliases/batch` |
| DELETE | `/domains/:domain/aliases/:alias` |
| DELETE | `/domains/:domain/aliases/batch` |
| DELETE | `/domains/:domain/aliases/aliases-all` |
| GET | `/domains/:domain/rules` |
| POST | `/domains/:domain/rules` |
| POST | `/domains/:domain/rules/batch` |
| GET | `/domains/:domain/rules/:rule` |
| PUT | `/domains/:domain/rules/:rule` |
| POST | `/domains/:domain/rules/bulk` |
| PUT | `/domains/:domain/rules/batch` |
| DELETE | `/domains/:domain/rules/:rule` |
| DELETE | `/domains/:domain/rules/batch` |
| DELETE | `/domains/:domain/rules-all` |
| GET | `/domains/:domain/logs` |
| GET | `/domains/:domain/logs/:alias` |
| GET | `/domains/:domain/logs/search` |
| GET | `/domains/:domain/credentials` |
| POST | `/domains/:domain/credentials` |
| PUT | `/domains/:domain/credentials/:username` |
| DELETE | `/domains/:domain/credentials/:username` |
| POST | `/domains/:domain/emails/outbound` |
| GET | `/domains/:domain/emails/outbound/:message_id` |
| GET | `/domains/:domain/templates` |
| GET | `/domains/:domain/templates/:name` |
| POST | `/domains/:domain/templates` |
| PUT | `/domains/:domain/templates/:name` |
| DELETE | `/domains/:domain/templates/:name` |

Manual route count confirmed from the official docs: **42**.

## Important parameters and request notes
Confirmed on the reviewed page:
- `:domain`, `:alias`, `:rule`, `:username`, `:message_id`, and `:name` are path placeholders used throughout the API
- `GET /domains` supports:
  - `q` — filter domains by substring
  - `is_active` — restrict to active (`1`) or inactive (`0`) domains
  - `limit` — number of domains, default `50`, max `100`
  - `page` — 1-based page number
- `GET /domains/:domain/logs/search` supports:
  - `filter` — `all` or `failure`
  - `text` — case-insensitive search on subject/sender/recipient/destination
  - `order` — `desc` or `asc`
  - `after` — required Unix seconds lower bound
  - `before` — required Unix seconds upper bound

## Pagination
The reviewed docs explicitly document page-based pagination for domain listings:
- `limit`
- `page`
- response fields include `total`, `limit`, and `page`

The official `GET /domains` example also notes that embedded alias lists are limited to 200 aliases per domain and recommends the dedicated aliases endpoint for more.

## Errors
The official docs publish this error-code table:
- `200` — Success
- `400` — Bad Request; incorrect or missing parameter
- `401` — Authentication required; missing or invalid credentials
- `403` — Forbidden; missing permissions (for example premium-only capability)
- `500` — Server error

The docs also show JSON error responses. Confirmed example:

```json
{
  "errors": {
    "email": [
      "You cannot use your domain in your email."
    ]
  },
  "success": false
}
```

## Response format
Confirmed from the reviewed docs:
- responses are JSON
- success responses commonly include `success: true`
- collection endpoints return named arrays like `domains`, `logs`, `whitelabels`, etc.

Confirmed example response structures include:
- account object with plan and limits
- paginated domain list with `total`, `limit`, `page`
- log/event responses with nested `events`

## Rate limits
The reviewed official docs do **not** publish a dedicated global rate-limit section.

However, the `GET /account` example response includes an account `limits` object containing a `ratelimit` field. Because that value appears inside an example account payload instead of a normative rate-limit section, fireROUTE should treat it as indicative rather than a guaranteed universal contract.

## Important usage notes
- The reviewed docs clearly mark `v2` as removed; fireROUTE should target `v3` only.
- Domain management, forwarding aliases, rules, SMTP credentials, outbound sending, logs, and templates are all part of the same authenticated surface.
- Logs search uses Unix seconds rather than ISO timestamps.
- The API is operationally rich and provider-specific; this is not just a simple alias CRUD API.

## fireROUTE notes
- Preserve ImprovMX as a full administrative provider rather than reducing it to just aliases.
- Normalize auth as HTTP Basic with username `api`, but keep provider-specific route groups intact.
- The most generally useful capabilities are domains, aliases, logs, and outbound email; templates/rules/credentials can remain advanced passthrough features.
