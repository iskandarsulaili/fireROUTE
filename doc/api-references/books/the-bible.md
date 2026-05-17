# The Bible

Official pages manually reviewed:
- https://docs.api.bible/
- https://docs.api.bible/quick-start/authentication/
- https://docs.api.bible/quick-start/errors/
- https://docs.api.bible/quick-start/rate-limiting/
- https://docs.api.bible/quick-start/licensing-and-access/
- https://docs.api.bible/guides/bibles/
- https://docs.api.bible/guides/books/
- https://docs.api.bible/guides/chapters/
- https://docs.api.bible/guides/verses/
- https://docs.api.bible/guides/passages/
- https://docs.api.bible/guides/sections/
- https://docs.api.bible/guides/search/
- https://docs.api.bible/guides/audio-bibles/

## Overview
- API base URL: `https://rest.api.bible/v1`
- Authentication: required on documented routes via request header `api-key: YOUR_API_KEY`
- Primary response format: JSON
- Content rendering formats documented for scripture payloads: `html`, `json`, `text`
- Access model: Bible availability depends on plan and licensing; Starter includes open-access Bibles and up to 3 copyrighted Bibles, while paid plans can include more

Manual route count confirmed from the reviewed official docs: **18 unique endpoints**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/bibles` | List Bibles available to the authenticated API key |
| GET | `/bibles/{bibleId}` | Fetch one Bible |
| GET | `/bibles/{bibleId}/books` | List books for a Bible |
| GET | `/bibles/{bibleId}/books/{bookId}` | Fetch one book |
| GET | `/bibles/{bibleId}/books/{bookId}/chapters` | List chapters in a book |
| GET | `/bibles/{bibleId}/chapters/{chapterId}` | Fetch one chapter with content |
| GET | `/bibles/{bibleId}/chapters/{chapterId}/verses` | List verse references in a chapter |
| GET | `/bibles/{bibleId}/verses/{verseId}` | Fetch one verse with content |
| GET | `/bibles/{bibleId}/passages/{passageId}` | Fetch a passage range with content |
| GET | `/bibles/{bibleId}/books/{bookId}/sections` | List sections in a book |
| GET | `/bibles/{bibleId}/chapters/{chapterId}/sections` | List sections in a chapter |
| GET | `/bibles/{bibleId}/sections/{sectionId}` | Fetch one section with content |
| GET | `/bibles/{bibleId}/search` | Search verses and passages in a Bible |
| GET | `/audio-bibles` | List audio Bibles available to the authenticated API key |
| GET | `/audio-bibles/{bibleId}/books` | List books for an audio Bible |
| GET | `/audio-bibles/{bibleId}/books/{bookId}` | Fetch one audio-Bible book |
| GET | `/audio-bibles/{bibleId}/books/{bookId}/chapters` | List chapters for an audio-Bible book |
| GET | `/audio-bibles/{bibleId}/chapters/{chapterId}` | Fetch one audio-Bible chapter |

## Confirmed parameters

### `GET /bibles`
- Optional query parameters documented on the Bibles guide:
  - `language`: ISO 639-3 language code
  - `abbreviation`: Bible abbreviation
  - `name`: Bible name
  - `ids`: comma-separated Bible IDs
  - `include-full-details=true|false`: include copyright and promo information

### `GET /bibles/{bibleId}`
- Path parameter: `bibleId`
- The reviewed guide documents no additional query parameters for this route.

### `GET /bibles/{bibleId}/books`
- Path parameter: `bibleId`
- Optional query parameters:
  - `include-chapters=true|false`
  - `include-chapters-and-sections=true|false`

### `GET /bibles/{bibleId}/books/{bookId}`
- Path parameters:
  - `bibleId`
  - `bookId`
- Optional query parameter:
  - `include-chapters=true|false`

### `GET /bibles/{bibleId}/books/{bookId}/chapters`
- Path parameters:
  - `bibleId`
  - `bookId`
- No additional query parameters were documented on the reviewed page.

### Scripture-content routes
The reviewed Chapter, Verse, Passage, and Section guides document the same content-format controls on the single-resource routes below:
- `GET /bibles/{bibleId}/chapters/{chapterId}`
- `GET /bibles/{bibleId}/verses/{verseId}`
- `GET /bibles/{bibleId}/passages/{passageId}`
- `GET /bibles/{bibleId}/sections/{sectionId}`

Documented path parameters:
- `bibleId`
- one of `chapterId`, `verseId`, `passageId`, or `sectionId`

Documented optional query parameters:
- `content-type=html|json|text`
- `include-notes=true|false`
- `include-titles=true|false`
- `include-chapter-numbers=true|false`
- `include-verse-numbers=true|false`
- `include-verse-spans=true|false`
- `parallels`: comma-separated list of Bible IDs

### `GET /bibles/{bibleId}/chapters/{chapterId}/verses`
- Path parameters:
  - `bibleId`
  - `chapterId`
- The reviewed guide documents this as a reference/list route and explicitly says it does not return verse content.

### Section list routes
For both section-list routes below, the reviewed docs only specify the path parameters and do not publish additional query parameters:
- `GET /bibles/{bibleId}/books/{bookId}/sections`
- `GET /bibles/{bibleId}/chapters/{chapterId}/sections`

### `GET /bibles/{bibleId}/search`
- Path parameter: `bibleId`
- Documented query parameters:
  - `query`: search keywords or a passage reference
  - `limit`: result page size, default `10`
  - `offset`: zero-based offset, default `0`
  - `sort=relevance|canonical|reverse-canonical`
  - `range`: comma-separated Passage IDs to restrict search scope
  - `fuzziness=0|1|2|AUTO`

### `GET /audio-bibles`
- Optional query parameters documented on the Audio Bibles guide:
  - `language`
  - `abbreviation`
  - `name`
  - `ids`
  - `include-full-details=true|false`

### Audio-Bible book routes
For these routes, the reviewed Audio Bibles guide documents the following:
- `GET /audio-bibles/{bibleId}/books`
  - optional `include-chapters=true|false`
  - optional `include-chapters-and-sections=true|false`
- `GET /audio-bibles/{bibleId}/books/{bookId}`
  - optional `include-chapters=true|false`
- `GET /audio-bibles/{bibleId}/books/{bookId}/chapters`
  - no additional query parameters documented
- `GET /audio-bibles/{bibleId}/chapters/{chapterId}`
  - no additional query parameters documented on the reviewed page

## Auth and rate limits
- The reviewed Authentication guide requires the `api-key` request header on API requests.
- The reviewed docs describe the auth model as a variation of HTTP Basic Auth, but the concrete implementation shown in curl and JavaScript examples is simply the `api-key` header.
- The reviewed Rate Limiting page documents plan-level monthly limits, not per-second throttles:
  - Starter: `5,000` requests monthly
  - Pro: `150,000` requests monthly
  - Enterprise: negotiated monthly limit
- Overage protection is documented as unavailable on Starter and configurable on Pro and Enterprise.
- The reviewed docs do not publish a numeric per-minute or per-second HTTP rate limit.

## Pagination, errors, and response notes
- `GET /bibles/{bibleId}/search` paginates with `limit` and `offset`.
- Search responses include `query`, `limit`, `offset`, `total`, `verseCount`, `verses`, and `passages` in the reviewed schema.
- The reviewed Errors guide explicitly documents:
  - `401` when authentication fails or the API key is missing/invalid
  - `403` when the caller requests a Bible outside the plan's allowed access
  - `404` when an endpoint or `bible_id` does not exist
- Successful scripture-content responses include a `content` field whose structure depends on `content-type`.
- The Verse guide explicitly says the chapter-verse list endpoint does not return verse content.

## Important usage notes
- Passage IDs are built from two Verse IDs joined by `-`, and the reviewed docs say passages are limited to `200` verses.
- Search behavior in the reviewed docs matches all listed keywords regardless of order; all keywords must be present for a verse to match.
- API.Bible recommends caching metadata such as Bible names, chapters, and verse names, using pagination, and only requesting passages the user actually needs.
- The reviewed Audio Bibles guide contains an inconsistency: its “Fetching a Single Audio Bible” section prints `GET https://rest.api.bible/v1/bibles/{bibleId}` even though the rest of that guide uses `/audio-bibles/...`. I did not count that duplicated string as a separate unique route.

## fireROUTE notes
- Keep `api-key` header auth mandatory for all documented routes.
- Preserve `content-type` passthrough on scripture-content routes so callers can request `html`, `json`, or `text` directly.
- Treat plan/licensing access failures as first-class provider errors because `403` is tied to per-Bible entitlement, not just generic auth failure.
- Model search as the only officially documented paginated route in the reviewed guides.