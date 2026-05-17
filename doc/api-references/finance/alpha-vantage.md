# Alpha Vantage

Official docs manually reviewed:
- https://www.alphavantage.co/documentation/
- https://www.alphavantage.co/support/#api-key

## Overview
Alpha Vantage exposes a large catalog of market, fundamentals, news, macroeconomic, forex, crypto, commodity, options, and technical-indicator data through a single HTTP endpoint. The official documentation consistently shows query-string driven requests where the `function` parameter selects the logical operation.

- Base URL: `https://www.alphavantage.co`
- Canonical API path: `GET /query`
- Primary full request shape: `https://www.alphavantage.co/query?function=FUNCTION_NAME&apikey=YOUR_API_KEY`
- Auth: API key in query string via `apikey`
- Response formats: JSON by default; many endpoints also support `datatype=csv`

## Authentication
The reviewed support page confirms that Alpha Vantage issues free API keys and that usage requires an API key. All official examples on the documentation page pass the key as a query parameter:

```text
apikey=demo
```

For production use, replace the demo key with your own key.

## Confirmed endpoint
| Method | Path | Purpose | Core parameters |
|---|---|---|---|
| GET | `/query` | Universal Alpha Vantage endpoint; `function` selects the dataset/operation | `function`, `apikey`, plus operation-specific parameters such as `symbol`, `interval`, `keywords`, `from_symbol`, `to_symbol`, `datatype`, `outputsize`, `month`, `market`, `time_period` |

Manual route count confirmed from the reviewed official documentation: **1** HTTP route.

## Operation families confirmed on `/query`
The documentation page exposes many logical APIs behind the same route. Confirmed function families/examples from the reviewed page include:

### Core stocks
- `TIME_SERIES_INTRADAY`
- `TIME_SERIES_DAILY`
- `TIME_SERIES_DAILY_ADJUSTED`
- `TIME_SERIES_WEEKLY`
- `TIME_SERIES_WEEKLY_ADJUSTED`
- `TIME_SERIES_MONTHLY`
- `TIME_SERIES_MONTHLY_ADJUSTED`
- `GLOBAL_QUOTE`
- `REALTIME_BULK_QUOTES`
- `SYMBOL_SEARCH`
- `MARKET_STATUS`

### Indices and options
- `INDEX_DATA`
- `INDEX_CATALOG`
- `REALTIME_OPTIONS`
- `HISTORICAL_OPTIONS`
- `REALTIME_PUT_CALL_RATIO`
- `HISTORICAL_PUT_CALL_RATIO`
- `REALTIME_VOLUME_OPEN_INTEREST_RATIO`
- `HISTORICAL_VOLUME_OPEN_INTEREST_RATIO`

### Alpha Intelligence and fundamentals
- `NEWS_SENTIMENT`
- `EARNINGS_CALL_TRANSCRIPT`
- `TOP_GAINERS_LOSERS`
- `INSIDER_TRANSACTIONS`
- `INSTITUTIONAL_HOLDINGS`
- `ANALYTICS_FIXED_WINDOW`
- `ANALYTICS_SLIDING_WINDOW`
- `OVERVIEW`
- `ETF_PROFILE`
- `DIVIDENDS`
- `SPLITS`
- `INCOME_STATEMENT`
- `BALANCE_SHEET`
- `CASH_FLOW`
- `SHARES_OUTSTANDING`
- `EARNINGS`
- `EARNINGS_ESTIMATES`
- `LISTING_STATUS`
- `EARNINGS_CALENDAR`
- `IPO_CALENDAR`

### FX and crypto
- `CURRENCY_EXCHANGE_RATE`
- `FX_INTRADAY`
- `FX_DAILY`
- `FX_WEEKLY`
- `FX_MONTHLY`
- `CRYPTO_INTRADAY`
- `DIGITAL_CURRENCY_DAILY`
- `DIGITAL_CURRENCY_WEEKLY`
- `DIGITAL_CURRENCY_MONTHLY`

### Commodities, economics, and technical indicators
The reviewed docs also expose many more `function=` values for commodities, macro indicators, and indicators such as SMA/EMA/RSI/MACD. The documentation page currently contains well over 100 distinct function names, all still routed through `GET /query`.

## Common parameters confirmed from official examples
The reviewed documentation examples expose these recurring parameters:

- Required on every request:
  - `function`
  - `apikey`
- Frequently required or common:
  - `symbol`
  - `interval`
  - `keywords`
  - `from_symbol`
  - `to_symbol`
  - `from_currency`
  - `to_currency`
  - `market`
  - `time_period`
  - `series_type`
  - `month`
  - `date`
  - `outputsize`
  - `datatype`
- Premium/specialized examples on the docs page also show parameters such as:
  - `tickers`
  - `contract`
  - `horizon`
  - `limit`
  - `maturity`
  - `state`
  - `require_greeks`
  - indicator-specific tunables such as `fastperiod`, `matype`, `nbdevup`, `nbdevdn`, `acceleration`

## Request and response patterns
### Request pattern
The official docs show URL-encoded query-string requests. Example patterns confirmed from the page:

```text
GET https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
GET https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo
GET https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo
```

### Response format
The reviewed docs confirm:
- JSON is the default response format.
- Many endpoints support CSV output using `datatype=csv`.
- JSON shapes vary by `function`; common shapes include metadata blocks, time-series maps keyed by timestamp/date, quote objects, arrays of matches, and dataset-specific objects.

## Rate limits
The reviewed support FAQ currently states:
- free stock API service covers the majority of datasets for **up to 25 requests per day**
- larger call volume requires a premium membership

The reviewed support page did not publish a more detailed universal per-minute rate schedule for all functions.

## Pagination
No generic provider-wide pagination contract is documented for `/query`.

Instead, dataset-specific controls are used, for example:
- `outputsize=full` for larger historical time series
- date/month filters such as `date` or `month`
- dataset-specific limits such as `limit`

## Errors
The reviewed documentation does not publish a single shared formal error schema for all functions.

Practical integration notes from the official material:
- preserve the response body even on unsuccessful requests
- expect provider-generated informational/error payloads to be function-specific rather than a single normalized envelope
- treat quota exhaustion and invalid parameter combinations as API-level failures surfaced in the body and/or HTTP status

## Important usage notes
- Alpha Vantage is logically multi-endpoint, but physically single-route: nearly everything is `GET /query` with a different `function` value.
- The docs use a public `demo` key in examples; do not rely on it for production workloads.
- `datatype=csv` is not universal but is explicitly documented for many time-series style endpoints.
- Some functions on the docs page are marked premium.
- The official documentation page is expansive; preserve provider-specific query parameters rather than over-normalizing them away.

## fireROUTE notes
- Treat Alpha Vantage as a single-route provider with a large operation selector space driven by `function`.
- Canonical adapters should preserve the upstream `function` value and pass through operation-specific query parameters.
- For normalized use cases, common groupings can be stocks, quote, search, fundamentals, FX, crypto, economic indicators, and technical indicators; but raw passthrough remains important because the upstream surface is broad.
