# Stytch

Official docs manually reviewed:
- https://stytch.com/docs/api-reference/consumer/api/overview
- https://stytch.com/docs/api-reference/consumer/api/otp/via-sms/send
- https://stytch.com/docs/api-reference/consumer/api/otp/via-sms/login-or-create-user
- https://stytch.com/docs/api-reference/consumer/api/otp/via-email/send
- https://stytch.com/docs/api-reference/consumer/api/otp/via-email/login-or-create-user
- https://stytch.com/docs/api-reference/consumer/api/otp/authenticate

## Overview
Stytch’s consumer auth API is a large REST API. This manual pass focused on the OTP flows and core platform-level access details exposed directly in the official reference.

- Test base URL: `https://test.stytch.com`
- Live base URL: `https://api.stytch.com`
- Protocol: JSON over HTTPS
- Auth: HTTP Basic using `project_id:secret`
- Primary response metadata: every response includes `request_id`; errors use standard HTTP status codes and JSON bodies

## Authentication and environments
Confirmed from the overview page:
- Direct API calls authenticate with HTTP Basic Auth using the project `project_id` and `secret`
- All resources are scoped to the project tied to those credentials
- The docs explicitly show both live and test API hosts on endpoint pages

Example header model:

```http
Authorization: Basic base64(project_id:secret)
Content-Type: application/json
```

## Confirmed OTP endpoints

| Method | Path | Purpose | Key request fields |
|---|---|---|---|
| POST | `/v1/otps/sms/send` | Send SMS OTP to an existing user factor | `phone_number`, optional `expiration_minutes`, `attributes`, `locale`, `user_id`, `session_token`, `session_jwt` |
| POST | `/v1/otps/sms/login_or_create` | Create a user if needed and send SMS OTP | `phone_number`, plus OTP/session options documented on page |
| POST | `/v1/otps/whatsapp/send` | Send WhatsApp OTP | Same OTP send pattern, WhatsApp channel |
| POST | `/v1/otps/whatsapp/login_or_create` | Create/login via WhatsApp OTP | Same OTP login-or-create pattern |
| POST | `/v1/otps/email/send` | Send email OTP | `email`, optional expiration and locale/template-related fields shown in docs |
| POST | `/v1/otps/email/login_or_create` | Create/login via email OTP | `email`, plus user/session options documented on page |
| POST | `/v1/otps/authenticate` | Verify an OTP and optionally create a session | `method_id`, `code`, optional `session_duration_minutes` and session controls |

Manual route count confirmed from the official consumer OTP reference: **7**.

## Request/response details
### OTP send via SMS
Confirmed from `/v1/otps/sms/send`:
- `phone_number` is required and must be E.164 formatted, e.g. `+1XXXXXXXXXX`
- `expiration_minutes` optional; minimum `1`, maximum `10`, default `2`
- `locale` supported values shown: `en`, `es`, `fr`, `pt-br`
- Optional context/session fields: `attributes`, `user_id`, `session_token`, `session_jwt`
- Success response contains `request_id`, `user_id`, `phone_id`, `status_code`
- Documented status codes on page: `200`, `401`, `429`, `500`

### OTP authenticate
Confirmed from `/v1/otps/authenticate`:
- `method_id` required (e.g. phone/email factor ID)
- `code` required
- `session_duration_minutes` optional in the example
- Success response returns rich auth material including `session_token`, `session_jwt`, `session`, `user`, `method_id`, `request_id`, `status_code`
- This is the endpoint that converts a delivered OTP into an authenticated user session

### OTP via email
Confirmed from `/v1/otps/email/send` and `/v1/otps/email/login_or_create`:
- Paths are `/v1/otps/email/send` and `/v1/otps/email/login_or_create`
- The example requests use `email` as the primary identifier
- These pages follow the same response/status model as other OTP pages (`200`, `401`, `429`, `500`)

## Response format notes
Stytch’s OTP pages consistently show JSON responses and include:
- `request_id` for support/debugging
- a factor identifier such as `phone_id` or `method_id`
- `user_id`
- `status_code`

`/v1/otps/authenticate` additionally returns:
- `session_token`
- `session_jwt`
- a full `session` object
- a full `user` object
- `reset_sessions` when relevant

## Rate limits
The manually reviewed OTP pages expose `429` as a documented response status, but the inspected pages do not publish a numeric per-endpoint quota.

## Pagination
No pagination was present on the manually reviewed OTP endpoints.

## Errors
The OTP pages explicitly document these response status classes:
- `401` unauthorized/auth failure
- `429` rate limited
- `500` server error

The docs also emphasize logging `request_id` for debugging and support.

## Important usage notes
- Use `test.stytch.com` for non-production projects and `api.stytch.com` for live traffic.
- OTP delivery invalidates previous OTPs for the same user on send.
- For direct API use, Stytch expects credentials in Basic Auth rather than a bearer token.
- `method_id` from the delivery step is what the authenticate call uses to validate the submitted code.

## fireROUTE notes
- Treat Stytch as a full identity platform, not just an OTP provider; this file only documents the OTP slice that was manually reviewed.
- Preserve `request_id`, `session_token`, and `session_jwt` in passthrough responses.
- Because the product surface is wide, fireROUTE adapters should expose raw-route passthrough for unreviewed Stytch families rather than over-canonicalizing.
