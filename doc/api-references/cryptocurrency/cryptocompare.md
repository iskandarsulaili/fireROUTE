# CryptoCompare

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `cryptocompare`
- Official docs/pages reviewed manually:
  - `https://www.cryptocompare.com/api#/`
  - `https://developers.coindesk.com/documentation/data-api/introduction`
  - `https://developers.coindesk.com/documentation/data-streamer/introduction`
  - `https://developers.coindesk.com/documentation/data-api/index_cc_v1_latest_tick`
  - `https://developers.coindesk.com/documentation/data-api/spot_v2_historical_trades_hour`
  - `https://developers.coindesk.com/documentation/data-api/news_v1_article_list`
  - `https://developers.coindesk.com/documentation/data-api/onchain_v1_block_1`
  - `https://developers.coindesk.com/documentation/data-api/asset_v1_search`
  - `https://developers.coindesk.com/documentation/data-api/admin_v2_rate_limit`
  - `https://developers.coindesk.com/documentation/data-streamer/spot_v1_live_trades_unmapped`
- Redirect/migration behavior confirmed in this review: the legacy CryptoCompare docs URL now resolves into the current CoinDesk Developers documentation
- Confirmed current REST base URL: `https://data-api.coindesk.com`
- Confirmed current WebSocket base URL: `wss://data-streamer.coindesk.com/`
- Manually confirmed route count: `93`
- Confirmed route breakdown:
  - REST endpoints: `83` documented `GET` routes
  - WebSocket streams: `10` documented subscription streams
  - Non-route docs page excluded from count: `Excel Add-on`

## What the official docs currently confirm
- The historical CryptoCompare docs entrypoint now redirects to CoinDesk Developers.
- The currently browsable first-party product behind that redirect is CoinDesk's `Data API` and `Data Streamer` surface rather than the older standalone public CryptoCompare docs experience.
- The docs explicitly distinguish the current `Data API` from the older `Min API`; the Min API is described as deprecated and, as of November 2023, no longer receiving new updates.
- The platform exposes both a request/response REST surface and a real-time WebSocket surface.
- The reviewed docs describe the API as JSON-first, while also noting that most REST endpoints can return `CSV` when the route supports `response_format=CSV`.
- The reviewed route pages repeatedly show the common response envelope shape as top-level `Data` and `Err`, and the introduction also documents a `Warn` field for partial-but-usable responses.

## Redirect and branding interpretation for fireROUTE
- Treat this provider entry as a **legacy CryptoCompare-branded route to the current CoinDesk developer platform**.
- Do **not** keep modeling CryptoCompare from stale pre-acquisition route lists when the official first-party docs now point elsewhere.
- For current integrations, the browser-visible official surface is the CoinDesk-hosted API documented below.

## Authentication

### REST authentication methods confirmed from the reviewed Introduction page
CoinDesk documents multiple equivalent authentication mechanisms for REST requests:
- Query parameter: `api_key=YOUR_API_KEY`
- Bearer token header syntax: Authorization: Bearer YOUR_API_KEY
- Custom authorization header: `Authorization: Apikey YOUR_API_KEY`
- Dedicated header: `x-api-key: YOUR_API_KEY`

Official REST example shown in the docs:
- Example URL shown by the docs: https://data-api.coindesk.com/index/cc/v1/latest/tick?market=ccix&instruments=BTC-USD&api_key=YOUR_API_KEY

Important auth note from the docs:
- Some endpoints may be accessible without an API key for certain decentralized-app use cases, but the official introduction still recommends always registering an account and sending an API key.

### WebSocket authentication confirmed from the reviewed Introduction page
CoinDesk documents two WebSocket auth patterns:
- URL parameter auth example: wss://data-streamer.coindesk.com/?api_key=YOUR_API_KEY
- Header auth: `Authorization: Apikey YOUR_API_KEY`

Important WebSocket auth note from the docs:
- The official introduction explicitly notes that browser-native WebSocket clients do not directly support custom headers, so header-based auth is mainly for server-side clients or libraries that allow header injection.

## Rate limits
- The reviewed REST introduction says rate limiting is based on **calls, not credits**.
- Reviewed route pages document `429 Too Many Requests` when the API key exceeds its limit.
- The reviewed REST route pages describe rate-limit enforcement across `second`, `minute`, `hour`, `day`, and `month` granularities.
- CoinDesk provides a dedicated utility route for inspecting current allowance:
  - `GET /admin/v2/rate/limit`
- The reviewed `Rate Limit Verification` page says calling that endpoint itself counts against the limit and recommends using `X-RateLimit-*` response headers on normal API calls instead.
- The reviewed WebSocket introduction shows that the session welcome message includes socket/session capacity and reconnection counters, including concurrent session limits and remaining reconnection attempts.

## Response format and error handling
- The reviewed introduction states that API responses are provided in `JSON`.
- The reviewed introduction also says most endpoints support `CSV` output where route-specific `response_format` support is documented.
- The reviewed REST route pages consistently document a top-level response envelope with `Data` and `Err` objects.
- The reviewed REST introduction also documents a `Warn` field for ambiguous or partial-but-satisfactory responses.
- Reviewed route pages expose the following common HTTP responses:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `405 Method Not Allowed`
  - `429 Too Many Requests`
  - `500 Internal Server Error`
  - `502 Bad Gateway`
  - `503 Service Unavailable`

## Pagination and request-shaping notes
- I did **not** find one universal `page` or `offset` pagination contract in the reviewed current first-party docs.
- The reviewed routes instead use route-specific selectors such as:
  - `limit`
  - `to_ts`
  - `hour_ts`
  - `block_number`
  - `groups`
  - `response_format`
  - `return_404_on_empty_response`
- Example route-specific behaviors confirmed from reviewed pages:
  - `GET /news/v1/article/list` uses `limit` and `to_ts`
  - `GET /spot/v2/historical/trades/hour` uses `hour_ts`
  - `GET /onchain/v1/block/1` uses `block_number`
  - many routes accept `groups` to restrict response substructures
- fireROUTE normalization note: treat pagination/windowing on this current surface as **endpoint-specific**, not a single shared API-wide contract.

## Confirmed representative endpoint paths and parameters
These paths were directly confirmed from the reviewed route pages' live `RUN` URLs.

### 1) Latest index tick
- Method: `GET`
- Path: `/index/cc/v1/latest/tick`
- Example URL shown by the docs: `https://data-api.coindesk.com/index/cc/v1/latest/tick?market=cadli&instruments=BTC-USD,ETH-USD&apply_mapping=true`
- Confirmed parameters from the reviewed page:
  - `market` (required)
  - `instruments` (required array)
  - `groups` (optional array)
  - `apply_mapping` (optional boolean)
- Notes:
  - reviewed page documents `Cache: 10 seconds`
  - returns latest tick plus grouped value/OHLC-related fields depending on selected groups

### 2) Historical spot trades by hour
- Method: `GET`
- Path: `/spot/v2/historical/trades/hour`
- Example URL shown by the docs: `https://data-api.coindesk.com/spot/v2/historical/trades/hour?market=coinbase&instrument=BTC-USD&hour_ts=1576771200&apply_mapping=true&response_format=JSON`
- Confirmed parameters from the reviewed page:
  - `market` (required)
  - `instrument` (required)
  - `groups` (optional array)
  - `hour_ts` (required time selector for the hour bucket)
  - `apply_mapping` (optional boolean)
  - `response_format` (`JSON` or `CSV`)
  - `return_404_on_empty_response` (optional boolean)
  - `skip_invalid_messages` (documented further down the parameter list on the page)
- Notes:
  - route returns all trades in the selected hour bucket
  - docs explicitly describe `CSV` support for this route

### 3) News article list
- Method: `GET`
- Path: `/news/v1/article/list`
- Example URL shown by the docs: `https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=10`
- Confirmed parameters from the reviewed page:
  - `lang`
  - `source_ids`
  - `categories`
  - `exclude_categories`
  - `limit`
  - `to_ts`
- Notes:
  - this page is a good example of route-specific list limiting rather than universal page-number pagination

### 4) BTC processed block data
- Method: `GET`
- Path: `/onchain/v1/block/1`
- Example URL shown by the docs: `https://data-api.coindesk.com/onchain/v1/block/1?block_number=840946&groups=ID,METADATA,TRANSACTIONS`
- Confirmed parameters from the reviewed page:
  - `block_number`
  - `groups`
- Notes:
  - the reviewed page explains `-1` means latest published block and more negative values step backward from the chain tip
  - allowed `groups` listed on the reviewed page include `ID`, `METADATA`, `TRANSACTIONS`, `ORPHAN_TRACES`, `UNCLES`, and `WITHDRAWALS`

### 5) Asset search
- Method: `GET`
- Path: `/asset/v1/search`
- Example URL shown by the docs: `https://data-api.coindesk.com/asset/v1/search`
- Confirmed parameters from the reviewed page:
  - `search_string`
  - `limit`
- Notes:
  - the page documents symbol/name/id search behavior and relevance ordering

### 6) Rate-limit verification
- Method: `GET`
- Path: `/admin/v2/rate/limit`
- Example URL shown by the docs: `https://data-api.coindesk.com/admin/v2/rate/limit`
- Notes from the reviewed page:
  - returns current usage and allowance for `API_KEY` and `AUTH_KEY`
  - includes second/minute/hour/day/month usage windows
  - the docs recommend relying on `X-RateLimit-*` headers instead of polling this endpoint unnecessarily

### 7) WebSocket live spot trades subscription
- Transport: `WSS`
- Base URL: `wss://data-streamer.coindesk.com/`
- Reviewed subscription page: `spot_v1_live_trades_unmapped`
- Confirmed request-side fields from the reviewed page:
  - `action` (required)
  - `type` (required)
  - `market` (required)
  - `instruments` (required array)
  - `groups` (optional array)
  - `enable_snapshot` (optional boolean)
  - `enable_backfill` (optional boolean)
  - `apply_mapping` (optional boolean)
- Notes:
  - the reviewed WebSocket intro explains subscription control via JSON messages using `SUB_ADD` and `SUB_REMOVE`
  - the reviewed intro gives an example message with `action`, `type`, `groups`, and `subscriptions`

## Official route inventory confirmed from the current docs sidebar
The current first-party docs reachable from the legacy CryptoCompare URL currently expose `93` concrete routes/streams.

### REST routes (`83`)
- `Indices & Ref. Rates` — `11`
  - Latest Tick
  - Historical OHLCV+
  - DA Fixings
  - Index Updates
  - Instrument Metadata
  - Markets
  - Markets + Instruments
  - Forex Rates
  - EOD Markets + Instruments
  - EOD Historical OHLCV+ Day
  - Index Utilities
- `Spot` — `7`
  - Latest Tick
  - Historical OHLCV+
  - Trades
  - Order Book
  - Instrument Metadata
  - Markets
  - Markets + Instruments
- `Futures` — `16`
  - Latest Tick
  - Historical OHLCV+
  - Trades
  - Order Book
  - Latest Tick (OI)
  - Historical OHLC+ (OI)
  - Updates (OI)
  - Latest Tick (FR)
  - Historical OHLC+ (FR)
  - Updates (FR)
  - Latest Tick (LIQ)
  - Historical OHLC+ (LIQ)
  - Updates (LIQ)
  - Instrument Metadata
  - Markets
  - Markets + Instruments
- `Options` — `10`
  - Latest Tick
  - Historical OHLCV+
  - Trades
  - Order Book
  - Latest Tick (OI)
  - Historical OHLC+ (OI)
  - Updates (OI)
  - Instrument Metadata
  - Markets
  - Markets + Instruments
- `Derivatives Indices` — `6`
  - Latest Tick
  - Historical OHLC+
  - Index Updates
  - Instrument Metadata
  - Markets
  - Markets + Instruments
- `On-Chain DEX` — `7`
  - Latest Tick (Swap)
  - Historical OHLCV+ (Swap)
  - Swaps
  - Liquidity Updates
  - Instrument Metadata
  - Markets
  - Markets + Instruments
- `On-Chain Core` — `10`
  - ETH Blocks
  - BSC Blocks
  - BTC Blocks
  - BASE Blocks
  - ARB Blocks
  - SOL Blocks
  - ETH Address
  - Assets By Chain
  - Asset By Address
  - Historical Supply
- `Asset` — `6`
  - Metadata
  - Top List
  - Search
  - Summary List
  - Events
  - Historical Social
- `News` — `5`
  - Latest Articles
  - Sources
  - Categories
  - Single Article
  - Search
- `Overview` — `2`
  - MktCap Latest Tick
  - MktCap Historical OHLCV
- `Utilities` — `3` API routes
  - Rate Limit Verification
  - Version
  - OpenAPI

### WebSocket streams (`10`)
- `Reference Rates` — `1`
  - Latest Tick
- `Spot` — `4`
  - Order Book Replay
  - Order Book Realtime
  - Latest Tick
  - Live Trades
- `Futures` — `5`
  - Order Book Replay
  - Latest Tick
  - Latest Tick (FR)
  - Latest Tick (OI)
  - Live Trades

## Versioning and deprecation notes
- The reviewed Introduction page says new endpoint versions may be introduced over time and older versions move into the `Deprecated` section.
- Deprecated endpoints continue to function as originally implemented.
- The reviewed Introduction page says deprecated endpoints may include a `Deprecation` HTTP response header with value `true`, optionally including a date.

## Important usage notes
- Use the current CoinDesk Developers docs host reached from the old CryptoCompare URL, not stale public CryptoCompare-era route summaries.
- Treat this provider as a broad market-data platform, not a single-purpose ticker API: the currently documented first-party surface covers indices, spot, futures, options, on-chain DEX, chain data, asset metadata, news, overview aggregates, and WebSocket streaming.
- Many routes accept `groups` arrays to trim or expand the response schema; this is a recurring cross-product pattern in the current docs.
- The API is heavily time-bucketed: many historical routes are keyed by `hour_ts`, day windows, or event timestamps rather than cursor-based pagination.
- For WebSockets, expect the connection to begin with a session welcome payload that includes rate/session metadata before normal subscription data begins.

## Verification notes
- All facts above came from manual review of the official first-party documentation reachable from the legacy CryptoCompare docs URL using browser tools.
- The `93` route/stream count is grounded in the visible current docs sidebar plus direct review of representative route pages.
- This file intentionally avoids filling gaps from unofficial mirrors or stale pre-migration CryptoCompare route lists beyond what the reviewed current first-party docs explicitly state.
