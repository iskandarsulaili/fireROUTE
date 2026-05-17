# USA.gov

## Provider metadata
- Category: `Government`
- Provider slug: `usa-gov`
- Official docs/pages used:
  - `https://www.usa.gov/developer` (assigned docs URL; currently an official 404 page)
  - `https://digital.gov/guides/search/` (official SearchGov overview)
  - `https://digital.gov/guides/search/set-up` (official setup guide pointing to SearchGov APIs)
  - `https://open.gsa.gov/api/searchgov-results/` (official Results API reference)
  - `https://open.gsa.gov/api/searchgov-clicks/` (official Clicks API reference)
  - `https://open.gsa.gov/api/searchgov-results/v2/openapi.yml` (official Results API OpenAPI file, fetched from the docs page)
  - `https://open.gsa.gov/api/searchgov-clicks/v2/openapi.yml` (official Clicks API OpenAPI file, fetched from the docs page)
- Assigned docs URL: `https://www.usa.gov/developer`
- Current public API base URL: `https://api.gsa.gov/technology/searchgov/v2`
- Auth model: SearchGov account provisioning is required first; live API calls require `affiliate` and SearchGov-generated `access_key`, and the Results API optionally accepts an `api_key` from API.Data.gov for higher rate limits
- Response formats documented: JSON for search results, empty-body `200` responses for click tracking, YAML OpenAPI specs for both APIs
- Rate/query limits explicitly documented:
  - Results API default limit: `1,000` requests per hour using the SearchGov `access_key`
  - Results API `limit` parameter: `1` to `50` results per request
  - Results API `offset` maximum: `999`
- Manually confirmed route count: `2`

## Access and platform notes
- The assigned USA.gov developer page no longer hosts the developer reference; it is now an official `Page not found | USAGov` page.
- The live SearchGov documentation is still official and now lives across Digital.gov and GSA Open Technology pages.
- Digital.gov's SearchGov setup guide explicitly says most customers use the hosted search page, but developers can use two APIs instead.
- SearchGov requires setup in the Admin Center before the APIs are usable. The docs say you must create an account, configure an affiliate site, add the domains to be indexed, and retrieve the generated API access key.
- The Results API docs say SearchGov uses your `robots.txt` file and XML sitemap to crawl and index content. If your content is not indexed, the API will not return results.
- The docs repeatedly say you must use both the Results API and the Clicks API for a complete custom search experience.

## Canonical endpoints
1. `GET /results/i14y`
   - Full URL: `https://api.gsa.gov/technology/searchgov/v2/results/i14y`
   - Purpose: retrieve SearchGov web results, best bets, spelling corrections, and routed-query responses for a configured affiliate.
   - Required query parameters:
     - `affiliate` - SearchGov site handle from the Admin Center
     - `access_key` - SearchGov-generated API access key for that affiliate
     - `query` - end-user search string
   - Optional query parameters:
     - `enable_highlighting` - boolean; defaults to `true`; highlights matches with Unicode wrappers `U+E000` and `U+E001`
     - `limit` - results page size; defaults to `20`; documented range `1..50`
     - `offset` - pagination offset; defaults to `0`; documented maximum `999`
     - `sort_by` - `relevance` or `date`; defaults to `relevance`
     - `sitelimit` - restricts results to specific subdomains or subfolders within the configured affiliate scope; space-separated for multiple values
     - `api_key` - optional API.Data.gov key for higher rate limits
   - Response notes:
     - Returns JSON.
     - Documented top-level result data includes `query`, `web.total`, `web.next_offset`, `web.spelling_correction`, `web.results`, and `text_best_bets`.
     - `web.results` fields documented across the human docs and OpenAPI file include `title`, `url`, `snippet`, `publication_date`, `thumbnail_url`, and `updated_date`.
     - Routed-query rules can replace the normal payload with a redirect object such as `{"route_to":"https://www.usa.gov/"}`.
   - Pagination: offset-based via `limit` + `offset`.
   - Rate limits: `1,000` requests/hour by default with the SearchGov access key; the docs say to contact the SearchGov team to use an API.Data.gov key for higher limits.
   - Errors:
     - The human docs do not publish a detailed status-code table for the Results API.
     - The official OpenAPI file describes the non-`200` case only as an unexpected JSON error string.

2. `POST /clicks/`
   - Full URL: `https://api.gsa.gov/technology/searchgov/v2/clicks/`
   - Purpose: send click-through telemetry for results returned by SearchGov so analytics and relevance tuning can work correctly.
   - Required parameters:
     - `affiliate` - SearchGov site handle
     - `access_key` - SearchGov-generated API access key
     - `query` - original end-user query that led to the click
     - `url` - clicked result URL
     - `position` - ranked position of the clicked result
     - `module_code` - result source code; documented valid values are `AIDOC` (Collections), `BOOS` (Text best bets), `I14Y` (Web results), and `QRTD` (Routed queries)
   - Optional parameters:
     - `client_ip` - user IP address
     - `user_agent` - user agent string
     - `referrer` - page URL where the click occurred
   - Request notes:
     - The human docs explicitly say this endpoint uses `POST`.
     - The official example uses `Content-Type: application/x-www-form-urlencoded` with parameters passed on the request URL.
   - Response notes:
     - Success is `200` with an empty body.
   - Errors:
     - `400` for missing required parameters such as a blank query
     - `401` for invalid or inactive affiliate sites, invalid access keys, unparseable URLs, or invalid module codes

## Authentication, rate-limit, and behavior notes
- SearchGov API access is not anonymous: you first need a configured SearchGov account and affiliate site in the SearchGov Admin Center.
- The public setup guide says SearchGov accounts use Login.gov and are intended for federal employees and contractors using official government email addresses.
- For the Results API, `affiliate` and `access_key` are required per request even when an API.Data.gov `api_key` is also supplied.
- The Clicks API reference does not publish a separate hourly cap.
- The SearchGov Clicks OpenAPI YAML currently conflicts with the human-written docs by describing `/clicks/` as a `GET` operation and defining an `X-API-KEY` security scheme, while the human reference page clearly instructs clients to use `POST` plus `affiliate` and `access_key`. The human docs are the safer canonical source here because they include the explicit request example and error behavior.

## Format and response-shape notes
- Results payloads are JSON and can include normal search results, text best bets, spelling corrections, or routed-query redirect instructions.
- Highlighting markup is not HTML. The docs say SearchGov wraps matches with Unicode characters `U+E000` and `U+E001`, so clients must convert those markers into presentation styling themselves.
- `sitelimit` must stay inside the domain scope configured for the affiliate in SearchGov.
- Click ingestion responses are intentionally minimal: the success response is empty.

## fireROUTE normalization notes
- Normalize USA.gov around the SearchGov API platform now documented by GSA rather than the retired `usa.gov/developer` page.
- Treat `GET /results/i14y` as the primary retrieval route and `POST /clicks/` as the paired telemetry route required for a complete first-party integration.
- Keep setup/admin URLs such as `https://search.usa.gov/login`, `https://search.usa.gov/signup`, and `https://search.usa.gov/sites` as implementation notes only; they are product-management surfaces, not public data endpoints.
- Flag the Clicks API method discrepancy in any generated adapter notes so implementers follow the human reference page instead of the inconsistent OpenAPI YAML.
