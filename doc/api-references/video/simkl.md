# Simkl

## Provider metadata
- Category: `Video`
- Provider slug: `simkl`
- Official docs pages used:
  - `https://simkl.docs.apiary.io/`
  - `https://simkl.docs.apiary.io/api-description-document`
- Main API base URL confirmed from the official API Blueprint: `https://api.simkl.com`
- Additional official first-party hosts referenced in the docs:
  - `https://simkl.com` for the browser authorization URL
  - `https://data.simkl.in` for calendar and trending JSON feeds
- Supported auth models confirmed on the reviewed official pages:
  - app-level `client_id` sent as the `simkl-api-key` header
  - OAuth 2.0 authorization-code flow
  - PIN/device-style authorization flow
  - bearer-token authorization for user-scoped endpoints
- Primary request/response formats confirmed from the reviewed official pages: JSON request bodies, JSON responses, and static JSON feed files
- Manually confirmed route count: `43` base API routes
- Additional official data-feed families confirmed but not counted in the `43` base API routes: calendar JSON feeds and trending JSON feeds under `https://data.simkl.in`

## Authentication
- The official docs require apps to create a Simkl application and use that app's `client_id` as the `simkl-api-key` header.
- The reviewed auth section shows the standard authorization-code browser flow:
  - `GET https://simkl.com/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&state=...`
  - `POST https://api.simkl.com/oauth/token`
- The official token page confirms the token-exchange JSON body fields:
  - `code`
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `grant_type=authorization_code`
- The same page says returned `access_token` values do not expire automatically and can instead be revoked by the user from Simkl connected-app settings.
- The reviewed PIN flow pages confirm:
  - `GET /oauth/pin{?client_id,redirect}` returns `device_code`, `user_code`, `verification_url`, `expires_in`, and `interval`
  - `GET /oauth/pin/{USER_CODE}{?client_id}` is polled until the user authorizes and an `access_token` is returned
- The reviewed docs consistently show bearer-token use via an `Authorization: Bearer {token}` header on user-scoped sync/settings/stat routes.

## API-wide behavior
- The API Blueprint declares HTTP verbs `GET`, `POST`, and `DELETE`.
- The official base host is `https://api.simkl.com`.
- Required headers section reviewed:
  - `Content-Type: application/json`
  - `simkl-api-key: {client_id}`
- The `Full Info` section says many endpoints return a minimal object by default and can be expanded with `extended={fields}`.
- The same section documents common extended-field values such as `full`, `title`, `slug`, `overview`, `metadata`, `theater`, `genres`, and `tmdb`.
- The reviewed docs note ISO-8601 timestamps and also include a timezone caveat in the dates section; timestamp handling should therefore be verified per endpoint during adapter implementation.

## Canonical endpoints

### OAuth and PIN authorization
#### 1) Authorize application
- Method: `GET`
- URL: `https://simkl.com/oauth/authorize`
- Canonical path: `/oauth/authorize{?response_type,client_id,redirect_uri,state}`
- Confirmed parameters:
  - `response_type` - required, must be `code`
  - `client_id` - required app client ID
  - `redirect_uri` - required callback URL from app settings
  - `state` - optional caller state value

#### 2) Exchange authorization code for bearer token
- Method: `POST`
- URL: `https://api.simkl.com/oauth/token`
- Canonical path: `/oauth/token`
- Confirmed JSON body fields:
  - `code`
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `grant_type=authorization_code`
- Confirmed documented error example: `401` with body `{ "error": "grant_error" }` for an invalid code

#### 3) Request device/PIN authorization code
- Method: `GET`
- Canonical path: `/oauth/pin{?client_id,redirect}`
- Confirmed parameters:
  - `client_id` - required
  - `redirect` - optional post-approval redirect URL
- Confirmed response fields:
  - `device_code`
  - `user_code`
  - `verification_url`
  - `expires_in`
  - `interval`

#### 4) Poll PIN status / receive access token
- Method: `GET`
- Canonical path: `/oauth/pin/{USER_CODE}{?client_id}`
- Confirmed parameters:
  - `USER_CODE` - required path parameter
  - `client_id` - required query parameter
- Confirmed response states from the reviewed docs:
  - authorization pending
  - slow down
  - success with `access_token`

### Ratings and redirect helpers
#### 5) Get rating data by Simkl ID
- Method: `GET`
- Canonical path: `/ratings{?simkl,fields,client_id}`
- Confirmed parameters:
  - `simkl`
  - `fields`
  - `client_id`
- Usage note: docs say this route can return Simkl/internal and external rating fields such as `simkl`, `ext`, `has_trailer`, `reactions`, and `year`

#### 6) Get ratings for a user's watchlist items
- Method: `GET`
- Canonical path: `/ratings{/type}{?user_watchlist,fields,client_id}`
- Auth: bearer token required according to the reviewed section
- Confirmed parameters:
  - `type`
  - `user_watchlist`
  - `fields`
  - `client_id`
- Confirmed watchlist status values shown in the docs: `all`, `watching`, `plantowatch`, `completed`, `dropped`, `hold`

#### 7) Redirect helper / website watched-link helper
- Method: `GET`
- Canonical path: `/redirect{?to,title,year,season,episode,client_id}`
- Confirmed parameters:
  - `to`
  - `title`
  - `year`
  - `season`
  - `episode`
  - `client_id`
- Important note: the docs use this same route family both for redirects to Simkl/trailer/Twitter and for `to=watched` links that mark an episode watched from a website/app flow

### Search
#### 8) Lookup by external or Simkl ID
- Method: `GET`
- Canonical path: `/search/id{?imdb,client_id}`
- Official section parameters visible in the reviewed blueprint include:
  - `simkl`
  - `hulu`
  - `netflix`
  - `mal`
  - `tvdb`
  - `tmdb`
  - `imdb`
  - `anidb`
  - `crunchyroll`
  - `anilist`
  - `kitsu`
  - `livechart`
  - `anisearch`
  - `animeplanet`
  - `type`
  - `title`
  - `year`
  - `client_id`
- Important note: the official docs explicitly mention support for both raw IDs and full IMDB URLs in the `imdb` parameter

#### 9) Search by text or source URL
- Method: `GET`
- Canonical path: `/search/{type}{?q,client_id}`
- Confirmed parameters:
  - `type` - `tv`, `anime`, or `movie`
  - `q` - search phrase or source URL
  - `client_id`
- Pagination note from the reviewed section: this route is marked paginated and the docs show `page` and `limit` usage in examples

#### 10) Identify media by filename
- Method: `POST`
- Canonical path: `/search/file`
- Confirmed auth/header note: docs show `simkl-api-key: [client_id]`
- Confirmed JSON body fields:
  - `file` - required filename/path string
  - `part` - optional multipart episode selector
  - `hash` - optional, marked `[IN_DEV]`

#### 11) Get random recommendations
- Method: `POST`
- Canonical path: `/search/random{?service,type,genre,rating_from,rating_to,rank_limi,year_from,year_to,limit,client_id}`
- Confirmed parameters named in the official route pattern:
  - `service`
  - `type`
  - `genre`
  - `rating_from`
  - `rating_to`
  - `rank_limi` (spelled this way in the reviewed docs route pattern)
  - `year_from`
  - `year_to`
  - `limit`
  - `client_id`

### TV catalog/discovery
#### 12) Get TV summary
- `GET /tv/{id}{?client_id}`
#### 13) Get TV episodes
- `GET /tv/episodes/{id}{?client_id}`
#### 14) Browse TV by genre/type/country/network/year/sort
- `GET /tv/genres/{genre}/{type}/{country}/{network}/{year}/{sort}{?client_id}`
#### 15) Get TV premieres
- `GET /tv/premieres/{param}{?type}{?client_id}`
#### 16) Get currently airing TV
- `GET /tv/airing?{date}{?sort}{?client_id}`
#### 17) Get best TV lists
- `GET /tv/best/{filter}{?type}{?client_id}`

### Anime catalog/discovery
#### 18) Get anime summary
- `GET /anime/{id}{?client_id}`
#### 19) Get anime episodes
- `GET /anime/episodes/{id}{?client_id}`
#### 20) Browse anime by genre/type/network/year/sort
- `GET /anime/genres/{genre}/{type}/{network}/{year}/{sort}{?client_id}`
#### 21) Get anime premieres
- `GET /anime/premieres/{param}{?type}{?client_id}`
#### 22) Get currently airing anime
- `GET /anime/airing?{date}{?sort}{?client_id}`
#### 23) Get best anime lists
- `GET /anime/best/{filter}{?type}{?client_id}`

### Movie catalog/discovery
#### 24) Get movie summary
- `GET /movies/{id}{?client_id}`
#### 25) Browse movies by genre/type/country/year/sort
- `GET /movies/genres/{genre}/{type}/{country}/{year}/{sort}{?client_id}`

### Scrobble
#### 26) Start playback scrobble
- `POST /scrobble/start`
#### 27) Pause playback scrobble
- `POST /scrobble/pause`
#### 28) Stop playback scrobble
- `POST /scrobble/stop`
#### 29) Check in / now watching
- `POST /scrobble/checkin`

### Sync and watch-history management
#### 30) Delete playback state
- `DELETE /sync/playback/{id}`
#### 31) Get last sync activities
- `GET /sync/activities`
#### 32) Get playback progress by type
- `GET /sync/playback/{type}`
#### 33) Get all synced items/watchlist items
- `GET /sync/all-items/{type}/{status}{?date_from}`
- Confirmed parameters and options reviewed in this section:
  - `type` such as `shows`, `movies`, `anime`
  - `status`
  - `date_from`
  - optional `extended` values including `full`, `full_anime_seasons`, `simkl_ids_only`, `ids_only`
  - optional `episode_watched_at=yes`
  - optional `next_watch_info=yes`
  - optional `memos=yes`

#### 34) Add watched/watching history items
- `POST /sync/history`
- Confirmed JSON body container keys shown in the docs:
  - `movies`
  - `shows`
  - `episodes`
- Confirmed status values discussed in the route notes: `watching`, `plantowatch`, `completed`, `dropped`, `hold`

#### 35) Remove history/list items
- `POST /sync/history/remove`
#### 36) Get user ratings by type/rating/date
- `POST /sync/ratings/{type}/{rating}{?date_from}`
#### 37) Add ratings
- `POST /sync/ratings`
#### 38) Remove ratings
- `POST /sync/ratings/remove`
#### 39) Add item to a list
- `POST /sync/add-to-list`
#### 40) Check whether items are watched
- `POST /sync/watched{?extended}`
- Confirmed query parameter:
  - `extended` with documented values including `counters`, `episodes`, and `specials`
- Important note from the reviewed docs: requests using `extended` are limited to a maximum of `100` items

### User routes
#### 41) Get recently watched background art
- `GET /users/recently-watched-background/{user_id}{?image,client_id}`
#### 42) Get/sync user settings
- `POST /users/settings`
#### 43) Get user stats
- `POST /users/{user_id}/stats`

## Additional official data feeds
- The official docs also publish calendar feed files, including:
  - `https://data.simkl.in/calendar/tv.json`
  - `https://data.simkl.in/calendar/anime.json`
  - `https://data.simkl.in/calendar/movie_release.json`
  - monthly archive patterns such as `https://data.simkl.in/calendar/{year}/{month}/tv.json`
- The official trending section publishes JSON ranking files under `https://data.simkl.in/discover/trending/` for combined, movie, TV, and anime charts plus DVD release feeds.
- These feed URLs ignore query strings according to the reviewed docs.

## Pagination
- The official pagination section says paginated endpoints default to `page=1` and `limit=10`.
- The same section documents response headers:
  - `X-Pagination-Page`
  - `X-Pagination-Limit`
  - `X-Pagination-Page-Count`
  - `X-Pagination-Item-Count`
- The reviewed `/search/{type}` section additionally says the endpoint is paginated and that the maximum items per page is `50`.

## Errors and rate limits
- The reviewed HTTP status section documents:
  - `200`, `201`, `204`, `302`
  - `400` invalid request
  - `401` missing/incorrect auth
  - `403` invalid API key, unapproved app, or requests denied due to API limits
  - `404` invalid URI or unsupported format
  - `409` conflict `[IN_DEV]`
  - `412` `client_id_failed` / incorrect client ID or total requests limit exceeded
  - `429` rate limit exceeded
  - `500`, `502`, `503` server-side problems
- The reviewed docs do not publish a single global numeric quota table, but they do explicitly document limit-related failures through `403`, `412`, and `429`.

## Important usage notes
- The getting-started section requires a visible link back to `https://simkl.com/` or directly to the relevant Simkl item when using the API.
- The same section explicitly restricts use in competing tracker/list services unless Simkl login and Sync functionality are integrated.
- The reviewed docs say free use is allowed for non-commercial use and for commercial use below `$150` monthly revenue; higher-revenue commercial use requires a commercial license.
- The docs explicitly tell developers to use TVDB and TMDB from their original sources if they need metadata APIs.
- The sync section is unusually strict: the official docs warn that clients should always consult `/sync/activities` first and then use `date_from` for incremental syncs; ignoring that guidance can get a `client_id` suspended.
- The trending-data section requires Simkl attribution in the UI/title and asks clients to send a descriptive `User-Agent` header to avoid accidental blocking.
- The calendar files are documented as generated every 6 hours and cached for 5 hours; the trending JSON feeds are documented as Cloudflare-cached for 1 hour.