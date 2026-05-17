# Church Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `church-calendar`
- Official docs used manually:
  - `http://calapi.inadiutorium.cz/api-doc`
  - `http://calapi.inadiutorium.cz/`
- Confirmed public API base URL: `http://calapi.inadiutorium.cz/api/v0`
- Versioning note: the human docs state requests begin with `/api/:version/:lang`, and the currently documented version is only `v0`
- Response format documented: JSON
- Authentication: none documented
- Manually confirmed routes in this pass: `8`

## Authentication and access
The reviewed official documentation presents the API as a public read-only JSON API:
- no API key or token is documented
- no OAuth or session flow is documented
- the docs show direct browser/cURL access to route paths

## Versioning, language, and calendar-selection rules
The docs explicitly state:
- every request begins with `/api/:version/:lang`
- the only documented version is `v0`
- supported languages listed on the API-doc page are:
  - `en`
  - `fr`
  - `it`
  - `la`
  - `cs`
- calendar identifiers are selected under `/calendars`
- the docs warn that language and sanctorale-calendar combinations can produce mixed-language feast names unless the language path segment matches the calendar language

## Confirmed API surface
The API-doc page explicitly documents these GET route families:
- `GET /api/v0/{lang}/calendars`
- `GET /api/v0/{lang}/calendars/{cal}`
- `GET /api/v0/{lang}/calendars/{cal}/today`
- `GET /api/v0/{lang}/calendars/{cal}/yesterday`
- `GET /api/v0/{lang}/calendars/{cal}/tomorrow`
- `GET /api/v0/{lang}/calendars/{cal}/{year}/{month}/{day}`
- `GET /api/v0/{lang}/calendars/{cal}/{year}/{month}`
- `GET /api/v0/{lang}/calendars/{cal}/{year}`

## 1) List available calendars
- Method: `GET`
- Path: `/api/v0/{lang}/calendars`
- Purpose: list available sanctorale calendar identifiers

Documented path parameters:
- `lang` - required API language code

Documented response note:
- the example response is a JSON array of identifiers such as `default`, `general-la`, `general-en`, and `czech`

## 2) Get calendar description
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}`
- Purpose: return metadata for one calendar

Documented path parameters:
- `lang` - required language code
- `cal` - required calendar identifier

Documented response structure:
- top-level `system`
- top-level `sanctorale`
- example fields include `system.promulgated`, `system.effective_since`, `system.desc`, `sanctorale.title`, and `sanctorale.language`

## 3) Get today's liturgical day
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/today`
- Purpose: return the current day's calendar entry

Documented usage note:
- by default, the server timezone is used
- if the client sends a local time in the `Date` HTTP header, the server respects it
- the docs still recommend using explicitly dated routes when exact timezone handling matters

## 4) Get yesterday's liturgical day
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/yesterday`
- Purpose: return the previous day's calendar entry

## 5) Get tomorrow's liturgical day
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/tomorrow`
- Purpose: return the next day's calendar entry

## 6) Get a specific day entry
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/{year}/{month}/{day}`
- Purpose: return one day entry for an explicit date

Documented path parameters:
- `lang` - required language code
- `cal` - required calendar identifier
- `year` - required year
- `month` - required month
- `day` - required day

Documented date-handling notes:
- examples show both zero-padded and non-zero-padded month/day segments working
- the docs state requests older than the calendar system's effective year are refused
- callers are told to inspect the calendar-description route to determine that lower bound

## 7) Get all day entries for a month
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/{year}/{month}`
- Purpose: return an array of day entries for the specified month

## 8) Get yearly liturgical setup
- Method: `GET`
- Path: `/api/v0/{lang}/calendars/{cal}/{year}`
- Purpose: return the year's common liturgical setup

Documented response note:
- the example response shows fields like `lectionary` and `ferial_lectionary`

Important year interpretation note from the docs:
- this route refers to the Catholic liturgical year, not the plain civil year
- the docs explicitly warn that `/api/v0/en/2015` concerns liturgical year `2015-2016`
- to know which lectionary cycle is in use in June 2015, the docs say to query `/api/v0/en/2014`

## Response structure notes
The API-doc page documents these day-entry fields:
- `date` - ISO 8601 date
- `season` - one of `ordinary`, `advent`, `christmas`, `lent`, `easter`
- `season_week`
- `celebrations[]`
- `weekday`

The docs document these celebration fields:
- `title`
- `colour` - examples include `green`, `violet`, `white`, `red`
- `rank`
- `rank_num`

## Redirect and default-calendar behavior
The docs explicitly note:
- if the caller wants the `default` calendar, `/calendars/default` may be omitted from the path
- the server redirects with HTTP `301` to the full path
- example: `/today` redirects to `/calendars/default/today`

## Pagination, rate limits, and errors
From the reviewed official pages:
- no pagination model is documented
- no numeric rate limit is published
- no formal error-schema page was surfaced in the reviewed human docs
- one explicit non-success behavior is documented: requests for dates before the calendar system's effective year are refused
- another explicit non-success behavior is the `301` redirect when the default calendar prefix is omitted

## fireROUTE notes
- This API is entirely GET-based in the reviewed human docs.
- The most important integration wrinkle is the required `/api/v0/{lang}` prefix even though later examples omit it for brevity.
- Do not treat the yearly route as a plain civil-year lookup; the docs explicitly frame it as liturgical-year data.
- Prefer explicit date routes over `/today`, `/yesterday`, and `/tomorrow` when reproducibility matters.

## Verification notes
This file was manually rebuilt from the live official Church Calendar API documentation using browser inspection.