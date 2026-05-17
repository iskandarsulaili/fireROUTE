# Game of Thrones Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `game-of-thrones-quotes`
- Official docs pages used:
  - `https://gameofthronesquotes.xyz/`
- Main API base URL: `https://api.gameofthronesquotes.xyz/v1`
- Auth model: none documented on the official homepage reviewed
- Supported request method: `GET`
- Response format notes: the homepage reviewed documents route URLs and usage examples, but does not publish a formal response schema or error envelope
- Manually confirmed route count: `7`

## Authentication
- The official homepage presents the API as a free public API.
- No API key, OAuth flow, session cookie, or signed-request requirement is documented on the official page reviewed.

## Canonical endpoints

### Quotes
#### 1) Random quote
- Method: `GET`
- Path: `/random`
- Purpose: return one random Game of Thrones quote

Parameters:
- None documented on the homepage reviewed.

#### 2) Random quote batch
- Method: `GET`
- Path: `/random/{count}`
- Purpose: return multiple random quotes

Path parameters:
- `count` - number of random quotes requested; the official example uses `5`

#### 3) Quotes by author
- Method: `GET`
- Path: `/author/{author}/{count}`
- Purpose: return quotes for a specific character/author slug

Path parameters:
- `author` - author slug; the official example uses `tyrion`
- `count` - number of quotes requested; the official example uses `2`

Important note:
- The homepage reviewed only documents the three-segment author route above. It does not separately show a single-quote `/author/{author}` variant, so that shorter route is not counted here.

### Houses
#### 4) List houses
- Method: `GET`
- Path: `/houses`
- Purpose: list houses with their members

Parameters:
- None documented on the homepage reviewed.

#### 5) House detail
- Method: `GET`
- Path: `/house/{house}`
- Purpose: return details for one house

Path parameters:
- `house` - house slug; the official example uses `lannister`

### Characters
#### 6) List characters
- Method: `GET`
- Path: `/characters`
- Purpose: list characters with their quotes

Parameters:
- None documented on the homepage reviewed.

#### 7) Character detail
- Method: `GET`
- Path: `/character/{character}`
- Purpose: return one character and that character's quotes

Path parameters:
- `character` - character slug; the official example uses `jon`

## Pagination
- No pagination parameters or pagination behavior are documented on the official homepage reviewed.

## Rate limits
- The official homepage reviewed does not publish a numeric rate limit or retry policy.

## Errors and format notes
- The homepage reviewed does not publish an error schema.
- The homepage focuses on human-readable usage examples and canonical URLs rather than field-by-field response definitions.
- Downstream fireROUTE handling should treat response bodies as provider-specific until a future pass confirms the payload schema from an additional official source page.

## Important usage notes
- All documented example routes are under the `https://api.gameofthronesquotes.xyz/v1` base path.
- The official examples use lowercase slugs in path parameters, for example `tyrion`, `lannister`, and `jon`.
- The site also links to an official GitHub repository and Postman collection, but the homepage alone was sufficient to manually confirm the route inventory above in this pass.

## fireROUTE normalization notes
- Preserve provider-specific path slugs exactly as supplied by callers.
- Because the official homepage does not document a formal error envelope or pagination contract, adapters should avoid inventing normalized pagination or error semantics.
