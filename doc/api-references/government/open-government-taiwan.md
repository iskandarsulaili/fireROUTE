# Open Government, Taiwan

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-taiwan`
- Official docs/pages used:
  - `https://data.gov.tw/`
  - `https://data.gov.tw/datasets/search?dt=openapi`
  - `https://data.gov.tw/dataset/177482`
  - live official front-end API routes used by the production portal under `https://data.gov.tw/api/front/...`
  - official production client bundle `https://data.gov.tw/_nuxt/useDatasets.e0d5ad37.js`
  - official production search bundle `https://data.gov.tw/_nuxt/search.c44ebb02.js`
- Current documented API base URL: `https://data.gov.tw/api/front/dataset`
- Auth model: the catalog search/detail/export routes documented here are publicly callable; one reviewed route (`detail/extras`) returned `401 Not authorized`; many dataset records point onward to external upstream APIs that have their own independent auth rules
- Response formats: JSON for most catalog endpoints, CSV attachment exports for export routes, and Turtle-like DCAT text for `dcat.detail`
- Manually confirmed canonical route count: `15`

## Official usage notes
- The Taiwan portal is primarily a metadata catalog for datasets and external API services, not a single unified data-delivery API for all datasets.
- The `API服務資料集` search page is backed by the same official front-end API family under `/api/front/dataset/...`.
- The official search page uses `category_dataset_tid=43095` to represent `API服務` / API-service datasets; the live filtered result count was `78` during review.
- Dataset detail pages expose upstream provider docs through `api_doc_url`; for example dataset `177482` points to a TDX Swagger page and explicitly notes that callers must register on TDX and create an API key.
- The official production client bundle documents the live route inventory and the HTTP methods used by the portal itself.

## Authentication, parameters, and request notes
- Publicly callable routes confirmed during review:
  - `POST /simple-list`
  - `POST /options-list`
  - `GET /category-dataset/options-list`
  - `GET /dropdown`
  - `POST /changed/list`
  - `POST /list`
  - `POST /en/list`
  - `GET /detail`
  - `GET /en/detail`
  - `GET /export`
  - `POST /search-export`
  - `GET /changed/export`
  - `GET /dcat.detail`
  - `GET /api/fetch-yaml/{id}`
- Auth-gated route confirmed during review:
  - `GET /detail/extras` returned `401 Not authorized`
- Key parameters/body fields confirmed from the official bundles and live calls:
  - `POST /simple-list`
    - required body field `status`
    - live validation error says allowed values are `publish`, `unpublish`, or `history`
  - `POST /options-list`
    - required body field `name`
    - live examples confirmed: `agency`, `file_format`, `category`
  - `GET /dropdown`
    - requires `list_type`
    - the official bundle uses `list_type=published`
    - `qs` is the search-term query string
  - `POST /list` and `POST /en/list`
    - official bundle sends bodies with `filter`, `bool`, `page_num`, `page_limit`, `tids`, and `sort`
    - a live API-service search worked with `{"filter":[{"fields":"category_dataset_tid","query":"43095"}],"bool":[],"page_num":1,"page_limit":10,"tids":[],"sort":"_score_desc"}`
  - `POST /changed/list`
    - accepts at least `report_date`, `page`, and `size`
  - `GET /detail`, `GET /en/detail`, `GET /dcat.detail`, `GET /detail/extras`
    - require `nid`
  - `GET /export`
    - requires `format`
  - `POST /search-export`
    - accepts the same search-style filter body used by `POST /list`
  - `GET /changed/export`
    - requires `format` and `report_date`
  - `GET /api/fetch-yaml/{id}`
    - path parameter is the dataset/API identifier used by the portal to fetch and parse upstream API specs

## Pagination, errors, and format notes
- `POST /list` and `POST /en/list` return JSON with `search_count`, `search_result`, and aggregation buckets used by the portal filters.
- `page_num` and `page_limit` are the live paging controls used by the production search bundle.
- `GET /export` and `POST /search-export` return downloadable CSV attachments with `Content-Disposition` filenames.
- `GET /changed/export` also returns downloadable CSV attachments.
- `GET /dcat.detail?nid=...` returns DCAT text in Turtle-like syntax rather than JSON.
- Verified live error behavior:
  - `POST /simple-list` without `status` returned `400` with `parameter: <status> is required`
  - `POST /simple-list` with an unsupported value returned `400` saying `status` only supports `publish`, `unpublish`, `history`
  - `GET /dropdown` without `list_type` returned `400` with `parameter: <list_type> is required`
  - `GET /detail` and `GET /en/detail` without `nid` returned `400` with `parameter: <nid> is required`
  - `GET /detail/extras?nid=177482` returned `401 Not authorized`
  - `GET /dcat.detail` without `nid` returned an HTML `500` Slim application error page
  - `GET /api/fetch-yaml/177482` returned JSON `success: true` but the payload contained a YAML parsing error because the upstream TDX doc URL resolved to HTML rather than a raw YAML document
- No public rate-limit policy, quota table, or retry-header contract was published on the reviewed Taiwan portal pages.

## Canonical endpoint inventory manually confirmed from the official site
1. `POST /api/front/dataset/simple-list`
2. `POST /api/front/dataset/options-list`
3. `GET /api/front/dataset/category-dataset/options-list`
4. `GET /api/front/dataset/dropdown`
5. `POST /api/front/dataset/changed/list`
6. `POST /api/front/dataset/list`
7. `POST /api/front/dataset/en/list`
8. `GET /api/front/dataset/detail`
9. `GET /api/front/dataset/en/detail`
10. `GET /api/front/dataset/detail/extras`
11. `GET /api/front/dataset/export`
12. `POST /api/front/dataset/search-export`
13. `GET /api/front/dataset/changed/export`
14. `GET /api/front/dataset/dcat.detail`
15. `GET /api/front/dataset/api/fetch-yaml/{id}`

## Additional official route observed during review
- `GET /api/front/ai-ready-data/detail/{nid}`
  - used by the live dataset detail page
  - returned a minimal JSON payload with `dataset_status` and `dataset_status_name`
  - noted here as an ancillary route and not counted in the `15` dataset-route inventory above

## Example live behaviors confirmed during manual review
- The live search page loaded `GET /api/front/dataset/category-dataset/options-list` and `POST /api/front/dataset/list` as part of the production UI.
- `GET /api/front/dataset/category-dataset/options-list` returned three top-level classes including `檔案資料` and `API服務`, with `API服務` using tid `43095`.
- `POST /api/front/dataset/list` with `category_dataset_tid=43095` returned `search_count` `78` and API-service datasets such as `177482 公共自行車租借站位資訊` and `177480 公共自行車即時車位資訊`.
- `POST /api/front/dataset/en/list` with the same filter returned translated titles such as `Public Bicycle Rental Station Information`.
- `POST /api/front/dataset/options-list` returned working option lists for `agency`, `file_format`, and `category`.
- `GET /api/front/dataset/dropdown?list_type=published&qs=公共自行車` returned matching dataset suggestions including `177482`.
- `GET /api/front/dataset/detail?nid=177482` returned the full dataset metadata record including agency info, license, update frequency, `api_doc_url`, and the note telling users to register on TDX and create an API key.
- `GET /api/front/dataset/en/detail?nid=177482` returned the English-translated version of the same catalog record.
- `GET /api/front/dataset/dcat.detail?nid=177482` returned a DCAT document with prefixes and dataset/catalog-record triples.
- `POST /api/front/dataset/changed/list` with `report_date=2026-05-01` returned `search_count` `579` changed datasets.
- `GET /api/front/dataset/export?format=csv` returned a CSV attachment named like `datagovtw_dataset_20260516.csv`.
- `POST /api/front/dataset/search-export` with the API-service filter returned a CSV attachment whose first rows included dataset `177482`.
- `GET /api/front/dataset/changed/export?format=csv&report_date=2026-05-01` returned a changed-datasets CSV attachment.

## fireROUTE integration notes
- Treat this provider as a catalog-metadata API for Taiwan’s data portal, not as a unified transport/data-service API itself.
- The portal’s own endpoints are useful for dataset discovery, filtering, exports, and metadata retrieval.
- For records in the `API服務` class, the actual usable upstream API often lives on another official domain and has its own auth, rate limits, and schemas; fireROUTE should preserve that distinction.
- `search-export` and `export` are convenient for bulk catalog pulls, while `detail` / `en/detail` / `dcat.detail` are the best per-dataset metadata routes.
- Do not assume `api/fetch-yaml/{id}` always returns a parsed spec; when the upstream `api_doc_url` is HTML rather than raw YAML/JSON, the endpoint may surface a parser error inside a nominally successful JSON envelope.
