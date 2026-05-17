# Railway Transport for France

## Provider metadata
- Category: `Transportation`
- Provider slug: `railway-transport-for-france`
- Official docs used manually:
  - `https://www.digital.sncf.com/startup/api`
  - `https://api.sncf.com/`
  - `https://api.sncf.com/v1/schema`
  - `https://doc.navitia.io/`
- Base URL: `https://api.sncf.com/v1`
- Authentication:
  - required
  - official auth model is HTTP Basic auth
  - the API key / token is used as the username
  - the password is left empty
  - the docs also show header-style auth and userinfo-in-URL examples
- Primary response format:
  - JSON
  - the official docs describe the API as HATEOAS and JSON-formatted
- Transport scope documented here: SNCF's public `API SNCF` / Navitia-based trip planning, schedules, departures, arrivals, public-transport object exploration, disruptions, accessibility/equipment, and nearby mobility discovery

## Important official usage notes
- The assigned legacy URL `https://www.digital.sncf.com/startup/api` no longer exposes usable docs in this pass; the live official API root is `https://api.sncf.com/`.
- The official API root publishes the current version link `https://api.sncf.com/v1/`.
- The official schema at `https://api.sncf.com/v1/schema` currently exposes `269` routes, and every published operation in that schema is `GET`.
- The official docs at `https://doc.navitia.io/` describe the platform as Navitia and explicitly tie it back to SNCF through Hove / Keolis / SNCF ownership.
- The docs say authentication is required for every call and that a newly created key may take up to `5 minutes` before it starts working.
- The docs show several equivalent auth patterns, including:
  - `Authorization` header with the token
  - HTTP Basic auth with `token:`
  - token in the URL userinfo section
- The docs say the sandbox token used in examples only reaches sandbox coverage, while private tokens reach other coverages.
- The docs position the API for:
  - journey planning
  - line schedules
  - next departures and arrivals
  - exploration of public transport data
  - place search / autocomplete
  - isochrones

## Rate limits, pagination, and errors
- The public docs do not publish one numeric per-token request quota.
- The docs do publish these operational limit/error notes:
  - HTTP `429` when too many requests are made during one second according to the token
  - HTTP `413` when the generated response exceeds `10 MB`
- The docs recommend exponential backoff after `429`.
- Pagination is officially documented:
  - response object: `pagination`
  - navigation parameters: `start_page`, `count`
  - response pagination fields: `items_per_page`, `items_on_page`, `start_page`, `total_result`
  - paging links are also returned in the response `links` section
  - the docs say one response cannot return more than `200` objects; larger result sets must be paginated
- Official 4xx / 5xx error handling notes:
  - `400` bad request with documented ids including `bad_filter`, `unable_to_parse`, `unknown_api`, `bad_format`, `config_exception`
  - `401` unauthorized when no token is found
  - `403` forbidden when the token cannot access the requested coverage
  - `404` object/service-specific not-found conditions such as `date_out_of_bounds`, `no_departure_this_day`, `no_active_circulation_this_day`, `terminus`, `partial_terminus`, `active_disruption`, `no_origin`, `no_destination`, `no_solution`, `unknown_object`
  - `413` request too large
  - `429` too many requests
  - 50x ids include `internal_error`, `service_unavailable`, `dead_socket`, `technical_error`
- The official error payload shape is JSON, with examples like:
  - `error.id`
  - `error.message`

## Confirmed API surface
The official OpenAPI schema at `https://api.sncf.com/v1/schema` currently publishes `269` GET paths.

Representative documented route families include:
1. `GET /coverage/`
2. `GET /coverage/{region}/`
3. `GET /coverage/{lon};{lat}/`
4. `GET /coord/{lon};{lat}/`
5. `GET /coords/{lon};{lat}/`
6. `GET /journeys`
7. `GET /coverage/{region}/journeys`
8. `GET /coverage/{region}/places`
9. `GET /coverage/{region}/{uri}/places_nearby`
10. `GET /coverage/{region}/{uri}/route_schedules`
11. `GET /coverage/{region}/{uri}/stop_schedules`
12. `GET /coverage/{region}/{uri}/departures`
13. `GET /coverage/{region}/{uri}/arrivals`
14. `GET /coverage/{region}/line_reports`
15. `GET /coverage/{region}/traffic_reports`
16. `GET /coverage/{region}/equipment_reports`
17. `GET /coverage/{region}/access_points`
18. `GET /coverage/{region}/freefloatings_nearby`
19. `GET /coverage/{region}/elevations`
20. collection/object exploration routes for resources such as `stop_points`, `routes`, `networks`, `commercial_modes`, `physical_modes`, `lines`, `line_groups`, `companies`, `vehicle_journeys`, `trips`, `stop_areas`, `pois`, `poi_types`, `datasets`, and `contributors`

## Common request and response notes
- The official docs describe the API as HATEOAS and show response `links` for navigation.
- The docs say object ordering is not guaranteed unless a specific endpoint says otherwise.
- The docs explicitly call out sorted responses for examples such as `/journeys`, `/departures`, `/arrivals`, `/stop_schedules`, `/terminus_schedules`, `/places_nearby`, and `/places`.
- The docs warn that objects may gain new attributes without being treated as a breaking change.
- The docs note that IDs should be treated carefully over time and that object fields can evolve.
- The official path inventory uses several recurring path patterns:
  - coverage root: `/coverage/...`
  - coordinate root: `/coord/...` or `/coords/...`
  - nested object scope: `/coverage/{region}/{uri}/...`

## 1) Coverage discovery
- Method: `GET`
- Representative paths:
  - `/coverage/`
  - `/coverage/{region}/`
  - `/coverage/{lon};{lat}/`
- Purpose: discover available coverage regions and resolve coverage from a region id or coordinate

Documented parameters / notes:
- `disable_geojson` is documented on at least the collection route set
- coverage-level responses are the entry point for the rest of the API
- the coordinate-based forms let clients resolve the relevant coverage before hitting scoped transport routes

## 2) Journey planning
- Method: `GET`
- Representative paths:
  - `/journeys`
  - `/coverage/{region}/journeys`
- Purpose: multimodal trip planning

Documented parameters seen in the official schema:
- `from` - origin place / coordinates / object reference
- `to` - destination place / coordinates / object reference
- `datetime` - request date-time
- `datetime_represents` - `arrival` or `departure`; default `departure`
- `max_nb_transfers`
- `min_nb_transfers`
- `first_section_mode[]`
- `last_section_mode[]`
- `park_mode` - `none`, `park_and_ride`, `on_street`
- `max_duration_to_pt`
- `max_walking_duration_to_pt`
- `max_bike_duration_to_pt`

Documented response / behavior notes:
- the docs present `/journeys` as one of the main sorted response families
- 404 journey-specific error ids include `no_origin`, `no_destination`, `no_origin_nor_destination`, and `no_solution`

## 3) Place search and autocomplete
- Method: `GET`
- Representative path:
  - `/coverage/{region}/places`
- Purpose: search for transport places and related geography

Documented parameters:
- `q` - required search string
- `type[]` - defaults to `['stop_area', 'address', 'poi', 'administrative_region']`
- `count` - default `10`
- `admin_uri[]`
- `depth` - default `1`
- `disable_geojson`
- `from`
- `shape`
- `shape_scope[]`
- `places_proximity_radius`
- `poi_types[]`

Documented response notes:
- `/places` is listed among the sorted response families in the docs
- results are JSON and can be paginated with `count` and `start_page`

## 4) Places nearby
- Method: `GET`
- Representative path:
  - `/coverage/{region}/{uri}/places_nearby`
- Purpose: find stops / POIs / related places around a transport object or coordinate-scoped object

Documented parameters:
- `type[]` - default `['stop_area', 'stop_point', 'poi']`
- `filter`
- `distance` - default `500`
- `count` - default `10`
- `depth` - default `1`
- `start_page`
- `bss_stands`
- `add_poi_infos[]` - default `['bss_stands', 'car_park']`
- `disable_geojson`
- `disable_disruption`

Documented response notes:
- `/places_nearby` is documented as a sorted response family
- this family supports normal Navitia pagination

## 5) Route and stop timetables
- Method: `GET`
- Representative paths:
  - `/coverage/{region}/{uri}/route_schedules`
  - `/coverage/{region}/{uri}/stop_schedules`
- Purpose: timetable views for lines / routes / stops

Documented parameters shared by these timetable families:
- `filter`
- `from_datetime`
- `until_datetime`
- `duration` - default `86399`
- `depth` - default `2`
- `count` - default `10`
- `start_page`
- `max_date_times`
- `forbidden_id[]`
- `forbidden_uris[]`
- `calendar`
- `distance` - default `200`
- `data_freshness` - `base_schedule`, `adapted_schedule`, `realtime`
- `items_per_schedule` - default `10000`
- `disable_geojson`

Documented response notes:
- `/stop_schedules` is explicitly listed among sorted response families
- these timetable families share several 404 schedule-specific error ids such as `no_departure_this_day`, `no_active_circulation_this_day`, `terminus`, `partial_terminus`, and `active_disruption`

## 6) Departures and arrivals
- Method: `GET`
- Representative paths:
  - `/coverage/{region}/departures`
  - `/coverage/{region}/{uri}/departures`
  - `/coverage/{region}/arrivals`
  - `/coverage/{region}/{uri}/arrivals`
- Purpose: upcoming departures / arrivals for a coverage or nested object scope

Documented parameters:
- `filter`
- `from_datetime`
- `until_datetime`
- `duration` - default `86399`
- `depth` - default `2`
- `count` - default `10`
- `start_page`
- `max_date_times`
- `forbidden_id[]`
- `forbidden_uris[]`
- `calendar`
- `distance` - default `200`
- `data_freshness` - `base_schedule`, `adapted_schedule`, `realtime`
- `items_per_schedule` - default `10000`
- `disable_geojson`

Documented response notes:
- `/departures` and `/arrivals` are explicitly listed among sorted response families
- these routes share the schedule-related 404 ids listed above

## 7) Disruptions and traffic reporting
- Method: `GET`
- Representative paths:
  - `/coverage/{region}/line_reports`
  - `/coverage/{region}/traffic_reports`
- Purpose: retrieve line-level or traffic/disruption-level impact information

Documented parameters:
- `depth`
- `count`
- `start_page`
- `forbidden_uris[]`
- `forbidden_id[]` on traffic reports
- `disable_geojson`
- `since`
- `until`
- `filter_status[]` on line reports
- `language` with documented choices including `nl-NL`, `en-US`, `en-GB`, `fr-FR`, `de-DE`, `hi-IN`, `it-IT`, `ja-JP`, `pt-PT`, `ru-RU`, `es-ES`
- `distance` on traffic reports

Documented response notes:
- these routes are the official disruption-reporting families exposed in the schema
- disruption filters and time windows are explicitly documented in the schema

## 8) Accessibility / access-point / nearby mobility discovery
- Method: `GET`
- Representative paths:
  - `/coverage/{region}/equipment_reports`
  - `/coverage/{region}/access_points`
  - `/coverage/{region}/freefloatings_nearby`
- Purpose: accessibility equipment status, access-point discovery, and nearby free-floating mobility resources

Documented parameters:
- equipment reports:
  - `depth`
  - `count`
  - `filter`
  - `start_page`
  - `forbidden_uris[]`
- access points:
  - `depth`
  - `count`
  - `start_page`
  - `forbidden_uris[]`
- freefloatings nearby:
  - `type[]`
  - `distance` default `500`
  - `count` default `10`
  - `coord`
  - `start_page`

## 9) Public-transport object exploration
- Method: `GET`
- Representative resource families confirmed in the schema:
  - `stop_points`
  - `routes`
  - `networks`
  - `commercial_modes`
  - `physical_modes`
  - `lines`
  - `line_groups`
  - `companies`
  - `vehicle_journeys`
  - `trips`
  - `stop_areas`
  - `pois`
  - `poi_types`
  - `datasets`
  - `contributors`
- Purpose: browse collections and fetch specific objects under coverage-scoped path templates

Common documented notes:
- these families appear in collection and item-style path variants
- common exploration parameters across the docs include `depth`, `count`, `start_page`, `filter`, `distance`, `since`, `until`, `headsign`, and geo/disruption toggles depending on the object family

## Sources inspected
- `https://www.digital.sncf.com/startup/api`
- `https://api.sncf.com/`
- `https://api.sncf.com/v1/schema`
- `https://doc.navitia.io/`
