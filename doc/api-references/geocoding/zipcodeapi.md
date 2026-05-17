# ZipCodeAPI

## Provider metadata
- Category: `Geocoding`
- Provider slug: `zipcodeapi`
- Official docs used manually:
  - `https://www.zipcodeapi.com/API`
  - `https://www.zipcodeapi.com/openapi.yaml`
- Public API base URL documented by provider: `https://www.zipcodeapi.com`
- Transport: `HTTPS`
- Auth model: API key embedded in the request path as `{apiKey}`; the live docs page also mentions a separate JavaScript client key for browser auto-fill examples
- Response formats visible in the inspected docs: `JSON`, `XML`, and `CSV` for the main US route patterns on the live page; the published OpenAPI file models JSON responses and omits some page-documented operations

## Product and access notes
- The official page says the API supports only US ZIP codes and Canadian postal codes.
- For Canadian postal codes in URLs, the provider says to remove the space or URL-encode it, e.g. `A0A1A0` or `A0A+1A0`.
- The page says the Canadian data is sourced from GeoNames under the Creative Commons Attribution 4.0 License.
- The live docs page says an account is required and the free tier is `10 requests per hour`.
- The page warns that its public demo API key is periodically regenerated and may intentionally return incorrect demo values if abuse is detected.

## Confirmed API surface
The inspected official docs confirm these `14` operations:
1. `GET /rest/{apiKey}/distance.{format}/{zip1}/{zip2}/{unit}`
2. `GET /rest/v2/CA/{apiKey}/distance.{format}/{caPostal1}/{caPostal2}/{unit}`
3. `GET /rest/{apiKey}/multi-distance.{format}/{zip}/{zipsCsv}/{unit}`
4. `GET /rest/{apiKey}/radius.{format}/{zip}/{distance}/{unit}`
5. `GET /rest/v2/CA/{apiKey}/radius.{format}/{zip}/{distance}/{unit}`
6. `POST /rest/{apiKey}/multi-radius.{format}/{distance}/{unit}`
7. `GET /rest/{apiKey}/match-close.{format}/{zipsCsv}/{distance}/{unit}`
8. `GET /rest/{apiKey}/info.{format}/{zip}/{latLongUnit}`
9. `GET /rest/{apiKey}/multi-info.{format}/{zipsCsv}/{latLongUnit}`
10. `GET /rest/v2/CA/{apiKey}/info.{format}/{caPostal1}/{latLongUnit}`
11. `GET /rest/{apiKey}/city-zips.{format}/{city}/{state}`
12. `GET /rest/v2/CA/{apiKey}/city-postal-codes.{format}/{city}/{province}`
13. `GET /rest/{apiKey}/state-zips.{format}/{state}`
14. `GET /rest/{apiKey}/radius-sql.{format}/{lat}/{long}/{latLongUnit}/{distance}/{unit}/{latFieldName}/{longFieldName}/{precision}`

## Shared request rules
- Authentication is path-based rather than header-based.
- The published OpenAPI file uses server base URL `https://www.zipcodeapi.com/`.
- Common unit enum shown in the OpenAPI file: `mile`, `km`.
- Common latitude/longitude unit enum shown in the OpenAPI file: `degrees`, `radians`.
- The official page presents `<format>` placeholders in many route examples; the live widgets and OpenAPI file should be treated as the source of truth when a specific route appears JSON-only in practice.

## 1) US distance between two ZIP codes
- Method: `GET`
- Path pattern: `/rest/{apiKey}/distance.{format}/{zip1}/{zip2}/{unit}`
- Purpose: return distance between two US ZIP codes
- Documented path parameters:
  - `zip1` - first 5-digit ZIP code
  - `zip2` - second 5-digit ZIP code
  - `unit` - `mile` or `km`
- Response note from OpenAPI: JSON body with `distance`

## 2) Canadian distance between two postal codes
- Method: `GET`
- Path pattern: `/rest/v2/CA/{apiKey}/distance.{format}/{caPostal1}/{caPostal2}/{unit}`
- Purpose: return distance between two Canadian postal codes
- Documented path parameters:
  - `caPostal1`
  - `caPostal2`
  - `unit` - `mile` or `km`
- Important note: remove spaces from postal codes or encode them in the URL

## 3) Multiple US distances from one origin ZIP
- Method: `GET`
- Path pattern: `/rest/{apiKey}/multi-distance.{format}/{zip}/{zipsCsv}/{unit}`
- Purpose: compute distance from one ZIP code to multiple other ZIP codes
- Documented parameters:
  - `zip` - origin ZIP
  - `zipsCsv` - comma-separated ZIP list; the OpenAPI file uses pattern `^\d{5}(,\d{5})*$`
  - `unit`
- Official billing note: each ZIP code provided counts as a separate request; ZIPs not found are omitted from the response

## 4) US ZIPs within radius
- Method: `GET`
- Path pattern: `/rest/{apiKey}/radius.{format}/{zip}/{distance}/{unit}`
- Purpose: return all US ZIP codes within a radius of a ZIP code
- Documented parameters:
  - `zip`
  - `distance`
  - `unit`
  - query `minimal` - if true, returns only ZIP codes and allows a radius larger than the normal cap
- Official limits:
  - radius capped at `500 miles` unless `minimal` is used or the account has the unlimited subscription

## 5) Canadian postal codes within radius
- Method: `GET`
- Path pattern: `/rest/v2/CA/{apiKey}/radius.{format}/{zip}/{distance}/{unit}`
- Purpose: return all Canadian postal codes within a radius of a postal code
- Documented parameters:
  - `zip`
  - `distance`
  - `unit`
  - query `minimal`
  - query `simple`
  - query `limit` for higher result caps when using minimal/simple modes
- Official limits and notes:
  - radius capped at `805 km` unless `minimal` or `simple` is used or the account has the unlimited subscription
  - default full-response limit is `250` postal codes
  - `minimal` can raise the limit to `1500`
  - `simple` can raise the limit to `50000`
  - `simple` returns aligned `postal_codes` and `distances` arrays to reduce bandwidth

## 6) Multiple US ZIPs by radius
- Method: `POST`
- Path pattern: `/rest/{apiKey}/multi-radius.{format}/{distance}/{unit}`
- Purpose: find ZIPs within a radius for multiple input ZIPs or addresses
- Official page-documented POST variables:
  - `zip_codes` - up to `100` lines
  - `addrs` - up to `100` lines
- Important usage notes:
  - only one of `zip_codes` or `addrs` may be sent
  - each line is charged as a separate request
  - provider says it makes a best-effort ZIP extraction from submitted addresses
  - radius is capped at `500 miles`
- Important spec note: this operation appears on the live official docs page but was not present in the inspected OpenAPI YAML

## 7) Find close ZIP pairs
- Method: `GET`
- Path pattern: `/rest/{apiKey}/match-close.{format}/{zipsCsv}/{distance}/{unit}`
- Purpose: return all ZIP-pair combinations whose mutual distance is below the threshold
- Documented parameters:
  - `zipsCsv` - up to `100` ZIP codes on the live page
  - `distance`
  - `unit`

## 8) US ZIP to location info
- Method: `GET`
- Path pattern: `/rest/{apiKey}/info.{format}/{zip}/{latLongUnit}`
- Purpose: return city, state, lat/lng, timezone, and related location data for one US ZIP
- Documented parameters:
  - `zip`
  - `latLongUnit` - `degrees` or `radians`
- Confirmed response fields from the OpenAPI file include:
  - `zip_code`, `city`, `state`, `lat`, `lng`
  - `timezone.timezone_identifier`, `timezone.timezone_abbr`, `timezone.utc_offset_sec`, `timezone.is_dst`
  - `acceptable_city_names`
  - `area_codes`

## 9) Multiple US ZIPs to location info
- Method: `GET`
- Path pattern: `/rest/{apiKey}/multi-info.{format}/{zipsCsv}/{latLongUnit}`
- Purpose: return location metadata for multiple ZIP codes
- Documented parameters:
  - `zipsCsv` - max `100` ZIPs per the OpenAPI file description
  - `latLongUnit`
- Official billing note: each ZIP code provided counts as a separate request

## 10) Canadian postal code to location info
- Method: `GET`
- Path pattern: `/rest/v2/CA/{apiKey}/info.{format}/{caPostal1}/{latLongUnit}`
- Purpose: return city, province, and lat/lng for a Canadian postal code
- Confirmed response fields from the OpenAPI file include:
  - `postal_code`, `city`, `province`, `lat`, `lng`
  - `acceptable_city_names`

## 11) US city to ZIP codes
- Method: `GET`
- Path pattern: `/rest/{apiKey}/city-zips.{format}/{city}/{state}`
- Purpose: return ZIP codes for a US city/state combination

## 12) Canadian city to postal codes
- Method: `GET`
- Path pattern: `/rest/v2/CA/{apiKey}/city-postal-codes.{format}/{city}/{province}`
- Purpose: return postal codes for a Canadian city/province combination

## 13) US state to ZIP codes
- Method: `GET`
- Path pattern: `/rest/{apiKey}/state-zips.{format}/{state}`
- Purpose: return all ZIP codes in a US state
- Official billing note: every `10` ZIP codes returned are billed as `1` request; the live page gives the example that `200` ZIPs would cost `20` requests

## 14) Radius SQL builder
- Method: `GET`
- Path pattern: `/rest/{apiKey}/radius-sql.{format}/{lat}/{long}/{latLongUnit}/{distance}/{unit}/{latFieldName}/{longFieldName}/{precision}`
- Purpose: generate a SQL `WHERE` clause for latitude/longitude radius filtering in the caller's own database
- Documented parameters:
  - `lat`
  - `long`
  - `latLongUnit` - `degrees` or `radians`
  - `distance`
  - `unit` - `mile` or `km`
  - `latFieldName`
  - `longFieldName`
  - `precision` - the live page shows selectable values `1` through `16`
- Official usage notes:
  - higher precision yields a more detailed and more accurate SQL expression
  - precision `2` gives decent results for short distances
  - larger distances may require higher precision
  - the page recommends a database index on the latitude/longitude pair
- Important spec note: this route is shown on the live official docs page but was not present in the inspected OpenAPI YAML

## Errors, limits, pagination, and format notes
- No pagination scheme is documented.
- Common documented HTTP errors on the live docs page:
  - `400` - request format was not correct
  - `401` - API key missing, inactive, or disabled
  - `404` - supplied ZIP or postal code not found
  - `429` - hourly usage limit exceeded
- The OpenAPI file also models route-specific response objects for distance, radius, info, city/state lookup, and match-close outputs.
- The free plan on the page is `10 requests per hour`; higher usage requires a paid plan.

## Canonical fireROUTE notes
- Keep US and Canadian route families distinct because the provider versions them differently (`/rest/...` vs `/rest/v2/CA/...`).
- Preserve the page-vs-OpenAPI discrepancy: the live page documents `multi-radius` and `radius-sql`, while the inspected OpenAPI YAML did not include them.
- Preserve per-route billing notes because several endpoints charge one call as multiple requests.

## Verification notes
- This file was manually rebuilt from the live official ZipCodeAPI docs page and the linked official OpenAPI file using browser tools.
