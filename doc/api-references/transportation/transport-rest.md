# transport.rest

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-rest`
- Official docs used manually:
  - `https://transport.rest/`
  - `https://v6.db.transport.rest/`
  - `https://v6.db.transport.rest/api.html`
- Provider family site: `transport.rest` lists multiple operator-specific deployments
- Public deployment manually documented here: `v6.db.transport.rest`
- Base URL documented for the captured deployment: `https://v6.db.transport.rest`
- Response format: JSON
- Auth model: none
- Rate limit documented on API page: `100 requests/minute` with burst `200 requests/minute`

## Service-family notes
The landing page at `https://transport.rest/` lists multiple operator/region-specific deployments, including:
- `v6.db.transport.rest` (Deutsche Bahn / Germany)
- `poland.transport.rest`
- `v6.vbb.transport.rest`
- `v6.bvg.transport.rest`
- `1.flixbus.transport.rest`
- `v1.nottingham-city.transport.rest`

The official API documentation page with route-level details was available for `v6.db.transport.rest`, so this file documents that live public deployment as the concrete transport.rest surface manually verified in this pass.

## Confirmed API surface
The official route list on `https://v6.db.transport.rest/api.html` includes:
- `GET /stops/:id`
- `GET /stops/:id/departures`
- `GET /stops/:id/arrivals`
- `GET /journeys`
- `GET /trips/:id`
- `GET /locations/nearby`
- `GET /locations`
- `GET /journeys/:ref`
- `GET /stations/:id`
- `GET /stations`

## Common request/response notes
- No authentication is required.
- Data is returned as JSON.
- Query parameter `pretty=true` is documented across routes to pretty-print responses.
- Query parameter `language` defaults to `en` across the documented routes.
- Query parameter `profile` defaults to `dbnav` and selects the `db-vendo-client` profile.
- Date/time inputs accept:
  - human-relative values parseable by `parse-human-relative-time` (example in docs: `tomorrow 2pm`)
  - ISO 8601 date/time strings
  - UNIX timestamps

## 1) Search locations
- Method: `GET`
- Path: `/locations`
- Full URL: `https://v6.db.transport.rest/locations`
- Purpose: find stops, stations, POIs, and addresses matching a text query

Documented query parameters:
- `query` - required search string
- `fuzzy` - boolean, default `true`
- `results` - integer, default `10`
- `stops` - boolean, default `true`
- `addresses` - boolean, default `true`
- `poi` - boolean, default `true`
- `linesOfStops` - boolean, default `false`
- `language` - string, default `en`
- `profile` - string, default `dbnav`
- `pretty` - boolean, default `true`

## 2) Stop details
- Method: `GET`
- Path: `/stops/{id}`
- Full URL pattern: `https://v6.db.transport.rest/stops/{id}`
- Purpose: fetch details for one stop/station

Path parameter:
- `id` - stop/station identifier

Documented query parameters:
- `linesOfStops` - boolean, default `false`
- `language` - default `en`
- `profile` - default `dbnav`
- `pretty` - default `true`

## 3) Stop departures
- Method: `GET`
- Path: `/stops/{id}/departures`
- Full URL pattern: `https://v6.db.transport.rest/stops/{id}/departures`
- Purpose: departures board for a stop

Path parameter:
- `id` - stop/station identifier

Documented query parameters:
- `when` - date/time, default `now`
- `direction` - string filter
- `duration` - integer minutes, default `10`
- `results` - maximum departures
- `linesOfStops` - boolean, default `false`
- `remarks` - boolean, default `true`
- `language` - default `en`
- `includeRelatedStations` - boolean, default `true`
- `stopovers` - boolean, default `false`
- `moreStops` - comma-separated additional station evaNumbers, up to 9, with profile caveats noted in docs
- `profile` - default `dbnav`
- mode filters such as `nationalExpress`, `national`, `regionalExpress`, `regional` are documented further down the page

## 4) Stop arrivals
- Method: `GET`
- Path: `/stops/{id}/arrivals`
- Full URL pattern: `https://v6.db.transport.rest/stops/{id}/arrivals`
- Purpose: arrivals board for a stop

Path parameter:
- `id` - stop/station identifier

Documented query parameters mirror departures:
- `when`
- `direction`
- `duration`
- `results`
- `linesOfStops`
- `remarks`
- `language`
- `includeRelatedStations`
- `stopovers`
- `moreStops`
- `profile`
- mode filters by service type

## 5) Journey planning
- Method: `GET`
- Path: `/journeys`
- Full URL: `https://v6.db.transport.rest/journeys`
- Purpose: compute public-transit journeys between two locations

Core documented query parameters:
- `from` - origin
- `to` - destination
- `departure` - departure date/time; mutually exclusive with `arrival`
- `arrival` - arrival date/time; mutually exclusive with `departure`
- `earlierThan` - pagination/ref cursor for earlier journeys
- `laterThan` - pagination/ref cursor for later journeys
- `results` - max number of journeys, default `3`
- `stopovers` - boolean, default `false`
- `transfers` - integer maximum transfers
- `transferTime` - minimum transfer time in minutes, default `0`
- `accessibility` - docs mention `partial` or `complete`
- `bike` - boolean, default `false`
- `startWithWalking` - boolean, default `true`

## 6) Refresh journey by reference
- Method: `GET`
- Path: `/journeys/{ref}`
- Full URL pattern: `https://v6.db.transport.rest/journeys/{ref}`
- Purpose: rehydrate/refresh a specific journey using a journey reference

Path parameter:
- `ref` - journey reference

Documented query parameters:
- `stopovers` - boolean, default `false`
- `tickets` - boolean, default `false`
- `polylines` - boolean, default `false`
- `subStops` - boolean, default `true`
- `entrances` - boolean, default `true`
- `remarks` - boolean, default `true`
- `scheduledDays` - boolean, default `false`
- `language` - default `en`
- `firstClass` - boolean, default `false`
- `loyaltyCard` - string, default `none`
- `age` - integer traveler age; default shown as adult in docs

## 7) Trip details
- Method: `GET`
- Path: `/trips/{id}`
- Full URL pattern: `https://v6.db.transport.rest/trips/{id}`
- Purpose: detailed trip data for a single trip instance

Path parameter:
- `id` - trip identifier

Documented query parameters:
- `stopovers` - boolean, default `true`
- `remarks` - boolean, default `true`
- `polyline` - boolean, default `false`
- `language` - default `en`
- `profile` - default `dbnav`
- `pretty` - default `true`

## 8) Station search
- Method: `GET`
- Path: `/stations`
- Full URL: `https://v6.db.transport.rest/stations`
- Purpose: search stations by name

Documented query parameters:
- `query` - station-name search string
- `limit` - number, default `3`
- `fuzzy` - boolean, default `false`
- `completion` - boolean, default `true`

## 9) Station details
- Method: `GET`
- Path: `/stations/{id}`
- Full URL pattern: `https://v6.db.transport.rest/stations/{id}`
- Purpose: fetch a single station record

Path parameter:
- `id` - station identifier

Notes:
- this route is separately listed by the provider from `/stops/{id}`
- the route list confirms it as a first-class endpoint even though the top of the docs page focuses more heavily on stop and journey routes

## 10) Nearby locations
- Method: `GET`
- Path: `/locations/nearby`
- Full URL: `https://v6.db.transport.rest/locations/nearby`
- Purpose: find nearby stops, stations, and optionally POIs around coordinates

Documented query parameters:
- `latitude` - required number
- `longitude` - required number
- `results` - integer, default `8`
- `distance` - maximum walking distance in meters
- `stops` - boolean, default `true`
- `poi` - boolean, default `false`
- `linesOfStops` - boolean, default `false`
- `language` - default `en`
- `profile` - default `dbnav`
- `pretty` - default `true`

## Response notes
- Example payloads show rich transit objects with fields such as `type`, `id`, `name`, `location`, and `products`.
- Stop/journey/trip responses can optionally include stopovers, remarks, polylines, entrances, and ticket information depending on flags.
- The docs emphasize that these routes wrap underlying `hafas-client@6` methods.

## Operational notes from provider docs
- The operator-specific docs page warns that the underlying DB APIs currently have much lower rate limits than older HAFAS APIs.
- The docs suggest considering GTFS/GTFS-RT or other APIs for some use cases.
- CORS support, `ETag`, and `Cache-Control` are explicitly highlighted.

## Canonical fireROUTE notes
- Treat `transport.rest` as a provider family with multiple deployment hosts; this file documents the DB deployment because it is the officially linked route-documented instance.
- Most routes are read-only GET endpoints with shared `language`, `profile`, and `pretty` conventions.
- Time parameters are unusually flexible and may need normalization before upstream calls.
- `journeys` and `journeys/{ref}` should be treated as related but distinct operations: one computes, the other refreshes.

## Verification notes
This file was manually rebuilt from the live official transport.rest landing page and the live `v6.db.transport.rest` API documentation using browser tools.