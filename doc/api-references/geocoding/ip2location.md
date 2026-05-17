# IP2Location

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip2location`
- Official docs used manually:
  - `https://www.ip2location.com/web-service/ip2location`
- Public base URL documented by provider: `https://api.ip2location.com/v2/`
- Transport: provider docs say both `HTTP GET` and `HTTPS GET` are supported; examples use HTTPS
- Auth model: API key in query parameter `key`
- Response formats documented: `json`, `xml`

## Product and access notes
- The official page now warns that IP2Location Web Service is no longer accepting new registrations and directs new users to `ip2location.io` instead.
- The page describes this product as a hosted reverse IP geolocation lookup service covering country, region/state, city, latitude, longitude, ZIP/postal code, timezone, ISP/company, domain, net speed, area code, weather station data, MCC/MNC/carrier, elevation, usage type, address type, and IAB category.
- The docs say each purchased package unit includes `100,000` query credits for up to `1 year` and that multiple units increase the same account's credit balance rather than issuing separate API keys.

## Confirmed API surface
The inspected official page documents `2` request modes on the same REST endpoint family under `https://api.ip2location.com/v2/`:
1. `GET /v2/` for IP geolocation lookup
2. `GET /v2/` with `check=1` for remaining-credit checks

## 1) IP geolocation lookup
- Method: `GET`
- Path: `/v2/`
- Full URL pattern: `https://api.ip2location.com/v2/?ip={IP_ADDRESS}&key=<key>&package={WS1|WS2|...|WS25}`
- Purpose: reverse IP geolocation lookup for IPv4 or IPv6 addresses

Documented required query parameters:
- `key` - API key
- `ip` - IPv4 or IPv6 address for lookup; the docs say if `ip` is omitted, the server IP address is used
- `package` - response package tier; valid values shown are `WS1` through `WS25`

Documented optional query parameters visible on the official page:
- `format` - `json` or `xml`; defaults to `json`
- `addon` - extra enrichment modules; visible values include `continent`, `country`, `region`, `city`, `geotargeting`, `country_groupings`, and `time_zone_info`
- `lang` - localization/translation control shown in official examples such as `zh-cn`

Examples shown by the provider include:
- IPv4 lookup: `https://api.ip2location.com/v2/?ip=142.113.220.31&addon=continent&lang=zh-cn&key=<key>`
- IPv6 lookup: `https://api.ip2location.com/v2/?ip=2607:f8b0:4001:c02::93&addon=continent&lang=zh-cn&key=<key>`

Documented response-content notes from the provider description:
- base geolocation output can include ISO3166 country code, region/state, city, latitude, longitude, ZIP/postal code, and timezone
- depending on package/add-ons, output can also include ISP/company, domain, net speed, weather station information, MCC/MNC/carrier, elevation, usage type, address type, and IAB category

## 2) Remaining-credit check
- Method: `GET`
- Path: `/v2/`
- Full URL pattern: `https://api.ip2location.com/v2/?key=<key>&check=1`
- Purpose: return the remaining credit balance for the current API key

Documented query parameters:
- `key` - API key
- `check` - set to `1` to switch from lookup mode to credit-balance mode

Official example:
- `https://api.ip2location.com/v2/?key=<key>&check=1`

## Pagination, errors, and rate limits
- No pagination model is documented on the inspected official page.
- The page says all successful HTTP or HTTPS requests return HTTP `200` together with lookup information.
- The page says an error code is returned when an error occurs, but the inspected page did not expose a detailed error catalog in the captured browser view.
- The visible usage model is credit-based (`100,000` credits per purchased unit, valid for `1 year`), not a published per-second or per-minute throttle table.

## Canonical fireROUTE notes
- Treat lookup and credit-balance checks as distinct request modes even though both use the same `/v2/` path.
- `package` materially changes response shape and field coverage; callers may need raw passthrough access if fireROUTE only normalizes a subset.
- The docs explicitly allow missing `ip`, which changes the operation from arbitrary-IP lookup to requester/server-IP lookup.
- The product is effectively legacy for new customers, so long-term integrations should note the provider's migration message toward `ip2location.io`.

## Verification notes
- This file was manually rebuilt from the live official IP2Location web-service page using browser tools.
