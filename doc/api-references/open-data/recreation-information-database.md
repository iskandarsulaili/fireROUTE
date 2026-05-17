# Recreation Information Database

## Provider metadata
- Category: `Open Data`
- Provider slug: `recreation-information-database`
- Official docs/pages used:
  - `https://ridb.recreation.gov/docs` (official RIDB Swagger UI)
  - `https://ridb.recreation.gov/shared/swagger/ridb.yaml` (official OpenAPI YAML loaded by the docs app)
- Official API title/version: `RIDB API 1.0.0`
- Canonical API base URL from the official spec: `https://ridb.recreation.gov/api/v1`
- Auth model: global API-key auth via header `apikey`
- Methods confirmed from the official spec: `GET`
- Response format: JSON
- Manually confirmed route count: `62`

## Auth, limits, and request model
- The official OpenAPI spec declares a global security scheme named `Apikey`.
- That scheme is:
  - `type: apiKey`
  - `in: header`
  - `name: apikey`
- The inspected docs app source also shows internal request-header constants for both `Authorization` and `apikey`, but the RIDB public Swagger spec itself applies the `Apikey` header scheme globally.
- The reviewed route descriptions repeatedly state: `Rate Limit is set to 50 request/second.`
- The reservations route says `Limit is set to 50 request/second.`

## Shared query parameters and pagination
### Common list-query parameters
Most collection/list routes use:
- `query` - free-text filter/search term
- `limit` - number of records to return, usually max `50`, default `50`
- `offset` - starting record offset, default `0`

### Reservations-specific parameters
`GET /reservations` uses:
- `dateFrom` - required start date string, example format shown as `2023-02-06`
- `dateTo` - required end date string
- `limit` - max expected number of results, default `10`
- `page` - number of pages to skip, default `0`

### Common response envelope
The collection responses documented in the spec commonly use:
- `RECDATA` - array of records
- `METADATA.RESULTS.CURRENT_COUNT`
- `METADATA.RESULTS.TOTAL_COUNT`
- `METADATA.PARAMETERS` - echo of request parameters such as `QUERY`, `LIMIT`, `OFFSET`

## Error notes
- The reviewed OpenAPI YAML publishes `200` and `401` responses.
- `401` is documented as `Unauthorized`.
- The inspected spec did not publish a broader HTTP error table beyond those responses.

## Canonical endpoints
All confirmed routes in the reviewed official RIDB spec are `GET` routes.

### Organizations
- `GET /organizations`
- `GET /organizations/{orgId}`

### Recreation areas
- `GET /recareas`
- `GET /recareas/{recAreaId}`
- `GET /organizations/{orgId}/recareas`
- `GET /organizations/{orgId}/recareas/{recAreaId}`

### Recreation area addresses
- `GET /recareaaddresses`
- `GET /recareaaddresses/{recAreaAddressId}`
- `GET /recareas/{recAreaId}/recareaaddresses`
- `GET /recareas/{recAreaId}/recareaaddresses/{recAreaAddressId}`

### Facilities
- `GET /facilities`
- `GET /facilities/{facilityId}`
- `GET /organizations/{orgId}/facilities`
- `GET /organizations/{orgId}/facilities/{facilityId}`
- `GET /recareas/{recAreaId}/facilities`
- `GET /recareas/{recAreaId}/facilities/{facilityId}`

### Facility addresses
- `GET /facilityaddresses`
- `GET /facilityaddresses/{facilityAddressId}`
- `GET /facilities/{facilityId}/facilityaddresses`
- `GET /facilities/{facilityId}/facilityaddresses/{facilityAddressId}`

### Campsites
- `GET /campsites`
- `GET /campsites/{campsiteId}`
- `GET /facilities/{facilityId}/campsites`
- `GET /facilities/{facilityId}/campsites/{campsiteId}`

### Permit entrances
- `GET /permitentrances`
- `GET /permitentrances/{permitentranceId}`
- `GET /facilities/{facilityId}/permitentrances`
- `GET /facilities/{facilityId}/permitentrances/{permitEntranceId}`

### Tours
- `GET /tours`
- `GET /tours/{tourId}`
- `GET /facilities/{facilityId}/tours`
- `GET /facilities/{facilityId}/tours/{tourId}`

### Activities
- `GET /activities`
- `GET /activities/{activityId}`
- `GET /recareas/{recAreaId}/activities`
- `GET /recareas/{recAreaId}/activities/{activityId}`
- `GET /facilities/{facilityId}/activities`
- `GET /facilities/{facilityId}/activities/{activityId}`

### Attributes
- `GET /campsites/{campsiteId}/attributes`
- `GET /permitentrances/{permitEntranceId}/attributes`
- `GET /tours/{tourId}/attributes`

### Zones
- `GET /permitentrances/{permitEntranceId}/zones`
- `GET /permitentrances/{permitEntranceId}/zones/{zoneId}`

### Events
- `GET /events`
- `GET /events/{eventId}`
- `GET /recareas/{recAreaId}/events`
- `GET /recareas/{recAreaId}/events/{eventId}`
- `GET /facilities/{facilityId}/events`
- `GET /facilities/{facilityId}/events/{eventId}`

### Links
- `GET /links`
- `GET /links/{linkId}`
- `GET /recareas/{recAreaId}/links`
- `GET /recareas/{recAreaId}/links/{linkId}`
- `GET /facilities/{facilityId}/links`
- `GET /facilities/{facilityId}/links/{linkId}`

### Media
- `GET /media`
- `GET /media/{mediaId}`
- `GET /recareas/{recAreaId}/media`
- `GET /recareas/{recAreaId}/media/{mediaId}`
- `GET /facilities/{facilityId}/media`
- `GET /facilities/{facilityId}/media/{mediaId}`

### Reservations
- `GET /reservations`

## Important path variables
- `{orgId}` - organization identifier
- `{recAreaId}` - recreation area identifier
- `{recAreaAddressId}` - recreation-area address identifier
- `{facilityId}` - facility identifier
- `{facilityAddressId}` - facility-address identifier
- `{campsiteId}` - campsite identifier
- `{permitentranceId}` / `{permitEntranceId}` - permit-entrance identifier as documented in the official paths
- `{tourId}` - tour identifier
- `{activityId}` - activity identifier
- `{zoneId}` - zone identifier
- `{eventId}` - event identifier
- `{linkId}` - link identifier
- `{mediaId}` - media identifier

## Response/data notes
- Most RIDB resources are exposed as collection/detail pairs plus nested collection/detail routes under organizations, recreation areas, or facilities.
- The route inventory is entirely read-only in the reviewed public RIDB spec.
- The docs describe organizations as the federal agencies that provide RIDB data.
- Recreation areas and facilities are modeled separately; facilities can belong to recreation areas or stand alone.
- Links and media are separate resource families and should not be merged into generic metadata in fireROUTE.
- Reservations are structurally different from the rest of the catalog: they are date-window driven rather than simple catalog browsing.

## Important usage notes
- The RIDB docs UI is backed by a Swagger YAML file under `/shared/swagger/ridb.yaml`; that file was the authoritative route inventory used here.
- The official docs app source preauthorizes the Swagger UI with the developer API key when a logged-in developer session exists, which is consistent with the global `apikey` header scheme in the spec.
- Most list endpoints share the same search/paging pattern, so fireROUTE should preserve `query`, `limit`, and `offset` exactly.
- The official docs do not publish write routes in the public RIDB API spec reviewed here, even though the site bundle contains separate internal/developer-portal code paths.

## fireROUTE normalization notes
- Normalize on `https://ridb.recreation.gov/api/v1`.
- Preserve header auth as `apikey`.
- Treat the provider as a read-only JSON API with `GET` routes only for the public RIDB catalog surface reviewed here.
- Keep organizations, recreation areas, facilities, addresses, activities, events, links, media, permit entrances, tours, zones, and reservations as separate route families.
- Preserve the native `RECDATA`/`METADATA` envelope rather than flattening it at the provider adapter boundary.