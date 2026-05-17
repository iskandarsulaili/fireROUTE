# import.io

## Provider metadata
- Category: `Development`
- Provider slug: `import-io`
- Docs used manually:
  - `https://docs.import.io/spec/saas/import-io-api-documentation`
  - `https://docs.import.io/category/spec/saas/user`
  - `https://docs.import.io/category/spec/saas/extractor`
  - `https://docs.import.io/category/spec/saas/crawlrun`
  - `https://docs.import.io/category/spec/saas/report`
  - `https://docs.import.io/category/spec/saas/report-run`
  - `https://docs.import.io/api/ndjson`
  - `https://docs.import.io/api/endpoints`
  - route pages under the same official docs tree for each confirmed operation listed below
- Confirmed REST API base URL: no single absolute base URL was published on the reviewed first-party pages; the current docs expose a relative path inventory under the Import.io API v2.0 reference
- Primary media types: JSON for object/list operations, downloadable file responses for result-file routes, and `application/x-ndjson` for JSON crawlrun result files per the official NDJSON page
- Authentication model surfaced in docs: query parameter `_apikey` on every confirmed route
- Manually confirmed routes in this pass: `23`

## Authentication
From the official docs reviewed here:
- Import.io API version `2.0` was first introduced in February `2024`
- every confirmed route requires query parameter `_apikey`
- the docs direct users to copy the API key from `https://app.import.io/dash/account/settings`
- the reviewed pages did not document an alternative Bearer-token or Basic-auth flow for this API surface

## Common request/response conventions
- The current first-party docs publish path-level operations such as `/users/current`, `/extractors/:extractorId`, `/crawlruns/:crawlrunId/:fileType`, and `/reports/:reportId/start`, but they do not publish one global absolute server URL on the reviewed pages
- Shared authentication parameter: `_apikey`
- Shared list/pagination parameters on collection endpoints:
  - `_perpage` - number of items to return per page
  - `_page` - page number to return; docs say the default is `1`
  - `_sort` - field name to sort by
  - `_sortDirection` - `ASC` or `DESC`; docs say default is `DESC`
- Common response behavior confirmed in the reviewed route pages:
  - object/list operations return JSON
  - result-file routes return downloadable files rather than normal JSON resource objects
  - crawlrun JSON results use NDJSON rather than one big JSON array file
- The custom-endpoints page also documents extractor-specific direct links for live query, latest-run CSV/JSON, Google Sheets, and crawlrun-history RSS access, but it does not expose stable public path templates for those links, so they are not counted as globally confirmed routes here

## Manually confirmed endpoint set

### User routes

#### 1) Get information on the current user
- Method: `GET`
- Path: `/users/current`
- Purpose: retrieve the current authenticated user object
- Required query parameters:
  - `_apikey`

#### 2) Get subscription information for the current user
- Method: `GET`
- Path: `/users/current/subscription`
- Purpose: retrieve the current user's subscription details
- Required query parameters:
  - `_apikey`

### Extractor routes

#### 3) List extractors
- Method: `GET`
- Path: `/extractors/`
- Purpose: list extractors available to the authenticated account
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

#### 4) Get extractor information
- Method: `GET`
- Path: `/extractors/:extractorId`
- Purpose: fetch one extractor by ID
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`

#### 5) Delete extractor
- Method: `DELETE`
- Path: `/extractors/:extractorId`
- Purpose: archive an extractor
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`
- Notes:
  - the docs say extractor data is still kept in the database after deletion/archive, but the extractor is no longer visible in the UI and cannot run

#### 6) List crawlruns for an extractor
- Method: `GET`
- Path: `/extractors/:extractorId/crawlruns`
- Purpose: list runs associated with one extractor
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

#### 7) Get current inputs for an extractor
- Method: `GET`
- Path: `/extractors/:extractorId/inputs`
- Purpose: retrieve the current input payload for an extractor
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`

#### 8) Update inputs for an extractor
- Method: `PUT`
- Path: `/extractors/:extractorId/inputs`
- Purpose: replace the current extractor input set
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`
- Documented request body fields:
  - `url` - string

#### 9) Start an extractor
- Method: `POST`
- Path: `/extractors/:extractorId/start`
- Purpose: start a crawlrun for one extractor
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`

#### 10) Stop an extractor
- Method: `POST`
- Path: `/extractors/:extractorId/stop`
- Purpose: stop an active extractor run
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`

#### 11) Duplicate an extractor
- Method: `POST`
- Path: `/extractors/:extractorId/duplicate`
- Purpose: create a duplicate of an existing extractor
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`

#### 12) Update extractor credentials
- Method: `POST`
- Path: `/extractors/:extractorId/credentials`
- Purpose: update credentials used by an extractor for authenticated targets
- Required path parameters:
  - `extractorId`
- Required query parameters:
  - `_apikey`
- Documented request body fields:
  - `username` - string
  - `password` - string

### Crawlrun routes

#### 13) List recent crawlruns or with filters
- Method: `GET`
- Path: `/crawlruns/`
- Purpose: list recent crawlruns across the account
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

#### 14) Get crawlrun information
- Method: `GET`
- Path: `/crawlruns/:crawlrunId`
- Purpose: fetch one crawlrun by ID
- Required path parameters:
  - `crawlrunId`
- Required query parameters:
  - `_apikey`

#### 15) Download crawlrun results file
- Method: `GET`
- Path: `/crawlruns/:crawlrunId/:fileType`
- Purpose: download one crawlrun output artifact
- Required path parameters:
  - `crawlrunId`
  - `fileType`
- Confirmed `fileType` values from the docs:
  - `csv`
  - `xlsx`
  - `log`
  - `sample`
  - `json`
  - `files`
- Required query parameters:
  - `_apikey`
- Notes:
  - the official NDJSON page says JSON crawlrun results are returned as newline-delimited JSON rather than one valid JSON array document

### Report routes

#### 16) List reports
- Method: `GET`
- Path: `/reports/`
- Purpose: list reports
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

#### 17) Get report information
- Method: `GET`
- Path: `/reports/:reportId`
- Purpose: fetch one report by ID
- Required path parameters:
  - `reportId`
- Required query parameters:
  - `_apikey`

#### 18) Delete a report
- Method: `DELETE`
- Path: `/reports/:reportId`
- Purpose: delete a report
- Required path parameters:
  - `reportId`
- Required query parameters:
  - `_apikey`

#### 19) Start a report
- Method: `POST`
- Path: `/reports/:reportId/start`
- Purpose: start a report run
- Required path parameters:
  - `reportId`
- Required query parameters:
  - `_apikey`

#### 20) List report runs for a report
- Method: `GET`
- Path: `/reports/:reportId/reportruns`
- Purpose: list runs for one report
- Required path parameters:
  - `reportId`
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

### Report-run routes

#### 21) List all report runs or with filters
- Method: `GET`
- Path: `/reportruns/`
- Purpose: list report runs across the account
- Required query parameters:
  - `_apikey`
- Important optional query parameters:
  - `_perpage`
  - `_page`
  - `_sort`
  - `_sortDirection`

#### 22) Get report run information
- Method: `GET`
- Path: `/reportruns/:reportRunId`
- Purpose: fetch one report run by ID
- Required path parameters:
  - `reportRunId`
- Required query parameters:
  - `_apikey`

#### 23) Download report run results file
- Method: `GET`
- Path: `/reportruns/:reportRunId/:fileType`
- Purpose: download one report-run output artifact
- Required path parameters:
  - `reportRunId`
  - `fileType`
- Confirmed `fileType` values from the docs:
  - `csv`
  - `xlsx`
  - `json`
- Required query parameters:
  - `_apikey`

## Pagination
- collection endpoints use page-number pagination rather than cursor pagination
- the reviewed docs consistently expose:
  - `_page` - default `1`
  - `_perpage` - page size
- pagination was directly confirmed on:
  - `/extractors/`
  - `/extractors/:extractorId/crawlruns`
  - `/crawlruns/`
  - `/reports/`
  - `/reports/:reportId/reportruns`
  - `/reportruns/`

## Rate limits and quotas
- the reviewed official API-reference pages do not publish a numeric global rate limit, requests-per-minute ceiling, or concurrency ceiling for the v2.0 API surface
- the custom-endpoints page does publish usage-accounting notes:
  - Live Query API requests count as one query toward the plan total
  - latest-successful-run CSV/JSON endpoints do not count as queries toward the plan total because they return already collected data
  - the Google Sheets endpoint also does not count as a query toward the plan total because it reads latest-run data
  - the crawlrun-history RSS endpoint also does not count as a query toward the plan total

## Error and response notes
Common response codes visible across the reviewed route pages:
- `200` - success
- `401` - unauthorized
- `403` - forbidden on some credential-sensitive routes such as extractor duplication and credential update
- `404` - not found on resource-specific routes
- `500` - generic error on several mutation and resource routes

Additional response-format notes:
- standard object/list routes return JSON
- crawlrun result downloads can return `csv`, `xlsx`, `log`, `sample`, `json`, or `files`
- report-run result downloads can return `csv`, `xlsx`, or `json`
- JSON crawlrun result downloads are NDJSON with content type `application/x-ndjson`

## Important usage notes
- The old indexed docs hostname `http://api.docs.import.io/` is no longer the right destination by itself; the live first-party docs now sit under `https://docs.import.io/`
- Import.io's current public docs now expose a real route inventory again, but they do so as relative paths rather than a clearly stated absolute API host
- The API surface centers on five resource groups: users, extractors, crawlruns, reports, and report runs
- The official custom-endpoints page is useful for extractor-specific integrations, but those links are generated per extractor inside the app and are not documented as one shared global REST path catalog
- For crawlrun JSON outputs, consumers must parse line-by-line NDJSON rather than treating the whole file as one JSON array

## Verification notes
This file was manually rebuilt from the current official Import.io docs using browser inspection of the v2.0 API reference, category pages, NDJSON page, custom-endpoints page, and each route page listed above.
