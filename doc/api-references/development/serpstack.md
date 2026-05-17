# serpstack

## Provider metadata
- Category: `Development`
- Provider slug: `serpstack`
- Docs used manually:
  - `https://serpstack.com/`
  - `https://docs.apilayer.com/serpstack/docs/api-documentation`
- Confirmed REST API base URL: `https://api.serpstack.com`
- Primary media types: JSON by default; optional CSV on search responses
- Authentication model surfaced in docs: API access key via required `access_key` query parameter
- Manually confirmed routes in this pass: `2`

## Authentication
From the official docs:
- every request requires `access_key`
- the reviewed docs expose query-param auth, not bearer-token header auth
- the provider is documented as HTTPS-capable on the official site

## Common request/response conventions
- Base URL: `https://api.serpstack.com`
- both documented operations use `GET`
- `/search` defaults to Google search results unless other engine settings are used
- `/search` returns JSON by default and can return CSV with `output=csv`
- `/locations` returns JSON arrays of canonicalized location records
- search result bodies are heterogeneous: different top-level arrays appear depending on `type` and what Google returned

## Manually confirmed endpoint set

### 1) Search SERPs
- Method: `GET`
- Path: `/search`
- Full URL: `https://api.serpstack.com/search`
- Purpose: retrieve Google SERP data, including organic results and optional ads/images/videos/news/shopping/local/answer-box payloads
- Required query parameters confirmed in docs:
  - `access_key` - API key
  - `query` - search query string; docs say advanced Google operators are supported
- Additional query parameters confirmed in docs:
  - `auto_location` - `0|1`, default `1`
  - `csv_fields` - dot-notated field selector for CSV output
  - `device` - `desktop`, `mobile`, or `tablet`
  - `engine` - defaults to `google`
  - `exclude_autocorrected_results` - `0|1`
  - `gl` - country code, default `us`
  - `google_domain` - Google host/domain such as `google.com`
  - `hl` - language code, default `en`
  - `images_color`
  - `images_page`
  - `images_size`
  - `images_type`
  - `images_usage`
  - `location` - free text or canonicalized value returned by `/locations`
  - `news_type` - docs show `blogs`
  - `output` - `json` or `csv`
  - `page` - page number, default `1`
  - `period` - `last_hour`, `last_day`, `last_week`, `last_month`, `last_year`, or `custom`
  - `period_start` - required only for custom date windows
  - `period_end` - required only for custom date windows
  - `safe` - `0|1`
  - `sort` - `relevance` or `date`
  - `type` - `web`, `images`, `videos`, `news`, `shopping`
- Response structures explicitly visible in docs include:
  - `request`
  - `search_parameters`
  - `search_information`
  - `ads`
  - `organic_results`
  - `image_results`
  - `video_results`
  - `news_results`
  - `shopping_results`
  - `local_results`
  - `answer_box`
  - `events`
  - `top_stories`
  - `knowledge_graph`
  - `inline_tweets`
  - `related_searches`
  - `related_questions`

### 2) Supported locations lookup
- Method: `GET`
- Path: `/locations`
- Full URL: `https://api.serpstack.com/locations`
- Purpose: look up canonicalized locations to reuse in the `/search` `location` parameter
- Query parameters confirmed in docs:
  - `access_key` - required API key
  - `query` - required free-text location query
  - `limit` - optional integer, default `10`, max `100`
- Response fields confirmed in docs:
  - `name`
  - `canonical_name`
  - `country_code`
  - `target_type`
  - `reach`
  - `latitude`
  - `longitude`

## Pagination
- `/search` documents page-based pagination with `page`, default `1`
- `/locations` is not paginated in the reviewed docs; it uses a `limit` parameter instead

## Rate limits and quotas
- the reviewed endpoint docs did not publish a numeric per-minute limit
- the official site does state there is a free tier with up to `100` monthly requests
- the homepage also emphasizes high-volume cloud infrastructure without queueing, but does not provide a concrete burst/RPM number in the reviewed public docs

## Error and response notes
From the official endpoint pages:
- `/search` documents these statuses:
  - `400`
  - `401`
  - `403`
  - `422`
  - `429`
  - `500`
- `/locations` documents these statuses:
  - `400`
  - `401`
  - `429`
  - `500`
- successful `/search` responses may be JSON or CSV depending on `output`
- successful `/locations` responses are JSON arrays of location objects

## Important usage notes
- serpstack is also route-light: the public API surface exposed in the reviewed docs is just `/search` plus `/locations`
- the docs explicitly recommend resolving precise geographic targets through `/locations` and then feeding `canonical_name` into `/search`
- response content varies heavily by search `type` and by what Google returned for the specific query
- CSV mode is only documented on the `/search` route and can be narrowed via `csv_fields`

## Verification notes
This file was manually rebuilt from the official serpstack homepage and official APILayer serpstack documentation using browser inspection.