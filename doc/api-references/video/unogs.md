# uNoGS

## Provider metadata
- Category: `Video`
- Provider slug: `unogs`
- Official docs pages used:
  - `https://rapidapi.com/unogs/api/unogsng`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_6e91cf3e-db2e-42f0-a0bd-57abebf521a2`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_77418ac9-5c43-416e-a6f5-a64fda1166f4`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_5439782b-b942-41ca-9bff-c9eb18666b7f`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_a155bdd5-04a0-47ae-b5ef-cb470f726f41`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_3ea3d207-03de-4143-aafd-7b7a6b8afa8c`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_1fdbcc1c-6296-420f-9c02-aa9dafe6174e`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_d46d08b2-62d4-47c0-904d-98166dbeb287`
  - `https://rapidapi.com/unogs/api/unogsng/playground/apiendpoint_707b75b9-ba31-4d6f-8a2a-088012a253f7`
  - `https://unogs.com/`
- Main API base URL: `https://unogsng.p.rapidapi.com`
- Auth model: RapidAPI API key plus RapidAPI host header
- Supported request method: `GET`
- Response format: JSON responses are implied by the RapidAPI playground and request examples; the reviewed public pages did not expose full response schemas in text form
- Manually confirmed route count: `8`

## Authentication
- The index lists auth as `apiKey`.
- The official RapidAPI playground exposes the provider host header `x-rapidapi-host: unogsng.p.rapidapi.com` on endpoint pages.
- The signed-in secret header value is not shown publicly in the reviewed pages, but this provider is distributed through RapidAPI and therefore requires a RapidAPI subscription/key in addition to the host header.

## Global usage notes from the official overview
- The overview states this is the "Next Generation uNoGS API" and describes it as a cleaner replacement for an older version.
- `countrylist` uses uNoGS-specific country IDs.
- The overview says those country IDs can be obtained from a `/country` endpoint, but the live v1 endpoint sidebar currently exposes `GET /countries`; prefer the live endpoint page.
- If `countrylist` is left blank, the overview says the API assumes all countries.
- The overview documents limit/offset pagination behavior for result sets: results are capped to the first `100`, `limit` can reduce that page size, and the next page should use an `offset` that advances by multiples of `limit`.
- The overview also still describes search-only concepts such as `country_andorunique` (`and`, `or`, `unique`) and `newdate`, but the reviewed v1 sidebar rendered no dedicated public search endpoint page in this session.

## Canonical endpoints

### 1) List genres
- Method: `GET`
- Path: `/genres`
- Purpose: return the genre reference list used by uNoGS title data and filters
- Parameters: none shown on the reviewed endpoint page

### 2) List countries
- Method: `GET`
- Path: `/countries`
- Purpose: return the country reference list used by `countrylist`
- Parameters: none shown on the reviewed endpoint page

### 3) Get images for a Netflix title
- Method: `GET`
- Path: `/images`
- Query parameters exposed by the endpoint page:
  - `offset`
  - `netflixid`
  - `limit`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/images?offset=3&netflixid=81037848&limit=2`

### 4) Get title countries
- Method: `GET`
- Path: `/titlecountries`
- Query parameters exposed by the endpoint page:
  - `netflixid`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/titlecountries?netflixid=81043135`

### 5) Get title genres
- Method: `GET`
- Path: `/titlegenres`
- Query parameters exposed by the endpoint page:
  - `netflixid`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/titlegenres?netflixid=81043135`

### 6) Get title details
- Method: `GET`
- Path: `/title`
- Query parameters exposed by the endpoint page:
  - `netflixid`
  - `imdbid`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/title?netflixid=81043135`
- Usage note:
  - The reviewed form exposes both `netflixid` and `imdbid`, but the public example only demonstrates `netflixid`; the page does not explain precedence when both are supplied.

### 7) Get expiring titles
- Method: `GET`
- Path: `/expiring`
- Query parameters exposed by the endpoint page:
  - `offset`
  - `limit`
  - `countrylist`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/expiring?countrylist=78%2C46`
- Usage note:
  - The overview's pagination notes apply to endpoints that expose `offset`/`limit`.

### 8) Get episode details/listing by title-season-episode identifiers
- Method: `GET`
- Path: `/episodes`
- Query parameters exposed by the endpoint page:
  - `netflixid`
  - `episodeid`
  - `seasonid`
- Official request example:
  - `GET https://unogsng.p.rapidapi.com/episodes?netflixid=70153392&episodeid=70150654&seasonid=70051768`

## Headers, pagination, rate limits, and errors
- The reviewed endpoint pages consistently show `Content-Type: application/json` and `x-rapidapi-host: unogsng.p.rapidapi.com` in the generated cURL examples.
- The auth key header value is not exposed publicly in the reviewed docs page, but the provider is RapidAPI-key gated.
- Official pagination guidance is documented only at the overview level: `limit` and `offset` are used for paging and result windows are capped at `100` rows.
- No numeric provider-specific rate-limit quota was published in the reviewed pages.
- The overview page shows plan cards (`BASIC` and `PRO`), but the reviewed public docs do not publish a request-per-minute or request-per-day limit.
- No provider-specific error schema or error-code table was exposed in the reviewed public pages.

## Format and implementation notes
- All reviewed public endpoint pages are read-only `GET` routes.
- The official product site `https://unogs.com/` confirms the same domain vocabulary around countries, search, and expiring/new titles, but it does not replace the RapidAPI endpoint reference.
- Because the current v1 sidebar exposed eight concrete endpoint pages and an empty `Search` group, fireROUTE should map only the eight reviewed routes unless the official RapidAPI docs later expose additional endpoint pages.
