# Transport for London, England

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-london-england`
- Official docs used manually:
  - `https://api.tfl.gov.uk/`
  - `https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1`
  - `https://api.tfl.gov.uk/swagger/docs/v1`
  - live check: `https://api.tfl.gov.uk/AirQuality`
- Base URL used by the public docs and live endpoint checks: `https://api.tfl.gov.uk`
- Additional official schema host exposed by the Swagger document: `https://api.digital.tfl.gov.uk`
- Authentication documented by TfL:
  - the homepage says developers should register for an `Application ID` and `Application Key`
  - the homepage says requests should append `app_id` and `app_key` query parameters
  - the official Swagger security definitions model both `app_id` and `app_key` as query-parameter API-key credentials
- Primary response format: JSON
- Additional format notes:
  - a live unauthenticated `GET /AirQuality` response returned `Content-Type: application/json; charset=utf-8`
  - some routes expose XML-oriented toggles or alternate output flags, including `forceXml`, `legacyFormat`, and `output` on selected route families
- CORS observed on the live `GET /AirQuality` response:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Headers: Content-Type`
  - `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`

## Important official usage notes
- TfL labels this platform the `Transport for London Unified API`.
- The official homepage links both a human-browsable Swagger UI and the raw Swagger file.
- The currently published Swagger document exposes `84` confirmed operations.
- Every operation in the current Swagger document is a `GET` route.
- Although the homepage directs developers to register and send `app_id` plus `app_key`, at least some public data routes are reachable without credentials; during review, `GET /AirQuality` returned `200 OK` anonymously.
- The current route inventory spans these families: `AccidentStats`, `AirQuality`, `BikePoint`, `Cabwise`, `Journey`, `Line`, `Mode`, `Occupancy`, `Place`, `Road`, `Search`, `StopPoint`, `TravelTime`, and `Vehicle`.

## Rate limits, pagination, errors, and parameter patterns
- I did not find a numeric public rate-limit table on the inspected homepage or in the published Swagger document.
- The published Swagger document only declares `200` responses for the confirmed routes; it does not publish structured non-200 error schemas.
- Pagination is not global or cursor-based:
  - `/Search` explicitly notes a maximum page size of `100` and says later pages should be fetched with the paginated overload
  - `/StopPoint/Type/{types}/page/{page}` paginates through the path itself
  - several routes use route-specific size or filtering controls such as `page`, `count`, `maxResults`, and `numberOfPlacesToReturn`
- Common parameter families exposed by the Swagger document include:
  - location filters such as `lat`, `lon`, `radius`, postcode-related inputs, and geographic bounding-box fields
  - identity filters such as `id`, `ids`, `lineId`, `lineIds`, `modes`, `types`, `stopTypes`, and `serviceTypes`
  - journey-planning controls such as `date`, `time`, `timeIs`, `via`, `journeyPreference`, `walkingSpeed`, `maxTransferMinutes`, `maxWalkingMinutes`, `accessibilityPreference`, and `includeAlternativeRoutes`
  - disruption / severity filters such as `severity`, `severities`, `categories`, `startDate`, and `endDate`
  - travel-time overlay controls such as `compareType`, `compareValue`, `travelTimeInterval`, and overlay dimension / zoom path variables
- Response-format signals are primarily JSON, but some routes expose extra output / legacy toggles rather than a single uniform media-type contract.

## Confirmed API surface
The official Swagger document currently exposes these `84` GET routes.

### AccidentStats (1)
- `GET /AccidentStats/{year}`

### AirQuality (1)
- `GET /AirQuality`

### BikePoint (3)
- `GET /BikePoint`
- `GET /BikePoint/{id}`
- `GET /BikePoint/Search`

### Cabwise (1)
- `GET /Cabwise/search`

### Journey (2)
- `GET /Journey/Meta/Modes`
- `GET /Journey/JourneyResults/{from}/to/{to}`

### Line (21)
- `GET /Line/Meta/Modes`
- `GET /Line/Meta/Severity`
- `GET /Line/Meta/DisruptionCategories`
- `GET /Line/Meta/ServiceTypes`
- `GET /Line/{ids}`
- `GET /Line/Mode/{modes}`
- `GET /Line/Route`
- `GET /Line/{ids}/Route`
- `GET /Line/Mode/{modes}/Route`
- `GET /Line/{id}/Route/Sequence/{direction}`
- `GET /Line/{ids}/Status/{StartDate}/to/{EndDate}`
- `GET /Line/{ids}/Status`
- `GET /Line/Search/{query}`
- `GET /Line/Status/{severity}`
- `GET /Line/Mode/{modes}/Status`
- `GET /Line/{id}/StopPoints`
- `GET /Line/{id}/Timetable/{fromStopPointId}`
- `GET /Line/{id}/Timetable/{fromStopPointId}/to/{toStopPointId}`
- `GET /Line/{ids}/Disruption`
- `GET /Line/Mode/{modes}/Disruption`
- `GET /Line/{ids}/Arrivals/{stopPointId}`

### Mode (2)
- `GET /Mode/ActiveServiceTypes`
- `GET /Mode/{mode}/Arrivals`

### Occupancy (5)
- `GET /Occupancy/CarPark/{id}`
- `GET /Occupancy/CarPark`
- `GET /Occupancy/ChargeConnector/{ids}`
- `GET /Occupancy/ChargeConnector`
- `GET /Occupancy/BikePoints/{ids}`

### Place (9)
- `GET /Place/Meta/Categories`
- `GET /Place/Meta/PlaceTypes`
- `GET /Place/Address/Streets/{Postcode}`
- `GET /Place/Type/{types}`
- `GET /Place/{id}`
- `GET /Place`
- `GET /Place/{type}/At/{Lat}/{Lon}`
- `GET /Place/{type}/overlay/{z}/{Lat}/{Lon}/{width}/{height}`
- `GET /Place/Search`

### Road (8)
- `GET /Road`
- `GET /Road/{ids}`
- `GET /Road/{ids}/Status`
- `GET /Road/{ids}/Disruption`
- `GET /Road/all/Street/Disruption`
- `GET /Road/all/Disruption/{disruptionIds}`
- `GET /Road/Meta/Categories`
- `GET /Road/Meta/Severities`

### Search (5)
- `GET /Search`
- `GET /Search/BusSchedules`
- `GET /Search/Meta/SearchProviders`
- `GET /Search/Meta/Categories`
- `GET /Search/Meta/Sorts`

### StopPoint (23)
- `GET /StopPoint/Meta/Categories`
- `GET /StopPoint/Meta/StopTypes`
- `GET /StopPoint/Meta/Modes`
- `GET /StopPoint/{ids}`
- `GET /StopPoint/{id}/placeTypes`
- `GET /StopPoint/{id}/Crowding/{line}`
- `GET /StopPoint/Type/{types}`
- `GET /StopPoint/Type/{types}/page/{page}`
- `GET /StopPoint/ServiceTypes`
- `GET /StopPoint/{id}/Arrivals`
- `GET /StopPoint/{id}/ArrivalDepartures`
- `GET /StopPoint/{id}/CanReachOnLine/{lineId}`
- `GET /StopPoint/{id}/Route`
- `GET /StopPoint/Mode/{modes}/Disruption`
- `GET /StopPoint/{ids}/Disruption`
- `GET /StopPoint/{id}/DirectionTo/{toStopPointId}`
- `GET /StopPoint`
- `GET /StopPoint/Mode/{modes}`
- `GET /StopPoint/Search/{query}`
- `GET /StopPoint/Search`
- `GET /StopPoint/Sms/{id}`
- `GET /StopPoint/{stopPointId}/TaxiRanks`
- `GET /StopPoint/{stopPointId}/CarParks`

### TravelTime (2)
- `GET /TravelTimes/overlay/{z}/mapcenter/{mapCenterLat}/{mapCenterLon}/pinlocation/{pinLat}/{pinLon}/dimensions/{width}/{height}`
- `GET /TravelTimes/compareOverlay/{z}/mapcenter/{mapCenterLat}/{mapCenterLon}/pinlocation/{pinLat}/{pinLon}/dimensions/{width}/{height}`

### Vehicle (1)
- `GET /Vehicle/{ids}/Arrivals`

## Family-specific notes from the official docs
- `Journey` is the main journey-planner family. The primary route uses `from` and `to` path variables plus many optional planning controls such as accessibility, walking, cycling, and alternative-route settings.
- `Line`, `Mode`, and `StopPoint` are the densest route families and cover network metadata, routes, timetables, status, disruptions, arrivals, crowding, and station-reachability queries.
- `Occupancy` focuses on bike points, car parks, and charge connectors.
- `Place` covers general place search, place metadata, postcode-linked street lookup, polygon intersection checks, and overlay generation.
- `Road` covers managed roads, road status, disrupted streets, and road-disruption metadata.
- `TravelTime` is limited to two overlay endpoints that combine zoom / map-center / pin-location path variables with comparison query controls.
- `Vehicle` currently exposes a single arrivals lookup by vehicle ID list.

## Sources inspected
- `https://api.tfl.gov.uk/`
- `https://api.tfl.gov.uk/swagger/ui/index.html?url=/swagger/docs/v1`
- `https://api.tfl.gov.uk/swagger/docs/v1`
- live request during review: `https://api.tfl.gov.uk/AirQuality`
