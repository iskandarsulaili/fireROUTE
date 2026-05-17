# Open Government, Cyprus

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-cyprus`
- Assigned docs URL: `https://data.gov.cy/?language=en`
- Official docs/pages used:
  - `https://data.gov.cy/?language=en`
  - `https://data.gov.cy/index.php/en/support-developers`
  - `https://data.gov.cy/index.php/en/search?s=&f%5B0%5D=content_type%3Adataset.dataset`
  - `https://data.gov.cy/index.php/en/dataset/2234`
  - `https://data.gov.cy/index.php/en/dataset/2234/dcat-ap-2.0/json`
  - `https://data.gov.cy/index.php/en/dataset/2234/dcat-ap-2.0/xml`
  - `https://data.gov.cy/index.php/en/resource/5130`
- Current status after official review: `manually_documented`
- Manually confirmed route count: `5`
- Current documented API/discovery host: `https://data.gov.cy`
- Current documented path prefix: `https://data.gov.cy/index.php/en`
- Auth model: no API key or login requirement was shown on the reviewed public pages for the confirmed routes
- Response formats confirmed from the reviewed pages: HTML, JSON, XML

## What was confirmed from the official site
- The assigned official homepage loaded successfully and identified the site as the Cyprus `National Opendata Portal`.
- The homepage exposed live portal totals during this review, including `1,927` datasets, `4,104` resources, and `95` organizations.
- The official developer-support page is live, but it mostly links out to generic DKAN background material instead of publishing a Cyprus-specific route inventory.
- The official dataset-search page on the Cyprus host is live and exposes a stable routed search surface at `/index.php/en/search`.
- That search page confirmed public query inputs `s`, `sort_by`, and `sort_order`, plus facet-style filter parameters in the URL such as `f[0]=content_type:dataset.dataset`.
- The reviewed search page also exposed numbered `page` links, confirming page-based pagination.
- Search-result `api` links on the official Cyprus host resolve to dataset-detail pages such as `/index.php/en/dataset/2234` rather than directly to a raw JSON endpoint.
- The reviewed dataset page confirmed an `API Access` section for dataset metadata and exposed same-host DCAT-AP 2.0 metadata routes in both JSON and XML forms.
- The reviewed dataset metadata JSON route returned machine-readable DCAT content directly in the browser with catalog title `National Opendata Portal`, homepage search URL metadata, dataset identifier `eac58c16-1e4c-4524-9800-aife2250036G`, and the upstream publisher resource URL.
- The reviewed XML variant triggered a direct download response, confirming that the XML representation is exposed as a separate route rather than only as rendered HTML.
- The reviewed resource page `/index.php/en/resource/5130` stayed on the Cyprus host and exposed the linked publisher-owned resource URL `https://cystatdb23px.cystat.gov.cy/pxweb/el/8.CYSTAT-DB/8.CYSTAT-DB__Services__Road%20Freight%20Transport/2250036G.px/`.

## Canonical routes confirmed from the official site
1. `GET /index.php/en/search`
   - Base URL: `https://data.gov.cy`
   - Purpose: browse and search the national open-data catalogue
   - Confirmed query parameters from the reviewed official form and pager links:
     - `s` - free-text search string
     - `sort_by` - confirmed values shown in the form: `changed`, `relevance`, `title`, `created`
     - `sort_order` - confirmed values shown in the form: `ASC`, `DESC`
     - `page` - page number for result navigation
     - `f[0]` - facet filter token; confirmed examples from the reviewed official URLs include `content_type:dataset.dataset` and topic filters such as `topic:512`
   - Response format: HTML

2. `GET /index.php/en/dataset/{dataset_id}`
   - Base URL: `https://data.gov.cy`
   - Purpose: return the public dataset-detail page for a specific catalogue entry
   - Confirmed path example: `/index.php/en/dataset/2234`
   - Confirmed contents on the reviewed page:
     - organization/publisher block
     - license
     - modified/release dates
     - identifier
     - spatial coverage
     - contact information
     - links to DCAT-AP 2.0 metadata formats
   - Response format: HTML

3. `GET /index.php/en/dataset/{dataset_id}/dcat-ap-2.0/json`
   - Base URL: `https://data.gov.cy`
   - Purpose: machine-readable DCAT-AP 2.0 JSON representation of a dataset record
   - Confirmed path example: `/index.php/en/dataset/2234/dcat-ap-2.0/json`
   - Confirmed fields visible in the reviewed response include:
     - catalog title / homepage metadata
     - dataset identifier
     - dataset title / description
     - issued / modified timestamps
     - accrual periodicity
     - spatial geometry
     - language
     - publisher / contact metadata
   - Response format: JSON

4. `GET /index.php/en/dataset/{dataset_id}/dcat-ap-2.0/xml`
   - Base URL: `https://data.gov.cy`
   - Purpose: machine-readable DCAT-AP 2.0 XML export of a dataset record
   - Confirmed path example: `/index.php/en/dataset/2234/dcat-ap-2.0/xml`
   - Official behavior confirmed in this review: Chromium treated the route as a file download (`isDownload: true`)
   - Response format: XML download

5. `GET /index.php/en/resource/{resource_id}`
   - Base URL: `https://data.gov.cy`
   - Purpose: return the public resource-detail page for one resource attached to a dataset
   - Confirmed path example: `/index.php/en/resource/5130`
   - Confirmed reviewed behavior:
     - shows a `Back to dataset` link
     - exposes the publisher-hosted resource URL when the actual file/API is on another official system
   - Response format: HTML

## Auth, rate limits, pagination, errors, and format notes
- Auth: no login or API-key requirement was shown for the five confirmed public routes above.
- Rate limits: no official quota, throttle, or retry policy was published on the reviewed Cyprus pages.
- Pagination: the catalogue search route uses a `page` query parameter; the reviewed search page exposed numbered pager links such as `page=0`, `page=1`, and higher page numbers.
- Errors: no provider-wide machine error schema was documented on the reviewed pages; the XML export behaved as a download, while the JSON export rendered directly in-browser.
- Format notes:
  - `/search`, `/dataset/{dataset_id}`, and `/resource/{resource_id}` are HTML discovery/detail pages
  - `/dataset/{dataset_id}/dcat-ap-2.0/json` is machine-readable JSON metadata
  - `/dataset/{dataset_id}/dcat-ap-2.0/xml` is machine-readable XML metadata delivered as a download

## Important usage notes
- On the Cyprus portal, the visible `api` links in search results lead to dataset-detail pages first; they are not raw JSON API endpoints by themselves.
- The confirmed same-host machine-readable surface is metadata-focused DCAT export, not a unified Cyprus-owned row/query API for all underlying datasets.
- Actual data resources can live on external publisher-operated hosts; in the reviewed example, the resource page pointed to `cystatdb23px.cystat.gov.cy`.
- Preserve the distinction between Cyprus-hosted catalogue metadata routes and publisher-hosted downstream data resources.
- Do not infer generic DKAN endpoints on `data.gov.cy` when the official Cyprus pages already expose a narrower, provider-owned route pattern centered on search pages, dataset/resource pages, and DCAT exports.
