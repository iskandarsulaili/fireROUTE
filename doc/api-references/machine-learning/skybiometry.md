# SkyBiometry

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `skybiometry`
- Official pages manually reviewed:
  - `https://skybiometry.com/documentation/`
  - `https://skybiometry.com/documentation`
  - `https://classic.skybiometry.com/documentation/`
  - `https://skybiometry.com/`
- Expected auth signal from the catalog/index: `apiKey`
- Confirmed API base URL: `https://api.skybiometry.com/fc`
- Authentication model: query-string `api_key` + `api_secret`, or `api_key` plus domain authentication for approved browser-side origins
- Primary request/response formats: JSON by default, XML optionally, plus JSONP via `callback`
- Manual review outcome: `manually_documented`
- Confirmed routes in this pass: `13`

## Authentication
- The official docs state that every API call must be authorized.
- The standard pattern is to send credentials as query parameters:
  - `api_key`
  - `api_secret`
- The docs also describe a domain-authentication mode for browser-side clients where `api_secret` is omitted and the request origin is matched against a domain configured in the user profile.
- Credentials are provisioned after creating an application in the user zone.

## Pricing and rate-limit notes
- The official usage-limits page says some methods, including `faces/detect`, `faces/group`, and `faces/recognize`, are rate limited.
- The docs explicitly state that the FREE subscription includes:
  - `100` face detection / recognition calls per hour
  - `5000` face detection / recognition calls per month
- The docs also say all workspaces / applications created by a user share the same limits assigned to that user account.
- The usage object returned by rate-limited methods includes:
  - `used`
  - `remaining`
  - `limit`
  - `reset_time`
  - `reset_time_text`
- The docs warn that abusive use of non-rate-limited methods can still trigger IP blacklisting.

## Request/response format notes
- The reviewed REST overview says the API uses HTTP `GET` and `POST` against `api.skybiometry.com/fc/`.
- The documented invocation pattern is:
  - `http://api.skybiometry.com/fc/{API method}.{response format}?api_key=…&api_secret=…&{other parameters}`
- The docs say HTTPS is also available by switching `http` to `https`.
- Response format is `json` by default or `xml` optionally.
- The common parameters documented for all methods are:
  - `callback` for JSONP wrapping
  - `callback_url` for asynchronous processing, with the response POSTed back in a `data` field
- Several image-processing routes also support multipart POST uploads instead of image URLs.
- The reviewed docs say images larger than `1024` pixels in width or height are automatically rescaled before processing, and returned coordinates are expressed as percentages.

## Error handling
- The official docs say failed responses return `status: "failure"` plus `error_code` and `error_message`.
- Partially successful multi-photo responses can return `status: "partial"`.
- The reviewed error catalog includes, among others:
  - `20` - `IMG_DECODE_ERROR`
  - `21` - `IMG_RESIZE_ERROR`
  - `30` - `DOWNLOAD_ERROR`
  - `31` - `DOWNLOAD_ERROR_FILE_NOT_FOUND`
  - `32` - `DOWNLOAD_ERROR_SERVER_TIMEOUT`
  - `33` - `DOWNLOAD_ERROR_FILE_TOO_LARGE`
  - `34` - `DOWNLOAD_ERROR_MALFORMED_URL`
  - `35` - `DOWNLOAD_ERROR_UNKNOWN_HOST`
  - `36` - `DOWNLOAD_ERROR_CONNECTION_REFUSED`
  - `104` - `INTERNAL_ERROR`
  - `105` - `SERVICE_TEMPORARILY_UNAVAILABLE`
  - `201` - `API_KEY_DOES_NOT_EXIST`
  - `202` - `API_KEY_USAGE_PASSED_QUOTA`
  - `203` - `API_KEY_CONCURRENT_USAGE_PASSED_QUOTA`
  - `204` - `API_KEY_NOT_AUTHENTICATED`
  - `205` - `API_PASSWORD_NOT_CORRECT`
  - `206` - `MAX_NUMBERS_OF_UIDS_TRAINED_IN_NAMESPACE_EXCEEDED`
  - `301` - `TAG_NOT_FOUND`
  - `303` - `FILTER_SYNTAX_ERROR`
  - `304` - `AUTHORIZATION_ERROR`
  - `306` - `TAG_ALREADY_EXIST`
  - `307` - `ACTION_NOT_PERMITTED`
  - `401` - `UNKNWOWN_REST_METHOD`
  - `402` - `MISSING_ARGUMENTS`
  - `403` - `MISSING_USER_NAMESPACE`
  - `404` - `UNAUTHORIZED_USER_NAMESPACE`
  - `405` - `UNAUTHORIZED_UID`
  - `406` - `INVALID_ARGUMENTS_VALUE`
  - `407` - `ARGUMENT_LIST_TOO_LONG`
  - `408` - `UNAUTHORIZED_CALLBACK_URL_DOMAIN`
  - `409` - `UID_TOO_LONG`
  - `410` - `SYNCHRONOUS_REQUEST_TOO_BIG`
- The docs also note that `operation_id` can be used when contacting support.

## Pagination
- No page-number, cursor, offset, or token pagination scheme was documented on the reviewed routes.
- Result-limiting fields such as `limit` exist on specific search-like routes, but the official docs do not describe a reusable pagination contract.

## Important usage notes
- The listed docs URL with a trailing slash did not serve the usable API docs in this environment, but the slashless `https://skybiometry.com/documentation` path resolved to the legacy official docs host `https://classic.skybiometry.com/documentation/`, which contains the usable API reference.
- The current root site `https://skybiometry.com/` is now a general AI infrastructure / managed GPU services site, while the face-recognition API documentation remains on the `classic.skybiometry.com` subdomain.
- The docs say `faces/train` is a blocking call and that clients can query progress with `faces/status`.
- The docs say `all@namespace` can be used on some recognition/grouping calls to target all trained users in a namespace.
- The `account/users` reference marks `namespaces` as required, but its example URL omits that parameter, so callers should follow the required-parameter section rather than the incomplete example.

## Confirmed routes

### 1) List users in one or more namespaces
- Method: `GET`, `POST`
- Path: `/account/users.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/account/users.{format}`
- Confirmed required parameters:
  - `api_key`
  - `api_secret` or configured domain authentication
  - `namespaces` - comma-separated list of one or more data namespaces
- Notes:
  - returns registered users grouped by namespace

### 2) List namespaces
- Method: `GET`, `POST`
- Path: `/account/namespaces.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/account/namespaces.{format}`
- Confirmed required parameters:
  - `api_key`
  - `api_secret` or configured domain authentication
- Notes:
  - returns namespace metadata such as `name`, `size`, `share_mode`, and `owner`

### 3) Get account usage limits
- Method: `GET`, `POST`
- Path: `/account/limits.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/account/limits.{format}`
- Confirmed required parameters:
  - `api_key`
  - `api_secret` or configured domain authentication
- Notes:
  - returns usage and namespace quota information

### 4) Authenticate credentials
- Method: `GET`, `POST`
- Path: `/account/authenticate.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/account/authenticate.{format}`
- Confirmed required parameters:
  - `api_key`
  - `api_secret` or configured domain authentication
- Notes:
  - used to test connection and authentication; docs say it is not required before other calls

### 5) Remove saved tags
- Method: `GET`, `POST`
- Path: `/tags/remove.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/tags/remove.{format}`
- Confirmed required parameters:
  - `tids` - one or more tag IDs to remove
- Confirmed optional parameters:
  - `password`
- Notes:
  - docs say you should retrain affected users with `faces/train` after removing trained tags

### 6) Save tags for a user
- Method: `GET`, `POST`
- Path: `/tags/save.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/tags/save.{format}`
- Confirmed required parameters:
  - `uid`
  - `tids`
- Confirmed optional parameters:
  - `label`
  - `password`
- Notes:
  - persists detected tags so they can later be used for training

### 7) Add a manual tag
- Method: `GET`, `POST`
- Path: `/tags/add.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/tags/add.{format}`
- Confirmed required parameters:
  - `url`
  - `x`
  - `y`
  - `width`
  - `height`
  - `uid`
- Confirmed optional parameters:
  - `label`
  - `password`
- Notes:
  - accepted image formats listed in the docs are `PNG`, `JPEG`, `BMP`, and `JPEG2000`

### 8) Get tags
- Method: `GET`, `POST`
- Path: `/tags/get.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/tags/get.{format}`
- Confirmed request selectors:
  - at least one of `uids`, `pids`, or `urls`
- Confirmed optional parameters:
  - `limit`
  - `together`
  - `order`
  - `namespace`
  - `filter`
- Notes:
  - supports multipart POST uploads instead of image URLs
  - default `limit` is `5`
  - `order` defaults to `recent`

### 9) Get training status
- Method: `GET`, `POST`
- Path: `/faces/status.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/faces/status.{format}`
- Confirmed required parameters:
  - `uids`
- Confirmed optional parameters:
  - `namespace`
- Notes:
  - returns training status objects including `training_set_size`, `last_trained`, and `training_in_progress`

### 10) Train users
- Method: `GET`, `POST`
- Path: `/faces/train.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/faces/train.{format}`
- Confirmed required parameters:
  - `uids`
- Confirmed optional parameters:
  - `namespace`
- Notes:
  - docs describe this as a blocking operation
  - response can include `no_training_set`, `created`, `updated`, `unchanged`, and `in_progress`

### 11) Group faces across photos
- Method: `GET`, `POST`
- Path: `/faces/group.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/faces/group.{format}`
- Confirmed required parameters listed in the reference:
  - `uids`
  - `urls`
- Confirmed optional parameters:
  - `namespace`
  - `detector`
  - `attributes`
  - `threshold`
  - `limit`
  - `return_similarities`
  - `detect_all_feature_points`
- Notes:
  - accepts `PNG`, `JPEG`, `BMP`, and `JPEG2000`
  - supports multipart POST uploads
  - docs say `all@namespace` can be used to target all trained users in a namespace

### 12) Recognize faces
- Method: `GET`, `POST`
- Path: `/faces/recognize.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/faces/recognize.{format}`
- Confirmed required parameters:
  - `uids`
  - `urls`
- Confirmed optional parameters:
  - `namespace`
  - `detector`
  - `attributes`
  - `limit`
  - `detect_all_feature_points`
  - `matching_threshold`
- Notes:
  - supports multipart POST uploads
  - docs say untrained users are returned in `no_training_set`
  - docs say `all@namespace` can be used to target all trained users in a namespace

### 13) Detect faces
- Method: `GET`, `POST`
- Path: `/faces/detect.{format}`
- Full URL pattern: `https://api.skybiometry.com/fc/faces/detect.{format}`
- Confirmed required parameters:
  - `urls`
- Confirmed optional parameters:
  - `detector`
  - `attributes`
  - `detect_all_feature_points`
- Notes:
  - supports multipart POST uploads
  - accepted image formats are `PNG`, `JPEG`, `BMP`, and `JPEG2000`
  - docs say unsaved temporary tags are disposed regularly and can be used no longer than a day

Manual route count confirmed: **13**.

## Verification notes
This file was manually rebuilt from live browser review of the listed SkyBiometry docs URL, the slashless documentation path that resolved to the legacy official docs host, the legacy official docs host itself, and the current root-domain site.