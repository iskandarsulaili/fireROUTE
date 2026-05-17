# Alpaca

Official docs manually reviewed:
- https://docs.alpaca.markets/us/docs/authentication
- https://docs.alpaca.markets/us/reference/api-references
- https://docs.alpaca.markets/us/reference/postorder
- https://docs.alpaca.markets/us/reference/stocklatestquotes-1

## Overview
Alpaca publishes a large multi-product API surface spanning trading, market data, broker, funding, streaming, and OAuth/tokenization workflows.

From the official docs reviewed in-browser:
- Trading API live base: `https://api.alpaca.markets`
- Trading API paper base: `https://paper-api.alpaca.markets`
- Market Data API live base: `https://data.alpaca.markets`
- Broker API live base: `https://broker-api.alpaca.markets`
- Broker auth/token base: `https://authx.alpaca.markets`
- Sandbox broker bases also exist under `*.sandbox.alpaca.markets`
- Protocol: HTTPS JSON APIs, plus SSE and WebSocket surfaces in other sections

The current official reference sidebar exposes **265 unique API operations** across the authentication, trading, market data, and broker sections.

## Authentication
The reviewed authentication page documents two auth models.

### Legacy key/secret auth
Trading and market-data style calls can use either HTTP Basic auth or Alpaca's API-key headers.

```http
APCA-API-KEY-ID: YOUR_API_KEY_ID
APCA-API-SECRET-KEY: YOUR_API_SECRET_KEY
Accept: application/json
```

The docs explicitly note that live and paper accounts have separate credentials.

### Client-credentials bearer tokens
Broker integrations can exchange credentials for short-lived bearer tokens.

Confirmed token endpoint from the reviewed auth page:
- `POST https://authx.alpaca.markets/v1/oauth2/token`

Confirmed request characteristics:
- content type: `application/x-www-form-urlencoded`
- supported examples on the page use `grant_type=client_credentials`
- token lifetime documented: **15 minutes**
- reviewed example response fields: `access_token`, `expires_in`, `token_type`

The reviewed page also states:
- `client_secret_post` is supported
- `client_secret_basic` is **not** supported for this flow
- broker bearer tokens are then sent as `Authorization: Bearer <broker_access_token>`

## Confirmed endpoints
This provider is much larger than a single adapter summary can exhaustively restate. The following routes were manually confirmed from the current official docs and are representative of the live surface.

| Method | Path | Base URL | Purpose |
|---|---|---|---|
| POST | `/v1/oauth2/token` | `https://authx.alpaca.markets` | Exchange broker credentials for a bearer token |
| GET | `/v2/account` | `https://api.alpaca.markets` | Retrieve current trading account details |
| GET | `/v2/assets` | `https://api.alpaca.markets` | List tradable assets |
| POST | `/v2/orders` | `https://paper-api.alpaca.markets` in reviewed example; same path family under trading API | Create an order |
| GET | `/v2/positions` | `https://paper-api.alpaca.markets` in reviewed example; same path family under trading API | List open positions |
| GET | `/v2/stocks/quotes/latest` | `https://data.alpaca.markets` | Fetch latest stock quotes for one or more symbols |

Manual route count confirmed from the official reference navigation: **265** total operations.

## Confirmed parameter details

### `GET /v2/stocks/quotes/latest`
Confirmed from the reviewed market-data reference page.

Query parameters:
- `symbols` required string — comma-separated stock symbols
- `feed` optional enum — documented values: `sip`, `iex`, `delayed_sip`, `boats`, `overnight`, `otc`
- `currency` optional string — ISO 4217 currency code; reviewed page says default `USD`

Reviewed endpoint notes:
- `sip` is all US exchanges
- `iex` is Investors Exchange
- `delayed_sip` is SIP delayed by 15 minutes
- default feed depends on subscription tier

Confirmed response/error statuses shown on the page:
- `200`
- `400`
- `401`
- `403`
- `429`
- `500`

The page explicitly says rate-limit headers use the `X-RateLimit-...` family.

### `POST /v2/orders`
Confirmed from the reviewed order-creation page.

Reviewed body parameters include:
- `symbol` — symbol, asset ID, or currency pair; required for all order classes except `mleg`
- `qty` — share/unit quantity
- `notional` — dollar amount; cannot be combined with `qty`
- `side` — `buy` or `sell`
- `type` required — documented examples/allowed values include `market`, `limit`, `stop`, `stop_limit`, `trailing_stop`
- `time_in_force` required — documented values include `day`, `gtc`, `opg`, `cls`, `ioc`, `fok` depending on asset class
- `limit_price` — required for `limit` and `stop_limit`
- `stop_price` — required for `stop` and `stop_limit`
- `trail_price` or `trail_percent` — required for `trailing_stop`
- `extended_hours` boolean — only with `limit` orders and `day`/`gtc`
- `client_order_id` — optional unique ID, max length `128`
- `order_class` — documented values include `simple`, `bracket`, `oco`, `oto`, `mleg`
- `legs` — array, up to 4 entries
- `take_profit`
- `stop_loss`
- `position_intent` — documented values include `buy_to_open`, `buy_to_close`, `sell_to_open`, `sell_to_close`
- `advanced_instructions`

Reviewed endpoint notes:
- accepted order-type and TIF combinations vary by security type
- fractional quantity support is limited
- insufficient buying power / shares returns `403`
- invalid input returns `422`

### `GET /v2/assets`
Confirmed from the current reference nav and assets section.

The reviewed assets page confirms `GET /v2/assets` as the canonical list-assets route. The browser-reviewed page did not expose the full parameter block in the captured excerpt, so fireROUTE should treat list filters such as status/class/exchange as provider-specific and verify them during adapter implementation.

## Rate limits
The reviewed Alpaca pages clearly document rate-limit behavior but the browser-reviewed excerpts did **not** expose a single provider-wide numeric ceiling.

What the reviewed docs do confirm:
- `429` is used for rate-limit enforcement
- responses include `X-RateLimit-...` headers on at least market-data endpoints
- feed defaults can depend on subscription tier

Because the official pages reviewed here did not publish one universal numeric limit in the visible excerpts, fireROUTE should preserve provider-side throttling as a runtime concern instead of hard-coding a guessed quota.

## Pagination
The reviewed pages confirm many collection endpoints exist (`/v2/assets`, `/v2/orders`, `/v2/positions`, many broker list endpoints), but the excerpts reviewed for this pass did not expose one shared global pagination contract.

Practical fireROUTE note:
- treat pagination as endpoint-specific for Alpaca
- verify per-endpoint query names during adapter implementation when using list-heavy broker or market-data routes

## Errors
Confirmed from the reviewed docs:
- `400` — invalid request parameters
- `401` — auth headers missing or invalid
- `403` — forbidden / insufficient entitlement / insufficient buying power depending on endpoint
- `422` — unprocessable order input on order-creation page
- `429` — rate limited
- `500` — internal server error

The latest-quotes page explicitly recommends using rate-limit headers to stay under limits.

## Response format
Confirmed from the reviewed docs:
- requests and responses are JSON on the reviewed REST endpoints
- market-data and trading endpoints use standard HTTP response codes
- broker token exchange returns JSON containing `access_token`, `expires_in`, and `token_type`

## Important usage notes
- Live and paper trading use different domains and separate credentials.
- Market data has its own dedicated host family under `data.alpaca.markets`.
- Broker partners use `authx.*` for token exchange and `broker-api.*` for broker endpoints.
- Token responses from the client-credentials flow are short-lived; the reviewed docs say **15 minutes**.
- The reference surface is very broad; do not assume one auth mode or one base host applies to every Alpaca product.
- `POST /v2/orders` has substantial asset-class-specific rules; preserve provider-specific order semantics instead of over-normalizing.

## fireROUTE notes
- Treat Alpaca as a composite provider with at least three canonical clusters: trading, market data, and broker.
- Default finance/trading capabilities should favor `GET /v2/account`, `GET /v2/assets`, `POST /v2/orders`, and `GET /v2/positions`.
- Default market-data capabilities should favor `GET /v2/stocks/quotes/latest` and related stock/option/crypto routes on `data.alpaca.markets`.
- Preserve host selection as part of routing metadata because paper/live/broker/data traffic does not share one base URL.
