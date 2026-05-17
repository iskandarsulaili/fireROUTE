# Kakao

## Provider metadata
- Category: `Social`
- Provider slug: `kakao`
- Official docs pages used:
  - `https://developers.kakao.com/`
  - `https://developers.kakao.com/docs/ko/kakaologin/common`
  - `https://developers.kakao.com/docs/ko/kakaologin/rest-api`
  - `https://developers.kakao.com/docs/ko/getting-started/quota`
- OAuth/authorization host confirmed from the official REST API page: `https://kauth.kakao.com`
- API host confirmed from the official REST API page: `https://kapi.kakao.com`
- Auth models confirmed from the reviewed pages:
  - OAuth 2.0 authorization-code flow for end-user login
  - Refresh-token flow on the same token endpoint
  - Bearer access tokens for user-scoped API requests
  - `KakaoAK` admin-key auth for certain app-admin user management routes
- Request/response formats confirmed from the reviewed pages: HTTP 302 redirect responses for browser auth/logout redirects, `application/x-www-form-urlencoded;charset=utf-8` for token and most POST bodies, bearer/admin-key auth headers, JSON API responses
- Manually confirmed route count: `9`

## Authentication
- The reviewed Kakao Login guide describes Kakao Login as an OAuth 2.0 based social-login service.
- Authorization requests are sent to `https://kauth.kakao.com/oauth/authorize`.
- Token issuance and refresh requests are sent to `https://kauth.kakao.com/oauth/token`.
- Access-token API requests use bearer access-token auth in the `Authorization` header.
- Certain admin-side user operations can use Kakao's `KakaoAK` admin-key auth in the `Authorization` header.
- The reviewed common page says REST API keys now have client-secret protection enabled by default, so token requests should include `client_secret` when that setting is on.
- The reviewed common page lists REST access-token lifetime as `6` hours and refresh-token lifetime as `2` months, with refresh possible once the remaining lifetime is under `1` month.

## API-wide behavior
- Kakao splits browser-facing OAuth endpoints onto `kauth.kakao.com` and token/user APIs onto `kapi.kakao.com`.
- The reviewed REST API page uses form-urlencoded POSTs for token issuance, token refresh, logout, unlink, and selective user-info retrieval.
- The reviewed docs explicitly distinguish user-token auth from admin-key auth on routes like logout, unlink, user info, and scope inspection.
- The reviewed quota page says quotas are aggregated per app.

## Canonical endpoints

### 1) Request authorization code
- Method: `GET`
- URL: `https://kauth.kakao.com/oauth/authorize`
- Purpose: show Kakao login plus consent and return an authorization code by redirect

Confirmed query parameters from the reviewed REST API page:
- `client_id` - required REST API key
- `redirect_uri` - required callback URI registered for the app
- `response_type` - required, fixed to `code`
- `scope` - optional extra consent items to request
- `prompt` - optional interaction control; reviewed values include `login`, `none`, `create`, `select_account`
- `login_hint` - optional identifier hint for the login page
- `service_terms` - optional Kakao Sync service-term tags
- `state` - optional CSRF protection string
- `nonce` - optional OpenID Connect replay-protection string

Confirmed response behavior from the reviewed page:
- Success redirects to `redirect_uri?code=...&state=...`
- Failure redirects to `redirect_uri?error=...&error_description=...`

### 2) Exchange authorization code for token
- Method: `POST`
- URL: `https://kauth.kakao.com/oauth/token`
- Purpose: exchange an authorization code for access and refresh tokens
- Content type: `application/x-www-form-urlencoded;charset=utf-8`

Confirmed body parameters:
- `grant_type` - required, fixed to `authorization_code`
- `client_id` - required REST API key
- `redirect_uri` - required redirect URI used in the authorize step
- `code` - required authorization code
- `client_secret` - conditionally required when client-secret enforcement is enabled

Confirmed response fields:
- `token_type`
- `access_token`
- `id_token` - optional when OpenID Connect applies
- `expires_in`
- `refresh_token`
- `refresh_token_expires_in`
- `scope`

### 3) Refresh access token
- Method: `POST`
- URL: `https://kauth.kakao.com/oauth/token`
- Purpose: refresh an access token and, when applicable, rotate the refresh token
- Content type: `application/x-www-form-urlencoded;charset=utf-8`

Confirmed body parameters:
- `grant_type` - required, fixed to `refresh_token`
- `client_id` - required REST API key
- `refresh_token` - required refresh token
- `client_secret` - conditionally required when client-secret enforcement is enabled

Confirmed response fields:
- `token_type`
- `access_token`
- `id_token` - optional for OpenID Connect refreshes
- `expires_in`
- `refresh_token` - only when Kakao rotates it
- `refresh_token_expires_in` - only when Kakao rotates it

### 4) Get user info
- Method: `GET` or `POST`
- URL: `https://kapi.kakao.com/v2/user/me`
- Purpose: retrieve profile/account data for the connected user

Confirmed request options:
- Access-token mode: bearer access token in the `Authorization` header
- Admin-key mode: Kakao `KakaoAK` admin key in the `Authorization` header, with target-user selectors
- `secure_resource` - optional boolean to force HTTPS image URLs
- `property_keys` - optional JSON array of requested response fields such as `kakao_account.email`
- `target_id_type` - admin-key mode only, fixed to `user_id`
- `target_id` - admin-key mode only, target user ID

Confirmed response fields from the reviewed examples:
- `id`
- `connected_at`
- `properties`
- `kakao_account.profile.nickname`
- `kakao_account.profile.thumbnail_image_url`
- `kakao_account.email`
- `kakao_account.age_range`
- `kakao_account.birthyear`
- `kakao_account.birthday`
- `kakao_account.gender`
- `kakao_account.phone_number`
- `for_partner.uuid`

### 5) Get access-token info
- Method: `GET`
- URL: `https://kapi.kakao.com/v1/user/access_token_info`
- Purpose: validate an access token and inspect its remaining lifetime
- Auth: bearer access token in the `Authorization` header

Confirmed response fields:
- `id`
- `expires_in`
- `app_id`

### 6) Log out user session
- Method: `POST`
- URL: `https://kapi.kakao.com/v1/user/logout`
- Purpose: revoke the user's issued tokens and end the Kakao Login session for the authenticated scope

Confirmed request modes:
- Access-token mode with bearer access token in the `Authorization` header
- Admin-key mode with Kakao `KakaoAK` admin-key auth in the `Authorization` header plus:
  - `target_id_type=user_id`
  - `target_id`

Confirmed response field:
- `id`

### 7) Log out Kakao Account in browser too
- Method: `GET`
- URL: `https://kauth.kakao.com/oauth/logout`
- Purpose: show a Kakao account logout flow and then redirect back to the service

Confirmed query parameters:
- `client_id` - required REST API key
- `logout_redirect_uri` - required registered logout redirect URI
- `state` - optional CSRF/state value

Confirmed response behavior:
- Browser redirect to `logout_redirect_uri`, optionally echoing `state`

### 8) Unlink user
- Method: `POST`
- URL: `https://kapi.kakao.com/v1/user/unlink`
- Purpose: revoke user consent and invalidate issued access and refresh tokens

Confirmed request modes:
- Access-token mode with bearer access token in the `Authorization` header
- Admin-key mode with Kakao `KakaoAK` admin-key auth in the `Authorization` header plus:
  - `target_id_type=user_id`
  - `target_id`

Confirmed response field:
- `id`

### 9) List granted scopes
- Method: `GET`
- URL: `https://kapi.kakao.com/v2/user/scopes`
- Purpose: inspect which consent items a user has agreed to

Confirmed request parameters:
- Access-token mode with bearer access token in the `Authorization` header
- Admin-key mode with Kakao `KakaoAK` admin-key auth in the `Authorization` header plus `target_id_type` and `target_id`
- `scopes` - optional list of scope IDs to filter the response

Confirmed response structure:
- `id`
- `scopes[]`
- `scopes[].id`
- `scopes[].display_name`
- `scopes[].type`
- `scopes[].using`
- `scopes[].agreed`
- `scopes[].revocable`

## Pagination
- No global pagination contract was documented for Kakao Login on the reviewed pages.
- The manually confirmed route set in this pass is mostly auth/account management and does not expose cursor or page parameters.

## Rate limits
- The reviewed quota page says the platform-wide free monthly quota is `3,000,000` calls.
- The same quota page explicitly lists Kakao Login token issuance limits per user:
  - access tokens: `20` issuable per `10` minutes
  - refresh tokens: `30` issuable per `60` minutes
- The reviewed REST API page says exceeding the token issuance limit returns `KOE237`.

## Errors and format notes
- The reviewed access-token-info section lists these representative error codes:
  - `-1` -> temporary internal platform issue, HTTP `400`
  - `-2` -> malformed or out-of-range request/token shape, HTTP `400`
  - `-401` -> invalid app key or access token, HTTP `401`
- The reviewed authorization flow returns OAuth-style redirect errors using `error` and `error_description` query parameters.
- Token and user APIs return JSON bodies.

## Important usage notes
- The reviewed docs stress that Kakao Login setup depends on app-level consent-item configuration; many user fields are unavailable until the corresponding consent items are both enabled and accepted.
- The reviewed common guide says SDKs can auto-manage token refresh on some platforms, but REST integrations must manage refresh timing themselves.
- The reviewed logout guidance distinguishes between token/session logout and full Kakao-account browser logout; they are not the same operation.
- The reviewed docs also note that REST token requests should include `client_secret` when the app's client-secret protection is enabled, which is now the default state for REST API keys.
