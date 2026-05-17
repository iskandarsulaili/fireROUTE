# OneSignal

## Provider metadata
- Category: `Development`
- Provider slug: `onesignal`
- Docs used manually:
  - `https://documentation.onesignal.com/reference/rest-api-overview`
  - `https://documentation.onesignal.com/reference/rate-limits`
  - `https://documentation.onesignal.com/reference/idempotent-notification-requests`
  - `https://documentation.onesignal.com/reference/push-notification`
  - `https://documentation.onesignal.com/reference/email`
  - `https://documentation.onesignal.com/reference/sms`
  - `https://documentation.onesignal.com/reference/view-message`
  - `https://documentation.onesignal.com/reference/view-messages`
  - `https://documentation.onesignal.com/reference/cancel-message`
  - `https://documentation.onesignal.com/reference/message-history`
- Confirmed REST API base URL: `https://api.onesignal.com`
- Primary media type: JSON
- Auth model confirmed from the docs: app API key in the `Authorization` header using the `Key ...` format
- Manually confirmed routes in this pass: `7`

## Authentication
Confirmed auth details from the official docs:
- message APIs use the app REST API key in `Authorization: Key YOUR_APP_API_KEY`
- most message routes also require `app_id`, either in the request body or as a query parameter depending on the endpoint
- the REST API overview states the API can be used to send push notifications, emails, SMS, manage users/subscriptions/segments, and export data
- OneSignal documents idempotent request handling for message creation and custom-event creation via the `idempotency_key` request field

Important idempotency notes from the official docs:
- `idempotency_key` is the recommended field name
- the older `external_id` name is still accepted for this idempotency purpose
- idempotency keys are retained for `30 days`
- reusing the same key for a different message within that retention window causes only the first request to be processed

## Common request/response conventions
- Base URL: `https://api.onesignal.com`
- Create-message endpoints are channel-specific variations of the same notifications surface:
  - push: `POST /notifications?c=push`
  - email: `POST /notifications?c=email`
  - SMS: `POST /notifications?c=sms`
- Read and control routes are under `/notifications`
- Responses are JSON
- Message-targeting models in the docs repeatedly expose these audience selectors:
  - `include_aliases`
  - `include_subscription_ids`
  - `included_segments`
  - `excluded_segments`
  - `filters`
- The create-message overview explicitly warns not to combine `include_aliases`, `included_segments`, and `filters` in one request

## Manually confirmed endpoint set

### 1) Create a push notification
- Method: `POST`
- Path: `/notifications`
- Full URL: `https://api.onesignal.com/notifications?c=push`
- Headers confirmed in the route reference:
  - `Authorization: Key YOUR_APP_API_KEY`
  - `Content-Type: application/json`
- Required/important body fields confirmed in the docs example:
  - `app_id`
  - `contents`
  - `target_channel="push"`
- Common targeting/body fields shown in the official route page:
  - `include_aliases`
  - `include_subscription_ids`
  - `included_segments`
  - `excluded_segments`
  - `filters`
  - `headings`
  - `subtitle`
  - `name`
  - `template_id`
  - `custom_data`
  - `url`
  - `app_url`
  - `web_url`
  - `buttons`
  - `web_buttons`
  - `ttl`
  - `collapse_id`
  - `send_after`
  - `delayed_option`
  - `delivery_time_of_day`
  - `idempotency_key`
- Confirmed response tabs on the route page:
  - `200`
  - `400`
  - `403`
  - `429`
  - `503`

### 2) Create an email message
- Method: `POST`
- Path: `/notifications`
- Full URL: `https://api.onesignal.com/notifications?c=email`
- Headers confirmed in the route reference:
  - `Authorization: Key YOUR_APP_API_KEY`
  - `Content-Type: application/json`
- Important body fields confirmed from the docs example:
  - `app_id`
  - `email_subject`
  - `email_body`
  - `target_channel="email"`
- Additional email-specific fields shown in the docs:
  - `email_to`
  - `email_preheader`
  - `email_from_name`
  - `email_from_address`
  - `email_sender_domain`
  - `email_reply_to_address`
  - `include_unsubscribed`
  - `disable_email_click_tracking`
  - `send_after`
  - `delayed_option`
  - `delivery_time_of_day`
  - `idempotency_key`
- Confirmed response tabs:
  - `200`
  - `400`
  - `403`
  - `429`
  - `503`

### 3) Create an SMS message
- Method: `POST`
- Path: `/notifications`
- Full URL: `https://api.onesignal.com/notifications?c=sms`
- Headers confirmed in the route reference:
  - `Authorization` header required by the page example
  - `Content-Type: application/json`
- Important body fields confirmed from the docs example:
  - `app_id`
  - `contents`
  - `target_channel="sms"`
- Additional SMS-specific fields shown in the docs:
  - `include_aliases`
  - `include_subscription_ids`
  - `include_phone_numbers`
  - `included_segments`
  - `excluded_segments`
  - `filters`
  - `sms_from`
  - `sms_media_urls`
  - `name`
  - `template_id`
  - `custom_data`
  - `send_after`
  - `idempotency_key`
- Confirmed response tabs:
  - `200`
  - `400`
  - `403`
  - `429`
  - `503`

### 4) View a single message
- Method: `GET`
- Path: `/notifications/{message_id}`
- Full URL pattern: `https://api.onesignal.com/notifications/{message_id}?app_id={app_id}`
- Headers confirmed:
  - `Authorization: Key YOUR_APP_API_KEY`
- Path/query parameters shown in the official example:
  - `message_id` path parameter
  - `app_id` query parameter
  - `outcome_time_range`
  - `outcome_platforms`
  - `outcome_attribution`
- Confirmed response tabs:
  - `200`
  - `429`
  - `503`
- Response fields visible in the sample include:
  - `id`
  - `app_id`
  - `contents`
  - `headings`
  - `successful`
  - `received`
  - `failed`
  - `remaining`
  - `queued_at`
  - `completed_at`
  - `platform_delivery_stats`
  - `outcomes`

### 5) List messages
- Method: `GET`
- Path: `/notifications`
- Full URL pattern: `https://api.onesignal.com/notifications`
- Headers confirmed:
  - `Authorization: Key YOUR_APP_API_KEY`
- Confirmed query parameters from the route example:
  - `app_id`
  - `limit`
  - `offset`
  - `kind`
  - `template_id`
  - `time_offset`
- Confirmed response tabs:
  - `200`
  - `429`
  - `503`
- Pagination note:
  - this is the primary manually confirmed paginated route in the current pass because it exposes `limit` and `offset`

### 6) Cancel a message
- Method: `DELETE`
- Path: `/notifications/{message_id}`
- Full URL pattern: `https://api.onesignal.com/notifications/{message_id}?app_id={app_id}`
- Headers confirmed:
  - `Authorization: Key YOUR_APP_API_KEY`
- Parameters:
  - `message_id` path parameter
  - `app_id` query parameter
- Purpose: stop a scheduled or currently outgoing message
- Confirmed response tabs:
  - `200`
  - `400`
  - `404`
  - `429`
  - `503`
- Sample success response:
  - `{ "success": true }`

### 7) Export message history
- Method: `POST`
- Path: `/notifications/{message_id}/history`
- Full URL pattern: `https://api.onesignal.com/notifications/{message_id}/history`
- Headers shown in the route page:
  - `Authorization`
  - `Content-Type: application/json`
- Path/body parameters confirmed from the example:
  - `message_id` path parameter
  - `app_id` body field
  - `events`
  - `email`
- Confirmed response tabs:
  - `202`
  - `400`
  - `429`
  - `503`
- Sample async response shape:
  - `success`
  - `destination_url`

## Pagination
Confirmed from the official docs used in this pass:
- `GET /notifications` uses `limit` and `offset`
- the rate-limits page also notes a special rule for view endpoints: `1 request/sec/app`, with `up to 10 look-back requests/sec`

## Rate limits
From the official rate-limits page:
- create message and cancel message share the same limit
- free plans: `150 requests/sec/app` for create/cancel message traffic
- paid plans: `6,000 requests/sec/app` for create/cancel message traffic
- create/update/delete users or subscriptions: `1,000 requests/sec/app`
- user/subscription mutation traffic is also limited to `1 request/sec per user or subscription`
- view endpoints (messages, templates, users): `1 request/sec/app`
- view endpoints additionally allow `up to 10 look-back requests/sec`
- when the API rate limit is exceeded, OneSignal returns `429` with `errors: ["API rate limit exceeded."]`
- `Retry-After` tells clients how many seconds to wait before retrying
- docs recommend capping retries to `10` attempts total and stopping after roughly `10–15 minutes`

Important application-limit note from the same page:
- API `429` throttling does **not** disable the app
- separate application message limits can disable an app if message volume in a rolling 15-minute window exceeds the documented threshold relative to subscription count

## Error handling
From the official rate-limit and route pages:
- retriable conditions include network timeouts, `429`, and `5xx`
- clients should respect `Retry-After` as a minimum delay for `429`
- create/cancel/view routes commonly expose `429` and `503` response variants in the reference pages
- email and SMS create routes explicitly expose `403` variants
- cancel-message also explicitly exposes `400` and `404`

## Response format notes
- OneSignal responses are JSON
- create-message responses include message identifiers plus `errors` or `warnings` collections when applicable
- list/get routes return message metadata and analytics-style delivery fields
- history export is asynchronous and returns a downloadable `destination_url` rather than the CSV content inline

## Important usage notes
- use `idempotency_key` whenever retrying create-message requests
- reuse the same idempotency key only for the same logical send operation
- OneSignal documents the create/cancel message endpoints as sharing one rate-limit bucket
- high-volume senders are expected to use fewer create requests with larger audiences rather than increasing request frequency
- the create-message overview explicitly distinguishes channel-targeting selectors (`include_aliases`, segments, filters, direct subscription IDs) and warns against combining incompatible targeting modes in one request

## Verification notes
This file was manually rebuilt from OneSignal's official REST overview, rate-limit, idempotency, and route-reference pages with browser inspection, replacing the earlier low-fidelity generated summary.
