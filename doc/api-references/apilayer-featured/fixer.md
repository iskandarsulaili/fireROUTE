# Fixer

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `fixer`
- Official docs inspected manually:
  - `https://fixer.io/`
  - `https://docs.apilayer.com/fixer/docs/quickstart-guide`
- Confirmed API base URL: `https://data.fixer.io/api`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `6`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/latest` | Latest foreign exchange rates | required `access_key`; optional base/symbol filters depending plan |
| GET | `/convert` | Currency conversion | required `access_key`; required `from`, `to`, `amount`; optional `date` |
| GET | `/historical` or `/{date}` | Historical rates for a date | required `access_key`; required date selector |
| GET | `/timeseries` | Rates across a date range | required `access_key`; date-range params |
| GET | `/fluctuation` | Rate fluctuation analytics over a date range | required `access_key`; date-range params |
| GET | `/symbols` | List supported currencies/symbols | required `access_key` |

## Usage notes
- The official quickstart explicitly publishes `https://data.fixer.io/api/` as the base URL.
- The example latest-rates request is `GET https://data.fixer.io/api/latest?access_key=YOUR_API_KEY`.
- The quickstart also documents a convert example using `/convert` with `from`, `to`, and `amount`.

## Plan and compatibility notes
- The official pricing/features tables indicate that some capabilities such as broader base-currency support and time-series access are plan-dependent.
- The service is HTTPS and key-based.

## Verification notes
This file was manually rebuilt from Fixer's official site and APILayer-hosted docs.