# The Old Reader

## Overview
- Provider: The Old Reader API
- Category: News
- Official docs: `https://github.com/theoldreader/api`
- Base URL: `https://theoldreader.com`
- Auth: Google Reader–style ClientLogin/Auth token workflow plus API token endpoint as documented in the repository
- HTTPS: yes
- Response formats: JSON for most `/reader/api/0/*` endpoints, XML/Atom for feed export surfaces
- Pagination: stream endpoints use query parameters such as `output=json` and standard reader-style continuation/count controls where applicable
- Rate limits: no single numeric public limit was shown in the repo docs reviewed

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/reader/api/0/status` | Service status. |
| GET | `/reader/api/0/token` | Edit token retrieval. |
| GET | `/reader/api/0/user-info` | User profile info. |
| GET | `/reader/api/0/preference/list` | User preference list. |
| GET | `/reader/api/0/friend/list` | Friend list. |
| POST | `/reader/api/0/friend/edit` | Friend actions. |
| POST | `/reader/api/0/comment/edit` | Comment actions. |
| GET | `/reader/api/0/tag/list` | Tag listing. |
| GET | `/reader/api/0/preference/stream/list` | Stream preference list. |
| POST | `/reader/api/0/preference/stream/set` | Stream preference mutation. |
| POST | `/reader/api/0/rename-tag` | Rename tag. |
| POST | `/reader/api/0/disable-tag` | Disable tag. |
| GET | `/reader/api/0/unread-count` | Unread counters. |
| GET | `/reader/api/0/subscription/list` | Subscription list. |
| POST | `/reader/api/0/subscription/edit` | Subscription edit operations. |
| POST | `/reader/api/0/subscription/quickadd` | Quick-add a feed URL. |
| GET | `/reader/api/0/stream/items/ids` | Stream item IDs. |
| POST | `/reader/api/0/stream/items/contents` | Item content fetch by IDs. |
| GET | `/reader/api/0/stream/contents` | Stream contents. |
| POST | `/reader/api/0/mark-all-as-read` | Mark stream as read. |
| POST | `/reader/api/0/edit-tag` | Edit item tags/states. |
| GET | `/reader/atom/user/-/state/com.google/read` | Atom feed of read items. |
| GET | `/reader/atom/user/-/label/{label}` | Atom feed for a label. |
| GET | `/reader/atom/feed/{feedId}` | Atom feed for a subscription. |
| GET | `/reader/subscriptions/export` | OPML export of subscriptions. |

## Request notes
- The repo follows the old Google Reader API shape closely.
- Many examples use `output=json` on GET endpoints.
- Query parameters surfaced in the repository include login/token-related fields and item-ID parameters such as `i`.

## Integration notes for fireROUTE
- Treat this as a reader-state API, not a publisher/newswire API.
- Keep JSON `/reader/api/0/*` endpoints separate from Atom/OPML export routes.
- Preserve the provider's native token/edit-token workflow instead of inventing a modernized auth scheme.

## Route-count note
- The official repository currently exposes `25` confirmed endpoint shapes.

## Sources inspected
- `https://github.com/theoldreader/api`
