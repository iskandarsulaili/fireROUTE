# SendGrid

Official docs manually reviewed:
- https://www.twilio.com/docs/sendgrid/api-reference
- https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send

## Overview
Twilio SendGrid’s v3 API is large. This manual pass verified the core Mail Send API page that Twilio positions as the primary programmatic email-sending endpoint.

- Global base URL: `https://api.sendgrid.com`
- EU regional base URL: `https://api.eu.sendgrid.com`
- Protocol: JSON over HTTPS
- Auth: bearer API key in `Authorization`

## Authentication
The Mail Send reference requires API key auth.

```http
Authorization: Bearer YOUR_SENDGRID_API_KEY
Content-Type: application/json
```

Optional header observed on the same page:
- `Content-Encoding: gzip` when gzip-compressed request bodies are enabled for the account

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| POST | `/v3/mail/send` | Send one email request containing one or more personalizations |

Manual route count confirmed from the reviewed page: **1**.

## Request body
Confirmed top-level request fields from the Mail Send page:
- `personalizations` required array; max `1000`
- `from` required object
- `reply_to` optional object
- `reply_to_list` optional array; max `1000`
- `subject` optional global subject
- `content` optional array of MIME body objects
- `attachments` optional array; attachment content is Base64-encoded
- `template_id` optional; dynamic templates start with `d-`
- `headers` optional custom headers object
- `categories` optional array; max `10`
- `custom_args` optional string/object-like custom metadata, total size capped at `10,000` bytes
- `send_at` optional Unix timestamp, cannot be scheduled more than 72 hours ahead
- `batch_id` optional batch identifier for scheduled sends
- `asm` optional unsubscribe group configuration

Key operational notes explicitly documented:
- The endpoint supports both global and per-personalization subjects
- Dynamic template IDs begin with `d-`
- Scheduling is limited to 72 hours in advance
- EU sending requires EU regional infrastructure and a qualifying plan/subuser

## Response and status behavior
The page documents `POST /v3/mail/send` as a send operation and shows the structured request schema in detail. The standard successful SendGrid behavior for this endpoint is asynchronous acceptance rather than immediate delivery confirmation.

From the manually reviewed page:
- Request/response content type is JSON
- Authentication is required for every call
- The page exposes a dedicated Mail Send errors section alongside the endpoint page

## Rate limits
The reviewed Mail Send page does not publish a numeric per-endpoint rate limit. It does, however, document request-size and field-size constraints such as:
- `personalizations` max `1000`
- `categories` max `10`
- `reply_to_list` max `1000`
- `send_at` no more than 72 hours in advance

## Pagination
No pagination applies to `POST /v3/mail/send`.

## Errors
The Mail Send docs include a dedicated errors page in the same section. The manually reviewed operation page confirms authentication requirements and schema validation constraints; request failures should be expected for invalid auth, malformed payloads, or unsupported combinations like invalid headers/template usage.

## Important usage notes
- Use `https://api.eu.sendgrid.com` only for EU regional subusers/accounts.
- SendGrid models one API call as a message envelope with up to many `personalizations`; fireROUTE should preserve this shape instead of flattening recipients too early.
- Attachments must be Base64 encoded.
- Dynamic templates override message-level content when `template_id` is used.

## fireROUTE notes
- Treat SendGrid as a high-capability email send provider whose canonical minimum viable mapping is `POST /v3/mail/send`.
- Preserve provider-specific structures like `personalizations`, `dynamic_template_data`, scheduling, and unsubscribe-group settings in passthrough mode.
- If fireROUTE later adds delivery analytics or suppressions, those should be documented separately; this pass only confirms the Mail Send surface.
