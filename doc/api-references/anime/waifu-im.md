# Waifu.im

## Overview
- Provider: Waifu.im API
- Category: Anime
- Official docs: `https://waifu.im/docs`
- API reference inspected: `https://docs.waifu.im/docs/category/api-reference`
- OpenAPI spec inspected: `https://api.waifu.im/openapi/v1.json`
- Base URL: `https://api.waifu.im`
- Auth: mixed surface; public read endpoints exist, while authenticated operations use either bearer JWT auth in the `Authorization` header or an API key in the `X-Api-Key` header
- Auth acquisition note: docs say JWT tokens are obtained via Discord OAuth2 using `POST /auth/discord`
- HTTPS: yes
- Response format: JSON
- Pagination: paginated endpoints return `items`, `pageNumber`, `totalPages`, `totalCount`, `hasPreviousPage`, `hasNextPage`, `maxPageSize`, and `defaultPageSize`
- Error format: RFC 9457 / Problem Details JSON according to the API reference overview
- Rate limits: no numeric rate limit is published in the reviewed docs pages
- Manual route-count note: I manually confirmed `42` method+path operations in the OpenAPI document

## Confirmed endpoints

### Albums
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/users/{userId}/albums` | `userId` path; optional `Page`, `PageSize` | List albums for a user. |
| POST | `/users/{userId}/albums` | `userId` path; JSON body | Create a new album. |
| GET | `/users/{userId}/albums/{albumId}` | `userId`, `albumId` path | Get album details. |
| PATCH | `/users/{userId}/albums/{albumId}` | `userId`, `albumId` path; JSON body | Update an album. |
| DELETE | `/users/{userId}/albums/{albumId}` | `userId`, `albumId` path | Delete an album. |
| GET | `/users/{userId}/albums/{albumId}/images` | `userId`, `albumId` path plus image-filter queries | List images in an album. |
| POST | `/users/{userId}/albums/{albumId}/images/{imageId}` | `userId`, `albumId`, `imageId` path | Add an image to an album. |
| DELETE | `/users/{userId}/albums/{albumId}/images/{imageId}` | `userId`, `albumId`, `imageId` path | Remove an image from an album. |

### Artists
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/artists` | optional `Name`, `IncludedIds`, `Page`, `PageSize`, `ReviewStatus` | List artists with filtering. |
| POST | `/artists` | JSON body | Create a new artist. |
| GET | `/artists/{id}` | `id` path | Fetch artist by ID. |
| PATCH | `/artists/{id}` | `id` path; JSON body | Update artist. |
| DELETE | `/artists/{id}` | `id` path | Delete artist. |
| GET | `/artists/by-name/{name}` | `name` path | Lookup artist by name. |

### Authentication
| Method | Path | Parameters | Notes |
|---|---|---|---|
| POST | `/auth/discord` | JSON body | Login with Discord OAuth2 and obtain JWT-based auth. |
| GET | `/auth/api-keys` | none | List API keys for the authenticated account. |
| POST | `/auth/api-keys` | JSON body | Create a new API key. |
| PATCH | `/auth/api-keys/{id}` | `id` path; JSON body | Update an API key. |
| DELETE | `/auth/api-keys/{id}` | `id` path | Revoke an API key. |

### Images
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/images` | optional `IsNsfw`, `IncludedTags`, `ExcludedTags`, `IncludedArtists`, `ExcludedArtists`, `IncludedIds`, `ExcludedIds`, `IsAnimated`, `OrderBy`, `Orientation`, `Page`, `PageSize`, `Width`, `Height`, `ByteSize`, `UploaderId`, `ReviewStatus`, `ChildrenReviewStatus` | Browse/search images. |
| GET | `/images/{id}` | `id` path; optional `childrenReviewStatus` | Fetch one image. |
| PATCH | `/images/{id}` | `id` path; form body | Update an existing image. |
| DELETE | `/images/{id}` | `id` path | Delete image. |
| POST | `/images/upload` | `application/x-www-form-urlencoded` body | Upload a new image. |

### Reports
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/reports` | optional `IsResolved`, `Page`, `PageSize` | List reports. |
| POST | `/reports` | JSON body | Report an image. |
| PATCH | `/reports/{id}/resolve` | `id` path | Mark report as resolved. |

### Statistics and storage-diff
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/stats/public` | none | Public statistics. |
| GET | `/stats/admin` | none | Admin statistics. |
| GET | `/storage-diff` | optional `Mode`, `Page`, `PageSize` | Compare S3 and DB state. |
| DELETE | `/storage-diff/s3` | JSON body | Delete orphaned S3 files. |
| DELETE | `/storage-diff/db` | JSON body | Delete DB records missing from S3. |

### Tags
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/tags` | optional `Name`, `IncludedIds`, `IncludedSlugs`, `Page`, `PageSize`, `ReviewStatus` | List tags. |
| POST | `/tags` | JSON body | Create a tag. |
| GET | `/tags/{id}` | `id` path | Fetch tag by ID. |
| PATCH | `/tags/{id}` | `id` path; JSON body | Update tag. |
| DELETE | `/tags/{id}` | `id` path | Delete tag. |
| GET | `/tags/by-slug/{slug}` | `slug` path | Lookup tag by slug. |

### Users
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/users` | optional `Name`, `IncludedIds`, `Page`, `PageSize` | List users. |
| GET | `/users/me` | none | Get authenticated caller profile. |
| GET | `/users/{id}` | `id` path | Get a user by ID. |
| PUT | `/users/{id}/role` | `id` path; JSON body | Change user role. |
| PUT | `/users/{id}/ban` | `id` path; JSON body | Ban or unban a user. |

## Authentication and authorization notes
- The overview page explicitly documents two auth methods:
  - Bearer JWT in `Authorization`
  - API key in `X-Api-Key`
- The docs state some endpoints require authentication; write/admin/moderation routes clearly fall into that category.
- `POST /auth/discord` is the documented entry point for Discord OAuth2 login.

## Response and error notes
- Paginated responses use a common envelope with `items` plus page metadata.
- Error responses follow Problem Details JSON and include fields like `type`, `title`, `status`, `detail`, and `errors`.
- The overview page says `maxPageSize = -1` means an endpoint is effectively unlimited for page size.

## Integration notes for fireROUTE
- This provider is broader than a simple image randomizer; it mixes public browsing with authenticated content-management operations.
- Keep public image browsing (`GET /images`, `GET /images/{id}`, tag/artist lookups, public stats) separate from write/admin features.
- Preserve original parameter casing when mirroring the OpenAPI document because the spec publishes capitalized query names such as `Page`, `PageSize`, `IncludedTags`, and `ReviewStatus`.

## Sources inspected
- `https://waifu.im/docs`
- `https://docs.waifu.im/docs/category/api-reference`
- `https://api.waifu.im/openapi/v1.json`
