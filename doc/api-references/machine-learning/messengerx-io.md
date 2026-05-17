# MessengerX.io

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `messengerx-io`
- Official pages manually reviewed:
  - `https://messengerx.rtfd.io` -> redirected to `https://messengerx.readthedocs.io/en/latest/`
  - `https://messengerx.readthedocs.io/en/latest/`
  - `https://portal.messengerx.io/`
- Confirmed API base URL: `https://ganglia.machaao.com/v1`
- Authentication model: API token sent in the `api_token` request header
- Primary request format: JSON request bodies
- Manually confirmed routes in this pass: `4`

## Authentication
- The official docs say developers should sign up via `https://portal.messengerx.io` to get a free API token.
- Every reviewed API example sends that credential in the request header `api_token: API_TOKEN`.
- Incoming webhook payloads are documented separately from the outbound API: the docs say webhook payloads are encrypted using `HS512` with the bot token as key, and should be decrypted with the provided `secret_key`.
- No OAuth flow or bearer-token scheme was documented on the reviewed pages.

## Rate limits
- The reviewed docs publish one explicit quota note: announcement/subscription messages are `rate limited to a max of 1 per hour per user`.
- No broader global requests-per-second table was documented on the reviewed pages.

## Request/response format notes
- The reviewed examples consistently use `Content-Type: application/json`.
- Outbound messaging requests use JSON bodies with top-level targets (`users` or `tags`) plus a `message` object.
- The documented `message` object can contain:
  - `text`
  - `quick_replies[]` objects with `content_type`, `title`, and `payload`
  - `attachment` template payloads
  - button-template payloads with `buttons[]`
  - generic-template payloads with `elements[]`, optional `image_url`, and optional `buttons[]`
- The docs also document the structure of incoming webhook JSON after decryption, including fields such as `messaging`, `message_data`, `user`, `sender`, `client`, `version`, and `silent`.
- The reviewed docs do not publish formal response schemas or a dedicated error-object schema.

## Pagination
- None of the reviewed MessengerX routes are paginated.
- The official docs did not mention `page`, `offset`, `cursor`, or similar pagination controls.

## Error handling
- The reviewed docs do not publish a dedicated HTTP status-code table.
- The reviewed docs also do not publish named error codes or retry/backoff guidance.

## Confirmed routes

### 1) Send message to one or more users
- Method: `POST`
- Path: `/messages/send`
- Full URL: `https://ganglia.machaao.com/v1/messages/send`
- Auth: `api_token` header
- Confirmed top-level request fields from official examples:
  - `users` - array of target user IDs
  - `message` - outbound message payload
- Confirmed nested message fields from official examples:
  - `text`
  - `quick_replies[]`
  - `attachment.type`
  - `attachment.payload.template_type`
  - `attachment.payload.text`
  - `attachment.payload.buttons[]`
  - `attachment.payload.elements[]`
- Usage notes:
  - official examples show plain-text replies, button templates, single generic media cards, and lists of generic media cards
  - `buttons[]` examples use `postback` and `web_url` button types

### 2) Tag or un-tag a user
- Method: `POST`
- Path: `/users/tag/{USER_ID}`
- Full URL: `https://ganglia.machaao.com/v1/users/tag/<USER_ID>`
- Auth: `api_token` header
- Confirmed request fields from official examples:
  - `tag` - tag name/key
  - `status` - `1` to tag or `0` to un-tag
  - `values` - optional array of values associated with the tag
  - `displayName` - optional human-readable label
- Usage notes:
  - the same route is used for both applying and removing a tag; the docs distinguish the behavior by the `status` value

### 3) Get active tags for a user
- Method: `GET`
- Path: `/users/tags/{USER_ID}`
- Full URL: `https://ganglia.machaao.com/v1/users/tags/<USER_ID>`
- Auth: `api_token` header
- Confirmed parameters:
  - path parameter `USER_ID`
- Usage notes:
  - the docs describe this route as returning all active tags for a user in context for personalization use cases

### 4) Send announcement / subscription message
- Method: `POST`
- Path: `/messages/announce`
- Full URL: `https://ganglia.machaao.com/v1/messages/announce`
- Auth: `api_token` header
- Confirmed request fields from official examples:
  - `tags` - array of target audience tags
  - `message` - outbound message payload
- Confirmed nested message fields from official example:
  - `text`
  - `quick_replies[]`
- Usage notes:
  - the docs frame this route as subscription/announcement messaging for re-engagement
  - official rate-limit note: max `1` announcement per hour per user

## Important usage notes
- MessengerX's reviewed documentation is example-driven rather than a formal OpenAPI/Swagger reference.
- The docs explicitly separate two integration directions:
  - inbound user messages are delivered to your webhook as encrypted payloads
  - outbound bot responses are sent back through MessengerX's hosted HTTP APIs under `https://ganglia.machaao.com/v1`
- The docs position tagging as the basis for personalization and re-engagement workflows.
- The current `portal.messengerx.io` site is branded as `MessengerX.io | AI Creator Portal`, but it still exposes the developer sign-in/sign-up surface referenced by the docs for obtaining tokens.

## Verification notes
This file was manually rebuilt from the current MessengerX Read the Docs documentation and the current official portal login page.