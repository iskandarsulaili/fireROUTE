# ipstack

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipstack-2`
- Official docs used manually:
  - `https://ipstack.com/`
  - `https://ipstack.com/documentation`
  - `https://docs.apilayer.com/ipstack/docs/ipstack-api-v-1-0-0`
- Public base URL documented by provider: `https://api.ipstack.com`
- Transport: HTTPS
- Auth model: API key in query parameter `access_key`
- Response formats documented: `json`, `xml`; JSONP is also documented via `callback`

## Product / plan notes
- The inspected official docs describe IPstack as a real-time IP geolocation API with optional security enrichment.
- The homepage advertises a free tier and paid plans, but the inspected pages did not expose a numeric per-minute or per-day rate-limit table.
- The homepage explicitly advertises `256-bit SSL encryption` and positions the product as a hosted commercial API.

## Confirmed API surface
The official API endpoints page exposes these distinct GET operations:
- `GET /{ip_address}`
- `GET /check`
- `GET /{ip_addresses}`

## 1) Standard lookup
- Method: `GET`
- Path pattern: `/{ip_address}`
- Full URL pattern: `https://api.ipstack.com/{ip_address}?access_key=<key>`
- Purpose: look up a single IPv4 address, IPv6 address, or domain

Path parameter:
- `ip_address` - required single IP address or domain to look up

Documented query parameters:
- `access_key` - required API key
- `fields` - optional comma-separated field selector to reduce payload size
- `hostname` - optional `0` or `1`; include resolved hostname
- `security` - optional `0` or `1`; include security/proxy/crawler/Tor/threat information
- `language` - optional 2-letter language code for localized names
- `output` - optional `json` or `xml`
- `callback` - optional JSONP callback name

Representative response fields visible in the official schema:
- top-level: `ip`, `hostname`, `type`, `continent_code`, `continent_name`, `country_code`, `country_name`, `region_code`, `region_name`, `city`, `zip`, `latitude`, `longitude`
- nested `location`: `geoname_id`, `capital`, `calling_code`, `is_eu`, `country_flag`, `country_flag_emoji`, `languages`
- nested `time_zone`: `id`, `current_time`, `gmt_offset`, `code`, `is_daylight_saving`
- nested `currency`: `code`, `name`, `plural`, `symbol`, `symbol_native`
- nested `connection`: `asn`, `isp`, `sld`, `tld`, `carrier`, `home`, `organization_type`, `isic_code`, `naics_code`
- nested `security`: proxy/crawler/Tor/threat-related flags and descriptors

## 2) Requester IP lookup
- Method: `GET`
- Path: `/check`
- Full URL pattern: `https://api.ipstack.com/check?access_key=<key>`
- Purpose: return geolocation/intelligence for the IP making the API request

Documented query parameters:
- `access_key` - required API key
- `fields`
- `hostname` - `0` or `1`
- `security` - `0` or `1`
- `language`
- `output` - `json` or `xml`
- `callback`

Usage note from the official description:
- this endpoint is specifically described as detecting the IP address the current API request is coming from

## 3) Bulk lookup
- Method: `GET`
- Path pattern: `/{ip_addresses}`
- Full URL pattern: `https://api.ipstack.com/{ip1},{ip2},...?...`
- Purpose: return IP geolocation data for multiple IP addresses in one request

Path parameter:
- `ip_addresses` - required comma-separated list of IPs

Documented bulk limit:
- up to `50` IP addresses in one request

Documented query parameters:
- `access_key` - required API key
- `fields`
- `hostname` - `0` or `1`
- `security` - `0` or `1`
- `language`
- `output` - `json` or `xml`
- `callback`

Response note:
- the operation is documented as a bulk variant of the same IP intelligence lookup and returns per-IP records rather than a single object

## Pagination, errors, and rate limits
- No pagination model is documented on the inspected endpoints page.
- The visible OpenAPI content exposed response schemas for successful lookups but did not surface a detailed error-code table in the inspected browser session.
- No explicit numeric rate-limit policy was visible on the inspected official docs pages.

## Canonical fireROUTE notes
- Auth is query-string based (`access_key`), not header-based in the inspected official docs.
- `/check` is a distinct operation and should not be collapsed into the generic single-IP route.
- The bulk lookup route is path-based and uses comma-separated IPs rather than POST bodies.
- `security=1` materially changes response shape by adding risk/intelligence fields.

## Verification notes
- This file was manually rebuilt from the live official IPstack site and the official APILayer-hosted endpoints page using browser tools.