# Billplz

Official docs manually reviewed:
- https://www.billplz.com/api

## Overview
Billplz provides a REST API for collections, bills, payment methods, cards, payment gateways, payment-order flows, and callback security.

Confirmed from the reviewed official docs:
- Production base URL: `https://www.billplz.com/api/`
- Sandbox base URL: `https://www.billplz-sandbox.com/api/`
- All API requests must use HTTPS
- Responses are JSON, including errors
- Requests may use either `application/x-www-form-urlencoded` or `application/json`
- Authentication is HTTP Basic auth using the API Secret Key as the username and no password

## Authentication
The official docs show two equivalent Basic-auth forms:
- pass the API Secret Key as the Basic-auth username with an empty password
- send a base64-encoded `Authorization: Basic ...` header

Confirmed example from the docs:

```bash
curl https://www.billplz.com/api/v4/webhook_rank \
  -u YOUR_API_SECRET_KEY:
```

The reviewed authentication section explicitly states:
- API Secret Keys are obtained from the Billplz account settings page
- authentication occurs via HTTP Basic Auth
- the API key is provided as the Basic-auth username
- no password is required

## Confirmed endpoints
The reviewed official docs expose these current Billplz-owned API routes.

### v3 routes
| Method | Path |
|---|---|
| POST | `/api/v3/collections` |
| GET | `/api/v3/collections/{collection_id}` |
| GET | `/api/v3/collections` |
| POST | `/api/v3/open_collections` |
| GET | `/api/v3/open_collections/{collection_id}` |
| GET | `/api/v3/open_collections` |
| POST | `/api/v3/bills` |
| GET | `/api/v3/bills/{bill_id}` |
| DELETE | `/api/v3/bills/{bill_id}` |
| GET | `/api/v3/bills/{bill_id}/transactions` |
| GET | `/api/v3/collections/{collection_id}/payment_methods` |
| PUT | `/api/v3/collections/{collection_id}/payment_methods` |
| GET | `/api/v3/fpx_banks` |

### v4 routes
| Method | Path |
|---|---|
| POST | `/api/v4/collections` |
| GET | `/api/v4/collections/{collection_id}` |
| GET | `/api/v4/collections` |
| POST | `/api/v4/open_collections` |
| GET | `/api/v4/open_collections/{collection_id}` |
| GET | `/api/v4/open_collections` |
| GET | `/api/v4/collections/{collection_id}/customer_receipt_delivery` |
| POST | `/api/v4/collections/{collection_id}/customer_receipt_delivery/activate` |
| POST | `/api/v4/collections/{collection_id}/customer_receipt_delivery/deactivate` |
| POST | `/api/v4/collections/{collection_id}/customer_receipt_delivery/global` |
| GET | `/api/v4/webhook_rank` |
| GET | `/api/v4/payment_gateways` |
| POST | `/api/v4/cards` |
| DELETE | `/api/v4/cards/{card_id}` |
| POST | `/api/v4/bills/{bill_id}/charge` |
| POST | `/api/v4/bills/{bill_id}/preauth` |
| POST | `/api/v4/bills/{bill_id}/preauth_capture` |

### v5 routes
| Method | Path |
|---|---|
| POST | `/api/v5/payment_order_collections` |
| GET | `/api/v5/payment_order_collections/{payment_order_collection_id}` |
| GET | `/api/v5/payment_order_limit` |
| POST | `/api/v5/payment_orders` |
| GET | `/api/v5/payment_orders/{payment_order_id}` |

Manual route count confirmed from the official docs: **35**.

## Important parameters and request notes
Confirmed from the reviewed docs/examples:
- Common path variables include `collection_id`, `bill_id`, `card_id`, `payment_order_collection_id`, and `payment_order_id`
- Billplz examples show frequent use of fields such as `collection_id`, `description`, `email`, `mobile`, `name`, `amount`, `callback_url`, `redirect_url`, `reference_id`, and payment-gateway-related fields
- V5 endpoints require additional request parameters `epoch` and `checksum`

## Security and signature notes
The reviewed official docs include two separate signing mechanisms.

### X Signature
Confirmed from the `X Signature` section:
- source strings are built from key/value pairs
- elements are sorted ascending, case-insensitive
- elements are joined with `|`
- `x_signature` itself must not be included in the source string
- the source string is signed with `HMAC_SHA256` using the account XSignature key

### V5 Checksum
Confirmed from the `V5 Checksum` section:
- all V5 requests must include `epoch` and `checksum`
- checksum generation uses `HMAC_SHA512`
- the digest uses the account XSignature key
- each endpoint defines a strict ordered list of values to concatenate into the raw string
- optional checksum arguments are denoted with an asterisk in the Billplz docs

## Rate limits
The reviewed official docs publish a GET-endpoint rate-limit policy.

Confirmed details:
- API GET endpoints are subject to rate limiting
- request window: `5 minutes`
- the limit may be `100` requests per window or `10` requests per window depending on perceived abuse level
- limits may be applied per IP or per account
- the limit is cumulative across GET endpoints, not per endpoint

Confirmed response headers:
- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset`

Confirmed exceeded-limit error payload:

```json
{
  "error": {
    "type": "RateLimit",
    "message": ["Too many requests"]
  }
}
```

The docs explicitly note that exceeding the limit results in `429 Too Many Requests`.

## Errors
The official docs publish this error-code table:
- `401` — Unauthorized
- `404` — Not Found
- `422` — Unprocessable Entity
- `429` — Too Many Requests
- `500` — Internal Server Error
- `503` — Service Unavailable

The rate-limit section also shows a structured JSON error payload under `error.type` / `error.message`.

## Pagination
The reviewed docs show page-based query usage on several list endpoints, including examples such as bills transactions and collection listings.

However, the docs do not publish one single universal pagination contract across every route. fireROUTE should therefore treat pagination as endpoint-specific Billplz query semantics.

## Response format
Confirmed from the reviewed docs:
- responses are JSON, including errors
- requests may be sent as `application/x-www-form-urlencoded` or `application/json`
- rate-limit metadata is exposed in response headers rather than only in the body

## Important usage notes
- `callback_url` integration is described as compulsory.
- `redirect_url` is recommended for faster status updates and better user experience, but the docs explicitly say callback and redirect execution order is **not fixed**.
- Billplz accepts only **Malaysian Ringgit (MYR)** and does not perform currency conversion.
- Production and sandbox accounts are separate, and the docs explicitly instruct users to use the matching endpoint/account pair.
- The docs include OAuth 2.0 discussion for partner/platform scenarios, but the core API authentication for the routes above is still Basic auth with API Secret Keys.

## fireROUTE notes
- Preserve Billplz’s versioned route groups (`v3`, `v4`, `v5`) because the docs actively expose all three.
- Treat Billplz as a payment/billing provider with important callback-signature behavior, not just a simple invoice CRUD API.
- For safe default integration, emphasize collections + bills + callback verification before exposing advanced card/preauth/payment-order flows.
