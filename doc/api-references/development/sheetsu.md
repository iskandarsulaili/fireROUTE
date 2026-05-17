# Sheetsu

## Provider metadata
- Category: `Development`
- Provider slug: `sheetsu`
- Docs used manually:
  - `https://sheetsu.com/`
  - `https://sheetdb.io/`
  - `https://docs.sheetdb.io/`
  - `https://docs.sheetdb.io/authentication`
  - `https://docs.sheetdb.io/permissions`
  - `https://docs.sheetdb.io/cors`
  - `https://docs.sheetdb.io/errors`
  - `https://docs.sheetdb.io/maximum-request-body-size`
  - `https://docs.sheetdb.io/limits`
  - `https://docs.sheetdb.io/sheetdb-api/read`
  - `https://docs.sheetdb.io/sheetdb-api/search`
  - `https://docs.sheetdb.io/sheetdb-api/create`
  - `https://docs.sheetdb.io/sheetdb-api/update`
  - `https://docs.sheetdb.io/sheetdb-api/delete`
  - `https://docs.sheetdb.io/sheetdb-api/other`
  - `https://docs.sheetdb.io/global-api/authentication`
  - `https://docs.sheetdb.io/global-api/get-all-apis`
  - `https://docs.sheetdb.io/global-api/create-new-api`
  - `https://docs.sheetdb.io/global-api/delete-api`
- Official site status during review: `https://sheetsu.com/` redirects to SheetDB's current official site and docs.
- Confirmed API base URL family: `https://sheetdb.io/api/v1`
- Primary media type: JSON
- Authentication model surfaced in docs:
  - spreadsheet APIs are open by default unless authentication is enabled in API settings
  - optional per-API auth via an `Authorization` header that carries a bearer access token, or via HTTP Basic credentials
  - global account-level endpoints require `{APP_ID}` and `{API_KEY}` in the path
- Manually confirmed routes in this pass: `21`

## Authentication
From the official docs reviewed in this pass:
- standard spreadsheet endpoints do not require authentication unless the API owner enables it
- each spreadsheet API can optionally use either:
  - an `Authorization` header with a bearer access token
  - HTTP Basic auth with per-API username and password
- the docs recommend Bearer-token auth over Basic auth
- account-level global endpoints use path-based auth in the form `/api/v1/{APP_ID}/{API_KEY}/...`
- the permissions page says unauthorized operations return `403 Forbidden`

## Common request/response conventions
- Base URL family: `https://sheetdb.io/api/v1`
- Spreadsheet-specific routes use `{API_ID}`
- Global account routes use `{APP_ID}` plus `{API_KEY}` in the path
- The service maps spreadsheet column names from the first row and uses them as JSON keys and search/update field names
- Common optional query/body controls surfaced across the reviewed docs:
  - `sheet` - choose the target spreadsheet tab
  - `mode` - value render/input option selector
  - `limit` and `offset` - page through list-style reads
  - `sort_by`, `sort_order`, `sort_method`, `sort_date_format` - control sorting
  - `cast_numbers` - cast named columns to numbers in output
  - `single_object=true` - return a single row object instead of an array
  - `casesensitive=true` - enable case-sensitive search
- Search supports wildcard `*`, negative matching with `!value`, relational operators such as `>`, `<`, `>=`, `<=`, and repeated query keys with `[]`
- POST endpoints return `201 Created` according to the official errors page; GET/PUT/PATCH/DELETE success is `200 OK`
- Maximum request body size is `8 MB`
- One request can target only one sheet/tab at a time, and the docs say a sheet can have at most `2048` columns

## Manually confirmed endpoint set

### 1) Read all rows
- Method: `GET`
- Path: `/api/v1/{API_ID}`
- Purpose: return all rows from the spreadsheet as an array
- Optional parameters confirmed in docs:
  - `sheet`
  - `limit`
  - `offset`
  - `sort_by`
  - `sort_order` (`asc`, `desc`, `random`)
  - `sort_method`
  - `sort_date_format`
  - `cast_numbers`
  - `single_object`
  - `mode`
- Response notes:
  - returns an array of row objects keyed by spreadsheet column names

### 2) Read column keys
- Method: `GET`
- Path: `/api/v1/{API_ID}/keys`
- Purpose: return all column names from the first row
- Response notes:
  - returns a JSON array of strings

### 3) Get document name
- Method: `GET`
- Path: `/api/v1/{API_ID}/name`
- Purpose: return the spreadsheet document name
- Response notes:
  - docs show `{ "name": "..." }`

### 4) Count rows
- Method: `GET`
- Path: `/api/v1/{API_ID}/count`
- Purpose: return the number of rows excluding the header row
- Response notes:
  - docs show `{ "rows": <number> }`

### 5) Search rows with AND matching
- Method: `GET`
- Path: `/api/v1/{API_ID}/search`
- Purpose: return rows where all supplied conditions match
- Query behavior confirmed in docs:
  - column names become query keys
  - spaces should be encoded as `%20`
  - `&` should be encoded as `%26`
  - wildcard `*` is supported when both read and search permissions are enabled
  - negative search uses `!value`
  - relational operators are supported for numeric comparisons
  - multiple comparisons for one column use array notation such as `id[]=>1&id[]=<3`
- Optional parameters:
  - all optional attributes from the read endpoint
  - `casesensitive`

### 6) Search rows with OR matching
- Method: `GET`
- Path: `/api/v1/{API_ID}/search_or`
- Purpose: return rows where any supplied condition matches
- Query behavior confirmed in docs:
  - same column-query conventions as `/search`

### 7) Create rows
- Method: `POST`
- Path: `/api/v1/{API_ID}`
- Purpose: append one or more rows to the end of the sheet
- Required request field:
  - `data` - array of row objects
- Optional fields:
  - `sheet`
  - `return_values`
  - `mode`
- Important usage notes:
  - if `data` is omitted, the docs say SheetDB will try to map the entire request body to spreadsheet columns
  - special values supported in create requests:
    - `INCREMENT`
    - `TIMESTAMP`
    - `DATETIME`
- Response notes:
  - returns count of created rows with `201 Created`

### 8) Update rows with a single query
- Method: `PATCH`
- Path: `/api/v1/{API_ID}/{COLUMN_NAME}/{VALUE}`
- Purpose: update all rows where one column matches the specified value
- Required request field:
  - `data` - object containing the columns to modify
- Optional fields:
  - `sheet`
  - `mode`
- Response notes:
  - docs show `{ "updated": <number> }`

### 9) Batch update rows
- Method: `PATCH`
- Path: `/api/v1/{API_ID}/batch_update`
- Purpose: update multiple row groups in one request
- Availability note:
  - official docs say this works only on paid accounts
- Required request field:
  - `data` - array of objects, each containing a `query` plus updated column values
- Optional fields:
  - `sheet`
  - `mode`
- Response notes:
  - docs show `{ "updated": <number> }`

### 10) Delete rows with a single query
- Method: `DELETE`
- Path: `/api/v1/{API_ID}/{COLUMN_NAME}/{VALUE}`
- Purpose: delete all rows where one column matches the specified value
- Optional parameters:
  - `sheet`
- Response notes:
  - docs show `{ "deleted": <number> }`

### 11) Delete duplicate rows
- Method: `DELETE`
- Path: `/api/v1/{API_ID}/duplicates`
- Purpose: remove identical duplicate rows
- Optional parameters:
  - `sheet`
- Response notes:
  - docs show `{ "duplicates": <number> }`

### 12) Delete all sheet content
- Method: `DELETE`
- Path: `/api/v1/{API_ID}/all`
- Purpose: delete all spreadsheet rows except the header by default
- Optional parameters:
  - `with_first_row=true` to also delete the header row
  - `sheet`
- Response notes:
  - docs show `{ "deleted": <number> }`

### 13) Read one or more cells by coordinate
- Method: `GET`
- Path: `/api/v1/{API_ID}/cells/{CELL}`
- Purpose: return single-cell or multi-cell values by coordinates like `A1` or `B10`
- Path behavior confirmed in docs:
  - multiple cells can be requested by comma-separating coordinates
- Optional parameters:
  - `sheet`
- Response notes:
  - returns an object whose keys are the requested coordinates

### 14) Import JSON into a sheet
- Method: `POST`
- Path: `/api/v1/{API_ID}/import/json`
- Purpose: import an entire JSON array into a spreadsheet
- Required request field:
  - `json` - array of objects to import
- Optional parameters:
  - `sheet`
- Important usage notes:
  - the docs say an empty spreadsheet with an unfilled first row is the intended case
  - if the sheet is not empty, content is appended below existing content
- Response notes:
  - docs show `{ "created": 1 }`

### 15) List available sheets
- Method: `GET`
- Path: `/api/v1/{API_ID}/sheets`
- Purpose: list all sheet/tab names in the spreadsheet
- Response notes:
  - docs show `{ "sheets": [ ... ] }`

### 16) Create a new sheet/tab
- Method: `POST`
- Path: `/api/v1/{API_ID}/sheet`
- Purpose: create a new sheet/tab
- Availability note:
  - official docs say this works only on some plans
- Required request fields:
  - `name`
  - `first_row` - array of column names
- Response notes:
  - docs show `{ "created": 1 }`

### 17) Delete a sheet/tab
- Method: `DELETE`
- Path: `/api/v1/{API_ID}/sheet`
- Purpose: delete a sheet/tab and its content
- Availability note:
  - official docs say this works only on some plans
- Required request field:
  - `name`
- Response notes:
  - the reviewed docs example also shows `{ "created": 1 }`, which appears to be the provider's published example even though the operation is deletion

### 18) List all APIs in an account
- Method: `GET`
- Path: `/api/v1/{APP_ID}/{API_KEY}/list`
- Purpose: return all APIs associated with the authenticated account
- Availability note:
  - official docs say global endpoints work only on some plans
- Response notes:
  - returns an array of API objects with `id`, `url`, `spreadsheet_id`, `spreadsheet_url`, and `created_at`

### 19) Create a new API from an existing spreadsheet
- Method: `POST`
- Path: `/api/v1/{APP_ID}/{API_KEY}/create`
- Purpose: create a SheetDB API for an existing Google Spreadsheet
- Availability note:
  - official docs say global endpoints work only on some plans
- Required request field:
  - `url` - Google Spreadsheet URL
- Optional fields:
  - `permissions` - comma-separated list from `create`, `read`, `update`, `delete`, `search`, `tabs_create`, `tabs_delete`
- Response notes:
  - docs show `success`, `name`, `id`, and `url`

### 20) Create a new API from JSON data
- Method: `POST`
- Path: `/api/v1/{APP_ID}/{API_KEY}/create/json`
- Purpose: create a new Google Spreadsheet from JSON data, then generate a SheetDB API for it
- Availability note:
  - official docs say global endpoints work only on some plans
- Required request field:
  - `url` - URL of the JSON source data
- Optional fields:
  - `title`
  - `permissions`
- Important usage notes:
  - the docs say the service creates the spreadsheet first, then creates the API on top of it

### 21) Delete an API from an account
- Method: `DELETE`
- Path: `/api/v1/{APP_ID}/{API_KEY}/delete/{API_ID}`
- Purpose: delete a SheetDB API without deleting the underlying Google Spreadsheet
- Availability note:
  - official docs say global endpoints work only on some plans
- Response notes:
  - docs show `{ "deleted": 1 }`

## Pagination
- The provider does not use cursor-style pagination in the reviewed spreadsheet endpoints.
- List-style spreadsheet reads support offset pagination with:
  - `limit`
  - `offset`
- The global docs page does not publish cursor tokens or next-page URLs for the account endpoints reviewed here.

## Rate limits and quotas
- The limits page says plan exhaustion returns `429` responses.
- The documented per-IP rate limit is `15 requests per 10 seconds`.
- The docs say Enterprise subscriptions can bypass that per-IP rate limit.
- The docs additionally cite Google spreadsheet API limits:
  - `100 requests per 100 seconds per user`
  - a variable per-spreadsheet request limit over `100` seconds
- The docs recommend enabling cache when working at higher request volumes.

## Error handling
The official errors page reviewed in this pass documents:
- `200 OK` for successful `GET`, `PUT`, `PATCH`, and `DELETE`
- `201 Created` for successful `POST`
- `400 Bad Request` for malformed requests or wrong data formats
- `401 Unauthorized` for Google-account auth problems or wrong Bearer/Basic credentials
- `402 Payment Required` when the request requires a higher plan
- `403 Forbidden` for forbidden actions or disabled permissions
- `404 Not Found`
- `405 Method Not Allowed`
- `429 Too Many Requests`
- `500 Internal Server Error`
- `1015 Rate limit` with the explicit note that the limit is `15 requests per 10 seconds`

## Response format notes
- Spreadsheet rows are returned as JSON objects keyed by column names from the first row.
- Read/search endpoints normally return arrays unless `single_object=true` is used.
- Metadata-style endpoints return compact objects such as `{ "name": ... }`, `{ "rows": ... }`, or `{ "sheets": [...] }`.
- Mutation endpoints return compact counters such as `created`, `updated`, `deleted`, or `duplicates`.

## Important usage notes
- Sheetsu's official domain now redirects to SheetDB, so the current official API surface is documented under the SheetDB branding.
- Spreadsheet APIs are public by default; authentication, CORS restriction, and IP whitelisting are optional controls configured per API.
- If CORS restrictions are not configured, the docs say the API responds with `Access-Control-Allow-Origin: *`.
- Permissions should be minimized; disabling an operation causes `403 Forbidden` on that route family.
- The maximum request body size is `8 MB`.
- Only one sheet/tab can be targeted per request.
- The reviewed docs say a sheet can have at most `2048` columns.
- Batch update and some tab-management/global routes are plan-gated.

## Verification notes
This file was manually rebuilt from the official Sheetsu redirect target (SheetDB) homepage and official SheetDB documentation pages using browser inspection during this pass.
