# Creative Commons Catalog

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `creative-commons-catalog`
- Docs used manually:
  - `https://api.creativecommons.engineering/` (official legacy entry point; redirects to Openverse)
  - `https://api.openverse.org/v1/`
- Confirmed REST API base URL: `https://api.openverse.org`
- Primary media type: JSON
- Authentication model surfaced in docs: anonymous access is allowed; registered access uses OAuth2-style client registration plus bearer tokens
- Manually confirmed routes in this pass: `11`

## Provider/branding note
- The legacy Creative Commons Catalog docs URL now redirects to the official Openverse API reference.
- The reviewed official API is branded `Openverse`, which is the Creative Commons / WordPress open-licensed media search service.
- This provider file keeps the original fireROUTE slug but documents the currently official Openverse API surface exposed at the redirected docs host.

## Authentication
From the official Openverse API reference:
- anonymous access is supported
- registered users can create an application with `POST /v1/auth_tokens/register/`
- successful registration returns `client_id` and `client_secret`
- access tokens are then obtained from `POST /v1/auth_tokens/token/`
- subsequent authenticated requests send `Authorization: Bearer <access_token>`
- the token flow uses OAuth2 client credentials, as shown by the official example body:
  - `grant_type=client_credentials`
  - `client_id=<Openverse API client ID>`
  - `client_secret=<Openverse API client secret>`
- unverified newly registered apps remain subject to anonymous-user limits until email verification is completed

## Common request/response conventions
- Base URL: `https://api.openverse.org`
- Reviewed media-search routes are `GET` endpoints under `/v1/images/` and `/v1/audio/`.
- Search endpoints return paginated JSON objects with:
  - `result_count`
  - `page_count`
  - `page_size`
  - `page`
  - `results`
  - `warnings`
- Detail endpoints return a single media object.
- Error responses shown in the official reference include `400`, `401`, `404`, `429`, and in some places `500`.
- Rate-limited responses use HTTP `429`.

## Manually confirmed endpoint set

### 1) Register an API application
- Method: `POST`
- Path: `/v1/auth_tokens/register/`
- Full URL: `https://api.openverse.org/v1/auth_tokens/register/`
- Purpose: register an application for authenticated API access.
- Request body fields confirmed on the official page:
  - `name` - required application name
  - `description` - optional application description
  - `email` - required contact email
- Response notes confirmed on the official page:
  - success sample returns `name`, `client_id`, and `client_secret`
  - documented statuses include `201`, `400`, `401`, and `429`

### 2) Exchange credentials for an access token
- Method: `POST`
- Path: `/v1/auth_tokens/token/`
- Full URL: `https://api.openverse.org/v1/auth_tokens/token/`
- Purpose: obtain a bearer token for authenticated requests.
- Request fields confirmed on the official page:
  - `grant_type=client_credentials`
  - `client_id`
  - `client_secret`
- Response notes confirmed on the official page:
  - success sample returns `access_token`, `scope`, `expires_in`, and `token_type`
  - documented statuses include `200`, `400`, and `401`

### 3) Check current rate-limit usage
- Method: `GET`
- Path: `/v1/rate_limit/`
- Full URL: `https://api.openverse.org/v1/rate_limit/`
- Purpose: inspect the current caller's rate-limit state.
- Authentication confirmed on the official page:
  - documented example uses `Authorization: Bearer <access_token>`
- Response notes confirmed on the official page:
  - success sample returns `requests_this_minute`, `requests_today`, and `rate_limit_model`
  - documented statuses include `200`, `401`, `429`, and `500`

### 4) Search images
- Method: `GET`
- Path: `/v1/images/`
- Full URL: `https://api.openverse.org/v1/images/`
- Purpose: search open-licensed images.
- Query parameters directly confirmed from the official examples/reference:
  - `q` - search query
  - `license` - license filter, sample shows comma-separated values such as `pdm,by`
  - `categories` - category filter, sample shows `illustration`
  - `page_size`
  - `page`
- Query-syntax notes confirmed from official examples:
  - exact match search with quoted strings
  - boolean-ish query patterns like `dog+cat`, `dog|cat`, and `dog -pug`
  - prefix wildcard search like `net*`
  - fuzzy search like `theatre~1`
- Response notes confirmed on the official page:
  - returns paginated envelope with `result_count`, `page_count`, `page_size`, `page`, `results`, and `warnings`

### 5) Get image details
- Method: `GET`
- Path: `/v1/images/{identifier}/`
- Full URL pattern: `https://api.openverse.org/v1/images/{identifier}/`
- Purpose: retrieve a single image result in detail.
- Path parameters confirmed on the official page:
  - `identifier` - image UUID-like Openverse ID
- Response fields confirmed in the official sample include:
  - `id`, `title`, `indexed_on`, `foreign_landing_url`, `url`
  - `creator`, `creator_url`
  - `license`, `license_version`, `license_url`
  - `provider`, `source`, `category`
  - `filesize`, `filetype`, `tags`, `attribution`, `mature`
  - `height`, `width`
  - `thumbnail`, `detail_url`, `related_url`
- Documented statuses include `200`, `401`, and `404`

### 6) Get related images
- Method: `GET`
- Path: `/v1/images/{identifier}/related/`
- Full URL pattern: `https://api.openverse.org/v1/images/{identifier}/related/`
- Purpose: return related image results for an existing image item.
- Path parameters confirmed on the official page:
  - `identifier`
- Response notes confirmed on the official page:
  - returns the standard paginated search envelope
  - documented statuses include `200`, `401`, and `404`

### 7) Report an image
- Method: `POST`
- Path: `/v1/images/{identifier}/report/`
- Full URL pattern: `https://api.openverse.org/v1/images/{identifier}/report/`
- Purpose: submit a report for sensitive/problematic image content.
- Path parameters confirmed on the official page:
  - `identifier`
- Request body fields confirmed on the official page:
  - `identifier`
  - `reason` - sample shows `mature`
  - `description`
- Response notes confirmed on the official page:
  - success sample echoes `identifier`, `reason`, and `description`
  - documented statuses include `201`, `400`, `401`, and `404`

### 8) Resolve an image oEmbed response
- Method: `GET`
- Path: `/v1/images/oembed/`
- Full URL: `https://api.openverse.org/v1/images/oembed/`
- Purpose: retrieve an oEmbed-style payload from an Openverse image URL.
- Query parameters confirmed on the official page:
  - `url` - required image URL hosted under Openverse / supported image page
- Response notes confirmed on the official page:
  - success sample includes `version`, `type`, `width`, `height`, `title`, `author_name`, `author_url`, and `license_url`
  - documented statuses include `200`, `400`, `401`, and `404`

### 9) Search audio
- Method: `GET`
- Path: `/v1/audio/`
- Full URL: `https://api.openverse.org/v1/audio/`
- Purpose: search open-licensed audio.
- Query parameters directly confirmed from the official examples/reference:
  - `q`
  - `license`
  - `categories`
  - `page_size`
  - `page`
- Query-syntax notes confirmed on the official page match the image search operators: quoted phrases, `+`, `|`, exclusions, wildcard prefixes, and fuzzy search.
- Response notes confirmed on the official page:
  - returns the same paginated envelope shape as image search

### 10) Get audio details
- Method: `GET`
- Path: `/v1/audio/{identifier}/`
- Full URL pattern: `https://api.openverse.org/v1/audio/{identifier}/`
- Purpose: retrieve detailed metadata for a single audio result.
- Path parameters confirmed on the official page:
  - `identifier`
- Response fields confirmed in the official sample include:
  - `id`, `title`, `indexed_on`, `foreign_landing_url`, `url`
  - `creator`, `creator_url`
  - `license`, `license_version`, `license_url`
  - `provider`, `source`, `category`, `genres`
  - `filesize`, `filetype`, `tags`, `alt_files`, `attribution`, `mature`
  - `audio_set`, `duration`, `bit_rate`, `sample_rate`
  - `thumbnail`, `detail_url`, `related_url`, `waveform`
- Documented statuses include `200`, `401`, and `404`

### 11) Get audio source stats
- Method: `GET`
- Path: `/v1/audio/stats/`
- Full URL: `https://api.openverse.org/v1/audio/stats/`
- Purpose: return source-level audio corpus statistics.
- Response notes confirmed on the official page:
  - returns an array of objects with `source_name`, `display_name`, `source_url`, `logo_url`, and `media_count`
  - documented statuses include `200` and `401`

## Pagination
From the official auth/limits prose and search route examples:
- Openverse deliberately restricts pagination depth and page size, especially for anonymous users, to prevent scraping of the dataset.
- Search-style routes return `page`, `page_size`, `page_count`, and `result_count`.
- Authenticated users can request larger pages than anonymous users, but are still subject to total-query depth limits unless Openverse grants expanded access.
- The reference examples directly show `page` and `page_size` on media search endpoints.

## Rate limits
From the official API reference:
- all users are rate limited
- anonymous usage is supported and is sufficient for many use cases
- registered users automatically receive slightly higher limits
- further increases are available only by request
- rate-limited responses expose usage information via headers
- exceeding the limit returns `429 Too Many Requests`
- no fixed numeric anonymous/registered quotas are published on the reviewed reference page

## Error and response notes
- registration documents `201`, `400`, `401`, and `429`
- token exchange documents `200`, `400`, and `401`
- rate-limit inspection documents `200`, `401`, `429`, and `500`
- detail/search/report routes commonly document combinations of `200/201`, `400`, `401`, and `404`
- media detail payloads include canonical attribution, licensing, and convenience URLs (`thumbnail`, `detail_url`, `related_url`, etc.)
- search envelopes can include a `warnings` array in addition to results

## Important usage notes
- The official terms and auth prose explicitly say scraping is disallowed; Openverse intends the API for bounded application use, not bulk corpus extraction.
- Anonymous access exists, but authenticated access is the documented path for higher limits and larger pages.
- Newly registered applications should verify email to move beyond anonymous-like limits.
- The legacy `api.creativecommons.engineering` docs URL should now be treated as a redirector to the Openverse API.

## Verification notes
This file was manually rebuilt from the official redirected Openverse API reference using browser inspection.