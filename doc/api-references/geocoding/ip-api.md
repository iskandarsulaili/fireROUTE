# ip-api

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip-api`
- Official docs used manually:
  - `https://ip-api.com/docs`
  - `https://ip-api.com/docs/api:json`
  - `https://ip-api.com/docs/api:batch`
  - `https://ip-api.com/docs/dns`
- Public base URLs documented by provider:
  - `http://ip-api.com/json`
  - `http://ip-api.com/batch`
  - `http://edns.ip-api.com/json`
- Transport on the inspected free endpoints: HTTP only
- Auth model: no API key for the documented free endpoints
- Response formats documented: `json`, `xml`, `csv`, `newline`, `php` for single-IP lookups; JSON for batch; JSON/JSONP for DNS endpoint

## Commercial / transport notes
- The free geolocation API docs explicitly state that `256-bit SSL encryption is not available for this free API`.
- The docs link to the paid/pro service for SSL, unlimited queries, and commercial use.
- The DNS endpoint page separately states that commercial use is not allowed on that endpoint.

## Rate limits and headers
From the official JSON endpoint docs:
- the free endpoint is limited to `45 requests per minute` per source IP
- exceeding the limit returns HTTP `429`
- repeated overruns can cause the source IP to be banned for `1 hour`
- response headers include:
  - `X-Rl` - requests remaining in the current rate-limit window
  - `X-Ttl` - seconds until the rate-limit window resets

The DNS endpoint page did not publish a separate numeric limit in the inspected content.

## Confirmed API surface
The official docs site exposes these distinct API operations:
- `GET /json/{query}`
- `POST /batch`
- `GET /json` on the `edns.ip-api.com` DNS host

## 1) Single-IP/domain geolocation
- Method: `GET`
- Path pattern: `/json/{query}`
- Full URL pattern: `http://ip-api.com/json/{query}`
- Purpose: geolocate a single IPv4, IPv6, or domain name

Path parameter:
- `query` - optional IPv4/IPv6 address or domain name; if omitted, the current caller IP is used

Documented query parameters:
- `fields` - optional response-field selector; accepts a comma-separated field list or the generated numeric bitmask value
- `lang` - optional localization language for `city`, `regionName`, and `country`
- `callback` - optional JSONP callback wrapper

Documented language values on the page include:
- `en`
- `de`
- `es`
- `pt-BR`
- `fr`
- `ja`
- `zh-CN`
- `ru`

Documented response/error notes:
- response includes `status`, which is `success` or `fail`
- failed responses include `message`
- documented fail reasons include `private range`, `reserved range`, and `invalid query`

Representative response fields listed in the docs include:
- `status`
- `message`
- `continent`, `continentCode`
- `country`, `countryCode`
- `region`, `regionName`, `city`, `district`, `zip`
- `lat`, `lon`
- `timezone`, `offset`, `currency`
- `isp`, `org`, `as`, `asname`, `reverse`
- `mobile`, `proxy`, `hosting`
- `query`

## 2) Batch geolocation
- Method: `POST`
- Path: `/batch`
- Full URL: `http://ip-api.com/batch`
- Purpose: geolocate multiple IPs in a single HTTP request

Authentication note:
- the docs again state that no API key is required

Query parameters:
- `fields` - optional default field selector for all items
- `lang` - optional default localization language for all items

Documented request body shapes:
- a JSON array of plain IP strings, for example `[
  "208.80.152.201",
  "91.198.174.192"
]`
- or a JSON array of objects with:
  - `query` - required IP address
  - `fields` - optional per-item field selector overriding GET defaults
  - `lang` - optional per-item language overriding GET defaults

Batch limits and validation notes:
- only `POST` is accepted
- up to `100` IP addresses/objects per request
- requests above that return HTTP `422 Unprocessable Entity`

Response notes:
- returns a JSON array
- each element follows the same success/fail field model as the single lookup route

## 3) Client subnet / DNS lookup
- Method: `GET`
- Path: `/json` on the DNS API host
- Full URL patterns:
  - `http://[32-random-alphanumeric-chars].edns.ip-api.com/json`
  - `http://edns.ip-api.com/json` (automatic redirect form, documented as slower)
- Purpose: return DNS resolver information and, when available, EDNS client subnet geolocation

Documented query parameter:
- `callback` - optional JSONP callback name

Documented response structure:
- `dns.ip` - DNS server IP seen by the service
- `dns.geo` - geolocation text for the DNS server
- `edns.ip` - client subnet IP, when provided by the DNS resolver
- `edns.geo` - geolocation text for the client subnet, when available

Important provider notes:
- requests should be made from the client browser; sending them from a server will return data for that server’s DNS environment instead
- if the DNS server does not send EDNS client subnet, the `edns` object may be absent
- results are cached for `60 seconds` from the time of the DNS query
- the provider states it is whitelisted for EDNS client subnet with Google Public DNS and OpenDNS

## Operational / usage notes
- The free documented API surface is centered on HTTP, not HTTPS.
- `fields` is a significant optimization lever because it can drastically reduce payload size on both single and batch lookups.
- `reverse` DNS is documented as a field that can delay responses.
- The DNS endpoint is a separate capability from the normal geolocation endpoint and should not be treated as a normal IP-to-location lookup.

## Canonical fireROUTE notes
- This provider actually exposes three different lookup modes, not just one route.
- Batch lookup is a first-class POST API and should be preserved separately from single-item resolution.
- Free-tier rate limiting is explicit and should be respected via `X-Rl`/`X-Ttl` headers.
- The DNS endpoint has different semantics, no HTTPS on the inspected free docs, and a non-commercial-use restriction.

## Verification notes
This file was manually rebuilt from the live official ip-api documentation pages using browser tools.