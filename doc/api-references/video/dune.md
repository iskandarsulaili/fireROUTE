# Dune

## Provider metadata
- Category: `Video`
- Provider slug: `dune`
- Official docs pages used:
  - `https://github.com/ywalia01/dune-api`
- Main API base URL: `https://the-dune-api.herokuapp.com`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON arrays
- Manually confirmed route count: `6`

## Authentication
- The official README presents the API as public and unauthenticated.
- No API key, token, or OAuth flow is documented.

## Canonical endpoints

### Quote routes
#### 1) Random quote
- Method: `GET`
- Path: `/quotes`
- Purpose: return a random quote

Response shape documented in the README:
- Array containing quote objects with `id` and `quote`

#### 2) Multiple random quotes
- Method: `GET`
- Path: `/quotes/{number}`
- Purpose: return an array with `{number}` quotes

Path parameters:
- `number` - number of quote records to return

#### 3) Quote by ID
- Method: `GET`
- Path: `/quotes/id/{id}`
- Purpose: return the quote that matches a specific quote id

Path parameters:
- `id` - quote identifier

### Book routes
#### 4) Random book
- Method: `GET`
- Path: `/books`
- Purpose: return a random book

Documented book fields:
- `id`
- `title`
- `year`
- `author`
- `wiki_url`

#### 5) Multiple random books
- Method: `GET`
- Path: `/books/{number}`
- Purpose: return an array with `{number}` books

Path parameters:
- `number` - number of book records to return

#### 6) Book by ID
- Method: `GET`
- Path: `/books/id/{id}`
- Purpose: return the book that matches a specific book id

Path parameters:
- `id` - book identifier

## Usage notes
- Although the repository description says the API provides book, character, movie, and quote data, the README page reviewed only documents `books` and `quotes` routes.
- No query-string filters or alternate response formats are documented.
- Every example response shown in the README is an array, even for single-record lookups.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented.
- No structured error schema is documented on the README page reviewed.

## fireROUTE normalization notes
- Preserve the provider's array-wrapped response behavior for single-item lookups because the README examples consistently use arrays.
- Model `{number}` as a count request rather than a resource identifier.
- Do not infer undocumented `characters` or `movies` endpoints from the repository description alone.
