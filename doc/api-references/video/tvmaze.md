# TVMaze

## Provider metadata
- Category: `Video`
- Provider slug: `tvmaze`
- Official docs pages used:
  - `https://www.tvmaze.com/api`
- Main API base URL: `https://api.tvmaze.com`
- Auth model: none for the public API documented on the page reviewed
- Supported request method: `GET`
- Response format: JSON; the docs explicitly describe HATEOAS/HAL-style links and embedding support
- Manually confirmed route count: `31`

## Authentication
- The public API documentation reviewed does not require API keys, OAuth, or session auth.
- The docs separately mention a Premium user-level API, but that is distinct from the free public API documented on this page.

## Canonical endpoints

### Search and lookup
#### 1) Show search
- Method: `GET`
- Path: `/search/shows`
- Purpose: fuzzy search shows by name

Query parameters:
- `q` - required search string

#### 2) Show single search
- Method: `GET`
- Path: `/singlesearch/shows`
- Purpose: return a single best-match show

Query parameters:
- `q` - required search string
- `embed` - optional embedded related resource, such as `episodes`

#### 3) Show lookup by external ID
- Method: `GET`
- Path: `/lookup/shows`
- Purpose: resolve a show by external ID and redirect to the TVMaze show resource

Query parameters:
- One of `tvrage`, `thetvdb`, or `imdb` - external ID lookup key

Important behavior:
- The docs state a successful match returns HTTP `301` redirect to the show URL.
- Missing matches return HTTP `404`.

#### 4) People search
- Method: `GET`
- Path: `/search/people`
- Purpose: fuzzy search people by name

Query parameters:
- `q` - required search string

### Schedule
#### 5) Country/date schedule
- Method: `GET`
- Path: `/schedule`
- Purpose: list episodes airing in a given country on a given date

Query parameters:
- `country` - optional ISO 3166-1 country code, defaults to `US`
- `date` - optional ISO 8601 date, defaults to the current day

Usage notes:
- The docs call out that the United Kingdom code is `GB`, not `UK`.
- This schedule excludes global web channels like Netflix.

#### 6) Web/streaming schedule
- Method: `GET`
- Path: `/schedule/web`
- Purpose: list episodes airing on web/streaming channels for a date

Query parameters:
- `country` - optional ISO 3166-1 country code; omit for local + global web channels, use empty string for global-only
- `date` - optional ISO 8601 date, defaults to the current day

#### 7) Full schedule
- Method: `GET`
- Path: `/schedule/full`
- Purpose: return all future known episodes across countries

Important notes:
- The docs warn that this response is several MB.
- This endpoint is cached for 24 hours.

### Shows
#### 8) Show main information
- Method: `GET`
- Path: `/shows/{id}`
- Purpose: retrieve primary show information

Path parameters:
- `id` - required TVMaze show ID

Query parameters:
- `embed` - optional related resource such as `cast`

#### 9) Show episode list
- Method: `GET`
- Path: `/shows/{id}/episodes`
- Purpose: return all episodes in airing order

Path parameters:
- `id` - required show ID

Query parameters:
- `specials` - optional include significant and insignificant specials

#### 10) Show alternate lists
- Method: `GET`
- Path: `/shows/{id}/alternatelists`
- Purpose: list alternate episode orders for a show, such as DVD order

#### 11) Alternate list detail
- Method: `GET`
- Path: `/alternatelists/{id}`
- Purpose: retrieve one alternate list

Query parameters:
- `embed` - optional, documented example `alternateepisodes`

#### 12) Alternate list episodes
- Method: `GET`
- Path: `/alternatelists/{id}/alternateepisodes`
- Purpose: return episodes for an alternate list

Query parameters:
- `embed` - optional, documented example `episodes`

#### 13) Episode by number
- Method: `GET`
- Path: `/shows/{id}/episodebynumber`
- Purpose: retrieve one episode by season and episode number

Query parameters:
- `season` - required season number
- `number` - required episode number

#### 14) Episodes by date
- Method: `GET`
- Path: `/shows/{id}/episodesbydate`
- Purpose: retrieve all episodes for a given air date

Query parameters:
- `date` - required ISO 8601 date

#### 15) Show seasons
- Method: `GET`
- Path: `/shows/{id}/seasons`
- Purpose: list seasons for a show

#### 16) Season episodes
- Method: `GET`
- Path: `/seasons/{id}/episodes`
- Purpose: list episodes in a season

Query parameters:
- `embed` - optional related resource such as `guestcast`

#### 17) Show cast
- Method: `GET`
- Path: `/shows/{id}/cast`
- Purpose: list main cast entries

#### 18) Show crew
- Method: `GET`
- Path: `/shows/{id}/crew`
- Purpose: list main crew entries

#### 19) Show AKA list
- Method: `GET`
- Path: `/shows/{id}/akas`
- Purpose: list aliases for a show across countries

#### 20) Show images
- Method: `GET`
- Path: `/shows/{id}/images`
- Purpose: list available show images

#### 21) Show index
- Method: `GET`
- Path: `/shows`
- Purpose: paginated catalog of all shows

Query parameters:
- `page` - optional page number; docs explain the page window is based on show IDs and up to `250` results per page

Pagination notes:
- Continue incrementing `page` until the API returns HTTP `404` at end of list.
- The show index is cached for up to 24 hours.

### Episodes
#### 22) Episode main information
- Method: `GET`
- Path: `/episodes/{id}`
- Purpose: retrieve one episode

Query parameters:
- `embed` - optional related resource such as `show`

#### 23) Episode guest cast
- Method: `GET`
- Path: `/episodes/{id}/guestcast`
- Purpose: list guest cast for an episode

#### 24) Episode guest crew
- Method: `GET`
- Path: `/episodes/{id}/guestcrew`
- Purpose: list guest crew for an episode

### People
#### 25) Person main information
- Method: `GET`
- Path: `/people/{id}`
- Purpose: retrieve one person

Query parameters:
- `embed` - optional related resource such as `castcredits`

#### 26) Person cast credits
- Method: `GET`
- Path: `/people/{id}/castcredits`
- Purpose: retrieve show-level cast credits

Query parameters:
- `embed` - optional related resource such as `show`

#### 27) Person crew credits
- Method: `GET`
- Path: `/people/{id}/crewcredits`
- Purpose: retrieve show-level crew credits

Query parameters:
- `embed` - optional related resource such as `show`

#### 28) Person guest cast credits
- Method: `GET`
- Path: `/people/{id}/guestcastcredits`
- Purpose: retrieve episode-level guest cast credits

Query parameters:
- `embed` - optional related resource such as `episode`

#### 29) Person index
- Method: `GET`
- Path: `/people`
- Purpose: paginated list of people

Query parameters:
- `page` - optional page number; docs note a maximum of `1000` results per page

### Updates
#### 30) Show updates
- Method: `GET`
- Path: `/updates/shows`
- Purpose: return show update timestamps

Query parameters:
- `since` - optional filter value `day`, `week`, or `month`

#### 31) Person updates
- Method: `GET`
- Path: `/updates/people`
- Purpose: return person update timestamps

Query parameters:
- `since` - optional filter value `day`, `week`, or `month`

## Embedding and link behavior
- The docs explicitly describe HAL-style `_links` objects and an `embed` query parameter.
- Embedded single resources include examples like `nextepisode`.
- Multiple embeds are supported with array syntax such as `?embed[]=episodes&embed[]=cast`.

## Images and media notes
- Most resources expose an `image` property with `medium` and `original` URLs when available.
- TVMaze permits direct linking to its image CDN, but recommends downstream caching.
- The docs state image URLs are immutable; if an item's primary image changes, the URL changes instead of the content changing in place.

## Rate limits, caching, CORS, and transport
- Rate limit: at least `20` calls every `10` seconds per IP.
- Exceeding the limit may return HTTP `429`; the docs recommend backing off for a few seconds and retrying.
- The docs warn that leaving more than one HTTP connection idle may result in IP blocking.
- TVMaze recommends sending a unique HTTP `User-Agent`.
- All endpoints are CORS-enabled.
- HTTPS is the default for API and image links, though the docs say unencrypted HTTP still works.
- General API output is cached for `60` minutes.
- `/schedule/full` and `/shows?page=...` are explicitly documented as cached for up to `24` hours.

## Error and format notes
- Standard success responses are JSON documents or arrays.
- Documented non-200 behaviors include HTTP `301` for successful external-ID lookup redirects, HTTP `404` for missing resources or index exhaustion, and HTTP `429` for rate limiting.

## Licensing and usage notes
- The page reviewed states the public TVMaze API is licensed under `CC BY-SA`.
- TVMaze requires attribution and compliance with the ShareAlike provision.

## fireROUTE normalization notes
- Preserve `embed` and `embed[]` semantics rather than flattening embedded relations into a single canonical projection.
- Treat `/lookup/shows` as a lookup route with redirect semantics, not as a normal resource fetch.
- Treat `/shows` and `/people` as paginated index endpoints with documented `404` end-of-list behavior.
- Keep schedule endpoints separate: `/schedule`, `/schedule/web`, and `/schedule/full` have materially different scope and caching behavior.
