# Indodax

Official pages manually reviewed:
- https://raw.githubusercontent.com/btcid/indodax-official-api-docs/master/README.md
- https://raw.githubusercontent.com/btcid/indodax-official-api-docs/master/Public-RestAPI.md
- https://raw.githubusercontent.com/btcid/indodax-official-api-docs/master/Private-RestAPI.md

## Overview
Indodax’s current first-party API docs are maintained in the official GitHub repository and explicitly state that the documented streams, endpoints, parameters, and payloads are the supported official contract. The reviewed raw Markdown pages confirm separate public REST, private REST, WebSocket, dead-man-switch, and trade-API surfaces.

Confirmed from the reviewed official docs:
- Public REST base: `https://indodax.com`
- Private REST base: `https://indodax.com/tapi`
- The docs also list official Market Data WebSocket and Private WebSocket documents in the same repo
- Manual route count confirmed from the reviewed public and private docs: **18**

## Confirmed endpoints
| Method | Path / method |
|---|---|
| GET | `/api/server_time` |
| GET | `/api/pairs` |
| GET | `/api/price_increments` |
| GET | `/api/summaries` |
| GET | `/api/ticker/{pair_id}` |
| GET | `/api/ticker_all` |
| GET | `/api/trades/{pair_id}` |
| GET | `/api/depth/{pair_id}` |
| GET | `/tradingview/history_v2` |
| POST | `/tapi` with `method=getInfo` |
| POST | `/tapi` with `method=transHistory` |
| POST | `/tapi` with `method=tradeHistory` |
| POST | `/tapi` with `method=openOrders` |
| POST | `/tapi` with `method=orderHistory` |
| POST | `/tapi` with `method=getOrder` |
| POST | `/tapi` with `method=getOrderByClientOrderId` |
| POST | `/tapi` with `method=cancelOrder` |
| POST | `/tapi` with `method=withdrawCoin` |

## Authentication
Confirmed from the official Private REST doc:
- Private requests use the `Key` header for the API key and `Sign` header for the signature.
- Signed endpoints use `HMAC-SHA512` signatures.
- The signature covers the request parameters/payload (`totalParams`) with the API secret.
- Private requests are POST-only and must include `method` plus either a monotonic `nonce` or a `timestamp` with `recvWindow`, depending on the documented request style.
- API keys can be permission-scoped to `view`, `trade`, and `withdraw` actions.

## Parameters and request notes
- Public endpoints return JSON objects or arrays and use millisecond timestamps, except documented OHLC history values which use seconds.
- Public REST is rate-limited to **180 requests/minute**.
- Ticker/trades/depth routes accept optional pair identifiers such as `btcidr`, `ethidr`, or `tenidr`.
- The OHLC history endpoint requires `from`, `to`, `tf`, and `symbol` parameters.

## Response and error notes
- The private docs show a standard error payload with `success: 0`, `error`, and `error_code`.
- Private data is returned newest-first in descending order.
- The private doc explicitly warns that some older methods such as `tradeHistory` and `orderHistory` are scheduled for decommissioning in 2026.

## Important usage notes
- The repo states that undocumented endpoints or payloads are unsupported and should be used at your own risk.
- For fireROUTE, the private API is method-switched through a single `/tapi` POST transport rather than distinct RESTful resource paths, so adapters should preserve the provider’s method field explicitly.
