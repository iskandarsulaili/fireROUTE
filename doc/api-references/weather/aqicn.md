# AQICN

## Provider metadata
- Category: `Weather`
- Provider slug: `aqicn`
- Official docs used manually:
  - `https://aqicn.org/api/`
  - `https://aqicn.org/json-api/doc/`
- Confirmed API host: `http://api.waqi.info`
- Response format confirmed from docs: JSON
- Authentication model: token passed as a query parameter
- Manually confirmed routes in this pass: `3`

## Authentication
The official docs say the first step is to acquire a token. The JSON API pages document token-based authentication through the `token` query parameter.

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/feed/:city/` | Real-time air-quality feed for a named city or station id | required `city`, required `token`, optional `callback` |
| GET | `/feed/geo::lat;:lng/` | Nearest-station feed for a latitude/longitude pair | required `lat`, `lng`, `token`; optional JSONP callback |
| GET | `/search/` | Search stations by name | required `keyword`, required `token` |

## Response and error notes
- JSON success bodies include `status` and `data`.
- City feed docs show `data` fields such as `idx`, `aqi`, `time`, `city`, `attributions`, `iaqi`, and `forecast`.
- The docs explicitly list representative error conditions including `overQuota`, `invalidKey`, and `unknownCity`.
- Error examples still return a JSON body with `status: "error"` and a message.

## Rate limits, pagination, and usage notes
- The public JSON API docs do not publish a numeric rate-limit table on the pages inspected.
- The docs explicitly mention quota exhaustion via the `overQuota` error.
- No pagination scheme was documented on the pages inspected.
- The broader AQICN API page also advertises separate Map Tile and Widget APIs, but this pass focused on the public JSON feed/search endpoints that were directly confirmable.

## Important fireROUTE notes
- Auth is query-string token auth, not header auth.
- AQICN mixes city-name and station-id addressing; adapters should preserve both.
- The documented API host in examples is `api.waqi.info` and examples on the public pages still use `http`.

## Verification notes
This file was manually rebuilt from AQICN's official API overview and JSON API documentation pages.