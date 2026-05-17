# Frankfurter

Official docs manually reviewed:
- https://frankfurter.dev/

## Overview
Frankfurter is a free exchange-rates API that aggregates currency data from many central-bank providers.

Confirmed from the reviewed official docs:
- Public API base URL: `https://api.frankfurter.dev`
- Current documented version: `v2`
- Authentication: none; the docs explicitly say the public API requires no API key
- Coverage claim shown on the docs: data from 55 central banks, 200 currencies, back to 1948

## Authentication
No API key, bearer token, or HTTP Basic auth is required for the public API.

The official docs explicitly state: the public API lives at `api.frankfurter.dev` and "requires no API key."

## Confirmed endpoints
The reviewed v2 docs expose these current routes.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v2/rates` | Fetch latest, historical, filtered, grouped, or provider-attributed exchange-rate rows |
| GET | `/v2/rate/{base}/{quote}` | Fetch the rate for one currency pair |
| GET | `/v2/currencies` | List currencies with coverage metadata |
| GET | `/v2/currency/{code}` | Get one currency’s metadata and provider coverage |
| GET | `/v2/providers` | List upstream data providers |

Manual route count confirmed from the official docs: **5**.

## Endpoint details

### `GET /v2/rates`
This is the main dataset endpoint on the reviewed docs.

Confirmed query parameters shown in the official examples/docs:
- `base` — change the base currency
- `quotes` — filter target currencies
- `date` — fetch a specific historical date
- `from` — start of a time series
- `group` — downsample a time series; supported values shown: `week`, `month`
- `providers` — scope results to a specific provider or providers
- `expand=providers` — add contributing-provider attribution to blended rates

Confirmed alternate representation from the docs:
- `GET /v2/rates.csv`

The docs also say large date ranges can be requested as NDJSON to stream results line by line.

Confirmed response shape from the reviewed examples:
- JSON array of rows containing fields such as `date`, `base`, `quote`, and `rate`
- when `expand=providers` is used, each row also includes a `providers` array

### `GET /v2/rate/{base}/{quote}`
Official description: get the rate for a single currency pair.

Confirmed example:
- `https://api.frankfurter.dev/v2/rate/EUR/USD`

The docs note that you can optionally add `date` or `providers` when working with a single pair.

Confirmed response shape:

```json
{
  "date": "2026-05-15",
  "base": "EUR",
  "quote": "USD",
  "rate": 1.1704
}
```

### `GET /v2/currencies`
Official description: get available currencies with provider coverage.

Confirmed example:
- `https://api.frankfurter.dev/v2/currencies`

Confirmed query parameter:
- `scope=all` — include legacy currencies

Observed example fields:
- `iso_code`
- `iso_numeric`
- `name`
- `symbol`
- `start_date`

### `GET /v2/currency/{code}`
Official description: get details and provider coverage for a single currency.

Confirmed example:
- `https://api.frankfurter.dev/v2/currency/EUR`

Observed example fields match the currency-list metadata model (`iso_code`, `iso_numeric`, `name`, `symbol`, `start_date`, etc.).

### `GET /v2/providers`
Official description: list the data sources behind the API.

Confirmed example:
- `https://api.frankfurter.dev/v2/providers`

Observed example fields:
- `key`
- `name`
- `country_code`
- `rate_type`
- `pivot_currency`

## Rate limits
The reviewed FAQ explicitly states:
- there are **no quotas**
- requests are **rate-limited to prevent abuse**
- there are **no monthly or daily caps**

The docs do not publish a numeric per-minute/per-second limit on the reviewed page.

## Pagination
No pagination scheme is documented on the reviewed v2 pages. The main `/v2/rates` endpoint is filtered by date ranges, currencies, and providers instead.

## Errors
The reviewed docs explicitly say the API returns standard HTTP status codes with a JSON body.

Confirmed example error body:

```json
{
  "message": "Could not find currency ABC"
}
```

Confirmed status codes from the docs:
- `400` — invalid parameter or malformed request
- `404` — currency, rate, or resource not found
- `422` — request understood but cannot be processed

## Response format
Confirmed from the reviewed docs:
- JSON is the default response format
- `/v2/rates.csv` provides CSV output
- NDJSON is available for large time-series responses

## Important usage notes
- The official docs explicitly say there is **no conversion endpoint**; consumers should fetch rates and multiply locally.
- By default, rates are blended across providers; use the `providers` filter when compliance or source-specific accuracy matters.
- `expand=providers` is useful when you need attribution for blended results.
- The v1 API is still available separately, but the page reviewed here documents the new `v2` API.

## fireROUTE notes
- Treat `/v2/rates` as the primary fireROUTE exchange-rate endpoint.
- Expose `base`, `quotes`, `date`, `from`, `group`, `providers`, and `expand` as passthrough parameters.
- Do not invent a conversion route; keep conversion client-side exactly as the official docs recommend.
