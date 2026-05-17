# Google Photos

## Overview
- Provider: Google Photos Library API
- Category: Photography
- Official docs: `https://developers.google.com/photos/library/reference/rest`
- Base URL: `https://photoslibrary.googleapis.com`
- Auth:
  - OAuth 2.0 only
  - every request must include an authorization token for an authenticated Google user
  - the docs explicitly say service accounts are not supported for Google Photos APIs
- HTTPS: yes
- Response format: JSON
- Pagination:
  - `albums.list` defaults to `pageSize=20`, maximum `50`
  - `mediaItems.list` and `mediaItems.search` default to `pageSize=25`, maximum `100`
  - list/search responses use `pageToken` / `nextPageToken`
- Rate limits: no numeric per-minute quota was published on the inspected pages in this pass; Google exposes a separate limits-and-quotas overview page in the docs navigation

## Important product-scope notes
- The current docs emphasize app-created content. Many routes explicitly say they only return or update albums and media items created by your app.
- The reference pages display a notice that some Library API scopes were removed on `2025-04-01`.
- Google requires app verification for public apps using these APIs.

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v1/albums/{albumId}:addEnrichment` | path `albumId`; enrichment payload and album position data | Adds an enrichment at a specified position in an app-created album. |
| POST | `/v1/albums/{albumId}:batchAddMediaItems` | path `albumId`; media item IDs | Adds one or more app-created media items to an app-created album. |
| POST | `/v1/albums/{albumId}:batchRemoveMediaItems` | path `albumId`; media item IDs | Removes one or more app-created media items from an app-created album. |
| POST | `/v1/albums` | album resource in request body | Creates an album in the user's Google Photos library. |
| GET | `/v1/albums/{albumId}` | path `albumId` | Returns an app-created album by ID. |
| GET | `/v1/albums` | `pageSize`, `pageToken` | Lists albums created by your app. |
| PATCH | `/v1/albums/{album.id}` | path `album.id`; request body uses `id`, `title`, `coverPhotoMediaItemId` | Updates an app-created album. |
| POST | `/v1/mediaItems:batchCreate` | optional `albumId`; required `newMediaItems[]`; optional `albumPosition` | Creates up to `50` media items per call. This is the second step after uploading raw bytes. |
| GET | `/v1/mediaItems:batchGet` | required `mediaItemIds[]` (max `50`) | Returns app-created media items in the same order as supplied identifiers. |
| GET | `/v1/mediaItems/{mediaItemId}` | path `mediaItemId` | Returns one app-created media item. |
| GET | `/v1/mediaItems` | `pageSize`, `pageToken` | Lists all app-created media items in the user's library. |
| PATCH | `/v1/mediaItems/{mediaItem.id}` | path `mediaItem.id`; request body uses `id` and `description` | Updates an app-created media item. |
| POST | `/v1/mediaItems:search` | optional `albumId`; optional `filters`; `orderBy`; `pageSize`; `pageToken` | Searches app-created media items. `albumId` cannot be combined with filters. |

Confirmed route count: **13**.

## Parameter notes
### Shared album/media identity fields
- `albumId` / `album.id` identify app-created albums.
- `mediaItemId` / `mediaItem.id` identify app-created media items.
- Several method pages explicitly say the target album or media item must have been created by the developer via the API.

### Album routes
- `albums.get`
  - required path parameter: `albumId`
- `albums.list`
  - `pageSize`: default `20`, maximum `50`
  - `pageToken`: continuation token for next page
- `albums.patch`
  - request only reads `id`, `title`, and `coverPhotoMediaItemId`
- `albums.addEnrichment`
  - appends or inserts an enrichment payload at a position in an app-created album
- `albums.batchAddMediaItems` / `albums.batchRemoveMediaItems`
  - use album ID plus media-item identifiers

### Media item routes
- `mediaItems.batchCreate`
  - optional `albumId`
  - required `newMediaItems[]`
  - maximum `50` media items per request
  - optional `albumPosition`
- `mediaItems.batchGet`
  - required `mediaItemIds[]`
  - request cannot be empty and cannot contain duplicate identifiers
  - maximum `50` IDs per call
- `mediaItems.list`
  - `pageSize`: default `25`, maximum `100`
  - `pageToken`: continuation token
- `mediaItems.patch`
  - request only reads `id` and `description`
- `mediaItems.search`
  - `albumId` lists all media in one album
  - `filters` limits library results
  - `albumId` and `filters` cannot be used together
  - `pageSize`: default `25`, maximum `100`
  - `pageToken`: continuation token
  - `orderBy`: sort control documented on the method page

## Auth and authorization notes
- The Google Photos docs say every request must include an authorization token.
- OAuth 2.0 is the only supported authorization protocol.
- The docs say the Photos APIs do not support service accounts; users must sign in with a valid Google Account.
- Public apps must pass Google's OAuth verification review.
- The authorization overview says returned data differs depending on which Google Photos scopes were granted.

## Response and format notes
- Reference pages are JSON-first and include JSON representations for resources and request bodies.
- The main service endpoint published on the reference landing page is `photoslibrary.googleapis.com`.
- The docs use gRPC Transcoding syntax in the HTTP request descriptions.
- Media/item and album resources include stable IDs meant to be reused across sessions.

## Usage notes and constraints
- `mediaItems.batchCreate` is only step 2 of media creation; raw bytes must be uploaded first using Google's upload flow.
- `mediaItems.search` returns an error if both `albumId` and filters are supplied in one request.
- `mediaItems.batchCreate` says each album can contain up to `20,000` media items.
- Descriptions on media items must be shorter than `1000` characters and should contain user-written context rather than generated metadata.

## fireROUTE integration notes
- Treat Google Photos Library API as an OAuth-only, user-consent API with strong app-created-content constraints.
- Preserve the colon action suffixes exactly, such as `:batchCreate`, `:batchGet`, `:search`, `:addEnrichment`, `:batchAddMediaItems`, and `:batchRemoveMediaItems`.
- Model upload as a two-step workflow rather than a single route: upload raw bytes first, then call `mediaItems:batchCreate`.
- Keep pagination controls distinct between albums and media: albums list tops out at `50`, while media list/search top out at `100`.
- Surface Google app-verification and post-2025 scope changes prominently in any production adapter notes.

## Sources inspected
- `https://developers.google.com/photos/library/reference/rest`
- `https://developers.google.com/photos/library/reference/rest/v1/albums`
- `https://developers.google.com/photos/library/reference/rest/v1/albums/get`
- `https://developers.google.com/photos/library/reference/rest/v1/albums/list`
- `https://developers.google.com/photos/library/reference/rest/v1/albums/patch`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems/batchCreate`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems/batchGet`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems/list`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems/patch`
- `https://developers.google.com/photos/library/reference/rest/v1/mediaItems/search`
- `https://developers.google.com/photos/overview/configure-your-app`
- `https://developers.google.com/photos/overview/authorization`
