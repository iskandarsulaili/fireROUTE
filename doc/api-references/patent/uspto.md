# USPTO

## Provider metadata
- Category: `Patent`
- Provider slug: `uspto`
- Official docs/pages manually reviewed:
  - `https://www.uspto.gov/learning-and-resources/data-and-statistics`
  - `https://data.uspto.gov/apis/getting-started`
  - `https://data.uspto.gov/apis/api-syntax-examples`
  - `https://data.uspto.gov/apis/api-rate-limits`
  - `https://data.uspto.gov/swagger/index.html`
  - `https://data.uspto.gov/swagger/index.html?urls.primaryName=USPTO%20Office%20Action%20Rejection%20API`
  - `https://data.uspto.gov/swagger/index.html?urls.primaryName=USPTO%20Office%20Action%20Text%20Retrieval%20API`
  - `https://data.uspto.gov/swagger/index.html?urls.primaryName=USPTO%20Office%20Action%20Citations%20API`
  - `https://data.uspto.gov/swagger/index.html?urls.primaryName=USPTO%20Enriched%20Citation%20API%20v3`
- Current official API portal: `https://data.uspto.gov/apis/getting-started`
- Confirmed primary API host: `https://api.uspto.gov`
- Authentication: `X-API-KEY` / `x-api-key` header
- Primary response format: JSON for search and metadata APIs; document/file downloads use redirected file responses
- Manually confirmed route count in this pass: `61`

## What the official site now confirms
The current USPTO Open Data Portal is no longer a blank app shell in this environment. The reviewed official pages now expose a browsable API getting-started guide, syntax examples, a rate-limit page, and Swagger-backed patent/office-action references.

The reviewed portal also displays a registration banner stating that Open Data Portal sign-in with a valid USPTO.gov account will be required starting on `2026-06-18`.

## Authentication and access model
From the official `Getting started` page and Swagger UI:
- USPTO requires an ODP API key for API access.
- Getting an API key currently requires:
  - a registered `USPTO.gov` account
  - a validated and linked `ID.me` account
  - retrieval of the key through `MyODP`
- The same API key persists for the account and is shown on the `MyODP` page.
- The key is sent in the HTTP header:
  - `x-api-key: <api-key>`
  - Swagger and examples also show `X-API-KEY: <YOUR_API_KEY>`
- Data-product downloads from the website itself do not require an API key, but ODP API usage does.

## Base URL and request conventions
- Primary API host: `https://api.uspto.gov`
- ODP patent APIs use the shared prefix: `/api/v1/...`
- The currently reviewed patent-oriented ODP APIs use `GET` and `POST`.
- Search responses are JSON.
- USPTO's advanced search examples describe the backend as Amazon OpenSearch-powered.
- Simplified search syntax uses query-string expressions in `q`.
- Advanced search syntax uses JSON request bodies with objects such as:
  - `q`
  - `filters`
  - `rangeFilters`
  - `pagination.offset`
  - `pagination.limit`
  - `sort`
  - `facets`
  - `fields`
- The Swagger UI exposes shared schema/parameter names including `q`, `sort`, `offset`, `limit`, `facets`, `fields`, `filters`, `rangeFilters`, and `format`.

## Manually confirmed endpoint inventory

### 1) Patent search / Patent File Wrapper metadata family
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/applications/search` | Search patent applications with JSON payload |
| GET | `/api/v1/patent/applications/search` | Search patent applications with query parameters |
| POST | `/api/v1/patent/applications/search/download` | Download patent-application search results via JSON payload |
| GET | `/api/v1/patent/applications/search/download` | Download patent-application search results via query parameters |
| GET | `/api/v1/patent/applications/{applicationNumberText}` | Retrieve a single application record |
| GET | `/api/v1/patent/applications/{applicationNumberText}/meta-data` | Retrieve application metadata |
| GET | `/api/v1/patent/applications/{applicationNumberText}/adjustment` | Retrieve patent-term-adjustment data |
| GET | `/api/v1/patent/applications/{applicationNumberText}/assignment` | Retrieve assignment data |
| GET | `/api/v1/patent/applications/{applicationNumberText}/attorney` | Retrieve attorney / agent data |
| GET | `/api/v1/patent/applications/{applicationNumberText}/continuity` | Retrieve continuity data |
| GET | `/api/v1/patent/applications/{applicationNumberText}/foreign-priority` | Retrieve foreign-priority data |
| GET | `/api/v1/patent/applications/{applicationNumberText}/transactions` | Retrieve transaction history |
| GET | `/api/v1/patent/applications/{applicationNumberText}/documents` | Retrieve document metadata for an application |
| GET | `/api/v1/patent/applications/{applicationNumberText}/associated-documents` | Retrieve associated publication / grant metadata |
| POST | `/api/v1/patent/status-codes` | Search patent status codes with JSON payload |
| GET | `/api/v1/patent/status-codes` | Search patent status codes with query parameters |

Confirmed shared parameter/body conventions from Swagger and syntax docs:
- `q` supports both broad text search and fielded expressions.
- Search-style endpoints support pagination via `offset` and `limit`.
- Advanced JSON requests can also include `filters`, `rangeFilters`, `sort`, `facets`, `fields`, and optional `format` on download-oriented flows.
- Path lookups use `applicationNumberText`.

### 2) Bulk Datasets API family
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/datasets/products/search` | Search bulk-data products |
| GET | `/api/v1/datasets/products/{productIdentifier}` | Retrieve one dataset product by short name / identifier |
| GET | `/api/v1/datasets/products/files/{productIdentifier}/{fileName}` | Download a bulk-data product file |

Confirmed notes:
- `productIdentifier` is the product short name.
- The official rate-limit page treats product lookup as a metadata-retrieval API and file download as a separate bulk-download flow.

### 3) Final Petition Decisions API family
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/petition/decisions/search` | Search petition decisions with JSON payload |
| GET | `/api/v1/petition/decisions/search` | Search petition decisions with query parameters |
| POST | `/api/v1/petition/decisions/search/download` | Download petition-decision search results via JSON payload |
| GET | `/api/v1/petition/decisions/search/download` | Download petition-decision search results via query parameters |
| GET | `/api/v1/petition/decisions/{petitionDecisionRecordIdentifier}` | Retrieve a single petition-decision record |

### 4) PTAB Trials API family
#### Proceedings
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/trials/proceedings/search` | Search PTAB trial proceedings with JSON payload |
| GET | `/api/v1/patent/trials/proceedings/search` | Search PTAB trial proceedings with query parameters |
| POST | `/api/v1/patent/trials/proceedings/search/download` | Download proceeding-search results via JSON payload |
| GET | `/api/v1/patent/trials/proceedings/search/download` | Download proceeding-search results via query parameters |
| GET | `/api/v1/patent/trials/proceedings/{trialNumber}` | Retrieve one proceeding by trial number |

#### Decisions
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/trials/decisions/search` | Search PTAB trial decisions with JSON payload |
| GET | `/api/v1/patent/trials/decisions/search` | Search PTAB trial decisions with query parameters |
| POST | `/api/v1/patent/trials/decisions/search/download` | Download trial-decision results via JSON payload |
| GET | `/api/v1/patent/trials/decisions/search/download` | Download trial-decision results via query parameters |
| GET | `/api/v1/patent/trials/decisions/{documentIdentifier}` | Retrieve one trial-decision document |
| GET | `/api/v1/patent/trials/{trialNumber}/decisions` | Retrieve all decision documents for a trial |

#### Documents
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/trials/documents/search` | Search PTAB trial documents with JSON payload |
| GET | `/api/v1/patent/trials/documents/search` | Search PTAB trial documents with query parameters |
| POST | `/api/v1/patent/trials/documents/search/download` | Download trial-document results via JSON payload |
| GET | `/api/v1/patent/trials/documents/search/download` | Download trial-document results via query parameters |
| GET | `/api/v1/patent/trials/documents/{documentIdentifier}` | Retrieve one trial document |
| GET | `/api/v1/patent/trials/{trialNumber}/documents` | Retrieve all documents for a trial |

### 5) PTAB Appeals API family
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/appeals/decisions/search` | Search PTAB appeal decisions with JSON payload |
| GET | `/api/v1/patent/appeals/decisions/search` | Search PTAB appeal decisions with query parameters |
| POST | `/api/v1/patent/appeals/decisions/search/download` | Download appeal-decision results via JSON payload |
| GET | `/api/v1/patent/appeals/decisions/search/download` | Download appeal-decision results via query parameters |
| GET | `/api/v1/patent/appeals/decisions/{documentIdentifier}` | Retrieve one appeal-decision document |
| GET | `/api/v1/patent/appeals/{appealNumber}/decisions` | Retrieve all decision documents for an appeal |

### 6) PTAB Interferences API family
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/patent/interferences/decisions/search` | Search PTAB interference decisions with JSON payload |
| GET | `/api/v1/patent/interferences/decisions/search` | Search PTAB interference decisions with query parameters |
| POST | `/api/v1/patent/interferences/decisions/search/download` | Download interference-decision results via JSON payload |
| GET | `/api/v1/patent/interferences/decisions/search/download` | Download interference-decision results via query parameters |
| GET | `/api/v1/patent/interferences/{interferenceNumber}/decisions` | Retrieve decisions for an interference number |
| GET | `/api/v1/patent/interferences/decisions/{documentIdentifier}` | Retrieve one interference-decision document |

### 7) Office Action Rejections dataset API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/patent/oa/oa_rejections/v2/fields` | List searchable fields for the office-action rejections dataset |
| POST | `/api/v1/patent/oa/oa_rejections/v2/records` | Search office-action rejection records |

### 8) Office Action Text Retrieval dataset API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/patent/oa/oa_actions/v1/fields` | List searchable fields for office-action text retrieval |
| POST | `/api/v1/patent/oa/oa_actions/v1/records` | Search office-action text records |

### 9) Office Action Citations dataset API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/patent/oa/oa_citations/v2/fields` | List searchable fields for office-action citations |
| POST | `/api/v1/patent/oa/oa_citations/v2/records` | Search office-action citation records |

### 10) Enriched Citation dataset API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/patent/oa/enriched_cited_reference_metadata/v3/fields` | List searchable fields for enriched citation metadata |
| POST | `/api/v1/patent/oa/enriched_cited_reference_metadata/v3/records` | Search enriched citation metadata records |

## Search, filtering, and pagination notes
From the official syntax examples, Swagger schemas, and rate-limit guidance:
- Simplified `GET` searches can be issued directly with query-string `q` expressions, including fielded terms and date-range filters.
- Advanced `POST` searches accept JSON with:
  - `q`
  - `filters[]` using `name` plus `value[]`
  - `rangeFilters[]` using `field`, `valueFrom`, `valueTo`
  - `pagination.offset`
  - `pagination.limit`
  - `sort[]` with `field` and `order`
  - optional `facets[]`
  - optional `fields[]`
- Office-action dataset APIs follow the generic DSAPI pattern:
  - `GET /fields` to discover searchable field names
  - `POST /records` to execute filtered searches against the dataset
- USPTO's examples and schemas consistently surface `offset` / `limit` as the main pagination controls.

## Response and error notes
From the reviewed Swagger UI and syntax/rate-limit pages:
- Primary structured responses are JSON.
- Search/download families expose formal schemas such as `PatentDataResponse`, `ProceedingDataResponse`, `DecisionDataResponse`, and related data-bag objects.
- The ODP Swagger reference includes shared error schemas named:
  - `BadRequest`
  - `Forbidden`
  - `NotFound`
  - `Status413`
  - `InternalError`
- The syntax and rate-limit pages explicitly document `HTTP 429 Too Many Requests` for quota/concurrency violations.
- Patent File Wrapper document-download flows may use HTTP `301` redirects to signed file URLs.

## Rate limits and quotas
From the official `API rate limits` page:
- USPTO separates limits into three categories:
  1. metadata retrieval APIs
  2. Patent File Wrapper Documents API
  3. Bulk Datasets Downloads API
- Metadata-retrieval APIs are limited to `5,000,000` calls per week across the combined APIs in that category.
- Patent File Wrapper Documents APIs are limited to `1,200,000` calls per week.
- Bulk Datasets Downloads API limits:
  - same file: `20` downloads per year per API key, except XML files which have a much higher limit
  - up to `5` files per `10` seconds from the same IP address
- Weekly quotas reset on Sunday at midnight UTC.
- Concurrency / threshold guidance:
  - burst is `1` request per API key
  - sequential usage is expected
  - rate is `4` to `15` requests per second depending on API-call type
- The official guidance strongly discourages automatic retries without at least a `5`-second delay after `429` responses.

## Important usage notes
- The reviewed portal warns that all API calls are effectively single-flight per API key; parallel requests using the same key are blocked.
- USPTO's syntax examples show both simplified browser-friendly queries and OpenSearch-style advanced JSON bodies.
- The current Swagger UI confirms a broader official patent surface than the old repo blocker note captured.
- Syntax examples also document Patent File Wrapper document-download URL patterns such as:
  - `/api/v1/download/applications/{applicationId}/{documentIdentifier}.pdf`
  - `/api/v1/download/applications/{applicationId}/{documentIdentifier}/xmlarchive`
  - `/api/v1/download/applications/{applicationId}/{documentIdentifier}/files/{fileName}`
  These concrete download patterns were visible on the official syntax-examples page, but the conservative route count above is based on the formally enumerated Swagger operations.
- The same Swagger portal also exposes additional official definitions such as `TSDR API`; because this provider file lives in the `patent` category, the manually confirmed route inventory above focuses on the patent-oriented ODP and office-action surfaces.

## fireROUTE normalization notes
- Normalize auth as header-based `x-api-key`.
- Treat USPTO's patent search families as mixed simple-query and structured-query APIs rather than pure REST resources.
- Preserve the distinction between metadata lookups, search/download endpoints, and dataset-style `/fields` + `/records` APIs.
- Handle document/file download routes as redirect-capable binary transfers rather than ordinary JSON endpoints.
- Keep `429` handling conservative and sequential because the official docs explicitly warn against concurrent use with one key.
