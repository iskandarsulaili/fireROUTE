# Open Government, Poland

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-poland`
- Official docs/pages used:
  - `https://dane.gov.pl/en`
  - `https://api.dane.gov.pl/doc`
  - `https://api.dane.gov.pl/spec/1.4`
  - official homepage links reviewed during this run:
    - `https://api.dane.gov.pl/doc`
    - `https://api.dane.gov.pl/1.4/doc?urls.primaryName=DANE.GOV.PL%20RDF%20API`
    - `https://dane.gov.pl/dcat-ap-pl/`
  - live API checks during this run:
    - `https://api.dane.gov.pl/institutions?page=1&per_page=1`
    - `https://api.dane.gov.pl/datasets?page=1&per_page=1`
    - `https://api.dane.gov.pl/resources?page=1&per_page=1`
    - `https://api.dane.gov.pl/search?q=powietrze&page=1&per_page=1`
    - `https://api.dane.gov.pl/showcases?page=1&per_page=1`
    - `https://api.dane.gov.pl/histories?page=1&per_page=1`
    - `https://api.dane.gov.pl/reports/brokenlinks`
    - `https://api.dane.gov.pl/resources/1203829/data?page=1&per_page=1`
- Current documented API host: `https://api.dane.gov.pl`
- Current documented API path prefix: `/`
- Auth model: no authentication scheme is defined in the reviewed OpenAPI spec; reviewed read requests succeeded anonymously
- Response format: JSON:API with `Content-Type: application/vnd.api+json` for API responses
- Manually confirmed canonical route count: `20`

## Official usage notes
- The official `dane.gov.pl` homepage links directly to `API Documentation` at `https://api.dane.gov.pl/doc`.
- The reviewed official OpenAPI document identifies this surface as `DANE.GOV.PL API` version `1.4`.
- The official API description says responses use JSON:API, support version negotiation through `X-API-VERSION`, and support translation through `Accept-Language` with `en` and `pl`.
- The official docs say clients can also force a version in the path; live response links during this run included versioned self/related URLs such as `https://api.dane.gov.pl/1.4/datasets/...`.
- No auth scheme, rate-limit policy, or quota header documentation was published in the reviewed main API spec.

## Canonical endpoints confirmed from the official OpenAPI document
1. `GET /institutions`
   - Purpose: list institutions/data providers
   - Key parameters:
     - headers: `X-API-VERSION`, `Accept-Language`
     - pagination: `page`, `per_page` (default `25`, max `100`)
     - filters/search: deep-object filters on fields such as `id`, `slug`, `city`, `regon`, `street`, `postal_code`, `email`, `type`, `tel`, `fax`, `website`, `title`, `description`
     - general query helpers: `q`, `sort`, `facet`, `include`
   - Live confirmation:
     - `institutions?page=1&per_page=1` returned JSON:API data plus `links.self`, `links.next`, and `links.last`

2. `GET /institutions/{id}`
   - Purpose: return one institution
   - Path parameters:
     - `id` - institution identifier or slug-form identifier from the official links
   - Notes:
     - response includes institution attributes plus relationships

3. `GET /institutions/{id}/datasets`
   - Purpose: list datasets published by one institution
   - Path parameters:
     - `id` - institution identifier
   - Key parameters:
     - standard headers plus list-style pagination/filter controls from the official spec

4. `GET /datasets`
   - Purpose: list datasets
   - Key parameters:
     - headers: `X-API-VERSION`, `Accept-Language`
     - pagination: `page`, `per_page` (default `25`, max `100`)
     - filters/search: `id`, `title`, `notes`, `category`, `categories`, `institution`, `tag`, `keyword`, `format`, `types`, `openness_score`, `resource`, `visualization_types`, `created`, `q`, `sort`, `facet`, `include`, `has_dynamic_data`, `has_high_value_data`, `has_high_value_data_from_ec_list`, `has_research_data`, `is_promoted`
   - Live confirmation:
     - `datasets?page=1&per_page=1` returned JSON:API data and pagination links

5. `GET /datasets/{id}`
   - Purpose: return one dataset
   - Path parameters:
     - `id` - dataset identifier

6. `GET /datasets/{id}/resources`
   - Purpose: return the resources belonging to one dataset
   - Path parameters:
     - `id` - dataset identifier

7. `GET /datasets/{id}/showcases`
   - Purpose: return showcases related to one dataset
   - Path parameters:
     - `id` - dataset identifier

8. `GET /resources`
   - Purpose: list resources
   - Key parameters:
     - headers: `X-API-VERSION`, `Accept-Language`
     - pagination: `page`, `per_page`
     - resource filters/search/sort controls as documented in the OpenAPI spec
   - Live confirmation:
     - `resources?page=1&per_page=1` returned resource records and pagination links

9. `GET /resources/{id}`
   - Purpose: return one resource
   - Path parameters:
     - `id` - resource identifier

10. `GET /dga-aggregated`
   - Purpose: return information about the aggregated DGA resource
   - Parameters:
     - standard headers documented in the spec

11. `GET /resources/{id}/data`
   - Purpose: return tabular rows for one resource
   - Path parameters:
     - `id` - resource identifier
   - Key parameters:
     - headers: `X-API-VERSION`, `Accept-Language`
     - pagination: `page`, `per_page`
     - row querying: `q`, `p`, `sort`, `sum`, `avg`
   - Live confirmation:
     - `resources/1203829/data?page=1&per_page=1` returned JSON:API metadata with `count`, `params`, and `path`

12. `GET /resources/{id}/data/{row_id}`
   - Purpose: return one row from a resource table
   - Path parameters:
     - `id` - resource identifier
     - `row_id` - row identifier
   - Live confirmation:
     - a reviewed request against an empty resource table returned a JSON:API `404 Not Found` error object, confirming the endpoint/error format

13. `GET /search`
   - Purpose: cross-portal search
   - Key parameters:
     - headers: `X-API-VERSION`, `Accept-Language`
     - pagination: `page`, `per_page`
     - search controls: `q`, `advanced`, `sort`, `facet`, `filtered_facet`
     - filters across multiple model types: `id`, `model`, `institution`, `category`, `categories`, `format`, `types`, `openness_score`, `visualization_types`, `date`, `institution_type`, `source`, `license_code`, `update_frequency`, `has_dynamic_data`, `has_high_value_data`, `has_high_value_data_from_ec_list`, `has_research_data`, `is_promoted`, `regions`, `showcase_category`, `showcase_types`, `showcase_platforms`, `language`, `contains_protected_data`
   - Live confirmation:
     - `search?q=powietrze&page=1&per_page=1` returned JSON:API search results with pagination links

14. `GET /showcases`
   - Purpose: list reuse/showcase entries
   - Key parameters:
     - standard headers plus pagination/filter controls from the official spec
   - Live confirmation:
     - `showcases?page=1&per_page=1` returned showcase entries with category and title attributes

15. `GET /showcases/{id}`
   - Purpose: return one showcase
   - Path parameters:
     - `id` - showcase identifier

16. `GET /histories`
   - Purpose: list history items
   - Key parameters:
     - standard headers plus pagination/filter controls from the official spec
   - Live confirmation:
     - `histories?page=1&per_page=1` returned history records with `action`, `change_timestamp`, and nested `difference` data

17. `GET /histories/{id}`
   - Purpose: return one history item
   - Path parameters:
     - `id` - history identifier

18. `GET /reports/brokenlinks`
   - Purpose: return broken-links report metadata
   - Parameters:
     - standard headers
   - Live confirmation:
     - returned `rows_count`, `update_date`, and downloadable file entries for `csv` and `xlsx`

19. `GET /reports/brokenlinks/data`
   - Purpose: return broken-links report data payload
   - Parameters:
     - standard headers plus report query controls from the official spec

20. `GET /reports/brokenlinks/{extension}`
   - Purpose: download the broken-links report file
   - Path parameters:
     - `extension` - required report file extension, officially `csv` or `xlsx`
   - Notes:
     - this is the file-download route paired with the report metadata endpoint

## Pagination, filtering, and format notes
- The official API description says all responses use JSON:API.
- Reviewed live responses returned `Content-Type: application/vnd.api+json`.
- Common collection routes use `page` and `per_page`; the spec says `page` defaults to `1`, `per_page` defaults to `25`, and maximum page size is `100`.
- Collection responses expose JSON:API pagination links such as `self`, `next`, and `last`.
- The spec heavily uses deep-object query filters for field-specific matching, including `term`, `terms`, comparison operators, text matching, and date/text search helpers depending on the field.
- `X-API-VERSION` can select the version in headers; the official docs say a version in the URL path takes precedence over the header.
- `Accept-Language` supports `en` and `pl`; the docs say `pl` is the default fallback.

## Error, auth, and access notes
- The official docs say the API uses standard HTTP status codes.
- The reviewed official error example uses a JSON body with `errors`, `description`, `code`, and `title`.
- A live request to `/resources/1203829/data/1` returned a JSON:API `404 Not Found` error object: `{"code":"404_not_found", ...}`.
- No authentication scheme was declared in the reviewed OpenAPI document, and reviewed read requests succeeded without credentials.
- No official rate-limit or throttling guidance was published in the reviewed spec or portal pages.

## fireROUTE integration notes
- Treat `https://api.dane.gov.pl` as the canonical API host for this provider.
- Preserve the distinction between catalogue entities (`institutions`, `datasets`, `resources`), content rows (`/resources/{id}/data`), cross-portal discovery (`/search`), reuse examples (`/showcases`), change history (`/histories`), and report download endpoints (`/reports/brokenlinks...`).
- Prefer setting `Accept: application/vnd.api+json` when building adapters for the JSON API routes.
- Support versioning via `X-API-VERSION: 1.4` and accept language control via `Accept-Language: en` or `pl`.
- Keep report download handling separate from JSON API parsing because `/reports/brokenlinks/{extension}` is a file route, not a standard entity payload.