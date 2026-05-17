# Open Government, Slovakia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-slovakia`
- Official docs/pages used:
  - `https://data.gov.sk/en/`
  - `https://data.slovensko.sk/`
  - `https://data.slovensko.sk/datasety`
  - `https://data.slovensko.sk/sparql`
  - `https://data.slovensko.sk/sparql-endpoint-url`
  - `https://data.slovensko.sk/cms/datasets`
  - `https://data.slovensko.sk/codelists?keys%5B%5D=publishers&keys%5B%5D=https:%2F%2Fdata.gov.sk%2Fset%2Fcodelist%2Fdataset-type&keys%5B%5D=http:%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Fdata-theme&keys%5B%5D=http:%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Ffile-type&keys%5B%5D=http:%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Ffrequency&keys%5B%5D=keywords&keys%5B%5D=http:%2F%2Fpublications.europa.eu%2Fresource%2Fauthority%2Flicence&keys%5B%5D=https:%2F%2Fdata.gov.sk%2Fset%2Fcodelist%2Fpersonal-data-occurence-type&keys%5B%5D=https:%2F%2Fdata.gov.sk%2Fset%2Fcodelist%2FCL000056`
  - `https://slovak-egov.atlassian.net/wiki/spaces/opendata/pages/20056044/Podpora+pre+data.slovensko.sk`
  - `https://slovak-egov.atlassian.net/wiki/spaces/opendata/pages/20054289/T+ma+Dotazovanie+metad+t+otvoren+ch+dajov+cez+SPARQL+Endpoint`
  - `https://slovak-egov.atlassian.net/wiki/spaces/opendata/pages/20054419/Poskytuje+port+l+data.slovensko.sk+API+na+strojov+z+skavanie+otvoren+ch+dajov`
- Current documented API host: `https://data.slovensko.sk`
- Current documented API path families:
  - `/api/sparql`
  - `/cms/datasets`
  - `/codelists`
  - `/sparql-endpoint-url`
- Auth model: no auth requirement was published or observed on the reviewed public routes
- Response formats: SPARQL metadata query endpoint plus public JSON support endpoints used by the portal UI
- Manually confirmed route count: `4`

## Official usage notes
- The assigned English landing page `https://data.gov.sk/en/` currently redirects to the main Slovak portal at `https://data.slovensko.sk/`.
- The reviewed official support documentation explicitly says the portal provides machine access through a SPARQL endpoint at `https://data.slovensko.sk/api/sparql?query={SPARQLQuery}`.
- The reviewed support documentation says the SPARQL endpoint exposes metadata according to `DCAT-AP-SK-3.0`.
- The live official `/sparql` page loads a helper endpoint at `/sparql-endpoint-url`, which returned the JSON string `"/api/sparql"` during this run.
- The live official `/datasety` page also called public JSON endpoints for dataset cards and code lists during this run.
- No official public rate-limit policy was published on the reviewed portal or support pages.

## Canonical endpoints confirmed from official docs and live official-site behavior
1. `GET /api/sparql`
   - Base URL: `https://data.slovensko.sk`
   - Purpose: query National Open Data Catalogue metadata through SPARQL
   - Official query parameters:
     - `query` - required URL-encoded SPARQL query string
   - Official docs example:
     - `https://data.slovensko.sk/api/sparql?query={SPARQLQuery}`
   - Official usage note:
     - metadata is provided according to `DCAT-AP-SK-3.0`

2. `GET /cms/datasets`
   - Base URL: `https://data.slovensko.sk`
   - Purpose: return the dataset-card feed used by the public `/datasety` page
   - Live confirmation:
     - returned JSON with top-level `items[]`
     - reviewed item fields included `id`, `datasetUri`, `created`, `updated`, `commentCount`, and `likeCount`
   - Query parameters:
     - none were present on the reviewed live request URL

3. `GET /codelists`
   - Base URL: `https://data.slovensko.sk`
   - Purpose: return code lists used to populate dataset-page filters
   - Live confirmation:
     - returned JSON arrays of code-list objects with `id`, `label`, and `values[]`
   - Query parameters observed on the official dataset page:
     - repeated `keys[]` parameters
   - Reviewed live call requested keys including:
     - `publishers`
     - dataset type code list
     - EU data-theme authority list
     - EU file-type authority list
     - EU frequency authority list
     - `keywords`
     - EU licence authority list
     - Slovak personal-data-occurrence code list
     - Slovak `CL000056` code list

4. `GET /sparql-endpoint-url`
   - Base URL: `https://data.slovensko.sk`
   - Purpose: return the SPARQL endpoint path consumed by the public SPARQL UI
   - Live confirmation:
     - returned the JSON string `"/api/sparql"`

## Additional observed non-canonical portal call
- The public `/datasety` page requested `https://data.slovensko.sk/publishers/search` during this run.
- A direct browser GET to that URL returned HTTP `405`, and no official page reviewed in this run documented the allowed method or request schema.
- Because the method/parameters were not confirmed from official documentation, this route is intentionally excluded from the canonical count above.

## Pagination, filtering, and format notes
- The official SPARQL docs only show the `query` parameter and do not publish a separate pagination mechanism; pagination must therefore be handled inside the SPARQL query itself when needed.
- The live `/codelists` route uses repeated `keys[]` query parameters to request multiple filter vocabularies in one call.
- The reviewed live `/cms/datasets` response exposed an `items[]` array but did not expose public pagination fields in the returned body.
- The reviewed portal pages did not publish a formal response-format matrix for `/api/sparql`; the support pages focus on how to submit the query rather than on content negotiation details.

## Error, auth, and access notes
- No API key, OAuth flow, or login requirement was published or observed for the four canonical routes documented above.
- The reviewed support pages did not publish a structured HTTP error catalogue.
- A direct GET to `/publishers/search` returned HTTP `405`, which is the only explicit live error behavior observed during this run.
- No public rate-limit numbers or retry guidance were published on the reviewed pages.

## fireROUTE normalization notes
- Treat `https://data.slovensko.sk` as the canonical API host.
- Model `/api/sparql` as the official documented metadata-query surface.
- Treat `/cms/datasets`, `/codelists`, and `/sparql-endpoint-url` as public portal-support JSON endpoints confirmed from live official-site behavior.
- Do not assume undocumented internal portal calls such as `/publishers/search` are stable until the provider publishes method- and parameter-level documentation for them.