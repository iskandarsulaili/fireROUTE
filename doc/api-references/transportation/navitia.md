# Navitia

## Provider metadata
- Category: `Transportation`
- Provider slug: `navitia`
- Official docs used manually:
  - `https://doc.navitia.io/`
  - `https://doc.navitia.io/#authentication`
  - `https://doc.navitia.io/#api-catalog`
  - `https://doc.navitia.io/#errors`
- Base URL: `https://api.navitia.io/v1`
- Authentication:
  - authentication is required on every request
  - the official docs say Navitia uses Basic HTTP authentication where the username is the key and the password is empty
  - the same docs also show requests with the token in an `Authorization` header value and in the URL userinfo slot for quick manual testing
- Primary response formats:
  - JSON
  - GeoJSON appears in some geometry-bearing fields such as coverage shapes and isochrone polygons
  - some geometry-bearing itinerary data is documented in encoded polyline form in specific route families
- API style:
  - the docs describe Navitia as a HATEOAS API returning JSON
- Transport scope documented here: coverage discovery, datasets/contributors, place lookup, public-transport object exploration, journeys, isochrones, schedules, departures/arrivals, disruptions/traffic, accessibility access points, and nearby free-floating mobility objects

## Important official usage notes
- The public docs explicitly distinguish a fake `sandbox` token used in examples from private real tokens.
- The fake token only works on the `sandbox` coverage, while private customer tokens do not grant access to that sandbox.
- Many coverage-scoped routes can use coordinates instead of an explicit coverage id, letting Navitia infer the region from `lon;lat`.
- The docs repeatedly encourage clients to follow links returned by the API rather than hard-coding every traversal step.
- Coverage production dates matter: the docs state there is no data outside the production period, and one production period cannot exceed one year.
- The `pt_objects` and `/places` autocomplete-style APIs are explicitly documented as non-paginated.

## Rate limits, pagination, formats, and errors
- No public numeric quota table is exposed on the inspected docs page.
- The official error section documents HTTP `429` when a token sends too many requests during one second.
- The same section recommends exponential backoff, giving up on the request, or contacting Navitia for a quotation.
- Collection pagination is documented through a `pagination` object and HATEOAS links such as `first`, `previous`, `next`, and `last`.
- The inspected paging example shows fields such as `items_on_page`, `items_per_page`, `start_page`, and `total_result`.
- `413 Request too large` is documented for responses larger than `10 MB`; the official workaround advice is to paginate, reduce `depth`, or narrow large-journey request windows.
- For `400` and `404` responses, the docs say Navitia returns a structured `error` object with a unique `id` and `message`.
- Documented `400` error ids on the inspected page:
  - `bad_filter`
  - `unable_to_parse`
  - `unknown_api`
  - `bad_format`
  - `config_exception`
- Documented `401`: missing token.
- Documented `403`: token is not allowed to request the target coverage.
- Documented `404` families include `date_out_of_bounds`, `no_departure_this_day`, `no_active_circulation_this_day`, `terminus`, `partial_terminus`, `active_disruption`, `no_origin`, `no_destination`, `no_origin_nor_destination`, and `unknown_object`.
- Documented `50x` error ids on the inspected page:
  - `internal_error`
  - `service_unavailable`
  - `dead_socket`
  - `technical_error`

## Confirmed API surface
The inspected official `API catalog` section exposes 52 confirmed GET route patterns.

### 1) Coverage discovery (3 routes)
1. `GET /coverage`
2. `GET /coverage/{region_id}`
3. `GET /coverage/{lon;lat}`

Purpose and notes:
- discover available coverages
- inspect one specific coverage
- infer the matching coverage from coordinates
- the coverage response includes production dates and shape information
- the only arguments explicitly called out for this family are paging arguments

### 2) Datasets (2 routes)
4. `GET /coverage/{region_id}/datasets`
5. `GET /coverage/{region_id}/datasets/{dataset_id}`

Purpose and notes:
- list the datasets used in a coverage
- inspect one dataset backing the coverage
- contributor information is linked from dataset responses according to the docs

### 3) Contributors (2 routes)
6. `GET /coverage/{region_id}/contributors`
7. `GET /coverage/{region_id}/contributors/{dataset_id}`

Purpose and notes:
- list contributors feeding a coverage
- inspect one contributor object
- the official table uses `{dataset_id}` in the second path even though the result description refers to a contributor object; this file preserves the docs wording rather than silently renaming it

### 4) Inverted geocoding / direct place lookup (6 routes)
8. `GET /places/{lon;lat}`
9. `GET /places/{id}`
10. `GET /coverage/{lon;lat}/places/{lon;lat}`
11. `GET /coverage/{lon;lat}/places/{id}`
12. `GET /coverage/{region_id}/places/{lon;lat}`
13. `GET /coverage/{region_id}/places/{id}`

Purpose and notes:
- resolve coordinates to a detailed address point
- fetch place details by id
- use either an explicit coverage or coordinate-based coverage inference

### 5) Public transport object exploration (4 routes)
14. `GET /coverage/{region_id}/{collection_name}`
15. `GET /coverage/{region_id}/{collection_name}/{object_id}`
16. `GET /coverage/{lon;lat}/{collection_name}`
17. `GET /coverage/{lon;lat}/{collection_name}/{object_id}`

Purpose and notes:
- browse or fetch specific objects from collections such as networks, lines, routes, stop areas, stop points, physical modes, companies, and POIs
- the docs show shared filtering and paging patterns for these collection routes

### 6) Public transport object autocomplete (1 route)
18. `GET /coverage/{region_id}/{resource_path}/pt_objects`

Purpose and notes:
- search public-transport objects by name
- the docs say this endpoint returns objects such as `network`, `commercial_mode`, `line`, `route`, `stop_area`, and `stop_point`
- the docs explicitly say there is no pagination for this API

Documented parameters called out on the inspected page:
- required `q`
- optional `type[]`
- optional `disable_disruption`
- optional `depth`
- optional `filter`

### 7) Geographical autocomplete / place search (2 routes)
19. `GET /coverage/{region_id}/places`
20. `GET /places`

Purpose and notes:
- search geographical objects by name
- object types on the inspected docs page include `stop_area`, `address`, `administrative_region`, `poi`, and deprecated `stop_point`
- the docs explicitly say there is no pagination for this API

Documented parameters called out on the inspected page:
- required `q`
- optional `type[]`
- optional `poi_types[]`
- optional `disable_geojson`
- optional `depth`
- optional geo-bias parameter `from`

### 8) Places nearby (4 routes)
21. `GET /coverage/{lon;lat}/coords/{lon;lat}/places_nearby`
22. `GET /coord/{lon;lat}/places_nearby`
23. `GET /coverage/{region_id}/coords/{lon;lat}/places_nearby`
24. `GET /coverage/{region_id}/{resource_path}/places_nearby`

Purpose and notes:
- find nearby objects around coordinates or around another resource
- the docs show this family as usable both with explicit coverage ids and with inferred coverage from coordinates

### 9) Journey planning (3 routes)
25. `GET /journeys`
26. `GET /coverage/{region_id}/journeys`
27. `GET /coverage/{a_path_to_resource}/journeys`

Purpose and notes:
- compute journeys globally, within a coverage, or from a specific origin resource path
- official examples show origin/destination coordinates in `from` and `to`

Documented / example parameters seen on inspected pages:
- `from`
- `to`
- `datetime`
- `datetime_represents`
- `data_freshness`
- `max_duration`
- `traveler_type`
- `allowed_id`
- `forbidden_id`

### 10) Isochrones (2 routes)
28. `GET /isochrones`
29. `GET /coverage/{region_id}/isochrones`

Purpose and notes:
- compute reachable areas / multi-polygons for one or more duration steps
- official examples show `from` plus `max_duration`

### 11) Route schedules (2 routes)
30. `GET /coverage/{region_id}/{resource_path}/route_schedules`
31. `GET /coverage/{lon;lat}/coords/{lon;lat}/route_schedules`

Purpose and notes:
- return full route schedules for a resource or for coordinates
- the route-schedule example shows timetable-style rows/headers and linked `vehicle_journey` references

### 12) Stop schedules (2 routes)
32. `GET /coverage/{region_id}/{resource_path}/stop_schedules`
33. `GET /coverage/{lon;lat}/coords/{lon;lat}/stop_schedules`

Purpose and notes:
- return stop schedules grouped by stop point / route
- realtime section examples show `data_freshness=realtime` support

### 13) Terminus schedules (2 routes)
34. `GET /coverage/{region_id}/{resource_path}/terminus_schedules`
35. `GET /coverage/{lon;lat}/coords/{lon;lat}/terminus_schedules`

Purpose and notes:
- return schedules grouped by downstream terminus observations after the considered stop point
- the official docs describe this family as structurally similar to stop schedules but rooted in `terminus_schedules`

### 14) Departures (2 routes)
36. `GET /coverage/{region_id}/{resource_path}/departures`
37. `GET /coverage/{lon;lat}/coords/{lon;lat}/departures`

Purpose and notes:
- next departures sorted by time rather than grouped stop/route buckets
- the realtime section says departures default to realtime freshness

Documented / example parameters seen on inspected pages:
- `from_datetime`
- `data_freshness`
- `count`
- `distance`
- `headsign`

### 15) Arrivals (2 routes)
38. `GET /coverage/{region_id}/{resource_path}/arrivals`
39. `GET /coverage/{lon;lat}/coords/{lon;lat}/arrivals`

Purpose and notes:
- arrivals, time-sorted rather than grouped
- the same schedule-style 404 families are documented for arrivals as for departures and schedules

### 16) Line reports (1 route)
40. `GET /{a_path_to_a_resource}/line_reports`

Purpose and notes:
- disruption state grouped by line and related objects
- official examples show use on an entire coverage, on a network, and on an individual line path

Documented parameters called out on the inspected page:
- `since`
- `until`
- `count`
- `depth`
- `forbidden_uris[]`
- `disable_geojson`

### 17) Traffic reports (1 route)
41. `GET /{a_path_to_a_resource}/traffic_reports`

Purpose and notes:
- disruption state grouped by network, with affected lines and stop areas
- examples mirror line reports but use `traffic_reports`

Documented parameters called out on the inspected page:
- `since`
- `until`
- `count`
- `depth`
- `forbidden_uris[]`
- `disable_geojson`

### 18) Equipment reports (1 route)
42. `GET /{a_path_to_a_resource}/equipment_reports`

Purpose and notes:
- accessibility / equipment availability reporting such as lifts and elevators
- the docs warn this feature is not available by default and requires specific provider configuration

Documented parameters called out on the inspected page:
- `count`
- `depth`
- `filter`
- `forbidden_uris[]`
- `start_page`

### 19) Access points (5 routes)
43. `GET /coverage/{region_id}/access_points`
44. `GET /coverage/{lon;lat}/access_points`
45. `GET /coverage/{region_id}/{resource_path}/access_points`
46. `GET /coverage/{lon;lat}/{resource_path}/access_points`
47. `GET /coord/{lon;lat}/access_points`

Purpose and notes:
- list access points for a region, near coordinates, or filtered by parent resources such as stop points and lines
- inspected examples mention access-point ids, names, coordinates, and `access_point_code`

### 20) Freefloatings nearby (4 routes)
48. `GET /coverage/{lon;lat}/coords/{lon;lat}/freefloatings_nearby`
49. `GET /coord/{lon;lat}/freefloatings_nearby`
50. `GET /coverage/{region_id}/coords/{lon;lat}/freefloatings_nearby`
51. `GET /coverage/{region_id}/{resource_path}/freefloatings_nearby`

Purpose and notes:
- find nearby free-floating mobility objects around coordinates or another resource

### 21) Direct stop points (1 route)
52. `GET /coverage/{region_id}/direct_stop_points`

Purpose and notes:
- return stop points directly accessible from an origin stop point / line combination

Documented / example parameters seen on the inspected page:
- `stop_point_id`
- `line_id`

## Common parameter and response-format notes
- Common pagination / response controls across many collection-style endpoints include `count`, `start_page`, `depth`, `filter`, `disable_geojson`, and `disable_disruption`.
- Search-oriented routes use `q`, optional `type[]`, and route-family-specific filters such as `poi_types[]`.
- Realtime / disruption-oriented routes use `since`, `until`, and `data_freshness` where relevant.
- Journey and schedule examples across the docs also show `from_datetime`, `datetime`, `datetime_represents`, `traveler_type`, `allowed_id`, and `forbidden_id`.
- The docs show JSON objects containing `links`, `pagination`, `disruptions`, `feed_publishers`, `notes`, and `exceptions` across several families.

## Sources inspected
- `https://doc.navitia.io/`
- `https://doc.navitia.io/#authentication`
- `https://doc.navitia.io/#api-catalog`
- `https://doc.navitia.io/#errors`
