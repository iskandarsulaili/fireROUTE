# Dailymotion

## Provider metadata
- Category: `Video`
- Provider slug: `dailymotion`
- Official docs pages used:
  - `https://developers.dailymotion.com/reference/introduction`
  - `https://developers.dailymotion.com/reference/authentication-api`
  - `https://developers.dailymotion.com/reference/client-credentials-request-access-token`
  - `https://developers.dailymotion.com/reference/client-credentials-token-details`
  - `https://developers.dailymotion.com/reference/build-your-authorization-code`
  - `https://developers.dailymotion.com/reference/generate-access-token-with-authorization-code`
  - `https://developers.dailymotion.com/reference/api-get-access-token-details`
  - `https://developers.dailymotion.com/reference/api-revoke-an-access-token`
  - `https://developers.dailymotion.com/reference/api-generate-refresh-token`
  - `https://developers.dailymotion.com/reference/api-get-video-`
  - `https://developers.dailymotion.com/reference/api-list-videos`
  - `https://developers.dailymotion.com/reference/rate-limiting`
  - `https://developers.dailymotion.com/reference/api-errors`
- Main legacy/client API base URL confirmed from the official route pages: `https://api.dailymotion.com`
- Partner/server-side API base URL confirmed from the official route pages: `https://partner.api.dailymotion.com`
- Supported auth models confirmed on the reviewed official pages:
  - public API key / client-side OAuth flows for public-data and user-authorized actions
  - private API key / secret for server-side partner flows
  - OAuth-style bearer access tokens for authenticated resource calls
- Primary request/response formats confirmed from the reviewed official route pages: query-string GET requests, form-data token requests, JSON responses
- Manually confirmed route count: `9`

## Authentication
- The official authentication overview page says Dailymotion provides two API key types depending on integration scope and technical needs.
- The same reviewed page distinguishes:
  - public API keys for client-side applications where the key may be visible and the app accesses public data or acts on behalf of a user
  - private API keys for server-side integrations where keys stay hidden and the app acts on behalf of the organization
- The reviewed token pages confirm OAuth-style token issuance with bearer-token usage on authenticated resource routes.
- The reviewed authorization-code pages confirm the browser redirect flow through `/oauth/authorize` followed by token exchange on `/oauth/token`.

## API-wide behavior
- The official introduction/reference page separates server-side partner endpoints from client-side endpoints.
- Reviewed resource pages consistently expose fully qualified route URLs on either `https://api.dailymotion.com` or `https://partner.api.dailymotion.com`.
- The reviewed route pages show field-selection through a `fields` parameter on content routes.
- The official `rate-limiting` page and `api-errors` page were both reachable in this pass, but the accessible rendered content available to this browser session did not expose a numeric global quota table or a full error-code matrix.

## Canonical endpoints

### Server-side / partner auth
#### 1) Request a partner access token
- Method: `POST`
- URL: `https://partner.api.dailymotion.com/oauth/v1/token`
- Purpose: mint a server-side access token with a private API key/secret
- Request format shown on the official page: form data
- Confirmed form fields:
  - `scope` - required, space-separated scopes
  - `grant_type` - required, must be `client_credentials`
  - `client_id` - required, private API key from Dailymotion Studio
  - `client_secret` - required, private API secret from Dailymotion Studio
- Scope values explicitly listed on the reviewed page:
  - Platform API: `manage_videos`, `manage_players`, `manage_playlists`, `manage_subtitles`, `email`, `userinfo`
  - Reporting API: `access_ads`, `access_revenue`, `create_reports`, `delete_reports`
- Confirmed responses shown on the official page:
  - `200` OAuth generation success
  - `422` validation error

#### 2) Inspect a partner token
- Method: `GET`
- URL: `https://partner.api.dailymotion.com/rest/auth`
- Purpose: return information about the current partner bearer token
- Auth: bearer token according to the reviewed route page

### Client-side / user-authorized auth
#### 3) Build the authorization-code URL
- Method: `GET`
- URL: `https://api.dailymotion.com/oauth/authorize`
- Purpose: redirect the user to consent and receive an authorization code
- Confirmed query parameters:
  - `response_type` - required, set to `code`
  - `client_id` - required, API key from Dailymotion Studio
  - `redirect_uri` - required, must match the callback URL configured for the API key
  - `scope` - required, requested permissions/access rights
- Important note from the official page: after successful login/consent, Dailymotion redirects to the configured callback with `?code=AUTHORIZATION_CODE`

#### 4) Exchange authorization code for tokens
- Method: `POST`
- URL: `https://api.dailymotion.com/oauth/token`
- Purpose: exchange a previously issued authorization code for an access token and refresh token
- Confirmed request parameters on the reviewed page:
  - `grant_type` - required, `authorization_code`
  - `client_id` - required
  - `client_secret` - required
  - `redirect_uri` - required and must match the callback URL configured for the API key
  - `code` - required authorization code from the previous step
- Important note from the official page: the response includes `access_token`, `expires_in`, and `refresh_token`

#### 5) Inspect an access token
- Method: `GET`
- URL: `https://api.dailymotion.com/auth`
- Purpose: return information about the access token supplied in the Authorization header
- Auth note from the reviewed page metadata: add the token to the `Authorization` header

#### 6) Revoke authorization / logout
- Method: `GET`
- URL: `https://api.dailymotion.com/logout`
- Purpose: revoke the current authorized session/tokens
- Confirmed query parameter:
  - `access_token`
- Important note from the official page metadata: the route can revoke the current session when called with the Authorization header or `access_token` query parameter

#### 7) Refresh an access token
- Method: `POST`
- URL: `https://api.dailymotion.com/oauth/token`
- Purpose: exchange a refresh token for a fresh access token
- Request format shown on the official page: form data
- Confirmed form fields:
  - `grant_type` - required, defaults to `refresh_token`
  - `client_id` - required
  - `client_secret` - required
  - `refresh_token` - required
- Important note from the official page: `expires_in` in the previous token response determines token lifetime and the refresh token lets the app get another access token without asking for user credentials again

### Video reads
#### 8) Get one video
- Method: `GET`
- URL: `https://api.dailymotion.com/video/{VIDEO_ID}`
- Purpose: return details for a single video
- Confirmed path parameter:
  - `VIDEO_ID` - unique identifier of the video
- Confirmed query parameters from the reviewed page:
  - `fields` - comma-separated list of fields to return
  - `no_expire` - for stream URLs, whether the stream URL should not expire in time
  - `no_ip_lock` - for stream URLs, whether the stream URL should not be tied to the end-user IP address
- Response confirmed on the official page: `200` success

#### 9) List videos
- Method: `GET`
- URL: `https://api.dailymotion.com/videos`
- Purpose: search/browse videos with filters
- Confirmed query parameters from the reviewed page:
  - `fields` - comma-separated list of fields to return
  - `availability` - filter to available videos
  - `channel` - filter by video category/channel
  - `created_after` - timestamp lower bound
  - `created_before` - timestamp upper bound
  - `ids` - limit the result set to a list of video identifiers
  - `languages` - limit the result set to one or more declared languages
  - `live` - filter live streaming videos
  - `live_offair` - filter off-air live videos
  - `live_onair` - filter on-air live videos
  - `live_upcoming` - filter upcoming live videos
  - `longer_than` - minimum duration filter
- Important note from the official page: the `fields` parameter can request only selected resource fields and the page explicitly points to the exhaustive field list for allowed values

## Pagination
- The reviewed `List videos` page confirmed a filter-heavy collection endpoint, but the accessible rendered snippet in this session did not expose a complete pagination section or page-size table.
- No cursor-based pagination model was visible on the reviewed route snippets.

## Errors and rate limits
- The official `API Errors` page explicitly says API requests can return errors and that the page documents the most common errors, but the accessible rendered content in this session did not expose the full error-code table.
- The official `Rate limiting` page was reachable, but the accessible rendered content in this session did not expose a numeric quota schedule.
- The partner token page explicitly documents a `422 Validation Error` response alongside `200` success.

## Important usage notes
- Dailymotion currently documents separate partner/server-side and client-side route groups, with different base hosts.
- The reviewed auth pages distinguish public API keys from private API keys; choose the key type based on whether the app runs client-side or server-side.
- Authorization-code flows require the `redirect_uri` to match the callback configured for the API key, or the server rejects the request.
- Video resource reads rely heavily on the `fields` selector, so integrations should request only the fields they actually need.
