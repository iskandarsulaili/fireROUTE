# Line

## Provider metadata
- Category: `Social`
- Provider slug: `line`
- Official docs pages used:
  - `https://developers.line.biz/en/reference/messaging-api/`
  - `https://developers.line.biz/en/reference/messaging-api/index.html.md`
- Main API host confirmed from the official `Common specifications > Domain name` section: `https://api.line.me`
- Alternate data/content host confirmed from the same official section: `https://api-data.line.me`
- Auth model: bearer `channel access token` for bot endpoints, with channel-access-token issuance/verification/revocation routes under the same official Messaging API reference
- Request formats confirmed on the reviewed pages: `application/json` for most bot endpoints, `application/x-www-form-urlencoded` for token issuance routes, binary download/upload behavior on `api-data.line.me` for content/image endpoints
- Response formats confirmed on the reviewed pages: JSON for control/data endpoints, binary responses for content downloads and rich-menu image downloads
- Manually confirmed route count: `95`

## Authentication
- Bot endpoints use `Authorization: Bearer <channel-access-token>`.
- The official reference exposes these token-management routes:
  - `POST /oauth2/v2.1/token`
  - `GET /oauth2/v2.1/verify`
  - `GET /oauth2/v2.1/tokens/kid`
  - `POST /oauth2/v2.1/revoke`
  - `POST /oauth2/v3/token`
  - `POST /v2/oauth/accessToken`
  - `POST /v2/oauth/verify`
  - `POST /v2/oauth/revoke`
- The reviewed `Issue channel access token v2.1` section documents:
  - `POST https://api.line.me/oauth2/v2.1/token`
  - `Content-Type: application/x-www-form-urlencoded`
  - required body fields: `grant_type=client_credentials`, `client_assertion_type`, `client_assertion`
  - `client_assertion_type` must be the URL-encoded JWT bearer assertion URN
  - `client_assertion` must be a client-generated JWT signed with the private key of the assertion signing key
  - JWT assertions must expire within `30` minutes of generation
  - successful response fields include `access_token`, `token_type`, `expires_in`, and `key_id`
- The same official section says you can issue up to `30` v2.1 channel access tokens per channel; expired tokens do not count toward that cap.

## API-wide behavior
- LINE explicitly says the hostname depends on the endpoint family.
- `https://api-data.line.me` is used for:
  - getting message content
  - creating/uploading audience files
  - adding user IDs/IFAs by file
  - rich-menu image upload/download
- `https://api.line.me` is used for the other Messaging API endpoints.
- Rate limits are applied per endpoint, per channel.
- LINE explicitly says different HTTP methods on the same URL count as different endpoints for rate limiting.
- LINE also says rate limiting does not vary by URL parameter values, request-body contents, or source IP address.
- Shared/common response headers documented by LINE:
  - `X-Line-Request-Id`
  - `X-Line-Accepted-Request-Id`
- Shared/common status codes documented by LINE:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `409 Conflict`
  - `410 Gone`
  - `413 Payload Too Large`
  - `415 Unsupported Media Type`
  - `429 Too Many Requests`
  - `500 Internal Server Error`
- The official `413` note says request bodies must stay under `2MB`.
- The official `429` notes cover multiple cases, including endpoint rate limits, concurrent-operation limits, free-message limits, and additional-message caps.
- LINE's shared error schema is JSON with:
  - `message`
  - optional `details[]`
  - optional `details[].message`
  - optional `details[].property`
- The reviewed common-specifications section also says URLs embedded inside request-body properties must be percent-encoded using UTF-8.

## Confirmed route inventory

### Webhook settings (`3`)
- `PUT /v2/bot/channel/webhook/endpoint`
- `GET /v2/bot/channel/webhook/endpoint`
- `POST /v2/bot/channel/webhook/test`

### Getting content (`3`)
- `GET /v2/bot/message/{messageId}/content`
- `GET /v2/bot/message/{messageId}/content/transcoding`
- `GET /v2/bot/message/{messageId}/content/preview`

### Channel access token (`8`)
- `POST /oauth2/v2.1/token`
- `GET /oauth2/v2.1/verify`
- `GET /oauth2/v2.1/tokens/kid`
- `POST /oauth2/v2.1/revoke`
- `POST /oauth2/v3/token`
- `POST /v2/oauth/accessToken`
- `POST /v2/oauth/verify`
- `POST /v2/oauth/revoke`

### Message (`19`)
- `POST /v2/bot/message/reply`
- `POST /v2/bot/message/push`
- `POST /v2/bot/message/multicast`
- `POST /v2/bot/message/narrowcast`
- `GET /v2/bot/message/progress/narrowcast`
- `POST /v2/bot/message/broadcast`
- `POST /v2/bot/chat/markAsRead`
- `POST /v2/bot/chat/loading/start`
- `GET /v2/bot/message/quota`
- `GET /v2/bot/message/quota/consumption`
- `GET /v2/bot/message/delivery/reply`
- `GET /v2/bot/message/delivery/push`
- `GET /v2/bot/message/delivery/multicast`
- `GET /v2/bot/message/delivery/broadcast`
- `POST /v2/bot/message/validate/reply`
- `POST /v2/bot/message/validate/push`
- `POST /v2/bot/message/validate/multicast`
- `POST /v2/bot/message/validate/narrowcast`
- `POST /v2/bot/message/validate/broadcast`

### Managing audience (`12`)
- `POST /v2/bot/audienceGroup/upload`
- `POST /v2/bot/audienceGroup/upload/byFile`
- `PUT /v2/bot/audienceGroup/upload`
- `PUT /v2/bot/audienceGroup/upload/byFile`
- `POST /v2/bot/audienceGroup/click`
- `POST /v2/bot/audienceGroup/imp`
- `PUT /v2/bot/audienceGroup/{audienceGroupId}/updateDescription`
- `DELETE /v2/bot/audienceGroup/{audienceGroupId}`
- `GET /v2/bot/audienceGroup/{audienceGroupId}`
- `GET /v2/bot/audienceGroup/list`
- `GET /v2/bot/audienceGroup/shared/{audienceGroupId}`
- `GET /v2/bot/audienceGroup/shared/list`

### Insights (`7`)
- `GET /v2/bot/insight/message/delivery?date={date}`
- `GET /v2/bot/insight/followers?date={date}`
- `GET /v2/bot/insight/demographic`
- `GET /v2/bot/insight/message/event?requestId={requestId}`
- `GET /v2/bot/insight/message/event/aggregation?customAggregationUnit={customAggregationUnit}&from={from}&to={to}`
- `GET /v2/bot/message/aggregation/info`
- `GET /v2/bot/message/aggregation/list`

### Coupon (`4`)
- `POST /v2/bot/coupon`
- `PUT /v2/bot/coupon/{couponId}/close`
- `GET /v2/bot/coupon`
- `GET /v2/bot/coupon/{couponId}`

### Users (`2`)
- `GET /v2/bot/profile/{userId}`
- `GET /v2/bot/followers/ids`

### Membership (`3`)
- `GET /v2/bot/membership/subscription/{userId}`
- `GET /v2/bot/membership/{membershipId}/users/ids`
- `GET /v2/bot/membership/list`

### Bot (`1`)
- `GET /v2/bot/info`

### Group chats (`5`)
- `GET /v2/bot/group/{groupId}/summary`
- `GET /v2/bot/group/{groupId}/members/count`
- `GET /v2/bot/group/{groupId}/members/ids`
- `GET /v2/bot/group/{groupId}/member/{userId}`
- `POST /v2/bot/group/{groupId}/leave`

### Multi-person chats (`4`)
- `GET /v2/bot/room/{roomId}/members/count`
- `GET /v2/bot/room/{roomId}/members/ids`
- `GET /v2/bot/room/{roomId}/member/{userId}`
- `POST /v2/bot/room/{roomId}/leave`

### Rich menu (`10`)
- `POST /v2/bot/richmenu`
- `POST /v2/bot/richmenu/validate`
- `POST /v2/bot/richmenu/{richMenuId}/content`
- `GET /v2/bot/richmenu/{richMenuId}/content`
- `GET /v2/bot/richmenu/list`
- `GET /v2/bot/richmenu/{richMenuId}`
- `DELETE /v2/bot/richmenu/{richMenuId}`
- `POST /v2/bot/user/all/richmenu/{richMenuId}`
- `GET /v2/bot/user/all/richmenu`
- `DELETE /v2/bot/user/all/richmenu`

### Per-user rich menu (`8`)
- `POST /v2/bot/user/{userId}/richmenu/{richMenuId}`
- `POST /v2/bot/richmenu/bulk/link`
- `GET /v2/bot/user/{userId}/richmenu`
- `DELETE /v2/bot/user/{userId}/richmenu`
- `POST /v2/bot/richmenu/bulk/unlink`
- `POST /v2/bot/richmenu/batch`
- `GET /v2/bot/richmenu/progress/batch`
- `POST /v2/bot/richmenu/validate/batch`

### Rich menu alias (`5`)
- `POST /v2/bot/richmenu/alias`
- `DELETE /v2/bot/richmenu/alias/{richMenuAliasId}`
- `POST /v2/bot/richmenu/alias/{richMenuAliasId}`
- `GET /v2/bot/richmenu/alias/{richMenuAliasId}`
- `GET /v2/bot/richmenu/alias/list`

### Account link (`1`)
- `POST /v2/bot/user/{userId}/linkToken`

## Canonical endpoints and reviewed parameters

### 1) Set webhook endpoint URL
- Method: `PUT`
- URL: `https://api.line.me/v2/bot/channel/webhook/endpoint`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Required body field:
  - `endpoint` — valid HTTPS webhook URL
- Confirmed behavior from the official page:
  - changes may take up to `1` minute because of caching
  - URL must be HTTPS and `500` characters or less
  - success returns HTTP `200` with `{}`
  - invalid webhook URLs return `400`
- Confirmed rate limit: `1,000 requests per minute`

### 2) Test webhook endpoint
- Method: `POST`
- URL: `https://api.line.me/v2/bot/channel/webhook/test`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Optional body field:
  - `endpoint` — webhook URL to validate; omit it to test the already configured channel webhook
- Confirmed behavior from the official page:
  - with `endpoint`, LINE validates and then sends a test webhook POST
  - without `endpoint`, LINE tests the webhook URL already configured for the channel
  - if the channel has no webhook endpoint configured, LINE returns `404`
  - the bot server should return HTTP `200` to LINE's test POST, which contains `destination` and an empty `events` array
  - success response includes a top-level `success` boolean indicating whether LINE could reach the webhook URL
- Confirmed rate limit: `60 requests per hour`

### 3) Issue channel access token v2.1
- Method: `POST`
- URL: `https://api.line.me/oauth2/v2.1/token`
- Content type: `application/x-www-form-urlencoded`
- Required body fields:
  - `grant_type` — must be `client_credentials`
  - `client_assertion_type` — URL-encoded JWT bearer assertion URN
  - `client_assertion` — signed JWT assertion
- Confirmed response fields:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `key_id`
- Confirmed official notes:
  - JWT assertions must expire within `30` minutes of generation
  - max `30` v2.1 tokens per channel at once, excluding expired tokens
  - `400` covers failed JWT verification, expired assertions, or token-cap exhaustion
  - `404` covers missing/unregistered signature-key association

### 4) Send reply message
- Method: `POST`
- URL: `https://api.line.me/v2/bot/message/reply`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Required body fields:
  - `replyToken`
  - `messages` — array of message objects, max `5`
- Optional body field:
  - `notificationDisabled`
- Confirmed official usage notes:
  - reply tokens are one-time use only
  - reply tokens must be used within about `1` minute of receiving the webhook
  - redelivered-webhook reply tokens can also work within `1` minute of redelivery, but not if the original token was already used or if `20` minutes have passed since the event
  - LINE advises using reply tokens as soon as possible and not relying on exact token-lifetime behavior
- Confirmed rate limit: `2,000 requests per second`

### 5) Send push message
- Method: `POST`
- URL: `https://api.line.me/v2/bot/message/push`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Optional header:
  - `X-Line-Retry-Key` — UUID generated by the client for safe retries
- Required body fields:
  - `to` — `userId`, `groupId`, or `roomId` from webhook objects
  - `messages` — array of message objects, max `5`
- Optional body field:
  - `notificationDisabled`
- Confirmed official usage notes:
  - push is allowed to friends, joined groups/rooms, and one-to-one users who messaged the account within the last `7` days even if not friended
  - LINE may still return `200` even when delivery will not actually reach users who deleted accounts, blocked the account, or are otherwise not deliverable
- Confirmed rate limit: `2,000 requests per second`

### 6) Get follower IDs
- Method: `GET`
- URL: `https://api.line.me/v2/bot/followers/ids`
- Auth: `Authorization: Bearer <channel-access-token>`
- Query parameters:
  - `limit` — optional, default `300`, max `1000`
  - `start` — optional continuation token from the previous response's `next` property
- Confirmed pagination behavior:
  - repeat requests until the response no longer includes `next`
  - use returned `next` as the next request's `start`
- Confirmed official usage notes:
  - available only for verified or premium accounts
  - results exclude deleted accounts, users who later blocked the account, and users who did not consent to profile retrieval
  - the returned total may differ from displayed friend counts in business/manager UIs
- Confirmed rate limit: `2,000 requests per second`

### 7) Get profile
- Method: `GET`
- URL: `https://api.line.me/v2/bot/profile/{userId}`
- Auth: `Authorization: Bearer <channel-access-token>`
- Path parameter:
  - `userId` — webhook-derived LINE user ID, not the LINE ID string shown in apps
- Confirmed response fields:
  - `displayName`
  - `userId`
  - optional `language`
  - optional `pictureUrl`
  - optional `statusMessage`
- Confirmed official usage notes:
  - this endpoint returns only the main profile, not subprofile data
  - you cannot retrieve the profile of a user who blocked the LINE Official Account
  - `404` can mean non-existent user, missing consent, not a friend, or blocked-after-friending
- Confirmed rate limit: `2,000 requests per second`

### 8) Get group chat summary
- Method: `GET`
- URL: `https://api.line.me/v2/bot/group/{groupId}/summary`
- Auth: `Authorization: Bearer <channel-access-token>`
- Path parameter:
  - `groupId` — group ID from the webhook event source object
- Confirmed response fields:
  - `groupId`
  - `groupName`
  - optional `pictureUrl`
- Confirmed error notes:
  - `400` for invalid `groupId`
  - `404` for a non-existent group or a group the LINE Official Account is not in
- Confirmed rate limit: `2,000 requests per second`

### 9) Create rich menu
- Method: `POST`
- URL: `https://api.line.me/v2/bot/richmenu`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Required body shape:
  - a rich-menu object including `size`, `selected`, `name`, `chatBarText`, and `areas`
- Confirmed response field:
  - `richMenuId`
- Confirmed official usage notes:
  - upload an image and then set/link the menu before it is displayed to users
  - you can create up to `1000` rich menus per LINE Official Account via the Messaging API
  - a dedicated validation endpoint exists at `POST /v2/bot/richmenu/validate`
  - `400` can mean invalid rich-menu object or maximum-rich-menu limit reached
- Confirmed rate limit: `100 requests per hour`

### 10) Get rich menu list
- Method: `GET`
- URL: `https://api.line.me/v2/bot/richmenu/list`
- Auth: `Authorization: Bearer <channel-access-token>`
- Confirmed response field:
  - `richmenus` — array of rich-menu response objects
- Confirmed official usage note:
  - rich menus created in LINE Official Account Manager are not returned by this endpoint
- Confirmed rate limit: `2,000 requests per second`

### 11) Display a loading animation
- Method: `POST`
- URL: `https://api.line.me/v2/bot/chat/loading/start`
- Auth: `Authorization: Bearer <channel-access-token>`
- Content type: `application/json`
- Required body field:
  - `chatId` — target user ID
- Optional body field:
  - `loadingSeconds` — one of `5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60`; default `20`
- Confirmed official usage notes:
  - works only in one-to-one chats
  - only appears if the user is actively viewing the chat screen
  - a second request overrides the remaining display duration
  - requires LINE iOS/Android `13.16.0` or later on the client side
  - returns `202` with `{}` even when the animation cannot actually be shown to users who are not viewing the chat, are not friends, blocked the account, or deleted the account
- Confirmed rate limit: `100 requests per second`

## Pagination and collection behavior
- LINE does not publish one universal pagination contract for the entire Messaging API on this page; pagination is route-specific.
- Confirmed route-specific pagination on `GET /v2/bot/followers/ids`:
  - request params: `limit`, `start`
  - response continues with `next`
  - clients must keep requesting until `next` disappears
- The route inventory also includes list/progress endpoints such as audience, rich-menu alias, rich-menu batch-progress, and delivery/aggregation endpoints, but the official docs describe their collection behavior per endpoint rather than as one shared global schema.

## Rate-limit notes
- Confirmed rate-limit examples from the shared LINE rate-limit table:
  - `60 requests per hour` for narrowcast send, broadcast send, delivery/follower/demographic insight routes, aggregation routes, and webhook testing
  - `60 requests per minute` for audience-management routes
  - `1,000 requests per minute` for webhook endpoint set/get
  - `100 requests per hour` for create rich menu, delete rich menu, delete rich-menu alias, and rich-menu batch-status
  - `3 requests per hour` for rich-menu batch link/unlink replacement operations
  - `200 requests per second` for multicast, membership, and coupon operations listed on the official table
  - `100 requests per second` for loading animation
  - `370 requests per second` for short-lived channel access token issuance
  - `2,000 requests per second` for other API endpoints
- LINE also documents a separate concurrent-operation limit of `10` for the audience upload/add endpoints tied to `audienceGroupId`.

## Error and format notes
- Official shared error payload shape:
  - `message`
  - optional `details[]`
  - optional `details[].message`
  - optional `details[].property`
- Example shared error messages documented by LINE include:
  - `The request body has X error(s)`
  - `Invalid reply token`
  - `The request body could not be parsed as JSON`
  - `Authentication failed due to the following reason: XXX`
  - `Access to this API is not available for your account`
  - `Failed to send messages`
  - `You have reached your monthly limit.`
  - `The API rate limit has been exceeded. Try again later.`
  - `Not found`
- JSON is the standard control-plane format, but some endpoints on `api-data.line.me` return binary bodies.

## Important usage notes
- The official reference now exposes a broad Messaging API surface, not just simple send-message routes: webhooks, token management, audience operations, insights, coupons, memberships, group/room management, rich menus, aliases, and account-link tokens are all present on the same page.
- Host selection matters: adapters must preserve whether an operation belongs on `api.line.me` or `api-data.line.me`.
- Retry/idempotency handling matters on push-style flows because LINE documents `X-Line-Retry-Key` plus `X-Line-Accepted-Request-Id` semantics.
- Reply flows are time-sensitive and should be executed immediately after webhook receipt.
- Webhook tests send an HTTP POST with no events; integrations should not assume every webhook POST contains a non-empty event list.
- Followers-list access is account-tier gated and paginated; do not assume all accounts can call it.
- Rich-menu data created via the official account manager is not always visible through the Messaging API list endpoints.
- The official rate-limit model is endpoint-specific enough that fireROUTE should preserve per-route quota metadata instead of flattening LINE into one generic global limit.
