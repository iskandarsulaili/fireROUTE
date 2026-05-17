# District of Columbia Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `district-of-columbia-open-data`
- Official docs/pages used:
  - `https://opendata.dc.gov/pages/using-apis` (official Open Data DC page; now JS-rendered and links users onward to current developer resources)
  - `https://developers.data.dc.gov/` (official Data Developers Portal home for MAR 2 API)
  - `https://developers.data.dc.gov/` → `API Reference` view (official Swagger/OpenAPI UI for MAR 2 API)
  - `https://datagate.dc.gov/mar/open/swagger/v2.2/swagger.json` (official OpenAPI document linked from the portal UI)
- Current public API base URL: `https://datagate.dc.gov/mar/open`
- Auth model: API key required; the official portal describes MAR 2 as an API-key-based service and exposes an `Authorize` control in the API reference
- Response format: the reviewed official portal is an OpenAPI/Swagger reference for a .NET geocoding service and documents JSON-oriented request/response workflows
- Rate limits: no public numeric rate-limit policy was exposed on the reviewed official pages
- Manually confirmed route count: `33`

## Access notes
- The original assigned docs URL now acts as an Open Data DC shell page rather than a static API guide, but it still links to the current official developer resources.
- The current public API documented by the District is the `MAR 2 API`, a geocoding and address-search service for the District's Master Address Repository.
- The reviewed portal labels the currently documented version as `2.2` and publishes an OpenAPI 3 reference.

## Canonical endpoints
### Autocomplete
1. `GET /api/v2.2/autocomplete/{address}`
2. `POST /api/v2.2/autocomplete/{address}`
3. `POST /api/v2.2/autocomplete`

### Batch geocoding
4. `GET /api/v2.2/locationbatch/{address_base64}/{address_separator}/{chunkSequnce_separator}/{parallel}`
5. `GET /api/v2.2/locationbatch/{address_base64}`
6. `POST /api/v2.2/locationbatch`
7. `POST /api/v2.2/locationbatch/{address_separator}/{chunkSequnce_separator}/{parallel}`

### Forward geocoding and reverse geocoding
8. `GET /api/v2.2/locations/{address}/{zones}/{geo}`
9. `POST /api/v2.2/locations/{address}/{zones}/{geo}`
10. `POST /api/v2.2/locations/{zones}/{geo}`
11. `POST /api/v2.2/locations/{geo}`
12. `GET /api/v2.2/locations/{latlong}/{distance}/{zones}/{geo}`
13. `POST /api/v2.2/locations/{latlong}/{distance}/{zones}/{geo}`
14. `POST /api/v2.2/locations/{distance}/{geo}`
15. `GET /api/v2.2/locations/{latlong}/{zones}/{geo}`
16. `POST /api/v2.2/locations/{latlong}/{zones}/{geo}`
17. `GET /api/v2.2/locations/{latlong}`
18. `POST /api/v2.2/locations/{latlong}`
19. `GET /api/v2.2/locations/{latlong}/{count}/{zones}/{geo}`
20. `POST /api/v2.2/locations/{latlong}/{count}/{zones}/{geo}`
21. `POST /api/v2.2/locations/{count}/{geo}`

### SSL search
22. `GET /api/v2.2/ssls/{ssl}`
23. `POST /api/v2.2/ssls/{ssl}`
24. `GET /api/v2.2/ssls`
25. `POST /api/v2.2/ssls`

### Unit search
26. `GET /api/v2.2/units/{marid}`
27. `POST /api/v2.2/units/{marid}`
28. `GET /api/v2.2/units/{marid}/{type}`
29. `POST /api/v2.2/units/{marid}/{type}`
30. `GET /api/v2.2/units`
31. `POST /api/v2.2/units`

### Zone lookup
32. `GET /api/v2.2/zone/{zone}`
33. `POST /api/v2.2/zone/{zone}`

## Parameters
### Common path parameters visible in the official API reference
The route inventory itself exposes the major request-shaping variables used throughout the API:
- `address` - address string used for autocomplete or forward geocoding
- `address_base64` - base64-encoded batch payload input for batch geocoding
- `address_separator` - separator token used when submitting batch address strings in path-driven batch routes
- `chunkSequnce_separator` - chunk separator token used by the batch routes (spelling follows the official route names)
- `parallel` - batch-processing parallelism flag/setting in the path-driven batch routes
- `zones` - zone-selection argument controlling which zoning/intersection enrichments are returned
- `geo` - geometry/geo-return argument used across geocoding and reverse-geocoding routes
- `latlong` - comma-separated latitude/longitude input for reverse geocoding
- `distance` - distance argument for nearby-address reverse geocoding
- `count` - number of nearby addresses to return in nearest-address routes
- `ssl` - square/suffix/lot style SSL search term for parcel-style lookups
- `marid` - MAR address identifier for unit lookups
- `type` - unit-type selector on `/units/{marid}/{type}`
- `zone` - zone name/code for the zone lookup routes

### Body/query usage patterns explicitly visible in operation titles
The official operation summaries distinguish these request styles:
- address supplied in the URL path
- address supplied in the POST body
- address and zones supplied in the body as JSON
- lat/long and zones supplied in the body as JSON
- query-string-parameter variants for batch geocoding

## Response, format, and paging notes
- The official portal describes MAR 2 as a modern `.NET` geocoding web service backed by ElasticSearch.
- The reviewed API reference is JSON-oriented Swagger/OpenAPI documentation; no XML or alternate wire format was surfaced on the reviewed pages.
- No page-number or cursor pagination model was exposed in the reviewed route inventory.
- The API is oriented around direct lookup, autocomplete, reverse geocoding, batch geocoding, SSL search, unit search, and zone enrichment rather than paged catalog browsing.

## Errors and rate limits
- The reviewed official pages did not publish a shared HTTP error table.
- The reviewed official pages did not publish numeric rate limits or backoff headers.
- Because the API requires authorization, callers should expect authentication/authorization failures when the API key is missing or invalid, but the reviewed public pages did not provide a status-code matrix.

## Usage notes
- The old Open Data DC `using-apis` page now primarily acts as a discovery page for current developer resources rather than as the full reference itself.
- The current canonical developer surface is the `MAR 2 API` portal and its linked OpenAPI document.
- The guide homepage describes the service as the District's authoritative address and geocoding API built on the Master Address Repository.
- Route design is deliberately redundant across `GET` and `POST` variants to support path-based, body-based, and batch workflows.

## fireROUTE normalization notes
- Normalize this provider as an API-key-protected geocoding service rooted at `https://datagate.dc.gov/mar/open`.
- Preserve the official `/api/v2.2/...` versioned path structure exactly as published.
- Keep forward geocoding, reverse geocoding, SSL lookup, unit lookup, and zone lookup as separate operation families rather than collapsing them into a single synthetic endpoint.
- Preserve the official spelling of `chunkSequnce_separator` in path templates because that is how it is published in the District's own API reference.
