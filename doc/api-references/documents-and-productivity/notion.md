# Notion

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `notion`
- Docs used manually:
  - `https://developers.notion.com/reference/intro`
  - `https://developers.notion.com/reference/request-limits`
  - `https://developers.notion.com/reference/status-codes`
  - `https://developers.notion.com/reference/versioning`
  - `https://developers.notion.com/reference/post-page`
  - `https://developers.notion.com/reference/retrieve-a-page`
  - `https://developers.notion.com/reference/patch-page`
  - `https://developers.notion.com/reference/get-block-children`
  - `https://developers.notion.com/reference/post-search`
- Confirmed REST API base URL: `https://api.notion.com`
- Primary media type: JSON
- Required version header confirmed by the official versioning page: `Notion-Version`
- Manually confirmed routes in this pass: `5`

## Authentication
From the official intro and route pages:
- send `Authorization: Bearer <token>`
- accepted token types called out by the docs:
  - installation access token from an internal connection
  - OAuth access token from a public connection
  - personal access token (PAT)
- the API also requires `Notion-Version: YYYY-MM-DD`
- the reviewed versioning page states the latest version at inspection time is `2026-03-11`

## Common request/response conventions
- Base URL: `https://api.notion.com`
- HTTPS is required
- most operations use standard REST verbs: `GET`, `POST`, `PATCH`, `DELETE`
- request and response bodies are JSON
- top-level resources include an `object` property
- paginated list/search responses use `results`, `has_more`, and `next_cursor`

## Manually confirmed endpoint set

### 1) Create a page
- Method: `POST`
- Path: `/v1/pages`
- Full URL: `https://api.notion.com/v1/pages`
- Purpose: create a page under a page, data source, or in some cases at workspace level
- Required headers confirmed across the docs:
  - `Authorization: Bearer <token>`
  - `Notion-Version: YYYY-MM-DD`
- Important request/body details confirmed on the route page:
  - `parent` usually contains `page_id` or `data_source_id`
  - for public connections and PATs, workspace-level private page creation is allowed by omitting `parent` or using `parent[workspace]=true`
  - when the parent is a page, `title` is the only valid property in `properties`
  - when the parent is a data source, `properties` keys must match the parent data source schema
  - `children` can be used to create initial page content
  - `template` can be used instead of manually constructing content
- Response body: `Page`
- Route page shows these possible statuses: `200`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `503`, `504`

### 2) Retrieve a page
- Method: `GET`
- Path: `/v1/pages/{page_id}`
- Full URL: `https://api.notion.com/v1/pages/{page_id}`
- Purpose: fetch a page object and its properties
- Path parameters:
  - `page_id` - required Notion page ID
- Important usage notes from the route page:
  - this endpoint returns page properties, not page content
  - to fetch page content, use Retrieve block children
  - page properties that include references are capped at `25` references in this response
  - if a property exceeds that limit, use the page-property endpoint for the specific property
  - relation properties expose `has_more=true` when more than `25` related pages exist
- Connection capability note from the route page:
  - requires read content capability
- Route page shows these possible statuses: `200`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `503`, `504`

### 3) Update a page
- Method: `PATCH`
- Path: `/v1/pages/{page_id}`
- Full URL: `https://api.notion.com/v1/pages/{page_id}`
- Purpose: update page properties and page-level attributes
- Path parameters:
  - `page_id` - required
- Confirmed capabilities from the route page:
  - update `properties` for pages in a data source, or title for standalone pages
  - update `icon`
  - update `cover`
  - trash or restore a page
  - lock/unlock the page with `is_locked`
  - apply a page template with `template`
- Important usage notes from the route page:
  - `is_locked` affects editing in the Notion UI, not API write ability
  - property schema must match the parent data source when updating a data-source-backed page
- Route page shows these possible statuses: `200`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `503`, `504`

### 4) Retrieve block children
- Method: `GET`
- Path: `/v1/blocks/{block_id}/children`
- Full URL: `https://api.notion.com/v1/blocks/{block_id}/children`
- Purpose: retrieve first-level child blocks for a page/block subtree
- Path parameters:
  - `block_id` - required block ID
- Query parameters confirmed by the route page and example:
  - `start_cursor`
  - `page_size`
- Response body fields confirmed on the route page:
  - `results[]`
  - `next_cursor`
  - `has_more`
- Important usage notes from the route page:
  - only first-level children are returned
  - clients may need recursive retrieval for nested content
  - the response may contain fewer than `page_size` results
  - requires read content capability
- Error notes explicitly called out on the route page:
  - `404` if the block does not exist or is not shared with the connection
  - `400` or `429` if request limits are exceeded

### 5) Search by title
- Method: `POST`
- Path: `/v1/search`
- Full URL: `https://api.notion.com/v1/search`
- Purpose: search shared pages and data sources by title
- Confirmed request body fields from the route page example:
  - `query`
  - `filter.property`
  - `filter.value`
  - `sort.direction`
  - `sort.timestamp`
- Response body fields confirmed on the route page:
  - `object`
  - `results[]`
  - `next_cursor`
  - `has_more`
  - `request_status.type`
  - `request_status.incomplete_reason`
- Important usage note from the route page:
  - searches parent or child pages and data sources that have been shared with the connection
- Route page shows these possible statuses: `200`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `503`, `504`

## Pagination
From the official intro page and reviewed routes:
- paginated responses use `results`, `has_more`, and `next_cursor`
- paginated requests use `start_cursor`
- `GET /v1/blocks/{block_id}/children` is explicitly paginated
- `POST /v1/search` also returns `next_cursor` / `has_more`

## Rate limits
From the official request-limits page:
- average limit: `3 requests/second` per connection
- some bursts above the average are allowed
- rate-limited requests return HTTP `429` with code `rate_limited`
- clients should honor `Retry-After` in whole seconds
- the docs recommend backing off or queueing requests when throttled

## Error and response notes
From the official status-codes page:
- error bodies include at least `code` and `message`
- some errors can also include `additional_data`
- confirmed documented error codes include:
  - `invalid_json`
  - `invalid_request_url`
  - `invalid_request`
  - `invalid_grant`
  - `validation_error`
  - `missing_version`
  - `unauthorized`
  - `restricted_resource`
  - `object_not_found`
  - `conflict_error`
  - `rate_limited`
- success status table explicitly lists `200`

## Important usage notes
- every request must include `Notion-Version`; omission is a documented `missing_version` error
- retrieve-page responses are not sufficient for properties with more than `25` references
- page content lives in block children, not in the page retrieval response body
- connection capabilities matter; read/write failures can be capability-related rather than purely token-related
- Notion notes that rate limits may change over time or vary by workspace/pricing in the future

## Verification notes
This file was manually rebuilt from the official Notion API intro, versioning, limits, status-code, and route reference pages with browser inspection.