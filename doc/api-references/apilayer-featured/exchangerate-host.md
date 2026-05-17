# Exchangerate Host

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `exchangerate-host`
- Official docs inspected manually:
  - `https://exchangerate.host/`
  - official documentation page linked from the site
- Confirmed API base URL: `https://api.exchangerate.host`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `6`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/live` | Fetch latest exchange rates | required `access_key`; optional `symbols` |
| GET | `/historical` | Fetch historical rates for one date | required `access_key`; required `date` |
| GET | `/convert` | Convert one amount between currencies | required `access_key`; required `from`, `to`, `amount` |
| GET | `/timeframe` | Fetch rates across a date range | required `access_key`; required `start_date`, `end_date` |
| GET | `/change` | Calculate absolute and percentage change over time | required `access_key`; required `start_date`, `end_date` |
| GET | `/list` | List supported currencies | required `access_key` |

## Usage notes
- The official docs page explicitly states that all endpoints start from `https://api.exchangerate.host/`.
- The service is positioned as real-time and historical forex plus crypto-rate data.
- The docs warn that some advanced endpoints may depend on the subscription plan.

## Important fireROUTE notes
- The official product branding resembles the public free exchangerate.host service, but the inspected APILayer product uses key-based access and a commercial plan model.
- Do not assume parity with unrelated public exchange-rate services using similar names.

## Verification notes
This file was manually rebuilt from the official Exchangerate.host site and its linked documentation pages.