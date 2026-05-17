# Open Movie Database

## Provider metadata
- Category: `Video`
- Provider slug: `open-movie-database`
- Official docs pages used:
  - `https://www.omdbapi.com/`
- Main API base URL: `https://www.omdbapi.com/`
- Secondary host noted by the docs: `https://img.omdbapi.com/` for the patron-only Poster API
- Auth model: query-string `apikey`
- Supported request method: `GET`
- Response formats documented: `JSON`, `XML`, and JSONP via `callback`
- Manually confirmed route count: `5`

## Authentication
- OMDb requires an API key on requests to the main API host and the poster host.
- The usage section documents requests in the form `https://www.omdbapi.com/?apikey=[yourkey]&`.
- The page reviewed does not document header-based auth; the key is passed as a query parameter.

## Canonical operations

### 1) Lookup by IMDb ID
- Method: `GET`
- Path: `/`
- Purpose: return one title by IMDb identifier

Required query parameters:
- `apikey` - required API key
- `i` - IMDb ID such as `tt1285016`

Optional query parameters:
- `type` - `movie`, `series`, or `episode`
- `y` - release year filter
- `plot` - `short` or `full`, default `short`
- `r` - `json` or `xml`, default `json`
- `callback` - JSONP callback name
- `v` - API version, default `1`, marked reserved for future use

### 2) Lookup by title
- Method: `GET`
- Path: `/`
- Purpose: return the best match for a title string

Required query parameters:
- `apikey` - required API key
- `t` - movie/series title

Optional query parameters:
- `type`
- `y`
- `plot`
- `r`
- `callback`
- `v`

### 3) Search titles
- Method: `GET`
- Path: `/`
- Purpose: search for multiple matching titles

Required query parameters:
- `apikey` - required API key
- `s` - search text

Optional query parameters:
- `type` - `movie`, `series`, or `episode`
- `y` - year filter
- `r` - `json` or `xml`, default `json`
- `page` - page number `1-100`, default `1`
- `callback` - JSONP callback name
- `v` - API version, default `1`

Pagination notes:
- Search pagination is explicitly documented through the `page` parameter.
- The change log notes that `totalResults` is returned at the root level to support paging.

### 4) Season and episode lookup
- Method: `GET`
- Path: `/`
- Purpose: retrieve season-level or episode-level data for series records

Required query parameters:
- `apikey` - required API key
- One of `t` or `i` to identify the series
- `Season` - documented in the change log for season retrieval

Optional query parameters:
- `Episode` - documented in the change log for episode retrieval within a season
- `plot`
- `r`
- `callback`
- `v`

Usage notes from the official change log:
- `?t=Game of Thrones&Season=1&Episode=1` was added for season+episode lookups.
- `?t=Game of Thrones&Season=1` returns all episodes for a season.
- `?i=tt0944947&Season=1` is also supported.

### 5) Poster API host
- Method: `GET`
- Path: `/`
- Base host: `https://img.omdbapi.com/`
- Purpose: retrieve poster assets from the patron-only poster API

Confirmed notes:
- The official page exposes the poster host separately from the metadata host.
- The page reviewed confirms `apikey` usage on the poster host but does not provide a parameter table for poster-specific queries.

## Response and error notes
- The API is described as RESTful.
- Structured metadata responses are available as `json` or `xml` via the `r` parameter.
- JSONP is supported through the `callback` parameter.
- The page reviewed does not publish a standalone error schema, but failures are returned in the requested response format.

## Rate limits and transport
- HTTPS is available and explicitly noted in the change log.
- The page reviewed does not publish a numeric rate limit.
- The poster API is restricted to patrons.

## fireROUTE normalization notes
- OMDb is effectively a query-driven single-path API, so operation identity comes from the required query parameter set rather than distinct URL paths.
- Preserve `page` and `totalResults` semantics on search operations.
- Keep season/episode lookups separate from simple title/ID lookups because their parameter requirements differ materially.
