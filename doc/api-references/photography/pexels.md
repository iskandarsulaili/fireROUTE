# Pexels

## Overview
- Provider: Pexels API
- Category: Photography
- Official docs: `https://www.pexels.com/api/`
- Base URLs published on the inspected docs:
  - photo endpoints under `https://api.pexels.com/v1/`
  - the intro notes video endpoints are available at `https://api.pexels.com/videos/`; the examples shown on the inspected docs page also render `https://api.pexels.com/v1/videos/...` route strings
- Auth: required API key in the `Authorization` header
- HTTPS: yes
- Response format: JSON
- Pagination: paginated endpoints share `page` and `per_page`; docs say paginated endpoints can return a maximum of `80` items at once
- Rate limits: default `200` requests per hour and `20,000` requests per month; higher or unlimited limits may be granted by Pexels for approved use cases with attribution

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/search` | required `query`; optional search filters and pagination | Search photos. |
| GET | `/v1/curated` | optional pagination | Curated photo feed. |
| GET | `/v1/photos/:id` | path `id` | Single-photo lookup. |
| GET | `/v1/videos/search` | required `query`; optional video filters and pagination | Search videos. The docs page renders this route under the `v1/videos` path form. |
| GET | `/v1/videos/popular` | optional video filters and pagination | Popular videos feed. |
| GET | `/v1/videos/videos/:id` | path `id` | Single-video lookup as rendered on the inspected docs page. |
| GET | `/v1/collections/featured` | optional pagination | Featured collections. |
| GET | `/v1/collections` | optional pagination | Authenticated user's collections. |
| GET | `/v1/collections/:id` | path `id` | Collection media listing endpoint shown as "Collection Media" in the docs. |

Confirmed route count: **9**.

## Auth and usage notes
- Every request must include the API key in the `Authorization` header.
- The docs explicitly require a prominent link back to Pexels.
- Pexels asks developers to credit photographers when possible.
- The guidelines also say not to replicate core Pexels functionality or build wallpaper-style apps from the API.

## Parameter notes
### Shared pagination
The docs' Pagination section says most multi-record endpoints share:
- `page`
- `per_page`

The docs also say paginated requests can return at most `80` items per request.

### Photo endpoints
The inspected docs page explicitly shows these route families:
- Search photos — driven by `query` plus photo search filters
- Curated photos — listing/pagination oriented
- Get a photo — path `:id`

### Video endpoints
The inspected docs page explicitly shows these route families:
- Search videos — `query` plus optional video filters
- Popular videos — listing/filter route
- Get a video — path `:id`

### Collection endpoints
The inspected docs page explicitly shows:
- Featured collections
- My collections
- Collection media by collection `:id`

## Rate-limit and quota notes
- Default quota is `200` requests per hour and `20,000` requests per month.
- The docs say limits can be raised, and may be made unlimited for compliant high-traffic integrations.
- Successful responses include:
  - `X-Ratelimit-Limit`
  - `X-Ratelimit-Remaining`
  - `X-Ratelimit-Reset`
- The docs note `429 Too Many Requests` does not include those success-only headers.

## Response and error notes
- The API is documented as JSON-oriented.
- The docs page focuses on successful examples plus quota headers; it does not publish a large centralized error-schema section.
- `429 Too Many Requests` is explicitly mentioned in the quota docs.

## fireROUTE integration notes
- Treat Pexels as a compact read-only search/feed/detail API with separate photo, video, and collection route families.
- Preserve the doc-published path strings exactly for video operations because the inspected page mixes a `videos` service note with `v1/videos/...` examples.
- Promote `page` and `per_page` as shared controls for all listing routes.
- Keep attribution and usage-policy warnings visible in the provider adapter documentation.

## Sources inspected
- `https://www.pexels.com/api/`
- `https://www.pexels.com/api/documentation/`
