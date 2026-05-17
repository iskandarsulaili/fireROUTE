# IP2Proxy

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip2proxy`
- Official docs used manually:
  - `https://www.ip2location.com/web-service/ip2proxy`
- Public base URL documented by provider: `https://api.ip2proxy.com/`
- Transport: provider docs say both `HTTP GET` and `HTTPS GET` are supported
- Auth model: API key in query parameter `key`
- Response formats documented: `json`, `xml`

## Product and access notes
- The official page says the IP2Proxy Web Service is no longer accepting new registrations and directs new users to `ip2location.io`.
- The product is described as a hosted proxy/VPN/Tor/residential-proxy detection API that also returns IP location information when a proxy is detected.
- The page says each purchased package unit includes `10,000` query credits for up to `1 year`.

## Confirmed API surface
The inspected official page documents `1` public request pattern:
- `GET /`

## 1) Proxy and IP-risk lookup
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://api.ip2proxy.com/?ip={IP_ADDRESS}&key={YOUR_API_KEY}&package={PX1|PX2|...|PX11}&format={json|xml}`
- Purpose: detect anonymous proxy/VPN/Tor/residential-proxy usage for an IP address and return related geographic/network metadata

Documented query parameters:
- `key` - required API key
- `ip` - optional IPv4 or IPv6 address; if omitted, the docs say the server IP address is used for lookup
- `package` - optional package tier; defaults to `PX1` when omitted, with valid values `PX1` through `PX11`
- `format` - optional response format; `json` or `xml`, with `json` used by default

Documented response fields visible on the official page include:
- `proxyType`
- `countryCode`
- `countryName`
- `regionName`
- `cityName`
- `isp`
- `domain`
- `usageType`
- `asn`
- `as`
- `lastSeen`
- `threat`
- `provider`
- `creditsConsumed`

Important classification notes shown on the page:
- the provider lists proxy-type classes such as `VPN`, `TOR`, `DCH`, and `PUB`
- the page also documents `usageType` categories such as commercial, organization, government, military, education, CDN, ISP, mobile ISP, and data-center hosting categories

## Pagination, errors, and rate limits
- No pagination model is documented on the inspected official page.
- The page says successful requests return HTTP `200` with proxy lookup data.
- The page says an error code is returned if an error occurs, but the visible browser capture did not expose a detailed error-code table.
- The visible commercial limit is credit-based (`10,000` credits per purchased unit, valid for `1 year`), not a published rate-per-second table.

## Canonical fireROUTE notes
- The API is query-driven on the root path, so fireROUTE should preserve provider query parameters rather than assuming path-based resources.
- `package` determines how much proxy/network enrichment is returned and should be treated as part of the contract, not a cosmetic option.
- Omitting `ip` changes the request into a caller/server-IP lookup mode without changing the path.
- The official page positions this web service as legacy for new registrations, which should be noted for long-term adapter planning.

## Verification notes
- This file was manually rebuilt from the live official IP2Proxy web-service page using browser tools.