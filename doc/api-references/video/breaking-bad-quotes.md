# Breaking Bad Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `breaking-bad-quotes`
- Official docs pages used:
  - `https://github.com/shevabam/breaking-bad-quotes`
  - `https://raw.githubusercontent.com/shevabam/breaking-bad-quotes/master/README.md`
  - `https://raw.githubusercontent.com/shevabam/breaking-bad-quotes/master/server.js`
  - `https://raw.githubusercontent.com/shevabam/breaking-bad-quotes/master/quotesRepository.js`
  - `https://raw.githubusercontent.com/shevabam/breaking-bad-quotes/master/Breaking_Bad_Quotes_API.postman_collection.json`
- Main API base URL: `https://api.breakingbadquotes.xyz`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON array of quote objects
- Manually confirmed route count: `2`

## Authentication
- The official README presents the service as public and unauthenticated.
- No API key, OAuth flow, session cookie, or signed header is documented in the reviewed official sources.

## Canonical endpoints

### 1) Get one random quote
- Method: `GET`
- Path: `/v1/quotes`
- Purpose: return a single random Breaking Bad quote wrapped in an array

Response shape:
- Array of objects with at least:
  - `quote` - quote text
  - `author` - speaker name

### 2) Get multiple random quotes
- Method: `GET`
- Path: `/v1/quotes/{number}`
- Purpose: return `{number}` randomly selected quotes

Path parameters:
- `number` - requested quote count; the source parses this as a route parameter and defaults to `1` only when the optional parameter is omitted

Behavior notes:
- The implementation removes selected quotes from a temporary pool before choosing the next one, so one response does not repeat the same quote twice.
- If `{number}` exceeds the dataset size, the source caps the result length to the number of available quotes.

## Request and response notes
- The Express server sets `Access-Control-Allow-Origin: *` for all requests.
- The reviewed official sources only define read-only quote retrieval.
- Both the README and official Postman collection use the production host `https://api.breakingbadquotes.xyz`.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented in the reviewed official sources.
- No structured error schema is documented.
- Because the route parameter is optional in the server source, clients should prefer `/v1/quotes` for one quote and `/v1/quotes/{number}` for explicit multi-quote requests.

## fireROUTE normalization notes
- Preserve the array response shape even when only one quote is returned.
- Treat `number` as a count selector, not a quote ID.
- This provider is random-selection-only in the reviewed official sources; it does not expose searchable IDs, pagination cursors, or deterministic ordering.
