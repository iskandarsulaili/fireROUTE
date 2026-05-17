# Marketstack

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `marketstack`
- Official docs inspected manually:
  - `https://marketstack.com/`
  - `https://docs.apilayer.com/marketstack/docs/quickstart-guide`
  - `https://docs.apilayer.com/marketstack/docs/api-endpoints-v1/`
- Confirmed API base URL: `http://api.marketstack.com/v1`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `6`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/eod` | End-of-day market data | required `access_key`; required/typical `symbols`; optional `sort`, `date_from`, `date_to`, `limit`, `offset` |
| GET | `/intraday` | Intraday / real-time market data | required `access_key`; typical `symbols`; optional `interval`, `sort`, `date_from`, `date_to`, `limit`, `offset` |
| GET | `/tickers` | Ticker metadata lookup | required `access_key`; optional `exchange`, `limit`, `offset` |
| GET | `/exchanges` | Supported exchange metadata | required `access_key`; optional `limit`, `offset` |
| GET | `/currencies` | Supported currencies | required `access_key`; optional `limit`, `offset` |
| GET | `/timezones` | Supported timezones | required `access_key`; optional `limit`, `offset` |

## Versioning notes
- The official docs still publish `v1` reference pages but warn that new functionality is designed for `v2`.
- The `v1` endpoints inspected in this pass remain clearly documented and were the route family directly visible in the quickstart examples.

## Important fireROUTE notes
- Marketstack is a broad financial-market data API, not a single equity quote endpoint.
- Collection endpoints use `limit`/`offset` pagination and symbol/date filters heavily.

## Verification notes
This file was manually rebuilt from Marketstack's official site and APILayer-hosted documentation.