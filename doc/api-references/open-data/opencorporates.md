# OpenCorporates

## Provider metadata
- Category: `Open Data`
- Provider slug: `opencorporates`
- Official docs/pages used:
  - `https://api.opencorporates.com/documentation/API-Reference` (official REST API reference, version `0.4.8`)
  - `https://api.opencorporates.com/documentation/Open-Refine-Reconciliation-API` (official alternative API page linked from the docs)
- Current public API host: `https://api.opencorporates.com`
- Versioning note: the reference recommends pinning a version in requests; the reviewed examples use the versioned base `https://api.opencorporates.com/v0.4`
- Auth model: API token required (`api_token` query parameter)
- Methods confirmed from the official docs: `GET`
- Response formats officially documented: JSON by default, optional XML via `format=xml`
- Rate-limit notes: usage limits depend on account type and plan; the docs direct clients to `GET /account_status` to monitor daily and monthly usage. Daily usage resets at midnight UTC; monthly usage resets at midnight UTC on the last day of the month.
- Manually confirmed route count: `17`

## Canonical endpoints
1. `GET /account_status`
   - Returns current API usage / account status information for the supplied token.
2. `GET /versions`
   - Returns API version information.
3. `GET /companies/{jurisdiction_code}/{company_number}`
   - Company detail lookup.
4. `GET /companies/search`
   - Search companies.
5. `GET /companies/{jurisdiction_code}/{company_number}/filings`
   - Company filings collection.
6. `GET /companies/{jurisdiction_code}/{company_number}/statements`
   - Company statements collection.
7. `GET /companies/{jurisdiction_code}/{company_number}/data`
   - Company data / provenance-oriented datum collection.
8. `GET /officers/search`
   - Search officers.
9. `GET /data/{datum_id}`
   - Retrieve a specific datum record.
10. `GET /statements/{statement_type}/search`
   - Search statements within a statement family such as `gazette_notices`, `control_statements`, `alternate_registrations`, `subsequent_registrations`, or `trademark_registrations`.
11. `GET /statements/{statement_id}`
   - Retrieve a specific statement.
12. `GET /placeholders/{placeholder_id}/statements`
   - Statements attached to a placeholder entity.
13. `GET /jurisdictions`
   - List jurisdictions.
14. `GET /jurisdictions/match`
   - Match a free-text jurisdiction query to canonical jurisdictions.
15. `GET /industry_codes`
   - List available industry-code schemes.
16. `GET /industry_codes/{code_scheme}`
   - Retrieve one industry-code scheme.
17. `GET /industry_codes/{code_scheme}/{code}`
   - Retrieve a specific code within a scheme.

## Core parameters and path variables
### Auth / format
- `api_token` - required API credential.
- `format` - defaults to JSON; XML is documented as an alternative.

### Pagination
- `page` - page number.
- `per_page` - page size. The docs state the page parameter is limited to `100` to keep the API responsive.

### Common search / filter parameters seen in official examples
- `q` - free-text company or officer query.
- `jurisdiction_code`
- `current_status`
- `inactive`
- `order`
- `incorporation_date`
- `updated_at`
- `fields`
- `sparse`
- `industry_codes`
- `related_jurisdiction_code`

### Path variables
- `{jurisdiction_code}` - jurisdiction identifier such as `gb` or `nl`.
- `{company_number}` - company identifier within the jurisdiction.
- `{datum_id}` - datum identifier.
- `{statement_type}` - statement family slug.
- `{statement_id}` - statement identifier.
- `{placeholder_id}` - placeholder identifier.
- `{code_scheme}` - industry-code taxonomy name.
- `{code}` - code within a taxonomy.

## Response and data notes
- The docs describe this as the main REST API and say it returns all information available on the OpenCorporates website as data.
- JSON is the default format.
- XML is supported through the `format=xml` parameter.
- The company examples show a top-level envelope containing `api_version` and `results`.
- OpenCorporates emphasizes provenance: company records expose source metadata and separate `data` and `statements` concepts.

## Error / reliability notes
- The reviewed reference does not publish a compact HTTP error-code table on the inspected page.
- The docs recommend using `GET /account_status` to track daily/monthly allowance and avoid running out of calls.
- The reference explicitly recommends pinning a version in requests instead of relying on an unversioned default.

## Usage notes
- Prefer `https://api.opencorporates.com/v0.4/...` for stable integrations; the docs say HTTPS should be used even though HTTP still exists.
- Search endpoints are query-heavy and intended for filtering, ranking, and sparse-field responses.
- Company detail, filings, statements, and data are separate resource trees; do not collapse them into one route in fireROUTE.
- The official docs also link an Open Refine reconciliation API, but it is distinct from the main REST API documented here.

## fireROUTE normalization notes
- Normalize this provider around the versioned host `https://api.opencorporates.com/v0.4`.
- Preserve `api_token` auth as a required query credential.
- Keep company lookup, company search, officer search, provenance/data, statements, jurisdiction matching, and taxonomy lookup as separate route families.
- Prefer JSON by default; expose XML only as an opt-in format parameter.
