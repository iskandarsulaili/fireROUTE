# Mexico

## Provider metadata
- Category: `Geocoding`
- Provider slug: `mexico`
- Official docs used manually:
  - `https://github.com/IcaliaLabs/sepomex`
  - live API host check from the official README examples: `https://sepomex.icalialabs.com/api/v1/zip_codes`
- Public API base URL documented by provider README: `http://sepomex.icalialabs.com/api/v1`
- Transport: the official README mixes an `http://` base-URI statement with `https://` example requests; the live example host currently redirects to HTTPS but the app itself returned an Azure stopped-app `403` page during manual verification
- Auth model: none documented in the official README
- Response formats documented: `JSON`

## Product and access notes
- The official repository README describes Sepomex as a REST API exposing Mexican zip-code, state, municipality, and city data from the SEPOMEX database.
- The README says the JSON API base starts under `http://sepomex.icalialabs.com/api/v1/zip_codes`.
- The README also says records are paginated with `15` items per page by default.
- The official live example host checked during this run currently returned `Error 403 - This web app is stopped`, so the documentation appears to describe a historical/public deployment that is not currently running.

## Confirmed API surface
The inspected official README confirms these `8` GET route patterns:
1. `GET /api/v1/zip_codes`
2. `GET /api/v1/states`
3. `GET /api/v1/states/{id}`
4. `GET /api/v1/states/{id}/municipalities`
5. `GET /api/v1/municipalities`
6. `GET /api/v1/municipalities/{id}`
7. `GET /api/v1/cities`
8. `GET /api/v1/cities/{id}`

## Shared request rules
- Base route family documented in the README: `http://sepomex.icalialabs.com/api/v1`
- No auth key, token, header, or signed-request model is documented.
- All documented examples are `GET` requests returning JSON.
- Pagination defaults to `15` items per page.
- The README says the four collection resources support `per_page`, and the examples also show `page` usage.

## 1) Zip codes collection and search
- Method: `GET`
- Path: `/api/v1/zip_codes`
- Purpose: list or search SEPOMEX zip-code records

Documented query parameters from the README:
- `per_page` - page size; README says the API returns `15` items per page by default and caps requests above `200` back to `15`
- `page` - page number
- `city`
- `state`
- `colony`
- `zip_code`

Documented example patterns:
- all zip codes: `https://sepomex.icalialabs.com/api/v1/zip_codes?per_page=200`
- paged results: `https://sepomex.icalialabs.com/api/v1/zip_codes?per_page=200&page=2`
- search by city: `...?city=monterrey`
- search by state: `...?state=nuevo%20leon`
- search by colony: `...?colony=punta%20contry`
- search by postal code: `...?zip_code=67173`
- combined search: `...?colony=punta%20contry&state=nuevo%20leon&city=guadalupe`

Documented response notes:
- collection key is `zip_codes`
- pagination metadata is returned under `meta.pagination`
- example item fields include `d_codigo`, `d_asenta`, `d_tipo_asenta`, `d_mnpio`, `d_estado`, `d_ciudad`, `d_cp`, `c_estado`, `c_oficina`, `c_cp`, `c_tipo_asenta`, `c_mnpio`, `id_asenta_cpcons`, `d_zona`, and `c_cve_ciudad`

## 2) States collection
- Method: `GET`
- Path: `/api/v1/states`
- Purpose: list states
- Documented response collection key: `states`
- Example item fields: `id`, `name`, `cities_count`

## 3) State by id
- Method: `GET`
- Path: `/api/v1/states/{id}`
- Purpose: fetch one state record
- Documented path parameter:
  - `id`
- Documented response object key: `state`

## 4) Municipalities for a state
- Method: `GET`
- Path: `/api/v1/states/{id}/municipalities`
- Purpose: list municipalities that belong to a state
- Documented path parameter:
  - `id`
- Documented response collection key: `municipalities`
- Example item fields: `id`, `name`, `municipality_key`, `zip_code`, `state_id`

## 5) Municipalities collection
- Method: `GET`
- Path: `/api/v1/municipalities`
- Purpose: list municipalities
- Documented response collection key: `municipalities`
- Example item fields: `id`, `name`, `municipality_key`, `zip_code`, `state_id`

## 6) Municipality by id
- Method: `GET`
- Path: `/api/v1/municipalities/{id}`
- Purpose: fetch one municipality record
- Documented path parameter:
  - `id`
- Documented response object key: `municipality`

## 7) Cities collection
- Method: `GET`
- Path: `/api/v1/cities`
- Purpose: list cities
- Documented response collection key: `cities`
- Example item fields: `id`, `name`, `state_id`

## 8) City by id
- Method: `GET`
- Path: `/api/v1/cities/{id}`
- Purpose: fetch one city record
- Documented path parameter:
  - `id`
- Documented response object key: `city`

## Pagination, errors, and usage notes
- The README documents this pagination structure:
  - `meta.pagination.per_page`
  - `meta.pagination.total_pages`
  - `meta.pagination.total_objects`
  - `meta.pagination.links.first|last|prev|next`
- The README says collection resources default to `15` items per page.
- The README explicitly says requests for more than `200` items per page fall back to `15` items per page on the zip-code endpoint.
- No dedicated error-code table is documented in the inspected README.
- No rate-limit table is documented in the inspected README.
- The live API host checked during this run is currently unavailable to the public (`403` stopped-app page), so current operational behavior could not be validated against the historical README examples.

## Canonical fireROUTE notes
- Treat Sepomex as a documented-but-currently-stopped public API deployment.
- Preserve collection-vs-detail routes separately for states, municipalities, and cities.
- Keep `zip_codes` search as one route family with multiple optional filters, not as separate routes.
- If this provider is ever implemented, test the live host first because the official example deployment was stopped at review time.

## Verification notes
- This file was manually rebuilt from the live official GitHub repository README and a browser check of the official example API host using browser tools only.
