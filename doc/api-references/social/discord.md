# Discord

## Provider metadata
- Category: `Social`
- Provider slug: `discord`
- Official docs pages used:
  - `https://discord.com/developers/docs/intro`
  - `https://docs.discord.com/developers/reference`
  - `https://docs.discord.com/developers/topics/oauth2`
  - `https://docs.discord.com/developers/topics/rate-limits`
  - `https://docs.discord.com/developers/resources/user`
  - `https://docs.discord.com/developers/resources/channel`
  - `https://docs.discord.com/developers/resources/message`
- Main API base URL: `https://discord.com/api`
- Versioned API base pattern: `https://discord.com/api/v{version_number}`
- OAuth authorization URL: `https://discord.com/oauth2/authorize`
- OAuth token URL: `https://discord.com/api/oauth2/token`
- OAuth token revocation URL: `https://discord.com/api/oauth2/token/revoke`
- Auth models: bot token in `Authorization: Bot {token}` for bot HTTP API calls; bearer token in `Authorization: Bearer {token}` for OAuth2 user/app flows
- Supported request payload formats confirmed on the reviewed pages: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- Response formats confirmed on the reviewed pages: JSON for HTTP APIs; WebSocket for Gateway APIs mentioned on the reference page
- Manually confirmed route count: `22`

## Authentication
- The API reference says authentication is performed with the `Authorization` HTTP header.
- The reference page documents two primary HTTP auth styles:
  - `Bot {token}` for bot-token requests.
  - `Bearer {access_token}` for OAuth2 bearer-token requests.
- The OAuth2 page documents these URL roles:
  - `https://discord.com/oauth2/authorize` for user authorization.
  - `https://discord.com/api/oauth2/token` for token exchange and refresh.
  - `https://discord.com/api/oauth2/token/revoke` for revocation.
- The OAuth2 page explicitly says the token and revocation endpoints only accept `application/x-www-form-urlencoded`; JSON bodies are not permitted.

## API-wide behavior
- The API reference defines the base URL as `https://discord.com/api`.
- The same page says versioned requests should use `/api/v{version_number}` and that omitting a version routes to the current default version.
- The reviewed reference page listed API versions `10` and `9` as available, `8-6` as deprecated, and `5-3` as discontinued.
- The reference page says request and response bodies should be treated as UTF-8.
- The reference page documents JSON error envelopes with top-level `code`, `message`, and nested `errors` details for validation failures.

## Canonical endpoints

### OAuth2 and authorization
#### 1) Start OAuth2 authorization
- Method: `GET`
- URL: `https://discord.com/oauth2/authorize`
- Purpose: prompt the user to authorize scopes for an application
- Confirmed query parameters from the official OAuth2 page:
  - `response_type` - grant type indicator such as `code`
  - `client_id` - application client ID
  - `scope` - URL-encoded space-separated scopes
  - `redirect_uri` - registered callback URL
  - `state` - caller-generated CSRF token / correlation value
  - `prompt` - `consent` or `none`
  - `integration_type` - installation context such as `0` for guild install or `1` for user install when relevant

#### 2) Exchange code or refresh token
- Method: `POST`
- URL: `https://discord.com/api/oauth2/token`
- Purpose: exchange an authorization code for tokens or refresh an access token
- Content type: `application/x-www-form-urlencoded`
- Confirmed form parameters:
  - `grant_type` - `authorization_code` or `refresh_token`
  - `code` - authorization code when exchanging a redirect result
  - `redirect_uri` - must match the redirect URI used during authorization-code exchange
  - `refresh_token` - required for refresh flow
- Confirmed response fields from the official example:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `refresh_token`
  - `scope`

#### 3) Revoke an OAuth2 token
- Method: `POST`
- URL: `https://discord.com/api/oauth2/token/revoke`
- Purpose: revoke an access token or refresh token
- Content type: `application/x-www-form-urlencoded`
- Confirmed form parameters from the official OAuth2 page:
  - `token` - required token to revoke
  - `token_type_hint` - optional `access_token` or `refresh_token`

#### 4) Get current bot application information
- Method: `GET`
- Path: `/oauth2/applications/@me`
- Purpose: return the bot application's application object
- Auth: bearer token per the OAuth2 page section where this route is documented

#### 5) Get current authorization information
- Method: `GET`
- Path: `/oauth2/@me`
- Purpose: inspect the current OAuth2 authorization
- Auth: `Authorization: Bearer {token}`
- Confirmed response fields:
  - `application`
  - `scopes`
  - `expires`
  - `user` when `identify` scope is present

### Users
#### 6) Get current user
- Method: `GET`
- Path: `/users/@me`
- Purpose: return the requester user object
- Scope notes:
  - `identify` returns the user without email
  - `email` additionally returns the email if present

#### 7) Get user by ID
- Method: `GET`
- Path: `/users/{user.id}`
- Purpose: return a user object for a specific user ID

#### 8) Modify current user
- Method: `PATCH`
- Path: `/users/@me`
- Purpose: modify the requester's own user settings
- JSON parameters confirmed on the official page:
  - `username` - username string
  - `avatar` - image data
  - `banner` - image data
- Important note: the official page says all parameters are optional and successful calls fire a `User Update` Gateway event

#### 9) Get current user guilds
- Method: `GET`
- Path: `/users/@me/guilds`
- Purpose: list partial guild objects for the current user
- Required scope: `guilds`
- Confirmed query parameters:
  - `before` - guild snowflake cursor
  - `after` - guild snowflake cursor
  - `limit` - `1-200`, default `200`
  - `with_counts` - include approximate member/presence counts
- Pagination note: the official page says the endpoint returns `200` guilds by default, which is the maximum a non-bot user can join, so many integrations do not need pagination here

#### 10) Get current user guild member record
- Method: `GET`
- Path: `/users/@me/guilds/{guild.id}/member`
- Purpose: return the current user's guild-member object for one guild
- Required scope: `guilds.members.read`

#### 11) Leave guild
- Method: `DELETE`
- Path: `/users/@me/guilds/{guild.id}`
- Purpose: leave a guild
- Important note: the official page says success returns `204 No Content`

#### 12) Create DM or Group DM
- Method: `POST`
- Path: `/users/@me/channels`
- Purpose: create a direct-message channel
- Variant A, DM creation JSON parameters:
  - `recipient_id` - recipient snowflake
- Variant B, Group DM creation JSON parameters:
  - `access_tokens` - array of OAuth2 tokens from users who granted `gdm.join`
  - `nicks` - dictionary of user IDs to nicknames
- Usage notes from the official page:
  - the DM variant may return an existing DM if one already exists
  - the Group DM variant is limited to `10` active group DMs
  - Discord warns against opening large numbers of unsolicited DMs too quickly

#### 13) Get current user connections
- Method: `GET`
- Path: `/users/@me/connections`
- Purpose: list linked third-party account connections
- Required scope: `connections`

### Channels and threads
#### 14) Get channel
- Method: `GET`
- Path: `/channels/{channel.id}`
- Purpose: return a channel object by ID
- Important note: if the channel is a thread, the returned result also includes a thread-member object

#### 15) Create channel invite
- Method: `POST`
- Path: `/channels/{channel.id}/invites`
- Purpose: create a guild-channel invite
- Required permission: `CREATE_INSTANT_INVITE`
- Confirmed JSON or form parameters:
  - `max_age` - expiry in seconds, `0-604800`, default `86400`
  - `max_uses` - use count, `0-100`, default `0`
  - `temporary` - temporary membership flag
  - `unique` - force unique invite instead of possible reuse
  - `target_type` - invite target type
  - `target_user_id` - required when `target_type` is `1`
  - `target_application_id` - required when `target_type` is `2`
  - `target_users_file` - CSV upload for allowed user IDs in multipart requests
  - `payload_json` - JSON-encoded non-file params for multipart requests
  - `role_ids` - guild role IDs granted to accepted users
- Important note: the official page says a request body is still required even if it is just `{}`

#### 16) Start thread from message
- Method: `POST`
- Path: `/channels/{channel.id}/messages/{message.id}/threads`
- Purpose: create a new thread from an existing message
- Confirmed JSON parameters:
  - `name` - `1-100` character thread name
  - `auto_archive_duration` - one of `60`, `1440`, `4320`, `10080`
  - `rate_limit_per_user` - per-user slowmode seconds, `0-21600`
- Important note: the official page says the created thread ID matches the source message ID

#### 17) List public archived threads
- Method: `GET`
- Path: `/channels/{channel.id}/threads/archived/public`
- Purpose: list archived public or announcement threads in a channel
- Required permission: `READ_MESSAGE_HISTORY`
- Query parameters:
  - `before` - ISO 8601 timestamp cursor
  - `limit` - maximum threads to return
- Confirmed response fields:
  - `threads`
  - `members`
  - `has_more`

### Messages
#### 18) Get channel messages
- Method: `GET`
- Path: `/channels/{channel.id}/messages`
- Purpose: list channel messages from newest to oldest
- Confirmed query parameters:
  - `around` - message snowflake
  - `before` - message snowflake
  - `after` - message snowflake
  - `limit` - `1-100`, default `50`
- Important notes from the official page:
  - `before`, `after`, and `around` are mutually exclusive
  - guild channels require `VIEW_CHANNEL`
  - voice channels additionally require `CONNECT`
  - without `READ_MESSAGE_HISTORY`, no messages are returned

#### 19) Create message
- Method: `POST`
- Path: `/channels/{channel.id}/messages`
- Purpose: post a message to a guild text channel or DM
- Confirmed JSON or form parameters shown on the official page excerpt reviewed:
  - `content` - up to `2000` characters
  - `nonce` - client-supplied dedupe/correlation value
  - `message_reference` - reply or forward reference object
  - `allowed_mentions` - mention-control object
  - file attachments via `multipart/form-data`
- Important usage notes:
  - files must be sent with `multipart/form-data`
  - maximum request size is `25 MiB`
  - guild sends require `SEND_MESSAGES`
  - replies also require `READ_MESSAGE_HISTORY`
  - Discord warns about sanitizing user-generated content and controlling mentions

#### 20) Get reactions for one emoji
- Method: `GET`
- Path: `/channels/{channel.id}/messages/{message.id}/reactions/{emoji.id}`
- Purpose: list users who reacted with a specific emoji
- Confirmed query parameters:
  - `type` - reaction type, default `0`
  - `after` - user snowflake cursor
  - `limit` - `1-100`, default `25`
- Important notes:
  - the page says the emoji must be URL-encoded
  - custom emoji must use `name:id`
  - documented reaction types are `NORMAL=0` and `BURST=1`

#### 21) Bulk delete messages
- Method: `POST`
- Path: `/channels/{channel.id}/messages/bulk-delete`
- Purpose: delete multiple messages in one request for a guild channel
- Required permission: `MANAGE_MESSAGES`
- JSON parameters:
  - `messages` - array of `2-100` message snowflakes
- Important notes:
  - success returns `204 No Content`
  - messages older than two weeks cannot be deleted through this endpoint
  - duplicate IDs or too-old messages produce `400 BAD REQUEST`
  - the endpoint supports `X-Audit-Log-Reason`

#### 22) Get channel pins
- Method: `GET`
- Path: `/channels/{channel.id}/messages/pins`
- Purpose: list pinned messages in a channel
- Query parameters:
  - `before` - ISO 8601 pinned-at cursor
  - `limit` - `1-50`, default `50`
- Confirmed response fields:
  - `items`
  - `has_more`
- Important note: the official page includes a two-request example for fetching `100` pins using the returned `pinned_at` cursor

## Rate limits
- The official rate-limits page says Discord applies both per-route and global limits to bots and users.
- The docs explicitly warn not to hard-code limits and instead to parse returned headers.
- Confirmed rate-limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `X-RateLimit-Reset-After`
  - `X-RateLimit-Bucket`
  - `X-RateLimit-Global`
  - `X-RateLimit-Scope`
- The reviewed page says all bots can make up to `50` requests per second globally.
- The same page says interaction endpoints are not bound to the bot global rate limit.
- The invalid-request limit documented on the same page is `10,000` invalid requests per `10` minutes per IP for statuses such as `401`, `403`, or `429`.

## Pagination, cursors, and collection behavior
- Discord uses endpoint-specific pagination rather than one global pagination format.
- Confirmed pagination patterns from the reviewed pages include:
  - snowflake cursors such as `before`, `after`, and `around`
  - ISO 8601 cursors such as `before` on archived threads and pinned messages
  - explicit `limit` parameters with route-specific caps
- Thread-list and pins-list responses explicitly include `has_more`.
- The reference page separately documents snowflake IDs in pagination as a platform-wide concept.

## Error and format notes
- The API reference shows validation failures returning JSON with `code`, `message`, and nested `errors` objects.
- The rate-limits page shows `429` responses with JSON fields:
  - `message`
  - `retry_after`
  - `global`
  - optional `code`
- The rate-limits page instructs clients to honor the `Retry-After` header or `retry_after` field.
- The reference page states that some upload/file-related requests use `multipart/form-data`.

## fireROUTE normalization notes
- Treat bot-token and bearer-token auth as separate auth modes even when paths overlap.
- Preserve route-specific pagination semantics instead of forcing a single global page schema.
- Preserve Discord validation and rate-limit response bodies; they contain actionable structured error detail.
- Model `/users/@me/channels` carefully because the same operation path is used for both one-to-one DM creation and Group DM creation with different payload expectations.
- Preserve audit-log-reason header support on routes where the docs explicitly call it out.
