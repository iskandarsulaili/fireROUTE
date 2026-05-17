# BCLaws

## Provider metadata
- Category: `Government`
- Provider slug: `bclaws`
- Official docs/pages used:
  - `https://www.bclaws.gov.bc.ca/civix/template/complete/api/index.html` (official CiviX Server API overview)
  - `https://www.bclaws.gov.bc.ca/civix/template/complete/api/API_content.html` (official Content API page)
  - `https://www.bclaws.gov.bc.ca/civix/template/complete/api/API_document.html` (official Document API page)
  - `https://www.bclaws.gov.bc.ca/civix/template/complete/api/API_search.html` (official Search API page)
- Current public API base URL: `https://www.bclaws.gov.bc.ca/civix`
- Auth model: no authentication documented on the official API pages reviewed
- Response format: XML is the primary documented format; document retrieval can also return HTML-style rendered content unless `/xml` is requested
- Rate-limit notes: no global quota is published, but the Search API imposes documented request-size constraints on search window and fragment parameters
- Manually confirmed route count: `10`

## Access notes
- The official documentation describes the BCLaws service as the `CiviX Server API`.
- The API covers three related surfaces: content navigation, document retrieval, and full-text search.
- The service is self-describing: content metadata retrieved from the Content API supplies the identifiers needed for Document API requests.
- The official docs highlight at least two aspects: `complete` for provincial statutes/regulations and `coa` for Abbotsford bylaws.

## Canonical endpoints
1. `GET /content/{aspect}`
   - Return the top-level content metadata for an aspect such as `complete` or `coa`.
2. `GET /content/{aspect}/{content_path...}`
   - Traverse nested content directories and indexes by appending returned `CIVIX_DOCUMENT_ID` values.
3. `GET /document/id/{aspect}/{index_id}/{document_id}`
   - Retrieve a document in the default rendered form.
4. `GET /document/id/{aspect}/{index_id}/{document_id}/xml`
   - Retrieve the raw XML document.
5. `GET /document/id/{aspect}/{index_id}/{document_id}/xpath/{xpath}`
   - Apply XPath selection against the document response.
6. `GET /document/id/{aspect}/{index_id}/{document_id}/xml/xpath/{xpath}`
   - Apply XPath selection and return raw XML.
7. `GET /document/id/{aspect}/{index_id}/{document_id}/search/{query}`
   - Search for a term within a specific document.
8. `GET /document/id/{aspect}/{index_id}/{document_id}/search/{query}/xpath/{xpath}`
   - Search within a document and filter the result with XPath.
9. `GET /document/id/{aspect}/{index_id}/{document_id}/xml/search/{query}/xpath/{xpath}`
   - Search within a document, apply XPath, and return XML.
10. `GET /search/{aspect}/fullsearch`
    - Search the repository across an aspect using query parameters.

## Parameters
### Content API
- `aspect` - content grouping such as `complete` or `coa`
- `content_path...` - one or more appended `CIVIX_DOCUMENT_ID` path segments used to navigate into indexes or directories returned by earlier content calls

### Document API
- `aspect` - content grouping
- `index_id` - index identifier discovered from content metadata
- `document_id` - document identifier discovered from content metadata
- `xpath` - XPath expression to filter the returned document content
- `query` - search term used in document-scoped search routes

### Search API
The official Search API page documents these query parameters for `GET /search/{aspect}/fullsearch`:
- `q` - query term to search for
- `s` - first hit to return; official docs say the difference between first and last hit cannot exceed `100`
- `e` - last hit to return; official docs say the difference between first and last hit cannot exceed `100`
- `nFrag` - number of fragment snippets to return; must be less than `10`
- `lFrag` - fragment length; must be less than `200`

### Additional request notes
- The documentation also shows optional `xsl` query usage on browsed HTML pages, but this is part of rendering/template behavior rather than the core XML data routes counted here.

## Response notes
### Content API
The official Content API examples show top-level XML records containing fields such as:
- `CIVIX_DOCUMENT_TITLE`
- `CIVIX_DOCUMENT_ID`
- `CIVIX_INDEX_ID`
- `CIVIX_DOCUMENT_TYPE`
- `CIVIX_INDEX_FIELDS`
- `CIVIX_DOCUMENT_PARENT`
- `CIVIX_DOCUMENT_ANCESTORS`
- `CIVIX_DOCUMENT_VISIBLE`

The docs explain that when `CIVIX_DOCUMENT_TYPE` is `index` or `dir`, callers can keep navigating by appending `CIVIX_DOCUMENT_ID` to the URL.

### Document API
The official examples show legislation XML with schema-rich fields such as:
- document root types like `act:act`
- `act:title`
- `act:chapter`
- `act:yearenacted`
- `act:currency`
- `act:content`
- nested `bcl:part`, `bcl:section`, `bcl:marginalnote`, `bcl:num`, `bcl:text`, and `bcl:definition`

### Search API
The official fullsearch example response shows:
- `<results query="...">`
- repeated `<doc hits="...">` elements
- metadata including `CIVIX_DOCUMENT_TITLE`, `CIVIX_DOCUMENT_LOC`, `CIVIX_DOCUMENT_ID`, `CIVIX_INDEX_ID`, `CIVIX_DOCUMENT_TYPE`, and ancestry fields
- one or more `<frag>` snippet elements with hit highlighting

## Usage notes
- Start with `/content/{aspect}` to discover navigable indexes and document IDs before using document retrieval routes.
- Use `/document/.../xml` when you need the raw legislation XML rather than rendered content.
- The docs explicitly support XPath-based extraction against document content.
- For very large works, the docs describe `multi documents`, where a table-of-contents document points to split sections while a separate ID can return the full XML document.
- The Search API's parameter limits are performance-related and should be preserved exactly in fireROUTE integrations.

## Errors and constraints
- The reviewed pages did not publish a shared HTTP status-code table.
- The Search API page does publish explicit performance constraints:
  - `e - s` must not exceed `100`
  - `nFrag` must be less than `10`
  - `lFrag` must be less than `200`
- The Document API page notes that some XML schemas were still being finalized at the time of publication and that not all documents may validate.

## fireROUTE normalization notes
- Normalize this provider as an XML-first content/document/search API rooted at `https://www.bclaws.gov.bc.ca/civix`.
- Preserve the official distinction between content discovery, document retrieval, and full-text search.
- Treat XPath as a first-class route modifier rather than as an afterthought; it is explicitly documented as part of the official API surface.
- Use content-derived identifiers (`aspect`, `index_id`, `document_id`) instead of inventing synthetic IDs.
