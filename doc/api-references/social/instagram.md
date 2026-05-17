# Instagram

## Provider metadata
- Category: `Social`
- Provider slug: `instagram`
- Official docs pages used:
  - `https://developers.facebook.com/docs/instagram-platform/overview`
  - `https://developers.facebook.com/docs/instagram-platform/reference`
  - `https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize`
  - `https://developers.facebook.com/docs/instagram-platform/reference/access_token`
  - `https://developers.facebook.com/docs/instagram-platform/reference/me`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media_publish`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit`
  - `https://developers.facebook.com/docs/instagram-platform/reference/instagram-media`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag`
  - `https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes`
- OAuth authorization host: `https://api.instagram.com`
- Instagram Login API host: `https://graph.instagram.com`
- Facebook Login for Business API host: `https://graph.facebook.com`
- Resumable media upload host called out by the official media-publishing docs: `https://rupload.facebook.com/ig-api-upload`
- Auth models confirmed on the reviewed official pages:
  - OAuth 2.0 authorization-code flow via `GET /oauth/authorize`
  - Short-lived to long-lived Instagram User token exchange via `GET /access_token`
  - Instagram User access tokens for Instagram Login routes
  - Facebook User access tokens for Facebook Login for Business routes
- Primary request formats confirmed on the reviewed pages: query strings on `GET`, query-string/form-style params on many `POST` graph operations, JSON responses, and resumable binary upload to `rupload.facebook.com`
- Primary response format: JSON objects; collection endpoints commonly return top-level `data` arrays
- Manually confirmed route count: `17`

## Authentication
- The official OAuth page says the authorization window is opened at `https://api.instagram.com/oauth/authorize` with `client_id`, `redirect_uri`, `response_type=code`, and `scope`.
- The same page says successful authorization redirects back to `redirect_uri` with a one-time `code` that is valid for `1 hour`.
- The OAuth page says canceled authorization redirects back with `error=access_denied`, `error_reason=user_denied`, and `error_description`.
- The `/access_token` page says `GET https://graph.instagram.com/access_token` exchanges a valid short-lived Instagram User access token for a long-lived token that expires in `60 days`.
- The `/access_token` page explicitly warns that requests for long-lived tokens include the app secret and therefore must be made only in server-side code.
- The IG User, IG Media, IG Comment, hashtag, and publishing pages distinguish two login families:
  - Instagram API with Instagram Login -> `graph.instagram.com` + Instagram User access tokens
  - Instagram API with Facebook Login for Business -> `graph.facebook.com` + Facebook User access tokens
- Meta's reviewed reference pages also tie different permissions to different login families; route-specific permission notes matter.

## API-wide behavior
- The reference overview says Instagram Platform requests are sent to one of two Meta hosts: `graph.facebook.com` for Facebook Login for Business and `graph.instagram.com` for Instagram Login.
- The reviewed pages model the API as Graph objects with nodes, edges, and fields.
- The `/me` endpoint resolves the IG User from the access token and behaves as a token-aware alias for `GET /{ig-user-id}`.
- The error-codes page shows the canonical error body shape with fields such as:
  - `message`
  - `type`
  - `code`
  - `error_subcode`
  - `is_transient`
  - `error_user_title`
  - `error_user_msg`
  - `fbtrace_id`
- The reviewed pages consistently return JSON and use versioned paths such as `v25.0` in examples.

## Canonical endpoints

### OAuth and token lifecycle
#### 1) Start Instagram OAuth authorization
- Method: `GET`
- URL: `https://api.instagram.com/oauth/authorize`
- Purpose: open the authorization window so the user can approve permissions and return an authorization code

Confirmed query parameters:
- `client_id` - required Instagram App ID
- `redirect_uri` - required redirect URI; must exactly match one of the app's valid OAuth URIs
- `response_type` - required; set to `code`
- `scope` - required; comma-separated or URL-encoded space-separated permissions; official examples mention `instagram_basic` or `instagram_business_basic`
- `state` - optional CSRF/state value echoed back on redirect

Confirmed response/flow notes:
- Successful auth redirects to `redirect_uri?code=...`
- The docs say auth codes are valid for `1 hour` and can be used only once
- The docs say to strip the trailing `#_` fragment before exchanging the code
- User cancellation redirects with `error=access_denied`, `error_reason=user_denied`, and `error_description`

#### 2) Exchange a short-lived token for a long-lived Instagram User token
- Method: `GET`
- Path: `/access_token`
- Base URL: `https://graph.instagram.com`
- Purpose: exchange a short-lived Instagram User access token for a long-lived token

Confirmed query parameters:
- `grant_type` - required; must be `ig_exchange_token`
- `client_secret` - required app secret
- `access_token` - required valid, unexpired short-lived Instagram User access token

Confirmed response fields:
- `access_token`
- `token_type` - `bearer`
- `expires_in`

Important usage notes:
- The docs say long-lived tokens expire in `60 days`
- The docs say this request should only be made in server-side code because it includes the app secret

#### 3) Resolve the current Instagram user from the token
- Method: `GET`
- Path: `/me`
- Base URL: `https://graph.instagram.com`
- Purpose: fetch fields/edges for the IG User associated with the supplied Instagram User access token

Confirmed query parameters:
- `fields` - requested user fields/edges
- `access_token` - Instagram User access token

Important usage note:
- The docs say this endpoint translates to `GET /{user-id}` after determining the IG User from the access token

### IG User resources and publishing
#### 4) Get an Instagram professional account
- Method: `GET`
- Path: `/{ig-user-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: fetch fields and edges for an Instagram Business or Creator account

Confirmed query parameters:
- `fields` - comma-separated list of IG User fields/edges
- `access_token` - required user access token

Confirmed field examples from the official page:
- `alt_text`
- `biography`
- `followers_count`
- `follows_count`
- `has_profile_pic`
- `id`
- `is_published`
- `legacy_instagram_user_id`
- `media_count`
- `name`
- `profile_picture_url`
- `shopping_product_tag_eligibility`
- `username`
- `website`

Confirmed edge examples from the official page:
- `business_discovery`
- `connected_threads_user`
- `content_publishing_limit`
- `media`
- `media_publish`
- `mentions`
- `stories`
- `tags`
- `user_likes`

Important auth notes:
- Instagram Login page lists `instagram_business_basic`
- Facebook Login page lists `instagram_basic` + `pages_read_engagement`
- Product-tagging requests additionally require `catalog_management` and `instagram_shopping_tag_products`

#### 5) Create an image, reel, carousel, or story container
- Method: `POST`
- Path: `/{ig-user-id}/media`
- Base URL: `https://graph.facebook.com`
- Purpose: create a container before publishing content

Confirmed request variants on the official page:
- Image container with `image_url`, optional `alt_text`, `caption`, `location_id`, `user_tags`, `product_tags`
- Reel container with `media_type=REELS`, `video_url` or `upload_type=resumable`, optional `caption`, `share_to_feed`, `collaborators`, `cover_url`, `audio_name`, `thumb_offset`, `trial_params`
- Carousel container with `media_type=CAROUSEL`, `children`, optional `caption`, `share_to_feed`, `collaborators`, `location_id`, `product_tags`
- Story container with `media_type=STORIES`, `image_url` or `video_url`, optional `user_tags`

Confirmed common parameters:
- `access_token` - required user access token
- `media_type` - required for carousels, stories, and reels; values include `CAROUSEL`, `REELS`, `STORIES`
- `upload_type` - optional `resumable` for supported video uploads
- `caption` - up to `2200` chars, `30` hashtags, `20` @mentions
- `children` - up to `10` container IDs for carousel publishing
- `collaborators` - up to `3` usernames for supported feed/reel/carousel posts
- `user_tags` - tagging array with usernames and coordinates
- `product_tags` - up to `5` unique product tags
- `location_id` - Page ID with location data
- `thumb_offset` - milliseconds for video/reel thumbnail
- `cover_url` - reel cover image URL

Confirmed response notes:
- Successful resumable-eligible container creation returns an `id` and a `uri` under `https://rupload.facebook.com/ig-api-upload/v25.0/{ig-container-id}`
- The upload step then uses `POST https://rupload.facebook.com/ig-api-upload/v25.0/{ig-container-id}` with `Authorization: OAuth <USER_ACCESS_TOKEN>` and either binary upload headers (`offset`, `file_size`) or `file_url`

Important usage limits/spec notes:
- Containers expire after `24 hours`
- An Instagram account can create only `400` containers within a rolling `24 hour` period
- Stories expire after `24 hours`
- Reels cannot appear in carousels
- Story requests support either video URL or reel/video URL flow, but not both at once
- Official specs call out media constraints such as image max `8 MB`, reel max `300 MB`, story video max `100 MB`, and public-hosted media URLs

#### 6) Get media published by an Instagram user
- Method: `GET`
- Path: `/{ig-user-id}/media`
- Base URL: `https://graph.facebook.com`
- Purpose: list IG Media objects on an IG User

Confirmed route family:
- The official `IG User Media` page lists `GET /<YOUR_APP_USERS_INSTAGRAM_USER_ID>/media`

Confirmed usage notes from the same page:
- The endpoint returns a collection of IG Media objects owned by the IG User
- Field expansion is used to request specific media fields

#### 7) Get stories for an Instagram user
- Method: `GET`
- Path: `/{ig-user-id}/stories`
- Base URL: `https://graph.facebook.com`
- Purpose: list story media for an IG User

Confirmed route family:
- The official `IG User Media` page lists `GET /<YOUR_APP_USERS_INSTAGRAM_USER_ID>/stories`

Important usage note:
- The same page says stories expire after `24 hours`

#### 8) Publish a prepared container
- Method: `POST`
- Path: `/{ig-user-id}/media_publish`
- Base URL: `https://graph.facebook.com`
- Purpose: publish an existing IG Container on an Instagram Business account

Confirmed query parameters:
- `creation_id` - required IG Container ID to publish
- `access_token` - required user access token

Confirmed response fields:
- `id` - published media ID

Important usage limits/notes:
- The page says an Instagram professional account can publish only `50` posts within a moving `24 hour` period
- PPA and Page-connected 2FA requirements can block publishing
- Product-tagging publishes require additional shop/admin prerequisites and permissions

#### 9) Inspect publishing quota usage
- Method: `GET`
- Path: `/{ig-user-id}/content_publishing_limit`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: check how many container publishes have been used within the current quota window

Confirmed query parameters:
- `fields` - optional; defaults to `quota_usage` if omitted
- `since` - optional Unix timestamp no older than `24 hours`
- `access_token` - required user access token

Confirmed response fields:
- `quota_usage`
- `config.quota_total`
- `config.quota_duration`

Confirmed quota values on the reviewed page:
- `quota_total` is currently `50`
- `quota_duration` is currently `86400` seconds (`24 hours`)

### IG Media operations
#### 10) Get a media object
- Method: `GET`
- Path: `/{ig-media-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: fetch fields and edges for a photo, album, video, reel, live video, or story

Confirmed query parameters:
- `fields` - comma-separated media fields/edges
- `access_token` - required user access token

Confirmed field examples from the official page:
- `alt_text`
- `caption`
- `comments_count`
- `id`
- `legacy_instagram_media_id`
- `like_count`
- `media_product_type`
- `media_type`
- `media_url`
- `owner`
- `permalink`
- `shortcode`
- `thumbnail_url`
- `timestamp`
- `username`
- `total_comments_count`
- `total_like_count`

Important usage notes:
- Live video media can only be read while broadcast is active
- Some fields like `permalink` are not available on album children
- Counts such as `comments_count` and `like_count` may differ from aggregated `total_*` fields
- The docs say this API returns media owned by Instagram professional accounts only

#### 11) Enable or disable comments on media
- Method: `POST`
- Path: `/{ig-media-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: toggle comment availability for a media object

Confirmed query parameters:
- `comment_enabled` - required boolean
- `access_token` - required user access token

Confirmed response:
- `{ "success": true }`

Important notes:
- Live video media is not supported
- Permissions on the reviewed page are comment-management oriented: `instagram_business_manage_comments` for Instagram Login, `instagram_manage_comments` for Facebook Login, plus Facebook-side business/page requirements where applicable

#### 12) Delete media
- Method: `DELETE`
- Path: `/{ig-media-id}`
- Base URL: `https://graph.facebook.com`
- Purpose: delete supported Instagram media

Confirmed auth/permission notes:
- The official page says deletion is available only for Instagram API with Facebook Login
- The page lists `instagram_basic` and `instagram_manage_contents`

Important usage notes:
- Non-ad posts, stories, reels, and entire carousel albums are supported
- Individual carousel child items cannot be deleted separately; the whole carousel container must be deleted

Confirmed success/error notes:
- Success returns `success` and `deleted_id`
- The docs show a failure example with `OAuthException`, code `-1`, subcode `2207073`, and user-facing title/message `Media Type Not Supported`

### Comment operations
#### 13) Get a comment
- Method: `GET`
- Path: `/{ig-comment-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: fetch fields and edges on an Instagram comment

Confirmed query parameters:
- `fields` - requested comment fields
- `access_token` - required user access token

Confirmed field examples:
- `from`
- `hidden`
- `id`
- `like_count`
- `legacy_instagram_comment_id`
- `media`
- `parent_id`
- `replies`
- `text`
- `timestamp`
- `user`
- `username`

Important usage notes:
- Mentions-discovered comments cannot be queried through this node unless the request is made by the comment owner; Meta says to use the Mentioned Comment node instead
- Comments on age-gated media are not returned
- Comments on live video media can be read only while the media is being broadcast
- Starting August 27, 2024, Meta requires the comment-management permission to access the `username` field for commenters on an app user's professional account

#### 14) Hide or unhide a comment
- Method: `POST`
- Path: `/{ig-comment-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: hide or restore visibility of a comment on owned media

Confirmed query parameters:
- `hide` - required boolean; `true` hides, `false` shows

Confirmed response:
- `{ "success": true }`

Important usage notes:
- Comments made by a media owner on their own media always remain displayed even if `hide=true`
- Live video media comments are not supported
- The docs say the token must belong to the user who owns the media object that received the comment

#### 15) Delete a comment
- Method: `DELETE`
- Path: `/{ig-comment-id}`
- Base URL: `https://graph.instagram.com` or `https://graph.facebook.com` depending on login type
- Purpose: remove a comment

Important usage notes:
- The docs say the token must belong to a user who created the comment, but deletion is allowed only by the owner of the object on which the comment was made
- Live video media comments are not supported

Confirmed response:
- `{ "success": true }`

### Hashtag discovery
#### 16) Search for a hashtag ID
- Method: `GET`
- Path: `/ig_hashtag_search`
- Base URL: `https://graph.facebook.com`
- Purpose: resolve a hashtag string to a static/global IG Hashtag ID

Confirmed query parameters:
- `user_id` - required IG User ID performing the request
- `q` - required hashtag query string
- `access_token` - required user access token

Important usage limits/notes:
- Available only for Instagram API with Facebook Login
- The docs say you can query at most `30` unique hashtags within a `7 day` period
- Sensitive/offensive hashtag queries can return a generic error

Confirmed response shape:
- top-level `data[]` with hashtag `id`

#### 17) Get a hashtag node
- Method: `GET`
- Path: `/{ig-hashtag-id}`
- Base URL: `https://graph.facebook.com`
- Purpose: fetch fields and edges for a hashtag node

Confirmed query parameters:
- `fields` - requested fields/edges; omitted requests return default fields
- `access_token` - required user access token

Confirmed fields:
- `id`
- `name`

Confirmed edges listed by the official page:
- `recent_media`
- `top_media`

Important usage notes:
- Available only for Facebook Login for Business
- The same `30 unique hashtags per 7 day period` limit applies
- Hashtag IDs are static and global according to the docs

## Rate limits and quotas
- The reviewed official pages did not expose a single generic requests-per-minute table for all Instagram Platform routes.
- The reviewed official pages do expose these concrete platform limits:
  - `POST /{ig-user-id}/media`: an Instagram account can create only `400` containers within a rolling `24 hour` period
  - `POST /{ig-user-id}/media_publish`: an Instagram professional account can publish only `50` posts within a moving `24 hour` period
  - `GET /{ig-user-id}/content_publishing_limit`: returns `quota_total=50` and `quota_duration=86400`
  - `GET /ig_hashtag_search` and `GET /{ig-hashtag-id}` usage: maximum `30` unique hashtags in `7 days`

## Errors and response notes
- The error-codes page documents the common error envelope fields `message`, `type`, `code`, `error_subcode`, `is_transient`, `error_user_title`, `error_user_msg`, and `fbtrace_id`.
- The reviewed error examples include:
  - publishing timeout/download errors such as subcode `2207003`
  - expired media/container cases such as `2207020` and `2207008`
  - spam/restricted publishing cases such as `2207051` and `2207050`
  - daily publishing-cap errors such as code `9`, subcode `2207042`
  - image-size and media-type validation failures such as `2207004`, `2207023`, `2207028`, `2207035`, and `2207036`
- The official examples show successful graph operations returning JSON objects and collection endpoints returning `data` arrays.

## Pagination and format notes
- Collection-style responses in the reviewed pages use top-level `data` arrays.
- Graph resources are field-selective; callers should send `fields=` explicitly when they need more than default fields.
- The reviewed Instagram pages did not expose a general pagination chapter in the pages used for this rewrite, so pagination behavior should be verified per edge during adapter implementation.

## fireROUTE integration notes
- Treat Instagram as two closely related but not identical surfaces: `graph.instagram.com` for Instagram Login and `graph.facebook.com` for Facebook Login for Business.
- Preserve route-specific permission requirements; Meta frequently changes field access based on exact login family and granted scopes.
- Keep the long-lived token exchange server-side only because the official docs explicitly warn against exposing the app secret.
- For publishing flows, model container creation, optional resumable upload to `rupload.facebook.com`, and final publish as separate steps.
- Preserve Meta's documented publishing quotas and hashtag limits in client-side validation or retry logic.
- Expect Graph-style JSON error bodies with user-facing messages and Meta trace IDs rather than a provider-neutral error schema.
