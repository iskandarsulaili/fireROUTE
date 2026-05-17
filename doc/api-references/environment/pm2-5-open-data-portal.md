# PM2.5 Open Data Portal

## Provider metadata
- Category: `Environment`
- Provider slug: `pm2-5-open-data-portal`
- Official docs inspected manually:
  - `https://pm25.lass-net.org/#apis`
  - `https://app.swaggerhub.com/apis-docs/I2875/PM25_Open_Data/1.0.0`
- Confirmed API base URL: `https://pm25.lass-net.org/API-1.0.0`
- Response format confirmed from docs: JSON
- Authentication model: none documented in the inspected public SwaggerHub reference
- Manually confirmed routes in this pass: `20`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/device/{device_id}/latest/` | Latest reading for one device | required `device_id` |
| GET | `/device/{device_id}/history/` | Historical readings for one device | required `device_id` |
| GET | `/device/{device_id}/date/{yyyy-mm-dd}/` | Device readings for one date | required `device_id`, required `yyyy-mm-dd` |
| GET | `/device/nearest/lat/{lat}/lon/{lon}/` | Find nearest device by coordinates | required `lat`, required `lon` |
| GET | `/project/all/` | List projects | none highlighted |
| GET | `/project/{project}/latest/` | Latest readings for one project | required `project` |
| GET | `/analysis/ADF/emission/` | ADF emission analysis | none highlighted |
| GET | `/analysis/ADF/indoor/` | ADF indoor analysis | none highlighted |
| GET | `/analysis/ADF/pollution/` | ADF pollution analysis | none highlighted |
| GET | `/analysis/ADF/ranking/` | ADF ranking data | none highlighted |
| GET | `/analysis/ADF/ranking/device/{device_id}/` | ADF ranking for one device | required `device_id` |
| GET | `/analysis/ADF/ranking/project/{project}/` | ADF ranking for one project | required `project` |
| GET | `/analysis/DCF/latest/` | Latest DCF analysis data | none highlighted |
| GET | `/analysis/DCF/nearest/lat/{lat}/lon/{lon}/` | Nearest DCF site by coordinates | required `lat`, required `lon` |
| GET | `/analysis/DCF/all/{sensor}/` | All DCF records for a sensor | required `sensor` |
| GET | `/analysis/DCF/config/{site}/` | DCF site configuration | required `site` |
| GET | `/analysis/DCF/model/{site}/` | DCF model output for a site | required `site` |
| GET | `/analysis/DCF/date/{yyyy}/{mm}/{dd}/` | DCF records for a date | required `yyyy`, `mm`, `dd` |
| GET | `/analysis/DCF/date/{yyyy}/{mm}/{dd}/config/{site}/` | DCF site config for a date | required date parts and `site` |
| GET | `/analysis/DCF/date/{yyyy}/{mm}/{dd}/model/{site}/` | DCF model output for a date/site | required date parts and `site` |

## Additional citation endpoints
The official SwaggerHub reference also publishes `GET /citation/` and `GET /citation/ADF/` as supplementary metadata/documentation routes. They were visible during this pass but are not included in the primary route count above.

## Usage notes
- The public portal describes the service as open PM2.5 sensing data from the LASS project.
- The SwaggerHub reference marks the spec as OpenAPI 3.0.
- The API surface mixes device/project retrieval with higher-level ADF and DCF analysis products.

## Important fireROUTE notes
- The platform is broader than a single sensor-readout endpoint and includes derived analysis products.
- Consumers should pin only the subfamilies they really need because schemas differ substantially across `device`, `project`, `analysis`, and `citation` resources.

## Verification notes
This file was manually rebuilt from the PM2.5 Open Data Portal and its official SwaggerHub API documentation.