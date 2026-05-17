# Sunrise and Sunset

## Provider metadata
- Category: `Science & Math`
- Provider slug: `sunrise-and-sunset`
- Official docs/pages used:
  - `https://sunrise-sunset.org/api` (official API documentation page)
- Current public API base URL: `https://api.sunrise-sunset.org`
- Auth model: no authentication; the docs explicitly say there is no need to sign up or get an API key
- Methods officially documented: `GET`
- Response formats officially documented: JSON, JSONP via callback
- Rate-limit notes from the official docs:
  - the API is free of charge
  - no numeric quota is published
  - usage must stay within `reasonable request volume` and must not be excessive or abusive
- Manually confirmed route count: `1`

## Canonical endpoint
1. `GET /json`
   - Official single REST endpoint for sunrise/sunset calculations.
   - Sample requests on the docs page all use `https://api.sunrise-sunset.org/json?...`.

## Query parameters
- `lat` - required latitude in decimal degrees
- `lng` - required longitude in decimal degrees
- `date` - optional date selector; docs say `YYYY-MM-DD` is supported and also allow relative values like `today`
- `formatted` - optional integer `0` or `1`; default is `1`
  - `1` returns human-readable times
  - `0` returns ISO 8601 timestamps and numeric `day_length`
- `callback` - optional JSONP callback function name
- `tzid` - optional timezone identifier such as `UTC`, `Africa/Lagos`, `Asia/Hong_Kong`, or `Europe/Lisbon`

## Response model
- Top-level response is JSON with:
  - `results`
  - `status`
  - `tzid`
- The documented `results` object includes:
  - `sunrise`
  - `sunset`
  - `solar_noon`
  - `day_length`
  - `civil_twilight_begin`
  - `civil_twilight_end`
  - `nautical_twilight_begin`
  - `nautical_twilight_end`
  - `astronomical_twilight_begin`
  - `astronomical_twilight_end`
- When `formatted=0`, the docs show ISO 8601 timestamps and an integer `day_length` value.

## Status and error notes
The docs explicitly list these `status` values in the response body:
- `OK` - request succeeded
- `INVALID_REQUEST` - `lat` or `lng` is missing or invalid
- `INVALID_DATE` - `date` is missing or invalid
- `UNKNOWN_ERROR` - server-side processing failure; docs say retrying may succeed
- `INVALID_TZID` - invalid `tzid`; response is still valid but times are returned in UTC

## Usage notes
- The docs state that time values are returned in `UTC` unless you provide `tzid`.
- JSONP is supported by adding `callback`.
- This is a single-route parameterized API rather than a multi-resource REST surface.
- The API documentation links to a glossary for the astronomical event fields.

## fireROUTE normalization notes
- Normalize this provider as one canonical route: `/json`.
- Preserve `lat`, `lng`, `date`, `formatted`, `callback`, and `tzid` exactly as documented.
- Prefer plain JSON usage and treat JSONP as a compatibility mode.
