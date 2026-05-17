# BC Ferries

## Provider metadata
- Category: `Transportation`
- Provider slug: `bc-ferries`
- Official docs used manually:
  - `https://www.bcferriesapi.ca/`
  - `https://github.com/samuel-pratt/bc-ferries-api/blob/master/README.md`
- Base URL: `https://bcferriesapi.ca`
- Authentication: none
- Primary response formats seen in official docs and live endpoints:
  - JSON
  - quoted plain-text string for the healthcheck response
- Transport scope: current BC Ferries sailing schedules and vessel-capacity data for BC Ferries routes

## Important official usage notes
- The official landing page describes this as a public API for retrieving current data on BC Ferries sailings.
- The official README says V2 covers all terminals and routes served by BC Ferries.
- The official README says `GET /v2/` combines both capacity and non-capacity sailings.
- The official README says capacity data only exists for routes where BC Ferries publishes vessel fill data.
- The official README still documents a legacy V1 route-template under `/api/{departure-terminal}/{destination-terminal}`.
- Official V1 terminal-code mappings documented in the README are:
  - `TSA` = Tsawwassen
  - `SWB` = Swartz Bay
  - `SGI` = Southern Gulf Islands
  - `DUK` = Duke Point (Nanaimo)
  - `FUL` = Fulford Harbour (Salt Spring Island)
  - `HSB` = Horseshoe Bay
  - `NAN` = Departure Bay (Nanaimo)
  - `LNG` = Langdale
  - `BOW` = Bowen Island

## Rate limits, pagination, and errors
- No authentication flow or API key is documented.
- No numeric rate limit is published in the inspected BC Ferries docs.
- No pagination is documented; inspected endpoints return complete route collections or a single route payload.
- No provider-wide error schema is documented.
- The official README says incorrect V1 departure/destination pairings return an error, but a live check against `GET /api/TSA/NAN` currently returned JSON with `{"sailingDuration":"","sailings":null}` rather than a structured error object.

## Confirmed API surface
The official docs currently expose 5 routes:
1. `GET /healthcheck/`
2. `GET /v2/`
3. `GET /v2/capacity/`
4. `GET /v2/noncapacity/`
5. `GET /api/{departure-terminal}/{destination-terminal}`

## Common request and response notes
- V2 endpoints return route arrays whose route objects contain `routeCode`, `fromTerminalCode`, `toTerminalCode`, `sailingDuration`, and `sailings`.
- Live `GET /v2/` responses split results into two top-level arrays: `capacityRoutes` and `nonCapacityRoutes`.
- Live `GET /v2/capacity/` responses use a top-level `routes` array whose sailing objects include `sailingStatus`, `fill`, `carFill`, and `oversizeFill` in addition to vessel/time fields.
- Live `GET /v2/noncapacity/` responses also use a top-level `routes` array, but sailing objects omit the capacity fields and mainly expose `time`, `arrivalTime`, `vesselName`, and `vesselStatus`.
- Live V1 sample responses use an object with `sailingDuration` plus a `sailings` array; sailing records include `isCancelled`, `fill`, `carFill`, `oversizeFill`, `vesselName`, and `vesselStatus`.

## 1) Health check
- Method: `GET`
- Path: `/healthcheck/`
- Full URL: `https://bcferriesapi.ca/healthcheck/`
- Purpose: quick service-availability check for the deployed API

Documented and observed response notes:
- The official README documents the route for local deployment validation.
- The live production endpoint currently returns the quoted string `"Server OK"`.

## 2) Combined V2 route feed
- Method: `GET`
- Path: `/v2/`
- Full URL: `https://bcferriesapi.ca/v2/`
- Purpose: retrieve both capacity and non-capacity route collections in one response

Documented response notes:
- The official README says this route provides data for both capacity and non-capacity sailings.
- A live response currently returns two top-level arrays: `capacityRoutes` and `nonCapacityRoutes`.
- Route objects observed live include:
  - `routeCode`
  - `fromTerminalCode`
  - `toTerminalCode`
  - `sailingDuration`
  - `sailings`
- Capacity-route sailing objects observed live include:
  - `time`
  - `arrivalTime`
  - `sailingStatus`
  - `fill`
  - `carFill`
  - `oversizeFill`
  - `vesselName`
  - `vesselStatus`
- Non-capacity-route sailing objects observed live include:
  - `time`
  - `arrivalTime`
  - `vesselName`
  - `vesselStatus`

## 3) Capacity-only V2 feed
- Method: `GET`
- Path: `/v2/capacity/`
- Full URL: `https://bcferriesapi.ca/v2/capacity/`
- Purpose: retrieve only routes for which BC Ferries publishes fill/capacity information

Documented response notes:
- The official README identifies this as the capacity-only V2 endpoint.
- A live response currently returns a top-level `routes` array.
- Live route objects include `routeCode`, `fromTerminalCode`, `toTerminalCode`, `sailingDuration`, and `sailings`.
- Live sailing objects include `time`, `arrivalTime`, `sailingStatus`, `fill`, `carFill`, `oversizeFill`, `vesselName`, and `vesselStatus`.

Official route-code notes from the README:
- `TSA` routes to `SWB`, `SGI`, `DUK`
- `SWB` routes to `TSA`, `FUL`, `SGI`
- `HSB` routes to `NAN`, `LNG`, `BOW`
- `DUK` routes to `TSA`
- `LNG` routes to `HSB`
- `NAN` routes to `HSB`

## 4) Non-capacity-only V2 feed
- Method: `GET`
- Path: `/v2/noncapacity/`
- Full URL: `https://bcferriesapi.ca/v2/noncapacity/`
- Purpose: retrieve all non-capacity routes, including routes without vessel-fill reporting

Documented response notes:
- The official README identifies this as the non-capacity V2 endpoint.
- A live response currently returns a top-level `routes` array.
- Live route objects include `routeCode`, `fromTerminalCode`, `toTerminalCode`, `sailingDuration`, and `sailings`.
- Live sailing objects include `time`, `arrivalTime`, `vesselName`, and `vesselStatus`.

## 5) Legacy V1 route pair lookup
- Method: `GET`
- Path: `/api/{departure-terminal}/{destination-terminal}`
- Full URL example: `https://bcferriesapi.ca/api/TSA/SWB`
- Purpose: retrieve data for a specific departure/destination pair using the legacy V1 API shape

Documented path parameters:
- `departure-terminal` - required BC Ferries departure code such as `TSA`, `SWB`, `HSB`, `DUK`, `LNG`, `NAN`, `FUL`, or `BOW`
- `destination-terminal` - required destination code that must correspond to the chosen departure code

Official pairing notes from the README:
- `TSA` -> `SWB`, `SGI`, `DUK`
- `SWB` -> `TSA`, `FUL`, `SGI`
- `HSB` -> `NAN`, `LNG`, `BOW`
- `DUK` -> `TSA`
- `LNG` -> `HSB`
- `NAN` -> `HSB`
- `FUL` -> `SWB`
- `BOW` -> `HSB`

Observed response notes:
- A live valid sample request returned an object with `sailingDuration` and `sailings`.
- Live V1 sailing objects included:
  - `time`
  - `arrivalTime`
  - `isCancelled`
  - `fill`
  - `carFill`
  - `oversizeFill`
  - `vesselName`
  - `vesselStatus`
- A live invalid pairing sample returned `{"sailingDuration":"","sailings":null}`.

## Sources inspected
- `https://www.bcferriesapi.ca/`
- `https://github.com/samuel-pratt/bc-ferries-api/blob/master/README.md`
- `https://bcferriesapi.ca/healthcheck/`
- `https://bcferriesapi.ca/v2/`
- `https://bcferriesapi.ca/v2/capacity/`
- `https://bcferriesapi.ca/v2/noncapacity/`
- `https://bcferriesapi.ca/api/TSA/SWB`
- `https://bcferriesapi.ca/api/TSA/NAN`
