# Lexigram

## Provider metadata
- Category: `Health`
- Provider slug: `lexigram`
- Official docs/pages used:
  - `https://docs.lexigram.io/`
  - `https://docs.lexigram.io/view/metadata/Tzz4QKEK`
  - `https://docs.lexigram.io/api/collections/8682281/Tzz4QKEK?environment=8682281-e496d998-d224-49f3-93f2-ece442d064b0&segregateAuth=true&versionTag=latest`
  - `https://app.lexigram.io/` (referenced by the official docs for API-key issuance)
- Current public API host: `https://api.lexigram.io`
- Content-endpoint base path confirmed in the official collection: `/v4`
- Auth model: API key bootstrap plus bearer-token auth
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed docs pages or collection
- Manually confirmed route count: `3`

## Authentication and access
- The official docs say the API key is an encrypted JWT obtained from `https://app.lexigram.io/`.
- The docs say clients should make an empty `GET /auth/token` request with an `Authorization` header carrying a bearer-form API key in order to obtain an expiring token.
- The official Postman collection defines bearer auth for the content endpoints and sets `baseUrl` to `https://api.lexigram.io/v4`.

## Canonical endpoints
1. `GET /auth/token` - exchange the long-lived API key for an expiring bearer token
2. `POST /v4/extract/entities` - extract clinical entities, sections, contexts, and classifications from source text
3. `POST /v4/highlight/entities` - return HTML-enriched highlighting around detected entities

## Parameters and body notes
### `GET /auth/token`
- `Authorization` - required bearer-form API-key header per the official docs
- Request body: empty
- Response note from the docs: the returned token is exposed in the `token` property

### `POST /v4/extract/entities`
- `Authorization` - required bearer-token header for content endpoints
- `Content-Type: application/json`
- `text` - required input text to analyze
- `withContext` - optional boolean; shown in the official example
- `withMatchLogic` - optional match-behavior selector; the reviewed example uses `ignore-length`
- `withText` - optional boolean; shown in the official example
- `withLists` - optional beta boolean; the docs say list extraction is not enabled by default and must be set to `true` in POST bodies when needed

### `POST /v4/highlight/entities`
- `Authorization` - required bearer-token header for content endpoints
- `Content-Type: application/json`
- `text` - required input text to analyze
- `withContext` - optional boolean; shown in the official example
- `withMatchLogic` - optional match-behavior selector; the reviewed example uses `longest`

## Response, pagination, and error notes
- The docs and collection are JSON-centric; no XML or alternate wire format was documented.
- The auth section says `GET /auth/token` returns an expiring token in a `token` property.
- The extraction examples show response objects containing structures such as `matches`, `sections`, `lists`, `classification`, `contexts`, and `explanation` ranges with `begin` and `end` offsets.
- The highlight endpoint description says it returns HTML-enriched versions of the input text around found concepts to aid visualization.
- No pagination behavior is documented for the reviewed endpoints.
- No numeric rate limit or shared structured error catalog was published on the reviewed docs pages.

## Usage notes from the official docs
- The reviewed docs identify the service as `Lexigram Clinical NLP APIs`.
- The docs describe the extraction endpoint as matching input text against the Lexigraph to find concepts and determine types such as disease, drug, anatomy, procedure, mental health, and other.
- The docs include concept-classification guidance, section detection behavior, context handling, and beta list extraction notes.
- The official docs link example code, a UI demo playground, and a Postman collection.

## fireROUTE normalization notes
- Model this provider as a bearer-auth JSON API hosted on `https://api.lexigram.io`, with the reviewed content routes rooted at `/v4`.
- Preserve character-offset fields like `begin` and `end`; they are central to Lexigram's extraction output.
- Keep the extraction and highlighting operations separate because the official docs describe different output purposes for them.
- Treat `withLists` as an opt-in capability flag rather than assuming list extraction is always present.
