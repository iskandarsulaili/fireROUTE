# Open Government, Korea

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-korea`
- Assigned docs URL: `https://www.data.go.kr/`
- Official docs/pages used:
  - `https://www.data.go.kr/`
  - `https://www.data.go.kr/tcs/dss/selectDataSetList.do`
  - `https://www.data.go.kr/tcs/eds/selectCoreDataListView.do`
  - `https://www.data.go.kr/tcs/opd/ndm/view.do`
  - `https://www.data.go.kr/data/15129459/openapi.do`
  - `https://www.data.go.kr/data/15084572/fileData.do`
  - `https://www.data.go.kr/data/15013117/standard.do`
  - `https://www.data.go.kr/catalog/15129459/openapi.json`
  - `https://www.data.go.kr/data/99999999/openapi.do`
- Current status after official review: `manually_documented`
- Manually confirmed route count: `7`
- Current documented portal host: `https://www.data.go.kr`
- Auth model: public catalogue/detail pages are readable without login; reviewed OpenAPI product pages require portal signup plus `활용신청` approval and service-key-based usage for the downstream API itself
- Response formats confirmed from the reviewed pages: HTML, JSON

## What was confirmed from the official site
- The official homepage loaded successfully and identified the site as the Korean `공공데이터포털` / Public Data Portal.
- The homepage exposed live portal totals during this review, including `1,119` opening institutions, `83,183` file datasets, `12,008` open APIs, and `12,336` standard datasets.
- The homepage search form publishes a stable catalogue route at `/tcs/dss/selectDataSetList.do`.
- That search form confirmed a GET submission model with public query inputs including `keyword`, `brm`, `svcType`, `recmSe`, `conditionType`, `extsn`, and `kwrdArray`.
- The reviewed full data-list page confirmed additional catalogue parameters and controls including `dType`, `sort`, `currentPage`, `perPage`, `org`, `orgFilter`, `orgFullName`, `instt`, `coreDataNm`, `coreDataNmArray`, `detailKeyword`, `detailText`, `relatedKeyword`, `commaOrData`, `commaAndData`, `commaNotInData`, `must_not`, and `operator`.
- The reviewed list page also confirmed three stable provider-owned detail-page families for dataset records:
  - `/data/{dataset_id}/fileData.do`
  - `/data/{dataset_id}/openapi.do`
  - `/data/{dataset_id}/standard.do`
- The reviewed `fileData.do` page explicitly states that open-format file datasets are auto-converted to REST-style JSON/XML APIs and that using the OpenAPI version requires portal membership plus an application/usage request.
- The reviewed `openapi.do` page confirmed a product-level API console with published downstream base URL, schemes, route list, `REST` type, `JSON+XML` format, free pricing, realtime updates, and traffic guidance `개발계정 : 1,000 / 운영계정 : 활용사례 등록시 신청하면 트래픽 증가 가능`.
- The reviewed `standard.do` page confirmed that standard datasets aggregate many local-provider datasets under one national standard record and expose built-in search plus page navigation for the attached dataset list.
- The official metadata artifact `/catalog/15129459/openapi.json` returned JSON directly in-browser and linked back to the corresponding portal detail page under `/data/15129459/openapi.do`.
- A deliberate missing-record check on `/data/99999999/openapi.do` returned the portal error page `에러 | 공공데이터포털` with the message `요청하신 페이지를 찾을 수 없습니다.`, confirming HTML error handling for unknown dataset IDs.

## Canonical routes confirmed from the official site
1. `GET /tcs/dss/selectDataSetList.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: public catalogue search and browse across the portal's dataset inventory
   - Confirmed query/form parameters from the reviewed official page:
     - `keyword` - main search string
     - `detailKeyword` - additional keyword field
     - `detailText` - detailed text filter
     - `relatedKeyword` - related-term filter
     - `commaOrData`, `commaAndData`, `commaNotInData`, `must_not` - boolean keyword helpers
     - `dType` - dataset tab/type selector; confirmed default `TOTAL`
     - `sort` - result ordering; confirmed values shown in the page controls include `_score`, `inqireCo`, `reqCo`, and `updtDt`
     - `currentPage` - current page number
     - `perPage` - page size; the reviewed page exposed `5개씩` in the control while the hidden field held `10`
     - `org`, `orgFilter`, `orgFullName`, `orgSearch` - organization filters
     - `brm` - classification filter
     - `svcType` - service-type filter
     - `instt` - institution-type filter
     - `extsn` - file-extension filter
     - `coreDataNm`, `coreDataNmArray` - core-data filters
     - `operator` - keyword boolean mode; the reviewed page exposed `AND` and `OR`
     - `pblonsipScopeCode` - confirmed hidden value `PBDE07`
   - Response format: HTML

2. `GET, POST /tcs/eds/selectCoreDataListView.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: browse the portal's `국가중점데이터` / nationally prioritized data catalogue
   - Confirmed route behavior:
     - direct page load works on the public portal
     - the reviewed filter form submitted to the same route with method `POST`
   - Confirmed form parameters from the reviewed official page:
     - `coreDataInsttCode` - institution filter
     - `coreDataSn` - selected core-data record id; reviewed default `0`
     - `listType` - reviewed default `card`
     - `brmConditions` - repeated category filter checkboxes
   - Response format: HTML

3. `GET /tcs/opd/ndm/view.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: open the `국가데이터맵` / national data map view
   - Confirmed reviewed behavior:
     - shows category distribution percentages across portal data
     - exposes a detail pane for one selected dataset and related holdings
     - includes a provider-owned request form posting to `/tcs/dor/insertDataOfferReqstProcssView.do`
   - Response format: HTML

4. `GET /data/{dataset_id}/fileData.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: public detail page for a file dataset record
   - Confirmed path example: `/data/15084572/fileData.do`
   - Confirmed reviewed contents:
     - file metadata and description
     - provider/department contact details
     - update cadence and extension type
     - file download section
     - note that public file data can be auto-converted to OpenAPI
     - visible downstream docs pointer on the reviewed page: `https://infuser.odcloud.kr/oas/docs?namespace=15084572/v1`
   - Response format: HTML

5. `GET /data/{dataset_id}/openapi.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: public detail page and interactive route reference for an OpenAPI product
   - Confirmed path example: `/data/15129459/openapi.do`
   - Confirmed reviewed contents:
     - API type `REST`
     - data format `JSON+XML`
     - published downstream base URL `apis.data.go.kr/1230000/ao/CntrctProcssIntgOpenService`
     - schemes `https`, `http`
     - route inventory for the reviewed product, including `GET /getCntrctProcssIntgOpenFrgcpt`, `GET /getCntrctProcssIntgOpenThng`, `GET /getCntrctProcssIntgOpenServc`, and `GET /getCntrctProcssIntgOpenCnstwk`
     - free pricing and traffic guidance
   - Response format: HTML

6. `GET /data/{dataset_id}/standard.do`
   - Base URL: `https://www.data.go.kr`
   - Purpose: public detail page for a standard dataset family aggregated across many providers
   - Confirmed path example: `/data/15013117/standard.do`
   - Confirmed reviewed contents:
     - legal basis, supervising institution, and refresh cadence
     - a built-in dataset list for attached providers
     - page controls wired through `stdObj.fn_pageClick(...)`
     - search forms posting to `/tcs/dss/selectStdDataDetailView.do`
   - Response format: HTML

7. `GET /catalog/{dataset_id}/openapi.json`
   - Base URL: `https://www.data.go.kr`
   - Purpose: machine-readable JSON metadata record for an OpenAPI dataset entry
   - Confirmed path example: `/catalog/15129459/openapi.json`
   - Confirmed fields visible in the reviewed response include:
     - `name`
     - `description`
     - `url`
     - `keywords`
     - `license`
     - `dateCreated`
     - `dateModified`
     - `creator`
     - `datasetTimeInterval`
     - `encodingFormat`
   - Response format: JSON

## Auth, rate limits, pagination, errors, and format notes
- Auth:
  - the seven confirmed portal-owned routes above were publicly readable without login during this review
  - the reviewed OpenAPI product page explicitly states that actual downstream API usage requires portal membership, `활용신청`, and service-key-based access at the product level
- Rate limits:
  - no single portal-wide quota policy was published for all catalogue/detail routes
  - the reviewed OpenAPI product page published product-level traffic guidance: `개발계정 : 1,000 / 운영계정 : 활용사례 등록시 신청하면 트래픽 증가 가능`
- Pagination:
  - `/tcs/dss/selectDataSetList.do` confirmed hidden pagination fields `currentPage` and `perPage`
  - `/data/{dataset_id}/standard.do` confirmed page navigation through portal-side paging controls and `stdObj.fn_pageClick(...)`
- Errors:
  - the reviewed missing OpenAPI detail path `/data/99999999/openapi.do` returned an HTML error page titled `에러 | 공공데이터포털`
  - no shared machine-readable provider-wide JSON error envelope was exposed for the portal routes reviewed here
- Format notes:
  - `/tcs/dss/selectDataSetList.do`, `/tcs/eds/selectCoreDataListView.do`, `/tcs/opd/ndm/view.do`, and `/data/{dataset_id}/*.do` are HTML discovery/detail surfaces
  - `/catalog/{dataset_id}/openapi.json` is JSON metadata
  - downstream APIs linked from `/data/{dataset_id}/openapi.do` may expose JSON/XML and their own service-specific route contracts

## Important usage notes
- Treat `data.go.kr` as a portal with two distinct layers: provider-owned discovery/detail routes on `www.data.go.kr`, and many downstream product-specific API hosts such as `apis.data.go.kr`.
- Do not collapse all downstream product routes into one provider-wide fireROUTE inventory for the whole portal; only the seven confirmed portal-owned route families above are documented here.
- `fileData.do` pages can advertise auto-generated API documentation on other official hosts such as `infuser.odcloud.kr`; keep those as linked downstream surfaces, not as replacements for the portal-owned detail route.
- Product-level auth, quotas, and schemas vary by individual API entry, even though the public catalogue and detail pages are openly readable.
- Unknown dataset IDs return a portal HTML error page rather than a shared JSON error schema.
