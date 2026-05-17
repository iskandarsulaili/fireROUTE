# Country

## Provider metadata
- Category: `Geocoding`
- Provider slug: `country`
- Official docs used manually:
  - `https://country.is/`
  - `https://api.country.is/openapi.json` (linked from the official site as the machine-readable OpenAPI spec)
- Public API base URL: `https://api.country.is`
- Transport: HTTPS
- Auth model: none
- Response format: JSON

## Service notes
- The official site describes Country as a free IP-to-country geolocation API.
- The service can also return extra geolocation and network metadata beyond the default country lookup.
- The site states the data refreshes every `24 hours`.
- The provider says the API is open source and can be self-hosted.

## Rate limits / usage notes
Official FAQ text on the provider site says:
- no quotas are imposed for normal use
- infrastructure rate limiting is `10 requests per second per IP` to prevent abuse
- no API key is required
- for high-volume server-side use, the provider recommends self-hosting or querying MaxMind data directly

## Confirmed API surface
The official site documents these public operations:
- `GET /`
- `GET /{ip}`
- `POST /`
- `GET /info`

All lookup routes also support the `fields` query modifier.

## Common query parameter
- `fields` - optional comma-separated extra fields to include in any lookup response; documented values are `city`, `continent`, `subdivision`, `postal`, `location`, `asn`

## 1) Lookup caller IP
- Method: `GET`
- Path: `/`
- Full URL: `https://api.country.is/`
- Purpose: return the country for the caller's IP address

Documented default response example:
- `ip`
- `country`

Example shown by provider:
```json
{
  "ip": "2001:e68:544c:486:1618:77ff:fe34:f85b",
  "country": "MY"
}
```

## 2) Lookup a specific IP address
- Method: `GET`
- Path pattern: `/{ip}`
- Full URL pattern: `https://api.country.is/{ip}`
- Purpose: return country data for a specific IPv4 or IPv6 address

Path parameter:
- `ip` - required IP address to resolve

Documented behavior:
- accepts both IPv4 and IPv6 addresses
- the response shape matches the caller-IP lookup unless extra `fields` are requested

Example shown by provider:
```json
{
  "ip": "77.1.2.3",
  "country": "DE"
}
```

## 3) Bulk IP lookup
- Method: `POST`
- Path: `/`
- Full URL: `https://api.country.is/`
- Purpose: resolve multiple IP addresses in one request

Request body:
- JSON array of IP address strings
- official site says up to `100` addresses per request

Example request body from the site:
```json
["77.1.2.3", "93.184.216.34"]
```

Documented response notes:
- returns a JSON array
- each array item contains lookup results for the corresponding IP

Example result shape:
- `ip`
- `country`

## 4) Service metadata
- Method: `GET`
- Path: `/info`
- Full URL: `https://api.country.is/info`
- Purpose: return service/version metadata and data-refresh information

Documented response fields:
- `version`
- `dataSources`
- `lastUpdated`

Official notes:
- the site says data refreshes every `24 hours`
- example `dataSources` values are `maxmind` and `cloudflare`

## Extra field behavior
The provider documents `?fields=` as an add-on to lookup routes.

Officially documented extra fields:
- `city`
- `continent`
- `subdivision`
- `postal`
- `location`
- `asn`

Documented expanded response example includes:
- `city`
- `continent`
- `subdivision`
- `postal`
- `location.latitude`
- `location.longitude`
- `location.accuracy_radius`
- `location.time_zone`
- `asn.number`
- `asn.organization`

Example pattern shown by provider:
- `GET https://api.country.is/77.1.2.3?fields=city,continent,subdivision,postal,location,asn`

## Errors
The official site explicitly lists these HTTP error conditions:
- `400` - invalid IP address or malformed request
- `404` - no data found for the given IP
- `429` - rate limit exceeded; try again shortly

## Pagination / batching
- No pagination model is documented.
- Bulk lookup is handled with a POST body array instead of paginated list endpoints.

## Data provenance / privacy notes
Official FAQ notes from the provider site:
- data comes from `MaxMind GeoLite2`, updated daily
- `Cloudflare` geolocation is used when available
- the provider says it does **not** log requests

## Canonical fireROUTE notes
- This is a lightweight IP lookup API with one root lookup route exposed in both single-request and bulk POST forms.
- `fields` is the main capability-expansion control and materially changes response shape.
- The service is unauthenticated but still rate-limited by IP at `10 rps`.
- `/info` is operational metadata, not a lookup route.

## Verification notes
This file was manually rebuilt from the official Country website and its linked OpenAPI specification using browser tools.