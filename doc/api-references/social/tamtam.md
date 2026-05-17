# TamTam

## Provider metadata
- Category: `Social`
- Provider slug: `tamtam`
- Official docs pages used:
  - `https://dev.tamtam.chat/`
- Main API base URL: `https://botapi.tamtam.chat`
- Auth model: query-string `access_token`
- Primary response format: `application/json`
- Manually confirmed route count: `28`

## Authentication
- The official docs describe a single bot-token auth mechanism named `access_token`.
- Requests are sent to `botapi.tamtam.chat` over HTTPS.
- The docs show the token in the query string, for example `?access_token={EXAMPLE_TOKEN}`.

## API-wide behavior
- The reviewed public docs are specifically for the TamTam Bot API.
- The docs say the API uses JSON for request bodies and responses.
- Strings are UTF-8 encoded.
- Date/time fields are Unix timestamps in milliseconds and use UTC.
- Documented HTTP verbs: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
- Documented HTTP status codes: `200`, `400`, `401`, `404`, `405`, `429`, `503`.
- Error responses are JSON objects with `code` and `message` fields.

## Pagination, polling, and delivery notes
- `GET /chats` supports pagination with `count` and `marker`.
- `GET /chats/{chatId}/members` supports pagination with `count` and `marker` unless `user_ids` is supplied.
- `GET /updates` is the long-polling endpoint and supports `limit`, `timeout`, `marker`, and `types`.
- Webhook subscriptions are managed through `/subscriptions`.
- The docs say webhook receivers must listen on port `80`, `8080`, `443`, `8443`, or `16384-32383`.

## Canonical endpoints

### Bot profile
#### 1) Get current bot info
- Method: `GET`
- Path: `/me`
- Purpose: return the current bot profile identified by the access token.

#### 2) Edit current bot info
- Method: `PATCH`
- Path: `/me`
- Purpose: update bot metadata.
- Request body fields include:
  - `name`
  - `description`
  - `commands`
  - `photo` via `url`, `token`, or uploaded `photos`

### Chats
#### 3) Get all chats
- Method: `GET`
- Path: `/chats`
- Purpose: list chats the bot participates in.
- Query parameters:
  - `count` - optional page size, `1-100`, default `50`
  - `marker` - optional page cursor

#### 4) Get chat by public link or username
- Method: `GET`
- Path: `/chats/{chatLink}`
- Purpose: return a public chat/channel by link or a dialog by username.
- Path parameters:
  - `chatLink` - public chat link or username

#### 5) Get chat by ID
- Method: `GET`
- Path: `/chats/{chatId}`
- Purpose: return one chat.
- Path parameters:
  - `chatId` - required chat identifier

#### 6) Edit chat info
- Method: `PATCH`
- Path: `/chats/{chatId}`
- Purpose: update chat metadata.
- Path parameters:
  - `chatId` - required chat identifier
- Request body fields include:
  - `icon` via `url`, `token`, or uploaded `photos`
  - `title`
  - `pin`
  - `notify`

#### 7) Send chat action
- Method: `POST`
- Path: `/chats/{chatId}/actions`
- Purpose: send typing/upload/read-state activity to chat members.
- Path parameters:
  - `chatId` - required chat identifier
- Request body fields:
  - `action` - one of `typing_on`, `sending_photo`, `sending_video`, `sending_audio`, `sending_file`, `mark_seen`

#### 8) Get pinned message
- Method: `GET`
- Path: `/chats/{chatId}/pin`
- Purpose: fetch the pinned message for a chat or channel.

#### 9) Pin message
- Method: `PUT`
- Path: `/chats/{chatId}/pin`
- Purpose: pin a message in a chat or channel.
- Request body fields:
  - `message_id` - required message identifier to pin
  - `notify` - optional boolean, default `true`

#### 10) Unpin message
- Method: `DELETE`
- Path: `/chats/{chatId}/pin`
- Purpose: remove the current pin.

#### 11) Get bot membership in chat
- Method: `GET`
- Path: `/chats/{chatId}/members/me`
- Purpose: return the current bot's membership details in a chat.

#### 12) Leave chat
- Method: `DELETE`
- Path: `/chats/{chatId}/members/me`
- Purpose: remove the bot from the chat.

#### 13) Get chat admins
- Method: `GET`
- Path: `/chats/{chatId}/members/admins`
- Purpose: list chat administrators.
- Usage note: the docs say the bot must itself be an administrator.

#### 14) Get chat members
- Method: `GET`
- Path: `/chats/{chatId}/members`
- Purpose: list members or fetch specific memberships.
- Query parameters:
  - `user_ids` - optional comma-separated user IDs; disables `count` and `marker`
  - `marker` - optional page cursor
  - `count` - optional page size, `1-100`, default `20`

#### 15) Add members
- Method: `POST`
- Path: `/chats/{chatId}/members`
- Purpose: add members to a chat.
- Request body fields:
  - `user_ids` - array of user IDs

#### 16) Remove member
- Method: `DELETE`
- Path: `/chats/{chatId}/members`
- Purpose: remove a member from a chat.
- Query parameters:
  - `user_id` - required user ID to remove
  - `block` - optional boolean, default `false`

### Messages
#### 17) Get messages
- Method: `GET`
- Path: `/messages`
- Purpose: list messages in reverse chronological order.
- Query parameters:
  - `chat_id` - optional chat ID to query
  - `message_ids` - optional comma-separated message IDs
  - `from` - optional start timestamp in milliseconds
  - `to` - optional end timestamp in milliseconds; docs note it must be less than `from`
  - `count` - optional page size, `1-100`, default `50`

#### 18) Send message
- Method: `POST`
- Path: `/messages`
- Purpose: send a message to a user or chat.
- Query parameters:
  - `user_id` - optional recipient user ID
  - `chat_id` - optional recipient chat ID
  - `disable_link_preview` - optional boolean, default `false`
- Request body fields include:
  - `text`
  - `attachments`
  - `link`
  - `notify`
  - `format` - `markdown` or `html`
- Upload workflow note:
  - media attachments use `/uploads` first, then the returned upload token is inserted into the message attachment payload

#### 19) Edit message
- Method: `PUT`
- Path: `/messages`
- Purpose: update an existing message.
- Query parameters:
  - `message_id` - required message identifier
- Request body: the docs say the body uses the same `NewMessageBody` shape as send-message updates.

#### 20) Delete message
- Method: `DELETE`
- Path: `/messages`
- Purpose: delete a message.
- Query parameters:
  - `message_id` - required message identifier

#### 21) Get message
- Method: `GET`
- Path: `/messages/{messageId}`
- Purpose: fetch one message by ID.
- Path parameters:
  - `messageId` - message `mid`

#### 22) Answer callback button press
- Method: `POST`
- Path: `/answers`
- Purpose: answer a button callback with an updated message and/or one-time notification.
- Query parameters:
  - `callback_id` - required callback identifier from `MessageCallbackUpdate`
- Request body fields include:
  - `message`
  - `notification`

#### 23) Answer constructor request
- Method: `POST`
- Path: `/answers/constructor`
- Purpose: answer a constructor session with prepared messages and/or keyboard data.
- Query parameters:
  - `session_id` - required constructor session identifier
- Request body fields include:
  - `messages` - array of constructed messages

### Subscriptions and updates
#### 24) Get subscriptions
- Method: `GET`
- Path: `/subscriptions`
- Purpose: list current webhook subscriptions.

#### 25) Subscribe webhook
- Method: `POST`
- Path: `/subscriptions`
- Purpose: register a webhook endpoint.
- Request body fields:
  - `url` - required HTTP(S) webhook URL
  - `update_types` - optional update-type filter list
  - `version` - optional API version selector

#### 26) Unsubscribe webhook
- Method: `DELETE`
- Path: `/subscriptions`
- Purpose: remove a webhook subscription.
- Query parameters:
  - `url` - required subscription URL to remove

#### 27) Get updates via long polling
- Method: `GET`
- Path: `/updates`
- Purpose: receive updates when not using webhooks.
- Query parameters:
  - `limit` - optional maximum updates, `1-1000`, default `100`
  - `timeout` - optional long-poll timeout in seconds, `0-90`, default `30`
  - `marker` - optional update cursor
  - `types` - optional comma-separated update types

### Uploads
#### 28) Get upload URL
- Method: `POST`
- Path: `/uploads`
- Purpose: obtain an upload URL for media files.
- Query parameters:
  - `type` - required upload type: `image`, `video`, `audio`, or `file`
- Response fields:
  - `url` - upload target URL
- Usage notes:
  - docs describe both multipart single-request upload and resumable upload
  - multipart uploads are limited to one file and max `2 GB`
  - upload status can be checked with `GET` against the returned upload URL

## Response-shape notes
- Chat endpoints return rich `Chat` objects with metadata such as type, status, title, counts, links, and optional pinned-message/user details.
- Membership endpoints return `ChatMember` objects with admin/owner flags and permission arrays.
- Message endpoints return `Message` objects with sender, recipient, timestamps, text, attachments, markup, forwarding/reply links, and optional stats.
- Success/failure helper endpoints commonly return `{ success, message? }`.

## Important usage notes
- The docs show both webhook delivery and long-poll delivery; use one or the other depending on bot deployment.
- The docs explicitly warn that audio/video and other binaries may need time to process after upload; send-message requests can fail with `400` until processing finishes.
- The docs include built-in text-formatting support through explicit `format` values and structured `markup` objects.
- The reviewed official page does not publish a numeric rate-limit quota, but it does document `429` as the over-limit response code.
