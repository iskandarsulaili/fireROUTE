# wttr.in

## Provider metadata
- Category: `Weather`
- Provider slug: `wttr-in`
- Docs used manually:
  - `https://wttr.in/:help`
  - `https://raw.githubusercontent.com/chubin/wttr.in/master/README.md`
  - live endpoint check: `https://wttr.in/London?format=j1`
- Base URL: `https://wttr.in`
- Auth: none documented
- Response styles explicitly documented by the provider: ANSI/plain text, HTML/browser rendering, PNG, JSON, Prometheus metrics
- Notes source: manually reviewed from the official wttr.in help page, official repository README, and a live JSON endpoint in the browser

## Manually confirmed endpoint patterns

### 1) Current-location weather
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://wttr.in/`
- Purpose: returns a weather report for the caller's current location inferred from IP address

### 2) Location weather lookup
- Method: `GET`
- Path: `/{location}`
- Full URL pattern: `https://wttr.in/{location}`
- Purpose: returns weather for a requested location

Documented location forms:
- city name: `/Paris`
- free-form landmark/location: `/~Eiffel+tower`
- Unicode name: `/Москва`
- 3-letter airport code: `/muc`
- domain name lookup: `/@stackoverflow.com`
- postal/area code: `/94107`
- coordinates: `/-78.46,106.79`

### 3) PNG weather image
- Method: `GET`
- Path: `/{location}.png`
- Full URL pattern: `https://wttr.in/{location}.png`
- Purpose: render weather as an image instead of terminal/browser text

PNG-specific options documented by provider:
- `p` - add frame around output
- `t` - transparency 150
- `transparency={0..255}` - custom transparency
- `background={RRGGBB}` - background color
- PNG long options are encoded with `_` separators, e.g. `/Rome_0pq_lang=it.png`

### 4) Moon phase
- Method: `GET`
- Path: `/moon`
- Full URL pattern: `https://wttr.in/moon`
- Purpose: return moon phase information

Provider note:
- docs say `,+US` or `,+France` style suffixes can be added for city-specific context

### 5) Moon phase for a specific date
- Method: `GET`
- Path: `/moon@{date}`
- Full URL pattern: `https://wttr.in/moon@YYYY-MM-DD`
- Purpose: return moon phase information for a requested date

### 6) Help page
- Method: `GET`
- Path: `/:help`
- Full URL pattern: `https://wttr.in/:help`
- Purpose: built-in usage/help reference

### 7) Bash helper function
- Method: `GET`
- Path: `/:bash.function`
- Full URL pattern: `https://wttr.in/:bash.function`
- Purpose: return the recommended shell helper function

### 8) Translation status page
- Method: `GET`
- Path: `/:translation`
- Full URL pattern: `https://wttr.in/:translation`
- Purpose: show translator/localization information

## Query and format parameters documented by provider

### Units and rendering switches
These are documented as option flags on the query string:
- `m` - metric / SI units
- `u` - USCS units
- `M` - wind speed in meters per second
- `0` - current conditions only
- `1` - current conditions plus today's forecast
- `2` - current conditions plus today and tomorrow
- `A` - force ANSI terminal output
- `d` - restrict output to glyphs commonly available in standard console fonts
- `F` - suppress the `Follow` line
- `n` - narrow output
- `q` - quiet output
- `Q` - superquiet output
- `T` - switch terminal sequences off / plain text
- `lang={code}` - localization parameter shown in examples such as `?lang=fr`

### Format selectors documented in the official README
- `format=j1` - JSON output
- `format=j2` - smaller JSON variant without hourly data
- `format=p1` - Prometheus metrics output
- `format=v2` - data-rich text output format
- `format=3` - one-line output format
- custom `format=` strings are also documented for one-line/text output templates

## Request and response notes
- The provider says ANSI and HTML output are selected based on `User-Agent`.
- The provider recommends `?T` to force plain text and disable colors.
- A live browser check of `https://wttr.in/London?format=j1` returned JSON with top-level keys including `current_condition`, `nearest_area`, `request`, and `weather`.
- The official README says `weatherCode` values map to WorldWeatherOnline weather-code enumerations.
- JSON and Prometheus are intended for scripts and API-style consumption.

## Localization notes
The official help page documents three localization approaches:
- language subdomain, e.g. `https://fr.wttr.in/Paris`
- query parameter, e.g. `https://wttr.in/Paris?lang=fr`
- `Accept-Language` request header

## Auth, rate limits, pagination, and errors
- Auth: none documented
- Rate limits: no public numeric rate limit documented on the official help page or README pages reviewed in this pass
- Pagination: not documented; responses are single-report payloads rather than paged collections
- Error format: no formal error schema documented on the official pages reviewed in this pass

## Canonical fireROUTE mapping notes
- wttr.in is path-oriented rather than endpoint-family-oriented; the primary distinction is the location path plus formatting flags.
- Location parsing is polymorphic and accepts names, airport codes, domains, postal codes, and coordinates.
- Output negotiation is mostly driven by path suffixes and `format=` / flag-style query parameters rather than content negotiation headers.
- Root `/` is meaningful and should be treated separately from explicit `/{location}` requests because it depends on caller geolocation.

## Verification notes
This file was manually rebuilt from the live wttr.in help page, official repository README, and a manually inspected live JSON response using browser tools, replacing the earlier autogenerated summary.
