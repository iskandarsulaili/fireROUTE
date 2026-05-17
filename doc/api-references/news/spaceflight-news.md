# Spaceflight News API

## Overview
- Provider: Spaceflight News API (SNAPI)
- Category: News
- Official docs: `https://spaceflightnewsapi.net/`
- Canonical REST base URL: `https://api.spaceflightnewsapi.net/v4`
- Additional interface: GraphQL support is explicitly documented
- Auth: none documented for the public API
- HTTPS: yes
- Response format: JSON
- Pagination: offset/limit on list endpoints with paginated envelopes containing `count`, `next`, `previous`, and `results`
- Rate limits: no numeric limit documented on the reviewed docs pages

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/articles/` | rich query filters; see below | List articles. |
| GET | `/articles/{id}/` | `id` path | Fetch one article. |
| GET | `/blogs/` | query filters similar to article listing | List blog posts. |
| GET | `/blogs/{id}/` | `id` path | Fetch one blog post. |
| GET | `/reports/` | query filters similar to article listing | List reports. |
| GET | `/reports/{id}/` | `id` path | Fetch one report. |
| GET | `/info/` | none | Returns API info metadata. |

## Article-list query parameters confirmed from docs
The `/articles/` operation exposes a large filter surface. The following parameters were visible in the official docs during review:
- `event`
- `has_event`
- `has_launch`
- `is_featured`
- `launch`
- `limit`
- `news_site`
- `news_site_exclude`
- `offset`
- `ordering`
- `published_at_gt`
- `published_at_gte`
- `published_at_lt`
- `published_at_lte`
- `search`
- `summary_contains`
- `summary_contains_all`
- `summary_contains_one`
- `title_contains`
- `title_contains_all`
- `title_contains_one`
- `updated_at_gt`
- `updated_at_gte`
- `updated_at_lt`
- `updated_at_lte`

## Response format notes
- The paginated schemas shown in the official docs use this envelope:
  - `count`
  - `next`
  - `previous`
  - `results`
- Article/blog/report items shown in the schema include fields such as:
  - `id`
  - `title`
  - `authors`
  - `url`
  - `image_url`
  - `news_site`
  - `summary`
  - `published_at`
  - `updated_at`
- Author objects include a nested `socials` object in the schema examples.

## Usage notes
- The docs page explicitly states the API is free to use and encourages supporting The Space Devs.
- GraphQL availability is documented alongside the REST API.
- Support links are provided through The Space Devs Discord and SNAPI/TSD FAQ pages.

## Error handling
- The reviewed Swagger-style docs expose per-operation response sections.
- The docs pages reviewed do not publish a single universal numeric rate-limit policy.

## Integration notes for fireROUTE
- SNAPI is a clean fit for canonical `articles`, `blogs`, and `reports` collection/item mappings.
- Preserve `limit`/`offset` plus `next`/`previous` pagination URLs in passthrough mode.
- Consider exposing GraphQL separately from the REST adapter because the official docs present it as a parallel interface.

## Sources inspected
- `https://spaceflightnewsapi.net/`
- `https://api.spaceflightnewsapi.net/v4/docs/`
- `https://api.spaceflightnewsapi.net/v4/schema/`
