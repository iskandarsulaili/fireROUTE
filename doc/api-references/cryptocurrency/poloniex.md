# Poloniex

Official pages manually reviewed:
- https://docs.poloniex.com
- https://api-docs.poloniex.com/spot/api/
- https://api-docs.poloniex.com/spot/api/public/reference-data
- https://api-docs.poloniex.com/spot/api/public/market-data
- https://api-docs.poloniex.com/spot/api/public/margin
- https://api-docs.poloniex.com/spot/api/private/account
- https://api-docs.poloniex.com/spot/api/private/subaccount
- https://api-docs.poloniex.com/spot/api/private/wallet
- https://api-docs.poloniex.com/spot/api/private/margin
- https://api-docs.poloniex.com/spot/api/private/order
- https://api-docs.poloniex.com/spot/api/private/smart-order
- https://api-docs.poloniex.com/spot/api/private/order-history
- https://api-docs.poloniex.com/spot/api/private/trade
- https://api-docs.poloniex.com/spot/websocket/
- https://api-docs.poloniex.com/spot/error-code

## Overview
Poloniex’s current first-party documentation is live at `api-docs.poloniex.com` and documents both Spot REST and Spot WebSocket APIs.

Confirmed from the reviewed official docs:
- REST base URL: `https://api.poloniex.com/`
- Spot WebSocket public base: `wss://ws.poloniex.com/ws/public`
- Spot WebSocket private base: `wss://ws.poloniex.com/ws/private`
- Public HTTP requests do not require authentication.
- Private HTTP requests use HMAC-SHA256 request signing.
- All reviewed WebSocket messages are JSON-encoded.
- The currently browsable Spot REST reference exposes **70** directly documented HTTP endpoints across public reference-data, public market-data, public margin, accounts, subaccounts, wallets, margin, orders, smart orders, order history, and trades.
- Method mix confirmed from the reviewed endpoint pages: **49 GET**, **9 POST**, **4 PUT**, **8 DELETE**.

## Authentication
Confirmed from the official REST overview:
- Public endpoints do **not** require API signature authentication.
- Private endpoints require HMAC-SHA256 signed requests.
- Required header fields shown in the docs:
  - `key`
  - `signTimestamp`
  - `signature`
- Optional header fields shown in the docs:
  - `signatureMethod` (example: `hmacSHA256`)
  - `signatureVersion` (example: `1`)
  - `recvWindow`
- The signature string is built from:
  1. HTTP method
  2. request path
  3. sorted, URL/UTF-8-encoded parameters or request body context depending on the request type
- The docs explicitly note:
  - `POST` and `DELETE` requests should use `application/json`
  - `400` can be returned when `signTimestamp` is more than one second from Poloniex system time
  - `408` can be returned when the optional `recvWindow` threshold is breached

## Confirmed REST endpoints

### Public reference data
| Method | Path |
|---|---|
| GET | `/markets` |
| GET | `/markets/{symbol}` |
| GET | `/currencies` |
| GET | `/currencies/{currency}` |
| GET | `/v2/currencies` |
| GET | `/v2/currencies/{currency}` |
| GET | `/timestamp` |

### Public market data
| Method | Path |
|---|---|
| GET | `/markets/price` |
| GET | `/markets/{symbol}/price` |
| GET | `/markets/markPrice` |
| GET | `/markets/{symbol}/markPrice` |
| GET | `/markets/{symbol}/markPriceComponents` |
| GET | `/markets/{symbol}/orderBook` |
| GET | `/markets/{symbol}/candles` |
| GET | `/markets/{symbol}/trades` |
| GET | `/markets/ticker24h` |
| GET | `/markets/{symbol}/ticker24h` |

### Public margin
| Method | Path |
|---|---|
| GET | `/markets/collateralInfo` |
| GET | `/markets/{currency}/collateralInfo` |
| GET | `/markets/borrowRatesInfo` |

### Accounts
| Method | Path |
|---|---|
| GET | `/accounts` |
| GET | `/accounts/balances` |
| GET | `/accounts/{id}/balances` |
| GET | `/accounts/activity` |
| POST | `/accounts/transfer` |
| GET | `/accounts/transfer` |
| GET | `/accounts/transfer/{id}` |
| GET | `/feeinfo` |
| GET | `/accounts/interest/history` |

### Subaccounts
| Method | Path |
|---|---|
| GET | `/subaccounts` |
| GET | `/subaccounts/balances` |
| GET | `/subaccounts/{id}/balances` |
| POST | `/subaccounts/transfer` |
| GET | `/subaccounts/transfer` |
| GET | `/subaccounts/transfer/{id}` |

### Wallets
| Method | Path |
|---|---|
| GET | `/wallets/addresses` |
| GET | `/wallets/activity` |
| POST | `/wallets/address` |
| POST | `/wallets/withdraw` |
| POST | `/v2/wallets/withdraw` |

### Private margin
| Method | Path |
|---|---|
| GET | `/margin/accountMargin` |
| GET | `/margin/borrowStatus` |
| GET | `/margin/maxSize` |

### Orders
| Method | Path |
|---|---|
| POST | `/orders` |
| POST | `/orders/batch` |
| PUT | `/orders/{id}` |
| PUT | `/orders/cid:{clientOrderId}` |
| GET | `/orders` |
| GET | `/orders/{id}` |
| GET | `/orders/cid:{clientOrderId}` |
| DELETE | `/orders/{id}` |
| DELETE | `/orders/cid:{clientOrderId}` |
| DELETE | `/orders/cancelByIds` |
| DELETE | `/orders` |
| POST | `/orders/killSwitch` |
| GET | `/orders/killSwitchStatus` |

### Smart orders
| Method | Path |
|---|---|
| POST | `/smartorders` |
| PUT | `/smartorders/{id}` |
| PUT | `/smartorders/cid:{clientOrderId}` |
| GET | `/smartorders` |
| GET | `/smartorders/{id}` |
| GET | `/smartorders/cid:{clientOrderId}` |
| DELETE | `/smartorders/{id}` |
| DELETE | `/smartorders/cid:{clientOrderId}` |
| DELETE | `/smartorders/cancelByIds` |
| DELETE | `/smartorders` |

### Historical order lookups
| Method | Path |
|---|---|
| GET | `/orders/history` |
| GET | `/smartorders/history` |

### Trade history
| Method | Path |
|---|---|
| GET | `/trades` |
| GET | `/orders/{id}/trades` |

## Parameters and request notes
Confirmed from the reviewed endpoint pages:
- Spot symbols use the format `<base_currency>_<quote_currency>` such as `BTC_USDT`.
- Public order-book and candle routes are symbol-scoped and expose optional market-depth / interval query parameters depending on the endpoint.
- `GET /accounts/balances` accepts optional `accountType`; current docs say `SPOT` is the only supported value.
- `GET /accounts/activity` supports `startTime`, `endTime`, `activityType`, `limit`, `from`, `direction`, and `currency` filters.
- `GET /wallets/activity` requires `start` and `end` timestamps and accepts optional `activityType`.
- `POST /orders` documents these major request fields: `symbol`, `side`, `timeInForce`, `type`, `accountType`, `price`, `quantity`, `amount`, `clientOrderId`, `allowBorrow`, `stpMode`, and `slippageTolerance`.
- `POST /orders/batch` allows up to **20** orders in one request.
- `POST /smartorders` documents `STOP`, `STOP_LIMIT`, `TRAILING_STOP`, and `TRAILING_STOP_LIMIT` behaviors plus `stopPrice`, `trailingOffset`, `limitOffset`, and `operator` fields.
- The docs state `clientOrderId` values may be up to **64 characters** and may only contain `A-Z`, `a-z`, `0-9`, `_`, and `-`.
- Wallet address docs note that some currencies rely on a shared deposit address plus a `paymentID`; the reviewed docs tell clients to check `/currencies` for `mainAccount` behavior on those assets.
- The currently reviewed docs still expose parallel `v2` currency and withdrawal paths alongside the main spot path family.

## Rate limits
Confirmed from the official Spot REST overview and Spot WebSocket overview:
- Market-related REST interfaces are rate-limited by **IP**.
- Transaction- and account-related REST interfaces are rate-limited by **UID**.
- The official rate-limit table is tiered by VIP level (`VIP0`, `VIP1-2`, `VIP3-4`, `VIP5-6`, `VIP7-9`).
- Reviewed examples from the official table:
  - `POST /orders`: `50 / 75 / 100 / 150 / 200`
  - `POST /orders/batch`: `10 / 15 / 20 / 30 / 40`
  - `GET /orders`: `50 / 75 / 100 / 150 / 200`
  - `DELETE /orders/cancelByIds`: `10 / 15 / 20 / 30 / 40`
  - `GET /accounts`: `50 / 75 / 100 / 150 / 200`
  - `GET /accounts/activity`: `10 / 15 / 20 / 30 / 40`
- Spot WebSocket restrictions documented on the official overview page:
  - a single IP is limited to **2000 simultaneous connections** on the public endpoint and **2000** on the private endpoint
  - each WebSocket connection is limited to **500 requests per second**
  - clients must send a message or `ping` at least every **30 seconds** or the session may be terminated without warning

## Pagination, archival, and response-format notes
Confirmed from the reviewed official pages:
- REST responses are JSON.
- WebSocket messages are JSON.
- `GET /accounts/activity` uses cursor-like `from` plus `direction` (`PRE` or `NEXT`) pagination and documents default `limit` `100` with maximum `1000`.
- `GET /orders/history` uses `from` plus `direction`, documents default `limit` `500` with maximum `1000`, and restricts the `startTime`/`endTime` window to **30 days**.
- `GET /orders/history` also notes canceled orders older than **7 days** are archived, while the rest of the order history is archived before **90 days** from current time.
- `GET /trades` uses `from` plus `direction`, documents default `limit` `500` with maximum `1000`, and restricts the `startTime`/`endTime` window to **180 days**.
- `GET /trades` identifies `pageId` as the globally unique trade ID that can be reused in the `from` parameter.
- Wallet and transfer history routes are timestamp-filtered rather than page-number based.

## Errors
Confirmed from the official error-code page and auth overview:
- General error codes shown on the current docs include:
  - `500` `Internal System Error`
  - `603` `Internal Request Timeout`
  - `601` `Invalid Parameter`
  - `415` `System Error`
  - `602` `Missing Required Parameters`
- Trading errors shown on the current docs include:
  - `10040` `Invalid symbol`
  - `10041` `Symbol frozen for trading`
  - `24106` `Invalid market depth`
  - `24201` `Service busy. Try again later`
- Order errors shown on the current docs include:
  - `21301` `Order not found`
  - `21304` `Order is filled`
  - `21305` `Order is canceled`
  - `21312` `Client orderId already exists`
  - `21314` `Max limit of open orders (2000) exceeded`
- Auth timing errors called out on the overview page include:
  - `400` when `signTimestamp` drifts too far from system time
  - `408` when `recvWindow` is exceeded

## WebSocket usage notes
Confirmed from the official Spot WebSocket overview:
- Public and private subscriptions are split across different WebSocket base URLs.
- Supported control messages include `ping`, `pong`, `subscribe`, `unsubscribe`, `unsubscribe_all`, and `list_subscriptions`.
- The current sidebar groups channels into public `Reference Data` and `Market Data`, plus authenticated `Authentication`, `Orders`, `Balances`, and `Trade requests` sections.

## Important usage notes
- The current Poloniex docs expose a much broader official surface than the prior thin file captured; the provider is not limited to a handful of order routes.
- fireROUTE adapters should keep Poloniex’s HMAC header names and newline-based signing flow distinct from other exchange auth schemes.
- Treat `cid:{clientOrderId}` paths as first-class documented route variants; the official docs repeatedly publish both numeric-ID and client-order-ID forms.
- Preserve Poloniex’s cursor-style `from` + `direction` traversal on activity, order-history, and trade-history endpoints rather than assuming page-number pagination.
- Preserve the split between current primary routes and still-documented `v2` currency / withdrawal routes because both are present in the official reference.
