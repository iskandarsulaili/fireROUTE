# EPO

## Provider metadata
- Category: `Patent`
- Provider slug: `epo`
- Official docs/pages manually reviewed in this pass:
  - `https://www.epo.org/en/searching-for-patents/data/web-services/ops`
  - `https://developers.epo.org/`
  - `https://ops.epo.org/wsdl/ops.yaml`
  - `https://www.epo.org/en/service-support/ordering/terms-and-conditions/ops-terms-and-conditions`
- Current public API product: `Open Patent Services (OPS)`
- Confirmed API host: `https://ops.epo.org`
- Confirmed REST base path: `/3.2/rest-services`
- Confirmed base URL: `https://ops.epo.org/3.2/rest-services`
- Primary auth model: OAuth application credentials / client credentials
- Primary response formats: `application/xml`, `application/json`, `application/javascript` for most data routes
- Binary/media response formats also exposed: `application/pdf`, `application/tiff`, `image/png`, `image/tiff`, `image/gif`
- Manually confirmed route count: `46`

## Overview
The current official EPO pages expose a usable public route inventory through the linked first-party OpenAPI YAML for `Open Patent Services (OPS)`. The official site describes OPS as a RESTful web service over a standardized interface, while the OpenAPI file confirms the current host, base path, auth scheme, route families, response formats, and exact method/path inventory.

The reviewed public pages also confirm that OPS data comes from the EPO's bibliographic, worldwide legal event, full-text, and image databases, and that developers must register an application and handle authentication using OAuth.

## Authentication
The official developer portal says to:
1. register for access credentials,
2. define a test app,
3. test the APIs in the developer area,
4. handle authentication using `OAuth`.

The official OpenAPI YAML defines a security scheme named `client-credentials` with:
- token URL: `https://ops.epo.org/3.2/auth/accesstoken?grant_type=client_credentials`
- authorization URL: `http://ops.epo.org/3.2/auth/accesstoken?grant_type=client_credentials`
- scope: `core`

All reviewed operations in the OpenAPI file reference this same security scheme.

## Rate limits and commercial threshold
The public `Open Patent Services (OPS)` page exposes a weekly volume policy rather than a per-second request quota:
- non-paying users: `Up to 4 GB of data per week` -> `Free`
- paying users: `More than 4 GB of data per week` -> annual subscription required
- published annual subscription price on the reviewed page: `EUR 2 800`

The linked terms page also states that the free weekly volume is subject to a threshold and that usage must respect the EPO fair-use charter.

No per-minute or per-second HTTP rate-limit headers or `429` policy were exposed in the reviewed official materials.

## Pagination and result-windowing
OPS does not expose cursor or page-number pagination in the reviewed OpenAPI spec.

Instead, the search and some image endpoints use a `Range` request parameter:
- published search default: `1-25`
- register search default: `1-25`
- image retrieval `Range`: page number, default `1`

The reviewed docs therefore point to range/window-based retrieval rather than offset/cursor pagination.

## Error model and response notes
The official OpenAPI file defines a shared default error object:
- object name: `fault` in XML
- fields:
  - `code`
  - `message`

Across the reviewed operations, the visible response map is:
- success: `200`
- error fallback: `default` -> shared `Error` definition

The reviewed spec does not publish richer per-route error-code tables on the route definitions themselves.

## Request and format conventions
### Shared response formats
Most non-binary OPS routes produce:
- `application/xml`
- `application/json`
- `application/javascript`

Special media routes produce:
- published image retrieval: `application/pdf`, `application/tiff`, `image/png`, `image/tiff`
- CPC media retrieval: `image/gif`

### GET vs POST pattern
Many retrieval families expose both:
- `GET` routes for a single document/reference in the path
- `POST` routes for batch-style retrieval variants

The reviewed OpenAPI spec marks these POST variants as consuming:
- `text/plain`

The POST request body uses a shared `Body` schema that resolves to a plain string payload.

## Route inventory
The official OpenAPI file exposes `46` operations: `28` `GET` and `18` `POST`.

### Published data (`20` operations)
1. `GET /published-data/search`
2. `GET /published-data/search/{constituent}`
3. `GET /published-data/{type}/{format}/{number}/biblio`
4. `POST /published-data/{type}/{format}/biblio`
5. `GET /published-data/{type}/{format}/{number}/abstract`
6. `POST /published-data/{type}/{format}/abstract`
7. `GET /published-data/{type}/{format}/{number}/full-cycle`
8. `POST /published-data/{type}/{format}/full-cycle`
9. `GET /published-data/{type}/{format}/{number}/fulltext`
10. `POST /published-data/{type}/{format}/fulltext`
11. `GET /published-data/{type}/{format}/{number}/description`
12. `POST /published-data/{type}/{format}/description`
13. `GET /published-data/{type}/{format}/{number}/claims`
14. `POST /published-data/{type}/{format}/claims`
15. `GET /published-data/{type}/{format}/{number}/equivalents`
16. `POST /published-data/{type}/{format}/equivalents`
17. `GET /published-data/{type}/{format}/{number}/images`
18. `POST /published-data/{type}/{format}/images`
19. `GET /published-data/images/{image-country}/{image-number}/{image-kind}/{image-type}`
20. `POST /published-data/images`

### Family (`6` operations)
21. `GET /family/{type}/{format}/{number}`
22. `POST /family/{type}/{format}`
23. `GET /family/{type}/{format}/{number}/biblio`
24. `POST /family/{type}/{format}/biblio`
25. `GET /family/{type}/{format}/{number}/legal`
26. `POST /family/{type}/{format}/legal`

### Legal (`2` operations)
27. `GET /legal/{type}/{format}/{number}`
28. `POST /legal/{type}/{format}`

### Register (`10` operations)
29. `GET /register/search`
30. `GET /register/search/{constituent}`
31. `GET /register/{type}/{format}/{number}/biblio`
32. `POST /register/{type}/{format}/biblio`
33. `GET /register/{type}/{format}/{number}/events`
34. `POST /register/{type}/{format}/events`
35. `GET /register/{type}/{format}/{number}/procedural-steps`
36. `POST /register/{type}/{format}/procedural-steps`
37. `GET /register/{type}/{format}/{number}/upp`
38. `POST /register/{type}/{format}/upp`

### Classification (`6` operations)
39. `GET /classification/cpc/{class}`
40. `GET /classification/cpc/{class}/{subclass}`
41. `POST /classification/cpc`
42. `GET /classification/cpc/media/{media-name}`
43. `GET /classification/cpc/search`
44. `GET /classification/map/{input-format}/{class}/{subclass}/{output-format}`

### Number service (`2` operations)
45. `GET /number-service/{type}/{input-format}/{number}/{output-format}`
46. `POST /number-service/{type}/{input-format}/{output-format}`

## Parameter notes from sampled official route definitions
### Published search
`GET /published-data/search`
- query `q` - required search query
- query `Range` - optional result window, default `1-25`

`GET /published-data/search/{constituent}`
- path `constituent` - enum: `biblio`, `full-cycle`, `abstract`
- query `q` - required
- query `Range` - optional, default `1-25`

### Published retrieval
`GET /published-data/{type}/{format}/{number}/biblio`
- path `type` - enum: `application`, `priority`, `publication`
- path `format` - enum: `docdb`, `epodoc`
- path `number` - patent reference number

`POST /published-data/{type}/{format}/biblio`
- same path enums as above
- body is required
- request content type: `text/plain`

The same GET/POST path pattern repeats across the official `abstract`, `full-cycle`, `fulltext`, `description`, `claims`, `equivalents`, and `images` published-data families.

### Image retrieval
`GET /published-data/images/{image-country}/{image-number}/{image-kind}/{image-type}`
- `image-country`
- `image-number`
- `image-kind`
- `image-type`
- query `Range` - required page number, default `1`
- response formats: `application/pdf`, `application/tiff`, `image/png`, `image/tiff`

### Family and legal
`GET /family/{type}/{format}/{number}`
- `type` - enum: `application`, `priority`, `publication`
- `format` - enum: `docdb`, `epodoc`

`GET /legal/{type}/{format}/{number}`
- follows the same `type` / `format` / `number` reference pattern

### Register
`GET /register/search`
- query `q` - required search query
- query `Range` - optional, default `1-25`

`GET /register/search/{constituent}`
- path `constituent` - enum: `biblio`, `events`, `procedural-steps`, `upp`
- query `q` - required
- query `Range` - optional, default `1-25`

`GET /register/{type}/{format}/{number}/biblio`
- path `type` - enum: `application`, `publication`
- path `format` - enum: `epodoc`
- path `number` - required reference number

The reviewed official register retrieval routes repeat the same reference pattern for `events`, `procedural-steps`, and `upp`.

### Classification
`GET /classification/cpc/search`
- query `q` - required search query

`GET /classification/map/{input-format}/{class}/{subclass}/{output-format}`
- path `input-format` - enum: `cpc`, `ecla`
- path `class`
- path `subclass`
- path `output-format` - enum: `cpc`, `ecla`, `ipc`
- query `additional` - required boolean; docs describe this as invention/additional resolution selection

`GET /classification/cpc/media/{media-name}`
- binary/media response: `image/gif`

### Number service
`GET /number-service/{type}/{input-format}/{number}/{output-format}`
- path `type` - enum: `application`, `priority`, `publication`
- path `input-format` - enum: `docdb`, `original`
- path `number` - required source reference number
- path `output-format` - enum: `docdb`, `epodoc`, `original`

## Important usage notes
- The public EPO site still describes OPS primarily as a standardized XML service even though the OpenAPI spec also exposes JSON and JavaScript output on most non-binary routes.
- The developer portal is still relevant operationally: registration, app creation, and OAuth handling are required before real use.
- POST retrieval variants should be preserved in fireROUTE rather than collapsed into GET-only equivalents; the official spec exposes them explicitly across multiple route families.
- The route surface is strongly organized by patent workflow domains: published data, family, legal, register, classification, and number normalization.
- The official site also links XML schemas for OPS, DOCDB exchange documents, full-text documents, legal data, and CPC-related structures, which is a signal that downstream consumers should preserve field-level fidelity rather than over-normalizing away EPO-specific document structure.

## fireROUTE normalization notes
- Normalize this provider to the official OPS base URL `https://ops.epo.org/3.2/rest-services`.
- Normalize auth as OAuth/client-credentials-backed application access, with the token endpoint kept exactly as documented.
- Preserve GET and POST variants as separate operations because the official OpenAPI publishes them separately.
- Treat `Range` as the official result-window control where present; do not invent cursor or offset semantics.
- Preserve binary/media operations distinctly from JSON/XML data retrieval, especially image and CPC media endpoints.
