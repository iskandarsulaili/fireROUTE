# Weatherbit

## Provider metadata
- Category: `Weather`
- Provider slug: `weatherbit`
- Official docs pages used:
  - `https://www.weatherbit.io/api`
  - `https://www.weatherbit.io/api/requests`
  - `https://www.weatherbit.io/static/swagger.json`
  - `https://help.weatherbit.io/faq/what-happens-when-i-exceed-a-rate-limit/`
- Confirmed API base URL: `https://api.weatherbit.io/v2.0`
- Alternate scheme listed in the official Swagger: `http://api.weatherbit.io/v2.0`
- Auth model: required `key` query parameter
- Primary response format: JSON
- Special response format note: lightning endpoints can also return GeoJSON via `output_type=geojson`
- Manually confirmed routes in this pass: `18`

## Official request conventions
Weatherbit's request-parameter page states that API parameters are supplied as query-string parameters.

Canonical example from the docs:
- `https://api.weatherbit.io/v2.0/forecast/daily?key=...&units=S&days=3`

Common location selectors documented across the API:
- `lat` + `lon` - latitude/longitude pair
- `city_id` - Weatherbit city identifier
- `city` - city search string such as `Raleigh,NC` or `Berlin,DE`
- `postal_code` + `country` - postal code lookup
- `station` - station call ID
- Some current endpoints also allow bulk selectors such as `stations`, `points`, and `cities`

## Authentication
All confirmed endpoints require:
- `key` - your registered API key

The official docs describe API key auth as a query parameter rather than an HTTP Authorization header.

## Units, language, and common query behavior
From the official parameter reference:
- `units=M` - default metric (`Celsius`, `m/s`, `mm`)
- `units=S` - scientific (`Kelvin`, `m/s`, `mm`)
- `units=I` - imperial (`F`, `mph`, `in`)
- `lang` - localized weather strings; the public docs page lists many supported language codes

Important nuance:
- The request-parameter page documents `M` as the default metric mode.
- Many individual Swagger operations explicitly enumerate only `S` and `I`, so the safest interpretation is that metric is the omitted/default mode and `S`/`I` are explicit overrides.

## Manually confirmed endpoints
All confirmed routes below come from the official Weatherbit Swagger schema.

| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/current` | Current observation | `lat`, `lon`, `city_id`, `city`, `postal_code`, `country`, `station`, bulk selectors `stations` / `points` / `cities`, optional `include=minutely|alerts`, `units`, `lang`, `key` |
| GET | `/alerts` | Severe weather alerts | `lat`, `lon`, `city_id`, `city`, `postal_code`, `country`, `station`, `key` |
| GET | `/current/airquality` | Current air quality | `lat`, `lon`, `city_id`, `city`, `postal_code`, `country`, `key` |
| GET | `/current/lightning` | Recent nearby lightning | required `lat`, `lon`; optional `limit`, `skip`, `search_distance_km`, `search_mins`, `sort=distance|time`, `output_type=json|geojson`, `key` |
| GET | `/forecast/daily` | 16-day daily forecast | location selectors, optional `days`, `units`, `lang`, `key` |
| GET | `/forecast/hourly` | Hourly forecast | location selectors, optional `hours`, `units`, `lang`, `key` |
| GET | `/forecast/minutely` | 60-minute precipitation forecast | location selectors, `units`, `key` |
| GET | `/forecast/airquality` | 72-hour air-quality forecast | location selectors, optional `hours`, `key` |
| GET | `/forecast/agweather` | Ag-weather forecast | `lat`, `lon`, required `start_date`, `end_date`, optional `units`, `key` |
| GET | `/forecast/energy` | Degree-day / energy forecast | `lat`, `lon`, optional `threshold`, `tp=hourly|daily`, `units`, `key` |
| GET | `/history/daily` | Historical daily observations | location selectors, required `start_date`, `end_date`, optional `units`, `lang`, `key` |
| GET | `/history/hourly` | Historical hourly observations | location selectors, required `start_date`, `end_date`, optional `units`, `lang`, `tz=local|utc`, `key` |
| GET | `/history/subhourly` | Historical sub-hourly observations | location selectors, required `start_date`, `end_date`, optional `units`, `lang`, `tz=local|utc`, `key` |
| GET | `/history/airquality` | Historical air quality | location selectors, `key` |
| GET | `/history/agweather` | Historical ag-weather | `lat`, `lon`, required `start_date`, `end_date`, required `tp=daily|hourly`, optional `units`, `key` |
| GET | `/history/energy` | Historical degree-day / energy data | required `lat`, `lon`, required `start_date`, `end_date`, optional `tp=hourly|daily|monthly`, `threshold`, `units`, `key` |
| GET | `/history/lightning` | Historical lightning | required `lat`, `lon`, required `date`, optional `limit`, `skip`, `search_distance_km`, `sort=distance|time`, `output_type=json|geojson`, `tz=local|utc`, `key` |
| GET | `/normals` | Historical climate normals | required `lat`, `lon`, required `start_day`, `end_day`, required `tp=daily|hourly|monthly`, required `series_year`, optional `units`, `key` |

## Endpoint family notes
### Current weather family
- `/current` is the broadest current-observation endpoint.
- The docs explicitly allow `include=minutely` or `include=alerts` to enrich current-weather responses.
- `/current` is also the main bulk-capable endpoint, with documented `stations`, `points`, and `cities` query forms.

### Forecast family
- `/forecast/daily` documents `days` with a default of 16 days.
- `/forecast/hourly` documents `hours` for truncating the response window.
- `/forecast/minutely` is specifically a 60-minute precipitation forecast.
- `/forecast/agweather` and `/forecast/energy` are specialized forecast products rather than generic forecast replacements.

### Historical family
- `/history/daily`, `/history/hourly`, and `/history/subhourly` all require `start_date` and `end_date`.
- Hourly and sub-hourly history add timezone interpretation via `tz=local|utc`.
- `/history/agweather` requires `tp` and supports `daily` or `hourly` aggregation.
- `/history/energy` supports `tp=hourly|daily|monthly` plus an optional temperature `threshold`.

### Lightning family
- Both lightning endpoints require `lat` and `lon`.
- Both support `limit` and `skip`, making them the only clearly documented paged/offset-style Weatherbit endpoints in this public reference.
- Both support `output_type=json|geojson`.

### Climate normals
- `/normals` requires `start_day` and `end_day` in `MM-DD` form.
- It also requires `series_year`; the docs say `2020` maps to the 1991-2020 series and `2010` maps to the 1981-2010 series.

## Rate limits and quotas
From the official Weatherbit FAQ:
- Exceeding a daily limit returns `HTTP 429` until the limit resets at `00 UTC`.
- Exceeding a per-second limit also returns `HTTP 429`.
- Weatherbit recommends reducing call velocity, retrying requests that failed due to rate limiting, or upgrading to a higher-limit subscription.

## Pagination, errors, and response behavior
### Pagination
- No general cursor pagination scheme is documented in the public Weatherbit API reference.
- The lightning endpoints expose `limit` and `skip` for offset-style result paging.

### Response format
- Swagger declares `application/json` as the produced media type.
- Lightning routes additionally expose `output_type=geojson`.

### Response codes seen across the confirmed routes
The official Swagger repeatedly lists:
- `200` - success
- `204` - no content / no matching result
- `400` - invalid request
- `403` - auth or access issue
- `429` - rate-limited
- `500` - server error

## Important fireROUTE usage notes
- Prefer HTTPS even though the Swagger advertises both `https` and `http` schemes.
- Treat Weatherbit location selection as polymorphic: the same path may accept coordinates, city IDs, city strings, postal-code lookups, or stations.
- Preserve `output_type=geojson` for lightning adapters instead of forcing JSON.
- Preserve `tz` on hourly/sub-hourly/lightning history calls so historical windows are interpreted correctly.
- The public docs page advertises Weather Maps, but the public Swagger route set used in this pass did not expose a concrete `/maps` API path, so it is not counted among the manually confirmed routes above.

## Verification notes
This file was manually rebuilt from Weatherbit's public docs pages and official Swagger, replacing the earlier autogenerated summary.
