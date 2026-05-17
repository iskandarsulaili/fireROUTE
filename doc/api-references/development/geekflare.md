# GeekFlare

## Provider metadata
- Category: `Development`
- Provider slug: `geekflare`
- Docs used manually:
  - `https://geekflare.com/api/`
  - `https://docs.geekflare.com/api/intro`
  - `https://docs.geekflare.com/api/endpoint/reference`
  - `https://docs.geekflare.com/api/api-credit-mapping`
  - `https://docs.geekflare.com/api/using-proxies`
  - `https://docs.geekflare.com/api/rate-limit-exceeded`
  - `https://docs.geekflare.com/api/credit-exhausted`
  - `https://docs.geekflare.com/api/endpoint/webscraping`
  - `https://docs.geekflare.com/api/endpoint/search`
  - `https://docs.geekflare.com/api/endpoint/metascraping`
  - `https://docs.geekflare.com/api/endpoint/screenshot`
  - `https://docs.geekflare.com/api/endpoint/pdf-generator`
  - `https://docs.geekflare.com/api/endpoint/broken-link`
  - `https://docs.geekflare.com/api/endpoint/mixed-content`
  - `https://docs.geekflare.com/api/endpoint/lighthouse`
  - `https://docs.geekflare.com/api/endpoint/load-time`
  - `https://docs.geekflare.com/api/endpoint/site-status`
  - `https://docs.geekflare.com/api/endpoint/dns-records`
  - `https://docs.geekflare.com/api/endpoint/dnssec`
  - `https://docs.geekflare.com/api/endpoint/mtr`
  - `https://docs.geekflare.com/api/endpoint/ping`
  - `https://docs.geekflare.com/api/endpoint/tls-scan`
  - `https://docs.geekflare.com/api/endpoint/port-scanner`
  - `https://docs.geekflare.com/api/endpoint/url-redirect`
- Confirmed REST API base URL: `https://api.geekflare.com`
- Primary media type: `application/json`
- Authentication model surfaced in docs: request header `x-api-key: YOUR-API-KEY`
- Manually confirmed routes in this pass: `17`

## Authentication
From the official docs reviewed here:
- every confirmed endpoint requires header `x-api-key`
- request bodies are JSON and the examples send `Content-Type: application/json`
- the docs say free signup generates an API key and the interactive playground can test the endpoints

## Common request/response conventions
- Base URL: `https://api.geekflare.com`
- Protocol: HTTPS REST API
- Request body format: JSON
- Common success envelope:
  - `timestamp`
  - `apiStatus`
  - `apiCode`
  - optional `message`
  - `meta`
  - `data`
- Common auth errors from the intro page:
  - `401` with `Missing x-api-key header`
  - `401` with `Invalid x-api-key`
- Other documented global errors:
  - `402` when credits are exhausted
  - `403` for plan-restricted endpoints such as premium-only features
  - `404` for wrong endpoint or wrong request method
  - `429` when plan rate limits are exceeded
- Per-endpoint reference pages consistently list `200`, `400`, and `500` response sections
- The docs state rate limits vary by plan from `1` to `50` requests per second
- The `429` troubleshooting page documents headers `Retry-After`, `X-RateLimit-Limit-Second`, and `X-RateLimit-Remaining`

## Manually confirmed endpoint set

### AI and scraping
1. `POST /webscraping`
   - Purpose: scrape webpages into HTML, Markdown, JSON, or LLM-oriented text formats
   - Key body fields confirmed in docs: `url`, `device`, `blockAds`, `renderJS`, `proxyCountry`, `format`, `fileOutput`, `stealth`, `waitTime`, `extractionMode`, `extractionSchema`
   - Important notes:
     - `format` supports `html`, `markdown`, `json`, `markdown-llm`, `html-llm`, `text`, `text-llm`
     - `stealth` is documented as bypassing basic bot detection by removing webdriver signals and patching navigator properties
     - `extractionMode` supports `default`, `cssSchema`, and `xpathSchema`

2. `POST /search`
   - Purpose: aggregated search results for AI agents and LLM workflows
   - Key body fields confirmed in docs: `query`, `limit`, `time`, `location`, `source`, `category`, `includeDomains`, `excludeDomains`, `format`, `scrape`, `scrapeLimit`, `groundedAnswer`
   - Important notes:
     - `source` supports `web`, `news`, and `images`
     - `category` supports `general`, `code`, `pdf`, `research`, `linkedin`, and `wiki`
     - `format` supports `json`, `markdown`, and `html`
     - `groundedAnswer` invokes AI synthesis over search results

3. `POST /metascraping`
   - Purpose: extract webpage metadata
   - Key body fields confirmed in docs: `url`, `device`, `blockAds`, `renderJS`, `proxyCountry`, `format`, `fileOutput`
   - Important notes:
     - `format` supports `markdown` or `json`
     - response `data` can be inline content or a generated file URL depending on `fileOutput`

4. `POST /screenshot`
   - Purpose: capture webpage screenshots
   - Key body fields confirmed in docs: `url`, `device`, `proxyCountry`, `type`, `fullPage`, `blockAds`, `hideCookie`, `skipCaptcha`, `addTimestamp`, `pageHeight`, `viewportWidth`, `viewportHeight`, `theme`, `removeBackground`, `highlightLinks`, `delay`, `disableAnimations`, `quality`, `scaleFactor`, `captureBeyondViewport`
   - Important notes:
     - `type` supports `png`, `jpeg`, and `webp`
     - the response returns a generated screenshot URL rather than raw image bytes

5. `POST /url2pdf`
   - Purpose: convert a URL into a PDF document
   - Key body fields confirmed in docs: `url`, `device`, `proxyCountry`, `format`, `orientation`, `margin`, `scale`, `hideCookie`, `skipCaptcha`, `addTimestamp`
   - Important notes:
     - paper `format` supports `letter`, `legal`, `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6`
     - the response returns a generated PDF URL

### Website testing and monitoring
6. `POST /brokenlink`
   - Purpose: scan a page for broken links
   - Key body fields confirmed in docs: `url`, `followRedirect`, `proxyCountry`
   - Response notes: returns `summary` totals plus a `data` list of links and HTTP statuses

7. `POST /mixedcontent`
   - Purpose: detect mixed HTTP/HTTPS resources on a page
   - Key body fields confirmed in docs: `url`, `followRedirect`, `proxyCountry`
   - Response notes: `message` reports whether mixed content was found and `data` contains either discovered resources or insecure/secure groupings

8. `POST /lighthouse`
   - Purpose: run a Lighthouse audit
   - Key body fields confirmed in docs: `url`, `device`, `followRedirect`, `proxyCountry`, `parameters`
   - Response notes: returns a report URL in `data`

9. `POST /loadtime`
   - Purpose: measure page load timing and protocol/network details
   - Key body fields confirmed in docs: `url`, `followRedirect`, `proxyCountry`
   - Response notes: reviewed examples include timing breakdowns, status info, headers, network info, and protocol support details

10. `POST /up`
    - Purpose: check whether a site is reachable
    - Key body fields confirmed in docs: `url`, `followRedirect`, `proxyCountry`
    - Response notes: `message` is documented as either `Site is up` or `Unable to reach the URL.`

11. `POST /redirectcheck`
    - Purpose: return the redirection chain for a URL
    - Key body fields confirmed in docs: `url`, `proxyCountry`
    - Response notes: returns redirect hops with status codes and response headers

### DNS and network diagnostics
12. `POST /dnsrecord`
    - Purpose: retrieve DNS records for a domain
    - Key body fields confirmed in docs: `url`, `types`
    - Important notes:
      - `types` supports `A`, `AAAA`, `CNAME`, `MX`, `CAA`, `NS`, `SOA`, `SRV`, `TXT`
      - omitting `types` returns all supported record families according to the docs

13. `POST /dnssec`
    - Purpose: test whether DNSSEC is enabled
    - Key body field confirmed in docs: `url`
    - Response notes: example data includes `isEnabled`, `dnskey`, and `rrsig`

14. `POST /mtr`
    - Purpose: perform an MTR traceroute-style network test
    - Key body fields confirmed in docs: `url`, `followRedirect`, `proxyCountry`
    - Response notes: returns per-hop diagnostics including host, ASN, packet loss, and latency stats

15. `POST /ping`
    - Purpose: perform an ICMP-style reachability test
    - Key body field confirmed in docs: `url`
    - Response notes: example data includes packet counts, loss, latency, min/max/avg/stdDev, and resolved IP

### Security
16. `POST /tlsscan`
    - Purpose: inspect supported TLS protocol versions and certificate details
    - Key body field confirmed in docs: `url`
    - Response notes: example data includes protocol booleans and certificate issuer/expiry fields

17. `POST /openport`
    - Purpose: scan for open TCP ports
    - Key body fields confirmed in docs: `url`, `topPorts`, `portRanges`
    - Important notes:
      - `topPorts` supports `50`, `100`, `500`, `1000`, or `5000`
      - `portRanges` accepts strings such as `80,443,1000-1010`

## Proxy support
From the official `Using Proxies` page reviewed here:
- `proxyCountry` is supported on these confirmed endpoints:
  - `/webscraping`
  - `/metascraping`
  - `/brokenlink`
  - `/lighthouse`
  - `/mixedcontent`
  - `/screenshot`
  - `/loadtime`
  - `/redirectcheck`
  - `/url2pdf`
- the docs explicitly say proxy use is premium-only and consumes additional credits
- reviewed examples list country codes such as `US`, `GB`, `DE`, and `IN`

## Pagination
- no reviewed Geekflare endpoint documents cursor, page, offset, or token-based pagination
- the API surface reviewed here is request/response oriented rather than collection listing oriented
- the Search API uses a request-side `limit` field, but the reviewed docs do not describe paginated continuation tokens or page numbers

## Credit model and rate limits
From the official credit and troubleshooting pages reviewed here:
- plan-level rate limits range from `1` to `50` requests per second
- `429` responses include `Retry-After`, `X-RateLimit-Limit-Second`, and `X-RateLimit-Remaining`
- the official credit table documents per-successful-request costs such as:
  - DNS Lookup: `1`
  - Site Load Time: `1`
  - URL Redirection: `1`
  - TLS Scan: `1`
  - Web Scraping (Lite): `1`
  - Web Scraping (JS Rendering): `2`
  - Port Scanner: `2`
  - Meta Scraping: `2`
  - Search: `2`
  - Search with Scrape: `4`
  - Search with Grounded Answer: `5`
  - Proxy add-on: `5`
  - Screenshot: `5`
  - PDF Generator: `5`
  - Broken Link Checker: `5`
  - Lighthouse Audit: `10`
- the docs say infrastructure-caused `5xx` failures are generally not billed
- the docs also say most `4xx` input/auth failures generally do not consume credits

## Error and response notes
- Intro page examples document:
  - `401` missing key
  - `401` invalid key
  - `403` premium-plan restriction
  - `404` wrong endpoint or wrong request method
- Credit troubleshooting page documents `402 Payment Required` when the account has zero balance
- Rate-limit troubleshooting page documents `429 Too Many Requests` and recommends respecting `Retry-After` and using exponential backoff with jitter
- endpoint reference pages consistently expose `200`, `400`, and `500` response tabs
- many endpoints return either structured JSON objects/arrays or generated asset/report URLs in the `data` field

## Important usage notes
- Geekflare's old `apidocs.geekflare.com` reference is no longer the right source of truth; the live first-party docs are under `docs.geekflare.com`
- the current official docs expose a compact but complete route inventory for Geekflare's direct API product
- several features are heavily parameter-driven rather than route-heavy, especially web scraping, screenshot, search, and PDF generation
- the official docs separate endpoint reference pages from capability notes like proxy support, advanced Lighthouse usage, and credit accounting
- Search, Web Scraping, and Meta Scraping are especially relevant for LLM/agent workflows because the docs explicitly describe structured outputs and LLM-oriented formats

## Verification notes
This file was manually rebuilt from the current official Geekflare product and docs pages using browser/CDP inspection.