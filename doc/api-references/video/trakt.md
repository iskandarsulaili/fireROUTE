# Trakt

## Provider metadata
- Category: `Video`
- Provider slug: `trakt`
- Official docs pages used:
  - `https://trakt.docs.apiary.io/`
  - `https://trakt.docs.apiary.io/introduction/required-headers`
  - `https://trakt.docs.apiary.io/introduction/status-codes`
  - `https://trakt.docs.apiary.io/introduction/rate-limiting`
  - `https://trakt.docs.apiary.io/introduction/pagination`
  - `https://trakt.docs.apiary.io/reference/authentication-oauth`
  - `https://trakt.docs.apiary.io/reference/authentication-devices`
  - `https://trakt.docs.apiary.io/reference/comments`
  - `https://trakt.docs.apiary.io/reference/search`
  - `https://trakt.docs.apiary.io/reference/sync`
- Main REST API base URL: `https://api.trakt.tv`
- Staging API base URL: `https://api-staging.trakt.tv`
- Website/OAuth host called out by the official docs: `https://trakt.tv`
- Required request headers confirmed by the official docs:
  - `Content-Type: application/json`
  - `User-Agent: MyAppName/1.0.0` (recommended format)
  - `trakt-api-key: [client_id]`
  - `trakt-api-version: 2`
  - `Authorization: Bearer TOKEN` for OAuth-authenticated requests
- Primary request format: JSON bodies for write calls; query strings on GET endpoints
- Primary response format: JSON resources/arrays plus pagination and rate-limit headers
- Manually confirmed route count: `12`

## Authentication
- The reviewed Trakt docs say all `POST`, `PUT`, and `DELETE` methods require a valid OAuth `access_token`.
- The same docs say some `GET` calls also require OAuth while others optionally return user-specific data if OAuth is sent.
- The OAuth flow docs say to create an application on the Trakt website to get a `client_id` and `client_secret`.
- The reviewed OAuth docs say the authorization flow uses the website host (`https://trakt.tv`) instead of the API host.
- The OAuth docs say access tokens are valid for `7 days` and should be refreshed with the returned `refresh_token`.
- The device-auth docs say the same `7 day` token lifetime applies after successful device authorization.

## API-wide behavior
- The intro page says Trakt should always be accessed over SSL.
- The reviewed intro docs list the production API at `https://api.trakt.tv` and the sandbox at `https://api-staging.trakt.tv`.
- The docs describe the API as using RESTful verbs: `GET`, `POST`, `PUT`, and `DELETE`.
- Methods marked `🔒` require OAuth; methods marked `🔓` optionally use OAuth.
- Methods marked `📄 Pagination` default to page `1` with `10` items per page unless documented otherwise.
- Pagination headers confirmed by the official docs:
  - `X-Pagination-Page`
  - `X-Pagination-Limit`
  - `X-Pagination-Page-Count`
  - `X-Pagination-Item-Count`

## Canonical endpoints

### OAuth and device authentication
#### 1) Redirect the user to Trakt authorization
- Method: `GET`
- URL family: `https://trakt.tv/oauth/authorize`
- Purpose: ask the user to sign in or sign up and approve the application's requested access

Confirmed flow/parameter notes from the official OAuth docs:
- The docs explicitly say to use the Trakt website hostname and the `/oauth/authorize` method rather than the API host.
- The returned redirect includes a temporary `code` and echoes `state` if one was sent.
- Optional URL parameters explicitly documented on the reviewed page:
  - `signup=true` - prefer the sign-up page
  - `prompt=login` - force the user to sign in and authorize again
- Important usage note: abort the flow if the returned `state` does not match the previously sent value.

#### 2) Exchange an authorization code for an access token
- Method: `POST`
- Path: `/oauth/token`
- Base URL: `https://api.trakt.tv`
- Purpose: exchange the authorization-code callback result for tokens

Confirmed JSON body fields:
- `code` - authorization code from the redirect
- `client_id` - Trakt application client ID
- `client_secret` - Trakt application client secret
- `redirect_uri` - redirect URI from application settings
- `grant_type` - must be `authorization_code`

Confirmed auth notes:
- The docs say to save the returned `access_token` for authenticated API requests.
- The docs say the `access_token` is valid for `7 days`.

#### 3) Refresh an OAuth access token
- Method: `POST`
- Path: `/oauth/token`
- Base URL: `https://api.trakt.tv`
- Purpose: exchange a saved refresh token for a fresh access token without prompting the user again

Confirmed JSON body fields:
- `refresh_token`
- `client_id`
- `client_secret`
- `redirect_uri`
- `grant_type` - must be `refresh_token`

Confirmed usage note:
- The refreshed `access_token` is again valid for `7 days` according to the reviewed docs.

#### 4) Generate new device-auth codes
- Method: `POST`
- Path: `/oauth/device/code`
- Base URL: `https://api.trakt.tv`
- Purpose: begin device authentication for limited-input clients

Confirmed JSON body fields:
- `client_id`

Confirmed usage notes:
- The docs say the response includes `device_code`, `interval`, `user_code`, `verification_url`, and `expires_in`.
- The docs recommend optionally generating a QR code that redirects to `verification_url` with the `user_code` appended.

#### 5) Poll for a device-auth access token
- Method: `POST`
- Path: `/oauth/device/token`
- Base URL: `https://api.trakt.tv`
- Purpose: poll until the user authorizes the device flow

Confirmed JSON body fields:
- `code` - the previously returned `device_code`
- `client_id`
- `client_secret`

Confirmed behavior and status notes:
- The docs say to poll at the returned `interval` and stop after `expires_in` seconds.
- The reviewed device-auth page documents these poll statuses:
  - `200` - success; save the `access_token`
  - `400` - pending authorization
  - `404` - invalid `device_code`
  - `409` - already used
  - `410` - expired
  - `418` - denied
  - `429` - polling too quickly

### Search and comments
#### 6) Look up content by external or Trakt IDs
- Method: `GET`
- Route family:
  - `/search/trakt/:id`
  - `/search/imdb/:id`
  - `/search/tmdb/:id`
  - `/search/tvdb/:id`
- Base URL: `https://api.trakt.tv`
- Purpose: resolve movies, shows, seasons, episodes, people, comments, or lists from known IDs

Confirmed route variants from the official docs:
- `/search/trakt/:id?id_type=movie`
- `/search/trakt/:id?id_type=show`
- `/search/trakt/:id?id_type=season`
- `/search/trakt/:id?id_type=episode`
- `/search/trakt/:id?id_type=person`
- `/search/tmdb/:id?id_type=movie`
- `/search/tmdb/:id?id_type=show`
- `/search/tmdb/:id?id_type=episode`
- `/search/tmdb/:id?id_type=person`
- `/search/tvdb/:id?id_type=show`
- `/search/tvdb/:id?id_type=episode`

Important usage note:
- The docs say using the search URL without `id_type` may return multiple results if multiple items match.

#### 7) Get a single comment or reply
- Method: `GET`
- Path: `/comments/:id`
- Base URL: `https://api.trakt.tv`
- Purpose: fetch one comment/reply plus reply count metadata

Confirmed usage note:
- The comments docs say this route indicates how many replies the comment has.
- The same docs say to call `/comments/:id/replies` to retrieve the actual reply objects.

#### 8) Get replies for a comment
- Method: `GET`
- Path: `/comments/:id/replies`
- Base URL: `https://api.trakt.tv`
- Auth: optional OAuth
- Purpose: return replies for a top-level comment

Confirmed behavior notes:
- The docs mark this route as `📄 Pagination`.
- The docs say replies can themselves have replies, in which case the same route is called again with the new comment ID.
- If OAuth is sent, the docs say replies from blocked users are filtered out automatically.

#### 9) Post a reply to a comment
- Method: `POST`
- Path: `/comments/:id/replies`
- Base URL: `https://api.trakt.tv`
- Auth: required OAuth
- Purpose: add a reply to an existing top-level comment

Confirmed JSON body fields:
- `comment` - required reply text
- `spoiler` - optional boolean, default `false`

Important usage notes from the official comments docs:
- Replies can only be added to top-level comments.
- Trying to reply to a reply returns `404`.
- The rules section reviewed on the comments page says comments must be at least `5 words`, comments of `200` words or more are automatically marked as reviews, comments must be in English, and apps should correctly mark spoilers.

### Sync / watch-history operations
#### 10) Get watched history
- Method: `GET`
- Path: `/sync/history`
- Base URL: `https://api.trakt.tv`
- Auth: required OAuth
- Purpose: list watched movies and episodes sorted by most recent watch activity

Confirmed route behavior:
- The docs mark the route as `📄 Pagination` and `✨ Extended Info`.
- The route can be limited to movies or episodes.
- Each history item contains a unique 64-bit `id` that can later be used with `/sync/history/remove`.

Confirmed example subresources from the reviewed page:
- `/history/movies/12601`
- `/history/shows/1388`
- `/history/seasons/3950`
- `/history/episodes/73482`

#### 11) Add items to watched history
- Method: `POST`
- Path: `/sync/history`
- Base URL: `https://api.trakt.tv`
- Auth: required OAuth
- Purpose: add movies, shows, seasons, or episodes to a user's watched history

Confirmed JSON body fields:
- `movies[]`
- `shows[]`
- `seasons[]`
- `episodes[]`

Confirmed media-object field:
- `watched_at` - UTC datetime for when the item was watched; the docs also mention `released` and `unknown` special handling in the reviewed section

Important usage note:
- The docs explicitly warn not to send duplicate item + `watched_at` combinations because Trakt does not deduplicate them for you.

#### 12) Remove items from watched history
- Method: `POST`
- Path: `/sync/history/remove`
- Base URL: `https://api.trakt.tv`
- Auth: required OAuth
- Purpose: remove watches, scrobbles, and checkins from a user's history

Confirmed JSON body fields:
- `movies[]`
- `shows[]`
- `seasons[]`
- `episodes[]`
- raw history IDs (64-bit integers) for deleting individual plays

Confirmed usage note:
- The docs say the `/sync/history` route returns an individual history ID for each item, which can then be supplied here to remove single plays.

## Rate limits
- The official intro docs say all API methods are rate limited.
- Exceeding the limit returns HTTP `429`.
- The docs say clients should inspect `X-Ratelimit` and retry after `Retry-After` seconds.
- Confirmed current limits from the reviewed page:
  - `AUTHED_API_POST_LIMIT` - all `POST`, `PUT`, and `DELETE`: `1 call per second`
  - `AUTHED_API_GET_LIMIT` - all authenticated `GET`: `1000 calls every 5 minutes`
  - `UNAUTHED_API_GET_LIMIT` - all unauthenticated `GET`: `1000 calls every 5 minutes`

## Status/error notes
- Confirmed common status codes from the official docs: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `405`, `409`, `410`, `412`, `420`, `422`, `423`, `426`, `429`, `500`, `502`, `503`, `504`, `520`, `521`, `522`.
- The docs call out `412 Precondition Failed` specifically for missing `application/json` content type.
- The docs call out `423 Locked User Account`, `410 Deactivated User Account`, and `426 VIP Only` as important Trakt-specific states.

## fireROUTE integration notes
- Always send `trakt-api-key`, `trakt-api-version: 2`, a JSON `Content-Type`, and a stable `User-Agent`.
- Treat `/oauth/authorize` as a website-host route on `https://trakt.tv`, but send token and API resource calls to `https://api.trakt.tv`.
- Preserve Trakt's pagination headers and 10-item default when building passthrough support.
- Preserve history-item IDs from `/sync/history`; the docs explicitly use them for precise deletions through `/sync/history/remove`.
- Respect Trakt's comment rules and spoiler handling when exposing write operations.
