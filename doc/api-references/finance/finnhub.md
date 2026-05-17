# Finnhub

Official docs manually reviewed:
- https://finnhub.io/docs/api

## Overview
Finnhub exposes a broad market-data API covering stocks, forex, crypto, economics, filings, alternative data, and WebSocket streams.

From the current official docs page reviewed in-browser:
- REST base URL: `https://finnhub.io/api/v1`
- WebSocket base URL: `wss://ws.finnhub.io`
- Protocol: HTTPS REST + WebSocket
- Response format: JSON
- Auth: API token in query string or `X-Finnhub-Token` header

The current docs page exposes **115 operations** by visible `Method:` markers in the reviewed page content:
- `109` GET endpoints
- `3` POST endpoints
- `3` WebSocket feeds

## Authentication
The official authentication section states:
- all GET requests require a token
- token can be supplied as query parameter `token=apiKey`
- token can also be sent as header `X-Finnhub-Token: apiKey`

Example header form documented by Finnhub:

```http
X-Finnhub-Token: YOUR_API_KEY
Accept: application/json
```

WebSocket auth is appended to the connection URL:

```text
wss://ws.finnhub.io?token=<api_key>
```

## Confirmed endpoints
The provider is much larger than a short adapter summary can list in full. The following representative operations were manually confirmed from the official docs.

| Method | Path | Purpose |
|---|---|---|
| GET | `/search` | Symbol/instrument lookup by symbol, company name, ISIN, or CUSIP |
| GET | `/stock/symbol` | Enumerate supported stock symbols for an exchange |
| GET | `/quote` | Retrieve current stock quote snapshot |
| GET | `/stock/candle` | Fetch OHLCV candle history for a symbol |
| GET | `/news` | Retrieve latest market news by category |
| GET | `/company-news` | Retrieve company-specific news by symbol and date range |
| WebSocket | `wss://ws.finnhub.io` | Stream real-time trades and other feed types |

Manual route count confirmed from the reviewed official docs page: **115** operations.

## Confirmed parameter details

### `GET /search`
Confirmed docs example paths:
- `/search?q=apple&exchange=US`
- `/search?q=US5949181045`

Confirmed query parameters:
- `q` required — symbol, name, ISIN, or CUSIP search text
- `exchange` optional — exchange filter

Confirmed response fields:
- `count`
- `result[]`
- `description`
- `displaySymbol`
- `symbol`
- `type`

### `GET /stock/symbol`
Confirmed docs example paths:
- `/stock/symbol?exchange=US`
- `/stock/symbol?exchange=US&mic=XNYS`

Confirmed query parameters:
- `exchange` required
- `mic` optional
- `securityType` optional
- `currency` optional

### `GET /quote`
Confirmed docs example paths:
- `/quote?symbol=AAPL`
- `/quote?symbol=MSFT`

Confirmed query parameter:
- `symbol` required

Confirmed response fields from the reviewed page:
- `c` current price
- `d` change
- `dp` percent change
- `h` high of day
- `l` low of day
- `o` open of day
- `pc` previous close
- sample response also includes `t` timestamp

The docs explicitly recommend WebSocket instead of constant polling for real-time updates.

### `GET /stock/candle`
Confirmed docs example paths:
- `/stock/candle?symbol=AAPL&resolution=1&from=1738655051&to=1738741451`
- `/stock/candle?symbol=IBM&resolution=D&from=1735976651&to=1738741451`

Confirmed query parameters:
- `symbol` required
- `resolution` required — reviewed values include `1`, `5`, `15`, `30`, `60`, `D`, `W`, `M`
- `from` required — UNIX timestamp
- `to` required — UNIX timestamp

Confirmed response fields:
- `c`, `h`, `l`, `o` arrays
- `s` status (`ok` or `no_data`)
- `t` timestamps
- `v` volumes

Reviewed usage note:
- only one month of intraday data is returned at a time
- larger intraday history should be fetched iteratively with `from` and `to`

### `GET /news`
Confirmed docs example paths:
- `/news?category=general`
- `/news?category=forex&minId=10`

Confirmed query parameters:
- `category` required — reviewed values: `general`, `forex`, `crypto`, `merger`
- `minId` optional — returns only news after the given ID; default `0`

Confirmed response fields:
- `category`
- `datetime`
- `headline`
- `id`
- `image`
- `related`
- `source`
- `summary`
- `url`

### `GET /company-news`
Confirmed docs example path:
- `/company-news?symbol=AAPL&from=2025-05-15&to=2025-06-20`

Confirmed query parameters:
- `symbol` required
- `from` required — `YYYY-MM-DD`
- `to` required — `YYYY-MM-DD`

Reviewed usage notes:
- endpoint is only available for North American companies
- free tier note on the page says 1 year of historical news plus new updates

### WebSocket `wss://ws.finnhub.io`
Confirmed from the WebSocket section.

Reviewed connection characteristics:
- append `?token=...` to the URL
- one API key may open only **one** connection at a time
- trade messages include `type` and `data`
- trade item fields shown on the page: `s`, `p`, `t`, `v`, `c`

## Rate limits
The reviewed official docs explicitly state:
- `429` is returned when your limit is exceeded
- in addition to plan-specific quotas, there is a hard limit of **30 API calls per second**
- one API key can open only **1 WebSocket connection at a time**

## Pagination
The reviewed pages do not present one universal page/offset contract across the API.

Confirmed incremental/filtering behavior from reviewed endpoints:
- market news uses `minId` for forward-only news retrieval
- company news uses explicit date windows (`from`, `to`)
- many core quote/symbol endpoints are simple request/response lookups without pagination

fireROUTE should treat list/pagination mechanics as endpoint-specific for Finnhub.

## Errors
Confirmed from the reviewed docs:
- standard HTTP status codes are used
- `429` signals rate-limit exhaustion
- auth is required on all GET requests

The top-level docs page explicitly describes the API as RESTful with standard HTTP response codes and authentication behavior.

## Response format
Confirmed from the reviewed docs:
- REST responses are JSON
- request URLs are resource-oriented
- WebSocket messages are JSON objects
- the API accepts form-encoded request bodies where applicable, per the top-level overview text

## Important usage notes
- Finnhub's official docs combine free, high-usage, premium, and enterprise-only datasets in one reference; verify plan entitlement before enabling an operation.
- The docs explicitly recommend WebSocket instead of tight quote polling.
- Symbol search is more flexible than a ticker lookup; it accepts names, ISINs, and CUSIPs.
- Intraday candle history must be chunked iteratively for longer lookback windows.
- News retrieval is split between broad market news (`/news`) and issuer-specific news (`/company-news`).

## fireROUTE notes
- Treat Finnhub primarily as a read-only market-data provider.
- Good normalized defaults are `GET /search`, `GET /stock/symbol`, `GET /quote`, `GET /stock/candle`, and `GET /news`.
- Preserve provider-specific short field names in raw passthrough mode because the quote/candle payloads are intentionally compact.
- Keep WebSocket support separate from REST routing metadata because auth and connection limits differ.
