# Zoho Books

Official docs manually reviewed:
- https://www.zoho.com/books/api/v3/introduction/
- https://www.zoho.com/books/api/v3/oauth/
- https://www.zoho.com/books/api/v3/organizations/

## Overview
Zoho Books is a large OAuth-protected accounting API. The current official docs expose a broad module catalog, but this manual rewrite only counts the concrete auth and organization-management routes that were directly confirmed during this pass.

## Confirmed base URLs
From the official OAuth and API-call examples:
- OAuth/accounts host: `https://accounts.zoho.com`
- API host from token responses/examples: `https://www.zohoapis.com`
- Books API base shown in examples: `https://www.zohoapis.com/books/v3`

The OAuth docs also note that `{Accounts_URL}` can vary by Zoho data center.

## Confirmed authentication model
The official docs currently require OAuth 2.0.

Confirmed details from the reviewed pages:
- access/refresh token exchange uses `POST {Accounts_URL}/oauth/v2/token`
- revocation uses `POST {Accounts_URL}/oauth/v2/token/revoke`
- API calls must send the access token in the header only
- required header format: `Authorization: Zoho-oauthtoken {access_token}`
- token responses include `access_token`, `refresh_token` (when applicable), `api_domain`, `token_type`, and `expires_in`

## Confirmed routes
| Method | Path | Purpose | Confirmed parameters/body |
|---|---|---|---|
| POST | `/oauth/v2/token` | Exchange authorization code for tokens | `grant_type=authorization_code`, `client_id`, `client_secret`, `redirect_uri`, `code` |
| POST | `/oauth/v2/token` | Refresh an access token | `grant_type=refresh_token`, `refresh_token`, `client_id`, `client_secret` |
| POST | `/oauth/v2/token/revoke` | Revoke an access or refresh token | `token` |
| POST | `/books/v3/organizations` | Create an organization | JSON body including `name`, `currency_code`, `time_zone`, `portal_name`, optional address/fiscal/language fields |
| GET | `/books/v3/organizations` | List organizations | no required path params confirmed |
| PUT | `/books/v3/organizations/{organization_id}` | Update an organization | path param `organization_id`; JSON body fields such as `name`, `fiscal_year_start_month`, `time_zone`, `language_code`, `contact_name`, `email`, `currency_id`, `custom_fields` |
| GET | `/books/v3/organizations/{organization_id}` | Get organization details | path param `organization_id` |

Manual route count confirmed directly from the reviewed official pages: **7** routes.

## Confirmed response and error notes
Reviewed examples show a common JSON wrapper style such as:
- `code`
- `message`
- resource object like `organization` or array like `organizations`

Confirmed token response fields:
- `access_token`
- `refresh_token`
- `api_domain`
- `token_type`
- `expires_in`

The OAuth docs also explicitly mention errors such as:
- `invalid_redirect_uri` in `/oauth/v2/auth`
- `invalid_code` in `/oauth/v2/token` for refresh-token flows when the refresh token is no longer valid
- `INVALID_OAUTHTOKEN` when an invalidated access token is used

## Pagination
The docs have a dedicated Pagination section in navigation, but the reviewed organization/auth examples did not expose a pagination contract. The confirmed `GET /books/v3/organizations` example returns an `organizations` array without a paging example in the captured material.

## Token validity and rate-limit notes confirmed from the OAuth docs
- access tokens are valid for `1 hour`
- grant tokens are one-time use and short-lived (`3 minutes` for self client, `2 minutes` for other clients)
- max `10` grant tokens per `10 minutes` per client ID
- max `10` access tokens from a refresh token per `10 minutes`
- max `15` active access tokens can be stored per refresh token; requesting a 16th invalidates the oldest
- refresh tokens do not expire until revoked
- max `20` refresh tokens can be stored per user; the oldest is invalidated when a 21st is generated

## Important usage notes
- The docs show a very large module catalog beyond organizations; this rewrite deliberately limits itself to the routes directly confirmed during this pass.
- Token responses return `api_domain`, and the docs explicitly tell developers to use that value when making API calls.
- The header format is provider-specific: `Zoho-oauthtoken`, not Bearer.
- Zoho Books is multi-data-center aware, so the accounts host can vary even though the reviewed examples used `accounts.zoho.com`.
