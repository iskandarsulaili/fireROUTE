# Unsplash

## Overview
- Provider: Unsplash Image API
- Category: Photography
- Official docs: `https://unsplash.com/developers`
- Base URL: `https://api.unsplash.com/`
- Auth:
  - public read access uses `Authorization: Client-ID YOUR_ACCESS_KEY`
  - user-specific or write actions require user authorization / bearer-token flows described in the auth docs
- HTTPS: yes
- Response format: JSON
- API versioning: the docs say all requests currently receive v1 and recommend `Accept-Version: v1`
- Pagination: list/search endpoints default to 10 items per page, support `page` and `per_page`, and cap `per_page` at 30
- Rate limits: the docs show `X-Ratelimit-Limit` / `X-Ratelimit-Remaining` headers and state approved apps are increased to `1000` requests per hour

## Confirmed endpoints
### Current user
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/me` | bearer auth | Get the authenticated user's profile. |
| PUT | `/me` | bearer auth; profile fields such as `username`, `first_name`, `last_name`, `email`, `url`, `location`, `bio`, `instagram_username` | Update the current user's profile. Requires write scope according to the docs. |

### Users
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/users/:username` | path `username` | Public user profile lookup. |
| GET | `/users/:username/photos` | path `username`; optional pagination params | List a user's photos. |
| GET | `/users/:username/collections` | path `username`; optional pagination params | List a user's collections. |
| GET | `/users/:username/statistics` | path `username` | User statistics. |

### Photos
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/photos` | optional `page`, `per_page`, ordering/filter params | List photos. |
| GET | `/photos/:id` | path `id` | Fetch a single photo. |
| GET | `/photos/random` | optional filters such as query/orientation/collection/user | Random-photo endpoint. |
| GET | `/photos/:id/statistics` | path `id` | Photo statistics. |
| GET | `/photos/:id/download` | path `id` | Track a download / retrieve the download location. |
| PUT | `/photos/:id` | path `id`; write fields | Update a photo. |

### Search
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/search/photos` | `query`; optional `page`, `per_page`, other search filters | Search photos. |
| GET | `/search/collections` | `query`; optional `page`, `per_page` | Search collections. |
| GET | `/search/users` | `query`; optional `page`, `per_page` | Search users. |

### Collections
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/collections` | optional `page`, `per_page` | List collections. |
| GET | `/collections/:id` | path `id` | Get a collection. |
| GET | `/collections/:id/photos` | path `id`; optional `page`, `per_page` | Get a collection's photos. |
| GET | `/collections/:id/related` | path `id` | Related collections. |
| POST | `/collections` | authenticated collection-creation fields | Create a collection. |
| PUT | `/collections/:id` | path `id`; update fields | Update a collection. |
| DELETE | `/collections/:id` | path `id` | Delete a collection. |
| POST | `/collections/:collection_id/add` | path `collection_id`; photo identifier in body | Add a photo to a collection. |
| DELETE | `/collections/:collection_id/remove` | path `collection_id`; photo identifier | Remove a photo from a collection. |

### Topics
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/topics` | optional `page`, `per_page` | List topics. |
| GET | `/topics/:id_or_slug` | path `id_or_slug` | Get a topic. |
| GET | `/topics/:id_or_slug/photos` | path `id_or_slug`; optional `page`, `per_page` | Topic photos. |

### Stats
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/stats/total` | none documented on overview page | Global totals. |
| GET | `/stats/month` | none documented on overview page | Monthly stats. |

Confirmed route count: **29**.

## Auth and header notes
- Public authentication is via `Authorization: Client-ID YOUR_ACCESS_KEY`.
- If only an access key is sent, the docs say non-public actions will return `401 Unauthorized`.
- User authentication is required for personalized/private/write operations.
- The docs recommend `Accept-Version: v1`.

## Pagination and rate-limit notes
- List/search endpoints paginate with `page` and `per_page`.
- Default page size is `10`; maximum `per_page` is `30`.
- Pagination metadata is returned in headers:
  - `X-Per-Page`
  - `X-Total`
  - `Link` for first/last/next/previous page URLs
- Approved apps are documented as receiving `1000` requests per hour.
- Current usage is returned in:
  - `X-Ratelimit-Limit`
  - `X-Ratelimit-Remaining`

## Error and response notes
- Responses are JSON.
- The docs say summary objects are returned in list contexts; full objects require individual fetches.
- Error bodies are returned in an `errors` array, for example:
  - `422 Unprocessable Entity`
  - `{ "errors": ["Username is missing", "Password cannot be blank"] }`
- The docs describe conventional HTTP status handling: `2xx` success, `4xx` client error, `5xx` server error.
- The profile update docs explicitly note missing write scope returns `403 Forbidden`.

## fireROUTE integration notes
- Treat Unsplash as a large, well-structured JSON API with strong header-driven auth, pagination, and versioning conventions.
- Default to `Accept-Version: v1` and public `Client-ID` auth for read-only routes.
- Promote `page`/`per_page` as shared list controls, but keep per-route query fields flexible.
- Separate public-read operations from authenticated collection/profile mutation routes.

## Sources inspected
- `https://unsplash.com/developers`
- `https://unsplash.com/documentation`
