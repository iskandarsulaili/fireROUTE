# positionstack

## Provider metadata
- Category: `Geocoding`
- Provider slug: `positionstack`
- Official docs used manually:
  - `https://positionstack.com/`
  - `https://docs.apilayer.com/positionstack/docs/api-documentation`
  - `https://docs.apilayer.com/positionstack/docs/positionstack-api-v-1-0-0`
  - `https://api.swaggerhub.com/apis/apilayer-863/PositionstackAPI/1.0.0/swagger.json`
- Public base URL documented by provider: `https://api.positionstack.com/v1`
- Transport: `HTTPS`
- Auth model: API key in query parameter `access_key`
- Response formats documented: `json`, `xml`, `geojson`; JSONP is documented via `callback`

## Product / plan notes
- The official homepage markets Positionstack as a forward/reverse geocoding API covering more than 2 billion places and addresses.
- The homepage advertises a free tier of `100 monthly geocode requests`.
- The docs page says average responses range from `10ms` to `100ms` depending on request size.
- Official docs also expose optional enrichment modules for country, timezone, sun, and bounding-box data.

## Confirmed API surface
The linked official API reference exposes 4 operations:
- `GET /forward`
- `POST /forward`
- `GET /reverse`
- `POST /reverse`

## Shared query parameters
Common controls reused across the GET routes and partially across the POST routes:
- `access_key` - required API key
- `country` - optional comma-separated ISO country filter
- `region` - optional free-text region filter
- `language` - optional language code
- `limit` - optional maximum result count, `1..80`, default `10`
- `fields` - optional comma-separated field selector
- `output` - optional `json`, `xml`, or `geojson`
- `callback` - optional JSONP callback name on GET routes
- `country_module` - optional `0` or `1`
- `timezone_module` - optional `0` or `1`
- `sun_module` - optional `0` or `1` on GET routes
- `bbox_module` - optional `0` or `1` on GET routes

Representative response fields visible in the official schema:
- per result: `latitude`, `longitude`, `label`, `name`, `type`, `number`, `street`, `postal_code`, `confidence`, `region`, `region_code`, `administrative_area`, `neighbourhood`, `country`, `country_code`, `map_url`, `distance`
- nested `country_module`: `population`, `capital`, `area`, `calling_code`, `region`, `subregion`, `currencies`, `languages`
- nested `timezone_module`: `id`, `current_time`, `gmt_offset`, `code`, `is_daylight_saving`
- nested `sun_module`: `sunrise`, `sunset`, `solar_noon`, `day_length`
- nested `bbox_module`: `min_longitude`, `min_latitude`, `max_longitude`, `max_latitude`

## 1) Forward geocoding
- Method: `GET`
- Path: `/forward`
- Full URL pattern: `https://api.positionstack.com/v1/forward?access_key=<key>&query=<address-or-place>`
- Purpose: convert an address, place name, or postal-style query into coordinates and structured location metadata

Required query parameters:
- `access_key`
- `query` - free-form address/place string

Optional query parameters:
- `country`
- `region`
- `language`
- `limit`
- `fields`
- `output`
- `callback`
- `country_module`
- `sun_module`
- `timezone_module`
- `bbox_module`

## 2) Batch forward geocoding
- Method: `POST`
- Path: `/forward`
- Full URL pattern: `https://api.positionstack.com/v1/forward?access_key=<key>`
- Purpose: submit multiple forward-geocoding queries in one request

Documented request body:
- content type: `application/json`
- required top-level object with `batch` array
- each `batch` item requires `query`
- each `batch` item may also include `country`, `region`, `language`, and `limit`

Official example shape from the linked OpenAPI file:
- `{"batch":[{"query":"Main Street","country":"US","region":"Minnesota"},{"query":"Brandenburger Tor, Berlin","country":"DE"}]}`

Supported query parameters on the route:
- `access_key`
- `fields`
- `output`
- `country_module`
- `timezone_module`

## 3) Reverse geocoding
- Method: `GET`
- Path: `/reverse`
- Full URL pattern: `https://api.positionstack.com/v1/reverse?access_key=<key>&query=<lat,long-or-ip>`
- Purpose: convert coordinates or an IP-style target into nearby address/place results

Required query parameters:
- `access_key`
- `query` - reverse-geocoding target; official docs say this can be `latitude,longitude` or an IP address

Optional query parameters:
- `country`
- `region`
- `language`
- `limit`
- `fields`
- `output`
- `callback`
- `country_module`
- `sun_module`
- `timezone_module`
- `bbox_module`

Usage note:
- the official response description says reverse results may include `distance` in meters.

## 4) Batch reverse geocoding
- Method: `POST`
- Path: `/reverse`
- Full URL pattern: `https://api.positionstack.com/v1/reverse?access_key=<key>`
- Purpose: submit multiple reverse-geocoding queries in one request

Documented request body:
- content type: `application/json`
- required top-level object with `batch` array
- each `batch` item requires `query`
- each `query` value is documented as coordinates in `lat,long` format or an IP address

Official example shape from the linked OpenAPI file:
- `{"batch":[{"query":"40.7638435,-73.9729691"},{"query":"72.229.28.185"}]}`

Supported query parameters on the route:
- `access_key`
- `fields`
- `output`

## Errors, rate limits, and pagination
- No pagination model is documented; result counts are bounded with `limit`.
- The linked OpenAPI file documents these response classes across the geocoding routes:
  - `400` - missing or malformed parameters
  - `401` - missing or invalid `access_key`
  - `403` - feature/output restricted by plan
  - `422` - semantic validation failure
  - `429` - rate or usage limit reached
  - `500` - internal server error
- The homepage and pricing section expose plan-level monthly quotas, but the inspected official docs did not publish a universal numeric rate-limit table beyond plan descriptions.

## Canonical fireROUTE notes
- Treat `GET` and `POST` variants as distinct operations because the POST routes are the official batch interface.
- `query` is overloaded by the provider: forward mode expects address/place text, reverse mode expects coordinates or IP input.
- Module flags (`country_module`, `timezone_module`, `sun_module`, `bbox_module`) materially change response shape and should remain optional passthrough controls.
- GeoJSON output is officially supported and should not be collapsed to JSON-only handling.

## Verification notes
- This file was manually rebuilt from the live official Positionstack homepage, APILayer docs pages, and the linked official Swagger/OpenAPI file using browser tools.
