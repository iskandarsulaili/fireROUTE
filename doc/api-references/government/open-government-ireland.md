# Open Government, Ireland

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-ireland`
- Official docs/pages used:
  - `https://data.gov.ie/`
  - `https://data.gov.ie/developers`
  - `https://data.gov.ie/developers_corner`
  - `https://data.gov.ie/api/3`
  - `https://data.gov.ie/api/3/action/status_show`
  - `https://data.gov.ie/api/3/action/help_show?name=package_list`
  - `https://data.gov.ie/api/3/action/help_show?name=tag_list`
  - `https://data.gov.ie/api/3/action/help_show?name=package_show`
  - `https://data.gov.ie/api/3/action/help_show?name=tag_show`
  - `https://data.gov.ie/api/3/action/help_show?name=package_search`
  - `https://data.gov.ie/api/3/action/help_show?name=resource_search`
- Current documented API host: `https://data.gov.ie`
- Current documented API path prefix: `/api/3/action`
- Auth model: no API key or login requirement was described for the reviewed public read routes
- Response format: JSON
- Manually confirmed route count: `6`

## Official usage notes
- The Developer Resources page says data.gov.ie is built using CKAN 2.9 and that the portal provides an API for retrieving datasets, groups, and other CKAN objects and for searching datasets.
- The same page says data and metadata published on data.gov.ie must be associated with at least the `CC-BY` licence, must be machine-readable and in open formats such as `CSV`, `JSON`, or `XML`, and must be compliant with `DCAT-AP`.
- The Developer's Corner page links official notebooks for CKAN API usage, data enrichment, combining multiple datasets, and publisher metadata analysis.
- A live `status_show` response confirmed the current CKAN version is `2.9.14` and that the site has extensions including `dcat`, `dcat_json_interface`, `datastore`, `datapusher`, `harvest`, `spatial_query`, `showcase`, and `fuseki`.
- The reviewed public pages did not publish a portal-specific rate-limit policy.

## Canonical endpoints confirmed from the official developer page and official live help pages
1. `GET /api/3/action/package_list`
   - Base URL: `https://data.gov.ie`
   - Purpose: return dataset/package names for the site
   - Parameters confirmed by the official live help page:
     - `limit` - optional page size
     - `offset` - optional page offset when `limit` is used

2. `GET /api/3/action/tag_list`
   - Base URL: `https://data.gov.ie`
   - Purpose: return site tags
   - Parameters confirmed by the official live help page:
     - `query` - optional tag-name search substring
     - `vocabulary_id` - optional vocabulary id or name
     - `all_fields` - optional boolean to return full tag dictionaries instead of tag names only

3. `GET /api/3/action/package_show`
   - Base URL: `https://data.gov.ie`
   - Purpose: return metadata for one dataset and its resources
   - Parameters confirmed by the official live help page:
     - `id` - required dataset id or dataset name
     - `use_default_schema` - optional boolean
     - `include_tracking` - optional boolean
   - Official developer-page example:
     - `data.gov.ie/api/3/action/package_show?id=the-walled-towns-of-ireland`

4. `GET /api/3/action/tag_show`
   - Base URL: `https://data.gov.ie`
   - Purpose: return details for one tag and optionally the datasets using it
   - Parameters confirmed by the official live help page:
     - `id` - required tag id or tag name
     - `vocabulary_id` - optional vocabulary id or name
     - `include_datasets` - optional boolean; help text notes dataset inclusion is capped at `1000`
   - Official developer-page example:
     - `data.gov.ie/api/3/action/tag_show?id=marine`

5. `GET /api/3/action/package_search`
   - Base URL: `https://data.gov.ie`
   - Purpose: search datasets using CKAN's Solr-backed search API
   - Parameters confirmed by the official live help page:
     - `q` - optional search query, default `*:*`
     - `fq` - optional filter query string
     - `fq_list` - optional list of filter queries
     - `sort` - optional sort string, default `score desc, metadata_modified desc`
     - `rows` - optional result limit, default `10`, upper limit `1000` unless site config changes it
     - `start` - optional result offset
     - `facet` - optional faceting toggle
     - `facet.mincount` - optional facet minimum count
     - `facet.limit` - optional facet value limit, default `50`
     - `facet.field` - optional list of facet fields
     - `include_drafts` - optional boolean
     - `include_private` - optional boolean
     - `use_default_schema` - optional boolean
     - advanced Solr parameters also explicitly listed: `qf`, `wt`, `bf`, `boost`, `tie`, `defType`, `mm`
   - Official developer-page example:
     - `data.gov.ie/api/3/action/package_search?q=museum`

6. `GET /api/3/action/resource_search`
   - Base URL: `https://data.gov.ie`
   - Purpose: search resources rather than packages
   - Parameters confirmed by the official live help page:
     - `query` - required search expression of the form `{field}:{term}` or a list of such expressions
     - `fields` - deprecated
     - `order_by` - optional result ordering field
     - `offset` - optional result offset
     - `limit` - optional result limit
   - Official developer-page example:
     - `data.gov.ie/api/3/action/resource_search?query=name:The%20Walled%20Towns%20of%20Ireland`

## Pagination, filtering, and format notes
- The action API is JSON-based on all reviewed public routes.
- `package_list` paginates with `limit` and `offset`.
- `package_search` defaults to `10` rows and the official live help page states an upper limit of `1000` unless site configuration overrides it.
- `package_search` exposes facet controls and returns `count`, `results`, and `search_facets` according to the official live help text.
- `resource_search` also paginates with `offset` and `limit`.
- `tag_show` can include dataset details, but the official help text warns that this inclusion is capped at `1000` datasets.

## Error, auth, and access notes
- Public read access was available on the reviewed routes without an API key.
- The live action API uses CKAN-style JSON envelopes containing keys such as `help`, `success`, `result`, and `error`.
- A live request to `help_show` without the required `name` parameter returned a JSON error envelope containing `success: false` and `__type: "Validation Error"`.
- The reviewed public pages did not publish numeric rate limits, retry guidance, or a portal-specific HTTP error catalogue.

## Additional official developer surfaces not counted as canonical routes
- The Developer's Corner page links Google Colab notebooks and GitHub source for practical API tutorials.
- The same page exposes a SPARQL endpoint through Sparklis at `https://data.gov.ie/sparklis/?endpoint=https://data.gov.ie/fuseki/5bfa5172-7151-44b5-807f-2b4f86e46406/sparql`.
- The page also links Apache Superset dashboards at `https://superset.data.gov.ie/superset/welcome/`.
- These were not added to the canonical route count because they are adjacent tooling surfaces rather than the CKAN action API routes explicitly catalogued on the Developer Resources page.

## fireROUTE normalization notes
- Treat `https://data.gov.ie` as the canonical host and preserve the `/api/3/action` prefix exactly.
- Keep the provider normalized around the six read routes explicitly demonstrated on the official Developer Resources page.
- Preserve CKAN-style query semantics for search and pagination rather than trying to flatten them into a simpler REST collection model.
- Treat the linked SPARQL and Superset surfaces as separate integration candidates, not as substitutes for the core CKAN action API.