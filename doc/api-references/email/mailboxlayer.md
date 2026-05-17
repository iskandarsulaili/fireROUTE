# mailboxlayer

Official docs manually reviewed:
- https://mailboxlayer.com/
- https://docs.apilayer.com/mailboxlayer/docs/api-documentation
- https://docs.apilayer.com/mailboxlayer/docs/mailboxlayer-api-v-1-0-0#/default/checkEmail
- https://docs.apilayer.com/mailboxlayer/docs/mailboxlayer-api-v-1-0-0#/default/bulkCheckEmails

## Overview
Mailboxlayer is APILayer’s email validation API. The reviewed docs confirm a compact HTTP GET surface: one endpoint for validating a single address and one endpoint for validating multiple addresses in a single request.

- Base URL: `https://apilayer.net/api`
- Transport: HTTPS + JSON
- Auth: API key passed as `access_key` query parameter
- JSONP support: yes, via optional `callback`
- Manual route count confirmed from the official docs: **2**

## Authentication
The endpoint docs define one auth scheme:
- `access_key` query parameter on every request

Example shown in the docs:
```text
?access_key=YOUR_ACCESS_KEY
```

The reviewed docs did not show an Authorization header-based scheme for mailboxlayer; the published scheme is query-parameter API key auth.

## Confirmed endpoints
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/check` | Validate one email address | `access_key`, `email`, optional `callback`, `catch_all`, `format`, `smtp` |
| GET | `/bulk_check` | Validate multiple email addresses in one request | `access_key`, `emails`, optional `callback`, `catch_all`, `format`, `smtp` |

## Endpoint details
### `GET /check`
The docs describe `/check` as the single-address validation endpoint.

Confirmed required query parameters:
- `access_key` — API key
- `email` — one email address to validate

Confirmed optional query parameters:
- `callback` — JSONP callback name
- `catch_all` — `0` or `1`; enables catch-all mailbox detection
- `format` — `0` or `1`; pretty-prints the JSON response when enabled
- `smtp` — `0` or `1`; enables or disables SMTP mailbox verification

Important option behavior explicitly documented:
- `catch_all` is disabled by default because it is a heavier check and may increase response time
- if catch-all detection was not requested, or is not available on the current plan, the `catch_all` response field may be `null`
- `smtp` checks are enabled by default; setting `smtp=0` can speed up responses but disables the `smtp_check` verdict
- `format=1` increases payload size and is mainly useful for debugging

Confirmed response fields:
- `email`
- `did_you_mean`
- `user`
- `domain`
- `format_valid`
- `mx_found`
- `smtp_check`
- `catch_all`
- `role`
- `disposable`
- `free`
- `score`

Representative success example from the docs:
```json
{
  "email": "support@mailboxlayer.com",
  "did_you_mean": "",
  "user": "support",
  "domain": "mailboxlayer.com",
  "format_valid": true,
  "mx_found": true,
  "smtp_check": true,
  "catch_all": false,
  "role": false,
  "disposable": false,
  "free": false,
  "score": 0.92
}
```

### `GET /bulk_check`
The docs describe `/bulk_check` as a bulk validation route that accepts a comma-separated email list.

Confirmed required query parameters:
- `access_key` — API key
- `emails` — comma-separated list of email addresses

Confirmed optional query parameters:
- `callback`
- `catch_all`
- `format`
- `smtp`

Plan-specific limit note stated in the docs:
- Pro+ plans: up to **25** emails per bulk request
- Enterprise+ plans: up to **100** emails per bulk request

The docs say the response is an **array of validation results**, one object per requested email, using the same field set as the single-address response.

## Response format
The reviewed docs show JSON as the primary response format.

For `/check`, the result is a single validation object.
For `/bulk_check`, the result is an array of validation objects.
If `callback` is provided, the docs say the API returns a JSONP wrapper.

Field semantics explicitly documented:
- `format_valid` — RFC-style syntax validity
- `mx_found` — whether the domain has MX records
- `smtp_check` — whether SMTP verification indicates the mailbox exists
- `role` — whether the address is a role account such as `admin` or `support`
- `disposable` — whether the address belongs to a temporary/disposable provider
- `free` — whether the address belongs to a free provider such as Gmail
- `score` — aggregate deliverability/quality score from `0` to `1`

## Errors and limits
The endpoint tabs in the reviewed docs expose these response status codes.

For `GET /check`:
- `200`
- `400`
- `401`
- `403`
- `404`
- `429`
- `500`

For `GET /bulk_check`:
- `200`
- `400`
- `401`
- `403`
- `422`
- `429`
- `500`

The docs navigation also exposes an `ApiError` schema, but the reviewed endpoint pages did not publish a more detailed global error-body narrative than the status-code tabs.

The reviewed docs did **not** publish a numeric request-per-second or request-per-hour rate limit.

## Important usage notes
- `catch_all` is a heavier optional check and may increase response latency.
- `smtp_check` can be intentionally skipped with `smtp=0`.
- `catch_all` and some heavier checks may be plan-dependent.
- `did_you_mean` is useful for typo correction workflows.
- Bulk validation is plan-gated and uses a comma-separated string rather than a JSON request body.

## fireROUTE notes
- mailboxlayer fits a normalized email-validation provider abstraction very well.
- Keep raw response fields like `mx_found`, `smtp_check`, `catch_all`, `role`, `disposable`, and `score` intact.
- Preserve JSONP passthrough only if a downstream consumer explicitly needs it; default normalized integrations should stay JSON-only.