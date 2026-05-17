# Tripadvisor

## Provider metadata
- Category: `Transportation`
- Provider slug: `tripadvisor`
- Official docs used manually:
  - `https://developer-tripadvisor.com/`
  - `https://www.tripadvisor.com/developers`
  - legacy Content API docs reached from the official developer page:
    - `https://tripadvisor-content-api.readme.io/reference/overview`
    - `https://tripadvisor-content-api.readme.io/reference/authentication`
    - `https://tripadvisor-content-api.readme.io/reference/rate-limits`
    - `https://tripadvisor-content-api.readme.io/reference/review-implementation-policy`
  - current Terra docs:
    - `https://docs.terra.tripadvisor.com/docs/overview`
    - `https://docs.terra.tripadvisor.com/docs/endpoints-overview`
    - `https://docs.terra.tripadvisor.com/docs/api-access-and-limits`
    - `https://docs.terra.tripadvisor.com/docs/rate-limits`
    - `https://docs.terra.tripadvisor.com/docs/versioning-compatibility`
    - `https://docs.terra.tripadvisor.com/docs/caching-policy`
    - `https://docs.terra.tripadvisor.com/docs/guide-for-when-to-use-catalog-search-vs-location-search`
    - `https://docs.terra.tripadvisor.com/docs/guide-for-managing-allowed-locations`
    - `https://docs.terra.tripadvisor.com/docs/download-a-feed`
    - `https://docs.terra.tripadvisor.com/reference/errors`
    - route pages inspected during review, including:
      - `https://docs.terra.tripadvisor.com/reference/cataloglocationsnearbyget`
      - `https://docs.terra.tripadvisor.com/reference/cataloglocationssearch`
      - `https://docs.terra.tripadvisor.com/reference/geoget`
      - `https://docs.terra.tripadvisor.com/reference/geosget`
      - `https://docs.terra.tripadvisor.com/reference/locationsget`
      - `https://docs.terra.tripadvisor.com/reference/locationget`
      - `https://docs.terra.tripadvisor.com/reference/locationphotosget`
      - `https://docs.terra.tripadvisor.com/reference/locationreviewsget`
      - `https://docs.terra.tripadvisor.com/reference/locationsnearbyget`
      - `https://docs.terra.tripadvisor.com/reference/locationssearch`
      - `https://docs.terra.tripadvisor.com/reference/recommendationssearch-1`
      - `https://docs.terra.tripadvisor.com/reference/getfileurl`
      - `https://docs.terra.tripadvisor.com/reference/getfile`
      - `https://docs.terra.tripadvisor.com/reference/listfiles`
      - `https://docs.terra.tripadvisor.com/reference/getallowlist`
      - `https://docs.terra.tripadvisor.com/reference/uploadallowlist`
- Current production base URL from the Terra API reference: `https://terra.tripadvisor.com/api`
- Authentication:
  - `X-API-Key` header is required for all Terra endpoints
  - the official developer portal still exposes the older Content API, but the current public fine-grained route catalog is now the Terra platform
- Primary response formats:
  - `application/json` for successful responses
  - `application/problem+json` for documented error responses
  - `302` redirect flow for direct feed downloads via `/feeds/{filename}`

## Important official usage notes
- The developer landing page still links the older `Content API`, but the same official docs now point developers toward the newer `Tripadvisor Terra Platform`.
- I treated Terra as the current public route reference because it exposes the active route-level catalog, auth model, error schemas, and policy pages.
- The Terra guides split the platform into:
  - Partner API routes for catalog, geos, locations, and AI recommendations
  - Feed API routes for batch file access
  - Account API routes for allowlist management
- The `Guide for when to use Catalog Search vs Location Search` says:
  - catalog endpoints are for reference, discovery, debugging, and allowlist-management workflows and are not constrained by allowlists or geofencing
  - production location search / nearby endpoints are intended for end-user traffic, enforce allowlist/geofencing rules, and return fuller location payloads
- The `Guide for Downloading Feeds` says feeds are available only for `Innovate` and `Transform` package tiers, are generated daily, and remain available for `30 days`.
- The allowlist guide says allowlist functionality is contract-dependent and not applicable to every account.

## Rate limits, pagination, versioning, caching, and errors

### Rate limits
- The official Terra docs expose two related quota views:
  - `Rate Limits` says limits are enforced on a `24-hour rolling window` and depend on the account's configured daily budget and QPS settings in the Terra dashboard.
  - `API Access and Limits` publishes package examples:
    - `Discover`: `10 QPS`
    - `Growth`: `25 QPS`
    - `Scale+`: `50 QPS`
    - `Discover` daily quota: `10,000 calls per day per API`
    - other packages: daily quotas are contract-defined
- The docs say `429 Too Many Requests` is returned when limits are exceeded and recommend exponential backoff with jitter.
- The allowlist guide adds that POST allowlist updates consume a separate daily quota, while GET allowlist requests are not rate-limited.

### Pagination
- Search and nearby endpoints use explicit pagination objects with `page`, `size`, `total_elements`, and `total_pages`.
- Search routes use `page` as `1`-based indexing.
- The feed list and allowlist GET routes document `page` / `size` parameters; the allowlist guide says the default GET page size is `1000`.
- Photos and reviews are paginated and expose `page` / `size` query parameters.

### Versioning
- The `Versioning & Compatibility` guide says every API request can include a `version` parameter and that omitting it defaults to the latest available version.
- The same guide shows examples like `?version=1`.
- The allowlist guide separately shows `?version=v1` in an example, so the public docs currently contain a version-parameter example inconsistency.

### Caching
- The Terra `Caching Policy` says that, unless a contract explicitly says otherwise, Tripadvisor content must not be cached, copied, downloaded, stored, or indexed, except that `Location ID` may be cached solely to improve application speed.

### Errors
- The official `Errors` page documents these common problem types:
  - `400 Bad Request`
  - `400 Constraint Violation` with `field_errors`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Resource Not Found`
  - `429 Too Many Requests`
  - `500 Internal Server Error`
- Content-specific `404` variants are also documented for missing `geo` IDs and missing `location` IDs.
- The published error envelope includes fields such as `type`, `title`, `status`, `detail`, `instance`, and `trace_id`.
- Live anonymous browser verification during review against `https://terra.tripadvisor.com/api/locations/123` returned:
  - HTTP status `401`
  - content type `application/problem+json`
  - body with `"title":"Unauthorized"` and `"detail":"API key is not provided"`

## Confirmed API surface
The current public Terra reference exposes these `16` routes:

### Catalog
1. `GET /catalog/locations/nearby`
2. `GET /catalog/locations/search`

### Geos
3. `GET /geos/{id}`
4. `GET /geos`

### Locations
5. `GET /locations`
6. `GET /locations/{id}`
7. `GET /locations/{id}/photos`
8. `GET /locations/{id}/reviews`
9. `GET /locations/nearby`
10. `GET /locations/search`

### Recommendations
11. `POST /recommendations/search`

### Feeds
12. `GET /feeds/json/{filename}`
13. `GET /feeds/{filename}`
14. `GET /feeds/files/list`

### Allowlist
15. `GET /allowlist`
16. `POST /allowlist`

## Route-family parameter and behavior notes

### 1) Catalog search routes
- `GET /catalog/locations/nearby`
  - purpose: search Tripadvisor's broader catalog around a location, point+radius, or bounding box
  - location inputs: `location_id` or `lat` + `lon`
  - area inputs: `radius` + `unit` or bounding-box coordinates `sw_lat`, `sw_lon`, `ne_lat`, `ne_lon`
  - filters / paging: `category`, `min_rating`, `page`, `size`, `sort`
  - response note: abbreviated catalog results with pagination metadata
- `GET /catalog/locations/search`
  - purpose: search the broader catalog by name or address
  - required query: `query`
  - optional filters: `search_type`, `country_code`, `geo_name`, `postal_code`, `category`, `page`, `size`
  - response note: returns matched locations plus `matched_value` metadata and pagination

### 2) Geo routes
- `GET /geos/{id}`
  - purpose: return one geo's detailed factual / hierarchy / description data
  - path parameter: `id`
  - response note: docs show names, coordinates, hierarchy, descriptions, awards, and FAQ-like geo content
- `GET /geos`
  - purpose: fetch multiple geos in one call
  - required query: repeated `id` values as an array of geo IDs
  - response note: bulk geo payload under `data`

### 3) Location detail routes
- `GET /locations`
  - purpose: bulk-fetch multiple location detail payloads
  - required query: repeated `id` values as an array of location IDs
  - usage note: official docs position this as the bulk alternative to the single-location route for search-result pages and sync workflows
- `GET /locations/{id}`
  - purpose: fetch one location's full detail payload
  - path parameter: `id`
  - response note: docs describe names, addresses, coordinates, descriptions, categories, attributes, awards, traveler ratings, rankings, hours, phone numbers, and URLs
- `GET /locations/{id}/photos`
  - purpose: retrieve traveler and management photos for one location
  - path parameter: `id`
  - query parameters: `page`, `size`, `sort`
  - response note: paginated photo objects with captions, media links, publication timestamps, source metadata, and user metadata
- `GET /locations/{id}/reviews`
  - purpose: retrieve traveler reviews for one location
  - path parameter: `id`
  - documented filters: `rating_min`, `trip_type`, `published_after_ts`, `sort_by`, `published_after_review_id`, `page`, `size`
  - response note: paginated review objects with text, rating, subratings, traveler metadata, owner responses, optional photos, and timestamps

### 4) Location discovery routes
- `GET /locations/nearby`
  - purpose: search consumer-facing allowed locations near a point or area
  - location / area parameters mirror catalog-nearby: `location_id` or `lat` + `lon`, plus `radius`/`unit` or bounding-box coordinates
  - additional filters: `category`, `min_rating`, `include_photo`, `page`, `size`, `sort`
  - response note: fuller location payload than catalog results; docs show optional photo inclusion
- `GET /locations/search`
  - purpose: search consumer-facing allowed locations by name or address
  - required query: `query`
  - optional filters: `search_type`, `country_code`, `geo_name`, `postal_code`, `category`, `page`, `size`
  - usage note: intended for live product traffic where results must respect allowlist and geofencing

### 5) Agentic recommendations route
- `POST /recommendations/search`
  - purpose: AI-powered recommendations based on natural-language queries and Tripadvisor review/content data
  - documented request concepts:
    - `query`
    - `geo` object via `name`, `geo_id`, or `search_area` coordinates/radius
    - optional `top_level_categories`
    - optional `limit`
    - optional `exclude_location_ids`
    - optional `response_preference` such as `speed` or `quality`
  - important note: docs say this service is currently representative / contract-gated and self-service sign-up is planned for `2026 Q1`

### 6) Feed routes
- `GET /feeds/json/{filename}`
  - purpose: return a temporary presigned download URL and expiry timestamp for one feed file
  - path parameter: `filename`
  - response fields: `url`, `exp`
- `GET /feeds/{filename}`
  - purpose: directly download a feed file through an automatic redirect
  - path parameter: `filename`
  - response behavior: documented `302` redirect to a secure download URL
- `GET /feeds/files/list`
  - purpose: list available feed files
  - query parameters: `page`, `size`, `sort`
  - response note: returns filenames, file sizes, and pagination

### 7) Allowlist routes
- `GET /allowlist`
  - purpose: retrieve the account's allowed location IDs
  - query parameters: `page`, `size`, `sort`
  - response note: paginated array of location IDs
- `POST /allowlist`
  - purpose: modify the allowlist
  - body fields:
    - `allowlist` array of location IDs
    - `operation_type` with allowed values `APPEND`, `DELETE`, or `OVERWRITE`
  - response note: returns counts of `added`, `deleted`, and `no_change`

## Additional official integration notes
- The Terra `Endpoints Overview` says `X-API-KEY` is required for all endpoints.
- The `API Access and Limits` guide says API keys are package-scoped and can return `403 Forbidden` with `API Key does not have access to endpoint` when a route is outside the subscribed package.
- The `Review Implementation Policy` remains strict: review text must not appear directly in page source and should be loaded in ways blocked from crawler indexing.
- The docs say unknown fields and new enum values should be tolerated across compatible releases.
- Feed access and allowlist capability are both contract/package dependent, so not every Tripadvisor partner will be authorized for all `16` documented routes.

## Sources inspected
- `https://developer-tripadvisor.com/`
- `https://www.tripadvisor.com/developers`
- `https://tripadvisor-content-api.readme.io/reference/overview`
- `https://tripadvisor-content-api.readme.io/reference/authentication`
- `https://tripadvisor-content-api.readme.io/reference/rate-limits`
- `https://tripadvisor-content-api.readme.io/reference/review-implementation-policy`
- `https://docs.terra.tripadvisor.com/docs/overview`
- `https://docs.terra.tripadvisor.com/docs/endpoints-overview`
- `https://docs.terra.tripadvisor.com/docs/api-access-and-limits`
- `https://docs.terra.tripadvisor.com/docs/rate-limits`
- `https://docs.terra.tripadvisor.com/docs/versioning-compatibility`
- `https://docs.terra.tripadvisor.com/docs/caching-policy`
- `https://docs.terra.tripadvisor.com/docs/guide-for-when-to-use-catalog-search-vs-location-search`
- `https://docs.terra.tripadvisor.com/docs/guide-for-managing-allowed-locations`
- `https://docs.terra.tripadvisor.com/docs/download-a-feed`
- `https://docs.terra.tripadvisor.com/reference/errors`
- live anonymous verification during review:
  - `https://terra.tripadvisor.com/api/locations/123`
