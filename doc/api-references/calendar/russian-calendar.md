# Russian Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `russian-calendar`
- Docs used manually:
  - `https://github.com/egno/work-calendar`
- Confirmed deployment pattern from official docs: `https://<your-host>`
- Primary media type: JSON
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `3`

## Authentication
From the official repository README:
- no API key, bearer token, OAuth flow, or login requirement is documented
- the service is presented as a self-hosted calendar service with public HTTP examples

## Common request/response conventions
- The README examples are deployment-relative and use `https://my_host/...` rather than a fixed public SaaS host.
- Confirmed route family root: `/calendar/...`
- The service returns JSON.
- The README says response fields include:
  - `holiday`: whether the day is a holiday/day off
  - `default`: `True` when the government calendar was not loaded and the value was derived only from weekday logic
- The README says the service uses open data from `data.gov.ru`.
- No rate-limit or pagination model is documented.

## Manually confirmed endpoint set

### 1) Get the current day work/holiday status
- Method: `GET`
- Path: `/calendar/day/`
- Full URL pattern from the official README: `https://my_host/calendar/day/`
- Purpose: return whether the current day is a holiday/day off

### 2) Get work/holiday status for a specific date
- Method: `GET`
- Path: `/calendar/day/{date}/`
- Full URL pattern from the official README: `https://my_host/calendar/day/2018-06-09/`
- Path parameters:
  - `{date}` in date form such as `2018-06-09`
- Purpose: return whether the requested date is a holiday/day off

### 3) Refresh calendar data
- Method: `GET`
- Path: `/calendar/update/`
- Full URL pattern from the official README: `https://my_host/calendar/update/`
- Purpose: request a calendar-data update from `data.gov.ru`

## Parameters
- path:
  - `date` on `/calendar/day/{date}/`
- no query parameters were published in the reviewed official README examples

## Pagination
- none documented

## Rate limits
- no rate limits or quotas were published in the reviewed official repository README

## Error and response notes
- the official README documents JSON output rather than HTML
- the documented JSON fields are:
  - `holiday`
  - `default`
- the reviewed README does not publish a reusable error envelope or HTTP status table

## Important usage notes
- this provider is documented as a self-hosted service rather than a centrally hosted public API
- the repository was visibly archived on GitHub on `2023-10-02`, so the documented routes should be treated as archival/self-hosted examples rather than an actively operated hosted endpoint
- the service is specifically oriented around Russian business-day and holiday logic and falls back to weekday-only logic when official calendar data is unavailable

## Verification notes
This file was manually rebuilt from the official `egno/work-calendar` repository README using browser inspection only. The `3` routes above were directly shown in the first-party usage examples.