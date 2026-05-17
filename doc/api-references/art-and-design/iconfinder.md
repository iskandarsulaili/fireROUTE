# Iconfinder

## Manual review status
- Category: Art & Design
- Official docs reviewed:
  - `https://docs.magnific.com/api-reference/icons/icons-api`
  - `https://docs.magnific.com/api-reference/icons/get-all-icons-by-order`
  - `https://docs.magnific.com/api-reference/icons/get-one-icon-by-id`
  - `https://docs.magnific.com/api-reference/icons/download-an-icon`
  - `https://docs.magnific.com/authentication`
  - `https://docs.magnific.com/ratelimits`
- Manual review outcome: `manually_documented`
- Confirmed route count: `3`

## API overview
- Base URL: `https://api.magnific.com`
- Base API prefix: `/v1`
- Authentication: required API key in the `x-magnific-api-key` header
- Auth model note: the authentication guide says Magnific currently supports private API keys only, intended for server-to-server calls
- Optional header: `Accept-Language` for ISO 639-1 / ISO 3166-1 language selection; docs say `en-US` is the default
- Response format: JSON

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/icons` | Query parameters include `term`, `slug`, `page`, `per_page`, `family-id`, `order`, `thumbnail_size`, `filters` | Lists icons with sorting and filters. The docs describe `order` values `relevance` and `recent`. |
| GET | `/v1/icons/{id}` | Path parameter `id`; optional `Accept-Language` header | Returns detailed metadata for one icon. |
| GET | `/v1/icons/{id}/download` | Path parameter `id`; query parameters `format`, optional `png_size`; optional `Accept-Language` header | Returns download metadata for the requested icon asset. |

## Parameters and format details
### `GET /v1/icons`
- `term` — search term
- `slug` — search by slug
- `page` — page number, must be greater than `0`
- `per_page` — results per page, must be greater than `0`
- `family-id` — icon family ID, required range `>= 1`
- `order` — documented values `relevance` and `recent`
- `thumbnail_size` — thumbnail size; docs say `128` is the default when omitted
- `filters` — docs expose this as an object for icon filters, but the child attributes were not expanded in the reviewed page

### `GET /v1/icons/{id}/download`
- `format` — documented values `svg`, `png`, `gif`, `mp4`, `aep`, `json`, `psd`, `eps`
- `png_size` — documented values `512`, `256`, `128`, `64`, `32`, `24`, `16`; applies only when `format=png`
- The docs note that `gif`, `mp4`, `aep`, `json`, `psd`, and `eps` are not available for standard and sticker icon types

## Pagination, rate limits, and errors
- Pagination: `GET /v1/icons` returns `meta.pagination` with `per_page`, `total`, `last_page`, and `current_page`
- Rate limits: the Magnific rate-limiting page lists the `icons` service at `25` requests/day on the free plan and `2,500` requests/day on the premium plan
- The rate-limiting guide also says rate limiting is enforced based on IP address and API key
- Error responses: exact error schemas were not shown in the reviewed icons pages

## Response notes
- `GET /v1/icons` returns a `data` array plus `meta.pagination`
- Icon objects shown in the docs include fields such as `id`, `name`, `slug`, `created`, `free_svg`, `author`, `style`, `family`, `thumbnails`, and `tags`
- `GET /v1/icons/{id}` returns a single `data` object and the example also shows related content groups such as `related.visual_concept`, `related.style`, and `related.variants`
- `GET /v1/icons/{id}/download` returns a `data` object with `filename` and `url`

## Important usage notes
- The product name in the indexed catalog is `Iconfinder`, but the currently reachable official docs are branded as `Magnific API`
- The overview page explicitly describes the API as a catalog search, retrieval, and download interface for icons
- The docs link to a separate license agreement page for icon licensing terms

## Sources inspected
- `https://docs.magnific.com/api-reference/icons/icons-api`
- `https://docs.magnific.com/api-reference/icons/get-all-icons-by-order`
- `https://docs.magnific.com/api-reference/icons/get-one-icon-by-id`
- `https://docs.magnific.com/api-reference/icons/download-an-icon`
- `https://docs.magnific.com/authentication`
- `https://docs.magnific.com/ratelimits`
