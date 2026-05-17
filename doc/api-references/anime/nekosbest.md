# NekosBest

## Overview
- Provider: NekosBest
- Category: Anime
- Official docs: `https://docs.nekos.best/getting-started/api-endpoints.html`
- Base URL: `https://nekos.best/api/v2`
- Versioning: the docs list `v2` as the current and maintained API version
- Auth: none
- HTTPS: yes
- Response format: JSON for metadata endpoints; binary image/GIF for direct asset fetches
- Pagination: none documented; result counts are controlled with `amount`
- Rate limits: no numeric rate limit documented

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/endpoints` | none | Returns the currently available API categories and their file formats. |
| GET | `/:category` | path `category`; optional `amount` | Returns one or more random images/GIFs from the requested category. |
| GET | `/search` | required `query`, required `type`, optional `category`, optional `amount` | Searches assets by metadata such as artist names or source titles. |
| GET | `/:category/:filename.:format` | path `category`, `filename`, `format` | Returns the raw binary asset directly. Metadata is exposed through URL-encoded response headers. |

## Parameter notes
- `amount` — optional numeric count for `/:category` and `/search`; documented range is `1 <= X <= 20`, default `1`.
- `query` — required search phrase for `/search`.
- `type` — required enum for `/search`; `1` means images and `2` means GIFs.
- `category` — category name. The docs recommend discovering supported categories from `/endpoints` rather than hardcoding them.
- `filename` — asset UUID / filename segment.
- `format` — direct asset file format such as `png` or `gif`.

## Response format notes
- `GET /endpoints` returns a JSON object keyed by category, with each category exposing at least a `format` field.
- `GET /:category` and `GET /search` return a JSON object with a `results` array.
- Result objects can include:
  - `url`
  - `dimensions.width`
  - `dimensions.height`
  - image-oriented metadata such as `artist_name`, `artist_href`, `source_url`
  - GIF-oriented metadata such as `anime_name`
- `GET /:category/:filename.:format` returns binary content instead of JSON.
- The direct asset route publishes metadata in URL-encoded HTTP headers. The docs explicitly list these headers: `anime_name`, `artist_name`, `artist_href`, and `source_url`.

## Error and usage notes
- The docs do not publish a formal error schema or status-code table.
- The API is versioned in-path. The docs only mark `v2` as current and maintained.
- The most stable integration pattern is to discover categories dynamically from `/endpoints`, then call the category or search routes as needed.

## Integration notes for fireROUTE
- Model this provider as a small four-route surface with two JSON-discovery/search routes, one category-fetch route, and one raw asset route.
- Preserve the distinction between metadata JSON endpoints and the binary asset endpoint.
- Prefer `/endpoints` during capability discovery so fireROUTE can adapt automatically if the provider adds or removes categories.
- When exposing the direct asset route, also surface the provider's metadata headers because important attribution/source fields are not in the binary body itself.

## Sources inspected
- `https://docs.nekos.best/`
- `https://docs.nekos.best/getting-started/api-endpoints.html`
