# Transport for Norway

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-norway`
- Official docs used manually:
  - `https://developer.entur.org/`
  - `https://developer.entur.org/pages-intro-overview`
  - `https://developer.entur.org/pages-intro-authentication`
  - `https://developer.entur.org/pages-geocoder-intro`
  - `https://developer.entur.org/pages-geocoder-api`
  - `https://developer.entur.org/pages-journeyplanner-journeyplanner`
  - `https://developer.entur.org/pages-mobility-docs-mobility-v2`
  - `https://developer.entur.org/pages-nsr-nsr`
  - `https://developer.entur.org/stop-places-v1-read`
  - `https://developer.entur.org/pages-open-distance-api`
  - `https://developer.entur.org/pages-timetable-timetable`
  - `https://developer.entur.org/timetable-import-info-v1`
  - `https://api.entur.io/timetable-public/v1/timetable-import-info/openapi.yaml`
  - `https://developer.entur.org/pages-real-time-vehicle`
- Base URLs documented here:
  - `https://api.entur.io/geocoder/v1`
  - `https://api.entur.io/journey-planner/v3`
  - `https://api.entur.io/mobility/v2`
  - `https://api.entur.io/stop-places/v1/read`
  - `https://api.entur.io/distance`
  - `https://api.entur.io/timetable-public/v1`
  - `https://api.entur.io/realtime/v2/vehicles`
- Authentication:
  - Open public APIs documented here require caller identification via the `ET-Client-Name` header.
  - Entur's broader authentication page also documents OAuth2 client-credentials for privileged partner endpoints, but those partner-only APIs are outside the public route inventory documented here.
- Primary response formats: JSON, GraphQL JSON, GBFS JSON, plain text for some utility endpoints, and WebSocket GraphQL subscriptions for live vehicle streams
- Transport scope documented here: Entur's public open transport APIs for Norway across geocoding, journey planning, shared mobility, stop-place reference data, station distances, timetable-import status, and live vehicle positions

## Important official usage notes
- Entur describes its public transport data and services as open and free to use, covering nationwide public transport in Norway.
- The inspected overview page says Entur operates the national registry for all public transport in Norway, collecting data from around `60` operators and about `21,000` daily departures on `3,000` routes.
- The authentication docs say most public APIs are open under the Norwegian Licence for Open Government Data (`NLOD`) but still require the identifying `ET-Client-Name` header in the form `<company>-<application>`.
- Multiple public Entur pages repeat the same warning: consumers who do not send `ET-Client-Name` may be strictly rate-limited or blocked.
- The National Stop Register intro says the preferred way to consume stop-place data is the daily NeTEx publications rather than heavy API harvesting.
- The Timetable Data intro likewise says timetable data is exported daily as NeTEx files and that those files are the preferred consumption method.
- The Journey Planner page says all data is presented as a Transmodel-based GraphQL API and points users to the official GraphQL IDE at `https://api.entur.io/graphql-explorer/journey-planner-v3`.
- The Mobility page serves GBFS data in both `2.3` and `3.0`, plus a separate GraphQL aggregation endpoint.
- The Vehicle Positions page exposes both a GraphQL query endpoint and a WebSocket GraphQL subscription endpoint.
- Counting only the public route patterns explicitly documented on the inspected official pages yields `48` confirmed routes/endpoints.

## Rate limits, pagination, and errors
- No public page inspected for these open APIs publishes a numeric request quota.
- Instead, Entur repeatedly documents a policy-based throttle: clients that omit `ET-Client-Name` may be strictly rate-limited or blocked.
- Pagination is family-specific rather than platform-wide:
  - National Stop Register list endpoints document `count` and `skip` query parameters.
  - Geocoder uses `size` for autocomplete result limits.
  - GraphQL endpoints do not publish one global pagination contract on the inspected pages; pagination is schema/query dependent where applicable.
  - Distance, timetable-import-info, and GBFS catalog endpoints do not document page-number pagination.
- Official/openly documented error notes confirmed during review:
  - The Entur authentication page documents generic HTTP behaviors for authenticated APIs including `301`, `302`, `401`, `403`, `405`, and `408`.
  - Live GraphQL validation failures on the Mobility endpoint returned HTTP `200` with a GraphQL `errors` array and `ValidationError` classification.
  - Live invalid National Stop Register item lookup returned HTTP `404` JSON: `{"errorCode":"RESOURCE_NOT_FOUND","message":"The requested resource was not found"}`.
  - Live invalid station-distance lookup returned HTTP `400` with `application/problem+json` and an `errors` array describing invalid NeTEx IDs.
  - The official Timetable Import Info OpenAPI document explicitly lists `404` plain-text `Codespace not found` for unknown codespaces and `500` for server errors.
  - The inspected public docs did not publish one shared structured error schema for Geocoder, Journey Planner, Mobility GBFS, or Vehicle Positions.

## Confirmed API surface
The official pages expose these `48` confirmed route patterns/endpoints:

1. `GET /geocoder/v1/autocomplete`
2. `GET /geocoder/v1/reverse`
3. `POST /journey-planner/v3/graphql`
4. `GET /mobility/v2/gbfs/v3/manifest.json`
5. `GET /mobility/v2/gbfs/v2`
6. `GET /mobility/v2/gbfs/v3/{system}/gbfs`
7. `GET /mobility/v2/gbfs/v2/{system}/gbfs`
8. `POST /mobility/v2/graphql`
9. `GET /stop-places`
10. `GET /stop-places/{id}`
11. `GET /stop-places/{id}/children`
12. `GET /stop-places/{id}/parkings`
13. `GET /stop-places/{id}/scheduled-stop-points`
14. `GET /stop-places/{id}/versions`
15. `GET /stop-places/{id}/versions/{version}`
16. `GET /quays`
17. `GET /quays/{id}`
18. `GET /quays/{id}/stop-place`
19. `GET /quays/{id}/versions`
20. `GET /quays/{id}/versions/{version}`
21. `GET /scheduled-stop-points`
22. `GET /scheduled-stop-points/{id}`
23. `GET /scheduled-stop-points/{id}/stop-place`
24. `GET /fare-zones`
25. `GET /fare-zones/{id}`
26. `GET /fare-zones/{id}/versions`
27. `GET /fare-zones/{id}/versions/{version}`
28. `GET /tariff-zones`
29. `GET /tariff-zones/{id}`
30. `GET /tariff-zones/{id}/versions`
31. `GET /tariff-zones/{id}/versions/{version}`
32. `GET /parkings`
33. `GET /parkings/{id}`
34. `GET /parkings/{id}/versions`
35. `GET /parkings/{id}/versions/{version}`
36. `GET /topographic-places`
37. `GET /topographic-places/{id}`
38. `GET /topographic-places/{id}/versions`
39. `GET /topographic-places/{id}/versions/{version}`
40. `GET /groups-of-stop-places`
41. `GET /groups-of-stop-places/{id}`
42. `GET /groups-of-tariff-zones`
43. `GET /groups-of-tariff-zones/{id}`
44. `GET /distance/stop-place-distances/{fromStopPlaceId}/{toStopPlaceId}`
45. `GET /timetable-public/v1/timetable-import-info/import_date`
46. `GET /timetable-public/v1/timetable-import-info/import_date/{codespace}`
47. `POST /realtime/v2/vehicles/graphql`
48. `WSS /realtime/v2/vehicles/subscriptions`

## Common request and response notes
- Send `ET-Client-Name: <company>-<application>` on every public request documented here.
- Live tested public endpoints returned:
  - Geocoder: `application/json` GeoJSON-style `FeatureCollection`
  - Journey Planner: `application/json` GraphQL `{ data: ... }` responses
  - Mobility GBFS: `application/json` GBFS feeds and manifests
  - National Stop Register: `application/json`
  - Station Distances: `text/plain` numeric distance on success
  - Timetable Import Info: OpenAPI documents JSON for the all-codespaces route and plain text for the single-codespace route
  - Vehicle positions: GraphQL over HTTP plus GraphQL subscriptions over WebSocket
- Public GraphQL APIs rely on schema-level fields rather than many separate REST routes. The official IDEs are part of the reference surface for those APIs.

## 1) Geocoder API
Confirmed routes: `2`

Base URL: `https://api.entur.io/geocoder/v1`

Routes:
- `GET /autocomplete`
- `GET /reverse`

Documented parameter notes:
- `/autocomplete` searches addresses, POIs, and stops from a free-text string.
- The inspected page explicitly documents these Entur-added or emphasized parameters for `/autocomplete`:
  - `text` - search string
  - `lang` - language in examples
  - `size` - maximum result count, documented as `1-100`
  - `boundary.country`
  - `boundary.county_ids`
  - `boundary.locality_ids`
  - `tariff_zone_authorities`
  - `tariff_zone_ids`
  - `multiModal` with values `parent`, `child`, or `all`
  - `focus.weight`
  - `focus.function`
  - `focus.scale`
- `/reverse` is documented as reverse geocoding around a coordinate-defined area.
- The page states the Geocoder API is based on Pelias and that standard Pelias query behavior also applies.

Documented response notes:
- Live tested `/autocomplete?text=sons&lang=en` returned a GeoJSON-style `FeatureCollection` with `features`, `geometry`, and `properties`.
- Live tested `/reverse?point.lat=59.91&point.lon=10.75&size=1` returned the same top-level `FeatureCollection` structure.
- The Geocoder intro says this API is primarily intended to find start/end points for Journey Planner queries.

## 2) Journey Planner v3
Confirmed routes: `1`

Base URL: `https://api.entur.io/journey-planner/v3`

Route:
- `POST /graphql`

Documented request notes:
- Content type: `application/json`
- Required identifying header: `ET-Client-Name`
- Body format:
  - `query` - GraphQL document string
  - `variables` - optional GraphQL variables object
- The official page links the interactive schema explorer at `https://api.entur.io/graphql-explorer/journey-planner-v3`.
- Official examples cover stop-place-to-coordinate trip search, walk-only search, departure boards, situation messages, authority filtering, and city-bike routing.

Documented response notes:
- Live tested `{"query":"{ stopPlace(id:\"NSR:StopPlace:59872\") { id name } }"}` returned `{"data":{"stopPlace":{"id":"NSR:StopPlace:59872","name":"Oslo S"}}}`.
- The page says the API is Transmodel-based and includes realtime information across all public transport modes in Norway.

## 3) Mobility v2
Confirmed routes: `5`

Base URL: `https://api.entur.io/mobility/v2`

Routes:
- `GET /gbfs/v3/manifest.json`
- `GET /gbfs/v2`
- `GET /gbfs/v3/{system}/gbfs`
- `GET /gbfs/v2/{system}/gbfs`
- `POST /graphql`

Documented parameter and usage notes:
- `{system}` is the operator/system identifier, such as `voistavanger` or `oslobysykkel`.
- The docs say GBFS data is served in versions `2.3` and `3.0`.
- The GraphQL API is described as a client-centric aggregation API with two entry points: vehicles and stations.
- The official GraphQL IDE is `https://api.entur.io/graphql-explorer/mobility`.
- The manifest and operator `gbfs` documents return downstream feed URLs for concrete resources like `system_information`, `vehicle_types`, `vehicle_status`, `station_information`, `station_status`, `system_alerts`, `system_regions`, and `geofencing_zones`.

Documented response notes:
- Live tested `GET /gbfs/v3/manifest.json` returned a GBFS `3.0` manifest with `datasets`, available versions, and operator feed URLs.
- A live invalid GraphQL query returned HTTP `200` with a GraphQL `errors` array rather than an HTTP 4xx.

## 4) National Stop Register Read API
Confirmed routes: `35`

Base URL: `https://api.entur.io/stop-places/v1/read`

The official API page links a raw OpenAPI document and groups the routes as follows.

### Stop places
- `GET /stop-places`
- `GET /stop-places/{id}`
- `GET /stop-places/{id}/children`
- `GET /stop-places/{id}/parkings`
- `GET /stop-places/{id}/scheduled-stop-points`
- `GET /stop-places/{id}/versions`
- `GET /stop-places/{id}/versions/{version}`

Common documented parameters:
- `/stop-places` supports `count`, `skip`, `ids`, `multimodal`, `transportModes`, `stopPlaceTypes`, `topographicPlaceIds`, `quayIds`, `includeDeactivatedStops`, and `modifiedSince`.
- `id` and `version` are required path parameters on item/version routes.

### Quays
- `GET /quays`
- `GET /quays/{id}`
- `GET /quays/{id}/stop-place`
- `GET /quays/{id}/versions`
- `GET /quays/{id}/versions/{version}`

Common documented parameters:
- `/quays` supports `count`, `skip`, and `ids`.
- Item and version routes use `id` and `version` path parameters.

### Scheduled stop points
- `GET /scheduled-stop-points`
- `GET /scheduled-stop-points/{id}`
- `GET /scheduled-stop-points/{id}/stop-place`

Common documented parameters:
- `/scheduled-stop-points` supports `count` and `skip`.
- Item routes use required `id` path parameters.

### Fare zones and deprecated tariff zones
- `GET /fare-zones`
- `GET /fare-zones/{id}`
- `GET /fare-zones/{id}/versions`
- `GET /fare-zones/{id}/versions/{version}`
- `GET /tariff-zones`
- `GET /tariff-zones/{id}`
- `GET /tariff-zones/{id}/versions`
- `GET /tariff-zones/{id}/versions/{version}`

Common documented parameters:
- List routes support `count`, `skip`, `ids`, and for fare/tariff zones also `authorityRefs`.
- The API page explicitly marks `TariffZones` as deprecated and tells consumers to migrate to `FareZones`.

### Parkings
- `GET /parkings`
- `GET /parkings/{id}`
- `GET /parkings/{id}/versions`
- `GET /parkings/{id}/versions/{version}`

Common documented parameters:
- `/parkings` supports `count`, `skip`, and `ids`.

### Geographic areas
- `GET /topographic-places`
- `GET /topographic-places/{id}`
- `GET /topographic-places/{id}/versions`
- `GET /topographic-places/{id}/versions/{version}`

Common documented parameters:
- `/topographic-places` supports `count`, `skip`, and `ids`.

### Groupings
- `GET /groups-of-stop-places`
- `GET /groups-of-stop-places/{id}`
- `GET /groups-of-tariff-zones`
- `GET /groups-of-tariff-zones/{id}`

Common documented parameters:
- List grouping routes support `count`, `skip`, and `ids`.

Documented response notes:
- The raw OpenAPI document exposes HTTP response codes `200`, `400`, `404`, and `500` across the API.
- Live tested `/stop-places?count=1` returned JSON stop-place records.
- Live tested invalid `/stop-places/bad-id` returned HTTP `404` with JSON `RESOURCE_NOT_FOUND`.
- The NSR intro page says this API is for general-purpose reads, while bulk stop-place consumption should prefer the NeTEx exports.

## 5) Station Distances
Confirmed routes: `1`

Base URL: `https://api.entur.io/distance`

Route:
- `GET /stop-place-distances/{fromStopPlaceId}/{toStopPlaceId}`

Documented parameter notes:
- Both path parameters must be NSR stop-place IDs for Norwegian stations.
- The page example uses `NSR:StopPlace:337` and `NSR:StopPlace:1`.

Documented response notes:
- Live tested request returned plain-text distance `192`.
- Live tested invalid IDs returned HTTP `400` `application/problem+json` with validation errors.

## 6) Timetable Import Info
Confirmed routes: `2`

Base URL: `https://api.entur.io/timetable-public/v1`

Routes:
- `GET /timetable-import-info/import_date`
- `GET /timetable-import-info/import_date/{codespace}`

Documented parameter notes:
- `{codespace}` is the data-provider codespace, with examples such as `avi`, `rut`, and `atb`.

Documented response notes:
- The official OpenAPI document says `/import_date` returns a JSON object mapping codespaces to latest successful import timestamps.
- The single-codespace route returns a plain-text timestamp on success.
- The official OpenAPI explicitly documents `404` plain-text `Codespace not found` for unknown codespaces.

## 7) Vehicle Positions
Confirmed routes: `2`

Base URLs:
- HTTP: `https://api.entur.io/realtime/v2/vehicles`
- WebSocket: `wss://api.entur.io/realtime/v2/vehicles`

Routes:
- `POST /graphql`
- `WSS /subscriptions`

Documented request notes:
- The page points to the official GraphQL IDE at `https://api.entur.io/graphql-explorer/vehicles-v2`.
- The subscription example uses GraphQL-over-WebSocket to `wss://api.entur.io/realtime/v2/vehicles/subscriptions` and passes `Et-Client-Name` in `connectionParams.headers`.
- The page frames the API as both queryable and subscribable for realtime vehicle data.

## Sources inspected
- `https://developer.entur.org/`
- `https://developer.entur.org/pages-intro-overview`
- `https://developer.entur.org/pages-intro-authentication`
- `https://developer.entur.org/pages-geocoder-intro`
- `https://developer.entur.org/pages-geocoder-api`
- `https://developer.entur.org/pages-journeyplanner-journeyplanner`
- `https://developer.entur.org/pages-mobility-docs-mobility-v2`
- `https://developer.entur.org/pages-nsr-nsr`
- `https://developer.entur.org/stop-places-v1-read`
- `https://developer.entur.org/pages-open-distance-api`
- `https://developer.entur.org/pages-timetable-timetable`
- `https://developer.entur.org/timetable-import-info-v1`
- `https://api.entur.io/timetable-public/v1/timetable-import-info/openapi.yaml`
- `https://developer.entur.org/pages-real-time-vehicle`
