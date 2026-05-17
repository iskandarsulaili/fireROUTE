# The Lord of the Rings

## Provider metadata
- Category: `Video`
- Provider slug: `the-lord-of-the-rings`
- Official docs pages used:
  - `https://the-one-api.dev/documentation`
- Main API base URL: `https://the-one-api.dev/v2`
- Auth model: bearer token for most routes; the docs page lists the book resource group as the public entry point
- Supported request method: `GET`
- Response format: JSON
- Manually confirmed route count: `14`

## Authentication
- The documentation says responses are JSON and that most routes require an access key sent as an authorization header.
- Documented header format: `Authorization: Bearer your-api-key-123`
- The docs page explicitly marks `/book` and `/book/{id}` as public routes in its route table.
- The same page says authenticated access is limited to `100` requests every `10` minutes.

## Canonical endpoints

### Book routes
#### 1) List books
- Method: `GET`
- Path: `/book`
- Purpose: list all Lord of the Rings books

#### 2) Get one book
- Method: `GET`
- Path: `/book/{id}`
- Purpose: return one specific book

Path parameters:
- `id` - book identifier

#### 3) List chapters for one book
- Method: `GET`
- Path: `/book/{id}/chapter`
- Purpose: return all chapters for a specific book

Path parameters:
- `id` - book identifier

### Movie routes
#### 4) List movies
- Method: `GET`
- Path: `/movie`
- Purpose: list all movies, including the Lord of the Rings and Hobbit trilogies

#### 5) Get one movie
- Method: `GET`
- Path: `/movie/{id}`
- Purpose: return one specific movie

Path parameters:
- `id` - movie identifier

#### 6) List quotes for one movie
- Method: `GET`
- Path: `/movie/{id}/quote`
- Purpose: return quotes for one specific movie

Path parameters:
- `id` - movie identifier

### Character routes
#### 7) List characters
- Method: `GET`
- Path: `/character`
- Purpose: list characters with metadata such as name, gender, realm, race, and more

#### 8) Get one character
- Method: `GET`
- Path: `/character/{id}`
- Purpose: return one specific character

Path parameters:
- `id` - character identifier

#### 9) List quotes for one character
- Method: `GET`
- Path: `/character/{id}/quote`
- Purpose: return quotes associated with one specific character

Path parameters:
- `id` - character identifier

### Quote routes
#### 10) List quotes
- Method: `GET`
- Path: `/quote`
- Purpose: list all movie quotes

#### 11) Get one quote
- Method: `GET`
- Path: `/quote/{id}`
- Purpose: return one specific movie quote

Path parameters:
- `id` - quote identifier

#### 12) Get a random quote
- Method: `GET`
- Path: `/quotes/random/`
- Purpose: return one random movie quote

### Chapter routes
#### 13) List chapters
- Method: `GET`
- Path: `/chapter`
- Purpose: list all book chapters

#### 14) Get one chapter
- Method: `GET`
- Path: `/chapter/{id}`
- Purpose: return one specific book chapter

Path parameters:
- `id` - chapter identifier

## Shared query options
- `limit` - pagination size; the docs show `/character?limit=100`
- `page` - page number; the docs say the default limit is `10`
- `offset` - offset into the result set; the docs show `/character?offset=3`
- `sort` - sort expression with `field:direction`, for example `name:asc` or `character:desc`
- Filtering is documented as supported on list routes, alongside pagination and sorting

## Response shape and usage notes
- The documentation states that all datasets return JSON.
- The character collection is documented as including metadata like name, gender, realm, and race.
- The movie quote relation is documented as working for the Lord of the Rings trilogy.
- The official docs describe the project as fan-made and non-profit.

## Pagination, rate limits, and errors
- Pagination controls documented: `limit`, `page`, and `offset`
- Default page size noted by the docs: `10`
- Authenticated rate limit documented: `100` requests per `10` minutes
- The reviewed documentation page does not publish a structured error schema

## fireROUTE normalization notes
- Treat the API as a read-only catalog of books, movies, characters, chapters, and quotes.
- Preserve list-versus-detail route distinctions because nested quote and chapter endpoints are explicit resources, not query expansions.
- Keep shared list controls (`limit`, `page`, `offset`, `sort`) available on collection endpoints rather than inventing provider-specific pagination wrappers.
