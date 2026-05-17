# Feedbin

## Overview
- Provider: Feedbin API v2
- Category: News
- Official docs: `https://github.com/feedbin/feedbin-api`
- Base URL: `https://api.feedbin.com/v2`
- Auth: HTTP Basic authentication with Feedbin email/password credentials
- HTTPS: yes
- Response format: JSON
- Pagination: entry-oriented resources paginate; the docs say pages are limited to 100 items and use HTTP `Link` headers plus `X-Feedbin-Record-Count`
- Rate limits: no single numeric public rate limit was stated on the pages reviewed

## Confirmed endpoint families

| Method | Path family | Notes |
|---|---|---|
| GET | `/authentication.json` | Authentication check endpoint documented in the API object list. |
| GET, POST, PATCH, DELETE | `/subscriptions*.json` | Subscription listing, creation, and title editing surface. |
| GET | `/entries*.json` | Entry retrieval endpoints; docs note page-based pagination. |
| GET, POST, DELETE | `/unread_entries*.json` | Unread-entry state management. |
| GET, POST, DELETE | `/starred_entries*.json` | Starred-entry state management. |
| GET, POST, DELETE | `/taggings*.json` | Tag assignment/removal. |
| GET | `/tags*.json` | Tag listing. |
| GET, POST, DELETE | `/saved_searches*.json` | Saved-search management. |
| GET, POST | `/recently_read_entries*.json` | Recently-read tracking. |
| GET | `/updated_entries*.json` | Incremental updates feed. |
| GET | `/icons.json` | Feed/icon metadata. |
| GET, POST | `/imports*.json` | Import job surface. |
| GET, POST, DELETE | `/pages*.json` | Saved pages/content extraction surface. |

## Request notes
- The docs explicitly require `Content-Type: application/json; charset=utf-8` when creating or updating records.
- Dates use high-resolution ISO 8601 timestamps.
- Feedbin recommends conditional requests using `ETag`, `Last-Modified`, `If-Modified-Since`, and `If-None-Match`.

## Integration notes for fireROUTE
- Preserve Feedbin's HTTP Basic auth instead of rewriting it into bearer-style auth.
- Entry-heavy resources should keep Feedbin's header-based pagination model.
- Treat pages/imports as separate workflow surfaces, not just feed-reading endpoints.

## Route-count note
- The official docs README currently exposes `13` confirmed endpoint families.

## Sources inspected
- `https://github.com/feedbin/feedbin-api`
- `https://raw.githubusercontent.com/feedbin/feedbin-api/master/README.md`
