# Coinbase Pro

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinbase-pro`
- Legacy product name in this repo: `Coinbase Pro`
- Current official product/docs name: `Coinbase Exchange`
- Official pages manually reviewed in this pass:
  - `https://docs.cdp.coinbase.com/exchange/introduction/welcome`
  - `https://docs.cdp.coinbase.com/exchange/introduction/sandbox`
  - `https://docs.cdp.coinbase.com/exchange/rest-api/requests`
  - `https://docs.cdp.coinbase.com/exchange/rest-api/authentication`
  - `https://docs.cdp.coinbase.com/exchange/rest-api/rate-limits`
  - `https://docs.cdp.coinbase.com/exchange/rest-api/pagination`
  - `https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/introduction`
  - `https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/accounts/get-all-account-profile`
  - `https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/orders/create-new-order`
  - `https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/transfers/withdraw-to-crypto-address`
  - `https://docs.cdp.coinbase.com/api-reference/exchange-api/rest-api/wrapped-assets/create-new-stake-wrap`
  - `https://docs.cdp.coinbase.com/sitemap.xml`
- Current production REST base confirmed from official examples: `https://api.exchange.coinbase.com`
- Current sandbox REST base confirmed from the official sandbox page: `https://api-public.sandbox.exchange.coinbase.com`
- Related official non-REST transports confirmed in the reviewed docs:
  - WebSocket feed docs exist separately
  - FIX API docs exist separately
- Manually confirmed REST route count in this pass: `87`

## Manual review result
The legacy `docs.pro.coinbase.com` surface has been superseded by Coinbase's current Exchange docs on `docs.cdp.coinbase.com`. The reviewed first-party Exchange REST reference now exposes a much larger route inventory than this repo's prior thin `8`-route note.

Using the current official REST reference index plus the official sitemap, I confirmed `87` current REST endpoint pages across `16` route families, in addition to a separate REST introduction page and separate WebSocket/FIX documentation trees.

## Confirmed base URLs and transport surfaces
### Production
- REST: `https://api.exchange.coinbase.com`
- Sample reviewed production endpoints:
  - `GET /accounts`
  - `POST /orders`
  - `POST /withdrawals/crypto`
  - `POST /wrapped-assets/stake-wrap`

### Sandbox
From the official sandbox page:
- REST: `https://api-public.sandbox.exchange.coinbase.com`
- WebSocket Feed: `wss://ws-feed-public.sandbox.exchange.coinbase.com`
- WebSocket Direct Feed: `wss://ws-direct.sandbox.exchange.coinbase.com`

### Scope note
- This file documents the current Coinbase Exchange REST surface that supersedes the old Coinbase Pro docs host.
- The official docs also expose separate FIX and WebSocket references, but the `87` route count here is for the browsable REST reference only.

## Official REST route families confirmed
The official sitemap and REST reference expose these route-family totals:

| Route family | Confirmed route pages |
|---|---:|
| Accounts | 5 |
| Address Book | 5 |
| Coinbase Accounts | 2 |
| Conversions | 4 |
| Currencies | 2 |
| Fees | 1 |
| Futures | 4 |
| Loan | 15 |
| Orders | 6 |
| Products | 8 |
| Profiles | 6 |
| Reports | 3 |
| Transfers | 11 |
| Travel Rules | 3 |
| Users | 3 |
| Wrapped Assets | 9 |
| **Total confirmed REST endpoint pages** | **87** |

## Representative official endpoints reviewed directly
These exact method/path pairs were directly visible on the reviewed official endpoint pages:

| Method | Path | Notes |
|---|---|---|
| GET | `/accounts` | List trading accounts for the API key profile. |
| POST | `/orders` | Create a new exchange order. |
| POST | `/withdrawals/crypto` | Withdraw funds to an external crypto address. |
| POST | `/wrapped-assets/stake-wrap` | Stake-wrap from one currency to another. |

The reviewed Products family and current official sitemap also confirm these additional exact route paths are still present in the Exchange REST reference:
- `GET /products`
- `GET /products/volume-summary`
- `GET /products/{product_id}`
- `GET /products/{product_id}/book`
- `GET /products/{product_id}/candles`
- `GET /products/{product_id}/stats`
- `GET /products/{product_id}/ticker`
- `GET /products/{product_id}/trades`

## Authentication
From the reviewed official authentication page:
- Private endpoints use Coinbase Exchange API keys.
- API keys are profile-scoped.
- Each user can generate up to `300` API keys.
- The documented required auth headers are:
  - `CB-ACCESS-KEY`
  - `CB-ACCESS-SIGN`
  - `CB-ACCESS-TIMESTAMP`
  - `CB-ACCESS-PASSPHRASE`
- Request bodies should use `Content-Type: application/json`.
- The signature is a base64-encoded HMAC-SHA256 over:
  - `timestamp + method + requestPath + body`
- The secret must be base64-decoded before it is used as the HMAC key.
- `CB-ACCESS-TIMESTAMP` must be Unix time in UTC seconds and must be within `30` seconds of server time.
- The docs explicitly point users to the Exchange `time` endpoint when validating clock skew.

### API key permission model
The reviewed auth page confirms these permission families:
- `View` — read permissions including `GET`
- `Transfer` — value-transfer endpoints including deposits/withdrawals
- `Trade` — order placement and trading data
- `Manage` — user settings and management functions such as address-book entries

Endpoint pages also document route-specific permission requirements. Examples confirmed in this pass:
- `GET /accounts` requires `view` or `trade`
- `POST /orders` requires `trade`
- `POST /withdrawals/crypto` requires `transfer` and the key must belong to the default profile
- `POST /wrapped-assets/stake-wrap` requires `trade`

## Request / response format notes
From the reviewed requests and endpoint-reference pages:
- Requests and responses are documented as `application/json`.
- Successful responses use normal HTTP status semantics and commonly return `200` with JSON bodies.
- The generic error body format includes a `message` field, with the reviewed example:
  - `{ "message": "Invalid Price" }`
- Endpoint pages show provider-native schemas rather than a single normalized envelope.

### Common status codes confirmed from the official Requests page
- `400` — Bad Request / invalid request format
- `401` — Unauthorized / invalid API key
- `403` — Forbidden
- `404` — Not Found
- `429` — Too Many Requests (from the reviewed rate-limit page)
- `500` — Internal Server Error

## Pagination
From the reviewed official pagination guide:
- Coinbase Exchange uses cursor pagination for REST endpoints that return arrays.
- Confirmed query parameters:
  - `before`
  - `after`
  - `limit` (default `1000`, maximum `1000`)
- Confirmed response headers:
  - `CB-BEFORE`
  - `CB-AFTER`
- The docs explicitly note that:
  - `before` points to a newer page
  - `after` points to an older page
- Examples in the reviewed guide use routes like `/orders`, `/fills`, and `/trades`.

## Rate limits
From the reviewed official rate-limit page:
- Public endpoints are throttled by IP.
- Private endpoints are throttled by profile ID.
- Public REST limit:
  - `10 requests/second` per IP
  - bursts up to `15 requests/second`
- Private REST limit:
  - `15 requests/second` per profile
  - bursts up to `30 requests/second`
- Private `/fills` endpoints:
  - `10 requests/second` per profile
  - bursts up to `20 requests/second`
- Private `/loans` endpoints:
  - `10 requests/second` per profile
- The reviewed docs state the REST API uses a lazy-fill token-bucket implementation.
- Exceeding the limit returns `429 Too Many Requests`.

### Route-specific limit note confirmed on a reviewed endpoint page
- `GET /accounts` currently documents a custom per-profile limit of `25 requests/second`, with bursts up to `50 requests/second`.

## Important parameter and schema notes from reviewed endpoint pages
### `GET /accounts`
Reviewed page confirms account objects include fields such as:
- `id`
- `currency`
- `balance`
- `hold`
- `available`
- `profile_id`
- `trading_enabled`

### `POST /orders`
Reviewed page confirms:
- order creation supports both `limit` and `market` orders
- common request fields include:
  - `price`
  - `size`
  - `funds`
  - `type`
  - `side`
  - `product_id`
  - `client_oid`
  - `time_in_force`
  - `cancel_after`
  - `post_only`
  - `max_floor`
- one of `size` or `funds` is required for several order forms
- `cancel_after` requires `time_in_force=GTT`
- `post_only` is invalid with `IOC` or `FOK`
- the reviewed page explicitly states each profile can place at most `500` open orders on a product

### `POST /withdrawals/crypto`
Reviewed page confirms request fields including:
- `amount`
- `currency`
- `crypto_address`
- `profile_id`
- `destination_tag`
- `no_destination_tag`
- `nonce`
- `network`
- `add_network_fee_to_total`
- `is_intermediary`
- `travel_rule_data`

The same reviewed page also confirms deep Travel Rule substructures for originator and beneficiary identity/address details.

### `POST /wrapped-assets/stake-wrap`
Reviewed page confirms request fields:
- `from_currency`
- `to_currency`
- `amount`

Reviewed success fields include:
- `id`
- `from_amount`
- `to_amount`
- `from_account_id`
- `to_account_id`
- `from_currency`
- `to_currency`
- `status`
- `conversion_rate`
- `created_at`
- `completed_at`
- `canceled_at`

## Sandbox caveats
From the reviewed official sandbox page:
- the sandbox is only a subset of production order books
- sandbox supports exchange functionality except Transfers
- transfer endpoints are explicitly unavailable in sandbox testing
- sandbox login sessions and API keys are separate from production
- fake funds can be added for testing

## fireROUTE normalization notes
- Treat this provider entry as the legacy repo name for the current `Coinbase Exchange` REST API surface.
- Use `https://api.exchange.coinbase.com` as the production REST base.
- Keep Exchange authentication separate from Coinbase App / Advanced Trade auth because the header names and signing scheme are different.
- Preserve route-family distinctions such as Accounts, Orders, Transfers, Loans, Travel Rules, and Wrapped Assets; the official docs treat them as separate resource groups with different permissions and rate-limit behavior.
- Do not rely on the old `docs.pro.coinbase.com` host as the canonical source anymore; the active first-party reference is on `docs.cdp.coinbase.com`.
- The current official REST surface is materially broader than a products-only integration and should not be modeled as an `8`-route API.