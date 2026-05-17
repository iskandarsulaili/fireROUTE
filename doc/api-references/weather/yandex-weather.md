# Yandex.Weather

## Provider metadata
- Category: `Weather`
- Provider slug: `yandex-weather`
- Official docs/site used manually:
  - `https://yandex.com/dev/weather/`
  - `https://yandex.com/dev/weather/doc/en/`
  - `https://yandex.com/dev/weather/doc/en/concepts/api`
  - `https://yandex.com/dev/weather/doc/en/concepts/auth`
  - `https://yandex.com/dev/weather/doc/en/concepts/weather_data`
  - `https://yandex.com/dev/weather/doc/en/concepts/fact`
  - `https://yandex.com/dev/weather/doc/en/concepts/forecast`
  - `https://yandex.com/dev/weather/doc/en/concepts/pricing`
  - `https://yandex.com/dev/weather/doc/en/concepts/errors`
- Manually confirmed route entry points in this pass: `3`

## Confirmed API base URLs and entry points
### Current v3 API
- Base URL / endpoint confirmed in the official auth example: `https://api.weather.yandex.ru/graphql/query`
- Confirmed method for the inspected v3 docs: `POST`
- Required headers:
  - `X-Yandex-Weather-Key: <key>`
  - `Content-Type: application/json`

### Legacy v2 URLs still named in the official error docs
The official `Possible errors` page explicitly names these plan-dependent URLs:
- `https://api.weather.yandex.ru/v2/forecast/`
- `https://api.weather.yandex.ru/v2/informers/`

Important scope note:
- In this pass I fully reviewed the current v3 GraphQL flow.
- The v2 URLs are still officially referenced, but I did not capture full route-level parameter tables for them from the current docs pages I inspected, so they are recorded here as confirmed legacy entry points rather than fully expanded references.

## Auth and request model
- The current docs say you must obtain a key in the Yandex Developer Console after choosing an access plan.
- Every API request must pass that key in header `X-Yandex-Weather-Key`.
- The official auth page shows a `curl` example posting a GraphQL body to `https://api.weather.yandex.ru/graphql/query`.
- The main v3 query pattern shown in the docs is:

```graphql
{
  weatherByPoint(request: { lat: 52.37125, lon: 4.89388 }) {
    now {
      temperature
    }
  }
}
```

- The inspected docs consistently use coordinate-based access through `weatherByPoint(request: { lat, lon })`.
- The v3 API returns only the fields explicitly requested in the GraphQL selection set.

## v3 data surfaces confirmed from the official docs
The inspected v3 docs describe one GraphQL endpoint serving multiple data surfaces:
- current weather (`now`)
- forecast (`forecast`)
- history data (`history` section listed in the docs navigation)
- rain / nowcast data (`Rain API` / `nowcast` section listed in the docs navigation)
- climate data
- weather station data
- weather icons
- tiled weather maps
- geosuggest

Pages inspected directly in this pass confirmed these examples and behaviors:

### 1) Current weather (`now`)
From `Weather for now`:
- query object: `weatherByPoint(request: { lat, lon }) { now { ... } }`
- representative fields documented on the page:
  - `temperature`
  - `humidity`
  - `pressure`
  - `precType`
  - `precStrength`
  - `windSpeed`
  - `windDirection`
  - `cloudiness`
- the page explicitly documents unit helpers such as `TemperatureUnit`, `PressureUnit`, and `WindSpeedUnit`

### 2) Forecast (`forecast`)
From `Weather forecast`:
- forecast is requested under the same GraphQL endpoint via `forecast`
- hourly forecast is accessed through `forecast { days(limit: N) { hours { ... } } }`
- day-part forecast is accessed through `forecast { days(limit: N) { parts { morning day evening night } } }`
- the docs show altitude-specific fields such as:
  - `cloudinessOnHeight(height: 100)`
  - `temperatureOnHeight(height: 100)`
  - `windAngleOnHeight(height: 100)`
  - `windDirectionOnHeight(height: 100)`
  - `windSpeedOnHeight(height: 100)`
- the forecast page also states the API can request forecasts for multiple points in one GraphQL query by reusing fragments

## Pricing, rate limits, and plan notes
From the official pricing page:
- `Test` API plan:
  - free for `7 days`
  - below `10,000` requests per month
  - below `10` RPS
- `Optimal` API plan:
  - below `100,000` requests per month
  - below `100` RPS
- `Individual` and `Enterprise` plans use negotiated request volumes / RPS
- pricing page also states broader commercial capabilities such as 10-day forecast coverage and additional specialized parameters on higher plans

Additional official limit notes from the error docs:
- the legacy `Test` rate can expire
- some older plans have daily request limits
- exceeding the request limit can cause access failures until the next day or until the rate changes

## Error, browser, and transport notes
From the official `Possible errors` page:
- `403` can occur when:
  - the `X-Yandex-Weather-Key` header is missing
  - the request was sent to the wrong URL
  - the selected rate expired
  - the request limit was exceeded
- The docs explicitly say the API is not intended to be called directly from an end user's browser.
- The same page explains that browser-side requests can fail with `No 'Access-Control-Allow-Origin' ...` and recommends using an intermediary server that injects the API key.

## Pagination and response-shape notes
- I did not find a generic HTTP pagination scheme in the inspected docs.
- For forecast retrieval, the docs use GraphQL arguments such as `days(limit: N)` instead of traditional REST pagination parameters.
- Because the current v3 interface is GraphQL, response shape is caller-defined: you receive the exact fields requested in the selection set.

## Important fireROUTE notes
- The earlier CAPTCHA blocker is no longer accurate in this browser environment; the official Yandex Weather docs are reachable.
- Yandex currently documents a modern GraphQL API as the primary surface.
- The strongest fully confirmed route in this pass is the v3 GraphQL endpoint `POST https://api.weather.yandex.ru/graphql/query`.
- Official error docs still reference legacy v2 entry points (`/v2/forecast/`, `/v2/informers/`), which suggests mixed-version support remains relevant for some plans.
- Because the provider discourages direct browser calls and requires a secret header, fireROUTE integrations should proxy requests server-side.

## Verification notes
This file replaces the earlier CAPTCHA-only blocker note after manually reviewing the live official Yandex Weather landing page and current documentation set in the browser environment.