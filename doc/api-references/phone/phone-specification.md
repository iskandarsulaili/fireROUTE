# Phone Specification

Official docs manually reviewed:
- https://github.com/azharimm/phone-specs-api

## Overview
The official repository README documents a public JSON API for browsing GSM Arena-derived phone metadata.

Confirmed from the README page reviewed in the browser:
- Public API base URL used in the official examples: `https://api-mobilespecs.azharimm.dev`
- Authentication: none documented
- Transport: HTTPS JSON API
- CORS: the project is presented as public browser-consumable API usage

The README also includes an important note telling existing users to "take a look at the new `/v2` endpoint," but the current official example URLs shown on the README still use the root base URL without a visible `/v2` path prefix. fireROUTE should therefore treat the example URLs below as the currently documented canonical surface.

## Authentication
No API key, bearer token, or HTTP auth scheme is described in the reviewed official README.

## Confirmed endpoints
The repository README explicitly lists these endpoints.

| Method | Path | Purpose |
|---|---|---|
| GET | `/brands` | List all supported phone brands |
| GET | `/brands/{brand_slug}` | List phones for a brand |
| GET | `/{phone_slug}` | Get one phone specification record |
| GET | `/search` | Search phones by query string |
| GET | `/latest` | List latest devices |
| GET | `/top-by-interest` | List devices ranked by interest |
| GET | `/top-by-fans` | List devices ranked by fan popularity |

Manual route count confirmed from the official README: **7**.

## Endpoint details

### `GET /brands`
Official README label: "List Brands"

Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/brands`

Returns a JSON list of brands.

### `GET /brands/{brand_slug}`
Official README label: "List Phones"

Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/brands/apple-phones-48?page=2`

Confirmed parameters:
- Path parameter: `brand_slug`
- Query parameter: `page` — page of the data, optional

### `GET /{phone_slug}`
Official README label: "Phone Specifications"

Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/apple_iphone_12_pro_max-10237`

Confirmed parameter:
- Path parameter: `phone_slug` — the device slug shown in the README examples

The official README does not show an additional `/brands/{brand_slug}/` prefix for the detail route; the example goes directly under the API root.

### `GET /search`
Official README label: "Search"

Confirmed example URL:
- `http://api-mobilespecs.azharimm.dev/search?query=iPhone 12 pro max`

Confirmed query parameter:
- `query` — search query, required

The README’s search example is plain HTTP, but the rest of the current documented examples use HTTPS. fireROUTE should prefer HTTPS unless an integration has a specific reason to mirror the README’s older HTTP example.

### `GET /latest`
Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/latest`

### `GET /top-by-interest`
Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/top-by-interest`

### `GET /top-by-fans`
Confirmed example URL:
- `https://api-mobilespecs.azharimm.dev/top-by-fans`

## Query and path parameters
Confirmed directly from the official README examples/tables:
- `brand_slug` — brand listing slug used in `/brands/{brand_slug}`
- `phone_slug` — phone detail slug used at the API root
- `page` — optional page number for brand listings
- `query` — required search term for `/search`

## Rate limits
No rate-limit policy is published in the reviewed official README.

## Pagination
Only one pagination control is explicitly documented:
- `page` on `GET /brands/{brand_slug}`

No cursor, page-size, or global pagination contract is documented for the other endpoints.

## Errors
The reviewed README does not publish a formal error-code table.

## Response format
The official examples and project description present this as a JSON API.

Observed response shapes from the README examples:
- list-style responses for brands, brand devices, latest, and ranking endpoints
- object-style detail response for a single phone

## Important usage notes
- The dataset is described in the README as being based on GSM Arena.
- The repository warns existing users to look at a `/v2` endpoint, but the visible examples on the reviewed README still point to the non-prefixed base URLs above.
- The current docs are maintained in the GitHub README rather than a separate hosted API reference.

## fireROUTE notes
- Treat this provider as a simple unauthenticated read-only catalog API.
- Preserve the root-level phone-detail route exactly as documented instead of forcing it under `/brands/...`.
- Be cautious about hard-coding `/v2` until the official README examples are updated to show the path consistently.
