# Transport for Spain

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-spain`
- Official docs used manually in this pass:
  - `https://data.renfe.com/`
  - `https://data.renfe.com/dataset/posicion-vehiculos-av-ld-md/resource/dec31ddc-dcd4-4834-9907-70824c87e1bf`
  - `https://data.renfe.com/dataset/horarios-viaje-alta-velocidad-larga-media-distancia/resource/d772c2a8-26e8-4419-b25a-5967fe279c8f`
  - `https://data.renfe.com/dataset/incidencias-avisos/resource/3634402c-4972-4007-8bf0-42d33aeb1b68`
  - `https://data.renfe.com/dataset/incidencias-avisos/resource/839f1841-1e24-4e47-a7ce-a5d8e62d8a16`
- Provider identified from the official pages as: `Renfe Data`
- Base URL: `https://gtfsrt.renfe.com`
- Authentication: none shown on the inspected official Renfe resource pages; all confirmed resource URLs were publicly reachable in-browser without login during review
- Primary response formats: JSON and GTFS Realtime Protocol Buffer (`.pb`)
- License shown on the inspected official resource pages: `Creative Commons Attribution 4.0`

## Important official usage notes
- Renfe's official open-data portal exposes these transport-data resources directly from `https://gtfsrt.renfe.com`.
- The home page groups the transport datasets under categories such as `Tiempo real`, `Estaciones`, `Horarios`, and `Avisos`.
- The official resource pages publish per-resource update cadence notes:
  - vehicle positions: updated every `15 minutes`
  - trip updates / travel schedules: updated every `30 seconds`
  - alerts / incidents: updated every `20 seconds`
- The JSON feeds that were opened directly in-browser all expose a GTFS-Realtime-style envelope with a top-level `header` and `entity` array.
- The inspected official alert resource page also publishes a GTFS-RT protocol-buffer variant of the alerts feed.

## Rate limits, pagination, and errors
- No public rate-limit or quota table was published on the inspected Renfe portal pages.
- No pagination parameters are documented for any confirmed route; each confirmed URL is a direct feed URL.
- No shared error schema or non-200 response documentation was published on the inspected resource pages.
- The `.pb` feed is exposed as a downloadable GTFS-RT binary resource rather than an HTML preview page.

## Confirmed API surface
The inspected official Renfe resource pages currently expose 4 public GET routes:
1. `GET /vehicle_positions_LD.json`
2. `GET /trip_updates_LD.json`
3. `GET /alerts.json`
4. `GET /alerts.pb`

## Common request and response notes
- All confirmed routes are read-only `GET` downloads.
- No request parameters were documented on the inspected official resource pages.
- The JSON feeds are served as `application/json` and expose GTFS-Realtime-style objects.
- Observed JSON top-level fields include `header.gtfsRealtimeVersion`, `header.timestamp`, and `entity` arrays.
- The observed GTFS-Realtime version in the live JSON feeds was `2.0` during review.

## 1) Get high-speed / long-distance / medium-distance vehicle positions
- Method: `GET`
- Path: `/vehicle_positions_LD.json`
- Full URL: `https://gtfsrt.renfe.com/vehicle_positions_LD.json`
- Purpose: return real-time train-position data for `Alta Velocidad`, `Larga Distancia`, and `Media Distancia` services

Documented parameters:
- None documented on the inspected official resource page

Documented response notes:
- Official resource page format: `application/json`
- Official resource page says the data is updated every `15 minutes`
- The live JSON opened in-browser during review included:
  - `header.gtfsRealtimeVersion`
  - `header.timestamp`
  - `entity[].vehicle.trip.tripId`
  - `entity[].vehicle.position.latitude`
  - `entity[].vehicle.position.longitude`
  - `entity[].vehicle.currentStatus`
  - `entity[].vehicle.stopId`
  - `entity[].vehicle.vehicle.id`
  - `entity[].vehicle.vehicle.label`

## 2) Get high-speed / long-distance / medium-distance trip updates
- Method: `GET`
- Path: `/trip_updates_LD.json`
- Full URL: `https://gtfsrt.renfe.com/trip_updates_LD.json`
- Purpose: return travel-schedule / trip-update information for `Alta Velocidad`, `Larga Distancia`, and `Media Distancia` services

Documented parameters:
- None documented on the inspected official resource page

Documented response notes:
- Official resource page format: `application/json`
- Official resource page says the data is updated every `30 seconds`
- The live JSON opened in-browser during review included:
  - `header.gtfsRealtimeVersion`
  - `header.timestamp`
  - `entity[].tripUpdate.trip.tripId`
  - `entity[].tripUpdate.trip.scheduleRelationship`
  - `entity[].tripUpdate.delay`

## 3) Get incidents and alerts as JSON
- Method: `GET`
- Path: `/alerts.json`
- Full URL: `https://gtfsrt.renfe.com/alerts.json`
- Purpose: return incidents / service alerts for Cercanías services as JSON

Documented parameters:
- None documented on the inspected official resource page

Documented response notes:
- Official resource page format: `application/json`
- Official resource page says the data is updated every `20 seconds`
- The live JSON opened in-browser during review included:
  - `header.gtfsRealtimeVersion`
  - `header.timestamp`
  - `entity[].alert.activePeriod[].start`
  - `entity[].alert.informedEntity[].routeId`
  - `entity[].alert.descriptionText.translation[].text`
  - `entity[].alert.descriptionText.translation[].language`

## 4) Get incidents and alerts as GTFS-Realtime Protocol Buffer
- Method: `GET`
- Path: `/alerts.pb`
- Full URL: `https://gtfsrt.renfe.com/alerts.pb`
- Purpose: download the incidents / alerts feed in GTFS-Realtime binary format

Documented parameters:
- None documented on the inspected official resource page

Documented response notes:
- Official resource page format label: `GTFS-RT`
- Official resource page says the data is updated every `20 seconds`
- Direct navigation to this URL initiated a file download in the browser during review (`isDownload: true`), consistent with a binary GTFS-Realtime feed

## Sources inspected
- `https://data.renfe.com/`
- `https://data.renfe.com/dataset/posicion-vehiculos-av-ld-md/resource/dec31ddc-dcd4-4834-9907-70824c87e1bf`
- `https://data.renfe.com/dataset/horarios-viaje-alta-velocidad-larga-media-distancia/resource/d772c2a8-26e8-4419-b25a-5967fe279c8f`
- `https://data.renfe.com/dataset/incidencias-avisos/resource/3634402c-4972-4007-8bf0-42d33aeb1b68`
- `https://data.renfe.com/dataset/incidencias-avisos/resource/839f1841-1e24-4e47-a7ce-a5d8e62d8a16`
- `https://gtfsrt.renfe.com/vehicle_positions_LD.json`
- `https://gtfsrt.renfe.com/trip_updates_LD.json`
- `https://gtfsrt.renfe.com/alerts.json`
- `https://gtfsrt.renfe.com/alerts.pb`
