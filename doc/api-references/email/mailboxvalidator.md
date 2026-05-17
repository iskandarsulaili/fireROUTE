# MailboxValidator

Official docs manually reviewed:
- https://www.mailboxvalidator.com/api-email-free
- https://www.mailboxvalidator.com/api-single-validation
- https://www.mailboxvalidator.com/api-email-disposable

## Overview
MailboxValidator publishes three HTTP GET endpoints on its public API pages: a single-email validation endpoint plus free-email and disposable-email classification helpers.

- Base URL: `https://api.mailboxvalidator.com`
- Response formats: JSON or XML
- Auth: API key passed as query parameter `key`

## Authentication
All reviewed API pages state that `key` is a required request parameter. The docs point users to the MailboxValidator dashboard/API plans for obtaining credentials.

## Confirmed endpoints

| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/v2/validation/single` | Full validation of a single email address | `key`, `email`, optional `format` |
| GET | `/v2/email/free` | Check whether an email belongs to a free email provider | `key`, `email`, optional `format` |
| GET | `/v2/email/disposable` | Check whether an email belongs to a disposable email provider | `key`, `email`, optional `format` |

Manual route count confirmed from the reviewed docs: **3**.

## Endpoint details

### 1) Single email validation
Confirmed request pattern from the reviewed code samples:

```text
GET https://api.mailboxvalidator.com/v2/validation/single?key=YOUR_KEY&email=you@example.com&format=json
```

Confirmed request parameters:
- `key` — required API key
- `email` — required email address
- `format` — optional output format; valid values are `json` and `xml`

Confirmed response fields listed on the reviewed page include:
- `email_address`
- `base_email_address`
- `domain`
- `is_free`
- `is_syntax`
- `is_domain`
- `is_smtp`
- `is_verified`
- `is_server_down`
- `is_greylisted`
- `is_disposable`
- `is_suppressed`
- `is_role`
- `is_high_risk`
- `is_catchall`
- `is_dmarc_enforced`
- `is_strict_spf`
- `website_exist`
- `mailboxvalidator_score`
- `time_taken`
- `status`
- `credits_available`

The reviewed page also explicitly notes: "We do not support Yahoo email validations at this moment."

### 2) Free email classification
Confirmed request pattern:

```text
GET https://api.mailboxvalidator.com/v2/email/free?key=YOUR_KEY&email=you@example.com&format=json
```

Confirmed response fields:
- `email_address`
- `is_free`
- `credits_available`

### 3) Disposable email classification
Confirmed request pattern:

```text
GET https://api.mailboxvalidator.com/v2/email/disposable?key=YOUR_KEY&email=you@example.com&format=json
```

Confirmed response fields:
- `email_address`
- `is_disposable`
- `credits_available`

## Errors
Across the reviewed pages, MailboxValidator publishes a shared error model:
- `error.error_code`
- `error.error_message`

Confirmed provider error codes:
- `10000` — missing parameter
- `10001` — API key not found
- `10002` — API key disabled
- `10003` — API key expired
- `10004` — insufficient credits
- `10005` — unknown error
- `10006` — invalid email syntax

Confirmed HTTP mappings on the reviewed pages:
- `10000` -> `400`
- `10001` -> `401`
- `10002` -> `401`
- `10003` -> `401`
- `10004` -> `401`
- `10005` -> `500`
- `10006` -> `400`

## Rate limits
No universal numeric rate-limit value is published on the reviewed endpoint pages. The docs point users to plan pages/dashboard credits rather than a single request-per-second figure.

## Pagination
No pagination is documented.

## Important usage notes
- All three reviewed endpoints are `GET` endpoints.
- `format=json` is the default; `xml` is the documented alternative.
- `credits_available` is returned directly in successful responses, which is useful for quota-aware adapters.
- The single-validation route is the richest route; the other two are lighter classification helpers.

## fireROUTE notes
- Prefer `/v2/validation/single` when building a full validation adapter, and reserve `/v2/email/free` and `/v2/email/disposable` for cheaper or narrower classification workflows.
- Preserve MailboxValidator's granular flags rather than collapsing them into one boolean; they contain provider-specific deliverability intelligence.
