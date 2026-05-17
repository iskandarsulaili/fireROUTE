# FRED

Official docs manually reviewed:
- https://fred.stlouisfed.org/docs/api/fred/
- https://fred.stlouisfed.org/docs/api/api_key.html
- https://fred.stlouisfed.org/docs/api/fred/errors.html
- https://fred.stlouisfed.org/docs/api/fred/series_observations.html

## Overview
The Federal Reserve Bank of St. Louis exposes the FRED API over `api.stlouisfed.org`. The docs distinguish:
- FRED API Version 1 for incremental series/category/release access
- FRED API Version 2 for release-bulk observation retrieval

This fireROUTE provider file documents the Version 1 route families that are explicitly listed on the official API index page plus the common auth/error/output behavior shown in the reviewed pages.

- Base URL: `https://api.stlouisfed.org`
- Default file type: `xml`
- Supported output types confirmed on reviewed pages: `xml`, `json`, `xlsx`, `csv` (endpoint-dependent)
- Auth: `api_key` query parameter

## Authentication
FRED Version 1 requires a registered API key. The docs instruct users to request/view keys through FRED Account.

Example request pattern:

```text
https://api.stlouisfed.org/fred/series/observations?series_id=GNPCA&api_key=YOUR_API_KEY
```

## Confirmed endpoint families
The index page explicitly lists these Version 1 endpoints.

### Categories
- `GET /fred/category`
- `GET /fred/category/children`
- `GET /fred/category/related`
- `GET /fred/category/series`
- `GET /fred/category/tags`
- `GET /fred/category/related_tags`

### Releases
- `GET /fred/releases`
- `GET /fred/releases/dates`
- `GET /fred/release`
- `GET /fred/release/dates`
- `GET /fred/release/series`
- `GET /fred/release/sources`
- `GET /fred/release/tags`
- `GET /fred/release/related_tags`
- `GET /fred/release/tables`

### Series
- `GET /fred/series`
- `GET /fred/series/categories`
- `GET /fred/series/observations`
- `GET /fred/series/release`
- `GET /fred/series/search`
- `GET /fred/series/search/tags`
- `GET /fred/series/search/related_tags`
- `GET /fred/series/tags`
- `GET /fred/series/updates`
- `GET /fred/series/vintagedates`

### Sources
- `GET /fred/sources`
- `GET /fred/source`
- `GET /fred/source/releases`

### Tags
- `GET /fred/tags`
- `GET /fred/related_tags`
- `GET /fred/tags/series`

### Maps API
- `GET /fred/maps/shape_file`
- `GET /fred/maps/series_group_meta`
- `GET /fred/maps/series_regional_data`
- `GET /fred/maps/regional_data`

Manual route count confirmed from the official index page: **35**.

## Common request parameters
From the reviewed docs and the `fred/series/observations` page, these recurring query parameters are confirmed:
- `api_key` — required authentication token
- `file_type` — output format; docs show `xml`, `json`, `xlsx`, `csv` depending on endpoint
- `realtime_start`, `realtime_end` — real-time vintage date boundaries
- `limit`, `offset` — pagination controls
- `sort_order` — sort direction

## `fred/series/observations` details
This is the most implementation-relevant endpoint for time-series retrieval.

Confirmed request path:
- `GET /fred/series/observations`

Confirmed query parameters on the reviewed page:
- `api_key`
- `file_type`
- `series_id`
- `realtime_start`
- `realtime_end`
- `limit`
- `offset`
- `sort_order`
- `observation_start`
- `observation_end`
- `units`
- `frequency`
- `aggregation_method`
- `output_type`
- `vintage_dates`

Confirmed example request:

```text
https://api.stlouisfed.org/fred/series/observations?series_id=GNPCA&api_key=abcdefghijklmnopqrstuvwxyz123456
```

The docs explicitly note:
- default `file_type` is `xml`
- the endpoint can return XML, JSON, Excel spreadsheet, or zipped CSV depending on `file_type`

## Pagination
Version 1 pages explicitly use:
- `limit`
- `offset`

## Errors
The official errors page shows both XML and JSON error payloads.

Confirmed JSON error shape:

```json
{
  "error_code": 400,
  "error_message": "Bad Request.  The value for variable api_key is not registered.  Read https://fred.stlouisfed.org/docs/api/api_key.html for more information."
}
```

Confirmed XML error shape:

```xml
<error code="400" message="Bad Request.  Variable api_key has not been set."/>
```

## Important usage notes
- FRED Version 1 is query-string driven and heavily parameterized; it is not a JSON body API.
- If you want stable JSON handling in fireROUTE, explicitly request `file_type=json`.
- `realtime_start` and `realtime_end` matter for vintage-aware datasets and ALFRED-style use cases.
- The docs split “maps” endpoints from core series/category/release endpoints; keep them as separate capability groups in adapters.

## fireROUTE notes
- Canonicalize FRED as a read-only finance/economic-data provider.
- Prefer passthrough query translation rather than aggressively remapping FRED’s domain-specific filters.
- `series/observations` is the most natural default route for normalized time-series fetches; preserve raw FRED parameters for advanced users.
