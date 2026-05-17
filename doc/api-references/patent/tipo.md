# TIPO

## Provider metadata
- Category: `Patent`
- Provider slug: `tipo`
- Official docs/pages used:
  - `https://tiponet.tipo.gov.tw/Gazette/OpenData/OD/OD05.aspx?QryDS=API00`
  - `https://cloud.tipo.gov.tw/S220/opdata?QryDS=API00`
- Current public API base URL: `https://cloud.tipo.gov.tw/S220/opdataapi/api`
- Auth model: API token in query parameter `tk`
- Response format: controlled by the required `format` query parameter
- Pagination/volume control parameter: `top`
- Rate limits: no public rate-limit policy was exposed on the reviewed API-service pages
- Manually confirmed route count: `15`

## Authentication and request model
The reviewed English `API service` page publishes example URLs for every dataset using the same query pattern:

`?format={format}&top={top}&tk={token}`

Observed shared parameters:
- `format` - output format selector; the page does not enumerate allowed values on the reviewed listing page, but treats it as required in every example URL
- `top` - result-count / top-N control
- `tk` - API token

The page repeatedly instructs users to remove the curly braces from parameter values in real requests.

## Canonical endpoints
### Patent datasets
1. `GET /PatentAppl`
2. `GET /PatentPub`
3. `GET /PatentRights`
4. `GET /PatentPriority`
5. `GET /PatentDivide`
6. `GET /PatentChange`
7. `GET /PatentTwins`
8. `GET /PatentAlteration`
9. `GET /PatentAnnuity`

### Trademark datasets
10. `GET /TmarkPics`
11. `GET /TmarkAppl`
12. `GET /TmarkRights`
13. `GET /TmarkChange`
14. `GET /TmarkDivide`
15. `GET /TmarkPriority`

## Dataset notes from the official page
### Patent-side descriptions
- `PatentAppl` - patent application IPC/LOC and first-applicant nationality information
- `PatentPub` - invention disclosure / publication data including publication, patent application, patent name, applicant, inventor, agent, and link information
- `PatentRights` - patent status-change data
- `PatentPriority` - patent priority-case data
- `PatentDivide` - patent division / split-application relationships
- `PatentChange` - patent change requests including original application number, patent category, application case number, and related application categories
- `PatentTwins` - links between paired patent cases noted by the site as two related cases
- `PatentAlteration` - patent grant / transfer-style record including transferor/transferee information
- `PatentAnnuity` - annual-fee payment records and effective-year information

### Trademark-side descriptions
- `TmarkPics` - trademark image-library dataset with image download paths and related trademark metadata
- `TmarkAppl` - trademark registration application data
- `TmarkRights` - trademark status-change / rights data
- `TmarkChange` - trademark registration-change record
- `TmarkDivide` - trademark division record
- `TmarkPriority` - trademark application priority information

## Example request pattern
The official page publishes examples such as:
- `https://cloud.tipo.gov.tw/S220/opdataapi/api/PatentAppl?format={format}&top={top}&tk={token}`
- `https://cloud.tipo.gov.tw/S220/opdataapi/api/TmarkRights?format={format}&top={top}&tk={token}`

## Response and usage notes
- The portal describes these APIs as URL-based access to open patent and trademark materials.
- The reviewed listing page does not publish a shared OpenAPI document or a shared error schema.
- The site warns that the information is provided for value-added purposes only and should not be used as the basis for approval or rejection; official Intellectual Property Office publications remain authoritative.

## Pagination and limits
- The shared `top` parameter is the only explicit result-window parameter shown on the reviewed official listing pages.
- No cursor, page-number, or offset parameter was exposed on the reviewed pages.
- No public rate-limit quota was published on the reviewed pages.

## fireROUTE normalization notes
- Normalize auth as query-token `tk`.
- Treat `format` as a required transport/output modifier rather than business filtering.
- Preserve the strong separation between patent and trademark datasets: the official site lists them as distinct endpoint families even though they share the same host and query pattern.
- Because the reviewed docs page is dataset-list oriented rather than schema-first, downstream adapters should keep raw endpoint names (`PatentAppl`, `TmarkRights`, etc.) visible rather than over-normalizing them.
