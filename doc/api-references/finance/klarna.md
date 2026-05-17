# Klarna

Official docs manually reviewed:
- https://docs.klarna.com/acquirer/klarna/api/payments/
- https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/api-urls/
- https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/authentication/
- https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/errors/
- https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/rate-limit/
- https://docs.klarna.com/acquirer/klarna/get-started/integration-resilience/request-limits/

## Overview
Klarna Payments is a checkout/session API used to create payment sessions, update them, authorize purchases, and turn authorizations into orders.

From the official docs reviewed in-browser:
- Live Europe base: `https://api.klarna.com/`
- Live North America base: `https://api-na.klarna.com/`
- Live Oceania base: `https://api-oc.klarna.com/`
- Playground Europe base: `https://api.playground.klarna.com/`
- Playground North America base: `https://api-na.playground.klarna.com/`
- Playground Oceania base: `https://api-oc.playground.klarna.com/`
- Protocol: HTTPS only
- HTTP versions supported: `HTTP/1.1` and `HTTP/2`

The reviewed Klarna Payments API page exposed **6 current operations** in the payments surface confirmed during this pass.

## Authentication
The reviewed authentication guide states that Klarna APIs use API credentials sent in the `Authorization` header.

Primary credential format:
- `klarna_<live|test>_<api>_<random>`

Confirmed auth header form:

```http
Authorization: Basic <API key>
```

The same page also documents a username/password compatibility mode:

```http
Authorization: Basic <UUID>:<API key>
```

Additional reviewed auth notes:
- credentials are associated with a Merchant ID (MID)
- API credentials are separate from the MID itself
- `401 Unauthorized` is returned when credentials are missing or incorrect
- inactive credentials are disabled after two months and deleted after ten months of inactivity
- Klarna requires TLS 1.2 and SNI support

## Confirmed endpoints
The following routes were manually confirmed from the official Klarna Payments API page.

| Method | Path | Purpose |
|---|---|---|
| POST | `/payments/v1/sessions` | Create a payment session |
| POST | `/payments/v1/sessions/{session_id}` | Update an existing payment session |
| GET | `/payments/v1/sessions/{session_id}` | Read an existing payment session |
| DELETE | `/payments/v1/authorizations/{authorizationToken}` | Cancel or release an authorization before order creation |
| POST | `/payments/v1/authorizations/{authorizationToken}/order` | Create an order from an authorization |
| POST | `/payments/v1/authorizations/{authorizationToken}/customer-token` | Create a customer token from an authorization |

Manual route count confirmed from the reviewed API page: **6**.

## Confirmed parameter and request details

### `POST /payments/v1/sessions`
Confirmed from the reviewed API page.

Reviewed request-body fields include:
- `acquiring_channel` — enum: `ECOMMERCE`, `IN_STORE`, `TELESALES`
- `attachment`
- `billing_address`
- `custom_payment_method_ids[]`
- `customer`
- `design`
- `locale`
- `merchant_data` — max `6000` chars
- `merchant_reference1` — max `255` chars
- `merchant_reference2` — max `255` chars
- `merchant_urls`
- `options`
- `order_amount` required — minor units integer
- `order_lines[]` required — `1..1000` items
- `order_tax_amount`
- `purchase_country` required — ISO 3166 alpha-2
- `purchase_currency` required — ISO 4217
- `shipping_address`
- `intent` — reviewed values: `buy`, `tokenize`, `buy_and_tokenize`
- `step_up_id`

Confirmed successful response fields:
- `client_token`
- `payment_method_categories`
- `session_id`

Confirmed statuses shown for create-session:
- `200`
- `400`
- `403`

### `POST /payments/v1/sessions/{session_id}`
The reviewed page confirms:
- path parameter `session_id` required
- used when order data or customer details change and checkout must be reloaded

The reviewed docs reuse the same general session payload shape as create-session.

### `GET /payments/v1/sessions/{session_id}`
Confirmed from the reviewed API page as the read-session operation.

### Authorization/order routes
The reviewed API page confirms these authorization follow-up flows:
- release/cancel an authorization on `/payments/v1/authorizations/{authorizationToken}`
- create order on `/payments/v1/authorizations/{authorizationToken}/order`
- create customer token on `/payments/v1/authorizations/{authorizationToken}/customer-token`

The reviewed excerpts also show `404` for missing authorizations/sessions and `409` when request data does not match the session for the authorization.

## Rate limits
The reviewed rate-limit guide explicitly documents per-merchant, per-operation quotas.

### Production
- Create session: **40/sec**
- Create token session: **40/sec**
- Create hosted page session: **40/sec**
- Other operations: **200/sec**

### Playground
- Create session: **5/sec**
- Create token session: **5/sec**
- Create hosted page session: **5/sec**
- Other operations: **50/sec**

Additional confirmed notes:
- limits are measured per `merchant_id`, not per API credential
- rate limiting is per operation category
- rate-limited requests return `429`
- reviewed response headers: `X-Ratelimit-Limit`, `X-Ratelimit-Reset`, `X-Ratelimit-Remaining`

## Request limits
The reviewed request-limits guide confirms:
- max size for any individual header key+value: **6 KB**
- max total header space: **20 KB**
- max request body size: **1 MB**
- oversized request bodies return `413 Payload Too Large`

The guide explicitly warns not to forward unnecessary observability/tracing headers to Klarna APIs.

## Pagination
No pagination model was surfaced in the reviewed Klarna Payments pages for this pass. The confirmed routes are session/authorization workflows rather than paginated list endpoints.

## Errors
The reviewed error guide confirms:
- failures return `4xx` or `5xx`
- the response body contains an error object with an `error_code`
- the response body also contains `error_messages` or `error_message`
- a unique correlation ID is returned for troubleshooting

Reviewed error-shape notes:
- `error_code` is machine-readable ALL_CAPS_SNAKE_CASE
- `error_message` is English human-readable debugging text and should not be parsed or shown directly to end users

## Response format
Confirmed from the reviewed docs:
- request bodies are JSON on the reviewed payments endpoints
- responses are JSON
- success/failure are conveyed with HTTP status codes plus structured error bodies

## Important usage notes
- Base URL selection is region-specific and environment-specific; do not hard-code the Europe host for all merchants.
- Klarna uses minor units for money values.
- The docs explicitly recommend not sending customer details up front when initiating a payment session unless necessary.
- Session creation returns both a server-side `session_id` and a browser-facing `client_token`; preserve both in integrations.
- Request/header limits are strict enough that verbose tracing headers can break integrations.

## fireROUTE notes
- Treat Klarna as a checkout/session provider, not a generic payments ledger API.
- Default normalized routes should favor `POST /payments/v1/sessions`, `POST /payments/v1/sessions/{session_id}`, `GET /payments/v1/sessions/{session_id}`, and `POST /payments/v1/authorizations/{authorizationToken}/order`.
- Preserve regional base-host routing and Basic-auth credentials as first-class provider config.
- Keep session-vs-authorization-vs-order transitions explicit in fireROUTE adapters because Klarna's workflow is stateful.
