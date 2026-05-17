# Associated Press

## Overview
- Provider: AP Media API
- Category: News
- Official docs: `https://developer.ap.org/ap-media-api/`
- Base URL: `https://api.ap.org/media/v`
- Auth: API key required in header `x-api-key` (query `apikey` is present in the Swagger spec but explicitly marked deprecated)
- HTTPS: yes
- Response format: JSON
- Pagination: documented via `page_size`; the AP docs also call out next-page-link workflows for update polling
- Rate limits: no public numeric rate limit in the inspected docs; quota/account state is exposed through dedicated account endpoints
- Access model: licensed / customer API, not an open anonymous news API

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/content/{item_id}` | path `item_id`; optional `include`, `exclude`, `pricing`, `in_my_plan` | Single content-item metadata lookup. |
| GET | `/content/search` | optional `q`, `include`, `exclude`, `view`, `page_size`, `filter_out`, `pricing`, `versions`, `in_my_plan`, `with_monitor`, `session_label` | Main content search endpoint. |
| GET | `/content/feed` | content/feed query controls | Feed-style retrieval for licensed content. |
| GET | `/content/rss` | optional feed/query controls | Lists RSS resources. |
| GET | `/content/rss/{rss_id}` | path `rss_id` | Fetches one RSS feed resource. |
| GET | `/content/ondemand` | on-demand retrieval query controls | On-demand content access. |
| GET | `/account` | none documented in summary | Returns account information. |
| GET | `/account/followedtopics` | none documented in summary | Returns followed topics. |
| GET | `/account/plans` | none documented in summary | Returns plan information. |
| GET | `/account/downloads` | none documented in summary | Returns download history/records. |
| GET | `/account/quotas` | none documented in summary | Returns quota information. |
| POST | `/account/monitors/create` | body `monitor` | Creates a monitor/alert definition. |
| POST | `/account/monitors/{monitorId}/update` | path `monitorId`; body `monitor` | Updates a monitor. |
| DELETE | `/account/monitors/{monitorId}/delete` | path `monitorId` | Deletes a monitor. |
| GET | `/account/monitors` | optional `show_detail` | Lists monitors. |
| GET | `/account/monitors/{monitorId}` | path `monitorId`; optional `show_detail` | Gets a single monitor. |
| GET | `/account/monitors/alerts` | optional monitor filters | Lists monitor alerts. |
| GET | `/account/monitors/sessions` | optional session filters | Lists monitor sessions. |
| GET | `/account/monitors/sessions/{session_id}` | path `session_id` | Returns one monitor session. |
| GET | `/account/monitors/sessions/{session_id}/disable` | path `session_id` | Disables a monitor session. |
| GET | `/account/monitors/sessions/{session_id}/enable` | path `session_id` | Enables a monitor session. |

## Parameter notes
- Common documented query parameters in the Swagger spec include `q`, `include`, `exclude`, `view`, `page_size`, `filter_out`, `pricing`, `versions`, `in_my_plan`, `with_monitor`, and `session_label`.
- Authentication should be sent as `x-api-key` in the request header.
- The spec still exposes a query parameter named `apikey`, but marks it as deprecated and no longer supported.

## Response and usage notes
- The developer site describes the API as AP's next-generation licensed content API for text/stories, pictures, graphics, video, and audio.
- The landing page says 30 days of content is available plus current/archive picture, video, audio, and print-graphics libraries.
- Because AP positions this as a customer/licensed product, adapters should assume entitlement-sensitive responses rather than a universally public catalog.

## Route-count note
- The official Swagger spec at `https://api.ap.org/media/v/swagger.json` currently exposes `21` confirmed operations.

## Integration notes for fireROUTE
- Treat AP as an authenticated enterprise/newsroom integration, not a public-keyword news API.
- Preserve AP-specific include/exclude/view parameters because they materially affect payload shape.
- Keep monitor/account operations separate from content-search routes when building adapters.

## Sources inspected
- `https://developer.ap.org/`
- `https://developer.ap.org/ap-media-api/`
- `https://api.ap.org/media/v/swagger.json`
