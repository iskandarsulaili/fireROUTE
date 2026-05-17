# AfterShip

## Provider metadata
- Category: `Tracking`
- Provider slug: `aftership`
- Official docs used manually:
  - `https://www.aftership.com/docs/tracking/quickstart/api-quick-start`
  - `https://www.aftership.com/docs/tracking/quickstart/authentication`
  - `https://www.aftership.com/docs/tracking/fcd9acb5f448a-api-overview`
  - `https://www.aftership.com/docs/tracking/quickstart/rate-limit`
  - `https://www.aftership.com/docs/tracking/quickstart/body-envelope`
  - `https://www.aftership.com/docs/tracking/quickstart/request-errors`
  - `https://www.aftership.com/docs/tracking/jh865r66gc6hi-get-trackings`
  - `https://www.aftership.com/docs/tracking/sxafu5cay1usl-create-a-tracking`
  - `https://www.aftership.com/docs/tracking/ambhbdx43wiq2-update-a-tracking-by-id`
  - `https://www.aftership.com/docs/tracking/ukw8ouy82dp1k-get-couriers`
  - `https://www.aftership.com/docs/tracking/2qae9fa825r4t-detect-courier`
  - `https://www.aftership.com/docs/tracking/ca8lnpup3hk80-create-courier-connections`
  - `https://www.aftership.com/docs/tracking/1o2zu0jrca785-prediction-for-the-estimated-delivery-date`
- Confirmed API base URL: `https://api.aftership.com/tracking/2026-01`
- Primary response format: JSON
- Authentication model confirmed in reviewed docs:
  - route pages use `as-api-key` header auth
  - auth docs also publish signed-request variants with `as-signature-hmac-sha256` or `as-signature-rsa-sha256`
- Manually confirmed routes in this pass: `16`

## Authentication and versioning
From the reviewed official docs:
- every sampled route requires `as-api-key`
- the API overview explicitly says legacy `aftership-api-key` headers are no longer supported starting from the `2023-10` version
- the reviewed versioned base path is `2026-01`
- the authentication guide documents three non-OAuth request-signing modes for direct API access:
  - API key only
  - AES/HMAC with `as-signature-hmac-sha256`
  - RSA with `as-signature-rsa-sha256`
- the HMAC and RSA modes also require:
  - `date` in RFC 1123 UTC format
  - `content-type` (empty string when the body is empty)
- the reviewed auth page says signatures are valid only within `3` minutes before or after the supplied `date`
- the docs navigation also includes OAuth guides, but the route pages reviewed here still use `as-api-key` security blocks

## Response envelope and error model
The reviewed body-envelope page shows that all responses are wrapped as:

```json
{
  "meta": { "code": 200 },
  "data": {}
}
```

Reviewed envelope/error fields:
- `meta.code`
- `meta.message`
- `meta.type`
- route-specific payload in `data`

The request-errors page documents these status/code families:
- `400 / 400` - generic bad request
- `400 / 4001` - invalid JSON data
- `400 / 4003` - tracking already exists
- `404 / 4004` - tracking does not exist
- `400 / 4005` - invalid `tracking_number`
- `400 / 4007` - missing `tracking_number`
- `400 / 4008` - invalid dynamic field value
- `400 / 4009` - missing dynamic required field
- `400 / 4010` - invalid `slug`
- `400 / 4011` - missing required additional tracking fields
- `400 / 4012` - courier-detection/import failure variants
- `400 / 4013` - retrack not allowed for the current shipment state
- `400 / 4015` - invalid `id`
- `400 / 4016` - retrack already used once
- `400 / 4017` - invalid tracking-number format
- `401 / 401` - invalid API key
- `403 / 403` - forbidden
- `404 / 404` - invalid URI or missing resource
- `429 / 429` - too many requests
- `500/502/503/504` - internal/server-side errors

## Confirmed API surface

| Method | Path | Purpose | Key parameters / official notes |
|---|---|---|---|
| `GET` | `/trackings` | list trackings | cursor pagination; many search filters including `tracking_numbers`, `slug`, `tag`, date bounds, `fields` |
| `POST` | `/trackings` | create tracking | JSON body requires `tracking_number`; optional courier, order, origin/destination, customer, and extra tracking fields |
| `GET` | `/trackings/{id}` | get one tracking | requires tracking `id` path param |
| `PUT` | `/trackings/{id}` | update one tracking | requires `id`; body updates title/order/location/language/courier/additional-field data |
| `DELETE` | `/trackings/{id}` | delete one tracking | requires `id` |
| `POST` | `/trackings/{id}/retrack` | retrack inactive shipment | requires `id`; docs error if shipment is not inactive or already retracked once |
| `POST` | `/trackings/{id}/mark-as-completed` | mark tracking completed | requires `id` |
| `GET` | `/couriers` | list couriers | optional `active` and `slug` filters |
| `POST` | `/couriers/detect` | detect courier candidates from a tracking number | requires `tracking_number`; optional `slug`, `slug_group`, destination/origin/additional fields |
| `GET` | `/courier-connections` | list courier connections | exact path confirmed by official docs/rate-limit table |
| `POST` | `/courier-connections` | create courier connection | requires `courier_slug` plus carrier-specific `credentials` object |
| `GET` | `/courier-connections/{id}` | get one courier connection | requires connection `id` |
| `PATCH` | `/courier-connections/{id}` | update one courier connection | requires connection `id` |
| `DELETE` | `/courier-connections/{id}` | delete one courier connection | requires connection `id` |
| `POST` | `/estimated-delivery-date/predict` | predict EDD for one shipment | requires courier slug plus origin/destination/order timing inputs |
| `POST` | `/estimated-delivery-date/predict-batch` | batch EDD prediction | exact path confirmed in official docs/rate-limit table |

## Route details

### 1) GET /trackings
- Purpose: return multiple tracking records.
- Full URL: `https://api.aftership.com/tracking/2026-01/trackings`
- Header: `Content-Type: application/json`
- Reviewed query parameters include:
  - `cursor`
  - `limit` - default `100`, max `200`
  - `keyword`
  - `tracking_numbers` - up to `50` comma-separated tracking numbers
  - `slug`
  - `transit_time`
  - `origin`
  - `destination`
  - `tag`
  - `created_at_min`, `created_at_max`
  - `updated_at_min`, `updated_at_max`
  - `fields`
  - `return_to_sender`
  - `courier_destination_country_region`
  - `shipment_tags`
  - `order_id`
- Important official notes:
  - `created_at_min` mentions AfterShip stores only `120` days of data
  - date-time filters expect escaped timezone offsets in the URL
- Reviewed pagination response fields:
  - `pagination.total`
  - `pagination.next_cursor`
  - `pagination.has_next_page`

### 2) POST /trackings
- Purpose: create a tracking.
- Header: `Content-Type: application/json`
- Reviewed required body field:
  - `tracking_number`
- Reviewed optional body fields include:
  - `id`
  - `slug`
  - `title`
  - `order_id`, `order_number`, `order_id_path`, `order_date`
  - `custom_fields`
  - `language`
  - `order_promised_delivery_date`
  - `pickup_location`, `pickup_note`, `delivery_type`
  - `tracking_account_number`, `tracking_key`, `tracking_ship_date`
  - `origin_country_region`, `origin_state`, `origin_city`, `origin_postal_code`, `origin_raw_location`
  - `destination_country_region`, `destination_state`, `destination_city`, `destination_postal_code`, `destination_raw_location`
  - `note`
  - `slug_group`
  - `shipment_type`
  - `shipment_tags`
  - `courier_connection_id`
  - `location_id`
  - `shipping_method`
  - `last_mile`
  - `customers`
- Important official notes:
  - `slug_group` cannot be used with `slug`
  - `location_id` cannot be passed together with explicit origin-address fields
  - some courier-specific fields are required only for certain carriers

### 3) GET /trackings/{id}
- Purpose: get one tracking record by tracking ID.
- Reviewed path parameter:
  - `id` - required tracking ID

### 4) PUT /trackings/{id}
- Purpose: update one tracking.
- Reviewed path parameter:
  - `id` - required tracking ID
- Reviewed updateable fields include:
  - `title`
  - `order_id`, `order_id_path`, `order_number`, `order_date`
  - `custom_fields`
  - `note`
  - `language`
  - `order_promised_delivery_date`
  - `delivery_type`, `pickup_location`, `pickup_note`
  - `slug`
  - `tracking_account_number`, `tracking_key`, `tracking_ship_date`
  - origin and destination address fields
  - `shipment_type`
- Official note: setting `note` to an empty string clears the field.

### 5) DELETE /trackings/{id}
- Purpose: delete one tracking by ID.
- Reviewed path parameter:
  - `id` - required

### 6) POST /trackings/{id}/retrack
- Purpose: reactivate a previously inactive tracking.
- Reviewed path parameter:
  - `id` - required
- Important official error notes from the request-errors page:
  - retrack is only allowed for inactive shipments
  - each shipment can only be retracked once

### 7) POST /trackings/{id}/mark-as-completed
- Purpose: mark a tracking as completed.
- Reviewed path parameter:
  - `id` - required

### 8) GET /couriers
- Purpose: list couriers.
- Reviewed query parameters:
  - `active` - return only user-activated couriers
  - `slug` - filter by one or more courier codes
- Reviewed response fields include:
  - `data.total`
  - `data.couriers[]`
  - courier fields such as `slug`, `name`, `phone`, `web_url`, `required_fields`, `optional_fields`, `default_language`, `support_languages`, `credentials.fields`

### 9) POST /couriers/detect
- Purpose: detect matching couriers for a tracking number.
- Reviewed required body field:
  - `tracking_number`
- Reviewed optional body fields:
  - `slug` - array of couriers to narrow detection
  - `destination_postal_code`
  - `tracking_ship_date` in `YYYYMMDD`
  - `tracking_account_number`
  - `tracking_key`
  - `destination_state`
  - `slug_group`
  - `origin_country_region`
  - `destination_country_region`
- Important official note:
  - `slug` cannot be used with `slug_group` at the same time

### 10) GET /courier-connections
- Purpose: list the organization’s courier-account connections.
- Exact route/method confirmed by the official route index and rate-limit table.

### 11) POST /courier-connections
- Purpose: create a courier connection for carrier-specific authenticated tracking.
- Reviewed required body fields:
  - `courier_slug`
  - `credentials` object with carrier-specific keys
- Reviewed response fields include:
  - `id`
  - `courier_slug`
  - `credentials`
  - `created_at`
  - `updated_at`
- Documentation inconsistency worth preserving:
  - the schema prose says `credentials`, but the sample request body shown on the page uses `credential` singular

### 12) GET /courier-connections/{id}
- Purpose: fetch one courier connection by ID.
- Requires path param `id`.

### 13) PATCH /courier-connections/{id}
- Purpose: update one courier connection by ID.
- Requires path param `id`.

### 14) DELETE /courier-connections/{id}
- Purpose: delete one courier connection by ID.
- Requires path param `id`.

### 15) POST /estimated-delivery-date/predict
- Purpose: predict estimated delivery date for a single shipment before tracking exists.
- Important availability note from the docs:
  - the page says to contact sales to activate this feature
- Reviewed required fields include:
  - `slug`
  - `origin_address.country_region`
  - `destination_address.country_region`
  - `order_time`
  - either `pickup_time` or `estimated_pickup`
  - either `origin_address.state` or `origin_address.postal_code`
  - either `destination_address.state` or `destination_address.postal_code`
- Reviewed optional fields include:
  - `service_type_name`
  - `origin_address.city`, `origin_address.raw_location`
  - `destination_address.city`, `destination_address.raw_location`
  - `weight.unit`, `weight.value`
  - `package_count`
  - `order_cutoff_time`
  - `business_days`
  - `order_processing_time`
- Reviewed response fields include:
  - `id`
  - `estimated_delivery_date`
  - `estimated_delivery_date_min`
  - `estimated_delivery_date_max`
  - `confidence_code`

### 16) POST /estimated-delivery-date/predict-batch
- Purpose: batch EDD prediction.
- Exact route/method confirmed by the official route index and rate-limit table.

## Rate limits
From the reviewed official rate-limit page:
- AfterShip changed from one org-wide `10 requests/sec` limit to endpoint-specific limits starting with the `2024-07` version.
- Reviewed endpoint ceilings:
  - `POST /trackings` -> `20 req/s`
  - `GET /trackings` -> `6 req/s`
  - `GET /trackings/:id` -> `5 req/s`
  - `PUT /trackings/:id` -> `5 req/s`
  - `DELETE /trackings/:id` -> `5 req/s`
  - `POST /trackings/:id/retrack` -> `5 req/s`
  - `POST /trackings/:id/mark-as-completed` -> `5 req/s`
  - `POST /couriers/detect` -> `3 req/s`
  - `GET /couriers` -> `5 req/s`
  - `POST /estimated-delivery-date/predict` -> `5 req/s`
  - `POST /estimated-delivery-date/predict-batch` -> `20 req/s`
  - all five courier-connection routes -> `5 req/s`
- Exceeding the limit returns `429 TooManyRequests`.
- Reviewed rate-limit headers:
  - `X-RateLimit-Reset`
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`

## Pagination and format notes
- `GET /trackings` uses cursor-based pagination via `cursor` request param and `next_cursor` response field.
- The sampled docs pages consistently use JSON request/response bodies with the shared `meta` + `data` envelope.
- The reviewed pages did not expose a universal pagination contract for every list route beyond the tracking-list cursor model.

## Important usage notes
- The API surface is versioned in the path, so fireROUTE adapters should preserve the reviewed `2026-01` base prefix.
- `GET /trackings` is the richest filtering route in the reviewed docs and is the main place where cursor pagination is explicitly documented.
- Additional tracking fields such as `tracking_account_number`, `tracking_key`, ship date, and postal/state data are carrier-dependent and matter for courier detection and for some tracking creations.
- The request-errors page still mentions the old default `10 requests per second` text in its `429` example table, but the dedicated rate-limit page supersedes that with per-endpoint limits; the provider doc should prefer the dedicated rate-limit table.

## Verification notes
This file was manually rebuilt from the current official AfterShip Tracking docs using browser-based review only.