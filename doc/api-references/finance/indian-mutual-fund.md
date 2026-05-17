# Indian Mutual Fund

Official docs manually reviewed:
- https://www.mfapi.in/
- https://www.mfapi.in/docs/
- https://www.mfapi.in/docs/openapi.json

## Overview
MFapi.in publishes a free JSON API for Indian mutual-fund scheme discovery and NAV retrieval. The reviewed homepage and OpenAPI document clearly expose the production server, authentication model, update cadence, and current route set.

- Base URL: `https://api.mfapi.in`
- Transport: HTTPS
- Response format: JSON
- Authentication: none
- Rate limiting: none documented; homepage explicitly says no rate limiting
- Update cadence shown on homepage: `6x daily` (`10:05 AM`, `2:05 PM`, `6:05 PM`, `9:05 PM`, `3:09 AM`, `5:05 AM IST`)

## Authentication
The reviewed homepage and docs explicitly say:
- no authentication required
- no API keys required

This is a public read-only API.

## Confirmed endpoints
The reviewed docs and official OpenAPI document expose these routes:

| Method | Path | Purpose |
|---|---|---|
| GET | `/mf/search` | Search mutual fund schemes by name |
| GET | `/mf` | List all mutual fund schemes with pagination |
| GET | `/mf/{scheme_code}` | Get NAV history for one scheme |
| GET | `/mf/{scheme_code}/latest` | Get the latest NAV for one scheme |
| GET | `/mf/latest` | Get latest NAV data for all schemes |

Manual route count confirmed from the reviewed official docs and OpenAPI file: **5**.

## Endpoint details
### `GET /mf/search`
Purpose: search scheme names using full-text matching.

Confirmed query parameter:
- `q` (required string) — search query string

Official example shown in the docs:

```text
GET https://api.mfapi.in/mf/search?q=HDFC
```

Confirmed success response:
- JSON array of search results
- each result includes at least `schemeCode` and `schemeName`

Confirmed documented non-success response:
- `400` when the search query is missing

### `GET /mf`
Purpose: list all schemes.

Confirmed query parameters:
- `limit` (optional integer, min `1`, max `1000`)
- `offset` (optional integer, min `0`, default `0`)

Official example shown in the docs:

```text
GET https://api.mfapi.in/mf?limit=100&offset=0
```

Confirmed response notes:
- JSON array response
- array items include `schemeCode`, `schemeName`, `isinGrowth`, and `isinDivReinvestment`

### `GET /mf/{scheme_code}`
Purpose: retrieve NAV history for one scheme.

Confirmed path parameter:
- `scheme_code` (required integer)

Confirmed optional query parameters:
- `startDate` (date, ISO `YYYY-MM-DD`)
- `endDate` (date, ISO `YYYY-MM-DD`)

Official example shown in the docs:

```text
GET https://api.mfapi.in/mf/125497?startDate=2023-01-01&endDate=2023-12-31
```

Confirmed response shape:
- object with `meta`, `data`, and `status`
- `meta` includes fields such as `fund_house`, `scheme_type`, `scheme_category`, `scheme_code`, `scheme_name`, `isin_growth`, and `isin_div_reinvestment`
- `data` is an array of `{ date, nav }` objects
- `status` example shown as `SUCCESS`

Confirmed documented non-success response:
- `404` when scheme not found

### `GET /mf/{scheme_code}/latest`
Purpose: retrieve the most recent NAV for one scheme.

Confirmed path parameter:
- `scheme_code` (required integer)

Confirmed response shape:
- same top-level `meta`, `data`, `status` structure as the history route
- `data` contains the most recent NAV record

Confirmed documented non-success response:
- `404` when scheme not found

### `GET /mf/latest`
Purpose: retrieve latest NAV data for all schemes.

Confirmed response notes:
- JSON array response
- example fields include `schemeCode`, `schemeName`, `fundHouse`, `schemeType`, `schemeCategory`, `isinGrowth`, `isinDivReinvestment`, `nav`, and `date`
- docs describe the result as the complete cached latest-NAV dataset

## Pagination
The reviewed docs only publish explicit pagination controls for the scheme-list route:
- `limit`
- `offset`

No cursor or page-number scheme is documented elsewhere.

## Rate limits
The reviewed homepage explicitly says:
- no rate limiting

The reviewed docs do not publish a separate numeric quota or throttle table.

## Errors
The current official docs visibly document only a small number of route-specific non-success responses:
- `400` on `/mf/search` for missing search query
- `404` on `/mf/{scheme_code}` when scheme not found
- `404` on `/mf/{scheme_code}/latest` when scheme not found

No universal cross-endpoint error-envelope section was visible in the reviewed docs/OpenAPI excerpt, so fireROUTE should preserve raw provider errors.

## Response format notes
Confirmed response styles from the reviewed docs:
- search route returns a plain JSON array of `{ schemeCode, schemeName }`
- list route returns a plain JSON array of scheme objects
- history/latest-by-scheme routes return an object envelope with:
  - `meta`
  - `data`
  - `status`
- all-schemes latest route returns a plain JSON array

Confirmed field-format notes from the reviewed schemas/examples:
- NAV records use `date` in `DD-MM-YYYY` format
- NAV values are returned as strings

## Important usage notes
- This is a public, unauthenticated, read-only API.
- The provider separates scheme discovery (`/mf/search`, `/mf`) from NAV retrieval (`/mf/{scheme_code}`, `/latest`).
- Date filters on history use ISO-style query input (`YYYY-MM-DD`), while returned NAV record dates are shown in `DD-MM-YYYY` format.
- The all-schemes latest route returns a very large cached dataset and should be handled accordingly.

## fireROUTE notes
- The cleanest normalized surfaces here are: search schemes, list schemes, fetch scheme history, fetch scheme latest NAV, and fetch full latest snapshot.
- Preserve the provider’s mixed response styles rather than forcing everything into one envelope.
- `scheme_code` is the key stable identifier for follow-up NAV lookups.
