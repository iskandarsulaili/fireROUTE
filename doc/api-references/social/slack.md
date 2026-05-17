# Slack

## Provider metadata
- Category: `Social`
- Provider slug: `slack`
- Official docs pages used:
  - `https://docs.slack.dev/apis/web-api/`
  - `https://docs.slack.dev/apis/web-api/pagination`
  - `https://docs.slack.dev/apis/web-api/rate-limits`
  - `https://docs.slack.dev/authentication/installing-with-oauth`
  - `https://docs.slack.dev/reference/methods/oauth.v2.access`
  - `https://docs.slack.dev/reference/methods/auth.test`
  - `https://docs.slack.dev/reference/methods/conversations.list`
  - `https://docs.slack.dev/reference/methods/conversations.history`
  - `https://docs.slack.dev/reference/methods/chat.postMessage`
  - `https://docs.slack.dev/reference/methods/users.info`
- OAuth authorize URL: `https://slack.com/oauth/v2/authorize`
- Main Web API base URL: `https://slack.com/api`
- GovSlack variants noted by the official docs: `https://slack-gov.com/oauth/v2/authorize` and `https://slack-gov.com/api/*`
- Auth model: Slack v2 OAuth 2.0 plus bearer tokens for Web API calls
- Request formats confirmed on the official pages: `application/x-www-form-urlencoded`, `application/json`, query-string parameters on `GET`
- Response format: JSON objects with top-level `ok` boolean; paginated responses include `response_metadata.next_cursor`
- Manually confirmed route count: `7`

## Authentication
- Slack says new app installs use a v2 OAuth 2.0 flow.
- The reviewed auth guide says OAuth consists of three practical steps:
  - request scopes by redirecting a user to Slack
  - wait for approval and receive a temporary `code`
  - exchange that `code` for an access token with `oauth.v2.access`
- The authorize step uses bot scopes in `scope` and optional user scopes in `user_scope`.
- The guide says `redirect_uri` must use HTTPS. If you pass `redirect_uri` during the authorize step, you must pass the same value again to `oauth.v2.access` or Slack returns `bad_redirect_uri`.
- The guide says the returned authorization `code` expires after `10` minutes.
- For Web API calls, the Web API overview says tokens should be sent as `Authorization: Bearer ...` when using JSON request bodies.
- The `oauth.v2.access` method page says client credentials should preferably be supplied with HTTP Basic auth instead of as form parameters.

## API-wide behavior
- Slack's official Web API overview describes the API as HTTP RPC-style methods rather than a REST API.
- The canonical method URL pattern is `https://slack.com/api/METHOD_FAMILY.method`.
- Methods may accept arguments through:
  - `GET` query parameters
  - `POST` form fields with `Content-Type: application/x-www-form-urlencoded`
  - JSON request bodies on methods that support JSON
- The Web API overview explicitly warns not to mix query parameters, form fields, and JSON attributes in one request.
- The overview also says posted JSON must be an object and can fail with `invalid_json` or `json_not_object`.

## Canonical endpoints

### 1) Start app installation / user authorization
- Method: `GET`
- URL: `https://slack.com/oauth/v2/authorize`
- Purpose: redirect the user to Slack to approve bot scopes and optional user scopes

Confirmed query parameters from the official OAuth guide:
- `client_id` - required app client ID
- `scope` - comma-separated bot scopes such as `incoming-webhook,commands`
- `user_scope` - optional comma-separated user scopes such as `search:read`
- `redirect_uri` - optional unless needed to disambiguate configured redirect URLs; must use HTTPS
- `state` - optional anti-forgery value; the guide says to verify it on return if you sent it

Response / flow notes:
- Slack redirects the user back to the configured redirect URL.
- The redirected request includes a temporary `code`.
- The docs say the returned `code` expires after `10` minutes.

### 2) Exchange code or refresh a token
- Method: `POST`
- Path: `/oauth.v2.access`
- Base URL: `https://slack.com/api`
- Purpose: exchange an OAuth verifier `code` for tokens, or refresh a token when `grant_type=refresh_token`

Content types confirmed by the official method page:
- `application/x-www-form-urlencoded`
- `application/json`

Documented parameters:
- `client_id` - optional on the method page, but required unless you send credentials via HTTP Basic auth
- `client_secret` - optional on the method page, but required unless you send credentials via HTTP Basic auth
- `code` - temporary code from the OAuth callback
- `code_verifier` - optional PKCE verifier
- `redirect_uri` - required when the authorize step included it
- `grant_type` - OAuth grant type such as `authorization_code` or `refresh_token`
- `refresh_token` - used when `grant_type=refresh_token`

Confirmed response fields from the official example:
- `ok`
- `access_token`
- `token_type`
- `scope`
- `bot_user_id`
- `app_id`
- `team.name`
- `team.id`
- `enterprise.name`
- `enterprise.id`
- `authed_user.id`
- `authed_user.scope`
- `authed_user.access_token`
- `authed_user.token_type`

Rate-limit note:
- The method page gives a specific rate limit of `600 per minute`.

### 3) Verify a token and discover identity
- Method: `POST`
- Path: `/auth.test`
- Base URL: `https://slack.com/api`
- Purpose: verify authentication and identify the calling workspace/user or bot

Required parameter:
- `token` - authentication token; the page says it may be passed via `Authorization` header or as a POST parameter

Confirmed success fields from the official examples:
- `ok`
- `url`
- `team`
- `user`
- `team_id`
- `user_id`
- `bot_id` - present for bot token responses
- `enterprise_id` - documented for enterprise contexts

Confirmed error examples:
- `invalid_auth`
- `not_authed`

Rate-limit note:
- The method page says this method allows `hundreds of requests per minute`.

### 4) List conversations
- Method: `GET`
- Path: `/conversations.list`
- Base URL: `https://slack.com/api`
- Purpose: list channel-like conversations visible to the token

Required parameter:
- `token` - bearer token with the listed scopes

Confirmed scopes from the method page:
- Bot token: `channels:read`, `groups:read`, `im:read`, `mpim:read`
- User token: `channels:read`, `groups:read`, `im:read`, `mpim:read`

Confirmed query parameters:
- `cursor` - pagination cursor from `response_metadata.next_cursor`
- `exclude_archived` - boolean to skip archived channels
- `limit` - integer under `1000`; default `100`
- `team_id` - required when using an org-wide app token
- `types` - comma-separated conversation types such as `public_channel,private_channel,mpim,im`

Response notes:
- Successful responses include `ok` and `channels[]`.
- The page warns that filtering such as `exclude_archived=true` is applied after retrieving a virtual page, so a page can contain fewer than `limit` results even when more results exist.

Rate-limit note:
- The method page assigns `Tier 2: 20+ per minute`.

### 5) Read conversation history
- Method: `GET`
- Path: `/conversations.history`
- Base URL: `https://slack.com/api`
- Purpose: fetch messages and events from one conversation

Required parameters:
- `token` - bearer token with the relevant history scope
- `channel` - conversation ID

Confirmed optional query parameters:
- `cursor` - pagination cursor
- `include_all_metadata` - include message metadata
- `inclusive` - include messages matching `oldest` or `latest`
- `latest` - only messages before this Unix timestamp
- `limit` - maximum `999`; default `100`
- `oldest` - only messages after this Unix timestamp

Access notes from the official page:
- App-level tokens can read conversations where the app is a member.
- Bot tokens can read conversations where the bot is a member.
- User tokens can read public conversations plus private conversations the user is a member of.
- Legacy bot user tokens are limited to DM and MPDM conversations.

Rate-limit notes:
- The method page assigns `Tier 3: 50+ per minute` for Marketplace and internal customer-built apps.
- The same page says that as of `2025-05-29`, newly created commercially distributed non-Marketplace apps are limited to `1 request per minute` for this method, and the default and maximum `limit` are reduced to `15` objects for those apps.

### 6) Post a message
- Method: `POST`
- Path: `/chat.postMessage`
- Base URL: `https://slack.com/api`
- Purpose: send a message into a channel, DM, private group, or thread

Required parameters:
- `token` - bot or user token with `chat:write`
- `channel` - encoded channel ID or channel name

Confirmed scopes from the method page:
- Bot token: `chat:write`
- User token: `chat:write`

Confirmed optional parameters documented on the reviewed page:
- `attachments` - JSON array encoded as a string when form-posted
- `blocks` - JSON array of Block Kit structures
- `icon_emoji`
- `icon_url`
- `link_names`
- `markdown_text`
- `metadata`
- `mrkdwn`
- `parse`
- `reply_broadcast`
- `text`
- `thread_ts`
- `unfurl_links`
- `unfurl_media`
- `username`

Important usage notes:
- The page says `text` behavior depends on other fields and is especially important for accessibility/fallback handling with blocks.
- The Web API overview recommends JSON request bodies for methods with structured JSON arguments like `attachments` or `blocks`.

Rate-limit note:
- The method page marks this as `Special rate limits apply`.
- The global rate-limit page says `chat.postMessage` generally allows about `1 message per second per channel` and also has a workspace-wide limit.

### 7) Get one user's profile record
- Method: `GET`
- Path: `/users.info`
- Base URL: `https://slack.com/api`
- Purpose: return information about one workspace member

Required parameters:
- `token` - bearer token with user-read scope
- `user` - user ID to inspect

Confirmed scopes from the method page:
- Bot token: `users:read`
- User token: `users:read`

Confirmed optional parameter:
- `include_locale` - set `true` to include locale data

Response notes from the official page:
- Successful responses include `ok` and a `user` object.
- Error example shown: `user_not_found`.
- The docs note that the `email` field now additionally requires the `users:read.email` scope for `users.list` and `users.info` responses.

Rate-limit note:
- The method page assigns `Tier 4: 100+ per minute`.

## Pagination
- Slack's pagination guide says most paginated methods use cursor-based pagination.
- Cursor-paginated methods accept `cursor` and `limit`.
- The response includes `response_metadata.next_cursor` when more results are available.
- An empty, null, or missing `next_cursor` means there are no further results.
- Slack recommends `100-200` items per request.
- The guide says the maximum `limit` is `1000`, subject to change and varying by method.
- The guide explicitly warns not to infer completion from `results.length < limit`; clients should trust `next_cursor` instead.

## Rate limits
- Slack's global rate-limit page says limits are generally enforced per API method, per workspace/team, per app.
- The reviewed rate tiers are:
  - Tier 1: `1+` per minute
  - Tier 2: `20+` per minute
  - Tier 3: `50+` per minute
  - Tier 4: `100+` per minute
  - Special tier: method-specific
- The same page separately documents posting messages and incoming webhooks at roughly `1 per second`, with short bursts tolerated.
- The page does not publish exact burst ceilings and says Slack intentionally withholds those numbers.

## Error and format notes
- Slack Web API responses are JSON and use a top-level `ok` boolean.
- The reviewed method pages show error payloads shaped like `{"ok": false, "error": "..."}`.
- Confirmed error strings from the reviewed pages include:
  - `invalid_auth`
  - `not_authed`
  - `user_not_found`
  - `invalid_json`
  - `json_not_object`
- The Web API overview says JSON requests must set `Content-Type: application/json` explicitly.
- The overview also says tokens must not be placed in the query string when sending JSON request bodies.

## fireROUTE normalization notes
- Slack is RPC-style, so fireROUTE should preserve exact method names such as `chat.postMessage` and `conversations.history` in raw passthrough mode.
- Cursor pagination should map to `cursor` and `response_metadata.next_cursor` without trying to infer page-number semantics.
- Because scopes are highly method-specific, any normalized adapter should surface scope requirements per operation rather than pretending there is one generic read/write scope.
- Rate behavior is method-tier driven and sometimes special-case; normalization should keep method-level quota metadata where possible.
