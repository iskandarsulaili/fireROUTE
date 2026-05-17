# Open Library

Official pages manually reviewed:
- https://openlibrary.org/developers/api
- https://openlibrary.org/dev/docs/api/search
- https://openlibrary.org/dev/docs/api/authors

## Overview
- Public API base URL: `https://openlibrary.org`
- Authentication: no API key or OAuth mentioned for the reviewed public endpoints
- Response formats explicitly documented: `JSON`, `YAML`, `RDF/XML`
- Primary use case: open book discovery, lookup, and related author/work metadata

Manual route count confirmed from the reviewed official docs: **4**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/search.json` | Search books and editions |
| GET | `/search/authors.json` | Search authors |
| GET | `/authors/{authorId}.json` | Fetch one author record by Open Library author key |
| GET | `/authors/{authorId}/works.json` | List works by an author |

## Confirmed parameters

### `GET /search.json`
- `q`: Solr query string
- `fields`: response fields to return; docs note `*` fetches all fields and is expensive
- `sort`: sort facet; docs mention examples such as `new`, `old`, `random`, and `key`
- `lang`: two-letter ISO 639-1 language code influencing preferred editions
- `offset` and `limit`: pagination controls
- `page` and `limit`: page-based pagination; docs state `page` starts at `1`

### `GET /search/authors.json`
- `q`: author search query

### `GET /authors/{authorId}/works.json`
- `limit`: docs show larger page sizes such as `?limit=100`
- `offset`: pagination offset for additional works

## Auth and rate limits
- The reviewed public docs do not require auth for the endpoints above.
- Official usage guidance asks clients making regular use to send a descriptive `User-Agent` header with contact information.
- Published rate limits:
  - default unidentified requests: `1 request/second`
  - identified requests with `User-Agent` and contact email: `3 requests/second`

## Pagination and response notes
- The search docs present `offset/limit` and `page/limit` pagination patterns.
- Author works docs say the default author-works response returns `50` works.
- The main API page emphasizes these APIs are for real-time, low-volume, human-centered use rather than bulk backend access.

## Important usage notes
- Open Library explicitly says not to scrape HTML pages; use API endpoints instead.
- The docs warn against harvesting data in bulk and suggest monthly data dumps for bulk access.
- Author JSON requests must be made against the canonical key path such as `/authors/OL23919A.json`; adding `.json` after the human-readable slug does not work.
- The search API is recommended instead of making hundreds of single-book requests.

## fireROUTE notes
- Treat `/search.json` as the primary search endpoint.
- Preserve Open Library query passthrough for advanced search behavior.
- Respect the low published request limits and identify fireROUTE with a contactable `User-Agent`.
