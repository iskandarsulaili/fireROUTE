# Binance

Official docs manually reviewed:
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/account-endpoints
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits
- https://developers.binance.com/docs/binance-spot-api-docs/rest-api/request-security

## Overview
Binance’s current official Spot REST API docs expose multiple interchangeable base hosts for `/api/v3` plus a separate public market-data host.

Confirmed from the reviewed official docs:
- Base endpoints for Spot REST:
  - `https://api.binance.com`
  - `https://api-gcp.binance.com`
  - `https://api1.binance.com`
  - `https://api2.binance.com`
  - `https://api3.binance.com`
  - `https://api4.binance.com`
- Public market-data-only host: `https://data-api.binance.vision`
- Response format: JSON by default
- Binance explicitly supports `HMAC`, `RSA`, and `Ed25519` API keys
- Timestamps are milliseconds by default and can also be passed in microseconds
- Manual route count confirmed from the reviewed REST endpoint pages: **49** unique method/path pairs
  - general endpoints page: **4**
  - market-data endpoints page: **16**
  - trading endpoints page: **15**
  - account endpoints page: **14**

## Confirmed endpoint families
The reviewed Spot REST docs currently organize endpoints into:
- `General endpoints`
- `Market Data endpoints`
- `Trading endpoints`
- `Account Endpoints`

## Concrete endpoints confirmed from the reviewed docs
### General endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v3/ping` | test connectivity |
| GET | `/api/v3/time` | get server time |
| GET | `/api/v3/exchangeInfo` | trading rules and symbol info |
| GET | `/api/v3/executionRules` | execution rules |

### Market data endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v3/depth` | order book |
| GET | `/api/v3/trades` | recent trades |
| GET | `/api/v3/historicalTrades` | historical trades |
| GET | `/api/v3/historicalBlockTrades` | historical block trades |
| GET | `/api/v3/aggTrades` | aggregate trades |
| GET | `/api/v3/klines` | candlesticks |
| GET | `/api/v3/uiKlines` | UI-friendly klines |
| GET | `/api/v3/avgPrice` | current average price |
| GET | `/api/v3/ticker/24hr` | 24-hour ticker stats |
| GET | `/api/v3/ticker/tradingDay` | trading-day ticker stats |
| GET | `/api/v3/ticker/price` | symbol price ticker |
| GET | `/api/v3/ticker/bookTicker` | best bid/ask |
| GET | `/api/v3/ticker` | rolling-window ticker |
| GET | `/api/v3/referencePrice` | reference price |
| GET | `/api/v3/referencePrice/calculation` | reference-price calculation details |

### Trading endpoints
| Method | Path | Notes |
|---|---|---|
| POST | `/api/v3/order` | place new order |
| POST | `/api/v3/order/test` | validate order without matching |
| DELETE | `/api/v3/order` | cancel order |
| DELETE | `/api/v3/openOrders` | cancel all open orders for a symbol |
| POST | `/api/v3/order/cancelReplace` | cancel/replace order |
| PUT | `/api/v3/order/amend/keepPriority` | amend order while keeping priority |
| POST | `/api/v3/order/oco` | deprecated OCO order path still documented |
| POST | `/api/v3/orderList/oco` | create OCO order list |
| POST | `/api/v3/orderList/oto` | create OTO order list |
| POST | `/api/v3/orderList/otoco` | create OTOCO order list |
| POST | `/api/v3/orderList/opo` | create OPO order list |
| POST | `/api/v3/orderList/opoco` | create OPOCO order list |
| DELETE | `/api/v3/orderList` | cancel order list |
| POST | `/api/v3/sor/order` | smart-order-routing order |
| POST | `/api/v3/sor/order/test` | test SOR order |

### Account endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v3/account` | account information |
| GET | `/api/v3/order` | query order status |
| GET | `/api/v3/openOrders` | current open orders |
| GET | `/api/v3/allOrders` | all account orders |
| GET | `/api/v3/orderList` | query order list |
| GET | `/api/v3/allOrderList` | all order lists |
| GET | `/api/v3/openOrderList` | open order lists |
| GET | `/api/v3/myTrades` | account trades |
| GET | `/api/v3/rateLimit/order` | unfilled-order count info |
| GET | `/api/v3/myPreventedMatches` | prevented matches |
| GET | `/api/v3/myAllocations` | allocations |
| GET | `/api/v3/account/commission` | commission rates |
| GET | `/api/v3/order/amendments` | order amendments |
| GET | `/api/v3/myFilters` | account filters |

## Authentication and request security
Confirmed from the reviewed request-security page:
- endpoints without an explicit security type are `NONE` (public)
- secure endpoint types include `TRADE`, `USER_DATA`, and `USER_STREAM`
- except for `NONE`, secure endpoints are generally treated as **SIGNED** requests
- secure endpoints require a valid API key
- SIGNED endpoints require a `signature`
- SIGNED endpoints also require a `timestamp`
- `recvWindow` is used on many signed endpoints and account/trading pages show it can be up to `60000`

Security types explicitly documented on the reviewed page:
- `NONE` — public market data
- `TRADE` — placing/canceling orders
- `USER_DATA` — private account/order/trade information
- `USER_STREAM` — user data stream management

## Parameters, pagination, and payload notes
Confirmed from the reviewed pages:
- the general API page documents optional `X-MBX-TIME-UNIT:MICROSECOND` for microsecond timestamps in responses
- request timestamps such as `startTime`, `endTime`, and `timestamp` may be sent in milliseconds or microseconds
- `exchangeInfo` supports optional query params including `symbol`, `symbols`, `permissions`, and `symbolStatus`
- market-data endpoints use route-specific query params such as `symbol`, `limit`, and time windows
- the order-book endpoint has weight that scales with `limit`
- trading/account endpoints use detailed request parameters such as `symbol`, `side`, `type`, `quantity`, `price`, `timestamp`, `recvWindow`, and client-order IDs

The reviewed Spot REST pages do not use one generic page-number pagination model; list/search/history endpoints use symbol/time/ID/limit parameters specific to each route.

## Rate limits and timeout notes
Confirmed from the reviewed `LIMITS` page:
- `/api/v3/exchangeInfo` includes `rateLimits` objects for `RAW_REQUESTS`, `REQUEST_WEIGHT`, and `ORDERS`
- each response includes `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` headers showing current IP weight usage
- exceeding request rate limits returns **HTTP 429**
- repeated violations and failure to back off can trigger automated **HTTP 418 IP bans**
- IP bans scale from **2 minutes to 3 days** for repeat offenders
- `Retry-After` is returned with 429 and 418 responses
- limits are based on **IPs, not API keys**
- successful order responses include `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` headers for unfilled-order counting
- if unfilled-order limits are exceeded, Binance also returns **429** with `Retry-After`

Confirmed from the reviewed general API information page:
- API processing timeout is **10 seconds**
- if the matching engine takes longer, Binance can return `-1007 TIMEOUT` with “Send status unknown; execution status unknown.”

## Important usage notes
- Binance explicitly recommends `api1`–`api4` for better performance but notes they are less stable than the main hosts.
- Public market-data integrations should prefer `https://data-api.binance.vision` where applicable.
- The docs distinguish security type per endpoint; fireROUTE should preserve whether a route is public, trade-signed, or user-data-signed.
- Weight is route-specific rather than flat per request, so adapter logic should preserve endpoint cost awareness.