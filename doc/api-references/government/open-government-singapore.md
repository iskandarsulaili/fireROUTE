# Open Government, Singapore

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-singapore`
- Official docs/pages used:
  - `https://data.gov.sg/developer` (assigned developer URL; currently redirects to `https://guide.data.gov.sg/developers/apis`, which returns a docs-site 404 page)
  - `https://guide.data.gov.sg/developer-guide/api-overview`
  - `https://guide.data.gov.sg/developer-guide/api-overview/how-to-use-your-api-key`
  - `https://guide.data.gov.sg/developer-guide/api-overview/api-rate-limits`
  - `https://guide.data.gov.sg/developer-guide/collection-apis`
  - `https://guide.data.gov.sg/developer-guide/dataset-apis`
  - `https://guide.data.gov.sg/developer-guide/dataset-apis/get-dataset-metadata`
  - `https://guide.data.gov.sg/developer-guide/dataset-apis/download-dataset`
  - `https://guide.data.gov.sg/developer-guide/dataset-apis/list-all-datasets`
- Current documented API base URLs:
  - `https://api-production.data.gov.sg`
  - `https://api-open.data.gov.sg`
- Additional staging URLs explicitly shown in the official docs:
  - `https://api-staging.data.gov.sg`
  - `https://api-open-staging.data.gov.sg`
- Auth model: public low-rate access is available without a key; higher limits require an API key sent as `x-api-key`
- Response format: JSON (`application/json`)
- Manually confirmed route count: `5`

## Official usage notes
- The official API overview says data.gov.sg exposes two broad API families: real-time APIs and collection/dataset APIs.
- The old developer landing page is no longer the stable canonical entry point; the current official documentation lives under the `guide.data.gov.sg` developer guide.
- The guide says dataset IDs can be taken from dataset URLs on `data.gov.sg`.
- The guide explicitly warns that dataset IDs can differ between staging and production.
- The reviewed examples show a common response envelope with top-level fields such as `code`, `data`, and `errorMsg`.

## Canonical endpoints confirmed from the official guide
1. `GET /v2/public/api/collections`
   - Base URL: `https://api-production.data.gov.sg`
   - Purpose: list all collections on data.gov.sg
   - Query parameters:
     - `page` - integer, minimum `1`, optional
   - Response notes:
     - JSON response with `code`, `data`, and `errorMsg`
     - Example payload includes `collections[]` plus `pages`

2. `GET /v2/public/api/collections/{collectionId}/metadata`
   - Base URL: `https://api-production.data.gov.sg`
   - Purpose: return metadata for one collection and optionally its datasets
   - Path parameters:
     - `collectionId` - number, required
   - Query parameters:
     - `withDatasetMetadata` - boolean, optional; docs say default is `false`
   - Response notes:
     - JSON response with `code`, `data`, and `errorMsg`

3. `GET /v2/public/api/datasets`
   - Base URL: `https://api-production.data.gov.sg`
   - Purpose: list all datasets available on data.gov.sg
   - Query parameters:
     - `page` - integer, minimum `1`, optional
   - Response notes:
     - JSON response with `code`, `data`, and `errorMsg`
     - Example payload includes `datasets[]` plus `pages`

4. `GET /v2/public/api/datasets/{datasetId}/metadata`
   - Base URL: `https://api-production.data.gov.sg`
   - Purpose: return metadata for a single dataset
   - Path parameters:
     - `datasetId` - string, required
   - Response notes:
     - JSON response with `code`, `data`, and `errorMsg`
     - Example fields include `datasetId`, `createdAt`, `name`, `format`, `lastUpdatedAt`, `managedBy`, `coverageStart`, `coverageEnd`, and nested `columnMetadata`

5. `GET /v1/public/api/datasets/{datasetId}/initiate-download`
   - Base URL: `https://api-open.data.gov.sg`
   - Purpose: initiate dataset export/download generation
   - Path parameters:
     - `datasetId` - string, required
   - Request body (`application/json`, optional):
     - `columnNames` - array of strings selecting columns
     - `filters` - array of filter objects
       - each filter object uses `columnName`, `type`, and `value`
       - documented filter types: `EQ`, `LIKE`, `ILIKE`
   - Response notes:
     - `201` documented for successful response
     - `400` documented as an error response on the official page
     - Docs say non-CSV datasets can skip this initiate step and proceed directly to the follow-up poll-download flow

## Auth and rate-limit notes
- The official auth guide states API keys must be sent in the header:
  - `x-api-key: YOUR_API_KEY`
- The key-request guide distinguishes `Developer` and `Production` API keys.
- The official rate-limit page says limits reset every `10` seconds.
- The official rate-limit table documents these per-10-second limits:
  - `v2 Real-time APIs`: `6` without key, `12` with Dev key, `30` with Prod key
  - `Datastore Search`: `4` without key, `8` with Dev key, `20` with Prod key
  - `Dataset Downloads`: `2` without key, `4` with Dev key, `10` with Prod key
- The official docs say exceeding limits returns HTTP `429` (`Too many requests`).

## Pagination, IDs, and format notes
- Collection and dataset listing endpoints paginate with the `page` query parameter.
- Collection metadata uses numeric `collectionId` values.
- Dataset metadata and download-initiation routes use string `datasetId` values.
- The docs provide concrete examples showing dataset IDs embedded in public dataset URLs.
- The reviewed guide pages consistently describe JSON responses and show `application/json` examples.

## Important gaps and counting rule
- The official guide also mentions additional API surfaces, including real-time APIs, datastore search, and a poll-download step.
- In this run, only routes whose exact paths were clearly visible on stable official guide pages were counted.
- Because the assigned old developer URL now lands on a 404 page, fireROUTE should treat `guide.data.gov.sg` as the current official documentation source for this provider.

## fireROUTE normalization notes
- The provider now spans at least two production API hosts: `api-production.data.gov.sg` for collection/dataset metadata routes and `api-open.data.gov.sg` for dataset-download initiation.
- Auth is optional for basic exploration but materially changes throughput limits.
- Preserve the distinction between metadata listing routes and download-generation routes when mapping these endpoints into fireROUTE abstractions.
