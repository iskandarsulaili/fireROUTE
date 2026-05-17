# TVDB

## Provider metadata
- Category: `Video`
- Provider slug: `tvdb`
- Official pages used:
  - `https://thetvdb.com/api-information`
  - `https://github.com/thetvdb/v4-api`
  - `https://raw.githubusercontent.com/thetvdb/v4-api/main/docs/swagger.yml`
- Main API base URL confirmed from the official Swagger file: `https://api4.thetvdb.com/v4`
- Supported auth model confirmed from the reviewed official pages: API-key login exchange for a bearer token, with optional subscriber PIN support
- Primary request/response formats confirmed from the reviewed official pages: JSON request bodies, JSON responses, bearer-token protected HTTP endpoints
- Manually confirmed route count: `67`

## Authentication
- The official API-information page says access is available for commercial projects and individual developers, with licensing/pricing tiers on the main site.
- The official GitHub README says API keys are created from the user's dashboard/API keys page.
- The official Swagger file documents the authentication flow:
  1. `POST /login` with JSON body containing `apikey`
  2. optionally include `pin` for user-supported/subscriber-key access
  3. receive a bearer token
  4. send an `Authorization: Bearer {token}` header on subsequent requests
- The reviewed Swagger description says the bearer token is valid for `1 month`.

## API-wide behavior
- The official GitHub README recommends either maintaining a local copy of TVDB data or putting a caching proxy in front of the API instead of sending all user traffic directly to TVDB.
- The same README explicitly recommends monitoring `/updates` to keep a local copy fresh.
- The Swagger file defines a reusable pagination `Links` object with:
  - `prev`
  - `self`
  - `next`
  - `total_items`
  - `page_size`
- The reviewed Swagger responses consistently use a top-level JSON envelope with `data` and `status`, and list endpoints often add `links`.

## Canonical endpoints

### Login and auth
#### 1) Create bearer token
- `POST /login`
- JSON body fields:
  - `apikey` - required
  - `pin` - optional subscriber PIN
- Confirmed responses:
  - `200` success with token payload
  - `401` invalid credentials

### Artwork
#### 2) Get artwork base record
- `GET /artwork/{id}`
#### 3) Get artwork extended record
- `GET /artwork/{id}/extended`
#### 4) List artwork statuses
- `GET /artwork/statuses`
#### 5) List artwork types
- `GET /artwork/types`

### Awards
#### 6) List awards
- `GET /awards`
#### 7) Get award by ID
- `GET /awards/{id}`
#### 8) Get extended award by ID
- `GET /awards/{id}/extended`
#### 9) Get award category by ID
- `GET /awards/categories/{id}`
#### 10) Get extended award category by ID
- `GET /awards/categories/{id}/extended`

### Characters
#### 11) Get character by ID
- `GET /characters/{id}`

### Companies
#### 12) List companies
- `GET /companies`
- Query parameter confirmed: `page`
#### 13) List company types
- `GET /companies/types`
#### 14) Get company by ID
- `GET /companies/{id}`

### Reference/metadata lists
#### 15) List content ratings
- `GET /content/ratings`
#### 16) List countries
- `GET /countries`
#### 17) List entity types
- `GET /entities`
#### 18) List genders
- `GET /genders`
#### 19) List genres
- `GET /genres`
#### 20) Get genre by ID
- `GET /genres/{id}`
#### 21) List inspiration types
- `GET /inspiration/types`
#### 22) List languages
- `GET /languages`
#### 23) List people types
- `GET /people/types`
#### 24) List season types
- `GET /seasons/types`
#### 25) List source types
- `GET /sources/types`

### Episodes
#### 26) List episodes
- `GET /episodes`
- Query parameter confirmed: `page`
#### 27) Get episode by ID
- `GET /episodes/{id}`
#### 28) Get extended episode by ID
- `GET /episodes/{id}/extended`
- Query parameter confirmed: `meta=translations`
#### 29) Get episode translation by language
- `GET /episodes/{id}/translations/{language}`

### Lists
#### 30) List public/editorial lists
- `GET /lists`
- Query parameter confirmed: `page`
#### 31) Get list by ID
- `GET /lists/{id}`
#### 32) Get list by slug
- `GET /lists/slug/{slug}`
#### 33) Get extended list by ID
- `GET /lists/{id}/extended`
#### 34) Get list translation by language
- `GET /lists/{id}/translations/{language}`

### Movies
#### 35) List movies
- `GET /movies`
- Query parameter confirmed: `page`
#### 36) Get movie by ID
- `GET /movies/{id}`
#### 37) Get extended movie by ID
- `GET /movies/{id}/extended`
- Query parameters confirmed:
  - `meta=translations`
  - `short=true|false`
#### 38) Filter/search movies by structured fields
- `GET /movies/filter`
- Confirmed query parameters reviewed in the official Swagger file:
  - `company`
  - `contentRating`
  - `country` - required
  - `genre`
  - `lang` - required
  - `sort` - `score`, `firstAired`, `name`
  - `status`
  - `year`
#### 39) Get movie by slug
- `GET /movies/slug/{slug}`
#### 40) Get movie translation by language
- `GET /movies/{id}/translations/{language}`
#### 41) List movie statuses
- `GET /movies/statuses`

### People
#### 42) List people
- `GET /people`
- Query parameter confirmed: `page`
#### 43) Get person by ID
- `GET /people/{id}`
#### 44) Get extended person by ID
- `GET /people/{id}/extended`
- Query parameter confirmed: `meta=translations`
#### 45) Get person translation by language
- `GET /people/{id}/translations/{language}`

### Search
#### 46) Search across entities
- `GET /search`
- The official Swagger file says the search index includes series, movies, people, and companies and is limited to `5k` results max
- Confirmed query parameters reviewed:
  - `query`
  - `q` - alias of `query`, marked for eventual deprecation
  - `type` - `movie`, `series`, `person`, or `company`
  - `year`
  - `company`
  - `country`
  - `director`
  - `language`
  - `primaryType`
  - `network`
  - `remote_id`
  - `offset`
  - `limit`
#### 47) Search by remote ID
- `GET /search/remoteid/{remoteId}`
- Official description says this can be used for IDs such as IMDB or EIDR

### Seasons
#### 48) List seasons
- `GET /seasons`
- Query parameter confirmed: `page`
#### 49) Get season by ID
- `GET /seasons/{id}`
#### 50) Get extended season by ID
- `GET /seasons/{id}/extended`
- Query parameter confirmed: `meta=translations`
#### 51) Get season translation by language
- `GET /seasons/{id}/translations/{language}`

### Series
#### 52) List series
- `GET /series`
- Query parameter confirmed: `page`
#### 53) Get series by ID
- `GET /series/{id}`
#### 54) Get series artworks
- `GET /series/{id}/artworks`
- Official note: artwork type IDs come from `/artwork/types`
#### 55) Get next aired information
- `GET /series/{id}/nextAired`
#### 56) Get extended series by ID
- `GET /series/{id}/extended`
- Query parameters confirmed in the official Swagger file include `meta=translations` and `short=true|false`
#### 57) Get episodes for a series season type
- `GET /series/{id}/episodes/{season-type}`
- Confirmed parameters:
  - `page` - required query parameter in the Swagger file
  - `season-type` - path parameter with examples `default`, `official`, `dvd`, `absolute`, `alternate`, `regional`
  - optional `season`
  - optional `episodeNumber`
  - optional `airDate` in `yyyy-mm-dd`
#### 58) Get translated episodes for a series season type
- `GET /series/{id}/episodes/{season-type}/{lang}`
- Confirmed parameters:
  - `page` - required
  - `season-type`
  - `lang`
#### 59) Filter/search series by structured fields
- `GET /series/filter`
- Confirmed query parameters reviewed in the official Swagger file include:
  - `company`
  - `contentRating`
  - `country` - required
  - `genre`
  - `lang` - required
  - `sort` - `score`, `firstAired`, `lastAired`, `name`
  - `sortType`
  - `status`
  - `year`
#### 60) Get series by slug
- `GET /series/slug/{slug}`
#### 61) Get series translation by language
- `GET /series/{id}/translations/{language}`
#### 62) List series statuses
- `GET /series/statuses`

### Updates
#### 63) Get changed entities
- `GET /updates`
- Confirmed query parameters:
  - `since` - required
  - `type` - optional entity/update type filter
  - `action` - optional `delete` or `update`
  - `page`
- Important note from the official description: update records include `methodInt` values indicating created (`1`), updated (`2`), or deleted (`3`) records, and may include merge-target info for duplicate deletions

### User and favorites
#### 64) Get current user info
- `GET /user`
#### 65) Get user info by numeric ID
- `GET /user/{id}`
#### 66) Get or create favorites
- `GET /user/favorites`
- `POST /user/favorites`
- POST request body schema is `FavoriteRecord` according to the official Swagger file

## Pagination
- The reviewed Swagger file shows `page` query parameters on many collection routes including `/companies`, `/episodes`, `/lists`, `/movies`, `/people`, `/seasons`, and `/series`.
- The official `Links` schema defines pagination metadata fields:
  - `prev`
  - `self`
  - `next`
  - `total_items`
  - `page_size`
- The `/search` endpoint also exposes `offset` and `limit` query parameters in addition to structured filters.

## Errors and status codes
- The official Swagger file commonly documents these response patterns:
  - `200` success
  - `400` invalid IDs, slugs, language values, or bad-format requests depending on route
  - `401` unauthorized
  - `404` record not found
- Specific reviewed examples include:
  - `/login` -> `401 invalid credentials`
  - `/movies/filter` -> `400 Invalid format parameter`
  - `/user/favorites` POST -> `400 Bad format`
  - `/series/{id}/episodes/{season-type}` -> `400` when `episodeNumber` is set without `season`

## Rate limits
- No numeric rate-limit table was exposed on the reviewed official API-information page, GitHub README, or official Swagger file.
- The official materials reviewed in this pass therefore confirm authentication and licensing requirements, but not a published request-per-minute/day quota.

## Important usage notes
- The licensing page on `thetvdb.com` currently lists a free tier for organizations under `$50k` annual revenue with attribution requirements, with paid tiers above that threshold.
- The GitHub README strongly recommends keeping a local mirror or using a caching proxy instead of depending on direct end-user traffic to the upstream API.
- The same README specifically recommends using `/updates` to keep a local database current.
- The Swagger description warns that the `score` field appears across many entities and should be treated only as a relative popularity hint, not as a stable semantic score.