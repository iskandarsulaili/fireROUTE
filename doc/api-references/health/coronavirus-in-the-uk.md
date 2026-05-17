# Coronavirus in the UK

## Provider metadata
- Category: `Health`
- Provider slug: `coronavirus-in-the-uk`
- Official docs/pages used:
  - `https://coronavirus.data.gov.uk/details/developers-guide`
  - `https://ukhsa-dashboard.data.gov.uk/access-our-data/overview`
  - `https://ukhsa-dashboard.data.gov.uk/access-our-data/getting-started/`
  - `https://ukhsa-dashboard.data.gov.uk/access-our-data/data-structure/`
  - `https://ukhsa-dashboard.data.gov.uk/access-our-data/examples/`
  - `https://ukhsa-dashboard.data.gov.uk/access-our-data/examples-api-pagination/`
  - `https://api.ukhsa-dashboard.data.gov.uk/api/swagger/`
  - `https://api.ukhsa-dashboard.data.gov.uk/api/schema`
- Current public API base URL: `https://api.ukhsa-dashboard.data.gov.uk`
- Auth model: none
- Response format: JSON
- CORS note from the reviewed docs: not explicitly documented on the reviewed guide pages
- Public rate-limit note: no numeric rate limit was published on the reviewed official pages
- Manually confirmed route count: `28`

## Authentication and access
- The getting-started page explicitly says usage of the UKHSA data dashboard API does not require authentication.
- The guide says the API is accessed over HTTP(S) and returns JSON.
- The reviewed public surface is read-only; the schema exposed only `GET` operations.

## Canonical endpoints
### Legacy public surface
1. `GET /` - list top-level API resources
2. `GET /api/schema` - return the OpenAPI schema document
3. `GET /health/` - service health-check route
4. `GET /themes/` - list themes
5. `GET /themes/{theme}` - fetch one theme
6. `GET /themes/{theme}/sub_themes/` - list sub-themes for a theme
7. `GET /themes/{theme}/sub_themes/{sub_theme}` - fetch one sub-theme
8. `GET /themes/{theme}/sub_themes/{sub_theme}/topics` - list topics for a theme/sub-theme pair
9. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}` - fetch one topic
10. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types` - list geography types available for the selected topic
11. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}` - fetch one geography type
12. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies` - list geographies under the selected geography type
13. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}` - fetch one geography selection
14. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}/metrics` - list metrics available for the selection chain
15. `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}/metrics/{metric}` - return paginated timeseries data for one metric/geography combination

### Versioned v2 public surface
16. `GET /v2/` - list top-level v2 resources
17. `GET /v2/themes/` - list v2 themes
18. `GET /v2/themes/{theme}` - fetch one v2 theme
19. `GET /v2/themes/{theme}/sub_themes/` - list v2 sub-themes
20. `GET /v2/themes/{theme}/sub_themes/{sub_theme}` - fetch one v2 sub-theme
21. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics` - list v2 topics
22. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}` - fetch one v2 topic
23. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types` - list v2 geography types
24. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}` - fetch one v2 geography type
25. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies` - list v2 geographies
26. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}` - fetch one v2 geography selection
27. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}/metrics` - list v2 metrics
28. `GET /v2/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geography_type}/geographies/{geography}/metrics/{metric}` - return paginated v2 metric data

## Parameters and request notes
### Shared path parameters
- `theme` - top-level topical grouping such as `infectious_disease`
- `sub_theme` - subgroup beneath a theme, such as `respiratory`
- `topic` - dataset/topic name such as `COVID-19`
- `geography_type` - area type, for example `Nation`
- `geography` - selected geography value, for example `England`
- `metric` - selected metric identifier, for example `COVID-19_testing_PCRcountByDay`

### Query parameters documented on the metric-data route
- `page` - page number within the paginated result set
- `page_size` - number of results to return per page
- `age` - optional age filter
- `date` - optional ISO date filter
- `epiweek` - optional epidemiological week filter
- `in_reporting_delay_period` - optional boolean filter
- `sex` - optional sex filter
- `stratum` - optional stratum filter
- `year` - optional year filter

## Response, pagination, and error notes
- The examples page shows paginated JSON responses shaped like:
  - `count`
  - `next`
  - `previous`
  - `results`
- The pagination guide says the API uses page-based pagination.
- The pagination guide says the default `page_size` is `5`.
- The examples page says unavailable hierarchy selections return `200 OK` with an empty array rather than a route-specific error payload.
- The reviewed schema exposed `200` responses for the confirmed public routes, but I did not find a shared official error-code table on the reviewed guide pages.

## Usage notes from the official docs
- The data-structure page says this is a hierarchical API and clients must walk the hierarchy to discover which entities exist for a given theme/sub-theme/topic/geography combination.
- The getting-started page says the API is intended as a more accessible and predictable interface than scraping dashboard HTML.
- The getting-started page says the API currently requires retrieving data for an individual metric and geography combination; it does not support multi-geography retrieval in one request.
- The examples page demonstrates canonical data requests against the unversioned `/themes/.../metrics/{metric}` surface.
- The reviewed schema also exposes a parallel `/v2/...` route family; preserve both route families until the official docs explicitly deprecate one.
- The service is described as beta software and subject to change.

## fireROUTE normalization notes
- Normalize this provider as an unauthenticated hierarchical JSON API rooted at `https://api.ukhsa-dashboard.data.gov.uk`.
- Preserve both the unversioned and `/v2` hierarchies because both are present in the official OpenAPI schema.
- Treat metric-data responses as paginated collections keyed by `count`, `next`, `previous`, and `results`.
- Do not assume every theme/sub-theme/topic/geography combination exists; clients should traverse discovery routes first.