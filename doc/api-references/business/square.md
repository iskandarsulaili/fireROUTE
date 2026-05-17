# Square

Official docs manually reviewed:
- https://developer.squareup.com/reference/square
- https://developer.squareup.com/docs/build-basics/access-tokens
- https://developer.squareup.com/docs/build-basics/versioning-overview
- https://developer.squareup.com/reference/square/payments-api
- https://developer.squareup.com/reference/square/orders-api
- https://developer.squareup.com/reference/square/customers-api
- https://developer.squareup.com/reference/square/o-auth-api

## Overview
Square’s public API is a large versioned REST platform. The reviewed official docs show resource paths under the `/v2` namespace, with production examples on:

- `https://connect.squareup.com/v2`

Confirmed from the reviewed official docs:
- Production request example host: `https://connect.squareup.com/v2`
- Auth: personal access tokens and OAuth access tokens
- Versioning: application default API version can be overridden with the `Square-Version` header
- Response format: JSON
- The current reference landing page visibly exposes **41** named API groups across Dev Essentials, Payments, Commerce, Customers, Staff, and Merchants
- The current reviewed examples use API version label **`2026-01-22`**

## Confirmed API groups
The reviewed Square API reference landing page currently exposes these groups:
- `OAuth`
- `Webhook subscriptions`
- `Events`
- `Payments`
- `Refunds`
- `Checkout`
- `Terminal`
- `Disputes`
- `Invoices`
- `Cards`
- `Subscriptions`
- `Bank accounts`
- `Payouts`
- `Devices`
- `Apple pay`
- `Orders`
- `Order custom attributes`
- `Catalog`
- `Inventory`
- `Transfer order`
- `Bookings`
- `Booking custom attributes`
- `Vendors`
- `Channels`
- `Sites`
- `Snippets`
- `Cash drawers`
- `Customers`
- `Customer custom attributes`
- `Customer groups`
- `Customer segments`
- `Loyalty`
- `Gift cards`
- `Gift card activities`
- `Labor`
- `Team`
- `Merchants`
- `Merchant custom attributes`
- `Locations`
- `Location custom attributes`
- `Object Index`

## Concrete endpoints confirmed from the reviewed reference pages
| Method | Path | Notes |
|---|---|---|
| GET | `/oauth2/authorize` | start seller authorization flow |
| POST | `/oauth2/revoke` | revoke OAuth token |
| POST | `/oauth2/token` | exchange auth code or refresh token |
| POST | `/oauth2/token/status` | inspect token status |
| GET | `/v2/payments` | list payments |
| POST | `/v2/payments` | create payment |
| POST | `/v2/payments/cancel` | cancel payment by idempotency key |
| GET | `/v2/payments/{payment_id}` | retrieve payment |
| PUT | `/v2/payments/{payment_id}` | update approved payment |
| POST | `/v2/payments/{payment_id}/cancel` | cancel payment |
| POST | `/v2/payments/{payment_id}/complete` | capture/complete payment |
| POST | `/v2/orders` | create order |
| POST | `/v2/orders/batch-retrieve` | retrieve multiple orders |
| POST | `/v2/orders/calculate` | price-preview order |
| POST | `/v2/orders/clone` | clone order |
| POST | `/v2/orders/search` | search orders |
| GET | `/v2/orders/{order_id}` | retrieve order |
| PUT | `/v2/orders/{order_id}` | update order |
| POST | `/v2/orders/{order_id}/pay` | pay/settle order |
| GET | `/v2/customers` | list customers |
| POST | `/v2/customers` | create customer |
| POST | `/v2/customers/bulk-create` | bulk create customers |
| POST | `/v2/customers/bulk-delete` | bulk delete customers |
| POST | `/v2/customers/bulk-retrieve` | bulk retrieve customers |
| POST | `/v2/customers/bulk-update` | bulk update customers |
| POST | `/v2/customers/search` | search customers |
| DELETE | `/v2/customers/{customer_id}` | delete customer |
| GET | `/v2/customers/{customer_id}` | retrieve customer |
| PUT | `/v2/customers/{customer_id}` | update customer |
| DELETE | `/v2/customers/{customer_id}/groups/{group_id}` | remove customer from group |
| PUT | `/v2/customers/{customer_id}/groups/{group_id}` | add customer to group |

Manual route count confirmed from the reviewed official docs for this pass: **41** named API groups on the main reference page, with concrete method/path pairs manually verified from OAuth, Payments, Orders, and Customers reference pages.

## Authentication
### Personal access tokens
The reviewed access-tokens guide documents **personal access tokens** as unrestricted credentials for the resources in your own Square account.

### OAuth access tokens
The same guide documents **OAuth access tokens** as scoped credentials for multi-tenant apps acting on behalf of Square sellers.

Example bearer pattern used by the reviewed docs:

```http
Authorization: Bearer {ACCESS_TOKEN}
```

Important notes confirmed from the reviewed access-token page:
- multi-tenant production apps should use OAuth access tokens
- custom integrations that only access your own Square account can use personal access tokens
- Webhook Subscriptions API and Events API require the application’s **personal access token** because they manage application-level events
- each application has separate production and Sandbox credentials in the Developer Console

## Versioning
Confirmed from the reviewed versioning page:
- Square uses a date-based version scheme: `YYYY-MM-DD`
- the API version applies platform-wide across Square APIs
- every application has a default pinned API version in the Developer Console
- callers can override the default with the `Square-Version` header

Example reviewed request pattern:

```http
GET https://connect.squareup.com/v2/payments
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
Square-Version: 2026-01-22
```

## Request/response and parameter notes
Confirmed from the reviewed reference pages:
- OAuth is a standard redirect/code exchange flow using `/oauth2/authorize` then `/oauth2/token`
- Payments endpoints are centered on payment creation, retrieval, update, cancel, and completion
- Orders search is POST-based (`/v2/orders/search`) rather than GET query-search
- Customers supports bulk operations through explicit `/bulk-*` routes
- idempotency is part of the payment cancellation-by-key flow and is central to Square’s payment model

## Pagination and errors
The reviewed pages clearly document list and search operations for payments, customers, and orders, but the specific cursor/body/query details are operation-specific and live on each endpoint page.

Confirmed from the reviewed docs:
- Square returns structured JSON responses from its REST APIs
- the reference is operation-specific rather than documenting one universal pagination contract on the landing pages reviewed in this pass
- OAuth token exchange returns access and refresh token data

## Rate limits
The reviewed pages in this pass did **not** expose a single public, platform-wide numeric rate-limit table comparable to Trello or Mailchimp. The documentation reviewed here focused on:
- credential models
- API versioning
- operation-level reference pages

So this rewrite documents the absence of a clearly published flat rate-limit number on the reviewed official pages rather than inventing one.

## Important usage notes
- Treat Square as a broad platform rather than a single-purpose payments API.
- Preserve the `Square-Version` header in fireROUTE adapters because Square versioning is explicit and release-driven.
- Keep OAuth and personal-token flows separate; some application-management APIs specifically require the personal token.
- Orders and Customers both use several POST-based search/bulk endpoints, so do not assume search is always GET-based.