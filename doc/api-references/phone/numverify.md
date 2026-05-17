# Numverify

Official docs manually reviewed:
- https://numverify.com/
- https://numverify.com/documentation

## Overview
Numverify documents two REST endpoints: one for phone-number validation/lookup and one for retrieving the supported-country dial-code catalog.

- Base URL: `https://apilayer.net/api`
- Response format: JSON
- Auth: API key passed as query parameter `access_key`
- Coverage note: official docs say support spans `232` countries/territories

## Authentication
The reviewed docs require a personal API access key in the `access_key` query parameter for all requests.

## Confirmed endpoints

| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/validate` | Validate a phone number and return lookup metadata | `access_key`, `number`, optional `country_code`, `format`, `callback` |
| GET | `/countries` | Return supported countries and dialing codes | `access_key` |

The overview page also refers to `/validate` as `/check`, but the reviewed live endpoint reference and request samples consistently use `/validate`, so that is the canonical route documented here.

Manual route count confirmed from the reviewed docs: **2**.

## Endpoint details

### 1) Number validation
Confirmed request pattern from the reviewed endpoint page:

```text
GET https://apilayer.net/api/validate?access_key=YOUR_KEY&number=14158586273
```

Confirmed query parameters:
- `access_key` — required API key
- `number` — required phone number in international or national format
- `country_code` — optional two-letter country code; required when using national format
- `format` — optional integer; `1` prettifies the JSON response for debugging
- `callback` — optional JSONP callback wrapper name

Confirmed response fields from the reviewed docs/example:
- `valid`
- `number`
- `local_format`
- `international_format`
- `country_prefix`
- `country_code`
- `country_name`
- `location`
- `carrier`
- `line_type`

Important usage note explicitly stated in the docs:
- when sending international numbers, do **not** include `country_code`
- when sending national-format numbers, `country_code` is required

### 2) Countries catalog
Confirmed request pattern:

```text
GET https://apilayer.net/api/countries?access_key=YOUR_KEY
```

Confirmed response structure:
- top-level dictionary keyed by country code (for example `US`, `IN`, `GB`)
- each value includes:
  - `country_name`
  - `dialling_code`

## Rate limits
The reviewed documentation pages do not publish a concrete numeric per-second limit in the live endpoint reference.

## Pagination
No pagination is documented.

## Errors
The reviewed endpoint reference exposes these response tabs/statuses:
- `/validate`: `200`, `400`, `403`, `404`
- `/countries`: `200`, `403`

The reviewed pages do not provide a more detailed JSON error schema beyond those status groupings.

## Important usage notes
- `format=1` is documented as a pretty-print/debugging option and is not necessary for production parsers.
- `callback` exists for JSONP/browser integrations.
- `line_type` is specifically highlighted by the docs as useful for choosing voice vs SMS communication flows.

## fireROUTE notes
- Numverify is best modeled as a phone-intelligence lookup provider rather than a simple yes/no validator.
- Preserve `carrier`, `location`, and `line_type` whenever available; they are the most valuable provider-specific enrichments.
