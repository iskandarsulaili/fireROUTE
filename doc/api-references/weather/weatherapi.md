# WeatherAPI

## Provider metadata
- Category: `Weather`
- Provider slug: `weatherapi`
- Official docs page used: `https://www.weatherapi.com/docs/`
- Documented base URL: `http://api.weatherapi.com/v1`
- Transport: HTTP or HTTPS according to docs page wording
- Formats: JSON and XML
- Auth model: `key=<YOUR_API_KEY>` query parameter
- Notes source: manually extracted from the official WeatherAPI docs page via browser tools

## Supported API methods explicitly listed in provider docs
The docs page explicitly lists these API methods:
- `/current.json` or `/current.xml`
- `/forecast.json` or `/forecast.xml`
- `/search.json` or `/search.xml`
- `/history.json` or `/history.xml`
- `/marine.json` or `/marine.xml`
- `/future.json` or `/future.xml`
- `/timezone.json` or `/timezone.xml`
- `/sports.json` or `/sports.xml`
- `/astronomy.json` or `/astronomy.xml`
- `/ip.json` or `/ip.xml`

## Common request format
Provider docs state requests are made from base URL plus API method.

Canonical pattern:
- `http://api.weatherapi.com/v1/{method}.{format}?key={API_KEY}&q={query}`

Common documented parameters across the platform:
- `key` - required API key
- `q` - required location/query selector for many methods
- `lang` - optional language code
- `aqi` - optional `yes` or `no` for air quality data in realtime, history, and forecast responses
- `alerts` - optional `yes` or `no` for forecast alerts

## Query / location formats for `q`
The docs explicitly list these `q` forms:
- latitude/longitude decimal pair: `q=48.8567,2.3508`
- city name: `q=Paris`
- US ZIP: `q=10001`
- UK postcode: `q=SW1`
- Canada postal code: `q=G2J`
- METAR code: `q=metar:EGLL`
- IATA airport code: `q=iata:DXB`
- automatic IP lookup: `q=auto:ip`
- explicit IP address: `q=100.0.0.1`
- provider search ID: `q=id:2801268`

## 1) Realtime API
- Method: `GET`
- Paths:
  - `/current.json`
  - `/current.xml`
- Purpose: current weather

Documented request example:
- `http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London`

Common parameters:
- `key`
- `q`
- `lang`
- `aqi`

## 2) Forecast API
- Method: `GET`
- Paths:
  - `/forecast.json`
  - `/forecast.xml`
- Purpose: forecast weather

Documented request example:
- `http://api.weatherapi.com/v1/forecast.json?key=<YOUR_API_KEY>&q=07112&days=7`

Documented parameters:
- `key`
- `q`
- `days` - documented range `1` to `14`
- `dt` - for forecast API, docs say it should be between today and next 14 days in `yyyy-MM-dd`
- `hour` - 24-hour integer, e.g. `17` for 5 pm
- `lang`
- `alerts` - `yes` or `no`
- `aqi` - `yes` or `no`
- `tp` - docs show `tp=15`

Provider notes:
- alerts are not returned by default; use `alerts=yes`
- air quality is not returned by default; use `aqi=yes`

## 3) Search / Autocomplete API
- Method: `GET`
- Paths:
  - `/search.json`
  - `/search.xml`
- Purpose: search / autocomplete locations

Documented example:
- `http://api.weatherapi.com/v1/search.json?key=<YOUR_API_KEY>&q=lond`

Documented parameters:
- `key`
- `q`

## 4) History API
- Method: `GET`
- Paths:
  - `/history.json`
  - `/history.xml`
- Purpose: historical weather

Documented parameters from the main request-parameter section:
- `key`
- `q`
- `dt` - on or after `2010-01-01`, format `yyyy-MM-dd`
- `unixdt` - same restriction as `dt`; use either `dt` or `unixdt`, not both
- `end_dt` - on or after `2010-01-01`
- `unixend_dt` - same restriction as `end_dt`; use either `end_dt` or `unixend_dt`, not both
- `hour`
- `lang`
- `aqi`

## 5) Marine API
- Method: `GET`
- Paths:
  - `/marine.json`
  - `/marine.xml`
- Purpose: marine weather and tide data

Documented in the API method list. Detailed parameter extraction for the dedicated marine subsection should be expanded in a later manual pass if fireROUTE needs the full marine schema.

## 6) Future API
- Method: `GET`
- Paths:
  - `/future.json`
  - `/future.xml`
- Purpose: future weather

Documented parameters from main request-parameter section:
- `key`
- `q`
- `dt` - between 14 days and 300 days from today, format `yyyy-MM-dd`
- `lang`

## 7) Time Zone API
- Method: `GET`
- Paths:
  - `/timezone.json`
  - `/timezone.xml`
- Purpose: timezone data

Documented in the API method list.

## 8) Sports API
- Method: `GET`
- Paths:
  - `/sports.json`
  - `/sports.xml`
- Purpose: sports-related weather data

Documented in the API method list.

## 9) Astronomy API
- Method: `GET`
- Paths:
  - `/astronomy.json`
  - `/astronomy.xml`
- Purpose: astronomy data

Documented in the API method list.

## 10) IP Lookup API
- Method: `GET`
- Paths:
  - `/ip.json`
  - `/ip.xml`
- Purpose: IP lookup / geolocation-related lookup

Documented in the API method list.

## 11) Bulk Request
- Method: `POST`
- Canonical example endpoint shown in docs:
  - `http://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=bulk`
- Purpose: request multiple locations in a single call

Documented bulk rules:
- available on Pro+, Business, or Enterprise plans
- works for all API methods except Search API
- send `q=bulk` in query string
- send JSON body with UTF-8 encoding using POST
- each location counts as 1 call
- keep bulk requests below 50 locations per request

Documented bulk errors:
- `9000` - invalid JSON body in bulk request
- `9001` - too many locations in bulk request

## Canonical fireROUTE notes
- This provider exposes many product surfaces under one shared base URL.
- JSON/XML are separate path suffixes rather than negotiated by header.
- `q` is a polymorphic location selector and should be normalized carefully in fireROUTE.
- Bulk uses `POST` plus `q=bulk` instead of a separate `/bulk` path.
- `aqi` and `alerts` are opt-in response enrichments.

## Verification notes
This file was manually rebuilt from the live WeatherAPI docs page using browser tools, replacing the earlier low-fidelity autogenerated summary.
