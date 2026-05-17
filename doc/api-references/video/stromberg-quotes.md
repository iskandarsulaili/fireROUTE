# Stromberg Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `stromberg-quotes`
- Official docs pages used:
  - `https://stromberg-api.de/`
- Main API base URL: `https://stromberg-api.de/api`
- Auth model: none
- Supported request method in reviewed docs: `GET`
- Primary response format: `application/json`
- Manually confirmed route count: `13`

## Authentication
- The official site says the API is free and requires no authentication.

## API-wide behavior
- The API docs are embedded directly on the main official site.
- The reviewed docs describe read-only JSON endpoints for quotes, episodes, and characters.
- The site does not document POST/PUT/PATCH/DELETE routes.
- The site does not publish rate-limit headers or numeric quota limits.
- The site does not describe pagination; all documented routes appear to be simple single-shot GET requests.

## Canonical endpoints

### Quotes
#### 1) List quotes
- Method: `GET`
- Path: `/quotes`
- Purpose: return all quotes with associated episode and character information.

#### 2) Get random quote
- Method: `GET`
- Path: `/quotes/random`
- Purpose: return one random quote with related associations.

#### 3) Get quote by ID
- Method: `GET`
- Path: `/quotes/{id}`
- Purpose: return one quote by its ID.
- Path parameters:
  - `id` - quote identifier

#### 4) Search quotes
- Method: `GET`
- Path: `/quotes/search/{query}`
- Purpose: search quotes by partial quote text.
- Path parameters:
  - `query` - partial quote text to search for

#### 5) List quotes by season
- Method: `GET`
- Path: `/quotes/season/{season}`
- Purpose: return all quotes from one season.
- Path parameters:
  - `season` - season number; the docs explicitly say `1-5`

### Episodes
#### 6) List episodes
- Method: `GET`
- Path: `/episodes`
- Purpose: return all episodes with title, direction, screenplay, and related metadata.

#### 7) Get random episode
- Method: `GET`
- Path: `/episodes/random`
- Purpose: return one random episode.

#### 8) Get episode by ID
- Method: `GET`
- Path: `/episodes/{id}`
- Purpose: return one episode by ID.
- Path parameters:
  - `id` - episode identifier

#### 9) Search episodes
- Method: `GET`
- Path: `/episodes/search/{query}`
- Purpose: search episodes by partial title.
- Path parameters:
  - `query` - partial episode title

### Characters
#### 10) List characters
- Method: `GET`
- Path: `/characters`
- Purpose: return all characters.

#### 11) Get random character
- Method: `GET`
- Path: `/characters/random`
- Purpose: return one random character.

#### 12) Get character by ID
- Method: `GET`
- Path: `/characters/{id}`
- Purpose: return one character by ID.
- Path parameters:
  - `id` - character identifier

#### 13) Search characters
- Method: `GET`
- Path: `/characters/search/{query}`
- Purpose: search characters by partial name.
- Path parameters:
  - `query` - partial character name

## Usage notes
- The official example uses `fetch('https://stromberg-api.de/api/quotes/random')`.
- The site says all endpoints return JSON.
- The site presents the API as free to use.
- No auth, pagination, or error-schema details are published on the reviewed public page, so fireROUTE should treat those behaviors as undocumented.
