# Open Government, UK

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-uk`
- Official docs/pages used:
  - `https://www.data.gov.uk/data-manual/apis-and-technical-guidance`
  - `https://www.api.gov.uk/`
  - `https://www.data.gov.uk/search`
  - `https://www.data.gov.uk/search?q=education`
  - `https://www.data.gov.uk/search.html?q=education&page=2`
  - `https://ckan.publishing.service.gov.uk/api/3/action/status_show`
- Current documented provider host: `https://www.data.gov.uk`
- Current documented route families:
  - `/search`
  - `/search.html`
- Auth model: no API key or login requirement was published for the reviewed public directory-search routes
- Response format confirmed in this run: HTML
- Manually confirmed route count: `2`

## Official usage notes
- The official `APIs and technical guidance` page is a short guidance page, not a route reference, but it does point users to the public `Directory` and to `api.gov.uk`.
- The official `api.gov.uk` site is a catalogue of UK public-sector APIs and explicitly says listed APIs have their own licensing and access restrictions; it is not the route inventory for the `data.gov.uk` directory itself.
- The live `data.gov.uk` directory search is publicly readable without login and exposes a stable GET-based query contract through its HTML forms and pagination links.
- A direct check of `https://ckan.publishing.service.gov.uk/api/3/action/status_show` returned `403 Forbidden`, so generic CKAN assumptions should not replace the officially visible directory-search surface documented below.

## Canonical endpoints confirmed from the official site
1. `GET /search`
   - Base URL: `https://www.data.gov.uk`
   - Purpose: render the public directory search UI and first-page search results.
   - Query parameters confirmed from the live official search form:
     - `q` - free-text search query
     - `filters[publisher]` - publisher filter
     - `filters[topic]` - topic filter
     - `filters[format]` - format filter
     - `filters[licence_code]` - licence filter; the reviewed checkbox value was `uk-ogl`
     - `sort` - result ordering; reviewed values were `best` and `recent`
   - Live confirmation:
     - `https://www.data.gov.uk/search` loaded as the official `Search directory - data.gov.uk` page
     - `https://www.data.gov.uk/search?q=education` loaded as `Results for "education" - data.gov.uk`
     - the reviewed search page reported `1,036 results found`
     - the live form action remained `https://www.data.gov.uk/search` with method `GET`

2. `GET /search.html`
   - Base URL: `https://www.data.gov.uk`
   - Purpose: render paginated search-result pages for the same directory search surface.
   - Query parameters confirmed from live pagination links and the shared search form contract:
     - `page` - page number
     - `q` - free-text search query
     - `filters[publisher]` - publisher filter
     - `filters[topic]` - topic filter
     - `filters[format]` - format filter
     - `filters[licence_code]` - licence filter
     - `sort` - result ordering
   - Live confirmation:
     - pagination links on the official search results page used URLs such as `https://www.data.gov.uk/search.html?page=2&q=education`
     - `https://www.data.gov.uk/search.html?q=education&page=2` loaded successfully and returned the second page of official results
     - the paginated route used the same page title format, `Results for "education" - data.gov.uk`

## Pagination, filtering, and format notes
- The documented provider-owned surface is HTML-first rather than JSON or OpenAPI-based.
- Filtering is query-string based through `filters[publisher]`, `filters[topic]`, `filters[format]`, and `filters[licence_code]`.
- Sorting is query-string based through `sort`, with reviewed values `best` and `recent`.
- Pagination is page-based through `page=` on `/search.html` links.
- The official pages reviewed in this run did not publish a separate machine-readable route contract for the directory itself.

## Error, auth, and access notes
- No public API key, OAuth, or registration step was required for the documented directory-search routes.
- No public rate-limit or quota policy was published on the reviewed official pages.
- The only reviewed machine-oriented endpoint outside the directory UI, `https://ckan.publishing.service.gov.uk/api/3/action/status_show`, returned `403 Forbidden` during this run.
- No structured error schema was published for the HTML directory routes on the reviewed official pages.

## fireROUTE normalization notes
- Treat `https://www.data.gov.uk` as the canonical provider host for this record.
- Model this provider around the official directory-search routes that are actually reachable on the provider host, not around undocumented generic CKAN expectations.
- Keep `/search` and `/search.html` as HTML catalogue/search surfaces.
- Do not expand APIs listed on `api.gov.uk` into this provider's route count; those belong to separate providers under their own official documentation.
