# JSON 2 JSONP

## Provider metadata
- Category: `Development`
- Provider slug: `json-2-jsonp`
- Docs used manually:
  - `https://json2jsonp.com/`
- Confirmed API base URL: `https://json2jsonp.com`
- Primary response/content type confirmed from the official page: `application/javascript`
- Authentication model: none documented or required on the reviewed official page
- Manually confirmed routes in this pass: `1`

## Authentication
- The official homepage documents the service as a public utility endpoint.
- No API key, OAuth flow, session cookie, or signed-request scheme is described on the reviewed official page.

## Common request/response conventions
- Base URL: `https://json2jsonp.com`
- The service is parameter-driven rather than resource-oriented.
- The official page says requests are served as content type `application/javascript`.
- The official page also says responses are cached for `4` hours.
- The upstream JSON URL should be URL-encoded before being passed through the service.

## Manually confirmed endpoint set

### 1) Convert a JSON URL into a JSONP response
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://json2jsonp.com/?url={ENCODED_JSON_URL}&callback={CALLBACK_NAME}`
- Official example:
  - `https://json2jsonp.com/?url=http://domain.com/some/json&callback=cbfunc`
- JavaScript-safe example from the official page:
  - `https://json2jsonp.com/?url='+encodeURIComponent('JSON_URL_HERE')+'&callback=CB_FUNCTION_HERE`
- Confirmed query parameters:
  - `url` - required; the upstream JSON URL to fetch and wrap as JSONP
  - `callback` - required; the JavaScript callback function name to invoke
- Confirmed request body: none
- Confirmed success behavior:
  - response content type is `application/javascript`
  - the service wraps the fetched JSON payload in the specified callback function
- Important usage note:
  - the official page explicitly recommends URL-encoding the `url` parameter before sending it

## Pagination
- None documented on the reviewed official page.

## Rate limits
- No numeric rate-limit policy is published on the reviewed official page.
- The only operational limit-like note directly confirmed is the `4`-hour cache behavior.

## Error handling
- The reviewed official homepage does not publish a structured HTTP status-code table or error-envelope schema.
- Because the page only documents the success URL pattern, this file does not infer undocumented error formats.

## Response format notes
- Response type is `application/javascript`.
- The service is intended for JSONP output, not raw JSON passthrough.
- The callback name is user-supplied through the `callback` query parameter.

## Important usage notes
- This is a very small utility API: one public `GET /` route with required query parameters.
- The service is intended specifically for cross-domain JSONP-style browser use.
- The official documentation is a single landing page, not a multi-page OpenAPI-style reference.

## Verification notes
This file was manually rebuilt from the current official `json2jsonp.com` homepage, replacing the earlier generated placeholder summary.