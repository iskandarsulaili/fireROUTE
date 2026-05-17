# Mozilla HTTP Scanner

## Provider metadata
- Category: `Security`
- Provider slug: `mozilla-http-scanner`
- Docs used manually:
  - `https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md`
  - official raw source content from the same repository path (`raw.githubusercontent.com/mozilla/http-observatory/main/httpobs/docs/api.md`) viewed via browser fetch during review
- Confirmed API base URL: `https://http-observatory.security.mozilla.org/api/v1`
- Primary media type: JSON
- Authentication: none documented
- Manually confirmed routes in this pass: `6`

## Authentication
- the official API document describes an HTTP+JSON API and does not document any API key, OAuth flow, or auth header
- treat the reviewed surface as unauthenticated unless Mozilla publishes newer official auth requirements elsewhere

## Common request/response conventions
- all requests are over HTTP(S) with JSON responses
- the API document says requests are made via `POST` or `GET`
- the primary endpoint is explicitly documented as `https://http-observatory.security.mozilla.org/api/v1`
- successful scan-oriented responses return a `scan` object or other route-specific JSON objects

## Manually confirmed endpoint set

### 1) Invoke assessment
- Method: `POST`
- Path: `/analyze`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/analyze`
- Purpose: request a new website scan
- Query/body parameters explicitly documented:
  - `host` - required hostname
  - `hidden` - POST parameter; set to `true` to hide the scan from public recent results
  - `rescan` - POST parameter; set to `true` to force a rescan
- Success response: one `scan` object
- Important cache/throttle notes:
  - cached result may be returned if the site was scanned in the previous `24` hours
  - regardless of `rescan`, a site cannot be scanned more often than every `3` minutes

### 2) Retrieve assessment
- Method: `GET`
- Path: `/analyze`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/analyze`
- Query parameters:
  - `host` - required hostname
- Purpose: fetch the current or completed scan object for a host
- Success response: one `scan` object

### 3) Retrieve test results
- Method: `GET`
- Path: `/getScanResults`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/getScanResults`
- Query parameters:
  - `scan` - required scan ID from the scan object
- Purpose: fetch subtest results for a completed scan
- Success response: one `tests` object

### 4) Retrieve recent scans
- Method: `GET`
- Path: `/getRecentScans`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/getRecentScans`
- Query parameters:
  - `min` - minimum score
  - `max` - maximum score
- Purpose: return the ten most recent scans within a score range
- Response shape: JSON object mapping hostnames to grades

### 5) Retrieve host scan history
- Method: `GET`
- Path: `/getHostHistory`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/getHostHistory`
- Query parameters:
  - `host` - required hostname
- Purpose: return public scan history for a host
- Response shape: JSON array of scan-history entries with fields including `end_time`, `end_time_unix_timestamp`, `grade`, `scan_id`, and `score`

### 6) Retrieve overall grade distribution
- Method: `GET`
- Path: `/getGradeDistribution`
- Full URL: `https://http-observatory.security.mozilla.org/api/v1/getGradeDistribution`
- Purpose: return overall counts by grade
- Response shape: JSON object keyed by grades such as `A+`, `A`, `B`, ... `F`

## Additional documented note
- `GET /getScannerStates` is present in the official document but explicitly labeled `DEPRECATED`; I did not count it in the manually confirmed route total above

## Response objects and states explicitly documented
The official document describes:
- a `scan` object with fields including:
  - `end_time`
  - `grade`
  - `hidden`
  - `response_headers`
  - `scan_id`
  - `score`
  - `likelihood_indicator`
  - `start_time`
  - `state`
  - `tests_failed`
  - `tests_passed`
  - `tests_quantity`
- scan states:
  - `ABORTED`
  - `FAILED`
  - `FINISHED`
  - `PENDING`
  - `STARTING`
  - `RUNNING`

## Pagination
- none documented
- `getRecentScans` explicitly returns ten recent scans, but the reviewed doc does not define a pagination mechanism

## Rate limits
- the docs do not publish general numeric request quotas
- the scan workflow does publish two operational constraints:
  - cached results may be returned for scans from the last `24` hours
  - a host cannot be rescanned more often than every `3` minutes

## Error and response notes
- the official document focuses on success-object schemas and does not publish a structured error catalog or status-code table beyond the route descriptions
- all reviewed responses are described as JSON

## Important usage notes
- the API is aimed at public-website HTTP security assessment
- `getScanResults` is intended for finished scans after the scan state reaches `FINISHED`
- `hidden=true` only affects visibility in public recent-results listings; it does not change the scan-object shape described in the docs

## Verification notes
This file was manually rebuilt from Mozilla's official HTTP Observatory API document in the official GitHub repository.