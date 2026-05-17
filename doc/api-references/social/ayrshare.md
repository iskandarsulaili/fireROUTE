# Ayrshare

## Provider metadata
- Category: `Social`
- Provider slug: `ayrshare`
- Official docs pages used:
  - `https://www.ayrshare.com/docs/apis/overview`
  - `https://www.ayrshare.com/docs/llms.txt`
  - endpoint pages under `https://www.ayrshare.com/docs/apis/...`
- Main API base URL: `https://api.ayrshare.com/api`
- Auth model: bearer API key, with optional `Profile-Key` for user-profile operations
- Supported request methods confirmed: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Response format: JSON
- Manually confirmed route count: `19`

## Authentication
- The overview page says Ayrshare authenticates requests with an `Authorization` header using the format `Authorization: Bearer API_KEY`.
- The same page says Business and Enterprise users can act on behalf of user profiles by also sending `Profile-Key: PROFILE_KEY`.
- The docs note that Premium plans should generally use only the primary API key, while multi-user profile flows use both the API key and profile key.
- For X/Twitter operations, the `Publish a Post` page adds an important provider-specific note: starting March 31, 2026, X operations require customer-supplied OAuth1 API credentials in two extra headers:
  - `X-Twitter-OAuth1-Api-Key`
  - `X-Twitter-OAuth1-Api-Secret`

## Canonical endpoints

### Post management
#### 1) Publish a post
- Method: `POST`
- Path: `/post`
- Purpose: publish immediately or schedule a post to one or more linked social platforms

Key body parameters documented:
- `post` - required post text; may be empty for media-only publishing
- `platforms` - required array of target platforms (`bluesky`, `facebook`, `gmb`, `instagram`, `linkedin`, `pinterest`, `reddit`, `snapchat`, `telegram`, `threads`, `tiktok`, `twitter`, `youtube`, or `all`)
- `mediaUrls` - optional media URLs
- `isVideo` - force video handling when extension detection is insufficient
- `scheduleDate` - optional UTC ISO-8601 schedule timestamp
- `validateScheduled` - whether to pre-validate scheduled posts before acceptance
- `firstComment`, `disableComments`, `shortenLinks`, `autoSchedule`, `autoRepost`, `autoHashtag`, `requiresApproval`, `notes` - optional workflow controls
- provider-specific option objects such as `instagramOptions`, `linkedInOptions`, `redditOptions`, `telegramOptions`, `threadsOptions`, `tikTokOptions`, `twitterOptions`, and `youTubeOptions`

#### 2) Get a post
- Method: `GET`
- Path: `/post/{id}`
- Purpose: retrieve a post by Ayrshare post id

Path parameters:
- `id` - Ayrshare post id

#### 3) Delete a post
- Method: `DELETE`
- Path: `/post`
- Purpose: delete a published or scheduled post

Key body parameters documented:
- `id` - single Ayrshare post id
- `bulk` - array of Ayrshare post ids for bulk delete
- `deleteAllScheduled` - delete all pending scheduled posts for the user profile
- `markManualDeleted` - mark the post deleted in Ayrshare without sending delete calls to the social network

#### 4) Update a post
- Method: `PATCH`
- Path: `/post`
- Purpose: update scheduled-post metadata or certain published-post properties

Key body parameters documented:
- `id` - required Ayrshare post id
- `approved` - approve a post that is awaiting approval
- `disableComments` - enable or disable comments where supported
- `notes` - update internal notes
- `scheduleDate` - change scheduled publish time
- `scheduledPause` - pause or unpause a scheduled post
- `youTubeOptions` - update visibility, description, title, or category for YouTube content

#### 5) Bulk schedule posts
- Method: `POST`
- Path: `/post/bulk`
- Purpose: schedule multiple posts from a CSV upload

Key requirements documented:
- Uses bearer authorization
- Uses multipart/form-data upload semantics from the official examples
- Intended for bulk scheduling rather than single-post publishing

#### 6) Retry a failed post
- Method: `PUT`
- Path: `/post/retry`
- Purpose: retry a publish attempt that previously failed

Key usage note:
- Official page positions this route as a retry workflow for failed publish jobs rather than a generic requeue endpoint

### History
#### 7) List post history
- Method: `GET`
- Path: `/history`
- Purpose: retrieve historical Ayrshare posting records

Key query parameters documented:
- `limit` - default `25`, max `1000`
- `platforms` - array filter across supported social networks
- `startDate`, `endDate` - ISO-8601 date range filters
- `lastDays` - defaults to `30`; `0` returns the entire history subject to `limit`
- `status` - values include `success`, `error`, `processing`, `pending`, `paused`, `deleted`, `awaiting approval`
- `type` - additional history-type filter documented on the page
- `autoRepostId` - filter for auto-repost workflows

#### 8) Get history by post id
- Method: `GET`
- Path: `/history/{id}`
- Purpose: retrieve history for one specific post

Path and query parameters documented:
- `id` - Ayrshare post id
- `searchAllPosts` - optional lookup behavior flag documented on the page

### Analytics
#### 9) Get analytics for an Ayrshare post
- Method: `POST`
- Path: `/analytics/post`
- Purpose: retrieve analytics for posts published via Ayrshare

Key body parameters documented:
- `id` - Ayrshare post id
- `platforms` - optional target-platform filter

#### 10) Get analytics for a social account
- Method: `POST`
- Path: `/analytics/social`
- Purpose: retrieve profile-level analytics and demographics

Key body parameters documented:
- `platforms` - required array of platforms
- `quarters` - quarter-based historical range selector
- `daily` - return daily time-series data where supported
- `period60Days` - TikTok aggregate shortcut for 60-day totals
- `youtube` - YouTube-specific options object
- `userId`, `userName` - provider-specific account selectors where required

### Comments
#### 11) Post a comment
- Method: `POST`
- Path: `/comments`
- Purpose: add a comment to a post

Key body parameters documented:
- `id` - Ayrshare post id or social post id
- `comment` - required comment text
- `searchPlatformId` - set `true` when using a social post id
- `platforms` - required platform array; one platform at a time when using social post ids
- `mediaUrls` - optional image attachment support for selected platforms

#### 12) Get comments
- Method: `GET`
- Path: `/comments/{id}`
- Purpose: list comments under a top-level post or resolve a social comment lookup

Key query parameters documented:
- `searchPlatformId`
- `commentId`
- `platform`

#### 13) Delete comments
- Method: `DELETE`
- Path: `/comments/{id}`
- Purpose: delete one comment or all comments under a post depending on request mode

Key documented parameters:
- path `id`
- body/query usage described with `platform`, `platforms`, and `searchPlatformId` depending on whether the caller uses Ayrshare ids or social-network ids

#### 14) Reply to a comment
- Method: `POST`
- Path: `/comments/reply/{id}`
- Purpose: add a reply beneath an existing comment thread

Key body parameters documented:
- `commentId` - parent social comment id when needed
- `platforms` - target platform(s)
- `comment` - reply text
- `mediaUrls` - optional media for supported platforms
- `searchPlatformId`, `videoId`, `objResponse` - advanced lookup/response flags documented on the page

### User profiles
#### 15) Create a user profile
- Method: `POST`
- Path: `/profiles`
- Purpose: create a managed user profile under the primary account

Key body parameters documented:
- `title` - required unique profile title
- `messagingActive` - enable messaging for the profile
- `hideTopHeader`, `topHeader`, `subHeader` - customize linking-page UI
- `disableSocial` - disable selected networks for the profile
- `team` - create as a team member profile
- `email` - invite address when `team` is `true`
- `tags` - internal organizational tags

#### 16) List user profiles
- Method: `GET`
- Path: `/profiles`
- Purpose: retrieve profiles associated with the primary account

Key query parameters documented:
- `title`
- `refId`
- `hasActiveSocialAccounts`
- `includesActiveSocialAccounts`
- `isByokLinked`
- `actionLog`
- `limit`
- `cursor`
- `include`

#### 17) Update a user profile
- Method: `PATCH`
- Path: `/profiles`
- Purpose: update an existing managed profile

Key body parameters documented:
- `title` - required profile title
- `disableSocial`
- `messagingActive`
- `hideTopHeader`
- `topHeader`
- `tags`
- `xAccountActivityActive`

#### 18) Delete a user profile
- Method: `DELETE`
- Path: `/profiles`
- Purpose: delete a managed user profile

Key documented identifiers:
- `Profile-Key` header can identify the target profile directly
- `title` body field can also be used when `profileKey` is not passed

### User details
#### 19) Get user/profile details
- Method: `GET`
- Path: `/user`
- Purpose: retrieve account or current user-profile details

Key query parameters documented:
- `instagramDetails` - include slower extra Instagram account metadata such as account type and used quota

## Pagination, rate limits, and errors
- The official history docs use limit-based pagination with `limit` up to `1000` and date-window filters.
- The profiles listing docs add cursor pagination via `cursor`.
- Ayrshare's reviewed help-center page does not publish a single global numeric API rate limit; instead it says API usage is subject to a fair-use policy.
- The same help-center page gives network-specific examples such as LinkedIn `150` posts per day and Instagram `50` posts every `24` hours.
- The Ayrshare errors page says responses can return HTTP `400`, `401`, `402`, `403`, `404`, `429`, `500`, and `502` in addition to successful `200` responses.
- Error bodies include a top-level `status` plus an `errors` array containing fields such as `action`, `code`, `message`, and `platform`.

## Important usage notes
- The overview and endpoint pages consistently describe JSON request and response payloads.
- Many endpoints are plan-gated; the reviewed docs explicitly separate Premium features from Launch/Business/Enterprise multi-profile features and mark some features as Max Pack additions.
- Comments and analytics routes support both Ayrshare-generated ids and provider-native social ids; keep those identifier types separate.
- `shortenLinks`, daily analytics payloads, and some cross-network features have plan or package requirements documented on the respective pages.

## fireROUTE normalization notes
- Model primary-account operations and user-profile operations separately because Ayrshare uses both `Authorization` and `Profile-Key` semantics.
- Preserve Ayrshare post ids alongside social-network post ids; the docs repeatedly distinguish them and several endpoints switch behavior based on the id type.
- Keep post publishing, history, analytics, comments, and profiles as separate route families instead of flattening everything into one social-post abstraction.
