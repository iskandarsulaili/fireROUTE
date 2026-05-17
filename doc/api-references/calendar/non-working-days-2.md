# Non-Working Days

## Provider metadata
- Category: `Calendar`
- Provider slug: `non-working-days-2`
- Official docs used manually:
  - `https://www.isdayoff.ru/docs/`
  - `https://www.isdayoff.ru/db/`
  - `https://www.isdayoff.ru/`
- Confirmed API base URL: `https://isdayoff.ru`
- Primary response/content types confirmed from the reviewed official docs: plain-text status codes / delimited text on API routes, HTML on docs pages
- Authentication model confirmed from the reviewed official docs: none
- Manually confirmed routes in this pass: `6`

## Authentication and common behavior
- The reviewed official docs do not mention API keys, OAuth, bearer tokens, cookies, or signed-request requirements.
- The official documentation says all parameters can be combined.
- The docs are currently published in Russian.
- The reviewed data-coverage page lists currently documented country codes and coverage ranges including `ru` (default), `by`, `kz`, `us`, `uz`, `tr`, and `lv`, with year coverage varying by country.

## Confirmed API surface

### 1) Get the status for a single date via path-form date lookup
- Method: `GET`
- Path family: `/{date}`
- Base URL: `https://isdayoff.ru`
- Supported path formats documented in this pass:
  - `/YYYYMMDD`
  - `/YYYY-MM-DD`
  - `/YYMMDD`
  - `/YY-MM-DD`
- Purpose: return the workday / non-workday status code for a single date
- Optional query parameters documented in this pass:
  - `cc` - optional ISO 3166-1 alpha-2 country code
  - `pre` - `0` or `1`; when enabled, short days are marked with code `2`
  - `sd` - `0` or `1`; switch between five-day and six-day workweek handling
  - `covid` - `0` or `1`; account for special pandemic-era decrees and mark them with code `4`
  - `holiday` - `0` or `1`; mark holidays with code `8`

### 2) Get today's status
- Method: `GET`
- Path: `/today`
- Full URL: `https://isdayoff.ru/today`
- Purpose: return the status of the current day
- Optional query parameters explicitly documented in this pass:
  - `tz` - IANA timezone name, used when IP-based timezone detection is not sufficient
- Official docs note that alias routes determine timezone from the request IP when possible

### 3) Get tomorrow's status
- Method: `GET`
- Path: `/tomorrow`
- Full URL: `https://isdayoff.ru/tomorrow`
- Purpose: return the status of the next day
- Optional query parameters explicitly documented in this pass:
  - `tz` - IANA timezone name, used when IP-based timezone detection is not sufficient

### 4) Debug the currently resolved time/date context
- Method: `GET`
- Path: `/now`
- Full URL: `https://isdayoff.ru/now`
- Purpose: return the current date, time, and timezone offset in minutes so callers can verify timezone handling

### 5) Retrieve date data through the extended query API
- Method: `GET`
- Path: `/api/getdata`
- Full URL: `https://isdayoff.ru/api/getdata`
- Purpose: return status data for a single day, a month, a year, or a bounded date range
- Supported required query shapes documented in this pass:
  - `year=YYYY&month=MM&day=DD` - single date
  - `year=YYYY&month=MM` - full month
  - `year=YYYY` - full year
  - `date1=YYYYMMDD&date2=YYYYMMDD` - arbitrary period, limited to 366 days
- Optional query parameters explicitly documented for this route:
  - `pre` - account for short days
  - `delimeter` - output separator string, up to 7 characters; `%0A` is the documented newline example
  - `covid` - account for pandemic-era decrees
  - `sd` - use six-day workweek handling

### 6) Check whether a year is a leap year
- Method: `GET`
- Path: `/api/isleap`
- Full URL: `https://isdayoff.ru/api/isleap`
- Purpose: return whether the requested year is a leap year
- Required query parameters:
  - `year` - target year in `YYYY` format

## Pagination
- No pagination mechanism was documented on the reviewed official pages.
- The provider exposes direct scalar/date-range lookups rather than page/cursor-based list routes.

## Rate limits
- The reviewed official pages do not publish numeric quotas, request-per-minute limits, or rate-limit headers.
- Because no formal throttling contract was found in the reviewed docs, downstream integrations should treat rate behavior as undocumented.

## Error handling
- The official docs explicitly document these normal success codes for date/status responses, all with HTTP `200`:
  - `0` - working day
  - `1` - non-working day
  - `2` - short day
  - `4` - special code used when `covid=1`; the docs table labels it `Рабочий день *`
  - `8` - holiday day marker when `holiday=1`
- The official docs explicitly document these error codes for date/status responses:
  - `100` - invalid date or country code, HTTP `400`
  - `101` - data not found, HTTP `404`
  - `199` - service error, HTTP `400`
- The official docs explicitly document these leap-year responses for `/api/isleap`:
  - `0` - non-leap year, HTTP `200`
  - `1` - leap year, HTTP `200`
  - `100` - invalid year, HTTP `400`
  - `101` - data not found, HTTP `404`
  - `199` - service error, HTTP `400`

## Response format notes
- The reviewed API docs describe plain-text numeric status responses, not JSON payloads.
- `/api/getdata` can return multi-day output with a custom separator controlled by the documented `delimeter` parameter spelling.
- The alias route `/now` is documented as returning date, time, and timezone-offset information rather than a simple workday code.

## Important usage notes
- The docs say parameters can be combined, so country/workweek/holiday modifiers can be layered onto date lookups.
- Date-range requests to `/api/getdata` are capped at 366 days.
- For alias routes such as `/today` and `/tomorrow`, use `tz` with an IANA timezone name if IP-based timezone detection is wrong.
- The country-coverage page should be consulted before enabling a country in fireROUTE because supported years differ by country.
- The official examples use the apex domain `https://isdayoff.ru` for API calls even though the website is also reachable at `https://www.isdayoff.ru/`.

## Verification notes
This file was manually rebuilt from isDayOff's current official documentation and data-coverage pages, replacing the earlier timeout placeholder.
