# Open Page Rank

## Provider metadata
- Category: `Development`
- Provider slug: `open-page-rank`
- Docs used manually:
  - `https://www.domcop.com/openpagerank/documentation`
- Confirmed REST API base URL: `https://openpagerank.com/api/v1.0/`
- Primary media type: JSON
- Authentication: API key in request header
- Manually confirmed routes in this pass: `1`

## Authentication
From the official documentation page:
- requests require an API key in the header
- documented header format: `API-OPR: YOUR-API-KEY-HERE`

## Common request/response conventions
- Base URL: `https://openpagerank.com/api/v1.0/`
- reviewed API method is `GET`
- official response examples are JSON
- the request is described as `formdata`, but the concrete example and parameter table show repeated GET query parameters in the URL

## Manually confirmed endpoint set

### 1) Get page-rank data for up to 100 domains
- Method: `GET`
- Path: `/getPageRank`
- Full URL: `https://openpagerank.com/api/v1.0/getPageRank`
- Purpose: retrieve Open Page Rank values and rank metadata for one or more domains
- Header parameters confirmed on the official page:
  - `API-OPR` - required API key
- Query parameters confirmed on the official page:
  - `domains[]` - repeated domain parameter; the docs example uses `google.com`, `apple.com`, and `unknowndomain.com`
- Important usage notes from the official page:
  - maximum `100` domains can be sent in a single API call
  - the docs show the repeated-array query style produced by `http_build_query`
- Response fields explicitly shown in the official example:
  - top-level `status_code`
  - top-level `response[]`
  - top-level `last_updated`
  - per-domain `status_code`
  - per-domain `error`
  - per-domain `page_rank_integer`
  - per-domain `page_rank_decimal`
  - per-domain `rank`
  - per-domain `domain`
- Error-like behavior explicitly shown in the example:
  - unknown domains can return per-item `status_code: 404` with `error: "Domain not found"` while the overall response remains successful

## Pagination
- none documented
- batching is done by repeating `domains[]`, with a single-call cap of `100` domains

## Rate limits
From the official `Rate Limits` section:
- `10,000` API calls per hour

## Error and response notes
- the official example uses a top-level success envelope containing a `response[]` array of per-domain results
- domain-specific failures are represented inline in that array rather than requiring a full-request failure
- the official page did not publish a broader standalone HTTP error table beyond the per-item example behavior

## Important usage notes
- clients should expect mixed-success batches because the example includes successful and not-found domains in one response
- the docs emphasize domain batching through repeated `domains[]` keys rather than a JSON body
- the published `last_updated` field indicates the date of the underlying rank dataset

## Verification notes
This file was manually rebuilt from the official Open Page Rank documentation page using browser inspection.