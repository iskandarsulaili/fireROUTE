# PostalCodes

## Provider metadata
- Category: `Geocoding`
- Provider slug: `postalcodes`
- Official docs used manually:
  - `https://postalcodes.info/api`
  - `https://postalcodes.info/openapi.json`
  - `https://postalcodes.info/postal-codes/portugal/code/1000001`
- Public base URL documented by provider: `https://postalcodes.info`
- Transport: `HTTPS`
- Auth model: no API key is documented; export downloads instead use a same-origin token flow (`/download-token.php` -> `/download.php`)
- Response formats documented/observed: `HTML`, `JSON`, `CSV`, `XLSX`, `OpenAPI JSON`

## Product and access notes
- The official API page presents PostalCodes.info as a single-host model where canonical HTML pages, JSON search, and country exports all stay on `postalcodes.info`.
- The same page says public access is intentionally split by job:
  - `/search` for lightweight live lookup/autocomplete
  - country exports for bulk validation/import workflows
  - canonical HTML pages for human review and audit trails
- The official API page explicitly says postal codes must be treated as strings because many countries use leading zeroes, spaces, or mixed alphanumeric formats.
- The official page also says a machine-readable OpenAPI document is available at `/openapi.json`.

## Confirmed API surface
The inspected docs and live examples confirm these `7` GET routes:
1. `GET /api`
2. `GET /search`
3. `GET /ajax-preview`
4. `GET /download-token.php`
5. `GET /download.php`
6. `GET /postal-codes/{country}`
7. `GET /postal-codes/{country}/code/{postal_code}`

## 1) Developer portal landing page
- Method: `GET`
- Path: `/api`
- Full URL: `https://postalcodes.info/api`
- Purpose: human-readable API overview, examples, field notes, and links to the OpenAPI spec

Important official notes from this page:
- canonical production host is `https://postalcodes.info`
- live search is intended for autocomplete/suggestions
- exports are recommended for large imports and local validation
- canonical HTML pages are recommended for human QA and SEO/crawlable references

## 2) Search suggestions
- Method: `GET`
- Path: `/search`
- Full URL pattern: `https://postalcodes.info/search?q={query}&country={ISO2}&region={text}`
- Purpose: return lightweight search suggestions used by the public lookup UI

Documented query parameters from the official OpenAPI spec:
- `q` - required search term; minimum `2` characters in the spec
- `country` - optional ISO 3166-1 alpha-2 country filter
- `region` - optional region text filter

Observed behavior:
- the docs page uses `curl "https://postalcodes.info/search?q=4%20Águas&country=PT"`
- a live call with `q=madrid&country=ES` returned JSON suggestions with fields such as `type`, `text`, `sub`, and `url`
- a live call with a short query (`q=a&country=ES`) returned HTTP `200` with an empty JSON array rather than an HTTP validation error

## 3) Country preview records
- Method: `GET`
- Path: `/ajax-preview`
- Full URL pattern: `https://postalcodes.info/ajax-preview?country={country-slug}`
- Purpose: preview up to `25,000` records for one country before downloading the full dataset

Documented query parameters from the official OpenAPI spec:
- `country` - required country slug such as `spain`, `united-states`, or `india`

Important official note:
- the OpenAPI description says large-import workflows should use country downloads instead of repeated live preview requests

## 4) Download-token minting
- Method: `GET`
- Path: `/download-token.php`
- Full URL: `https://postalcodes.info/download-token.php`
- Purpose: mint a same-origin token for the export flow

Documented required headers from the official OpenAPI spec:
- `X-Requested-With: XMLHttpRequest`
- `Referer` - same-origin referer

Observed behavior from live manual checks:
- calling `/download-token.php` without the `X-Requested-With` header returned HTTP `403` with `{"error":"forbidden"}`
- calling it from the same origin with `X-Requested-With: XMLHttpRequest` returned HTTP `200` JSON like `{"token":"..."}`

## 5) Country dataset download
- Method: `GET`
- Path: `/download.php`
- Full URL pattern: `https://postalcodes.info/download.php?country={iso2}&format={csv|xlsx|json}&t={download_token}`
- Purpose: download one country dataset after minting a token

Documented query parameters from the official OpenAPI spec:
- `country` - required ISO 3166-1 alpha-2 country code
- `format` - required export format; `csv`, `xlsx`, or `json`
- `t` - required token from `/download-token.php`

Observed behavior from live manual checks:
- using a valid minted token returned HTTP `200` with `application/json; charset=utf-8` and full country records for `format=json`
- using an invalid token returned HTTP `200` with an HTML error page body: `Error: Invalid or expired download token. Please refresh the page and try again.`

Important official note:
- the docs say downloaded postal codes should be stored as text, not integers

## 6) Canonical country page
- Method: `GET`
- Path: `/postal-codes/{country}`
- Full URL pattern: `https://postalcodes.info/postal-codes/{country-slug}`
- Purpose: open a human-readable country reference page with lookup, hierarchy, and export entry points

Documented path parameter:
- `country` - required country slug such as `spain`, `united-states`, or `india`

Official/observed notes:
- the OpenAPI spec documents this as the country postal-code reference page route
- the main API page repeatedly points developers to country pages for examples, format notes, and bulk-download entry points

## 7) Canonical postal-code page
- Method: `GET`
- Path: `/postal-codes/{country}/code/{postal_code}`
- Full URL example shown by the official docs: `https://postalcodes.info/postal-codes/portugal/code/1000001`
- Purpose: human-readable validation/audit page for one postal-code record set

Observed notes from the official example page:
- the rendered page for `1000-001` states that the canonical route for that record set is `/postal-codes/portugal/code/1000001`
- the page exposes mapped localities, administrative hierarchy, coordinates, and nearby postal-code links
- this page is positioned by the docs as the QA/audit trail companion to downloaded/exported data

## Pagination, errors, rate limits, and format notes
- No cursor, page-number, or offset pagination model is documented on the inspected API page or OpenAPI spec.
- The OpenAPI spec documents `403` responses for `/download-token.php` and `/download.php` when token/origin requirements are not met.
- Live behavior matched that `403` case for `/download-token.php` without the required XMLHttpRequest header.
- Live behavior did not fully match the OpenAPI response table for invalid download tokens: `/download.php` returned HTTP `200` plus an HTML error message for an invalid/expired token.
- Search behavior is lightweight JSON-array oriented; unmatched or underspecified input can return an empty array.
- No numeric rate-limit policy was surfaced on the inspected official API page or OpenAPI spec during this run.
- Postal code strings should be preserved verbatim; do not normalize them into integers.

## Canonical fireROUTE notes
- Treat PostalCodes as a single-host mixed-surface provider: live search, export flow, and canonical HTML pages all live on `postalcodes.info`.
- Preserve the tokenized export flow exactly: `/download-token.php` must be called first from the same origin, then `/download.php` can fetch the chosen export format.
- Keep the canonical HTML code page route distinct from the country route; the official docs use code pages as the human-review path for specific records.
- Preserve postal codes as strings end-to-end.

## Verification notes
- This file was manually rebuilt from the live official PostalCodes developer page, live OpenAPI spec, and live canonical code-page example using browser tools only.
