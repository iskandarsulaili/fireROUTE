# EXMO

Official pages manually reviewed:
- https://documenter.getpostman.com/view/10287440/SzYXWKPi

## Overview
EXMO’s official Postman-published docs are still live and expose both `v1.1` and legacy `v1` REST surfaces, plus WebSocket and margin sections. The reviewed docs confirm public vs authenticated split, form-urlencoded request bodies in the visible examples, `Key`/`Sign` auth headers for private routes, and the provider’s current request-per-second limits.

What was confirmed from the reviewed docs:
- Current REST bases visible in examples: `https://api.exmo.com/v1.1` and `https://api.exmo.com/v1`
- Public API can be accessed by `GET` or `POST`
- Authenticated API requires authorization and is `POST`-only
- Visible auth headers on private examples: `Key` and `Sign`
- Visible nonce parameter on private examples: `nonce`
- General documented limit: `10` requests/second from one IP address or by a single user
- Wallet API requests are also documented as limited to `10 RPS` per single user

## Confirmed endpoints
The following exact URLs were visible in the reviewed official documentation:

| Method | Path |
|---|---|
| POST | `/v1.1/trades` |
| POST | `/v1.1/order_book` |
| POST | `/v1.1/ticker` |
| POST | `/v1.1/pair_settings` |
| POST | `/v1.1/currency` |
| POST | `/v1.1/margin/user/trade/list` |
| POST | `/v1.1/margin/trades` |
| POST | `/v1.1/margin/liquidation/feed` |
| POST | `/v1/trades` |
| POST | `/v1/order_book` |
| POST | `/v1/ticker` |
| POST | `/v1/withdraw_crypt` |
| POST | `/v1/withdraw_get_txid` |

## Authentication
- Public API routes do not require authorization.
- Authenticated, Excode, Wallet, and Margin surfaces require authorization.
- The reviewed private examples explicitly show headers:
  - `Key: <your_api_key>`
  - `Sign: <your_sign>`
- The reviewed private examples also show a body parameter:
  - `nonce`
- The visible request bodies are `application/x-www-form-urlencoded`.

## Parameters and request notes
Examples in the reviewed docs confirm these concrete request parameters:
- Public market routes:
  - `pair`
  - `limit`
- Private wallet example:
  - `amount`
  - `currency`
  - `address`
  - `invoice`
  - `transport`
  - `nonce`
- Private TXID lookup example:
  - `task_id`

The docs also state:
- `pair` accepts one or several currency pairs separated by commas
- `order_book.limit` defaults to `100` and has max `1000`

## Response and error notes
The reviewed Postman pages visibly return:
- JSON response bodies for market and wallet examples
- Standard `200 OK` example tabs
- Private workflow responses such as `task_id` for withdrawals

## Important usage notes
- The docs still expose both `v1.1` and legacy `v1` route families; do not mix them blindly.
- The Postman docs visibly include separate sections for Public API, Authenticated API, Excode API, Wallet API, Margin API, and WebSocket.
- The docs present public endpoints as callable via GET or POST, but the reviewed code examples primarily use `POST` with form-urlencoded bodies.
- If implementing fireROUTE support, keep version-specific route mapping explicit because similarly named endpoints exist across `v1.1` and `v1`.