# BigDataCloud

## Provider metadata
- Category: `Geocoding`
- Provider slug: `bigdatacloud`
- Official docs used manually:
  - `https://www.bigdatacloud.com/docs`
  - `https://www.bigdatacloud.com/docs/authentication`
  - `https://www.bigdatacloud.com/docs/api-domains`
  - `https://www.bigdatacloud.com/docs/graphql`
  - `https://www.bigdatacloud.com/docs/ip-geolocation`
  - `https://www.bigdatacloud.com/docs/reverse-geocoding`
  - `https://www.bigdatacloud.com/docs/free-api`
  - provider-controlled per-route pages under `https://www.bigdatacloud.com/ip-geolocation/`, `https://www.bigdatacloud.com/reverse-geocoding/`, and `https://www.bigdatacloud.com/free-api/`
- Public API base URLs documented by provider:
  - `https://api-bdc.net` for keyed REST and GraphQL APIs
  - `https://api.bigdatacloud.net` for the free client-side REST endpoints
- Transport: `HTTPS`
- Auth model:
  - keyed REST routes accept query parameter `key`
  - keyed REST routes can also use header `x-bdc-key`
  - GraphQL examples use header `x-bdc-key`
  - free client-side endpoints require no API key
- Response formats documented: `JSON` for REST; `JSON` request/response bodies for GraphQL

## Product and access notes
- The current official docs hub is live and separates relevant geocoding coverage into `IP Geolocation`, `Reverse Geocoding`, and `Free APIs`.
- The `API Domains` page explicitly recommends `api-bdc.net` for keyed APIs and `api.bigdatacloud.net` for free client-side endpoints.
- The same page says domain separation is `not currently enforcing` yet, but BigDataCloud recommends using the correct domain now for future compatibility.
- The `Authentication` page says keyed APIs use monthly volume limits rather than per-second or per-minute throttles.
- The same auth page says `402` is returned when a keyed account exceeds its monthly volume.
- The `GraphQL` page says all packages are also available through package-specific GraphQL endpoints on `POST https://api-bdc.net/graphql/{package-name}`.
- The free reverse-geocode-client page says the endpoint is client-side only and may return `402` with an IP-level ban message when it is used server-side.
- One docs navigation link exposed by the auth page, `https://www.bigdatacloud.com/docs/api/ip-geolocation`, currently resolves to a `404` page, but the package overview pages and the live route pages listed below are working and expose concrete route patterns.

## Confirmed API surface
The inspected official pages confirm these `22` geocoding-related routes:
1. `GET /data/user-agent-info`
2. `GET /data/timezone-info`
3. `GET /data/timezone-by-ip`
4. `GET /data/country-info`
5. `GET /data/country-by-ip`
6. `GET /data/ip-geolocation`
7. `GET /data/ip-geolocation-with-confidence`
8. `GET /data/ip-geolocation-full`
9. `GET /data/asn-info`
10. `GET /data/network-by-ip`
11. `GET /data/hazard-report`
12. `GET /data/user-risk`
13. `GET /data/timezone-by-location`
14. `GET /data/reverse-geocode`
15. `GET /data/reverse-geocode-with-timezone`
16. `GET /data/reverse-geocode-client`
17. `GET /data/am-i-roaming`
18. `GET /data/client-ip`
19. `GET /data/client-info`
20. `POST /graphql/ip-geolocation`
21. `POST /graphql/reverse-geocoding`
22. `POST /graphql/free-api`

## Shared request rules
- Keyed REST routes use host `https://api-bdc.net`.
- Free client-side REST routes use host `https://api.bigdatacloud.net`.
- GraphQL routes use host `https://api-bdc.net` and `POST` requests with JSON bodies.
- Keyed REST auth may be sent either as query parameter `key` or header `x-bdc-key`.
- Free client-side REST routes do not require a key.
- The inspected official pages do not document cursor, token, page-number, or offset pagination for these routes.
- GraphQL docs say every package has its own endpoint; the relevant geocoding package endpoints published in the docs are `graphql/ip-geolocation`, `graphql/reverse-geocoding`, and `graphql/free-api`.

## IP geolocation REST routes

### 1) User Agent Parser API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/user-agent-info`
- Key parameters shown by docs: `userAgentRaw`, `key`
- Notes: parses browser/device/user-agent strings; sample response includes `device`, `os`, `userAgent`, `family`, `versionMajor`, `versionMinor`, `isSpider`, and `isMobile`.

### 2) Time Zone Info API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/timezone-info`
- Key parameters shown by docs: `timeZoneId`, `utcReference`, `key`
- Notes: returns IANA zone data and current/local converted time.

### 3) Time Zone by IP Address API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/timezone-by-ip`
- Key parameters shown by docs: `ip`, `utcReference`, `key`
- Notes: resolves time-zone metadata from an IP address.

### 4) Country Info API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/country-info`
- Key parameters shown by docs: `code`, `localityLanguage`, `key`
- Notes: sample response includes ISO country codes, languages, currency, UN region, World Bank region/income level, and calling code.

### 5) Country by IP Address API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/country-by-ip`
- Key parameters shown by docs: `ip`, `localityLanguage`, `key`
- Notes: returns country-level data derived from an IP address.

### 6) IP Address Geolocation API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/ip-geolocation`
- Key parameters shown by docs: `ip`, `localityLanguage`, `key`
- Notes: sample response includes `country`, `location`, `timeZone`, `localityInfo`, and `network` blocks.

### 7) IP Address Geolocation with Confidence Area API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/ip-geolocation-with-confidence`
- Key parameters shown by docs: `ip`, `localityLanguage`, `key`
- Notes: extends the standard IP geolocation response with `confidence` / confidence-area data.

### 8) IP Address Geolocation with Confidence Area and Hazard Report API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/ip-geolocation-full`
- Key parameters shown by docs: `ip`, `localityLanguage`, `key`
- Notes: extends the geolocation response with `confidence`, `securityThreat`, and embedded `hazardReport` fields.

### 9) ASN Info API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/asn-info`
- Key parameters shown by docs: `asn`, `localityLanguage`, `key`
- Notes: sample response includes `asn`, `organisation`, registry information, prefix totals, and rank.

### 10) Network by IP Address API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/network-by-ip`
- Key parameters shown by docs: `ip`, `localityLanguage`, `key`
- Notes: sample response includes BGP prefix information plus `carriers` and `viaCarriers` arrays.

### 11) Hazard Report API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/hazard-report`
- Key parameters shown by docs: `ip`, `key`
- Notes: sample response includes proxy/VPN/Tor/listing flags, `hostingLikelihood`, `isHostingAsn`, `isCellular`, and `iCloudPrivateRelay`.

### 12) User Risk API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/user-risk`
- Key parameters shown by docs: `ip`, `key`
- Notes: sample response exposes a compact risk decision such as `risk` and `description`.

## Reverse geocoding REST routes

### 13) Time Zone by Location API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/timezone-by-location`
- Key parameters shown by docs: `latitude`, `longitude`, `utcReference`, `key`
- Notes: returns time-zone information for coordinates.

### 14) Reverse Geocoding to City API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/reverse-geocode`
- Key parameters shown by docs: `latitude`, `longitude`, `localityLanguage`, `key`
- Notes: sample response includes `countryName`, `principalSubdivision`, `city`, `locality`, `postcode`, `plusCode`, and `localityInfo`.

### 15) Reverse Geocoding with Timezone API
- Method: `GET`
- Full URL pattern: `https://api-bdc.net/data/reverse-geocode-with-timezone`
- Key parameters shown by docs: `latitude`, `longitude`, `localityLanguage`, `key`
- Notes: combines reverse-geocoding locality data with a `timeZone` block in one call.

## Free client-side REST routes

### 16) FREE Client Side Reverse Geocoding to City API
- Method: `GET`
- Full URL pattern: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- Key parameters shown by docs: `latitude`, `longitude`, `localityLanguage`
- Notes: no key required; the docs say calls may omit coordinates and fall back to IP geolocation; the page also says this route is client-side only and may return `402` for server-side misuse.

### 17) FREE Am I Roaming API
- Method: `GET`
- Full URL pattern: `https://api.bigdatacloud.net/data/am-i-roaming`
- Key parameters shown by docs: `latitude`, `longitude`
- Notes: no key required; returns `isRoaming` by comparing GPS country with IP country.

### 18) FREE Public IP Address API
- Method: `GET`
- Full URL pattern: `https://api.bigdatacloud.net/data/client-ip`
- Key parameters shown by docs: none
- Notes: no key required; sample response includes `ipString`, `ipType`, and optional `proxyIp` when a proxy is detected.

### 19) FREE Client Info API
- Method: `GET`
- Full URL pattern: `https://api.bigdatacloud.net/data/client-info`
- Key parameters shown by docs: none
- Notes: no key required; sample response includes client IP plus parsed user-agent fields such as `device`, `os`, `userAgent`, `family`, `isSpider`, and `isMobile`.

## GraphQL routes

### 20) IP Geolocation GraphQL API
- Method: `POST`
- Full URL pattern: `https://api-bdc.net/graphql/ip-geolocation`
- Auth and payload notes: docs example sends `Content-Type: application/json` and header `x-bdc-key`, with a JSON body containing a GraphQL `query` string.

### 21) Reverse Geocoding GraphQL API
- Method: `POST`
- Full URL pattern: `https://api-bdc.net/graphql/reverse-geocoding`
- Auth and payload notes: documented under the same package-based GraphQL pattern; uses the same API key model.

### 22) Free API GraphQL API
- Method: `POST`
- Full URL pattern: `https://api-bdc.net/graphql/free-api`
- Auth and payload notes: the GraphQL docs include this package in the published endpoint list and say all GraphQL packages use the same API key model.

## Errors, rate limits, pagination, and format notes
- The `Authentication` page explicitly says keyed APIs have monthly volume limits and no per-second or per-minute rate limits.
- The same page explicitly documents these auth-level responses:
  - `401` invalid or missing API key
  - `403` valid key but insufficient permissions for the endpoint
  - `402` monthly volume exceeded
- The route pages add endpoint-specific errors. Across the inspected pages, the published route-level errors include combinations of:
  - `400` bad request
  - `401` invalid coordinates on coordinate-based routes
  - `403` access denied or quota exceeded
  - `404` no valid entry found for the request
  - `405` invalid IP address on IP-based routes
  - `500` internal error / retry later
- The free client-side reverse-geocode route additionally documents `402` when the endpoint is used server-side and the caller IP has been temporarily banned.
- The inspected official pages do not document page-number, cursor, offset, or token pagination for these routes.
- All inspected REST examples are JSON. GraphQL examples use JSON request bodies and return GraphQL JSON responses.

## Canonical fireROUTE notes
- Preserve the provider's documented domain split: keyed REST + GraphQL on `api-bdc.net`, no-key client endpoints on `api.bigdatacloud.net`.
- Preserve both supported keyed auth forms for REST: query `key` and header `x-bdc-key`.
- Preserve the free-endpoint restriction notes exactly: `reverse-geocode-client` is documented as client-side only and may actively ban server-side callers.
- Treat the three GraphQL package endpoints as distinct routes because the docs publish them as separate package-specific endpoints.
- Do not backfill undocumented package endpoints from product-card names alone; only use the concrete route pages and GraphQL endpoint list published in the current official docs.

## Verification notes
- This file was manually rebuilt from live official BigDataCloud docs and provider-controlled route pages using browser tools only.
