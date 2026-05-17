# Bible-api

Official page manually reviewed:
- https://bible-api.com/

## Overview
- Public API base URL: `https://bible-api.com`
- Authentication: none
- Response format: JSON
- Default translation: `web` (World English Bible)

Manual route count confirmed from the official docs: **7**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/{BOOK}+{CHAPTER}:{VERSE}` | User-input verse lookup |
| GET | `/{BOOK}+{CHAPTER}:{VERSE}?translation={id}` | User-input lookup with translation override |
| GET | `/data` | List available translations |
| GET | `/data/{translationId}` | List books in a translation |
| GET | `/data/{translationId}/{bookId}` | List chapters in a book |
| GET | `/data/{translationId}/{bookId}/{chapter}` | Get verses in one chapter |
| GET | `/data/{translationId}/random/{bookIds?}` | Get a random verse, optionally constrained to one or more books, `OT`, or `NT` |

## Parameters and headers
- User-input requests accept flexible references like `john 3:16`, `jn 3:16`, or ranges like `matt 25:31-33,46`
- `translation` query parameter changes the translation, for example `kjv`
- Parameterized API uses exact identifiers like `web`, `JHN`, and chapter numbers
- Single-chapter-book matching can be changed with header `X-Single-Chapter-Book-Matching: indifferent` or an equivalent URL parameter shown on the docs page
- `bookIds` for the random endpoint is a comma-separated list such as `MAT,MRK,LUK,JHN`

## Response and error notes
- User-input lookups return verse metadata and text for the matched reference
- `/data` resources are hierarchical and link deeper into the translation/book/chapter tree
- Documented error body format:

```json
{
  "detail": "..."
}
```

## Rate limits
No numeric rate limit is published on the reviewed homepage.

## Pagination
No pagination scheme is documented on the reviewed homepage.

## Important usage notes
- The site documents both a flexible user-input API and a stricter identifier-based API.
- For deterministic integrations, the `/data/*` hierarchy is safer than free-text references.
- The docs explicitly call out ambiguity for single-chapter books like Jude and Philemon.

## fireROUTE notes
- Treat the flexible reference route as a convenience search/lookup endpoint.
- Prefer `/data/{translationId}/{bookId}/{chapter}` when fireROUTE needs stable identifiers.
- Preserve the single-chapter-book override header as an optional passthrough.
