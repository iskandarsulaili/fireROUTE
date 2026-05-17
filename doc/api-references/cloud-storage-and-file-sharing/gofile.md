# GoFile

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `gofile`
- Docs used manually:
  - `https://gofile.io/api`
- Confirmed control API base URL: `https://api.gofile.io`
- Confirmed upload API base URL: `https://upload.gofile.io`
- Primary media types: `application/json` for control endpoints, `multipart/form-data` for file uploads
- Authentication: `Authorization: Bearer YOUR_API_TOKEN`
- Manually confirmed routes in this pass: `15`

## Authentication
From the official GoFile API page:
- all API requests require an API token sent as `Authorization: Bearer YOUR_API_TOKEN`
- the token is obtained from the user's profile page
- most endpoints require a premium account
- the official page explicitly says only basic operations such as uploading, creating folders, renaming content, and removing content are accessible with free accounts

## Common request/response conventions
- control endpoints use the base `https://api.gofile.io`
- uploads use `https://upload.gofile.io/uploadfile`
- most non-upload routes use JSON request bodies or query parameters
- password-protected content expects a SHA-256 password hash on the reviewed read/copy/import/search routes
- GoFile documents an account hierarchy of `Account -> Root Folder -> Contents (Files & Subfolders)`
- the root folder is permanent and cannot be deleted or moved
- the reviewed documentation is labeled `BETA Status`

## Manually confirmed endpoint set

### 1) Upload a file
- Method: `POST`
- Path: `/uploadfile`
- Full URL: `https://upload.gofile.io/uploadfile`
- Purpose: upload a file, optionally into an existing folder
- Content type: `multipart/form-data`
- Request fields confirmed on the official page:
  - `file` - required uploaded file
  - `folderId` - optional destination folder id
- Important usage notes:
  - if called without parameters, GoFile says it will create a guest account, create a new public root-level folder, and upload into that folder
  - the docs list regional upload proxies in addition to the automatic `upload.gofile.io` host:
    - `upload-eu-par.gofile.io`
    - `upload-na-phx.gofile.io`
    - `upload-ap-sgp.gofile.io`
    - `upload-ap-hkg.gofile.io`
    - `upload-ap-tyo.gofile.io`
    - `upload-sa-sao.gofile.io`

### 2) Create a folder
- Method: `POST`
- Path: `/contents/createFolder`
- Full URL: `https://api.gofile.io/contents/createFolder`
- Purpose: create a folder inside a parent folder
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `parentFolderId` - required parent folder id
  - `folderName` - optional custom folder name
  - `public` - optional boolean public/private flag
- Important usage note:
  - the new folder inherits access permissions from its parent unless changed later

### 3) Update content attributes
- Method: `PUT`
- Path: `/contents/{contentId}/update`
- Full URL: `https://api.gofile.io/contents/{contentId}/update`
- Purpose: modify selected file or folder attributes
- Path parameters:
  - `contentId` - content identifier
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `attribute` - required attribute name
  - `attributeValue` - required new value
- Officially listed attribute options:
  - `name`
  - `description`
  - `tags`
  - `public`
  - `expiry`
  - `password`
- Important usage notes:
  - `description`, `tags`, `public`, `expiry`, and `password` are documented as folder-only attributes
  - the page warns that attempting folder-only attributes on files produces an error response

### 4) Delete content
- Method: `DELETE`
- Path: `/contents`
- Full URL: `https://api.gofile.io/contents`
- Purpose: permanently delete files and folders
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `contentsId` - required comma-separated content ids
- Important usage notes:
  - deleting a folder also deletes its children
  - the docs say you can only delete content that belongs to your own account

### 5) Get folder details and children
- Method: `GET`
- Path: `/contents/{contentId}`
- Full URL: `https://api.gofile.io/contents/{contentId}`
- Purpose: retrieve folder metadata and child listings
- Path parameters:
  - `contentId` - folder identifier
- Query parameters confirmed on the official page:
  - `password` - optional SHA-256 hash for password-protected folders
  - `page`
  - `pageSize`
  - `sortField`
  - `sortDirection`
  - `contentFilter`
  - `maxdepth`
- Important usage notes:
  - the official page explicitly says this route works with folder ids, not file ids
  - documented `sortField` values are `createTime`, `name`, `size`, `downloads`, and `mimetype`
  - documented `sortDirection` values are `1` for ascending and `-1` for descending

### 6) Search content inside a folder tree
- Method: `GET`
- Path: `/contents/search`
- Full URL: `https://api.gofile.io/contents/search`
- Purpose: recursively search files and folders by name or tags
- Query parameters confirmed on the official page:
  - `contentId` - required parent folder id
  - `searchedString` - required search string
  - `password` - optional SHA-256 hash
  - `createTimeFrom`
  - `createTimeTo`
- Important usage notes:
  - search is recursive through subfolders
  - matches are case-insensitive
  - partial matches are supported
  - matches can come from names or tags

### 7) Create a direct link
- Method: `POST`
- Path: `/contents/{contentId}/directlinks`
- Full URL: `https://api.gofile.io/contents/{contentId}/directlinks`
- Purpose: create a direct-access link to a file or folder
- Path parameters:
  - `contentId` - content identifier
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `expireTime`
  - `sourceIpsAllowed`
  - `domainsAllowed`
  - `domainsBlocked`
  - `auth`
- Important usage notes:
  - for folders, the docs say GoFile automatically generates a ZIP archive
  - `auth` is documented as an array of `username:password` entries for HTTP basic auth style access

### 8) Update a direct link
- Method: `PUT`
- Path: `/contents/{contentId}/directlinks/{directLinkId}`
- Full URL: `https://api.gofile.io/contents/{contentId}/directlinks/{directLinkId}`
- Purpose: change direct-link restrictions or expiration
- Path parameters:
  - `contentId` - content identifier
  - `directLinkId` - direct-link identifier
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `expireTime`
  - `sourceIpsAllowed`
  - `domainsAllowed`
  - `domainsBlocked`
  - `auth`
- Important usage note:
  - the docs say omitted restriction fields are removed, so callers must resend values they want to preserve

### 9) Delete a direct link
- Method: `DELETE`
- Path: `/contents/{contentId}/directlinks/{directLinkId}`
- Full URL: `https://api.gofile.io/contents/{contentId}/directlinks/{directLinkId}`
- Purpose: remove a direct-access link without deleting the underlying content
- Path parameters:
  - `contentId` - content identifier
  - `directLinkId` - direct-link identifier

### 10) Copy content
- Method: `POST`
- Path: `/contents/copy`
- Full URL: `https://api.gofile.io/contents/copy`
- Purpose: copy files or folders into another folder
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `contentsId` - required comma-separated content ids
  - `folderId` - required destination folder id
  - `password` - optional SHA-256 hash for protected content

### 11) Move content
- Method: `PUT`
- Path: `/contents/move`
- Full URL: `https://api.gofile.io/contents/move`
- Purpose: move files or folders into another folder
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `contentsId` - required comma-separated content ids
  - `folderId` - required destination folder id
- Important usage note:
  - moving a folder moves all descendants recursively

### 12) Import shared content into your account
- Method: `POST`
- Path: `/contents/import`
- Full URL: `https://api.gofile.io/contents/import`
- Purpose: import shared content into the caller's root folder
- Content type: `application/json`
- Request fields confirmed on the official page:
  - `contentsId` - required comma-separated content ids
  - `password` - optional SHA-256 hash for protected content
- Important usage note:
  - the docs warn that unauthorized children inside imported folders may be skipped instead of failing the entire import

### 13) Resolve account id from the bearer token
- Method: `GET`
- Path: `/accounts/getid`
- Full URL: `https://api.gofile.io/accounts/getid`
- Purpose: return the account id associated with the current token

### 14) Get account details
- Method: `GET`
- Path: `/accounts/{accountId}`
- Full URL: `https://api.gofile.io/accounts/{accountId}`
- Purpose: retrieve detailed information about an account
- Path parameters:
  - `accountId` - account identifier
- Important usage note:
  - the official page points callers to `/accounts/getid` to obtain the id

### 15) Reset the account token
- Method: `POST`
- Path: `/accounts/{accountId}/resettoken`
- Full URL: `https://api.gofile.io/accounts/{accountId}/resettoken`
- Purpose: invalidate the current token and send a login link with a new token to the registered email address
- Path parameters:
  - `accountId` - account identifier
- Important usage note:
  - the current token is invalidated immediately according to the official page

## Pagination
From the reviewed official page:
- `GET /contents/{contentId}` supports page-based pagination
- request parameters:
  - `page`
  - `pageSize`
- the same route also supports sorting and filtering through `sortField`, `sortDirection`, `contentFilter`, and `maxdepth`
- no separate cursor token or global pagination envelope was documented on the reviewed page

## Rate limits
From the reviewed official page:
- rate limits are enforced per endpoint
- specific numeric limits are not publicly disclosed
- exceeding the limit returns `429 Too Many Requests`
- repeated limit violations may trigger automatic IP bans
- the docs tell users with higher-volume needs to contact support for custom solutions

## Error and format notes
- uploads use `multipart/form-data`; most other reviewed endpoints use JSON or query parameters
- the official page explicitly documents `429 Too Many Requests` for rate-limit violations
- the reviewed page repeatedly warns that some operations fail when the content does not belong to the caller, when folder-only attributes are used on files, or when protected content is accessed without the correct password hash, but it does not publish a single unified error-schema table

## Important usage notes
- GoFile's docs currently describe the API as beta, so route behavior may change
- most non-basic operations are premium-gated according to the official page
- folder reads, search, copy, and import may require SHA-256 password hashes for protected content
- direct links can be restricted by source IPs, allowed domains, blocked domains, expiration time, or basic-auth credential pairs

## Verification notes
This file was manually rebuilt from GoFile's official API page using browser inspection only.