# SmartAPI

Official docs manually reviewed:
- https://smartapi.angelone.in/docs
- https://smartapi.angelone.in/docs/User
- https://smartapi.angelone.in/docs/Gtt
- https://smartapi.angelone.in/docs/Orders
- https://smartapi.angelone.in/docs/BrokerageCalculator
- https://smartapi.angelone.in/docs/Portfolio
- https://smartapi.angelone.in/docs/Edis
- https://smartapi.angelone.in/docs/MarginCalculator
- https://smartapi.angelone.in/docs/MarketData
- https://smartapi.angelone.in/docs/OptionGreeks
- https://smartapi.angelone.in/docs/TopGainers
- https://smartapi.angelone.in/docs/Historical
- https://smartapi.angelone.in/docs/Instruments
- https://smartapi.angelone.in/docs/WebSocket2
- https://smartapi.angelone.in/docs/WebSocketOrderStatus
- https://smartapi.angelone.in/docs/ResponseStructure
- https://smartapi.angelone.in/docs/Exceptions
- https://smartapi.angelone.in/docs/RateLimit

## Overview
SmartAPI is Angel One’s trading and market-data API suite.

Confirmed platform facts from the reviewed docs:
- Root REST host: `https://apiconnect.angelone.in`
- Format: JSON over HTTPS
- Primary app auth header: `X-PrivateKey: API_KEY`
- Session auth header for most authenticated calls: `Authorization: Bearer <jwt>`
- Core client headers required across POST endpoints:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `X-UserType: USER`
  - `X-SourceID: WEB`
  - `X-ClientLocalIP`
  - `X-ClientPublicIP`
  - `X-MACAddress`
  - `X-PrivateKey`

The introduction and response-structure pages also confirm that SmartAPI responses use a common envelope with:
- `status`
- `message`
- `errorcode`
- `data`

## Authentication and session model
The reviewed User docs expose both the public login redirect URL and the API login/token endpoints.

### Public login flow URL
- `GET https://smartapi.angelone.in/publisher-login?api_key=...&redirect_url=...&state=...`

This is the browser-based login flow entrypoint, not the main authenticated REST host.

### Confirmed auth/session endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | `/rest/auth/angelbroking/user/v1/loginByPassword` | Login with client code, pin/password, and TOTP |
| POST | `/rest/auth/angelbroking/jwt/v1/generateTokens` | Refresh/generate JWT from refresh token |
| GET | `/rest/secure/angelbroking/user/v1/getProfile` | Fetch current user profile |
| GET | `/rest/secure/angelbroking/user/v1/getRMS` | Fetch funds/margins / RMS limits |
| POST | `/rest/secure/angelbroking/user/v1/logout` | Invalidate session |

Confirmed login request fields:
- `clientcode`
- `password`
- `totp`
- optional `state`

Confirmed login response fields:
- `jwtToken`
- `refreshToken`
- `feedToken`
- optional echoed `state`

The docs explicitly state:
- login requires client code, valid pin, and TOTP
- session remains active until midnight unless the user logs out

## Confirmed route surface
This manual pass confirmed **38 current routes/transport endpoints** from the official docs pages, including one rate-limit-table-only route and two WebSocket transports.

### User and account
- `POST /rest/auth/angelbroking/user/v1/loginByPassword`
- `POST /rest/auth/angelbroking/jwt/v1/generateTokens`
- `GET /rest/secure/angelbroking/user/v1/getProfile`
- `GET /rest/secure/angelbroking/user/v1/getRMS`
- `POST /rest/secure/angelbroking/user/v1/logout`

### GTT
- `POST /rest/secure/angelbroking/gtt/v1/createRule`
- `POST /rest/secure/angelbroking/gtt/v1/modifyRule`
- `POST /rest/secure/angelbroking/gtt/v1/cancelRule`
- `POST /rest/secure/angelbroking/gtt/v1/ruleDetails`
- `POST /rest/secure/angelbroking/gtt/v1/ruleList`

### Orders
- `POST /rest/secure/angelbroking/order/v1/placeOrder`
- `POST /rest/secure/angelbroking/order/v1/modifyOrder`
- `POST /rest/secure/angelbroking/order/v1/cancelOrder`
- `GET /rest/secure/angelbroking/order/v1/getOrderBook`
- `GET /rest/secure/angelbroking/order/v1/getTradeBook`
- `POST /rest/secure/angelbroking/order/v1/getLtpData`
- `GET /rest/secure/angelbroking/order/v1/details/{UniqueOrderID}`

### Brokerage / portfolio
- `POST /rest/secure/angelbroking/brokerage/v1/estimateCharges`
- `GET /rest/secure/angelbroking/portfolio/v1/getHolding`
- `GET /rest/secure/angelbroking/portfolio/v1/getAllHolding`
- `GET /rest/secure/angelbroking/order/v1/getPosition`
- `POST /rest/secure/angelbroking/order/v1/convertPosition`

### EDIS / margin / market utilities
- `POST /rest/secure/angelbroking/edis/v1/verifyDis`
- `POST /rest/secure/angelbroking/margin/v1/batch`
- `POST /rest/secure/angelbroking/market/v1/quote`
- `POST /rest/secure/angelbroking/marketData/v1/optionGreek`
- `POST /rest/secure/angelbroking/marketData/v1/gainersLosers`
- `GET /rest/secure/angelbroking/marketData/v1/putCallRatio`
- `POST /rest/secure/angelbroking/marketData/v1/OIBuildup`
- `POST /rest/secure/angelbroking/historical/v1/getCandleData`

### Instruments / reference data
- `GET https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json`
- `POST https://apiconnect.angelone.in/order-service/rest/secure/angelbroking/order/v1/getLtpData`
- `GET /rest/secure/angelbroking/marketData/v1/nseIntraday`
- `GET /rest/secure/angelbroking/marketData/v1/bseIntraday`
- `GET /rest/secure/angelbroking/securities/v1/cautionaryScrips`
- `GET /rest/secure/angelbroking/order/v1/searchScrip` — visible in the official rate-limit table even though not surfaced as a standalone doc page during this review

### Streaming / realtime order updates
- `wss://smartapisocket.angelone.in/smart-stream`
- `wss://tns.angelone.in/smart-order-update`

## Representative endpoint details
### `POST /rest/auth/angelbroking/user/v1/loginByPassword`
Confirmed request/body requirements:
- `clientcode`
- `password`
- `totp`
- optional `state`

Confirmed header requirements from examples:
- `Content-Type: application/json`
- `Accept: application/json`
- `X-UserType: USER`
- `X-SourceID: WEB`
- `X-ClientLocalIP`
- `X-ClientPublicIP`
- `X-MACAddress`
- `X-PrivateKey`

### `POST /rest/auth/angelbroking/jwt/v1/generateTokens`
Confirmed request field:
- `refreshToken`

Confirmed auth/header behavior:
- requires bearer `Authorization` token in the reviewed example
- returns new `jwtToken`, `refreshToken`, and `feedToken`

### `POST /rest/secure/angelbroking/order/v1/placeOrder`
The Orders page documents this as the main trading placement endpoint.

Confirmed constant families on the same page:
- `variety`: `NORMAL`, `STOPLOSS`, `ROBO`
- `transactiontype`: `BUY`, `SELL`
- `ordertype`: `MARKET`, `LIMIT`, `STOPLOSS_LIMIT`, `STOPLOSS_MARKET`
- `producttype`: `DELIVERY`, `CARRYFORWARD`, `MARGIN`, `INTRADAY`, `BO`
- `duration`: `DAY`, `IOC`

The reviewed Orders page also explicitly notes:
- static-IP-based API keys cause source-IP validation on place/modify/cancel order requests
- for cash orders on surveillance scrips, keep `scripconsent` as `yes`

### `POST /rest/secure/angelbroking/brokerage/v1/estimateCharges`
Confirmed body structure from the page:
- top-level `orders[]`
- each order item may include:
  - `product_type`
  - `transaction_type`
  - `quantity`
  - `price`
  - `exchange`
  - `symbol_name`
  - `token`

### `POST /rest/secure/angelbroking/margin/v1/batch`
Confirmed from the Margin Calculator page:
- access rate limit called out on-page: `10 requests/second`
- up to `50 positions` per request
- body uses `positions[]`
- documented position fields include:
  - `exchange`
  - `qty`
  - `price`
  - `productType`
  - `token`
  - `tradeType`
  - `orderType`

### `POST /rest/secure/angelbroking/market/v1/quote`
Confirmed from the Live Market Data page:
- supports modes `LTP`, `OHLC`, `FULL`
- request body shape uses:
  - `mode`
  - `exchangeTokens` object keyed by exchange (example uses `NSE`, `NFO`)
- doc explicitly states:
  - up to `50 symbols` per request
  - rate limit of `1 request per second` is mentioned on this page for the 50-symbol quote request pattern

### `POST /rest/secure/angelbroking/marketData/v1/optionGreek`
Confirmed request fields:
- `name` — underlying stock name
- `expirydate`

Confirmed response fields include per-strike values such as:
- `strikePrice`
- `optionType`
- `delta`
- `gamma`
- `theta`
- `vega`
- `impliedVolatility`
- `tradeVolume`

### Top gainers / PCR / OI buildup
The official Top Gainers page actually documents **three** separate endpoints:

| Method | Path | Notes |
|---|---|---|
| POST | `/rest/secure/angelbroking/marketData/v1/gainersLosers` | accepts `datatype` and `expirytype` |
| GET | `/rest/secure/angelbroking/marketData/v1/putCallRatio` | no request body |
| POST | `/rest/secure/angelbroking/marketData/v1/OIBuildup` | accepts `datatype` and `expirytype` |

Confirmed value sets from the same page:
- gainers/losers `datatype`: `PercPriceGainers`, `PercPriceLosers`, `PercOILosers`, `PercOIGainers`
- OI buildup `datatype`: `Long Built Up`, `Short Built Up`, `Short Covering`, `Long Unwinding`
- `expirytype`: `NEAR`, `NEXT`, `FAR`

Important note from the page:
- top gainers/losers, PCR, and OI buildup APIs are currently available only for NSE

### `POST /rest/secure/angelbroking/historical/v1/getCandleData`
Confirmed request fields:
- `exchange`
- `symboltoken`
- `interval`
- `fromdate`
- `todate`

Confirmed supported interval constants:
- `ONE_MINUTE`
- `THREE_MINUTE`
- `FIVE_MINUTE`
- `TEN_MINUTE`
- `FIFTEEN_MINUTE`
- `THIRTY_MINUTE`
- `ONE_HOUR`
- `ONE_DAY`

Confirmed max date ranges per request from the official table:
- `ONE_MINUTE`: 30 days
- `THREE_MINUTE`: 60 days
- `FIVE_MINUTE`: 100 days
- `TEN_MINUTE`: 100 days
- `FIFTEEN_MINUTE`: 200 days
- `THIRTY_MINUTE`: 200 days
- `ONE_HOUR`: 400 days
- `ONE_DAY`: 2000 days

### Instruments and reference-data endpoints
Confirmed from the Instruments page:
- `GET https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json`
  - daily-generated master instrument dump
- `GET /rest/secure/angelbroking/marketData/v1/nseIntraday`
- `GET /rest/secure/angelbroking/marketData/v1/bseIntraday`
- `GET /rest/secure/angelbroking/securities/v1/cautionaryScrips`

The Instruments page also shows a separate LTP route example on `order-service/rest/.../getLtpData`, so fireROUTE should preserve the exact host/path shown in the docs being used by the calling integration.

### WebSocket streaming
#### `wss://smartapisocket.angelone.in/smart-stream`
Confirmed from the WebSocket 2.0 page:
- auth headers include:
  - `Authorization` — JWT token
  - `x-api-key`
  - `x-client-code`
  - `x-feed-token`
- maximum `3` concurrent WebSocket connections per client code
- maximum `1000` token-mode subscriptions per session
- docs recommend one mode at a time per token
- request format is JSON; response payload is binary

#### `wss://tns.angelone.in/smart-order-update`
Confirmed from the WebSocket Order Status page:
- header required: `Authorization: Bearer AUTHORIZATION_TOKEN`
- connection limit: `3` per client code
- initial response includes `user-id`, `status-code`, `order-status`, `error-message`, and `orderData`
- used for order-status update streaming similar to postback/webhook payloads

## Rate limits
The official RateLimit page publishes explicit per-route limits and states that over-limit requests return `403 Access denied because of exceeding rate limit`.

Important platform note:
- the order rate limit is cumulative across place, modify, and cancel order calls, and the combined count must not exceed `9 requests/second`

Representative limits confirmed from the official table:
- `loginByPassword`: `1 rps`
- `generateTokens`: `1 rps`, `1000/hour`
- `getProfile`: `3 rps`, `1000/hour`
- `getRMS`: `2 rps`
- `placeOrder`: `9 rps`, `500/minute`, `1000/hour`
- `modifyOrder`: `9 rps`, `500/minute`, `1000/hour`
- `cancelOrder`: `9 rps`, `500/minute`, `1000/hour`
- `getLtpData`: `10 rps`, `500/minute`, `5000/hour`
- `convertPosition`: `10 rps`, `500/minute`, `5000/hour`
- `market/v1/quote`: `10 rps`, `500/minute`, `5000/hour`
- `margin/v1/batch`: `10 rps`, `500/minute`, `5000/hour`
- `gtt create/modify/cancel`: `9 rps`, `500/minute`, `5000/hour`
- `gtt ruleDetails/ruleList`: `10 rps`, `500/minute`, `5000/hour`
- `historical/v1/getCandleData`: `3 rps`, `180/minute`, `5000/hour`
- `marketData/v1/optionGreek`: `1 rps`

The same page notes that rate limits are calculated on the basis of client code.

## Pagination
The reviewed SmartAPI REST pages are mostly single-resource or computation endpoints.

Observed behavior:
- no generic offset/limit pagination contract is documented across the reviewed REST API pages
- list-style GTT and order/portfolio endpoints return provider-defined JSON payloads rather than a universal paging envelope
- WebSocket feeds are streaming transports rather than paged APIs

## Errors
The official Exceptions page confirms that SmartAPI returns structured application error codes in the JSON envelope.

Representative codes confirmed from the reviewed table:
- `AG8001` — Invalid Token
- `AG8002` — Token Expired
- `AG8003` — Token missing
- `AB8050` — Invalid Refresh Token
- `AB8051` — Refresh Token Expired
- `AB1000` — Invalid Email Or Password
- `AB1005` — User Type Must Be USER
- `AB1008` — Invalid Order Variety
- `AB1009` — Symbol Not Found
- `AB1013` — Order not found
- `AB1014` — Trade not found
- `AB1015` — Holding not found
- `AB1016` — Position not found
- `AB1017` — Position conversion failed
- `AB1018` — Failed to get symbol details
- `AB2001` — Internal Error, Please try after sometime

The GTT page also publishes a GTT-specific error table beginning with:
- `AB9000` — Internal Server Error
- `AB9001` — Invalid Parameters
- `AB9005` — Invalid Session ID
- `AB9013` — Invalid Rule ID

## Important usage notes
- SmartAPI’s docs repeatedly require hardware/network identity headers (`X-ClientLocalIP`, `X-ClientPublicIP`, `X-MACAddress`) alongside the API key.
- Static-IP-based API keys trigger source-IP validation on GTT and order write endpoints.
- Login needs TOTP; this is not just API key + secret auth.
- The docs show a few internal path inconsistencies in example code snippets versus section headers, especially on Top Gainers/PCR/OI pages and one LTP example under Instruments. Preserve the exact officially documented route family that matches the endpoint section being implemented.
- `OpenAPIScripMaster.json` is a first-party reference-data dump and is especially important for symbol-token lookup.

## fireROUTE notes
- SmartAPI should remain a raw/passthrough-heavy provider because trading payloads, enum sets, and exchange-token maps are provider-specific.
- A minimal normalized surface could focus on login/token refresh, order placement/cancel/status, holdings/positions, quote lookup, historical candles, and websocket feeds.
- Preserve SmartAPI error codes and rate-limit behavior in adapter responses; both are operationally important.
