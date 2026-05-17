# Nexchange

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `nexchange`
- Official pages manually reviewed in this pass:
  - `https://nexchange2.docs.apiary.io/`
  - `https://nexchange2.docs.apiary.io/reference/0/get-currencies/get-currencies`
  - `https://nexchange2.docs.apiary.io/reference/0/get-pairs/get-pairs`
  - `https://nexchange2.docs.apiary.io/reference/0/get-price/get-price`
  - `https://nexchange2.docs.apiary.io/reference/0/rate-info/get-rate-info`
  - `https://nexchange2.docs.apiary.io/reference/0/latest-price/get-latest-price`
  - `https://nexchange2.docs.apiary.io/reference/0/price-history/get-price-history`
  - `https://nexchange2.docs.apiary.io/reference/0/prices-info-list/prices-info-list`
  - `https://nexchange2.docs.apiary.io/reference/0/get-orders/get-orders`
  - `https://nexchange2.docs.apiary.io/reference/0/get-order/get-order`
  - `https://nexchange2.docs.apiary.io/reference/0/get-user-orders/get-user-orders`
  - `https://nexchange2.docs.apiary.io/reference/0/user-order/get-user-order`
  - `https://nexchange2.docs.apiary.io/reference/0/user-order/update-user-order`
  - `https://nexchange2.docs.apiary.io/reference/0/create-user-order/create-user-order`
  - `https://nexchange2.docs.apiary.io/reference/0/create-support-inquiry/create-support-inquiry`
  - `https://nexchange2.docs.apiary.io/reference/0/create-anonymous-order/create-anonymous-order`
  - `https://nexchange2.docs.apiary.io/reference/0/referrals/get-referrals`
  - `https://nexchange2.docs.apiary.io/reference/0/ticker-summarized-volume/get-ticker`
  - `https://nexchange2.docs.apiary.io/reference/0/trade-volume/get-volume`
  - `https://nexchange2.docs.apiary.io/reference/0/create-limit-order-beta/create-limit-order`
  - `https://nexchange2.docs.apiary.io/reference/0/get-trade-history/get-trade-history`
  - `https://nexchange2.docs.apiary.io/reference/0/register-new-user/create-new-user`
  - `https://nexchange2.docs.apiary.io/reference/0/reset-password/reset-user-password`
  - `https://nexchange2.docs.apiary.io/reference/0/complete-password-reset/complete-password-reset`
  - `https://n.exchange/` (official alternative page; Cloudflare verification in this environment)
- Confirmed API host: `https://api.n.exchange`
- Confirmed versioned path prefix: `/en/api/v1`
- Primary media type: JSON
- Authentication model surfaced in reviewed docs: mixed public access plus bearer-token auth on user-scoped routes
- Manually confirmed routes in this pass: `25`

## Overview
The official Apiary reference is currently rich enough to recover a concrete route inventory for n.exchange. The main product site still sits behind a Cloudflare verification interstitial in this environment, but the first-party Apiary docs expose exact method/path pairs, example request headers, request bodies, and response schemas for public market-data flows, anonymous order creation, authenticated user-order management, referrals, support, and password-reset flows.

## Authentication
From the reviewed official Apiary pages:
- Public examples for market/reference routes such as currencies, pairs, price lookups, ticker, volume, trade history, support inquiries, anonymous orders, and user registration do **not** include an `Authorization` header.
- User-scoped routes explicitly show bearer auth:
  - header `Authorization` is sent as a bearer token on `GET /users/me/orders/`
  - header `Authorization` is sent as a bearer token on `GET /users/me/orders/{unique_reference}/`
  - header `Authorization` is sent as a bearer token on `PUT /users/me/orders/{unique_reference}/`
  - header `Authorization` is sent as a bearer token on `POST /users/me/orders/`
  - header `Authorization` is sent as a bearer token on `GET /referrals/`
  - bearer auth also appears on order-detail mutation examples under `/orders/{unique_reference}/`
- The reviewed docs expose account creation and password-reset endpoints, but I did **not** find a dedicated login / token-issuance endpoint in the browsed Apiary surface.
- Because the token-minting flow was not documented on the reviewed pages, adapters should treat bearer acquisition as an external/auth-surface gap rather than inventing a route.

## Common request/response conventions
- Base host: `https://api.n.exchange`
- Common API prefix: `/en/api/v1`
- Reviewed operations use `GET`, `POST`, `PUT`, and `PATCH`.
- Request bodies on write routes are JSON and the examples send `Content-Type: application/json`.
- Response examples are JSON.
- Several public `GET` examples in the docs show a typoed header label `Content-Type: aplication/json`; preserve that as a docs quirk, not a normalized contract.
- Path placeholders shown by the docs include raw names such as `pair_name`, `rate_id`, and `unique_reference`; this file normalizes them as `{pair_name}`, `{rate_id}`, and `{unique_reference}` for readability.

## Manually confirmed endpoint set

### Public reference and market-data routes
| Method | Path | Notes |
|---|---|---|
| `GET` | `/en/api/v1/currency` | List supported currencies |
| `GET` | `/en/api/v1/pair` | List supported currency pairs |
| `GET` | `/en/api/v1/get_price/{pair_name}/?amount_base={amount_base}&amount_quote={amount_quote}` | Quote conversion price for a pair |
| `GET` | `/en/api/v1/rate/{rate_id}` | Fetch price info by `rate_id` |
| `GET` | `/en/api/v1/price/{pair_name}/latest/?market_code={market_code}` | Latest price for a pair / market |
| `GET` | `/en/api/v1/price/{pair_name}/history/?hours={hours}` | Historical prices for a selected pair |
| `GET` | `/en/api/v1/info/bulk` | Bulk list of rates with minimum / maximum amounts |
| `GET` | `/en/api/v1/ticker/?hours={hours}` | Summarized volume / ticker data |
| `GET` | `/en/api/v1/volume/?hours={hours}` | Trade-volume summary |
| `GET` | `/en/api/v1/trade_history/?page={page}&page_size={page_size}&pair={pair}&sort={sort}` | Released-order trade history |

### Public order and support routes
| Method | Path | Notes |
|---|---|---|
| `GET` | `/en/api/v1/orders/?page={page}&page_size={page_size}&pair={pair}&status={status}` | Public order listing with filters |
| `GET` | `/en/api/v1/orders/{unique_reference}/` | Public order details by reference |
| `PATCH` | `/en/api/v1/orders/{unique_reference}/` | Set order withdrawal and/or refund address |
| `PATCH` | `/en/api/v1/orders/{unique_reference}/` | Stop order processing by sending `flagged: true` |
| `POST` | `/en/api/v1/orders/` | Create anonymous order |
| `POST` | `/en/api/v1/support/` | Create support inquiry |
| `POST` | `/en/api/v1/limit_order/` | Create limit order (`BETA`) |

### Authenticated user/account routes
| Method | Path | Notes |
|---|---|---|
| `GET` | `/en/api/v1/users/me/orders/?page={page}&page_size={page_size}` | List current user's orders; bearer auth shown |
| `GET` | `/en/api/v1/users/me/orders/{unique_reference}/` | Get current user's order; bearer auth shown |
| `PUT` | `/en/api/v1/users/me/orders/{unique_reference}/` | Update current user's order; bearer auth shown |
| `POST` | `/en/api/v1/users/me/orders/` | Create current user's order; bearer auth shown |
| `GET` | `/en/api/v1/referrals/` | Fetch referrals; bearer auth shown |
| `POST` | `/en/api/v1/users/` | Register new user |
| `POST` | `/en/api/v1/password_reset/` | Start password reset |
| `POST` | `/en/api/v1/password_reset_complete/` | Complete password reset with `hash` + new password |

## Key parameters and body shapes confirmed from the official pages

### Market/reference routes
- `GET /get_price/{pair_name}/`
  - `pair_name` path selector like `BTCLTC`, `LTCBTC`, `ETHBTC`
  - `amount_base`
  - `amount_quote`
- `GET /rate/{rate_id}`
  - `rate_id` path parameter
- `GET /price/{pair_name}/latest/`
  - `pair_name`
  - `market_code`
- `GET /price/{pair_name}/history/`
  - `pair_name`
  - `hours`
- `GET /ticker/` and `GET /volume/`
  - `hours`
- `GET /trade_history/`
  - `page`
  - `page_size`
  - `pair`
  - `sort` (`asc` / `desc` in the reviewed example text)

### Order list/detail routes
- `GET /orders/`
  - `page`
  - `page_size`
  - `pair`
  - `status`
- Official status mapping printed on the reviewed `Get Orders` page:
  - `CANCELED=0`
  - `INITIAL=11`
  - `PAID_UNCONFIRMED=12`
  - `PAID=13`
  - `PRE_RELEASE=14`
  - `RELEASED=15`
  - `COMPLETED=16`
  - `REFUNDED=8`
- `GET` / `PATCH /orders/{unique_reference}/`
  - `unique_reference` path parameter
- `PATCH /orders/{unique_reference}/` address-update body
  - `refund_address.address`
  - `withdraw_address.address`
- `PATCH /orders/{unique_reference}/` stop-processing body
  - `flagged` (`true` in the reviewed example)

### Order creation routes
- `POST /orders/` and `POST /users/me/orders/`
  - `amount_base`
  - `is_default_rule`
  - `pair.name`
  - `withdraw_address.address`
- `POST /limit_order/`
  - `amount_base`
  - `limit_rate`
  - `amount_quote`
  - `pair.name`
  - `order_type`
  - `withdraw_address.address`
  - `refund_address.address`
- `PUT /users/me/orders/{unique_reference}/`
  - reviewed example updates `refund_address.address`

### Account/support routes
- `POST /support/`
  - `name`
  - `telephone`
  - `email`
  - `subject`
  - `message`
- `POST /users/`
  - `username`
  - `email`
  - `phone`
  - `password`
- `POST /password_reset/`
  - `email`
- `POST /password_reset_complete/`
  - `hash`
  - `password`

## Response-format notes
- `GET /currency` returns an array of currency objects; reviewed fields include:
  - `code`
  - `name`
  - `min_confirmations`
  - `is_crypto`
  - `minimal_amount`
  - `is_base_of_enabled_pair`
  - `is_quote_of_enabled_pair`
  - `has_enabled_pairs`
  - example output also showed `withdrawal_fee`
- Order-create responses include fields such as:
  - `amount_base`
  - `amount_quote`
  - `unique_reference`
  - `withdrawal_fee`
  - `withdrawal_fee_quote`
  - `user_provided_amount`
  - `pair`
  - `withdraw_address`
  - `status_name`
  - `transactions`
- Order-detail responses additionally show metadata like:
  - `created_on`
  - `modified_on`
  - `deposit_address`
  - `from_default_rule`
  - `price`
  - `amount_usd`
  - `amount_btc`
  - `amount_eur`
- Address-update responses return `refund_address`, `withdraw_address`, and `flagged`.

## Pagination
- Pagination is query-parameter based, not cursor based, on the reviewed list endpoints.
- Confirmed pagination controls:
  - `page`
  - `page_size`
- These appear on:
  - `GET /orders/`
  - `GET /users/me/orders/`
  - `GET /trade_history/`
- Time-window style filtering is used on several analytics/history routes via `hours`.

## Rate limits
- I did **not** find a numeric public rate-limit policy on the reviewed official Apiary pages.
- The reviewed docs do not publish quota headers, request-per-second guidance, or a formal throttling section.

## Error handling
- The browsed pages are primarily success-schema oriented.
- I did not find a shared error-envelope schema or a global error-code table in the reviewed official pages.
- Reviewed pages visibly document success codes such as `200` and `201` for the sampled operations.
- Because the official reference I reviewed did not expose a stable shared error model, this file does not invent one.

## Important usage notes
- This provider is no longer blocked for route extraction: the official Apiary docs are currently sufficient to document the route surface even though the main `n.exchange` site is Cloudflare-gated in this environment.
- The path prefix is explicitly language/version scoped as `/en/api/v1`; adapters should preserve that prefix rather than collapsing it away.
- Public and authenticated order flows coexist:
  - anonymous/public order creation uses `/orders/`
  - user-scoped order management uses `/users/me/orders/`
- The same public order-detail path `/orders/{unique_reference}/` is reused for both read access and two distinct `PATCH` mutations documented on separate action pages.
- The reviewed docs expose registration and password-reset endpoints but not a token-issuance/login route; bearer-token acquisition remains undocumented in the browsed reference surface.

## Verification notes
This file was manually rebuilt from the current official Apiary documentation plus the official `n.exchange` site as an alternative first-party check.