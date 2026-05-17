# IMDbOT

## Provider metadata
- Category: `Video`
- Provider slug: `imdbot`
- Official pages manually reviewed:
  - `https://github.com/TelegramPlayground/Free-Movie-Series-DB-API`
  - `https://imdb.iamidiotareyoutoo.com/`
  - `https://imdb.iamidiotareyoutoo.com/docs/index.html`
  - `https://imdb.iamidiotareyoutoo.com/docs/swagger.json`
- Main API base URL: `https://imdb.iamidiotareyoutoo.com`
- Auth model: none documented
- Response formats: JSON for search endpoints, JPEG for poster retrieval, MP4 or JPEG for trailer/media retrieval
- Manually confirmed route count: `4`

## Authentication
- The official homepage and Swagger/OpenAPI docs describe the API as publicly accessible.
- No API key, OAuth flow, or token header is documented on the reviewed official pages.

## Canonical endpoints

### 1) Search titles
- Method: `GET`
- Path: `/search`
- Purpose: search IMDb titles, or fetch a detailed result for a specific IMDb title id

Query parameters:
- `q` - optional free-text search query
- `tt` - optional IMDb title id; the docs note that at least one of `q` or `tt` must be supplied
- `lsn` - optional integer season number when the IMDb id refers to a series
- `v` - optional integer API version flag, default `1`

Responses documented:
- `200` successful operation
- `400` invalid parameters
- `500` internal server error

### 2) Search streaming availability on JustWatch
- Method: `GET`
- Path: `/justwatch`
- Purpose: search where a movie or show is streaming

Query parameters:
- `q` - required search query
- `L` - optional language/country code, default `en_IN`

Responses documented:
- `200` successful operation
- `400` invalid parameters
- `500` internal server error

### 3) Fetch poster image
- Method: `GET`
- Path: `/photo/{id}`
- Purpose: return poster artwork for an IMDb title id when available

Path parameters:
- `id` - required IMDb title id

Query parameters:
- `w` - optional width
- `h` - optional height

Responses documented:
- `200` successful operation
- `400` invalid parameters
- `500` internal server error

### 4) Fetch trailer/media asset
- Method: `GET`
- Path: `/media/{id}`
- Purpose: return trailer media for an IMDb title id when available

Path parameters:
- `id` - required IMDb title id

Responses documented:
- `200` successful operation
- `400` invalid parameters
- `500` internal server error

## Request and response notes
- The official docs page is labeled `v0.3.1` and `OpenAPI 2.0`.
- The docs server section names `https://imdb.iamidiotareyoutoo.com` as the server URL.
- The published Swagger JSON also lists both `https` and `http` schemes, but the current official docs site serves the API over HTTPS.
- `/search` and `/justwatch` produce `application/json`.
- `/photo/{id}` produces `image/jpeg`.
- `/media/{id}` produces `video/mp4` and can also return `image/jpeg` according to the Swagger document.

## Pagination, rate limits, and errors
- No pagination contract is documented on the reviewed official pages.
- No numeric rate-limit policy is documented on the reviewed official pages.
- The official Swagger document consistently documents `200`, `400`, and `500` outcomes for the published endpoints.

## fireROUTE integration notes
- Treat `/search` as the primary title lookup route and preserve provider-specific options `tt`, `lsn`, and `v`.
- Treat `/justwatch` as a provider-specific availability lookup rather than a normalized video metadata endpoint.
- Media routes are binary-returning endpoints and should stay separate from JSON metadata flows.
