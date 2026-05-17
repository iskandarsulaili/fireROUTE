# Wikipedia

## Provider metadata
- Category: `Open Data`
- Provider slug: `wikipedia`
- Official docs/pages used:
  - `https://en.wikipedia.org/w/api.php?action=help`
  - `https://www.mediawiki.org/wiki/API:REST_API`
  - `https://www.mediawiki.org/wiki/API:REST_API/Get_started`
  - `https://www.mediawiki.org/wiki/API:REST_API/Status_codes`
- Canonical public API base patterns:
  - Action API: `https://{project}.wikipedia.org/w/api.php`
  - REST API: `https://{project}.wikipedia.org/w/rest.php/v1`
- Auth model:
  - many read operations are publicly accessible without authentication
  - the reviewed REST docs link to official OAuth guidance for authenticated operations
- Response format notes:
  - Action API response format is chosen with the shared `format` parameter
  - REST API endpoints return `JSON` or `HTML` depending on endpoint/content negotiation
- Manually confirmed route count: `2`

## Canonical route families
1. `GET|POST /w/api.php`
   - The Action API entrypoint.
   - The official help page says clients select operations with the `action` parameter and shared response formatting with `format`.
2. `GET /w/rest.php/v1/{resource}`
   - The REST API family documented on MediaWiki.
   - The official quick-start page gives project-relative structure `[project url]/[script path]/rest.php/v[version number]/` and shows the sample search request `GET /w/rest.php/v1/search/page?q=earth&limit=1`.

## Action API notes
### Shared parameters documented on the help page
- `action` - selects the action/module to perform
- `format` - response format selector

### Request-shape rules
- GET and POST are both officially supported.
- The docs recommend GET when possible for cacheability and routing efficiency.
- POST body submission is supported for long/sensitive requests.
- Input should be NFC-normalized UTF-8.
- Multivalue parameters normally use pipe-separated values.

### Limits from the reviewed help page
- most modules accept up to `50` inputs in multivalue parameters
- most modules return up to `500` results per query
- slow queries are limited to `50` results
- users with `apihighlimits` can use up to `500` inputs and `5,000` results (`500` for slow queries)

### Error notes
- erroneous requests include an HTTP header named `MediaWiki-API-Error`
- the header value matches the API error code

## REST API notes
### URL structure from the official quick-start page
- `[project url]/[script path]/rest.php/v[version number]/`
- official example: `https://en.wikipedia.org/w/rest.php/v1/page/Main_Page/history`

### What the reviewed REST docs say the API covers
- searching wiki pages
- getting wiki pages
- transforming wiki pages
- accessing page history

### Response and error notes
- the official status-code page documents:
  - `200` resource found or updated
  - `201` resource created
  - `400` invalid or missing parameter
  - `403` permission denied
  - `404` route not found
  - `412` invalid conditional request
  - `415` unsupported content type
  - `500` server error
- reviewed error body shape:
```json
{
  "messageTranslations": {
    "en": "The specified title (...) does not exist"
  },
  "httpCode": 404,
  "httpReason": "Not Found"
}
```

## Pagination and query notes
- The reviewed Action API help page documents result caps but not one single provider-wide pagination parameter because pagination is module-specific.
- The reviewed REST quick-start page shows endpoint-specific query parameters such as `q` and `limit` on the page-search example.
- Conditional-request support is documented separately in the official REST quick-start guidance.

## Important usage notes
- Wikipedia is project-relative: adapters should preserve the target wiki host such as `en.wikipedia.org` rather than assuming one universal content host.
- The Action API is a single-entrypoint module system; fireROUTE should not split every module into synthetic resource paths.
- The REST API is a separate path family with a cleaner resource-style URL structure and endpoint-specific semantics.
- The reviewed public docs did not publish one global numeric rate limit for all Wikipedia API traffic; limits and usage expectations are instead expressed through result caps, caching guidance, and linked policy pages.

## fireROUTE normalization notes
- Treat Wikipedia as two canonical public API surfaces: Action API and REST API.
- Preserve native query parameter names such as `action`, `format`, `q`, and `limit`.
- Keep the project host configurable so adapters can target the intended Wikipedia language/project domain.
