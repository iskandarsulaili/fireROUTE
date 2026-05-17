# TheNews

## Overview
- Provider: The News API
- Category: News
- Official docs: `https://www.thenewsapi.com/documentation`
- Base URL: `https://api.thenewsapi.com/v1`
- Auth: required `api_token` query parameter
- HTTPS: yes
- Response format: JSON
- Pagination: supported on list endpoints with `page` and, where documented, `limit`
- Rate limits: enforced, but no single numeric global limit is published in the docs; rate and usage headers are referenced in error documentation

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/news/headlines` | required `api_token`; optional `locale`, `domains`, `exclude_domains`, `source_ids`, `exclude_source_ids`, `language`, `published_on`, `headlines_per_category`, `include_similar` | Headline feed grouped by category. Official docs mark this endpoint as available only on the Standard plan and above. |
| GET | `/news/top` | required `api_token`; optional `search`, `search_fields`, `locale`, `categories`, `exclude_categories`, `domains`, `exclude_domains`, `source_ids`, `exclude_source_ids`, `language`, `published_before`, `published_after`, `published_on`, `sort`, `limit`, `page` | Top stories endpoint available on all plans. |
| GET | `/news/all` | required `api_token`; optional `search`, `search_fields`, `categories`, `exclude_categories`, `domains`, `exclude_domains`, `source_ids`, `exclude_source_ids`, `language`, `published_before`, `published_after`, `published_on`, `sort`, `limit`, `page` | Full news search endpoint available on all plans. |
| GET | `/news/similar/{uuid}` | path `uuid`; required `api_token`; optional `categories`, `exclude_categories`, `domains`, `exclude_domains`, `source_ids`, `exclude_source_ids`, `language`, `published_before`, `published_after`, `published_on`, `limit`, `page` | Returns articles similar to the article identified by UUID. Available on all plans. |
| GET | `/news/uuid/{uuid}` | path `uuid`; required `api_token` | Returns one article object by UUID. Available on all plans. |
| GET | `/news/sources` | auth documented globally via `api_token`; optional `categories`, `exclude_categories`, `language`, `page` | Returns source metadata. The docs state the result limit is fixed at 50 per request. Available on all plans. |

## Parameter and query-language notes
- `api_token` is the authentication mechanism described in the Getting Started / Authentication sections and is passed as a GET parameter.
- Search-capable endpoints support boolean-style operators and syntax shown in the docs, including `+`, `|`, `-`, quoted phrases, wildcard `*`, parentheses, and escaping with `\`.
- `search_fields` narrows which article fields are searched; documented values include combinations of `title`, `description`, `keywords`, and `main_text`.
- `sort` values documented for search endpoints are `published_at` and `relevance_score`.
- `published_before` / `published_after` accept multiple granularities, including full timestamps and reduced date forms (`Y-m-d\TH:i:s`, `Y-m-d\TH:i`, `Y-m-d\TH`, `Y-m-d`, `Y-m`, `Y`).
- `published_on` uses `Y-m-d`.
- `locale`, `language`, `categories`, domains, and source-ID filters are generally comma-separated lists.

## Response format notes
- The provider documents UTF-8 text and UTC/GMT timestamps.
- `GET /news/headlines` returns a `data` object keyed by headline category (`general`, `business`, `sports`, etc.), not the `meta` + array shape used by the search/list endpoints.
- `GET /news/top`, `/news/all`, `/news/similar/{uuid}`, and `/news/sources` return pagination metadata under `meta`, with documented fields such as `found`, `returned`, `limit`, and `page`.
- Article objects can include `uuid`, `title`, `description`, `keywords`, `snippet`, `url`, `image_url`, `language`, `published_at`, `source`, `categories`, and sometimes `relevance_score`.
- `GET /news/headlines` can optionally embed `similar` article arrays per headline when `include_similar` is enabled.
- `GET /news/sources` returns source objects such as `source_id`, `domain`, `language`, `locale`, and `categories`.

## Error, quota, and plan notes
- The official error table documents these provider error codes and HTTP statuses:
  - `malformed_parameters` → `400`
  - `invalid_api_token` → `401`
  - `usage_limit_reached` → `402`
  - `endpoint_access_restricted` → `403`
  - `resource_not_found` → `404`
  - `invalid_api_endpoint` → `404`
  - `rate_limit_reached` → `429`
  - `server_error` → `500`
  - `maintenance_mode` → `503`
- The docs say usage-limit information is exposed through `X-UsageLimit-Limit` headers.
- The docs say rate-limit information is exposed through `X-RateLimit-Limit` headers.
- The docs repeatedly warn that GET parameters should be URL-encoded.
- `/news/headlines` is plan-gated to Standard and above; the other five confirmed endpoints are marked available on all plans.

## Integration notes for fireROUTE
- Treat `/news/headlines` separately from `/news/top` and `/news/all` because its response shape is category-grouped rather than a paginated flat list.
- Always URL-encode search syntax and list filters before dispatching requests.
- Expose `uuid` as a first-class identifier because it powers both direct lookup and similar-news retrieval.
- Preserve pagination metadata from list endpoints and the fixed 50-result behavior on `/news/sources`.
- Downstream adapters should surface plan/access errors distinctly because endpoint availability differs by subscription tier.

## Sources inspected
- `https://www.thenewsapi.com/`
- `https://www.thenewsapi.com/documentation`
