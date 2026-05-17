# Lob.com

Official docs manually reviewed:
- https://lob.com/
- https://docs.lob.com/

## Overview
Lob publishes a broad print-mail platform API, but the official docs also expose a dedicated address-validation family that fits this category well. This manual rewrite focuses on the validation-related routes visibly confirmed in the official Lob API docs.

- Base URL: `https://api.lob.com/v1`
- Transport: HTTPS JSON API
- Auth model: HTTP Basic auth with API key as username and blank password
- Request body content types shown in the reviewed docs: `application/json`, `application/x-www-form-urlencoded`, and/or `multipart/form-data` depending on route
- Core response format: JSON

## Authentication
The reviewed `Authentication` section explicitly states:
- requests are protected with HTTP Basic authentication
- use the API key as the username
- leave the password blank
- invalid or missing auth returns `401`

Official example pattern documented by Lob:

```bash
curl https://api.lob.com/v1/addresses \
  -u YOUR_API_KEY:
```

The docs also distinguish test and live environments. For several validation routes, the official docs explicitly say test API keys validate required fields but return dummy or predetermined responses.

## Confirmed validation endpoints
The following validation-related routes were manually confirmed from the official Lob docs.

| Method | Path | Purpose |
|---|---|---|
| POST | `/us_verifications` | Verify one US or US-territory address |
| POST | `/bulk/us_verifications` | Verify up to 20 US or US-territory addresses in one request |
| POST | `/us_autocompletions` | Return up to 10 US address suggestions from a partial prefix |
| POST | `/us_reverse_geocode_lookups` | Reverse-geocode a US latitude/longitude |
| POST | `/us_zip_lookups` | Return details about a ZIP code |
| POST | `/identity_validation` | Validate whether a name is associated with an address |
| POST | `/intl_verifications` | Verify one non-US international address |
| POST | `/bulk/intl_verifications` | Verify up to 20 non-US international addresses |

Manual route count confirmed from the reviewed official docs: **8**.

## Endpoint details
### `POST /us_verifications`
Purpose: verify a single US or US-territory address.

Confirmed request/body notes:
- supports either component-based input or a single-line address
- docs explicitly say you must not send both formats at once
- body can use city/state or zip-based variants
- confirmed query parameter: `case=upper|proper` (default `upper`)

Confirmed field notes visible in the reviewed docs include:
- `city`
- `state`
- `zip_code`
- `primary_line`
- `secondary_line`
- `recipient`
- `urbanization`

### `POST /bulk/us_verifications`
Purpose: verify multiple US or US-territory addresses.

Confirmed request/body notes:
- JSON/form payload contains `addresses`
- array size documented as `1..20`
- same `case=upper|proper` query parameter is supported

Confirmed response notes:
- returns an `addresses` array of verification results and/or per-item errors
- response includes `errors` boolean

### `POST /us_autocompletions`
Purpose: return candidate US addresses from a partial address prefix.

Confirmed request/body notes:
- `address_prefix` required
- optional `city`
- optional `state`
- optional `zip_code`
- query `case=upper|proper` (default `upper`)
- query `valid_addresses=true|false` (default `false`)

Important official note:
- the endpoint returns **up to 10** suggestions
- not every suggestion is guaranteed valid unless you constrain with `valid_addresses` and/or verify the returned candidates

### `POST /us_reverse_geocode_lookups`
Purpose: reverse-geocode a valid US location.

Confirmed query/body parameters:
- query `size` integer `1..50`, default `5`
- body `latitude` required, range `-90..90`
- body `longitude` required, range `-180..180`

### `POST /us_zip_lookups`
Purpose: return information about a ZIP code.

Confirmed request/body parameter:
- `zip_code` required, 5 digits

Confirmed response fields visible in the reviewed docs include:
- `zip_code`
- `id` (prefixed `us_zip_`)
- `cities`
- `zip_code_type`
- `object` = `us_zip_lookup`

### `POST /identity_validation`
Purpose: validate whether a recipient or company name is associated with an address.

Confirmed request/body notes:
- route accepts either recipient-oriented or company-oriented input
- docs show address variants using either `city` + `state` or `zip_code`
- visible fields include `recipient`, `primary_line`, `secondary_line`, `city`, `state`, `zip_code`, and `urbanization`

### `POST /intl_verifications`
Purpose: verify one international address outside the US and US territories.

Confirmed request/body notes:
- supports component-based or single-line international input
- `primary_line` required in the component example
- `country` required as a 2-letter ISO 3166 code
- official docs explicitly reject US and US-territory destinations on this route

Confirmed header parameter:
- `x-lang-output=native|match`
  - `native`: translate response to the native language of the destination country
  - `match`: match the response language to the request language

### `POST /bulk/intl_verifications`
Purpose: verify multiple non-US international addresses.

Confirmed request/body notes:
- body contains `addresses`
- array size documented as `1..20`
- returns `addresses` results plus `errors` boolean

## Rate limits
The reviewed `Rate Limiting` section explicitly states:
- default rate limit: **150 requests per 5 seconds per endpoint**
- special higher limit for:
  - `POST /v1/us_verifications`
  - `POST /v1/us_autocompletions`
- those two routes have **300 requests per 5 seconds**

The official docs also document these response headers:
- `X-Rate-Limit-Limit`
- `X-Rate-Limit-Remaining`
- `X-Rate-Limit-Reset`

Route-specific response examples in the reviewed docs also show lowercase-style header names such as:
- `ratelimit-limit`
- `ratelimit-remaining`
- `ratelimit-reset`

## Errors
The official `Errors` section documents a normalized error object with:
- `code`
- `status_code`
- `message`

The reviewed docs explicitly summarize these statuses:
- `200 SUCCESS`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `404 NOT FOUND`
- `422 BAD REQUEST`
- `429 TOO MANY REQUESTS`
- `500 SERVER ERROR`

Additional reviewed notes:
- `422` is used for validation/input failures
- `429` is used when endpoint rate limits are exceeded
- some endpoints can return per-item errors inside bulk responses rather than only top-level failures

## Response format notes
The reviewed validation routes return JSON response objects.

Examples of response-shape notes visible in the docs:
- ZIP lookups return a `us_zip_lookup` object
- bulk verification routes return arrays of results under `addresses`
- autocomplete returns suggestion lists, not fully verified deliverability decisions unless you verify downstream

## Important usage notes
- Lob’s docs distinguish test and live API keys; several verification routes return dummy/predetermined results in test mode.
- The category-relevant route family is only a subset of the full Lob platform API.
- `us_verifications` and `intl_verifications` are separate surfaces; the international route explicitly excludes US and territory destinations.
- Bulk verification routes cap the request array at 20 addresses.
- `us_autocompletions` returns suggestions, not guaranteed-final deliverability validation.

## fireROUTE notes
- For address-validation workflows, the most useful normalized surfaces are: single verify, bulk verify, autocomplete, reverse geocode, ZIP lookup, and identity validation.
- Preserve `case` and `valid_addresses` flags because Lob documents them as behavior-changing controls.
- Keep test-vs-live behavior visible to callers, especially when verification responses are being used in automated QA or staging pipelines.
