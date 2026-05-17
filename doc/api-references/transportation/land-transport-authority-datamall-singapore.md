# Land Transport Authority DataMall, Singapore

## Provider metadata
- Category: `Transportation`
- Provider slug: `land-transport-authority-datamall-singapore`
- Provider identity confirmed from the reviewed official pages in this pass as: `LTA DataMall`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf`
  - official alternative page: `https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html`
  - additional official pages reviewed in this pass:
    - `https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html`
    - `https://datamall.lta.gov.sg/content/datamall/en/api-terms-of-service.html`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The official Dynamic Datasets page loaded successfully with title `LTA | Dynamic Datasets`.
- That page visibly links the assigned route reference as `API Documentation (PDF, 1.5MB)`.
- The same page publicly reports `30 datasets found`.
- The visible category groupings in this pass were:
  - `Public Transport`
  - `Traffic`
  - `Active Mobility`
  - `Geospatial`
  - `Electric Vehicle Charging Network`
- The first visible dataset entries in this pass included:
  - `Approved Road Works`
  - `Bicycle Parking`
  - `Bus Arrival`
  - `Bus Routes`
  - `Bus Services`
  - `Bus Stops`
- The visible dataset cards expose official XML and JSON artifacts and show frequency labels such as `Real-Time`, `Monthly`, and `Ad-Hoc`.
- The official Request For API Access page loaded successfully with title `LTA | Request For API Access`.
- That page confirms the access workflow collects applicant name, email, contact number, optional company name, usage-purpose categories (`Mobile APP`, `Website/Portal`, `Research`, `Student Projects`, `Others`), a free-text description, a verification code, and explicit acceptance of the `Singapore Open Data Licence` plus `Terms of Service for API and SDK`.
- The official Terms page loaded successfully and exposed heading `LTA API Terms of Service`.
- That page explicitly states that callers can use the APIs up to `10 million` times a day and that LTA may suspend or terminate access if the threshold is exceeded.
- The same terms page also states that API use may be subject to additional API-specific terms, that callers must use issued access-control credentials where applicable, and that callers must follow published technical and security requirements.
- The assigned official PDF guide opened successfully in the browser PDF viewer in this pass and the viewer exposed the file name `LTA_DataMall_API_User_Guide.pdf` with `80` pages.
- However, the available browser tooling in this environment did not surface the PDF body text, so the endpoint tables, request URLs, parameter grids, auth syntax, and route-specific notes inside the official guide were not safely readable.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf`
- Public catalog page confirmed: `https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html`
- Provider API base URL: not safely confirmable from the readable HTML pages alone in this pass.
- Endpoint paths: not safely confirmable because the authoritative route reference is concentrated in the PDF guide and its route text was not readable here.
- HTTP methods: not safely confirmable from accessible route-level documentation in this pass.
- Parameters or request bodies:
  - the request page confirms account / credential provisioning exists
  - the catalog confirms many named API-backed datasets
  - full per-route parameter tables were not safely readable in this pass
- Authentication:
  - official request workflow exists
  - terms page confirms issued access-control credentials are used where applicable
  - exact request-level header or query syntax was not readable from accessible route-level docs in this pass
- Rate limits:
  - `10 million` calls per day threshold
- Pagination:
  - the HTML catalog itself is paginated
  - API-pagination rules were not safely readable in this pass
- Errors: no route-level error schema was safely confirmable from accessible official material in this pass.
- Response formats:
  - the public catalog confirms XML and JSON dataset outputs are available
  - route-level response schemas were not safely readable in this pass
- Important usage notes:
  - DataMall currently advertises `30` dynamic datasets
  - the official PDF guide is clearly presented as the route-level documentation source
  - the public HTML pages expose platform, access, and quota facts, but not enough route detail for fireROUTE publication

## Why this provider remains blocked
- I manually reviewed the official dynamic-dataset catalog first, then the access-request page, then the API terms page, and then opened the assigned official PDF guide in this pass.
- The official HTML pages provide strong confirmation that the platform is live and that the PDF guide is the authoritative route reference.
- However, because the PDF body text did not become readable through the available browser tooling here, I could not safely verify the exact endpoint inventory, request paths, methods, parameter tables, auth syntax, or route-specific notes.
- Because the concrete route-level contract could not be extracted safely from the official source in this pass, this provider remains `manual_blocked`.

## Sources inspected
- `https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html`
- `https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html`
- `https://datamall.lta.gov.sg/content/datamall/en/api-terms-of-service.html`
- `https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf`
