# Lorem Picsum

## Overview
- Provider: Lorem Picsum
- Category: Photography
- Official docs: `https://picsum.photos/`
- Base URL: `https://picsum.photos`
- Auth: none
- HTTPS: yes
- Response formats: image responses for placeholder/image routes; JSON for list/info routes
- Pagination: supported on `/v2/list` with `page` and `limit`
- Rate limits: no numeric rate limit documented on the inspected page

## Confirmed route patterns

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/{width}` | path `width` | Returns a square placeholder image. |
| GET | `/{width}/{height}` | path `width`, `height`; optional `grayscale`; optional `blur` | Returns a random image at the requested dimensions. |
| GET | `/id/{id}/{width}/{height}` | path `id`, `width`, `height`; optional `grayscale`; optional `blur` | Returns a specific image at the requested dimensions. |
| GET | `/seed/{seed}/{width}/{height}` | path `seed`, `width`, `height`; optional `grayscale`; optional `blur` | Returns a deterministic random image for a given seed. |
| GET | `/{width}/{height}.{ext}` | path `width`, `height`, `ext` | The docs show file-extension variants such as `.jpg` and `.webp`. |
| GET | `/v2/list` | optional `page`; optional `limit` | Returns JSON list of images. |
| GET | `/id/{id}/info` | path `id` | Returns JSON metadata for one image ID. |
| GET | `/seed/{seed}/info` | path `seed` | Returns JSON metadata for one seeded image. |

Confirmed route count: **8**.

## Query/path parameter notes
- `width`, `height` — requested image dimensions
- `id` — specific image identifier
- `seed` — deterministic seed string
- `grayscale` — optional flag for grayscale conversion
- `blur` — optional blur flag or numeric blur level (the page shows both bare `?blur` and `?blur=2`)
- `ext` — file extension variant shown in official examples (`jpg`, `webp`)
- `/v2/list` supports `page` and `limit`

## Response notes
- Image routes are intended for direct image embedding.
- `/v2/list` returns JSON objects with fields including `id`, `author`, `width`, `height`, `url`, and `download_url`.
- `/info` routes return similar JSON metadata for a single image.

## Usage notes
The official page shows these example URLs directly:
- `https://picsum.photos/200/300`
- `https://picsum.photos/200`
- `https://picsum.photos/id/237/200/300`
- `https://picsum.photos/seed/picsum/200/300`
- `https://picsum.photos/200/300?grayscale`
- `https://picsum.photos/200/300/?blur=2`
- `https://picsum.photos/v2/list?page=2&limit=100`
- `https://picsum.photos/id/0/info`
- `https://picsum.photos/seed/picsum/info`

## fireROUTE integration notes
- Lorem Picsum is a mixed image/JSON provider: image generation routes should be handled separately from metadata routes.
- Query controls like `grayscale` and `blur` should be treated as modifiers on the image routes rather than separate endpoints.

## Sources inspected
- `https://picsum.photos/`
