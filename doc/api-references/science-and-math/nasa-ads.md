# NASA ADS

## Provider metadata
- Category: `Science & Math`
- Provider slug: `nasa-ads`
- Official docs/pages used:
  - `https://ui.adsabs.harvard.edu/help/api/api-docs.html`
  - the official RapiDoc page above loads its public OpenAPI specification from `https://raw.githubusercontent.com/adsabs/adsabs-dev-api/master/openapi/openapi_public.yaml`
- Current public API base URL: `https://api.adsabs.harvard.edu/v1`
- Additional documented server: `https://devapi.adsabs.harvard.edu/v1`
- Auth model: the official OpenAPI document defines `ApiKeySecurity` as HTTP `bearer` auth with `JWT` bearer format
- Terms of service referenced by the official OpenAPI document: `https://ui.adsabs.harvard.edu/help/terms/`
- Route mix confirmed from the official public OpenAPI file:
  - `44` GET routes
  - `42` POST routes
- Rate-limit notes: no explicit numeric public rate-limit policy was published in the reviewed official docs/spec pages
- Manually confirmed route count: `86`

## Shared parameters confirmed in the official public OpenAPI spec
- `q` - shared search query parameter
- `rows` - shared page-size/result-count parameter
- `fq` - shared filter-query parameter
- `fl` - shared field-selection parameter
- `start` - shared offset/start parameter
- `sort` - shared sort parameter
- `bibcode` - shared bibcode identifier parameter
- `link` - shared export/RSS link parameter
- `queryId` - stored-query identifier parameter
- `myadsId` - notification identifier parameter

## Canonical endpoints
### Search and stored-query routes
1. `GET /search/query`
2. `GET /search/qtree`
3. `POST /search/bigquery`
4. `POST /vault/query`
5. `GET /vault/query/{queryId}`
6. `GET /vault/execute_query/{queryId}`
7. `GET /vault/query2svg/{queryId}`
8. `GET /vault/notifications`
9. `GET /vault/notifications/{myads_id}`
10. `GET /vault/notification_query/{myads_id}`

### Library routes
11. `GET /biblib/libraries`
12. `GET /biblib/libraries/{library_id}`
13. `POST /biblib/libraries/operations/{library_id}`
14. `POST /biblib/documents/{library_id}`
15. `POST /biblib/notes/{library_id}/{document_id}`
16. `GET /biblib/query/{library_id}`
17. `GET /biblib/permissions/{library_id}`
18. `POST /biblib/transfer/{library_id}`

### Export routes
19. `GET /export/bibtexabs/{bibcode}`
20. `POST /export/bibtexabs`
21. `GET /export/bibtex/{bibcode}`
22. `POST /export/bibtex`
23. `GET /export/ads/{bibcode}`
24. `POST /export/ads`
25. `GET /export/endnote/{bibcode}`
26. `POST /export/endnote`
27. `GET /export/procite/{bibcode}`
28. `POST /export/procite`
29. `GET /export/ris/{bibcode}`
30. `POST /export/ris`
31. `GET /export/refworks/{bibcode}`
32. `POST /export/refworks`
33. `GET /export/medlars/{bibcode}`
34. `POST /export/medlars`
35. `GET /export/aastex/{bibcode}`
36. `POST /export/aastex`
37. `GET /export/icarus/{bibcode}`
38. `POST /export/icarus`
39. `GET /export/mnras/{bibcode}`
40. `POST /export/mnras`
41. `GET /export/soph/{bibcode}`
42. `POST /export/soph`
43. `GET /export/dcxml/{bibcode}`
44. `POST /export/dcxml`
45. `GET /export/refxml/{bibcode}`
46. `POST /export/refxml`
47. `GET /export/refabsxml/{bibcode}`
48. `POST /export/refabsxml`
49. `GET /export/votable/{bibcode}`
50. `POST /export/votable`
51. `GET /export/rss/{bibcode}`
52. `POST /export/rss`
53. `GET /export/rss/{bibcode}/{link}`
54. `GET /export/ieee/{bibcode}`
55. `POST /export/ieee`
56. `POST /export/csl`
57. `POST /export/custom`

### Metrics, affiliation, helper, and user routes
58. `POST /metrics`
59. `GET /metrics/{bibcode}`
60. `POST /metrics/detail`
61. `POST /author-affiliation/search`
62. `POST /author-affiliation/export`
63. `POST /citation_helper`
64. `GET /harbour/mirrors`
65. `GET /harbour/user`
66. `POST /harbour/auth/classic`

### Objects and journals routes
67. `POST /objects`
68. `POST /objects/query`
69. `GET /journals/summary/{bibstem}`
70. `GET /journals/journal/{journalname}`
71. `GET /journals/holdings/{bibstem}/{volume}`
72. `GET /journals/refsource/{bibstem}`
73. `GET /journals/issn/{issn}`
74. `GET /journals/browse/{bibstem}`

### Oracle / reference / resolver routes
75. `POST /oracle/matchdoc`
76. `GET /oracle/readhist`
77. `GET /oracle/readhist/{function}/{reader}`
78. `GET /reference/text/{reference}`
79. `POST /reference/text`
80. `POST /reference/xml`
81. `POST /reference/parse`
82. `GET /resolver/{bibcode}`
83. `GET /resolver/{bibcode}/{link_type}`

### Visualization routes
84. `POST /vis/author-network`
85. `POST /vis/paper-network`
86. `POST /vis/word-cloud`

## Response / format notes
- The public API is not a single-format API surface.
- Search, library, metrics, notification, and many helper routes are documented through the OpenAPI spec as structured API operations and are primarily JSON-oriented.
- The export family explicitly includes citation/text/XML/RSS-oriented routes such as `bibtex`, `ris`, `dcxml`, `refxml`, `rss`, and related formats.

## Important usage notes
- The official docs page is a JS-rendered RapiDoc shell; the route inventory above was confirmed from the official `spec-url` that page itself points to.
- The public OpenAPI document is versioned around `/v1` server URLs.
- The surface spans many subdomains of ADS functionality, not just search: stored queries, libraries, exports, metrics, journals, references, resolvers, notifications, and visualizations are all part of the same reviewed public spec.

## fireROUTE normalization notes
- Use `https://api.adsabs.harvard.edu/v1` as the canonical production base URL.
- Preserve bearer-token authentication semantics.
- Treat the export routes as format-specific operations rather than trying to collapse them into a single generic export route.
- Expect a mixed response surface: JSON-style APIs for most service families plus format-specific text/XML/RSS responses for export endpoints.