# Open Government, USA

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-usa`
- Official docs/pages used:
  - `https://data.gov/user-guide/` (official Data.gov user guide linking to the catalog API)
  - `https://resources.data.gov/catalog-api/` (official catalog API reference)
- Current public API base URL: `https://catalog.data.gov`
- Important official note: the catalog API page says Data.gov expects its API base URL to move behind `api.data.gov`, so integrations should avoid hard-coding assumptions beyond the currently documented base URL
- Auth model: no API key required; the official catalog API page says all endpoints are publicly accessible
- Response format: JSON by default; `GET /harvest_record/{record_id}/raw` returns the original payload with content type detected automatically (`application/json`, `application/xml`, or `text/plain`)
- Rate limits: no public rate-limit policy was exposed on the official catalog API page reviewed here
- Manually confirmed route count: `8`

## Access notes
- The official catalog API page explicitly states that this API replaces the previous CKAN-based API for new integrations.
- The prior CKAN-based endpoint remains available in a read-only state for existing integrations, but the official guidance is to use the new catalog API documented below.
- This provider is a metadata-catalog API: it helps search datasets and inspect harvest metadata, not fetch every underlying agency dataset directly.

## Canonical endpoints
1. `GET /search`
   - Search the Data.gov catalog for datasets using keywords, filters, sorting, and cursor pagination.
2. `GET /api/keywords`
   - Retrieve the most common dataset keywords and their counts.
3. `GET /api/locations/search`
   - Search place names for spatial filtering/autocomplete.
4. `GET /api/location/{location_id}`
   - Retrieve the GeoJSON boundary for a specific location.
5. `GET /api/organizations`
   - Retrieve the full list of publishing organizations.
6. `GET /harvest_record/{record_id}`
   - Retrieve metadata about a specific harvest record.
7. `GET /harvest_record/{record_id}/raw`
   - Retrieve the original unmodified source payload for a harvest record.
8. `GET /harvest_record/{record_id}/transformed`
   - Retrieve the transformed DCAT-US payload for a harvest record.

## Parameters
### `GET /search`
Official query parameters:
- `q` - full-text search query; default empty string
- `sort` - `relevance`, `popularity`, `distance`, or `last_harvested_date`; default `relevance`
- `per_page` - number of results to return per page; default `10`, minimum `1`
- `org_slug` - filter by organization slug, for example `nasa`
- `org_type` - filter by organization type; valid values are `Federal Government`, `City Government`, `State Government`, `County Government`, `University`, `Tribal`, or `Non-Profit`
- `keyword` - exact-match keyword filter; repeat parameter for multiple values
- `spatial_filter` - `geospatial` or `non-geospatial`
- `spatial_geometry` - GeoJSON geometry string used for spatial filtering
- `spatial_within` - boolean; default `false`; when `true`, returns only datasets completely within `spatial_geometry`
- `after` - cursor returned by a previous response for pagination

### `GET /api/keywords`
Official query parameters:
- `size` - maximum number of keywords to return; default `100`, valid range `1-1000`
- `min_count` - minimum dataset count for returned keywords; default `1`

### `GET /api/locations/search`
Official query parameters:
- `q` - partial or full location name
- `size` - maximum number of results to return

### `GET /api/location/{location_id}`
- `location_id` - required location UUID returned by `/api/locations/search`

### `GET /harvest_record/{record_id}`
### `GET /harvest_record/{record_id}/raw`
### `GET /harvest_record/{record_id}/transformed`
- `record_id` - required harvest-record UUID

### `GET /api/organizations`
- No query parameters are documented; the page says this endpoint returns all organizations.

## Response notes
### `GET /search`
The official docs describe these top-level response fields:
- `results` - array of matching datasets
- `sort` - sort order applied to the response
- `after` - pagination cursor for the next page; absent when there are no more results

The official response-field table also highlights dataset fields such as:
- `results[].title`
- `results[].description`
- `results[].identifier`
- `results[].slug`
- `results[].publisher`
- `results[].keyword[]`
- `results[].theme[]`
- `results[].has_spatial`
- `results[].spatial_centroid`
- `results[].spatial_shape`
- `results[].popularity`
- `results[].last_harvested_date`
- `results[].distribution_titles[]`
- `results[].organization`
- `results[].dcat`
- `results[].harvest_record`
- `results[].harvest_record_raw`

The nested `dcat` object is documented as full DCAT-US metadata and may include fields like:
- `@type`
- `title`
- `description`
- `identifier`
- `accessLevel`
- `modified`
- `publisher`
- `contactPoint`
- `keyword[]`
- optional `distribution[]`, `landingPage`, `license`, `bureauCode[]`, `programCode[]`, `issued`, `theme[]`, `spatial`, `temporal`, `accrualPeriodicity`, `language[]`, `rights`, `describedBy`, `describedByType`, `references[]`, `isPartOf`, `dataQuality`, `conformsTo`, `primaryITInvestmentUII`, `systemOfRecords`, and `phone`

### `GET /api/keywords`
The example response includes:
- `keywords[]` with `{ keyword, count }`
- `size`
- `min_count`
- `total`

### `GET /api/locations/search`
The example response includes:
- `locations[]` with `id` and `display_name`
- `size`
- `total`

### `GET /api/location/{location_id}`
The example response includes:
- `id`
- `geometry` as GeoJSON

### `GET /api/organizations`
The example response includes:
- `organizations[]`
- `total`

Documented organization fields include:
- `id`
- `name`
- `slug`
- `organization_type`
- `aliases[]`
- `dataset_count`

### Harvest-record endpoints
`GET /harvest_record/{record_id}` returns fields such as:
- `id`
- `identifier`
- `status`
- `action`
- `date_created`
- `date_finished`
- `harvest_job_id`
- `harvest_source_id`
- `source_hash`
- `source_raw`
- `source_transform`
- `ckan_id`
- `ckan_name`
- `parent_identifier`

`GET /harvest_record/{record_id}/raw` returns the original source payload in its detected content type.

`GET /harvest_record/{record_id}/transformed` returns transformed DCAT-US JSON.

## Pagination and errors
- The official docs say `/search` uses cursor-based pagination, not page-number pagination.
- To continue paging, keep all other search parameters the same and pass the returned `after` value into the next request.
- Official status codes documented for the API overall:
  - `200 OK`
  - `404 Not Found`
  - `422 Unprocessable Entity`
  - `500 Internal Server Error`
- Shared error response example:
  - `{ "error": "A description of what went wrong" }`
- Validation-error example for `422`:
  - `{ "message": "Validation error", "detail": { "<location>": { "<field_name>": ["error message"] } } }`

## Usage notes
- Use `/api/organizations` first when you need a valid `org_slug` for `/search`.
- Use `/api/locations/search` first when you need a `location_id` for `/api/location/{location_id}` and spatial filtering workflows.
- The `raw` harvest endpoint is the only officially documented route here whose response format may be JSON, XML, or plain text depending on the underlying source payload.
- `source_raw` inside the harvest-record metadata endpoint is parsed as JSON when possible.

## fireROUTE normalization notes
- Treat this provider as a catalog/discovery API, not as a unified data-delivery API for every federal dataset.
- Normalize the eight documented GET routes above and preserve the official separation between search/discovery endpoints and harvest-record inspection endpoints.
- Preserve cursor pagination exactly as documented for `/search`; do not translate it into synthetic page-number semantics.
