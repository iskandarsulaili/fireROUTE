# Kraken

Official docs manually reviewed:
- https://docs.kraken.com/api/docs/rest-api/get-ticker-information/
- https://docs.kraken.com/api/docs/rest-api/add-order/
- https://docs.kraken.com/api/docs/guides/spot-rest-auth/
- https://docs.kraken.com/api/docs/guides/spot-rest-ratelimits/

## Overview
Kraken’s current official API Center exposes a Spot REST API with public market-data routes plus authenticated account, trading, funding, subaccount, earn, and transparency endpoints.

Confirmed from the reviewed official docs:
- Base URL: `https://api.kraken.com/0`
- Public route pattern: `/public/...`
- Private route pattern: `/private/...`
- Response format: JSON
- Auth headers for private routes: `API-Key` and `API-Sign`
- Manual route count confirmed from the reviewed Spot REST sidebar: **59** routes
  - Market Data: **11**
  - Account Data: **19**
  - Trading: **9**
  - Funding: **10**
  - Subaccounts: **2**
  - Earn: **6**
  - Transparency: **2**

## Confirmed endpoint families
- `Market Data`
- `Account Data`
- `Trading`
- `Funding`
- `Subaccounts`
- `Earn`
- `Transparency`

## Concrete endpoints confirmed from the reviewed docs
### Public market data
| Method | Path | Notes |
|---|---|---|
| GET | `/public/Time` | server time |
| GET | `/public/SystemStatus` | system status |
| GET | `/public/Assets` | asset info |
| GET | `/public/AssetPairs` | tradable asset pairs |
| GET | `/public/Ticker` | ticker information |
| GET | `/public/OHLC` | OHLC data |
| GET | `/public/Depth` | order book |
| GET | `/public/Trades` | recent trades |
| GET | `/public/Spread` | recent spreads |

### Private account/trading examples
| Method | Path | Notes |
|---|---|---|
| POST | `/private/Balance` | account balances |
| POST | `/private/OpenOrders` | open orders |
| POST | `/private/ClosedOrders` | closed orders |
| POST | `/private/TradesHistory` | trade history |
| POST | `/private/Ledgers` | ledger info |
| POST | `/private/AddOrder` | place order |
| POST | `/private/AmendOrder` | amend order |
| POST | `/private/CancelOrder` | cancel order |
| POST | `/private/CancelAll` | cancel all orders |
| POST | `/private/GetWebSocketsToken` | WebSocket token |
| POST | `/private/DepositMethods` | deposit methods |
| POST | `/private/WithdrawInfo` | withdrawal information |
| POST | `/private/CreateSubaccount` | create subaccount |
| POST | `/private/Earn/Allocate` | allocate earn funds |

## Authentication
Confirmed from the reviewed Spot REST Authentication guide:
- private endpoints require:
  - `API-Key` header with the public API key
  - `API-Sign` header with the encrypted request signature
  - `nonce` request payload parameter
  - optional `otp` payload parameter when API 2FA is enabled
- the docs explicitly describe `nonce` as an always-increasing unsigned 64-bit integer
- the Add Order examples use JSON request bodies on private routes

## Parameters and request notes
Confirmed from the reviewed docs:
- `GET /public/Ticker` accepts optional `pair`; leaving it blank returns all tradeable pairs
- `GET /public/Ticker` also documents optional `asset_class`, including `tokenized_asset` and `forex`
- `POST /private/AddOrder` requires at least `nonce`, `ordertype`, `type`, `volume`, and `pair`
- reviewed `AddOrder` parameters include `userref`, `cl_ord_id`, `price`, `price2`, `trigger`, `leverage`, `reduce_only`, `stptype`, `oflags`, `timeinforce`, `starttm`, `expiretm`, `deadline`, and `validate`
- supported order types explicitly listed on the reviewed page include `market`, `limit`, `iceberg`, `stop-loss`, `take-profit`, `stop-loss-limit`, `take-profit-limit`, `trailing-stop`, `trailing-stop-limit`, and `settle-position`
- supported `timeinforce` values explicitly listed on the reviewed page: `GTC`, `IOC`, `FOK`, `GTD`

## Rate limits and errors
Confirmed from the reviewed Spot REST Rate Limits guide:
- every REST user has a call counter
- ledger/trade-history calls increase the counter by **4**
- most other REST calls increase the counter by **1**
- reviewed tier table shows:
  - `Intermediate`: max API counter **20**, decay **-0.5/sec**
  - `Pro`: max API counter **20**, decay **-1/sec**
- `AddOrder` and `CancelOrder` are called out as using a different limiter associated with trading-engine limits
- the docs state that rate-limited calls can be restricted for a few seconds or longer if requests continue during the limit window
- master accounts and subaccounts share default trading rate limits based on the master account tier

## Important usage notes
- Kraken’s Spot REST docs cleanly separate public market data from private account/trading/funding workflows; fireROUTE should preserve that boundary.
- `pair` is optional on ticker requests, but omitting it can return all tradable pairs, which can be a very large response.
- The reviewed Add Order page is unusually parameter-rich; adapter layers should not flatten Kraken’s advanced trading options into a minimal spot-only order schema unless clearly documented as lossy.
- Private Kraken routes still rely on nonce-based request signing, so replay-safe timestamp-only signing assumptions from other exchanges do not apply.