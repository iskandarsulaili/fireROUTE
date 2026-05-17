# CATAAS

## Overview
- Provider: Cat as a Service (CATAAS)
- Category: Animals
- Official docs: `https://cataas.com/`
- Base URL: `https://cataas.com`
- Auth: none documented for the public endpoints shown on the homepage docs
- HTTPS: yes
- Response formats: raw images/GIFs, HTML, JSON metadata
- Pagination: supported for `/api/cats`
- Rate limits: none documented on the public docs page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/cat` | optional query params | Returns a random cat image. |
| GET | `/cat/{tag}` | `tag` path; multiple tags supported | Returns a random cat matching one or more tags. |
| GET | `/cat/gif` | none | Returns a random cat GIF. |
| GET | `/cat/says/{text}` | `text` path | Returns a random cat image with overlaid text. |
| GET | `/cat/{tag}/says/{text}` | `tag`, `text` path | Returns a tagged cat image with overlaid text. |
| GET | `/cat/says/{text}?fontSize={size}&fontColor={color}` | `fontSize`, `fontColor` query | Text styling for captioned cat images. |
| GET | `/cat?type={type}` | `type` query | Image type can be `xsmall`, `small`, `medium`, or `square`. |
| GET | `/cat?filter={filter}` | `filter` query | Supports `blur`, `mono`, `negate`, or `custom`. |
| GET | `/cat?filter=custom&brightness={brightness}&lightness={lightness}&saturation={saturation}&hue={hue}` | image filter queries | Custom HSL-style filtering. |
| GET | `/cat?filter=custom&r={red}&g={green}&b={blue}` | RGB filter queries | Custom color filtering. |
| GET | `/cat?width={width}` | `width` query | Resize by width. |
| GET | `/cat?height={height}` | `height` query | Resize by height. |
| GET | `/cat?html=true` | `html=true` | Returns a random cat embedded in an HTML page. |
| GET | `/cat?json=true` | `json=true` | Returns random cat metadata as JSON instead of an image. |
| GET | `/cat/gif/says/{text}?filter=mono&fontColor={color}&fontSize={size}&type={type}` | mixed path/query | Official docs explicitly show combined modifiers. |
| GET | `/api/cats` | `tags`, `skip`, `limit` query | Returns cat metadata in JSON; supports tag filtering and pagination-style skipping. |
| GET | `/api/tags` | none | Returns all tags. |

## Parameter notes
- Tags can be combined in the path using the tag separator shown in the docs.
- `/api/cats` supports:
  - `tags=tag1,tag2`
  - `skip=0`
  - `limit=10`
- Text overlay endpoints use path text and optional styling query parameters.
- Filtered image endpoints are all variants of the `/cat` family rather than separate API namespaces.

## Request and response notes
- The homepage documentation mixes direct media responses and JSON catalogue endpoints.
- `/cat*` routes usually return image or GIF media directly.
- `/cat?json=true` and `/api/cats` return JSON.
- `/api/cats` is the better route family when fireROUTE needs metadata or pagination-like traversal instead of direct media delivery.

## Error handling
- No formal error schema is published on the public docs page.
- The official docs are example-driven and do not publish status-code tables.

## Integration notes for fireROUTE
- CATAAS exposes both direct asset routes and JSON catalogue routes; keep those separate in adapter design.
- Prefer `/api/cats` for structured search/list experiences.
- Prefer `/cat`, `/cat/{tag}`, and `/cat/says/{text}` for simple media-generation passthrough usage.

## Sources inspected
- `https://cataas.com/`
