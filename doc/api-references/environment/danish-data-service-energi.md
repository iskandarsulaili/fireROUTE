# Danish data service Energi

## Provider metadata
- Category: `Environment`
- Provider slug: `danish-data-service-energi`
- Official docs inspected manually:
  - `https://www.energidataservice.dk/`
  - `https://en.energinet.dk/energy-data/data-catalog/`
  - `https://api.energidataservice.dk/index.html`
- Confirmed API base URL: `https://api.energidataservice.dk`
- Response formats confirmed from docs: JSON for API responses, downloadable file formats for dataset exports
- Authentication model: no auth requirement was visible in the public Swagger UI for the inspected endpoints
- Manually confirmed routes in this pass: `15`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/dataset/{datasetName}` | Query records from a named dataset | required `datasetName`; dataset-specific filters, ordering, paging, and column filters |
| GET | `/dataset/{datasetName}/download` | Download dataset rows in a selected export format | required `datasetName`; format and query filters |
| GET | `/meta/Dataset` | List datasets | optional metadata filters |
| GET | `/meta/Dataset/search` | Search datasets | documented search-style query parameters |
| GET | `/meta/Dataset/{datasetName}` | Get metadata for one dataset | required `datasetName` |
| GET | `/meta/Group` | List groups | none highlighted |
| GET | `/meta/Group/{groupName}` | Get one group definition | required `groupName` |
| GET | `/News/actual` | Get current operational/info message | none highlighted |
| GET | `/News` | List news messages | none highlighted |
| GET | `/News/calendar` | Get news calendar entries | none highlighted |
| GET | `/News/archived` | Get archived messages | none highlighted |
| GET | `/meta/Organization` | List organizations | none highlighted |
| GET | `/meta/Organization/{organizationName}` | Get one organization definition | required `organizationName` |
| GET | `/meta/Tag/{datasetName}` | List tags for a dataset | required `datasetName` |
| GET | `/meta/TagGroup` | List tag groups with tags | none highlighted |

## Usage notes
- The public data catalog links dataset landing pages to the API platform and public Swagger UI.
- Dataset pages expose interactive filtering, ordering, format selection, and download actions.
- Dataset-specific schemas, filterable columns, freshness, and coverage are published on each dataset page rather than on one global parameter table.

## Rate limits, pagination, and errors
- The front page explicitly warns that differentiated rate limits are being introduced on Energi Data Service.
- The inspected public Swagger overview did not expose a single universal numeric quota table in-view.
- Record-list endpoints are designed around dataset querying and export/download flows; dataset pages expose ordering and filter controls.

## Important fireROUTE notes
- This is a dataset platform rather than a single-purpose air-quality or emissions API.
- Real integration work should pin specific dataset names needed by fireROUTE instead of treating the entire catalog as one homogeneous schema.

## Verification notes
This file was manually rebuilt from Energi Data Service's public site, data catalog, and Swagger UI.