# BtcTurk

Official pages manually reviewed:
- https://docs.btcturk.com/docs/general-information
- https://docs.btcturk.com/docs/category/public-endpoints
- https://docs.btcturk.com/docs/authentication/authentication-v1

## Overview
BtcTurk’s current first-party docs are live on `docs.btcturk.com` and document public market-data endpoints, authenticated private account/trading endpoints, and WebSocket feeds. The reviewed pages confirm a shared API base of `https://api.btcturk.com`.

Confirmed from the reviewed official docs:
- REST base URL: `https://api.btcturk.com`
- Successful requests return JSON objects
- Pair symbols use formats like `BTCTRY`
- Manual route count confirmed from the official public/private sidebar sections: **17**

## Confirmed endpoints
| Method | Path |
|---|---|
| GET | `/api/v2/server/exchangeinfo` |
| GET | `/api/v2/ticker` |
| GET | `/api/v2/orderbook` |
| GET | `/api/v2/trades` |
| GET | `/api/v2/ohlc` |
| GET | `/v1/klines` |
| GET | `/api/v1/crypto/exchanges` |
| GET | `/api/v1/users/balances` |
| GET | `/api/v1/users/transactions/trade` |
| GET | `/api/v1/users/transactions/fiat` |
| GET | `/api/v1/users/transactions/crypto` |
| GET | `/api/v1/openOrders` |
| GET | `/api/v1/allOrders` |
| GET | `/api/v1/order` |
| POST | `/api/v1/order` |
| DELETE | `/api/v1/order` |
| POST | `/api/v1/users/crypto/declarations` |

## Authentication
Confirmed from the official Authentication V1 page:
- All user-account API calls require authentication.
- Required auth headers are `X-PCK`, `X-Stamp`, and `X-Signature`.
- `X-PCK` is the API public key.
- `X-Stamp` is a nonce and must be the current timestamp in milliseconds.
- `X-Signature` is a Base64-encoded HMAC-SHA256 signature derived from the API secret, API key, and nonce.

## Parameters and request notes
- GET endpoints send parameters in the query string.
- Authentication-related requests must be sent as `application/json`.
- Timestamps are milliseconds everywhere except OHLC graph data, which the docs say uses seconds.
- The public-endpoints category documents dedicated exchange-info, tickers, order-book, trades, OHLC, kline, and crypto-exchange lookup pages.

## Rate limits
- The reviewed pages confirmed that BtcTurk publishes a dedicated private-endpoint `Rate Limits` page.
- A concrete numeric rate table was not directly visible in the pages manually extracted for this pass, so this file records the existence of first-party rate-limit documentation without transcribing exact quotas.

## Response and error notes
- The docs have a dedicated Error Handling section.
- Public and private endpoints are documented as separate route families.
- Exchange status is published separately at `https://status.btcturk.com/`.

## Important usage notes
- fireROUTE adapters should preserve BtcTurk’s public-vs-private split because auth, transport expectations, and data freshness differ across those surfaces.
- The docs also include WebSocket Feed categories that are first-party but not exhaustively enumerated in this file.
