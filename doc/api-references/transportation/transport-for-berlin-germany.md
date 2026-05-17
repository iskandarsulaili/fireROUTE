# Transport for Berlin, Germany

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-berlin-germany`
- Official docs used manually:
  - `https://github.com/derhuerst/vbb-rest/blob/3/docs/index.md`
  - `https://raw.githubusercontent.com/derhuerst/vbb-rest/3/docs/index.md`
- Base URL documented by the official page: `https://3.vbb.transport.rest`
- Authentication documented by the inspected official docs: none
- Primary response format: JSON
- Additional format notes:
  - `GET /lines` is documented as `application/x-ndjson`
  - `GET /maps/:type` redirects to PDF public-transport maps
  - `GET /logos/:type` serves logo assets from the linked repository-backed logo set
- Live validation note:
  - the official docs are readable and route-level, but a direct live endpoint check against `https://3.vbb.transport.rest/stops?query=jungfernheide` failed with `net::ERR_NAME_NOT_RESOLVED` in this environment, so this document is based on the official route reference rather than successful live payload retrieval

## Important official usage notes
- The inspected docs label this API `Berlin & Brandenburg Public Transport API`.
- The same docs mark this version as `Deprecated` and tell users to use the latest version of the API.
- The published route index exposes `16` confirmed `GET` routes.
- The docs say this API returns data in `Friendly Public Transport Format 1.2.1`.
- The docs suggest using `vbb-client@3` from JavaScript to talk to this API.

## Rate limits, pagination, errors, and parameter patterns
- I did not find a published numeric rate-limit section in the inspected official docs.
- I did not find a provider-wide pagination model in the inspected official docs.
- I did not find a structured error-schema section in the inspected official docs.
- The route docs focus on route-specific filters instead of global pagination or cursor controls.
- Common documented parameter families include:
  - stop lookup/search controls such as `query`, `completion`, `fuzzy`, `id`, `name`, `coordinates.latitude`, `coordinates.longitude`, and `weight`
  - nearby/radar geospatial controls such as `latitude`, `longitude`, `north`, `west`, `south`, `east`, `distance`, `results`, `duration`, and `frames`
  - departure/journey time controls such as `when`, `arrival`, `departure`, `duration`, `transfers`, and `transferTime`
  - journey-shaping toggles such as `via`, `passedStations`, `accessibility`, `bike`, `tickets`, `transferInfo`, and product-mode flags like `suburban`, `subway`, `tram`, `bus`, `ferry`, `express`, and `regional`
  - trip/location controls such as `lineName`, `stopovers`, `remarks`, `polyline`, `language`, `poi`, and `addresses`

## Confirmed API surface
The inspected official docs currently expose these `16` GET routes.

### Stops (6)
- `GET /stops?query=…`
- `GET /stops`
- `GET /stops/nearby`
- `GET /stops/all`
- `GET /stops/:id`
- `GET /stops/:id/departures`

### Lines and shapes (3)
- `GET /lines`
- `GET /lines/:id`
- `GET /shapes/:id`

### Journeys and trips (3)
- `GET /journeys`
- `GET /journeys/legs/:ref`
- `GET /trips/:id`

### Locations and radar (2)
- `GET /locations`
- `GET /radar`

### Static assets (2)
- `GET /maps/:type`
- `GET /logos/:type`

## Route-specific notes from the official docs
- `GET /stops?query=…` requires `query`; the docs also expose `completion` and `fuzzy` toggles.
- `GET /stops` supports metadata-style filtering by `id`, `name`, `coordinates.latitude`, `coordinates.longitude`, and `weight`.
- `GET /stops/nearby` requires `latitude` and `longitude`, with optional `results`, `distance`, `stops`, and `poi`.
- `GET /stops/:id/departures` documents `when`, `direction`, and `duration`, and notes that returned departure/arrival times already include the current delay under the Friendly Public Transport Format rules.
- `GET /lines` supports filters such as `id`, `name`, `operator`, `variants`, `mode`, and `product`; it is the only route explicitly documented as `application/x-ndjson`.
- `GET /journeys` accepts `from` and `to` in stop, POI, or address forms and exposes the largest parameter surface in the docs, including `arrival`, `departure`, `results`, `via`, `passedStations`, `transfers`, `transferTime`, `accessibility`, `bike`, `tickets`, `transferInfo`, and transport-mode include/exclude toggles.
- `GET /journeys/legs/:ref` is present in the official route index; the inspected page lists the path but does not provide a separate detailed parameter section beyond the path reference itself.
- `GET /trips/:id` appears twice in the inspected docs, both times for the same path: one section highlights `lineName` and `when`, and another adds `stopovers`, `remarks`, `polyline`, and `language`.
- `GET /locations` requires `query` and supports `results`, `stops`, `poi`, and `addresses` toggles.
- `GET /radar` requires `north`, `west`, `south`, and `east`, with optional `results`, `duration`, and `frames`.
- `GET /maps/:type` redirects to official PDF maps; the docs enumerate map types such as `bvg`, `bvg-tram`, `bvg-night`, `bvg-refugees`, `vbb`, `brb`, `cb`, `cb-night`, `ff`, `p`, and `p-night`.
- `GET /logos/:type` serves transport logos from the linked `vbb-logos` asset set.

## Sources inspected
- `https://github.com/derhuerst/vbb-rest/blob/3/docs/index.md`
- `https://raw.githubusercontent.com/derhuerst/vbb-rest/3/docs/index.md`
