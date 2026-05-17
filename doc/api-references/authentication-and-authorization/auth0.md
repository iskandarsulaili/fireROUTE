# Auth0

Official docs manually reviewed:
- https://auth0.com/docs/api/authentication
- https://auth0.com/docs/api/authentication/introduction
- https://auth0.com/docs/api/authentication (Login → Social)
- https://auth0.com/docs/api/authentication (Login → Database/ad/ldap (passive))
- https://auth0.com/docs/api/authentication (Login → Back-channel login)
- https://auth0.com/docs/api/authentication (Login → Back-channel login flow - status check)
- https://auth0.com/docs/api/authentication (Logout → Auth0 logout)
- https://auth0.com/docs/api/authentication (Passwordless → Get code or link)
- https://auth0.com/docs/api/authentication (Passwordless → Authenticate user)
- https://auth0.com/docs/api/authentication (Passwordless → Verify)

## Overview
Auth0’s Authentication API is a tenant-scoped HTTPS API for login, logout, passwordless, and token exchange flows. The docs are organized by flow pages rather than one flat OpenAPI reference, so the most reliable fireROUTE mapping is to keep the upstream method/path pairs and preserve flow-specific request bodies.

- Base URL: `https://${account.namespace}`
- Auth styles explicitly documented on the Authentication API intro page:
  - OAuth2 bearer token in `Authorization: Bearer ACCESS_TOKEN`
  - `client_id` + `client_secret`
  - `client_id` + `client_assertion`
  - public-client `client_id`
  - mTLS for confidential applications
- Response format: JSON for token and passwordless operations; browser redirects for `/authorize` and `/v2/logout`

## Authentication
The intro page explicitly says the Authentication API supports five authentication methods. Which one you use depends on the route:

- `GET /authorize` is browser-based and uses query parameters like `client_id`, `response_type`, and `redirect_uri`
- `POST /bc-authorize` and `POST /oauth/token` support confidential-client auth patterns such as client secret, private key JWT, or mTLS
- `GET /userinfo` uses `Authorization: Bearer ACCESS_TOKEN`

Example bearer pattern from the intro page:

```http
Authorization: Bearer ACCESS_TOKEN
```

## Confirmed endpoints

| Method | Path | Purpose | Key parameters / body |
|---|---|---|---|
| GET | `/authorize` | Browser-based login entry point for social, database/LDAP, and enterprise connections | Query `response_type`, `client_id`, `redirect_uri`, plus flow-specific params like `connection` |
| POST | `/bc-authorize` | Start back-channel login / CIBA-style push authentication | Body `client_id`, `binding_message`, `login_hint`, `scope`, `audience`, `resource`, `requested_expiry`, `authorization_details` |
| POST | `/oauth/token` | Exchange or poll token state for specific grants including CIBA status check and passwordless OTP authentication | Body varies by grant type |
| GET | `/v2/logout` | Log a user out and optionally redirect afterward | Query `returnTo`; docs also discuss `client_id` and `federated` behavior |
| POST | `/passwordless/start` | Send passwordless code or link | Body `client_id`, optional client auth fields, `connection`, `email` or `phone_number`, `send`, `authParams` |
| POST | `/passwordless/verify` | Legacy passwordless verification flow | Body `grant_type=password`, `client_id`, `connection`, `username`, `password`, optional `scope`, `redirect_uri` |
| GET | `/userinfo` | Retrieve authenticated user profile using an access token | Bearer token in `Authorization` |

Manual route count confirmed from the reviewed pages: **7** unique method/path pairs.

## `GET /authorize`
The reviewed login pages for social and database/ad/ldap passive login both confirm the same upstream route:

- Method: `GET`
- Path: `/authorize`
- Behavior: returns `302` redirects

Confirmed query parameters shown on both reviewed login pages:
- `response_type` — docs show `code` and `token`
- `client_id`
- `redirect_uri`

Additional usage note from the social login page:
- `connection` selects the social identity provider

Operational notes from the docs:
- Social connections are browser-based only
- For `response_type=token`, Auth0 redirects back with tokens in the callback URL hash
- Database/ad/ldap passive login redirects to the Auth0 login page

## `POST /bc-authorize`
The back-channel login page documents a push-auth initiation endpoint:

- Method: `POST`
- Path: `/bc-authorize`
- Content type shown in curl example: `application/x-www-form-urlencoded`
- Accept header shown: `application/json`

Confirmed body fields from the docs:
- `client_id`
- `binding_message`
- `login_hint`
- `scope`
- `audience`
- `resource`
- `requested_expiry`
- `authorization_details`

Confirmed success response shape:
- `auth_req_id`
- `expires_in`
- `interval`

The page explicitly notes `login_hint` follows the `iss_sub` structure for Guardian-backed push login.

## `POST /oauth/token`
The reviewed docs confirm the same token endpoint is reused across different grants.

### CIBA / back-channel status polling
The “Back-channel login flow - status check” page confirms:

```json
{
  "client_id": "string",
  "auth_req_id": "string",
  "grant_type": "urn:openid:params:grant-type:ciba"
}
```

Observed response behaviors:
- pending: `error=authorization_pending`
- denied/expired: `error=access_denied`
- polled too fast: `error=slow_down`
- Auth0 may add `Retry-After`
- success returns `access_token`, `id_token`, `expires_in`, `scope` and possibly a refresh token

### Passwordless OTP authentication
The “Authenticate user” page confirms `POST /oauth/token` is also used for passwordless OTP login with:
- `grant_type=http://auth0.com/oauth/grant-type/passwordless/otp`
- `client_id`
- `client_secret`
- `otp`
- `realm` (`email` or `sms`)
- `username`
- optional `audience`
- optional `resource`
- optional `scope`
- optional `redirect_uri`

## `GET /v2/logout`
The reviewed “Auth0 logout” page confirms:

- Method: `GET`
- Path: `/v2/logout`
- Success: `200`
- Error: `400` for bad or missing parameters

Confirmed query parameter surfaced directly on the page:
- `returnTo` — URL to redirect the user after logout

Important notes explicitly documented:
- If `client_id` is included, `returnTo` must be in the application’s Allowed Logout URLs
- Without `client_id`, `returnTo` must be in the tenant-level Allowed Logout URLs
- The `federated` query-string option affects upstream identity-provider logout and should be used carefully

## `POST /passwordless/start`
The reviewed passwordless “Get code or link” page confirms:

- Method: `POST`
- Path: `/passwordless/start`
- Purpose: send email link, email code, or SMS code

Confirmed request fields from the example body:
- `client_id`
- `client_assertion`
- `client_assertion_type`
- `client_secret`
- `connection` (example `email`)
- `email`
- `phone_number`
- `send` (example `link`)
- `authParams.scope`
- `authParams.state`

Confirmed statuses:
- `200` code or link sent successfully
- `400` invalid parameters
- `401` invalid client credentials

The page explicitly warns that this endpoint is designed to be called from the client side and is subject to rate limits, but it does not publish numeric limits on the reviewed page.

## `POST /passwordless/verify`
The reviewed “Verify” page documents a legacy verification route:

- Method: `POST`
- Path: `/passwordless/verify`
- Availability note: disabled by default for new tenants since 2017-06-08

Confirmed request body fields:
- `grant_type` with example `password`
- `client_id`
- `connection`
- `username`
- `password` (the verification code)
- optional `scope`
- optional `redirect_uri`

Confirmed statuses:
- `200` authenticated successfully
- `400` invalid parameters
- `401` invalid credentials
- `403` client authentication required
- `500` internal server error

## `GET /userinfo`
The intro page explicitly uses the Get User Info endpoint as the canonical example of bearer-token authentication and says it retrieves the user’s profile when called with an access token in the `Authorization` header.

## Pagination
No pagination behavior was documented on the reviewed Auth0 Authentication API pages.

## Errors
Confirmed error/status signals from reviewed pages include:
- `302` redirect responses from `/authorize`
- `400` invalid or missing parameters for logout, passwordless, and token flows
- `401` invalid client credentials or invalid credentials on passwordless flows
- `403` client authentication required on legacy passwordless verify
- `authorization_pending`, `access_denied`, and `slow_down` OAuth-style error payloads for CIBA polling

## Important usage notes
- Auth0 reuses `/oauth/token` for multiple grant types; fireROUTE should preserve `grant_type` rather than flattening into separate internal resources too early.
- `/authorize` is not a simple JSON API call; it is a browser redirect flow entry point.
- `returnTo` enforcement on `/v2/logout` depends on whether `client_id` is present.
- The reviewed passwordless docs include both current `/oauth/token` OTP exchange and legacy `/passwordless/verify`; both should be treated as separate compatibility surfaces.

## fireROUTE notes
- Model Auth0 as a tenant-scoped auth platform with both redirect-style and JSON token endpoints.
- Keep `/authorize` and `/v2/logout` distinct from JSON-only auth providers in routing/canonicalization.
- Preserve grant-type-specific request bodies on `/oauth/token` so advanced Auth0 use cases are not lost.
