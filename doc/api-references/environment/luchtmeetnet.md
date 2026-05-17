# Luchtmeetnet

## Provider metadata
- Category: `Environment`
- Provider slug: `luchtmeetnet`
- Official docs inspected manually:
  - `https://api-docs.luchtmeetnet.nl/`
  - published collection payload served by the same official docs host
- Confirmed API base URL: `https://api.luchtmeetnet.nl`
- Response formats confirmed from docs: JSON plus one ASCII concentration endpoint
- Authentication model: none; the docs explicitly say the API is publicly available under fair use
- Manually confirmed routes in this pass: `9`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/open_api/components/{formula}` | Get one measurement component definition | required component `formula` |
| GET | `/open_api/components` | List components | optional `page`, `order_by` |
| GET | `/open_api/organisations` | List organizations | optional `page` |
| GET | `/open_api/stations` | List stations | optional `order_by`, `organisation_id`, `page` |
| GET | `/open_api/stations/{station_number}` | Get one station | required `station_number` |
| GET | `/open_api/stations/{station_number}/measurements` | Get measurements for one station | required `station_number`; optional `page`, `order`, `order_direction`, `formula` |
| GET | `/open_api/measurements` | Search measurements across stations | optional `station_number`, `formula`, `page`, `order_by`, `order_direction`, `start`, `end` |
| GET | `/open_api/lki` | Get air-quality-index style LKI data | optional `page`, `order_by`, `order_direction` |
| GET | `/open_api/concentrations` | Get concentration data in ASCII-oriented form | documented query params include `formula`, `longitude`, `latitude` |

## Rate limits, pagination, and transport
- The official docs state data is updated hourly.
- The docs explicitly state a rate limit of `100 requests per 5 minutes`.
- List endpoints are paginated and return `data` plus a `pagination` object with fields such as `first_page`, `last_page`, `current_page`, `prev_page`, `next_page`, and `page_list`.

## Error and response notes
- JSON is the standard response format for the main API surface.
- The published collection includes `404 Not Found` examples for missing resources.
- The docs recommend using the RIVM dataportal for large historical datasets.

## Important fireROUTE notes
- This API focuses on current detailed station/component data rather than bulk historical archives.
- Historical-scale ingestion should use the separate RIVM data portal referenced by the official docs.

## Verification notes
This file was manually rebuilt from the official Luchtmeetnet OpenAPI documentation and the official published collection payload.