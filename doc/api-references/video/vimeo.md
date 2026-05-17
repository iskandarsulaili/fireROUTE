# Vimeo

## Provider metadata
- Category: `Video`
- Provider slug: `vimeo`
- Official docs pages used:
  - `https://developer.vimeo.com/`
  - `https://developer.vimeo.com/api/reference`
  - `https://developer.vimeo.com/api/authentication`
  - `https://developer.vimeo.com/api/common-formats`
  - `https://developer.vimeo.com/guidelines/rate-limiting`
  - `https://developer.vimeo.com/api/upload/videos`
  - `https://developer.vimeo.com/api/guides/folders`
  - `https://developer.vimeo.com/api/oembed/videos`
- Main REST API base URL: `https://api.vimeo.com`
- Public oEmbed URL: `https://vimeo.com/api/oembed.json`
- Auth models confirmed on the official pages:
  - OAuth2 bearer token for normal API requests
  - HTTP Basic auth with client ID and client secret for some OAuth token-grant requests
  - no API auth required for public oEmbed requests
- Supported request payload formats confirmed on the reviewed pages: `application/json`, `application/offset+octet-stream`, `application/x-www-form-urlencoded`, `multipart/form-data`
- Primary response formats confirmed on the reviewed pages: JSON resource representations, JSON collection representations, HTTP headers for tus upload state, HTML form markup returned for form-based uploads, oEmbed JSON
- Manually confirmed route count: `13`

## Authentication
- The authentication guide says Vimeo uses OAuth 2.0 for API authentication.
- The same guide distinguishes unauthenticated access tokens for public data from authenticated access tokens tied to a specific Vimeo member.
- The reviewed guide lists scopes including `public`, `private`, `create`, `edit`, `delete`, `interact`, `stats`, `upload`, and `video_files`.
- For normal API calls, the reviewed guides consistently use `Authorization: bearer {access_token}`.
- For token-grant requests such as client-credentials and authorization-code exchange, the authentication guide says to use HTTP Basic auth with the app's client ID and client secret.

## API-wide behavior
- The API reference says Vimeo endpoints are appended to `https://api.vimeo.com`.
- The common-formats page says responses are hierarchical JSON objects and collection responses include `total`, `page`, `per_page`, `paging`, and `data`.
- The common-formats page recommends sending `Accept: application/vnd.vimeo.*+json;version=3.4` with API requests.
- The same page says request and response data should be UTF-8 encoded.
- The common-formats page documents `/me` as a special alias endpoint for the currently authenticated user.

## Canonical endpoints

### OAuth2 token workflows
#### 1) Client credentials grant
- Method: `POST`
- Path: `/oauth/authorize/client`
- Purpose: mint an access token for public-data access through the client-credentials flow
- Auth: HTTP Basic with `client_id:client_secret`
- Headers confirmed by the official authentication guide:
  - `Authorization: basic base64_encode(client_id:client_secret)`
  - `Content-Type: application/json`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- JSON body fields confirmed by the guide:
  - `grant_type` - required, `client_credentials`
  - `scope` - requested scope list, official example shows `public`

#### 2) Authorization URL for member consent
- Method: `GET`
- Path: `/oauth/authorize`
- Purpose: redirect a Vimeo member into the authorization-code or implicit flow
- Confirmed query parameters from the authentication guide:
  - `response_type` - `code` or `token` depending on the flow
  - `client_id` - app client ID
  - `redirect_uri` - registered redirect URI
  - `state` - caller-generated anti-CSRF value
  - `scope` - space-separated scopes; the guide says the default is `public private`

#### 3) Authorization-code token exchange
- Method: `POST`
- Path: `/oauth/access_token`
- Purpose: exchange an authorization code for an access token
- Auth: HTTP Basic with `client_id:client_secret`
- Headers confirmed by the guide:
  - `Authorization: basic base64_encode(client_id:client_secret)`
  - `Content-Type: application/json`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- JSON body fields:
  - `grant_type` - `authorization_code`
  - `code` - authorization code returned to the redirect URI
  - `redirect_uri` - must match the redirect URI used earlier
- Confirmed response fields from the official example:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `refresh_token`
  - `scope`

### Folders and collections
#### 4) Get one folder
- Method: `GET`
- Path: `/users/{user_id}/folders/{project_id}`
- Purpose: return a single folder by ID
- Auth: bearer token
- Required header pattern confirmed by the folders guide:
  - `Authorization: bearer {access_token}`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- Important note: the guide says `/users/{user_id}/...` can often be replaced with `/me/...` when working in the authenticated user's own account

#### 5) Get all folders for a user
- Method: `GET`
- Path: `/users/{user_id}/folders`
- Purpose: return all folders for a user/team owner
- Auth scope note: the folders guide says this requires an access token with the `private` scope
- Pagination note: the official page says results may span multiple pages and default to `25` folders per page

#### 6) Create a folder
- Method: `POST`
- Path: `/users/{user_id}/folders`
- Purpose: create a top-level folder or subfolder
- Auth scope note: the folders guide says folder creation requires the `create` scope
- Headers confirmed by the guide:
  - `Authorization: bearer {access_token}`
  - `Content-Type: application/json`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- JSON body fields confirmed on the official page:
  - `name` - folder name for top-level folder creation
  - `parent_folder_uri` - parent folder URI when creating a subfolder
- Success note: the guide says successful creation returns HTTP `201 Created`

#### 7) Delete a folder
- Method: `DELETE`
- Path: `/users/{user_id}/folders/{project_id}`
- Purpose: delete a folder
- Auth scope note: the folders guide says this requires the `delete` scope
- Confirmed query parameter:
  - `should_delete_clips=true` - optionally delete the folder contents too
- Success note: the guide says successful deletion returns HTTP `204 No Content`

#### 8) Get folder items
- Method: `GET`
- Path: `/users/{user_id}/projects/{project_id}/items`
- Purpose: list folder contents using the guide's recommended general items endpoint
- Confirmed query parameters from the folders guide excerpt reviewed:
  - `filter` - filter by item attribute, with the guide explicitly showing `filter=video`
  - `direction` - sort direction `asc` or `desc`
- Important note: the guide recommends `/items` as the main endpoint for folder content access and modification

#### 9) Get only videos from a folder
- Method: `GET`
- Path: `/users/{user_id}/projects/{project_id}/videos`
- Purpose: list only videos in a folder
- Alternative documented by the same guide: `/users/{user_id}/projects/{project_id}/items?filter=video`

### Video creation and upload workflows
#### 10) Create a video placeholder / start an upload
- Method: `POST`
- Path: `/me/videos`
- Purpose: create a video resource and choose an upload approach
- Auth scope notes from the upload guide:
  - video uploads require an access token with `upload` and `edit`
  - Vimeo Free subscribers also need approved upload access for the API application
- Headers confirmed by the guide:
  - `Authorization: bearer {access_token}`
  - `Content-Type: application/json`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- Confirmed body patterns:
  - Resumable/tus upload: `{"upload":{"approach":"tus","size":"{size}"}}`
  - Form-based upload: `{"upload":{"approach":"post","redirect_url":"{url}"}}`
  - Pull upload: `{"upload":{"approach":"pull","size":"{size}","link":"{url}"}}`
- Important notes from the official guide:
  - the same POST creates a placeholder even if the file is never fully uploaded
  - the maximum video file size is `300 GB`
  - the maximum duration is `24 hours`
  - successful pull uploads return HTTP `201`
  - resumable creation returns a response containing `upload.upload_link` and `uri`

#### 11) Upload or resume binary video data via tus
- Method: `PATCH`
- Path pattern: `{upload.upload_link}`
- Purpose: send all or the remaining binary portion of a resumable upload
- Confirmed headers:
  - `Tus-Resumable: 1.0.0`
  - `Upload-Offset` - `0` initially, then the most recent server-reported offset for resumes
  - `Content-Type: application/offset+octet-stream`
- Important usage notes from the guide:
  - the official guide says the `Accept` header is ignored during the resumable PATCH itself
  - Vimeo recommends chunk sizes around `128-512 MB` when a tus library chunks uploads
  - compare returned `Upload-Offset` against the file size to determine completeness

#### 12) Check tus upload state
- Method: `HEAD`
- Path pattern: `{upload.upload_link}`
- Purpose: inspect resumable upload progress
- Confirmed headers:
  - `Tus-Resumable: 1.0.0`
  - `Accept: application/vnd.vimeo.*+json;version=3.4`
- Confirmed response headers used for state tracking:
  - `Upload-Length`
  - `Upload-Offset`
- Important note: the guide says equality of `Upload-Length` and `Upload-Offset` means Vimeo has received the full file

### oEmbed
#### 13) Get video oEmbed metadata
- Method: `GET`
- URL: `https://vimeo.com/api/oembed.json`
- Purpose: return oEmbed data including embeddable player HTML for a Vimeo video
- Auth: none required according to the official oEmbed guide
- Confirmed query parameters from the reviewed page:
  - `url` - URL-encoded Vimeo video URL; required for unlisted videos and must include the `h` parameter when applicable
  - `id` - video ID alternative to `url`
  - `width` - preferred embed width
  - `height` - preferred embed height
  - `callback` - JSONP callback name
  - player customization options such as `autoplay`, `autopause`, `background`, `byline`, `cc`, `api`, and more documented on the page
- Confirmed supported source URL schemes from the official page:
  - `https://vimeo.com/{video_id}`
  - `https://vimeo.com/album/{album_id}/video/{video_id}`
  - `https://vimeo.com/channels/{channel_id}/{video_id}`
  - `https://vimeo.com/groups/{group_id}/videos/{video_id}`
  - `https://vimeo.com/ondemand/{ondemand_id}/{video_id}`

## Rate limits
- The rate-limiting guide says Vimeo rate limits are enforced per minute and are tied to the end user identified by the token.
- Confirmed per-user quotas for current membership tiers reviewed on the official page:
  - Vimeo Free: `25` requests/minute
  - Vimeo Starter: `125` requests/minute
  - Vimeo Standard: `250` requests/minute
  - Vimeo Advanced: `750` requests/minute
  - Vimeo Enterprise: `2500` requests/minute
- The guide says field filtering effectively doubles the quota.
- Confirmed rate-limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- The guide says quota overruns return HTTP `429` with error code `9000` for the remainder of the current 60-second period.

## Pagination and collection behavior
- The common-formats page documents collection responses with:
  - `total`
  - `page`
  - `per_page`
  - `paging.next`
  - `paging.previous`
  - `paging.first`
  - `paging.last`
  - `data`
- The same page says `per_page` defaults to `25` and can go up to `100`.
- The guide explains that clients can follow the `paging.*` URIs directly or send their own `page` value.
- The folders guide independently confirms multi-page folder listings and the same default page size.

## Error and format notes
- The common-formats page says Vimeo returns UTF-8 JSON representations.
- The authentication guide includes common-error tables for token exchange flows and makes clear that wrong token flow parameters fail the request.
- The rate-limits page says exceeding quota returns HTTP `429` and error code `9000`.
- The upload guide notes that pull-upload requests can still initially return success even if the linked file later proves invalid or non-video, because file analysis happens after Vimeo copies the remote file.
- The upload guide says form-based uploads return HTML form markup in `upload.form`, while tus uploads rely heavily on HTTP headers rather than JSON bodies during PATCH/HEAD operations.

## Important usage notes
- The upload guide says not to create upload placeholders until the caller is actually ready to upload, because unfinished placeholders remain in the account.
- Pull-upload URLs must resolve directly to the video file, be URL-encoded, and be no longer than `16,384` characters.
- For CDN-backed pull uploads, the official guide says URLs should be public unsigned URLs, or presigned URLs that remain valid for at least six hours.
- The oEmbed guide says unlisted videos require the full unlisted URL, not just the numeric video ID.

## fireROUTE normalization notes
- Treat Vimeo as a multi-surface provider: OAuth2/token endpoints, REST resource endpoints, tus upload URLs, and unauthenticated oEmbed URLs should not be flattened into one auth assumption.
- Preserve the documented collection envelope (`total`, `page`, `per_page`, `paging`, `data`) rather than replacing it with a generic list wrapper.
- Model `/me/videos` as an upload-initialization route whose follow-up behavior depends on `upload.approach`.
- Preserve tus-specific headers and offset semantics because they are part of the functional upload protocol, not incidental transport details.
