# Census.gov

## Provider metadata
- Category: `Government`
- Provider slug: `census-gov`
- Official docs/pages used:
  - `https://www.census.gov/data/developers/data-sets.html` (available datasets catalog)
  - `https://www.census.gov/data/developers/about.html` (developer overview)
  - `https://www.census.gov/data/developers/geography.html` (geography predicates)
  - `https://www.census.gov/data/developers/guidance/api-user-guide.Query_Limits.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/guidance/api-user-guide.API_Key.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/guidance/api-user-guide.Available_Data.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/guidance/api-user-guide.Core_Concepts.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/guidance/api-user-guide.Example_API_Queries.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/guidance/api-user-guide.Ucgid_Predicate.html#list-tab-559651575`
  - `https://www.census.gov/data/developers/updates/new-discovery-tool.html` (machine-readable discovery service)
- Current public API base URL: `https://api.census.gov`
- Auth model: API key required on all Census Data API queries and on discovery-tool metadata pages
- Response formats documented: JSON, XML, HTML metadata pages; dataset query responses are typically returned as JSON arrays
- Rate/query limits explicitly documented:
  - all queries now require `key`
  - up to `50` variables per API query
- Manually confirmed route count: `8`

## Access and platform notes
- The Census Bureau developer site now states that **all queries to the Census Data API require an API key**.
- The developer overview says applications commonly combine three Census-owned services: the Census Data API, TIGERweb REST services, and the Geocoder REST services; this provider file focuses on the Census Data API routes documented on the assigned Census API pages.
- The available-datasets catalog is a dataset directory, not a single fixed schema. Most data calls are made against dataset-specific paths under `/data/{vintage}/{dataset}`.

## Canonical endpoints
1. `GET /data.html`
   - Discovery-tool root in HTML.
   - Requires `?key=...`.
2. `GET /data.xml`
   - Discovery-tool root in XML.
   - Requires `?key=...`.
3. `GET /data.json`
   - Discovery-tool root in JSON.
   - Requires `?key=...`.
4. `GET /data/{vintage}.html`
   - Discovery for all datasets within a single vintage/year, HTML form.
5. `GET /data/{vintage}.xml`
   - Discovery for all datasets within a single vintage/year, XML form.
6. `GET /data/{vintage}.json`
   - Discovery for all datasets within a single vintage/year, JSON form.
7. `GET /data/{vintage}/{dataset}`
   - Primary data-query route for aggregate datasets.
   - Official examples include paths such as `/data/2019/pep/charagegroups`, `/data/2014/pep/natstprc`, and `/data/2022/acs/acs1/profile`.
8. `GET /data/{vintage}/{dataset}/variables.html`
   - Dataset variable/metadata table used to discover available fields, required variables, and attribute variables.

## Core query parameters
### Shared discovery/data parameters
- `key` - required API key.

### Dataset query parameters on `GET /data/{vintage}/{dataset}`
- `get` - comma-separated list of variables to return.
- `for` - required geography selector in standard geography queries; examples include `state:*`, `state:06`, and `county:001`.
- `in` - qualifying geography filter used when a lower-level geography must be scoped inside a higher-level geography, e.g. `in=state:06`.
- dataset-specific predicates - the docs show categorical and filter predicates such as `HISP=2` and `DATE_=7`.
- `ucgid` - alternative geography selector for datasets that expose the Uniform Census Geography Identifier variable.

### `ucgid` notes
Official docs describe `ucgid` as useful when:
- requesting multiple geography levels in one query
- requesting collections of geographies not reachable with standard `for`/`in` predicates

Documented examples include:
- `&ucgid=0400000US24,0500000US24017`
- `&ucgid=pseudo(0400000US24$8600000)`
- `&ucgid=1600000US3651000`

## Geography usage notes
- The geography page says **every query must include a geography**.
- The API supports geography selection via FIPS and GNIS geography codes.
- Official examples:
  - `/data/2010/sf1?&key=...&get=P001001&for=state:06`
  - `/data/2010/sf1?&key=...&get=P001001&for=state:06,24`
  - `/data/2010/sf1?&key=...&get=P001001,NAME&for=county:001&in=state:06`

## Response and metadata notes
- Discovery root and vintage endpoints are explicitly published in HTML, XML, and JSON forms.
- The discovery-tool page says the JSON discovery output is based largely on the Open Project Data Common Core Metadata Schema, extended with Census-specific metadata.
- Dataset variable pages expose:
  - variable names
  - required-variable indicators
  - attribute relationships
  - labels and predicate metadata
- Dataset query responses are generally data rows keyed by the requested variables and geography fields.

## Error and usage notes
- The query-limits guide says searches missing required variables return an error.
- The developer pages used here do not publish a single global HTTP rate-limit table beyond the `50`-variables-per-query cap and the API-key requirement.
- Because the platform is dataset-specific, valid predicates and required fields vary by dataset; use the dataset discovery page and `variables.html` page before constructing a fireROUTE adapter.

## fireROUTE normalization notes
- Treat Census as a **dataset-platform provider** rather than a small fixed endpoint API.
- Normalize around:
  - discovery root (`/data.{format}`)
  - vintage discovery (`/data/{vintage}.{format}`)
  - dataset query (`/data/{vintage}/{dataset}`)
  - dataset variables metadata (`/data/{vintage}/{dataset}/variables.html`)
- Store geography logic separately from field-selection logic because `for`, `in`, and `ucgid` are central to successful requests.
