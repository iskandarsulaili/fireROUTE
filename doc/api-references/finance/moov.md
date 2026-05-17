# Moov

Official docs manually reviewed:
- https://docs.moov.io/api/
- https://docs.moov.io/api/authentication/access-tokens/
- https://docs.moov.io/api/moov-accounts/accounts/
- https://docs.moov.io/api/rate-limits/
- https://docs.moov.io/api/errors/

## Overview
Moov is a money-movement platform API spanning onboarding, accounts, payment sources, transfers, invoicing, wallets, enrichment, and tooling.

From the current official API docs reviewed in-browser:
- Global base URL: `https://api.moov.io`
- API style: HTTPS JSON API
- Versioning: `X-Moov-Version` header; reviewed docs version was `v2026.04.00`
- If the version header is omitted, the reviewed overview says the server defaults to `v2024.01.00`

The reviewed pages in this manual pass confirmed **10 concrete routes**:
- 8 account-management routes from the Accounts page
- 2 OAuth/token routes from the Access Tokens page

## Authentication
Moov uses bearer-token auth for API calls.

Confirmed from the reviewed docs:

```http
Authorization: Bearer {token}
X-Moov-Version: v2026.04.00
Accept: application/json
```

### Access-token endpoints
The official access-token page confirms these routes:

| Method | Path | Purpose |
|---|---|---|
| POST | `/oauth2/token` | Create or refresh an access token |
| POST | `/oauth2/revoke` | Revoke an access token |

Confirmed request details for `POST /oauth2/token` from the reviewed page:
- body content type: `application/json`
- `grant_type` required; reviewed values: `client_credentials`, `refresh_token`
- `client_id` may be sent in the body or as HTTP Basic username
- `client_secret` may be sent in the body or as HTTP Basic password
- `refresh_token` required when `grant_type=refresh_token`
- `scope` is required for `client_credentials` grant

Confirmed response fields:
- `token_type` — reviewed value `Bearer`
- `access_token`
- `refresh_token`
- `expires_in`
- `scope`

Reviewed status codes on the token page:
- `200`
- `400`
- `422`
- `429`
- `500`
- `504`

## Confirmed account endpoints
The official Accounts page confirms these routes.

| Method | Path | Purpose |
|---|---|---|
| POST | `/accounts` | Create an account |
| POST | `/accounts/{accountID}/connections` | Share account connection |
| GET | `/accounts/{accountID}/tos-token` | Generate a terms-of-service token |
| GET | `/accounts` | List accounts |
| GET | `/accounts/{accountID}/connected-accounts` | List connected accounts |
| GET | `/accounts/{accountID}` | Retrieve an account |
| PATCH | `/accounts/{accountID}` | Update an account |
| DELETE | `/accounts/{accountID}` | Delete an account |

Manual route count confirmed from the reviewed pages: **10**.

## Confirmed parameter and request details

### `POST /oauth2/token`
Confirmed request body fields:
- `grant_type` required
- `client_id`
- `client_secret`
- `refresh_token`
- `scope`

The reviewed page explicitly says the route is used to **create or refresh** an access token.

### Accounts route family
The reviewed Accounts page confirms the path parameter name:
- `accountID`

The page also confirms the account resource family is split between:
- collection routes on `/accounts`
- individual account routes on `/accounts/{accountID}`
- related resource routes such as `/connections`, `/tos-token`, and `/connected-accounts`

## Rate limits
The reviewed rate-limit guide explicitly states:
- production accounts: **40 requests/second per account ID per IP address**
- test accounts: **10 requests/second per account ID**
- `429` is returned when the limit is exceeded
- the `429` response header indicates how long to wait before retrying
- Moov can raise limits on request for qualifying use cases

## Pagination
The reviewed excerpts for this pass did not expose one global page/offset contract. For fireROUTE purposes, treat pagination and list filtering as endpoint-specific and confirm per resource family during implementation.

## Errors
The reviewed error-handling guide confirms:
- successful calls generally return `2xx`
- input problems generally return `4xx`
- `5xx` indicates Moov-side degraded or rare server problems

The reviewed page also documents domain-specific tables for transfers, capabilities, card acceptance, and bank-account flows.

Notable reviewed examples:
- transfer creation may return `201 Created`
- transfer acceptance/deferred states may return `202 Accepted`
- `429` is used for rate limiting, per the rate-limit guide

## Response format
Confirmed from the reviewed pages:
- request bodies are JSON on the token endpoint and Moov API routes generally
- responses are JSON
- version negotiation happens via `X-Moov-Version`
- response headers include `x-request-id` on token responses

## Important usage notes
- Moov's version header matters; the reviewed docs explicitly warn that omitting it can target an older default version.
- Account IDs are first-class path identifiers across the platform.
- Token acquisition supports both body-supplied client credentials and HTTP Basic auth transport.
- Rate limits are keyed by both IP and account ID, which is important for multi-tenant fireROUTE deployments.
- The overall API is far broader than the 10 routes confirmed in this pass; this rewrite intentionally documents the cross-cutting auth model plus the currently reviewed accounts/token surface.

## fireROUTE notes
- Treat Moov as a finance/payments platform rather than a narrow market-data API.
- Good normalized entry points are `POST /oauth2/token`, `POST /accounts`, `GET /accounts`, and `GET /accounts/{accountID}`.
- Preserve the `X-Moov-Version` header as required provider metadata in adapters.
- Keep account-scoped rate limiting in mind when multiplexing multiple fireROUTE customers through a shared Moov account.
