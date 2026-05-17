# Wiktionary

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `wiktionary`
- Docs used manually:
  - `https://en.wiktionary.org/w/api.php?action=help`
- Confirmed API base URL: `https://en.wiktionary.org/w/api.php`
- Request methods confirmed on the official help page: `GET`, `POST`
- Authentication model: public read access is available for many actions; no provider-specific API key flow is documented on the reviewed help page
- Manually confirmed route count: `1`

## Authentication
From the reviewed official MediaWiki Action API help page for Wiktionary:
- no Wiktionary-specific API key is documented
- GET is preferred for most requests
- POST is supported and should be used when URLs would become too long or when a module requires POST
- sensitive values such as passwords should be sent in the POST body when relevant to the chosen action

## Canonical endpoint
1. `GET|POST /w/api.php`
   - Single MediaWiki Action API entrypoint for Wiktionary.
   - Operations are selected through the `action` parameter.
   - Output format is selected through the shared `format` parameter.

## Shared request conventions
- The help page explicitly describes itself as an auto-generated `MediaWiki Action API` documentation page.
- `action` should be sent as part of the request URL.
- Parameters may be supplied in the query string or in the POST body.
- Input should be NFC-normalized UTF-8.
- Multivalue parameters normally use pipe-separated values such as `value1|value2`.
- The official sandbox for trying requests is `Special:ApiSandbox` on Wiktionary.

## Limits and rate-related notes
From the reviewed official help page:
- most modules can accept up to `50` inputs in multivalue parameters
- most modules can return up to `500` results per query
- slow queries are limited to `50` results
- users with the `apihighlimits` right can use up to `500` inputs and `5000` results
- slow queries with `apihighlimits` are limited to `500` results

## Error and response notes
- The help page says erroneous requests include an HTTP header named `MediaWiki-API-Error`.
- The header value and the returned API error code are set to the same value.
- The reviewed help page describes the interface as mature, stable, and actively supported.
- Response representation is controlled by the shared `format` parameter rather than by distinct resource URLs.

## Important usage notes
- Wiktionary is a single-endpoint module-based API, not a path-per-resource REST API.
- fireROUTE adapters should preserve the `action=...` request model instead of inventing synthetic dictionary resource paths.
- The reviewed official page documents a very large action catalog; this file intentionally counts only the single canonical entrypoint that those actions share.

## fireROUTE normalization notes
- Normalize this provider as one canonical route: `/w/api.php`.
- Treat `action` as the primary operation selector.
- Treat `format` as the primary output-format selector.
- Preserve both GET and POST support in adapters.

## Verification notes
This file was manually rebuilt from the current official Wiktionary `action=help` page using browser inspection of the live first-party help content.
