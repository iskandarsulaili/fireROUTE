# Twitch

## Provider metadata
- Category: `Social`
- Provider slug: `twitch`
- Official docs pages used:
  - `https://dev.twitch.tv/docs/authentication/`
  - `https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/`
  - `https://dev.twitch.tv/docs/api/guide/`
  - `https://dev.twitch.tv/docs/api/reference/`
- OAuth base URL: `https://id.twitch.tv/oauth2`
- Helix API base URL: `https://api.twitch.tv/helix`
- Auth models confirmed on the official pages:
  - OAuth 2.0 user access tokens
  - OAuth 2.0 app access tokens
- API request headers confirmed by the official pages and endpoint error notes:
  - `Authorization: Bearer TOKEN`
  - `Client-Id: [client_id]`
- Primary request formats confirmed on the reviewed pages: query-string parameters on `GET`, JSON request bodies on Helix write endpoints, `application/x-www-form-urlencoded` on token exchanges, form fields on the device-code examples
- Primary response format: JSON objects with top-level `data` arrays for Helix list/resource endpoints and `pagination.cursor` for cursor-paged responses
- Manually confirmed route count: `12`


## Authentication
- Twitch's authentication overview says APIs use OAuth 2.0 access tokens.
- The reviewed overview distinguishes `user access tokens` from `app access tokens`; each endpoint's reference page states which token type is allowed.
- The same overview says to treat access tokens, refresh tokens, and client secrets like passwords.
- The official auth overview says API requests pass the token as `Authorization: Bearer TOKEN`.
- The reviewed reference pages consistently validate a matching `Client-Id` header against the client ID embedded in the token.

## API-wide behavior
- The Helix reference pages reviewed use the `https://api.twitch.tv/helix` base URL.
- The OAuth/token flows reviewed use the `https://id.twitch.tv/oauth2` base URL.
- Twitch's API guide says list endpoints use cursor-based pagination with `after`, `before`, and `first`.
- The same guide says `after` and `before` are mutually exclusive.
- The guide says paginated responses include a `pagination` object with `cursor`; an empty `pagination` object means there are no more pages in the direction you're paging.
- The guide notes list data is dynamic, so duplicates or gaps can appear while paging through changing result sets.

## Canonical endpoints

### Authentication and token flows
#### 1) Authorize a user-facing OAuth app
- Method: `GET`
- URL: `https://id.twitch.tv/oauth2/authorize`
- Purpose: send the user to Twitch's consent screen for the authorization-code flow

Confirmed query parameters:
- `client_id` - required registered application client ID
- `force_verify` - optional boolean to force re-authorization; default `false`
- `redirect_uri` - required registered redirect URI
- `response_type` - required and must be `code`
- `scope` - required space-delimited scope list, URL-encoded
- `state` - optional but strongly recommended CSRF value

Flow notes:
- If the user approves, Twitch redirects to `redirect_uri` with `code`, `scope`, and optional `state`.
- If the user denies access, Twitch redirects with `error=access_denied` and `error_description`.

#### 2) Exchange an authorization code for tokens
- Method: `POST`
- URL: `https://id.twitch.tv/oauth2/token`
- Content type: `application/x-www-form-urlencoded`
- Purpose: exchange an OAuth authorization code for a user access token and refresh token

Confirmed form parameters:
- `client_id` - required client ID
- `client_secret` - required client secret
- `code` - required authorization code returned by `/authorize`
- `grant_type` - required and must be `authorization_code`
- `redirect_uri` - required redirect URI

Confirmed response fields from the official example:
- `access_token`
- `expires_in`
- `refresh_token`
- `scope[]`
- `token_type`

#### 3) Get an app access token with the client-credentials flow
- Method: `POST`
- URL: `https://id.twitch.tv/oauth2/token`
- Content type: `application/x-www-form-urlencoded`
- Purpose: mint an app access token for server-to-server requests

Confirmed form parameters:
- `client_id` - required client ID
- `client_secret` - required client secret
- `grant_type` - required and must be `client_credentials`

Confirmed response fields from the official example:
- `access_token`
- `expires_in`
- `token_type`

#### 4) Start the device-code grant flow
- Method: `POST`
- URL: `https://id.twitch.tv/oauth2/device`
- Purpose: begin device authorization for clients with limited input/browser support

Confirmed parameters from the official page:
- `client_id` - required client ID
- `scopes` - required space-delimited scope list

Confirmed response fields:
- `device_code`
- `expires_in`
- `interval`
- `user_code`
- `verification_uri`

Usage note:
- The page says `verification_uri` is the address you send the user to so they can complete authorization.

#### 5) Exchange a device code for tokens
- Method: `POST`
- URL: `https://id.twitch.tv/oauth2/token`
- Purpose: poll for a device-flow access token / refresh token pair

Confirmed parameters from the official page:
- `client_id` - required client ID
- `scopes` - required scope list
- `device_code` - required code returned by `/oauth2/device`
- `grant_type` - required and must be `urn:ietf:params:oauth:grant-type:device_code`

Confirmed success response fields:
- `access_token`
- `expires_in`
- `refresh_token`
- `scope[]`
- `token_type`

Confirmed pending/invalid examples from the official page:
- `{"status":400,"message":"authorization_pending"}` before the user authorizes
- `{"status":400,"message":"invalid device code"}` after one-time use / invalid device code
- `{"status":400,"message":"Invalid refresh token"}` for reusing an already-spent refresh token

### Helix API resources
#### 6) Get users
- Method: `GET`
- Path: `/users`
- Base URL: `https://api.twitch.tv/helix`
- Auth: app access token or user access token
- Purpose: fetch one or more users, or the current token owner when no `id`/`login` is passed with a user token

Confirmed query parameters:
- `id` - repeatable user ID; maximum `100`
- `login` - repeatable login name; maximum `100`

Important notes:
- The docs say the combined number of looked-up users may not exceed `100`.
- The docs say `email` appears only for the consenting user when the token has the `user:read:email` scope.

Confirmed response fields include:
- `id`
- `login`
- `display_name`
- `type`
- `broadcaster_type`
- `description`
- `profile_image_url`
- `offline_image_url`
- `view_count` - explicitly deprecated by the docs
- `email` - conditional on scope/token context
- `created_at`

Confirmed error notes:
- `400` if `id`/`login` is missing for non-user-token requests or the query-count limit is exceeded
- `401` if auth is missing/invalid or the `Client-Id` does not match the token

#### 7) Get channel information
- Method: `GET`
- Path: `/channels`
- Base URL: `https://api.twitch.tv/helix`
- Auth: app access token or user access token
- Purpose: fetch one or more channel records by broadcaster ID

Confirmed query parameters:
- `broadcaster_id` - required, repeatable, maximum `100`

Confirmed response fields include:
- `broadcaster_id`
- `broadcaster_login`
- `broadcaster_name`
- `broadcaster_language`
- `game_name`
- `game_id`
- `title`
- `delay`
- `tags[]`
- `content_classification_labels[]`
- `is_branded_content`

Confirmed error notes:
- `400` for missing/invalid `broadcaster_id`
- `401` for missing/invalid auth or `Client-Id` mismatch
- `429` when the application exceeds allowed calls per minute

#### 8) Modify channel information
- Method: `PATCH`
- Path: `/channels`
- Base URL: `https://api.twitch.tv/helix`
- Auth: user access token with `channel:manage:broadcast`
- Purpose: update a broadcaster's channel properties

Confirmed query parameter:
- `broadcaster_id` - required and must match the token's user ID

Confirmed JSON body fields:
- `game_id`
- `broadcaster_language`
- `title`
- `delay`
- `tags[]`
- `content_classification_labels[]` with `id` and `is_enabled`
- `is_branded_content`

Important usage notes:
- The docs say you must send at least one field.
- `delay` is partner-only and capped at `900` seconds.
- A channel may have at most `10` tags; each tag is limited to `25` characters and may not contain spaces or special characters.

Confirmed response/error notes:
- Success returns `204 No Content`
- `400` covers empty updates, invalid game IDs, invalid tags, partner restrictions, and AutoMod review failures
- `403` is used for forbidden content-classification-label requests
- `409` is documented for setting the branded-content flag too frequently

#### 9) Get streams
- Method: `GET`
- Path: `/streams`
- Base URL: `https://api.twitch.tv/helix`
- Auth: app access token or user access token
- Purpose: list live streams ordered by viewer count

Confirmed query parameters:
- `user_id` - repeatable, max `100`
- `user_login` - repeatable, max `100`
- `game_id` - repeatable, max `100`
- `type` - `all` or `live`, default `all`
- `language` - repeatable ISO 639-1 code or `other`, max `100`
- `first` - page size from `1` to `100`, default `20`
- `before` - previous-page cursor
- `after` - next-page cursor

Confirmed response fields include:
- `id`
- `user_id`
- `user_login`
- `user_name`
- `game_id`
- `game_name`
- `type`
- `title`
- `tags[]`
- `viewer_count`
- `started_at`
- `language`
- `thumbnail_url`
- `tag_ids[]` - explicitly deprecated
- `is_mature` - explicitly deprecated and always `false`
- `pagination.cursor`

Important usage note:
- The docs warn that duplicate or missing streams can appear while paging because viewer counts change continuously.

#### 10) Search channels
- Method: `GET`
- Path: `/search/channels`
- Base URL: `https://api.twitch.tv/helix`
- Auth: app access token or user access token
- Purpose: search channels that match a query and streamed within the last 6 months

Confirmed query parameters:
- `query` - required URI-encoded search string
- `live_only` - optional boolean; default `false`
- `first` - page size from `1` to `100`, default `20`
- `after` - next-page cursor

Important usage notes:
- The docs say matching behavior changes depending on `live_only`.
- By default the endpoint returns both live and offline channels.

Confirmed response fields include:
- `broadcaster_language`
- `broadcaster_login`
- `display_name`
- `game_id`
- `game_name`
- `id`
- `is_live`
- `tag_ids[]` - explicitly deprecated
- `tags[]`
- `thumbnail_url`
- `title`
- `started_at`

#### 11) Get videos
- Method: `GET`
- Path: `/videos`
- Base URL: `https://api.twitch.tv/helix`
- Auth: app access token or user access token
- Purpose: fetch published videos by video ID, broadcaster, or game/category

Confirmed query parameters:
- `id` - repeatable video ID list, max `100`
- `user_id` - broadcaster ID
- `game_id` - category/game ID
- `language` - optional language filter; allowed only when `game_id` is set
- `period` - `all`, `day`, `month`, `week`; default `all`
- `sort` - `time`, `trending`, `views`; default `time`
- `type` - `all`, `archive`, `highlight`, `upload`; default `all`
- `first` - page size `1` to `100`, default `20`
- `after` - next-page cursor; only when `user_id` is used
- `before` - previous-page cursor; only when `user_id` is used

Important usage notes:
- The docs say `id`, `user_id`, and `game_id` are mutually exclusive.
- The docs say `game_id` queries return at most `500` videos.
- The docs say `thumbnail_url` requires replacing `${width}`/`${height}` and currently only supports `320x180`.

Confirmed response fields include:
- `id`
- `stream_id`
- `user_id`
- `user_login`
- `user_name`
- `title`
- `description`
- `created_at`
- `published_at`
- `url`
- `thumbnail_url`
- `viewable`
- `view_count`
- `language`
- `type`
- `duration`
- `muted_segments[]`
- `pagination.cursor`

#### 12) Social/chat operations
- `GET /chat/chatters`
  - Auth: user token with `moderator:read:chatters`, or the documented beta app-token path with prior authorization for the moderator user
  - Required query parameters: `broadcaster_id`, `moderator_id`
  - Pagination: `first` from `1` to `1000`, plus `after`
  - Confirmed response fields: chatter `user_id`, `user_login`, `user_name`, `pagination.cursor`, `total`
  - Confirmed auth note: `moderator_id` must match the token user, and `403` is returned if that user is not one of the broadcaster's moderators
- `POST /chat/messages`
  - Auth: app access token or user access token with `user:write:chat`; app-token use additionally requires the documented `user:bot` plus `channel:bot` or moderator status conditions
  - Required JSON body fields: `broadcaster_id`, `sender_id`, `message`
  - Optional fields: `reply_parent_message_id`, `for_source_only`, `pin`
  - Confirmed response fields: `message_id`, `is_sent`, optional `drop_reason.code`, optional `drop_reason.message`
  - Important notes: messages are capped at `500` characters; `pin=true` needs `moderator:manage:chat_messages`; `for_source_only` is app-token-only; the endpoint documents `429 Too Many Requests`

## Rate limits
- Twitch's API concepts page says Helix uses a token-bucket algorithm.
- The same page says endpoints default to a cost of `1` point per request unless the endpoint documentation states otherwise.
- Twitch says apps have one bucket for app-access requests and another for user-access requests.
- For requests using a user access token, the official guide says limits are applied per client ID, per user, per minute.
- If a bucket runs out within one minute, Twitch returns HTTP `429`.
- Confirmed rate-limit headers:
  - `Ratelimit-Limit`
  - `Ratelimit-Remaining`
  - `Ratelimit-Reset`

## Errors and response notes
- The reviewed reference pages repeatedly use JSON responses with descriptive `data` arrays for success payloads.
- The official docs use standard HTTP status codes including `200`, `204`, `400`, `401`, `403`, `422`, `429`, and `500` depending on the endpoint.
- The token/device examples use JSON error bodies with `status` and `message` for pending/invalid-device situations.
- The reference pages consistently mention `401` when the token is missing/invalid or the `Client-Id` header does not match the token.

## fireROUTE integration notes
- Always send both `Authorization` and `Client-Id` on Helix requests.
- Respect endpoint-specific token-type requirements; many read endpoints accept app or user tokens, but write/chat/moderation endpoints often require specific user scopes.
- Use cursor pagination exactly as documented (`after`/`before` plus `first`) and expect dynamic list drift while paging.
- Preserve endpoint-specific scope and moderator/broadcaster ownership checks in adapters; Twitch surfaces many of these as `401` or `403` instead of a uniform schema.
