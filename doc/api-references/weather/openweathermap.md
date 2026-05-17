# OpenWeatherMap

## Provider metadata
- Category: `Weather`
- Provider slug: `openweathermap`
- Official docs/site checked manually:
  - `https://openweathermap.org/api/one-call-3`
  - `https://openweathermap.org/api`
- Manually confirmed API route count in this pass: `6`
- Primary weather-data base URL confirmed from the official docs: `https://api.openweathermap.org/data/3.0`
- AI assistant base URL confirmed from the official docs: `https://api.openweathermap.org/assistant`
- Response format: JSON

## Authentication
OpenWeather currently exposes two auth patterns on the reviewed official One Call API 3.0 surface:
- One Call weather-data endpoints use query auth: `appid={API key}`
- AI Weather Assistant API endpoints use header auth:
  - `Content-Type: application/json`
  - `X-Api-Key: {your OpenWeather API key}`

## Official product notes confirmed in this review
- The reviewed page is `One Call API 3.0`.
- The product page says One Call API 3.0 is updated every `10 minutes` and recommends requesting it every 10 minutes for the most up-to-date data.
- The product page says One Call API 3.0 is included only in the separate `One Call by Call` subscription.
- The same official page contains two quota statements that should be treated carefully because they are not identical:
  - product concept text says the subscription includes `1,000 calls/day for free`
  - the `How to start` section says `2000 API calls per day` are set by default once subscribed and can be changed in the `Billing plans` tab
- Because the official page itself shows both numbers, fireROUTE should treat daily quota as subscription-controlled and verify the current account limit in pricing/account settings rather than assuming one fixed public cap.
- The official page says the One Call product concept contains `5 endpoints`, but the currently reviewed route-level docs expose `6` distinct API paths when the AI assistant's session-start and session-resume API paths are counted separately.

## Confirmed routes
| Method | Path | Base URL | Purpose | Key documented parameters / body |
|---|---|---|---|---|
| GET | `/onecall` | `https://api.openweathermap.org/data/3.0` | Current weather, 1-minute forecast, hourly forecast, daily forecast, and government alerts | required `lat`, required `lon`, required `appid`, optional `exclude`, optional `units`, optional `lang` |
| GET | `/onecall/timemachine` | `https://api.openweathermap.org/data/3.0` | Weather for a specific timestamp | required `lat`, required `lon`, required `dt`, required `appid`, optional `units`, optional `lang` |
| GET | `/onecall/day_summary` | `https://api.openweathermap.org/data/3.0` | Daily aggregated weather for a specific date | required `lat`, required `lon`, required `date`, required `appid`, optional `units`, optional `lang`, optional `tz` |
| GET | `/onecall/overview` | `https://api.openweathermap.org/data/3.0` | Human-readable AI-generated weather summary for today or tomorrow | required `lat`, required `lon`, required `appid`, optional `date`, optional `units` |
| POST | `/session` | `https://api.openweathermap.org/assistant` | Start an AI Weather Assistant conversation session | header `X-Api-Key`, JSON body with required `prompt` |
| POST | `/session/{session_id}` | `https://api.openweathermap.org/assistant` | Continue an existing AI Weather Assistant session | header `X-Api-Key`, path `session_id`, JSON body with required `prompt` |

## Route details
### 1) `GET /onecall`
Full URL pattern:
`https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`

Officially documented parameters:
- `lat` - required latitude, decimal `(-90; 90)`
- `lon` - required longitude, decimal `(-180; 180)`
- `appid` - required API key
- `exclude` - optional comma-delimited list without spaces; documented values: `current`, `minutely`, `hourly`, `daily`, `alerts`
- `units` - optional; `standard`, `metric`, `imperial`
- `lang` - optional localized output language

Officially documented response families include:
- `lat`, `lon`, `timezone`, `timezone_offset`
- `current`
- `minutely`
- `hourly`
- `daily`
- `alerts`

Important usage notes from the reviewed docs:
- This is the primary One Call endpoint for current + forecast + alerts data.
- The docs explicitly show an alerts-only pattern by excluding `current,minutely,hourly,daily`.
- Weather-alert descriptions may remain in local language depending on the source agency.

### 2) `GET /onecall/timemachine`
Full URL pattern:
`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}`

Officially documented parameters:
- `lat` - required
- `lon` - required
- `dt` - required Unix timestamp in UTC
- `appid` - required API key
- `units` - optional; `standard`, `metric`, `imperial`
- `lang` - optional localized output language

Officially documented usage notes:
- Data is available from `1979-01-01` through `4 days ahead`
- One response contains weather data for only one specified timestamp
- The response includes a `data` array/object family with fields such as `temp`, `feels_like`, `pressure`, `humidity`, `dew_point`, `uvi`, `clouds`, `visibility`, `wind_speed`, `wind_gust`, `wind_deg`, `weather`, and optional rain/snow sections
- Historical UV index data is called out as limited; the docs say historical UVI is available only for 5 days back unless arranged otherwise with OpenWeather

### 3) `GET /onecall/day_summary`
Full URL pattern:
`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat={lat}&lon={lon}&date={date}&appid={API key}`

Officially documented parameters:
- `lat` - required
- `lon` - required
- `date` - required `YYYY-MM-DD`
- `appid` - required API key
- `units` - optional; `standard`, `metric`, `imperial`
- `lang` - optional localized output language
- `tz` - optional manual timezone override in `±XX:XX` format

Officially documented usage notes:
- Coverage starts at `1979-01-02`
- Forecast/forward coverage is described as up to `1.5 years ahead`
- If `tz` is supplied, afternoon/night/evening/morning values are returned relative to that timezone
- Response families include `cloud_cover`, `humidity`, `precipitation`, `temperature`, `pressure`, and `wind`

### 4) `GET /onecall/overview`
Full URL pattern:
`https://api.openweathermap.org/data/3.0/onecall/overview?lat={lat}&lon={lon}&appid={API key}`

Officially documented parameters:
- `lat` - required
- `lon` - required
- `appid` - required API key
- `date` - optional `YYYY-MM-DD`; docs say available for today and tomorrow
- `units` - optional; `standard`, `metric`, `imperial`

Officially documented response fields:
- `lat`
- `lon`
- `tz`
- `date`
- `units`
- `weather_overview`

Important note:
- This route returns an AI-generated human-readable weather summary rather than the raw One Call block structure.

### 5) `POST /session`
Full URL pattern:
`https://api.openweathermap.org/assistant/session`

Officially documented request requirements:
- Method: `POST`
- Headers:
  - `Content-Type: application/json`
  - `X-Api-Key: {your OpenWeather API key}`
- JSON body:
  - `prompt` - required; weather or weather-related advice query

Officially documented behavior:
- Starts a new AI Weather Assistant session
- Returns HTTP `200` on success
- If location is missing, the assistant asks the user to specify it
- The example response includes:
  - `answer`
  - `data`
  - `session_id`
- The docs say the assistant understands over 50 languages and remembers the location for future inquiries in the session

### 6) `POST /session/{session_id}`
Full URL pattern:
`https://api.openweathermap.org/assistant/session/{session_id}`

Officially documented request requirements:
- Method: `POST`
- Headers:
  - `Content-Type: application/json`
  - `X-Api-Key: {your OpenWeather API key}`
- Path parameter:
  - `session_id` - conversation session identifier returned by the start-session route
- JSON body:
  - `prompt` - required

Officially documented behavior:
- Resumes an existing chatbot conversation
- Returns HTTP `200` on success
- Keeps prior conversation context and the previously supplied location until a new location is provided
- The example response again includes `answer`, `data`, and `session_id`

## AI assistant surface notes
The official AI Weather Assistant section also exposes a non-API web interface:
- `https://openweathermap.org/weather-assistant` with required query parameter `apikey`

That page is useful for manual testing, but it is not counted in the fireROUTE API route total because it is a browser UI entry point rather than an API path.

The official AI section also states:
- interactions with the AI Assistant endpoint are free of charge
- however, the assistant retrieves weather information from the Current & Forecast endpoint, and those underlying weather requests count toward One Call API 3.0 usage statistics
- the assistant currently considers current weather, minutely forecast, hourly forecast, and daily forecast for the next 7 days
- valid locations can be cities, provinces, or countries

## Errors, pagination, and response-format notes
- Response format is JSON across the reviewed API examples
- No pagination model is documented on the reviewed One Call API 3.0 page
- The official error payload structure is:
  - `cod` - error code
  - `message` - error description
  - `parameters` - optional list of request parameter names related to the error
- The official error section explicitly lists documented error families for:
  - `400`
  - `401`
  - `404`
  - `429`
  - `5xx`

## Important fireROUTE notes
- OpenWeather's currently reviewed weather documentation is best represented by the One Call API 3.0 page, not the broader catalog page alone.
- The provider uses mixed auth models across the reviewed routes: query-string `appid` for One Call weather routes and header `X-Api-Key` for AI assistant routes.
- The current/forecast endpoint doubles as the alerts endpoint through `exclude=` filtering rather than a separate public alerts path.
- The product page's own route-count and quota wording is internally inconsistent in places, so implementation should trust the concrete request paths shown in the route sections and verify plan limits in the current account UI/pricing page.

## Verification notes
This file was manually rebuilt from a fresh official-doc review of the live OpenWeather One Call API 3.0 documentation and the linked catalog page. It replaces the earlier weaker summary that left the AI Weather Assistant API paths unresolved.