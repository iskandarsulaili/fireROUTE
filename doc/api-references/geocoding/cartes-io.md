# Cartes.io

## Provider metadata
- Category: `Geocoding`
- Provider slug: `cartes-io`
- Official docs used manually:
  - `https://github.com/M-Media-Group/Cartes.io/wiki/API`
  - `https://docs.cartes.io/`
- Public API base URL documented by provider: `https://cartes.io`
- Transport: `HTTPS`
- Auth model: no global API key is required for general access; created maps and markers return one-time tokens used for later edits/deletes, and marker creation may require either `Authorization: {api_key}` or `map_token` depending on the map's settings
- Response formats documented: `JSON` when callers send `Accept: application/json`

## Product and access notes
- The official GitHub wiki page is explicitly marked as legacy and says the docs have moved to `https://docs.cartes.io`.
- The legacy wiki remains the only current official page I could inspect in this run that exposed route-level API details.
- The docs say Cartes.io lets callers create maps and markers and retrieve up-to-date information through the API.
- When a map is created through the API, the map object returns a token once; that token is required for later map edits or deletes.
- When a marker is created through the API, the marker object likewise returns a token once; that token is required for later marker edits or deletes.

## Confirmed API surface
The inspected official legacy docs confirm these `26` request patterns:
1. `GET /api/categories`
2. `GET /api/categories/search`
3. `GET /api/categories/{category-id}/related`
4. `GET /api/maps`
5. `POST /api/maps`
6. `GET /api/maps/search`
7. `DELETE /api/maps/{map-uuid}`
8. `GET /api/maps/{map-uuid}`
9. `PUT /api/maps/{map-uuid}`
10. `DELETE /api/maps/{map-uuid}/claim`
11. `GET /api/maps/{map-uuid}/claim`
12. `POST /api/maps/{map-uuid}/claim`
13. `GET /api/maps/{map-uuid}/images/static`
14. `GET /api/maps/{map-uuid}/markers`
15. `POST /api/maps/{map-uuid}/markers`
16. `GET /api/maps/{map-uuid}/markers/bulk`
17. `POST /api/maps/{map-uuid}/markers/bulk`
18. `GET /api/maps/{map-uuid}/markers/file`
19. `POST /api/maps/{map-uuid}/markers/file`
20. `DELETE /api/maps/{map-uuid}/markers/{marker-id}`
21. `GET /api/maps/{map-uuid}/markers/{marker-id}`
22. `PUT /api/maps/{map-uuid}/markers/{marker-id}`
23. `GET /api/maps/{map-uuid}/markers/{marker-id}/locations`
24. `POST /api/maps/{map-uuid}/markers/{marker-id}/locations`
25. `GET /api/maps/{map-uuid}/related`
26. `GET /api/user`

## Shared request rules
- Base route family: `https://cartes.io/api`
- To request JSON responses, send header `Accept: application/json`.
- The docs do not publish a page-number or cursor pagination scheme in the inspected material.
- The docs do publish `429 TOO MANY REQUESTS` as a possible response, but no numeric rate-limit ceiling was visible in the accessible official text inspected in this run.

## Route groups and parameters

### Categories
- `GET /api/categories`
  - Purpose: list categories.
- `GET /api/categories/search`
  - Purpose: search categories.
  - Query parameters visibly referenced in the docs/examples: `q`.
- `GET /api/categories/{category-id}/related`
  - Purpose: retrieve related categories.
  - Path parameter: `category-id`.

### Maps
- `GET /api/maps`
  - Purpose: list maps.
  - Query parameters visibly referenced in docs/examples: `ids`, `category_ids`, `withMine`, `with`, `orderBy`, `query`.
- `POST /api/maps`
  - Purpose: create a map.
  - Auth note: the docs say no API key is needed to create maps; the response returns a one-time `token` for later resource updates/deletes.
- `GET /api/maps/search`
  - Purpose: map search endpoint.
  - Query parameters visibly referenced in docs/examples: `q`.
- `GET /api/maps/{map-uuid}`
- `PUT /api/maps/{map-uuid}`
- `DELETE /api/maps/{map-uuid}`
  - Path parameter: `map-uuid`.
  - Auth note: update/delete operations rely on the one-time `token` returned when the map was created.
- `GET /api/maps/{map-uuid}/claim`
- `POST /api/maps/{map-uuid}/claim`
- `DELETE /api/maps/{map-uuid}/claim`
  - Path parameter: `map-uuid`.
  - Docs note: this is part of the map ownership / claiming flow.
- `GET /api/maps/{map-uuid}/images/static`
  - Path parameter: `map-uuid`.
  - Purpose: fetch a static image for a map.
- `GET /api/maps/{map-uuid}/related`
  - Path parameter: `map-uuid`.
  - Purpose: fetch related maps.

### Markers
- `GET /api/maps/{map-uuid}/markers`
- `POST /api/maps/{map-uuid}/markers`
  - Path parameter: `map-uuid`.
  - Marker-auth rules from the official docs:
    - if anyone can create markers, no auth parameter is required
    - if only logged-in people can create markers, provide `api_key` or `map_token`
    - if only the map owner can create markers, provide `map_token`
    - when using API-key auth, the docs say to send the key in the `Authorization` header
- `GET /api/maps/{map-uuid}/markers/bulk`
- `POST /api/maps/{map-uuid}/markers/bulk`
  - Path parameter: `map-uuid`.
  - Purpose: bulk marker operations.
- `GET /api/maps/{map-uuid}/markers/file`
- `POST /api/maps/{map-uuid}/markers/file`
  - Path parameter: `map-uuid`.
  - Purpose: file-based marker import/export flow.
- `GET /api/maps/{map-uuid}/markers/{marker-id}`
- `PUT /api/maps/{map-uuid}/markers/{marker-id}`
- `DELETE /api/maps/{map-uuid}/markers/{marker-id}`
  - Path parameters: `map-uuid`, `marker-id`.
  - Auth note: when a marker is created through the API, the returned marker object includes a one-time token needed for later edits/deletes.
- `GET /api/maps/{map-uuid}/markers/{marker-id}/locations`
- `POST /api/maps/{map-uuid}/markers/{marker-id}/locations`
  - Path parameters: `map-uuid`, `marker-id`.
  - Purpose: work with marker locations/history.

### User
- `GET /api/user`
  - Purpose: retrieve current user information.

## Response, errors, and format notes
- The docs explicitly list these status codes:
  - `200 OK`
  - `201 CREATED`
  - `400 BAD REQUEST`
  - `401 UNAUTHENTICATED`
  - `403 UNAUTHORISED`
  - `404 NOT FOUND`
  - `429 TOO MANY REQUESTS`
  - `500 INTERNAL SERVER ERROR`
- The inspected official docs emphasize JSON responses via the `Accept: application/json` header.
- No separate XML, CSV, or GraphQL surface was documented on the inspected Cartes.io API reference pages.

## Canonical fireROUTE notes
- Preserve Cartes.io's token-based resource lifecycle exactly: map and marker creation are comparatively open, while later mutation depends on returned one-time tokens or map-level auth settings.
- Keep marker-creation auth logic provider-specific because it depends on server-side map settings, not only on a single global credential model.
- Treat the legacy GitHub wiki as route-authoritative for now, but keep a follow-up note that the provider says the docs have moved to `docs.cartes.io`.

## Verification notes
- This file was manually rebuilt from the live official Cartes.io wiki plus the live `docs.cartes.io` home page using browser tools only.
