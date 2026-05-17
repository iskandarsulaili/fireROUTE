# Movie Quote

## Provider metadata
- Category: `Video`
- Provider slug: `movie-quote`
- Official docs pages used:
  - `https://github.com/F4R4N/movie-quote/`
- Main API base URL: `https://movie-quote-api.herokuapp.com`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON
- Manually confirmed route count: `4`

## Authentication
- The official README presents the API as public and unauthenticated.
- No API key, token, or OAuth flow is documented.

## Canonical endpoints

### 1) Random quote
- Method: `GET`
- Path: `/v1/quote/`
- Purpose: return a random quote from the full quote dataset

### 2) Random quote with adult-language filtering
- Method: `GET`
- Path: `/v1/quote`
- Purpose: return a random quote while excluding quotes with adult language

Query parameters:
- `censored` - optional flag-style query parameter; the README says `?censored` hides quotes containing adult language

### 3) Quotes for a specific show
- Method: `GET`
- Path: `/v1/shows/{show_slug}`
- Purpose: return a random quote from the requested show or series

Path parameters:
- `show_slug` - show identifier; the official docs direct clients to `/v1/shows/` for the available slug list

### 4) List available show slugs
- Method: `GET`
- Path: `/v1/shows/`
- Purpose: return the list of available show slugs

## Usage notes
- The README describes the service as a Django REST Framework API for movie and series quotes.
- The docs only document read operations.
- The docs use a live hosted base URL on Heroku: `https://movie-quote-api.herokuapp.com`.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented.
- No structured error schema is documented on the README page reviewed.

## fireROUTE normalization notes
- Preserve `show_slug` as a provider-specific lookup key because the docs only promise slug-based show selection.
- Treat `?censored` as a boolean mode switch on quote retrieval rather than a separate resource collection.
- The API is essentially random-selection oriented; clients should not assume stable ordering or deterministic IDs from the reviewed docs alone.
