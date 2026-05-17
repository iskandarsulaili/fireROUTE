# Bluesky

## Provider metadata
- Category: `Social`
- Provider slug: `bluesky`
- Official docs pages used:
  - `https://docs.bsky.app/`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/com/atproto/server/createSession.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/com/atproto/server/refreshSession.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/com/atproto/server/getSession.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/com/atproto/server/deleteSession.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/actor/getProfile.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/actor/searchActors.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/getTimeline.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/getAuthorFeed.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/getFeed.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/getPostThread.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/getPosts.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/feed/searchPosts.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/graph/getFollowers.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/graph/getFollows.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/notification/listNotifications.json`
  - `https://raw.githubusercontent.com/bluesky-social/atproto/main/lexicons/app/bsky/notification/updateSeen.json`
- HTTP API route pattern confirmed from the official AT Protocol lexicons: `https://{service-host}/xrpc/{lexicon_id}`
- Auth/session routes use the account's PDS host; `app.bsky.*` views are implemented by Bluesky AppView services and other compatible AT Protocol services.
- Primary request/response format confirmed from the official lexicons: JSON over XRPC HTTP endpoints
- Auth model confirmed on the reviewed official files:
  - unauthenticated reads are allowed for some `app.bsky.*` queries
  - bearer-token auth is required for session inspection, notification writes, and some personalized reads
  - `refreshSession` and `deleteSession` explicitly require the `refreshJwt`, not the normal `accessJwt`
- Manually confirmed route count: `16`

## Authentication
- The official docs homepage exposes the Bluesky HTTP API reference and developer onboarding entry points.
- The official `com.atproto.server.createSession` lexicon defines the login/session-creation workflow.
- Confirmed JSON body fields for session creation:
  - `identifier` - handle or other server-supported identifier for the authenticating user
  - `password` - account password
  - `authFactorToken` - optional second-factor token when required
  - `allowTakendown` - optional boolean that returns a narrow-scoped token instead of throwing for takedown accounts
- Confirmed `createSession` response fields:
  - `accessJwt`
  - `refreshJwt`
  - `handle`
  - `did`
  - `didDoc`
  - `email`
  - `emailConfirmed`
  - `emailAuthFactor`
  - `active`
  - `status`
- `getSession` requires auth.
- `refreshSession` and `deleteSession` require auth with the `refreshJwt` token, per the official lexicon descriptions.

## API-wide behavior
- All reviewed endpoints follow the XRPC path convention `/xrpc/{NSID}`.
- Query endpoints are defined as lexicon type `query` and use URL query parameters.
- Mutation/session endpoints are defined as lexicon type `procedure` and use JSON request bodies when input schemas are present.
- The reviewed lexicons use cursor pagination on most collection/list APIs.
- The reviewed official lexicons did not publish a numeric global rate-limit table.

## Canonical endpoints

### Session and auth
#### 1) Create session
- Method: `POST`
- Path: `/xrpc/com.atproto.server.createSession`
- Purpose: create an authentication session
- JSON body fields confirmed from the lexicon:
  - `identifier`
  - `password`
  - `authFactorToken`
  - `allowTakendown`
- Important errors explicitly listed by the official lexicon:
  - `AccountTakedown`
  - `AuthFactorTokenRequired`

#### 2) Refresh session
- Method: `POST`
- Path: `/xrpc/com.atproto.server.refreshSession`
- Purpose: mint a fresh `accessJwt`/`refreshJwt` pair for the current session
- Auth: bearer auth with `refreshJwt`
- Confirmed output fields include refreshed `accessJwt`, refreshed `refreshJwt`, `handle`, `did`, `didDoc`, `email`, `emailConfirmed`, `emailAuthFactor`, `active`, and `status`
- Important errors explicitly listed by the official lexicon:
  - `AccountTakedown`
  - `InvalidToken`
  - `ExpiredToken`

#### 3) Get current session
- Method: `GET`
- Path: `/xrpc/com.atproto.server.getSession`
- Purpose: return information about the current authenticated session
- Auth: bearer auth required
- Confirmed response fields include `handle`, `did`, `didDoc`, `email`, `emailConfirmed`, `emailAuthFactor`, `active`, and `status`

#### 4) Delete current session
- Method: `POST`
- Path: `/xrpc/com.atproto.server.deleteSession`
- Purpose: revoke the current session
- Auth: bearer auth with `refreshJwt`
- Important usage note: the official lexicon explicitly says to use the refresh token, not the access token

### Actors
#### 5) Get actor profile
- Method: `GET`
- Path: `/xrpc/app.bsky.actor.getProfile`
- Purpose: fetch a detailed profile view for one actor
- Confirmed query parameter:
  - `actor` - handle or DID of the account to fetch
- Auth note: official lexicon says auth is not required, but authed requests may include more relevant metadata

#### 6) Search actors
- Method: `GET`
- Path: `/xrpc/app.bsky.actor.searchActors`
- Purpose: search profiles/actors
- Confirmed query parameters:
  - `term` - deprecated legacy query field
  - `q` - main search query string; the official lexicon recommends Lucene-style syntax
  - `limit` - integer, default `25`
  - `cursor` - pagination cursor
- Pagination note: official lexicon uses cursor-based pagination here

### Feed reads
#### 7) Get home timeline
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.getTimeline`
- Purpose: fetch the requesting account's home timeline
- Confirmed query parameters:
  - `algorithm` - implementation-specific timeline variant
  - `limit` - integer, default `50`
  - `cursor` - pagination cursor
- Auth note: this is personalized timeline data, so caller auth is effectively required

#### 8) Get author feed
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.getAuthorFeed`
- Purpose: fetch posts and reposts from one actor's author feed
- Confirmed query parameters:
  - `actor`
  - `limit` - default `50`
  - `cursor`
  - `filter` - combinations of post/repost types; default `posts_with_replies`
  - `includePins`
- Auth note: official lexicon says auth is not required

#### 9) Get feed generator output
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.getFeed`
- Purpose: fetch a hydrated feed from a selected feed generator
- Confirmed query parameters:
  - `feed`
  - `limit` - default `50`
  - `cursor`

#### 10) Get post thread
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.getPostThread`
- Purpose: fetch a thread rooted at one AT-URI post
- Confirmed query parameters:
  - `uri` - AT-URI for the post
  - `depth` - reply depth to include, default `6`
  - `parentHeight` - number of parent levels to include, default `80`
- Auth note: official lexicon says auth is not required, but authed requests may receive additional metadata/filtering

#### 11) Hydrate specific posts
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.getPosts`
- Purpose: hydrate views for a list of post AT-URIs
- Confirmed query parameter:
  - `uris` - array of post AT-URIs

#### 12) Search posts
- Method: `GET`
- Path: `/xrpc/app.bsky.feed.searchPosts`
- Purpose: search for posts matching query criteria
- Confirmed query parameters:
  - `q` - search query string
  - `sort` - result ranking order; default `latest`
  - `since` - lower datetime/date bound
  - `until` - upper datetime/date bound
  - `mentions` - filter to posts mentioning an account
  - `author` - filter to posts by an account
  - `lang` - filter by language
  - `domain` - filter by linked hostname
  - `url` - filter by linked URL
  - `tag` - array of hashtag values, without the `#`
  - `limit` - integer, default `25`
  - `cursor` - optional pagination cursor; official lexicon says it may not allow scrolling through the full result set
- Important error explicitly listed by the official lexicon:
  - `BadQueryString`

### Social graph
#### 13) Get followers
- Method: `GET`
- Path: `/xrpc/app.bsky.graph.getFollowers`
- Purpose: list accounts following the specified actor
- Confirmed query parameters:
  - `actor`
  - `limit` - default `50`
  - `cursor`

#### 14) Get follows
- Method: `GET`
- Path: `/xrpc/app.bsky.graph.getFollows`
- Purpose: list accounts the specified actor follows
- Confirmed query parameters:
  - `actor`
  - `limit` - default `50`
  - `cursor`

### Notifications
#### 15) List notifications
- Method: `GET`
- Path: `/xrpc/app.bsky.notification.listNotifications`
- Purpose: enumerate notifications for the requesting account
- Auth: bearer auth required
- Confirmed query parameters:
  - `reasons` - array of notification reasons to include
  - `limit` - default `50`
  - `priority`
  - `cursor`
  - `seenAt`

#### 16) Mark notifications seen
- Method: `POST`
- Path: `/xrpc/app.bsky.notification.updateSeen`
- Purpose: tell the server when the requesting account last saw notifications
- Auth: bearer auth required
- Confirmed JSON body field:
  - `seenAt` - datetime

## Pagination
- The reviewed official lexicons use `cursor` pagination on actor search, timeline/feed reads, graph lists, and notifications.
- Confirmed default limits from the reviewed files:
  - `searchActors`: `25`
  - `getTimeline`: `50`
  - `getAuthorFeed`: `50`
  - `getFeed`: `50`
  - `searchPosts`: `25`
  - `getFollowers`: `50`
  - `getFollows`: `50`
  - `listNotifications`: `50`
- `searchPosts` explicitly warns that its cursor may not allow full scrolling through the entire result set.

## Errors and format notes
- The reviewed official lexicons define JSON request and response schemas.
- Explicitly listed error names from the reviewed official lexicons:
  - `AccountTakedown`
  - `AuthFactorTokenRequired`
  - `InvalidToken`
  - `ExpiredToken`
  - `BadQueryString`
- The reviewed official pages/lexicons in this pass did not publish a numeric provider-wide rate-limit schedule.

## Important usage notes
- Endpoint paths are lexicon IDs prefixed with `/xrpc/`, so the route surface expands as Bluesky/AT Protocol lexicons evolve.
- Some `app.bsky.*` endpoints are public, but the official lexicon descriptions repeatedly note that authenticated requests can include richer metadata or service-specific behavior.
- Session-destruction and session-refresh flows are refresh-token operations, not normal access-token operations.
- `app.bsky.feed.getTimeline` is personalized home-timeline data rather than a generic public feed.
