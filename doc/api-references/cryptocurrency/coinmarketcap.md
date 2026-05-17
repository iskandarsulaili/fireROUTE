# CoinMarketCap

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinmarketcap`
- Primary official docs: `https://pro.coinmarketcap.com/api/documentation/`
- Official docs/pages manually reviewed in this pass:
  - `https://coinmarketcap.com/api/`
  - `https://pro.coinmarketcap.com/api/documentation/`
  - `https://pro.coinmarketcap.com/api/documentation/guides/quick-start.md`
  - `https://pro.coinmarketcap.com/api/documentation/guides/authentication.md`
  - `https://pro.coinmarketcap.com/api/documentation/guides/standards-and-conventions.md`
  - `https://pro.coinmarketcap.com/api/documentation/guides/errors-and-rate-limits.md`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/endpoint-overview`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/trial-pro-api`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/cryptocurrency`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/exchange`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/global-metrics`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/content`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/community`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/cmc-index`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/crypto-others`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/token`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/platform`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/holder`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/ohlcv`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/tools`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/deprecated`
  - `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/others` (reviewed because the endpoint chooser/LLM index advertises it, but the linked page returned `Page not found` in this environment)
- Confirmed primary REST base URL: `https://pro-api.coinmarketcap.com`
- Confirmed keyless trial base URL: `https://pro-api.coinmarketcap.com/trial-pro-api`
- Primary response format: JSON
- Manually confirmed active route count: `73`
- Additional official legacy surface visible in docs but excluded from the active count: `18` deprecated routes on the `Deprecated` page

## Authentication
- The primary Pro API requires an API key for every request.
- Preferred auth method: header `X-CMC_PRO_API_KEY: {your_api_key}`.
- Convenience auth method: query parameter `CMC_PRO_API_KEY={your_api_key}`.
- The docs explicitly recommend keeping the key server-side and not calling the Pro API directly from browser JavaScript.
- The trial surface is a separate keyless base path under `https://pro-api.coinmarketcap.com/trial-pro-api`; trial calls are `GET` only and only for a curated subset of routes.

## Request, response, and format conventions
- The docs require `Accept: application/json` on requests.
- The standards page also recommends `Accept-Encoding: deflate, gzip`.
- Successful and error responses share a standard envelope:
  - `data`: payload
  - `status`: metadata such as `timestamp`, `credit_count`, `elapsed`, `error_code`, and `error_message`
- Returned timestamps are UTC ISO 8601 strings.
- Date/time inputs accept ISO 8601 or Unix time depending on the endpoint.
- CoinMarketCap IDs are the preferred stable identifiers for cryptocurrencies and exchanges:
  - crypto lookup endpoint: `/cryptocurrency/map`
  - exchange lookup endpoint: `/exchange/map`
  - fiat lookup endpoint: `/fiat/map`
- Many endpoints support bundling via comma-separated `id`, `slug`, `symbol`, `convert`, or `convert_id` values.

## Rate limits, credits, and errors
- Request throttling is enforced per API key and resets every `60` seconds.
- The auth guide says daily and monthly usage is tracked as API call credits.
- Important credit rules called out in the official docs:
  - many successful data calls cost `1` credit by default
  - paginated list endpoints add credit cost as result size increases
  - bundled `convert` usage can add credit cost beyond the first conversion
  - account-management / usage-stat endpoints and error responses are not charged against credit limits
- `GET /v1/key/info` is explicitly documented as `0` credit cost, though it still counts against the minute-based rate limit.
- The rate-limit guide documents these HTTP statuses: `400`, `401`, `402`, `403`, `429`, `500`.
- Official structured error codes reviewed from the docs include:
  - `1001 API_KEY_INVALID`
  - `1002 API_KEY_MISSING`
  - `1003 API_KEY_PLAN_REQUIRES_PAYEMENT`
  - `1004 API_KEY_PLAN_PAYMENT_EXPIRED`
  - `1005 API_KEY_REQUIRED`
  - `1006 API_KEY_PLAN_NOT_AUTHORIZED`
  - `1007 API_KEY_DISABLED`
  - `1008 API_KEY_PLAN_MINUTE_RATE_LIMIT_REACHED`
  - `1009 API_KEY_PLAN_DAILY_RATE_LIMIT_REACHED`
  - `1010 API_KEY_PLAN_MONTHLY_RATE_LIMIT_REACHED`
  - `1011 IP_RATE_LIMIT_REACHED`
- The free Basic tier is documented as resetting daily and monthly at UTC midnight; paid plans reset relative to the subscription billing anchor.

## Pagination and parameter notes
### Shared pagination patterns
- Traditional list endpoints commonly use `start` + `limit`, with `start` documented as a `1`-based offset.
- Reviewed list endpoints document large upper bounds in some families, for example:
  - `GET /v1/cryptocurrency/listings/latest`: `limit` up to `5000`
  - `GET /v1/cryptocurrency/airdrops`: `limit` up to `5000`
  - `GET /v1/content/latest`: `limit` up to `200`
  - `GET /v1/community/trending/token`: `limit` up to `5`
- Some DEX routes use cursor-like request bodies with `nextPageIndex` and `pageSize` instead of `start`/`limit`.

### Representative parameter patterns confirmed from the reviewed docs
- `GET /v1/cryptocurrency/listings/latest`
  - reviewed params include `start`, `limit`, `convert`, `sort`, and a large set of numeric filters such as `price_min`, `price_max`, `market_cap_min`, `market_cap_max`, `volume_24h_min`, `volume_24h_max`, `circulating_supply_min`, `circulating_supply_max`, `percent_change_24h_min`, `percent_change_24h_max`, plus self-reported supply / market-cap filters
  - docs state it is the sorted/paginated endpoint for all active cryptocurrencies
- `GET /v3/cryptocurrency/quotes/latest`
  - reviewed params include `id`, `slug`, `symbol`, `convert`, `convert_id`, `aux`, and `skip_invalid`
  - docs position it as the preferred route when you already know which assets you want
- `GET /v1/content/latest`
  - reviewed params include `start`, `limit`, `id`, `slug`, and `symbol`
- `POST /v1/dex/tokens/trending/list`
  - reviewed request body fields include `platformIds`, `interval`, `nextPageIndex`, `pageSize`, `filter`, `sortBy`, and `sortType`
- `GET /v1/k-line/points`
  - reviewed params include `platform`, `address`, `interval`, `from`, `to`, `unit`, `limit`, and `pm`
- `GET /v1/blockchain/statistics/latest`
  - reviewed params include `id`, `symbol`, and `slug`

## Active route inventory
The currently inspectable official docs expose `73` active routes that were directly reviewable in this pass: `65` `GET` routes and `8` `POST` routes.

### Cryptocurrency (`20` GET routes)
- `GET /v1/cryptocurrency/map`
- `GET /v2/cryptocurrency/info`
- `GET /v3/cryptocurrency/listings/latest`
- `GET /v1/cryptocurrency/listings/latest`
- `GET /v1/cryptocurrency/listings/new`
- `GET /v1/cryptocurrency/listings/historical`
- `GET /v3/cryptocurrency/quotes/latest`
- `GET /v3/cryptocurrency/quotes/historical`
- `GET /v2/cryptocurrency/market-pairs/latest`
- `GET /v2/cryptocurrency/ohlcv/latest`
- `GET /v2/cryptocurrency/ohlcv/historical`
- `GET /v2/cryptocurrency/price-performance-stats/latest`
- `GET /v1/cryptocurrency/categories`
- `GET /v1/cryptocurrency/category`
- `GET /v1/cryptocurrency/airdrops`
- `GET /v1/cryptocurrency/airdrop`
- `GET /v1/cryptocurrency/trending/latest`
- `GET /v1/cryptocurrency/trending/most-visited`
- `GET /v1/cryptocurrency/trending/gainers-losers`
- `GET /v1/simple/price`

### Exchange (`7` GET routes)
- `GET /v1/exchange/map`
- `GET /v1/exchange/info`
- `GET /v1/exchange/listings/latest`
- `GET /v1/exchange/quotes/latest`
- `GET /v1/exchange/quotes/historical`
- `GET /v1/exchange/market-pairs/latest`
- `GET /v1/exchange/assets`

### Global Metrics (`6` GET routes)
- `GET /v1/global-metrics/quotes/latest`
- `GET /v1/global-metrics/quotes/historical`
- `GET /v3/fear-and-greed/latest`
- `GET /v3/fear-and-greed/historical`
- `GET /v1/altcoin-season-index/latest`
- `GET /v1/altcoin-season-index/historical`

### Content (`4` GET routes)
- `GET /v1/content/latest`
- `GET /v1/content/posts/top`
- `GET /v1/content/posts/latest`
- `GET /v1/content/posts/comments`

### Community (`2` GET routes)
- `GET /v1/community/trending/topic`
- `GET /v1/community/trending/token`

### CMC Index (`4` GET routes)
- `GET /v3/index/cmc100-latest`
- `GET /v3/index/cmc100-historical`
- `GET /v3/index/cmc20-latest`
- `GET /v3/index/cmc20-historical`

### Crypto Others (`1` GET route)
- `GET /v1/blockchain/statistics/latest`

### DEX Token (`16` routes: `10` GET, `6` POST)
- `GET /v4/dex/spot-pairs/latest`
- `GET /v4/dex/pairs/quotes/latest`
- `GET /v1/dex/token`
- `GET /v1/dex/token/price`
- `POST /v1/dex/token/price/batch`
- `POST /v1/dex/tokens/batch-query`
- `GET /v1/dex/token/pools`
- `GET /v1/dex/token-liquidity/query`
- `GET /v1/dex/tokens/transactions`
- `POST /v1/dex/tokens/trending/list`
- `POST /v1/dex/new/list`
- `POST /v1/dex/meme/list`
- `POST /v1/dex/gainer-loser/list`
- `GET /v1/dex/security/detail`
- `GET /v1/dex/search`
- `GET /v1/dex/liquidity-change/list`

### DEX Platform (`2` GET routes)
- `GET /v1/dex/platform/list`
- `GET /v1/dex/platform/detail`

### DEX Holder (`5` routes: `3` GET, `2` POST)
- `POST /v1/dex/holders/list`
- `POST /v1/dex/holders/detail`
- `GET /v1/dex/holders/trend/list`
- `GET /v1/dex/holders/tag_count`
- `GET /v1/dex/holders/count`

### DEX OHLCV (`2` GET routes)
- `GET /v1/k-line/points`
- `GET /v1/k-line/candles`

### Utilities / Tools (`4` GET routes)
- `GET /v2/tools/price-conversion`
- `GET /v1/fiat/map`
- `GET /v1/key/info`
- `GET /v1/tools/postman`

## Trial Pro API subset
The official trial page documents a keyless evaluation subset under `https://pro-api.coinmarketcap.com/trial-pro-api`.

Important trial notes:
- no API key is required
- requests must begin with `/trial-pro-api`
- only `GET` is supported on the trial surface
- the trial subset is aggressively rate-limited
- the trial endpoints return the same JSON envelope and error structure as the keyed Pro API

## Important usage notes
- The docs currently mix classic market-data paths (`/v1`, `/v2`, `/v3`) with newer DEX-heavy paths under `/v1/dex/...`, `/v4/dex/...`, and `/v1/k-line/...`; fireROUTE adapters should preserve versioned paths exactly.
- CoinMarketCap’s docs strongly prefer CMC IDs over symbols because symbols are not unique and can change after rebrands.
- `GET /v1/exchange/assets` includes a special data-quality caveat: the docs say wallet-holding information is provided by third parties, only wallets with at least `100,000 USD` balance are shown, and balances may be delayed.
- `GET /v1/key/info` is the main programmatic introspection route for monitoring plan limits, requests made, requests left, and credit resets.
- The reviewed official docs still publish a separate `Deprecated` page containing `18` legacy endpoints for backward compatibility; those routes are intentionally excluded from the active route count above.
- The endpoint chooser and `llms.txt` still advertise a DEX `Others` category with `2` additional endpoints, but the linked `https://pro.coinmarketcap.com/api/documentation/pro-api-reference/others` page returned `Page not found` during this review, so those two routes were not counted as manually confirmed active paths.
