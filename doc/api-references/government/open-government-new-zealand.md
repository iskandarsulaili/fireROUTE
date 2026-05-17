# Open Government, New Zealand

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-new-zealand`
- Official docs/pages used:
  - `https://www.data.govt.nz/`
  - `https://www.data.govt.nz/catalogue-guide`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis/about-data-govt-nz-apis`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis/accessing-dataset-metadata-via-api`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis/accessing-machine-readable-data-via-api`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis/how-to-export-all-datasets-from-data-govt-nz-into-a-csv`
  - `https://www.data.govt.nz/catalogue-guide/using-data-govt-nz-apis/how-to-export-an-agencys-datasets-as-a-data-package`
- Current documented API host: `https://catalogue.data.govt.nz`
- Official API path prefixes shown on reviewed pages:
  - `https://catalogue.data.govt.nz/api/action`
  - `https://catalogue.data.govt.nz/api/3/action`
- Auth model: no API key or auth flow was described on the reviewed public guide pages
- Response format: JSON
- Manually confirmed route count: `6`

## Official usage notes
- The official guide says the metadata and many datasets on data.govt.nz are available through an API.
- The official "About data.govt.nz APIs" page says the portal is built on CKAN and links to CKAN API and DataStore API documentation.
- The metadata guide says datasets, organisations, and groups can be queried as JSON through the metadata API.
- The machine-readable-data guide says the DataStore API exposes rows and columns from machine-readable CSV resources through JSON endpoints.
- The official package-search example says an unqualified `package_search` request returns only the first `10` catalogue items by default.
- The reviewed official pages did not publish a portal-specific rate-limit policy.

## Canonical endpoints confirmed from the official guide
1. `GET /api/action/package_metadata_show`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: return metadata for a dataset and all of its data resources
   - Query parameters:
     - `id` - dataset/package identifier, required
   - Official page example path: `/package_metadata_show?id={package id}`

2. `GET /api/action/resource_metadata_show`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: return metadata for one specific resource
   - Query parameters:
     - `id` - resource identifier, required
   - Official page example path: `/resource_metadata_show?id={resource id}`

3. `POST /api/action/package_show`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: return dataset metadata for a known dataset slug or id
   - Request parameters shown in the official Python example:
     - `id` - dataset identifier such as `new-zealand-public-sector-websites`
   - Official example posts JSON-encoded form data to `https://catalogue.data.govt.nz/api/action/package_show`

4. `GET /api/3/action/package_search`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: search catalogue metadata
   - Official usage notes:
     - default response returns the first `10` matching items
     - the guide says the endpoint uses the Solr search query language for more advanced queries
   - Confirmed parameter/inputs from the reviewed page:
     - free-text search input via the search query

5. `GET /api/action/datastore_search`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: simple DataStore query endpoint for rows within a machine-readable resource
   - Official query note:
     - `q` can be either a string or a dictionary; when it is a string it searches across all fields, and when it is a dictionary it searches specific fields

6. `GET /api/action/datastore_search_sql`
   - Base URL: `https://catalogue.data.govt.nz`
   - Purpose: SQL-style DataStore query endpoint
   - Official page labels this as the SQL DataStore endpoint for machine-readable data access

## Pagination, filtering, and format notes
- The reviewed official pages consistently describe JSON responses.
- `package_search` is the main metadata-search route and the official example notes a default page size of `10` results.
- The metadata guide explicitly says the API can be used to access datasets, organisations, and groups as JSON metadata.
- The DataStore guide distinguishes between a simple query route (`datastore_search`) and an SQL route (`datastore_search_sql`).
- The `q` parameter on `datastore_search` can be passed either as a string or as a field-value dictionary.

## Export and integration notes from the official guide
- The CSV-export guide says `ckanapi-exporter` can extract all dataset metadata into a single CSV file.
- The agency-export guide says an agency's datasets can be exported as a data package together with hosted or referenced data files and JSON metadata.
- The official API guide links to the data.govt.nz developer GitHub space for additional examples and reusable code.

## Error and rate-limit notes
- No public rate-limit numbers were published on the reviewed official guide pages.
- No portal-specific HTTP error catalogue was published on the reviewed official guide pages.
- Because the provider relies on CKAN and CKAN DataStore conventions, additional generic CKAN error behavior may exist, but only the data.govt.nz guide pages above were used for this manual record.

## fireROUTE normalization notes
- This provider exposes a CKAN-backed metadata API plus CKAN DataStore query endpoints rather than a single uniform REST resource tree.
- Preserve the distinction between catalogue-metadata routes (`package_metadata_show`, `resource_metadata_show`, `package_show`, `package_search`) and row-level DataStore routes (`datastore_search`, `datastore_search_sql`).
- Treat `https://catalogue.data.govt.nz` as the canonical host and keep the path-prefix split (`/api/action` versus `/api/3/action`) exactly as shown on the official pages.