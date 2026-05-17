# Launch Library 2

## Provider metadata
- Category: `Science & Math`
- Provider slug: `launch-library-2`
- Official docs/pages used:
  - `https://thespacedevs.com/llapi` (official product landing page)
  - `https://ll.thespacedevs.com/docs/` (official Swagger UI docs page)
  - `https://ll.thespacedevs.com/2.3.0/json` (official OpenAPI document referenced by the Swagger UI)
- Official API title/version: `LaunchLibrary API v2.3.0`
- Canonical production host from the spec: `https://ll.thespacedevs.com`
- Development host from the spec: `https://lldev.thespacedevs.com`
- Canonical fireROUTE base URL: `https://ll.thespacedevs.com/2.3.0`
- Auth model:
  - Public unauthenticated access is allowed, but the official docs say non-authenticated requests are rate-limited to `15` calls per hour.
  - Higher-rate access uses token auth via header `Authorization: Token YOUR_API_KEY`.
  - The spec also defines `cookieAuth` with cookie name `sessionid`, but that is primarily relevant to authenticated browser/docs sessions.
- Methods confirmed from the official spec: `GET`
- Response format: JSON
- Manually confirmed route count: `116`

## Versioning and environment notes
- The inspected docs mark `2.3.0` as the current supported version.
- The docs recommend using the supported versioned routes rather than older unsupported versions.
- The production server is rate-limited.
- The development server `https://lldev.thespacedevs.com` is described as stale/limited-data and intended for development testing.

## Shared request model
### Common query parameters seen across many list endpoints
- `limit` - page size; the docs repeatedly note max `100`
- `offset` - offset-based pagination start
- `ordering` - sort field, often with `-field` descending style examples
- `search` - free-text search across resource-specific fields
- `mode` - response detail level, commonly `list`, `normal`, or `detailed`
- `format` - docs examples explicitly show `?format=json`

### Common filtering patterns
- Resource-specific equality filters such as `name`, `id`, `status`, `slug`
- Partial-match filters such as `name__contains` or `...__icontains`
- Numeric/date comparison filters such as `__gt`, `__gte`, `__lt`, `__lte`
- Many list endpoints also accept comma-separated multi-value filters for IDs or names

### Common path parameters
- `{id}` - integer IDs for many config and entity-detail routes
- `{id}` - UUID on launch detail routes

## Pagination and response notes
- Paginated list schemas in the spec use:
  - `count`
  - `next`
  - `previous`
  - `results`
- The `limit` parameter is documented broadly with a maximum of `100`.
- Offset paging is the standard list-navigation pattern.
- The dedicated throttle route returns fields such as:
  - `your_request_limit`
  - `limit_frequency_secs`
  - `current_use`
  - `next_use_secs`
  - `ident`

## Rate limits and auth notes
- The landing page and OpenAPI description say free unauthenticated usage is limited to `15 calls per hour`.
- The docs explicitly point clients to `GET /2.3.0/api-throttle/` to inspect current usage statistics.
- The token auth scheme is defined as header `Authorization: Token <apiKey>`.
- The dev host is described as not being subject to the production rate limit, but it has stale and limited data.

## Error notes
- The reviewed OpenAPI spec only enumerates `200` responses on the inspected operations.
- The official prose documents rate limiting, so integrations should still expect throttling behavior even though the spec does not publish a detailed error table.
- The docs page did not expose a compact structured error schema in the inspected materials.

## Canonical endpoints
All confirmed routes in the reviewed `v2.3.0` OpenAPI document are `GET` routes.

### Agencies
- `GET /2.3.0/agencies/`
- `GET /2.3.0/agencies/{id}/`

### API throttle
- `GET /2.3.0/api-throttle/`

### Astronauts
- `GET /2.3.0/astronauts/`
- `GET /2.3.0/astronauts/{id}/`

### Celestial bodies
- `GET /2.3.0/celestial_bodies/`
- `GET /2.3.0/celestial_bodies/{id}/`

### Config reference collections
- `GET /2.3.0/config/agency_types/`
- `GET /2.3.0/config/agency_types/{id}/`
- `GET /2.3.0/config/astronaut_roles/`
- `GET /2.3.0/config/astronaut_roles/{id}/`
- `GET /2.3.0/config/astronaut_statuses/`
- `GET /2.3.0/config/astronaut_statuses/{id}/`
- `GET /2.3.0/config/astronaut_types/`
- `GET /2.3.0/config/astronaut_types/{id}/`
- `GET /2.3.0/config/celestial_body_types/`
- `GET /2.3.0/config/celestial_body_types/{id}/`
- `GET /2.3.0/config/countries/`
- `GET /2.3.0/config/countries/{id}/`
- `GET /2.3.0/config/docking_locations/`
- `GET /2.3.0/config/docking_locations/{id}/`
- `GET /2.3.0/config/event_types/`
- `GET /2.3.0/config/event_types/{id}/`
- `GET /2.3.0/config/first_stage_types/`
- `GET /2.3.0/config/first_stage_types/{id}/`
- `GET /2.3.0/config/image_licenses/`
- `GET /2.3.0/config/image_licenses/{id}/`
- `GET /2.3.0/config/image_variant_types/`
- `GET /2.3.0/config/image_variant_types/{id}/`
- `GET /2.3.0/config/infourl_types/`
- `GET /2.3.0/config/infourl_types/{id}/`
- `GET /2.3.0/config/landing_locations/`
- `GET /2.3.0/config/landing_locations/{id}/`
- `GET /2.3.0/config/landing_types/`
- `GET /2.3.0/config/landing_types/{id}/`
- `GET /2.3.0/config/languages/`
- `GET /2.3.0/config/languages/{id}/`
- `GET /2.3.0/config/launch_statuses/`
- `GET /2.3.0/config/launch_statuses/{id}/`
- `GET /2.3.0/config/launcher_statuses/`
- `GET /2.3.0/config/launcher_statuses/{id}/`
- `GET /2.3.0/config/mission_types/`
- `GET /2.3.0/config/mission_types/{id}/`
- `GET /2.3.0/config/net_precisions/`
- `GET /2.3.0/config/net_precisions/{id}/`
- `GET /2.3.0/config/notice_types/`
- `GET /2.3.0/config/notice_types/{id}/`
- `GET /2.3.0/config/orbits/`
- `GET /2.3.0/config/orbits/{id}/`
- `GET /2.3.0/config/payload_types/`
- `GET /2.3.0/config/payload_types/{id}/`
- `GET /2.3.0/config/program_types/`
- `GET /2.3.0/config/program_types/{id}/`
- `GET /2.3.0/config/road_closure_statuses/`
- `GET /2.3.0/config/road_closure_statuses/{id}/`
- `GET /2.3.0/config/space_station_statuses/`
- `GET /2.3.0/config/space_station_statuses/{id}/`
- `GET /2.3.0/config/spacecraft_configuration_types/`
- `GET /2.3.0/config/spacecraft_configuration_types/{id}/`
- `GET /2.3.0/config/spacecraft_statuses/`
- `GET /2.3.0/config/spacecraft_statuses/{id}/`
- `GET /2.3.0/config/timeline_event_types/`
- `GET /2.3.0/config/timeline_event_types/{id}/`
- `GET /2.3.0/config/vidurl_types/`
- `GET /2.3.0/config/vidurl_types/{id}/`

### Dashboard
- `GET /2.3.0/dashboard/starship/`

### Docking events
- `GET /2.3.0/docking_events/`
- `GET /2.3.0/docking_events/{id}/`

### Events
- `GET /2.3.0/events/`
- `GET /2.3.0/events/{id}/`
- `GET /2.3.0/events/previous/`
- `GET /2.3.0/events/previous/{id}/`
- `GET /2.3.0/events/upcoming/`
- `GET /2.3.0/events/upcoming/{id}/`

### Expeditions
- `GET /2.3.0/expeditions/`
- `GET /2.3.0/expeditions/{id}/`

### Landings
- `GET /2.3.0/landings/`
- `GET /2.3.0/landings/{id}/`

### Launcher configuration families
- `GET /2.3.0/launcher_configuration_families/`
- `GET /2.3.0/launcher_configuration_families/{id}/`

### Launcher configurations
- `GET /2.3.0/launcher_configurations/`
- `GET /2.3.0/launcher_configurations/{id}/`

### Launchers
- `GET /2.3.0/launchers/`
- `GET /2.3.0/launchers/{id}/`

### Launches
- `GET /2.3.0/launches/`
- `GET /2.3.0/launches/{id}/`
- `GET /2.3.0/launches/previous/`
- `GET /2.3.0/launches/previous/{id}/`
- `GET /2.3.0/launches/upcoming/`
- `GET /2.3.0/launches/upcoming/{id}/`

### Locations
- `GET /2.3.0/locations/`
- `GET /2.3.0/locations/{id}/`

### Mission patches
- `GET /2.3.0/mission_patches/`
- `GET /2.3.0/mission_patches/{id}/`

### Pads
- `GET /2.3.0/pads/`
- `GET /2.3.0/pads/{id}/`

### Payload flights
- `GET /2.3.0/payload_flights/`
- `GET /2.3.0/payload_flights/{id}/`

### Payloads
- `GET /2.3.0/payloads/`
- `GET /2.3.0/payloads/{id}/`

### Programs
- `GET /2.3.0/programs/`
- `GET /2.3.0/programs/{id}/`

### Space stations
- `GET /2.3.0/space_stations/`
- `GET /2.3.0/space_stations/{id}/`

### Spacecraft
- `GET /2.3.0/spacecraft/`
- `GET /2.3.0/spacecraft/{id}/`

### Spacecraft configuration families
- `GET /2.3.0/spacecraft_configuration_families/`
- `GET /2.3.0/spacecraft_configuration_families/{id}/`

### Spacecraft configurations
- `GET /2.3.0/spacecraft_configurations/`
- `GET /2.3.0/spacecraft_configurations/{id}/`

### Spacecraft flights
- `GET /2.3.0/spacecraft_flights/`
- `GET /2.3.0/spacecraft_flights/{id}/`

### Spacewalks
- `GET /2.3.0/spacewalks/`
- `GET /2.3.0/spacewalks/{id}/`

### Updates
- `GET /2.3.0/updates/`
- `GET /2.3.0/updates/{id}/`

## Important usage notes
- The official landing page advertises several human-facing shortcut links such as ICS feeds and examples, but the canonical machine-readable API inventory is the `v2.3.0` OpenAPI document.
- Previous/upcoming launch and event routes are separate endpoints, not just filters on the base collections.
- Configuration taxonomies under `/config/...` are a major part of the API and should not be collapsed into one synthetic metadata route.
- The production and development hosts expose the same route structure but different operational expectations and data freshness.

## fireROUTE normalization notes
- Normalize on the versioned production base URL `https://ll.thespacedevs.com/2.3.0`.
- Keep all routes read-only `GET` in fireROUTE.
- Preserve LL2-native query parameter names exactly, especially `limit`, `offset`, `ordering`, `search`, and `mode`.
- Model config taxonomies, entity collections/details, and previous/upcoming collection variants as distinct route families.
- Expose token auth as header `Authorization: Token <apiKey>` when a paid key is available; otherwise treat anonymous mode as rate-limited fallback.