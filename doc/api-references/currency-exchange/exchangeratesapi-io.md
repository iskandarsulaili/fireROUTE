# Exchangeratesapi.io

Official pages manually reviewed:
- https://exchangeratesapi.io/
- https://docs.apilayer.com/docs/exchangerates_data_api

## Overview
Exchangeratesapi.io is currently documented as an APILayer-hosted exchange-rates API.

Confirmed from the reviewed official docs:
- Base URL: `https://api.exchangeratesapi.io/v1`
- Auth: `access_key` query parameter
- Response format: JSON
- Coverage includes real-time, historical, time-series, conversion, and fluctuation data
- Default base currency in the endpoint summary: EUR unless overridden

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/symbols` | List supported currencies and metals |
| GET | `/latest` | Latest exchange rates |
| GET | `/convert` | Convert between currencies, optionally with `date` |
| GET | `/{date}` | Historical rates for a specific date, e.g. `/2025-08-01` |
| GET | `/timeseries` | Date-range daily rates; docs mention up to 365 days |
| GET | `/fluctuation` | Absolute and percentage change between two dates |

Manual route count confirmed from the reviewed official docs: **6**.

## Parameters and request model
Confirmed parameters from the official endpoint-summary table:
- `access_key` — required auth parameter
- `base` — override base currency on supported routes
- `symbols` — filter result currencies
- `from`, `to`, `amount` — required conversion inputs on `/convert`
- `date` — optional historical conversion date on `/convert`
- `start_date`, `end_date` — required on `/timeseries` and `/fluctuation`

## Response and error notes
Observed from the reviewed official docs and marketing examples:
- JSON responses include top-level success metadata and exchange-rate payloads
- real-time examples show fields like `success`, `timestamp`, `source`, and `quotes`
- the APILayer docs include dedicated error handling guidance, but I did not manually enumerate every error code in this pass

## Rate limits
I did not find one universal numeric per-second throttle on the reviewed endpoint-summary page.

What was manually confirmable:
- access is tier-based
- the homepage advertises a free plan with `100` monthly requests
- higher quotas depend on paid plans

## Important usage notes
- Although the product name is legacy `exchangeratesapi.io`, the current endpoint documentation is served through APILayer.
- The docs present `/{date}` as a real path segment rather than a query parameter route.
- If you expose this provider through fireROUTE, preserve the APILayer `access_key` query-auth convention exactly as documented.