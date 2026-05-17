# Tankerkoenig

## Provider metadata
- Category: `Transportation`
- Provider slug: `tankerkoenig`
- Official docs used manually:
  - `https://creativecommons.tankerkoenig.de/swagger/`
  - `https://creativecommons.tankerkoenig.de/swagger/tankerkoenig.yaml`
- Base URL: `https://creativecommons.tankerkoenig.de/api/v4`
- Primary response format: JSON
- Auth model: API key passed as query parameter `apikey`
- Transport scope: real-time gas-station search, station-price lookup, statistics, and complaint submission for Germany

## Important official usage notes
- The official Swagger description says the API provides real-time gas-price data under an open-data/open-source license, including commercial use.
- The official description also says the currently available price coverage is limited to Germany.
- Search radius on the nearby-stations search route is capped at `25` km.

## Rate limits and errors
- The inspected official Swagger UI does not publish a numeric rate-limit quota.
- Multiple operations document `503 Service Unavailable - rate limit exceeded`.
- Common documented error codes across the routes are `400`, `401`, `500`, and `503`; some search endpoints also list `404`.

## Confirmed API surface
The live official Swagger UI currently exposes 5 routes:
- `GET /stations/search`
- `GET /stations/ids`
- `GET /stations/postalcode`
- `GET /stats`
- `POST /complaint`

## Common request/response notes
- The search/statistics endpoints return JSON with fields such as `apiVersion`, `timestamp`, and either `stations` or aggregated fuel statistics.
- Station payloads in the published schema include identity and address fields, coordinates, opening-state information, optional opening times, distance, and per-fuel pricing.
- Fuel entries include `category`, `name`, `price`, and optional `lastChange` metadata.
- No pagination model was documented in the inspected Swagger UI.

## 1) Search stations near coordinates
- Method: `GET`
- Path: `/stations/search`
- Full URL: `https://creativecommons.tankerkoenig.de/api/v4/stations/search`
- Purpose: return current gas prices for stations within a radius around coordinates

Documented query parameters:
- `apikey` - required API key UUID
- `lat` - required latitude
- `lng` - required longitude
- `rad` - optional radius in kilometers; maximum `25`

## 2) Lookup stations by ID list
- Method: `GET`
- Path: `/stations/ids`
- Full URL: `https://creativecommons.tankerkoenig.de/api/v4/stations/ids`
- Purpose: fetch current station details and prices for one or more station IDs

Documented query parameters:
- `apikey` - required API key UUID
- `ids` - required comma-separated list of station IDs
- `lat` - optional latitude used to calculate distance in the output
- `lng` - optional longitude used to calculate distance in the output

## 3) Lookup stations by postal code
- Method: `GET`
- Path: `/stations/postalcode`
- Full URL: `https://creativecommons.tankerkoenig.de/api/v4/stations/postalcode`
- Purpose: fetch station prices by postal code

Documented query parameters:
- `apikey` - required API key UUID
- `postalcode` - required postal code string; docs describe it as `country:postalcode` / `Land:Postleitzahl`

## 4) Retrieve aggregate statistics
- Method: `GET`
- Path: `/stats`
- Full URL: `https://creativecommons.tankerkoenig.de/api/v4/stats`
- Purpose: return aggregate fuel-price statistics

Documented query parameters:
- `apikey` - required API key UUID

Documented response notes:
- Returns JSON including `license`, `apiVersion`, `timestamp`, and aggregate `Diesel`, `E5`, and `E10` statistics with count/mean/median-style fields.

## 5) Submit a complaint or correction
- Method: `POST`
- Path: `/complaint`
- Full URL: `https://creativecommons.tankerkoenig.de/api/v4/complaint`
- Purpose: send a complaint/correction for station metadata or prices
- Request body format: JSON

Documented request-body fields:
- `apikey` - required API key UUID of the submitter
- `id` - required station UUID
- `type` - required complaint type enum
- `correction` - optional correction payload; semantics depend on the complaint type

Documented complaint-type examples from the schema include:
- `wrongStatusOpen`
- `wrongStatusClosed`
- `wrongPriceE5`
- `wrongPriceE10`
- `wrongPriceDiesel`
- `wrongPetrolStationBrand`
- `wrongPetrolStationStreet`
- `wrongPetrolStationPostcode`
- `wrongPetrolStationPlace`
- `wrongPetrolStationLocation`

## Sources inspected
- `https://creativecommons.tankerkoenig.de/swagger/`
- `https://creativecommons.tankerkoenig.de/swagger/tankerkoenig.yaml`
