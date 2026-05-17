# KuCoin

Official pages manually reviewed:
- https://www.kucoin.com/docs-new/authentication
- https://www.kucoin.com/docs-new/rate-limit
- https://www.kucoin.com/docs-new/rest/ua/introduction
- https://www.kucoin.com/docs-new/rest/ua/get-announcements
- https://www.kucoin.com/docs-new/rest/ua/get-ticker
- https://www.kucoin.com/docs-new/rest/ua/place-order
- https://www.kucoin.com/docs-new/websocket-api/base-info/introduction
- https://www.kucoin.com/docs-new/websocket-api/base-info/get-private-token-uta
- https://www.kucoin.com/docs-new/websocket-api/base-info/get-public-token-spot-margin
- https://www.kucoin.com/docs-new/rest/convert/get-convert-quote

## Overview
KuCoin’s current official docs are much broader than this repo’s earlier thin market-data-only note. The docs are now split across multiple first-party surfaces:
- **Pro REST**
- **Pro WebSocket**
- **Classic REST**
- **Classic WebSocket**
- additional non-route documentation such as auth, enums, errors, and changelog pages

What was directly confirmed from the reviewed official docs:
- Primary API host: `https://api.kucoin.com`
- Standard response/content type: JSON / `application/json`
- Private REST auth headers: `KC-API-KEY`, `KC-API-SIGN`, `KC-API-TIMESTAMP`, `KC-API-PASSPHRASE`, `KC-API-KEY-VERSION`
- Optional site header: `X-SITE-TYPE`
- Pro REST paths are currently documented mainly under `/api/ua/v1/...`
- Classic REST paths are documented mainly under `/api/v1/...`
- Reviewed WebSocket token routes use both `/api/v2/bullet-private` and `/api/v1/bullet-public`
- Conservative exact route count directly visible in the reviewed docs: **100 method-tagged HTTP operations** across confirmed KuCoin route families

## Important product-state notes
The reviewed `Pro REST` introduction explicitly warns that:
- the **Pro API is still under active development**
- it has **not been officially released yet**
- KuCoin says **do not use it in production or live trading**
- in the currently documented phase, **Spot** and **Futures** are supported, while leveraged trading / options are not yet fully supported on the Pro surface

That warning materially changes how fireROUTE should treat the newer `/api/ua/v1/...` surface.

## Confirmed bases and protocol surfaces

### REST
- Shared host: `https://api.kucoin.com`
- Pro REST example paths reviewed:
  - `/api/ua/v1/market/announcement`
  - `/api/ua/v1/market/ticker`
  - `/api/ua/v1/{accountMode}/order/place`
- Classic REST example path reviewed:
  - `/api/v1/convert/quote`

### WebSocket bootstrap
Reviewed first-party docs confirm token/bootstrap routes and connection guidance:
- Pro private token route: `POST /api/v2/bullet-private`
- Classic public token route (spot/margin page opened): `POST /api/v1/bullet-public`
- Classic docs also visibly expose separate token pages for:
  - `Get Private Token - Classic Spot/Margin`
  - `Get Public Token - Classic Futures`
  - `Get Private Token - Classic Futures`
- Reviewed WebSocket connection pattern: `wss://ws-api-xxx.kucoin.xxx?token=xxx&connectId=xxxxx`
- WebSocket tokens are documented as valid for **24 hours**
- The docs say a single WebSocket connection is expected to be disconnected after **24 hours**

## Exact sampled endpoints manually opened
| Method | Path | Surface | What was confirmed |
|---|---|---|---|
| GET | `/api/ua/v1/market/announcement` | Pro REST market data | announcement feed endpoint; reviewed curl example showed `language`, `type`, `pageNumber`, `pageSize`, `startTime`, `endTime` |
| GET | `/api/ua/v1/market/ticker` | Pro REST market data | reviewed page showed `tradeType` required and `symbol` optional |
| POST | `/api/ua/v1/{accountMode}/order/place` | Pro REST orders | unified/classic path parameterized by `accountMode`; reviewed page documented active-order quotas and order fields |
| POST | `/api/v2/bullet-private` | Pro WebSocket bootstrap | reviewed page returns private WebSocket token for Pro private channels |
| POST | `/api/v1/bullet-public` | Classic WebSocket bootstrap | reviewed page returns public token for Classic spot/margin channels |
| GET | `/api/v1/convert/quote` | Classic REST convert | reviewed page showed `fromCurrency`, `toCurrency`, and exactly one of `fromCurrencySize` / `toCurrencySize` |

## Confirmed route families and conservative exact counts
The counts below are limited to method-tagged HTTP operation pages that were directly visible in the reviewed docs and route-family navigation.

| Family | Count | Notes |
|---|---:|---|
| Pro REST — Market Data | 19 | announcements, currency/currencies, symbol, ticker, order book, klines, trades, collateral ratio, funding/index/open-interest/service/KYC helpers |
| Pro REST — Account | 27 | overview/assets, transfer quotas, flex transfer, mode/fee/ledger/interest, leverage/borrowing, subaccounts, withdrawal flows, client IP |
| Pro REST — Orders | 11 | place/cancel, batch cancel, order detail/open/history/trade history, DCP |
| Pro REST — Positions | 4 | current/history tiers and private funding-fee history |
| Pro REST — VIP Lending | 3 | collateral ratio, loan info, accounts |
| Pro WebSocket — Base Info token endpoint | 1 | private token bootstrap route |
| Classic WebSocket — Base Info token endpoints | 4 | public/private token pages for spot-margin and futures |
| Classic REST — Affiliate | 5 | invited, commission, trade history, transaction, kumining |
| Classic REST — Copy Trading | 15 | order placement/cancel, sizing, isolated-margin adjustments, mode switches, position-mode helper |
| Classic REST — Convert | 11 | symbols/currencies/quotes/orders/limit-order flows |

**Total conservative exact count: 100 method-tagged HTTP operations.**

## Route-family details seen in the docs navigation

### Pro REST — Market Data (`19`)
Visible operation pages:
- Get Announcements
- Get Currency
- Get Currencies
- Get Symbol
- Get Ticker
- Get OrderBook
- Get Klines
- Get Trades
- Get Collateral Ratio
- Get Cross Margin Config
- Get Index Price
- Get Current Funding Rate
- Get History Funding Rate
- Get Position Tiers
- Get Futures Open Interest
- Get Service Status
- Get Third-Party Custody Currencies
- Get Borrowable Currencies
- Get KYC Regions

### Pro REST — Account (`27`)
Visible operation pages:
- Get Account Overview (UTA)
- Get Account Currency Assets (UTA)
- Get Account Currency Assets (Classic)
- Get Sub Account Currency Assets
- Get Transfer Quotas
- Flex Transfer
- Set Sub Account Transfer Permission
- Get Account Mode
- Set Account Mode
- Get Fee Rate
- Get Account Ledger
- Get Interest History (UTA)
- Modify Futures Leverage (UTA)
- Get Deposit Address
- Get Third-Party Custody Account Currency Limits
- Modify Leverage Margin Cross (UTA)
- Get Leverage (UTA)
- Get Borrowing Rates and Limits
- Get Apikey Info
- Add sub-account
- Get sub-account API List
- Add sub-account API
- Delete sub-account API
- Get Withdrawal Quotas
- Withdraw
- Cancel Withdrawal
- Get Client IP Address

### Pro REST — Orders (`11`)
Visible operation pages:
- Place Order
- Batch Place Order (Classic)
- Cancel Order
- Batch Cancel Orders By ID
- Batch Cancel Orders By Symbol
- Get Order Details
- Get Open Order List
- Get Order History
- Get Trade History
- Set DCP (Classic)
- Get DCP (Classic)

### Pro REST — Positions (`4`)
Visible operation pages:
- Get Position List (UTA)
- Get Positions History (UTA)
- Get Account Position Tiers
- Get Private Funding Fee History

### Pro REST — VIP Lending (`3`)
Visible operation pages:
- Get Collateral Ratio
- Get Loan Info
- Get Accounts

### Pro WebSocket
The reviewed docs exposed:
- Base Info intro page
- `POST /api/v2/bullet-private`
- public channel families: `Kline`, `Ticker`, `Orderbook`, `Trade`
- private channel families: `Order`, `Balance`, `Execution`, `Execution Lite`, `Position`, `Leverage`, `LiquidationWarning`
- request/response style add-cancel-order section with `Add Order` and `Cancel Order`

These WebSocket channel families are important for adapter design, but they are not all ordinary HTTP REST routes and therefore were not all added to the exact HTTP route total above.

### Classic WebSocket
The reviewed docs exposed:
- Base Info intro page
- token endpoints for public/private spot-margin and public/private futures
- separate channel groups for spot trading, margin trading, futures trading, and add/cancel order workflows

### Classic REST — Affiliate (`5`)
Visible operation pages:
- Get Invited
- Get Commission
- Get Trade History
- Get Transaction
- Get Kumining

### Classic REST — Copy Trading (`15`)
Visible operation pages:
- Add Order
- Add Order Test
- Add Take Profit And Stop Loss Order
- Cancel Order By OrderId
- Cancel Order By ClientOid
- Get Max Open Size
- Get Max Withdraw Margin
- Add Isolated Margin
- Remove Isolated Margin
- Modify Isolated Margin Risk Limit
- Modify Isolated Margin Auto-Deposit Status
- Switch Margin Mode
- Modify Cross Margin Leverage
- Get Cross Margin Requirement
- Switch Position Mode

### Classic REST — Convert (`11`)
Visible operation pages:
- Get Convert Symbol
- Get Convert Currencies
- Get Convert Quote
- Add Convert Order
- Get Convert Order Detail
- Get Convert Order History
- Add Convert Limit Order
- Get Convert Limit Quote
- Get Convert Limit Order Detail
- Get Convert Limit Orders
- Cancel Convert Limit Order

## Authentication
Confirmed from the reviewed official authentication page:
- KuCoin private REST requests require:
  - `KC-API-KEY`
  - `KC-API-SIGN`
  - `KC-API-TIMESTAMP`
  - `KC-API-PASSPHRASE`
  - `KC-API-KEY-VERSION`
- `Content-Type: application/json` is required for requests and responses
- optional `X-SITE-TYPE` is used for site/region differentiation on public APIs and may also be required during WebSocket token acquisition when site-specific behavior matters
- signatures use **HMAC-SHA256** over the prehash string `{timestamp + method + endpoint + body}`
- the signature output is then **Base64-encoded**
- the passphrase header is also HMAC-SHA256-encrypted with the API secret and Base64-encoded
- methods must be uppercase in the signature input
- for `GET` / `DELETE`, query parameters must be included in the request URL used for signing
- for `POST`, query-like inputs belong in the JSON request body for signing
- the docs explicitly warn that the URL used for signing must be the **non-URL-encoded original value**

## Parameters and pagination notes
Concrete parameter details directly visible in the reviewed route pages include:

### `GET /api/ua/v1/market/announcement`
Reviewed curl/example text showed:
- `language`
- `type`
- `pageNumber`
- `pageSize`
- `startTime`
- `endTime`

Reviewed response example fields showed classic page-style pagination signals:
- `totalNumber`
- `totalPage`
- `pageNumber`
- `pageSize`
- `list`

### `GET /api/ua/v1/market/ticker`
Reviewed page showed:
- required `tradeType` with values such as `SPOT` and `FUTURES`
- optional `symbol`
- the route returns all symbols when `symbol` is omitted
- response data includes `tradeType`, nanosecond timestamp `ts`, and a `list` of ticker objects

### `POST /api/ua/v1/{accountMode}/order/place`
Reviewed page showed:
- path param `accountMode` with `classic` or `unified`
- optional query param `tradeType` for classic-account use cases
- body fields include at least `tradeType` and optional `clientOid`
- the page prominently documents active-order quotas by account mode and trading dimension

### `GET /api/v1/convert/quote`
Reviewed page showed:
- required `fromCurrency`
- required `toCurrency`
- optional `fromCurrencySize`
- optional `toCurrencySize`
- exactly one of `fromCurrencySize` or `toCurrencySize` must be supplied
- response example includes `quoteId`, `price`, `fromCurrencySize`, `toCurrencySize`, and `validUntill`

### Shared pagination note
The reviewed Pro REST introduction says the Pro API aims to unify pagination logic, but the pages opened in this pass did **not** publish one single global cursor contract for all route families. Pagination and history traversal should therefore be treated as **route-specific** unless a given endpoint page explicitly documents otherwise.

## Response and error notes
Directly confirmed from the reviewed pages:
- successful responses use a JSON envelope with top-level `code` and `data`
- success examples use code `200000`
- route pages consistently document `application/json`
- rate-limit violations return HTTP `429` with KuCoin error code `429000`
- KuCoin also documents a separate **server overload** rate-limit mode that still uses `429000` but may omit personal quota headers

### Gateway timing metadata
The authentication page also documents gateway timing metadata:
- REST response headers: `x-in-time`, `x-out-time`
- optional precision-control request header: `kc-enable-ns`
- WebSocket request/response timing fields: `inTime`, `outTime`
- optional WebSocket precision parameter: `enable_ns`

## Rate limits
Confirmed from the reviewed official rate-limit page:
- KuCoin uses **resource pools** plus **per-endpoint weights**, not a single flat request counter
- pool quotas depend on VIP level
- reviewed examples show:
  - **Unified Account** pool starting at `200/3s` for VIP0
  - **Public** pool starting at `2000/30s` for VIP0
  - **Spot (include Margin)** pool starting at `4000/30s` for VIP0
  - **Futures** pool starting at `2000/30s` for VIP0
- weight is deducted per request and refreshed every **30 seconds**
- reviewed rate-limit headers:
  - `gw-ratelimit-limit`
  - `gw-ratelimit-remaining`
  - `gw-ratelimit-reset`
- public endpoints are IP-limited
- private endpoint pools are generally UID-based
- sub-account and master-account API limits are documented as independent

### WebSocket limits
Reviewed docs explicitly state:
- **Classic API**: up to `800` concurrent connections
- **Pro API**: up to `512` public + `512` private connections per IP (`1024` total)
- **Pro API** connection establishment: `150` new connections per `5` minutes per IP
- client-to-server messages: `100` messages per `10` seconds per connection for both Classic and Pro

## Important usage notes
- The current KuCoin docs should be treated as a **split platform**, not a single uniform API.
- The newer **Pro** surface and older **Classic** surface use different path families and different maturity levels.
- The Pro API introduction explicitly says not to use the current Pro surface in production; fireROUTE adapters should preserve that caution.
- For high-frequency public market data, the docs recommend **WebSocket instead of REST**.
- WebSocket token acquisition and region handling can depend on `X-SITE-TYPE`.
- Signing is sensitive to the exact unencoded endpoint string; signing encoded URLs can break authentication.
- WebSocket sessions should be designed for token rotation / reconnection because tokens last `24h` and connections are expected to drop after that window.
- Route weights vary materially; adapters should not assume all public `GET` endpoints have the same cost.

## fireROUTE normalization notes
- Treat `Pro REST`, `Classic REST`, `Pro WebSocket`, and `Classic WebSocket` as distinct KuCoin surfaces.
- Preserve both `/api/ua/v1/...` and `/api/v1/...` families exactly as documented.
- Preserve KuCoin’s header names verbatim.
- Do not collapse WebSocket token bootstrap routes into generic auth logic; they are operationally important and separately versioned.
- Treat the `100`-route total above as a **conservative exact floor** based on directly visible method-tagged official docs pages, not as the absolute ceiling of everything KuCoin may eventually publish.