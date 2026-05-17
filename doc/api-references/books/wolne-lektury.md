# Wolne Lektury

Official page manually reviewed:
- https://wolnelektury.pl/api/

## Overview
- API base URL: `https://wolnelektury.pl/api/`
- Authentication: no auth requirement is mentioned on the reviewed API page
- Response formats: JSON by default, with XML available by adding `?format=xml`
- Coverage described on the reviewed page: works, fragments, metadata, authors, epochs, genres, kinds, themes, collections, audiobooks, and DAISY resources

Manual route count confirmed from the reviewed official page: **15**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/books/` | List all works |
| GET | `/api/books/{bookSlug}/` | Get detailed data for one work |
| GET | `/api/books/{bookSlug}/fragments/{fragmentId}/` | Get detailed data for one fragment |
| GET | `/api/audiobooks/` | List audiobooks |
| GET | `/api/daisy/` | List DAISY resources |
| GET | `/api/authors/` | List authors |
| GET | `/api/authors/{authorSlug}/` | Get one author resource |
| GET | `/api/epochs/` | List epochs |
| GET | `/api/genres/` | List literary genres |
| GET | `/api/kinds/` | List literary kinds |
| GET | `/api/themes/` | List literary themes/motifs |
| GET | `/api/collections/` | List collections |
| GET | `/api/authors/{authorSlug}/kinds/{kindSlug}/books/` | List books matching combined author+kind filters |
| GET | `/api/authors/{authorSlug}/kinds/{kindSlug}/parent_books/` | Return only top-level works for a combined filter |
| GET | `/api/authors/{authorSlug}/themes/{themeSlug}/fragments/` | List fragments matching combined author+theme filters |

## Confirmed parameters and path variables
- `bookSlug`: work slug from a book resource `href`
- `fragmentId`: fragment identifier from a fragment resource `href`
- `authorSlug`: author slug from an author resource `href`
- `kindSlug`: literary kind slug
- `themeSlug`: literary theme slug
- `format=xml`: switches any documented request from default JSON serialization to XML

## Filtering and composition notes
- The reviewed page explicitly says authors, epochs, genres, and kinds can be combined to filter books.
- The reviewed page gives `/api/authors/adam-mickiewicz/kinds/liryka/books/` as an example of combined filtering.
- The reviewed page says `parent_books` can be used to return only top-level works while skipping subworks.
- The reviewed page says fragments can be filtered in the same way, including with themes and books, and gives `/api/authors/william-shakespeare/themes/zabawa/fragments/` as an example.
- Every list item is documented as containing an `href` attribute pointing to the detail resource.

## Auth and rate limits
- No auth requirement is mentioned on the reviewed API page.
- No rate limit is published on the reviewed API page.

## Pagination and response notes
- The reviewed API page documents JSON as the default response format.
- XML is available through `?format=xml`.
- No pagination scheme is documented on the reviewed API page.

## Important usage notes
- The API page is the canonical source for route discovery and describes the detail URLs as coming from each list item's `href` attribute.
- The reviewed docs present the API as a metadata/content discovery interface for works and fragments rather than as a search API with arbitrary query parameters.

## fireROUTE notes
- Preserve `href` values from list responses because the official docs rely on them for detail traversal.
- Treat the combined path-filter patterns as first-class route families rather than one-off examples.
- Keep `format=xml` available as a passthrough option because it is officially documented for any request.
