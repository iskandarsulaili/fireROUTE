# LinkedIn

## Provider metadata
- Category: `Social`
- Provider slug: `linkedin`
- Official docs URL from index: `https://docs.microsoft.com/en-us/linkedin/?context=linkedin/context`
- Official pages manually reviewed in this pass:
  - `https://learn.microsoft.com/en-us/linkedin/`
  - `https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/shared/authentication/token-introspection?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin?context=linkedin/consumer/context`
  - `https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api`
- Main REST API base URL confirmed: `https://api.linkedin.com/v2`
- OAuth/OIDC base URL confirmed: `https://www.linkedin.com/oauth/v2`
- Auth model: `OAuth 2.0 bearer tokens` with `OpenID Connect` for sign-in and optional programmatic refresh tokens for approved partners
- Response/request formats seen on the reviewed pages: JSON API responses; `application/x-www-form-urlencoded` token/introspection requests; Rest.li routes frequently require `X-RestLi-Protocol-Version: 2.0.0`
- Manual review outcome: `manually_documented`
- Route count confirmed: `9`

## Authentication and authorization
- LinkedIn's official auth overview says the platform uses OAuth 2.0 for both member authorization (3-legged OAuth) and some application authorization (2-legged OAuth client credentials).
- The reviewed consumer sign-in page adds OIDC scopes `openid`, `profile`, and `email` and confirms that successful auth returns both an access token and an ID token.
- The reviewed share page requires the `w_member_social` scope to create posts on behalf of a member.
- The reviewed profile page lists `r_liteprofile`, `r_basicprofile`, and private `r_compliance` as relevant profile scopes.
- The 3-legged OAuth page confirms authorization codes expire after `30 minutes` and that access tokens are currently issued with a `60-day` lifespan.
- The refresh-token page says programmatic refresh tokens are available for approved partners, with refresh tokens typically valid for `365 days` and refreshed access tokens receiving a new `60-day` TTL.

## Canonical route inventory

### 1) Start member authorization
- Method: `GET`
- URL: `https://www.linkedin.com/oauth/v2/authorization`
- Purpose: send the member to LinkedIn's consent/login flow.
- Required query parameters confirmed on the reviewed page:
  - `response_type=code`
  - `client_id`
  - `redirect_uri`
  - `scope`
- Optional query parameters explicitly documented:
  - `state` for CSRF protection
  - `enable_extended_login=true` to enable additional login options on supported platforms

### 2) Exchange auth code or refresh token for an access token
- Method: `POST`
- URL: `https://www.linkedin.com/oauth/v2/accessToken`
- Content type: `application/x-www-form-urlencoded`
- Supported grant patterns confirmed on the reviewed pages:
  - `grant_type=authorization_code` with `code`, `client_id`, `client_secret`, and `redirect_uri`
  - `grant_type=refresh_token` with `refresh_token`, `client_id`, and `client_secret`
- Successful response fields explicitly shown:
  - `access_token`
  - `expires_in`
  - `refresh_token`
  - `refresh_token_expires_in`
  - `scope`

### 3) Introspect a token
- Method: `POST`
- URL: `https://www.linkedin.com/oauth/v2/introspectToken`
- Content type: `application/x-www-form-urlencoded`
- Required body fields confirmed:
  - `client_id`
  - `client_secret`
  - `token`
- Successful response fields explicitly shown:
  - `active`
  - `status`
  - `scope`
  - `client_id`
  - `created_at`
  - `expires_at`
  - `authorized_at`
  - `auth_type`

### 4) Read OIDC user info
- Method: `GET`
- Path: `/v2/userinfo`
- Full URL shown on the reviewed OIDC page: `https://api.linkedin.com/v2/userinfo`
- Auth: OAuth bearer token in the `Authorization` header
- Response fields shown on the page:
  - `sub`
  - `name`
  - `given_name`
  - `family_name`
  - `picture`
  - `locale`
  - optional `email`
  - optional `email_verified`

### 5) Read the authenticated member profile
- Method: `GET`
- Path: `/v2/me`
- Purpose: fetch the current member's profile from the access token context.
- Relevant permissions from the reviewed page:
  - `r_liteprofile`
  - `r_basicprofile`
  - `r_compliance` (private)
- Example fields shown in the response:
  - `id`
  - `firstName`
  - `lastName`
  - `headline`
  - `vanityName`
  - `profilePicture`
- Important usage note from the reviewed page: projections can be appended here, for example `?projection=(geoLocation(geo~,autoGenerated))`.

### 6) Read another member profile by person ID
- Method: `GET`
- Path: `/v2/people/(id:{person ID})`
- Purpose: fetch another member profile when your integration has access to their person ID and privacy settings allow it.
- Important usage note: the reviewed page says these `people` calls require the request header `X-RestLi-Protocol-Version: 2.0.0`.
- Projection example shown on the page: `/v2/people/(id:{profile ID})?projection=(id,firstName,lastName)`

### 7) Batch-read multiple member profiles
- Method: `GET`
- Path: `/v2/people`
- Required query shape shown on the reviewed page: `ids=List((id:{Person ID1}),(id:{Person ID2}),(id:{Person ID3}))`
- Purpose: fetch multiple profiles in one request.
- Header note: the reviewed page again requires `X-RestLi-Protocol-Version: 2.0.0`.

### 8) Create a member share/post
- Method: `POST`
- Path: `/v2/ugcPosts`
- Full URL shown on the reviewed share page: `https://api.linkedin.com/v2/ugcPosts`
- Auth/headers:
  - OAuth bearer token in the `Authorization` header
  - `X-RestLi-Protocol-Version: 2.0.0`
- Core request-body fields explicitly documented:
  - `author`
  - `lifecycleState` (the reviewed examples use `PUBLISHED`)
  - `specificContent`
  - `visibility`
- Share-content fields explicitly documented:
  - `shareCommentary`
  - `shareMediaCategory`
  - optional `media`
- Share-media fields explicitly documented:
  - `status`
  - optional `description`
  - optional `media`
  - optional `originalUrl`
  - optional `title`
- Success note: the reviewed page says successful creation returns `201 Created` and the new post identifier in the `X-RestLi-Id` response header.

### 9) Register an image or video upload for sharing
- Method: `POST`
- Path: `/v2/assets?action=registerUpload`
- Full URL shown on the reviewed share page: `https://api.linkedin.com/v2/assets?action=registerUpload`
- Purpose: register media before creating an image/video share.
- Request body fields explicitly shown inside `registerUploadRequest`:
  - `recipes`
  - `owner`
  - `serviceRelationships`
- Response fields explicitly shown:
  - `uploadMechanism`
  - `uploadUrl`
  - `mediaArtifact`
  - `asset`
- Important usage note: the actual media binary is then uploaded to the returned `uploadUrl`, after which the resulting `asset` URN is attached to `/v2/ugcPosts`.

## Parameters, pagination, and format notes
- The reviewed OAuth/OIDC pages use standard query/body parameters rather than page-based route pagination.
- The reviewed profile pages did not publish a single global pagination contract; instead they showed single-profile lookup, batch ID lookup with `ids=List(...)`, and field projection syntax with `projection=(...)`.
- The reviewed share workflow is JSON-based and uses URNs such as `urn:li:person:...` and `urn:li:digitalmediaAsset:...` in request bodies.
- Token and introspection requests are explicitly form-encoded, not JSON.

## Rate limits
- The reviewed `Share on LinkedIn` page publishes route-family limits for the share workflow:
  - `Member`: `150 requests` per day (UTC)
  - `Application`: `100,000 requests` per day (UTC)
- The reviewed profile, OIDC, and OAuth pages did not expose a single broader numeric rate-limit table for all LinkedIn routes covered here.

## Errors and status notes
- The token-introspection page documents these HTTP statuses:
  - `200` success
  - `400` invalid client id or token
  - `401` invalid client secret
- The same introspection page notes that valid credentials paired with a token from another client can still return `200 OK` with `"active": false`.
- The refresh-token page documents `400 invalid_request` variants for missing `redirect_uri`, missing `grant_type`, missing `client_id`, missing `refresh_token`, and invalid/expired/revoked refresh tokens.
- The share page documents `201 Created` on successful post creation.

## Important usage notes
- Consumer sign-in and profile APIs are tightly permission-scoped; do not assume `w_member_social`, `r_liteprofile`, `profile`, and `openid` are interchangeable.
- `person ID` values are application-context-specific; the reviewed profile page warns that sharing a person ID across apps leads to `404` behavior.
- For Rest.li endpoints such as `people` and `ugcPosts`, preserve `X-RestLi-Protocol-Version: 2.0.0` exactly as documented.
- For media posts, do the upload in two stages: register with `/v2/assets?action=registerUpload`, upload bytes to the returned `uploadUrl`, then create the final share via `/v2/ugcPosts`.
- This provider doc is intentionally limited to the routes and behaviors directly confirmed from the official LinkedIn pages reviewed in this pass.
