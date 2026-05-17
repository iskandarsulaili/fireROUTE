# City, Gdynia

## Provider metadata
- Category: `Government`
- Provider slug: `city-gdynia`
- Official docs/pages used:
  - `https://otwartedane.gdynia.pl/en/api_doc.html` (official API documentation page)
  - `https://otwartedane.gdynia.pl/api/3/action/help_show?name=datastore_search` (official CKAN action help page linked by the API docs)
- Current public API base URL: `https://otwartedane.gdynia.pl/api/action`
- Related documentation base URL: `https://otwartedane.gdynia.pl/api/3/action`
- Auth model: no authentication is documented for the public open-data route; the official CKAN help notes that private CKAN DataStore resources require appropriate authorization
- Response format: JSON for the documented API route; the portal also publishes dataset downloads in CSV and JSON formats
- Rate limits: no public rate-limit policy was exposed on the official pages reviewed
- Manually confirmed route count: `1`

## Access notes
- The official English API page documents one concrete API action for public tabular access: `datastore_search`.
- The page also shows JSON examples whose pagination links point to `/api/action/datastore_search`, while the linked CKAN help action is served under `/api/3/action/help_show`.
- The official examples still include historical `185.53.98.141` hostnames in embedded snippets, but the live portal is available at `https://otwartedane.gdynia.pl`; use the portal host as canonical.

## Canonical endpoint
1. `GET /api/action/datastore_search`
   - Official purpose: search and retrieve records from a DataStore resource
   - Required identifier: `resource_id` (resource UUID or alias)
   - Pagination is exposed through `offset` and response `_links.next`

## Parameters
### `GET /api/action/datastore_search`
The official API page and linked CKAN help page document these parameters:
- `resource_id` - required resource identifier or alias
- `filters` - dictionary of matching conditions, for example `{"year": 2015}`
- `q` - full-text query; may be a string across all fields or a dictionary keyed by field name
- `distinct` - boolean; when true, returns only unique rows; default `false`
- `plain` - boolean controlling plain-text full-text search behavior; default `true`
- `language` - language of the full-text query; default `english`
- `limit` - maximum number of rows to return; default `100`
- `offset` - row offset for pagination
- `fields` - list of fields to return, or comma-separated string
- `sort` - comma-separated field names with ordering, for example `data_value asc`

## Response notes
### Documented response envelope
The official CKAN help page describes the result as a dictionary containing:
- `fields` - column metadata
- `offset` - query offset value
- `limit` - query limit value
- `filters` - query filters
- `total` - total matching records
- `records` - list of matching rows

### Example fields visible on the official API page
The example response on the portal additionally shows:
- `help`
- `success`
- `result.resource_id`
- `result.fields[]`
- `result.records[]`
- `result._links.start`
- `result._links.next`
- `result.total`

## Error notes
- The reviewed official pages do not publish a shared HTTP error table or numeric rate-limit headers.
- The CKAN help text notes that private DataStore resources can only be read by callers with access to the corresponding CKAN resource and appropriate authorization.

## Usage notes
- The public API documentation for this provider is narrowly scoped: it documents record retrieval through a CKAN DataStore search action rather than a broad multi-endpoint REST surface.
- `resource_id` values are dataset-resource identifiers; callers typically discover them from dataset pages before using `datastore_search`.
- For large result sets, follow the response `_links.next` value or increase `offset` manually.
- The portal separately exposes non-API dataset downloads as CSV and JSON files; those are not counted here as canonical API routes.

## fireROUTE normalization notes
- Normalize this provider to a single public read operation rooted at `GET /api/action/datastore_search`.
- Treat `resource_id` as the primary dataset selector and preserve the CKAN-style query parameters verbatim.
- Do not promote the `help_show` action to a data route; it is documentation/discovery support, not the core dataset retrieval operation.
