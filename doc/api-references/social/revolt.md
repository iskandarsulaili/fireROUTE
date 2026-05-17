# Revolt

## Provider metadata
- Category: `Social`
- Provider slug: `revolt`
- Official pages manually reviewed:
  - `https://developers.stoat.chat/api-reference/`
  - `https://stoat.chat/api/openapi.json`
- Main production API base URL: `https://api.revolt.chat`
- Additional servers published in the official OpenAPI document:
  - `https://revolt.chat/api` - staging
  - `http://local.revolt.chat:14702` - local environment
  - `http://local.revolt.chat:14702/0.8` - local v0.8 environment
- Auth model: session-token header auth plus MFA ticket headers for MFA-protected operations
- Response format: JSON
- OpenAPI version: `3.0.0`
- API version documented: `0.13.3`
- Manually confirmed route count: `124`

## Authentication
- The official OpenAPI document publishes three header-based security schemes:
  - `x-session-token` - user session authentication
  - `x-mfa-ticket` - valid MFA ticket
  - `x-mfa-ticket` - unvalidated MFA ticket variant used in the spec for MFA flows
- The spec does not declare a single global security requirement, which means some routes are public and auth is applied per operation.
- The docs page shows unauthenticated access working for `GET /`, while account, session, bot, messaging, and server-management routes are authenticated flows.

## Route inventory overview
- The official OpenAPI file contains `124` operations across `84` paths.
- Tag counts confirmed from the official spec:
  - `Webhooks` - 12
  - `Account` - 11
  - `Messaging` - 10
  - `Server Members` - 9
  - `MFA` - 8
  - `User Information` - 7
  - `Bots` - 7
  - `Server Permissions` - 7
  - `Relationships` - 6
  - `Server Information` - 6
  - `Session` - 6
  - `Groups` - 4
  - `Emojis` - 4
  - `Channel Information` - 3
  - `Interactions` - 3
  - `Invites` - 3
  - `Sync` - 3
  - `Direct Messaging` - 2
  - `Voice` - 2
  - `Channel Permissions` - 2
  - `Onboarding` - 2
  - `Web Push` - 2
  - `Core` - 1
  - `Channel Invites` - 1
  - `Server Customisation` - 1
  - `User Safety` - 1
  - `Policy` - 1

## Representative confirmed endpoints by area

### Core
- `GET /` - fetch node/server configuration for the Revolt instance

### Account and session
- `POST /auth/account/create` - create account
- `POST /auth/account/reverify` - resend verification
- `PUT /auth/account/delete` - confirm account deletion
- `POST /auth/account/delete` - delete account
- `GET /auth/account/` - fetch account
- `POST /auth/account/disable` - disable account
- `PATCH /auth/account/change/password` - change password
- `PATCH /auth/account/change/email` - change email
- `POST /auth/account/verify/{code}` - verify email
- `POST /auth/account/reset_password` - send password reset
- `PATCH /auth/account/reset_password` - complete password reset
- `POST /auth/session/login` - login
- `POST /auth/session/logout` - logout
- `GET /auth/session/all` - fetch sessions
- `DELETE /auth/session/all` - revoke all sessions
- `DELETE /auth/session/{id}` - revoke one session
- `PATCH /auth/session/{id}` - edit session

### User identity and relationships
- `GET /users/@me` - fetch self
- `GET /users/{target}` - fetch user
- `PATCH /users/{target}` - edit user
- `GET /users/{target}/flags` - fetch user flags
- `PATCH /users/@me/username` - change username
- `GET /users/{target}/default_avatar` - fetch default avatar
- `GET /users/{target}/profile` - fetch user profile
- `GET /users/dms` - fetch DM channels
- `GET /users/{target}/dm` - open DM
- `GET /users/{target}/mutual` - fetch mutual friends/servers/groups/DMs
- `PUT /users/{target}/friend` - accept friend request
- `DELETE /users/{target}/friend` - deny friend request or remove friend
- `PUT /users/{target}/block` - block user
- `DELETE /users/{target}/block` - unblock user
- `POST /users/friend` - send friend request

### Bots and channels
- `POST /bots/create` - create bot
- `GET /bots/{target}/invite` - fetch public bot invite data
- `POST /bots/{target}/invite` - invite bot
- `GET /bots/{bot_id}` - fetch bot
- `DELETE /bots/{bot_id}` - delete bot
- `PATCH /bots/{bot_id}` - edit bot
- `GET /bots/@me` - fetch owned bots
- `GET /channels/{target}` - fetch channel
- `DELETE /channels/{target}` - close channel
- `PATCH /channels/{target}` - edit channel
- `POST /channels/{target}/invites` - create invite
- `POST /channels/create` - create group
- `GET /channels/{target}/members` - fetch group members
- `PUT /channels/{group_id}/recipients/{member_id}` - add group member
- `DELETE /channels/{group_id}/recipients/{member_id}` - remove group member

### Messaging, reactions, and voice
- `PUT /channels/{target}/ack/{message}` - acknowledge message
- `GET /channels/{target}/messages` - fetch messages
- `POST /channels/{target}/messages` - send message
- `POST /channels/{target}/search` - search messages
- `GET /channels/{target}/messages/{msg}` - fetch one message
- `PATCH /channels/{target}/messages/{msg}` - edit message
- `DELETE /channels/{target}/messages/{msg}` - delete message
- `DELETE /channels/{target}/messages/bulk` - bulk delete messages
- `POST /channels/{target}/messages/{msg}/pin` - pin message
- `DELETE /channels/{target}/messages/{msg}/pin` - unpin message
- `PUT /channels/{target}/messages/{msg}/reactions/{emoji}` - add reaction
- `DELETE /channels/{target}/messages/{msg}/reactions/{emoji}` - remove reaction(s)
- `DELETE /channels/{target}/messages/{msg}/reactions` - remove all reactions
- `POST /channels/{target}/join_call` - join call
- `PUT /channels/{target}/end_ring/{target_user}` - stop ringing

### Servers, members, roles, and invites
- `POST /servers/create` - create server
- `GET /servers/{target}` - fetch server
- `DELETE /servers/{target}` - delete or leave server
- `PATCH /servers/{target}` - edit server
- `PUT /servers/{target}/ack` - mark server as read
- `POST /servers/{server}/channels` - create server channel
- `GET /servers/{target}/members` - fetch members
- `GET /servers/{server_id}/members/{member_id}` - fetch member
- `PATCH /servers/{server_id}/members/{member_id}` - edit member
- `DELETE /servers/{server_id}/members/{member_id}` - kick member
- `GET /servers/{target}/members_experimental_query` - query members by name
- `PUT /servers/{server}/bans/{target}` - ban user
- `DELETE /servers/{server}/bans/{target}` - unban user
- `GET /servers/{target}/bans` - fetch bans
- `GET /servers/{target}/invites` - fetch invites
- `POST /servers/{target}/roles` - create role
- `GET /servers/{target}/roles/{role_id}` - fetch role
- `PATCH /servers/{target}/roles/{role_id}` - edit role
- `DELETE /servers/{target}/roles/{role_id}` - delete role
- `PUT /servers/{target}/permissions/{role_id}` - set role permission
- `PUT /servers/{target}/permissions/default` - set default permission
- `PATCH /servers/{target}/roles/ranks` - edit role ranks
- `GET /invites/{target}` - fetch invite
- `POST /invites/{target}` - join invite
- `DELETE /invites/{target}` - delete invite

### Custom emoji and webhooks
- `GET /custom/emoji/{emoji_id}` - fetch emoji
- `PUT /custom/emoji/{emoji_id}` - create emoji
- `PATCH /custom/emoji/{emoji_id}` - edit emoji
- `DELETE /custom/emoji/{emoji_id}` - delete emoji
- `GET /channels/{channel_id}/webhooks` - list webhooks for a channel
- `POST /channels/{channel_id}/webhooks` - create webhook
- `GET /webhooks/{webhook_id}` - fetch webhook
- `PATCH /webhooks/{webhook_id}` - edit webhook
- `DELETE /webhooks/{webhook_id}` - delete webhook
- `GET /webhooks/{webhook_id}/{token}` - fetch tokenized webhook
- `POST /webhooks/{webhook_id}/{token}` - execute webhook
- `PATCH /webhooks/{webhook_id}/{token}` - edit tokenized webhook
- `DELETE /webhooks/{webhook_id}/{token}` - delete tokenized webhook
- `PATCH /webhooks/{webhook_id}/{token}/{message_id}` - edit webhook message
- `DELETE /webhooks/{webhook_id}/{token}/{message_id}` - delete webhook message
- `POST /webhooks/{webhook_id}/{token}/github` - execute GitHub-specific webhook flow

## Confirmed parameter and request notes
- `GET /channels/{target}/messages` supports documented query parameters `limit`, `before`, `after`, `sort`, `nearby`, and `include_users`.
- `POST /channels/{target}/messages` supports an optional `Idempotency-Key` request header to prevent duplicate sends.
- `GET /servers/{target}/members` supports the optional query parameter `exclude_offline`.
- Most collection and management routes use path ids such as `{target}`, `{server_id}`, `{member_id}`, `{role_id}`, `{emoji_id}`, `{webhook_id}`, and `{token}`.
- The official spec documents operation-specific request bodies in JSON rather than a single shared form-encoded contract.

## Pagination, errors, and format notes
- The official spec does not publish a single global pagination scheme; list endpoints instead expose route-specific query parameters.
- The official docs reviewed do not publish a numeric rate-limit policy.
- The OpenAPI document consistently models error responses as `application/json` and references a shared `Error` schema in default error responses.
- The API reference and OpenAPI document are JSON-oriented throughout the reviewed operations.

## fireROUTE integration notes
- Revolt is broad enough that a fireROUTE adapter should probably start with a smaller normalized subset: identity, DMs, server lookup, member lookup, message list/send, invites, and webhooks.
- Preserve Revolt-specific headers such as `x-session-token`, `x-mfa-ticket`, and `Idempotency-Key` rather than trying to over-normalize them away.
- Keep provider-specific list controls like `before`, `after`, `nearby`, and `include_users` available on raw passthrough routes.
