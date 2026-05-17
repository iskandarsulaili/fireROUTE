# Transport for Hessen, Germany

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-hessen-germany`
- Official docs used manually:
  - `https://opendata.rmv.de/site/start.html`
  - `https://www.rmv.de/s/de/rmv-open-data`
  - `https://www.rmv.de/hapi/`
  - route WADLs linked from the official HAPI index, for example `https://www.rmv.de/hapi/trip?wadl`
- Base URL: `https://www.rmv.de/hapi`
- Authentication: required `accessId` query parameter on every confirmed route; the official RMV Open Data page says developers must request an access key (`API-Zugang anfordern`)
- Primary response formats:
  - XML by default when neither `format` nor `Accept` is supplied
  - JSON when requested with `format=json` or an appropriate `Accept` header
  - JSONP when `jsonpCallback` is supplied on supported routes
- Transport scope documented here: RMV HAFAS journey planning, station lookup, nearby-stop lookup, arrival/departure boards, disruption search, download listing, and journey reconstruction

## Important official usage notes
- The public RMV Open Data page says RMV provides stop infrastructure data plus an access key for the RMV API.
- The same page links directly to `https://www.rmv.de/hapi/` for detailed API request options.
- The HAPI index exposes 10 GET routes through official WADL documents.
- The WADL documents show a shared query model across most routes: `accessId`, optional `requestId`, optional `format`, optional `jsonpCallback`, and optional `lang`.
- The HAPI WADLs repeatedly describe XML as the default format when neither `format` nor `Accept` is supplied.
- Live testing of `location.name` with an invalid key returned HTTP `401` and a JSON error body with `serverVersion`, `dialectVersion`, `errorCode`, `errorText`, and `requestId`.

## Rate limits, pagination, and errors
- No public numeric rate-limit or quota table was exposed on the inspected RMV Open Data page or HAPI index.
- No page-number or cursor pagination scheme is documented.
- Instead, route-specific result-window controls are used:
  - board routes use `duration` and `maxJourneys`
  - nearby/name lookup routes use `maxNo`
  - trip search uses `context` for forward/backward scrolling
- The official WADLs do not publish a full provider-wide error catalog.
- A live invalid-key request returned this documented structure in practice: `401` with JSON fields `serverVersion`, `dialectVersion`, `errorCode`, `errorText`, and `requestId`.

## Confirmed API surface
The official HAPI index currently exposes 10 authenticated GET routes:
1. `GET /arrivalBoard`
2. `GET /departureBoard`
3. `GET /downloads`
4. `GET /downloads/{files}`
5. `GET /himsearch`
6. `GET /journeyDetail`
7. `GET /location.nearbystops`
8. `GET /location.name`
9. `GET /recon`
10. `GET /trip`

## Common request and response notes
- Every confirmed route requires `accessId`.
- Most routes also support:
  - `requestId` for caller-side request correlation
  - `format` to choose the response format
  - `jsonpCallback` for JSONP wrapping
  - `lang` with default `de`
- Most route families are lookup/search endpoints rather than paginated collections.
- Boards and trip-style responses expose windowing or scrolling controls instead of classic page numbers.
- `trip`, `recon`, and `journeyDetail` support optional geometry output through `poly` and `polyEnc`.

## 1) Get arrival boards
- Method: `GET`
- Path: `/arrivalBoard`
- Full URL: `https://www.rmv.de/hapi/arrivalBoard`
- Purpose: return arrivals for a station, mast, or equivalent-stop grouping

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Stop selector: `id` or deprecated `extId` (one is required)
- Time window: `date`, `time`, `dur`, `duration`, `maxJourneys`
- Filtering: `direction`, `products`, `operators`, `categories`, `lines`, `attributes`, `platforms`
- Additional options: `passlist`, `passlistMaxStops`, `minDur`, `baim`, `rtMode`
- Required board type parameter: `type` with documented variants `ARR`, `ARR_EQUIVS`, `ARR_MAST`, `ARR_STATION`

Documented response notes:
- XML is the default response when no format is requested
- JSON and JSONP are explicitly supported
- The WADL describes this as an arrival-board endpoint over a configurable time interval

## 2) Get departure boards
- Method: `GET`
- Path: `/departureBoard`
- Full URL: `https://www.rmv.de/hapi/departureBoard`
- Purpose: return departures for a station, mast, or equivalent-stop grouping

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Stop selector: `id` or deprecated `extId` (one is required)
- Time window: `date`, `time`, `dur`, `duration`, `maxJourneys`
- Filtering: `direction`, `products`, `operators`, `categories`, `lines`, `attributes`, `platforms`
- Additional options: `passlist`, `passlistMaxStops`, `minDur`, `baim`, `rtMode`
- Required board type parameter: `type` with documented variants `DEP`, `DEP_EQUIVS`, `DEP_MAST`, `DEP_STATION`

Documented response notes:
- XML is the documented default
- JSON and JSONP are explicitly supported
- The route mirrors the arrival-board option set but for departures

## 3) List downloadable files
- Method: `GET`
- Path: `/downloads`
- Full URL: `https://www.rmv.de/hapi/downloads`
- Purpose: list downloadable files exposed through the HAPI installation

Documented parameters:
- `accessId` - required query string API key

Documented response notes:
- The route is exposed from the official HAPI index as a standalone download-listing endpoint
- The WADL does not document additional filter or paging parameters

## 4) Download a named file
- Method: `GET`
- Path: `/downloads/{files}`
- Full URL: `https://www.rmv.de/hapi/downloads/{files}`
- Purpose: download one specific file from the HAPI downloads collection

Documented parameters:
- Path parameter `files` - file identifier in the route path
- `accessId` - required query string API key

Documented response notes:
- This route is the per-file companion to `/downloads`
- No extra query filters beyond `accessId` are documented in the WADL

## 5) Search HIM disruptions
- Method: `GET`
- Path: `/himsearch`
- Full URL: `https://www.rmv.de/hapi/himsearch`
- Purpose: search disruption / incident / traffic-message records

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Time filters: `dateB`, `dateE`, `timeB`, `timeE`, `weekdays`
- ID and categorisation filters: `himIds`, `operators`, `categories`, `channels`, `companies`, `lines`, `lineids`, `himcategory`, `himtags`, `himtext`, `himtexttags`, `additionalfields`
- Geography and station filters: `stations`, `fromstation`, `tostation`, `bothways`, `llLat`, `llLon`, `urLat`, `urLon`, `regions`
- Other options: `hierarchicalView`, `trainnames`, `metas`, `extInfo`, `poly`, `polyEnc`, `searchmode`, `affectedJourneyMode`, `affectedJourneyStopMode`, `orderBy`, `minprio`, `maxprio`

Documented response notes:
- The route supports both structured message filters and optional geo output
- The WADL presents this as the official disruption-search family for RMV HAPI

## 6) Get journey details
- Method: `GET`
- Path: `/journeyDetail`
- Full URL: `https://www.rmv.de/hapi/journeyDetail`
- Purpose: retrieve the full detail for one internal journey id

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Required selector: `id` for the internal journey id
- Optional detail controls: `date`, `poly`, `polyEnc`, `showPassingPoints`, `rtMode`, `fromId`, `fromIdx`, `toId`, `toIdx`, `baim`

Documented response notes:
- Supports full or partial itinerary detail, plus optional geometry and passing-point output
- The WADL documents this route as detail lookup for a previously discovered journey id

## 7) Search nearby stops by coordinate
- Method: `GET`
- Path: `/location.nearbystops`
- Full URL: `https://www.rmv.de/hapi/location.nearbystops`
- Purpose: return stops and related locations near a coordinate

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Required coordinates: `originCoordLat`, `originCoordLong`
- Result controls: `r` radius in meters, `maxNo`, `type`, `locationSelectionMode`
- Optional filters: `products`, `meta`, `sattributes`, `sinfotexts`, `poolId`, `date`, `time`, `zoom`

Documented response notes:
- `maxNo` defaults to `10` and is documented with range `1-1000`
- The endpoint is coordinate-centred rather than page-based

## 8) Search locations by name
- Method: `GET`
- Path: `/location.name`
- Full URL: `https://www.rmv.de/hapi/location.name`
- Purpose: search stops and related location objects by free-text name

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Required query text: `input`
- Result controls: `maxNo`, `type`, `locationSelectionMode`, `withEquivalentLocations`, `restrictSelection`, `withProducts`, `productRepresentatives`
- Optional geography and filtering: `coordLat`, `coordLong`, `r`, `refineId`, `products`, `meta`, `stations`, `sattributes`, `sinfotexts`, `filterMode`, `poolId`, `withMastNames`

Documented response notes:
- `input` is the only required route-specific parameter
- The endpoint can refine or geo-bias results with coordinate and refinement parameters

## 9) Reconstruct a journey
- Method: `GET`
- Path: `/recon`
- Full URL: `https://www.rmv.de/hapi/recon`
- Purpose: reconstruct a journey from a context token

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Required reconstruction token: `ctx`
- Optional geometry and realtime options: `poly`, `polyEnc`, `date`, `passlist`, `showPassingPoints`, `rtMode`, `baim`
- Optional matching / reconstruction controls: `useCombinedComparison`, `acceptGaps`, `allowDummySections`, `flagAllNonReachable`, `matchCatStrict`, `matchIdNonBlank`, `matchIdStrict`, `matchNumStrict`, `matchRtType`, `enableRtFullSearch`, `enableReplacements`
- Optional deviation and enrichment controls: `arrL`, `arrU`, `depL`, `depU`, `eco`, `ecoCmp`, `ecoParams`, `tariff`, `trafficMessages`, `travellerProfileData`, `withJourneyBoundaryPoints`, `freq`

Documented response notes:
- The route is designed for context-based itinerary reconstruction rather than fresh trip search
- It supports optional tariff, traffic-message, and geometry enrichment

## 10) Search trips
- Method: `GET`
- Path: `/trip`
- Full URL: `https://www.rmv.de/hapi/trip`
- Purpose: search journeys between origins and destinations with rich transport and routing controls

Documented parameters:
- Common parameters: `accessId`, optional `requestId`, `format`, `jsonpCallback`, `lang`
- Origin selectors: `originId`, deprecated `originExtId`, `originCoordLat`, `originCoordLong`, `originCoordName`, `originCoordType`
- Destination selectors: `destId`, deprecated `destExtId`, `destCoordLat`, `destCoordLong`, `destCoordName`, `destCoordType`
- Via / avoidance controls: `via`, `viaId`, `viaWaitTime`, `avoid`, `avoidId`, `viaGis`
- Search timing and result-window controls: `date`, `time`, `searchForArrival`, `numF`, `numB`, `context`
- Transfer and filtering controls: `changeTimePercent`, `minChangeTime`, `maxChangeTime`, `addChangeTime`, `maxChange`, `products`, `operators`, `categories`, `categoryFlags`, `attributes`, `sattributes`, `fattributes`, `lines`, `lineids`
- Modal / routing options: `originWalk`, `originBike`, `originCar`, `originTaxi`, `originPark`, `originMeta`, `destWalk`, `destBike`, `destCar`, `destTaxi`, `destPark`, `destMeta`, `totalWalk`, `totalBike`, `totalCar`, `totalTaxi`, `totalMeta`, `gisProducts`, `includeIv`, `ivOnly`, `mobilityProfile`, `bikeCarriage`, `bikeCarriageType`, `sleepingCar`, `couchetteCoach`
- Additional enrichment / optimisation controls: `poly`, `polyEnc`, `passlist`, `showPassingPoints`, `baim`, `eco`, `ecoCmp`, `ecoParams`, `rtMode`, `unsharp`, `trainFilter`, `economic`, `allowFootpathEquivalences`, `groupFilter`, `blockingList`, `blockedEdges`, `trainComposition`, `includeEarlier`, `withICTAlternatives`, `tariff`, `trafficMessages`, `travellerProfileData`, `withFreq`, `withJourneyBoundaryPoints`

Documented response notes:
- This is the broadest confirmed route family in the RMV HAPI surface
- Scrolling through more trip results is documented via the `context` parameter
- Geometry, passlists, tariff data, traffic messages, and train composition can all be requested as optional enrichments

## Sources inspected
- `https://opendata.rmv.de/site/start.html`
- `https://www.rmv.de/s/de/rmv-open-data`
- `https://www.rmv.de/hapi/`
- `https://www.rmv.de/hapi/arrivalBoard?wadl`
- `https://www.rmv.de/hapi/departureBoard?wadl`
- `https://www.rmv.de/hapi/downloads?wadl`
- `https://www.rmv.de/hapi/downloads/%7Bfiles%7D?wadl`
- `https://www.rmv.de/hapi/himsearch?wadl`
- `https://www.rmv.de/hapi/journeyDetail?wadl`
- `https://www.rmv.de/hapi/location.nearbystops?wadl`
- `https://www.rmv.de/hapi/location.name?wadl`
- `https://www.rmv.de/hapi/recon?wadl`
- `https://www.rmv.de/hapi/trip?wadl`
