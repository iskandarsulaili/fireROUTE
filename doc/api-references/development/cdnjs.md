# CDNJS

## Provider metadata
- Category: `Development`
- Provider slug: `cdnjs`
- Docs used manually:
  - `https://cdnjs.com/api`
- Confirmed REST API base URL: `https://api.cdnjs.com`
- Related asset-host base surfaced in responses: `https://cdnjs.cloudflare.com`
- Primary media type: JSON
- Authentication: none
- Manually confirmed routes in this pass: `5`

## Authentication
From the official cdnjs API page:
- no authentication is required for the reviewed API routes
- the page documents public GET endpoints only

## Common request/response conventions
- Base URL: `https://api.cdnjs.com`
- all reviewed routes are `GET`
- responses are JSON by default
- the optional query parameter `output=human` returns pretty-printed JSON on an HTML page
- the API page repeatedly documents cache lifetimes per route family
- library search/list responses use top-level `results`, `total`, and `available`

## Manually confirmed endpoint set

### 1) Browse/search libraries
- Method: `GET`
- Path: `/libraries`
- Full URL: `https://api.cdnjs.com/libraries`
- Purpose: list libraries or search the cdnjs index
- Query parameters confirmed on the official page:
  - `search` - search term against the library index
  - `fields` - comma-separated field list; `name` and `latest` are always present
  - `search_fields` - comma-separated list of searchable fields; unsupported values are silently ignored
  - `limit` - limit number of returned library objects
  - `output` - use `human` for pretty-printed HTML presentation
- Response fields explicitly documented:
  - `results[]`
  - `results[].name`
  - `results[].latest`
  - optional fields such as `filename`, `description`, `version`, `keywords`, `alternativeNames`, `fileType`, `github`, `objectID`, `license`, `homepage`, `repository`, `author`, `originalName`, `sri`
  - `total`
  - `available`
- Important usage notes from the official page:
  - this endpoint is powered directly by the cdnjs Algolia index
  - results are not ranked by search relevance; they follow the same ranking used when no search query is supplied
  - cache lifetime is `6 hours`

### 2) Get one library
- Method: `GET`
- Path: `/libraries/{library}`
- Full URL: `https://api.cdnjs.com/libraries/{library}`
- Purpose: fetch metadata for a specific library
- Path parameters:
  - `library` - required library name on cdnjs
- Query parameters confirmed on the official page:
  - `fields` - comma-separated list of desired properties
  - `output` - `human` pretty-print mode
- Response fields explicitly documented:
  - `name`
  - `latest`
  - `sri`
  - `filename`
  - `version`
  - `description`
  - `homepage`
  - `keywords`
  - `repository`
  - `license`
  - `author`
  - `autoupdate`
  - `versions[]`
  - `assets[]`
- Important usage notes from the official page:
  - access to assets for all versions via this endpoint is deprecated
  - `assets` now only contains a single entry for the latest version
  - the page explicitly directs clients to `/libraries/{library}/{version}` for version-specific asset listings
  - cache lifetime is `6 hours`

### 3) Get one specific library version
- Method: `GET`
- Path: `/libraries/{library}/{version}`
- Full URL: `https://api.cdnjs.com/libraries/{library}/{version}`
- Purpose: fetch immutable file details for one published version
- Path parameters:
  - `library` - library name
  - `version` - exact version identifier
- Query parameters confirmed on the official page:
  - `fields`
  - `output`
- Response fields explicitly documented:
  - `name`
  - `version`
  - `files[]`
  - `rawFiles[]`
  - `sri`
- Important usage notes from the official page:
  - version responses are treated as immutable
  - tags such as `latest` are intentionally not supported on this endpoint
  - cache lifetime is `355 days`
  - the response is marked immutable because published versions never change

### 4) Fetch whitelist details
- Method: `GET`
- Path: `/whitelist`
- Full URL: `https://api.cdnjs.com/whitelist`
- Purpose: retrieve file-extension allowlist metadata used by the CDN
- Query parameters confirmed on the official page:
  - `fields`
  - `output`
- Response fields explicitly documented:
  - `extensions[]`
  - `categories` - map from extension to category
- Important usage notes from the official page:
  - this list controls which file extensions are permitted on the CDN
  - cache lifetime is `6 hours`

### 5) Fetch basic cdnjs statistics
- Method: `GET`
- Path: `/stats`
- Full URL: `https://api.cdnjs.com/stats`
- Purpose: retrieve basic aggregate stats for the service
- Query parameters confirmed on the official page:
  - `fields`
  - `output`
- Response fields explicitly documented:
  - `libraries`
- Important usage notes from the official page:
  - cache lifetime is `6 hours`

## Pagination
- the reviewed cdnjs routes do not expose cursor- or page-number-based pagination
- `/libraries` instead uses `limit` plus response totals (`total`, `available`)

## Rate limits
- the reviewed official cdnjs API page does not publish numeric rate limits
- it does publish cache lifetimes:
  - `/libraries`: `6 hours`
  - `/libraries/{library}`: `6 hours`
  - `/libraries/{library}/{version}`: `355 days`
  - `/whitelist`: `6 hours`
  - `/stats`: `6 hours`

## Error and response notes
From the official `Error responses from the cdnjs API` section:
- all errors use a unified JSON structure
- documented error body fields:
  - `error` - always `true`
  - `status` - mirrors the HTTP status code
  - `message` - human-readable error message
- documented examples include:
  - missing library -> `404` / `{"error":true,"status":404,"message":"Library not found"}`
  - unknown route -> `404` / `{"error":true,"status":404,"message":"Endpoint not found"}`
- `404` responses have a `1 hour` cache lifetime
- other errors such as `5xx` are documented as having no cache lifetime set

## Important usage notes
- the API returns metadata about libraries hosted by cdnjs; actual asset delivery URLs generally point at `cdnjs.cloudflare.com`
- `fields` can request non-default fields, but unknown fields are returned as `null`
- `search_fields` silently ignores unsupported values
- version-specific file manifests belong on `/libraries/{library}/{version}`, not on the deprecated all-assets behavior of `/libraries/{library}`

## Verification notes
This file was manually rebuilt from the official cdnjs API documentation page using browser inspection.