# Federal Register

## Provider metadata
- Category: `Government`
- Provider slug: `federal-register`
- Assigned docs URL: `https://www.federalregister.gov/reader-aids/developer-resources/rest-api`
- Official docs/pages reviewed in this run:
  - `https://www.federalregister.gov/reader-aids/developer-resources/rest-api`
  - `https://www.federalregister.gov/api/v1`
  - `https://www.federalregister.gov/api/v1/documents`
  - `https://www.federalregister.gov/api/v1/documents/2026-09862`
  - `https://www.federalregister.gov/api/v1/agencies`
  - `https://www.federalregister.gov/api/v1/agencies/466`
  - `https://www.federalregister.gov/api/v1/public-inspection-documents`
  - `https://www.federalregister.gov/api/v1/public-inspection-documents/current`
  - `https://www.federalregister.gov/api/v1/public-inspection-documents/2026-09862`
- Current status after official review: `manually_documented`
- Current public API base URL: `https://www.federalregister.gov/api/v1`
- Authentication model: none required for the reviewed read routes
- Response format: JSON for successful API responses; HTML `404 Not Found` pages for missing resources and the bare `/api/v1` path
- Rate limits: no official rate-limit policy was exposed on the reviewed reachable pages in this run
- Pagination: page-based JSON pagination on collection routes with `count`, `total_pages`, `next_page_url`, and sometimes `previous_page_url`
- Error format: HTML `404 Not Found` pages were returned for the reviewed missing-resource checks
- Manually confirmed canonical route count: `7`

## What was confirmed from the official site
- The assigned documentation URL did not expose the route reference directly in this environment, but the live official API routes on `www.federalregister.gov` were reachable and inspectable.
- The bare API root `GET https://www.federalregister.gov/api/v1` returned the Federal Register HTML `404 Not Found` page, so the usable surface is route-specific rather than a browsable API index.
- Anonymous requests to the reviewed collection and detail routes returned live JSON directly from the official Federal Register host.
- The documents collection response included a provider-owned pagination envelope with keys `description`, `count`, `total_pages`, `next_page_url`, and `results`.
- The agency detail response exposed an official filter template in `recent_articles_url`, which confirmed real query usage on the documents collection: `conditions[agency_ids][]=466&order=newest`.
- The documents collection pagination links added `format=json` and `page=...` automatically in the returned `next_page_url`.
- A live query to `https://www.federalregister.gov/api/v1/documents?per_page=1&page=2&conditions%5Bagency_ids%5D%5B%5D=466&order=newest` still returned `20` results, so this run only treats `page`, `order`, `conditions[agency_ids][]`, and returned `format=json` links as confirmed pagination/filter evidence.

## Canonical base URL
- `https://www.federalregister.gov/api/v1`

## Confirmed route inventory

### 1) List published documents
- Method: `GET`
- Path: `/documents`
- Full URL example: `https://www.federalregister.gov/api/v1/documents`
- Auth: none observed
- Confirmed query parameters:
  - `page` — confirmed by the returned `next_page_url`
  - `format=json` — confirmed in the returned pagination URLs
  - `conditions[agency_ids][]` — confirmed by the official `recent_articles_url` embedded in agency detail payloads
  - `order` — confirmed by the official `recent_articles_url` embedded in agency detail payloads
- Response notes:
  - Returns JSON with collection metadata plus `results`
  - Observed envelope keys: `description`, `count`, `total_pages`, `next_page_url`, `results`
  - The live default response reviewed in this run contained `20` results on the page

### 2) Get one published document by document number
- Method: `GET`
- Path: `/documents/{document_number}`
- Full URL example: `https://www.federalregister.gov/api/v1/documents/2026-09862`
- Auth: none observed
- Path parameter:
  - `document_number` — Federal Register document identifier such as `2026-09862`
- Response notes:
  - Returns JSON detail for the requested document
  - The reviewed payload included fields such as `document_number`, `html_url`, `pdf_url`, `body_html_url`, `full_text_xml_url`, `publication_date`, and `agencies`

### 3) List agencies
- Method: `GET`
- Path: `/agencies`
- Full URL example: `https://www.federalregister.gov/api/v1/agencies`
- Auth: none observed
- Confirmed parameters: none confirmed from the reviewed live route in this run
- Response notes:
  - Returns a JSON array rather than the collection envelope used by `/documents`
  - Reviewed objects included `id`, `name`, `short_name`, `slug`, `url`, and `recent_articles_url`

### 4) Get one agency by numeric ID
- Method: `GET`
- Path: `/agencies/{agency_id}`
- Full URL example: `https://www.federalregister.gov/api/v1/agencies/466`
- Auth: none observed
- Path parameter:
  - `agency_id` — numeric agency identifier
- Response notes:
  - Returns JSON detail for the requested agency
  - Reviewed fields included `id`, `name`, `short_name`, `slug`, `description`, `url`, and `recent_articles_url`
  - The reviewed payload confirmed downstream filtering via `recent_articles_url=https://www.federalregister.gov/api/v1/documents?conditions%5Bagency_ids%5D%5B%5D=466&order=newest`

### 5) List public inspection documents
- Method: `GET`
- Path: `/public-inspection-documents`
- Full URL example: `https://www.federalregister.gov/api/v1/public-inspection-documents`
- Auth: none observed
- Confirmed parameters: none confirmed from the reviewed live route in this run
- Response notes:
  - Returns a JSON collection with `description`, `count`, `total_pages`, and `results`

### 6) List current public inspection documents
- Method: `GET`
- Path: `/public-inspection-documents/current`
- Full URL example: `https://www.federalregister.gov/api/v1/public-inspection-documents/current`
- Auth: none observed
- Confirmed parameters: none confirmed from the reviewed live route in this run
- Response notes:
  - Returns a JSON collection of current public-inspection items
  - The reviewed response included `count` and `results`

### 7) Get one public inspection document by document number
- Method: `GET`
- Path: `/public-inspection-documents/{document_number}`
- Full URL example: `https://www.federalregister.gov/api/v1/public-inspection-documents/2026-09862`
- Auth: none observed
- Path parameter:
  - `document_number` — Federal Register document identifier such as `2026-09862`
- Response notes:
  - Returns JSON detail for the requested public-inspection record

## Auth, rate limits, pagination, errors, and format notes
- Auth:
  - No API key, cookie, or Authorization header was required for the seven reviewed read routes.
- Rate limits:
  - No official quota or throttling policy was exposed on the reachable official pages reviewed in this run.
- Pagination:
  - `/documents` and `/public-inspection-documents` use JSON pagination metadata.
  - Confirmed pagination fields include `count`, `total_pages`, `next_page_url`, and on filtered document requests `previous_page_url`.
  - `page` is confirmed by the provider-generated pagination links.
- Errors:
  - Missing document and agency detail checks returned HTML `404 Not Found` pages, not JSON problem objects.
  - The bare `/api/v1` path also returned an HTML `404 Not Found` page.
- Format notes:
  - Successful API reads returned `application/json; charset=utf-8`.
  - Error pages reviewed in this run were HTML.

## Important usage notes
- The assigned REST API documentation landing page was not the practical source of truth in this environment; the live route surface on `https://www.federalregister.gov/api/v1/...` was.
- Treat the documents and public-inspection collections as separate route families with different collection envelopes.
- Use numeric IDs for `/agencies/{agency_id}`.
- Use Federal Register document numbers such as `2026-09862` for both `/documents/{document_number}` and `/public-inspection-documents/{document_number}`.
- Do not assume the bare `/api/v1` root is a browsable API index; it returned the site HTML 404 page in this run.
