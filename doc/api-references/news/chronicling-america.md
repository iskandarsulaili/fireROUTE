# Chronicling America

## Overview
- Provider: Chronicling America
- Category: News
- Official docs URL from index: `http://chroniclingamerica.loc.gov/about/api/`
- Current official API docs: `https://www.loc.gov/apis/additional-apis/chronicling-america-api/`
- Base host: `https://www.loc.gov`
- Auth: none
- HTTPS: yes
- Response formats: JSON or YAML via the `fo` query parameter
- Pagination: `c` sets results per page, `sp` selects the page, and search responses include a `pagination` object with `next`, `previous`, `perpage`, `current`, and `total`
- Rate limits: no numeric cap published on the reviewed official pages; the official Chronicling America guide says no key is required and that rate limiting is strongly encouraged

## Confirmed endpoints

| Endpoint family | Method | Path | Notes |
|---|---|---|---|
| Sitewide search | GET | `/search/` | Search across loc.gov; use `fa=partof:chronicling america` to scope results to the collection. |
| Collections index | GET | `/collections/` | Returns the Library of Congress collection list in JSON/YAML. |
| Chronicling America collection | GET | `/collections/chronicling-america/` | Collection-scoped search/browse endpoint for Chronicling America. |
| Newspaper-format search | GET | `/newspapers/` | Format endpoint for newspaper items; supports the standard loc.gov query parameters. |
| Item metadata | GET | `/item/{item_id}/` | Detailed metadata for one item; official docs recommend relying on the full `id` URL from results when available. |
| Resource metadata | GET | `/resource/{resource_id}/` | Resource-level metadata for digitized units such as newspaper issues/editions, including page/segment context. |

## Parameters and request controls
- `fo=json|yaml`: selects the response format.
- `at=...`: selects or excludes response attributes. Supports comma-separated top-level fields, dot notation, indexed array access such as `at=results.0`, and exclusion via `at!=...`.
- `q=...`: keyword search over metadata and any available full text/OCR/transcripts.
- `fa=filter:value`: facet/filter syntax. Multiple filters can be joined with `|`. The reviewed docs specifically call out `partof` as especially useful for collection scoping, e.g. `fa=partof:chronicling america`.
- `c=...`: results per page. The documented default is `25`.
- `sp=...`: results page number. The first page is `sp=1`.
- `sb=...`: sort field. Documented options include `date`, `date_desc`, `title_s`, `title_s_desc`, `shelf_id`, and `shelf_id_desc`.

## Response, pagination, and format notes
- Search-style responses return `facets`, `pagination`, and `results`.
- The official response docs describe `pagination` with fields including `from`, `to`, `results`, `last`, `previous`, `next`, `perpage`, `perpage_options`, `of`, `current`, `page_list`, and `first`.
- The example pagination object on the official docs page shows per-page options of `25`, `50`, `100`, and `150`.
- Item responses include `cite_this`, `item`, and `resources`.
- Resource responses include `cite_this`, `item`, `page`, `resource`, `resources`, and `segments`.
- For newspapers specifically, the official docs say resources represent discrete digitized files such as editions/issues, while segments usually represent the pages of that issue.

## Important usage notes
- The official Chronicling America API page says the legacy dedicated Chronicling America API ended as a separate surface in 2025; the collection is now accessible exclusively via the loc.gov API.
- The official guide says access is public, no API key or special application is required, and rate limiting is strongly encouraged.
- The loc.gov endpoint documentation notes that some subsites and resources have not been migrated to the API, so some individual pages may still require ordinary page access rather than API retrieval.
- The item `id` values in search results may still use `http://` historically; the current live host is `https://www.loc.gov`.
- For fireROUTE, the two safest collection-specific entry points are `/collections/chronicling-america/` and `/search/` plus `fa=partof:chronicling america`.

## Errors and edge cases
- The reviewed official Chronicling America and loc.gov API pages did not publish a dedicated error-code table for this collection.
- Boundary pagination behavior is documented through the `pagination` object: `previous` is `null` on the first page and `next` is `null` on the final page.
- Legacy pre-2025 Chronicling America API references should be treated as historical, not current integration guidance.

## Integration notes for fireROUTE
- Model this provider as a collection on top of the broader loc.gov API, not as a standalone legacy API host.
- Preserve loc.gov-native query controls like `fa`, `q`, `c`, `sp`, `sb`, and `at` instead of flattening them away.
- Use resource endpoints when you need issue/page-level newspaper traversal; use collection/search endpoints when you need discovery.

## Route-count note
- The currently reviewed official documentation exposes `6` confirmed route families relevant to Chronicling America access through the loc.gov API.

## Sources inspected
- `http://chroniclingamerica.loc.gov/about/api/`
- `https://www.loc.gov/apis/additional-apis/chronicling-america-api/`
- `https://guides.loc.gov/chronicling-america/additional-features#s-lib-ctab-26634726-2`
- `https://www.loc.gov/apis/json-and-yaml/requests/endpoints/`
- `https://www.loc.gov/apis/json-and-yaml/requests/parameters/`
- `https://www.loc.gov/apis/json-and-yaml/responses/search-results/`
- `https://www.loc.gov/collections/chronicling-america/?fo=json`
