# UPC database

## Provider metadata
- Category: `Open Data`
- Provider slug: `upc-database`
- Description: `Barcode / EAN lookup plus related currency, bitcoin, QR, and account endpoints published by UPC Database`
- Official docs/pages used:
  - `https://upcdatabase.org/api` (official API landing page)
  - `https://upcdatabase.org/api-auth` (official authentication page linked from the API landing page)
  - `https://upcdatabase.org/api-limits` (official API limits page linked from the API landing page)
  - `https://upcdatabase.org/api-pricing` (official pricing / quota page linked from the API landing page)
- Public API base URL confirmed from the reviewed official pages: `https://api.upcdatabase.org`
- Auth model: bearer-token `Authorization` header is the documented primary method; legacy query authentication with `apikey` is still accepted but explicitly marked as non-OAuth-compliant and discouraged
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON for product, search, currency, bitcoin, and account responses; plain-text mode is documented for some currency/bitcoin routes via `format=text`; QR generator returns an image response
- Rate limits: no per-second rate limit published on the reviewed pages; daily plan quotas are documented and remaining quota is returned in response headers
- Manually confirmed route count: `10`

## API shape and behavior
- The official docs present all public routes from one left-nav catalog on the API landing page.
- Product lookup and product creation share the same resource path `/product/{id}` but use different methods.
- Search is a paginated collection endpoint with `page` rather than `offset`.
- Currency and bitcoin endpoints are read-only data feeds under separate path prefixes.
- The QR generator and product-creation endpoints are explicitly documented as not counting against API consumption limits.

## Canonical endpoints
1. `GET /product/{id}`
   - Returns product information for a UPC or EAN code.
2. `POST /product/{id}`
   - Creates or saves a product record for a UPC or EAN code.
3. `GET /search`
   - Searches products by text query.
4. `GET /currency/latest`
   - Returns current exchange rates for a base currency.
5. `GET /currency/history`
   - Returns exchange rates for a specific date.
6. `GET /currency/symbols`
   - Returns supported currency symbols / names.
7. `GET /bitcoin/latest`
   - Returns current bitcoin price information in USD.
8. `GET /bitcoin/history`
   - Returns bitcoin price information for a specific date.
9. `GET /qr/{base64text}`
   - Returns a QR code image for base64-encoded text.
10. `GET /account`
    - Returns account, subscription, and remaining-quota information for the authenticated user.

## Confirmed parameters
### Shared authentication inputs
- Bearer-token `Authorization` header - documented primary authentication method on the official auth page.
- `apikey` - optional legacy query-string auth parameter documented on the auth page and examples.

### `GET /product/{id}`
- Path parameter `id` - required UPC or EAN number.

### `POST /product/{id}`
- Path parameter `id` - required UPC or EAN number.
- Multipart form fields shown in the official docs/examples:
  - `title`
  - `description`
  - `alias`
  - `brand`
  - `manufacturer`
  - `asin`
  - `msrp`
  - `category`
  - `mpn`
- Additional PHP example fields shown on the same page:
  - `size`
  - `color`
  - `gender`
  - `age`

### `GET /search`
- `query` - required free-text product query.
- `page` - optional page number; defaults to `1`.

### `GET /currency/latest`
- `base` - required currency code.
- `target` - optional target currency code.
- `format` - optional; docs say `json` (default) or `text`, and this is required when `target` is used.

### `GET /currency/history`
- `base` - required currency code.
- `date` - required `YYYY-MM-DD` date.

### `GET /currency/symbols`
- No required query parameters documented.

### `GET /bitcoin/latest`
- `format` - optional; `json` (default) or `text`.

### `GET /bitcoin/history`
- `date` - required `YYYY-MM-DD` date.

### `GET /qr/{base64text}`
- Path parameter `base64text` - required base64-encoded text payload.

### `GET /account`
- No query parameters documented.

## Response, pagination, and quota notes
- `GET /search` returns up to `20` items per response and uses `page` for pagination.
- The rate-limit headers documented on the official limits page are:
  - `APILimit-Lookups`
  - `APILimit-Search`
  - `APILimit-Currency`
  - `APILimit-Reset` (Unix epoch time)
- The pricing page documents daily plan quotas, including examples for Free, Hobbyist, Standard, and Professional plans.
- The pricing page explicitly states that API requests reset nightly.
- `GET /account` returns both plan ceilings (`api_limits`) and remaining daily counts (`api_remain`).

## Response format notes
- `GET /product/{id}` returns a JSON object with fields such as `barcode`, `title`, `alias`, `description`, `brand`, `manufacturer`, `mpn`, `msrp`, `ASIN`, `category`, `metadata`, `stores`, `images`, and `reviews`.
- `POST /product/{id}` returns JSON with at least `success`, `message`, and `timestamp`.
- `GET /search` returns JSON containing `success`, `timestamp`, `results`, and `items`.
- Currency endpoints return JSON including `success`, `date`, `timestamp`, `base`, and `rates`; the docs also advertise plain-text output for `latest` when `format=text` is used.
- Bitcoin endpoints return JSON including `success`, `timestamp`, `date`, `base`, and `rates` (`high`, `low`, and `latest` or `close`).
- `GET /qr/{base64text}` is documented as returning a QR image with `200` or `400`.
- `GET /account` returns JSON with user profile, subscription, quota, and request-count fields.

## Error notes
Documented response families on the reviewed official pages include:
- `200` - success
- `400` - bad request / invalid input
- `403` - forbidden / auth or access issue on several read endpoints
- `404` - not found on product/search read endpoints
- `Item exists` - explicitly listed as a possible `POST /product/{id}` outcome
- `Bad Data` - explicitly listed as a possible `POST /product/{id}` outcome

## Important usage notes
- The auth page says all authenticated requests must be sent over HTTPS.
- The auth page describes the API key as an OAuth token, but the concrete request examples use bearer-token headers rather than a separate OAuth token-exchange endpoint.
- The QR-generator and product-creation routes are explicitly documented as zero-cost against the API limit.
- The docs treat UPC and EAN values as the same `id` path variable for product routes.
- Preserve the provider's daily-limit model separately from any fireROUTE retry policy because resets are quota-based, not just burst-based.

## fireROUTE normalization notes
- Preserve the `https://api.upcdatabase.org` base URL exactly.
- Keep `/product/{id}` as a method-sensitive route family (`GET` lookup vs `POST` create/update).
- Keep `page` pagination intact on `/search`; do not rewrite it into offset-based pagination.
- Preserve `format=text` behavior on currency/bitcoin routes where callers need lightweight responses.
- Treat `/qr/{base64text}` as a binary/image response route rather than JSON.