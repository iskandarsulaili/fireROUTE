# Mockaroo

## Provider metadata
- Category: `Test Data`
- Provider slug: `mockaroo`
- Docs used manually:
  - `https://www.mockaroo.com/docs`
- Confirmed REST API base URL: `https://api.mockaroo.com`
- Primary media types: JSON plus format-dependent file outputs such as CSV, TXT, SQL, XML, and custom-delimited text
- Authentication model: API key via query parameter `key` or request header `X-API-Key`
- Manually confirmed routes in this pass: `6`

## Authentication
From the official Mockaroo docs:
- all reviewed API endpoints require an API key
- the API key can be sent either:
  - as query parameter `key`
  - as request header `X-API-Key`

## Usage limits
From the official `Usage Limits` section:
- Free plan: `200 requests/day`
- Silver plan: `1,000,000 records/day`
- Gold plan: `10,000,000 records/day`
- the docs explicitly note that paid plans are record-limited rather than request-limited, allowing many small requests

## Common request/response conventions
- Base URL: `https://api.mockaroo.com`
- reviewed endpoints use a mix of `GET`, `POST`, and `DELETE`
- format is often encoded in the URL suffix, especially on the generate endpoint (`.json`, `.csv`, `.txt`, `.custom`, `.sql`, `.xml`)
- some endpoints return direct generated data, while asynchronous/background generation returns a `downloadId` for polling
- the docs do not publish one global structured HTTP error table for every route; some route pages provide route-specific error shapes instead

## Manually confirmed endpoint set

### 1) List available Mockaroo field types
- Method: `GET`
- Path: `/api/types`
- Full URL: `https://api.mockaroo.com/api/types`
- Purpose: return the list of available built-in data types and their configurable parameters
- Query parameters confirmed on the official page:
  - `key` - required API key when using query auth
- Response structure explicitly documented:
  - array of type objects
  - each type object includes:
    - `name`
    - `parameters[]`
  - each parameter object includes:
    - `name`
    - `type`
    - `description`
    - `default`

### 2) Upload or replace a dataset
- Method: `POST`
- Path: `/api/datasets/{name}`
- Full URL pattern: `https://api.mockaroo.com/api/datasets/{name}`
- Purpose: upload a reusable dataset for later generation logic
- Path parameters:
  - `name` - required dataset name to create or update
- Query parameters confirmed on the official page:
  - `key` - required API key when using query auth
  - `filename` - optional original file name; must end in `.csv` or `.txt`
  - `project` - optional existing project name to add the dataset to
- Request-body / transport details explicitly documented:
  - dataset contents are sent in the request body
  - `Content-Type` must be `text/csv` or `text/plain`
- Response notes:
  - the reviewed page demonstrates JSON handling in example client code, but does not publish a dedicated response-schema table for this route

### 3) Delete a dataset by name
- Method: `DELETE`
- Path: `/api/datasets/{name}`
- Full URL pattern: `https://api.mockaroo.com/api/datasets/{name}`
- Purpose: remove a saved dataset
- Path parameters:
  - `name` - required dataset name to delete
- Query parameters confirmed on the official page:
  - `key` - required API key when using query auth
- Important doc quirk to preserve:
  - the prose heading is `DELETE /api/datasets/:name`, but the inline example line on the page still shows a `POST https://api.mockaroo.com/api/datasets?...` string before the JavaScript delete example; the delete example code itself clearly uses HTTP `DELETE`

### 4) Generate data
- Method: `POST`
- Path: `/api/generate(.format)`
- Full URL pattern: `https://api.mockaroo.com/api/generate(.format)`
- Purpose: generate fake data either from a saved schema or from field definitions supplied in the request
- Supported output formats explicitly documented on the official page:
  - `json`
  - `csv`
  - `txt`
  - `custom`
  - `sql`
  - `xml`
- Query parameters confirmed on the official page:
  - `key` - required API key
  - `array` - JSON responses always become arrays when `true`
  - `bom` - include byte-order mark for `csv`, `txt`, or `custom`
  - `background` - generate asynchronously; paid plan required; direct-response mode is capped at `5000` records regardless of plan
  - `callback` - JSONP callback function name
  - `count` - number of rows to generate
  - `delimiter` - delimiter for `custom` format
  - `fields` - JSON array of field specifications, especially for JSONP use cases
  - `include_nulls` - include null-valued keys in JSON output
  - `include_header` - whether CSV includes a header row
  - `line_ending` - `unix` or `windows` for `custom`
  - `quote_char` - quote character for `custom`
  - `record_element` - XML record element name
  - `root_element` - XML root element name
  - `schema` - name of a saved schema
- Request body behavior explicitly documented:
  - if `schema` is not provided, the request body must be a JSON array of field specifications
  - each field specification includes:
    - `name`
    - `percentBlank`
    - `formula`
    - `type`
- Response behavior explicitly documented:
  - when `background=true`, the response is JSON of the form `{ "downloadId": number }`
  - otherwise the response body contains generated data in the requested output format
- Important usage notes from the official page:
  - free accounts are limited to `5000` records per download
  - batch/background generation requires a paid plan
  - JSON output is an object when size/count is `1` unless `array=true`

### 5) Poll a background download
- Method: `GET`
- Path: `/api/downloads/{id}`
- Full URL pattern: `https://api.mockaroo.com/api/downloads/{id}`
- Purpose: check the status of a background generation job created by `/api/generate(.format)`
- Path parameters:
  - `id` - the `downloadId` returned by background generation
- Response fields explicitly documented on the official page:
  - `status` - one of `success`, `failed`, `queued`, or `in_progress`
  - `error` - error message when status is `failed`
  - `recordsGenerated`
  - `percentComplete`
  - `url` - where the generated data can be downloaded once ready

### 6) Delete or cancel a background download
- Method: `DELETE`
- Path: `/api/downloads/{id}`
- Full URL pattern: `https://api.mockaroo.com/api/downloads/{id}`
- Purpose: delete a background download, canceling it if it is still in progress
- Path parameters:
  - `id` - background download/job identifier
- Response behavior explicitly documented:
  - successful deletion returns an empty HTTP `200 OK` response
  - failures return JSON shaped like:
    - `error` - error message string

## Pagination
- none documented for the reviewed endpoints
- generation size is controlled by `count`, not by page or cursor parameters
- background-job polling is per-download-id rather than paginated

## Error and response notes
- the docs do not expose one central status-code matrix for all reviewed endpoints
- `/api/downloads/{id}` deletion explicitly documents a JSON error body containing `error`
- `background=true` on the generate route changes the response from generated file/data bytes into a small JSON job-tracking response with `downloadId`
- output format and response media type vary by the `.format` suffix on `/api/generate(.format)`

## Important usage notes
- Mockaroo distinguishes between the Generate API and separate Mock APIs; the reviewed docs page here documents the Generate API routes listed above
- any generation behavior achievable in the Mockaroo UI is presented as available through the Generate API
- JSONP callers cannot send a request body, so the docs require the `fields` URL parameter for that use case
- asynchronous generation is the route to large downloads; direct synchronous responses remain capped at `5000` records

## Verification notes
This file was manually rebuilt from the official Mockaroo API documentation page using browser inspection.