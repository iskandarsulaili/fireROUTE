# GeoDB Cities

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geodb-cities`
- Official docs used manually:
  - `http://geodb-cities-api.wirefreethought.com/`
  - `http://geodb-cities-api.wirefreethought.com/docs/guides/getting-started/authentication`
  - `http://geodb-cities-api.wirefreethought.com/docs/guides/getting-started/error-handling`
  - `http://geodb-cities-api.wirefreethought.com/docs/guides/getting-started/pagination`
  - `http://geodb-cities-api.wirefreethought.com/docs/guides/getting-started/sorting-results`
  - representative route pages under `http://geodb-cities-api.wirefreethought.com/docs/api/...`
- Public REST API base URL documented by provider: `https://wft-geo-db.p.rapidapi.com/v1`
- Transport: `HTTPS` for the RapidAPI host; docs pages themselves are published over `HTTP`
- Auth model: RapidAPI header auth on paid/pro tiers via `X-RapidAPI-Key`; official auth example also sends `X-RapidAPI-Host: wft-geo-db.p.rapidapi.com`
- Response format documented: `JSON`

## Product and access notes
- The official homepage describes GeoDB as an online places database covering cities, counties, islands, regions, and countries.
- The homepage says GeoDB exposes both GraphQL and REST APIs, but the inspected current route-level pages only exposed concrete REST route families and GraphQL pagination guidance; they did not publish a standalone GraphQL endpoint URL in the reviewed material.
- The docs say results can be filtered by name prefix, countries, location, time zone, and minimum population, and can be localized into multiple languages.
- The docs explicitly mention data refresh from GeoNames and WikiData.

## Confirmed API surface
The inspected official route pages confirm these `20` REST route families:
1. `GET /v1/geo/countries`
2. `GET /v1/geo/countries/{countryId}/places`
3. `GET /v1/geo/places`
4. `GET /v1/geo/locations/{locationId}/nearbyPlaces`
5. `GET /v1/geo/locations/{locationId}/nearbyPlaces` (documented again as the near-place operation)
6. `GET /v1/geo/countries/{countryId}/regions`
7. `GET /v1/geo/countries/{countryId}/regions/{regionCode}/places`
8. `GET /v1/geo/countries/{countryId}`
9. `GET /v1/geo/places/{placeId}/locatedIn`
10. `GET /v1/geo/places/{placeId}`
11. `GET /v1/geo/places/{toPlaceId}/distance?toPlaceId=...`
12. `GET /v1/geo/places/{placeId}/dateTime`
13. `GET /v1/geo/places/{placeId}/time`
14. `GET /v1/geo/countries/{countryId}/regions/{regionCode}`
15. `GET /v1/locale/currencies`
16. `GET /v1/locale/languages`
17. `GET /v1/locale/locales`
18. `GET /v1/locale/timezones`
19. `GET /v1/locale/timezones/{zoneId}/dateTime`
20. `GET /v1/locale/timezones/{zoneId}/dateTime` (documented again as the timezone-time operation)

Important official documentation quirks:
- The `Find Places Near Place` page currently shows the same route shape as `Find Places Near Location`: `GET /v1/geo/locations/{locationId}/nearbyPlaces?...`.
- The `Get Place Distance` page currently shows `GET /v1/geo/places/{toPlaceId}/distance?toPlaceId=toPlaceId}` with an obvious placeholder inconsistency between the path segment and query parameter labels.
- The `Get Timezone Time` page currently shows the same path as the date-time page (`/dateTime`) instead of a distinct `/time` path.
- These quirks should be preserved as documentation discrepancies until runtime validation proves otherwise.

## Shared request, auth, pagination, and sorting rules
Shared auth notes from the Authentication guide:
- pass the API key in header `X-RapidAPI-Key`
- official example also sends `X-RapidAPI-Host: wft-geo-db.p.rapidapi.com`
- the guide labels auth as `PRO TIERS ONLY`

Shared collection response format from the Pagination guide:
```json
{
  "metadata": {
    "currentOffset": 0,
    "totalCount": 123
  },
  "results": [],
  "links": [
    { "rel": "first", "href": "/link/to/first/page" },
    { "rel": "prev", "href": "/link/to/prev/page" },
    { "rel": "next", "href": "/link/to/next/page" },
    { "rel": "last", "href": "/link/to/last/page" }
  ]
}
```

Pagination notes explicitly documented:
- default page shape is controlled by `offset` and `limit`
- omitting both returns the first `10` results
- Basic-plan users are limited to `10` results at a time
- `limit` above the plan maximum returns HTTP `403 Forbidden`
- offsets beyond the last page return the last page
- `hateoasMode=false` disables HATEOAS link generation

Sorting notes from the Sorting Results guide:
- syntax is `sort=±SORT_FIELD_1,±SORT_FIELD_2,...`
- ascending is the default
- prefix a field with `-` to reverse it
- duplicate sort fields trigger a validation error

GraphQL note from the Pagination guide:
- GraphQL pagination is documented as Relay-style cursor connections with `edges`, `node`, `cursor`, `totalCount`, and `pageInfo`
- the same guide says GraphQL requests may be rejected with HTTP `403 Forbidden` if the requested result volume exceeds the plan limit

## Route groups and major parameters

### Countries and regions
1. `GET /v1/geo/countries`
   - Purpose: list countries.
   - Confirmed parameters/signals from docs and examples: `limit`, `offset`, optional currency-based filtering, `namePrefix`, `sort`, language localization.
2. `GET /v1/geo/countries/{countryId}`
   - Purpose: country detail lookup.
   - Path parameter: `countryId`.
3. `GET /v1/geo/countries/{countryId}/regions`
   - Purpose: list regions/states/provinces for a country.
   - Path parameter: `countryId`.
   - Route page shows region-name filtering plus `limit`, `offset`, `sort`, and language localization.
4. `GET /v1/geo/countries/{countryId}/regions/{regionCode}`
   - Purpose: region detail lookup.
   - Path parameters: `countryId`, `regionCode`.
5. `GET /v1/geo/countries/{countryId}/regions/{regionCode}/places`
   - Purpose: list places inside one region.
   - Path parameters: `countryId`, `regionCode`.
   - Route page shows place-type, minimum-population, `limit`, `offset`, `sort`, and language controls.

### Places
6. `GET /v1/geo/countries/{countryId}/places`
   - Purpose: list places within one country.
   - Path parameter: `countryId`.
   - Route page shows place-type filtering, `limit`, `offset`, `sort`, and language controls.
7. `GET /v1/geo/places`
   - Purpose: global place search.
   - Official docs explicitly mention filtering by name prefix, countries, time zones, types, min/max population, and proximity to a GPS location.
   - The auth guide also shows concrete query parameters `countryIds` and `minPopulation` on this route.
8. `GET /v1/geo/locations/{locationId}/nearbyPlaces` (near-location page)
   - Purpose: list places near a supplied location.
   - Path parameter: `locationId`.
   - Route page shows `radius`, type, minimum-population, `limit`, `offset`, `sort`, and language controls.
9. `GET /v1/geo/locations/{locationId}/nearbyPlaces` (near-place page as currently documented)
   - Purpose: list places near another place.
   - Official page text says to use the more generic Find-Places API if you need GPS-location proximity.
10. `GET /v1/geo/places/{placeId}`
   - Purpose: place detail lookup.
   - Path parameter: `placeId`.
11. `GET /v1/geo/places/{placeId}/locatedIn`
   - Purpose: return the immediate admin region containing a place.
   - Path parameter: `placeId`.
   - Official note says results depend on the existence of a WikiData `Located In Administrative Territory` relation.
12. `GET /v1/geo/places/{toPlaceId}/distance?toPlaceId=...`
   - Purpose: distance calculation between places.
   - Official page labels the selectors as `From` and `To` and says the response can be returned in miles or kilometers depending on the requested distance unit.
13. `GET /v1/geo/places/{placeId}/dateTime`
   - Purpose: current local date-time for a place.
   - Output note: ISO-8601 `yyyy-mm-ddThh:mm:ss`.
14. `GET /v1/geo/places/{placeId}/time`
   - Purpose: current local time for a place.
   - Output note: ISO-8601 `hh:mm:ss`.

### Locale endpoints
15. `GET /v1/locale/currencies`
   - Purpose: list currencies.
   - Route text says optional country filtering is supported.
16. `GET /v1/locale/languages`
   - Purpose: list supported languages.
   - Official note: GraphQL exposes these via the `Language` enum instead of a separate languages query.
17. `GET /v1/locale/locales`
   - Purpose: list locales.
18. `GET /v1/locale/timezones`
   - Purpose: list time zones.
19. `GET /v1/locale/timezones/{zoneId}/dateTime`
   - Purpose: current local date-time for a time zone.
   - Output note: ISO-8601 `yyyy-mm-ddThh:mm:ss`.
20. `GET /v1/locale/timezones/{zoneId}/dateTime` on the current `Get Timezone Time` page
   - Purpose: current local time for a time zone.
   - Output note: ISO-8601 `hh:mm:ss`.
   - The official page title says `Time`, but the displayed path still says `/dateTime`.

## Error model
The Error Handling guide documents this JSON shape:
```json
{
  "errors": [
    {
      "code": "SOME_ERROR_CODE",
      "message": "Error-specific verbiage"
    }
  ]
}
```

Published error codes:
- `ACCESS_DENIED` - feature not available under the current subscription plan
- `ENTITY_NOT_FOUND` - requested city/country/region not found
- `INCOMPATIBLE` - syntactically valid request unsupported for the current resource context
- `PARAM_INVALID` - invalid parameter format or value
- `PARAMS_MUTUALLY_EXCLUSIVE` - incompatible parameter combination
- `REQUEST_UNPROCESSABLE` - semantically invalid request

The guides and route pages also explicitly mention these HTTP behaviors:
- `400` validation errors for bad parameters or sort misuse
- `403` for plan/volume violations
- `404` for missing entities via `ENTITY_NOT_FOUND`

## Canonical fireROUTE notes
- Preserve `offset`/`limit` pagination and HATEOAS `links` when exposing raw provider responses.
- Keep `sort` provider-specific because the accepted field names differ by route.
- Treat the provider's current route-page typos as documentation quirks, not as silently corrected truths.
- GeoDB's docs are much stronger on REST than on GraphQL endpoint publication; if fireROUTE later adds GraphQL passthrough, re-verify the live GraphQL host first.

## Verification notes
- This file was manually rebuilt from the live official GeoDB Cities docs site using browser tools only.
