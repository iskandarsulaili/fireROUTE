# US Autocomplete

Official docs manually reviewed:
- https://www.smarty.com/docs/apis/us-autocomplete-pro-api/reference

## Overview
Smarty’s US Autocomplete Pro API returns USPS-verified address suggestions for partially typed US addresses.

Confirmed from the reviewed official docs:
- Base URL: `https://us-autocomplete-pro.api.smarty.com`
- Canonical path: `/lookup`
- Supported methods: `GET` and `OPTIONS`
- Embedded-key authentication is used for this API

## Authentication
The reviewed official docs show embedded-key authentication on the query string:

```text
https://us-autocomplete-pro.api.smarty.com/lookup?key=YOUR_EMBEDDED_KEY_HERE
```

Important auth/usage notes confirmed on the official page:
- embedded key parameter name: `key`
- the docs expect browser-style usage and mention the `referer` header
- a `401` can occur if the host in the `referer` header does not match a host assigned to the embedded key
- when using embedded-key authentication, only `GET` is allowed

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/lookup` | Return USPS-verified address suggestions from a partially typed input |

Manual route count confirmed from the official docs: **1**.

## Query parameters
The reviewed official parameter table/documentation exposes these parameters for `GET /lookup`:

| Parameter | Notes |
|---|---|
| `key` | Embedded API key |
| `search` | Required partial address text; max 32 characters |
| `max_results` | Maximum number of suggestions; range `1..10`, default `10` |
| `include_only_cities` | Restrict results to listed city/state combinations |
| `include_only_states` | Restrict results to listed states |
| `include_only_zip_codes` | Restrict results to listed ZIP codes |
| `exclude_states` | Exclude listed states |
| `prefer_cities` | Prefer listed city/state combinations at top of results |
| `prefer_states` | Prefer listed states at top of results |
| `prefer_zip_codes` | Prefer listed ZIP codes at top of results |
| `prefer_ratio` | Percentage of preferred suggestions shown first; range `0..100`, default `100` |
| `prefer_geolocation` | Geolocation preference; docs describe `city`, `none`, or omitted/default behavior |
| `selected` | Request secondary suggestions for a selected address |
| `source` | `postal` or `all`; includes alternate sources when requested |

The docs also describe interaction rules between the filtering/preference parameters, especially around ZIP-code filters and geolocation preference.

## Endpoint details

### `GET /lookup`
Confirmed URL composition from the official docs:
- scheme: `https`
- host: `us-autocomplete-pro.api.smarty.com`
- path: `/lookup`

Confirmed example request pattern:

```text
https://us-autocomplete-pro.api.smarty.com/lookup?key=YOUR_EMBEDDED_KEY_HERE
```

Confirmed example with filters/preferences:

```bash
curl 'https://us-autocomplete-pro.api.smarty.com/lookup?key=YOUR_EMBEDDED_KEY_HERE&search=123+mai&include_only_cities=chicago%2Cil&include_only_states=mi&prefer_states=il' \
  -H 'referer: https://myneatwebsite.com'
```

Confirmed response behavior on success:
- HTTP `200`
- JSON object containing a `suggestions` array
- suggestion components documented on the page include:
  - `street_line`
  - `secondary`
  - `city`
  - `state`
  - `zipcode`
  - `entries`
  - `source` (only when the `source` parameter is used)

## Rate limits
The reviewed official docs do not publish a fixed numeric quota table, but they do explicitly document `429 Too many requests` behavior.

Confirmed `429` reasons from the page:
- too many requests from a given source in a short period when using a public embedded key
- exceeding the plan’s rate limit

## Pagination
No pagination scheme is documented. The API returns bounded suggestion lists controlled by `max_results`.

## Errors
The reviewed official docs publish these response codes for this endpoint:
- `200` — success, response body contains a `suggestions` array
- `400` — malformed request
- `401` — invalid embedded key or referer/host mismatch
- `402` — no active subscription for the account
- `422` — unsuitable parameters; response describes what to correct
- `429` — too many requests / rate limit exceeded

## Response format
Confirmed from the official docs:
- success responses are JSON
- the response body should be parsed only for `200` responses
- the API is designed around suggestion lists rather than paginated resources

## Important usage notes
- Non-secure HTTP is not supported.
- The docs recommend URL-encoding all query parameter values.
- If requests are proxied and geolocation preference is used, the docs say to set `X-Forwarded-For` to the user’s IP address.
- The official docs emphasize that this API returns fully verified USPS suggestions, not just loose text matches.

## fireROUTE notes
- Expose this as a single GET autocomplete endpoint with rich passthrough query support.
- Do not over-normalize the filter/preference parameters; they encode important Smarty-specific behavior.
- Treat `max_results` as the result-window control instead of inventing pagination.
