# Email Validation

Official docs manually reviewed:
- https://www.abstractapi.com/api/email-verification-validation-api
- https://docs.abstractapi.com/api/email-validation

## Overview
Abstract API's Email Validation product exposes a single REST validation endpoint, with optional CSV bulk upload described as a dashboard workflow rather than a second public HTTP route in the reviewed docs.

- Base URL: `https://emailvalidation.abstractapi.com`
- Canonical API version: `v1`
- Response format: JSON
- Auth: API key in query parameter `api_key`

## Authentication
The official docs state that requests require a product-specific `api_key` query parameter. Abstract also notes that API keys are unique per API product.

## Confirmed endpoints

| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/v1/` | Validate a single email address in real time | `api_key`, `email`, optional `auto_correct` |

Manual route count confirmed from the reviewed docs: **1**.

## Request details
Confirmed request pattern from the official docs:

```text
GET https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_UNIQUE_API_KEY&email=johnsmith@gmail.com
```

Confirmed query parameters:
- `api_key` — required API key
- `email` — required email address to validate
- `auto_correct` — optional boolean; docs say auto-correct is enabled by default and can be disabled by sending `false`

## Confirmed response fields
The official docs and response examples confirm these core fields:
- `email`
- `autocorrect`
- `deliverability` (`DELIVERABLE`, `UNDELIVERABLE`, `UNKNOWN`)
- `quality_score`
- `is_valid_format`
- `is_free_email`
- `is_disposable_email`
- `is_role_email`
- `is_catchall_email`
- `is_mx_found`
- `is_smtp_valid`

Important plan/behavior notes stated in the reviewed docs:
- `is_mx_found` is only available on paid plans and may return `null` / `UNKNOWN` on free plans.
- If SMTP validation fails but other checks are valid, Abstract recommends treating the email as `UNKNOWN` rather than automatically blocking the user.
- If a misspelling is detected, the other checks still run against the originally submitted email, not the autocorrected suggestion.

## Bulk workflow note
The reviewed docs mention a bulk CSV uploader that emails results when processing is complete and permits files up to `50,000` rows. However, the docs do **not** present that uploader as a separate public REST endpoint, so it is not counted as a confirmed HTTP route here.

## Rate limits
The reviewed official docs explicitly state:
- free plans are limited to **1 request per second**
- the product landing page advertises a free tier with **100 requests**
- higher paid tiers advertise **3 requests / second** on the reviewed pricing panel

## Pagination
No pagination is documented.

## Errors
The official docs list these response/error codes:
- `200` — success
- `400` — bad request
- `401` — unauthorized / missing or incorrect API key
- `422` — quota reached / insufficient API credits on free plans
- `429` — too many requests
- `500` — internal server error
- `503` — service unavailable

The reviewed docs say failures are returned in JSON format, but they do not publish a richer field-by-field error schema on the reviewed page.

## Important usage notes
- Each submitted email counts against usage credits even if the email is invalid.
- Credits are counted per request, not only per successful validation.
- The API is intentionally single-route and response-rich; most integration logic lives in interpreting flags such as `deliverability`, `is_role_email`, and `is_smtp_valid`.

## fireROUTE notes
- Normalize the top-level verdict into fireROUTE signals, but preserve all provider booleans and the raw `quality_score`.
- Treat the bulk CSV uploader as an out-of-band workflow, not as a REST adapter route, unless Abstract later publishes a dedicated HTTP endpoint for it.
