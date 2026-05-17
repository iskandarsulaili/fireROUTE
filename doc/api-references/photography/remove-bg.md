# Remove.bg

## Overview
- Provider: remove.bg API
- Category: Photography
- Official docs: `https://www.remove.bg/api`
- Base URL: `https://api.remove.bg/v1.0`
- Auth: the docs say requests require either an API key in `X-Api-Key` or an OAuth 2.0 bearer token in the `Authorization` header
- HTTPS: yes
- Response formats: binary image output is the primary documented result; the overview also says result images can be returned as image files or JSON-encoded data depending on usage mode
- Pagination: none documented
- Rate limits: the docs describe rate limiting in "megapixel images" per minute and return rate-limit headers; no single flat global request-count number is published on the inspected page

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/removebg` | one of `image_file` or `image_url`; optional output/settings fields such as `size`, `format`, background and crop controls | Fully documented main background-removal endpoint. |
| GET | `/account` | authenticated request | Mentioned in the official changelog as the account/credit-balance lookup endpoint. |
| POST | `/improve` | authenticated request | Mentioned in the official changelog as an additional endpoint introduced in 2020. |

Confirmed publicly named route count on the inspected docs page: **3**.

## Parameter notes for `POST /removebg`
The inspected docs page shows file-upload and URL-input examples and documents a large option set. The following parameters were explicitly visible on the page or in the changelog/history sections:
- `image_file` — upload source image as multipart file
- `image_url` — remote image URL source
- `size` — output size mode, with docs examples using `auto`
- `format` — output format selector; the page documents `png`, `jpg`, `webp`, and `zip`
- `bg_color` — flat background color
- `bg_image_url`, `bg_image_file` — replacement background image inputs
- `crop` — crop empty regions
- `crop_margin`
- `scale`
- `position`
- `roi` — region of interest
- `type` / `type_level`
- `add_shadow`
- `shadow_method`
- `semitransparency`

The docs also say the endpoint is suitable for images with a foreground such as people, products, animals, and cars.

## Output-format notes
The page explicitly documents these result formats:
- `PNG` — supports transparency, up to 10 megapixels
- `JPG` — no transparency, up to 50 megapixels
- `WebP` — supports transparency, up to 50 megapixels
- `ZIP` — fastest option for transparent results, up to 50 megapixels

## Error and rate-limit notes
- Exceeding rate limits returns HTTP `429`.
- The docs publish JSON-shaped error examples such as:
  - `{ "errors": [{ "title": "Rate limit exceeded" }] }`
- The page recommends honoring `Retry-After` on `429` responses.
- The rate-limit section says clients can inspect response headers for:
  - total rate limit in megapixel images
  - remaining rate limit for the current minute
  - reset timestamp / reset timing information
- The docs explicitly note `429` responses do not charge credits.

## Changelog-only route visibility note
The current docs page fully documents `POST /removebg`, but `GET /account` and `POST /improve` are visible on the same official page only via changelog entries:
- `2019-05-01: Added endpoint GET /account for credit balance lookups`
- `2020-09-30: Added type_level parameter and POST /improve endpoint`

## fireROUTE integration notes
- Use `POST /removebg` as the primary production route.
- Model input as mutually exclusive `image_file` vs `image_url` source modes.
- Expose output-format selection because PNG/WebP/ZIP/JPG materially change transparency support, file size, and max resolution.
- Implement polite retry logic around `429` with `Retry-After`.
- Treat `/account` and `/improve` as secondary paths that are confirmed by the official page but not described there as fully as `/removebg`.

## Sources inspected
- `https://www.remove.bg/api`
