# Gutendex

Official page manually reviewed:
- https://gutendex.com/

## Overview
- Public API base URL: `https://gutendex.com`
- Authentication: none mentioned
- Response format: JSON
- Purpose: Project Gutenberg ebook metadata

Manual route count confirmed from the official docs: **2**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/books` | List and filter books |
| GET | `/books/{id}` | Get one book by Project Gutenberg ID |

## Confirmed query parameters for `GET /books`
- `author_year_start`
- `author_year_end`
- `copyright`
- `ids`
- `languages`
- `mime_type`
- `search`
- `sort`
- `topic`

## Pagination
The official docs explicitly document paginated list responses with:
- `count`
- `next`
- `previous`
- `results`

The docs say each page returns `0-32` book objects.

## Response and error notes
- Book objects include `id`, `title`, `subjects`, `authors`, `summaries`, `translators`, `bookshelves`, `languages`, `copyright`, `media_type`, `formats`, and `download_count`
- Person objects include `birth_year`, `death_year`, and `name`
- Error responses for individual-book lookups use:

```json
{
  "detail": "..."
}
```

## Rate limits
No numeric rate limit is published on the reviewed docs page.

## Important usage notes
- Default ordering is by popularity/download count.
- `languages` takes comma-separated two-character language codes.
- `ids` accepts comma-separated Gutenberg IDs.
- `mime_type` performs prefix matching, not only exact matching.

## fireROUTE notes
- `/books` is the primary searchable collection endpoint.
- Expose all documented filters as passthrough query parameters.
- Keep pagination driven by the provider's `next` and `previous` URLs or `page` traversal from returned links.
