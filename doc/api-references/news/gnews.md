# GNews

## Overview
- Provider: GNews API
- Category: News
- Official docs: `https://docs.gnews.io/`
- Base URL: `https://gnews.io/api/v4`
- Auth: API key required via the `apikey` query parameter
- HTTPS: yes
- Response format: JSON
- Pagination: page-based via `page` plus page size via `max`
- Rate limits: documented as plan-based; free plan allows `1 request/second`, paid plans allow `10 requests/second`
- Quotas: daily quota exhaustion returns `403` and resets at `00:00 UTC`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/search` | required `q`; optional `lang`, `country`, `max`, `in`, `nullable`, `from`, `to`, `sortby`, `page`, `truncate`, `apikey` | Keyword/news search endpoint. |
| GET | `/top-headlines` | optional `category`, `lang`, `country`, `max`, `nullable`, `from`, `to`, `q`, `page`, `expand`, `apikey` | Trending/top-headlines endpoint. |

## Authentication
- The docs instruct users to sign up, retrieve an API key from the dashboard, and include it as the `apikey` query parameter.
- Missing or invalid API keys produce `401 Unauthorized` responses.

## Search endpoint details
- Example documented request: GET https://gnews.io/api/v4/search?q=example&apikey=API_KEY
- Confirmed search parameters from the docs page:
  - `q` — required query string, maximum 200 characters
  - `lang` — 2-letter language code
  - `country` — 2-letter country code
  - `max` — page size, from 1 to 100 depending on plan
  - `in` — attributes to search, such as `title`, `description`, `content`
  - `nullable` — allow `description`, `content`, or `image` to be null
  - `from`, `to` — ISO 8601 publication date filters
  - `sortby` — sorting control
  - `page` — page number
  - `truncate` — truncation control documented on the page
- The docs explicitly support boolean-style query syntax for `q`.

## Top headlines endpoint details
- Example documented request: GET https://gnews.io/api/v4/top-headlines?category=general&apikey=API_KEY
- Confirmed top-headline parameters visible in the docs page:
  - `category` — one of `general`, `world`, `nation`, `business`, `technology`, `entertainment`, `sports`, `science`, `health`
  - `lang`
  - `country`
  - `max`
  - `nullable`
  - `from`, `to`
  - `q`
  - `page`
  - `expand`

## Response format
- The JSON response docs show a top-level shape of:
  - `totalArticles`
  - `articles` (array)
- Confirmed article fields from the JSON response docs:
  - `id`
  - `title`
  - `description`
  - `content`
  - `url`
  - `image`
  - `publishedAt`
  - `lang`
  - `source.id`
  - `source.name`
  - `source.url`
  - `source.country` (search endpoint only)
- The docs note that free-plan article content is truncated.

## Error handling
The official error-handling page documents these HTTP statuses:
- `200` — success
- `400` — malformed or invalid request
- `401` — missing/invalid API key
- `403` — daily quota exhausted; reset at `00:00 UTC`
- `429` — too many requests
- `500` — internal server error
- `503` — maintenance / temporary unavailability

Error bodies are JSON and may use either:
- `{"errors": [ ... ]}` for general errors
- `{"errors": {"attribute": "<message>"}}` for attribute-specific validation failures

## Integration notes for fireROUTE
- Preserve plan-aware behavior: both page size and request rate depend on subscription tier.
- Normalize UTC timestamps from `publishedAt`.
- Keep `/search` and `/top-headlines` as separate route families because their filter surfaces differ.

## Sources inspected
- `https://docs.gnews.io/`
- `https://docs.gnews.io/authentication`
- `https://docs.gnews.io/endpoints/search-endpoint`
- `https://docs.gnews.io/endpoints/top-headlines-endpoint`
- `https://docs.gnews.io/json-response`
- `https://docs.gnews.io/error-handling`
