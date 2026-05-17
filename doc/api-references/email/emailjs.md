# EmailJS

Official docs manually reviewed:
- https://www.emailjs.com/docs/
- https://www.emailjs.com/docs/rest-api/send/
- https://www.emailjs.com/docs/rest-api/send-form/
- https://www.emailjs.com/docs/rest-api/history/
- https://www.emailjs.com/docs/faq/is-it-okay-to-expose-my-public-key/

## Overview
EmailJS exposes a very small REST API for sending templated email directly from client-side or lightweight apps without managing your own mail backend. The reviewed official docs publish two send endpoints and one history endpoint.

- Base URL: `https://api.emailjs.com`
- Primary transport: HTTPS
- Request formats: JSON for `/api/v1.0/email/send`, `multipart/form-data` for `/api/v1.0/email/send-form`, query-string GET for `/api/v1.1/history`
- Response formats: `JSON` or plain text according to the reviewed REST API pages
- Manual route count confirmed from the reviewed official REST docs: **3**

## Authentication
The reviewed docs use key-style credentials embedded in request data rather than an `Authorization` header.

Confirmed auth fields:
- `user_id` — required public key on all three reviewed routes
- `accessToken` — private key; optional on `/send` and `/send-form`, required on `/history`

Important security note from the reviewed FAQ:
- EmailJS says exposing the public key is acceptable because callers can only trigger your predefined templates with your configured content model, not arbitrary custom spam content.
- The private key (`accessToken`) is still sensitive and should be kept server-side.

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters/body |
|---|---|---|---|
| POST | `/api/v1.0/email/send` | Send a templated email using JSON request data | JSON body `service_id`, `template_id`, `user_id`, optional `template_params`, optional `accessToken` |
| POST | `/api/v1.0/email/send-form` | Send a templated email using submitted form data | multipart form fields `service_id`, `template_id`, `user_id`, optional `accessToken`, plus the form fields used by the template |
| GET | `/api/v1.1/history` | List account email history records | Query `user_id`, `accessToken`, optional `page`, `count`, `errors_only` |

## Endpoint details
### `POST /api/v1.0/email/send`
The reviewed page describes this route as sending an email based on a specified template and dynamic parameters.

Confirmed request properties:
- `service_id` — required; service to send through
- `template_id` — required; template identifier
- `user_id` — required; public key
- `template_params` — optional object containing dynamic template variables
- `accessToken` — optional private key

Important usage note from the official page:
- the reserved keyword `default_service` is supported for `service_id`

Confirmed request content type:
- `application/json`

Confirmed example statuses:
- `200 "OK"`
- `400 "The user_id parameter is required"`

### `POST /api/v1.0/email/send-form`
The reviewed page describes this route as sending an email from form data rather than a JSON payload.

Confirmed request fields:
- `service_id` — required
- `template_id` — required
- `user_id` — required
- `accessToken` — optional
- additional submitted form fields are used as template values

Confirmed request content type:
- `multipart/form-data`

Confirmed example statuses:
- `200 "OK"`
- `400 "The user_id parameter is required"`

### `GET /api/v1.1/history`
The reviewed page exposes a history-list endpoint for previously sent emails.

Confirmed query parameters:
- `user_id` — required public key
- `accessToken` — required private key
- `page` — optional current page number
- `count` — optional records per page
- `errors_only` — optional filter for failed records only

Confirmed example response fields:
- top-level `is_last_page`
- top-level `rows[]`
- per-record fields such as `id`, `user_id`, `result`, `error`, `provider`, `service_id`, `original_service_id`, `template_id`, `template_params`, `files`, `retry_count`, `created_at`, `updated_at`

The reviewed docs show `result: 1` for success and `result: 2` for error in example rows.

## Pagination
Only the reviewed history endpoint exposes pagination controls.

Confirmed pagination parameters:
- `page`
- `count`

Confirmed pagination signal in the response:
- `is_last_page`

The send endpoints are single-action operations and do not use pagination.

## Rate limits
Each reviewed REST API page explicitly states the same limit:
- **1 request per second**

## Errors
The reviewed pages do not publish a large centralized error schema.

Confirmed error signals from the reviewed pages:
- `400` with a plain-text style message such as `"The user_id parameter is required"`
- success shown as `200 "OK"`

For history and send operations, preserve non-200 response bodies because the docs indicate the service may return human-readable text errors rather than a deeply structured universal envelope.

## Response format
The reviewed REST pages state:
- response format is `JSON or Text`

Practical observations from the reviewed examples:
- `/history` returns structured JSON objects with pagination and row arrays
- `/send` and `/send-form` document plain success/error text examples such as `200 "OK"` and `400 "The user_id parameter is required"`

## Important usage notes
- `default_service` is an officially supported special value for `service_id` on both send endpoints.
- The API surface is intentionally small; most customization lives in dashboard-defined templates and connected mail services, not a large route catalog.
- `accessToken` is optional for the two send endpoints in the reviewed docs but mandatory for the history endpoint.
- The official FAQ explicitly frames EmailJS as a system for triggering predefined emails, not composing arbitrary new email content directly at send time.

## fireROUTE notes
- Treat EmailJS as a templated-email trigger provider, not a general mailbox-management API.
- A normalized adapter can map to three upstream actions: send JSON, send form, and list send history.
- Preserve the provider’s `service_id`, `template_id`, and `template_params` model rather than flattening it into generic email fields too aggressively.
