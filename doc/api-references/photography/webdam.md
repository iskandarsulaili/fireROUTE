# Webdam

## Overview
- Provider: Webdam
- Category: Photography
- Official docs URL from index: `https://www.damsuccess.com/hc/en-us/articles/202134055-REST-API`
- Documentation status: manually documented
- Confirmed route count: `86`

## Official documentation summary
The inspected `REST API – DAMsuccess by Webdam` article describes the Webdam REST API v2, states that developers can securely read and write Webdam content, and says API access requires an admin account inside the system. The article includes sections for authorization, OAuth token handling, access-token reset, resource operations, and JSON object formats.

The same article links to separate official references for Search 2.0 and Workstream, but the route count below is limited to the routes explicitly visible in the inspected REST API article itself.

## Base URLs and auth
- OAuth token endpoint explicitly shown: `https://apiv2.webdamdb.com/oauth2/token`
- Resource host explicitly shown in article examples: `https://apiv2.webdamdb.com`
- Resource paths are documented mostly as relative REST API v2 paths; one upload-finish example is shown as `https://apiv2.webdamdb.com/ws/awss3/finishupload/:processid`
- Auth requirements from the article: admin account required; OAuth flow sections for `authorization_code`, `access_token`, `refresh_token`, and password-grant token exchange are present

## Request / response / operational notes
- The inspected article includes JSON-format sections such as `Folder JSON Format`, confirming JSON responses are part of the official contract
- No numeric global rate limit was visible in the inspected article
- A visible example route uses `limit` and `offset` query parameters (`/notifications?limit=20&offset=0`), but the article did not expose one single global pagination contract for every resource
- Separate official Search 2.0 and Workstream references are linked from the article and likely contain additional provider-specific details outside this counted route set

## Confirmed routes

### OAuth and upload helpers
| Method | Path | Notes |
|---|---|---|
| POST | `https://apiv2.webdamdb.com/oauth2/token` | OAuth token exchange |
| GET | `/awss3/generateupload?filesize=:filesize&folderid=:folderid&filename=:filename&contenttype=:contenttype&assetid=:assetid&intent=:intent` | Generates direct-upload instructions |
| PUT | `https://apiv2.webdamdb.com/ws/awss3/finishupload/:processid` | Completes upload processing |

### Folders
| Method | Path |
|---|---|
| GET | `/folders` |
| GET | `/folders/0` |
| GET | `/folders/:folderid` |
| GET | `/folders/list?ids={ids}` |
| POST | `/folders` |
| PUT | `/folders/:folderid` |
| DELETE | `/folders/:folderid` |
| GET | `/folders/:folderid/assets` |

### Assets, downloads, versions, and metadata
| Method | Path |
|---|---|
| GET | `/assets/:assetid` |
| GET | `/assets/list?ids={ids}` |
| PUT | `/assets/:assetid` |
| DELETE | `/assets/:assetid` |
| GET | `/assets/:id/download` |
| POST | `/assets/queuedownload` |
| GET | `/downloadfromqueue/:downloadkey` |
| GET | `/assets/:assetid/versions` |
| GET | `/assets/:assetid/versions/:version` |
| DELETE | `/assets/:assetid/versions/:version` |
| POST | `/assets/:assetid/versions/:version` |
| GET | `/assets/:id/versions/:version/download` |
| GET | `/assets/:assetid/related` |
| POST | `/assets/:assetid/senddownload` |
| POST | `/assets/:assetid/setDownloadLinkExpiration` |
| GET | `/assets/:assetid/embedlinks` |
| GET | `/assets/:id/metadatas/xmp` |
| PUT | `/assets/:id/metadatas/xmp` |
| GET | `/assets/:id/metadatas/exif` |

### Metadata templates and presets
| Method | Path |
|---|---|
| GET | `/metadatatemplates` |
| GET | `/metadatatemplates/:templateid` |
| POST | `/metadatatemplates` |
| PUT | `/metadatatemplates/:templateid` |
| DELETE | `/metadatatemplates/:templateid` |
| POST | `/metadatatemplates/:templateid/apply` |
| GET | `/metadataschemas/xmp` |
| POST | `/metadataschemas/xmp` |
| GET | `/downloadpresets` |

### Lightboxes, collaborators, and comments
| Method | Path |
|---|---|
| GET | `/lightboxes` |
| GET | `/lightboxes/:lightboxid` |
| POST | `/lightboxes` |
| PUT | `/lightboxes/:lightboxid` |
| DELETE | `/lightboxes/:lightboxid` |
| GET | `/lightboxes/:lightboxid/assets` |
| POST | `/lightboxes/:lightboxid/assets` |
| DELETE | `/lightboxes/:lightboxid/assets/:assetid` |
| DELETE | `/lightboxes/:lightboxid/empty` |
| GET | `/lightboxes/:lightboxid/collaborators` |
| POST | `/lightboxes/:lightboxid/collaborators` |
| DELETE | `/lightboxes/:lightboxid/collaborators/:collaboratorid` |
| POST | `/lightboxes/:lightboxid/senddownload` |
| GET | `/lightboxes/:lightboxid/comments` |
| GET | `/lightboxes/:lightboxid/comments/:commentid` |
| POST | `/lightboxes/:lightboxid/comments` |
| DELETE | `/lightboxes/:lightboxid/comments/:commentid` |
| GET | `/lightboxes/:lightboxid/assets/:assetid/comments` |
| GET | `/lightboxes/:lightboxid/assets/:assetid/comments/:commentid` |
| POST | `/lightboxes/:lightboxid/assets/:assetid/comments` |
| DELETE | `/lightboxes/:lightboxid/assets/:assetid/comments/:commentid` |

### Search, groups, users, subscription, notifications, brand portals, and embeddables
| Method | Path |
|---|---|
| GET | `/search` |
| GET | `/groups` |
| GET | `/groups/:groupid` |
| POST | `/groups` |
| PUT | `/groups/:groupid` |
| DELETE | `/groups/:groupid` |
| GET | `/groups/:groupid/users` |
| POST | `/groups/:groupid/users/:userid` |
| DELETE | `/groups/:groupid/users/:userid` |
| GET | `/users` |
| GET | `/users/me` |
| GET | `/users/9769` |
| GET | `/users/9769/groups` |
| POST | `/users` |
| PUT | `/users/:userid` |
| PUT | `/users/me` |
| DELETE | `/users/:userid` |
| GET | `/subscription` |
| GET | `/notifications?limit=20&offset=0` |
| GET | `/brandconnect/brandportals` |
| GET | `/brandconnect/brandportals/:brandportal_id/assets` |
| GET | `/brandconnect/brandportals/:brandportal_id/folders/:folder_id/assets` |
| PUT | `/brandconnect/brandportals/:brandportal_id/assets/:asset_id` |
| DELETE | `/brandconnect/brandportals/:brandportal_id/assets/:asset_id` |
| GET | `/embeddables/downloads/links` |
| GET | `/embeddables/downloads/links/37759664` |

## Important usage notes for fireROUTE
- The visible REST API article mixes absolute host examples and relative resource paths, so adapter code should normalize host + path carefully.
- Search 2.0 and Workstream are linked from the article as separate official docs; if fireROUTE needs those products, document them separately rather than assuming they are fully covered by this file.
- Because the official article explicitly discusses OAuth tokens and admin-account setup, this provider should be treated as an authenticated integration rather than an anonymous public API.

## Sources inspected
- `https://www.damsuccess.com/hc/en-us/articles/202134055-REST-API`
- Official links surfaced from that article: `https://webdam.docs.apiary.io/#reference/search-2.0/search-queries`, `https://static1.webdamdb.com/wip/docs/index.html#workstream-api-documentation`, and `https://www.bynder.com/en/webdam/`
