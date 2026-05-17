# IP Address Details

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip-address-details`
- Official docs used manually:
  - `https://ipinfo.io/developers`
- Public base URLs documented by provider:
  - `https://api.ipinfo.io/lite`
  - `https://api.ipinfo.io/lookup`
- Transport: HTTPS
- Auth model: API token supplied as HTTP Basic Auth username, `Authorization: Bearer YOUR_TOKEN`, or query parameter `token`
- Response formats documented: JSON by default; scalar field filters can return plaintext; JSONP is supported with `callback`

## Product and access notes
- The official developer resource describes IPinfo Lite as the free tier and says it returns country and ASN information without quota restrictions.
- The same page documents the newer `api.ipinfo.io` host and identifies `lite` and `lookup` as the relevant endpoint families.
- The docs also publish explicit `v4.api.ipinfo.io` and `v6.api.ipinfo.io` host variants for forcing IPv4-only or IPv6-only connectivity.

## Confirmed API surface
The inspected official developer page explicitly exposes these `4` route patterns:
1. `GET /lite/me`
2. `GET /lite/{ip}`
3. `GET /lite/{ip}/{field_filter}`
4. `GET /lookup/{ip}`

## 1) Lite caller-IP lookup
- Method: `GET`
- Path: `/lite/me`
- Full URL pattern: `https://api.ipinfo.io/lite/me?token=YOUR_TOKEN`
- Purpose: return IPinfo Lite details for the requester's own IP address

Documented auth options:
- query parameter `token`
- HTTP Basic Auth username set to the token
- Bearer token in the `Authorization` header

Documented output notes:
- JSON is the normal response shape
- the caller IP is included in the response when `me` is used

## 2) Lite explicit IP lookup
- Method: `GET`
- Path pattern: `/lite/{ip}`
- Full URL pattern: `https://api.ipinfo.io/lite/{ip}?token=YOUR_TOKEN`
- Purpose: look up a specific IPv4 or IPv6 address with the Lite dataset

Documented path parameter:
- `{ip}` - IPv4 or IPv6 address

Documented examples on the official page include:
- `https://api.ipinfo.io/lite/8.8.8.8?token=YOUR_TOKEN`
- `https://api.ipinfo.io/lite/2001:4860:4860::8888?token=YOUR_TOKEN`

## 3) Lite field-filter lookup
- Method: `GET`
- Path pattern: `/lite/{ip}/{field_filter}`
- Full URL pattern: `https://api.ipinfo.io/lite/{ip}/{field_filter}?token=YOUR_TOKEN`
- Purpose: return a single filtered field or object from a Lite lookup

Field-filter behavior documented on the official page:
- adding a field name to the URL filters the response
- scalar fields are returned as plaintext
- object fields are returned as JSON

Official field-filter examples shown:
- `/country`
- `/asn`
- `/country_code`

## 4) Lookup IP lookup
- Method: `GET`
- Path pattern: `/lookup/{ip}`
- Full URL pattern: `https://api.ipinfo.io/lookup/{ip}?token=YOUR_TOKEN`
- Purpose: perform a paid `lookup` endpoint request on a specific IP address

Official example shown:
- `https://api.ipinfo.io/lookup/8.8.8.8?token=YOUR_TOKEN`

Important note from the official URL-structure section:
- the IP address component is described as optional in the generic API structure, but the inspected page only showed an explicit `lookup/{ip}` example, so that is the conservative confirmed route recorded here

## Rate limits, errors, pagination, and format notes
Rate-limit notes published on the official developer page:
- IPinfo Lite offers `unlimited` access
- paid plans use monthly request limits
- going over plan limits returns HTTP `429`
- the page explicitly says there are no daily caps, hourly caps, concurrent-request limits, or paid-plan per-second throttles

Pagination notes:
- No page-number, cursor, offset, or token-based pagination model is documented.
- The API is lookup-oriented rather than collection-oriented.

Additional response-format notes:
- JSONP is supported with `callback`
- the official page explicitly says CORS is supported for client-side use

## Important usage notes
- IPinfo uses one host family with different endpoint namespaces (`lite` vs `lookup`) rather than separate products on separate domains.
- Authentication can be passed three different ways, so fireROUTE adapters should choose one canonical mode and keep the others as compatibility notes.
- The official docs also expose `v4.api.ipinfo.io` and `v6.api.ipinfo.io` host variants for forcing network-stack selection; these are host variants rather than separate logical API routes.

## Canonical fireROUTE notes
- Canonical base URLs:
  - `https://api.ipinfo.io/lite`
  - `https://api.ipinfo.io/lookup`
- Canonical route families:
  - `GET /lite/me`
  - `GET /lite/{ip}`
  - `GET /lite/{ip}/{field_filter}`
  - `GET /lookup/{ip}`
- Preserve field-filter behavior because it changes both payload size and response encoding.

## Verification notes
- This file was manually rebuilt from the live official IPinfo developer resource using browser tools.
