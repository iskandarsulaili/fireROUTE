# ScrapingDog

## Provider metadata
- Category: `Development`
- Provider slug: `scrapingdog`
- Docs used manually:
  - `https://docs.scrapingdog.com/`
  - `https://docs.scrapingdog.com/web-scraping-api`
  - `https://docs.scrapingdog.com/post-request`
  - `https://docs.scrapingdog.com/google-search-api-documentation`
  - `https://docs.scrapingdog.com/screenshot-api`
  - `https://docs.scrapingdog.com/account-api`
  - `https://docs.scrapingdog.com/profile-scraper-api/person-profile-scraper`
  - `https://docs.scrapingdog.com/profile-scraper-api/company-profile-scraper`
  - `https://docs.scrapingdog.com/jobs-search-scraper/scrape-jobs-search-results`
  - `https://docs.scrapingdog.com/jobs-search-scraper/scrape-job-overview`
- Confirmed REST API base URL: `https://api.scrapingdog.com`
- Primary media types: raw HTML for generic scrape responses, JSON for structured search/profile/job/account responses, and binary image output for screenshots
- Authentication model surfaced in docs: query parameter `api_key` on all confirmed REST endpoints
- Manually confirmed routes in this pass: `7`

## Authentication
From the official docs reviewed here:
- every confirmed endpoint uses query parameter authentication via `api_key`
- the docs say the key is available from the user dashboard after registration
- no alternative header-based auth scheme was documented on the reviewed first-party pages

## Common request/response conventions
- Base URL: `https://api.scrapingdog.com`
- Common auth parameter: `api_key`
- Common behavior from the official docs homepage:
  - each request is retried until success for up to `60` seconds
  - clients are told to set their own timeout to `60` seconds
  - unsuccessful requests that time out after retries return `410`
  - only successful `200` and `404` responses are billed
  - exceeding the concurrent connection limit returns `429`
  - free-plan overage is not allowed; going beyond `1000` monthly requests on the free plan returns `403`
- Response format differences confirmed in docs:
  - `/scrape` returns target-page HTML, including upstream page content
  - `/google`, `/profile`, `/jobs`, and `/account` return structured JSON payloads in the reviewed examples/docs text
  - `/screenshot` returns image bytes; docs show saving the response body as `png` by default

## Manually confirmed endpoint set

### 1) Generic webpage scrape
- Method: `GET`
- Path: `/scrape`
- Full URL: `https://api.scrapingdog.com/scrape`
- Purpose: fetch any webpage through ScrapingDog's general scraping layer
- Required query parameters:
  - `api_key`
  - `url`
- Important optional query parameters confirmed in docs:
  - `dynamic` - Boolean toggle for JavaScript rendering; docs say default is `true`
- Notes:
  - the reviewed page says the `url` value should be passed in decoded form
  - the response body is returned as raw HTML

### 2) Forward a POST request through the generic scraper
- Method: `POST`
- Path: `/scrape`
- Full URL: `https://api.scrapingdog.com/scrape`
- Purpose: send POST form/API traffic through ScrapingDog while still targeting a remote URL specified in the query string
- Required query parameters:
  - `api_key`
  - `url`
- Request body behavior confirmed in docs:
  - the reviewed example sends standard POST form data such as `foo=bar`
- Notes:
  - this is documented on the official `POST Request` page as a second method on the same `/scrape` endpoint

### 3) Google Search API
- Method: `GET`
- Path: `/google`
- Full URL: `https://api.scrapingdog.com/google`
- Purpose: retrieve Google search results as a structured API response
- Required query parameters:
  - `api_key`
  - `query`
- Important optional query parameters confirmed in docs:
  - `advance_search`
  - `mob_search`
  - `html`
  - `domain`
  - `country`
  - `cr`
  - `uule`
  - `location`
  - `language`
  - `lr`
  - `ludocid`
  - `lsig`
  - `kgmid`
  - `si`
  - `ibp`
  - `uds`
  - `tbs`
  - `safe`
  - `nfpr`
  - `filter`
  - `page`
  - `results`
- Notes:
  - docs say light search costs `5` credits while `advance_search=true` costs `10`
  - pagination is page-based, with `page=0` documented as the first page
  - `html=true` switches from parsed results toward the full Google HTML page output

### 4) Screenshot capture
- Method: `GET`
- Path: `/screenshot`
- Full URL: `https://api.scrapingdog.com/screenshot`
- Purpose: capture a screenshot of a target page
- Required query parameters:
  - `api_key`
  - `url`
- Important optional query parameters confirmed in docs:
  - `fullPage`
  - `width`
  - `height`
  - `wait_until`
  - `format`
  - `quality`
- Notes:
  - docs say each successful screenshot request costs `5` credits
  - `wait_until` defaults to `domcontentloaded`
  - documented `wait_until` values are `load`, `domcontentloaded`, and `networkidle`
  - documented output formats are `png`, `jpg`, and `webp`; `png` is the default

### 5) Account usage lookup
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.scrapingdog.com/account`
- Purpose: inspect account usage data such as remaining credits and concurrent connections
- Required query parameters:
  - `api_key`
- Notes:
  - the reviewed docs describe this as the monitoring endpoint for usage, available credits, and active concurrent connections

### 6) Public profile scraper
- Method: `GET`
- Path: `/profile`
- Full URL: `https://api.scrapingdog.com/profile`
- Purpose: retrieve public person or company profile data
- Required query parameters:
  - `api_key`
  - `id`
  - `type`
- Confirmed `type` values from official docs:
  - `profile` for a person profile
  - `company` for a company profile
- Additional optional query parameters confirmed in the person-profile docs:
  - `premium` - enable premium proxies
  - `webhook` - schedule a delayed scrape after roughly `2-3` minutes for better success on person profiles
- Notes:
  - docs say the `id` comes from the public profile URL
  - the person-profile page documents a higher-success asynchronous-style workflow when `webhook=true`

### 7) Jobs scraper
- Method: `GET`
- Path: `/jobs`
- Full URL: `https://api.scrapingdog.com/jobs`
- Purpose: retrieve either job-search listings or a specific job overview depending on supplied parameters
- Required query parameters for search mode:
  - `api_key`
  - `field`
- Important optional search-mode query parameters confirmed in docs:
  - `geoid`
  - `location`
  - `page`
  - `sort_by`
  - `job_type`
  - `exp_level`
  - `work_type`
  - `filter_by_company`
- Required query parameters for job-overview mode:
  - `api_key`
  - `job_id`
- Notes:
  - the reviewed docs use the same `/jobs` path for both listing search and single-job overview retrieval
  - docs say `geoid=92000000` searches globally by default
  - search-mode pagination uses the `page` parameter and docs say it must be greater than `0`

## Pagination
- `/google` documents a page-based pagination parameter:
  - `page=0` is the first page
- `/jobs` search mode also uses page-based pagination via `page`
- the reviewed docs did not expose provider-level next/previous cursor tokens
- other confirmed endpoints are single-resource or single-result operations rather than list endpoints with a documented pagination envelope

## Rate limits and quotas
- the reviewed first-party docs do not publish one global requests-per-minute figure
- they do publish concrete operational limits and quota behaviors:
  - generic request retry window: up to `60` seconds
  - free plan overage is disabled; exceeding `1000` monthly free-plan requests returns `403`
  - concurrent connection overruns return `429`
  - billing applies only to successful `200` and `404` responses
  - documented per-request credit costs include:
    - generic web scraping with rotating proxy: `1`
    - generic web scraping with JS rendering and rotating proxy: `5`
    - generic web scraping with premium proxy: `10`
    - generic web scraping with JS rendering and premium proxy: `25`
    - Google Search API: `5` or `10` depending on advanced/mobile mode
    - Screenshot API: `5`
    - Profile Scraper API: `50`
    - Jobs Search API: `5`

## Error and response notes
From the official documentation homepage reviewed here, ScrapingDog explicitly lists these status codes:
- `200` - successful request
- `202` - request accepted and still processing; docs say this appears only in the LinkedIn scraping API family
- `400` - request failed
- `401` - wrong API key
- `403` - request limit reached
- `404` - wrong URL
- `410` - request timeout after provider-side retries
- `429` - concurrent connection limit reached

Additional documented behavior:
- failed requests after the provider-side retry window should not be billed
- the docs recommend client-side timeout alignment with the provider's `60` second retry window
- screenshot responses are binary images rather than JSON
- generic scrape responses can return raw HTML rather than a parsed JSON structure

## Important usage notes
- ScrapingDog's official docs now live on `docs.scrapingdog.com`; the marketing site alone is not enough to reconstruct the route inventory
- the provider exposes both generic scraping primitives and many specialized vertical APIs; this pass confirms the general/core paths that were directly reviewed in the official docs above
- the jobs API uses one path with different parameter sets for search-vs-detail behavior
- the profile API uses one path with different `type` values for person-vs-company scraping
- for higher-friction profile scraping, the docs explicitly recommend the delayed `webhook` flow for better success rates

## Verification notes
This file was manually rebuilt from the official ScrapingDog documentation using browser inspection.