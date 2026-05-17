# ApiFlash

## Provider metadata
- Category: `Development`
- Provider slug: `apiflash`
- Docs used manually:
  - `https://apiflash.com/documentation`
- Confirmed REST API base URL: `https://api.apiflash.com`
- Primary media types: image binary by default, JSON when `response_type=json`
- Authentication: access key
- Manually confirmed routes in this pass: `3`

## Authentication
From the official documentation page:
- every API call must include a valid access key
- GET calls pass the key as query parameter `access_key`
- POST calls pass the key as form-data field `access_key`

## Common request/response conventions
- Base URL: `https://api.apiflash.com`
- main screenshot endpoint path: `/v1/urltoimage`
- screenshot capture supports both `GET` and `POST`
- GET sends parameters in the query string
- POST sends parameters as form data
- by default the API returns raw screenshot bytes and includes the corresponding `Content-Type` and `Content-Length` headers
- when `response_type=json`, the API returns a JSON document with links to the generated screenshot

## Manually confirmed endpoint set

### 1) Capture a screenshot via query string
- Method: `GET`
- Path: `/v1/urltoimage`
- Full URL: `https://api.apiflash.com/v1/urltoimage`
- Purpose: capture a screenshot of a target URL
- Query parameters confirmed on the official page:
  - `access_key` - required API key
  - `url` - required fully qualified target URL including `http://` or `https://`
  - `format` - `jpeg`, `png`, or `webp`
  - `width` - viewport width in pixels, default `1920`
  - `height` - viewport height in pixels, default `1080`, ignored when `full_page=true`
  - `fresh` - force a new capture instead of reusing cache
  - `full_page` - capture the entire page
  - `quality` - integer `0` to `100` for `jpeg`/`webp`
  - `delay` - seconds to wait after page load, `0` to `10`
  - `scroll_page` - scroll through the page before capture
  - `ttl` - cache lifetime in seconds, `0` to `2592000` (`30` days), default `86400`
  - `thumbnail_width` - generate a thumbnail while preserving aspect ratio
  - `crop` - crop rectangle as `left,top,width,height`
  - `no_cookie_banners` - suppress cookie banners/popups
  - `no_ads` - suppress common ads
  - `no_tracking` - block common tracking requests
  - `scale_factor` - `1` or `2`
  - `element` - CSS selector for element-only capture
  - `element_overlap` - include overlapping elements for `element` captures
  - `user_agent` - custom User-Agent string
  - `extract_html` - include extracted HTML in JSON response mode
  - `extract_text` - include extracted text in JSON response mode
  - `transparent` - transparent PNG capture mode
  - `wait_for` - CSS selector to wait for before capture, with up to `15` seconds documented waiting time
  - `wait_until` - one of `dom_loaded`, `page_loaded`, `network_idle`
  - `fail_on_status` - comma-separated or range-based HTTP status list that should fail the capture
  - `accept_language` - custom `Accept-Language`
  - `css` - injected CSS string
  - `cookies` - semicolon-separated cookie list
  - `proxy` - proxy address in `address:port` or `user:password@address:port`
  - `latitude` - emulated geolocation latitude
  - `longitude` - emulated geolocation longitude
  - `accuracy` - emulated geolocation accuracy in meters, default `0`
  - `js` - injected JavaScript
  - `headers` - semicolon-separated custom header list
  - `time_zone` - IANA timezone/database name such as `Europe/Paris`
  - `ip_location` - ISO alpha-2 country code; docs say this is enterprise-only
  - `s3_access_key_id` - AWS S3 upload access key
  - `s3_secret_key` - AWS S3 upload secret key
  - `s3_bucket` - target S3 bucket name
- Response behavior confirmed on the official page:
  - default response is screenshot image data
  - if `response_type=json`, response becomes a JSON document with screenshot links
- Important usage notes from the official page:
  - repeated requests with identical parameters can reuse cached screenshots and do not consume monthly quota while the cached copy remains valid
  - the docs recommend `wait_for` or `wait_until` over blind `delay` when possible

### 2) Capture a screenshot via form-data POST
- Method: `POST`
- Path: `/v1/urltoimage`
- Full URL: `https://api.apiflash.com/v1/urltoimage`
- Purpose: same screenshot capture operation as the GET route, but with parameters sent as form data
- Request body/form-data fields confirmed on the official page:
  - `access_key`
  - `url`
  - the same capture parameters documented for the GET variant
- Response behavior confirmed on the official page:
  - default response is screenshot image data
  - `response_type=json` switches the response to JSON metadata/links
- Important usage notes from the official page:
  - the docs present GET and POST as equivalent access methods to the same API
  - POST is useful when long parameter sets would be awkward in the query string

### 3) Read quota information
- Method: `GET`
- Path: `/v1/urltoimage/quota`
- Full URL: `https://api.apiflash.com/v1/urltoimage/quota`
- Purpose: retrieve quota information for the current access key
- Query parameters confirmed on the official page:
  - `access_key` - required API key
- Response fields explicitly shown in the official JSON example:
  - `limit`
  - `remaining`
  - `reset`
- Important usage notes from the official page:
  - the docs also expose quota state through normal successful screenshot responses using headers `X-Quota-Limit`, `X-Quota-Remaining`, and `X-Quota-Reset`

## Pagination
- none documented for the reviewed routes

## Rate limits
From the official `Rate limits` section:
- leaky-bucket algorithm
- sustained processing rate: `20 requests per second`
- burst size: `400 requests`
- when traffic exceeds the allowed burst, extra requests are terminated with HTTP `429`
- identical failing screenshot attempts with the exact same parameters are additionally rate-limited to `5 requests per hour`

## Quota notes
From the official `Quota` section:
- successful responses include:
  - `X-Quota-Limit`
  - `X-Quota-Remaining`
  - `X-Quota-Reset` (UTC epoch seconds)
- the dedicated quota endpoint returns JSON with `limit`, `remaining`, and `reset`

## Error and response notes
From the official `Errors` section:
- `400 Bad Request` - invalid parameters or uncapturable target URL
- `401 Unauthorized` - revoked or invalid access key
- `402 Payment Required` - monthly screenshot quota exceeded
- `403 Forbidden` - current plan does not allow one or more requested features
- `429 Too Many Requests` - too many API calls; body includes the specific reason
- `500 Internal Server Error` - capture failed because the API could not handle the encountered situation
- when a `400` occurs, the docs say the API returns a meaningful error message
- when `response_type=json` is used, the docs say an error type and additional information may also be returned depending on the failure mode

## Important usage notes
- raw image bytes are the default success payload; clients should not assume JSON unless they explicitly request it
- cache TTL directly affects quota consumption because cached reuses do not count against the monthly allowance
- `element`, `crop`, proxying, geolocation, content extraction, S3 upload, and response-format selection are all handled through endpoint parameters rather than separate routes
- enterprise-only behavior is explicitly called out for `ip_location`

## Verification notes
This file was manually rebuilt from the official ApiFlash documentation page using browser inspection.