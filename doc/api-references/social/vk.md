# vk

## Provider metadata
- Category: `Social`
- Provider slug: `vk`
- Official docs pages used:
  - `https://vk.com/dev/sites` -> `https://dev.vk.com/ru/widgets/overview?ref=old_portal`
  - `https://dev.vk.com/ru/reference`
  - `https://dev.vk.com/ru/api/access-token/getting-started`
  - `https://dev.vk.com/ru/api/api-requests`
  - `https://dev.vk.com/ru/reference/errors`
  - `https://dev.vk.com/ru/method/users.get`
  - `https://dev.vk.com/ru/method/users.search`
  - `https://dev.vk.com/ru/method/friends.get`
  - `https://dev.vk.com/ru/method/wall.get`
  - `https://dev.vk.com/ru/method/wall.post`
  - `https://dev.vk.com/ru/method/newsfeed.search`
  - `https://dev.vk.com/ru/method/groups.getById`
- Main API base URL pattern: `https://api.vk.ru/method/{method_name}`
- Primary reference hub for method inventory: `https://dev.vk.com/ru/method`
- Current API version called out on the reviewed request-format page: `5.199`
- Auth models confirmed on the reviewed official pages:
  - service access token
  - user access token
  - community access token
- Primary request formats confirmed on the reviewed pages:
  - `GET` or `POST` requests are both accepted and treated as equivalent by VK API
  - access token may be passed as query parameter or via `Authorization: Bearer {token}`
  - `application/x-www-form-urlencoded` or `multipart/form-data` for `POST`
- Primary response format confirmed on the reviewed pages: JSON success bodies wrapped in a top-level `response` field
- Manually confirmed route count: `7`

## Authentication
- The reviewed access-token overview says VK API requests use access tokens in every request.
- The reviewed token overview distinguishes three token types:
  - service token - acts on behalf of the app; lifetime is not limited; official guidance says to keep it on the server side only
  - user token - acts on behalf of a user; lifetime is `1 hour`
  - community token - acts on behalf of a community/public page; lifetime is not limited
- The reviewed request-format page says the token can be sent either as the common query parameter `access_token` or in the `Authorization: Bearer {token}` header.
- The reviewed request-format page says every request must also include `v`, the API version parameter.
- The reviewed access-token overview says older token-issuance flows were disabled:
  - Authorization Code Flow for user tokens: disabled `2024-06-25`
  - Implicit Flow for user tokens: disabled `2024-06-25`
  - Client Credentials Flow for service tokens: disabled `2022-10-17`
- The same overview also says previously issued non-revoked perpetual tokens from older flows may still continue working.

## API-wide behavior
- The reviewed request-format page defines the request pattern as `https://<server>/method/<api-method>?<parameters>` and identifies the server as `api.vk.ru`.
- The reviewed request-format page says method names are case-sensitive.
- The reviewed request-format page says `GET` and `POST` are equivalent for VK API calls.
- The reviewed request-format page says `application/json` is not currently supported for `POST`; use `application/x-www-form-urlencoded` or `multipart/form-data` instead.
- The reviewed request-format page recommends `multipart/form-data` with `POST` for larger payloads above `2 KB`.
- The reviewed request-format page lists common query parameters available across methods:
  - `access_token`
  - `v`
  - `lang`
  - `test_mode=1`
- The reviewed request-format page shows JSON success responses under a top-level `response` property.
- The reviewed request-format page also documents JSONP as an officially supported browser-side cross-domain pattern.

## Canonical endpoints

### Users and friends
#### 1) Get users
- Method: `GET` or `POST`
- Path pattern: `/method/users.get`
- Full URL example: `https://api.vk.ru/method/users.get`
- Purpose: retrieve one or more user profiles
- Allowed token types on reviewed page:
  - user token
  - community token
  - service token
- Confirmed parameters:
  - `user_ids` - comma-separated user IDs or `screen_name` values; defaults to the current user when omitted
  - `fields` - optional extra profile fields such as `bdate`, `city`, `domain`, `followers_count`, `photo_100`, `photo_200`, `screen_name`, `status`, `verified`, `last_seen`, `online`, and many more
  - `name_case` - `nom`, `gen`, `dat`, `acc`, `ins`, or `abl`
  - `from_group_id` - deprecated and no longer used
- Response notes:
  - success returns an array of user objects
  - the reviewed page explicitly notes `counters` and `military` are returned only when exactly one `user_id` is passed

#### 2) Search users
- Method: `GET` or `POST`
- Path pattern: `/method/users.search`
- Full URL example: `https://api.vk.ru/method/users.search`
- Purpose: search users by keyword and profile filters
- Allowed token types on reviewed page:
  - user token only
- Confirmed parameters:
  - `q` - search string
  - `sort` - `1` by registration date or `0` by popularity
  - `offset`
  - `count`
  - `fields`
  - `city` / `city_id`
  - `country` / `country_id`
  - `hometown`
  - `university_country`, `university`, `university_year`, `university_faculty`, `university_chair`
  - `sex`
  - `status`
  - `age_from`, `age_to`
  - `birth_day`, `birth_month`, `birth_year`
  - `online`
  - `has_photo`
  - `school_country`, `school_city`, `school_class`, `school`, `school_year`
  - `religion`
  - `company`
  - `position`
  - `group_id`
  - `from_list` - `friends` or `subscriptions`
  - `screen_ref`
  - `from_group_id`
- Pagination note from reviewed page:
  - even with `offset`, only the first `1000` search results are accessible
- Response notes:
  - success returns an object with `count` and `items`

#### 3) Get friends
- Method: `GET` or `POST`
- Path pattern: `/method/friends.get`
- Full URL example: `https://api.vk.ru/method/friends.get`
- Purpose: retrieve friend IDs or expanded friend profiles
- Allowed token types on reviewed page:
  - user token
  - service token
- Confirmed parameters:
  - `user_id`
  - `order` - `hints`, `random`, or `name`
  - `list_id`
  - `count`
  - `offset`
  - `fields`
  - `name_case`
  - `ref`
- Response notes:
  - without `fields`, success returns friend IDs
  - with `fields`, success returns user objects
  - the reviewed page says the expanded result is capped at `5000`

### Wall and feed
#### 4) Get wall posts
- Method: `GET` or `POST`
- Path pattern: `/method/wall.get`
- Full URL example: `https://api.vk.ru/method/wall.get`
- Purpose: list posts from a user or community wall
- Allowed token types on reviewed page:
  - user token
  - service token
- Confirmed parameters:
  - `domain`
  - `offset`
  - `count` - maximum `100`
  - `filter` - `suggests`, `postponed`, `owner`, `others`, `all`, or `donut`
  - `extended`
  - `fields`
- Response notes:
  - success returns `count` and `items`
  - with `extended=1`, success also returns `profiles` and `groups`
- Important note:
  - `suggests` and `postponed` require an access-token-backed call according to the reviewed page

#### 5) Create wall post
- Method: `GET` or `POST`
- Path pattern: `/method/wall.post`
- Full URL example: `https://api.vk.ru/method/wall.post`
- Purpose: create a wall post, suggest a post for a public page, or publish an existing scheduled post
- Allowed token types on reviewed page:
  - user token only
- Official auth caveat from reviewed page:
  - the method requires a user token from a Standalone app via Implicit Flow with the `wall` permission, which VK says is issued only in exceptional cases through developer support
  - the reviewed page also says the method is not used in games or mini-apps
- Confirmed parameters:
  - `owner_id` - user or community owner ID; community IDs must be negative
  - `friends_only`
  - `from_group`
  - `message`
  - `attachments`
  - `photo_attachments_crop`
  - `primary_attachments_mode`
  - `services`
  - `signed`
  - `publish_date`
  - `lat`
  - `long`
  - `place_id`
  - `post_id`
  - `guid` - deduplication identifier valid for one hour
  - `mark_as_ads`
  - `link_title`
  - `link_photo_id`
  - `close_comments`
  - `donut_paid_duration`
  - `mute_notifications`
- Content and validation notes confirmed on the reviewed page:
  - a post must contain at least text, photo, video, a link snippet, or an article
  - at most `10` media items may be attached
  - at most `10` music tracks or one playlist/album/podcast may be attached
  - only one poll is allowed
  - a poll cannot be the only attachment; it must accompany text, photo, or video
  - only one file may be attached
  - only one external link may be attached; multiple links return an error
  - when publishing an already scheduled post via `post_id`, all parameters except `owner_id` and `post_id` are ignored
- Response notes:
  - success returns `response.post_id`
- Confirmed method-specific error codes on reviewed page:
  - `214` - access to adding post denied
  - `219` - advertisement post was recently added
  - `220` - too many recipients
  - `222` - hyperlinks are forbidden
  - `224` - too many ads posts
  - `225` - Donut is disabled
  - `13000` - content upload denied due to active community strikes

#### 6) Search newsfeed posts
- Method: `GET` or `POST`
- Path pattern: `/method/newsfeed.search`
- Full URL example: `https://api.vk.ru/method/newsfeed.search`
- Purpose: search status/news posts in reverse chronological order
- Allowed token types on reviewed page:
  - user token
  - service token
- Confirmed parameters:
  - `q`
  - `extended`
  - `count`
  - `latitude`
  - `longitude`
  - `start_time`
  - `end_time`
  - `start_id`
  - `offset`
  - `start_from`
  - `fields`
- Pagination notes:
  - the reviewed page says only the first `1000` results are accessible even when using `offset`
  - the reviewed page also says `start_from` should be populated with the `next_from` value from the previous response to fetch the next page
- Response notes:
  - success returns `total_count` and post `items`
  - with `extended`, success also returns `profiles` and `groups`

### Groups
#### 7) Get groups by ID
- Method: `GET` or `POST`
- Path pattern: `/method/groups.getById`
- Full URL example: `https://api.vk.ru/method/groups.getById`
- Purpose: retrieve one or more communities by ID or short name
- Allowed token types on reviewed page:
  - user token
  - community token
  - service token
- Confirmed parameters:
  - `group_ids` - IDs or short names; maximum `500`
  - `group_id` - single ID or short name
  - `fields` - optional extended group fields such as `activity`, `contacts`, `counters`, `cover`, `description`, `members_count`, `site`, `status`, `verified`, `wiki_page`, and others
- Response notes:
  - the main result section says success returns an array of group objects
- Important note:
  - the version-history notes on the same reviewed page say that since version `5.139` the response includes `groups` and `profiles`; verify the live serialized response shape against the requested `v` before depending on one exact structure

## Rate limits
- The reviewed request-format page says most VK API methods outside `secure` and `ads` are limited as follows:
  - user token: no more than `3` requests per second
  - community token: `20` requests per second
- The same page says service-token limits depend on application user count:
  - up to `10,000` users: `5` requests per second
  - up to `100,000`: `20` requests per second
  - up to `500,000`: `40` requests per second
  - up to `1,000,000`: `50` requests per second
  - above `1,000,000`: `60` requests per second
- The same page says `execute` can combine up to `25` method calls into one request.
- The reviewed request-format page says exceeding the frequency limit returns error code `6` with message `Too many requests per second.`
- The reviewed request-format page also says there are undisclosed quantitative limits for repeated same-type calls, which may trigger captcha or temporary per-method throttling.

## Pagination, errors, and format notes
- VK pagination is method-specific rather than globally standardized.
- Confirmed pagination patterns on the reviewed pages:
  - `offset` + `count` on `friends.get`, `wall.get`, and `users.search`
  - `start_from` + response `next_from` on `newsfeed.search`
- The reviewed request-format page shows JSON success responses with a top-level `response` field.
- The reviewed errors reference page documents numeric VK error codes and messages, including:
  - `5` - user authorization failed
  - `6` - too many requests per second
  - `7` - not enough rights for this action
  - `8` - invalid request
  - `14` - captcha required
  - `15` - access denied
  - `17` - validation required
  - `27` - invalid community token
  - `28` - invalid application token
  - `29` - quantitative method limit reached
  - `30` - profile is private
  - `113` - invalid user ID
- The reviewed docs pages used in this pass did not show a fully serialized JSON error-envelope example; they only documented the numeric code/message table and method-specific extra codes.

## Important usage notes
- Always send the required `v` parameter; the reviewed docs page says it affects response formats and currently lists `5.199` as the active version.
- Method names are case-sensitive.
- Community owner IDs are negative when passed in parameters such as `owner_id`.
- `wall.post` is unusually restricted compared with read methods; the reviewed page says it is unavailable for games and mini-apps and requires a rare Standalone-user-token permission path.
- `groups.getById` contains an internal docs inconsistency between the main result section and the version-history notes; validate the exact response shape against the API version you request.
- For browser-side integrations, VK still documents JSONP as an official option.
- For large uploads or form-heavy requests, prefer `POST` with `multipart/form-data`; `application/json` is explicitly unsupported on the reviewed request-format page.