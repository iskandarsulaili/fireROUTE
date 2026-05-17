# Finage

Official docs manually reviewed:
- https://finage.co.uk/docs/api/us-stocks/stock-last-quote
- https://finage.co.uk/docs/websocket

## Overview
Finage’s current public docs expose a compact REST surface for US stocks plus a separate WebSocket transport for real-time streaming.

Confirmed bases from the reviewed official pages:
- REST base URL: `https://api.finage.co.uk`
- WebSocket URL pattern: `wss://{subdomain}.finage.ws:{port}/?token={token}`

Confirmed transport/format:
- HTTPS GET endpoints for the reviewed REST surface
- JSON responses on REST examples
- WebSocket streaming for live feeds

Manual route count confirmed from the reviewed US Stocks docs: **5** REST routes.

## Authentication
### REST
The reviewed REST docs consistently use an API key query parameter:

```text
apikey=YOUR_API_KEY
```

### WebSocket
The reviewed WebSocket docs use a dashboard-issued socket URL and token:

```text
wss://{subdomain}.finage.ws:{port}/?token={token}
```

The docs say the assigned subdomain, port, and token are shown in the user dashboard.

## Confirmed REST endpoints
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/last/stock/{symbol}` | Latest stock quote | path `symbol`; query `apikey` |
| GET | `/last/trade/stock/{symbol}` | Latest stock trade | path `symbol`; query `apikey` |
| GET | `/agg/stock/{symbol}/{multiply}/{time}/{from}/{to}` | OHLCV aggregate bars | path `symbol`, `multiply`, `time`, `from`, `to`; query `apikey`, optional `limit`, `sort`, `dbt_filter`, `st`, `et`, `date_format` |
| GET | `/agg/stock/prev-close/{symbol}` | Previous close / previous-day last bar | path `symbol`; query `apikey` |
| GET | `/snapshot/stock` | Last quotes and/or last trades for one or many symbols | query `apikey`, `quotes`, `trades`, `symbols` |

## Endpoint details
### `GET /last/stock/{symbol}`
Docs page title: **Stock Last Quote**.

Confirmed path/query contract:
- path `symbol` — example `AAPL`
- query `apikey`

Confirmed response fields from the official example:
- `symbol`
- `ask`
- `bid`
- `asize`
- `bsize`
- `timestamp`

### `GET /last/trade/stock/{symbol}`
Docs page title: **Stock Last Trade**.

Confirmed path/query contract:
- path `symbol`
- query `apikey`

Confirmed response fields from the official example:
- `symbol`
- `price`
- `size`
- `timestamp`

### `GET /agg/stock/{symbol}/{multiply}/{time}/{from}/{to}`
Docs page title: **Stock Market Aggregates API**.

Confirmed required path parameters:
- `symbol`
- `multiply`
- `time` — docs explicitly list `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`
- `from`
- `to`

Confirmed optional query parameters:
- `limit` — docs say default `100`, maximum `50000`
- `sort` — `asc` or `desc`, default `asc`
- `dbt_filter` — daily-based time filter toggle
- `st` — start time in UTC, example `17:30`
- `et` — end time in UTC, example `17:45`
- `date_format` — `dt` or `ts`, default timestamp style
- `apikey`

Confirmed response fields:
- top-level `symbol`
- top-level `totalResults`
- bar fields inside `results[]`: `o`, `h`, `l`, `c`, `v`, `t`

### `GET /agg/stock/prev-close/{symbol}`
Docs page title: **Stock Market Previous Close**.

Confirmed contract:
- path `symbol`
- query `apikey`

Confirmed response shape:
- top-level `symbol`
- top-level `totalResults`
- `results[]` items with `o`, `h`, `l`, `c`, `v`, `t`

### `GET /snapshot/stock`
Docs page title: **Stock Snapshot API**.

Confirmed query parameters:
- `quotes` — docs say default `true`
- `trades` — docs say default `false`
- `symbols` — comma-separated symbol list; docs also say leaving it empty returns all available last data
- `apikey`

Confirmed response shape:
- top-level `totalResults`
- `lastQuotes[]` items with `s`, `a`, `b`, `asz`, `bsz`, `t`
- `lastTrades[]` items with `s`, `p`, `sz`, `t`

Important docs note:
- the snapshot docs describe `symbols` as a required input field in one place, but the same description says leaving it empty returns all available data; fireROUTE should treat this as a provider-doc inconsistency.

## WebSocket methods confirmed
The reviewed WebSocket docs expose three documented actions/method sections:
- `Connect`
- `Subscribe`
- `Unsubscribe`

Confirmed connection pattern:
- `wss://{subdomain}.finage.ws:{port}/?token={token}`

Confirmed connection-status examples:
- `{"status_code":200,"message":"authorizing",...}`
- `{"status_code":200,"message":"connected to the adapter",...}`

Confirmed WebSocket errors shown on the official page:
- `401 - invalid socket key`
- `401 - use your socket key to connect`
- `401 - please upgrade your package to access this market`

## Response and formatting notes
- REST examples are JSON.
- Aggregate and previous-close endpoints return OHLCV bar arrays under `results`.
- Snapshot responses separate quote data (`lastQuotes`) and trade data (`lastTrades`).
- The snapshot docs label `t` as a microsecond timestamp, but the public example value is 13 digits (millisecond-like). Treat timestamp precision as a docs inconsistency to verify during integration.

## Rate limits and pagination
### Rate limits
- No generic REST rate-limit figure was published on the reviewed public Finage pages.
- The reviewed docs do not publish a shared quota header contract.

### Pagination
- No pagination model is documented for the reviewed US Stocks endpoints.
- Aggregate history uses explicit date windows plus optional `limit` and `sort` instead of page tokens.

## Errors
- The reviewed REST pages did not publish a centralized JSON error schema.
- The reviewed WebSocket page does publish the three `401` auth/entitlement messages listed above.

## Important usage notes
- The manually reviewed US Stocks section currently exposes exactly five public REST endpoint pages.
- Finage’s docs are product-scoped; Forex and Crypto use parallel path families on the same host, but this file is limited to the US Stocks routes actually reviewed.
- Snapshot mode can return quotes, trades, or both in one request.
- WebSocket access is account-assigned rather than using one fixed public host/port for all customers.
