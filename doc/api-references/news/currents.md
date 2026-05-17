# Currents

## Overview
- Provider: Currents News API
- Category: News
- Official docs: `https://currentsapi.services/`
- Docs pages inspected under: `https://currentsapi.services/en/docs/`
- Base URL: `https://api.currentsapi.services`
- Auth: API key required; accepted as `Authorization` header or `apiKey` query parameter
- Header auth forms: `Authorization: YOUR_KEY` or `Authorization: Bearer YOUR_KEY`
- HTTPS: yes
- Response format: JSON
- Versioning: both `/v1` and `/v2` are documented; `/v2` is the canonical taxonomy path and adds cursor pagination for search
- Free-tier note on landing page: `1,000` daily requests

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/v1/latest-news` | `language`, `country`, `category`, `type`, `domain`, `domain_not`, `author`, `page_number`, `page_size`, `apiKey` or auth header | Stable latest-news endpoint using legacy v1 category values. |
| GET | `/v2/latest-news` | same core filters as v1 latest-news | Canonical-taxonomy latest-news endpoint. |
| GET | `/v1/search` | `keywords`, `query`, `language`, `country`, `category`, `type`, `start_date`, `end_date`, `domain`, `domain_not`, `author`, `page_number`, `page_size`, `apiKey` or auth header | Stable search with offset pagination. |
| GET | `/v2/search` | v1 search params plus `cursor` | Canonical search endpoint with cursor pagination support. |
| GET | `/v1/auth` | auth only | Token/auth check endpoint documented on the auth page. |
| GET | `/v1.1/auth` | auth only | Alternate token/auth check path documented in the auth contract note. |
| GET | `/v1/available/*` | available-filter path segment | v1 availability/filter discovery family. |
| GET | `/v2/available/*` | available-filter path segment | v2 availability/filter discovery family; `categories` is the canonical taxonomy source of truth. |

## Latest-news parameter notes
- Core filters documented for latest-news:
  - `language` — defaults to `en`
  - `country` — 2-letter country code
  - `category` — version-dependent taxonomy (`v1` legacy values vs `v2` canonical values)
  - `type` — `1` news, `2` articles, `3` discussion
  - `domain` / `domain_not`
  - `author`
  - `page_number` — range `1..180`, default `1`
  - `page_size` — range `1..300`, default `30`, plan caps may be lower
- The docs explicitly say search-only params such as `keywords`, `query`, `start_date`, `end_date`, `limit`, `has_image`, `has_description`, `count_result`, and `cursor` are invalid on latest-news and return `400`.

## Search parameter notes
- `keywords` — simple term search.
- `query` — boolean query syntax with `AND`, `OR`, `NOT`, quotes, and parentheses.
- If both `keywords` and `query` are provided, the docs say `keywords` takes priority.
- Search filters include:
  - `language`
  - `country`
  - `category`
  - `type`
  - `start_date`
  - `end_date`
  - `domain`
  - `domain_not`
  - `author`
  - `page_number`
  - `page_size`
  - `cursor` on `/v2/search` only
- Offset guardrail: requests where `(page_number - 1) * page_size > 5000` are rejected.

## Version and taxonomy notes
- `/v2/available/categories` is documented as the authoritative source for canonical category values on `/v2/*` routes.
- The docs list the canonical v2 categories as:
  - `general`
  - `society`
  - `science_technology`
  - `politics_government`
  - `economy_business_finance`
  - `arts_culture_entertainment`
  - `lifestyle_leisure`
  - `human_interest`
  - `sport`
  - `crime_law_justice`
  - `education`
  - `environment`
  - `labour`
  - `health`
  - `automotive`
  - `real_estate`
- `/v1/*` continues to use legacy category labels such as `technology` and `science`.

## Response format
- Successful responses use a common JSON shape including:
  - `status`
  - `news` (array)
  - `page`
- Article objects are documented with fields including:
  - `id`
  - `title`
  - `description`
  - `url`
  - `author`
  - `image`
  - `language`
  - `category`
  - `published`

## Rate limits and headers
- The landing page advertises `1,000` free requests per day.
- The rate-limit docs say every authenticated response includes:
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Limit`
- The docs describe rate limits as daily quotas and warn that persistent excessive violations can lead to account suspension.

## Error handling
- The docs publish a consistent error payload, for example:
  ```json
  {
    "status": "400",
    "msg": "Invalid parameters",
    "details": {
      "message": "Invalid parameters",
      "errors": {
        "page_number": "Must be >= 1"
      }
    }
  }
  ```
- Auth failures typically look like:
  ```json
  {
    "status": "401",
    "msg": "Authentication required"
  }
  ```
- Common documented statuses:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `429 Too Many Requests`
  - `5xx Server Errors`

## Integration notes for fireROUTE
- Preserve `/v1` and `/v2` as separate route families because category values and pagination behavior differ.
- Use `/v2/search` when deep pagination is required because it supports `cursor`.
- Keep `Authorization` header auth as the preferred path; `apiKey` query auth is documented for compatibility/testing.

## Sources inspected
- `https://currentsapi.services/`
- `https://currentsapi.services/en/docs/`
- `https://currentsapi.services/en/docs/api/authentication/`
- `https://currentsapi.services/en/docs/api/rate-limit/`
- `https://currentsapi.services/en/docs/api/error-responses/`
- `https://currentsapi.services/en/docs/api/latest-news/`
- `https://currentsapi.services/en/docs/api/search/`
