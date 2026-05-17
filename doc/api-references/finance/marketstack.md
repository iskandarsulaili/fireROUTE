# Marketstack

Official docs manually reviewed:
- https://marketstack.com/documentation
- https://docs.apilayer.com/marketstack/docs/api-endpoints-v1/
- https://docs.apilayer.com/marketstack/docs/api-endpoints-v2

## Overview
Marketstack is an APILayer market-data API for end-of-day, intraday, ticker, exchange, currency, and timezone data.

Important current-state note from the official docs:
- the reviewed **v1** reference is still publicly accessible and documents the concrete route surface below
- that same official page states **v1 is deprecated after June 30, 2025** and that new functionality belongs to **v2**
- the linked official `api-endpoints-v2` page currently resolves to an APILayer "Oops! We couldn't find that page." screen

Because the current official v2 endpoint reference was unavailable during this pass, this document records the surviving official **v1** route surface and explicitly notes the v2-doc blocker.

- Reviewed base URL: `https://api.marketstack.com/v1`
- Transport: HTTPS + JSON
- Auth: `access_key` query parameter
- Request style on reviewed docs: HTTP `GET`
- Pagination model: `limit` + `offset` with response `pagination.limit`, `pagination.offset`, `pagination.count`, `pagination.total`
- Manual route count confirmed from the official v1 docs: **29** canonical GET routes

## Authentication
All reviewed examples authenticate by query parameter:

```text
?access_key=YOUR_ACCESS_KEY
```

The reviewed docs did not show a bearer-token or header-based auth alternative.

## Confirmed endpoints
### Core market data
- `GET /eod` — end-of-day data for one or more symbols
- `GET /eod/{date}` — end-of-day data for a specific date or ISO-8601 timestamp
- `GET /eod/latest` — latest end-of-day data
- `GET /intraday` — intraday / real-time data
- `GET /intraday/{date}` — intraday data for a specific date or ISO-8601 timestamp
- `GET /intraday/latest` — latest intraday data
- `GET /splits` — stock split data
- `GET /dividends` — dividend data

### Ticker-scoped routes
- `GET /tickers` — list/search tickers
- `GET /tickers/{symbol}` — metadata for one ticker
- `GET /tickers/{symbol}/eod`
- `GET /tickers/{symbol}/eod/{date}`
- `GET /tickers/{symbol}/eod/latest`
- `GET /tickers/{symbol}/intraday`
- `GET /tickers/{symbol}/intraday/latest`
- `GET /tickers/{symbol}/splits`
- `GET /tickers/{symbol}/dividends`

### Exchange-scoped routes
- `GET /exchanges` — list/search exchanges
- `GET /exchanges/{mic}` — one exchange by MIC
- `GET /exchanges/{mic}/tickers`
- `GET /exchanges/{mic}/eod`
- `GET /exchanges/{mic}/eod/{date}`
- `GET /exchanges/{mic}/eod/latest`
- `GET /exchanges/{mic}/intraday`
- `GET /exchanges/{mic}/intraday/{date}`
- `GET /exchanges/{mic}/intraday/latest`

### Reference data
- `GET /currencies`
- `GET /timezones`

### Index-specialized shorthand called out by the docs
The official page separately highlights market-index variants using the `INDX` MIC:
- `GET /exchanges/INDX/tickers`
- `GET /tickers/{symbol}.INDX`
- `GET /tickers/{symbol}.INDX/eod`

## Key parameters
### Common auth / pagination parameters
Used widely across the reviewed v1 routes:
- `access_key` — required API key
- `limit` — optional page size, default `100`, maximum `1000`
- `offset` — optional pagination offset, default `0`

### End-of-day routes
Reviewed docs confirm these parameters on `/eod` and related variants:
- `symbols` — required comma-separated ticker list, maximum `100`; each symbol counts as one API request
- `exchange` — optional MIC exchange filter such as `XNAS`
- `sort` — optional `DESC` or `ASC`
- `date_from` — optional lower date/time bound
- `date_to` — optional upper date/time bound
- path date segment on `/eod/{date}` and ticker/exchange date variants supports `YYYY-MM-DD` and ISO-8601 timestamps

### Intraday routes
Reviewed docs confirm the same general data-window parameters plus:
- `symbols` — required on `/intraday`
- `exchange` — optional MIC filter such as `IEXG`
- `interval` — optional; documented values `1min`, `5min`, `10min`, `15min`, `30min`, `1hour` (default), `3hour`, `6hour`, `12hour`, `24hour`
- `sort`, `date_from`, `date_to`, `limit`, `offset`

### Splits / dividends
Reviewed docs confirm:
- `symbols` — required
- `sort`
- `date_from`
- `date_to`
- `limit`
- `offset`

### Tickers
Reviewed docs confirm:
- `exchange` — optional exchange MIC filter
- `search` — optional search by company name or ticker symbol
- `limit`
- `offset`

Ticker child routes inherit the parameter families of their corresponding parent datasets:
- `/tickers/{symbol}/eod*` uses end-of-day parameters
- `/tickers/{symbol}/intraday*` uses intraday parameters
- `/tickers/{symbol}/splits` and `/tickers/{symbol}/dividends` use date window + sort + pagination controls

### Exchanges
Reviewed docs confirm:
- `search` — optional search by exchange name or MIC
- `limit`
- `offset`

Exchange child routes inherit the parameter families of the referenced data endpoints:
- `/exchanges/{mic}/eod*` follows end-of-day rules
- `/exchanges/{mic}/intraday*` follows intraday rules

### Currencies and timezones
Reviewed docs confirm only:
- `access_key`
- `limit`
- `offset`

## Response format
The reviewed v1 docs consistently show this top-level structure:

```json
{
  "pagination": {
    "limit": 100,
    "offset": 0,
    "count": 100,
    "total": 9944
  },
  "data": []
}
```

### Confirmed response-field patterns
For market-price datasets (`/eod`, `/intraday`, ticker/exchange variants), the reviewed examples/documentation confirm fields such as:
- `date`
- `symbol`
- `exchange`
- `open`
- `high`
- `low`
- `close`
- `volume`
- `adj_open`
- `adj_high`
- `adj_low`
- `adj_close`
- `adj_volume`
- `split_factor`
- `dividend`

For `/splits`:
- `date`
- `split_factor`
- `symbol`

For `/dividends`:
- `date`
- `dividend`
- `symbol`

For `/tickers`:
- `name`
- `symbol`
- nested `stock_exchange` object with exchange metadata

For `/exchanges`:
- `name`
- `acronym`
- `mic`
- `country`
- `country_code`
- `city`
- `website`
- nested `timezone`

For `/currencies`:
- `code`
- `name`
- `symbol`
- `symbol_native`

For `/timezones`:
- `timezone`
- `abbr`
- `abbr_dst`

## Pagination
Pagination is explicitly documented on the reviewed v1 pages.

Confirmed rules:
- default `limit` is `100`
- maximum `limit` is `1000`
- default `offset` is `0`
- pagination metadata is returned as `pagination.limit`, `pagination.offset`, `pagination.count`, `pagination.total`

## Errors and rate limits
The reviewed v1 endpoint page focuses on route parameters and examples. It does **not** publish a centralized numeric rate limit or a consolidated error schema.

What is confirmed from the reviewed official pages:
- responses are JSON
- requests are API-key protected via `access_key`
- pagination/error details are not documented centrally on the reviewed v1 page
- the currently linked official v2 reference page was unavailable during review, so no newer official error/rate-limit reference could be confirmed

## Important usage notes
- The official v1 page explicitly states that **new functionality belongs to v2** and that **v1 is deprecated after 2025-06-30**.
- The official v2 docs page linked from the same documentation currently fails with an APILayer not-found page; treat that as an official-doc blocker for the current v2 route surface.
- For market indices, the docs explicitly instruct using exchange MIC `INDX`, e.g. `DJI.INDX`.
- Historical end-of-day data is documented as available up to **30 years** back.
- Historical intraday availability is documented as the most recent **10,000 entries** for each supported interval.
- The docs note that each symbol in a multi-symbol request consumes one API request.

## fireROUTE notes
- Marketstack should remain a mostly raw passthrough integration because the API surface is family-oriented and highly query-driven.
- Preserve the provider’s pagination object exactly.
- For normalized usage, the most practical core mapping is `/eod`, `/intraday`, `/tickers`, `/exchanges`, `/currencies`, and `/timezones`.
- If fireROUTE later adopts Marketstack v2, keep this v1 deprecation note in place until the official v2 route reference is publicly available again.