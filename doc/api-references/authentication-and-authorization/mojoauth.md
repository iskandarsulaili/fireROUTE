# MojoAuth

Official docs manually reviewed:
- https://docs.mojoauth.com/
- https://docs.mojoauth.com/api
- https://docs.mojoauth.com/api/mojoauthapi.yaml

## Overview
MojoAuth exposes a compact passwordless authentication API covering magic links, email OTP, phone OTP, JWT verification, JWKS retrieval, and refresh-token exchange.

- Base URL: `https://api.mojoauth.com`
- Primary transport: JSON over HTTPS
- Main auth scheme in the reviewed OpenAPI document: `x-api-key` header (`ApiKeyAuth`)
- Additional auth scheme declared in the same spec: bearer auth; the reviewed `POST /token/verify` operation explicitly lists both `ApiKeyAuth` and `bearerAuth`

## Authentication
The reviewed OpenAPI spec defines:

```http
x-api-key: YOUR_API_KEY
```

It also declares a bearer auth scheme in `securitySchemes`, and `POST /token/verify` lists both API-key and bearer security on the operation.

## Confirmed endpoints

| Method | Path | Purpose | Key params/body |
|---|---|---|---|
| POST | `/users/magiclink` | Send a magic link email | Query `language`; body `email` |
| GET | `/users/status` | Check authentication state by `state_id` | Query `state_id` |
| POST | `/users/magiclink/resend` | Resend an existing magic link | Query `redirect_url`, `language`; body `state_id` |
| POST | `/users/emailotp` | Send email OTP | Query `language`; body `email` |
| POST | `/users/emailotp/verify` | Verify email OTP | Form body `OTP`, `state_id` |
| POST | `/users/emailotp/resend` | Resend email OTP | Query `language`; body `state_id` |
| POST | `/users/phone` | Send phone OTP | Query `language`; body `phone` |
| POST | `/users/phone/verify` | Verify phone OTP | Form body `OTP`, `state_id` |
| POST | `/users/phone/resend` | Resend phone OTP | Query `language`; body `state_id` |
| GET | `/token/jwks` | Retrieve JSON Web Key Set | No request body documented |
| POST | `/token/verify` | Verify a JWT token | Operation exists; reviewed spec does not define request-body fields |
| POST | `/token/refresh` | Exchange refresh token for fresh credentials | JSON body `refresh_token` |

Manual route count confirmed from the reviewed API reference and OpenAPI document: **12**.

## Common response shapes
The reviewed spec shows a few recurring patterns.

### State-init responses
These endpoints return a state handle:
- `POST /users/magiclink`
- `POST /users/magiclink/resend`
- `POST /users/emailotp`
- `POST /users/emailotp/resend`
- `POST /users/phone`
- `POST /users/phone/resend`

Confirmed success field:
- `state_id`

### Authenticated user responses
`GET /users/status`, `POST /users/emailotp/verify`, `POST /users/phone/verify`, and `POST /token/refresh` return an auth/user structure including:
- `authenticated`
- `oauth.access_token`
- `oauth.id_token`
- `oauth.refresh_token`
- `oauth.expires_in`
- `oauth.token_type`
- `user.created_at`
- `user.updated_at`
- `user.issuer`
- `user.user_id`
- `user.identifier`

### JWKS response
`GET /token/jwks` returns:
- `keys[]`
- each key object includes `kty`, `kid`, `use`, `alg`, `n`, `e`

### Token verification response
`POST /token/verify` returns a token validation structure including:
- `isValid`
- `access_token`
- `user.identifier`
- `user.auth_type`
- `user.token_type`
- `user.aud`
- `user.exp`
- `user.jti`
- `user.iat`
- `user.iss`
- `user.nbf`

## Endpoint details

### `POST /users/magiclink`
Confirmed request contract:
- Query: `language` optional
- JSON body: `email` required

Confirmed response:
- `200` with `state_id`

### `GET /users/status`
Confirmed request contract:
- Query: `state_id` required

Confirmed success response fields include:
- `authenticated`
- `oauth.*`
- `user.*`

This is the main polling/status endpoint after starting magic-link or OTP flows.

### `POST /users/magiclink/resend`
Confirmed request contract:
- Query: `redirect_url` optional
- Query: `language` optional
- JSON body: `state_id` required

### `POST /users/emailotp`
Confirmed request contract:
- Query: `language` optional
- JSON body: `email` required

Confirmed response:
- `200` with `state_id`

### `POST /users/emailotp/verify`
Confirmed request contract:
- Content type: `application/x-www-form-urlencoded`
- Fields: `OTP`, `state_id` (both required)

Confirmed response shape matches the authenticated user structure described above.

### `POST /users/emailotp/resend`
Confirmed request contract:
- Query: `language` optional
- JSON body: `state_id` required

### `POST /users/phone`
Confirmed request contract:
- Query: `language` optional
- JSON body: `phone` required

Confirmed response:
- `200` with `state_id`

### `POST /users/phone/verify`
Confirmed request contract:
- Content type: `application/x-www-form-urlencoded`
- Fields: `OTP`, `state_id` (both required)

Confirmed response shape again includes `authenticated`, `oauth`, and `user`.

### `POST /users/phone/resend`
Confirmed request contract:
- Query: `language` optional
- JSON body: `state_id` required

### `GET /token/jwks`
This returns the public key set for JWT verification. The reviewed schema exposes RSA-style key fields `kty`, `kid`, `use`, `alg`, `n`, and `e`.

### `POST /token/verify`
The reviewed spec confirms the operation exists and documents the response schema, but it does not define request-body fields in the downloaded spec. Treat this as a verified route with incomplete request-shape detail on the reviewed official artifact.

### `POST /token/refresh`
Confirmed request contract:
- JSON body `refresh_token` required

Confirmed success response:
- `authenticated`
- `oauth.*`
- `user.*`

## Pagination
No pagination behavior was documented in the reviewed API reference or OpenAPI document.

## Rate limits
No numeric rate limits were published in the reviewed API reference or YAML spec.

## Errors
The reviewed spec focuses on success schemas and does not publish a detailed shared error object or per-route error matrix beyond normal HTTP response sections. Plan for standard auth/API failures such as invalid API keys, invalid state IDs, expired OTPs, and invalid refresh tokens, but the reviewed official source did not enumerate exact payloads.

## Important usage notes
- MojoAuth uses `state_id` as the main correlation handle across magic-link and OTP flows.
- OTP verification routes use `application/x-www-form-urlencoded`, while send/resend routes mostly use JSON.
- The reviewed spec declares both API-key and bearer auth schemes; preserve upstream auth flexibility in adapters.

## fireROUTE notes
- MojoAuth fits cleanly as a passwordless auth provider with start / poll / verify / refresh primitives.
- Preserve `state_id` in normalized responses; it is required for resend/status flows.
- Keep email and phone OTP resources separate in canonical mappings because the upstream routes are distinct even though response shapes are similar.
