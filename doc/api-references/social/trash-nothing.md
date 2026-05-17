# Trash Nothing

## Provider metadata
- Category: `Social`
- Provider slug: `trash-nothing`
- Official docs pages used:
  - `https://trashnothing.com/developer`
  - `https://trashnothing.com/api/v1.4/trashnothing-openapi.yaml`
- Main API base URL confirmed from the reviewed OpenAPI file: `https://trashnothing.com/api/v1.4`
- Specification format confirmed from the reviewed official docs: OpenAPI `2.0`
- Request/response formats confirmed in the reviewed docs: HTTPS requests, JSON responses, UTC ISO-8601 date-time fields, and query-parameter-based filtering/pagination
- Auth models confirmed from the reviewed docs:
  - `api_key` query parameter for public endpoints published in the OpenAPI file
  - the reviewed official spec repeatedly distinguishes behavior for `api key` requests versus `oauth` requests, which confirms an OAuth-capable user-context mode exists, but the reviewed official pages did not publish the OAuth token-flow endpoints themselves
- Manually confirmed route count: `12`

## Authentication
- The reviewed OpenAPI file publishes a single `securityDefinitions.api_key` scheme:
  - type: `apiKey`
  - name: `api_key`
  - location: `query`
- The same spec notes that some endpoints behave differently when using an API key instead of OAuth because API-key requests have no associated user.
- The reviewed developer landing page requires app registration before use, but it does not publish the OAuth authorization or token URLs needed to document that flow in more detail.

## API-wide behavior
- The reviewed developer page describes Trash Nothing as a REST API and points to the official OpenAPI spec at `https://trashnothing.com/api/v1.4/trashnothing-openapi.yaml`.
- The reviewed OpenAPI file says all date-time values are UTC and ISO-8601 formatted.
- The reviewed API families are grouped into:
  - users
  - posts
  - groups
- The reviewed OpenAPI file documents only `GET` operations for the published v1.4 surface.
- The reviewed routes use explicit query pagination via `page` and `per_page` rather than header-based pagination.

## Canonical endpoints

### 1) List posts by a user
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/users/{user_id}/posts`
- Purpose: retrieve posts created by a user
- Auth: `api_key` query scheme in the published spec

Confirmed path/query parameters from the reviewed OpenAPI file:
- `user_id` - required path parameter; use `me` for the current user
- `sort_by` - optional; `date`, `active`, or `distance`
- `types` - required comma-separated post types: `offer`, `wanted`, `admin`
- `sources` - required comma-separated source list: `groups`, `trashnothing`, `open_archive_groups`
- `group_ids` - optional comma-separated group IDs when using the `groups` source
- `per_page` - optional page size, `1` to `100`, default `20`
- `page` - optional page number, minimum `1`
- `device_pixel_ratio` - optional thumbnail-size hint, default `1.0`
- `latitude`, `longitude`, `radius` - optional geographic filters; `radius` max `80500`
- `date_min`, `date_max` - optional UTC date-time filters
- `outcomes` - optional outcome filter including special values such as empty string, `all`, and `not-promised`
- `include_reposts` - optional `0`/`1`, default `1`

Important notes from the reviewed spec:
- For API-key requests, using `trashnothing` or `open_archive_groups` in `sources` makes `latitude`, `longitude`, and `radius` required.
- For API-key requests, `group_ids` becomes required when `sources=groups`, and only open-archive groups are used.

Confirmed response codes from the reviewed spec:
- `200` success
- `400` missing or invalid parameters

### 2) Search posts by a user
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/users/{user_id}/posts/search`
- Purpose: search within a user's posts
- Auth: `api_key`

Confirmed path/query parameters from the reviewed OpenAPI file:
- `user_id` - required path parameter
- `search` - required search query
- `sort_by` - optional; `relevance`, `date`, `active`, or `distance`
- plus the same filtering fields reviewed on `/users/{user_id}/posts`, including `types`, `sources`, `group_ids`, `per_page`, `page`, `latitude`, `longitude`, `radius`, `date_min`, `date_max`, `outcomes`, and `include_reposts`

### 3) Search groups
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/groups`
- Purpose: search or discover groups
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `name` - optional text match against the group name
- `latitude` - optional location filter
- `longitude` - optional location filter
- `distance` - optional radius in kilometers, default `100`, maximum `150`
- `country` - optional ISO 3166-1 alpha-2 country code

### 4) Retrieve a group
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/groups/{group_id}`
- Purpose: fetch a single group record
- Auth: `api_key`

Confirmed path parameter from the reviewed OpenAPI file:
- `group_id` - required group identifier

Confirmed response codes:
- `200` success
- `404` group not found

### 5) Retrieve multiple groups
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/groups/multiple`
- Purpose: fetch multiple groups in one request
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `group_ids` - required comma-separated IDs; only the first `20` group IDs are used
- `latitude` - optional; when paired with longitude, each returned group can include `supported_point`
- `longitude` - optional; when paired with latitude, each returned group can include `supported_point`

Confirmed response codes:
- `200` success
- `400` missing or invalid parameters

### 6) List posts
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts`
- Purpose: list posts visible to the current auth context
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `sort_by` - optional; `date`, `active`, or `distance`
- `types` - required comma-separated types: `offer`, `wanted`, `admin`
- `sources` - required source list: `groups`, `trashnothing`, `open_archive_groups`
- `group_ids` - optional group filter
- `per_page` - optional page size, `1` to `100`, default `20`
- `page` - optional page number
- `device_pixel_ratio` - optional thumbnail-size hint
- `latitude`, `longitude`, `radius` - optional geographic filters
- `date_min`, `date_max` - optional UTC date-time filters
- `outcomes` - optional outcome filter
- `include_reposts` - optional repost toggle

Important notes from the reviewed spec:
- The reviewed page says this endpoint is capped at `1,000` retrievable posts when paging through the result set.
- If `latitude`, `longitude`, and `radius` are omitted, public posts are filtered by the current user's location preferences.

### 7) Search posts
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/search`
- Purpose: full-platform post search
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `search` - required query string
- `sort_by` - optional; `relevance`, `date`, `active`, or `distance`
- plus the same list/search filters reviewed on `/posts`, including `types`, `sources`, `group_ids`, `per_page`, `page`, `latitude`, `longitude`, `radius`, `date_min`, `date_max`, `outcomes`, and `include_reposts`

### 8) List all public posts
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/all`
- Purpose: retrieve a feed of all publicly published offer/wanted posts
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `types` - required; `offer` and/or `wanted`
- `date_min` - required UTC date-time, within one day or less of `date_max`, within the last `30` days
- `date_max` - required UTC date-time, within one day or less of `date_min`
- `per_page` - optional page size, `1` to `50`, default `20`
- `page` - optional page number
- `device_pixel_ratio` - optional thumbnail-size hint

Important notes from the reviewed spec:
- Unlike `/posts`, this feed is not limited to the first 1,000 results.
- Crossposted posts are not merged in this endpoint's response.

### 9) List all public post changes
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/all/changes`
- Purpose: retrieve a feed of changes affecting public posts
- Auth: `api_key`

Confirmed query parameters from the reviewed OpenAPI file:
- `date_min` - required UTC date-time within the last `30` days
- `date_max` - required UTC date-time
- `per_page` - optional page size, `1` to `50`, default `20`
- `page` - optional page number

Confirmed change types listed by the reviewed spec:
- `published`
- `deleted`
- `undeleted`
- `satisfied`
- `promised`
- `unpromised`
- `withdrawn`
- `edited`

### 10) Retrieve a post
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/{post_id}`
- Purpose: fetch a single post
- Auth: `api_key`

Confirmed path parameter from the reviewed OpenAPI file:
- `post_id` - required post identifier

Confirmed response codes:
- `200` success
- `403` caller lacks permission
- `404` post not found

### 11) Retrieve post display data
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/{post_id}/display`
- Purpose: retrieve a post plus related display helpers such as author and group data
- Auth: `api_key`

Confirmed path parameter from the reviewed OpenAPI file:
- `post_id` - required post identifier

Confirmed response fields shown by the reviewed spec include:
- `post`
- `author`
- `author_posts`
- `author_offer_count`
- `author_wanted_count`
- `groups`
- `user_can_reply`
- `viewed`
- `replied`
- `bookmarked`

### 12) Retrieve multiple posts
- Method: `GET`
- URL: `https://trashnothing.com/api/v1.4/posts/multiple`
- Purpose: fetch multiple posts by ID
- Auth: `api_key`

Confirmed query parameter from the reviewed OpenAPI file:
- `post_ids` - required comma-separated IDs; only the first `10` are returned

Confirmed response fields shown by the reviewed spec:
- `posts`
- `not_found`
- `forbidden`

## Pagination
- The reviewed API uses query-based pagination with `page` and `per_page`.
- Most listing/search endpoints reviewed expose `per_page` up to `100`.
- `/posts/all` and `/posts/all/changes` expose a stricter maximum `per_page` of `50`.
- The reviewed `/posts` endpoint notes a maximum retrievable window of `1,000` posts when paging, while `/posts/all` explicitly avoids that cap.

## Errors and rate limits
- The reviewed OpenAPI file documents route-level errors such as:
  - `400` for missing or invalid parameters
  - `403` for forbidden post access
  - `404` for missing posts/groups
- The reviewed official developer page and published OpenAPI file did not expose a central numeric rate-limit policy.
- No official response headers or retry windows for throttling were published on the reviewed pages.

## Important usage notes
- The reviewed OpenAPI file says all date-time values are UTC ISO-8601 strings.
- `/posts/all` and `/posts/all/changes` are explicitly limited to the last `30` days of public activity.
- API-key requests have weaker user context than OAuth requests, and the spec repeatedly calls out behavior differences around location-based filtering, open-archive groups, and user-specific fields.
- The developer landing page recommends ReDoc or Swagger UI generated from the official OpenAPI file for interactive exploration.
