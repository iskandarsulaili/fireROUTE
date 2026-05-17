# Keen IO

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `keen-io`
- Docs used manually:
  - `https://keen.io/`
  - `https://keen.io/docs/api/`
- Confirmed API base URL: `https://api.keen.io`
- Primary version documented on the reviewed page: `3.0`
- Primary response format confirmed in this pass: JSON
- Authentication model confirmed in this pass: API keys supplied either in the `Authorization` header or as the `api_key` query parameter; Kafka auth is also documented for streaming use
- Manually confirmed route patterns in this pass: `31`

## Authentication
The official Keen API reference documents these key types and scopes:
- `Master Key` - can authenticate any API call and is required for administrative actions such as deleting data and requesting project data
- `Write Key` - for writing data, especially stream/event-ingest requests
- `Read Key` - for querying, analyzing, and extracting data
- `Organization Key` - for organization/project management routes in the Access section
- `Access Key` - programmatically generated scoped key for restricted customer-facing access

The reviewed docs confirm two HTTP auth mechanisms:
- `Authorization: <API_KEY>` header
- `api_key=<API_KEY>` query parameter

Additional protocol notes from the official docs:
- all HTTP `POST` requests require `Content-Type: application/json`
- Kafka producer auth uses `PROJECT_ID` as username and the project `WRITE_KEY` as password with SASL/SSL
- Kafka consumer auth uses `PROJECT_ID` as username and the project `READ_KEY` as password with SASL/SSL

## Common request/response conventions
- Version discovery is served from the API root and the current documented REST version is `3.0`.
- Most write/update routes on the reviewed page use JSON request bodies.
- Query endpoints commonly accept either:
  - `GET` with query-string parameters, or
  - `POST` with an equivalent JSON body
- Typical query/body fields repeatedly shown across the docs include:
  - `event_collection`
  - `target_property`
  - `timeframe`
  - `filters`
  - `group_by`
  - `order_by`
  - `interval`
  - `timezone`
  - `limit`
  - `include_metadata`
- The reviewed examples show JSON responses, including standard analysis responses with a `result` field and paginated dataset listings with `next_page_url`.

## Manually confirmed route patterns

### 1) List API versions
- Method: `GET`
- Path: `/`
- Full URL pattern: https://api.keen.io/ with `api_key` query authentication or `Authorization` header auth
- Purpose: return available API versions
- Auth notes:
  - the official docs show a `Master Key`
  - `api_key` can be used instead of the header
- Response notes:
  - the reviewed example returns an array of versions such as `3.0`, `2.0`, and `1.0`
  - the docs note that `1.0` and `2.0` are deprecated

### 2) Event collection ingest and maintenance
- Confirmed path pattern: `/3.0/projects/{project_id}/events/{collection}`
- Confirmed methods on the reviewed docs:
  - `POST` - record a single event to a collection
  - `GET` - alternate event-ingest form using query parameters such as `api_key` and `data`
  - `PUT` - update events in a collection using `property_updates`, `timeframe`, and `filters`
  - `DELETE` - delete all events in a collection or delete only events matching supplied `filters` and `timeframe`
- Auth notes:
  - `Write Key` for ingest
  - `Master Key` for destructive maintenance operations
- Confirmed parameters / body fields from the reviewed examples:
  - path: `project_id`, `collection`
  - query/body: `data`, `redirect`, `property_updates`, `filters`, `timeframe`
- Important notes:
  - the GET ingest form is also shown embedded as an image or link URL
  - duplicate prevention and Keen metadata fields are documented on the same API page

### 3) Bulk event ingest
- Method: `POST`
- Path: `/3.0/projects/{project_id}/events`
- Purpose: record multiple events, including multiple collections, in a single request
- Auth notes:
  - official example uses `Write Key`
- Request format:
  - JSON body keyed by collection name, with arrays of event objects

### 4) List event collections
- Method: `GET`
- Path: `/3.0/projects/{project_id}/events`
- Purpose: inspect all event collections for a project
- Auth notes:
  - reviewed example uses a `Read Key`

### 5) Inspect a property on a collection
- Method: `GET`
- Path patterns confirmed on the reviewed page:
  - `/v3/projects/{project_id}/events/{collection}/properties/{property_name}`
  - `/3.0/projects/{project_id}/events/{collection}/properties/{property_name}` also appears in maintenance examples
- Purpose: inspect a single property definition / metadata and target the property for maintenance actions
- Auth notes:
  - `Read Key` for inspection examples
  - `Master Key` for delete-property maintenance examples

### 6) Delete a property from a collection
- Method: `DELETE`
- Path: `/3.0/projects/{project_id}/events/{collection}/properties/{property_name}`
- Purpose: remove a property from a collection
- Auth notes:
  - official example uses `Master Key`

### 7) Query availability
- Method: `GET`
- Path: `/3.0/projects/{project_id}/queries`
- Purpose: retrieve query-availability information for a project
- Auth notes:
  - official example uses `Master Key`

### 8) Count analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/count`
- Purpose: count matching events
- Common parameters shown in the official docs:
  - `event_collection`
  - `timeframe`
  - optional `filters`, `group_by`, `order_by`, `interval`, `timezone`, `include_metadata`

### 9) Count unique analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/count_unique`
- Additional required parameter shown in the examples:
  - `target_property`

### 10) Minimum analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/minimum`
- Common parameters shown:
  - `event_collection`
  - `target_property`
  - `timeframe`

### 11) Maximum analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/maximum`

### 12) Sum analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/sum`

### 13) Average analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/average`

### 14) Median analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/median`

### 15) Percentile analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/percentile`
- Additional parameter shown in the examples:
  - `percentile`

### 16) Select-unique analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/select_unique`

### 17) Standard-deviation analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/standard_deviation`

### 18) Multi-analysis
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/multi_analysis`
- Additional parameter shown in the examples:
  - `analyses` - encoded in the GET form or passed as a JSON object in the POST body

### 19) Funnel analysis
- Method: `POST`
- Path: `/3.0/projects/{project_id}/queries/funnel`
- Additional parameter shown in the example:
  - `steps` - array of funnel-step objects with `event_collection`, `actor_property`, and `timeframe`

### 20) Extraction query
- Methods: `GET`, `POST`
- Path: `/3.0/projects/{project_id}/queries/extraction`
- Purpose: export raw event data
- Confirmed parameters from examples:
  - `event_collection`
  - `timeframe`
  - optional `email` for emailed extraction delivery

### 21) Create or update a saved query definition
- Method: `PUT`
- Path: `/3.0/projects/{project_id}/queries/saved/{query_name}`
- Purpose: create or update a saved query definition
- Confirmed body fields shown in examples:
  - `refresh_rate`
  - `query` object with standard analysis fields such as `analysis_type`, `event_collection`, `target_property`, `filters`, `group_by`, `order_by`, `timeframe`, `limit`

### 22) Get saved-query results
- Method: `GET`
- Path: `/3.0/projects/{project_id}/queries/saved/{query_name}/result`
- Purpose: fetch the computed result for a saved query
- Auth notes:
  - official example uses `Read Key`

### 23) List saved-query definitions
- Method: `GET`
- Path: `/3.0/projects/{project_id}/queries/saved`
- Purpose: list all saved query definitions for a project
- Auth notes:
  - reviewed example uses `Master Key`

### 24) Get a saved-query definition
- Method: `GET`
- Path: `/3.0/projects/{project_id}/queries/saved/{query_name}`
- Auth notes:
  - example uses `Master Key`
  - docs also show an alternate access-key example with `api_key=access_key_with_query_definition_permitted`

### 25) Delete a saved query
- Method: `DELETE`
- Path: `/3.0/projects/{project_id}/queries/saved/{query_name}`

### 26) Create or update a cached dataset definition
- Method: `PUT`
- Path: `/3.0/projects/{project_id}/datasets/{dataset_name}`
- Purpose: define a cached dataset backed by a query
- Confirmed body fields shown in the official example:
  - `display_name`
  - `query`
  - `index_by`

### 27) Get a cached dataset definition
- Method: `GET`
- Path: `/3.0/projects/{project_id}/datasets/{dataset_name}`

### 28) Retrieve cached-dataset results
- Method: `GET`
- Path: `/3.0/projects/{project_id}/datasets/{dataset_name}/results`
- Confirmed query parameters shown in the official example:
  - `index_by`
  - `timeframe`
  - `api_key`

### 29) List cached datasets for a project
- Method: `GET`
- Path: `/3.0/projects/{project_id}/datasets`
- Pagination notes directly confirmed on the reviewed docs:
  - response examples include `next_page_url`
  - examples show `limit` and `after_name`

### 30) Delete a cached dataset
- Method: `DELETE`
- Path: `/3.0/projects/{project_id}/datasets/{dataset_name}`

### 31) Organization/project management and access-key management families
The reviewed Keen docs also explicitly expose these additional path patterns and methods:
- Projects / organizations:
  - `GET /3.0/organizations/{org_id}/projects/{project_id}`
  - `GET /3.0/organizations/{org_id}/projects`
  - `POST /3.0/organizations/{org_id}/projects`
  - `PUT /3.0/organizations/{org_id}/projects/{project_id}`
  - `DELETE /3.0/organizations/{org_id}/projects/{project_id}`
- Project access keys:
  - `POST /3.0/projects/{project_id}/keys`
  - `GET /3.0/projects/{project_id}/keys`
  - `GET /3.0/projects/{project_id}/keys/{key}`
  - `PUT /3.0/projects/{project_id}/keys/{key}`
  - `POST /3.0/projects/{project_id}/keys/{key}/revoke`
  - `POST /3.0/projects/{project_id}/keys/{key}/unrevoke`
  - `DELETE /3.0/projects/{project_id}/keys/{key}`
- Confirmed request details from the reviewed examples:
  - project creation/update bodies include `name`, `users`, and `preferences`
  - access-key creation/update bodies include `name`, `is_active`, `permitted`, and `options`
  - access-key list examples show filtering by `name` and pagination with `page` and `per_page`

## Pagination
The reviewed Keen docs do not describe one universal pagination scheme for every route. The confirmed pagination patterns seen in this pass are:
- access-key listing supports `page` and `per_page`
- cached-dataset listing examples show `limit`, `after_name`, and a `next_page_url` response field
- the core analysis routes are not documented as paginated result streams; they return a single analysis result payload

## Rate limits
From the official Keen API page reviewed in this pass:
- recording events: `No Limit!`
- ad-hoc queries: `200/minute`
- extractions: `200/minute`
- updates: `10/minute`
- deletes: `10/minute`
- delete a collection: `100/minute`
Additional official notes:
- limits are enforced at the project level
- blocked requests return `429`
- cached query and cached dataset lookups do not count toward ad-hoc query rate limiting
- Keen also documents concurrency limiting for queries and says the API may return `429`
- query responses larger than `150 MB` error
- queries that cannot begin execution promptly may fail fast with `503`
- individual events are limited to `900,000` bytes
- bulk event payloads are limited to `10,000,000` bytes
- synchronous extractions are limited to `1,000,000` events scanned and `100,000` events extracted
- asynchronous extractions are limited to `10,000,000` events

## Error handling
The reviewed Keen docs explicitly document:
- `200` event accepted / success
- `201` event created successfully
- `400` bad request; missing or invalid parameters
- `401` unauthorized; API key invalid
- `403` forbidden; API key not allowed to run the request
- `404` requested resource not found
- `429` too many requests
- `500` internal server error
- `503` service unavailable / fast-fail behavior under load
- `504` timeout
The docs repeatedly note that error messages often include additional detail in the response body.

## Response format notes
- The reviewed examples are JSON-first.
- Standard analysis responses are described as small JSON objects containing a `result` key.
- Bulk event-ingest responses may contain per-event statuses, so the docs explicitly tell users to inspect the response body even on accepted requests.
- Dataset-list responses include structured dataset objects and `next_page_url` when more data is available.

## Important usage notes
- The Keen docs explicitly allow equivalent query functionality over both GET query strings and POST JSON bodies for many analysis routes.
- `Write Key`, `Read Key`, `Master Key`, and `Organization Key` are not interchangeable; the docs map them to distinct route families.
- If query volume or response size becomes a production concern, Keen's own docs recommend cached queries/datasets to reduce pressure on ad-hoc query rate limits.
- The reviewed API page also documents Kafka ingress/egress authentication, but the concrete HTTP route surface above is the most directly fireROUTE-relevant portion.

## Verification notes
This file was manually rebuilt from Keen's official homepage and official API reference page. Route patterns, auth modes, limits, and status codes were taken from the live documentation and example requests on those reviewed official pages.