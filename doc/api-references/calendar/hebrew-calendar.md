# Hebrew Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `hebrew-calendar`
- Docs used manually:
  - `https://www.hebcal.com/home/developer-apis`
  - `https://www.hebcal.com/home/219/hebrew-date-converter-rest-api`
  - `https://www.hebcal.com/home/195/jewish-calendar-rest-api`
  - `https://www.hebcal.com/home/4277/leyning-torah-reading-api`
  - `https://www.hebcal.com/home/197/shabbat-times-rest-api`
  - `https://www.hebcal.com/home/1705/yahrzeit-anniversary-api`
  - `https://www.hebcal.com/home/1663/zmanim-halachic-times-api`
  - `https://www.hebcal.com/home/4984/assur-melacha-work-forbidden-api`
- Confirmed REST API base URL: `https://www.hebcal.com`
- Primary media types: JSON across the advanced REST APIs; XML also documented for `/converter`; RSS/ICS/CSV/FullCalendar variants are documented on some calendar endpoints via `cfg`
- Authentication: none documented for the reviewed public APIs
- Manually confirmed routes in this pass: `7`

## Authentication
From the official Hebcal developer pages reviewed in this session:
- no API key, OAuth flow, or signed-request scheme was documented for the reviewed public REST APIs
- the APIs are presented as public GET endpoints, except the Yahrzeit/Anniversary API which uses `POST` with `application/x-www-form-urlencoded`

## Common request/response conventions
- Base URL: `https://www.hebcal.com`
- the developer landing page groups the public REST surface into converter, calendar, leyning, shabbat, yahrzeit, zmanim, and assur-melacha APIs
- most advanced APIs accept location via GeoNames ID, US ZIP code, or latitude/longitude through the shared location conventions referenced by Hebcal
- event language can be customized with `lg=LANG` on APIs that emit event titles
- no official pagination section or public numeric rate-limit policy was published on the reviewed Hebcal pages

## Manually confirmed endpoint set

### 1) Convert Gregorian and Hebrew dates
- Method: `GET`
- Path: `/converter`
- Full URL: `https://www.hebcal.com/converter`
- Purpose: convert Gregorian dates to Hebrew dates and Hebrew dates to Gregorian dates
- Query parameters confirmed on the official converter page:
  - `cfg` - output format, with `json` and `xml` explicitly documented
  - `date` - Gregorian date in `YYYY-MM-DD` format
  - `g2h=1` - convert Gregorian to Hebrew
  - `strict=1` - return HTTP `400 Bad Request` for invalid dates
  - `start` and `end` - Gregorian batch conversion range; docs say ranges are truncated to `180` days
  - `gy`, `gm`, `gd` - Gregorian year, month, day alternative to `date`
  - `hy`, `hm`, `hd` - Hebrew year, month, day for Hebrew-to-Gregorian conversion
  - `h2g=1` - convert Hebrew to Gregorian
- Response notes confirmed on the official page:
  - single-date and range conversions are both documented
  - converter supports JSON and XML output
  - invalid dates can produce `400` when strict mode is enabled

### 2) Retrieve Jewish calendar events
- Method: `GET`
- Path: `/hebcal`
- Full URL: `https://www.hebcal.com/hebcal`
- Purpose: fetch Jewish calendar data, holidays, readings, and optional timed/location-aware events
- Query parameters confirmed on the official Jewish Calendar page:
  - `v=1` - required version flag
  - `cfg=json` - JSON output; the page also documents alternate `cfg` values including `fc`, `rss`, `ics`, and `csv`
  - `year` - current year (`now`) or explicit `YYYY`
  - `start` and `end` - Gregorian range input as an alternative to `year`
  - `month` - month selector; the examples use `month=x`
  - event toggles shown in the official example include `maj`, `min`, `mod`, `nx`, `ss`, `mf`, `c`, `M`, and `s`
  - `geo` and `geonameid` - location selection in the official example
- Response/usage notes confirmed on the official page:
  - output is documented as JSON for the main REST form
  - the page explicitly distinguishes Diaspora vs Israel schedules
  - candle-lighting and havdalah calculations require location context

### 3) Retrieve Torah reading / leyning data
- Method: `GET`
- Path: `/leyning`
- Full URL: `https://www.hebcal.com/leyning`
- Purpose: return Torah readings for Shabbat, holidays, optional triennial readings, and weekday Monday/Thursday readings
- Query parameters confirmed on the official page:
  - `cfg=json` - required JSON output flag
  - `start` and `end` - date-range inputs shown in the primary example
  - the page also documents single-date mode, Diaspora vs Israel behavior, and a toggle that reduces JSON payload size by disabling triennial aliyot details
- Response notes confirmed on the official page:
  - example output includes top-level `date`, `location`, `range`, and `items`
  - per-item structures include `date`, `hdate`, `name`, `parshaNum`, and aliyah/readings objects

### 4) Get rolling weekly Shabbat times
- Method: `GET`
- Path: `/shabbat`
- Full URL: `https://www.hebcal.com/shabbat`
- Purpose: retrieve the current week's Shabbat times and Torah portion for a specific location
- Query parameters confirmed on the official page:
  - `cfg` - `json` or RSS (`r`) output
  - `geonameid` - location selection in the official example
  - `M` - candle-lighting minutes before sunset
  - `leyning` - include or suppress aliyot details; example uses `leyning=off`
  - optional exact date input is also documented
  - `hdp=1` - include `heDateParts` on untimed items
  - `lg=LANG` - alternate event-title language
- Response notes confirmed on the official page:
  - typical results include candle-lighting, the weekly Torah portion, and havdalah
  - holiday and fast-related items can also appear depending on the week

### 5) Calculate Yahrzeit, Hebrew birthdays, and anniversaries
- Method: `POST`
- Path: `/yahrzeit`
- Full URL: `https://www.hebcal.com/yahrzeit`
- Purpose: compute future yahrzeit, Hebrew birthday, and Hebrew anniversary dates
- Content type confirmed on the official page: `application/x-www-form-urlencoded`
- Form fields confirmed on the official page:
  - `cfg` - required output format selector
  - `years` - default `20`; `1` for a single Hebrew year
  - `hd` - append Hebrew date to titles
  - `yizkor` - include Yizkor dates
  - `start` / `end` style Hebrew-year range controls are documented as beginning and ending Hebrew-year selectors
  - `hdp` - include `heDateParts`
  - indexed Gregorian input fields `yX`, `mX`, `dX`, `sX`, `tX`, and optional `nX` for multiple people/events
  - Hebrew-date alternatives are also documented with indexed `hyX`, `hmX`, and `hdX`
- Response/usage notes confirmed on the official page:
  - HTTPS is explicitly required for this API because it carries personal/sensitive information
  - gzip and brotli compression support is explicitly documented
  - HTTP keep-alive support is explicitly documented

### 6) Calculate zmanim / halachic times
- Method: `GET`
- Path: `/zmanim`
- Full URL: `https://www.hebcal.com/zmanim`
- Purpose: compute halachic times such as dawn, sunrise, latest Shema, sunset, and nightfall for a location
- Query parameters confirmed on the official page:
  - `cfg=json` - required JSON output flag
  - `geonameid` - location selector in the example
  - `date` - single-date query in `YYYY-MM-DD`
  - `start` and `end` - batch range mode; docs say ranges are truncated to `180` days
  - `sec=1` - include seconds-level precision instead of minute rounding
- Response notes confirmed on the official page:
  - the response includes a large structured set of named zmanim values
  - the docs explicitly explain that small differences from other published sources are expected

### 7) Determine whether melacha is currently forbidden
- Method: `GET`
- Path: `/zmanim`
- Full URL: `https://www.hebcal.com/zmanim`
- Purpose: special `issur melacha` mode for determining whether work is forbidden at a given time and location
- Query parameters confirmed on the official page:
  - `cfg=json` - required JSON output
  - `im=1` - enable assur-melacha mode
  - `geonameid` - location selector in the example
  - `dt` - exact timestamp to check
- Response notes confirmed on the official page:
  - example output includes `location` plus a `status` object with `localTime` and `isAssurBemlacha`
  - the page describes this API as experimental

## Pagination
- no dedicated pagination model was documented on the reviewed Hebcal pages
- several range-driven endpoints instead use explicit `start` / `end` date windows
- `/converter` and `/zmanim` explicitly document range truncation at `180` days

## Rate limits
- no public numeric rate-limit policy was documented on the reviewed Hebcal pages

## Error and response notes
- `/converter` documents HTTP `400 Bad Request` for invalid dates when `strict=1`
- converter responses can be JSON or XML depending on `cfg`
- `/yahrzeit` explicitly documents HTTPS-only transport and compression support (`gzip`, `br`)
- calendar/shabbat APIs document multiple output modes selected by `cfg`

## Important usage notes
- Hebcal repeatedly recommends using its native JavaScript libraries (`@hebcal/core`, `@hebcal/leyning`) instead of the web APIs when building JS applications
- location selection is a cross-cutting concern across several APIs; clients should normalize on the shared Hebcal location conventions
- the Yahrzeit API is the main outlier in transport style: it is a POST form endpoint, while the other reviewed routes are GET-driven
- the Assur Melacha API is implemented as a special mode of `/zmanim`, not as a wholly separate path

## Verification notes
This file was manually rebuilt from Hebcal's official developer landing page and the official route-specific API pages using browser inspection.