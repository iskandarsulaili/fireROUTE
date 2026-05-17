# CoinAPI

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinapi`
- Primary official docs reviewed: `https://www.coinapi.io/products/market-data-api/docs`
- Additional official pages reviewed:
  - `https://www.coinapi.io/docs`
  - `https://www.coinapi.io/products/market-data-api/docs/authentication`
  - `https://www.coinapi.io/products/market-data-api/docs/rest-api`
  - `https://www.coinapi.io/products/market-data-api/docs/rest-api/exchange-rates/Get%20specific%20rate`
  - `https://www.coinapi.io/products/market-data-api/docs/rest-api/ohlcv/ohlcv/symbol_id/history/get`
  - `https://www.coinapi.io/products/market-data-api/docs/rest-api/trades/trades/symbol_id/history/get`
  - `https://www.coinapi.io/products/market-data-api/docs/websocket/endpoints`
  - `https://www.coinapi.io/products/market-data-api/docs/websocket/messages`
  - `https://www.coinapi.io/products/market-data-api/docs/websocket-ds/endpoints`
  - `https://www.coinapi.io/products/market-data-api/docs/websocket-ds/messages`
  - `https://www.coinapi.io/products/market-data-api/docs/jsonrpc-api`
  - `https://www.coinapi.io/products/market-data-api/docs/api-limits-and-billing-metrics`
- Manually confirmed route count in this review: `50`
- Counting note: `50` is the directly browsable Market Data REST inventory currently exposed in CoinAPI's official docs sidebar (`50` GET endpoints). I also reviewed the official WebSocket V1, WebSocket DS, and JSON-RPC pages for base URLs, auth, and protocol behavior, but I did not add those protocol pages to the HTTP route count.

## What the official docs currently confirm

### Documentation availability
- The older `docs.coinapi.io` path now redirects to a browsable first-party docs experience under `https://www.coinapi.io/docs` and product-specific pages under `https://www.coinapi.io/products/.../docs`.
- The currently inspectable technical reference is the `Market Data API` docs set.
- The docs homepage also advertises other first-party CoinAPI products (`Indexes API`, `Flat Files`, `Exchange Rates API`, `EMS Trading API`, `Exchange Link`), but this pass focused on the browsable Market Data API reference.

### Base URLs and protocol surfaces
From the reviewed official endpoint and protocol pages:
- Primary REST base: `https://rest.coinapi.io/v1`
- JSON-RPC proxy endpoint: `https://rest.coinapi.io/jsonrpc`
- WebSocket V1 GeoDNS endpoint: `wss://ws.coinapi.io/v1/`
- WebSocket V1 regional secure endpoints include:
  - `wss://api-ncsa.coinapi.io/v1/`
  - `wss://api-emea.coinapi.io/v1/`
  - `wss://api-apac.coinapi.io/v1/`
- WebSocket DS secure endpoint pattern:
  - `wss://{lowercase-exchange-name}.ws-ds.md.coinapi.io/`
  - regional alternatives like `wss://api-ncsa.coinapi.io/md/ws-ds-{lowercase-exchange-name}/`
- The docs also publish non-TLS `ws://...` WebSocket variants.
- JSON-RPC is documented as a thin proxy over the same Market Data REST resources rather than a separate API surface with its own method catalog.

### Authentication
From the official authentication matrix and sampled endpoint pages:
- REST, WebSocket V1, and WebSocket DS all support these auth styles:
  - `X-CoinAPI-Key` header
  - query parameter
  - API key in URL path
  - `Authorization` header
  - HTTP Basic auth
  - JWT
- Sample REST endpoint pages prominently show API-key auth in the `Authorization` header.
- The authentication docs explicitly warn that `Authorization` header API-key auth should not be combined with JWT; when JWT is enabled, CoinAPI recommends using another API-key transport such as `X-CoinAPI-Key`, query string, or URL-based key passing.
- FIX uses `SenderCompID` rather than the REST/WebSocket auth methods.
- S3-style access is documented separately with `X-CoinAPI-Key`, query-param auth, and AWS Signature Version 2/4 support.

### Formats, responses, and error notes
- The Market Data API overview states: `All API responses are returned in JSON format with UTF-8 encoding.`
- Reviewed REST endpoint pages show JSON example bodies for successful responses.
- Historical REST endpoints return data in time-ascending order.
- The JSON-RPC page states that CoinAPI forwards JSON-RPC calls to the same REST resources and returns the REST payload inside the JSON-RPC response.
- In the current docs renderer, some example response tabs are labeled `text/plain` even when the visible payload examples are JSON. Treat the payload examples and overview statement as the authoritative format guidance.
- I did not find a prominently documented shared error-envelope schema on the reviewed pages; the browsed endpoint pages mostly foreground successful (`200`) examples while auth and limits are documented on separate pages.

### Rate limits and billing notes
From the reviewed Market Data overview and `API limits and billing metrics` page:
- Public plan table shown on the overview page:
  - `Free`: `1` request/second, `100` requests/day
  - `Startup`: `10` requests/second, `10,000` requests/day
  - `Streamer`: `100` requests/second, `100,000` requests/day
  - `Enterprise`: custom
- CoinAPI separately documents a `Concurrency limit` protecting infrastructure.
- Product-level limits page says:
  - `Market Data REST API`: `Credits Limit`, `Concurrency Limit`
  - `Market Data WebSocket API`: `Request Limit / IP`, `Hello Limit / IP`, `Concurrency limit / APIKey`
  - `Market Data FIX API`: one session per API key; a new session disconnects the current one
- CoinAPI says some limits can be increased through support review.
- The limits page also says some plan-based limits can overflow into billable overage.

### Pagination / query-shaping patterns from reviewed endpoints
Common patterns confirmed from the browsed route pages:
- ISO-8601 query timestamps such as `time`, `time_start`, and `time_end`
- `limit` controls on historical endpoints
- default `limit` of `100` on sampled history endpoints
- maximum `limit` of `100000` on sampled history endpoints
- sampled docs note that when `limit` is used, every `100` output items count as one request for billing/credit purposes
- trades history supports either whole-day `date` queries or bounded `time_start` / `time_end` windows
- trades history also exposes `include_id` for exchange trade identifiers when available
- OHLCV history requires `period_id` values such as `5SEC` or `2MTH`

## Manually confirmed Market Data REST route inventory (`50` GET routes)

### Exchange Rates (`4` routes)
Base family: `https://rest.coinapi.io/v1/exchangerate`
- `GET /exchangerate/{asset_id_base}/{asset_id_quote}`
- `GET /exchangerate/{asset_id_base}`
- `GET /exchangerate/history/periods`
- `GET /exchangerate/{asset_id_base}/{asset_id_quote}/history`

Reviewed parameter notes:
- base and quote asset IDs come from Metadata assets
- `time` is optional on the specific-rate endpoint
- exchange-rate docs caution users handling mission-critical workloads to compare returned timestamps against current time

### Metadata (`11` routes)
Base family: `https://rest.coinapi.io/v1`
- `GET /symbols/map/{exchange_id}`
- `GET /symbols/{exchange_id}/active`
- `GET /symbols/{exchange_id}/history`
- `GET /exchanges`
- `GET /exchanges/{exchange_id}`
- `GET /exchanges/icons/{size}`
- `GET /chains`
- `GET /chains/{chain_id}`
- `GET /assets`
- `GET /assets/{asset_id}`
- `GET /assets/icons/{size}`

Usage note:
- the docs consistently position metadata lookups as the source of IDs needed before calling historical or live market-data endpoints

### MetricsV1 (`10` routes)
Base family: `https://rest.coinapi.io/v1/metrics`
- `GET /metrics/listing`
- `GET /metrics/exchange/listing`
- `GET /metrics/exchange/current`
- `GET /metrics/exchange/history`
- `GET /metrics/symbol/listing`
- `GET /metrics/symbol/current`
- `GET /metrics/symbol/history`
- `GET /metrics/asset/listing`
- `GET /metrics/asset/current`
- `GET /metrics/asset/history`

### MetricsV2 (`7` routes)
Base family: `https://rest.coinapi.io/v1`
- `GET /metrics/v2/listing`
- `GET /metrics/v2/exchange/listing`
- `GET /metrics/v2/exchange/history`
- `GET /metrics/v2/asset/history`
- `GET /metrics/v2/chain/history`
- `GET /metrics/v2/asset/listing`
- `GET /metrics/v2/chain/listing`

Usage note:
- the REST API landing page explicitly says MetricsV2 is preferred for new integrations

### OHLCV (`4` routes)
Base family: `https://rest.coinapi.io/v1/ohlcv`
- `GET /ohlcv/periods`
- `GET /ohlcv/{symbol_id}/history`
- `GET /ohlcv/exchanges/{exchange_id}/history`
- `GET /ohlcv/{symbol_id}/latest`

Reviewed parameter notes:
- `symbol_id` comes from Metadata symbols
- `period_id` is required on history queries
- sampled docs show `time_start`, `time_end`, and `limit`
- the docs say historical OHLCV can be delayed a few seconds and recommend the real-time data stream for no-delay use cases

### Options (`1` route)
Base family: `https://rest.coinapi.io/v1/options`
- `GET /options/{exchange_id}/current`

### Order Book (`3` routes)
Base family: `https://rest.coinapi.io/v1/orderbooks`
- `GET /orderbooks/{symbol_id}/depth/current`
- `GET /orderbooks/{symbol_id}/history`
- `GET /orderbooks/{symbol_id}/current`

### Order Book L3 (`2` routes)
Base family: `https://rest.coinapi.io/v1/orderbooks3`
- `GET /orderbooks3/current`
- `GET /orderbooks3/{symbol_id}/current`

### Quotes (`5` routes)
Base family: `https://rest.coinapi.io/v1/quotes`
- `GET /quotes/{symbol_id}/history`
- `GET /quotes/current`
- `GET /quotes/{symbol_id}/current`
- `GET /quotes/latest`
- `GET /quotes/{symbol_id}/latest`

### Trades (`3` routes)
Base family: `https://rest.coinapi.io/v1/trades`
- `GET /trades/{symbol_id}/history`
- `GET /trades/{symbol_id}/latest`
- `GET /trades/latest`

Reviewed parameter notes:
- the history route supports `date` for whole-day retrieval or `time_start` / `time_end` for precise ranges
- `include_id=false` by default and can request exchange trade identifiers when the venue provides them
- the docs say APITP historical trade retrieval uses hourly granularity with fallback to daily data for older records

## Additional protocol notes reviewed from official docs

### WebSocket V1
- Primary secure endpoint: `wss://ws.coinapi.io/v1/`
- Regional secure endpoints available for NCSA, EMEA, and APAC
- Official message page currently documents `14` inbound stream/control message shapes:
  - Trades
  - Quotes
  - Orderbook L2 (Full)
  - Orderbook L2 (max 2x5)
  - Orderbook L2 (max 2x20)
  - Orderbook L2 (max 2x50)
  - Orderbook L3 (Full)
  - OHLCV
  - Asset
  - Exchange
  - Symbol
  - Exchange Rate
  - Reconnect
  - Heartbeat

### WebSocket DS
- Secure endpoint pattern: `wss://{exchange}.ws-ds.md.coinapi.io/`
- Regional secure alternatives are also documented through the `api-ncsa`, `api-emea`, and `api-apac` hosts
- Official message page currently documents `11` inbound stream/control message shapes:
  - Trades
  - Quotes
  - Orderbook L2 (Full)
  - Orderbook L2 (max 2x5)
  - Orderbook L2 (max 2x20)
  - Orderbook L2 (max 2x50)
  - Orderbook L3 (Full)
  - High-Frequency Market Changes
  - Connectivity Status
  - Reconnect
  - Heartbeat

### JSON-RPC
- Endpoint: `https://rest.coinapi.io/jsonrpc`
- CoinAPI says there are no JSON-RPC-only methods; JSON-RPC method names mirror REST paths and proxy to the same backend resources
- For fireROUTE counting, I did not add JSON-RPC as separate operations because the reviewed docs describe it as an alternate transport over the same REST route surface

## Important implementation notes
- The previous blocker state is no longer accurate: CoinAPI's official docs are browsable again and expose a substantial first-party Market Data API reference.
- The current manual count is intentionally conservative and scoped to the directly visible Market Data REST endpoint inventory.
- If fireROUTE needs protocol-level coverage beyond REST, the official docs now also provide enough first-party grounding to model WebSocket V1, WebSocket DS, and JSON-RPC entry points.
- CoinAPI is unusually explicit about transport/auth flexibility; implementers should choose one API-key transport and stay consistent rather than mixing multiple methods.
- Historical endpoints expose very large `limit` ceilings, but the docs tie returned-item volume to billing/credit accounting, so large backfills should be planned with rate and cost controls in mind.
- Because the broader docs home advertises multiple separate products, future optional quality work could expand this file beyond Market Data API into the other browsable CoinAPI product families if fireROUTE wants provider-wide rather than product-scoped inventories.