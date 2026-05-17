# The Report of the Week

Official pages manually reviewed:
- https://github.com/andyklimczak/TheReportOfTheWeek-API/blob/master/README.md
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/README.md
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/app.js
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/app.json
- https://api.github.com/repos/andyklimczak/TheReportOfTheWeek-API/contents/routes
- https://api.github.com/repos/andyklimczak/TheReportOfTheWeek-API/contents/routes/api/v1/reports
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/routes/index.js
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/routes/api/v1/reports/index.js
- https://raw.githubusercontent.com/andyklimczak/TheReportOfTheWeek-API/master/routes/healthz/index.js
- https://thereportoftheweekapi.com/docs

## Overview
- Source stack confirmed from the official repository: Fastify with Swagger UI.
- README base URL note: `https://www.thereportoftheweek.com`
- Source-confirmed route structure: `/`, `/healthz`, `/api/v1/reports`, `/api/v1/reports/{reportId}`
- Authentication: none documented in the reviewed source and README
- Response format: JSON for report routes; plain text for health check; root redirects to docs
- Important deployment note: the official README points to `https://thereportoftheweekapi.com/docs`, but the live docs host no longer serves this API documentation consistently. The repository source was required to confirm the actual routes.

Manual route count confirmed from the reviewed official source: **4** total routes, with **2 primary review-data routes**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Redirects to `/docs` |
| GET | `/healthz` | Startup/health check returning `OK` |
| GET | `/api/v1/reports` | List review records, newest first, with optional filters |
| GET | `/api/v1/reports/{reportId}` | Fetch one review by UUID-like report ID |

## Confirmed parameters

### `GET /api/v1/reports`
Optional query parameters defined in the official route source:
- `category`: enum of `Energy Crisis`, `Running On Empty`, `Other`, `Drink Review`, `Music Review`, `Travel Review`
- `min_rating`: number, minimum `0`, maximum `10`
- `max_rating`: number, minimum `0`, maximum `10`
- `min_date`: string with `date` format
- `max_date`: string with `date` format

Behavior confirmed in source:
- category filtering is exact-match
- rating filters are inclusive (`>= min_rating`, `<= max_rating`)
- date filters are inclusive string comparisons against `dateReleased`
- results are sorted descending by `dateReleased`

### `GET /api/v1/reports/{reportId}`
- Path parameter: `reportId`
- The source looks up the record by `report.id`

## Response and data notes
- `GET /api/v1/reports` returns `{ "reports": [...] }`
- `GET /api/v1/reports/{reportId}` returns `{ "report": { ... } }`
- README example fields for a report object include:
  - `product`
  - `manufacturer`
  - `category`
  - `videoTitle`
  - `videoCode`
  - `dateReleased`
  - `rating`
  - `id`
- Health route returns plain text `OK`

## Errors and status notes
- The detail route throws Fastify's `notFound` error when no matching report exists.
- That means missing IDs return an HTTP 404 response from the framework.
- Successful report reads explicitly send `200` with `Content-Type: application/json`.

## Pagination, rate limits, and auth
- No pagination is implemented in the reviewed source.
- No rate-limit policy is documented in the reviewed README, app source, or route source.
- No auth is required for any confirmed route in the reviewed source.

## Important usage notes
- The reviewed source reads from `data/reports.json` on each request through LowDB, so this API is effectively a read-only wrapper around the repository dataset.
- The API only covers reviews already present in that JSON file; there is no create/update/delete review endpoint in the reviewed source.
- The official docs host linked from the README is currently unreliable/misdirected, so the repository source is the trustworthy official reference for route confirmation.
- The README's stated base host and the docs host are inconsistent; fireROUTE should keep the base URL configurable and treat the source-confirmed paths as canonical.

## fireROUTE notes
- Treat `/api/v1/reports` as the primary collection route.
- Expose raw filter passthrough for `category`, `min_rating`, `max_rating`, `min_date`, and `max_date`.
- Treat `/api/v1/reports/{reportId}` as the canonical item lookup.
- Keep `/healthz` optional in any adapter because it is operational, not content-facing.
