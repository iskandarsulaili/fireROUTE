# ScreenshotAPI.net

## Provider metadata
- Category: `Development`
- Provider slug: `screenshotapi-net`
- Docs used manually:
  - `https://screenshotapi.net/`
  - `https://screenshotapi.net/docs/getStarted`
  - `https://screenshotapi.net/docs/renderScreenshot`
  - `https://screenshotapi.net/docs/bulkScreenshots`
  - `https://screenshotapi.net/docs/scheduleScreenshots`
- Confirmed public API base URLs:
  - `https://shot.screenshotapi.net`
  - `https://api.screenshotapi.net`
- Primary media types: binary image/document/video files when outputting raw captures; JSON when `output=json` is requested or when bulk jobs return processed URLs
- Authentication model surfaced in docs: required API key via `token` query parameter
- Manually confirmed routes in this pass: `2`

## Authentication
From the official docs reviewed in this pass:
- the provider's API key is called a `token` in the request URLs
- the key is obtained from the ScreenshotAPI dashboard
- the docs say users can roll / replace the API key from the dashboard settings
- no Bearer-token or custom auth-header scheme was shown in the reviewed public route docs

## Common request/response conventions
- Public screenshot-rendering base URL: `https://shot.screenshotapi.net`
- Public bulk-processing base URL: `https://api.screenshotapi.net`
- The getting-started page says the API can be integrated through `GET` and `POST`, but the fully reviewed route examples in this pass were `GET` for screenshot rendering and `POST` for bulk JSON submission
- Shared request fields and options surfaced across the reviewed docs:
  - `token` - required API key
  - `url` - target URL to render
  - `output` - reviewed docs say `json` or raw `image`
  - `file_type` - reviewed docs explicitly mention `png`, `jpg`/`jpeg`, `webp`, and `pdf`; scrolling docs additionally expose video/animated outputs such as `gif` and `mp4`
  - `fresh` - force a fresh render instead of returning a cached screenshot
  - `custom_html` - render provided HTML instead of fetching a URL
  - `cookies` - inject cookies before rendering
  - `longitude` / `latitude` - browser geolocation override
  - `timezone` - IANA timezone override
  - `result_file_name` - custom output filename
  - `template_id` - apply a predefined cookie template from the dashboard
  - `byob` - save into the caller's configured bucket
  - `storage_service` - choose configured storage target when BYOB is enabled
  - `bucket_name` - choose the configured bucket name when BYOB is enabled
- Additional feature parameters were surfaced by the official docs navigation and examples, including route behavior for:
  - viewport/full-page capture
  - file quality and format selection
  - delay and lazy-loading controls
  - element / selector targeting
  - CSS and JavaScript injection
  - browser emulation and proxying
  - HTML/text extraction
  - blocking ads, cookie banners, chat widgets, tracking, and external resources
  - PDF rendering controls
  - scrolling screenshot capture

## Manually confirmed endpoint set

### 1) Render a screenshot or structured render result
- Method confirmed in route docs: `GET`
- Path: `/v3/screenshot`
- Full URL: `https://shot.screenshotapi.net/v3/screenshot`
- Purpose: render a target webpage or supplied HTML into a screenshot, PDF, extraction result, or scrolling capture output depending on parameters
- Required query parameters confirmed in docs:
  - `token`
  - `url` for standard page rendering, unless `custom_html` is used to override page loading
- Core query parameters explicitly documented on the reviewed route page:
  - `output`
  - `file_type`
  - `fresh`
  - `custom_html`
  - `cookies`
  - `longitude`
  - `latitude`
  - `timezone`
  - `result_file_name`
  - `template_id`
  - `byob`
  - `storage_service`
  - `bucket_name`
- Additional option families surfaced through the official render docs navigation and examples:
  - viewport / full-page sizing options
  - lazy-loading and delay options
  - element/selector screenshot options
  - CSS / JS injection options
  - proxy and browser emulation options
  - HTML/text extraction options
  - block-resource options
  - PDF output options
  - scrolling capture options such as `scrolling_screenshot=true`
- Output notes confirmed in docs:
  - `output=json` returns structured render metadata rather than a raw file
  - `output=image` returns the raw generated file in the requested format
  - reviewed docs/examples show `png`, `pdf`, and scrolling `gif` / `mp4` style outputs
- Important usage notes from the reviewed docs:
  - the getting-started page says screenshot requests can be integrated through `GET` and `POST`, but the fully reviewed public examples on the render route page were `GET`
  - when `custom_html` is supplied, it overrides `url`
  - `fresh=true` is the documented cache-bypass flag when an earlier screenshot should not be reused

### 2) Submit a bulk screenshot job as JSON
- Method: `POST`
- Path: `/v1/bulk/json`
- Full URL: `https://api.screenshotapi.net/v1/bulk/json`
- Content type shown in docs: `application/json`
- Purpose: submit up to 50 screenshot jobs in a single JSON request
- Query parameter shown in docs:
  - `token`
- JSON body shape confirmed in docs:
  - top-level `token`
  - top-level `urls` array
  - each array item can include:
    - `url`
    - `file_type`
    - `width`
    - `height`
    - `fresh`
- Bulk-job notes confirmed in docs:
  - the reviewed docs say the maximum limit is `50` URLs at once
  - the docs say the processed result returns URLs that can be used to access the generated screenshots
  - the dashboard-side bulk workflow additionally supports pause, resume, cancel, and email notification behavior

## Pagination
- The reviewed ScreenshotAPI public route docs do not document a traditional cursor/page-number pagination protocol.
- Bulk work is modeled as job submission rather than paginated listing.

## Rate limits and quotas
- The reviewed public docs in this pass did not publish numeric request-per-minute or concurrency ceilings for the public API.
- The bulk JSON docs do publish one hard limit: `50` URLs per bulk request.
- The schedule-screenshots page reviewed in this pass describes a dashboard workflow, but it did not expose a separate public API route or extra quota table.

## Error handling
- The getting-started page says the service uses informative HTTP status codes and has a dedicated Errors section.
- The reviewed public route pages in this pass did not expose a compact numeric status-code matrix in the sections successfully inspected through the browser.
- Bulk and render callers should therefore treat HTTP status plus returned body type (`json` metadata/error vs raw file output) as the main reviewed public error signals from this pass.

## Response format notes
- render requests can return raw files or JSON metadata depending on `output`
- image/document output types reviewed in the docs include `png`, `jpg`/`jpeg`, `webp`, and `pdf`
- scrolling output examples reviewed in docs include animated/video-style outputs such as `gif` and `mp4`
- bulk JSON submission returns URLs to the generated screenshot assets after processing according to the reviewed docs

## Important usage notes
- ScreenshotAPI is heavily parameter-driven: most capability is exposed through `/v3/screenshot` options rather than a large number of distinct paths
- the reviewed schedule-screenshot docs describe dashboard job management rather than a separately documented public REST route, so that feature should not be assumed to have a documented external API path from the material reviewed here
- BYOB storage depends on prior dashboard configuration of supported storage providers such as Amazon S3 (`aws`), Wasabi, or Google Cloud
- `custom_html` is useful when fireROUTE wants rendering behavior without first hosting intermediate HTML externally
- `fresh=true` should be used when cache reuse would be undesirable for monitoring or compliance workflows

## Verification notes
This file was manually rebuilt from the official ScreenshotAPI homepage and official ScreenshotAPI documentation pages using browser inspection during this pass.
