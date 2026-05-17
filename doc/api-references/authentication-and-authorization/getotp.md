# GetOTP

Official docs manually reviewed:
- https://otp.dev/en/docs/
- https://otp.dev/en/docs/sms-otp/
- https://otp.dev/en/docs/verifying-otp/
- https://otp.dev/en/docs/senders/
- https://otp.dev/en/docs/sender/
- https://otp.dev/en/docs/templates/
- https://otp.dev/en/docs/template/
- https://otp.dev/en/docs/template-create/
- https://otp.dev/en/docs/template-update/
- https://otp.dev/en/docs/template-delete/
- https://otp.dev/en/docs/webhooks/
- https://otp.dev/en/docs/webhook/
- https://otp.dev/en/docs/webhook-create/
- https://otp.dev/en/docs/webhook-update/
- https://otp.dev/en/docs/webhook-delete/

## Overview
GetOTP provides OTP delivery and lightweight configuration APIs for sender IDs, templates, and delivery webhooks. The docs expose one verification resource plus sender/template/webhook CRUD resources.

- Base URL: `https://api.otp.dev`
- Transport: HTTPS JSON API
- Auth: pass your API key in `X-OTP-Key: <api_key>`
- Response format: JSON
- Error format: `{"errors":[{"timestamp","path","method","status","message","code"}]}`

## Authentication
The pages describe a “Basic HTTP verification method”, but the actual request examples consistently use the `X-OTP-Key` header.

Example:

```http
X-OTP-Key: YOUR_API_KEY
Accept: application/json
```

## Confirmed endpoints

| Method | Path | Purpose | Key params/body |
|---|---|---|---|
| POST | `/v1/verifications` | Send an OTP | Body `data.channel`, `data.sender`, `data.phone`, `data.template`, optional `data.code_length`, `data.code`, `data.payload` |
| GET | `/v1/verifications` | Check OTP status / verify lookup | Query `code` required, `phone` optional |
| GET | `/v1/senders` | List sender IDs | Query `filter[status]`, `page_size`, `page_token` |
| GET | `/v1/senders/{sender_id}` | Get one sender | Path `sender_id` |
| GET | `/v1/templates` | List templates | Query pagination fields from docs list page (`page_size`, `page_token`) |
| GET | `/v1/templates/{template_id}` | Get one template | Path `template_id` |
| POST | `/v1/templates` | Create template | Body `data.channel`, optional `data.name`, required `data.text` |
| PUT | `/v1/templates/{template_id}` | Update template | Path `template_id`; body `data.name`, `data.text` |
| DELETE | `/v1/templates/{template_id}` | Delete template | Path `template_id` |
| GET | `/v1/webhooks` | List webhooks | Query pagination fields from docs list page |
| GET | `/v1/webhooks/{webhook_id}` | Get one webhook | Path `webhook_id` |
| POST | `/v1/webhooks` | Create webhook | Body `data.event`, `data.url`, `data.secret`, `data.name`, `data.channel` |
| PUT | `/v1/webhooks/{webhook_id}` | Update webhook | Path `webhook_id`; body `data.url`, `data.secret`, `data.name` |
| DELETE | `/v1/webhooks/{webhook_id}` | Delete webhook | Path `webhook_id` |

Manual route count confirmed from the docs above: **14**.

## OTP send / verification details
`POST /v1/verifications` is the core delivery endpoint. The docs present separate pages for SMS, Viber, Voice, and Telegram, but they all use the same resource and differentiate delivery by `data.channel`.

Confirmed request fields from the SMS OTP page:
- `data.channel` string, required. Example: `sms`
- `data.sender` string, required. Sender ID / sender name shown to recipient
- `data.phone` string, required. Digits only, include country code, no separators
- `data.template` UUID, required. Template ID used to render the OTP message
- `data.code_length` number, optional. Range 4–8. One of `code_length` or `code` is required
- `data.code` string, optional. Digits only, length 4–8. One of `code_length` or `code` is required
- `data.payload` string, optional. JSON string payload echoed back through webhook delivery notifications

Confirmed example success payload:
- `account_id`
- `message_id`
- `phone`
- `create_date`
- `expire_date`

`GET /v1/verifications` confirms OTP lookup status with:
- `code` required
- `phone` optional

Example response shape includes:
- `data[]`
- `pagination.number`
- `pagination.size`
- `pagination.total`

## Senders
`GET /v1/senders` supports filtering and cursor-style pagination.

Confirmed query parameters:
- `filter[status]` optional. Documented values: `Pending`, `Available`, `Rejected`, `Canceled`
- `page_size` optional. Default `10`, maximum `1000`
- `page_token` optional. Used to fetch previous/next pages

Confirmed sender fields from response tables:
- `id`, `account_id`, `name`, `code`, `channel`, `type`, `status`
- `country`, `countries[]`
- `monthly_cost`, `setup_cost`
- `create_date`, `update_date`

## Templates
Templates are reusable OTP message bodies.

Confirmed request fields:
- Create: `data.channel`, optional `data.name`, required `data.text`
- Update: path `template_id`; body `data.name`, `data.text`

Confirmed response fields:
- `data.id`, `data.account_id`, `data.name`, `data.text`
- `data.channel`, `data.status`, `data.type`
- `data.create_date`, `data.update_date`
- `data.links.self`, `data.links.account`

Delete returns HTTP `204` on success.

## Webhooks
Webhooks deliver delivery or verification events back to your system.

Confirmed create fields:
- `data.event`
- `data.url`
- `data.secret`
- `data.name`
- `data.channel`

Confirmed update fields:
- path `webhook_id`
- body `data.url`, `data.secret`, `data.name`

Confirmed response fields:
- `data.id`, `data.account_id`, `data.url`, `data.secret`
- `data.event`, `data.name`, `data.channel`
- `data.create_date`, `data.update_date`
- `data.links.self`, `data.links.account`

Delete returns HTTP `204` on success.

## Pagination
The list endpoints shown in the docs use a pagination object of the form:

```json
{
  "pagination": {
    "number": 1,
    "size": 10,
    "total": 11,
    "links": {
      "first": "...",
      "current": "...",
      "previous": "...",
      "next": "..."
    }
  }
}
```

Observed list-style paging controls:
- `page_size`
- `page_token`

## Errors
Confirmed examples include:
- `1136` / `401` — `User Not Authorized`
- `1251` / `404` — `Template not found`
- `1254` / `400` — `'data.text' is required`
- `1201` / `404` — `Webhook not found`

## fireROUTE notes
- Treat the OTP delivery API as one route with provider-specific `channel` values, not four separate upstream paths.
- Preserve provider response metadata like `message_id` and `expire_date`; they are useful for follow-up verification and observability.
- Sender/template/webhook resources are operational config APIs and should likely stay in raw passthrough mode rather than being forced into a canonical auth schema.
