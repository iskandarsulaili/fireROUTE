# ApogeoAPI

## Provider metadata
- Category: `Geocoding`
- Provider slug: `apogeoapi`
- Official docs used manually:
  - `https://www.apogeoapi.com/`
  - `https://api.apogeoapi.com/api/docs#description/introduction`
- Public base URLs documented by provider:
  - `https://api.apogeoapi.com/v1`
  - `https://api.apogeoapi.com/v1/api/geo`
- Transport: `HTTPS`
- Response format documented on the inspected official pages: `JSON`
- Auth for the documented geography and IP endpoints: `X-API-Key` header
- Additional auth note from the official site: JWT bearer tokens are also available from the dashboard, but the inspected geocoding/IP OpenAPI operations are secured with `X-API-Key`

## Product and plan notes
- The marketing page describes ApogeoAPI as one combined API for countries, states, cities, timezones, live currency rates, languages, and IP geolocation.
- The homepage markets `250+` countries, `5,000+` states/provinces, and `150K+` cities.
- The homepage says countries and states are free forever, while cities, search, live exchange rates, and IP geolocation are trial/paid features after the introductory trial window.
- The homepage also says list endpoints support pagination, filtering, and sorting.

## Confirmed API surface
The official OpenAPI reference currently exposes `42` geocoding-related `GET` route/method combinations:
- `21` simplified routes under `https://api.apogeoapi.com/v1`
- `21` parallel alias routes under `https://api.apogeoapi.com/v1/api/geo`

### Simplified `/v1` routes
1. `GET /countries`
2. `GET /countries/search`
3. `GET /countries/{code}`
4. `GET /countries/{code}/states`
5. `GET /countries/{code}/states/search`
6. `GET /countries/region/{region}`
7. `GET /countries/subregion/{subregion}`
8. `GET /countries/phone/{phoneCode}`
9. `GET /countries/currency/{currency}`
10. `GET /countries/{code}/timezones`
11. `GET /countries/{code}/translations`
12. `GET /countries/{code}/currency-rate`
13. `GET /states/{id}`
14. `GET /states/{id}/cities`
15. `GET /states/{id}/cities/search`
16. `GET /states/types`
17. `GET /states/type/{type}`
18. `GET /cities/{id}`
19. `GET /search`
20. `GET /ip`
21. `GET /ip/{address}`

### Parallel `/v1/api/geo` alias routes
1. `GET /api/geo/countries`
2. `GET /api/geo/countries/search`
3. `GET /api/geo/countries/{code}`
4. `GET /api/geo/countries/{code}/currency-rate`
5. `GET /api/geo/countries/{code}/states`
6. `GET /api/geo/countries/{code}/states/search`
7. `GET /api/geo/states/{id}`
8. `GET /api/geo/states/{id}/cities`
9. `GET /api/geo/states/{id}/cities/search`
10. `GET /api/geo/cities/{id}`
11. `GET /api/geo/countries/region/{region}`
12. `GET /api/geo/countries/subregion/{subregion}`
13. `GET /api/geo/countries/phone/{phoneCode}`
14. `GET /api/geo/countries/currency/{currency}`
15. `GET /api/geo/countries/{code}/timezones`
16. `GET /api/geo/countries/{code}/translations`
17. `GET /api/geo/states/types`
18. `GET /api/geo/states/type/{type}`
19. `GET /api/geo/search`
20. `GET /api/geo/ip`
21. `GET /api/geo/ip/{address}`

## Parameters and request patterns
Common documented parameters across the inspected official docs and OpenAPI entries:
- `X-API-Key` header: required for the published geography and IP operations
- `code` path parameter: country code; the fuller OpenAPI entries describe `ISO2` and `ISO3` support on several country routes and show `AR` as the example
- `id` path parameter: numeric state or city identifier
- `address` path parameter: IPv4 or IPv6 address for explicit IP geolocation lookups
- `q` query parameter: search term for `/search`, `/countries/search`, `/countries/{code}/states/search`, and `/states/{id}/cities/search`
- `page` query parameter: pagination control on list/search endpoints
- `limit` query parameter: page size control; the fuller `/v1/api/geo/...` entries show max `100` on country lists/search, example `100` on state-city lists, and max `250` on `/states/type/{type}`
- `fields` query parameter: field projection level on documented list/search endpoints; the fuller docs describe `basic`, `standard`, and `full`
- `base` query parameter: optional base currency selection on country and country-currency-rate routes
- `region` path parameter: geographic region name
- `subregion` path parameter: geographic subregion name; the fuller docs list examples such as `South America`, `Western Europe`, and `South-Eastern Asia`
- `phoneCode` path parameter: international calling code without the leading `+`
- `currency` path parameter: ISO 4217 currency code such as `USD`
- `type` path parameter: administrative division type such as `province`, `state`, `region`, `district`, `municipality`, or `department`

## Response, pagination, and error notes
- Responses are JSON on the inspected official pages.
- The homepage says list endpoints support pagination, filtering, and sorting.
- The live demo for `GET /v1/api/geo/countries/{code}/states` shows a paginated response envelope with top-level `data` and `meta` fields, including `meta.total`, `meta.page`, and `meta.limit`.
- The homepage says every error response includes a machine-readable code and a human-readable message.
- The homepage explicitly lists these HTTP statuses for error handling: `400`, `401`, `404`, `429`, and `500`.

## Rate limits and quota notes
The inspected official pages currently disagree with each other:
- Homepage pricing/FAQ text says:
  - Free: `1,000 requests/month`, `5 requests/min`
  - Basic: `15,000 requests/month`, `30 requests/min`
  - Starter: `100,000 requests/month`, `60 requests/min`
  - Professional: `500,000 requests/month`, `300 requests/min`
- The API reference introduction says/per-plan table shows:
  - Free: `5,000 requests/month`, `10 req/s`
  - Starter: `100,000 requests/month`, `60 req/s`
  - Professional: `500,000 requests/month`, `300 req/s`
  - Enterprise: custom
- The homepage says each response includes `X-RateLimit-Remaining` and `X-Monthly-Quota-Remaining` headers.

## Important usage notes
- The official materials currently document both simplified `/v1/...` routes and parallel `/v1/api/geo/...` routes.
- The homepage curl examples use simplified paths such as `https://api.apogeoapi.com/v1/countries/AR`, while the live demo cards and OpenAPI page also expose `/v1/api/geo/...` forms.
- The simplified OpenAPI entries are less descriptive than the `/v1/api/geo/...` entries and, in a few cases, mark optional pagination/base parameters as required where the fuller alias entries describe defaults or optional behavior.
- Because the provider-controlled docs currently expose both namespaces, fireROUTE should preserve provider-specific path selection rather than assuming one prefix is deprecated.
- The provider markets exchange-rate enrichment as inline country data rather than as a separate geocoding system; this is why `base` appears on country lookups as well as on the dedicated country-currency-rate route.

## Verification notes
This file was manually rebuilt from the live official ApogeoAPI homepage and the provider's official OpenAPI reference using browser tools only.