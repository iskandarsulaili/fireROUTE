# NAVER

## Provider metadata
- Category: `Social`
- Provider slug: `naver`
- Official docs pages used:
  - `https://developers.naver.com/main/`
  - `https://developers.naver.com/docs/login/overview/overview.md`
  - `https://developers.naver.com/docs/login/api/api.md`
  - `https://developers.naver.com/docs/login/profile/profile.md`
  - `https://developers.naver.com/docs/common/openapiguide/`
- OAuth host confirmed from the reviewed login docs: `https://nid.naver.com/oauth2.0`
- Profile API host confirmed from the reviewed profile docs: `https://openapi.naver.com`
- Auth model confirmed from the reviewed pages: OAuth 2.0 authorization-code flow with client ID and client secret, bearer access tokens for profile access
- Request/response formats confirmed from the reviewed pages: browser redirects for authorization, JSON token responses, JSON profile responses, bearer `Authorization` header for profile reads
- Manually confirmed route count: `5`

## Authentication
- The reviewed overview page describes NAVER Login as an OAuth 2.0 based user-authentication service.
- Apps must be registered in NAVER Developers to receive `client_id` and `client_secret`.
- Authorization uses a redirect-based OAuth flow.
- The reviewed profile page explicitly documents bearer access-token auth in the `Authorization` header for profile reads.

## API-wide behavior
- NAVER Login is split between OAuth endpoints on `nid.naver.com/oauth2.0` and resource APIs on `openapi.naver.com`.
- The reviewed login API page states the login API consists of authorization plus access-token issue/refresh/delete requests.
- The reviewed login API page explicitly says there is no dedicated NAVER logout API; users must log out from NAVER itself.
- The reviewed login API page warns that token deletion can still return `success` even when the submitted token is already invalid, so callers should verify token validity first and confirm unlink by observing that further refresh attempts fail.

## Canonical endpoints

### 1) Request authorization code
- Method: `GET` or `POST`
- URL: `https://nid.naver.com/oauth2.0/authorize`
- Purpose: show the NAVER login/consent flow and return an authorization code by redirect

Confirmed request parameters from the reviewed login API page:
- `response_type` - required, fixed to `code`
- `client_id` - required client ID
- `redirect_uri` - required callback URI, URL-encoded
- `state` - required CSRF-protection state value, URL-encoded
- `scope` - optional internal scope selector; the reviewed page says it generally does not need to be sent

Confirmed response behavior:
- Success redirects to `callback?code=...&state=...`
- Failure redirects with `state`, `error`, and `error_description`

### 2) Issue access token
- Method: `GET` or `POST`
- URL: `https://nid.naver.com/oauth2.0/token`
- Purpose: exchange an authorization code for access and refresh tokens

Confirmed request parameters:
- `grant_type` - required, set to `authorization_code`
- `client_id` - required client ID
- `client_secret` - required client secret
- `code` - required authorization code
- `state` - required state returned from the authorize step

Confirmed response fields:
- `access_token`
- `refresh_token`
- `token_type`
- `expires_in`
- `error`
- `error_description`

### 3) Refresh access token
- Method: `GET` or `POST`
- URL: `https://nid.naver.com/oauth2.0/token`
- Purpose: refresh an expired access token using a refresh token

Confirmed request parameters:
- `grant_type` - required, set to `refresh_token`
- `client_id` - required client ID
- `client_secret` - required client secret
- `refresh_token` - required refresh token, URL-encoded when needed

Confirmed response fields:
- `access_token`
- `token_type`
- `expires_in`
- `error`
- `error_description`

### 4) Delete token / unlink login
- Method: `GET` or `POST`
- URL: `https://nid.naver.com/oauth2.0/token`
- Purpose: delete a previously issued access token and disconnect the login linkage

Confirmed request parameters:
- `grant_type` - required, set to `delete`
- `client_id` - required client ID
- `client_secret` - required client secret
- `access_token` - required access token, URL-encoded
- `service_provider` - required, fixed to `NAVER`

Confirmed response fields:
- `access_token`
- `result` - success indicator
- `expires_in`
- `error`
- `error_description`

### 5) Get member profile
- Method: `GET`
- URL: `https://openapi.naver.com/v1/nid/me`
- Purpose: retrieve profile data for a NAVER-authenticated user who granted consent
- Auth: bearer access token in the `Authorization` header

Confirmed response fields from the reviewed profile page:
- `resultcode`
- `message`
- `response.id`
- `response.nickname`
- `response.name`
- `response.email`
- `response.gender`
- `response.age`
- `response.birthday`
- `response.profile_image`
- `response.birthyear`
- `response.mobile`

Important note from the reviewed profile page:
- NAVER does not return the user's NAVER ID; callers should use `response.id`, which is unique per application.

## Pagination
- None of the reviewed NAVER Login pages documented pagination.
- The confirmed route set for this provider is auth/profile oriented and does not expose cursor, page, or offset parameters.

## Rate limits
- The reviewed NAVER Login overview, login API spec, profile API spec, and common API guide did not publish a stable numeric quota or per-user rate-limit table for NAVER Login.
- The reviewed materials only expose standard request/response contracts and error handling guidance.

## Errors and format notes
- The reviewed login API page lists representative error codes including:
  - HTTP `401` / code `024` -> authentication failed
  - HTTP `401` / code `028` -> missing authorization header
  - HTTP `403` / code `403` -> forbidden / no API permission
  - HTTP `404` / code `404` -> not found
  - HTTP `500` / code `500` -> internal server error
  - OAuth-style `invalid_request`, `unauthorized_client`, `unsupported_response_type`, `server_error`
- The reviewed profile API page lists the same common HTTP/API error family for profile reads.
- Token and profile responses are JSON.

## Important usage notes
- The reviewed login API page says there is no separate NAVER logout API; service implementations must handle only their own session logout and direct users to log out from NAVER itself if needed.
- The reviewed login API page says access tokens used as URL parameters should be URL-encoded because they may contain special characters.
- The reviewed profile API page warns that `enc_id` can appear in responses but is for internal use and should not be relied upon by integrators.
- The reviewed overview page recommends verifying that the registered service URL, callback URL, and real deployed URLs exactly match to avoid deployment and badge-visibility issues.
