# News API

## Overview
- Provider: News API
- Category: News
- Official docs pages inspected:
  - `https://newsapi.org/docs/endpoints`
  - `https://newsapi.org/docs/endpoints/everything`
  - `https://newsapi.org/docs/endpoints/top-headlines`
  - `https://newsapi.org/docs/endpoints/sources`
  - `https://newsapi.org/docs/authentication`
  - `https://newsapi.org/docs/errors`
  - `https://newsapi.org/pricing`
- Base URL: `https://newsapi.org/v2`
- Auth: API key required
  - query parameter: `apiKey`
  - HTTP header: `X-Api-Key`
  - HTTP header: `Authorization` (the docs say `Bearer` is optional and the key should not be base64-encoded)
- HTTPS: yes
- Response format: JSON
- Pagination: page-based on article endpoints via `page` and `pageSize`
- Rate limits / quotas documented on the pricing page:
  - Developer: `100 requests per day`
  - Business: `250,000 requests per month included`
  - Advanced: `2,000,000 requests per month included`
- Plan note: the pricing page says the Developer plan has a `24 hour` article delay and can search up to `1 month` old, while paid plans provide real-time availability and up to `5 years` of search history

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/everything` | `apiKey`; optional `q`, `searchIn`, `sources`, `domains`, `excludeDomains`, `from`, `to`, `language`, `sortBy`, `pageSize`, `page` | Article discovery/search endpoint. |
| GET | `/top-headlines` | `apiKey`; optional `country`, `category`, `sources`, `q`, `pageSize`, `page` | Live top and breaking headlines endpoint. |
| GET | `/top-headlines/sources` | `apiKey`; optional `category`, `language`, `country` | Returns the subset of publishers available for top headlines. |

## Authentication
- The official auth page says authentication is handled with a simple API key.
- Supported attachment methods documented by News API:
  - `?apiKey=API_KEY`
  - `X-Api-Key: API_KEY`
  - `Authorization: API_KEY`
- The docs strongly recommend header-based auth so the key is not exposed in logs or request URLs.
- Missing or invalid auth returns `401 Unauthorized`.

## Endpoint details

### `GET /everything`
Documented request parameters:
- `apiKey` — required unless supplied by header
- `q` — keywords/phrases; max `500` chars; advanced search supports quotes, `+`, `-`, and `AND` / `OR` / `NOT`
- `searchIn` — comma-separated subset of `title`, `description`, `content`
- `sources` — comma-separated source identifiers; maximum `20`
- `domains` — comma-separated domain list to include
- `excludeDomains` — comma-separated domain list to exclude
- `from` — oldest allowed article datetime in ISO 8601
- `to` — newest allowed article datetime in ISO 8601
- `language` — 2-letter ISO-639-1 code; the page lists codes including `ar`, `de`, `en`, `es`, `fr`, `he`, `it`, `nl`, `no`, `pt`, `ru`, `sv`, `ud`, `zh`
- `sortBy` — `relevancy`, `popularity`, or `publishedAt`; default `publishedAt`
- `pageSize` — docs page states default `100`, maximum `100`
- `page` — page number for paginating through results

### `GET /top-headlines`
Documented request parameters:
- `apiKey`
- `country` — 2-letter ISO 3166-1 code; docs page example explicitly shows `us`
- `category` — one of `business`, `entertainment`, `general`, `health`, `science`, `sports`, `technology`
- `sources` — comma-separated source identifiers
- `q` — keyword or phrase search
- `pageSize` — default `20`, maximum `100`
- `page` — page number

Constraint notes from the docs:
- `country` cannot be mixed with `sources`
- `category` cannot be mixed with `sources`

### `GET /top-headlines/sources`
Documented request parameters:
- `apiKey`
- `category` — same category list as top headlines; default all categories
- `language` — docs list `ar`, `de`, `en`, `es`, `fr`, `he`, `it`, `nl`, `no`, `pt`, `ru`, `sv`, `ud`, `zh`; default all languages
- `country` — docs list a large ISO-like set including `ae`, `ar`, `at`, `au`, `be`, `bg`, `br`, `ca`, `ch`, `cn`, `co`, `cu`, `cz`, `de`, `eg`, `fr`, `gb`, `gr`, `hk`, `hu`, `id`, `ie`, `il`, `in`, `it`, `jp`, `kr`, `lt`, `lv`, `ma`, `mx`, `my`, `ng`, `nl`, `no`, `nz`, `ph`, `pl`, `pt`, `ro`, `rs`, `ru`, `sa`, `se`, `sg`, `si`, `sk`, `th`, `tr`, `tw`, `ua`, `us`, `ve`, `za`

## Response format
### Article endpoints (`/everything`, `/top-headlines`)
Documented top-level fields:
- `status`
- `totalResults`
- `articles`

Documented article fields:
- `source.id`
- `source.name`
- `author`
- `title`
- `description`
- `url`
- `urlToImage`
- `publishedAt`
- `content`

### Sources endpoint (`/top-headlines/sources`)
Documented top-level fields:
- `status`
- `sources`

The sources page describes each source object as including:
- `id`
- `name`
- `description`
- `url`
- `category`
- `language`
- `country`

## Error handling
The official errors page documents this error body shape:
- `status`
- `code`
- `message`

HTTP status summary documented by News API:
- `200` — OK
- `400` — bad request / missing or misconfigured parameter
- `401` — unauthorized / missing or invalid API key
- `429` — rate limited
- `500` — server error

Documented error codes:
- `apiKeyDisabled`
- `apiKeyExhausted`
- `apiKeyInvalid`
- `apiKeyMissing`
- `parameterInvalid`
- `parametersMissing`
- `rateLimited`
- `sourcesTooMany`
- `sourceDoesNotExist`
- `unexpectedError`

## Integration notes for fireROUTE
- Keep the three documented endpoint families separate because their parameter surfaces differ materially.
- Preserve the docs' source-mixing constraints on `/top-headlines`.
- Plan-specific freshness/history limits matter: Developer-plan responses are delayed and older-history search is limited compared with paid plans.
- Header auth should be preferred over query-string auth for production routing.

## Sources inspected
- `https://newsapi.org/docs/endpoints`
- `https://newsapi.org/docs/endpoints/everything`
- `https://newsapi.org/docs/endpoints/top-headlines`
- `https://newsapi.org/docs/endpoints/sources`
- `https://newsapi.org/docs/authentication`
- `https://newsapi.org/docs/errors`
- `https://newsapi.org/pricing`
