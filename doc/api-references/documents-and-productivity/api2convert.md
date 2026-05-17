# Api2Convert

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `api2convert`
- Docs used manually:
  - `https://www.api2convert.com/`
  - `https://www.api2convert.com/documentation`
  - `https://api.api2convert.com/v2/schema`
- Confirmed API base URL: `https://api.api2convert.com`
- Primary media type: `application/json`
- Authentication model surfaced in docs: header-based API key with optional job token
- Manually confirmed routes in this pass: `34`

## Authentication
From the official documentation page, quickstart example, and official Swagger schema:
- the main API key header is `X-Oc-Api-Key`
- job-scoped requests can also use `X-Oc-Token`
- the quickstart example shows JSON requests with `Content-Type: application/json`
- the docs say a personal API key is required for both free and paid usage tiers

## Common request/response conventions
- Base URL: `https://api.api2convert.com`
- Schema URL: `https://api.api2convert.com/v2/schema`
- Confirmed versioned path family: `/v2/...`
- Confirmed HTTP methods in the official docs:
  - `GET`
  - `POST`
  - `PATCH`
  - `DELETE`
- The official docs describe the API as REST-based and the schema publishes JSON request/response formats.
- The quickstart example creates jobs by sending `input` and `conversion` arrays to `POST /v2/jobs`.
- The reviewed schema publishes an `Error` definition and route-level `401`, `404`, and `422` style responses on multiple operations.
- The `/jobs` list route is explicitly documented as paginated with `50` elements per page and a `page` query parameter.
- No global numeric rate-limit ceiling was published on the reviewed landing page, documentation page, or official schema.

## Manually confirmed endpoint set

### Jobs
1) List jobs
- Method: `GET`
- Path: `/v2/jobs`
- Purpose: list jobs for the current API key or token
- Confirmed parameters from the schema:
  - query: `status`, `page`
  - headers: `X-Oc-Token`, `X-Oc-Api-Key`
- Pagination note: the docs explicitly say this list is paginated at `50` elements per page

2) Create job
- Method: `POST`
- Path: `/v2/jobs`
- Purpose: create a conversion job
- Confirmed request-shape note from the quickstart example:
  - request body contains `input` and `conversion` arrays

3) Get job
- Method: `GET`
- Path: `/v2/jobs/{job_id}`
- Path parameters:
  - `{job_id}`

4) Update job
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}`
- Path parameters:
  - `{job_id}`

5) Delete job
- Method: `DELETE`
- Path: `/v2/jobs/{job_id}`
- Path parameters:
  - `{job_id}`

### Conversions under a job
6) List conversions for a job
- Method: `GET`
- Path: `/v2/jobs/{job_id}/conversions`

7) Create conversion for a job
- Method: `POST`
- Path: `/v2/jobs/{job_id}/conversions`

8) Get conversion
- Method: `GET`
- Path: `/v2/jobs/{job_id}/conversions/{conversion_id}`

9) Delete conversion
- Method: `DELETE`
- Path: `/v2/jobs/{job_id}/conversions/{conversion_id}`

10) Update conversion
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}/conversions/{conversion_id}`

### Input files under a job
11) List job input files
- Method: `GET`
- Path: `/v2/jobs/{job_id}/input`

12) Create job input file entry
- Method: `POST`
- Path: `/v2/jobs/{job_id}/input`

13) Update job input collection
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}/input`

14) Get input file
- Method: `GET`
- Path: `/v2/jobs/{job_id}/input/{file_id}`

15) Delete input file
- Method: `DELETE`
- Path: `/v2/jobs/{job_id}/input/{file_id}`

16) Update input file
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}/input/{file_id}`

### Output files under a job
17) List job output files
- Method: `GET`
- Path: `/v2/jobs/{job_id}/output`

18) Update job output collection
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}/output`

19) Get output file
- Method: `GET`
- Path: `/v2/jobs/{job_id}/output/{file_id}`

20) Delete output file
- Method: `DELETE`
- Path: `/v2/jobs/{job_id}/output/{file_id}`

21) Update output file
- Method: `PATCH`
- Path: `/v2/jobs/{job_id}/output/{file_id}`

### Job activity helpers
22) List job threads
- Method: `GET`
- Path: `/v2/jobs/{job_id}/threads`

23) Get job history
- Method: `GET`
- Path: `/v2/jobs/{job_id}/history`

### Static/reference information
24) List statuses
- Method: `GET`
- Path: `/v2/statuses`

25) List conversions catalog
- Method: `GET`
- Path: `/v2/conversions`

26) List contracts
- Method: `GET`
- Path: `/v2/contracts`

### Presets
27) List presets
- Method: `GET`
- Path: `/v2/presets`

28) Create preset
- Method: `POST`
- Path: `/v2/presets`

29) Get preset
- Method: `GET`
- Path: `/v2/presets/{preset_id}`

30) Update preset
- Method: `PATCH`
- Path: `/v2/presets/{preset_id}`

31) Delete preset
- Method: `DELETE`
- Path: `/v2/presets/{preset_id}`

### Statistics
32) Get day statistics
- Method: `GET`
- Path: `/v2/stats/day/{day}/{filter}`
- Path parameters:
  - `{day}`
  - `{filter}`

33) Get month statistics
- Method: `GET`
- Path: `/v2/stats/month/{month}/{filter}`
- Path parameters:
  - `{month}`
  - `{filter}`

34) Get year statistics
- Method: `GET`
- Path: `/v2/stats/year/{year}/{filter}`
- Path parameters:
  - `{year}`
  - `{filter}`

## Parameters and body notes
Common parameters visible in the reviewed docs/schema include:
- headers:
  - `X-Oc-Api-Key`
  - `X-Oc-Token`
- common path params:
  - `job_id`
  - `conversion_id`
  - `file_id`
  - `preset_id`
  - `day`
  - `month`
  - `year`
  - `filter`
- common query params:
  - `status`
  - `page`
- common body structures mentioned on the docs page:
  - `input`
  - `conversion`
  - conversion-specific `options`

## Pagination
- `GET /v2/jobs` is explicitly documented as paginated
- the reviewed docs say that route returns `50` elements per page
- the reviewed schema exposes the `page` query parameter on that route
- no general cursor or offset model was surfaced for the rest of the API on the pages reviewed in this pass

## Rate limits
- no numeric global rate limit was published on the reviewed landing page, documentation page, or official schema
- pricing/credit use is discussed on the site, but the reviewed pages do not publish a precise requests-per-second or requests-per-minute quota for the REST API

## Error and response notes
- the reviewed docs describe JSON request/response handling
- the schema publishes route-level error responses such as `401`, `404`, and `422` on multiple operations
- the quickstart shows successful job creation through a JSON body posted to `/v2/jobs`
- the API uses separate job, conversion, input, and output resources rather than a single one-shot conversion endpoint

## Important usage notes
- the official documentation positions jobs as the top-level workflow object; conversions, inputs, and outputs are all nested under a job
- the official quickstart uses remote-file input, but the documentation also includes dedicated sections for uploads, conversion options, metadata handling, special operations, and advanced API calls
- the official schema is the best current source of route completeness; the landing page alone is too high-level
- the docs present both free and paid access, but integrations still need an API key even for the free flavour

## Verification notes
This file was manually rebuilt from the official Api2Convert site, official documentation page, and official Swagger schema using browser inspection only. The `34` operations above were counted directly from the published first-party schema.