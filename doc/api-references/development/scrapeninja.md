# ScrapeNinja

## Provider metadata
- Category: `Development`
- Provider slug: `scrapeninja`
- Docs used manually:
  - `https://scrapeninja.net/`
  - `https://scrapeninja.net/docs/`
  - `https://scrapeninja.net/docs/api-reference/introduction`
  - `https://scrapeninja.net/docs/api-reference/v2-scrape-js-scraping-with-js-rendering-new-engine`
  - `https://scrapeninja.net/docs/api-reference/scrape-js-scraping-with-js-rendering`
  - `https://scrapeninja.net/docs/api-reference/scrape-non-js-scraping`
- Confirmed API base URL used throughout the reviewed route pages: `https://scrapeninja.apiroad.net`
- Primary media type: JSON
- Authentication: marketplace API key header
- Manually confirmed routes in this pass: `3`

## Authentication
From the official docs introduction and route pages:
- the docs say ScrapeNinja is available through both RapidAPI and APIRoad
- the route pages label auth as `X-RapidAPI-Key`
- the introduction page explicitly says APIRoad users should replace `X-RapidAPI-Key` with `X-Apiroad-Key`
- the reviewed docs do not show OAuth, bearer tokens, or cookie/session auth for the API itself
- `POST /v2/scrape-js` is explicitly marked as available only via APIRoad even though the page still labels the auth block as `X-RapidAPI-Key`; this discrepancy is documented below instead of guessed away

## Common request/response conventions
- Base URL: `https://scrapeninja.apiroad.net`
- All manually reviewed endpoints are `POST` JSON endpoints
- Request bodies are JSON and the official cURL samples send:
  - `Content-Type: application/json`
  - `Accept: application/json`
- Successful responses on the reviewed route pages are `200 OK` JSON objects
- The shared success schema shown on the route pages contains:
  - `info` - object
  - `body` - string containing rendered or fetched HTML
- The docs repeatedly describe proxy rotation, retries, JS rendering, and custom extractor execution as first-class features rather than separate resources

## Manually confirmed endpoint set

### 1) Scrape with the newer JS-rendering engine
- Method: `POST`
- Path: `/v2/scrape-js`
- Full URL: `https://scrapeninja.apiroad.net/v2/scrape-js`
- Purpose: launch the newer real-Chrome rendering engine for difficult anti-bot / JS-heavy targets
- Route-page note from the official docs:
  - this route is marked `Only available via APIRoad`
- Request body fields confirmed on the official route page:
  - `url` - required target URL
  - `waitForSelector` - CSS selector to wait for before considering the page loaded
  - `postWaitTime` - extra seconds to wait after load; docs say `1` to `12`
  - `headers` - array of custom request-header strings
  - `retryNum` - number of attempts
  - `geo` - proxy geography; official default shown as `us`
  - `proxy` - premium or custom proxy URL overriding `geo`
  - `timeout` - timeout per attempt in seconds; official default shown as `16`
  - `textNotExpected` - retry-trigger strings
  - `statusNotExpected` - retry-trigger status list; official default shown as `403,502`
  - `blockImages` - boolean
  - `blockMedia` - boolean
  - `screenshot` - boolean
  - `extractor` - custom JS extractor function source
- Confirmed response schema details:
  - `info` object
  - `body` string containing rendered HTML
- Important usage notes from the official page:
  - the docs specifically call out Cloudflare, Datadome, Kasada, and PerimeterX-style protection in the endpoint description
  - the route page shows the same marketplace-header label as other routes even though the intro page says APIRoad users should switch to `X-Apiroad-Key`

### 2) Scrape with the classic JS-rendering engine
- Method: `POST`
- Path: `/scrape-js`
- Full URL: `https://scrapeninja.apiroad.net/scrape-js`
- Purpose: render JavaScript in a real Chrome browser when the non-JS engine is insufficient
- Request body fields confirmed on the official route page:
  - `url` - required target URL
  - `waitForSelector`
  - `postWaitTime`
  - `dumpIframe` - iframe `name` value to dump
  - `waitForSelectorIframe` - selector to wait for inside the iframe
  - `extractorTargetIframe` - run the extractor against iframe HTML when iframe dumping is enabled
  - `headers`
  - `retryNum`
  - `geo` - default `us`
  - `proxy`
  - `timeout` - default `16`
  - `textNotExpected`
  - `statusNotExpected` - default `403,502`
  - `blockImages`
  - `blockMedia`
  - `screenshot`
  - `catchAjaxHeadersUrlMask` - capture matching XHR traffic and expose it under `info.catchedAjax`
  - `viewport` - object with fields shown in the official example (`width`, `height`, `deviceScaleFactor`, `hasTouch`, `isMobile`, `isLandscape`)
  - `extractor`
- Confirmed response schema details:
  - `info` object
  - `body` string
- Important usage notes from the official page:
  - the iframe-specific parameters only apply when `dumpIframe` is used
  - `catchAjaxHeadersUrlMask` is documented as a way to expose selected XHR response details back in the API response

### 3) Scrape without JavaScript rendering
- Method: `POST`
- Path: `/scrape`
- Full URL: `https://scrapeninja.apiroad.net/scrape`
- Purpose: use the high-performance non-JS engine with Chrome TLS fingerprinting but without real browser overhead
- Request body fields confirmed on the official route page:
  - `url` - required target URL
  - `headers`
  - `retryNum`
  - `geo` - default `us`
  - `proxy`
  - `followRedirects` - integer flag; official default shown as `1`
  - `timeout` - default `10`
  - `textNotExpected`
  - `statusNotExpected` - default `403,502`
  - `extractor`
- Confirmed response schema details:
  - `info` object
  - `body` string containing the fetched HTML
- Important usage notes from the official page:
  - the overview page frames this engine as the fast path for sites that do not require full JS execution
  - retries are driven by timeout, response status, and text-match rules rather than separate retry resources

## Pagination
- none documented on the reviewed official pages
- the reviewed routes return one scrape result per request rather than paginated collections

## Rate limits
- the reviewed official docs pages did not publish numeric API-wide rate limits, quota headers, or request-per-minute tables
- proxy-pool and subscription language appears on the marketing and overview pages, but the reviewed API reference did not expose a formal rate-limit contract

## Error and response notes
- the reviewed route pages only surfaced explicit `200 OK` success schemas in the rendered reference
- the request bodies expose retry controls (`retryNum`, `statusNotExpected`, `textNotExpected`) but the reviewed public route pages did not publish a dedicated error-envelope schema
- successful responses are JSON objects with at least:
  - `info`
  - `body`

## Important usage notes
- the API is fundamentally parameter-driven: most behavior changes are controlled by JSON body fields rather than separate route families
- the official intro page says APIRoad users should rename the auth header to `X-Apiroad-Key`
- the newer `/v2/scrape-js` route is marketed as the stronger anti-bot-capable engine and is explicitly limited to APIRoad in the reviewed docs
- the extractor field accepts raw JavaScript function source; the docs direct users to the official Cheerio sandbox to write and test extractor logic

## Verification notes
This file was manually rebuilt from ScrapeNinja's official homepage and official docs pages using browser inspection.