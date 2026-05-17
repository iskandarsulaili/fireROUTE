# TransitLand

## Provider metadata
- Category: `Transportation`
- Provider slug: `transitland`
- Official docs used manually:
  - `https://www.transit.land/documentation/datastore/api-endpoints.html`
  - `https://www.transit.land/documentation/`
- Base URL used by the published Datastore docs: `https://transit.land`
- Route prefix used throughout the Datastore endpoint table: `/api/v1`
- Authentication documented by Transitland:
  - the official `API authentication` section says write operations and Feed Eater / webhook-style ingestion calls require authentication
  - the same section says that authenticated access was currently limited to `Mapzen staff`
  - the documented read endpoints are presented without auth requirements
- Primary response format: paginated JSON
- Additional format notes:
  - the docs say some endpoints also support `.geojson` output, with `stops.geojson` and `routes.geojson` shown as examples
  - the endpoint page is a manually readable table of example operations rather than an OpenAPI schema

## Important official usage notes
- The current public Datastore endpoint page exposes `77` documented operation rows/examples.
- Those documented rows span `63` `GET`, `8` `POST`, `4` `PUT`, and `2` `DELETE` operations.
- The docs describe the Datastore as rooted at `https://transit.land/`, with paths under `/api/v1`.
- Transitland documents both public read APIs and secured write / ingestion workflows on the same page.
- The endpoint page mixes true path templates and example query forms; the confirmed count here follows the official table rows as published.

## Rate limits, pagination, errors, and parameter patterns
- I did not find a numeric public rate-limit quota on the inspected official documentation pages.
- Pagination is documented for JSON endpoints via query parameters:
  - `offset` is the zero-based index of the first entity to display
  - `per_page` defaults to `50` and can be raised explicitly, with `?per_page=1000` shown as an example
  - `total=true` requests the total number of results
- Transitland documents a max-request execution rule rather than a classic quota rule:
  - if a query has not completed after `two minutes`, it is killed and the caller receives a timeout response
  - the docs recommend reducing `per_page`, bounding-box size, or other query scope when this happens
- The inspected public docs do not publish a structured error-schema catalog.
- Common documented parameter families include:
  - geospatial filters such as `lon`, `lat`, `r`, and `bbox`
  - GTFS-import filters such as `imported_with_gtfs_id`, `gtfs_id`, `imported_from_feed_version`, and `import_level`
  - tag filters such as `tag_key` and `tag_value`
  - relationship filters such as `served_by`, `operated_by`, `traverses`, `traversed_by`, `stops_visited`, `trip`, `route_onestop_id`, and `operator_onestop_id`
  - feed-version filters such as `feed_onestop_id`, `feed_version_sha1`, and `active`
  - schedule window filters such as `date`, `service_from_date`, `service_before_date`, and `origin_departure_between`

## Confirmed API surface
The official Datastore endpoint table currently exposes these `77` documented operation rows/examples.

### Changesets (13)
- `GET /api/v1/changesets?applied=false`
- `POST /api/v1/changesets`
- `PUT /api/v1/changesets/32`
- `POST /api/v1/changesets/1/check`
- `POST /api/v1/changesets/1/apply`
- `POST /api/v1/changesets/1/revert`
- `DELETE /api/v1/changesets/1`
- `GET /api/v1/changesets/1/change_payloads`
- `PUT /api/v1/changesets/1/change_payloads`
- `POST /api/v1/changesets/1/change_payloads`
- `GET /api/v1/changesets/1/change_payloads/1`
- `PUT /api/v1/changesets/1/change_payloads/1`
- `DELETE /api/v1/changesets/1/change_payloads/1`

### Issues (3)
- `GET /api/v1/issues`
- `GET /api/v1/issues/1`
- `GET /api/v1/issues/categories`

### Onestop ID lookup (1)
- `GET /api/v1/onestop_id/{onestop_id}`

### Stops (8 documented query forms)
- `GET /api/v1/stops`
- `GET /api/v1/stops` with GTFS-ID import filters (`imported_with_gtfs_id`, `gtfs_id`)
- `GET /api/v1/stops` with radius search (`lon`, `lat`, `r`)
- `GET /api/v1/stops` with bounding box (`bbox`)
- `GET /api/v1/stops` with `served_by`
- `GET /api/v1/stops` with `tag_key`
- `GET /api/v1/stops` with `tag_key` + `tag_value`
- `GET /api/v1/stops` with `import_level`

### Operators (7 documented query forms)
- `GET /api/v1/operators`
- `GET /api/v1/operators` with GTFS-ID import filters (`imported_with_gtfs_id`, `gtfs_id`)
- `GET /api/v1/operators` with radius search (`lon`, `lat`, `r`)
- `GET /api/v1/operators` with bounding box (`bbox`)
- `GET /api/v1/operators` with `tag_key`
- `GET /api/v1/operators` with `tag_key` + `tag_value`
- `GET /api/v1/operators` with `import_level`

### Routes (11 documented query forms)
- `GET /api/v1/routes`
- `GET /api/v1/routes` with GTFS-ID import filters (`imported_with_gtfs_id`, `gtfs_id`)
- `GET /api/v1/routes` with GTFS-ID + `imported_from_feed_version`
- `GET /api/v1/routes` with `operated_by`
- `GET /api/v1/routes` with `vehicle_type`
- `GET /api/v1/routes` with bounding box (`bbox`)
- `GET /api/v1/routes` with `tag_key`
- `GET /api/v1/routes` with `tag_key` + `tag_value`
- `GET /api/v1/routes` with `traverses`
- `GET /api/v1/routes` with `import_level`
- `GET /api/v1/routes` with `include_geometry=true`

### Route stop patterns (5)
- `GET /api/v1/route_stop_patterns`
- `GET /api/v1/route_stop_patterns` with `traversed_by`
- `GET /api/v1/route_stop_patterns` with bounding box (`bbox`)
- `GET /api/v1/route_stop_patterns` with `stops_visited`
- `GET /api/v1/route_stop_patterns` with `trips`

### Webhooks / ingestion triggers (3)
- `POST /api/v1/webhooks/feed_fetcher`
- `POST /api/v1/webhooks/feed_fetcher?feed_onestop_id=...`
- `POST /api/v1/webhooks/feed_eater?feed_onestop_id=...&feed_version_sha1=...`

### Feeds (5)
- `GET /api/v1/feeds`
- `GET /api/v1/feeds` with `tag_key`
- `GET /api/v1/feeds` with `tag_key` + `tag_value`
- `GET /api/v1/feeds` with bounding box (`bbox`)
- `GET /api/v1/feeds/{feed_onestop_id}`

### Feed versions (3)
- `GET /api/v1/feed_versions?feed_onestop_id=...`
- `GET /api/v1/feed_versions/{feed_version_sha1}`
- `PUT /api/v1/feed_versions/{feed_version_sha1}`

### Feed version imports (2)
- `GET /api/v1/feed_version_imports?feed_onestop_id=...&feed_version_sha1=...`
- `GET /api/v1/feed_version_imports/{id}`

### Schedule stop pairs (13 documented query forms)
- `GET /api/v1/schedule_stop_pairs`
- `GET /api/v1/schedule_stop_pairs` with `origin_onestop_id`
- `GET /api/v1/schedule_stop_pairs` with `destination_onestop_id`
- `GET /api/v1/schedule_stop_pairs` with `date`
- `GET /api/v1/schedule_stop_pairs` with `service_from_date`
- `GET /api/v1/schedule_stop_pairs` with `service_before_date`
- `GET /api/v1/schedule_stop_pairs` with `origin_departure_between`
- `GET /api/v1/schedule_stop_pairs` with `trip`
- `GET /api/v1/schedule_stop_pairs` with `route_onestop_id`
- `GET /api/v1/schedule_stop_pairs` with `operator_onestop_id`
- `GET /api/v1/schedule_stop_pairs` with bounding box (`bbox`)
- `GET /api/v1/schedule_stop_pairs` with `active=true`
- `GET /api/v1/schedule_stop_pairs` with `import_level`

### Feed version infos (3)
- `GET /api/v1/feed_version_infos?feed_version_sha1=...`
- `GET /api/v1/feed_version_infos?feed_onestop_id=...`
- `GET /api/v1/feed_version_infos?type=FeedVersionInfoStatistics`

## Family-specific notes from the official docs
- `Changesets` plus `change_payloads` cover write workflows and are among the operations marked `secured` by Transitland.
- `Issues`, `stops`, `operators`, `routes`, `route_stop_patterns`, and `feeds` are the main public discovery/query surfaces.
- `Onestop ID` lookup is documented as a generic resolver where the final path segment can be the Onestop ID for any supported entity type.
- `Webhooks` trigger feed ingestion/fetching workflows and are explicitly presented as secured operations.
- `Schedule stop pairs` is the densest read family after the route-discovery surfaces and focuses on origin/destination/date/time/service filters.
- GeoJSON is only documented for some endpoints; the official examples specifically call out `stops.geojson` and `routes.geojson`.

## Sources inspected
- `https://www.transit.land/documentation/datastore/api-endpoints.html`
- `https://www.transit.land/documentation/`
