# An API of Ice And Fire

## Provider metadata
- Category: `Video`
- Provider slug: `an-api-of-ice-and-fire`
- Official docs pages used:
  - `https://anapioficeandfire.com/`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Root`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Books`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Characters`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Houses`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Authentication`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Pagination`
  - `https://github.com/joakimskoog/AnApiOfIceAndFire/wiki/Rate-limiting`
- Main API base URL: `https://anapioficeandfire.com/api`
- Alternate docs example base URL: `https://www.anapioficeandfire.com/api`
- Auth model: no authentication
- Supported request method: `GET`
- Response format: `application/json`
- Manually confirmed route count: `7`

## Authentication
- The official Authentication page says the API is open and requires no authentication.
- The same page says that because no authentication is required, there is only support for `GET` requests.

## API-wide behavior
- The root resource advertises three collection resources: books, characters, and houses.
- Collection endpoints are paginated automatically.
- Pagination is documented as 1-based.
- If `pageSize` is omitted, the default page size is `10`.
- The maximum documented `pageSize` is `50`.
- Pagination navigation is returned in the HTTP `Link` header with `next`, `prev`, `first`, and `last` relations.

## Canonical endpoints

### Discovery
#### 1) API root
- Method: `GET`
- Path: `/`
- Purpose: return the top-level resource map for books, characters, and houses

### Books
#### 2) List books
- Method: `GET`
- Path: `/books`
- Purpose: return the books collection

Query parameters:
- `name` - optional string filter for exact book name matching
- `fromReleaseDate` - optional date filter; include books released on or after the given date
- `toReleaseDate` - optional date filter; include books released on or before the given date
- `page` - optional 1-based page number
- `pageSize` - optional page size, default `10`, max `50`

#### 3) Get a specific book
- Method: `GET`
- Path: `/books/{id}`
- Purpose: return one book resource by numeric identifier

Path parameters:
- `id` - required numeric book ID

### Characters
#### 4) List characters
- Method: `GET`
- Path: `/characters`
- Purpose: return the characters collection

Query parameters:
- `name` - optional string filter
- `gender` - optional string filter
- `culture` - optional string filter
- `born` - optional string filter for birth year text
- `died` - optional string filter for death year text
- `isAlive` - optional boolean filter for alive/dead state
- `page` - optional 1-based page number
- `pageSize` - optional page size, default `10`, max `50`

#### 5) Get a specific character
- Method: `GET`
- Path: `/characters/{id}`
- Purpose: return one character resource by numeric identifier

Path parameters:
- `id` - required numeric character ID

### Houses
#### 6) List houses
- Method: `GET`
- Path: `/houses`
- Purpose: return the houses collection

Query parameters:
- `name` - optional string filter
- `region` - optional string filter
- `words` - optional string filter
- `hasWords` - optional boolean filter
- `hasTitles` - optional boolean filter
- `hasSeats` - optional boolean filter
- `hasDiedOut` - optional boolean filter
- `hasAncestralWeapons` - optional boolean filter
- `page` - optional 1-based page number
- `pageSize` - optional page size, default `10`, max `50`

#### 7) Get a specific house
- Method: `GET`
- Path: `/houses/{id}`
- Purpose: return one house resource by numeric identifier

Path parameters:
- `id` - required numeric house ID

## Resource field notes
- Book resources include `url`, `name`, `isbn`, `authors[]`, `numberOfPages`, `publisher`, `country`, `mediaType`, `released`, `characters[]`, and `povCharacters[]`.
- Character resources include `url`, `name`, `gender`, `culture`, `born`, `died`, `titles[]`, `aliases[]`, `father`, `mother`, `spouse`, `allegiances[]`, `books[]`, `povBooks[]`, `tvSeries[]`, and `playedBy[]`.
- House resources include `url`, `name`, `region`, `coatOfArms`, `words`, `titles[]`, `seats[]`, `currentLord`, `heir`, `overlord`, `founded`, `founder`, `diedOut`, `ancestralWeapons[]`, `cadetBranches[]`, and `swornMembers[]`.

## Pagination notes
- Pagination information is documented in the `Link` response header, not the JSON body.
- Documented link relations are `next`, `prev`, `first`, and `last`.
- Page numbering is 1-based.

## Rate limits
- The official Rate limiting page sets a limit of `20000 requests per day` per IP address.
- If the limit is exceeded, the docs say the API returns `403 Forbidden` for the rest of the 24-hour period.
- The docs recommend implementing client-side caching to avoid hitting the limit.

## Errors and format notes
- Success responses shown in the docs are JSON arrays for collections and JSON objects for item lookups.
- The reviewed docs do not publish a structured error body schema.
- The one explicit API-wide error behavior documented is `403 Forbidden` after exceeding the daily IP-based rate limit.

## Important usage notes
- The homepage sandbox shows the same route surface using the non-`www` host, while wiki examples commonly use the `www` host; both point at the same API family.
- fireROUTE adapters should preserve collection-level pagination via `page` and `pageSize` rather than trying to infer offsets.
- Because the API is read-only and `GET`-only, any fireROUTE mapping should treat it strictly as a lookup source.
