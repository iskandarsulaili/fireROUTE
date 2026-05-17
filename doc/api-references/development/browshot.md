# Browshot

## Provider metadata
- Category: `Development`
- Provider slug: `browshot`
- Docs used manually:
  - `https://browshot.com/api/documentation`
  - `https://browshot.com/api/documentation/code/swagger/browshot_swagger.yaml`
- Confirmed API host/base:
  - host: `https://api.browshot.com`
  - complete API base path: `/api/v1`
  - practical base URL: `https://api.browshot.com/api/v1`
- Current human-doc version visible on the page: `1.31`
- Downloadable Swagger file version visible in this pass: `1.17.0`
- Primary response/content types confirmed from the reviewed official pages: JSON for most control/status routes, PNG/JPEG image bodies for screenshot/thumbnail retrieval, HTML for `/screenshot/html`
- Authentication model confirmed from the reviewed official pages:
  - every request requires API key query parameter `key`
  - the docs explicitly say: add `key=<my_api_key>` to all requests
- Manually confirmed routes in this pass: `20`

## Authentication
From the official API documentation page:
- Browshot uses API-key authentication via query parameter `key`
- the API key is shown in the user's Browshot dashboard
- the official docs do not document a Bearer/header alternative on the reviewed pages

## Base URL and transport model
From the official docs page and the downloadable Swagger file:
- complete API routes live under `https://api.browshot.com/api/v1`
- the docs say requests can be made with `GET` or `POST` commands to `https://api.browshot.com/`
- route-specific method details confirmed in this pass:
  - screenshot-management/info/list/search/share/thumbnail/html/account/instance/browser routes are documented with query-string URLs and are represented as `GET` in the downloadable Swagger where present
  - `POST /api/v1/batch/create` is explicitly documented as multipart upload
  - crawl routes are present on the live HTML docs (`1.31`) but not in the older downloadable Swagger (`1.17.0`)

## General response and error behavior
From the official docs page:
- general control API behavior:
  - valid requests get `200 OK`
  - malformed requests return `403`
  - most non-image routes respond with JSON
- simple screenshot endpoint and image-returning routes use HTTP status to signal state:
  - `200` success, body contains screenshot/thumbnail image
  - `302` screenshot still in progress; follow the redirect
  - `400` invalid request; details in `X-Error` header
  - `404` screenshot failed / not found; details in `X-Error` header and some routes return the default not-found image
- `GET /api/v1/screenshot/html` returns rendered HTML on success, or an empty body with `404` on failure

## Quotas and cost notes explicitly documented in this pass
- the simple API section explicitly states free usage is limited to `100 free screenshots per month`
- screenshot requests against private/shared instances require a positive balance
- several features explicitly cost extra credits when enabled:
  - `html=1` on screenshot or crawl requests: `1` extra credit per screenshot
  - crawl requests use `details=3` to capture links and the docs say this adds an extra credit per screenshot
- the reviewed official pages did not publish a broader requests-per-minute style rate-limit table

## Manually confirmed endpoint set
All paths below are relative to `https://api.browshot.com/api/v1` unless otherwise noted.

### 1) Simple screenshot API
- Method: `GET` in the reviewed examples
- Path: `/simple`
- Required parameters:
  - `url`
  - `instance_id` (defaults to free instance `12` if omitted per the docs)
  - `key`
- Important parameters shown on the simple API page:
  - `width`
  - `height`
  - plus the same screenshot/thumbnail arguments supported by the complete screenshot API
- Response behavior:
  - `200` PNG body
  - `302` still in progress; follow redirect
  - `400` invalid request with `X-Error`
  - `404` failed screenshot / default not-found image with `X-Error`
- Notes:
  - the docs warn some pages can take up to two minutes, so clients must follow `302/307` redirects

### 2) Request a screenshot
- Method: `GET`
- Path: `/screenshot/create`
- Required parameters:
  - `url`
  - `instance_id`
  - `key`
- Common parameters explicitly documented:
  - `size` = `screen` or `page`
  - `cache`
  - `delay`
  - `screen_width`
  - `screen_height`
- Optional parameters explicitly documented on the current docs page:
  - `hide_popups`
  - `dark`
  - `strict_ssl`
  - `referer`
  - `post_data`
  - `cookie`
  - `script`
  - `script_inline`
  - `details`
  - `html`
  - `max_wait`
  - `headers`
  - `target`
  - `priority`
  - `hook`
  - `steps`
  - `trackers`
  - hosting-related fields including `hosting`, `hosting_height`, `hosting_width`, `hosting_scale`, `hosting_bucket`, `hosting_file`, `hosting_headers`, `hosting_private`
- Notes:
  - `hook` receives a `POST` callback containing the same JSON returned by `screenshot/info`
  - hook delivery may be retried up to two times

### 3) Request multiple screenshots in one call
- Method: `GET`
- Path: `/screenshot/multiple`
- Required/primary parameters:
  - repeated `url` parameters, up to `10`
  - repeated `instance_id` parameters, up to `10`
  - `key`
- Notes:
  - the docs say all parameters supported by `screenshot/create` are accepted here as well
  - up to `100` screenshots can be requested in one call (`10 URLs × 10 instances`)

### 4) Get screenshot status/details
- Method: `GET`
- Path: `/screenshot/info`
- Parameters:
  - `id` - screenshot ID returned from create
  - `details` (`0`-`3`, default `0`)
  - `key`
- Notes:
  - the current docs explicitly say clients should poll until `status` is `finished` or `error`
  - examples show useful fields such as `status`, `response_code`, `content_type`, `images`, and other page metadata at higher detail levels

### 5) List recent screenshots
- Method: `GET`
- Path: `/screenshot/list`
- Parameters:
  - `limit` (`0`-`100`, default `100`)
  - `status` (`error`, `finished`, `in_process`)
  - `details` (`0`-`3`)
  - `key`
- Notes:
  - the docs describe this as returning information about the last `100` screenshots requested

### 6) Search screenshots by URL
- Method: `GET`
- Path: `/screenshot/search`
- Parameters:
  - `url` - search string to match the requested URL
  - `limit` (default `50`, max `100`)
  - `status`
  - `details` (`0`-`3`)
  - `key`

### 7) Host a screenshot or thumbnail
- Method: `GET`
- Path: `/screenshot/host`
- Parameters:
  - `id`
  - `hosting` = `s3` or `browshot`
  - thumbnail controls: `width`, `height`, `scale`
  - S3-specific fields: `bucket`, `file`, `headers`, `private`
  - `key`
- Notes:
  - if no width/height/scale is given, the original screenshot is hosted
  - the docs say only finished screenshots can be hosted

### 8) Retrieve thumbnail/image derivative
- Method: `GET`
- Path: `/screenshot/thumbnail`
- Parameters:
  - `id`
  - `width`
  - `height`
  - `scale`
  - `zoom`
  - `ratio` = `fit|fill`
  - crop controls: `left`, `right`, `top`, `bottom`
  - `format` = `jpeg|png` (default `png`)
  - `shot` (`1`-`5`) for multi-shot capture sets
  - `quality` (`1`-`100`) for JPEG thumbnails
  - `key`
- Response behavior:
  - returns image bytes, not JSON
  - docs reiterate `200` success / `302` incomplete / `404` failure behavior

### 9) Share a screenshot publicly
- Method: `GET`
- Path: `/screenshot/share`
- Parameters:
  - `id`
  - `note` optional
  - `key`
- Notes:
  - only completed screenshots can be shared

### 10) Delete screenshot data
- Method: `GET`
- Path: `/screenshot/delete`
- Parameters:
  - `id`
  - `data` optional, comma-separated values:
    - `image`
    - `url`
    - `metadata`
    - `all`
  - `key`
- Notes:
  - the docs present this as selective deletion of confidential screenshot data rather than a RESTful resource delete route

### 11) Retrieve rendered HTML
- Method: `GET`
- Path: `/screenshot/html`
- Parameters:
  - `id`
  - `key`
- Notes:
  - only useful when the original screenshot was created with `html=1`
  - success returns the rendered HTML body rather than JSON
  - failure returns empty body with `404`

### 12) Create a batch screenshot job
- Method: `POST`
- Path: `/batch/create`
- Content type explicitly documented: `multipart/form-data`
- Required form fields:
  - `instance_id`
  - `file` - text file containing one URL per line
- Additional form/query parameters confirmed from the reviewed Swagger/docs:
  - `size`
  - `name`
  - `width`
  - `height`
  - `delay`
  - `screen_width`
  - `screen_height`
  - `priority`
  - `referer`
  - `post_data`
  - `cookie`
  - `script`
  - `details`
  - `html`
  - `max_wait`
  - `headers`
  - `format`
  - `hide_popups`
  - `dark`
  - hosting options `hosting`, `hosting_height`, `hosting_width`, `hosting_scale`, `hosting_bucket`, `hosting_file`, `hosting_headers`
  - `key`
- Notes:
  - failed screenshots are retried up to three times
  - the docs also describe an optional second column in the input file for S3 file names

### 13) Get batch status/details
- Method: `GET`
- Path: `/batch/info`
- Parameters:
  - `id`
  - `key`
- Notes:
  - examples show fields such as `status`, `count`, `failed`, and downloadable archive `urls`

### 14) Create a crawl job
- Method: `GET` in the reviewed current-doc examples
- Path: `/crawl/create`
- Required parameters:
  - `domain`
  - `url`
  - `instance_id`
  - `key`
- Optional parameters explicitly documented:
  - `max`
  - `size`
  - `name`
  - `width`
  - `height`
  - `format`
  - `screen_width`
  - `screen_height`
  - `delay`
  - `referer`
  - `headers`
  - `post_data`
  - `cookie`
  - `script`
  - `script_inline`
  - `html`
  - `hide_popups`
  - `dark`
  - hosting options `hosting`, `hosting_height`, `hosting_width`, `hosting_scale`, `hosting_bucket`, `hosting_file`, `hosting_headers`
- Notes:
  - current docs say crawl requests run with `details=3` to capture all links
  - that detail level costs an extra credit per screenshot

### 15) Get crawl status/details
- Method: `GET`
- Path: `/crawl/info`
- Parameters:
  - `id`
  - `key`
- Response/status notes confirmed from the current docs:
  - statuses shown: `error`, `in_queue`, `in_process`, `finished`
  - example fields include `id`, `domain`, `url`, `max`, `count`, `processed`, `failed`, `urls`

### 16) Get account information
- Method: `GET`
- Path: `/account/info`
- Parameters:
  - `details` (`1`-`3`, default `1`)
  - `key`
- Notes:
  - examples show balance-style fields such as `free_screenshots_left` and `balance`

### 17) List available instances
- Method: `GET`
- Path: `/instance/list`
- Parameters:
  - `key`
- Notes:
  - no additional parameters are documented on the reviewed page
  - examples show grouped instance lists, including free instances

### 18) Get instance information
- Method: `GET`
- Path: `/instance/info`
- Parameters:
  - `id`
  - `key`
- Notes:
  - examples show fields such as `screenshot_cost`, `load`, and embedded browser info

### 19) List browsers
- Method: `GET`
- Path: `/browser/list`
- Parameters:
  - `key`
- Notes:
  - the docs say this returns predefined browsers and can support private-instance browser creation workflows

### 20) Get browser information
- Method: `GET`
- Path: `/browser/info`
- Parameters:
  - `id`
  - `key`
- Notes:
  - examples show fields such as browser name and user-agent string

## Pagination
- No cursor/next-page style pagination was documented.
- The reviewed list/search-style routes instead use explicit limits:
  - `/screenshot/list`: `limit` up to `100`
  - `/screenshot/search`: `limit` default `50`, max `100`

## Important usage notes
- The human documentation is newer than the downloadable Swagger file in this session. The HTML docs are version `1.31`, while the Swagger file advertises version `1.17.0` and does not include the current crawl routes. I treated the live docs page as authoritative where they differed.
- The docs are not purely REST-shaped in the modern sense; many mutation-like actions (`share`, `delete`, `host`) are exposed as query-driven GET routes.
- The simple API is optimized for one-call image retrieval, but the docs explicitly say it is slower than the complete API and relies on redirect-following while the capture is still processing.
- Several advanced features are limited to paid screenshots or private instances, including custom referers, POST data, cookies, private-instance priority, and some hosting/customization features.
- Thumbnail generation is free after a screenshot exists; the docs explicitly say you can request multiple thumbnails of the same screenshot at no extra cost.

## Verification notes
This file was manually rebuilt from Browshot's official API documentation page and its linked official Swagger file using browser inspection, replacing the earlier generated placeholder.
