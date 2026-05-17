# Veriphone

Official docs manually reviewed:
- https://veriphone.io/docs
- https://veriphone.io/docs/v2
- https://veriphone.io/docs/bulk

## Overview
Veriphone is a phone-number validation and carrier-lookup API. The official docs expose a small public REST surface for single-number verification plus account-credit and bulk CSV verification workflows.

- Base URL: `https://api.veriphone.io`
- Transport: HTTPS + JSON
- CORS: enabled on all endpoints
- Auth: API key, preferably via an HTTP Bearer `Authorization` header
- Alternative auth inputs: `key` cookie or `key` query/body parameter
- Request styles: the docs say the public endpoints accept both `GET` and `POST`; the bulk workflow pages explicitly document `POST` for upload/verify/delete and `GET` for list/get/status/download
- Manual route count confirmed from the official docs: **10**

## Authentication
The docs explicitly say requests are authenticated in this order:
1. Bearer `Authorization` header (recommended)
2. `key=YOUR_API_KEY` cookie
3. `key` query parameter or body field

Important auth note from the docs:
- each successful `verify` call deducts **1 credit**
- keep the API key server-side; the docs warn against exposing it in public client code

## Confirmed endpoints
| Method | Path | Purpose | Key parameters / body |
|---|---|---|---|
| GET or POST | `/v2/verify` | Validate one phone number and return carrier/format/type data | `phone` required; optional `default_country` |
| GET or POST | `/v2/credits` | Return current credit and usage information | auth only |
| GET or POST | `/v2/plan/getPayments` | Return payment history and active subscription details | auth only |
| POST | `/v2/file/upload` | Upload a CSV for bulk verification | multipart form `file`, `column`, `firstrow` |
| POST | `/v2/file/verify` | Start background verification for an uploaded file | `id` required; optional `default_country` |
| GET | `/v2/file/list` | List non-deleted uploads for the account | auth only |
| GET | `/v2/file/get` | Get one upload's details | `id` required |
| GET | `/v2/file/status` | Poll verification status | `id` required |
| GET | `/v2/file/download` | Download results CSV or original upload | `id` required; optional `as` |
| POST | `/v2/file/delete` | Permanently delete an uploaded file and its results | `id` required |

## Endpoint details
### `GET|POST /v2/verify`
Docs-confirmed behavior:
- validates phone numbers for 240+ countries
- returns validity, line type, carrier, E.164, local/international formatting, country and region metadata
- if the input does not start with `+`, the API checks against `default_country`
- if `default_country` is omitted, the docs say the server infers a country from caller IP

Confirmed query/body parameters:
- `phone` — required number to validate
- `default_country` — optional ISO 3166-1 alpha-2 country code such as `US` or `GB`

Confirmed response fields include:
- `status`
- `phone`
- `phone_valid`
- `phone_type`
- `phone_region`
- `country`
- `country_code`
- `country_prefix`
- `international_number`
- `local_number`
- `e164`
- `carrier`

Important usage note from the page:
- if the input has fewer than 4 digits or more than 20 digits, the API returns `status: "syntax-error"` and does **not** deduct a credit

### `GET|POST /v2/credits`
No extra parameters beyond authentication.

Confirmed response fields:
- `email`
- `counter` — used verifications in the current billing period
- `active`
- `payg`
- `limit`
- `plan`
- `renew`
- `last_reset`

### `GET|POST /v2/plan/getPayments`
No extra parameters beyond authentication.

Confirmed response shape:
- top-level `status`
- `payments[]` with fields such as `product_name`, `plan_name`, `currency`, `amount`, `receipt_url`, `event_time`
- `subscription` object with fields such as `update_url`, `status`, `next_bill_date`, `currency`, `new_price`

The docs note that `subscription` may be an empty object `{}` when there is no active subscription.

### Bulk workflow
The official bulk page documents this sequence:
1. `POST /v2/file/upload`
2. `POST /v2/file/verify`
3. poll `GET /v2/file/status`
4. `GET /v2/file/download`

#### `POST /v2/file/upload`
Confirmed request format:
- `Content-Type: multipart/form-data`

Confirmed form fields:
- `file` — required CSV file
- `column` — required zero-based index of the phone-number column
- `firstrow` — required zero-based first data row, used to skip headers

Docs-published upload limits:
- maximum file size about **100 MB**
- maximum **1,000,000 rows**

Confirmed response fields:
- `result`
- `id`
- `column`
- `firstrow`
- `lastrow`
- `record1`
- `record2`

#### `POST /v2/file/verify`
Confirmed parameters:
- `id` — required upload id from `/v2/file/upload`
- `default_country` — optional ISO country code for numbers missing a country prefix

Confirmed response example:
- `status`
- `id`

#### `GET /v2/file/list`
No extra parameters beyond authentication.

Confirmed list response fields include:
- `status`
- `uploads[]`
- per-upload fields such as `id`, `name`, `status`, `filesize`, `created`, `firstrow`, `lastrow`, `column`, `position`, `stage`, `speed`, `billable`, `syntaxerr`, `valid`, `invalid`, `record1`, `record2`

Docs-confirmed status vocabulary for uploads:
- `new`
- `ready`
- `verifying`
- `completed`
- `deleted`

#### `GET /v2/file/get`
Confirmed parameter:
- `id` — required upload id

The docs say the response returns the same fields as a single item in `/v2/file/list`.
They also note this route returns an empty object if the file does not exist or is not owned by your account.

#### `GET /v2/file/status`
Confirmed parameter:
- `id` — required upload id

Confirmed response example:
```json
{
  "id": "abc123def456",
  "status": "completed"
}
```

The docs note this route returns an empty status if the file does not exist or is not owned by your account.

#### `GET /v2/file/download`
Confirmed parameters:
- `id` — required upload id
- `as` — optional filename used in `Content-Disposition`

The docs say this route returns:
- verified results CSV when processing is complete
- otherwise the original uploaded file
- binary `application/octet-stream` content with an attachment disposition

#### `POST /v2/file/delete`
Confirmed parameter:
- `id` — required upload id

Confirmed success response:
```json
{
  "status": "success"
}
```

## Response format
Single-number verification uses JSON objects. The success example returns:

```json
{
  "status": "success",
  "phone": "+4915123577723",
  "phone_valid": true,
  "phone_type": "mobile",
  "country_code": "DE",
  "e164": "+4915123577723",
  "carrier": "T-Mobile"
}
```

Bulk list/status endpoints also return JSON objects. Bulk download returns a binary file rather than JSON.

## Errors and rate limits
The introductory docs explicitly publish this generic error envelope:

```json
{
  "status": "error",
  "code": 400,
  "type": "BadRequest",
  "message": "Human-readable error description"
}
```

Common documented status codes:
- `400` — bad request / missing parameter
- `401` — missing or invalid API key
- `402` — insufficient credits
- `403` — forbidden / inactive account / unauthorized file access
- `404` — resource or file not found
- `429` — rate limit exceeded
- `500` — internal server error

The reviewed docs mention `429 TooManyRequests`, but they do **not** publish a numeric per-minute or per-hour quota.

Bulk-specific documented errors:
- upload: unsupported file type, file too large, too many entries, missing `column`/`firstrow`
- verify: insufficient credits, file not ready, unauthorized file access, file not found
- download: file not found
- delete: forbidden or not found

## Important usage notes
- Veriphone’s single lookup is a credit-metered API; the docs explicitly tie one successful verification to one credit.
- `default_country` is important for national-format numbers that do not start with `+`.
- `syntax-error` inputs are treated specially and are not billed.
- Bulk uploads are CSV-only.
- Use the upload id from `/v2/file/upload` for every later bulk route.

## fireROUTE notes
- Veriphone is a good fit for a normalized phone-validation adapter with one primary route: `/v2/verify`.
- Preserve raw provider fields like `phone_type`, `carrier`, `country_prefix`, and `e164`; they are operationally useful.
- Keep the bulk-file workflow available as passthrough functionality instead of over-normalizing it.