# Bhagavad Gita telugu

Official pages manually reviewed:
- https://gita-api.vercel.app/
- https://gita-api.vercel.app/docs
- https://gita-api.vercel.app/openapi.json

## Overview
- API base URL: `https://gita-api.vercel.app`
- Documentation UI reviewed: FastAPI Swagger UI at `/docs`
- Authentication: none documented in the reviewed OpenAPI spec
- Response formats documented:
  - `GET /`: `text/html`
  - verse routes: JSON
- Languages enumerated in the reviewed OpenAPI schema: `tel`, `odi`, `eng`, `esp`

Manual route count confirmed from the reviewed official docs: **3**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Root/status page |
| GET | `/{language}/verse/{chapter_no}/{verse_no}` | Fetch one verse by chapter and verse number |
| GET | `/{language}/verse/{verse_no_serial}` | Fetch one verse by serial verse number |

## Confirmed parameters

### `GET /`
- No parameters documented.
- The reviewed OpenAPI spec declares a successful `text/html` response.

### `GET /{language}/verse/{chapter_no}/{verse_no}`
- Required path parameters:
  - `language`: enum `tel | odi | eng | esp`
  - `chapter_no`: integer
  - `verse_no`: integer
- The reviewed OpenAPI spec documents no query parameters for this route.

### `GET /{language}/verse/{verse_no_serial}`
- Required path parameters:
  - `language`: enum `tel | odi | eng | esp`
  - `verse_no_serial`: integer
- The reviewed OpenAPI spec documents no query parameters for this route.

## Auth and rate limits
- No authentication requirement is published in the reviewed Swagger UI or OpenAPI spec.
- No numeric rate limits or quota rules are published in the reviewed official docs.

## Response and error notes
- The reviewed OpenAPI schema for both verse routes returns either:
  - `GitaVerse`
  - `APIError`
- `APIError` contains:
  - `error`
  - `message`
- `GitaVerse` contains these required fields in the reviewed schema:
  - `chapter_no`
  - `verse_no`
  - `language`
  - `chapter_name`
  - `verse`
  - `translation`
  - `purport`
- Optional/additional fields in the reviewed schema include:
  - `transliteration`
  - `synonyms`
  - `audio_link`
- The reviewed OpenAPI spec publishes `422 Validation Error` for invalid path-parameter shapes.

## Important usage notes
- The root page links directly to `/docs`, so the root is effectively a human-facing status/landing endpoint rather than a JSON API bootstrap route.
- The schema allows `verse_no`, `verse`, `transliteration`, `synonyms`, and `purport` to be strings or arrays depending on the underlying record.
- Because the language parameter is an enum in the reviewed schema, fireROUTE should validate it client-side before forwarding requests.

## fireROUTE notes
- Treat the two verse routes as the canonical provider surface.
- Preserve language as a required path parameter and expose the four documented enum values directly.
- Expect application-level JSON errors via the `APIError` schema in addition to `422` validation failures.