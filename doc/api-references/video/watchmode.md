# Watchmode

## Provider metadata
- Category: `Video`
- Provider slug: `watchmode`
- Official docs pages used:
  - `https://api.watchmode.com/`
  - `https://api.watchmode.com/docs/`
  - `https://api.watchmode.com/gateway/openapi`
- Main API base URL: `https://api.watchmode.com/v1`
- Auth model: query-string `apiKey`
- Supported request method: `GET`
- Response format: `application/json`
- Manually confirmed route count: `22`

## Authentication
- The official OpenAPI spec defines a single `apiKey` security scheme.
- The key is passed as a query parameter named `apiKey`.
- The docs landing page says free keys are available at `https://api.watchmode.com/requestApiKey/`.

## API-wide behavior
- The docs describe Watchmode as a streaming-availability and title-metadata API.
- Some operations consume different credit amounts; the title endpoints explicitly document higher credit cost when `title_id` is supplied as IMDb or TMDb identifiers instead of a native Watchmode ID.
- All documented operations in the reviewed public spec are `GET` requests.

## Canonical endpoints

### Account / quota
#### 1) Get API quota status
- Method: `GET`
- Path: `/status`
- Purpose: return account quota status information

### Reference data
#### 2) List streaming sources
- Method: `GET`
- Path: `/sources`
- Purpose: list streaming providers/sources

Query parameters:
- `regions` - optional comma-separated 2-letter country codes such as `US,GB`
- `types` - optional comma-separated source classes; docs list `sub`, `purchase`, `free`, and `tve`

#### 3) List supported regions
- Method: `GET`
- Path: `/regions`
- Purpose: list supported regions/countries

#### 4) List TV networks
- Method: `GET`
- Path: `/networks`
- Purpose: list TV networks

#### 5) List genres
- Method: `GET`
- Path: `/genres`
- Purpose: list genres

### Search
#### 6) Search for titles and people
- Method: `GET`
- Path: `/search`
- Purpose: search by name or external IDs

Query parameters:
- `search_field` - required; one of `name`, `imdb_id`, `tmdb_movie_id`, `tmdb_tv_id`, `tmdb_person_id`
- `search_value` - required search term or ID value
- `types` - optional comma-separated result filters such as `tv,movie,person`

#### 7) Autocomplete search
- Method: `GET`
- Path: `/autocomplete-search`
- Purpose: return autocomplete-style suggestions

Query parameters:
- `search_value` - required partial text
- `search_type` - optional integer filter: `1` titles+people, `2` titles only, `3` movies only, `4` TV only, `5` people only

#### 8) List and filter titles
- Method: `GET`
- Path: `/list-titles`
- Purpose: filter catalog titles with pagination

Query parameters:
- `types` - optional comma-separated title types; docs list `movie`, `tv_series`, `tv_special`, `tv_miniseries`, `short_film`
- `regions` - optional comma-separated 2-letter region codes
- `source_types` - optional comma-separated source types; docs list `sub`, `rent`, `buy`, `free`, `tve`
- `source_ids` - optional comma-separated source IDs from `/sources`
- `genres` - optional comma-separated genre IDs from `/genres`
- `network_ids` - optional comma-separated network IDs from `/networks`
- `languages` - optional comma-separated ISO 639 language codes
- `release_date_start` - optional integer date `YYYYMMDD`
- `release_date_end` - optional integer date `YYYYMMDD`
- `user_rating_low` - optional minimum user rating `0-10`
- `user_rating_high` - optional maximum user rating `0-10`
- `critic_score_low` - optional minimum critic score `0-100`
- `critic_score_high` - optional maximum critic score `0-100`
- `person_id` - optional Watchmode person ID filter
- `sort_by` - optional sort field; docs list `relevance_desc`, `relevance_asc`, `popularity_desc`, `popularity_asc`, `release_date_desc`, `release_date_asc`, `title_desc`, `title_asc`
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

Pagination notes:
- The official spec documents `page` and `limit` on this route.

### Titles
#### 9) Get title details
- Method: `GET`
- Path: `/title/{title_id}/details`
- Purpose: fetch primary metadata for a title

Path parameters:
- `title_id` - required title identifier; accepts native Watchmode ID, IMDb ID, or TMDb ID in `movie-278` / `tv-1396` form

Query parameters:
- `append_to_response` - optional comma-separated expansions; docs list `sources`, `seasons`, `episodes`, `cast-crew`
- `language` - optional ISO 639-1 language code, default `en`
- `regions` - optional region filter when `sources` is appended

Usage notes:
- The spec documents a 1-credit cost for native Watchmode IDs and 2 credits for IMDb/TMDb identifiers.
- Each appended relation adds 1 credit.

#### 10) Get title streaming sources
- Method: `GET`
- Path: `/title/{title_id}/sources`
- Purpose: fetch streaming availability for a title

Query parameters:
- `regions` - optional comma-separated 2-letter region codes; omitted means all regions

#### 11) Get title seasons
- Method: `GET`
- Path: `/title/{title_id}/seasons`
- Purpose: list seasons for a title

#### 12) Get title episodes
- Method: `GET`
- Path: `/title/{title_id}/episodes`
- Purpose: list episodes for a title

#### 13) Get title cast and crew
- Method: `GET`
- Path: `/title/{title_id}/cast-crew`
- Purpose: list cast and crew entries for a title

Query parameters:
- `language` - optional ISO 639-1 language code for localized names, default `en`

#### 14) Report incorrect title data
- Method: `GET`
- Path: `/title/{title_id}/incorrect-data`
- Purpose: submit metadata/source problems for a title

Query parameters:
- `somethingWrongDescription` - optional `0` or `1` flag for bad overview/description
- `serviceIncorrect` - optional `0` or `1` flag for incorrect streaming-service info
- `sourceMissing` - optional `0` or `1` flag for missing source availability
- `somethingElseWrong` - optional `0` or `1` flag for other issue
- `somethingWrongDetails` - optional free-text explanation

### People
#### 15) Get person details
- Method: `GET`
- Path: `/person/{person_id}`
- Purpose: retrieve person details

Path parameters:
- `person_id` - required Watchmode person ID; the docs example uses a value starting with `7`

### Releases
#### 16) Get title release dates - simple
- Method: `GET`
- Path: `/releases`
- Purpose: list releases in a date window

Query parameters:
- `start_date` - optional PST-based lower bound, format `YYYYMMDD` or `YYYYMMDDHHMMSS`, default 30 days ago
- `end_date` - optional PST-based upper bound, same formats, default 30 days from now
- `limit` - optional result count `1-250`, default `250`

#### 17) Get title release dates - advanced
- Method: `GET`
- Path: `/title-release-dates`
- Purpose: list release dates with region filtering

Query parameters:
- `start_date` - optional lower bound in `YYYYMMDD` or `YYYYMMDDHHMMSS`
- `end_date` - optional upper bound in `YYYYMMDD` or `YYYYMMDDHHMMSS`
- `regions` - optional single or comma-separated region codes such as `US,GB,CA`

### Changes
#### 18) Get newly added titles
- Method: `GET`
- Path: `/changes/new_titles`
- Purpose: list newly added titles

Query parameters:
- `start_date` - optional PST-based lower bound, default 1 day ago
- `end_date` - optional PST-based upper bound, default current date
- `types` - optional comma-separated title types
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

#### 19) Get newly added people
- Method: `GET`
- Path: `/changes/new_people`
- Purpose: list newly added people

Query parameters:
- `start_date` - optional PST-based lower bound, default 1 day ago
- `end_date` - optional PST-based upper bound, default current date
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

#### 20) Get titles with changed sources
- Method: `GET`
- Path: `/changes/titles_sources_changed`
- Purpose: list titles whose streaming-source availability changed

Query parameters:
- `start_date` - optional PST-based lower bound, default 1 day ago
- `end_date` - optional PST-based upper bound, default current date
- `types` - optional comma-separated title types
- `regions` - optional region code, default `US`
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

#### 21) Get titles with changed details
- Method: `GET`
- Path: `/changes/titles_details_changed`
- Purpose: list titles whose metadata changed

Query parameters:
- `start_date` - optional PST-based lower bound, default 1 day ago
- `end_date` - optional PST-based upper bound, default current date
- `types` - optional comma-separated title types
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

#### 22) Get titles with changed episodes
- Method: `GET`
- Path: `/changes/titles_episodes_changed`
- Purpose: list titles whose episode data changed

Query parameters:
- `start_date` - optional PST-based lower bound, default 1 day ago
- `end_date` - optional PST-based upper bound, default current date
- `page` - optional page number, default `1`
- `limit` - optional page size `1-250`, default `250`

## Pagination and date-window notes
- Pagination is explicitly documented on `/list-titles` and the `/changes/*` endpoints through `page` and `limit`.
- Release and changes endpoints use PST-based date windows.
- The docs accept either `YYYYMMDD` or `YYYYMMDDHHMMSS` for timestamp-style filters where noted.

## Rate limits and quota headers
- The docs state that request limits depend on the current plan.
- The docs do not publish one fixed numeric ceiling in the reviewed pages.
- The docs tell clients to inspect these response headers:
  - `X-RateLimit-Limit` - maximum requests per minute
  - `X-RateLimit-Remaining` - remaining requests in the current window
  - `X-Account-Quota` - monthly quota limit
  - `X-Account-Quota-Used` - quota consumed this month

## Error and format notes
- The OpenAPI spec documents JSON responses for successful operations.
- Common non-200 responses in the reviewed spec include:
  - `400` for bad request patterns on search/list/release routes
  - `401` for authentication or account access problems
  - `404` for missing title/person resources on item routes

## Additional usage notes from official docs
- The docs include downloadable ID-mapping datasets such as `https://api.watchmode.com/datasets/title_id_map.csv` and `https://api.watchmode.com/datasets/person_id_map.csv`.
- The docs warn that some image URLs may be third-party-hosted and that integrators must verify licensing, rights, attribution, and caching requirements themselves.
- The docs label the API license as `Proprietary` in the reviewed OpenAPI document.

## fireROUTE normalization notes
- Preserve the provider's credit-cost semantics for `title_id` variants and `append_to_response` expansions; they materially affect request planning.
- Keep `/releases` and `/title-release-dates` separate because the official docs present them as simple vs. advanced release queries.
- Keep `/changes/new_titles`, `/changes/new_people`, `/changes/titles_sources_changed`, `/changes/titles_details_changed`, and `/changes/titles_episodes_changed` as distinct sync feeds.
- Preserve quota-response headers in adapters so fireROUTE can surface plan-dependent throttling and monthly usage state.
