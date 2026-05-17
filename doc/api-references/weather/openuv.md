# OpenUV

## Provider metadata
- Category: `Weather`
- Provider slug: `openuv`
- Official docs/site checked manually:
  - `https://www.openuv.io/`
- Confirmed API base URL from the live public homepage example: `https://api.openuv.io/api/v1`
- Publicly confirmed response format: JSON
- Authentication model: header `x-access-token: <api-key>`
- Manually confirmed routes in this pass: `1`

## Authentication and transport
The public homepage shows a cURL example using:
- Method: `GET`
- URL: `https://api.openuv.io/api/v1/uv?lat=-33.34&lng=115.342`
- Header: `x-access-token: Your_API_Key`

The same homepage also explicitly advertises:
- `CORS supported`
- `No POST endpoints`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/uv` | Real-time UV index lookup for a coordinate | required `lat`, required `lng` |

## Route notes
### 1) `GET /uv`
- The official homepage presents this as the public real-time UV index example endpoint.
- The request example uses query parameters `lat` and `lng`.
- The example response shown publicly includes:
  - `uv`
  - `uv_time`
  - `uv_max`
  - `uv_max_time`
  - `ozone`
  - `ozone_time`
- The product positioning on the same page describes the service as a global real-time UV Index JSON API.

## Rate limits, pagination, errors, and usage notes
- The public pricing section lists these request caps:
  - `Personal Plan` / `Free Forever` / `Up to 50 reqs per day`
  - `Start-Up Plan` / `$15 USD per month` / `Up to 15000 reqs per day`
- The paid plan bullets also advertise:
  - `Hourly UV Index Forecast`
  - `Historical & Future Data`
  - `Custom Support`
- No pagination model was documented on the inspected public page.
- No public error-code table or structured error reference was visible on the inspected public page.
- Although the homepage advertises forecast and historical/future capabilities, it did not publicly expose additional endpoint paths clearly enough to confirm them route-by-route in this pass.

## Important fireROUTE notes
- OpenUV uses header auth rather than query-string auth.
- The current public documentation surface is a lightweight landing page, not a full route catalog.
- Only `/uv` was clearly exposed with a concrete request path on the inspected public page, so additional advertised capabilities should not be counted until a public official route reference is visible.

## Verification notes
This file was manually rebuilt from the live official OpenUV homepage, replacing the earlier weaker summary with the concrete request example, pricing caps, and public usage notes visible in the current official docs surface.
