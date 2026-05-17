# IPGEO

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipgeo`
- Official pages checked manually:
  - `https://api.techniknews.net/ipgeo`
  - `https://api.techniknews.net/ipgeo/8.8.8.8`
  - `https://api.techniknews.net/ipgeo/not-an-ip`
- Public base URL confirmed from the live service: `https://api.techniknews.net/ipgeo`
- Transport: HTTPS
- Auth model: no authentication or API key was visible on the inspected official surface
- Response format: JSON

## Product and access notes
- The official surface currently behaves as a direct JSON API endpoint rather than a separate marketing/docs site.
- Visiting the base path without a supplied IP immediately returns JSON for the caller IP.
- Visiting the path with an explicit IP returns JSON for that requested IP.

## Confirmed API surface
The inspected official endpoint confirms `2` request patterns:
1. `GET /ipgeo`
2. `GET /ipgeo/{ip}`

## 1) Caller-IP lookup
- Method: `GET`
- Path: `/ipgeo`
- Full URL: `https://api.techniknews.net/ipgeo`
- Purpose: return geolocation data for the IP address making the request

Observed response fields on the live official endpoint:
- `status`
- `continent`
- `country`, `countryCode`
- `regionName`, `city`, `zip`
- `lat`, `lon`
- `timezone`, `currency`
- `isp`, `org`, `as`
- `reverse`
- `mobile`, `proxy`, `hosting`
- `ip`
- `cached`

## 2) Explicit IP lookup
- Method: `GET`
- Path pattern: `/ipgeo/{ip}`
- Full URL pattern: `https://api.techniknews.net/ipgeo/{ip}`
- Purpose: return geolocation data for a supplied IPv4 or IPv6 address

Observed behavior from the live official endpoint:
- `https://api.techniknews.net/ipgeo/8.8.8.8` returned a successful JSON record
- the successful response also exposed `cacheTimestamp` when the result was cached
- reverse DNS can appear in `reverse` when available

Observed invalid-input behavior:
- `https://api.techniknews.net/ipgeo/not-an-ip` returned the JSON body `{"error":"invalid ip"}`

## Auth, rate limits, pagination, and errors
- No API key, bearer token, or other auth mechanism was documented or visible on the inspected official surface.
- No numeric rate-limit policy was published on the inspected official surface.
- No pagination model is documented or implied; each request returns one lookup result.
- The only explicitly observed error payload in this pass was `{"error":"invalid ip"}` for an invalid path argument.

## Response-format notes
- Responses are JSON objects rendered directly by the endpoint.
- No alternate output formats such as XML, CSV, or JSONP were visible on the inspected official surface.

## Important usage notes
- Omitting the path IP changes the service into a caller-IP lookup.
- The live endpoint exposes cache state through `cached`, and cached records may additionally include `cacheTimestamp`.
- The provider surface inspected in this pass is extremely small and endpoint-driven; no broader route catalog was exposed.

## Canonical fireROUTE notes
- Canonical base URL: `https://api.techniknews.net/ipgeo`
- Canonical route families:
  - `GET /ipgeo`
  - `GET /ipgeo/{ip}`
- Preserve `cached`/`cacheTimestamp` because they materially describe freshness.

## Verification notes
- This file was manually rebuilt from live requests against the provider's official endpoint using browser tools.
