# Transport for Los Angeles, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-los-angeles-us`
- Official docs used manually:
  - `https://developer.metro.net/api/`
  - `https://metro-api-v2.ofhq3vd1r7une.us-west-2.cs.amazonlightsail.com/docs`
  - `https://metro-api-v2.ofhq3vd1r7une.us-west-2.cs.amazonlightsail.com/openapi.json`
- Base URL: `https://api.metro.net`
- Additional documented development server: `https://dev-metro-api-v2.ofhq3vd1r7une.us-west-2.cs.amazonlightsail.com/`
- Authentication:
  - no security requirement is declared for the documented transit-data routes in the inspected OpenAPI spec
  - OAuth2 password flow is documented for user-account routes, with token issuance at `POST /token`
  - `GET /users/{username}` explicitly requires bearer auth via the documented `OAuth2PasswordBearer` scheme
- Primary response formats seen in official docs:
  - JSON for nearly all documented routes
  - HTML on `GET /` and `GET /login`
  - form-encoded request body on `POST /token`
- Transport scope: LA Metro realtime trip details, canceled service datasets, GTFS-derived static data, GoPass school data, and a small built-in user-account API

## Important official usage notes
- The official Metro realtime page says GTFS-realtime access is provided through Swiftly and requires a Swiftly API key request.
- That same official page says Swiftly can provide GTFS-realtime in protobuf and JSON, updates `VehiclePositions` every `5 seconds`, and updates `TripUpdates` every `10 seconds`.
- The official page also warns that polling those feeds more frequently provides limited value.
- Metro publishes two agency keys on the official page: `lametro` for bus and `lametro-rail` for rail.
- The inspected `api.metro.net` OpenAPI server instead uses `agency_id` path enums of `LACMTA` and `LACMTA_Rail`, with `all` additionally supported on `/{agency_id}/route_overview`.

## Rate limits, pagination, and errors
- No numeric rate-limit policy was published in the inspected official docs for `api.metro.net`.
- The inspected OpenAPI spec does not document classic page-number pagination for the transport-data routes.
- The dominant documented error is `422 Validation Error` when required path or query parameters are invalid or missing.
- Most routes otherwise only document `200 Successful Response`.
- The OpenAPI spec does not publish a provider-wide structured error model beyond FastAPI validation errors.

## Confirmed API surface
The official docs currently expose 31 routes:
1. `GET /{agency_id}/trip_detail/route_code/{route_code}`
2. `GET /{agency_id}/trip_detail/vehicle/{vehicle_id}`
3. `GET /ws/{agency_id}/{endpoint}/{route_codes}`
4. `GET /canceled_service_summary`
5. `GET /canceled_service/line/{line}`
6. `GET /canceled_service/all`
7. `GET /{agency_id}/route_stops/{route_code}`
8. `GET /{agency_id}/route_details/{route_code}`
9. `GET /{agency_id}/shape_info/{shape_id}`
10. `GET /calendar_dates`
11. `GET /{agency_id}/stop_times/route_code/{route_code}`
12. `GET /{agency_id}/stop_times/trip_id/{trip_id}`
13. `GET /{agency_id}/stops/{stop_id}`
14. `GET /{agency_id}/trips/{trip_id}`
15. `GET /{agency_id}/shapes/{shape_id}`
16. `GET /{agency_id}/trip_shapes/{shape_id}`
17. `GET /{agency_id}/calendar/{service_id}`
18. `GET /{agency_id}/routes/{route_id}`
19. `GET /{agency_id}/route_overview`
20. `GET /{agency_id}/route_overview/{route_code}`
21. `GET /{agency_id}/agency/`
22. `GET /{agency_id}/destination/{trip_id}/{stop_id}`
23. `GET /routes`
24. `GET /get_gopass_schools`
25. `GET /time`
26. `GET /`
27. `GET /login`
28. `GET /verify_email/{email_verification_token}`
29. `POST /token`
30. `POST /users/`
31. `GET /users/{username}`

## Common request and response notes
- `agency_id` is an enum in the official spec. Most transit routes accept `LACMTA` or `LACMTA_Rail`; `/{agency_id}/route_overview` additionally accepts `all`.
- Day-type filters use official enums such as `weekday`, `saturday`, `sunday`, `no_type`, and `all`.
- Several geometry-oriented routes expose a `geojson` boolean query flag.
- The published transit routes are JSON-first; only the root and login helper pages return HTML.
- User login uses OAuth2 password flow at `/token` and returns a JSON token object with `access_token` and `token_type`.

## Route-by-route notes

### Realtime data

#### 1) Trip detail by route code
- Method: `GET`
- Path: `/{agency_id}/trip_detail/route_code/{route_code}`
- Required path params: `agency_id`, `route_code`
- Optional query params: `geojson`, `include_stop_time_updates`
- Responses: `200`, `422`

#### 2) Trip detail by vehicle
- Method: `GET`
- Path: `/{agency_id}/trip_detail/vehicle/{vehicle_id}`
- Required path params: `agency_id`, `vehicle_id`
- Optional query params: `stop_sequence`, `geojson`, `include_stop_time_updates`
- Responses: `200`, `422`

#### 3) Dummy websocket endpoint
- Method: `GET`
- Path: `/ws/{agency_id}/{endpoint}/{route_codes}`
- Required path params: `agency_id`, `endpoint`, `route_codes`
- Responses: `200`, `422`

### Canceled service data

#### 4) Canceled service summary
- Method: `GET`
- Path: `/canceled_service_summary`
- Responses: `200`

#### 5) Canceled service by line
- Method: `GET`
- Path: `/canceled_service/line/{line}`
- Required path params: `line`
- Responses: `200`, `422`

#### 6) All canceled service records
- Method: `GET`
- Path: `/canceled_service/all`
- Responses: `200`

### Static data

#### 7) Route stops
- Method: `GET`
- Path: `/{agency_id}/route_stops/{route_code}`
- Required path params: `agency_id`, `route_code`
- Optional query params: `daytype`
- Responses: `200`, `422`

#### 8) Route details
- Method: `GET`
- Path: `/{agency_id}/route_details/{route_code}`
- Required path params: `agency_id`, `route_code`
- Required query params: `direction_id`, `day_type`, `time`
- Optional query params: `num_results`
- Responses: `200`, `422`

#### 9) Shape info
- Method: `GET`
- Path: `/{agency_id}/shape_info/{shape_id}`
- Required path params: `agency_id`, `shape_id`
- Required query params: `time`
- Optional query params: `num_results`
- Responses: `200`, `422`

#### 10) Calendar dates
- Method: `GET`
- Path: `/calendar_dates`
- Responses: `200`

#### 11) Stop times by route code
- Method: `GET`
- Path: `/{agency_id}/stop_times/route_code/{route_code}`
- Required path params: `agency_id`, `route_code`
- Responses: `200`, `422`

#### 12) Stop times by trip ID
- Method: `GET`
- Path: `/{agency_id}/stop_times/trip_id/{trip_id}`
- Required path params: `agency_id`, `trip_id`
- Responses: `200`, `422`

#### 13) Stop by ID
- Method: `GET`
- Path: `/{agency_id}/stops/{stop_id}`
- Required path params: `agency_id`, `stop_id`
- Responses: `200`, `422`

#### 14) Trip by ID
- Method: `GET`
- Path: `/{agency_id}/trips/{trip_id}`
- Required path params: `agency_id`, `trip_id`
- Responses: `200`, `422`

#### 15) Shape geometry
- Method: `GET`
- Path: `/{agency_id}/shapes/{shape_id}`
- Required path params: `agency_id`, `shape_id`
- Optional query params: `geojson`
- Responses: `200`, `422`

#### 16) Trip shapes
- Method: `GET`
- Path: `/{agency_id}/trip_shapes/{shape_id}`
- Required path params: `agency_id`, `shape_id`
- Responses: `200`, `422`

#### 17) Calendar by service ID
- Method: `GET`
- Path: `/{agency_id}/calendar/{service_id}`
- Required path params: `agency_id`, `service_id`
- Responses: `200`, `422`

#### 18) Route by route ID
- Method: `GET`
- Path: `/{agency_id}/routes/{route_id}`
- Required path params: `agency_id`, `route_id`
- Responses: `200`, `422`

#### 19) Route overview
- Method: `GET`
- Path: `/{agency_id}/route_overview`
- Required path params: `agency_id`
- Official enum values: `LACMTA`, `LACMTA_Rail`, `all`
- Responses: `200`, `422`

#### 20) Route overview by route code
- Method: `GET`
- Path: `/{agency_id}/route_overview/{route_code}`
- Required path params: `agency_id`, `route_code`
- Responses: `200`, `422`

#### 21) Agency info
- Method: `GET`
- Path: `/{agency_id}/agency/`
- Required path params: `agency_id`
- Responses: `200`, `422`

#### 22) Destination by trip + stop
- Method: `GET`
- Path: `/{agency_id}/destination/{trip_id}/{stop_id}`
- Required path params: `agency_id`, `trip_id`, `stop_id`
- Responses: `200`, `422`

#### 23) All routes
- Method: `GET`
- Path: `/routes`
- Purpose: global route list not scoped by `agency_id`
- Responses: `200`

### Other published data

#### 24) GoPass schools
- Method: `GET`
- Path: `/get_gopass_schools`
- Optional query params: `show_missing`, `combine_phone`, `groupby_column`
- `groupby_column` enum values: `id`, `school`
- Responses: `200`, `422`

#### 25) Server time
- Method: `GET`
- Path: `/time`
- Responses: `200`

### User and auth helpers

#### 26) Root page
- Method: `GET`
- Path: `/`
- Response format: HTML
- Responses: `200`

#### 27) Login page
- Method: `GET`
- Path: `/login`
- Response format: HTML
- Responses: `200`

#### 28) Verify email token
- Method: `GET`
- Path: `/verify_email/{email_verification_token}`
- Required path params: `email_verification_token`
- Responses: `200`, `422`

#### 29) OAuth2 password token issuance
- Method: `POST`
- Path: `/token`
- Request body content type: `application/x-www-form-urlencoded`
- Documented form fields:
  - required `username`
  - required `password`
  - optional `grant_type`
  - optional `scope`
  - optional `client_id`
  - optional `client_secret`
- Response schema: JSON token with `access_token` and `token_type`
- Responses: `200`, `422`

#### 30) Create user
- Method: `POST`
- Path: `/users/`
- Request body content type: `application/json`
- Documented JSON body fields:
  - `username` required
  - `email` required
  - `password` required
- Responses: `200`, `422`

#### 31) Read user
- Method: `GET`
- Path: `/users/{username}`
- Required path params: `username`
- Auth requirement: bearer token via `OAuth2PasswordBearer`
- Responses: `200`, `422`

## Sources inspected
- `https://developer.metro.net/api/`
- `https://metro-api-v2.ofhq3vd1r7une.us-west-2.cs.amazonlightsail.com/docs`
- `https://metro-api-v2.ofhq3vd1r7une.us-west-2.cs.amazonlightsail.com/openapi.json`
