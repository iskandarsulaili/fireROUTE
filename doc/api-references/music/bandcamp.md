# Bandcamp

## Overview
- Provider: Bandcamp API
- Category: Music
- Official docs: `https://bandcamp.com/developer`
- Base URLs:
  - `https://bandcamp.com/oauth_token` for OAuth token issuance and refresh
  - `https://bandcamp.com/api/account/`
  - `https://bandcamp.com/api/sales/`
  - `https://bandcamp.com/api/merchorders/`
- Auth: OAuth 2.0 bearer tokens. Bandcamp says labels and merchandise fulfillment partners must request API access from Bandcamp, then use Bandcamp-issued `client_id` and `client_secret` to obtain bearer tokens.
- HTTPS: yes
- Response format: JSON
- Pagination: no page/cursor scheme was documented on the inspected pages; filtering is primarily by IDs and date ranges
- Rate limits: no numeric rate limits were documented on the inspected pages

## Confirmed endpoints
The docs publish versioned endpoints. The table below lists the latest version visible on the inspected pages for each operation family.

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/oauth_token` | form `grant_type`, `client_id`, `client_secret`, optional `refresh_token` when `grant_type=refresh_token` | Obtain or refresh bearer tokens. Access tokens expire in one hour according to the docs. |
| POST | `/api/account/1/my_bands` | bearer auth; no request body documented on the account page | Returns the bands/labels the authenticated client can act on, including `band_id` values used by the other APIs. |
| POST | `/api/sales/4/sales_report` | `band_id`, optional `member_band_id`, `start_time`, optional `end_time`, deprecated `format` | Synchronous JSON sales report. |
| POST | `/api/sales/4/generate_sales_report` | report-generation parameters from the Sales API; async flow | Starts asynchronous report generation. The docs say the async flow supports CSV downloads in addition to JSON-oriented workflows. |
| POST | `/api/sales/4/fetch_sales_report` | async report handle/token from generation step | Fetches a previously generated async sales report. |
| POST | `/api/merchorders/1/get_merch_details` | merch/package IDs in JSON body | Returns merch item, package, and option details used by update flows. |
| POST | `/api/merchorders/1/get_shipping_origin_details` | shipping origin IDs in JSON body | Returns shipping origin details. |
| POST | `/api/merchorders/4/get_orders` | band/label IDs plus date and filtering fields in JSON body | Query current or historical merch orders. |
| POST | `/api/merchorders/2/update_shipped` | sale/payment IDs and shipped-state payload | Marks orders/items as shipped. |
| POST | `/api/merchorders/1/mark_date_range_as_shipped` | date range plus band/label identifiers | Batch mark orders as shipped for a date range. |
| POST | `/api/merchorders/1/update_quantities` | package/option/inventory identifiers and quantity updates | Inventory update operation. |
| POST | `/api/merchorders/1/update_sku` | merch/package/option identifiers plus new SKU | SKU maintenance operation. |

Confirmed latest-version route count: **12**.

## Versioning notes
The Bandcamp docs still show older endpoint versions for compatibility:
- `sales_report` versions `1` through `4`
- `generate_sales_report` versions `2` and `4`
- `fetch_sales_report` versions `2` and `4`
- `get_orders` versions `1` through `4`
- `update_shipped` versions `1` and `2`

For fireROUTE, prefer the highest version visible on the current docs unless a compatibility mode is required.

## Auth and token flow
- Bandcamp says API access is not self-serve; you must contact Bandcamp for API access.
- All account, sales, and merch API calls are documented as HTTP `POST` requests with:
  - `Authorization: Bearer ACCESS_TOKEN`
- Token issuance uses `POST https://bandcamp.com/oauth_token`.
- Initial token creation uses `grant_type=client_credentials`.
- Refresh uses `grant_type=refresh_token` plus `refresh_token`.
- The docs state access tokens expire in one hour.

## Parameter notes
### OAuth token endpoint
- `client_id` — Bandcamp-issued client identifier
- `client_secret` — Bandcamp-issued secret
- `grant_type` — `client_credentials` for initial issue or `refresh_token` for renewal
- `refresh_token` — required for refresh flow

### Sales API
The inspected `sales_report` page explicitly documents:
- `band_id` — required ID of the band or label you are calling as or on behalf of
- `member_band_id` — optional filter when operating for a label and narrowing to one band
- `start_time` — earliest UTC sale time to include
- `end_time` — optional exclusive upper bound; defaults to time of call
- `format` — deprecated on v4; docs say JSON is the only format on the synchronous v4 endpoint

The Sales API page also states:
- async report generation/fetch endpoints exist for larger reports
- the async endpoints support CSV download format
- `my_bands` from the Account API is the discovery step for the band and label IDs used here

### Merch Orders API
The merch docs publish these common rules:
- all request parameters are sent as JSON request bodies
- IDs are integers
- `id_type` values are single-character quoted strings where required
- dates may be `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS` and are treated as UTC
- booleans are standard JSON booleans
- many update operations are transactional all-or-nothing operations

The merch overview also says these discovery flows should be used:
- label IDs, band IDs, member band IDs → `my_bands`
- package IDs, option IDs → `get_merch_details`
- payment IDs, sale item IDs → `get_orders`
- shipping origin IDs → `get_shipping_origin_details`

## Response and error notes
- OAuth token responses include fields such as `expires_in`, `access_token`, `refresh_token`, `ok`, and `token_type`.
- The docs show a token error example:
  - HTTP `401`
  - JSON body containing `error` and `error_description` such as `duplicate_grant`
- Merch query responses use success-shaped JSON like:
  - `{ "success": true, "items": [...] }`
- Merch update responses may be as small as:
  - `{ "success": true }`
- Merch error payloads are documented as:
  - `{ "error": true, "error_message": "invalid id" }`

## fireROUTE integration notes
- Treat Bandcamp as a private-partner OAuth provider rather than an open anonymous API.
- Use `my_bands` as the discovery prerequisite for almost every other Bandcamp route family.
- Preserve Bandcamp's versioned path segments because current docs show different latest versions for different operations.
- Model the Sales API as report generation/fetch workflows rather than simple cursor pagination.
- Model the Merch Orders API as JSON-body POST endpoints with transactional update semantics.

## Sources inspected
- `https://bandcamp.com/developer`
- `https://bandcamp.com/developer/account`
- `https://bandcamp.com/developer/sales`
- `https://bandcamp.com/developer/merch`
