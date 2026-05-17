# City, Prague Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `city-prague-open-data`
- Official docs/pages used:
  - `http://opendata.praha.eu/en`
  - `https://opendata.praha.eu/`
  - `https://api.lkod.cz/`
  - `https://api.lkod.cz/api-docs/`
  - `https://api.lkod.cz/api-docs/swagger-ui-init.js`
  - `https://api.lkod.cz/status`
  - `https://api.lkod.cz/public/founders/praha`
  - `https://api.lkod.cz/lod/03bdf7d6-a255-4e22-83f9-4b17b6822602/catalog`
  - `https://api.lkod.cz/lod/03bdf7d6-a255-4e22-83f9-4b17b6822602/catalog?publishers=mhmp`
  - `https://api.lkod.cz/public/datasets?limit=1`
  - `https://api.lkod.cz/public/organizations`
- Assigned docs URL: `http://opendata.praha.eu/en`
- Current documented API base URL: `https://api.lkod.cz`
- Official API docs URL: `https://api.lkod.cz/api-docs/`
- Authentication model: bearer token (`bearerAuth`) for most management/admin routes; public catalog/status/LOD routes are unauthenticated in the official OpenAPI document
- Response formats: JSON for most routes; `application/ld+json` for `/lod/{founderId}/catalog` and `/lod/{founderId}/catalog/{datasetId}`
- Rate limits: no public rate-limit policy was published in the reviewed official docs or live responses
- Pagination: `limit` and `offset` on dataset listing routes such as `/datasets` and `/public/datasets`
- Error format: live 400 responses returned JSON `{ "error_message": "Bad request", "error_status": 400 }`; the official spec also documents route-specific `401`, `403`, `404`, `409`, `413`, `415`, `500`, and `503` responses
- Manually confirmed canonical route count: `36`

## Official usage notes
- The assigned English landing page `https://opendata.praha.eu/en` currently resolves to the official Prague portal but shows a localized `404 - Bohužel, stránka neexistuje.` page in this run.
- The root Prague portal `https://opendata.praha.eu/` loaded correctly and its rendered HTML embedded organization IRIs on `https://api.lkod.cz/organization/...`, revealing the backend API host used by the portal.
- The live API root `https://api.lkod.cz/` and `https://api.lkod.cz/status` both returned `{"app_name":"Golemio LKOD Backend API","status":"Up","version":"2.1.0"}`.
- The official Swagger UI is hosted on the live API domain at `https://api.lkod.cz/api-docs/`.
- The embedded OpenAPI document inside `swagger-ui-init.js` identifies `Golemio LKOD API`, OpenAPI `3.0.0`, and exposes `36` path templates.
- `GET /public/founders/praha` returned founder id `03bdf7d6-a255-4e22-83f9-4b17b6822602` and Prague visual configuration details.
- `GET /lod/03bdf7d6-a255-4e22-83f9-4b17b6822602/catalog` returned JSON-LD with `domovská_stránka: https://opendata.praha.eu`, directly tying the API catalog output back to the Prague portal.

## Important live-behavior caveat
- The official OpenAPI document lists unauthenticated `GET /public/organizations` and `GET /public/datasets` routes with `200` responses.
- In this run, both live requests returned `400 Bad request` JSON envelopes instead of the documented success payloads.
- The LOD routes and `public/founders/{slug}` route did work, so fireROUTE should treat the `public/*` list endpoints cautiously until Prague fixes or clarifies that live behavior.

## Auth, pagination, and error notes
- Most management endpoints inherit global `bearerAuth` security from the official OpenAPI document.
- Public/status routes with no bearer requirement include:
  - `/datasets.csv`
  - `/form-data`
  - `/health`
  - `/status`
  - `/status/files`
  - `/status/images`
  - `/lod/{founderId}/catalog`
  - `/lod/{founderId}/catalog/{datasetId}`
  - `/public/themes`
  - `/public/organizations`
  - `/public/datasets`
  - `/public/datasets/{datasetId}`
  - `/public/founders/{slug}`
- Pagination/filter parameters confirmed from the official OpenAPI document include:
  - `/datasets`: `organizationId`, `status`, `publisherIri`, `keywords`, `formatIris`, `themeIris`, `limit`, `offset`
  - `/public/datasets`: `publisher_slug`, `theme_iris`, `format_iris`, `keywords`, `search_text`, `limit`, `offset`
  - `/lod/{founderId}/catalog`: required path `founderId`, optional query `publishers`
- Live error envelopes for bad public requests used JSON with `error_message` and `error_status`.
- Storage-related routes in the official spec explicitly document `503` responses for file/image availability issues.

## Canonical endpoint paths confirmed from the official OpenAPI document

### Authorization
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/change-password`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Users
- `GET /users`
- `POST /users`
- `GET /users/me`
- `PATCH /users/{userId}`
- `DELETE /users/{userId}`

### Datasets and files
- `GET /datasets`
- `POST /datasets`
- `GET /datasets/{datasetId}`
- `PATCH /datasets/{datasetId}`
- `DELETE /datasets/{datasetId}`
- `GET /datasets/{datasetId}/files`
- `POST /datasets/{datasetId}/files`
- `DELETE /datasets/{datasetId}/files/{filename}`
- `GET /datasets.csv`

### Lookup helpers
- `GET /lookup/publishers`
- `GET /lookup/themes`
- `GET /lookup/formats`
- `GET /lookup/keywords`

### Sessions
- `POST /sessions`

### Organizations
- `GET /organizations`
- `POST /organizations`
- `PATCH /organizations/{organizationId}`
- `DELETE /organizations/{organizationId}`
- `POST /organizations/{organizationId}/members/{userId}`
- `DELETE /organizations/{organizationId}/members/{userId}`

### Founders
- `GET /founders`
- `POST /founders`
- `PUT /founders/visual-config/images/{type}`
- `GET /founders/{founderId}`
- `PATCH /founders/{founderId}`
- `DELETE /founders/{founderId}`

### Utility and status
- `POST /form-data`
- `GET /health`
- `GET /status`
- `GET /status/files`
- `GET /status/images`

### LOD and public catalogue
- `GET /lod/{founderId}/catalog`
- `GET /lod/{founderId}/catalog/{datasetId}`
- `GET /public/themes`
- `GET /public/organizations`
- `GET /public/datasets`
- `GET /public/datasets/{datasetId}`
- `GET /public/founders/{slug}`

## Live route confirmations
- `GET /status`
  - Returned `app_name`, `status`, and `version`.
- `GET /public/founders/{slug}`
  - Live confirmation: `/public/founders/praha` returned Prague founder id `03bdf7d6-a255-4e22-83f9-4b17b6822602` plus `visualConfiguration` keys such as `name`, `siteTitle`, `primaryColor`, `secondaryColor`, and asset URLs.
- `GET /lod/{founderId}/catalog`
  - Returned `application/ld+json` with Prague homepage `https://opendata.praha.eu` and many dataset IRIs.
- `GET /lod/{founderId}/catalog?publishers=mhmp`
  - Returned a publisher-filtered JSON-LD catalog titled `Magistrát hl. m. Prahy - Katalog otevřených dat Golemio`.
- `GET /public/organizations` and `GET /public/datasets`
  - Both are documented in the official OpenAPI file but returned live `400` JSON errors in this run.

## fireROUTE normalization notes
- Normalize Prague against the live backend host `https://api.lkod.cz`, not the broken `/en` page path.
- Treat this provider as a mixed admin/public backend: bearer-authenticated management routes plus public JSON/JSON-LD catalogue routes.
- Prefer the LOD routes and `public/founders/{slug}` for stable anonymous catalog access; mark `/public/datasets` and `/public/organizations` as unstable until revalidated.
- Preserve JSON-LD handling for `/lod/...` responses because those are the clearest officially working public catalog endpoints tied back to Prague.
