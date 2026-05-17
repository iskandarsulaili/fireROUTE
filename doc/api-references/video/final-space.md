# Final Space

## Provider metadata
- Category: `Video`
- Provider slug: `final-space`
- Official docs pages used:
  - `https://finalspaceapi.com/docs/`
  - `https://finalspaceapi.com/docs/` (Quote endpoint page reviewed through the docs sidebar)
- Main API base URL: `https://finalspaceapi.com/api/v0`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON
- Manually confirmed route count: `8`

## Authentication
- The official docs present the API as public and do not require authentication.

## Canonical endpoints

### 1) Endpoint index
- Method: `GET`
- Path: `/`
- Purpose: return metadata about the available API resources

### 2) List characters
- Method: `GET`
- Path: `/character`
- Purpose: return all characters

Collection notes:
- The docs intro sample shows an optional sort query with values `asc` or `desc`.

### 3) Get one character
- Method: `GET`
- Path: `/character/{id}`
- Purpose: return one character by id

Path parameters:
- `id` - character id

### 4) List episodes
- Method: `GET`
- Path: `/episode`
- Purpose: return all episodes

Collection notes:
- The docs intro sample shows an optional sort query with values `asc` or `desc`.

### 5) Get one episode
- Method: `GET`
- Path: `/episode/{id}`
- Purpose: return one episode by id

Path parameters:
- `id` - episode id

### 6) List locations
- Method: `GET`
- Path: `/location`
- Purpose: return all locations

Collection notes:
- The docs intro sample shows an optional sort query with values `asc` or `desc`.

### 7) Get one location
- Method: `GET`
- Path: `/location/{id}`
- Purpose: return one location by id

Path parameters:
- `id` - location id

### 8) List quotes
- Method: `GET`
- Path: `/quote`
- Purpose: return quotes from the show

Confirmed query parameters from the Quote docs page:
- `sort` - optional, `asc` or `desc`
- `limit` - optional numeric limit

Quote response fields documented:
- `id`
- `quote`
- `by`
- `character` - URL to the character endpoint
- `image` - image URL for the speaking character

## Response and usage notes
- The docs describe the API as RESTful and JSON-only.
- The introduction page says the base endpoint contains information about all available resources.
- The docs reviewed describe four resources: `character`, `episode`, `location`, and `quote`.
- The Quote page states there are currently `51` quotes sorted by id.

## Pagination, rate limits, and errors
- No formal page-number pagination is documented on the pages reviewed.
- The docs reviewed do not publish a numeric rate limit.
- The docs reviewed do not publish a structured error schema.

## fireROUTE normalization notes
- This provider is resource-oriented and mostly read-only list/detail retrieval.
- `sort` should be modeled as a provider-specific optional query parameter on collection routes.
- Related links embedded in objects, such as `character` URLs in quote objects, are useful foreign keys and should be preserved.
