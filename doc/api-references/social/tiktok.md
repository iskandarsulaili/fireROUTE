# TikTok

## Provider metadata
- Category: `Social`
- Provider slug: `tiktok`
- Official docs pages used:
  - `https://developers.tiktok.com/doc/login-kit-web`
  - `https://developers.tiktok.com/doc/oauth-user-access-token-management`
  - `https://developers.tiktok.com/doc/client-access-token-management`
  - `https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info`
  - `https://developers.tiktok.com/doc/tiktok-api-v2-video-query`
  - `https://developers.tiktok.com/doc/tiktok-api-v2-video-list`
  - `https://developers.tiktok.com/doc/tiktok-api-v2-rate-limit`
  - `https://developers.tiktok.com/doc/tiktok-api-v2-error-handling`
  - `https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info`
  - `https://developers.tiktok.com/doc/content-posting-api-reference-direct-post`
  - `https://developers.tiktok.com/doc/content-posting-api-reference-upload-video`
  - `https://developers.tiktok.com/doc/content-posting-api-reference-photo-post`
  - `https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status`
- Authorization host: `https://www.tiktok.com`
- API base URL: `https://open.tiktokapis.com/v2`
- Auth model: OAuth 2 authorization-code flow with refresh tokens, plus client-credentials tokens for selected app-level APIs
- Supported request methods confirmed in reviewed docs: `GET`, `POST`
- Response formats documented: redirect query parameters for login callbacks; JSON for token, display, and content-posting APIs
- Manually confirmed route count: `13`

## Authentication and common request rules
- TikTok web login starts with a browser redirect to `https://www.tiktok.com/v2/auth/authorize/`.
- Server-side token exchange happens at `https://open.tiktokapis.com/v2/oauth/token/` using `application/x-www-form-urlencoded`.
- User-resource routes use `Authorization: Bearer <token>`.
- JSON API routes reviewed in this pass require `Content-Type: application/json` or `application/json; charset=UTF-8` when they accept a request body.
- TikTok's v2 error model uses readable string error codes plus a `log_id` for support/debugging.

## Redirect URI rules
- A maximum of `10` redirect URIs is supported per app.
- Each redirect URI must be shorter than `512` characters.
- Redirect URIs must be absolute, static, and start with `https`.
- Redirect URIs cannot include URL fragments (`#`).

## Canonical endpoints

### 1) Authorization page
- Method: `GET`
- Base URL: `https://www.tiktok.com`
- Path: `/v2/auth/authorize/`
- Purpose: send a user through TikTok consent and return an authorization code

Query parameters documented:
- `client_key` - required app/client identifier
- `scope` - required comma-separated scopes requested for the app
- `redirect_uri` - required registered callback URI
- `state` - strongly recommended anti-forgery value that should be generated and validated by the app
- `response_type` - required and should be `code`
- `disable_auto_auth` - optional integer; `0` skips the consent page for valid sessions and `1` forces it to display

Redirect response parameters documented:
- `code`
- `scopes`
- `state`
- `error`
- `error_description`

### 2) Exchange authorization code for a user access token
- Method: `POST`
- Base URL: `https://open.tiktokapis.com/v2`
- Path: `/oauth/token/`
- Purpose: exchange an authorization code for a user access token and refresh token

Headers:
- `Content-Type: application/x-www-form-urlencoded`

Form parameters documented:
- `client_key` - required
- `client_secret` - required
- `code` - required authorization code from the callback
- `grant_type` - required; use `authorization_code`
- `redirect_uri` - required and must match the redirect URI used during authorization
- `code_verifier` - required for PKCE-based mobile or desktop flows

Documented success fields:
- `open_id`
- `scope`
- `access_token`
- `expires_in`
- `refresh_token`
- `refresh_expires_in`
- `token_type`

Lifetime notes:
- User `access_token` lifetime is documented as `24` hours.
- User `refresh_token` lifetime is documented as `365` days.

### 3) Refresh a user access token
- Method: `POST`
- Base URL: `https://open.tiktokapis.com/v2`
- Path: `/oauth/token/`
- Purpose: refresh a user access token without sending the user back through consent

Headers:
- `Content-Type: application/x-www-form-urlencoded`

Form parameters documented:
- `client_key` - required
- `client_secret` - required
- `grant_type` - required; use `refresh_token`
- `refresh_token` - required

Usage notes:
- TikTok warns the returned refresh token may change during refresh.
- Integrations should persist the newly returned refresh token whenever TikTok rotates it.

### 4) Issue a client-credentials token
- Method: `POST`
- Base URL: `https://open.tiktokapis.com/v2`
- Path: `/oauth/token/`
- Purpose: issue an app-level token for routes that do not act on a specific user

Headers:
- `Content-Type: application/x-www-form-urlencoded`

Form parameters documented:
- `client_key` - required
- `client_secret` - required
- `grant_type` - required; use `client_credentials`

Documented response fields:
- `access_token`
- `expires_in`
- `token_type`

Usage notes:
- The reviewed page says this flow is used for the Research API and Commercial Content API.
- The reviewed page documents a `7200` second (`2` hour) lifetime for this token.

### 5) Revoke user authorization
- Method: `POST`
- Base URL: `https://open.tiktokapis.com/v2`
- Path: `/oauth/revoke/`
- Purpose: revoke a user's authorization so the app no longer appears in the user's TikTok permissions list

Headers:
- `Content-Type: application/x-www-form-urlencoded`

Form parameters documented:
- `client_key` - required
- `client_secret` - required
- `token` - required access token to revoke

Response note:
- The reviewed docs say a successful revoke response body is empty.

### 6) Get user info
- Method: `GET`
- Full URL: `https://open.tiktokapis.com/v2/user/info/`
- Purpose: return profile/basic/stat fields for the authorized TikTok user
- Scope requirement: the reviewed page says the route needs scopes relevant to the requested fields

Headers:
- `Authorization: Bearer <user access token>`

Query parameters documented:
- `fields` - required comma-separated list of requested user fields

Reviewed field examples/scope notes include:
- `open_id`, `union_id`, `avatar_url` under `user.info.basic`
- `display_name`, `username`, `bio_description`, `profile_deep_link`, `is_verified` under profile/basic scopes
- `follower_count`, `following_count`, `likes_count`, `video_count` under `user.info.stats`

### 7) Query videos by ID
- Method: `POST`
- Full URL: `https://open.tiktokapis.com/v2/video/query/`
- Purpose: verify that listed videos belong to the authorized user and return selected video details
- Scope requirement: `video.list`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json`

Query parameters documented:
- `fields` - required comma-separated list of requested video fields

Body parameters documented:
- `filters.video_ids` - required list of TikTok video IDs; the page says up to `20` IDs can be sent per request

Reviewed selectable fields include:
- `id`
- `create_time`
- `cover_image_url`
- `share_url`
- `video_description`
- `duration`
- `height`
- `width`
- `title`
- `embed_html`
- `embed_link`
- `like_count`
- `comment_count`
- `share_count`
- `view_count`

Usage note:
- The reviewed docs say this route can refresh cover-image URL TTLs for the requested videos.

### 8) List a user's public videos
- Method: `POST`
- Full URL: `https://open.tiktokapis.com/v2/video/list/`
- Purpose: return the authorized user's public video posts sorted by `create_time` descending
- Scope requirement: `video.list`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json`

Body parameters documented:
- `cursor` - optional pagination cursor; the reviewed page says it is a UTC Unix timestamp in milliseconds
- `max_count` - optional page size; default `10`, maximum `20`

Response pagination fields documented:
- `videos`
- `cursor`
- `has_more`

Usage note:
- The reviewed examples request selected video fields through a `fields` query string on the route URL.

### 9) Query creator info before content posting
- Method: `POST`
- Full URL: `https://open.tiktokapis.com/v2/post/publish/creator_info/query/`
- Purpose: return the current creator's profile and permission settings so the client can render valid posting options
- Scope requirement: `video.publish`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json; charset=UTF-8`

Documented response fields reviewed in this pass:
- `creator_avatar_url`
- `creator_username`
- `creator_nickname`
- `privacy_level_options`
- `comment_disabled`
- `duet_disabled`
- `stitch_disabled`

Usage notes:
- The reviewed page says apps must call this before rendering an export page for direct posting.
- The reviewed page documents a per-user limit of `20` requests per minute.

### 10) Initialize a direct video post
- Method: `POST`
- Base URL: `https://open.tiktokapis.com`
- Path: `/v2/post/publish/video/init/`
- Purpose: initialize a direct-post video submission to TikTok
- Scope requirement: `video.publish`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json; charset=UTF-8`

Reviewed request fields include:
- `post_info.privacy_level` - must match one of the creator's `privacy_level_options`
- `post_info.title` - optional caption; reviewed page says the maximum length is `2200` UTF-16 runes
- `post_info.disable_duet`
- `post_info.disable_stitch`
- `source_info.source` - reviewed page says `FILE_UPLOAD` or `PULL_FROM_URL`
- `source_info.video_size` - required for `FILE_UPLOAD`
- `source_info.chunk_size` - required for `FILE_UPLOAD`
- `source_info.total_chunk_count` - required for `FILE_UPLOAD`
- `source_info.video_url` - required for `PULL_FROM_URL`

Usage notes:
- The reviewed page says unaudited clients are restricted to private viewing mode until TikTok audit/compliance review is completed.
- The reviewed page documents a per-user limit of `6` requests per minute.

### 11) Initialize an upload-only video flow
- Method: `POST`
- Base URL: `https://open.tiktokapis.com`
- Path: `/v2/post/publish/inbox/video/init/`
- Purpose: upload a video to a TikTok user's account without directly publishing it; the user completes the post in TikTok's editing flow
- Scope requirement: `video.upload`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json; charset=UTF-8`

Reviewed request fields include:
- `source_info.source` - `FILE_UPLOAD` or `PULL_FROM_URL`
- `source_info.video_size` - required for `FILE_UPLOAD`
- `source_info.chunk_size` - required for `FILE_UPLOAD`
- `source_info.total_chunk_count` - required for `FILE_UPLOAD`
- `source_info.video_url` - required for `PULL_FROM_URL`

Usage notes:
- The reviewed page tells integrators to inform users that they must open the inbox notification in TikTok to continue and complete the post.
- The reviewed page documents a per-user limit of `6` requests per minute.

### 12) Initialize a photo post or photo upload
- Method: `POST`
- Base URL: `https://open.tiktokapis.com`
- Path: `/v2/post/publish/content/init/`
- Purpose: directly post photos or upload photos for the TikTok editing flow
- Scope requirement: `video.publish` or `video.upload`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json; charset=UTF-8`

Reviewed request fields include:
- `media_type` - required; the reviewed page says only `PHOTO` is currently allowed
- `post_mode` - required; `DIRECT POST` or `MEDIA_UPLOAD`
- `post_info.title` - optional; maximum `90` UTF-16 runes for photo posts
- `post_info.description` - optional; maximum `4000` UTF-16 runes for photo posts
- `post_info.privacy_level` - required for direct posting and must match creator info
- `post_info.disable_comment`
- `post_info.auto_add_music`
- `post_info.brand_content_toggle`
- `source_info` - required media source object

Usage note:
- The reviewed page documents a per-user limit of `6` requests per minute.

### 13) Fetch content-post status
- Method: `POST`
- Base URL: `https://open.tiktokapis.com`
- Path: `/v2/post/publish/status/fetch/`
- Purpose: poll the status of uploaded or directly posted content
- Scope requirement: `video.upload` or `video.publish`

Headers:
- `Authorization: Bearer <user access token>`
- `Content-Type: application/json; charset=UTF-8`

Body parameters documented:
- `publish_id` - required publish identifier returned from a prior content-posting initialization flow

Reviewed response fields include:
- `status`
- `fail_reason`
- `publicaly_available_post_id`
- `uploaded_bytes`

Usage notes:
- The reviewed page documents a per-user limit of `30` requests per minute.
- The reviewed page says average content-processing times vary by upload size and moderation can finish within about a minute but may sometimes take hours.
- The same reviewed page also points developers to content-posting webhooks for final-outcome notifications.

## Pagination
- `/v2/video/list/` is the reviewed paginated route.
- Pagination uses `cursor` and `has_more`.
- The reviewed docs say the `cursor` is a UTC Unix timestamp in milliseconds.
- `max_count` defaults to `10` and is capped at `20`.

## Rate limits
- The official TikTok v2 rate-limit page reviewed in this pass lists default limits on a one-minute sliding window.
- Reviewed defaults:
  - `/v2/user/info/` -> `600` requests/minute
  - `/v2/video/query/` -> `600` requests/minute
  - `/v2/video/list/` -> `600` requests/minute
- If limits are exceeded, TikTok says the API returns HTTP `429` with error code `rate_limit_exceeded`.
- Content Posting API pages reviewed in this pass also publish per-user limits:
  - `/v2/post/publish/creator_info/query/` -> `20` requests/minute
  - `/v2/post/publish/video/init/` -> `6` requests/minute
  - `/v2/post/publish/inbox/video/init/` -> `6` requests/minute
  - `/v2/post/publish/content/init/` -> `6` requests/minute
  - `/v2/post/publish/status/fetch/` -> `30` requests/minute

## Errors and response notes
- The reviewed TikTok v2 error guide says error responses include:
  - `code`
  - `message`
  - `log_id`
- Reviewed documented error codes include:
  - `access_token_invalid` -> HTTP `401`
  - `internal_error` -> HTTP `500`
  - `invalid_file_upload` -> HTTP `400`
  - `invalid_params` -> HTTP `400`
  - `rate_limit_exceeded` -> HTTP `429`
  - `scope_not_authorized` -> HTTP `401`
  - `scope_permission_missed` -> HTTP `400`
- OAuth/token pages also show `error` and `error_description` fields for form-post token failures.

## Important usage notes
- The reviewed docs repeatedly recommend storing client secrets, access tokens, and refresh tokens only on the server side.
- Display API routes use field selection, so fireROUTE should preserve the caller's explicit `fields` list.
- Direct-post and photo-post flows depend on `creator_info/query` because privacy and interaction options must match the currently allowed settings of the TikTok creator account.
- Upload-only flows may require users to finish editing/publication inside TikTok after receiving an inbox notification.
- TikTok documents moderation delays for public posts and does not guarantee a strict time limit for final publication.

## fireROUTE normalization notes
- Treat each documented OAuth grant type at `/oauth/token/` as a separate operation because the required parameters, lifecycle, and applicable products differ.
- Model TikTok's display routes separately from content-posting routes because scopes, rate limits, and request bodies differ significantly.
- Preserve TikTok's string error codes and `log_id` in downstream error handling rather than flattening them away.
- Preserve the content-posting `publish_id` lifecycle because status polling and webhook correlation both depend on it.
