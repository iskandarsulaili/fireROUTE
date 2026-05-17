# Storm Glass

## Provider metadata
- Category: `Weather`
- Provider slug: `storm-glass`
- Official docs used manually:
  - `https://docs.stormglass.io/#/authentication`
  - `https://docs.stormglass.io/#/weather`
  - `https://docs.stormglass.io/#/historical`
  - `https://docs.stormglass.io/#/bio`
  - `https://docs.stormglass.io/#/astronomy`
  - `https://docs.stormglass.io/#/elevation`
- Confirmed API base URL: `https://api.stormglass.io/v2`
- Response format confirmed from official docs: JSON
- Authentication model: header `Authorization: <api-key>`
- Manually confirmed routes in this pass: `5`

## Authentication
The official authentication page says every API request requires an API key in the request headers:
- `Authorization: example-api-key`

The same page's example request uses:
- `GET https://api.stormglass.io/v2/weather/point`
- query params `lat`, `lng`, and `params`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/weather/point` | Forecast weather data for a single coordinate; marine weather is returned when the coordinate is at sea | required `lat`, required `lng`, required `params`; optional `start`, `end`, `source` |
| GET | `/historical/point` | Historical time-series weather data for a single coordinate | required `lat`, required `lng`, required `params`; `start` and/or `end` required to define the window; optional `source` |
| GET | `/bio/point` | Bio-related data for a point on land or sea | required `lat`, required `lng`, required `params`; optional `start`, `end`, `source` |
| GET | `/astronomy/point` | Sunrise, sunset, moonrise, moonset, dawn/dusk, and moon-phase data for a single coordinate | required `lat`, required `lng`; optional `start`, `end` |
| GET | `/elevation/point` | Elevation / bathymetry lookup for a single coordinate | required `lat`, required `lng` |

## Route notes

### 1) `/weather/point`
- Official weather page description: direct access to global weather forecasts, with multiple datasets and parameters in one request.
- The docs say weather records are accessible for a `14-day` look-back period.
- The docs recommend the Historical endpoint for retrieval of broader past weather data.
- The page says stormglass AI can be selected by setting `source=sg`.
- Documented query parameter defaults on the page:
  - `start`: `Today at 00.00`
  - `end`: `all`
  - `source`: `all`
- The response root contains `data` and `meta`.
- `meta` includes request metadata such as requested coordinates, daily quota, and request count.
- `data` is documented as an hourly array.

### 2) `/historical/point`
- Official historical page says the endpoint contains global historical weather data starting from `2014`.
- The docs say the underlying historical base is ECMWF `ERA5` reanalysis data.
- Each response contains up to `10 days` of data.
- The docs say data newer than roughly `7 days` in the past may return no data because ingestion is delayed until recent historical data becomes available.
- Documented query parameter defaults on the page:
  - `start`: `239 hours before end`
  - `end`: `239 hours after start`
  - `source`: `sg`
- The page explicitly says an error is returned if neither `start` nor `end` is specified.

### 3) `/bio/point`
- Official bio page says the endpoint provides global bio data for both land and sea.
- Documented query parameter defaults on the page:
  - `start`: `Today at 00.00`
  - `end`: `all`
  - `source`: `all`
- The docs describe the response as hourly bio data under `data`, with request metadata in `meta`.
- The visible parameter list includes ocean and land variables such as `chlorophyll`, `iron`, `nitrate`, `oxygen`, `ph`, `salinity`, `soilMoisture`, and `soilTemperature` families.

### 4) `/astronomy/point`
- Official astronomy page says the endpoint provides astronomical data globally.
- The page describes the route as returning `sunrise`, `sunset`, `moonrise`, `moonset`, and moon-phase data.
- The example response also shows `astronomicalDawn`, `astronomicalDusk`, `civilDawn`, `civilDusk`, `nauticalDawn`, and `nauticalDusk`.
- Documented query parameter defaults on the page:
  - `start`: `Today at 00.00`
  - `end`: `Tomorrow at 00.00`
- The `end` row says astronomy requests can go ahead for a maximum of `10` days.
- Example response `meta` shows `cost`, `dailyQuota`, `requestCount`, `lat`, `lng`, and `start`.

### 5) `/elevation/point`
- Official elevation page says the endpoint returns bathymetry for oceans and topography for land.
- The response root contains `data` and `meta`.
- `data` contains a single `elevation` value in meters relative to sea level.
- The example response `meta` includes `dailyQuota`, `requestCount`, `distance`, and an `elevation` source descriptor.

## Shared request / response conventions
- Storm Glass is coordinate-first across all confirmed routes.
- The docs use `lat` and `lng` consistently.
- Where `start` and `end` are accepted, the docs say they can be supplied as UNIX timestamps or URL-encoded ISO timestamps.
- Weather, historical, and bio routes all use a required comma-separated `params` selector.
- The official docs describe `data` and `meta` as the common top-level JSON structure.
- Example `meta` objects show quota usage information embedded in successful responses.

## Rate limits, pagination, errors, and usage notes
- The inspected public docs did not expose a simple public plan table with numeric per-minute or per-second limits.
- Successful example responses expose quota tracking in `meta`, including fields such as `dailyQuota` and `requestCount`.
- No pagination model was documented for the confirmed routes.
- The docs navigation includes a dedicated `Error Codes` section.
- The historical page explicitly documents one validation error condition: omitting both `start` and `end` returns an error.

## Important fireROUTE notes
- Header auth is mandatory; this provider does not use query-string API keys in the reviewed docs.
- `params` materially changes payload shape and payload size for the selector-based routes.
- `source` is a meaningful routing control, not just metadata; the weather page explicitly documents `sg` for stormglass AI source selection.
- The official docs sidebar also lists additional endpoint families such as `Tide` and `Solar`, but this rewrite only counts the five route pages that were successfully loaded and manually inspected in detail during this pass.

## Verification notes
This file was manually rebuilt from live official Storm Glass documentation pages, replacing the earlier 1-route summary with route-level notes for the endpoint families successfully inspected in this pass.
