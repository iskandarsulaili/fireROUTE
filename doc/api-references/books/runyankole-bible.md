# Runyankole Bible

Official page manually reviewed:
- https://runyankole-bible-api.vercel.app/

## Overview
- Public API base URL: `https://runyankole-bible-api.vercel.app`
- Authentication: none
- CORS: explicitly advertised as enabled
- Response format: JSON
- Dataset claim on homepage: 66 books and 31,106 verses in Runyankore-Rukiga

Manual route count confirmed from the official docs: **5**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/books` | List all 66 books |
| GET | `/api/verse?book={id}&chapter={n}&verse={n}` | Fetch one verse |
| GET | `/api/chapter?book={id}&chapter={n}` | Fetch all verses in a chapter |
| GET | `/api/search?q={term}` | Search verses by keyword |
| GET | `/api/random` | Fetch a random verse |

## Parameters
- `book` uses the provider's numeric book ID scheme; the homepage notes that Genesis is `10` and Revelation is `730`
- `chapter` and `verse` are numeric selectors
- `q` is a keyword search string

## Response notes
The reviewed homepage says all responses are JSON. The example endpoint descriptions indicate:
- `/api/books` returns book metadata
- `/api/chapter` returns all verses for a chapter
- `/api/verse` and `/api/random` return single-verse payloads
- `/api/search` returns search results for matching verses

## Rate limits
No numeric rate limit is published on the reviewed homepage.

## Pagination
No pagination scheme is documented on the reviewed homepage.

## Important usage notes
- The provider exposes a very small, stable read-only surface.
- Use `/api/books` first if you need to map numeric book IDs.
- The site explicitly frames the API as free and public.

## fireROUTE notes
- `/api/verse`, `/api/chapter`, and `/api/search` are the core content routes.
- Preserve the provider's numeric `book` identifiers instead of inventing alternate slugs.
