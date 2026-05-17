# Open-Meteo

## Provider metadata
- Category: `Weather`
- Provider slug: `open-meteo`
- Official docs/site checked manually in this pass:
  - `https://open-meteo.com/en/docs`
  - `https://open-meteo.com/en/docs/historical-weather-api`
  - `https://open-meteo.com/en/docs/historical-forecast-api`
  - `https://open-meteo.com/en/docs/single-runs-api`
  - `https://open-meteo.com/en/docs/previous-runs-api`
  - `https://open-meteo.com/en/docs/ensemble-api`
  - `https://open-meteo.com/en/docs/seasonal-forecast-api`
  - `https://open-meteo.com/en/docs/climate-api`
  - `https://open-meteo.com/en/docs/marine-weather-api`
  - `https://open-meteo.com/en/docs/air-quality-api`
  - `https://open-meteo.com/en/docs/flood-api`
- Manually confirmed API route count in this pass: `11`
- Response formats shown on the reviewed official pages: default JSON plus `format=csv` and `format=xlsx`

## Authentication and access model
Open-Meteo's reviewed public weather-family docs do not require an API key for standard non-commercial use.

The official Forecast API parameter table also documents:
- optional `apikey`
- only required for commercial use to access reserved API resources for customers
- customer server URLs use a `customer-` prefix according to the docs

## Official usage and quota notes confirmed in this review
- Each reviewed docs page shows the same public usage note: non-commercial use and less than `10,000` daily API calls.
- The docs direct commercial users to pricing / customer resources rather than publishing one universal public paid-rate table inside each endpoint page.
- The Climate API page explicitly warns that one request can count as many call-equivalents depending on interval length, number of locations, variables, or models, so request cost can be weighted rather than strictly one-request-equals-one-call.

## Confirmed routes
| Method | Path | Base URL | Purpose | Key documented parameters |
|---|---|---|---|---|
| GET | `/v1/forecast` | `https://api.open-meteo.com` | Main forecast/current weather endpoint | `latitude`, `longitude`, optional `hourly`, `daily`, `current`, `minutely_15`, `timezone`, `past_days`, `forecast_days`, `models`, `format`, `apikey` |
| GET | `/v1/archive` | `https://archive-api.open-meteo.com` | Historical weather / reanalysis endpoint | `latitude`, `longitude`, `start_date`, `end_date`, optional `hourly`, `daily`, `timezone`, `models`, `format`, `apikey` |
| GET | `/v1/forecast` | `https://historical-forecast-api.open-meteo.com` | Archived forecast output in live forecast format | `latitude`, `longitude`, `start_date`, `end_date`, optional `hourly`, `daily`, `timezone`, `models`, `format` |
| GET | `/v1/forecast` | `https://single-runs-api.open-meteo.com` | Retrieve one specific model run by initialization time | `latitude`, `longitude`, required `run`, optional `hourly`, `daily`, `models`, `forecast_days`, `format` |
| GET | `/v1/forecast` | `https://previous-runs-api.open-meteo.com` | Compare previous forecast runs at fixed lead-time offsets | `latitude`, `longitude`, optional `hourly` with `_previous_dayN` variables, `past_days`, `forecast_days`, `models`, `format` |
| GET | `/v1/ensemble` | `https://ensemble-api.open-meteo.com` | Individual ensemble-member forecasts | `latitude`, `longitude`, optional `hourly`, `daily`, `models`, `past_days`, `forecast_days`, `format` |
| GET | `/v1/seasonal` | `https://seasonal-api.open-meteo.com` | Sub-seasonal / seasonal forecast out to about 7 months | `latitude`, `longitude`, optional `hourly_6`, `daily`, `weekly`, `monthly`, `forecast_days`, `past_days`, `format` |
| GET | `/v1/climate` | `https://climate-api.open-meteo.com` | Climate-change projections / downscaled CMIP6-style climate data | `latitude`, `longitude`, `start_date`, `end_date`, required-style `daily` selectors, `models`, `format` |
| GET | `/v1/marine` | `https://marine-api.open-meteo.com` | Marine forecast, wave, tide, SST, and ocean-current data | `latitude`, `longitude`, optional `hourly`, `daily`, `current`, `forecast_days`, `past_days`, `format` |
| GET | `/v1/air-quality` | `https://air-quality-api.open-meteo.com` | Air-quality, AQI, UV, and pollen forecast/current data | `latitude`, `longitude`, optional `hourly`, `current`, `domains`, `forecast_days`, `past_days`, `format` |
| GET | `/v1/flood` | `https://flood-api.open-meteo.com` | River-discharge / flood-model data | `latitude`, `longitude`, required-style `daily` selectors, `forecast_days`, `past_days`, `format` |

## Cross-route parameter and behavior notes
Common request patterns repeatedly shown across the reviewed docs pages:
- `latitude` / `longitude` are the core location inputs.
- The UI and docs expose coordinate, list, and bounding-box styles depending on endpoint family.
- Variable selection is endpoint-driven and selector-based rather than boolean:
  - weather endpoints use fields like `hourly`, `daily`, `current`, `minutely_15`
  - marine uses `hourly`, `daily`, `current`
  - air quality uses `hourly` and `current`
  - flood and climate emphasize `daily`
  - seasonal exposes `6-hourly`, `daily`, `weekly`, and `monthly` groupings
- Time controls vary by route family:
  - `start_date` / `end_date` for archive, historical forecast, and climate
  - `forecast_days` / `past_days` on forecast-style APIs
  - `run` on Single Runs
- `timezone` and `timeformat` are common normalization controls.
- `format=csv` and `format=xlsx` are shown directly in official example URLs; default response preview is JSON.
- Multiple locations can change output shape from a single object to a list, so consumers should normalize carefully.

## Route-specific notes from the reviewed docs
### 1) `GET https://api.open-meteo.com/v1/forecast`
- The reviewed docs describe this as the main weather forecast API.
- Forecast length is documented as up to `16` days.
- The page exposes current, hourly, daily, and 15-minutely variable groups.
- Official examples show `format=xlsx`, `format=csv`, and plain JSON URL variants.
- The official parameter table notes `apikey` is only needed for reserved customer resources on `customer-` prefixed servers.

### 2) `GET https://archive-api.open-meteo.com/v1/archive`
- The official page says historical data goes back to `1940` / `1950` depending on model family.
- The reviewed text says data from `2017` onward can use newer weather models with `9 km` resolution.
- The docs position this endpoint as gap-free reanalysis / historical weather data.
- Official reviewed models text highlights ERA5, ERA5-Land, and newer ECMWF IFS-backed higher-resolution coverage.

### 3) `GET https://historical-forecast-api.open-meteo.com/v1/forecast`
- The official page says this is archived forecast data from the live Forecast API with the same models, parameters, and response format.
- Coverage starts around `2022` according to the reviewed page.
- The docs say each run's first few hours are stitched into a continuous hourly time series.
- The page explicitly points users to Single Runs for the full forecast horizon of individual runs.

### 4) `GET https://single-runs-api.open-meteo.com/v1/forecast`
- The docs say this route accesses any individual model run by initialization time using `run=yyyy-mm-ddThh:mm`.
- The reviewed page states ECMWF IFS is available from `March 2024` and most other models from `September 2025`.
- This route is intended for full-horizon inspection of one chosen run rather than the stitched historical-forecast view.

### 5) `GET https://previous-runs-api.open-meteo.com/v1/forecast`
- The official page describes fixed lead-time comparison variables such as `temperature_2m_previous_day1` through `..._previous_day7`.
- Reviewed docs state most models are archived from `January 2024` and GFS 2 m temperature extends back to `March 2021`.
- The purpose is forecast-skill comparison and bias-correction analysis.

### 6) `GET https://ensemble-api.open-meteo.com/v1/ensemble`
- The docs say this API exposes individual ensemble-member forecasts from multiple weather models.
- The reviewed page says users can retrieve up to `3` days of historical data.
- The response preview on the page includes member-expanded hourly output such as `temperature_2m_member01`, `...member02`, etc.

### 7) `GET https://seasonal-api.open-meteo.com/v1/seasonal`
- The official page describes sub-seasonal and long-range forecast data for about `7 months`.
- Reviewed text says the API uses ECMWF SEAS5 and EC46 with `51` ensemble members.
- The page warns the data are not bias-corrected and should be interpreted as area forecasts rather than precise local truth.
- Variable groups shown include 6-hourly, daily, weekly, and monthly outputs.

### 8) `GET https://climate-api.open-meteo.com/v1/climate`
- The docs frame this as local climate-change exploration using downscaled climate data.
- Reviewed quick-range text on the page spans `1950-2050` and the data-sources section references IPCC CMIP6 / HighResMip regional downscaled models.
- The page warns that a single request can count as many call-equivalents depending on request breadth.

### 9) `GET https://marine-api.open-meteo.com/v1/marine`
- The reviewed page exposes hourly wave, swell, SST, tide-height, and ocean-current variables.
- The docs explicitly caution that coastal accuracy is limited and the service is not suitable for coastal navigation or as a replacement for a nautical almanac.
- Daily marine aggregations are also documented.

### 10) `GET https://air-quality-api.open-meteo.com/v1/air-quality`
- The official page exposes pollutants, AQI, UV, and pollen values.
- The reviewed page shows a default forecast length of `5` days.
- Pollen variables are documented as Europe-only during pollen season.
- The page says current conditions are based on 15-minutely weather-model data.
- The docs show domain selection such as `Global + European`.

### 11) `GET https://flood-api.open-meteo.com/v1/flood`
- The reviewed page describes simulated river discharge from `1984` up to about `7 months` forecast.
- Daily variables include river discharge mean / median / min / max / percentiles plus all 50 ensemble members.
- The page warns that 5 km resolution can miss the closest river and suggests trying nearby coordinates such as varying by `0.1°`.

## Response format, pagination, and error notes
- The reviewed official pages present API preview URLs as JSON by default.
- Official example links also provide `format=csv` and `format=xlsx` for the route families above.
- Forecast-style JSON responses are documented with top-level geographic / timing metadata such as:
  - `latitude`
  - `longitude`
  - `generationtime_ms`
  - `utc_offset_seconds`
  - `timezone`
  - `timezone_abbreviation`
  - `elevation`
  - units blocks like `hourly_units`, `daily_units`, `current_units`
  - payload blocks like `hourly`, `daily`, `current`, or route-specific equivalents
- No pagination model was documented on the reviewed official pages.
- The Forecast API error section explicitly says that if a URL parameter is invalid, the API returns a JSON error object with HTTP `400`.
- The reviewed official error example is:
  - `error: true`
  - `reason: Cannot initialize WeatherVariable from invalid String value ...`

## Important fireROUTE notes
- Open-Meteo is not one host with one route: it is a family of weather-related hosts with repeated `/v1/...` route patterns grouped by product.
- Three different forecast-style products reuse `/v1/forecast` but on different base hosts with materially different semantics:
  - live forecast
  - historical forecast
  - single runs
  - previous runs
- Many Open-Meteo APIs are coordinate-first and selector-driven; fireROUTE should preserve the route-specific selector parameters instead of flattening them into a single generic weather schema.
- Commercial auth is documented as optional `apikey` plus `customer-` host usage, not as a mandatory public-key flow for standard non-commercial requests.
- Request complexity can affect quota consumption, especially on climate-style long-range data.

## Verification notes
This file was manually rebuilt from a fresh browser review of the live official Open-Meteo docs pages listed above. It replaces the earlier weaker summary that only captured the generic forecast and archive routes.