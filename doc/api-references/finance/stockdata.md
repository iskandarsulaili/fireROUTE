# StockData

Official docs manually reviewed:
- https://www.stockdata.org/documentation
- https://www.stockdata.org/pricing

## Overview
StockData exposes a JSON-over-HTTPS market-data and finance-news API under `/v1`. The currently reviewed public docs cover stock quotes, intraday and end-of-day history, corporate actions, news feeds, news analytics, and entity metadata/search endpoints.

Confirmed base URL:
- `https://api.stockdata.org/v1`

Confirmed transport/format:
- HTTPS GET endpoints
- JSON responses by default
- optional CSV output on selected historical-data endpoints via `format=csv`

Manual route count confirmed from the reviewed public docs: **16** concrete HTTP routes.

## Authentication
The docs say every request uses an API token passed as a query parameter:

```text
api_token=YOUR_API_TOKEN
```

The docs also say the token is available immediately after signup on the dashboard.

## Confirmed endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/data/quote` | Current US stock quotes |
| GET | `/data/intraday/adjusted` | Split-adjusted intraday stock history |
| GET | `/data/intraday` | Unadjusted intraday stock history |
| GET | `/data/eod` | End-of-day history for stocks, and also crypto/forex EOD data |
| GET | `/data/splits` | Stock split history |
| GET | `/data/dividends` | Dividend history |
| GET | `/news/all` | Finance and market news feed |
| GET | `/news/similar/{uuid}` | Similar-articles lookup |
| GET | `/news/uuid/{uuid}` | Fetch one article by UUID |
| GET | `/news/stats/intraday` | Entity/news stats over time series |
| GET | `/news/stats/aggregation` | Aggregated entity/news stats |
| GET | `/news/stats/trending` | Trending entities |
| GET | `/entity/search` | Search entities/tickers |
| GET | `/entity/type/list` | Entity-type metadata |
| GET | `/entity/industry/list` | Industry metadata |
| GET | `/news/sources` | News-source metadata |

## Endpoint details
### `GET /data/quote`
Confirmed request parameters:
- `api_token` — required
- `symbols` — required; comma-separated symbol list, example `AAPL,TSLA,MSFT`
- `extended_hours` — optional boolean
- `key_by_ticker` — optional boolean

Confirmed response fields:
- `meta.requested`
- `meta.returned`
- `data[].ticker`
- `data[].name`
- `data[].exchange_short`
- `data[].exchange_long`
- `data[].mic_code`
- `data[].currency`
- `data[].price`
- `data[].day_high`
- `data[].day_low`
- `data[].day_open`
- `data[].52_week_high`
- `data[].52_week_low`
- `data[].market_cap`
- `data[].previous_close_price`
- `data[].previous_close_price_time`
- `data[].day_change`
- `data[].volume`
- `data[].is_extended_hours_price`
- `data[].last_trade_time`

Docs note:
- if no results are found, `data` is empty.

### `GET /data/intraday/adjusted`
Confirmed request parameters:
- `api_token` — required
- `symbols` — required
- `interval` — `minute` or `hour`
- `sort` — `asc` or `desc`, default `desc`
- `date_from`
- `date_to`
- `date`
- `extended_hours`
- `key_by_date`
- `key_by_ticker`
- `format=csv`

Confirmed official range constraints:
- `minute` interval max range is `7 days`
- `hour` interval max range is `180 days`
- if the requested range is larger, the max range is applied starting from `date_from`

Confirmed response meta fields:
- `meta.date_from`
- `meta.date_to`
- `meta.max_period_days`

### `GET /data/intraday`
The docs present the unadjusted intraday route as the same family as above but without split adjustment.

Confirmed route:
- `GET https://api.stockdata.org/v1/data/intraday`

Confirmed parameter family from the reviewed examples/docs:
- `api_token`, `symbols`, `interval`, `sort`, `date_from`, `date_to`, `date`, `extended_hours`, `key_by_date`, `key_by_ticker`

### `GET /data/eod`
Confirmed request parameters:
- `api_token` — required
- `symbols` — required
- `interval` — `day`, `week`, `month`, `quarter`, `year`
- `sort` — `asc` or `desc`, default `desc`
- `date_from`
- `date_to`
- `date`
- `key_by_date`
- `format=csv`

Confirmed response fields:
- `meta.date_from`
- `meta.date_to`
- `meta.max_period_days`
- `data[].date`
- `data[].ticker`
- `data[].data.open`
- `data[].data.high`
- `data[].data.low`
- `data[].data.close`
- `data[].data.volume`

Important official note:
- the docs explicitly say this endpoint also supports crypto and forex history; there is no separate path for the reviewed EOD crypto/forex section.

### `GET /data/splits` and `GET /data/dividends`
The public docs expose dedicated split and dividend endpoints as separate GET routes under `/data`.

Confirmed route paths:
- `/data/splits`
- `/data/dividends`

These are listed as Standard-plan-and-above features on the public docs/pricing pages.

### `GET /news/all`
Confirmed usage notes from the reviewed docs:
- returns global financial news
- supports filtering by identified entities and analysis fields
- all news dates are returned as `UTC +0`

Confirmed request parameters seen on the page:
- `api_token`
- `symbols`
- `entity_types`
- `industries`
- `countries`
- `sentiment_gte`
- `sentiment_lte`
- `min_match_score`

### `GET /news/similar/{uuid}`
Confirmed route pattern:
- `/news/similar/{uuid}`

Confirmed example query parameters:
- `api_token`
- `language`
- `published_on`

### `GET /news/uuid/{uuid}`
Confirmed route pattern:
- `/news/uuid/{uuid}`

Confirmed example query parameter:
- `api_token`

### `GET /news/stats/intraday`
Confirmed request parameters from the reviewed docs/examples:
- `api_token`
- `interval`
- `group_by`
- `symbols`
- `countries`
- `published_after`
- `published_before`
- `published_on`
- `language`
- `sort`
- `sort_order`

### `GET /news/stats/aggregation`
Confirmed route path:
- `/news/stats/aggregation`

Confirmed example parameter family:
- `api_token`
- `symbols`
- `published_after`
- `language`

### `GET /news/stats/trending`
Confirmed request parameters from the reviewed docs/examples:
- `api_token`
- `group_by` — docs say `symbol | exchange | industry | country`, default `symbol`
- `min_doc_count`
- `symbols`
- `entity_types`
- `industries`
- `countries`
- `sentiment_avg_gte`
- `sentiment_avg_lte`
- `sentiment_gte`
- `sentiment_lte`
- `published_after`
- `language`

### Metadata/search routes
Confirmed metadata and lookup routes:
- `GET /entity/search`
- `GET /entity/type/list`
- `GET /entity/industry/list`
- `GET /news/sources`

Confirmed `GET /entity/search` parameters:
- `api_token`
- `search`
- `symbols`
- `exchanges`
- `types`
- `industries`
- `countries`
- `page`

Confirmed `GET /entity/search` response pagination fields:
- `meta.found`
- `meta.returned`
- `meta.limit` — docs say fixed at `50`
- `meta.page`

Confirmed `GET /news/sources` parameters:
- `api_token`
- `distinct_domain`
- `language`
- `page`

Confirmed `GET /news/sources` response pagination fields:
- `meta.found`
- `meta.returned`
- `meta.limit` — docs say fixed at `50`
- `meta.page`

## Response format and errors
### Response format
The reviewed docs consistently show JSON success responses with:
- `meta` objects for counts/date bounds/page state
- `data` arrays or objects for payloads
- empty `data` when no results are found

### Errors
The public docs publish a centralized JSON error table:

| Error code | HTTP status | Meaning |
|---|---:|---|
| `malformed_parameters` | 400 | Parameter validation failed |
| `invalid_api_token` | 401 | Invalid API token |
| `usage_limit_reached` | 402 | Plan usage limit reached |
| `endpoint_access_restricted` | 403 | Endpoint not available on current plan |
| `resource_not_found` | 404 | Resource not found |
| `invalid_api_endpoint` | 404 | API route does not exist |
| `rate_limit_reached` | 429 | Too many requests in the past 60 seconds |
| `server_error` | 500 | Server error |
| `maintenance_mode` | 503 | Service under maintenance |

Confirmed header notes on the error page:
- `usage_limit_reached` references `X-UsageLimit-Limit`
- `rate_limit_reached` references `X-RateLimit-Limit`

## Rate limits, quotas, and pagination
### Published plan quotas from the pricing page
Confirmed public daily request quotas:
- Free: `100 requests daily`
- Basic: `2,500 requests daily`
- Standard: `10,000 requests daily`
- Pro: `25,000 requests daily`

Confirmed public per-request caps from the pricing page:
- Free: `3 symbols / stock price request`, `1 symbol / intraday request`, `2 articles / news request`
- Basic: `10 symbols / stock price request`, `1 symbol / intraday request`, `10 articles / news request`
- Standard: `25 symbols / stock price request`, `1 symbol / intraday request`, `25 articles / news request`
- Pro: `100 symbols / stock price request`, `3 symbols / intraday request`, `50 articles / news request`

Confirmed feature gating from docs/pricing:
- adjusted intraday data requires Standard+
- splits and dividends require Standard+
- market stats requires Standard+

### Pagination
Confirmed pagination behavior on reviewed routes:
- `/entity/search` uses `page`, with fixed `meta.limit = 50`
- `/news/sources` uses `page`, with fixed `meta.limit = 50`
- quote/history endpoints primarily use date windows and counts rather than page tokens

## Important usage notes
- The docs explicitly say the API data is indicative and not appropriate for trading purposes.
- US stock trading data is described as sourced from IEX.
- News coverage claims 5,000+ sources, 30+ languages, 150,000+ tracked entities, and 70+ markets/exchanges in the reviewed public docs.
- `/data/eod` is the reviewed path for both stock EOD data and crypto/forex EOD history.
