# dYdX

Official pages manually reviewed:
- https://docs.dydx.xyz/
- https://docs.dydx.xyz/indexer-client
- https://docs.dydx.xyz/indexer-client/http

## Overview
The current first-party dYdX docs are live on `docs.dydx.xyz`. The reviewed pages clearly distinguish the public **Indexer API** from the authenticated **Node API**. The HTTP Indexer docs expose a current example base of `https://indexer.v4testnet.dydx.exchange/v4` and a large browser-visible set of exact GET paths for account, market, utility, screening, and vault data.

What was confirmed from the reviewed docs:
- Example HTTP base URL: `https://indexer.v4testnet.dydx.exchange/v4`
- Separate first-party docs exist for `HTTP API` and `WebSockets API`
- The Indexer HTTP API is a public data/query surface
- The docs separately point users to `Private Node API` and `Permissioned Keys` for authenticated actions
- Manual exact route count confirmed from reviewed docs HTML: **31** GET paths

## Confirmed endpoint paths
All of the following exact paths were visible in the reviewed official docs HTML/examples under the HTTP Indexer API:

| Method | Path |
|---|---|
| GET | `/v4/addresses/{address}` |
| GET | `/v4/addresses/{address}/subaccountNumber/{subaccountNumber}` |
| GET | `/v4/perpetualPositions` |
| GET | `/v4/assetPositions` |
| GET | `/v4/transfers` |
| GET | `/v4/orders` |
| GET | `/v4/orders/{orderId}` |
| GET | `/v4/fills` |
| GET | `/v4/historical-pnl` |
| GET | `/v4/historicalBlockTradingRewards/{address}` |
| GET | `/v4/historicalTradingRewardAggregations/{address}` |
| GET | `/v4/addresses/{address}/parentSubaccountNumber/{parentSubaccountNumber}` |
| GET | `/v4/perpetualPositions/parentSubaccountNumber` |
| GET | `/v4/assetPositions/parentSubaccountNumber` |
| GET | `/v4/transfers/parentSubaccountNumber` |
| GET | `/v4/orders/parentSubaccountNumber` |
| GET | `/v4/fills/parentSubaccountNumber` |
| GET | `/v4/historical-pnl/parentSubaccountNumber` |
| GET | `/v4/fundingPayments` |
| GET | `/v4/fundingPayments/parentSubaccount` |
| GET | `/v4/perpetualMarkets` |
| GET | `/v4/orderbooks/perpetualMarket/{ticker}` |
| GET | `/v4/trades/perpetualMarket/{ticker}` |
| GET | `/v4/candles/perpetualMarkets/{ticker}` |
| GET | `/v4/historicalFunding/{ticker}` |
| GET | `/v4/sparklines` |
| GET | `/v4/time` |
| GET | `/v4/height` |
| GET | `/v4/screen` |
| GET | `/v4/compliance/screen/{address}` |
| GET | `/v4/vault/v1/megavault/historicalPnl` |
| GET | `/v4/vault/v1/megavault/positions` |

## Parameters confirmed from the reviewed docs
The reviewed official examples and parameter tables expose these concrete request parameters:
- Path parameters: `address`, `subaccountNumber`, `orderId`, `ticker`, `parentSubaccountNumber`
- Query parameters seen in official examples/tables: `limit`, `status`, `createdBeforeOrAtHeight`, `createdBeforeOrAt`, `period`, `resolution`, `timePeriod`, `parentSubaccountNumber`

Examples directly visible in the reviewed docs include:
- `?address=...&subaccountNumber=0`
- `?period=DAILY`
- `?resolution=1DAY`
- `?timePeriod=ONE_DAY`

## Authentication
- The reviewed **Indexer HTTP API** pages present this surface as public query/data access.
- The docs separately direct developers to the **Private Node API** and **Permissioned Keys** documentation for authenticated/account-action workflows.
- In other words: use the Indexer HTTP API for public reads; use the Node/private-key flows for authenticated writes and privileged operations.

## Response and error notes
The reviewed HTTP API pages visibly document standard HTTP result tables including:
- `200 OK` for successful responses
- `400 Bad Request` for malformed/invalid requests
- `404 Not Found` on routes where a requested resource may be missing

The docs also show typed response schemas such as:
- `AddressResponse`
- `SubaccountResponseObject`

## Important usage notes
- The reviewed docs use **testnet** example hosts (`indexer.v4testnet.dydx.exchange`) in the visible examples.
- Path structure is clearly `/v4/...` and environment-specific hosts should be selected according to the dYdX environment being targeted.
- The docs landing page explicitly positions WebSocket feeds as the place to receive real-time updates, while the HTTP Indexer API covers query-style reads.
- Do not treat the public Indexer HTTP API and the authenticated Node API as interchangeable surfaces; the official docs separate them clearly.