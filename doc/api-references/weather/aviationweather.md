# AviationWeather

## Provider metadata
- Category: `Weather`
- Provider slug: `aviationweather`
- Official docs used manually:
  - `https://aviationweather.gov/data/api/`
  - `https://aviationweather.gov/data/api/#/`
  - OpenAPI link advertised on the page: `https://aviationweather.gov/data/schema/openapi.yaml`
- Confirmed API base path family: `/api/data/*` on `https://aviationweather.gov`
- Response formats confirmed from the official docs: raw text, JSON, GeoJSON, CSV, XML, IWXXM (varies by product)
- Authentication model: no auth requirement documented for the public data API pages inspected
- Manually confirmed routes in this pass: `15`

## Manually confirmed endpoints from the Specifications interface
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/data/metar` | METAR terminal observations |
| GET | `/api/data/taf` | TAF terminal forecasts |
| GET | `/api/data/pirep` | Pilot reports |
| GET | `/api/data/airsigmet` | Domestic SIGMETs |
| GET | `/api/data/isigmet` | International SIGMETs |
| GET | `/api/data/gairmet` | US Graphical AIRMETs |
| GET | `/api/data/airmet` | AIRMETs |
| GET | `/api/data/tcf` | TFM Convective Forecast |
| GET | `/api/data/cwa` | CWSU Center Advisories |
| GET | `/api/data/windtemp` | Wind/temperature point data |
| GET | `/api/data/areafcst` | US area forecasts |
| GET | `/api/data/fcstdisc` | US forecast discussions |
| GET | `/api/data/mis` | Meteorological Information Statements |
| GET | `/api/data/dataserver` | Data Server endpoint |
| GET | `/api/data/stationinfo` | Station information |

## Documentation notes from the official pages
- The introduction says the weather database currently allows access to up to the previous 15 days of data.
- The docs ask users to keep requests limited in scope and frequency and note that maximum results per query and rate limiting apply.
- For larger queries, the docs recommend cache files.
- Product-format support varies by dataset. Examples from the product table include raw text, JSON, GeoJSON, CSV, XML, and IWXXM.

## Rate limits, pagination, and errors
- The docs confirm that rate limiting exists and maximum results per query apply, but the inspected pages did not show a simple public numeric quota table.
- No general pagination scheme was documented on the pages inspected.
- An OpenAPI specification is published by the official site for deeper schema-level details.

## Important fireROUTE notes
- AviationWeather is product-family oriented rather than a single generic weather endpoint.
- Output format support differs by product; adapters should preserve format negotiation/options.
- Prefer cache files for bulk retrieval as recommended by the provider.

## Verification notes
This file was manually rebuilt from Aviation Weather Center's live Data API pages and Specifications interface.