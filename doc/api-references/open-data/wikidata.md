# Wikidata

## Provider metadata
- Category: `Open Data`
- Provider slug: `wikidata`
- Official docs/pages used:
  - `https://www.wikidata.org/w/api.php?action=help` (auto-generated MediaWiki Action API help for Wikidata)
  - linked official references from that page, including `Special:ApiSandbox` and MediaWiki Action API documentation
- Current public API base URL: `https://www.wikidata.org/w/api.php`
- Auth model: public read access is available without authentication for many actions; the help page documents a general Action API interface rather than a Wikidata-specific API key flow
- Request methods: GET and POST are both officially supported
- Response format model: controlled by the main `format` parameter of the Action API
- Rate / limit notes from the help page:
  - most modules can accept up to `50` inputs in multivalue parameters
  - most modules can return up to `500` results per query (`50` for slow queries)
  - users with `apihighlimits` can use up to `500` inputs and `5000` results (`500` for slow queries)
- Manually confirmed route count: `1`

## Canonical endpoint
1. `GET|POST /w/api.php`
   - Single Action API entrypoint.
   - Operations are selected with the `action` query parameter.
   - The help page describes this as the main module for specifying the action to perform, the response format, and options shared by all modules.

## Core parameters
### Shared main-module parameters
- `action` - required action/module selector; the help page lists a large catalog of supported module names.
- `format` - shared response-format selector.

### Request-shape notes from the official help page
- GET is preferred for most requests because it can be cached and routed to faster replica servers.
- POST is supported and should be used when URL length would exceed common limits or when a module requires POST.
- Parameters may be supplied in the query string or POST body; sensitive values such as passwords should be sent in the body.

## Error and response notes
- The help page says erroneous requests include an HTTP header named `MediaWiki-API-Error`; the header value and the API error code are set to the same value.
- The interface is described as a mature and stable API that is actively supported and improved.
- The official sandbox for testing is `Special:ApiSandbox`.

## Data and parameter notes
- Input should be NFC-normalized UTF-8.
- Multivalue parameters normally use pipe-separated values, e.g. `param=value1|value2`.
- If a value itself contains a pipe, the docs say to use the unit separator convention described on the help page.
- The help page also documents generic parameter types such as boolean, expiry, and timestamp.

## Usage notes
- This provider is a **single-endpoint module-based API**, not a path-per-resource REST API.
- Individual Wikidata capabilities are exposed through `action=...` modules rather than distinct URLs.
- For fireROUTE, public read adapters should preserve the `action` and `format` model rather than trying to invent resource-style paths.

## fireROUTE normalization notes
- Normalize Wikidata as one canonical route: `/w/api.php`.
- Treat `action` as the primary operation selector and `format` as the primary representation selector.
- Preserve GET/POST support in adapters.
