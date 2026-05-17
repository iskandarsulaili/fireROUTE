# AccuWeather

## Provider metadata
- Category: `Weather`
- Provider slug: `accuweather`
- Official docs/site used manually:
  - `https://developer.accuweather.com/apis`
  - `https://developer.accuweather.com/core-weather`
  - `https://developer.accuweather.com/minutecast`
  - `https://developer.accuweather.com/lightning`
  - representative route pages inspected manually in this pass:
    - `https://developer.accuweather.com/core-weather/location-key-currentconditions`
    - `https://developer.accuweather.com/core-weather/text-search`
    - `https://developer.accuweather.com/core-weather/1-day`
    - `https://developer.accuweather.com/core-weather/location-key-daily`
    - `https://developer.accuweather.com/core-weather/location-key-alerts`
    - `https://developer.accuweather.com/minutecast/geoposition-minutecast`
    - `https://developer.accuweather.com/lightning/radius-lightning`
- Confirmed API base URL: `https://dataservice.accuweather.com`
- Authentication model: required `Authorization: Bearer YOUR_API_KEY` header on the inspected products
- Methods confirmed in the inspected official docs: `GET`
- Request bodies confirmed in the inspected official docs: none
- Manually confirmed routes in this pass: `97`

## Auth and request model
- The live AccuWeather developer portal is accessible in this browser environment and now exposes route-level documentation directly in the site.
- The inspected docs consistently require `Authorization: Bearer YOUR_API_KEY` rather than a query-string API key.
- Most Core Weather routes use reusable query parameters such as:
  - `language` - localized response language
  - `format` - response format, with `json` shown as default on inspected pages
  - `details` - include extended payload details
- Forecast routes additionally reuse `metric` to switch units.
- Location/discovery routes reuse search-oriented parameters such as `q`, `offset`, `alias`, `countryCode`, and `adminCode`.
- MinuteCast uses coordinate query `q={lat},{lon}`.
- Lightning uses coordinate query `q={lat},{lon}` plus spatial/time filters such as `distanceRadius` and `timeInterval`.

## Rate limits, pagination, format, and error notes
- All inspected route pages document the same response-code set: `200`, `400`, `401`, `403`, `404`, `429`, `500`.
- The portal clearly documents `429 Too Many Requests`, so provider-side throttling exists.
- I did not find a numeric public quota/RPS table in the inspected route pages, so the official docs reviewed here confirm throttling behavior but not a universal numeric limit.
- Explicit pagination is documented on location-search routes through `offset`; the text-search docs state results are returned in sets of `25`.
- I did not see cursor-based pagination or next-page tokens in the inspected docs.
- Response format varies by product surface:
  - Core Weather and MinuteCast examples are JSON.
  - Lightning examples are GeoJSON (`type`, `features`).

## Product surfaces and route counts confirmed from the official portal
### Core Weather (`91` GET routes)
Official menu sections and route counts visible on `https://developer.accuweather.com/core-weather`:

| Official docs section | Routes | Notes |
|---|---:|---|
| `location-key-currentconditions` | 1 | current conditions by location key |
| `top-cities` | 1 | current conditions for top cities |
| `historical` | 2 | historical current conditions for past 24h / 6h |
| `location-key-daily` | 5 | daily forecast spans by location key |
| `location-key-hourly` | 5 | hourly forecast spans by location key |
| `location-key-alerts` | 1 | government-issued alerts by location key |
| `location-key-locations` | 2 | neighboring locations and location lookup by key |
| `list` | 10 | region/country/admin-area/top-city list endpoints |
| `autocomplete` | 6 | autocomplete variants for cities / POIs |
| `text-search` | 15 | city, location, postal, POI, region, admin-area search |
| `geoposition-locations` | 3 | geoposition-based city / location / POI lookup |
| `ip-address` | 1 | city search by IP address |
| `1-day` | 3 | daily index routes |
| `5-days` | 3 | five-day index routes |
| `10-days` | 3 | ten-day index routes |
| `15-days` | 3 | fifteen-day index routes |
| `metadata` | 4 | index metadata and groups |
| `active` | 3 | active government-issued storms |
| `search` | 5 | tropical storm history and statuses |
| `position` | 2 | current and historical storm positions |
| `forecast-tropical` | 1 | tropical storm forecasts |
| `location-key-alarms` | 4 | weather alarm horizons by location key |
| `location-key-maps` | 3 | radar/satellite image sizes by location key |
| `groups-translations` | 2 | translation groups and group translations |
| `languages-translations` | 3 | supported languages and language-code/id lookup |

### MinuteCast (`3` GET routes)
Confirmed from `https://developer.accuweather.com/minutecast`:
- precipitation forecast by geoposition
- color-code metadata
- simplified color-code metadata

### Lightning (`3` GET routes)
Confirmed from `https://developer.accuweather.com/lightning`:
- lightning by radius around a point
- lightning by bounding box
- historical daily lightning by point/radius

## Exact route paths manually captured from inspected official pages
These are the exact API paths visible on the inspected route pages during this pass:

### Current conditions and alerts
- `GET /currentconditions/v1/{locationKey}`
- `GET /alerts/v1/{locationKey}`

Current-conditions response notes from the official schema:
- response is an array of current-condition objects
- fields shown on the page include `LocalObservationDateTime`, `EpochTime`, `WeatherText`, `WeatherIcon`, `HasPrecipitation`, `Temperature`, `RealFeelTemperature`, `RelativeHumidity`, `DewPoint`, `Wind`, `MobileLink`, and `Link`

Alert response notes from the official schema:
- response is an array of `GlobalAlert` objects
- fields shown on the page include `CountryCode`, `AlertID`, `Description`, `Category`, `Priority`, `Type`, `TypeID`, `Level`, `AlarmLevel`, `Source`, `Disclaimer`, `Area`, `MobileLink`, and `Link`

### Forecast and index examples
- `GET /forecasts/v1/daily/1day/{locationKey}`
- `GET /forecasts/v1/daily/5day/{locationKey}`
- `GET /indices/v1/daily/1day/{locationKey}/groups/{groupID}`
- `GET /indices/v1/daily/1day/{locationKey}`

Forecast/index query and response notes from inspected pages:
- daily forecast pages show `format`, `language`, `details`, and `metric`
- the daily forecast schema returns `Headline` plus `DailyForecasts`
- index pages return arrays of index objects with fields such as `Name`, `ID`, `Value`, `Category`, `Text`, `MobileLink`, and `Link`
- group/index-oriented routes use `groupID` and `indexID` identifiers alongside `locationKey`

### Location search examples
- `GET /locations/v1/cities/{countryCode}/{adminCode}/search`
- `GET /locations/v1/cities/{countryCode}/search`

Location-search notes confirmed from the text-search page:
- required query `q` carries the search text
- `offset` paginates in sets of `25`
- `alias` controls alias-search behavior (`0=Always`, `1=Never`, `2=No Official Match`)
- example response fields include `Key`, `LocalizedName`, `EnglishName`, `GeoPosition`, `Country`, `AdministrativeArea`, and `DataSets`
- the same docs page also lists many additional search variants for generic locations, postal codes, points of interest, regions, and administrative areas

### MinuteCast
- `GET /forecasts/v1/minute`

MinuteCast notes from the route page:
- required query parameter `q` is `lat,lon`
- optional query parameters: `language`, `format`, `details`
- response object includes `Summary`, `Summaries`, `MobileLink`, and `Link`

### Lightning
- `GET /lightning/v1/{timeInterval}min/geoposition/radius.geojson`

Lightning notes from the route page:
- `timeInterval` is constrained to `5`, `15`, `30`, `60`, or `120`
- required query `q` is `lat,lon`
- optional `distanceRadius` is in miles with page text stating a maximum radius of `60`
- response is GeoJSON with top-level `type` and `features`; feature properties shown include `id`, `date`, `sourceId`, `strikeType`, and `peakCurrent`

## Important fireROUTE notes
- AccuWeather is no longer a blocker-only provider in this environment; the official developer portal is now reachable and route-rich.
- The provider is broader than a single weather endpoint family. The official portal currently exposes three separately documented surfaces: `Core Weather`, `MinuteCast`, and `Lightning`.
- `locationKey` is a central AccuWeather identifier reused across current conditions, forecasts, alerts, maps, alarms, and many index/tropical sub-surfaces.
- Search/discovery endpoints are important operational prerequisites because many downstream routes need a `locationKey` first.
- If fireROUTE later needs every exact path string beyond the representative paths above, the live portal structure is now navigable enough to continue route-by-route extraction directly from official pages.

## Verification notes
This file replaces the earlier blocker record after manually re-checking the official AccuWeather developer portal and confirming live route-level documentation in the browser environment.