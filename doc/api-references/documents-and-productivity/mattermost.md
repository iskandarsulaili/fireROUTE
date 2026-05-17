# Mattermost

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `mattermost`
- Official docs/pages reviewed manually:
  - `https://developers.mattermost.com/api-documentation/`
  - `https://developers.mattermost.com/mattermost-openapi-v4.yaml`
- Confirmed API style: deployment-relative REST API plus WebSocket endpoint
- Confirmed REST base pattern: `https://{your-mattermost-url}/api/v4`
- Official default example server shown in the docs UI: `http://localhost:8065`
- Confirmed WebSocket endpoint: `wss://{your-mattermost-url}/api/v4/websocket` (or `ws://localhost:8065/api/v4/websocket` in the official local example)
- Manually confirmed route count from the current official OpenAPI YAML: `621`
- Route-method breakdown confirmed from the official OpenAPI YAML:
  - `248` `GET`
  - `226` `POST`
  - `74` `PUT`
  - `61` `DELETE`
  - `12` `PATCH`

## What the official docs confirm
- Mattermost publishes a very large deployment-relative API rather than a single SaaS hostname.
- All API access is through HTTP(S) requests under `your-mattermost-url/api/v4`.
- All request and response bodies are `application/json`.
- The docs explicitly say that when an endpoint requires a user id, the string `me` can often be used instead of the current user's actual id.
- In addition to REST, Mattermost documents a WebSocket event-delivery and action surface on `/api/v4/websocket`.

## Authentication
The reviewed official docs describe multiple supported auth patterns.

### Bearer token auth
- The docs UI publishes a security scheme named `Bearer Auth`.
- Official requirement: send the token in the `Authorization` header using the Bearer scheme.
- The docs UI includes an example with a bearer token value.

### Session-token login flow
From the `Authentication` section of the official API docs:
- login route: `POST /api/v4/users/login`
- request body fields shown in the docs:
  - `login_id`
  - `password`
  - optional MFA token
- the docs say a successful login response includes a `Token` header and a user object in the body

### Personal access tokens
From the same official auth section:
- personal access tokens are used the same way as session tokens: in the `Authorization` header with the Bearer scheme
- the docs explicitly note that personal access tokens do not expire like session tokens and instead remain valid until manually revoked by the user or an admin

### OAuth-related surface
The current official OpenAPI YAML also exposes OAuth-related endpoints including:
- `POST /api/v4/oauth/apps`
- `GET /api/v4/oauth/apps`
- `GET /api/v4/oauth/apps/{app_id}`
- `PUT /api/v4/oauth/apps/{app_id}`
- `DELETE /api/v4/oauth/apps/{app_id}`
- `POST /api/v4/oauth/apps/{app_id}/regen_secret`
- `GET /api/v4/oauth/apps/{app_id}/info`
- `GET /.well-known/oauth-authorization-server`
- `POST /api/v4/oauth/apps/register`
- `GET /api/v4/users/{user_id}/oauth/apps/authorized`

## Pagination
From the reviewed official API docs:
- endpoints that implement pagination use `per_page`
- default `per_page` when omitted on paged routes: `60`
- maximum `per_page`: `200`
- the docs explicitly say requests above `200` are silently truncated

## Rate limits
From the reviewed official API docs:
- Mattermost returns these rate-limit headers on HTTP responses:
  - `X-Ratelimit-Limit`
  - `X-Ratelimit-Remaining`
  - `X-Ratelimit-Reset`
- official header meanings:
  - `X-Ratelimit-Limit` -> maximum number of requests you can make per second
  - `X-Ratelimit-Remaining` -> requests remaining in the current window
  - `X-Ratelimit-Reset` -> remaining UTC epoch seconds before reset
- the docs show a concrete example response:
  - `X-Ratelimit-Limit: 10`
  - `X-Ratelimit-Remaining: 9`
  - `X-Ratelimit-Reset: 1441983590`
- exceeding the window returns HTTP `429 Too Many Requests`

## Error model
The reviewed `Error Handling` section documents this JSON error shape:

```json
{
  "id": "the.error.id",
  "message": "Something went wrong",
  "request_id": "",
  "status_code": 0,
  "is_oauth": false
}
```

Confirmed error/body fields:
- `id`
- `message`
- `request_id`
- `status_code`
- `is_oauth`

## WebSocket notes
From the reviewed official API documentation:
- WebSocket endpoint: `/api/v4/websocket`
- it can authenticate with the same standard auth methods as the HTTP API
- browser sessions can rely on the auth cookie if already logged in
- the docs also publish an explicit authentication-challenge message:

```json
{
  "seq": 1,
  "action": "authentication_challenge",
  "data": {
    "token": "mattermosttokengoeshere"
  }
}
```

- the documented success reply is:

```json
{
  "status": "OK",
  "seq_reply": 1
}
```

## Confirmed route surface summary
The current official OpenAPI YAML exposes `621` method+path operations.

### Largest route families by tag
- `users` -> `73`
- `channels` -> `62`
- `system` -> `49`
- `teams` -> `37`
- `posts` -> `28`
- `groups` -> `26`
- `PlaybookRuns` -> `23`
- `data retention` -> `17`
- `access control` -> `16`
- `cloud` -> `15`
- `plugins` -> `13`
- `Content Flagging` -> `13`
- `files` -> `12`
- `LDAP` -> `12`
- `remote clusters` -> `12`
- `webhooks` -> `11`
- `SAML` -> `10`
- `commands` -> `10`
- `OAuth` -> `10`
- `Playbooks` -> `10`

## Representative exact route inventory from the current official YAML
The full route surface is too large to inline completely here, but the following representative families and paths were directly confirmed from the official YAML.

### Users (`73` routes)
Representative routes:
- `POST /api/v4/users/login`
- `POST /api/v4/users/login/desktop_token`
- `POST /api/v4/users/logout`
- `POST /api/v4/users`
- `GET /api/v4/users`
- `DELETE /api/v4/users`
- `POST /api/v4/users/search`
- `GET /api/v4/users/autocomplete`
- `GET /api/v4/users/stats`
- `GET /api/v4/users/{user_id}`
- `PUT /api/v4/users/{user_id}`
- `DELETE /api/v4/users/{user_id}`
- `PUT /api/v4/users/{user_id}/patch`
- `PUT /api/v4/users/{user_id}/roles`
- `PUT /api/v4/users/{user_id}/active`
- `GET /api/v4/users/{user_id}/image`
- `POST /api/v4/users/{user_id}/image`
- `DELETE /api/v4/users/{user_id}/image`
- `POST /api/v4/users/password/reset`
- `PUT /api/v4/users/{user_id}/mfa`
- `GET /api/v4/users/{user_id}/sessions`
- `POST /api/v4/users/{user_id}/sessions/revoke`
- `POST /api/v4/users/{user_id}/tokens`
- `GET /api/v4/users/{user_id}/tokens`
- `POST /api/v4/users/{user_id}/terms_of_service`
- `GET /api/v4/users/{user_id}/terms_of_service`
- `GET /api/v4/limits/server`

### Channels (`62` routes)
Representative routes:
- `GET /api/v4/channels`
- `POST /api/v4/channels`
- `POST /api/v4/channels/direct`
- `POST /api/v4/channels/group`
- `POST /api/v4/channels/search`
- `GET /api/v4/channels/{channel_id}`
- `PUT /api/v4/channels/{channel_id}`
- `DELETE /api/v4/channels/{channel_id}`
- `PUT /api/v4/channels/{channel_id}/patch`
- `PUT /api/v4/channels/{channel_id}/privacy`
- `POST /api/v4/channels/{channel_id}/restore`
- `POST /api/v4/channels/{channel_id}/move`
- `GET /api/v4/channels/{channel_id}/stats`
- `GET /api/v4/teams/{team_id}/channels`
- `GET /api/v4/teams/{team_id}/channels/private`
- `GET /api/v4/teams/{team_id}/channels/recommended`
- `GET /api/v4/teams/{team_id}/channels/autocomplete`
- `POST /api/v4/teams/{team_id}/channels/search`
- `GET /api/v4/channels/{channel_id}/members`
- `POST /api/v4/channels/{channel_id}/members`
- `DELETE /api/v4/channels/{channel_id}/members/{user_id}`
- `PUT /api/v4/channels/{channel_id}/members/{user_id}/roles`
- `PUT /api/v4/channels/{channel_id}/members/{user_id}/notify_props`
- `GET /api/v4/users/{user_id}/channels/{channel_id}/unread`
- `GET /api/v4/channels/{channel_id}/moderations`
- `PUT /api/v4/channels/{channel_id}/moderations/patch`

### Teams (`37` routes)
Representative routes:
- `POST /api/v4/teams`
- `GET /api/v4/teams`
- `GET /api/v4/teams/{team_id}`
- `PUT /api/v4/teams/{team_id}`
- `DELETE /api/v4/teams/{team_id}`
- `PUT /api/v4/teams/{team_id}/patch`
- `PUT /api/v4/teams/{team_id}/privacy`
- `POST /api/v4/teams/{team_id}/restore`
- `GET /api/v4/teams/name/{team_name}`
- `POST /api/v4/teams/search`
- `GET /api/v4/teams/{team_id}/members`
- `POST /api/v4/teams/{team_id}/members`
- `POST /api/v4/teams/members/invite`
- `POST /api/v4/teams/{team_id}/members/batch`
- `DELETE /api/v4/teams/{team_id}/members/{user_id}`
- `GET /api/v4/teams/{team_id}/stats`
- `POST /api/v4/teams/{team_id}/invite/email`
- `POST /api/v4/teams/{team_id}/invite-guests/email`
- `POST /api/v4/teams/{team_id}/import`
- `PUT /api/v4/teams/{team_id}/scheme`

### Posts (`28` routes)
Representative routes:
- `POST /api/v4/posts`
- `POST /api/v4/posts/ephemeral`
- `POST /api/v4/posts/search`
- `GET /api/v4/posts/{post_id}`
- `DELETE /api/v4/posts/{post_id}`
- `PUT /api/v4/posts/{post_id}`
- `PUT /api/v4/posts/{post_id}/patch`
- `GET /api/v4/posts/{post_id}/thread`
- `GET /api/v4/posts/{post_id}/files/info`
- `GET /api/v4/channels/{channel_id}/posts`
- `GET /api/v4/users/{user_id}/channels/{channel_id}/posts/unread`
- `POST /api/v4/teams/{team_id}/posts/search`
- `POST /api/v4/posts/{post_id}/pin`
- `POST /api/v4/posts/{post_id}/unpin`
- `POST /api/v4/posts/{post_id}/actions/{action_id}`
- `POST /api/v4/posts/ids`
- `POST /api/v4/posts/{post_id}/move`
- `GET /api/v4/posts/{post_id}/reveal`
- `DELETE /api/v4/posts/{post_id}/burn`
- `POST /api/v4/posts/rewrite`

### Files (`12` routes)
Representative routes:
- `POST /api/v4/files`
- `GET /api/v4/files/{file_id}`
- `GET /api/v4/files/{file_id}/thumbnail`
- `GET /api/v4/files/{file_id}/preview`
- `GET /api/v4/files/{file_id}/link`
- `GET /api/v4/files/{file_id}/info`
- `GET /files/{file_id}/public`
- `POST /api/v4/files/search`

### Bots (`9` routes)
Representative routes:
- `POST /api/v4/users/{user_id}/convert_to_bot`
- `POST /api/v4/bots`
- `GET /api/v4/bots`
- `PUT /api/v4/bots/{bot_user_id}`
- `GET /api/v4/bots/{bot_user_id}`
- `POST /api/v4/bots/{bot_user_id}/disable`
- `POST /api/v4/bots/{bot_user_id}/enable`
- `POST /api/v4/bots/{bot_user_id}/assign/{user_id}`
- `POST /api/v4/bots/{bot_user_id}/convert_to_user`

### Commands (`10` routes)
- `POST /api/v4/commands`
- `GET /api/v4/commands`
- `GET /api/v4/teams/{team_id}/commands/autocomplete`
- `GET /api/v4/teams/{team_id}/commands/autocomplete_suggestions`
- `GET /api/v4/commands/{command_id}`
- `PUT /api/v4/commands/{command_id}`
- `DELETE /api/v4/commands/{command_id}`
- `PUT /api/v4/commands/{command_id}/move`
- `PUT /api/v4/commands/{command_id}/regen_token`
- `POST /api/v4/commands/execute`

### Webhooks (`11` routes)
- `POST /api/v4/hooks/incoming`
- `GET /api/v4/hooks/incoming`
- `GET /api/v4/hooks/incoming/{hook_id}`
- `DELETE /api/v4/hooks/incoming/{hook_id}`
- `PUT /api/v4/hooks/incoming/{hook_id}`
- `POST /api/v4/hooks/outgoing`
- `GET /api/v4/hooks/outgoing`
- `GET /api/v4/hooks/outgoing/{hook_id}`
- `DELETE /api/v4/hooks/outgoing/{hook_id}`
- `PUT /api/v4/hooks/outgoing/{hook_id}`
- `POST /api/v4/hooks/outgoing/{hook_id}/regen_token`

### OAuth (`10` routes)
- `POST /api/v4/oauth/apps`
- `GET /api/v4/oauth/apps`
- `GET /api/v4/oauth/apps/{app_id}`
- `PUT /api/v4/oauth/apps/{app_id}`
- `DELETE /api/v4/oauth/apps/{app_id}`
- `POST /api/v4/oauth/apps/{app_id}/regen_secret`
- `GET /api/v4/oauth/apps/{app_id}/info`
- `GET /.well-known/oauth-authorization-server`
- `POST /api/v4/oauth/apps/register`
- `GET /api/v4/users/{user_id}/oauth/apps/authorized`

### Threads (`7` routes)
- `GET /api/v4/users/{user_id}/teams/{team_id}/threads`
- `PUT /api/v4/users/{user_id}/teams/{team_id}/threads/read`
- `PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/read/{timestamp}`
- `POST /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/set_unread/{post_id}`
- `PUT /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following`
- `DELETE /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}/following`
- `GET /api/v4/users/{user_id}/teams/{team_id}/threads/{thread_id}`

### System (`49` routes)
Representative routes:
- `GET /api/v4/system/timezones`
- `GET /api/v4/system/ping`
- `GET /api/v4/websocket`
- `GET /api/v4/system/notices/{team_id}`
- `PUT /api/v4/system/notices/view`
- `GET /api/v4/system/onboarding/complete`
- `POST /api/v4/system/onboarding/complete`
- `GET /api/v4/config`
- `PUT /api/v4/config`
- `POST /api/v4/config/reload`
- `GET /api/v4/config/client`
- `GET /api/v4/config/environment`
- `PUT /api/v4/config/patch`
- `POST /api/v4/license`
- `DELETE /api/v4/license`
- `GET /api/v4/audits`
- `GET /api/v4/logs`
- `POST /api/v4/logs`
- `POST /api/v4/logs/query`
- `GET /api/v4/latest_version`
- `POST /api/v4/restart`
- `POST /api/v4/integrity`

## Important usage notes
- Mattermost is self-hosted / deployment-relative. fireROUTE adapters must not hardcode a single vendor host.
- The docs mix authenticated admin surfaces, ordinary user/chat surfaces, and server-level configuration routes inside one OpenAPI file.
- `me` is a documented convenience alias for current-user routes that normally take `{user_id}`.
- Pagination defaults and limits are documented globally, not re-explained on every paged route.
- The official YAML exposes both REST and WebSocket-related paths; keep the WebSocket flow separate from ordinary JSON-over-HTTP routes.

## Verification note
This file was manually rebuilt from Mattermost's current official API documentation page and its first-party OpenAPI YAML using browser inspection only.