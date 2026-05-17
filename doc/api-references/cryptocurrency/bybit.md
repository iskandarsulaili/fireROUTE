# Bybit

Official docs manually reviewed:
- https://bybit-exchange.github.io/docs/v5/intro
- https://bybit-exchange.github.io/docs/v5/guide
- https://bybit-exchange.github.io/docs/v5/market/tickers
- https://bybit-exchange.github.io/docs/v5/order/create-order
- https://bybit-exchange.github.io/docs/v5/rate-limit

## Overview
Bybit’s current official V5 docs expose a unified API surface for spot, derivatives, options, account, asset, user, loan, broker, and related trading products.

Confirmed from the reviewed official docs:
- Mainnet base URLs:
  - `https://api.bybit.com`
  - `https://api.bytick.com`
- Testnet base URL: `https://api-testnet.bybit.com`
- Regional mainnet hosts are documented for certain users, including `api.bybit.nl`, `api.bybit.tr`, `api.bybit.kz`, `api.bybitgeorgia.ge`, and `api.bybit.ae`
- Base path pattern: `{host}/v5/{module}/...`
- Response format: JSON
- Auth for private routes: `X-BAPI-API-KEY`, `X-BAPI-SIGN`, `X-BAPI-TIMESTAMP`, and typically `X-BAPI-RECV-WINDOW`
- Manual route count confirmed from the reviewed visible `Market` and `Trade` groups: **35** routes
  - Market group: **22** visible operations
  - Trade group: **13** visible operations

## Confirmed endpoint families
The reviewed V5 docs currently expose these top-level API groups in navigation:
- `Bybit Platform`
- `Market`
- `Trade`
- `Spot Margin Trade`
- `Position`
- `Account`
- `Asset`
- `User`
- `Spread Trading`
- `RFQ Trading`
- `Affiliate`
- `Crypto Loan`
- `Institutional Loan`
- `Broker`
- `Finance`
- `Bybit Card`
- `Web3`
- `SBE`
- `WebSocket Stream`
- `Rate Limit`

## Concrete endpoints confirmed from the reviewed docs
### Market
| Method | Path | Notes |
|---|---|---|
| GET | `/v5/market/time` | server time |
| GET | `/v5/market/kline` | candlesticks |
| GET | `/v5/market/mark-price-kline` | mark-price klines |
| GET | `/v5/market/index-price-kline` | index-price klines |
| GET | `/v5/market/premium-index-price-kline` | premium-index klines |
| GET | `/v5/market/instruments-info` | symbol/instrument metadata |
| GET | `/v5/market/orderbook` | order book |
| GET | `/v5/market/rpi-orderbook` | RPI order book |
| GET | `/v5/market/tickers` | ticker snapshot |
| GET | `/v5/market/funding/history` | funding-rate history |
| GET | `/v5/market/recent-trade` | recent public trades |
| GET | `/v5/market/open-interest` | open interest |
| GET | `/v5/market/historical-volatility` | historical volatility |
| GET | `/v5/market/insurance` | insurance fund data |
| GET | `/v5/market/risk-limit` | risk-limit data |
| GET | `/v5/market/delivery-price` | delivery price |
| GET | `/v5/market/long-short-ratio` | long/short ratio |
| GET | `/v5/market/index-price-components` | index components |
| GET | `/v5/market/order-price-limit` | order price limits |
| GET | `/v5/market/adl-alert` | ADL alert |

### Trade
| Method | Path | Notes |
|---|---|---|
| POST | `/v5/order/create` | place order |
| POST | `/v5/order/amend` | amend order |
| POST | `/v5/order/cancel` | cancel order |
| GET | `/v5/order/realtime` | open and closed orders |
| POST | `/v5/order/cancel-all` | cancel all orders |
| GET | `/v5/order/history` | order history |
| GET | `/v5/execution/list` | trade history |
| POST | `/v5/order/create-batch` | batch place |
| POST | `/v5/order/amend-batch` | batch amend |
| POST | `/v5/order/cancel-batch` | batch cancel |
| GET | `/v5/order/spot-borrow-check` | spot borrow quota |
| POST | `/v5/order/disconnected-cancel-all` | set DCP |
| POST | `/v5/order/pre-check` | pre-check order |

## Authentication
Confirmed from the reviewed Integration Guidance and request examples:
- create API keys from Bybit mainnet or testnet
- private REST requests use header-based authentication
- the reviewed examples show these headers:

```http
X-BAPI-API-KEY: <key>
X-BAPI-SIGN: <signature>
X-BAPI-TIMESTAMP: <milliseconds>
X-BAPI-RECV-WINDOW: 5000
```

- market-data routes are public; order-management routes are private

## Parameters and request notes
Confirmed from the reviewed docs:
- many V5 routes require a `category` parameter such as `spot`, `linear`, `inverse`, or `option`
- `GET /v5/market/tickers` requires `category`; for `option`, either `symbol` or `baseCoin` must also be sent
- `POST /v5/order/create` uses parameters such as `category`, `symbol`, `side`, `orderType`, `qty`, `price`, `timeInForce`, and optional trigger/TP/SL fields
- `POST /v5/order/create` supports `Limit` and `Market` orders, plus conditional order behavior via `triggerPrice`
- supported `timeInForce` values explicitly listed on the reviewed page: `GTC`, `IOC`, `FOK`, `PostOnly`, `RPI`
- the order-create page documents product-specific behavior for spot, margin, perpetuals, futures, and options on the same route

## Rate limits
Confirmed from the reviewed rate-limit page:
- default HTTP IP limit: **600 requests within a 5-second window per IP**
- exceeding the HTTP IP limit can trigger `403, access too frequent`; docs say to stop requests and wait at least **10 minutes**
- WebSocket connection guidance includes:
  - no more than **500 connections within 5 minutes**
  - no more than **1,000 market-data connections per IP**, counted separately for Spot, Linear, Inverse, and Options
- API rate limiting is also enforced on a **rolling per-second, per-UID** basis
- the docs explicitly document response headers:
  - `X-Bapi-Limit-Status`
  - `X-Bapi-Limit`
  - `X-Bapi-Limit-Reset-Timestamp`
- the JSON error example for hitting endpoint limits uses `retCode: 10006` / `retMsg: Too many visits!`

## Important usage notes
- Bybit explicitly states that IPs located in the US or Mainland China are restricted and can return `403 Forbidden`.
- V5 is intentionally unified; fireROUTE should preserve the `category` dimension rather than splitting spot and derivatives into completely separate adapters.
- The order-create route is asynchronous; the reviewed docs recommend using WebSocket to confirm final order status.
- Bybit documents region-specific mainnet hosts, so fireROUTE integrations should avoid hard-coding only `api.bybit.com` for all users.