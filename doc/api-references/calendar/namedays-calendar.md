# Namedays Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `namedays-calendar`
- Docs used manually:
  - `https://nameday.abalin.net/`
  - `https://nameday.abalin.net/docs/api`
- Confirmed REST API base URL: `https://nameday.abalin.net/api`
- Primary media type: JSON
- Authentication: none shown in the reviewed official docs
- Manually confirmed routes in this pass: `3`

## Authentication
From the reviewed official homepage and inline Stoplight/OpenAPI reference:
- no API key flow is documented
- no OAuth flow is documented
- no custom auth header or token parameter is shown on the three reviewed operations

## Common request/response conventions
- Base URL: `https://nameday.abalin.net/api`
- Confirmed versioned route family: `/V2`
- Successful responses are JSON objects with the shared envelope fields:
  - `success`
  - `message`
  - `data`
- The reviewed docs also define a reusable validation-error response with:
  - `message`
  - `errors` object keyed by invalid field name

## Manually confirmed endpoint set

### 1) Get namedays for today
- Method: `GET`
- Path: `/V2/today/{timezone}`
- Full URL: `https://nameday.abalin.net/api/V2/today/{timezone}`
- Purpose: retrieve namedays for the current date
- Path parameters:
  - `timezone` - optional timezone string; the official description says the default timezone is `UTC` and links to the PHP supported-timezones list
- Confirmed responses from the official docs:
  - `200` success response with the shared JSON envelope
  - `400` JSON error with message enum `Invalid timezone`
- Important note:
  - the inline OpenAPI marks `timezone` as a path parameter but also flags it as optional with `x-optional: true`; the docs text explicitly says the parameter is optional and defaults to UTC

### 2) Get namedays for a specific date
- Method: `GET`
- Path: `/V2/date`
- Full URL: `https://nameday.abalin.net/api/V2/date`
- Purpose: retrieve namedays for a specific day and month
- Query parameters confirmed in the official docs:
  - `day` - required integer, minimum `1`, maximum `31`
  - `month` - required integer, minimum `1`, maximum `12`
- Confirmed responses from the official docs:
  - `200` success response with the shared JSON envelope
  - `400` JSON error variants including `invalid date`, `invalid parameters, day and month are required`, and `missing or invalid parameters`
  - `422` validation-error response with `message` and `errors`

### 3) Look up namedays by name
- Method: `POST`
- Path: `/V2/getname`
- Full URL: `https://nameday.abalin.net/api/V2/getname`
- Purpose: return the nameday match for a submitted name
- Request body:
  - content type: `application/json`
  - required field:
    - `name` - string, minimum length `2`, maximum length `15`
- Confirmed success-response notes from the official docs:
  - returns the shared JSON envelope
  - `data` is documented as an array constrained to a single string item
- Confirmed error responses from the official docs:
  - `400` JSON error with message enum `missing or invalid parameters`
  - `422` validation-error response with `message` and `errors`

## Pagination
- No pagination parameters or cursor/page fields were documented on the reviewed official pages.

## Rate limits
- The reviewed official homepage and official API reference did not publish a numeric rate-limit policy or quota headers.

## Error and response notes
- Successful responses use the shared JSON envelope `success` + `message` + `data`.
- Validation failures use a structured JSON body with top-level `message` and field-level `errors`.
- Route-specific `400` error messages are enumerated on the reviewed docs for invalid timezone and invalid date/parameter cases.

## Important usage notes
- This is a small versioned API under `/api/V2`, not a large multi-family calendar platform.
- The `today` route has an unusual docs/schema mismatch: the path parameter is declared while the prose says it is optional. Treat that route carefully during adapter implementation.
- The official homepage describes the project as a free, open-source international nameday API.

## Verification notes
This file was manually rebuilt from the current official homepage and the current official inline API reference at `nameday.abalin.net/docs/api`. No unofficial mirrors or historical summaries were used.
