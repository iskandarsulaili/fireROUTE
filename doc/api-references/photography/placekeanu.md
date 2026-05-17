# PlaceKeanu

## Overview
- Provider: PlaceKeanu
- Category: Photography
- Official docs: `https://placekeanu.com/`
- Base URL: `https://placekeanu.com`
- Auth: none
- HTTPS: yes
- Response format: SVG placeholder image (the site says the service is SVG-based and the photos are Base64-encoded)
- Pagination: none
- Rate limits: no rate limit documented

## Confirmed route patterns

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/{width}` | path `width` | Returns a square placeholder image when height is omitted. |
| GET | `/{width}/{height}` | path `width`, `height` | Returns a random Keanu image at the requested dimensions. |
| GET | `/{width}/{options}` | path `width`, `options` | Square variant with option flags when height is omitted. |
| GET | `/{width}/{height}/{options}` | path `width`, `height`, `options` | Full placeholder route with optional modifiers such as `y`, `g`, or `yg`. |

Confirmed route count: **4**.

## Parameter notes
- `width` — required image width
- `height` — optional image height; if omitted, the service returns a square image
- `options` — optional flags:
  - `y` = young Keanus only
  - `g` = grayscale
  - combined values like `yg` are supported

## Usage notes
- The official template shown on the page is: `https://placekeanu.com/[width]/[height]*/[options]*`
- Examples shown in the official docs page:
  - `https://placekeanu.com/200/150`
  - `https://placekeanu.com/500/300/y`
  - `https://placekeanu.com/250/g`
  - `https://placekeanu.com/300/550/yg`
- The page says a valid request returns a random photo of Keanu Reeves.
- The page also states images are cached on the client side for 1 day.

## fireROUTE integration notes
- Treat PlaceKeanu as a simple unauthenticated placeholder-image generator.
- Dimension segments are path-based rather than query-based.
- Because the service returns an image asset instead of JSON, it fits best as a media passthrough provider.

## Sources inspected
- `https://placekeanu.com/`
