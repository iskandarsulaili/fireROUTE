# REFUGE Restrooms

## Provider metadata
- Category: `Transportation`
- Provider slug: `refuge-restrooms`
- Official docs used manually:
  - `https://www.refugerestrooms.org/api/docs/#!/restrooms`
  - `https://www.refugerestrooms.org/api/swagger_doc.json`
- Base URL: `https://www.refugerestrooms.org/api`
- Authentication: none documented in the official Swagger UI or swagger JSON
- Primary response format: JSON
- Transport scope: public restroom discovery records searchable by date, location, text query, and accessibility filters

## Important official usage notes
- The Swagger UI labels the API section as `restrooms` and documents 4 GET routes.
- The general listing route returns restroom records ordered by date descending.
- The project site presents REFUGE Restrooms as open source.
- The documented filters repeatedly support `ada` and `unisex` booleans.

## Rate limits, pagination, and errors
- No rate-limit policy was documented in the inspected official docs.
- Pagination-related query parameters are documented on every route: `page`, `per_page`, and `offset`.
- The Swagger JSON defaults `page` to `1`, `per_page` to `10`, and `offset` to `0`.
- The inspected Swagger spec only documents `200` responses and does not publish a structured error schema.

## Confirmed API surface
The official Swagger spec currently exposes 4 routes:
1. `GET /v1/restrooms`
2. `GET /v1/restrooms/search`
3. `GET /v1/restrooms/by_location`
4. `GET /v1/restrooms/by_date`

## Common request and response notes
- All confirmed routes are `GET` endpoints.
- All route-level `produces` declarations in the Swagger JSON are `application/json`.
- The top-level Swagger file also lists broad producer values including `application/xml`, `application/json`, `application/octet-stream`, and `text/plain`, but the individual restroom operations specifically declare JSON.
- There are no path parameters in the current API surface.

## 1) List restrooms
- Method: `GET`
- Path: `/v1/restrooms`
- Full URL: `https://www.refugerestrooms.org/api/v1/restrooms`
- Purpose: get all restroom records ordered by date descending

Documented query parameters:
- `page` - optional integer page offset to fetch; default `1`
- `per_page` - optional integer number of results per page; default `10`
- `offset` - optional integer number of results to pad/skip; default `0`
- `ada` - optional boolean; only return restrooms that are ADA accessible
- `unisex` - optional boolean; only return restrooms that are unisex

Documented response notes:
- Produces `application/json`
- Swagger documents a `200` response for the route

## 2) Full-text search
- Method: `GET`
- Path: `/v1/restrooms/search`
- Full URL: `https://www.refugerestrooms.org/api/v1/restrooms/search`
- Purpose: perform full-text search across restroom records

Documented query parameters:
- `page` - optional integer; default `1`
- `per_page` - optional integer; default `10`
- `offset` - optional integer; default `0`
- `ada` - optional boolean accessibility filter
- `unisex` - optional boolean unisex filter
- `query` - required string search query

Documented response notes:
- Produces `application/json`
- Swagger documents a `200` response for the route

## 3) Search by location
- Method: `GET`
- Path: `/v1/restrooms/by_location`
- Full URL: `https://www.refugerestrooms.org/api/v1/restrooms/by_location`
- Purpose: search restroom records by latitude/longitude

Documented query parameters:
- `page` - optional integer; default `1`
- `per_page` - optional integer; default `10`
- `offset` - optional integer; default `0`
- `ada` - optional boolean accessibility filter
- `unisex` - optional boolean unisex filter
- `lat` - required float latitude
- `lng` - required float longitude

Documented response notes:
- Produces `application/json`
- Swagger documents a `200` response for the route

## 4) Search by date
- Method: `GET`
- Path: `/v1/restrooms/by_date`
- Full URL: `https://www.refugerestrooms.org/api/v1/restrooms/by_date`
- Purpose: search restroom records updated or created on or after a given date

Documented query parameters:
- `page` - optional integer; default `1`
- `per_page` - optional integer; default `10`
- `offset` - optional integer; default `0`
- `ada` - optional boolean accessibility filter
- `unisex` - optional boolean unisex filter
- `updated` - optional boolean; when true, return restroom records updated since the given date rather than created since the given date
- `day` - required integer day value
- `month` - required integer month value
- `year` - required integer year value

Documented response notes:
- Produces `application/json`
- Swagger documents a `200` response for the route

## Sources inspected
- `https://www.refugerestrooms.org/api/docs/#!/restrooms`
- `https://www.refugerestrooms.org/api/swagger_doc.json`
