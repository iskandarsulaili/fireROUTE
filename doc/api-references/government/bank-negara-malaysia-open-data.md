# Bank Negara Malaysia Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `bank-negara-malaysia-open-data`
- Official docs/pages used:
  - `https://apikijangportal.bnm.gov.my/`
  - `https://apikijangportal.bnm.gov.my/openapi`
  - `https://apikijangportal.bnm.gov.my/openapi.json`
  - live official specification endpoints discovered from the official OpenAPI explorer page:
    - `https://api.bnm.gov.my/api/specification/categories`
    - `https://api.bnm.gov.my/api/specification/tags?category=Rates%20and%20Volumes`
    - `https://api.bnm.gov.my/api/specification/tag?name=Exchange%20Rates`
  - live official public data routes under `https://api.bnm.gov.my/public/exchange-rate...`
- Current documented API hosts:
  - Explorer/docs host: `https://apikijangportal.bnm.gov.my`
  - Specification discovery host: `https://api.bnm.gov.my/api/specification`
  - Public data host: `https://api.bnm.gov.my/public`
- Auth model for reviewed routes: no API key or token was required on the reviewed endpoints; public data routes required an `Accept` version header
- Response format: JSON on the reviewed specification and public-data routes
- Manually confirmed canonical route count: `7`

## Official usage notes
- The official OpenAPI explorer page is live and titled `APIs - BNM`.
- The explorer page populates its dataset/category list dynamically from `GET https://api.bnm.gov.my/api/specification/categories`.
- The same page sets the production server to `https://api.bnm.gov.my/public`.
- The reviewed production explorer exposed category groups such as `Rates and Volumes`, `Monetary and Banking`, `Financial and Capital Markets`, `Insurance and Takaful`, `Government Securities`, `Bond Info Hub (BIH)`, and `FAST`.
- The top-level `https://apikijangportal.bnm.gov.my/openapi.json` path exists but returned `{"status":"Not found"}` in this review, so the provider currently exposes its spec through the explorer’s dynamic discovery endpoints rather than through a single static OpenAPI JSON document.

## Canonical endpoint inventory manually confirmed in this review
1. `GET /api/specification/categories`
   - Host: `https://api.bnm.gov.my`
   - Purpose: list dataset categories and the production server URL used by the explorer
   - Response notes:
     - returned `categories` and `servers`
     - `servers` was `https://api.bnm.gov.my/public`

2. `GET /api/specification/tags?category={category}`
   - Host: `https://api.bnm.gov.my`
   - Purpose: list API tags/endpoints available inside one category
   - Query parameters:
     - `category` - category name, for example `Rates and Volumes`
   - Response notes:
     - for `Rates and Volumes`, the reviewed response returned tags including `Exchange Rates`, `Interest Rate`, `Kijang Emas`, and `Overnight Policy Rate (OPR)`

3. `GET /api/specification/tag?name={tag_name}`
   - Host: `https://api.bnm.gov.my`
   - Purpose: return route-level specification data for one selected tag
   - Query parameters:
     - `name` - tag name, for example `Exchange Rates`
   - Response notes:
     - for `Exchange Rates`, the reviewed response returned the route templates and response schemas for four public endpoints

4. `GET /public/exchange-rate`
   - Host: `https://api.bnm.gov.my`
   - Required header:
     - `Accept: application/vnd.BNM.API.v1+json`
   - Query parameters:
     - `session` - optional; one of `0900`, `1130`, `1200`, `1700`; default `1130`
     - `quote` - optional; one of `rm`, `fx`; default `rm`
   - Live result notes:
     - returned JSON with `meta` and `data`
     - reviewed response had `meta.quote`, `meta.session`, `meta.last_updated`, and `meta.total_result`

5. `GET /public/exchange-rate/{currency_code}`
   - Host: `https://api.bnm.gov.my`
   - Required header:
     - `Accept: application/vnd.BNM.API.v1+json`
   - Path parameters:
     - `currency_code` - documented as a 3-character ISO4217 currency code
   - Query parameters:
     - `session` - optional; `0900`, `1130`, `1200`, `1700`
     - `quote` - optional; `rm` or `fx`

6. `GET /public/exchange-rate/{currency_code}/date/{date}`
   - Host: `https://api.bnm.gov.my`
   - Required header:
     - `Accept: application/vnd.BNM.API.v1+json`
   - Path parameters:
     - `currency_code` - documented as a 3-character ISO4217 currency code
     - `date` - date string such as `2020-09-08`
   - Query parameters:
     - `session` - optional; `0900`, `1130`, `1200`, `1700`
     - `quote` - optional; `rm` or `fx`
   - Live result notes:
     - `GET /public/exchange-rate/USD/date/2026-05-15?session=1130&quote=rm` returned HTTP `200` and a single `data` object for USD

7. `GET /public/exchange-rate/{currency_code}/year/{year}/month/{month}`
   - Host: `https://api.bnm.gov.my`
   - Required header:
     - `Accept: application/vnd.BNM.API.v1+json`
   - Path parameters:
     - `currency_code` - documented as a 3-character ISO4217 currency code
     - `year` - integer year, minimum `2000`
     - `month` - integer month, `1` through `12`
   - Query parameters:
     - `session` - optional; `0900`, `1130`, `1200`, `1700`
     - `quote` - optional; `rm` or `fx`

## Response, error, and pagination notes
- The reviewed public responses used a top-level JSON shape with `data` and `meta`.
- `meta` on the reviewed exchange-rate routes included at least:
  - `quote`
  - `session`
  - `last_updated`
  - `total_result`
- A reviewed list request returned exchange-rate entries with fields such as `currency_code`, `unit`, and nested `rate` values (`date`, `buying_rate`, `selling_rate`, `middle_rate`).
- No offset/page pagination parameters were documented or observed on the reviewed exchange-rate routes.
- The reviewed spec for `Exchange Rates` documented a default error schema with:
  - `code` - integer HTTP-style error code
  - `message` - human-readable error text
- Live error behavior confirmed in this review:
  - invalid currency/date requests returned HTTP `404` with JSON `{"message":"No records found.","code":404}`
  - requesting `/public/exchange-rate` without the required versioned `Accept` header returned an HTML `404` page rather than the JSON exchange-rate payload
- No public rate-limit policy was published on the reviewed official pages or specification endpoints.

## Important integration notes
- Treat this provider as a spec-driven API portal: category discovery, tag discovery, and tag-level route specification are official API surfaces themselves.
- The reviewed `Exchange Rates` tag was fully inspected and confirmed against the live production host; additional categories and tags are discoverable through the same official specification endpoints.
- Preserve the required versioned `Accept` header exactly as documented on public data routes: `application/vnd.BNM.API.v1+json`.
- The official explorer UI currently advertises explorer version `v1.0.0` and production environment only.
