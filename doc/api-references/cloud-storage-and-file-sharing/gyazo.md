# Gyazo

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `gyazo`
- Official docs used manually:
  - `https://gyazo.com/api/docs`
  - `https://gyazo.com/api/docs/image`
  - `https://gyazo.com/api/docs/user`
  - `https://gyazo.com/api/docs/search`
  - `https://gyazo.com/api/docs/auth`
  - `https://gyazo.com/api/docs/errors`
- Confirmed API base URLs:
  - `https://api.gyazo.com`
  - `https://upload.gyazo.com`
- Primary response format: JSON
- Authentication model:
  - OAuth 2.0 for user-authorized access
  - some docs also mention `client_id` authentication for routes that do not touch user data
  - user-data routes in the reviewed pages use a user `access_token`, either as a query parameter or as a Bearer authorization header
- Manually confirmed routes in this pass: `9`

## Authentication and access
From the reviewed official pages:
- developers register an application to obtain `client_id` and `client_secret`
- Gyazo explicitly documents two auth styles:
  - `client_id` authentication for APIs that do not touch user data
  - OAuth 2.0 for user-authorized APIs
- OAuth authorize route parameters:
  - `client_id` - required
  - `redirect_uri` - required
  - `response_type` - required, must be `code`
  - `state` - optional and recommended for CSRF protection
  - `team` - optional; `team=*` for any teams or a specific team name
- token exchange parameters:
  - `client_id`
  - `client_secret`
  - `redirect_uri`
  - `code`
  - `grant_type=authorization_code`
- reviewed docs show authenticated API calls either with:
  - query parameter `access_token=...`
  - or header `Authorization: Bearer YOUR_ACCESS_TOKEN`

## Confirmed API surface
The reviewed Gyazo docs explicitly document these routes:
- `POST /api/upload`
- `GET /api/images`
- `GET /api/images/:image_id`
- `DELETE /api/images/:image_id`
- `GET /api/oembed`
- `GET /api/users/me`
- `GET /api/search`
- `GET /oauth/authorize`
- `POST /oauth/token`

## 1) Upload image
- Method: `POST`
- Full URL: `https://upload.gyazo.com/api/upload`
- Purpose: upload a new image
- Request format: `multipart/form-data`

Documented parameters:
- `access_token` - required user access token
- `imagedata` - required binary upload part
  - docs explicitly say the multipart part must include a `filename` directive in `Content-Disposition`
- `access_policy` - optional, `anyone` or `only_me`; defaults to `anyone`
- `metadata_is_public` - optional string `true` or `false`
- `referer_url` - optional source site URL
- `app` - optional application name
- `title` - optional site title
- `desc` - optional comment
- `created_at` - optional Unix timestamp
- `collection_id` - optional collection target

Documented success response fields include:
- `image_id`
- `permalink_url`
- `thumb_url`
- `url`
- `type`

## 2) List user images
- Method: `GET`
- Full URL: `https://api.gyazo.com/api/images`
- Purpose: list a user's saved images

Documented parameters:
- `access_token` - required
- `page` - optional, default `1`
- `per_page` - optional, default `20`, range `1` to `100`

Documented pagination headers:
- `X-Total-Count`
- `X-Current-Page`
- `X-Per-Page`
- `X-User-Type`

## 3) Get one image
- Method: `GET`
- Full URL: `https://api.gyazo.com/api/images/:image_id`
- Purpose: fetch one saved image by Gyazo image id

Documented parameters:
- `access_token` - required
- `image_id` - required

Documented response fields include:
- `image_id`
- `permalink_url`
- `thumb_url`
- `type`
- `created_at`
- `metadata`
- `ocr`

## 4) Delete one image
- Method: `DELETE`
- Full URL: `https://api.gyazo.com/api/images/:image_id`
- Purpose: delete an image

Documented parameters:
- `image_id` - required

Important usage note from the docs:
- you can only delete your own images

## 5) Resolve oEmbed image URL
- Method: `GET`
- Full URL: `https://api.gyazo.com/api/oembed?url=:image_url`
- Purpose: return oEmbed-style metadata / raw image URL for a Gyazo image page

Documented parameters:
- `url` - required Gyazo image page URL such as `http://gyazo.com/XXXXXXXXXXXX`

Documented response fields include:
- `version`
- `type`
- `provider_name`
- `provider_url`
- `url`
- `width`
- `height`

## 6) Get authenticated user profile
- Method: `GET`
- Full URL: `https://api.gyazo.com/api/users/me`
- Purpose: return the authenticated user's profile

Documented behavior:
- authentication is required
- response is nested under `user`

Documented response fields include:
- `email`
- `name`
- `profile_image`
- `uid`

## 7) Search a user's images
- Method: `GET`
- Full URL: `https://api.gyazo.com/api/search`
- Purpose: search through a user's saved images

Documented parameters:
- `access_token` - required
- `query` - required, max length `200`
- `page` - optional, default `1`
- `per` - optional, default `20`, max `100`

Documented response notes:
- response includes image objects in a `captures` array in the quickstart sample
- individual image objects can include `image_id`, `permalink_url`, `thumb_url`, `url`, `type`, `created_at`, `video_length`, `mp4_url`, `metadata`, and `ocr`

## 8) OAuth authorize and token exchange
### Authorize
- Method: `GET`
- Path: `/oauth/authorize`
- Host: `https://gyazo.com`
- Purpose: request user authorization and receive an authorization code at the configured redirect URI

### Exchange authorization code
- Method: `POST`
- Path: `/oauth/token`
- Host: `https://gyazo.com`
- Purpose: exchange the authorization code for an access token

Documented token response fields:
- `access_token`
- `token_type`
- `scope`

## Formats, pagination, timestamps, and errors
- The reviewed docs consistently describe JSON responses.
- The docs explicitly note a separate upload host for uploads: `https://upload.gyazo.com`.
- The quickstart page documents timestamp format as `YYYY-MM-DDTHH:MM:SSZ`.
- Pagination is explicitly documented for:
  - `GET /api/images` via response headers
  - `GET /api/search` via `page` and `per`
- The errors page documents these status codes:
  - `200` - success
  - `400` - invalid request parameter
  - `401` - authentication required
  - `402` - upgrade to Pro required
  - `403` - permission denied
  - `404` - not found
  - `422` - syntactically valid request but server cannot process returned value
  - `429` - rate limiting
  - `500` - unexpected internal error
- Example error body fields shown by the docs include:
  - `message`
  - `request`
  - `method`

## Rate limits and policy notes
From the reviewed official pages:
- the errors page explicitly lists HTTP `429` for rate limiting
- the reviewed docs do not publish numeric quotas on the API pages inspected here
- the quickstart page warns that apps continuously uploading illegal/inappropriate images or placing excessive strain on servers may be blocked

## fireROUTE notes
- Treat Gyazo as a split-host API: most metadata routes use `https://api.gyazo.com`, while uploads go to `https://upload.gyazo.com`.
- User-data routes in the reviewed docs all rely on access tokens even though Gyazo also mentions a lighter `client_id` auth mode for non-user-data APIs.
- `GET /api/images` and `GET /api/search` use different page-size parameter names (`per_page` vs `per`).
- Upload callers must set multipart `filename`; the docs call that out as required.

## Verification notes
This file was manually rebuilt from the live official Gyazo documentation using browser inspection.