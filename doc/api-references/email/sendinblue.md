# Brevo (formerly Sendinblue)

Official docs manually reviewed:
- https://developers.brevo.com/reference/send-transac-email
- https://developers.brevo.com/reference/get-events
- https://developers.brevo.com/reference/create-event
- https://developers.brevo.com/reference/create-batch-events
- https://developers.brevo.com/reference/get-account
- https://developers.brevo.com/reference/get-account-activity

## Overview
Brevo exposes a broad API surface under `/v3`. This manual pass covered the core transactional-email send endpoint plus account and custom-event endpoints that are directly accessible in the official reference.

- Base URL: `https://api.brevo.com`
- Protocol: JSON over HTTPS
- Auth: API key in `api-key` request header

## Authentication
All reviewed pages use the same auth model:

```http
api-key: YOUR_API_KEY
Content-Type: application/json
```

## Confirmed endpoints

| Method | Path | Purpose | Key params/body |
|---|---|---|---|
| POST | `/v3/smtp/email` | Send a transactional email | Sender/recipient/content/template fields |
| GET | `/v3/events` | List custom events | Query filters and pagination |
| POST | `/v3/events` | Create a custom event | `event_name`, `identifiers`, optional metadata |
| POST | `/v3/events/batch` | Create custom events in batch | Batch event payload |
| GET | `/v3/account` | Fetch account details | none |
| GET | `/v3/organization/activities` | Fetch organization user activity logs | Query date filters, email, pagination |

Manual route count confirmed from the reviewed pages: **6**.

## Transactional email
Confirmed from `POST /v3/smtp/email`:
- Full URL: `https://api.brevo.com/v3/smtp/email`
- Success status shown: `201`
- Example success body: `{"messageId":"<...>"}`

Key confirmed request fields:
- `sender` required when `templateId` is not used
- `subject` required when `templateId` is not used
- `to` recipient list
- optional `cc`, `bcc`
- `htmlContent` optional but effectively required when no `templateId`
- `templateId` optional alternative to inline content
- `attachment[]` supports either absolute URL or Base64 content
- `batchId` optional UUIDv4 for scheduled batches
- `headers` optional custom mail headers
- `messageVersions[]` for personalized variants; docs note max `2000` total recipients and max `99` recipients per version

Important documented constraints:
- `scheduledAt` uses UTC and is limited to a short future scheduling window (up to 5-minute delay per the reviewed page text)
- Attachments support a long allowlist of file extensions
- When `templateId` is provided, template sender/subject are used unless overridden

## Events API
### GET /v3/events
Confirmed behavior:
- Only custom events are currently supported
- Query filters:
  - `contact_id` repeatable list
  - `event_name` repeatable list
  - `object_type` repeatable list
  - `startDate` optional; required if `endDate` is used
  - `endDate` optional; required if `startDate` is used
  - `limit` optional, default `100`, min `1`, max `10000`
  - `offset` optional, default `0`
- Response includes `count` plus `events[]`
- Events are ordered by `event_date` descending

### POST /v3/events
Confirmed request fields:
- `event_name` required; max `255` chars; only alphanumeric, `_`, `-`
- `identifiers` required; at least one identifier is required for the contact
- `contact_properties` optional
- `event_date` optional ISO-8601 timestamp
- `event_properties` optional; supports nested data, size limited to `50KB`
- `object` optional associated object identifiers

### POST /v3/events/batch
The reviewed reference confirms a dedicated batch-create endpoint under the same `/v3/events` family for posting multiple events in one request.

## Account and audit endpoints
### GET /v3/account
Returns account metadata including:
- `organization_id`, `user_id`, `enterprise`
- company and contact details
- `plan[]` and `planVerticals[]`
- `relay` SMTP information
- address details
- marketing automation settings

### GET /v3/organization/activities
Confirmed query parameters:
- `startDate` and `endDate` in `YYYY-MM-DD`, with one-month max range and up to 12 months historical lookback
- `email` optional user filter
- `limit` optional, range `1-100`, default `10`
- `offset` optional, default `0`

Confirmed response shape:
- `logs[]` with `action`, `date`, `user_agent`, `user_email`, `user_ip`, optional `count`

Important note from the page:
- Requires Enterprise plan for organization activity logs

## Pagination
Observed pagination model on reviewed GET endpoints:
- `limit`
- `offset`
- total/count field in response (`count` for `/v3/events`)

## Errors
Reviewed pages explicitly list common error classes including:
- `400` Bad Request
- `401` Unauthorized
- `500` Internal Server Error

## fireROUTE notes
- Keep Brevo’s `/v3/smtp/email` payload largely intact in passthrough mode; its template/message-version model is richer than a basic canonical email abstraction.
- `/v3/events` is useful as a business/event ingestion surface, not just email delivery reporting.
- Preserve account/audit endpoints separately from send endpoints so operational tooling can query relay and organization status without mixing concerns.
