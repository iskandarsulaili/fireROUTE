# Mixcloud

## Overview
- Provider: Mixcloud API
- Category: Music
- Official docs: `https://www.mixcloud.com/developers/`
- Widget docs mentioned by Mixcloud: `https://www.mixcloud.com/developers/widget/`
- Base URLs:
  - `https://api.mixcloud.com`
  - `https://www.mixcloud.com/oauth`
  - `https://app.mixcloud.com/oembed/`
- Auth: OAuth 2.0 access tokens for protected routes; access tokens are passed as the `access_token` query parameter in the official examples
- HTTPS: yes; docs explicitly require HTTPS for `/me/` and token-bearing requests
- Response format: JSON by default; JSONP is supported on API GET requests by adding `callback`; rate-limit examples also mention JSON/XML error bodies
- Pagination: `limit` and `offset` for list paging; date-based lists can also use `since` and `until`; list responses include previous/next page URLs
- Rate limits: Mixcloud says rate limits apply to all API actions, but no fixed numeric quotas are published; when exceeded, responses include HTTP `403`, a `Retry-After` header, and an error body with `retry_after`

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/{object_key}/` | optional `callback`, optional `access_token` | Generic object lookup. The docs say Mixcloud objects are found by taking the site URL and replacing `https://www.mixcloud.com/` with `https://api.mixcloud.com/`. |
| GET | `/{object_key}/` | optional `metadata=1` | Adds metadata describing available object connections such as `followers`, `favorites`, `following`, `cloudcasts`, and `listens`. |
| GET | `/{object_key}/{connection}/` | optional `limit`, `offset`, `since`, `until`, optional `access_token` | Generic connection/list endpoint discovered from metadata. |
| GET | `/popular/` | optional pagination parameters | Popular list. |
| GET | `/popular/hot/` | optional pagination parameters | Hot list. |
| GET | `/new/` | optional pagination parameters | New list. |
| GET | `/me/` | required `access_token` over HTTPS | Shortcut for the authorized user and their connections. |
| GET | `/search/` | required `q`, required `type` | Search across content types. Docs say `type` is one of upload/cloudcast, user, or tag depending on the API object you want back. |
| GET | `/oauth/authorize` | required `client_id`, required `redirect_uri` | Browser-based OAuth authorization entrypoint. |
| GET | `/oauth/access_token` | required `client_id`, `redirect_uri`, `client_secret`, `code` | Exchanges the OAuth code for an access token. |
| POST, DELETE | `/{username}/follow/` | required `access_token` | Follow or unfollow a user. Docs also allow `POST` with `method=delete` to simulate `DELETE`. |
| POST, DELETE | `/{username}/{cloudcast_slug}/favorite/` | required `access_token` | Favorite or unfavorite an upload/cloudcast. |
| POST, DELETE | `/{username}/{cloudcast_slug}/repost/` | required `access_token` | Repost or unrepost an upload/cloudcast. |
| POST, DELETE | `/{username}/{cloudcast_slug}/listen-later/` | required `access_token` | Add or remove a cloudcast from Listen Later. |
| GET | `/{username}/{cloudcast_slug}/embed-html/` | optional widget presentation params | Returns embed HTML for the cloudcast widget. |
| GET | `/{username}/{cloudcast_slug}/embed-json/` | optional `width`, `height`, `color` | JSONP-friendly embedding variant that wraps the embed HTML in JSON. |
| GET | `/oembed/` on `https://app.mixcloud.com` | required `url`, optional `format=json` | oEmbed discovery endpoint for Mixcloud content URLs. |
| POST | `/upload/` | required `access_token`; multipart fields such as `mp3`, `name`, tags, sections, image, description | Upload a new show/cloudcast. |
| POST | `/upload/{username}/{cloudcast_slug}/edit/` | required `access_token`; multipart metadata fields; optional `publish`, `unpublish`, `unlisted` controls | Edit an existing upload, including uploads not originally created by the API. |

Confirmed route count: **19**.

## Object model notes
The official docs present Mixcloud as a URL-mirroring API. Confirmed object examples on the docs page include:
- user objects like `/{username}/`
- cloudcast/show objects like `/{username}/{cloudcast_slug}/`
- tag objects like `/genres/{tag}/`
- city objects like `/genres/city:{city}/`
- combined tag-and-city objects like `/genres/{tag}+city:{city}/`

Each object response includes a `key` field that represents the API path from the first slash onward.

## Search and pagination notes
- `search` requires:
  - `q` — search string
  - `type` — documented as upload/cloudcast, user, or tag
- List endpoints support:
  - `limit`
  - `offset`
  - `since`
  - `until`
- The docs say `since` and `until` accept either Unix timestamps or UTC datetimes in `YYYY-MM-DD HH:MM:SS` format.
- Returned lists include previous/next URLs.
- If you want paging links to continue using `offset` instead of default date paging, the docs say to include `offset=0` on the first request.

## Auth notes
- Mixcloud documents only browser-based OAuth authorization.
- Authorization flow from the docs:
  1. Redirect the user to `https://www.mixcloud.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI`
  2. Receive `YOUR_REDIRECT_URI?code=OAUTH_CODE` after approval
  3. Exchange the code at `https://www.mixcloud.com/oauth/access_token?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&client_secret=YOUR_CLIENT_SECRET&code=OAUTH_CODE`
  4. Use the returned `access_token=YOUR_ACCESS_TOKEN` as the `access_token` query parameter on protected API calls
- The docs warn that users can revoke tokens and clients must handle `An invalid access token was provided` failures by re-authenticating.
- `/me/` is only available over HTTPS and only with an access token.

## Upload and edit parameter notes
### Upload fields explicitly documented
- `mp3` — required upload file; docs cap size at `4294967296` bytes
- `name` — required for tracks
- `picture` — optional image; docs cap size at `10485760` bytes
- `description` — optional, max 1000 characters
- `tags-X-tag` — up to 5 tags
- `unlisted` — private/unlisted upload
- `publish_date` — Pro-only scheduled publish time in UTC `YYYY-MM-DDTHH:MM:SSZ`
- `disable_comments` — Pro-only
- `hide_stats` — Pro-only
- `hosts-X-username` — Pro-only host tagging; up to 2 users with additional dashboard/account constraints
- `sections-X-artist`
- `sections-X-song`
- `sections-X-chapter`
- `sections-X-start_time`

### Edit-specific notes
- Edit requests use multipart/form-data just like uploads, except `mp3` is not accepted.
- If tag fields are posted, all tags are overwritten.
- If section fields are posted, the entire tracklist is overwritten.
- If host fields are posted, the full host list is overwritten.
- Edit-only state controls documented on the page:
  - `publish`
  - `unpublish`
  - `unlisted`
- The docs say you may supply only one of `unlisted`, `publish`, or `unpublish` in an edit request.

## Embedding and media notes
- `embed-html` returns widget embed markup.
- `embed-json` is the JSON/JSONP-friendly version and accepts `width`, `height`, and `color` to customize widget appearance.
- Mixcloud also supports oEmbed via `https://app.mixcloud.com/oembed/`.
- The docs explicitly say audio streams themselves are not available through the API.

## Error and rate-limit notes
- Numeric rate limits are not published on the inspected official page.
- The docs say all actions are rate limited.
- Official rate-limit example:
  - HTTP `403 Forbidden`
  - `Retry-After: 452`
  - body:
    - `{ "error": { "message": "You have hit your rate limit. Retry after 452 seconds.", "type": "RateLimitException", "retry_after": 452 } }`
- Protected-route failures can also occur when an access token is invalid or revoked.

## fireROUTE integration notes
- Treat Mixcloud as a URL-derived API: many useful endpoints are produced from Mixcloud content URLs rather than a rigid fixed path catalog.
- Preserve support for generic object keys and metadata-driven connections instead of hardcoding only a few object types.
- Model follow/favorite/repost/listen-later as state-changing subresources that accept `POST` and `DELETE` semantics.
- Upload/edit flows require multipart bodies and should be treated separately from the read-only JSON endpoints.
- Do not model Mixcloud as a stream-delivery API; the official docs explicitly exclude audio stream access.

## Sources inspected
- `https://www.mixcloud.com/developers/`
- `https://www.mixcloud.com/developers/widget/`
- `https://app.mixcloud.com/oembed/?url=https%3A%2F%2Fwww.mixcloud.com%2Fspartacus%2Fparty-time%2F&format=json`
