# airportsapi

## Provider metadata
- Category: `Transportation`
- Provider slug: `airportsapi`
- Official docs used manually:
  - `https://airport-web.appspot.com/api/docs/`
  - `https://airport-web.appspot.com/api/docs/swagger.json`
- Base URL: `https://airport-web.appspot.com/_ah/api`
- Authentication: none required in the published Swagger operation; the spec defines a `google_id_token` security scheme, but the API surface inspected does not apply a required security block to the documented route
- Primary response format: JSON
- Transport scope: airport lookup by ICAO code, with airport name and website URL; the official description says coverage is mostly in Germany

## Important official usage notes
- The official Swagger UI exposes a single versioned API section: `airportsapi v1`.
- The official description is: `Get name and website-URL for airports by ICAO code. Covered airports are mostly in Germany.`
- The Swagger UI shows HTTPS and the host `airport-web.appspot.com`.
- The current published API surface is a single GET lookup route.

## Rate limits, pagination, and errors
- No rate-limit policy was documented in the inspected official docs.
- No pagination parameters are documented.
- The Swagger spec only publishes a `200` response for the confirmed route.
- No structured non-200 error schema is documented in the official Swagger file.

## Confirmed API surface
The official Swagger spec currently exposes 1 route:
1. `GET /airportsapi/v1/airports/{icao_code}`

## Common request and response notes
- The top-level Swagger spec lists `application/json` in both `consumes` and `produces`.
- The required path parameter is `icao_code` as a string.
- The documented success schema `ApiEndpointsAirportResponse` contains these properties:
  - `ICAO` - string airport code
  - `last_update` - string timestamp/value as published by the API
  - `name` - string airport name
  - `url` - string airport website URL

## 1) Get airport by ICAO code
- Method: `GET`
- Path: `/airportsapi/v1/airports/{icao_code}`
- Full URL: `https://airport-web.appspot.com/_ah/api/airportsapi/v1/airports/{icao_code}`
- Purpose: return airport metadata for a specific ICAO code

Documented path parameters:
- `icao_code` - required string ICAO airport code

Documented response notes:
- Produces `application/json`
- Swagger documents a `200` response using `ApiEndpointsAirportResponse`
- Response schema fields: `ICAO`, `last_update`, `name`, `url`

## Sources inspected
- `https://airport-web.appspot.com/api/docs/`
- `https://airport-web.appspot.com/api/docs/swagger.json`
