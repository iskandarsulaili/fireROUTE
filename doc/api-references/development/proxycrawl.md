# ProxyCrawl

## Provider metadata
- Category: `Development`
- Provider slug: `proxycrawl`
- Docs used manually:
  - `https://crawlbase.com/docs`
  - `https://crawlbase.com/docs/authentication`
  - `https://crawlbase.com/docs/rate-limits`
  - `https://crawlbase.com/docs/status-codes`
  - `https://crawlbase.com/docs/errors`
  - `https://crawlbase.com/docs/crawling-api`
  - `https://crawlbase.com/docs/crawler`
  - `https://crawlbase.com/docs/smart-proxy`
  - `https://crawlbase.com/docs/cloud-storage`
  - `https://crawlbase.com/docs/account-api`
  - `https://crawlbase.com/docs/proxy-api`
- Official site status reviewed in this pass: `https://proxycrawl.com` now redirects to the current first-party Crawlbase site and docs.
- Confirmed current first-party API bases:
  - `https://api.crawlbase.com`
  - `https://api.crawlbase.com/crawler/{token}/...`
- Confirmed official proxy endpoints:
  - `https://smartproxy.crawlbase.com:8013`
  - `http://smartproxy.crawlbase.com:8012`
  - `http://backconnect.crawlbase.com:9000`
- Primary media types: target-site HTML/JSON/Markdown passthrough for crawling; JSON for storage/account/management responses; gzip-compressed webhook payloads; base64+gzip bodies in bulk storage retrieval
- Authentication model surfaced in docs:
  - query parameter `token` for main REST endpoints
  - token embedded in path for `/crawler/{token}/...` management routes
  - proxy username = token for Smart AI Proxy and Backconnect; password blank
- Manually confirmed route operations in this pass: `18`

## Authentication
From the reviewed official Crawlbase docs:
- every Crawlbase account gets two tokens:
  - `Normal token` for standard API/static-page usage
  - `JavaScript token` for browser-rendered requests and JS-only features
- main REST calls authenticate with `token` in the query string
- crawler management endpoints put the token directly in the URL path instead of the query string
- Smart AI Proxy authenticates with your token as the proxy username and an empty password
- Backconnect Proxy does the same, with optional username qualifiers such as `-country-XX` and `-session-NAME`
- official auth-related error guidance:
  - `401` invalid or missing token
  - `402` out of credits / trial expired
  - `403` token valid but wrong product or token type

## Common request/response conventions
- Core REST host: `https://api.crawlbase.com`
- Main crawling endpoint path: `/`
- Storage paths live under `/storage`
- crawler-management paths live under `/crawler/{token}/...`
- legacy backconnect helper paths live under `/proxy/...`
- the main crawling endpoint can return:
  - raw target HTML
  - raw target JSON or other target media
  - Crawlbase JSON wrapper when `format=json`
  - Markdown output when `format=md`
- metadata is exposed through response headers such as:
  - `pc_status`
  - `original_status`
  - `rid`
  - `url`
- docs say successful requests are identified by `pc_status: 200`; accepted async queue requests use `pc_status: 201`
- the docs recommend `Accept-Encoding: gzip` and at least a `90`-second client timeout for the main crawling API
- bulk storage retrieval returns each stored page body as `base64(gzip(original_body))`

## Manually confirmed endpoint set

### 1) Direct crawl request
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://api.crawlbase.com/?token=YOUR_TOKEN&url=ENCODED_URL`
- Purpose: fetch a target URL through Crawlbase's current synchronous Crawling API
- Required query parameters:
  - `token`
  - `url` - fully URL-encoded, including scheme
- Important optional parameters explicitly documented on reviewed pages:
  - `country`
  - `device`
  - `user_agent`
  - `tor_network`
  - `request_headers`
  - `set_cookies`
  - `cookies_session`
  - `format`
  - JS-token-only controls such as `page_wait`, `ajax_wait`, `scroll`, and `css_click_selector`
- Important behavior notes:
  - when `crawler=NAME` and `callback=true` are supplied, this same route is also used to enqueue Enterprise Crawler jobs instead of waiting inline
  - docs say successful crawls are billable when `pc_status: 200`

### 2) Direct crawl request with POST upstream body
- Method: `POST`
- Path: `/`
- Full URL pattern: `https://api.crawlbase.com/?token=YOUR_TOKEN&url=ENCODED_URL`
- Purpose: send an upstream POST request through Crawlbase while still targeting the encoded `url` parameter
- Important reviewed notes:
  - docs explicitly support form or JSON request bodies on the Crawlbase request
  - `post_content_type` is documented for upstream content-type control
  - response body is still the target response body, with Crawlbase metadata in headers

### 3) Direct crawl request with PUT upstream body
- Method: `PUT`
- Path: `/`
- Full URL pattern: `https://api.crawlbase.com/?token=YOUR_TOKEN&url=ENCODED_URL`
- Purpose: send an upstream PUT request through Crawlbase
- Important reviewed notes:
  - docs explicitly list `PUT` as a supported method on the same root endpoint
  - raw payload handling still uses the encoded `url` target plus Crawlbase query parameters

### 4) Retrieve one stored page
- Method: `GET`
- Path: `/storage`
- Full URL pattern: `https://api.crawlbase.com/storage`
- Purpose: fetch a previously stored crawl result
- Required query parameters:
  - `token`
  - one of `rid` or `url`
- Optional query parameter:
  - `format` - `html` or `json`
- Notes:
  - storage writes happen indirectly via `store=true` on the main crawling endpoint; `/storage` is for reads only
  - `url` lookup returns the most recent stored version of that original URL

### 5) Bulk retrieve stored pages
- Method: `POST`
- Path: `/storage/bulk`
- Full URL: `https://api.crawlbase.com/storage/bulk`
- Purpose: retrieve up to `100` stored items in one round-trip
- Required query/body pieces:
  - query `token`
  - JSON body field `rids` - array of storage IDs
- Optional JSON field:
  - `auto_delete` - delete each item after successful return
- Response notes:
  - response is a JSON array
  - each item includes `stored_at`, `original_status`, `pc_status`, `rid`, `url`, and `body`
  - docs state `body` is base64-encoded and gzip-compressed

### 6) Bulk delete stored pages
- Method: `POST`
- Path: `/storage/bulk_delete`
- Full URL: `https://api.crawlbase.com/storage/bulk_delete`
- Purpose: delete a list of stored RIDs in one call
- Required query/body pieces:
  - query `token`
  - JSON body field `rids`
- Response notes:
  - response is a JSON array with per-RID status rows
  - reviewed examples show `result` values such as `Deleted`, `Not Found`, and `Failed`

### 7) Delete one stored page
- Method: `DELETE`
- Path: `/storage`
- Full URL: `https://api.crawlbase.com/storage`
- Purpose: delete one stored page by RID
- Required query parameters:
  - `token`
  - `rid`
- Response notes:
  - official docs show success body `{"success": "The Storage item has been deleted successfully"}`
  - error bodies include `Not Found` and delete-failure variants

### 8) List storage RIDs
- Method: `GET`
- Path: `/storage/rids`
- Full URL: `https://api.crawlbase.com/storage/rids`
- Purpose: page through the current storage inventory
- Required query parameter:
  - `token`
- Important optional query parameters:
  - `limit`
  - `scroll`
  - `scroll_id`
  - `scroll_order`
- Response notes:
  - reviewed docs show response fields `rids` and `scroll_id`
  - docs say `limit` caps at `10000`

### 9) Count stored pages
- Method: `GET`
- Path: `/storage/total_count`
- Full URL: `https://api.crawlbase.com/storage/total_count`
- Purpose: return the total number of currently stored pages
- Required query parameter:
  - `token`
- Response note:
  - reviewed example returns JSON like `{ "totalCount": 5491078 }`

### 10) Read account usage statistics
- Method: `GET`
- Path: `/account`
- Full URL: `https://api.crawlbase.com/account`
- Purpose: retrieve monthly product usage and billing statistics
- Required query parameters:
  - `token`
  - `product`
- Optional query parameter:
  - `previous_month=true`
- Reviewed `product` values:
  - `crawling-api`
  - `crawler`
  - `smartproxy`
  - `scraper-api`
  - `leads-api`
  - `screenshot-api`

### 11) Read crawler statistics
- Method: `GET`
- Path: `/crawler/{token}/stats`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/stats`
- Purpose: retrieve overall crawler stats such as queue depth and history
- Optional query parameters:
  - `history_from`
  - `history_to`
- Notes:
  - docs explicitly say these management routes authenticate with the token in the path, not the query string

### 12) Purge a crawler queue
- Method: `POST`
- Path: `/crawler/{token}/{name}/purge`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/{name}/purge`
- Purpose: immediately drop all still-pending URLs from a named crawler queue
- Path parameters:
  - `{token}`
  - `{name}` - crawler name
- Important note:
  - docs explicitly warn there is no undo

### 13) Delete one queued crawler job
- Method: `POST`
- Path: `/crawler/{token}/{name}/delete_job`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/{name}/delete_job?rid=YOUR_RID`
- Purpose: remove one queued crawler request by RID
- Required query parameter:
  - `rid`

### 14) Find crawler job by RID
- Method: `GET`
- Path: `/crawler/{token}/{name}/find_by_rid/{rid}`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/{name}/find_by_rid/{rid}`
- Purpose: look up whether a crawler job is still queued
- Response notes:
  - reviewed docs show `QUEUED` and `NOT_QUEUED` status values
  - queued response includes `request_info` fields such as `rid`, `url`, `retry`, and `created_at`

### 15) Pause crawler processing
- Method: `POST`
- Path: `/crawler/{token}/{name}/pause`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/{name}/pause`
- Purpose: stop a crawler from picking up new work without deleting the queue

### 16) Resume crawler processing
- Method: `POST`
- Path: `/crawler/{token}/{name}/unpause`
- Full URL pattern: `https://api.crawlbase.com/crawler/{token}/{name}/unpause`
- Purpose: resume processing for a paused crawler

### 17) Request a legacy Backconnect static IP
- Method: `GET`
- Path: `/proxy/static`
- Full URL: `https://api.crawlbase.com/proxy/static`
- Purpose: allocate a static Backconnect proxy port
- Required query parameter:
  - `token`
- Optional query parameter:
  - `country`
- Response notes:
  - reviewed examples return `port`, `host`, and `session_time`
  - docs say this endpoint is rate-limited to `1` request per `5` minutes per country, or per overall bucket when no country is supplied

### 18) Manage legacy Backconnect IP whitelist
- Methods explicitly documented: `GET`, `POST`, `DELETE`
- Path: `/proxy/whitelist_ips`
- Full URL: `https://api.crawlbase.com/proxy/whitelist_ips`
- Purpose: list, add, or remove whitelisted source IPs for Backconnect auth
- Required query parameters:
  - `token`
- Query parameter required for add/remove operations:
  - `ip`
- Behavior notes:
  - `POST` adds a whitelisted IP
  - `DELETE` removes a whitelisted IP
  - `GET` returns the current whitelist as JSON
  - docs say changes may take up to `1` minute to propagate

## Pagination
- the main crawling API itself is not paginated
- Cloud Storage inventory uses explicit scroll pagination on `GET /storage/rids`
- reviewed pagination controls:
  - `limit`
  - `scroll=true` to seed the scroll session
  - `scroll_id` to fetch the next page
  - `scroll_order=asc|desc`
- docs say `scroll_id` expires after about `15` seconds of inactivity

## Rate limits and quotas
From the official rate-limit and route-specific pages reviewed here:
- default concurrent requests: `20` per token
- derived throughput guidance: about `20` requests/second per token
- total monthly requests: up to `51,000,000` per token
- single-request timeout guidance: `90` seconds
- crawler queue size: `100,000` URLs per crawler
- `GET /account` is explicitly rate-limited to `1` request per `5` minutes
- `GET /proxy/static` is explicitly rate-limited to `1` request per `5` minutes per country bucket
- when concurrency is exceeded, Crawlbase returns:
  - HTTP `429`
  - `Retry-After`
  - `X-Crawlbase-Concurrency`

## Error and response notes
From the reviewed status-code and error-handling docs:
- Crawlbase exposes two result layers:
  - HTTP status for Crawlbase itself
  - `pc_status` for the upstream crawl outcome
- reviewed HTTP statuses include:
  - `200`
  - `401`
  - `402`
  - `403`
  - `422`
  - `429`
  - `500`
  - `503`
- reviewed transient/retry examples include:
  - `429`
  - `500`
  - `503`
  - `522`
  - `599`
- reviewed terminal examples include:
  - `401`
  - `402`
  - `403`
  - `404`
  - `410`
  - `422`
  - `451`
- `original_status` preserves the raw target-site HTTP status when Crawlbase reached the site successfully but the site itself returned an error
- webhook deliveries are retried and the docs explicitly note that failed webhook deliveries are still billable because the crawl already ran

## Important usage notes
- `proxycrawl.com` now redirects to Crawlbase; fireROUTE should treat ProxyCrawl as a rebranded provider whose current official docs live under `crawlbase.com`
- the same root crawl endpoint powers both simple inline fetches and Enterprise Crawler queue submission; queue mode is selected by parameters rather than a different path
- successful requests are billed when `pc_status: 200`; the docs say target-side failures/timeouts/blocks are free
- Smart AI Proxy is the current preferred low-friction proxy product; the older Backconnect Proxy API is explicitly documented as deprecated but still supported
- Smart AI Proxy requires disabling client TLS verification because Crawlbase terminates and re-establishes TLS on the proxy path
- storage retention is documented as `14` days by default, with retrieval calls themselves described as free
- webhook-mode crawler payloads are gzip-compressed except for Zapier-specific handling noted in the docs

## Verification notes
This file was manually rebuilt from the current official Crawlbase documentation after verifying that the legacy ProxyCrawl domain now redirects to Crawlbase.