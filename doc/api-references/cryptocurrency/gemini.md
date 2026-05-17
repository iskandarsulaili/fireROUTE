# Gemini

Official pages manually reviewed:
- https://developer.gemini.com/rest-api/rest-api
- https://developer.gemini.com/authentication/api-key
- https://developer.gemini.com/rest-api/trading/orders
- https://developer.gemini.com/rest-api/trading/orders/create-new-order
- https://developer.gemini.com/rest-api/trading/orders/list-past-orders
- https://developer.gemini.com/rest-api/trading/market-data
- https://developer.gemini.com/rest-api/trading/market-data/list-symbols
- https://developer.gemini.com/rest-api/trading/market-data/get-symbol-details
- https://developer.gemini.com/rest-api/trading/market-data/get-ticker
- https://developer.gemini.com/rest-api/trading/derivatives
- https://developer.gemini.com/rest-api/trading/derivatives/get-open-positions
- https://developer.gemini.com/rest-api/trading/margin
- https://developer.gemini.com/rest-api/trading/margin/get-margin-account-summary
- https://developer.gemini.com/rest-api/trading/clearing
- https://developer.gemini.com/rest-api/trading/clearing/create-new-clearing-order
- https://developer.gemini.com/rest-api/prediction-markets/order-management
- https://developer.gemini.com/rest-api/prediction-markets/order-management/place-order
- https://developer.gemini.com/rest-api/prediction-markets/positions
- https://developer.gemini.com/rest-api/prediction-markets/events
- https://developer.gemini.com/rest-api/prediction-markets/events/list-events
- https://developer.gemini.com/rest-api/trading/fund-management
- https://developer.gemini.com/rest-api/common/oauth
- https://developer.gemini.com/rest-api/common/admin

## Overview
Gemini’s current first-party developer docs are on `developer.gemini.com`, not the older `docs.gemini.com` host used in older repo entries. The reviewed REST reference exposes a much broader surface than the previous fireROUTE note captured: active trading, margin, clearing, derivatives, and prediction-markets reference sections are publicly browsable, while some other cards are currently inconsistent or broken.

What was directly confirmed from the reviewed official docs:
- Production REST base host: `https://api.gemini.com`
- Sandbox REST base shown in the current trading quickstart: `https://api.sandbox.gemini.com/v1`
- Related WebSocket endpoint shown in the current trading guide: `wss://ws.gemini.com`
- Current reference sections are grouped under `Trading`, `Prediction Markets`, and `Common`
- Directly visible, manually counted reference inventory: **38 current endpoints** across browsable category pages
- Additional category cards for `Fund Management`, `OAuth`, and `Admin` exist, but the reviewed `Fund Management` reference URL redirected to the generic trading guide and the reviewed `OAuth` / `Admin` reference URLs rendered blank in this environment, so those routes were not counted

## Confirmed route inventory from browsable reference pages

### Trading
- `Orders` (**11**): `Create New Order`, `Cancel Order`, `Cancel All Active Orders`, `Cancel All Session Orders`, `Get Order Status`, `List Active Orders`, `List Past Orders`, `List Past Trades`, `Get Trading Volume`, `Get Notional Trading Volume`, `Wrap Order`
- `Market Data` (**10**): `List Symbols`, `Get Symbol Details`, `Get Ticker`, `List Candles`, `List Derivative Candles`, `List Fee Promos`, `Get Current Order Book`, `List Trades`, `List Prices`, `FX Rate`
- `Derivatives` (**1**): `Get Open Positions`
- `Margin Trading` (**1**): `Get Margin Account Summary`
- `Clearing` (**1**): `Create New Clearing Order`

### Prediction Markets
- `Order Management` (**4**): `Place Order`, `Cancel Order`, `Get Active Orders`, `Get Order History`
- `Positions` (**3**): `Get Positions`, `Get Settled Positions`, `Get Volume Metrics`
- `Events` (**7**): `List Events`, `Get Event`, `Get Strike Price for Event`, `List Event Categories`, `List Newly Listed Events`, `List Recently Settled Events`, `List Upcoming Events`

## Exact methods and paths confirmed from sampled endpoint pages
| Method | Path | Notes |
|---|---|---|
| GET | `/v1/symbols` | Public market-data route returning all available trading symbols. |
| GET | `/v1/symbols/details/{symbol}` | Public symbol-metadata route; docs example uses `BTCUSD`. |
| GET | `/v1/pubticker/{symbol}` | Public recent-ticker route; docs recommend Version 2 for recent ticker activity. |
| POST | `/v1/order/new` | Private order-placement route for spot exchange orders. |
| POST | `/v1/orders/history` | Private closed-order history route. |
| POST | `/v1/positions` | Private derivatives/open-positions route. |
| POST | `/v1/margin/account` | Private margin-summary route; only for margin accounts. |
| POST | `/v1/clearing/new` | Private bilateral clearing-order route. |
| POST | `/v1/prediction-markets/order` | Private prediction-markets limit-order route. |
| GET | `/v1/prediction-markets/events` | Public paginated prediction-events listing route. |

## Authentication
Confirmed from the reviewed `API Key` auth page plus sampled private endpoint pages:
- Gemini private APIs use an API key created in `Settings/API`
- Required private-auth headers:
  - `X-GEMINI-APIKEY`
  - `X-GEMINI-PAYLOAD`
  - `X-GEMINI-SIGNATURE`
- Official signature formula: `hex(HMAC_SHA384(base64(payload), key=api_secret))`
- A `nonce` is required on all private requests
- If a key is provisioned with **time based nonce**, the nonce must be in seconds and within `+/- 30` seconds of Unix epoch time
- If time-based nonce is not enabled, the nonce must be unique and strictly increasing within that API session
- Gemini documents both account-level and master API keys; master keys can act on subaccounts via an `account` request field
- The auth page documents a `Requires Heartbeat` option: if enabled and Gemini receives no authenticated message for 30 seconds, open orders for that session are cancelled; Gemini recommends heartbeats at most every 15 seconds
- Public market-data and public prediction-event listing routes were shown without private signing requirements on the reviewed route pages

## Parameters and request-body details confirmed from sampled pages

### Public market data
- `GET /v1/symbols/details/{symbol}`
  - path parameter: `{symbol}`
  - docs example: `BTCUSD`
  - reviewed response fields include metadata such as symbol/currency/tick-size/min-order-size details
  - the page also notes that when `wrap_enabled=true`, wrapping uses `POST https://api.gemini.com/v1/wrap/:symbol`
- `GET /v1/pubticker/{symbol}`
  - required path parameter: `{symbol}`
  - reviewed response fields include `bid`, `ask`, `last`, and `volume` subfields

### Private trading
- `POST /v1/order/new`
  - reviewed example body fields: `request`, `nonce`, `client_order_id`, `symbol`, `amount`, `price`, `side`, `type`
  - page-specific notes confirm optional margin use via `margin_order: true`
  - stop-limit orders use `stop_price`
  - reviewed order-option values: `maker-or-cancel`, `immediate-or-cancel`, `fill-or-kill`
  - page states direct market orders are not supported; Gemini recommends aggressive IOC limit orders instead
- `POST /v1/orders/history`
  - reviewed example body fields: `request`, `nonce`, `limit_orders`
  - optional fields shown in the reviewed schema: `symbol`, `timestamp`, `account`
  - `limit_orders` default: `50`; max: `500`
  - official history-walk procedure uses descending `timestamp` windows to page backward until an empty list is returned
- `POST /v1/positions`
  - reviewed example body fields: `request`, `nonce`, `account`
- `POST /v1/margin/account`
  - reviewed example body fields: `request`, `nonce`
  - docs explicitly say standard exchange accounts will error; this route is for margin accounts only
- `POST /v1/clearing/new`
  - reviewed example body fields: `request`, `nonce`, `counterparty_id`, `expires_in_hrs`, `symbol`, `amount`, `price`, `side`

### Prediction markets
- `POST /v1/prediction-markets/order`
  - reviewed example body fields: `symbol`, `orderType`, `side`, `quantity`, `price`, `outcome`, `timeInForce`
  - page states only limit orders are currently supported
  - reviewed `timeInForce` values: `good-til-cancel`, `immediate-or-cancel`, `fill-or-kill`, `maker-or-cancel`
- `GET /v1/prediction-markets/events`
  - reviewed query parameters: `status[]`, `category[]`, `search`, `limit`, `offset`
  - `limit` default: `50`; max: `500`
  - `offset` default: `0`
  - reviewed response shape includes `data[]` event records with nested `contracts[]`

## Roles and scopes
The reviewed private endpoint pages consistently expose both Gemini role requirements and OAuth-scope notes.

Confirmed examples:
- `POST /v1/order/new`: API key must have the `Trader` role; reviewed OAuth scope note says `orders:create`
- `POST /v1/orders/history`: API key must have `Trader` or `Auditor`; reviewed OAuth scope note says `history:read`
- Other reviewed private routes (`/v1/positions`, `/v1/margin/account`, `/v1/clearing/new`, `/v1/prediction-markets/order`) also include `Roles` and `OAuth Scopes` sections on-page, though the compact snapshots in this pass did not expose all exact scope strings

## Response format, errors, and rate limits
- The reviewed public route pages use JSON responses
- `GET /v1/pubticker/{symbol}` documents `200`, `400`, `404`, `429`, and `500`
- `GET /v1/symbols` and `GET /v1/symbols/details/{symbol}` also expose `200`, `400`, `404`, `429`, and `500`
- `POST /v1/orders/history`, `POST /v1/positions`, `POST /v1/margin/account`, and `POST /v1/clearing/new` expose `200`, `400`, `401`, `403`, `404`, `429`, and `500`
- `POST /v1/prediction-markets/order` exposes `201`, `400`, `401`, `422`, `500`, and `503`
- `GET /v1/prediction-markets/events` exposes `200`, `500`, and `503`
- The current reviewed docs clearly show `429` handling on many routes, but I did **not** find a numeric global request-per-second quota table on the browsed official pages

## Important usage notes
- The older repo entry substantially undercounted Gemini; the current browsable official reference exposes at least **38** visible endpoints even before counting the currently inconsistent `Fund Management`, `OAuth`, and `Admin` sections
- Gemini’s current docs mix older private-auth guidance with newer generated endpoint pages. The auth page says authenticated payloads are base64-encoded into `X-GEMINI-PAYLOAD` with `Content-Length: 0` / `Content-Type: text/plain`, while some generated endpoint examples also show JSON bodies in cURL snippets. For implementation, prefer the dedicated `API Key` auth page as the canonical signing guide
- The current trading quickstart explicitly uses the sandbox base `https://api.sandbox.gemini.com/v1`
- The current docs also surface Gemini Prediction Markets as a first-party API family, so fireROUTE should not treat Gemini as only a spot-market ticker/order-book provider
- The reviewed `Fund Management` card is currently not reliable for route extraction from a logged-out browser session because its reference URL redirected to a generic trading guide, and the reviewed `Common > OAuth` / `Common > Admin` URLs rendered blank in this environment