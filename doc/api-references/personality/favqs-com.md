# FavQs.com

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://favqs.com/api`
  - `https://favqs.com/api/qotd`
- Manual review outcome: `manually_documented`
- Confirmed route count: `30`

## API overview
- Base URL: `https://favqs.com/api`
- API style: JSON over HTTPS
- Authentication:
  - app token header for general API access: `Authorization: Token token="YOUR_APP_TOKEN"`
  - user session token header for authenticated user actions: `User-Token: "USER_SESSION_TOKEN"`
  - the docs also show a shortened alternative auth form `Authorization: "YOUR_APP_TOKEN"`, but the explicit `Token token="..."` form is the clearest documented variant
- Versioning:
  - docs title is `FavQs API v2`
  - version negotiation example uses `Accept: application/vnd.favqs.v2+json;`
- Response format: JSON
- Content type: `application/json`
- Caching: docs explicitly show `Etag` plus `If-None-Match` / `304 Not Modified`
- Rate limits:
  - the docs show a `Rate-Limit-Remaining` response header
  - no public numeric request quota is published on the reviewed page

## Confirmed endpoints
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/session` | app token | Creates a user session from login/email plus password. |
| DELETE | `/api/session` | user session | Destroys the current user session. |
| POST | `/api/users` | app token | Creates a user account. |
| GET | `/api/users/:login` | app token, optional user session for account details | Retrieves a public user profile; docs show extra `account_details` when requesting your own account with a session token. |
| PUT | `/api/users/:login` | user session | Updates the authenticated user's profile settings. |
| POST | `/api/users/forgot_password` | app token | Starts password-reset flow for a user email. |
| POST | `/api/users/reset_password` | app token | Completes password reset using email plus reset token. |
| GET | `/users/:login/pro` | app token | Pro-status route published exactly this way on the docs page; note the page omits the `/api` prefix here. |
| GET | `/api/typeahead` | app token | Returns public authors, tags, and users for local typeahead/search UX. |
| GET | `/api/qotd` | none required | Quote of the day. |
| GET | `/api/quotes` | app token | Lists quotes. |
| GET | `/api/quotes/:quote_id` | app token | Gets one quote. |
| PUT | `/api/quotes/:quote_id/fav` | user session | Favorites a quote. |
| PUT | `/api/quotes/:quote_id/unfav` | user session | Removes a favorite from a quote. |
| PUT | `/api/quotes/:quote_id/upvote` | user session | Upvotes a quote. |
| PUT | `/api/quotes/:quote_id/downvote` | user session | Downvotes a quote. |
| PUT | `/api/quotes/:quote_id/clearvote` | user session | Clears a prior vote. |
| PUT | `/api/quotes/:quote_id/tag` | user session | Adds personal tags to a quote. |
| PUT | `/api/quotes/:quote_id/hide` | user session | Hides a quote for the current user. |
| PUT | `/api/quotes/:quote_id/unhide` | user session | Unhides a quote for the current user. |
| POST | `/api/quotes` | user session | Adds a quote. |
| PUT | `/api/quotes/:quote_id` | pro user session | Updates a quote; docs mark this as pro-only. |
| DELETE | `/api/quotes/:quote_id` | pro user session | Deletes a quote; docs mark this as pro-only. |
| PUT | `/api/quotes/:quote_id/publicize` | pro user session | Makes a quote public; docs mark this as pro-only. |
| GET | `/api/activities/` | app token or user session | Lists activity for a user, author, or tag; defaults to current user activity when a session is present and no filter is provided. |
| DELETE | `/api/activities/:activity_id` | user session | Deletes an activity item. |
| PUT | `/api/activities/follow/` | user session | Follows a user, author, or tag. |
| PUT | `/api/activities/unfollow/` | user session | Unfollows a user, author, or tag. |
| GET | `/api/activities/followers/` | app token | Gets followers for a user, author, or tag. |
| GET | `/api/activities/following/` | app token | Gets what a user is following. |

## Confirmed parameters and request bodies
### Session routes
- `POST /api/session` body:
  - `user.login`
  - `user.password`
- Success response fields shown:
  - `User-Token`
  - `login`
  - `email`
- Error examples shown:
  - `error_code: 21` - invalid login or password
  - `error_code: 22` - login not active
  - `error_code: 23` - login or password missing

### User routes
- `POST /api/users` body:
  - `user.login`
  - `user.email`
  - `user.password`
- `PUT /api/users/:login` body fields shown:
  - `user.login`
  - `user.email`
  - `user.password`
  - `user.twitter_username`
  - `user.facebook_username`
  - `user.pic`
  - `user.profanity_filter`
- Documented `user.pic` values shown in the docs:
  - `twitter`
  - `facebook`
  - `gravater`
  - empty string
- `POST /api/users/forgot_password` body:
  - `user.email`
- `POST /api/users/reset_password` body:
  - `user.email`
  - `user.reset_password_token`
- User/profile response fields shown:
  - `login`
  - `pic_url`
  - `public_favorites_count`
  - `followers`
  - `following`
  - `pro`
  - optional `account_details.email`
  - optional `account_details.private_favorites_count`
  - optional `account_details.pro_expiration`

### Typeahead
- `GET /api/typeahead` has no documented parameters on the reviewed page
- Response top-level arrays:
  - `authors`
  - `tags`
  - `users`
- Returned entries shown with:
  - `count`
  - `permalink`
  - `name`

### Quote routes
- `GET /api/quotes` optional query parameters:
  - `filter` - keyword search or type lookup
  - `type` - documented values `author`, `tag`, `user`
  - `private` - get private quotes for the pro user session
  - `hidden` - get hidden quotes for the user session
  - `page` - page number; docs say `25 quotes per page`
- `GET /api/qotd` requires no token according to the docs page
- `POST /api/quotes` body supports at least two documented shapes:
  - standard quote body with `quote.author` and `quote.body`
  - dialogue quote body with `quote.lines[]` entries containing `author` and `body`
- `PUT /api/quotes/:quote_id/tag` body example:
  - `personal_tags` array
- Quote response fields shown across examples:
  - `id`
  - `author`
  - `author_permalink`
  - `body`
  - `tags`
  - `url`
  - `favorites_count`
  - `upvotes_count`
  - `downvotes_count`
  - `dialogue`
  - `favorite`
  - `private`
  - nested `user_details.favorite`
  - nested `user_details.upvote`
  - nested `user_details.downvote`
  - nested `user_details.personal_tags`
  - nested `user_details.hidden`

### Activity routes
- `GET /api/activities/` URL parameters:
  - `filter` - lookup value
  - `type` - documented values `author`, `tag`, `user`
  - `page` - page number; docs say `25 activities per page`
- `PUT /api/activities/follow/` and `PUT /api/activities/unfollow/` require URL parameters:
  - `type` - `author`, `tag`, or `user`
  - `filter` - target identifier/value
- `GET /api/activities/followers/` requires:
  - `type`
  - `filter`
- `GET /api/activities/following/` optional parameter:
  - `user` - username to inspect instead of current user
- Activity/follow responses shown with fields such as:
  - `activity_id`
  - `owner_type`
  - `owner_id`
  - `owner_value`
  - `action`
  - `trackable_id`
  - `trackable_type`
  - `trackable_value`
  - `message`
  - `page`
  - `last_page`
  - `users`
  - `following[].following_type`
  - `following[].following_id`
  - `following[].following_value`

## Response, pagination, and error notes
- The reviewed page documents JSON responses throughout.
- List endpoints use simple page-based pagination:
  - `GET /api/quotes` - `25` per page
  - `GET /api/activities/` - `25` per page
  - followers/following responses also show `page` and `last_page`
- The status-code section explicitly shows `200`, `404`, and `500`.
- The docs also repeatedly show JSON error bodies using:
  - `error_code`
  - `message`
- Important implementation note: several error examples on the page are represented as normal JSON bodies rather than as a fully documented HTTP error table, so adapter code should inspect both HTTP status and body shape.

## Important usage notes
- FavQs separates application access from user actions: most read routes need an app token, while personalization routes need a `User-Token` session header.
- Pro-only restrictions are explicitly called out for quote update, delete, and publicize operations.
- The docs page publishes `GET /users/:login/pro` without the `/api` prefix; treat that exact published path as the only currently confirmed form unless further official clarification appears.
- The docs recommend local typeahead implementation by downloading the public authors/tags/users list from `/api/typeahead`.
- Cache handling is officially supported through `Etag` / `If-None-Match`.

## Sources inspected
- `https://favqs.com/api`
- `https://favqs.com/api/qotd`
