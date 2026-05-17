# Pastebin

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `pastebin`
- Official docs used manually:
  - `https://pastebin.com/doc_api`
- Confirmed API base URL: `https://pastebin.com/api`
- Additional raw-content base URL: `https://pastebin.com/raw`
- Primary request/response formats: `application/x-www-form-urlencoded` POST bodies for API actions; plain-text success/error strings for the reviewed create/login/delete/raw flows
- Authentication model:
  - developer key via form field `api_dev_key`
  - member-scoped actions additionally require `api_user_key`
- Manually confirmed routes in this pass: `7`

## Authentication
From the official Pastebin developer page:
- every reviewed API action requires a valid developer key sent as `api_dev_key`
- member-scoped actions require an `api_user_key`
- `api_user_key` is created by logging in through the dedicated API login endpoint with:
  - `api_dev_key`
  - `api_user_name`
  - `api_user_password`
- the docs explicitly say only one active `api_user_key` can exist at a time for the same user

## Common request/response conventions
- most API actions are multiplexed through `POST https://pastebin.com/api/api_post.php`
- action selection is controlled by the form field `api_option`
- the reviewed docs tell callers to submit POST data as `UTF-8`
- public and unlisted raw retrieval can also be done through a non-API path under `https://pastebin.com/raw/{paste_key}`
- the developer page does not publish a single JSON error schema; reviewed failures are returned as plain-text strings starting with `Bad API request, ...`

## Manually confirmed endpoint set

### 1) Create a new paste
- Method: `POST`
- Path: `/api/api_post.php`
- Full URL: `https://pastebin.com/api/api_post.php`
- Operation selector: `api_option=paste`
- Purpose: create a guest paste or a user-owned paste
- Required form fields confirmed on the official page:
  - `api_dev_key`
  - `api_option=paste`
  - `api_paste_code`
- Optional form fields confirmed on the official page:
  - `api_user_key`
  - `api_paste_name`
  - `api_paste_format`
  - `api_paste_private` where the page defines `0=public`, `1=unlisted`, `2=private`
  - `api_paste_expire_date`
  - `api_folder_key`
- Success behavior explicitly shown:
  - returns the new paste URL as plain text, for example `https://pastebin.com/UIFdu235s`
- Bad-request examples explicitly shown:
  - `Bad API request, invalid api_option`
  - `Bad API request, invalid api_dev_key`
  - `Bad API request, maximum number of 25 unlisted pastes for your free account`
  - `Bad API request, maximum number of 10 private pastes for your free account`
  - `Bad API request, api_paste_code was empty`
  - `Bad API request, maximum paste file size exceeded`
  - `Bad API request, invalid api_paste_expire_date`
  - `Bad API request, invalid api_paste_private`
  - `Bad API request, invalid api_paste_format`
  - `Bad API request, invalid api_user_key`
  - `Bad API request, invalid or expired api_user_key`
  - `Bad API request, you can't add paste to folder as guest`

### 2) Create an API user session key
- Method: `POST`
- Path: `/api/api_login.php`
- Full URL: `https://pastebin.com/api/api_login.php`
- Purpose: exchange Pastebin account credentials for an `api_user_key`
- Required form fields confirmed on the official page:
  - `api_dev_key`
  - `api_user_name`
  - `api_user_password`
- Success behavior explicitly documented:
  - returns a valid user session key that can be used as `api_user_key`
- Important usage note:
  - the official page says only one API user key can be active at the same time for the same user

### 3) List pastes created by a user
- Method: `POST`
- Path: `/api/api_post.php`
- Full URL: `https://pastebin.com/api/api_post.php`
- Operation selector: `api_option=list`
- Purpose: list pastes owned by the authenticated user
- Required/visible form fields confirmed from the official example:
  - `api_dev_key`
  - `api_user_key`
  - `api_option=list`
  - `api_results_limit`
- Important usage note:
  - the official curl example uses `api_results_limit=100`

### 4) Delete a paste created by a user
- Method: `POST`
- Path: `/api/api_post.php`
- Full URL: `https://pastebin.com/api/api_post.php`
- Operation selector: `api_option=delete`
- Purpose: delete one paste owned by the authenticated user
- Required form fields confirmed from the official example:
  - `api_dev_key`
  - `api_user_key`
  - `api_option=delete`
  - `api_paste_key`

### 5) Get user information and settings
- Method: `POST`
- Path: `/api/api_post.php`
- Full URL: `https://pastebin.com/api/api_post.php`
- Operation selector: `api_option=userdetails`
- Purpose: return information about the authenticated user account
- Required form fields confirmed from the official example:
  - `api_dev_key`
  - `api_user_key`
  - `api_option=userdetails`

### 6) Get raw output for one of the user's pastes, including private pastes
- Method: `POST`
- Path: `/api/api_raw.php`
- Full URL: `https://pastebin.com/api/api_raw.php`
- Operation selector: `api_option=show_paste`
- Purpose: fetch raw paste contents for one authenticated user-owned paste, including private pastes
- Required form fields confirmed on the official page:
  - `api_dev_key`
  - `api_user_key`
  - `api_paste_key`
  - `api_option=show_paste`

### 7) Get raw output for any public or unlisted paste
- Method: `GET`
- Path: `/raw/{paste_key}`
- Full URL pattern: `https://pastebin.com/raw/{paste_key}`
- Purpose: fetch raw content for public or unlisted pastes without using the POST API flow
- Path parameters:
  - `paste_key` - the paste identifier appended to the raw URL
- Important note from the official page:
  - the docs explicitly say this route is not formally part of the API, but they still recommend it for raw retrieval of public and unlisted pastes

## Pagination and limits
- the reviewed page does not publish a request-per-minute or request-per-hour quota
- `api_results_limit` is used on the paste-listing action instead of cursor-based pagination
- free-account product limits are exposed through documented error strings rather than a separate limits table, including:
  - maximum `25` unlisted pastes on a free account
  - maximum `10` private pastes on a free account
  - maximum paste file size exceeded

## Error and response notes
- the reviewed developer page uses plain-text `Bad API request, ...` responses for many failures
- create-paste success returns a plain-text paste URL
- the login action returns a plain-text user key according to the official description
- the page does not publish one unified machine-readable error schema for all actions

## Important usage notes
- the same `/api/api_post.php` path serves several distinct operations, so callers must always set the correct `api_option`
- guest paste creation is supported, but folder assignment requires a logged-in user according to the documented error text
- public/unlisted raw retrieval has a simpler `GET /raw/{paste_key}` pattern, while private raw retrieval requires authenticated POST access through `/api/api_raw.php`
- the official page has dedicated subsections for syntax-format values, expiration values, privacy values, and folder-key behavior; those enum catalogs live on the docs page rather than separate endpoints

## Verification notes
This file was manually rebuilt from the official Pastebin developer API page using browser inspection.