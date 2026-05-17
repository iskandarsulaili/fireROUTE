# arXiv

## Provider metadata
- Category: `Science & Math`
- Provider slug: `arxiv`
- Official docs/pages used:
  - `https://arxiv.org/help/api/user-manual` -> official manual currently served from `https://info.arxiv.org/help/api/user-manual.html`
- Current public API base URL: `http://export.arxiv.org/api`
- Auth model: no authentication documented in the official API manual
- Response format: Atom feed with OpenSearch elements and arXiv extension elements
- Rate limits: no fixed requests-per-minute quota is published in the manual page used here
- Manually confirmed route count: `1`

## Canonical endpoint
1. `GET /query`
   - Full canonical example from the manual: `http://export.arxiv.org/api/query?search_query=all:electron`
   - All documented search, ID lookup, paging, and sorting behavior is expressed through query parameters on this single route.

## Query parameters
- `search_query` - primary search expression; examples in the manual include `all:electron` and `all:electron+AND+all:proton`.
- `id_list` - comma-separated list of specific arXiv identifiers.
- `start` - result offset for paging.
- `max_results` - page size / maximum number of returned results.
- `sortBy` - documented values:
  - `relevance`
  - `lastUpdatedDate`
  - `submittedDate`
- `sortOrder` - documented values:
  - `ascending`
  - `descending`

## Search and paging notes
- The manual explicitly documents the `search_query` / `id_list` query interface as the core request model.
- The paging section states that the maximum number of results returned from a single call is limited to `30000`, served in slices of at most `2000` at a time via `start` and `max_results`.
- The manual recommends refining queries that return more than `1000` results or requesting smaller slices.

## Response notes
- Responses are Atom feeds rather than plain JSON.
- The manual explicitly documents:
  - feed metadata
  - OpenSearch extension elements
  - entry metadata
  - arXiv extension elements
- Entry metadata includes items such as title, id, published date, updated date, summary, author, category, links, and arXiv-specific extension fields.

## Usage notes
- This provider is effectively a single-search-endpoint API with rich query syntax rather than a multi-route REST surface.
- Query construction and semantics are heavily driven by the `search_query` language described in the official manual.
- For fireROUTE, arXiv should be modeled as a read-only search/list API with Atom/XML parsing requirements.

## fireROUTE normalization notes
- Treat `GET /query` as the sole canonical operation.
- Preserve `search_query`, `id_list`, `start`, `max_results`, `sortBy`, and `sortOrder` without renaming because they are the documented public contract.
- Mark response parsing as Atom/OpenSearch rather than JSON.
