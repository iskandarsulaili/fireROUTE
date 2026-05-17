# Bitfinex

Official pages manually reviewed:
- https://docs.bitfinex.com/docs/introduction
- https://docs.bitfinex.com/docs/requirements-and-limitations
- https://docs.bitfinex.com/reference/rest-public-ticker
- https://docs.bitfinex.com/reference/rest-auth-wallets

## Overview
Bitfinex’s current official API docs are live on `docs.bitfinex.com` and document both REST and WebSocket APIs. The reviewed pages confirm separate public and authenticated REST surfaces, a public REST base on `https://api-pub.bitfinex.com/v2`, an authenticated REST base on `https://api.bitfinex.com/v2`, and corresponding WebSocket domains.

Confirmed from the reviewed official docs:
- Public REST base: `https://api-pub.bitfinex.com/v2`
- Authenticated REST base: `https://api.bitfinex.com/v2`
- WebSocket domains called out in rate-limit docs: `wss://api-pub.bitfinex.com/` and `wss://api.bitfinex.com`
- API version recommended by Bitfinex: V2
- Manual route count confirmed from the live sidebar plus sampled endpoint pages: **41**

## Confirmed endpoints
### Public REST routes
| Method | Path | Notes |
|---|---|---|
| GET | `/ticker/{symbol}` | sampled page reviewed directly |
| GET | `/tickers` | visible in live public-endpoints sidebar |
| GET | `/tickers/hist` | listed as “Tickers History” in the public-endpoints sidebar |
| GET | `/trades/{symbol}/hist` | trades endpoint family confirmed by public-endpoints sidebar |
| GET | `/book/{symbol}/{precision}` | order-book endpoint family confirmed by sidebar |
| GET | `/stats1/{key}:{size}:{symbol}:{side}/{section}` | stats endpoint family |
| GET | `/candles/{candle}/{section}` | candles endpoint family |
| GET | `/status/{type}` | derivatives status family |
| GET | `/liquidations/{symbol}/hist` | liquidations family |
| GET | `/leaderboard/{category}` | leaderboards family |
| GET | `/calc/trade/avg` | market average price calculator |
| POST | `/calc/fx` | foreign-exchange-rate calculator |

### Authenticated REST routes
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/r/wallets` | sampled page reviewed directly |
| POST | `/auth/r/orders` | retrieve orders |
| POST | `/auth/w/order/submit` | submit order |
| POST | `/auth/w/order/update` | update order |
| POST | `/auth/w/order/cancel` | cancel order |
| POST | `/auth/w/order/cancel/multi` | cancel multiple orders |
| POST | `/auth/r/orders/hist` | order history |
| POST | `/auth/r/trades/hist` | trade history |
| POST | `/auth/r/ledgers/hist` | ledgers |
| POST | `/auth/r/info/margin/{key}` | margin info family |
| POST | `/auth/r/positions` | retrieve positions |
| POST | `/auth/r/positions/hist` | positions history |

## Parameters and request notes
Confirmed from the reviewed public `Ticker` page and `Requirements and Limitations` page:
- `symbol` is a path parameter; reviewed docs use trading-pair example `tBTCUSD`
- Public endpoints are available without a Bitfinex account
- The ticker response is a compact positional array, not a named-object schema
- The sampled wallets page returns array-based wallet rows rather than verbose JSON objects
- Reviewed public docs show response tabs including `200`, `400`, `404`, `429`, and `500`

## Authentication
- Public REST and public WebSocket access do not require a Bitfinex account
- Authenticated API usage requires a Bitfinex account plus API key and API secret created in the Bitfinex account UI
- The reviewed docs explicitly distinguish read-only vs write permissions when creating keys
- Authenticated REST and WebSocket instructions are linked from the official requirements page; the authenticated surface is account-scoped and permission-gated

## Rate limits and errors
Confirmed from the official requirements page:
- REST API rate limits vary by endpoint: **10 to 90 requests per minute** depending on the endpoint
- If an IP is rate limited, Bitfinex blocks it for **60 seconds**
- The documented REST error body for rate limiting is JSON containing `{"error": "ERR_RATE_LIMIT"}`
- Authenticated WebSocket: no more than **5 authenticated connections per 15 seconds** on `wss://api.bitfinex.com`
- Public WebSocket: no more than **20 connections per minute** on `wss://api-pub.bitfinex.com/`
- WebSocket connections may subscribe to up to **25 channels per connection**

## Response format notes
- Bitfinex V2 heavily uses positional arrays instead of verbose object-per-field responses
- REST calculator endpoints include both GET and POST families depending on the operation
- Both REST and WebSocket APIs are documented as first-class surfaces; Bitfinex expects integrators to keep a local model updated from stream snapshots and deltas for speed-sensitive use cases

## Important usage notes
- Bitfinex explicitly recommends building on API V2 rather than V1
- The live docs sidebar confirms a large authenticated route surface beyond the sampled paths above, including wallets, orders, trades, ledgers, positions, funding, movements, users, alerts, and more
- Because responses are often compact arrays rather than self-describing objects, fireROUTE adapters should preserve provider-native payloads where fidelity matters
