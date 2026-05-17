# Ron Swanson Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `ron-swanson-quotes`
- Official docs pages used:
  - `https://github.com/jamesseanwright/ron-swanson-quotes#ron-swanson-quotes-api`
  - `https://raw.githubusercontent.com/jamesseanwright/ron-swanson-quotes/master/README.md`
  - `https://raw.githubusercontent.com/jamesseanwright/ron-swanson-quotes/master/src/server.ts`
  - `https://raw.githubusercontent.com/jamesseanwright/ron-swanson-quotes/master/src/schema.json`
- Main API base URL: `https://ron-swanson-quotes.herokuapp.com`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON array of strings for quote routes; OpenAPI JSON for the schema route
- Manually confirmed route count: `4`

## Authentication
- The official README presents the service as public and unauthenticated.
- No API key, OAuth flow, or signed-request scheme is documented in the reviewed official sources.

## Canonical endpoints

### 1) Get one quote
- Method: `GET`
- Path: `/v2/quotes`
- Purpose: return one Ron Swanson quote wrapped in an array

### 2) Get multiple quotes
- Method: `GET`
- Path: `/v2/quotes/{count}`
- Purpose: return `{count}` randomly selected quotes

Path parameters:
- `count` - integer count parameter documented in the OpenAPI schema and README

### 3) Search quotes by term
- Method: `GET`
- Path: `/v2/quotes/search/{term}`
- Purpose: return quotes whose text matches the search term without case sensitivity

Path parameters:
- `term` - string search term

### 4) Get the published OpenAPI schema
- Method: `GET`
- Path: `/v2/schema`
- Purpose: return the provider's OpenAPI 3 schema document

## Request and response notes
- Quote routes return JSON arrays of strings rather than objects.
- The schema route returns JSON conforming to OpenAPI 3.
- The Express server sets `Access-Control-Allow-Origin: *` for all requests.
- The schema's `servers` block publishes `https://ron-swanson-quotes.herokuapp.com/v2`.

## Rate limits, pagination, and errors
- The official server source applies `express-rate-limit` with `windowMs: 2500` and `max: 10`, meaning 10 requests per 2.5-second window.
- No pagination model is documented.
- No formal error envelope is documented in the reviewed official sources.

## Usage notes
- The README marks the repository as archived as of 2026-01-19, but the official docs still document the public API surface above.
- The server logs request paths and timestamps but the reviewed official sources do not document any authentication or account-level quotas.
- The OpenAPI schema only documents `/quotes`, `/quotes/{count}`, and `/quotes/search/{term}` beneath the `/v2` server URL; `/v2/schema` is confirmed from the official server source.

## fireROUTE normalization notes
- Preserve the quote payload as an array of plain strings instead of coercing it into `{quote, author}` objects.
- Treat `/v2/schema` as a provider-metadata route, not a quote-content route.
- Search is documented as case-insensitive, so adapters should not over-constrain caller expectations about exact term casing.
