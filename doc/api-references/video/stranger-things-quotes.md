# Stranger Things Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `stranger-things-quotes`
- Official docs pages used:
  - `https://github.com/shadowoff09/strangerthings-quotes`
  - `https://raw.githubusercontent.com/shadowoff09/strangerthings-quotes/main/README.md`
  - `https://raw.githubusercontent.com/shadowoff09/strangerthings-quotes/main/src/server.js`
  - `https://raw.githubusercontent.com/shadowoff09/strangerthings-quotes/main/src/quotesRepository.js`
- Main API base URL: `https://strangerthings-quotes.vercel.app`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON array of quote objects
- Manually confirmed route count: `2`

## Authentication
- The official README presents the service as public and unauthenticated.
- No token, API key, OAuth flow, or account setup is documented in the reviewed official sources.

## Canonical endpoints

### 1) Get one random quote
- Method: `GET`
- Path: `/api/quotes`
- Purpose: return one random Stranger Things quote wrapped in an array

### 2) Get multiple random quotes
- Method: `GET`
- Path: `/api/quotes/{number}`
- Purpose: return `{number}` random quotes

Path parameters:
- `number` - requested quote count; the server defaults to `1` when the optional parameter is omitted

Behavior notes:
- The quote repository prevents duplicates within a single response array.
- If `{number}` exceeds the number of stored quotes, the implementation caps the output to the dataset size.

## Request and response notes
- Responses are arrays of objects with `quote` and `author` fields.
- The Express app sets `Access-Control-Allow-Origin: *` for all routes.
- The site root `/` serves the project homepage, but the API surface confirmed from the official sources is the two `/api/quotes` routes above.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented in the reviewed official sources.
- No formal error envelope is documented.

## fireROUTE normalization notes
- Preserve the provider's array response shape even for single-quote requests.
- Treat `number` as a count selector, not a quote ID.
- The reviewed official sources only document random selection; clients should not assume stable IDs or deterministic ordering.
