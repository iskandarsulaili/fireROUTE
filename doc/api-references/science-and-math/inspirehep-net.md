# inspirehep.net

## Provider metadata
- Category: `Science & Math`
- Provider slug: `inspirehep-net`
- Description: `High Energy Physics information system`
- Official docs/pages used:
  - `https://github.com/inspirehep/rest-api-doc`
  - `https://raw.githubusercontent.com/inspirehep/rest-api-doc/master/README.md` (same official repository content, reviewed in-browser for the full route and parameter details)
- Current public API base URL: `https://inspirehep.net/api`
- Auth model: no authentication documented for the reviewed read APIs or bibliography-generator route
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: `JSON`, `json-expanded`, `BibTeX`, `LaTeX (EU)`, `LaTeX (US)`, `CV HTML`
- Rate limits: `15 requests per 5 seconds per IP`; rate-limit responses return HTTP `429`
- Manually confirmed route count: `3`

## API shape and behavior
- The official docs say most website pages have a corresponding API representation by prefixing the website path with `/api/`.
- Current record access is read-only and uses `GET`.
- The API returns JSON by default.
- Literature records can also be serialized in alternate citation/export formats.
- The bibliography generator is a separate `POST` workflow that accepts an uploaded TeX file and returns a generated bibliography download URL.

## Canonical endpoints
1. `GET /api/{identifier-type}/{identifier-value}`
   - Retrieve one record by internal or external identifier.
2. `GET /api/{record-type}`
   - Search/list records of a given type using query-string parameters.
3. `POST /api/bibliography-generator`
   - Upload a TeX file and generate bibliography output; requires the `format` request argument.

## Path and query conventions

### `GET /api/{identifier-type}/{identifier-value}`
- Internal identifier types documented:
  - `literature`
  - `authors`
  - `institutions`
  - `conferences`
  - `seminars`
  - `journals`
  - `jobs`
  - `experiments`
  - `data`
- External identifier types documented:
  - `doi`
  - `arxiv`
  - `orcid`
- Example docs URLs:
  - `/api/literature/451647`
  - `/api/conferences/1642486`
  - `/api/orcid/0000-0002-9079-593X`

### `GET /api/{record-type}`
- Record types documented for search/listing:
  - `literature`
  - `authors`
  - `institutions`
  - `conferences`
  - `seminars`
  - `journals`
  - `jobs`
  - `experiments`
  - `data`
- Shared query parameters:
  - `q` - search query
  - `sort` - sort order
  - `size` - number of results per page
  - `page` - page number
  - `fields` - comma-separated metadata fields to return
- Additional type-specific facet filters are also supported and behave like the website filters.

### `POST /api/bibliography-generator`
- Required request argument:
  - `format` = `bibtex`, `latex_eu`, or `latex_us`
- Required body shape:
  - form-encoded/multipart body containing one `file` field with the uploaded TeX file
- Response shape:
  - JSON object with `data.download_url` and `data.errors`

## Pagination and response notes
- Search responses are paginated.
- Default page size: `10` results.
- `page` selects the results page.
- `size` changes page size.
- Maximum `size`: `1000`; larger values return HTTP `400`.
- The docs also note a current technical ceiling of `10000` retrievable search results for a single query.
- Search responses include:
  - `hits.total`
  - `hits.hits`
  - `links`
- The `links.next` URL can be followed to fetch the next results page.
- Single-record JSON responses include:
  - `id`
  - `created`
  - `updated`
  - `links`
  - `metadata`

## Format notes
- Default format is JSON.
- Alternative formats for literature records are available via either:
  - `?format={format-name}` query parameter, or
  - `Accept` header content negotiation.
- Documented literature formats:
  - `json`
  - `json-expanded`
  - `bibtex`
  - `latex-eu`
  - `latex-us`
  - `cv`

## Search and filtering notes
- Literature search uses the provider's historical INSPIRE/SPIRES-style query syntax, with field-path searching also supported.
- Non-literature record types use Elasticsearch query-string syntax.
- Metadata filtering is available only on search responses, not direct single-record fetches.
- The `fields` parameter accepts comma-separated metadata paths such as `titles,authors.full_name,authors.affiliations.record`.

## Sort notes
- Default behavior depends on whether `q` is present:
  - without `q`: most recent first
  - with `q`: most relevant first
- Documented explicit sort options include:
  - literature: `mostrecent`, `mostcited`
  - jobs: `mostrecent`, `deadline`
  - conferences: `dateasc`, `datedesc`
  - seminars: `dateasc`, `datedesc`

## Error notes
- `404` when a record cannot be found.
- `429` when the per-IP rate limit is exceeded.
- `400` when invalid pagination is used, including `size > 1000`.
- The docs do not publish a richer provider-specific error schema beyond those documented status behaviors.

## Important usage notes
- Most website paths map directly to API paths by prefixing `/api/`.
- Many examples in the official docs contain spaces in query strings for readability; real requests often need URL encoding.
- The docs explicitly warn against relying on non-schema metadata fields returned in search hits, except for the few documented exceptions such as `earliest_date` and citation counts on literature search results.
- The bibliography generator is not a general JSON search route; it is a file-upload workflow with a generated-download result.

## fireROUTE normalization notes
- Normalize on `https://inspirehep.net/api`.
- Treat the provider as a compact three-route HTTP surface: record lookup, record search, and bibliography generation.
- Preserve parameter names exactly, especially `q`, `sort`, `size`, `page`, `fields`, and `format`.
- Expose rate-limit behavior in adapters because the official docs publish a concrete `15 requests / 5 seconds / IP` quota.
