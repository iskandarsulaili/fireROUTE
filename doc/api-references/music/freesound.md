# Freesound

## Overview
- Provider: Freesound API v2
- Category: Music
- Official docs: `https://freesound.org/docs/api/`
- Base URL: `https://freesound.org/apiv2/`
- Auth:
  - token auth with `Authorization: Token YOUR_API_KEY` or `token` query parameter
  - OAuth 2 authorization-code flow for user actions and all routes marked OAuth2-only
- HTTPS: yes
- Response formats: JSON, XML, YAML; the overview page says JSON is the only format they actively test and recommends using it
- Pagination:
  - search/similar/list resources use `page`
  - common default `page_size=15`, maximum `page_size=150`
  - responses for list resources include `count`, `next`, `previous`, and `results`
- Rate limits:
  - standard: `60` requests/minute and `2000` requests/day
  - upload/describe/comment/rate/bookmark family: `30` requests/minute and `500` requests/day

## Confirmed resource endpoints
These are the documented API v2 resource routes from the official Resources page.

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/search/` | `query`, `filter`, `sort`, `similar_to`, `similarity_space`, `group_by_pack`, `weights`, `fields`, `page`, `page_size` | Main search endpoint. Returns paginated sound lists. |
| GET | `/search/content/` | content-search parameters | Official docs mark this resource deprecated. |
| GET | `/search/combined/` | combined metadata + descriptor search parameters | Official docs mark this resource deprecated. |
| GET | `/sounds/<sound_id>/` | path `sound_id`; optional `fields` | Fetch a sound instance. |
| GET | `/sounds/<sound_id>/analysis/` | path `sound_id`; optional `fields` with descriptor names | Full analysis/descriptors for one sound. |
| GET | `/sounds/<sound_id>/similar/` | path `sound_id`; optional `similarity_space`, `fields`, `page`, `page_size` | Similar-sound lookup. |
| GET | `/sounds/<sound_id>/comments/` | path `sound_id` | Comments on a sound. |
| GET | `/sounds/<sound_id>/download/` | path `sound_id`; OAuth2 bearer auth | Download original sound file. |
| POST | `/sounds/upload/` | multipart `audiofile`; optional `name`, `bst_category`, `tags`, `description`, `license`, `pack`, `geotag` | Upload audio; may also describe it in one call. OAuth2 required. |
| POST | `/sounds/describe/` | `upload_filename`, optional `name`, plus `bst_category`, `tags`, `description`, `license`, optional `pack`, `geotag` | Describe a previously uploaded file. OAuth2 required. |
| GET | `/sounds/pending_uploads/` | OAuth2 bearer auth | Lists uploads pending description, processing, or moderation. |
| POST | `/sounds/<sound_id>/edit/` | optional `name`, `bst_category`, `tags`, `description`, `license`, `pack`, `geotag` | Edit an existing sound description you own. OAuth2 required. |
| POST | `/sounds/<sound_id>/bookmark/` | optional `name`, `category` | Bookmark a sound. OAuth2 required. |
| POST | `/sounds/<sound_id>/rate/` | required `rating` integer `0-5` | Rate a sound. OAuth2 required. |
| POST | `/sounds/<sound_id>/comment/` | required `comment` | Comment on a sound. OAuth2 required. |
| GET | `/users/<username>/` | path `username` | User profile resource. |
| GET | `/users/<username>/sounds/` | path `username` | Paginated user sound list. |
| GET | `/users/<username>/packs/` | path `username` | Paginated user pack list. |
| GET | `/packs/<pack_id>/` | path `pack_id` | Pack resource. |
| GET | `/packs/<pack_id>/sounds/` | path `pack_id` | Paginated pack sound list. |
| GET | `/packs/<pack_id>/download/` | path `pack_id`; OAuth2 bearer auth | Download an entire pack. |
| GET | `/me/` | OAuth2 bearer auth | Returns the authenticated user profile plus `email` and `unique_id`. |
| GET | `/me/bookmark_categories/` | OAuth2 bearer auth | Bookmark categories for the authenticated user. |
| GET | `/me/bookmark_categories/<bookmark_category_id>/sounds/` | path `bookmark_category_id`; OAuth2 bearer auth | Sounds in one bookmark category. |

Confirmed route count: **24**.

## Auth flow endpoints
The docs also publish non-resource auth/application endpoints that support the API but are not counted in the 24 resource routes above:
- `https://freesound.org/apiv2/apply` — request API credentials
- `https://freesound.org/apiv2/oauth2/authorize/` — OAuth2 authorization step 1
- `https://freesound.org/apiv2/oauth2/logout_and_authorize/` — variant that forces logout before auth
- `https://freesound.org/apiv2/oauth2/access_token/` — exchange auth code for access token, and refresh access tokens

## Auth and request notes
### Token auth
- Request an API credential at `https://freesound.org/apiv2/apply`.
- The docs say you can authenticate either with:
  - query `token=YOUR_API_KEY`
  - header `Authorization: Token YOUR_API_KEY`
- Token auth is for basic/read access.

### OAuth2
- Freesound uses OAuth2 authorization code flow.
- Authorization URL: `https://freesound.org/apiv2/oauth2/authorize/`
- Token URL: `https://freesound.org/apiv2/oauth2/access_token/`
- Step-1 parameters:
  - `client_id`
  - `response_type=code`
  - optional `state`
- Token exchange parameters:
  - `client_id`
  - `client_secret`
  - `grant_type=authorization_code`
  - `code`
- Refresh parameters:
  - `client_id`
  - `client_secret`
  - `grant_type=refresh_token`
  - `refresh_token`
- Docs notes:
  - auth codes last `10` minutes
  - access tokens last `24` hours (`expires_in: 86399` in the example)
  - OAuth2 routes must be called over HTTPS
  - bearer usage is `Authorization: Bearer ACCESS_TOKEN`

## Parameter highlights
### Search
The Search resource explicitly documents these common query parameters:
- `query` — full-text query; empty query returns all Freesound sounds
- `filter` — Solr-style field filters, including ranges, date math, logic operators, and geospatial queries
- `sort` — `score`, `duration_desc`, `duration_asc`, `created_desc`, `created_asc`, `downloads_desc`, `downloads_asc`, `rating_desc`, `rating_asc`, or numeric-target sort syntax
- `similar_to` — sound ID or similarity vector
- `similarity_space` — choose the similarity space
- `group_by_pack` — `1` or `0`
- `weights` — custom field weighting
- `fields` — comma-separated response field selection
- `page`, `page_size`

### Sound analysis and similarity
- `/sounds/<sound_id>/analysis/` supports `fields` to limit returned descriptors.
- `/sounds/<sound_id>/similar/` supports `similarity_space`, `fields`, `page`, and `page_size`.

### Upload / describe / edit
The upload and description routes document these core fields:
- `audiofile` — multipart uploaded audio file (`.wav`, `.aif`, `.flac`, `.ogg`, `.mp3` supported)
- `upload_filename` — for describing a previously uploaded file
- `name`
- `bst_category`
- `tags`
- `description`
- `license` — `Attribution`, `Attribution NonCommercial`, or `Creative Commons 0`
- `pack`
- `geotag` in `lat,lon,zoom` form

### Social actions
- bookmark: optional `name`, `category`
- rate: required `rating` integer `0-5`
- comment: required `comment`

## Response and error notes
- List resources return objects with `count`, `next`, `previous`, and `results`.
- POST responses commonly return a JSON dictionary with a `detail` field.
- The overview page documents these common error statuses:
  - `400 Bad request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not found`
  - `405 Method not allowed`
  - `409 Conflict`
  - `429 Too many requests`
  - `5xx`
- Error bodies are documented as dictionaries with a `detail` field.
- The rate endpoint specifically notes a second rating attempt by the same user returns `409 Conflict`.
- Upload/describe responses can return IDs for newly described sounds, but those sounds may still return `404` until moderation completes.

## Usage notes
- The docs recommend `multipart/form-data` for POST requests, especially uploads.
- For non-file POSTs, `application/json` and `application/x-www-form-urlencoded` are also supported.
- The overview page notes Freesound has a browsable API at `https://freesound.org/apiv2`, authenticated with normal site sessions in the browser.
- Sound uploads are moderated after upload/description, so newly uploaded material is not immediately queryable as a normal sound resource.
- The search page explicitly recommends using `fields` to avoid N+1 follow-up calls for metadata.

## fireROUTE integration notes
- Treat Freesound as a well-documented REST API with mixed anonymous token auth and OAuth2 bearer auth.
- Expose the 24 resource routes as the canonical surface; keep the OAuth2 helper endpoints as auth metadata rather than ordinary content routes.
- Mark `/search/content/` and `/search/combined/` as deprecated in fireROUTE metadata.
- Preserve Freesound's moderation delay semantics for upload/describe flows.
- Reuse the documented shared pagination and throttling rules across list/search/similar endpoints.

## Sources inspected
- `https://freesound.org/docs/api/`
- `https://freesound.org/docs/api/overview.html`
- `https://freesound.org/docs/api/authentication.html`
- `https://freesound.org/docs/api/resources_apiv2.html`
