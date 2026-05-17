# NovaDAX

Official pages manually reviewed:
- https://doc.novadax.com/en-US/#introduction

## Overview
NovaDAX’s official docs are currently detailed and usable. The reviewed documentation confirms a shared REST base of `https://api.novadax.com`, a public-vs-private endpoint split, HMAC-based request signing for private APIs, and a broad `/v1` route surface covering symbols, market data, orders, account balance, subaccounts, and wallet operations.

What was confirmed from the reviewed docs:
- Base URL: `https://api.novadax.com`
- Public endpoints cover `Basic information` and `Market data`
- Private endpoints cover `Orders`, `Account`, and `Wallet`
- Private auth headers: `X-Nova-Access-Key`, `X-Nova-Signature`, `X-Nova-Timestamp`
- Signature algorithm: `HMAC-SHA256`
- Total available weight: `6000` per minute
- Weight-usage response header: `X-Nova-Weight-Used`
- Rate-limit failure: HTTP `429`, with docs explicitly noting error code `A1004`
- Manual exact route count confirmed from reviewed docs HTML/examples: **25**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/v1/common/symbols` |
| GET | `/v1/common/symbol` |
| GET | `/v1/common/timestamp` |
| GET | `/v1/market/tickers` |
| GET | `/v1/market/ticker` |
| GET | `/v1/market/depth` |
| GET | `/v1/market/trades` |
| GET | `/v1/market/kline/history` |
| GET | `/v1/orders/get` |
| POST | `/v1/order/create` |
| POST | `/v1/orders/create` |
| POST | `/v1/orders/cancel` |
| GET | `/v1/orders/list` |
| POST | `/v1/orders/batch-create` |
| POST | `/v1/orders/batch-cancel` |
| POST | `/v1/orders/cancel-by-symbol` |
| GET | `/v1/orders/fills` |
| GET | `/v1/account/getBalance` |
| GET | `/v1/account/subs` |
| GET | `/v1/account/subs/balance` |
| GET | `/v1/account/subs/transfer/record` |
| POST | `/v1/account/subs/transfer` |
| POST | `/v1/account/withdraw/coin` |
| POST | `/v1/wallet/withdraw/coin` |
| GET | `/v1/wallet/query/deposit-withdraw` |

## Authentication
The reviewed docs explicitly describe NovaDAX private signing:
- Header `X-Nova-Access-Key`: your access key
- Header `X-Nova-Signature`: HMAC-SHA256 signature
- Header `X-Nova-Timestamp`: current timestamp in milliseconds

### GET signing model
The docs show the request string format:
- `{Request Method}\n{Request URL}\n{Sorted Query Parameters}\n{TimeStamp}`

### POST signing model
The docs show the request string format:
- `{Request Method}\n{Request URL}\n{MD5 Request Body}\n{TimeStamp}`

## Parameters and request notes
Concrete parameters explicitly visible in the reviewed docs include:
- Public market-data parameters:
  - `symbol`
  - `limit`
  - `resolution`
- Private/account parameters visible from signing examples and route contexts:
  - `address`
  - `subaccountNumber`
  - `parentSubaccountNumber`
  - transfer- and withdrawal-related body fields depending on route

The docs clearly distinguish:
- Public APIs: weight counted per IP
- Private APIs: weight counted per UID

## Rate limits and errors
The reviewed docs explicitly state:
- `6000` total available weight per minute
- Every response returns `X-Nova-Weight-Used`
- If the available weight is exhausted, HTTP `429` is returned
- The docs also specifically mention error code `A1004` when rate limits are exceeded

## Important usage notes
- The same docs page covers all major REST groups: Basic Information, Market Data, Orders, Account, Wallet, and WebSocket.
- Do not reuse the GET signing string for POST routes; the POST signature uses the MD5 hash of the request body.
- The reviewed docs use concrete examples such as `GET /v1/orders/get` and `POST /v1/order/create`, so keep route spelling exact when mapping adapters.
- Weight-based throttling matters more than simple request counting; endpoints consume different weights according to resource consumption.