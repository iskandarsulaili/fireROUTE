# CoinRanking

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinranking`
- Primary official docs: `https://coinranking.com/api/documentation`
- Official docs/pages manually reviewed in this pass:
  - `https://coinranking.com/api/documentation`
  - `https://coinranking.com/api/documentation/rate-limits`
  - `https://coinranking.com/api/documentation/pagination`
  - `https://coinranking.com/api/documentation/coins/coins`
  - `https://coinranking.com/api/documentation/coins/trending-coins`
  - `https://coinranking.com/api/documentation/coins/coin-price-history`
  - `https://coinranking.com/api/documentation/blockchains/blockchains`
  - `https://coinranking.com/api/documentation/blockchains/blockchain-details`
  - `https://coinranking.com/api/documentation/blockchains/blockchain-contract-address`
  - `https://coinranking.com/api/documentation/exchanges/exchange-details`
  - `https://coinranking.com/api/documentation/dexs/dex-details`
  - `https://coinranking.com/api/documentation/markets/market-details`
  - `https://coinranking.com/api/documentation/reference-currencies`
  - `https://coinranking.com/api/documentation/stats/stats`
  - `https://coinranking.com/api/documentation/stats/stats-selection-of-coins`
  - `https://coinranking.com/api/documentation/search-suggestions`
  - `https://coinranking.com/api/documentation/tags/tag-details`
  - `https://coinranking.com/api/documentation/indicators/coin-moving-averages`
  - `https://coinranking.com/api/documentation/indicators/fear-and-greed`
  - `https://coinranking.com/api/documentation/mappings/coin`
  - `https://coinranking.com/api/documentation/websockets/rates`
  - `https://coinranking.com/api/documentation/websockets/exchange-rates`
  - `https://coinranking.com/api/documentation/websockets/tickers`
  - `https://coinranking.com/api/documentation/bulk`
- Confirmed REST base URL: `https://api.coinranking.com/v2`
- Confirmed WebSocket base URL family: `wss://api.coinranking.com/v2/real-time`
- Primary response format: JSON
- Manually confirmed route count: `48`

## Authentication
### REST
- REST requests use API-key authentication via header `x-access-token: {token}`.
- The getting-started docs show authenticated examples such as `curl https://api.coinranking.com/v2/coins -H x-access-token: ...`.
- The official docs also state that unauthenticated requests are only for very limited testing and are **not guaranteed to work**.

### WebSockets
- WebSocket authentication is passed in the connection URL, for example:
  - `wss://api.coinranking.com/v2/real-time/rates?x-access-token=your-api-key`
  - `wss://api.coinranking.com/v2/real-time/exchange-rates?x-access-token=your-api-key`
  - `wss://api.coinranking.com/v2/real-time/tickers?x-access-token=your-api-key`

## Rate limits
From the official `Rate limits` page:
- Free API key: `10K requests per month`
- Free keys are additionally limited to about `5 requests per second`
- Unauthenticated traffic has stricter minute/hour/month limits and is explicitly described as unstable/non-guaranteed
- Responses expose rate-limit headers including:
  - `X-RateLimit-Limit-Second`
  - `X-RateLimit-Limit-Minute`
  - `X-RateLimit-Limit-Hour`
  - `X-RateLimit-Limit-Month`
  - `X-RateLimit-Remaining-Second`
  - `X-RateLimit-Remaining-Minute`
  - `X-RateLimit-Remaining-Hour`
  - `X-RateLimit-Remaining-Month`
  - `RateLimit-Limit`
  - `RateLimit-Remaining`
  - `RateLimit-Reset`

## Pagination
The official `Pagination` page confirms two pagination modes for list endpoints:
- legacy offset pagination with `limit` + `offset`
- recommended cursor pagination with `limit` + `cursor`

Shared pagination response fields:
- `pagination.limit`
- `pagination.hasNextPage`
- `pagination.hasPreviousPage`
- `pagination.nextCursor`
- `pagination.previousCursor`

Official pagination errors:
- `INVALID_CURSOR`
- `CURSOR_MISMATCH`
- `PAGINATION_CONFLICT`

The docs explicitly say cursor pagination is supported on:
- list of coins
- coin market listings
- coin exchange listings
- coin blockchains
- list of exchanges
- exchange coin listings
- exchange list of markets
- list of markets
- list of tags
- reference currencies
- global trading volume history

## Route inventory
The official docs sidebar exposes `48` concrete API/stream pages: `45` REST GET routes plus `3` WebSocket stream routes.

### Coins (`16` GET routes)
- `GET /coins`
- `GET /coins/trending`
- `GET /coin/{uuid}`
- `GET /coin/{uuid}/price`
- `GET /coin/{uuid}/price-history`
- `GET /coin/{uuid}/fiat-prices`
- `GET /coin/{uuid}/ohlcv`
- `GET /coin/{uuid}/gains-and-losses`
- `GET /coin/{uuid}/exchanges`
- `GET /coin/{uuid}/markets`
- `GET /coin/{uuid}/blockchains`
- `GET /coin/{uuid}/supply-modifiers`
- `GET /coin/{uuid}/market-cap-history`
- `GET /coin/{uuid}/trading-volume-history`
- `GET /coin/{uuid}/rank-history`
- `GET /coin/{uuid}/supply-history`

### Blockchains (`3` GET routes)
- `GET /blockchains`
- `GET /blockchain/{blockchain}`
- `GET /blockchain/{blockchain}/{address}`

### Exchanges (`5` GET routes)
- `GET /exchanges`
- `GET /exchange/{uuid}`
- `GET /exchange/{uuid}/coins`
- `GET /exchange/{uuid}/new-coins`
- `GET /exchange/{uuid}/markets`

### DEXs (`6` GET routes)
- `GET /dexs`
- `GET /dex-protocols`
- `GET /dex/{uuid}`
- `GET /dex/{uuid}/coins`
- `GET /dex/{uuid}/new-coins`
- `GET /dex/{uuid}/markets`

### Markets (`2` GET routes)
- `GET /markets`
- `GET /market/{uuid}`

### Reference currencies (`1` GET route)
- `GET /reference-currencies`

### Stats (`5` GET routes)
- `GET /stats`
- `GET /stats/coins`
- `GET /stats/market-cap-history`
- `GET /stats/trading-volume-history`
- `GET /stats/bitcoin-dominance-history`

### Search suggestions (`1` GET route)
- `GET /search-suggestions`

### Tags (`2` GET routes)
- `GET /tags`
- `GET /tag/{slug}`

### Indicators (`2` GET routes)
- `GET /indicators/{uuid}/moving-averages`
- `GET /indicators/fear-and-greed`

### Coin mapping (`1` GET route)
- `GET /mappings/{provider}/coin/{providerId}`

### Bulk (`1` GET route)
- `GET /bulk/coins`

### WebSockets (`3` stream routes)
- `WSS /real-time/rates`
- `WSS /real-time/exchange-rates`
- `WSS /real-time/tickers`

## Parameter and behavior notes
### List of coins: `GET /coins`
Officially documented query parameters include:
- `referenceCurrencyUuid`
- `timePeriod`
- `symbols[]`
- `contractAddresses[]`
- `blockchains[]`
- `uuids[]`
- `tiers[]`
- `tags[]`
- `orderBy` with values `price`, `marketCap`, `24hVolume`, `change`, `listedAt`
- `orderDirection` with values `desc`, `asc`
- `limit`
- `offset`
- `cursor`

Notable official defaults/limits:
- default reference currency UUID: `yhjMzLPhuIDl` (USD)
- default `timePeriod`: `24h`
- default `tiers`: `1, 2`
- default `orderBy`: `marketCap`
- default `orderDirection`: `desc`
- default `limit`: `50`
- maximum `limit`: `5000` on Startup/Professional, `100` on Free

### Trending coins: `GET /coins/trending`
Officially documented query parameters:
- `referenceCurrencyUuid`
- `timePeriod`
- `tiers[]`
- `limit`
- `offset`

### Coin history endpoints
Sampled official pages confirm the `/coin/{uuid}/...` path family and UUID path parameter use.
- `GET /coin/{uuid}/price-history` documents `timePeriod` and `referenceCurrencyUuid`
- `GET /coin/{uuid}/price-history` returns `data.change` plus timestamped `data.history[]`
- the sampled error model includes `404 COIN_NOT_FOUND`

### Blockchain endpoints
Sampled official pages confirm:
- `GET /blockchains` returns `data.blockchains[]`
- `GET /blockchain/{blockchain}` uses path parameter `blockchain`
- `GET /blockchain/{blockchain}/{address}` resolves a coin by contract address on that blockchain
- blockchain detail errors include `404 BLOCKCHAIN_NOT_FOUND`

### Exchange, DEX, and market detail endpoints
Sampled official pages confirm:
- `GET /exchange/{uuid}` uses path parameter `uuid` plus optional `referenceCurrencyUuid`
- `GET /dex/{uuid}` uses path parameter `uuid` plus optional `referenceCurrencyUuid`
- `GET /market/{uuid}` uses path parameter `uuid` plus optional `referenceCurrencyUuid`
- these detail responses return rich nested metadata objects rather than bare price scalars

### Reference currencies: `GET /reference-currencies`
Officially documented query parameters:
- `limit`
- `offset`
- `types[]` with values `coin`, `fiat`, `denominator`, `commodities`, `indices`
- `search`
- `cursor`

### Stats endpoints
Sampled official pages confirm:
- `GET /stats` supports `referenceCurrencyUuid`
- `GET /stats/coins` supports `referenceCurrencyUuid`, `timePeriod`, `uuids[]`, and `tag`

### Search suggestions: `GET /search-suggestions`
Officially documented query parameters:
- `query`
- `types[]` with values including `coins`, `exchanges`, `markets`, `fiat`, `categories`, `commodities`, `indices`, `all`
- `referenceCurrencyUuid`

### Tags
Sampled official tag detail docs confirm:
- `GET /tag/{slug}` uses slug path parameter `slug`
- optional query parameters: `referenceCurrencyUuid`, `timePeriod`
- docs describe tags as category/ecosystem-style groupings

### Indicators
Sampled official indicator docs confirm:
- `GET /indicators/{uuid}/moving-averages`
  - path parameter: `uuid`
  - query params: `timePeriod`, `interval`, `referenceCurrencyUuid`
  - moving-average docs publish per-time-period interval availability tables
- `GET /indicators/fear-and-greed`
  - query params: `timePeriod`, `interval`
  - response is an array of `{timestamp, value}` points

### Coin mapping
Sampled official mapping docs confirm:
- `GET /mappings/{provider}/coin/{providerId}`
- supported `provider` values: `coingecko`, `coinmarketcap`
- optional query params: `referenceCurrencyUuid`, `timePeriod`

### WebSockets
Sampled official stream docs confirm:
- rates stream accepts URL/query subscription inputs such as `currency-uuids[]`, `throttle`, and optional `list=all`
- exchange-rates stream accepts `references[]`, `exchange-uuids[]`, `currency-uuids[]`, `list`, `throttle`
- ticker stream accepts `market-uuids[]`, `exchange-uuids[]`, `currency-uuids[]`, `list`, `throttle`
- docs allow both subscription-via-URL and subscription-via-message after connect
- stream docs cap many subscription arrays at `1-100` items

### Bulk endpoint
Sampled bulk docs confirm:
- `GET /bulk/coins`
- intended to return bulk metadata for all coins
- docs show downloading with `--compressed` and writing to an output file

## Response and error format notes
Common documented response conventions:
- success responses use top-level `status: "success"`
- validation/not-found failures use top-level `status: "fail"` with `type` and `message`
- list endpoints commonly return data under top-level `data` and may add a top-level `pagination` object

Sampled official error types include:
- `REFERENCE_UNAVAILABLE`
- `VALIDATION_ERROR`
- `INVALID_CURSOR`
- `CURSOR_MISMATCH`
- `PAGINATION_CONFLICT`
- `BLOCKCHAIN_NOT_FOUND`
- `COIN_NOT_FOUND`

## Plan and product-surface notes
- The docs visibly label many routes as `Pro`; those routes should be treated as plan-gated.
- The docs also label `DEXs`, `Indicators`, and some stream surfaces as `New`.
- Startup/Professional plans expose broader limits than the Free plan, especially around max `timePeriod`, tier-3 access, and max page size.
- The docs repeatedly point users to UUID discovery helpers such as reference-currency listings and search-suggestion/search pages.

## fireROUTE normalization notes
- CoinRanking is no longer just a `2`-route provider in the repo; the official docs now expose a large, well-structured surface with `48` manually confirmed routes/streams.
- For route modeling, treat REST and WebSocket surfaces separately:
  - REST base: `https://api.coinranking.com/v2`
  - WebSocket base family: `wss://api.coinranking.com/v2/real-time`
- Prefer cursor pagination where supported; the docs explicitly recommend it over large offsets.
- Preserve plan-gating metadata for `Pro` routes and for broader historical windows only available on higher plans.
