# Pixabay

## Overview
- Provider: Pixabay API
- Category: Photography
- Official docs from the index: `https://pixabay.com/sk/service/about/api/`
- Official docs page successfully inspected: `https://pixabay.com/api/docs/`
- Base URLs:
  - `https://pixabay.com/api/` for image search and image-by-ID retrieval
  - `https://pixabay.com/api/videos/` for video search and video-by-ID retrieval
- Auth: required `key` query parameter
- HTTPS: yes
- Response format: JSON-encoded UTF-8 objects
- Pagination: page-based on both image and video search endpoints
- Rate limits: `100` requests per `60` seconds per API key; docs also require 24-hour caching of requests/results and prohibit systematic mass downloading

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/` | required `key`; optional search/filter params such as `q`, `lang`, `id`, `image_type`, `orientation`, `category`, `min_width`, `min_height`, `colors`, `editors_choice`, `safesearch`, `order`, `page`, `per_page`, `callback`, `pretty` | Image search endpoint. Setting `id` switches the same route into direct image lookup mode. |
| GET | `/api/videos/` | required `key`; optional search/filter params such as `q`, `lang`, `id`, `video_type`, `category`, `min_width`, `min_height`, `order`, `page`, `per_page`, `callback`, `pretty` | Video search endpoint. Setting `id` switches the same route into direct video lookup mode. |

Confirmed route count: **2**.

## Parameter notes
### Shared auth and transport
- `key` — required API key
- `callback` — optional JSONP callback
- `pretty` — optional pretty-printing flag
- responses are JSON and UTF-8 according to the docs

### Image endpoint highlights
The inspected image docs explicitly list:
- `q` — URL-encoded search term
- `lang` — language code
- `id` — retrieve an individual image by ID
- `image_type` — `all`, `photo`, `illustration`, `vector`
- `orientation` — `all`, `horizontal`, `vertical`
- `category` — one of Pixabay's named content categories
- `min_width`, `min_height`
- `colors`
- `editors_choice`
- `safesearch`
- `order`
- `page`, `per_page`

### Video endpoint highlights
The inspected video docs publish a parallel video-search route with:
- `q`
- `lang`
- `id`
- `video_type`
- `category`
- `min_width`, `min_height`
- `order`
- `page`, `per_page`

## Rate-limit and usage notes
- Default limit is `100` requests per `60` seconds.
- Rate-limit headers documented on successful responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- The docs require caching requests for `24` hours.
- Systematic mass downloads are explicitly disallowed.
- Permanent hotlinking of Pixabay image URLs is not allowed; if you intend to use images, the docs say to download them to your own server first.

## Error and response notes
- Error responses use normal HTTP status codes.
- The docs say the body of an error response contains a plain-text description.
- The documented example for exceeding quota is HTTP `429 Too Many Requests` with message `API rate limit exceeded`.

## fireROUTE integration notes
- Model Pixabay as two shared search/lookup routes rather than many separate path patterns.
- Surface the `id` query parameter as a lookup shortcut on both routes.
- Respect the provider's caching and anti-hotlinking requirements if fireROUTE exposes asset URLs.
- Preserve JSONP support only if a caller explicitly needs it; JSON should remain the default.

## Sources inspected
- `https://pixabay.com/sk/service/about/api/`
- `https://pixabay.com/api/docs/`
