# ThronesApi

## Provider metadata
- Category: `Video`
- Provider slug: `thronesapi`
- Official docs pages used:
  - `https://thronesapi.com/`
  - `https://thronesapi.com/swagger/index.html?urls.primaryName=Game%20of%20Thrones%20API%20v2`
  - `https://thronesapi.com/swagger/v2/swagger.json`
- Main API base URL: `https://thronesapi.com`
- Auth model: no authentication documented in the reviewed v2 Swagger docs
- Supported request methods: `GET`, `POST`
- Response format: `application/json`
- Manually confirmed route count: `5`

## Authentication
- The reviewed Swagger v2 definition does not declare any auth or security scheme.
- The public homepage presents the API as directly browsable and links straight to the Swagger UI without any sign-in step.

## API-wide behavior
- The public Swagger UI exposes both `Game of Thrones API v1` and `Game of Thrones API v2`; this manual pass reviewed the currently linked v2 definition.
- The homepage states the service is a Game of Thrones character API and shows a browsable character list plus a detail card.
- The v2 Swagger description says it is `A Game of Thrones character and continent information service.`

## Canonical endpoints

### Characters
#### 1) List all characters
- Method: `GET`
- Path: `/api/v2/Characters`
- Purpose: return all character records

Response notes:
- Returns a JSON array of `CharacterModel` objects.

#### 2) Update a character
- Method: `POST`
- Path: `/api/v2/Characters`
- Purpose: change a character's info

Request body:
- JSON body matching `CharacterModel`
- Swagger lists accepted media types `application/json`, `text/json`, and `application/*+json`

Body fields:
- `id` - integer character ID
- `firstName` - string or null
- `lastName` - string or null
- `fullName` - string or null
- `title` - string or null
- `family` - string or null
- `image` - string or null; image filename
- `imageUrl` - string or null; full image URL

#### 3) Get one character by ID
- Method: `GET`
- Path: `/api/v2/Characters/{id}`
- Purpose: return one character record

Path parameters:
- `id` - required integer character ID

Response notes:
- Returns one `CharacterModel` object.

### Continents
#### 4) List all continents
- Method: `GET`
- Path: `/api/v2/Continents`
- Purpose: return all continent records

Response notes:
- Returns a JSON array of `ContinentModel` objects.

#### 5) Get one continent by ID
- Method: `GET`
- Path: `/api/v2/Continents/{id}`
- Purpose: return one continent record

Path parameters:
- `id` - required integer continent ID

Response notes:
- Returns one `ContinentModel` object.

## Schema notes
- `CharacterModel` contains `id`, `firstName`, `lastName`, `fullName`, `title`, `family`, `image`, and `imageUrl`.
- `ContinentModel` contains `id` and `name`.
- The Swagger schemas mark most string fields as nullable.

## Pagination
- No pagination parameters are documented on the reviewed v2 endpoints.
- The homepage UI paginates its own table view, but that pagination behavior is not documented as API query parameters in the v2 Swagger spec.

## Rate limits
- No numeric rate limit or quota policy is published in the reviewed homepage or v2 Swagger docs.

## Errors and format notes
- The v2 Swagger definition only documents `200 Success` responses for the reviewed operations.
- No structured error body schema is published in the reviewed v2 spec.
- Because the write route is publicly visible in Swagger without a documented auth scheme, integrators should validate real upstream behavior carefully before relying on write semantics.

## Important usage notes
- The character image URLs shown on the homepage live under `https://thronesapi.com/assets/images/`.
- fireROUTE should treat the reviewed route surface as small and schema-stable, but should not assume undocumented filtering or pagination behavior.
- The presence of both v1 and v2 in Swagger means adapters should pin to the documented `/api/v2/...` paths instead of guessing older paths.
