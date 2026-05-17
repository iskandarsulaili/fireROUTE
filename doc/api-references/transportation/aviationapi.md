# AviationAPI

## Provider metadata
- Category: `Transportation`
- Provider slug: `aviationapi`
- Official docs used manually:
  - `https://www.aviationapi.com/`
  - `https://api-v2.aviationapi.com/v2/docs`
- Base URL: `https://api-v2.aviationapi.com/v2`
- Primary response format: JSON
- Auth model: none documented in the live Swagger UI
- Transport scope: FAA chart and chart-supplement lookup for airports

## Important official usage notes
- The public AviationAPI homepage explicitly warns: use the data with caution and confirm chart cycle dates before use.
- The homepage says the service is intended for flight-simulation use and disclaims responsibility for outdated charts or other information.
- The Swagger UI exposes a single server entry of `/v2`, which resolves against `https://api-v2.aviationapi.com`.

## Rate limits and errors
- No published rate-limit policy was visible in the inspected official docs pages.
- The Swagger UI documents successful `200` JSON responses.
- Validation failures are documented as `422` with the standard FastAPI `HTTPValidationError` schema.

## Confirmed API surface
The live official Swagger UI currently exposes 6 routes:
- `GET /charts`
- `GET /charts/many`
- `GET /charts/chart-supplement`
- `GET /charts/chart-supplement/many`
- `GET /charts/available`
- `GET /charts/test`

## Common request/response notes
- Requests are query-parameter driven; no request-body routes were shown in the official docs.
- The optional `airac` query parameter appears across the chart-related routes and defaults to `0` in the Swagger schema.
- Responses are JSON, but the docs do not publish a richer schema for the chart payloads on the inspected page.
- No pagination model was documented on the inspected routes.

## 1) Lookup charts for one airport
- Method: `GET`
- Path: `/charts`
- Full URL: `https://api-v2.aviationapi.com/v2/charts`
- Purpose: fetch chart data for one airport

Documented query parameters:
- `airport` - required string airport identifier
- `airac` - optional integer AIRAC cycle selector; default `0`

## 2) Lookup charts for many airports
- Method: `GET`
- Path: `/charts/many`
- Full URL: `https://api-v2.aviationapi.com/v2/charts/many`
- Purpose: fetch chart data for multiple airports in one call

Documented query parameters:
- `airport` - optional array of airport identifiers; repeat or provide multiple values per the Swagger array schema
- `airac` - optional integer AIRAC cycle selector; default `0`

## 3) Lookup chart supplement for one airport
- Method: `GET`
- Path: `/charts/chart-supplement`
- Full URL: `https://api-v2.aviationapi.com/v2/charts/chart-supplement`
- Purpose: fetch chart-supplement data for one airport

Documented query parameters:
- `airport` - required string airport identifier
- `airac` - optional integer AIRAC cycle selector; default `0`

## 4) Lookup chart supplement for many airports
- Method: `GET`
- Path: `/charts/chart-supplement/many`
- Full URL: `https://api-v2.aviationapi.com/v2/charts/chart-supplement/many`
- Purpose: fetch chart-supplement data for multiple airports

Documented query parameters:
- `airport` - optional array of airport identifiers
- `airac` - optional integer AIRAC cycle selector; default `0`

## 5) Check available chart data
- Method: `GET`
- Path: `/charts/available`
- Full URL: `https://api-v2.aviationapi.com/v2/charts/available`
- Purpose: inspect available chart coverage or AIRAC availability

Documented query parameters:
- `airac` - optional integer AIRAC cycle selector; default `0`

## 6) Test endpoint
- Method: `GET`
- Path: `/charts/test`
- Full URL: `https://api-v2.aviationapi.com/v2/charts/test`
- Purpose: basic service test route shown in the official Swagger UI

Documented query parameters:
- none shown in the official Swagger UI

## Sources inspected
- `https://www.aviationapi.com/`
- `https://api-v2.aviationapi.com/v2/docs`
