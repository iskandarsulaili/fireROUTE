# CORS Proxy

## Provider metadata
- Category: `Development`
- Provider slug: `cors-proxy`
- Docs used manually:
  - `https://github.com/burhanuday/cors-proxy`
  - official source file `https://github.com/burhanuday/cors-proxy/blob/master/README.md`
  - official source file `https://github.com/burhanuday/cors-proxy/blob/master/index.js`
- Confirmed API base URL: `https://course-search-proxy.herokuapp.com`
- Primary media types: passthrough text/HTML/JSON on success, depending on the fetched target; implementation-defined error body on failure
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
- The reviewed README and source code do not require an API key, token, or session cookie.
- CORS is intentionally enabled for all callers.

## Common request/response conventions
- Base URL from the official README: `https://course-search-proxy.herokuapp.com`
- The reviewed implementation exposes one route: `POST /`
- Request bodies can be sent as JSON or URL-encoded form data because the app enables both `express.json()` and `express.urlencoded({ extended: true })`
- The implementation uses `cloudscraper.get(url)` under the hood, so the proxied upstream method is always `GET`
- The proxy sets `Access-Control-Allow-Origin: *` and also installs the `cors()` middleware globally

## Manually confirmed endpoint set

### 1) Proxy a GET request through the CORS helper
- Method: `POST`
- Path: `/`
- Full URL: `https://course-search-proxy.herokuapp.com/`
- Purpose: accept a target URL in the request body, fetch it server-side with `cloudscraper`, and return the upstream response body so browser clients can avoid direct CORS restrictions
- Body parameters confirmed in the official README/source:
  - `urlToGet` - required target URL to request with `GET`
- Request notes:
  - JSON bodies are accepted
  - URL-encoded form bodies are also accepted
- Response notes:
  - successful responses send the raw `cloudscraper.get()` response body with no documented envelope
  - response content type therefore depends on the proxied target and may be HTML, JSON, plain text, or other text payloads
  - failures are passed to `res.send(error)` without a documented normalized schema

## Pagination
- None. The proxy exposes a single request/response operation and does not define cursors, pages, or collection traversal.

## Rate limits
- No numeric public rate limit is documented in the reviewed README or source.
- I did not infer any quota that the official materials did not state.

## Error handling
- The implementation does not normalize errors into a typed API schema.
- If `cloudscraper.get()` rejects, the handler sends the error object/body directly with `res.send(error)`.
- The reviewed source does not document provider-specific error codes, retry windows, or quota headers.

## Response format notes
- There is no single canonical response schema.
- Success bodies are passthrough content from the requested upstream URL.
- Error bodies are implementation-defined and come directly from the `cloudscraper` failure object/value.

## Important usage notes
- This provider is a very small single-route helper, not a broad REST surface.
- It only proxies upstream `GET` requests; callers cannot choose another upstream HTTP method through the reviewed implementation.
- The target URL is body-driven via `urlToGet`, not expressed as a path or query parameter.
- Because the official hosted base URL is a Heroku app, fireROUTE should expect operational fragility even though the route contract itself is simple.

## Verification notes
This file was manually rebuilt from the official GitHub repository README and application source using browser-based source inspection.