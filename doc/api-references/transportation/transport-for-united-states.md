# Transport for United States

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-united-states`
- Official docs used manually:
  - `https://retro.umoiq.com/xmlFeedDocs/NextBusXMLFeed.pdf`
  - `https://retro.umoiq.com/service/publicXMLFeed?command=agencyList`
- Base URL: `https://retro.umoiq.com/service/publicXMLFeed`
- Authentication: none documented
- Primary response format: XML
- Transport scope documented here: Umo IQ / NextBus public XML feed for agency discovery, route configuration, predictions, schedules, messages, and vehicle locations

## Important official usage notes
- The PDF says the feed is intended to change as little as possible, but clients should ignore newly added XML elements and properties.
- The docs recommend gzip compression via `Accept-Encoding: gzip, deflate` and note that browsers already request compressed content automatically.
- The feed is licensed for Umo IQ customers and may be terminated or limited at any time; no public support is promised except for parties with written contracts.
- The PDF says polling commands such as vehicle locations should be run at most once every 10 seconds.
- The `command` query parameter selects the operation; most commands also require an agency tag through `a=<agency_tag>`.
- The live `agencyList` endpoint responded with `200` and `text/xml;charset=UTF-8` during review.

## Rate limits, pagination, and errors
- The official limitations section currently lists these caps:
  - maximum characters per requester (IP address): `2MB/20sec`
  - maximum routes per `routeConfig` request: `100`
  - maximum stops per route for `predictionsForMultiStops`: `150`
  - maximum number of predictions per stop for prediction commands: `5`
  - maximum timespan for `vehicleLocations`: `5min`
- No pagination parameters are documented for the confirmed commands.
- Commands can return an `<Error>` XML object inside `<body>`.
- The `<Error>` element includes `shouldRetry`.
- If `shouldRetry="true"`, the docs say the client should wait 10 seconds and retry because the server is still initializing.
- If `shouldRetry="false"`, the docs say retrying will not fix the problem because the URL parameters are bad.

## Confirmed API surface
The official PDF documents 9 GET operations, all on the same endpoint and differentiated by the `command` query parameter:
1. `GET /service/publicXMLFeed?command=agencyList`
2. `GET /service/publicXMLFeed?command=routeList`
3. `GET /service/publicXMLFeed?command=routeConfig`
4. `GET /service/publicXMLFeed?command=predictions`
5. `GET /service/publicXMLFeed?command=predictionsForMultiStops`
6. `GET /service/publicXMLFeed?command=schedule`
7. `GET /service/publicXMLFeed?command=messages`
8. `GET /service/publicXMLFeed?command=vehicleLocations`
9. `GET /service/publicXMLFeed?command=vehicleLocation`

## Common request and response notes
- All confirmed routes are GET requests under the same path, with behavior determined by `command`.
- The docs' example agency tag is `sf-muni`; applications should first call `agencyList` to obtain valid agency tags.
- Titles can optionally be shortened with `useShortTitles=true` for some commands.
- `routeConfig` can be expanded with `verbose` to include non-`useForUI` directions and reduced with `terse` to omit bulky path data.
- Prediction responses are grouped by `<direction>` and can include `<message>` elements for passenger-facing status text.
- `predictions` returns at most 5 predictions per direction / stop and provides `seconds`, `minutes`, and `epochTime`.
- `messages` supports repeated `r` parameters to request specific routes; omitting `r` returns all messages.
- `vehicleLocations` returns only changes since the supplied `t` timestamp and includes a `<lastTime>` marker for incremental polling.
- The PDF explicitly says an arrival/departure times request exists but is not intended for the public and is not documented; it is not counted here.

## 1) List available agencies
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=agencyList`
- Purpose: return all available agencies and the agency tags needed by the other commands

Documented parameters:
- `command=agencyList` - required query parameter selecting the agency-list command

Documented response notes:
- Returns `<agency>` elements inside `<body>`
- Agency attributes include `tag`, `title`, `regionTitle`, and optional `shortTitle`
- The live endpoint returned XML with agency rows such as `jhu-apl`, `ccrta`, and `west-hollywood`

## 2) List routes for an agency
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=routeList&a={agency_tag}`
- Purpose: return all routes for a given agency

Documented parameters:
- `command=routeList` - required command selector
- `a` - required agency tag from `agencyList`

Documented response notes:
- Returns `<route>` elements with attributes including `tag`, `title`, and optional `shortTitle`
- Route tags are the identifiers later used by `routeConfig`, `predictions`, `schedule`, `messages`, and `vehicleLocations`

## 3) Get route configuration
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=routeConfig&a={agency_tag}&r={route_tag}`
- Purpose: return route metadata, stops, directions, and path geometry

Documented parameters:
- `command=routeConfig` - required command selector
- `a` - required agency tag
- `r` - optional route tag; if omitted, the docs say all routes for the agency are returned, subject to the 100-route cap
- `verbose` - optional flag to include directions that are not marked `useForUI`
- `terse` - optional flag to omit path data and reduce payload size

Documented response notes:
- Route attributes include `tag`, `title`, optional `shortTitle`, `color`, `oppositeColor`, `latMin`, `latMax`, `lonMin`, and `lonMax`
- Stop attributes include `tag`, `title`, optional `shortTitle`, `lat`, `lon`, and optional numeric `stopId`
- Direction attributes include `tag`, `title`, optional `name`, and `useForUI`
- Paths are returned as `<path>` collections of `<point lat="..." lon="..."/>`

## 4) Get predictions for one stop
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL by stop ID: `https://retro.umoiq.com/service/publicXMLFeed?command=predictions&a={agency_tag}&stopId={stop_id}`
- Alternate full URL by route + stop tag: `https://retro.umoiq.com/service/publicXMLFeed?command=predictions&a={agency_tag}&r={route_tag}&s={stop_tag}`
- Purpose: return realtime predictions for one physical stop or one route/stop pair

Documented parameters:
- `command=predictions` - required command selector
- `a` - required agency tag
- `stopId` - optional numeric stop ID lookup mode; can represent multiple physical stops at a terminal
- `routeTag` - optional route restriction when using `stopId`
- `r` - optional route tag when using stop-tag lookup mode
- `s` - optional stop tag when using route + stop-tag lookup mode
- `useShortTitles=true` - optional response-shortening flag

Documented response notes:
- Top-level `<predictions>` attributes can include `agencyTitle`, `routeTag`, `routeTitle`, `stopTitle`, and `dirTitleBecauseNoPredictions`
- Nested `<direction>` groups separate predictions by destination
- `<prediction>` attributes can include `seconds`, `minutes`, `epochTime`, `isDeparture`, `block`, `dirTag`, `tripTag`, `branch`, `affectedByLayover`, `isScheduleBased`, `delayed`, and experimental `slowness`
- `<message text="..."/>` elements can accompany predictions

## 5) Get predictions for multiple stops
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=predictionsForMultiStops&a={agency_tag}&stops={route_tag}|{stop_tag}&stops={route_tag}|{stop_tag}`
- Purpose: return predictions for multiple stops in one request

Documented parameters:
- `command=predictionsForMultiStops` - required command selector
- `a` - required agency tag
- `stops` - required repeated parameter; each value is `{route_tag}|{stop_tag}`
- `useShortTitles=true` - optional response-shortening flag

Documented response notes:
- The docs say this command currently supports only stop tags, not stop IDs
- Output is grouped by `<direction>` with nested `<predictions>` blocks per stop
- The route-wide limit is 150 stops per route for this command

## 6) Get a route schedule table
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=schedule&a={agency_tag}&r={route_tag}`
- Purpose: return scheduled times for a route in a table-like XML structure

Documented parameters:
- `command=schedule` - required command selector
- `a` - required agency tag
- `r` - required route tag

Documented response notes:
- Top-level `<route>` attributes include `tag`, `title`, `scheduleClass`, `serviceClass`, and `direction`
- `<header>` contains ordered stop tags and display names
- Each `<tr blockID="...">` row contains `<stop tag="..." epochTime="...">HH:mm:ss</stop>` schedule cells
- For stops not served by a trip, `epochTime` is `-1` and the cell content is `---`

## 7) Get active messages
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=messages&a={agency_tag}&r={route_tag1}&r={route_tag2}`
- Purpose: return currently active service messages for an agency or selected routes

Documented parameters:
- `command=messages` - required command selector
- `a` - required agency tag
- `r` - optional repeated route tag filter; omit to return messages for all routes

Documented response notes:
- Messages are grouped by route, with system-wide messages under route tag `all`
- `<message>` can include `id`, `creator`, `startBoundary`, `startBoundaryStr`, `endBoundary`, `endBoundaryStr`, and optional `sendToBuses`
- Message content can include `<text>`, `<textSecondaryLanguage>`, `<phonemeText>`, optional `<smsText>`, optional `<priority>`, and optional interval windows
- Messages targeted to certain routes or stops include `<routeConfiguredForMessage>` and nested `<stop>` elements

## 8) Get changed vehicle locations since a timestamp
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=vehicleLocations&a={agency_tag}&r={route_tag}&t={epoch_msec}`
- Purpose: return vehicle locations that changed since the provided timestamp

Documented parameters:
- `command=vehicleLocations` - required command selector
- `a` - required agency tag
- `r` - required route tag
- `t` - required timestamp in milliseconds since the Unix epoch; `0` returns the last 15 minutes of data

Documented response notes:
- Vehicle attributes include `id`, `routeTag`, `dirTag`, `lat`, `lon`, `secsSinceReport`, `predictable`, `heading`, and `speedKmHr`
- The response includes `<lastTime time="..."/>` for incremental polling
- The maximum documented timespan for this command is 5 minutes

## 9) Get a single vehicle location
- Method: `GET`
- Path: `/service/publicXMLFeed`
- Full URL: `https://retro.umoiq.com/service/publicXMLFeed?command=vehicleLocation&a={agency_tag}&v={vehicle_id}`
- Purpose: return the current location record for one vehicle

Documented parameters:
- `command=vehicleLocation` - required command selector
- `a` - required agency tag
- `v` - required vehicle ID

Documented response notes:
- Returns a single `<vehicle>` element inside `<body>`
- Vehicle attributes are the same documented set used by `vehicleLocations`, except the PDF does not repeat `speedKmHr` in the single-vehicle example section

## Sources inspected
- `https://retro.umoiq.com/xmlFeedDocs/NextBusXMLFeed.pdf`
- `https://retro.umoiq.com/service/publicXMLFeed?command=agencyList`
