# Twitter

## Provider metadata
- Category: `Social`
- Provider slug: `twitter`
- Official docs pages used:
  - `https://developer.twitter.com/en/docs` -> `https://docs.x.com/overview`
  - `https://docs.x.com/llms.txt`
  - `https://docs.x.com/x-api/llms.txt`
  - `https://docs.x.com/fundamentals/authentication/overview.md`
  - `https://docs.x.com/x-api/fundamentals/pagination.md`
  - `https://docs.x.com/x-api/fundamentals/rate-limits.md`
  - `https://docs.x.com/x-api/fundamentals/response-codes-and-errors.md`
  - `https://docs.x.com/x-api/users/get-user-by-username.md`
  - `https://docs.x.com/x-api/users/get-users-by-ids.md`
  - `https://docs.x.com/x-api/users/get-followers.md`
  - `https://docs.x.com/x-api/users/follow-user.md`
  - `https://docs.x.com/x-api/users/get-timeline.md`
  - `https://docs.x.com/x-api/posts/get-post-by-id.md`
  - `https://docs.x.com/x-api/posts/get-posts-by-ids.md`
  - `https://docs.x.com/x-api/posts/search-recent-posts.md`
  - `https://docs.x.com/x-api/posts/create-post.md`
  - `https://docs.x.com/x-api/posts/delete-post.md`
- Main API base URL: `https://api.x.com`
- Versioned API base pattern: `https://api.x.com/2`
- OAuth 2.0 authorization URL published in the reviewed OpenAPI security schemes: `https://api.x.com/2/oauth2/authorize`
- OAuth 2.0 token URL published in the reviewed OpenAPI security schemes: `https://api.x.com/2/oauth2/token`
- Auth models confirmed on the reviewed official pages:
  - Bearer-token app-only access for public-read routes
  - OAuth 2.0 user-context access for scoped user/read/write routes
  - OAuth 1.0a user context is still listed in the authentication overview as a supported method
  - Basic authentication is still listed for many enterprise APIs in the authentication overview
- Primary request formats confirmed on the reviewed pages: query-string parameters on `GET`, `application/json` for `POST /2/tweets`, and OAuth/token-flow references under the published security schemes
- Primary response formats confirmed on the reviewed pages: JSON success bodies plus JSON / `application/problem+json` error bodies
- Manually confirmed route count: `10`

## Authentication
- The official authentication overview says X supports multiple authentication models, including OAuth 1.0a user context, app-only access, basic authentication for many enterprise APIs, and OAuth 2.0 Authorization Code Flow with PKCE.
- The reviewed route pages consistently publish `BearerToken`, `OAuth2UserToken`, and/or `UserToken` security schemes.
- Read routes such as user lookup, post lookup, search, and followers allow bearer-token access according to the reviewed route pages.
- User-specific and write routes require user-context auth:
  - `POST /2/users/{id}/following` requires OAuth 2.0 scopes `follows.write`, `tweet.read`, and `users.read` on the reviewed page.
  - `POST /2/tweets` and `DELETE /2/tweets/{id}` require OAuth 2.0 scopes `tweet.read`, `tweet.write`, and `users.read` on the reviewed pages.
- The reviewed OpenAPI security schemes publish OAuth 2.0 endpoints at `https://api.x.com/2/oauth2/authorize` and `https://api.x.com/2/oauth2/token`.

## API-wide behavior
- The reviewed X API docs use the fixed versioned path prefix `/2` under `https://api.x.com`.
- The getting-started page demonstrates bearer-token requests directly against `https://api.x.com/2/...`.
- The reviewed lookup and search pages use X API field-selection and expansion patterns such as `user.fields`, `tweet.fields`, `media.fields`, `poll.fields`, `place.fields`, and `expansions`.
- The pagination guide says to request an initial page with `max_results`, then continue with the returned `meta.next_token` as `pagination_token` until `next_token` is omitted.
- The pagination guide says results are returned in reverse chronological order and that pagination tokens are opaque and should not be modified.
- The rate-limit guide says responses expose `x-rate-limit-limit`, `x-rate-limit-remaining`, and `x-rate-limit-reset` headers.
- The errors guide says a `200` response can still include an `errors` array alongside `data` for partially successful multi-resource lookups.

## Canonical endpoints

### Users
#### 1) Get user by username
- Method: `GET`
- Path: `/2/users/by/username/{username}`
- Purpose: retrieve a single user profile by username
- Auth on reviewed page: bearer token, OAuth 2.0 user token, or `UserToken`
- Path parameter:
  - `username` - required; pattern `^[A-Za-z0-9_]{1,15}$`
- Confirmed query parameters:
  - `user.fields`
  - `expansions`
  - `tweet.fields`
- Response notes:
  - success returns `data` as a user object
  - the reviewed schema also allows `includes` and `errors`

#### 2) Get users by IDs
- Method: `GET`
- Path: `/2/users`
- Purpose: retrieve multiple user profiles in one request
- Auth on reviewed page: bearer token, OAuth 2.0 user token, or `UserToken`
- Confirmed query parameters:
  - `ids` - required comma-separated user IDs; up to `100`
  - `user.fields`
  - `expansions`
  - `tweet.fields`
- Response notes:
  - success returns a `data` array of user objects
  - partial failures can appear in the `errors` array

#### 3) Get followers
- Method: `GET`
- Path: `/2/users/{id}/followers`
- Purpose: list the users following a specific user
- Auth on reviewed page: bearer token, OAuth 2.0 user token with `follows.read`, `tweet.read`, `users.read`, or `UserToken`
- Confirmed parameters:
  - `id` - required path user ID
  - `max_results` - optional integer from `1` to `1000`
  - `pagination_token` - optional base32 token
  - `user.fields`
  - `expansions`
  - `tweet.fields`
- Response notes:
  - `meta` may include `next_token`, `previous_token`, and `result_count`

#### 4) Follow user
- Method: `POST`
- Path: `/2/users/{id}/following`
- Purpose: have the authenticated user follow another user
- Auth on reviewed page: OAuth 2.0 user token with `follows.write`, `tweet.read`, `users.read`, or `UserToken`
- Path parameter:
  - `id` - required source user ID and must match the authenticated user on the reviewed page
- Confirmed JSON body field:
  - `target_user_id` - required destination user ID
- Response notes:
  - success returns `data.following`
  - success may also return `data.pending_follow`

#### 5) Get authenticated home timeline
- Method: `GET`
- Path: `/2/users/{id}/timelines/reverse_chronological`
- Purpose: retrieve the authenticated user's reverse-chronological home timeline
- Auth on reviewed page: user-context route; the reviewed path requires the path user ID to match the authenticated user
- Confirmed parameters from the reviewed page:
  - `id` - required authenticated user ID
  - `since_id`
  - `until_id`
  - `max_results` - optional integer from `1` to `100`
  - `pagination_token`
  - `exclude` - comma-separated `replies` and/or `retweets`
  - `start_time`
  - `end_time`
- Important note: the reviewed page explicitly describes the result set as reverse chronological

### Posts
#### 6) Get post by ID
- Method: `GET`
- Path: `/2/tweets/{id}`
- Purpose: retrieve one post by ID
- Auth on reviewed page: bearer token, OAuth 2.0 user token, or `UserToken`
- Path parameter:
  - `id` - required post ID
- Confirmed query parameters:
  - `tweet.fields`
  - `expansions`
  - `media.fields`
  - `poll.fields`
  - `user.fields`
  - `place.fields`
- Response notes:
  - success returns a single post object in `data`
  - `includes` and `errors` are supported by the reviewed schema

#### 7) Get posts by IDs
- Method: `GET`
- Path: `/2/tweets`
- Purpose: retrieve multiple posts by ID in one request
- Auth on reviewed page: bearer token, OAuth 2.0 user token, or `UserToken`
- Confirmed query parameters:
  - `ids` - required comma-separated post IDs; up to `100`
  - `tweet.fields`
  - `expansions`
  - `media.fields`
  - `poll.fields`
  - `user.fields`
  - `place.fields`
- Response notes:
  - success returns a `data` array of posts
  - partial lookup failures may appear in `errors`

#### 8) Search recent posts
- Method: `GET`
- Path: `/2/tweets/search/recent`
- Purpose: search posts from the last 7 days
- Auth on reviewed page: bearer token, OAuth 2.0 user token, or `UserToken`
- Confirmed query parameters:
  - `query` - required search expression
  - `start_time`
  - `end_time`
  - `since_id`
  - `until_id`
  - `max_results` - optional integer from `10` to `100`, default `10`
  - `next_token`
  - `pagination_token`
  - `sort_order` - `recency` or `relevancy`
  - `tweet.fields`
  - `expansions`
  - `media.fields`
  - `poll.fields`
  - `user.fields`
  - `place.fields`
- Response notes:
  - success metadata includes `newest_id`, `oldest_id`, `result_count`, and optional `next_token`
- Important note: the reviewed rate-limit page says recent search has a `512` query-length note, while the reviewed route schema currently exposes `maxLength: 4096`; verify which constraint is enforced in production before hard-coding client validation

#### 9) Create or edit post
- Method: `POST`
- Path: `/2/tweets`
- Purpose: create a new post for the authenticated user, or edit an existing post when `edit_options` is supplied
- Auth on reviewed page: OAuth 2.0 user token with `tweet.read`, `tweet.write`, `users.read`, or `UserToken`
- Content type: `application/json`
- Confirmed request body fields on the reviewed page:
  - `text`
  - `media.media_ids` - `1` to `4`
  - `media.tagged_user_ids` - up to `10`
  - `media.preview_media_id`
  - `media.call_to_actions`
  - `media.title`
  - `media.description`
  - `media.embeddable`
  - `poll.options` - `2` to `4` choices
  - `poll.duration_minutes` - `5` to `10080`
  - `reply.in_reply_to_tweet_id`
  - `reply.auto_populate_reply_metadata`
  - `reply.exclude_reply_user_ids`
  - `reply_settings` - `following`, `mentionedUsers`, `subscribers`, or `verified`
  - `edit_options.previous_post_id`
  - `quote_tweet_id`
  - `card_uri`
  - `community_id`
  - `geo.place_id`
  - `made_with_ai`
  - `paid_partnership`
  - `for_super_followers_only`
  - `nullcast`
  - `share_with_followers`
  - `direct_message_deep_link`
- Confirmed response fields:
  - `data.id`
  - `data.text`
- Important usage notes from the reviewed page:
  - providing `edit_options` switches the route into edit mode
  - `quote_tweet_id` requires an Enterprise plan and is not available on self-serve pay-per-use tiers
  - `card_uri`, quoted-post creation, polls, media, and DM deep links have documented mutual-exclusion rules on the reviewed page

#### 10) Delete post
- Method: `DELETE`
- Path: `/2/tweets/{id}`
- Purpose: delete a post owned by the authenticated user
- Auth on reviewed page: OAuth 2.0 user token with `tweet.read`, `tweet.write`, `users.read`, or `UserToken`
- Path parameter:
  - `id` - required post ID
- Confirmed response field:
  - `data.deleted` - boolean success indicator

## Rate limits
- The official rate-limit guide says limits are enforced per endpoint and commonly per `15 minutes`, with some exceptions such as `/24hrs` and `/sec`.
- Confirmed limits for the reviewed routes:
  - `GET /2/users/by/username/{username}` - `300/15min` per app, `900/15min` per user
  - `GET /2/users` - `300/15min` per app, `900/15min` per user
  - `GET /2/users/{id}/followers` - `300/15min` per app, `300/15min` per user
  - `POST /2/users/{id}/following` - `50/15min` per user
  - `GET /2/tweets/{id}` - `450/15min` per app, `900/15min` per user
  - `GET /2/tweets` - `3500/15min` per app, `5000/15min` per user
  - `GET /2/tweets/search/recent` - `450/15min` per app, `300/15min` per user
  - `GET /2/users/{id}/timelines/reverse_chronological` - `180/15min` per user
  - `POST /2/tweets` - `10000/24hrs` per app, `100/15min` per user
  - `DELETE /2/tweets/{id}` - `50/15min` per user
- The official docs say every response exposes `x-rate-limit-limit`, `x-rate-limit-remaining`, and `x-rate-limit-reset` headers.

## Pagination, errors, and format notes
- The pagination guide documents `max_results` plus `meta.next_token` / `meta.previous_token` and follow-up requests with `pagination_token`.
- The reviewed errors guide documents standard HTTP status codes `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `429`, `500`, `502`, `503`, and `504`.
- The reviewed errors guide shows problem-details style error bodies such as:
  - `type`
  - `title`
  - `detail`
- The reviewed errors guide explicitly calls out error types including `invalid-request`, `resource-not-found`, `not-authorized-for-resource`, `client-forbidden`, `usage-capped`, `rate-limit-exceeded`, `streaming-connection`, `rule-cap`, `invalid-rules`, and `duplicate-rules`.
- The reviewed route pages also allow plain JSON error bodies with `code` and `message`.
- Success responses are JSON and multi-resource requests may contain both `data` and `errors` in the same `200` response.

## Important usage notes
- The cleanest official machine-readable/manual review workflow is on `docs.x.com`, where the provider publishes `.md` versions of documentation pages and the `llms.txt` indexes.
- Use fields and expansions deliberately; the reviewed docs default to minimal object payloads unless extra fields are requested.
- Treat pagination tokens as opaque and do not attempt to parse them.
- Recent search is limited to the last 7 days on the reviewed endpoint page.
- Quote-post creation from `POST /2/tweets` is Enterprise-only according to the reviewed route warning.
- Because several route pages still reference `developer.twitter.com` in `externalDocs` while the primary docs now live on `docs.x.com`, keep both domains recognized as official X documentation during future maintenance.