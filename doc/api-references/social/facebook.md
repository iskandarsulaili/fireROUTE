# Facebook

## Provider metadata
- Category: `Social`
- Provider slug: `facebook`
- Official docs pages used:
  - `https://developers.facebook.com/`
  - `https://developers.facebook.com/docs/graph-api/overview`
  - `https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow`
  - `https://developers.facebook.com/docs/graph-api/results`
  - `https://developers.facebook.com/docs/graph-api/overview/rate-limiting`
  - `https://developers.facebook.com/docs/graph-api/guides/error-handling`
- Main Graph API host confirmed from the reviewed docs: `https://graph.facebook.com`
- Login dialog host confirmed from the reviewed Facebook Login manual-flow guide: `https://www.facebook.com`
- Versioning note from the reviewed pages: the examples reviewed are on `v25.0`, and the Graph API is explicitly versioned.
- Auth models confirmed from the reviewed docs:
  - app access tokens
  - user access tokens
  - page access tokens
  - system user access tokens for some business contexts
- Request/response formats confirmed in the reviewed docs: HTTPS-only requests, JSON responses, `paging` objects with pagination links, error objects under top-level `error`, and rate-limit usage headers such as `X-App-Usage`
- Manually confirmed route count: `8`

## Authentication
- The reviewed Graph API overview says almost all Graph API endpoints require some kind of access token.
- The reviewed manual-login guide documents the browser login flow and token exchange flow without using Meta SDKs.
- OAuth/login dialog endpoint confirmed by the guide:
  - `GET https://www.facebook.com/v25.0/dialog/oauth`
- OAuth token exchange endpoint confirmed by the guide:
  - `GET https://graph.facebook.com/v25.0/oauth/access_token`
- Token inspection endpoint confirmed by the guide:
  - `GET https://graph.facebook.com/debug_token`

Confirmed login-dialog parameters from the reviewed guide:
- `client_id` - required app ID
- `redirect_uri` - required callback URL
- `state` - required request-state string for correlation / CSRF protection
- `response_type` - optional/flow-dependent; supported values explicitly documented include `code`, `token`, and `code token`
- `granted_scopes` - optional return modifier
- `scope` - optional comma- or space-separated permission list to request

Confirmed code-exchange parameters from the reviewed guide:
- `client_id`
- `redirect_uri`
- `client_secret`
- `code`

Confirmed successful token response fields from the reviewed guide:
- `access_token`
- `token_type`
- `expires_in`

Confirmed token-inspection parameters from the reviewed guide:
- `input_token`
- `access_token` as an app token or developer/admin token

## API-wide behavior
- The reviewed Graph API overview defines the platform in terms of nodes, edges, and fields.
- All reviewed Graph API endpoints require HTTPS.
- The reviewed overview page explicitly says requests are sent to `graph.facebook.com`.
- The reviewed overview page documents generic node reads, edge reads, and field selection with the `fields` parameter.
- The reviewed error-handling page shows the common error envelope:
  - top-level `error.message`
  - `error.type`
  - `error.code`
  - `error.error_subcode`
  - `error.error_user_title`
  - `error.error_user_msg`
  - `error.fbtrace_id`

## Canonical endpoints

### 1) Open the Facebook Login dialog
- Method: `GET`
- URL: `https://www.facebook.com/v25.0/dialog/oauth`
- Purpose: send the user through Facebook Login and permission grant flow

Confirmed parameters from the reviewed manual-flow guide:
- `client_id` - required app ID
- `redirect_uri` - required redirect target
- `state` - required opaque state value
- `response_type` - supports `code`, `token`, and `code token`
- `granted_scopes` - optional return modifier
- `scope` - optional requested permissions list

Important note from the reviewed guide:
- Desktop/webview flows may need special redirect handling, and desktop apps are instructed to use `response_type=token` in the documented Windows example.

### 2) Exchange an authorization code for an access token
- Method: `GET`
- URL: `https://graph.facebook.com/v25.0/oauth/access_token`
- Purpose: exchange the login-dialog authorization code for an access token

Confirmed query parameters from the reviewed manual-flow guide:
- `client_id`
- `redirect_uri`
- `client_secret`
- `code`

Confirmed success response fields:
- `access_token`
- `token_type`
- `expires_in`

### 3) Inspect an access token
- Method: `GET`
- URL: `https://graph.facebook.com/debug_token`
- Purpose: inspect token validity, app ownership, scopes, and expiry data

Confirmed query parameters from the reviewed manual-flow guide:
- `input_token` - token to inspect
- `access_token` - app token or developer/admin token used to authorize the inspection request

Confirmed response fields shown in the reviewed example:
- `data.app_id`
- `data.type`
- `data.application`
- `data.expires_at`
- `data.is_valid`
- `data.issued_at`
- `data.metadata`
- `data.scopes`
- `data.user_id`

### 4) Read a node by ID
- Method: `GET`
- URL pattern: `https://graph.facebook.com/{node-id}`
- Purpose: retrieve the default fields for a node such as a user, page, photo, or other graph object
- Auth: access token generally required

Confirmed example from the reviewed overview page:
- `GET https://graph.facebook.com/USER-ID?access_token=ACCESS-TOKEN`

### 5) Read node metadata
- Method: `GET`
- URL pattern: `https://graph.facebook.com/{node-id}?metadata=1`
- Purpose: request field metadata for a node
- Auth: access token generally required

Confirmed query parameter from the reviewed overview page:
- `metadata=1`

Important note from the reviewed overview page:
- The `metadata` parameter is deprecated in Graph API `v25.0` and the page says it will be deprecated for all versions on `May 19, 2026`.

### 6) Read the current actor through `/me`
- Method: `GET`
- URL: `https://graph.facebook.com/me`
- Purpose: resolve the current user or page represented by the access token
- Auth: required

Confirmed example from the reviewed overview page:
- `GET https://graph.facebook.com/me?access_token=ACCESS-TOKEN`

### 7) Read an edge collection such as photos
- Method: `GET`
- URL pattern: `https://graph.facebook.com/{node-id}/photos`
- Purpose: retrieve an edge collection attached to a node
- Auth: required for protected data

Confirmed example from the reviewed overview page:
- `GET https://graph.facebook.com/USER-ID/photos?access_token=ACCESS-TOKEN`

Confirmed result structure from the reviewed example:
- top-level `data` array
- per-item fields such as `created_time` and `id`

### 8) Read selected fields from a node
- Method: `GET`
- URL pattern: `https://graph.facebook.com/{node-id}?fields=...`
- Purpose: request only specific fields from a node response
- Auth: required for protected data

Confirmed query parameter from the reviewed overview page:
- `fields` - comma-separated field selector

Confirmed reviewed example:
- `GET https://graph.facebook.com/USER-ID?fields=id,name,email,picture&access_token=ACCESS-TOKEN`

Confirmed response fields from the reviewed example:
- `id`
- `name`
- `email`
- `picture.data.height`
- `picture.data.is_silhouette`
- `picture.data.url`
- `picture.data.width`

## Pagination
- The reviewed paginated-results guide documents three pagination models:
  - cursor-based pagination
  - time-based pagination
  - offset-based pagination
- Cursor-based pagination returns a `paging.cursors.after`, `paging.cursors.before`, and usually `paging.next` / `paging.previous` URLs.
- Cursor-paginated edges support:
  - `before`
  - `after`
  - `limit`
- Time-based pagination supports:
  - `since`
  - `until`
  - `limit`
- The reviewed guide explicitly warns not to store cursors because they can quickly become invalid.
- The reviewed guide also says paging should stop when `next` no longer appears, because a page can be empty while still containing a `next` link.
- For time-based paging, the reviewed guide recommends specifying both `since` and `until`, and says the time difference should be at most `6 months` for consistent results.

## Rate limits
- The reviewed rate-limits guide says all API requests are subject to rate limits.
- The reviewed guide distinguishes:
  - Platform Rate Limits for Graph API requests
  - Business Use Case (BUC) Rate Limits for Marketing API and Instagram Platform requests
- Platform app-call formula confirmed from the reviewed guide:
  - `Calls within one hour = 200 * Number of Users`
- The reviewed guide says user-token requests are also rate-limited, but actual per-user call-count values are not disclosed.
- The reviewed guide says endpoints with sufficient traffic return usage headers such as `X-App-Usage` and, for older Ads API cases, `X-Ad-Account-Usage`.
- Confirmed `X-App-Usage` keys from the reviewed guide:
  - `call_count`
  - `total_cputime`
  - `total_time`
- Confirmed throttle error codes from the reviewed guide:
  - `4` app rate limit reached
  - `17` user rate limit reached
  - `32` Pages API rate limit reached
  - `613` custom rate limit reached

## Errors and format notes
- The reviewed error-handling page documents a standard JSON error envelope under top-level `error`.
- Confirmed common error codes from the reviewed page:
  - `1` API Unknown
  - `2` API Service
  - `3` API Method
  - `4` API Too Many Calls
  - `10` API Permission Denied
  - `17` API User Too Many Calls
  - `190` expired/invalid access token
  - `200-299` permission-related failures
  - `341` application limit reached
  - `368` temporarily blocked for policy violations
  - `506` duplicate post
  - `1609005` error posting link
- Confirmed authentication-related subcodes from the reviewed page:
  - `458` app not installed
  - `459` user checkpointed
  - `460` password changed
  - `463` expired
  - `464` unconfirmed user
  - `467` invalid access token
  - `492` invalid session / page-role issue
- The reviewed rate-limits guide says once a rate limit is reached, subsequent requests fail until enough time has passed for the rolling count to drop.

## Important usage notes
- The reviewed overview page positions the Graph API as a generic node/edge/field API rather than a narrowly scoped social-feed API.
- The same docs make clear that versioning matters: example auth and Graph URLs reviewed in this pass are on `v25.0`.
- The `metadata=1` pattern is still documented but explicitly deprecated in the reviewed version.
- fireROUTE adapters should treat `paging.next` / `paging.previous` URLs as authoritative rather than reconstructing pagination cursors manually.
- Rate limiting is multi-dimensional: besides call count, the reviewed guide also documents CPU-time and total-time pressure via `X-App-Usage`.
