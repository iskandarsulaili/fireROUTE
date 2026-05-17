# Pinball Map

## Provider metadata
- Category: `Geocoding`
- Provider slug: `pinball-map`
- Official docs used manually:
  - `https://pinballmap.com/api/v1/docs`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/index.html`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/closest_by_lat_lon.html`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/closest_by_address.html`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/within_bounding_box.html`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/autocomplete.html`
  - `https://pinballmap.com/api/v1/docs/1.0/locations/geocode_lat_lon.html`
- Public API base URL documented by provider: `https://pinballmap.com/api/v1`
- Transport: `HTTPS`
- Auth model: the inspected public docs do not document an API-key scheme; the landing page instead presents the API as public and asks users to provide attribution. One inspected route (`/locations/geocode_lat_lon`) does require a route-specific `geocode_key` parameter.
- Response formats documented: mostly `json`; `/locations/within_bounding_box(.:format)` explicitly documents `json` and `geojson`

## Product and access notes
- The official landing page labels the service `pinballmap.com API 1.0`.
- The landing page asks downstream users to provide attribution and to email `admin@pinballmap.com` for endpoint suggestions/requests.
- The same page links the implementation/source repository at `https://github.com/pinballmap/pbm`.
- The docs are published as Apipie HTML pages: the top-level page lists all resources and each route links to a route-specific documentation page.
- Some delete-style routes are labeled `DESTROY` in the official docs; those correspond to delete/remove actions and should be preserved as documented labels.

## Confirmed API surface
The inspected official docs confirm `77` endpoints across these resource families:
- `Location_machine_xrefs` - `8`
- `Location_picture_xrefs` - `3`
- `Location_types` - `1`
- `Locations` - `19`
- `Machine_conditions` - `2`
- `Machine_groups` - `1`
- `Machine_score_xrefs` - `6`
- `Machines` - `1`
- `Operators` - `3`
- `Region_link_xrefs` - `1`
- `Regions` - `6`
- `Statuses` - `1`
- `User_submissions` - `8`
- `Users` - `16`
- `Zones` - `1`

## Full endpoint inventory

### Location_machine_xrefs (`8`)
- `GET /api/v1/region/:region/location_machine_xrefs.json`
- `GET /api/v1/location_machine_xrefs/:id.json`
- `POST /api/v1/location_machine_xrefs.json`
- `PUT /api/v1/location_machine_xrefs/:id.json`
- `DESTROY /api/v1/location_machine_xrefs/:id.json`
- `GET /api/v1/location_machine_xrefs/top_n_machines.json`
- `GET /api/v1/location_machine_xrefs/most_recent_by_lat_lon.json`
- `PUT /api/v1/location_machine_xrefs/:location_machine_xref_id/ic_toggle.json`

### Location_picture_xrefs (`3`)
- `GET /api/v1/location_picture_xrefs/:id.json`
- `POST /api/v1/location_picture_xrefs.json`
- `DESTROY /api/v1/location_picture_xrefs/:id.json`

### Location_types (`1`)
- `GET /api/v1/location_types.json`

### Locations (`19`)
- `POST /api/v1/locations/suggest.json`
- `GET /api/v1/locations.json`
- `GET /api/v1/region/:region/locations.json`
- `PUT /api/v1/locations/:id.json`
- `GET /api/v1/locations/closest_by_lat_lon.json`
- `GET /api/v1/locations/within_bounding_box(.:format)`
- `GET /api/v1/locations/closest_by_address.json`
- `GET /api/v1/locations/:id.json`
- `GET /api/v1/locations/:id/picture_details.json`
- `GET /api/v1/locations/:id/machine_details.json`
- `PUT /api/v1/locations/:id/confirm.json`
- `GET /api/v1/locations/autocomplete_city.json`
- `GET /api/v1/locations/autocomplete.json`
- `GET /api/v1/locations/top_cities.json`
- `GET /api/v1/locations/top_cities_by_machine.json`
- `GET /api/v1/locations/type_count.json`
- `GET /api/v1/locations/countries.json`
- `GET /api/v1/locations/top_locations.json`
- `GET /api/v1/locations/geocode_lat_lon`

### Machine_conditions (`2`)
- `PUT /api/v1/machine_conditions/:id.json`
- `DESTROY /api/v1/machine_conditions/:id.json`

### Machine_groups (`1`)
- `GET /api/v1/machine_groups.json`

### Machine_score_xrefs (`6`)
- `GET /api/v1/region/:region/machine_score_xrefs.json`
- `GET /api/v1/machine_score_xrefs/:id.json`
- `GET /api/v1/machine_score_xrefs/highest.json`
- `POST /api/v1/machine_score_xrefs.json`
- `PUT /api/v1/machine_score_xrefs/:id.json`
- `DESTROY /api/v1/machine_score_xrefs/:id.json`

### Machines (`1`)
- `GET /api/v1/machines.json`

### Operators (`3`)
- `GET /api/v1/operators.json`
- `GET /api/v1/region/:region/operators.json`
- `GET /api/v1/operators/:id.json`

### Region_link_xrefs (`1`)
- `GET /api/v1/region/:region/region_link_xrefs.json`

### Regions (`6`)
- `GET /api/v1/regions/location_and_machine_counts.json`
- `GET /api/v1/regions/does_region_exist.json`
- `GET /api/v1/regions/closest_by_lat_lon.json`
- `GET /api/v1/regions.json`
- `GET /api/v1/regions/:id.json`
- `POST /api/v1/regions/contact.json`

### Statuses (`1`)
- `GET /api/v1/statuses.json`

### User_submissions (`8`)
- `GET /api/v1/region/:region/user_submissions.json`
- `GET /api/v1/user_submissions.json`
- `GET /api/v1/user_submissions/location.json`
- `GET /api/v1/user_submissions/delete_location.json`
- `GET /api/v1/user_submissions/total_user_submission_count.json`
- `GET /api/v1/user_submissions/total_user_submission_count_week.json`
- `GET /api/v1/user_submissions/top_users.json`
- `GET /api/v1/user_submissions/list_within_range.json`

### Users (`16`)
- `GET /api/v1/users/:id/list_fave_locations.json`
- `GET /api/v1/users/total_user_count.json`
- `POST /api/v1/users/:id/add_fave_location.json`
- `POST /api/v1/users/:id/remove_fave_location.json`
- `GET /api/v1/users/auth_details.json`
- `POST /api/v1/users/forgot_password.json`
- `POST /api/v1/users/resend_confirmation.json`
- `POST /api/v1/users/signup.json`
- `GET /api/v1/users/:id/profile_info.json`
- `GET /api/v1/users/life_list_info.json`
- `POST /api/v1/users/:id/add_life_list_machine.json`
- `POST /api/v1/users/:id/remove_life_list_machine.json`
- `DELETE /api/v1/users/:id`
- `POST /api/v1/users/:id/update_email`
- `POST /api/v1/users/:id/update_password`
- `POST /api/v1/users/:id/update_user_flag`

### Zones (`1`)
- `GET /api/v1/region/:region/zones.json`

## Parameter and usage notes from inspected route pages

### Location index routes
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/index.html`

Documented base routes:
- `GET /api/v1/locations.json`
- `GET /api/v1/region/:region/locations.json`

Documented path/query parameters visible on the inspected page include:
- `region` - required for the region-scoped route
- `by_location_name`
- `by_location_id`
- `by_machine_id`
- `by_machine_single_id`
- `by_machine_group_id`
- `by_machine_id_ic`
- `by_machine_single_id_ic`
- `manufacturer`
- `by_machine_year`
- `by_machine_year_gte`
- `by_machine_year_lte`
- `by_ipdb_id`
- `by_opdb_id`
- `by_machine_name`
- `by_city_id`
- `by_city_no_state`
- `by_state_id`
- `by_country`
- `by_zone_id`
- `by_operator_id`
- `by_type_id`
- `place_id`
- `by_at_least_n_machines`
- `by_at_least_n_machines_type`
- `by_is_stern_army`
- `by_ic_active`
- `by_machine_type`
- `by_machine_display`
- `no_details`
- `with_lmx`
- `regionless_only`

Important official notes:
- the page says these index routes return machine lists for each location
- many filtering parameters are explicitly marked by the docs as requiring additional filtering on this endpoint

### Closest-by-lat/lon
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/closest_by_lat_lon.html`

Documented route:
- `GET /api/v1/locations/closest_by_lat_lon.json`

Documented required parameters:
- `lat`
- `lon`

Documented optional parameters shown on the page include:
- `by_type_id`
- `manufacturer`
- `by_machine_id`
- `by_machine_single_id`
- `by_machine_group_id`
- `by_machine_id_ic`
- `by_machine_single_id_ic`
- `by_machine_year`
- `by_machine_year_gte`
- `by_machine_year_lte`
- `by_operator_id`
- `by_at_least_n_machines`
- `by_at_least_n_machines_type`
- `by_machine_type`
- `by_machine_display`
- `max_distance`
- `no_details`
- `send_all_within_distance`

Important official notes:
- the page says the default search radius is within `50 miles`
- the docs say `max_distance` has a maximum of `500`
- the response includes a list of machines at the returned location(s)

### Closest-by-address
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/closest_by_address.html`

Documented route:
- `GET /api/v1/locations/closest_by_address.json`

Documented required parameter:
- `address`

Documented optional parameters shown on the page include:
- `max_distance`
- `send_all_within_distance`
- `no_details`
- `by_ic_active`
- `manufacturer`
- `by_machine_type`
- `by_machine_display`
- `by_machine_id`
- `by_machine_single_id`
- `by_machine_group_id`
- `by_machine_id_ic`
- `by_machine_single_id_ic`
- `by_machine_year`
- `by_machine_year_gte`
- `by_machine_year_lte`

Important official notes:
- the page says the default search radius is within `50 miles`
- the docs say `max_distance` has a max of `500`

### Bounding-box search
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/within_bounding_box.html`

Documented route:
- `GET /api/v1/locations/within_bounding_box(.:format)`

Documented supported formats:
- `json`
- `geojson`

Documented required parameters:
- `swlat`
- `swlon`
- `nelat`
- `nelon`

Documented optional parameters shown on the page include:
- `by_type_id`
- `manufacturer` - repeated-array form is explicitly documented
- `by_machine_id` - repeated-array form is explicitly documented
- `by_machine_single_id` - repeated-array form is explicitly documented
- `by_machine_group_id` - repeated-array form is explicitly documented
- `by_machine_id_ic` - repeated-array form is explicitly documented
- `by_machine_single_id_ic` - repeated-array form is explicitly documented
- `by_machine_year` - repeated-array form is explicitly documented
- `by_machine_year_gte`
- `by_machine_year_lte`
- `by_operator_id`
- `by_ic_active`
- `user_faved`
- `by_ipdb_id` - repeated-array form is explicitly documented
- `by_opdb_id` - repeated-array form is explicitly documented
- `by_at_least_n_machines`
- `by_at_least_n_machines_type`
- `by_machine_type` - repeated-array form is explicitly documented
- `by_machine_display` - repeated-array form is explicitly documented
- `no_details`
- `limit`
- `order_by`
- `machines_only`

Important official notes:
- the docs say `limit` includes pagination metadata in the response
- `order_by` supports `updated_at`, `name`, `machine_count`, and `distance`
- using `distance` sorting requires `user_lat` and `user_lon` according to the official note on the route page
- `machines_only=1` returns a flat list of unique `machine_ids` with no location data

### Location autocomplete
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/autocomplete.html`

Documented route:
- `GET /api/v1/locations/autocomplete.json`

Documented required parameter:
- `name` - fuzzy search term

### Address geocoding helper
Inspected route page: `https://pinballmap.com/api/v1/docs/1.0/locations/geocode_lat_lon.html`

Documented route:
- `GET /api/v1/locations/geocode_lat_lon`

Documented required parameters:
- `address`
- `geocode_key` - described by the docs as a `Private key`

## Errors, pagination, rate limits, and format notes
- The route pages inspected in this run document parameter validations and supported formats, but they do not expose a single global error-code table.
- The inspected route pages validate parameter types inline, e.g. `Must be a String`, `Must be a Integer`, or enum-style true/false rules.
- The clearest pagination note surfaced on the inspected pages is on `within_bounding_box`, where `limit` is documented as including pagination metadata in the response.
- No numeric rate-limit policy was surfaced on the inspected official docs pages in this run.
- JSON is the default format across the inspected routes, with `geojson` additionally documented for `within_bounding_box`.

## Canonical fireROUTE notes
- Preserve the official `DESTROY` verb labeling in documentation notes, but map those actions to delete/remove semantics when designing adapters.
- The geocoding-relevant surface in this provider is concentrated under `Locations` plus closely related `Regions` routes; `geocode_lat_lon`, `closest_by_address`, `closest_by_lat_lon`, and `within_bounding_box` are the most directly location-search-oriented routes.
- Keep `within_bounding_box` format handling explicit because the docs uniquely advertise `geojson` there.
- Do not assume a global API-key model from the docs; the landing page reads as public, while `geocode_lat_lon` alone explicitly requires a `geocode_key` parameter.

## Verification notes
- This file was manually rebuilt from the live official Pinball Map API landing page plus official route-level docs pages using browser tools only.
