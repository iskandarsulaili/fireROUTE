# Mercado Pago

Official docs manually reviewed:
- https://www.mercadopago.com.br/developers/en/reference
- https://www.mercadopago.com.br/developers/en/reference/authentication/oauth/_oauth_token/post
- https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/create-order/post
- https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/get-order/get
- https://www.mercadopago.com.br/developers/en/reference/online-payments/checkout-api/search-order/get
- https://www.mercadopago.com.br/developers/en/reference/online-payments/subscriptions/create-preapproval/post
- https://www.mercadopago.com.br/developers/en/reference/claims/search-claims/get
- https://www.mercadopago.com.br/developers/en/reference/releases-report/create-report/post

## Overview
Mercado Pago’s current API reference is a large authenticated commerce/payments surface on `api.mercadopago.com`. The live reference navigation currently exposes **165 unique API reference pages** beyond the introduction page, covering OAuth, online payments, in-person payments, subscriptions, post-sale claims, and reporting.

Confirmed platform-level facts from the reviewed pages:
- Base URL: `https://api.mercadopago.com`
- Transport: HTTPS + JSON
- Primary auth model: OAuth access token / private app bearer token in `Authorization: Bearer <access_token>`
- Typical POST/PUT calls use JSON request bodies
- Some write operations additionally require an idempotency header such as `X-Idempotency-Key`

## Authentication
The reviewed OAuth page documents the token endpoint:

| Method | Path | Purpose |
|---|---|---|
| POST | `/oauth/token` | Create or refresh OAuth access tokens |

Confirmed request fields from the official OAuth page/code sample:
- `client_id`
- `client_secret`
- `grant_type`
- `code`
- `code_verifier`
- `redirect_uri`
- `refresh_token`
- `test_token`

Confirmed token response fields from the same page:
- `access_token`
- `token_type` (`bearer`)
- `expires_in`
- `scope`
- `user_id`
- `refresh_token`
- `public_key`
- `live_mode`

The reviewed example response currently shows `expires_in: 15552000` and `scope: "read write offline_access"`.

## Confirmed endpoint families
The reference navigation currently exposes these major families.

### Authentication
- `POST /oauth/token`

### Online payments — Checkout Pro
Representative routes confirmed from the live navigation:
- `POST /checkout/preferences`
- `GET /checkout/preferences/search`
- `GET /checkout/preferences/{id}`
- `PUT /checkout/preferences/{id}`
- `GET /v1/payments/search`
- `GET /v1/payments/{id}`
- merchant order search/get/update routes
- payment-method lookup
- cancellation/refund/chargeback routes

### Online payments — Orders API / Checkout API
Routes confirmed directly from reviewed operation pages and nav:
- `POST /v1/orders`
- `GET /v1/orders`
- `GET /v1/orders/{id}`
- `POST /v1/orders/{id}/capture`
- `POST /v1/orders/{id}/process`
- `POST /v1/orders/{id}/cancel`
- `POST /v1/orders/{id}/refund`
- add/update/delete transaction routes under the orders surface
- payment methods, document types, cards, customers, addresses, and chargebacks routes in the same Checkout API group

### Online payments — Payments API (legacy)
The reference still exposes the legacy payments family, including:
- `POST /v1/payments`
- `GET /v1/payments/search`
- `GET /v1/payments/{id}`
- `PUT /v1/payments/{id}`
- related customers/cards/addresses/payment-method/refund/chargeback routes

### Subscriptions
Reviewed navigation and sampled subscription page confirm subscription families on the classic preapproval surface:
- `POST /preapproval`
- search/get/update/export subscription routes
- `POST /preapproval_plan`
- search/get/update subscription-plan routes
- invoice lookup/search routes
- payment search/get routes for subscriptions

### In-person payments
The navigation currently exposes separate `Point`, `QR Code`, and deprecated in-store/integration families, including:
- store CRUD routes
- point-of-sale CRUD routes
- terminals/device routes
- in-person order create/get/cancel/refund/simulate routes
- payment-intent routes
- integrator configuration routes
- refund and chargeback routes

### Post-sale claims
A reviewed claims page confirms the current post-sale base family:
- `GET /post-purchase/v1/claims/search`
- claim details/history/evidence/notifications routes
- file and message routes
- mediation and shipping-evidence routes

### Reports
A reviewed releases-report page confirms report-generation families including:
- `POST /v1/account/release_report`
- configuration/task/list/search/download routes for releases reports
- parallel settlement/account-money report routes in the navigation

## Reviewed endpoint details
### `POST /oauth/token`
Confirmed from the OAuth page:
- accepts JSON body parameters for token creation or refresh
- response is JSON
- bearer `access_token` is returned alongside `refresh_token`, `scope`, and `public_key`
- this is the canonical token bootstrap/refresh route for the reviewed docs set

### `POST /v1/orders`
Confirmed from the reviewed create-order page and official code block:
- full URL used in the doc example: `https://api.mercadopago.com/v1/orders`
- auth: `Authorization: Bearer ...`
- the official example additionally includes `X-Idempotency-Key`
- JSON body fields shown on the reviewed page include:
  - `type`
  - `external_reference`
  - `transactions.payments[]`
  - `payer`
  - `shipment`
  - `total_amount`
  - `capture_mode`
  - `processing_mode`
  - `description`
  - `integration_data`
  - `items[]`

Important write-operation note from the reviewed example:
- fireROUTE should preserve Mercado Pago’s idempotency model on order creation instead of stripping the `X-Idempotency-Key` header.

### `GET /v1/orders/{id}`
Confirmed from the reviewed get-order page:
- full URL shown by the official code sample: `https://api.mercadopago.com/v1/orders/{id}`
- path parameter: `id`
- response object contains high-level order state plus nested payment and chargeback information

Representative response fields visibly documented on the page:
- `id`
- `processing_mode`
- `external_reference`
- `total_amount`
- `total_paid_amount`
- `user_id`
- `status`
- `status_detail`
- `capture_mode`
- `transactions.payments[]`
- `transactions.chargebacks[]`
- `items[]`
- `expiration_time`
- `client_token`
- `config`

### `GET /v1/orders`
Confirmed from the reviewed search-order page:
- full URL pattern shown in official example: `https://api.mercadopago.com/v1/orders?...`
- documented query parameters visible in the example:
  - `begin_date`
  - `end_date`
  - `external_reference`
  - `type`
  - `status`
  - `status_detail`
  - `payment_method_id`
  - `payment_method_type`
  - `page`
  - `page_size`
  - `sort_by`
  - `sort_order`

The response page explicitly shows pagination metadata:
- `paging.total`
- `paging.total_pages`
- `paging.offset`
- `paging.limit`

### `POST /preapproval`
Confirmed from the reviewed subscription page:
- full URL shown by the official code sample: `https://api.mercadopago.com/preapproval`
- used to create subscriptions / recurring charges
- documented request fields on the reviewed page include:
  - `preapproval_plan_id`
  - `reason`
  - `external_reference`
  - `payer_email`
  - `card_token_id`
  - `auto_recurring.frequency`
  - `auto_recurring.frequency_type`
  - `auto_recurring.start_date`
  - `auto_recurring.end_date`
  - `auto_recurring.transaction_amount`
  - `auto_recurring.currency_id`
  - `back_url`
  - `status`

### `GET /post-purchase/v1/claims/search`
Confirmed from the reviewed claims page:
- full URL shown by the official code sample: `https://api.mercadopago.com/post-purchase/v1/claims/search?...`
- documented query parameters visible in the sample:
  - `id`
  - `type`
  - `stage`
  - `status`
  - `resource`
  - `resource_id`
  - `date_created`
  - `limit`

The same page also shows a paged JSON response with:
- `paging.offset`
- `paging.limit`
- `paging.total`
- `data[]`

### `POST /v1/account/release_report`
Confirmed from the reviewed releases-report page:
- full URL shown by the official code sample: `https://api.mercadopago.com/v1/account/release_report`
- documented request fields shown on page: `begin_date`, `end_date`
- documented response fields include report/job metadata such as `id`, `account_id`, `generation_date`, `status`, `sub_type`, `report_id`, and `format`

## Pagination
Pagination is not universal across every Mercado Pago endpoint, but the reviewed list/search endpoints clearly use structured paging objects.

Confirmed examples:
- `GET /v1/orders` returns `paging.total`, `paging.total_pages`, `paging.offset`, `paging.limit`
- `GET /post-purchase/v1/claims/search` returns `paging.offset`, `paging.limit`, `paging.total`

The docs navigation also makes it clear that Mercado Pago distinguishes between direct resource GETs and search/list endpoints, so fireROUTE should preserve provider-native paging/query controls rather than imposing one global pattern.

## Response format and errors
Confirmed from the reviewed pages:
- request payloads are JSON
- successful examples are JSON objects
- list/search routes often return `data` plus `paging`
- token/auth flows return token metadata in JSON
- order resources embed nested `transactions`, `payments`, and sometimes `chargebacks`

The reviewed pages did not expose one single global numeric rate-limit table. I did **not** find a published platform-wide RPS quota on the reviewed reference pages, so this doc should not claim one.

## Important usage notes
- Mercado Pago’s current docs mix modern Orders API routes with a still-documented legacy Payments API; both are live in the reference and should be treated as separate surfaces.
- Write operations may depend on idempotency headers such as `X-Idempotency-Key`; preserve those in passthrough mode.
- OAuth/private-app token handling is central to the whole platform; most reviewed examples use bearer auth.
- Search/list routes use provider-specific query parameters and paging blocks instead of a uniform RFC-style pagination contract.
- The surface area is broad; this manual pass confirmed the live navigation and sampled representative endpoint pages across auth, orders, subscriptions, claims, and reports.

## fireROUTE notes
- Keep Mercado Pago as a passthrough-capable provider; the platform combines payments, subscriptions, in-person commerce, claims, and reporting under one auth domain.
- A minimal normalized surface could focus on token creation, order creation/read/search, refunds, subscriptions, and claim lookup.
- Preserve Mercado Pago-specific nested structures (`transactions.payments`, payer/shipment objects, recurring billing objects, claims paging) rather than flattening them too aggressively.
