# Cisco Spark

## Provider metadata
- Category: `Social`
- Provider slug: `cisco-spark`
- Official docs pages used:
  - `https://developer.ciscospark.com`
  - `https://developer.webex.com/create/docs/authentication`
  - `https://developer.webex.com/messaging/docs/bots`
  - `https://developer.webex.com/messaging/docs/basics`
  - `https://developer.webex.com/docs/api/v1/messages/create-a-message`
  - `https://developer.webex.com/docs/api/v1/messages/list-messages`
  - `https://developer.webex.com/docs/api/v1/messages/list-direct-messages`
  - `https://developer.webex.com/docs/api/v1/people/get-my-own-details`
  - `https://developer.webex.com/docs/api/v1/rooms/list-rooms`
  - `https://developer.webex.com/docs/api/v1/webhooks/create-a-webhook`
- Official-site note: the indexed `developer.ciscospark.com` host now redirects to the current Webex developer platform.
- Main REST API base URL confirmed from the reviewed API reference pages: `https://webexapis.com/v1`
- OAuth authorization endpoint confirmed from the reviewed authentication guide: `https://webexapis.com/v1/authorize`
- OAuth token endpoint confirmed from the reviewed authentication guide: `https://webexapis.com/v1/access_token`
- Auth models confirmed from the reviewed pages:
  - bearer personal access token for direct API exploration
  - bearer bot access token for bot apps
  - OAuth 2.0 authorization-code flow for integrations acting on behalf of users
- Request/response formats confirmed in the reviewed docs: JSON request/response bodies for most operations, `multipart/form-data` for local file uploads to messages, bearer auth in `Authorization`, and RFC5988 `Link` headers for paginated collections
- Manually confirmed route count: `11`

## Authentication
- The current Cisco Spark developer surface is the Webex developer platform and uses bearer tokens in `Authorization: Bearer TOKEN`.
- The reviewed authentication guide explicitly says you can explore the API with a personal access token before registering an integration.
- OAuth authorization-code flow:
  - send the user to `GET https://webexapis.com/v1/authorize`
  - exchange the returned code with `POST https://webexapis.com/v1/access_token`
- Required authorization query parameters confirmed by the guide:
  - `response_type=code`
  - `client_id`
  - `redirect_uri`
  - `scope` as a space-separated scope list
  - `state`
- Required access-token form fields confirmed by the guide:
  - `grant_type=authorization_code`
  - `client_id`
  - `client_secret`
  - `code`
  - `redirect_uri`
- Refresh-token flow confirmed by the same guide uses the same token endpoint with:
  - `grant_type=refresh_token`
  - `client_id`
  - `client_secret`
  - `refresh_token`
- The reviewed guide says successful token exchange returns JSON with:
  - `access_token`
  - `expires_in`
  - `refresh_token`
  - `refresh_token_expires_in`
- Token lifetime note confirmed by the guide:
  - access token valid for `14` days
  - refresh token valid for `90` days

## API-wide behavior
- The reviewed API reference pages all use the versioned server URL `https://webexapis.com/v1/`.
- The reviewed basics page says all collection pagination follows RFC5988 Web Linking via the `Link` response header.
- The reviewed basics page says collection endpoints use a `max` query parameter to control page size and that endpoint-specific maxima still apply.
- The reviewed basics page documents common HTTP response codes including `200`, `201`, `202`, `204`, `400`, `401`, `403`, `404`, `405`, `409`, `410`, `415`, `423`, `428`, `429`, `500`, `502`, `503`, and `504`.
- The reviewed basics page documents anti-malware scanning behavior for file retrieval:
  - `423 Locked` while scanning, with `Retry-After`
  - `410 Gone` for infected files
  - `428 Precondition Required` for unscannable files unless `allow=unscannable` is supplied
- The reviewed basics page says most REST APIs enforce a limit of around `300 requests per minute`, while `/people` and `/messages` receive a higher dynamically adjusted quota.

## Canonical endpoints

### 1) Start OAuth authorization
- Method: `GET`
- URL: `https://webexapis.com/v1/authorize`
- Purpose: redirect a Webex user into the OAuth consent flow for an integration

Confirmed query parameters from the reviewed authentication guide:
- `response_type` - required and must be `code`
- `client_id` - required integration client ID
- `redirect_uri` - required callback URI
- `scope` - required space-separated list of requested scopes
- `state` - required caller-generated state string for request correlation / CSRF protection

### 2) Exchange or refresh an OAuth token
- Method: `POST`
- URL: `https://webexapis.com/v1/access_token`
- Purpose: exchange an authorization code for tokens or refresh an expired access token
- Request format: `application/x-www-form-urlencoded`

Confirmed authorization-code fields:
- `grant_type=authorization_code`
- `client_id`
- `client_secret`
- `code`
- `redirect_uri`

Confirmed refresh-token fields:
- `grant_type=refresh_token`
- `client_id`
- `client_secret`
- `refresh_token`

Confirmed success response fields:
- `access_token`
- `expires_in`
- `refresh_token`
- `refresh_token_expires_in`

### 3) Get my own details
- Method: `GET`
- URL: `https://webexapis.com/v1/people/me`
- Purpose: retrieve profile details for the authenticated user
- Auth: bearer token

Confirmed query parameter from the reviewed API page:
- `callingData` - optional boolean to include Webex Calling details for admin users

### 4) List rooms
- Method: `GET`
- URL: `https://webexapis.com/v1/rooms`
- Purpose: list rooms the authenticated user belongs to
- Auth: bearer token

Confirmed query parameters from the reviewed API page:
- `teamId` - filter to rooms associated with a team ID; cannot be combined with `orgPublicSpaces`
- `type` - room type filter: `direct` or `group`; cannot be combined with `orgPublicSpaces`
- `orgPublicSpaces` - include joined and unjoined org public spaces
- `from` - filter public spaces made public after a time
- `to` - filter public spaces made public before a time
- `sortBy` - one of `id`, `lastactivity`, or `created`
- `max` - page size, `1` to `1000`, default shown as `100`

Important note from the reviewed page:
- For users or bots in more than `3000` spaces, sorting by `lastactivity` can produce anomalies because of the underlying database behavior described by the docs.

### 5) Create a message
- Method: `POST`
- URL: `https://webexapis.com/v1/messages`
- Purpose: post plain text or markdown to a room or direct recipient, optionally with a file or card attachment
- Auth: bearer token
- Confirmed request content type from the reviewed API page: `application/json`

Confirmed body properties from the reviewed API page:
- `roomId`
- `parentId`
- `toPersonId`
- `toPersonEmail`
- `text`
- `markdown`
- `files`
- `attachments`

Important notes from the reviewed docs:
- Local file uploads use `multipart/form-data` as documented in the REST basics guide.
- The `files` field is modeled as an array for future expansion, but the reviewed page says only one file can currently be included.
- The reviewed page says file previews are only rendered for attachments of `1MB` or less.

### 6) List messages
- Method: `GET`
- URL: `https://webexapis.com/v1/messages`
- Purpose: list messages in a room
- Auth: bearer token

Confirmed query parameters from the reviewed API page:
- `roomId` - required room ID
- `parentId` - optional parent-message filter
- `mentionedPeople` - optional mention filter; bots must use `me` or their own person ID when listing group-space messages
- `before` - return messages sent before a date and time
- `beforeMessage` - return messages sent before a message ID
- `max` - maximum number of messages to return; the reviewed page says it cannot exceed `100` when used with `mentionedPeople`

Important note from the reviewed bots guide:
- In group spaces, bots only have access to messages in which they are mentioned.

### 7) List direct messages
- Method: `GET`
- URL: `https://webexapis.com/v1/messages/direct`
- Purpose: list messages in a 1:1 room
- Auth: bearer token

Confirmed query parameters from the reviewed API page:
- `parentId` - optional parent-message filter
- `personId` - list direct messages by person ID
- `personEmail` - list direct messages by person email

### 8) Get message details
- Method: `GET`
- URL: `https://webexapis.com/v1/messages/{messageId}`
- Purpose: retrieve a single message
- Auth: bearer token

Confirmed path parameter from the reviewed API page:
- `messageId` - required unique message identifier

### 9) Edit a message
- Method: `PUT`
- URL: `https://webexapis.com/v1/messages/{messageId}`
- Purpose: update a message previously posted by the caller
- Auth: bearer token
- Confirmed request content type from the reviewed API page: `application/json`

Confirmed path parameter:
- `messageId` - required unique message identifier

Confirmed JSON body fields from the reviewed API page:
- `roomId` - required
- `text`
- `markdown`

Important notes from the reviewed page:
- Messages can only be edited up to `10` times.
- Editing messages containing files or attachments is not currently supported and returns `400 Bad Request`.
- The reviewed page recommends fetching the message first, then updating `text` or `markdown`, and removing `html` before issuing the `PUT` if the original message used markdown.

### 10) Delete a message
- Method: `DELETE`
- URL: `https://webexapis.com/v1/messages/{messageId}`
- Purpose: delete a message
- Auth: bearer token

Confirmed path parameter from the reviewed API page:
- `messageId` - required unique message identifier

### 11) Create a webhook
- Method: `POST`
- URL: `https://webexapis.com/v1/webhooks`
- Purpose: create a webhook subscription for Webex events
- Auth: bearer token
- Confirmed request content type from the reviewed API page: `application/json`

Confirmed required body fields:
- `name`
- `targetUrl`
- `resource`
- `event`

Confirmed optional body fields:
- `filter`
- `secret`
- `ownedBy`

## Pagination
- The reviewed basics page says pagination uses RFC5988 `Link` headers.
- The docs explicitly mention `rel="next"` as the only link relation guaranteed at this time.
- The reviewed docs recommend paginating until no `next` link remains, because some pages can be empty while still advertising a next page.
- The reviewed rooms and messages pages expose endpoint-specific `max` query parameters.

## Errors and rate limits
- The reviewed basics page says most APIs are limited to around `300 requests per minute`.
- The same page says `/people` and `/messages` have a higher dynamically adjusted quota.
- When rate-limited, the API returns `429 Too Many Requests` and includes a `Retry-After` header.
- Common documented response codes include success (`200`, `201`, `202`, `204`) and request/auth/platform errors (`400`, `401`, `403`, `404`, `405`, `409`, `410`, `415`, `423`, `428`, `429`, `500`, `502`, `503`, `504`).
- File retrieval can also fail with `423`, `410`, or `428` depending on malware-scan state.

## Important usage notes
- Cisco Spark has effectively been superseded in the official docs by Webex branding and Webex API routes.
- Bots and human users differ materially in message visibility: bots only see direct messages and group-space messages where the bot is mentioned.
- The reviewed basics page documents message attachments up to `100MB` each.
- Local file uploads use `multipart/form-data`, while remote file sharing can use a JSON `files` array with a public URL.
- fireROUTE adapters should treat Webex collection pagination as header-driven rather than page-number-driven.
