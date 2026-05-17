# CurrencyScoop

Official pages manually reviewed:
- https://currencyscoop.com/api-documentation
- https://currencybeacon.com/api-documentation

## Overview
The legacy CurrencyScoop documentation URL currently redirects to CurrencyBeacon's official API documentation. For fireROUTE purposes, the live official route surface now visible at the reviewed provider-controlled docs host is CurrencyBeacon-branded.

Confirmed from the reviewed docs:
- Live docs host after redirect: `https://currencybeacon.com/api-documentation`
- Base URL: `https://api.currencybeacon.com/v1`
- Auth: API key either as query parameter `api_key` or `Authorization: Bearer YOUR_ACCESS_KEY`
- Response format: JSON
- HTTPS required

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/latest` | Latest exchange rates; supports base/symbol filtering |
| GET | `/historical` | Historical rates for a requested `date` |
| GET | `/convert` | Currency conversion for an `amount` from one code to another |
| GET | `/timeseries` | Date-range rates over `start_date`/`end_date` |
| GET | `/currencies` | Supported-currency list |

Manual route count confirmed from the reviewed official docs: **5**.

## Parameters and request model
Documented parameters visible on the page:
- `api_key` — query authentication option
- `Authorization: Bearer ...` — header authentication option
- `base` — base currency on latest/historical/timeseries routes
- `symbols` — comma-separated output filter
- `date` — required on `/historical`
- `from`, `to`, `amount` — required conversion inputs on `/convert`
- `start_date`, `end_date` — time-series window on `/timeseries`

## Response format
The reviewed examples show a shared JSON envelope:
- top-level `meta` object with status metadata and disclaimer text
- top-level `response` object containing route-specific payloads

Observed route payloads include fields such as:
- `date`
- `base`
- `rates`
- converted amount data on `/convert`

## Errors
The page includes an `Errors & Status Codes` section. During this manual pass I confirmed the presence of official error documentation, but I did not manually enumerate the full status-code table.

## Rate limits
I did not find a single universal numeric requests-per-second limit on the reviewed docs page.

What was manually confirmable:
- access is plan-based
- the provider markets free and paid tiers
- practical quota/refresh frequency depends on subscription level

## Important usage notes
- The legacy CurrencyScoop docs URL now resolves into CurrencyBeacon's active documentation, so the provider file keeps the historical filename but documents the current official surface.
- The docs explicitly recommend Bearer-header auth for production and `api_key` query auth for simpler development/testing.
- The API is documented as covering both forex and cryptocurrency pairs on the same platform.