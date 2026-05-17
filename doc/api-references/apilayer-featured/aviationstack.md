# Aviationstack

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `aviationstack`
- Official docs inspected manually:
  - `https://aviationstack.com/`
  - product documentation and quickstart pages linked from the official site
- Confirmed API base URL: `https://api.aviationstack.com/v1`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `12`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/flights` | Real-time flight status lookup | required `access_key`; optional `limit`, `offset`, filters like flight/airline/airport/date |
| GET | `/flights` with `flight_date` | Historical flight data | required `access_key`; `flight_date` plus list/filter params |
| GET | `/flight_schedules` | Scheduled and future flight data | required `access_key`; optional pagination/filter params |
| GET | `/flightsFuture` | Future flight schedule lookup | required `access_key` |
| GET | `/routes` | Airline route metadata | required `access_key`; optional pagination/filter params |
| GET | `/airports` | Airport catalog lookup | required `access_key`; optional pagination/filter params |
| GET | `/airlines` | Airline catalog lookup | required `access_key`; optional pagination/filter params |
| GET | `/airplanes` | Aircraft registry lookup | required `access_key`; optional pagination/filter params |
| GET | `/aircraft_types` | Aircraft type catalog | required `access_key` |
| GET | `/cities` | City catalog lookup | required `access_key` |
| GET | `/countries` | Country catalog lookup | required `access_key` |
| GET | `/taxes` | Aviation tax metadata | required `access_key` |

## Usage notes
- The official endpoint summary explicitly separates live/historical flights, schedules/future flights, route metadata, and lookup catalogs.
- The product page claims updates within roughly `30–60 seconds` for live data.
- The quickstart examples show `limit`, `offset`, and `callback` on multiple endpoints.

## Pagination, errors, and plan notes
- Collection-style endpoints use pagination-style parameters such as `limit` and `offset`.
- Endpoint availability is plan-dependent according to the official summary table.
- The inspected public docs did not expose one simple numeric rate-limit table.

## Verification notes
This file was manually rebuilt from Aviationstack's official site and linked documentation pages.