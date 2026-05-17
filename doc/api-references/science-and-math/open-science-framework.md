# Open Science Framework

## Provider metadata
- Category: `Science & Math`
- Provider slug: `open-science-framework`
- Official docs/pages used:
  - `https://developer.osf.io/` (official OSF API v2 documentation)
  - The same official docs site's `Authentication`, `Pagination`, `Filtering`, and `Errors & Error Codes` sections as reviewed in-browser
- Current public API base URL: `https://api.osf.io/v2/`
- Auth model: mixed public/private access; the docs say authenticated flows use OAuth `2.0` web-application flow, and developer applications can be created from OSF settings
- Methods confirmed from the official docs site: `GET`, `POST`, `PATCH`, `DELETE`
- Response format notes: the docs state the API follows the JSON API specification with top-level `data`, `links`, and `meta` conventions
- Rate-limit notes: no numeric public quota was published on the reviewed official pages
- Manually confirmed route-family count: `22`

## Canonical top-level route families
The official docs expose a very large resource tree with many nested relationship endpoints. The top-level families visibly documented from the official docs are:

1. `/v2/users/`
2. `/v2/nodes/`
3. `/v2/registrations/`
4. `/v2/preprints/`
5. `/v2/files/`
6. `/v2/collections/`
7. `/v2/providers/`
8. `/v2/institutions/`
9. `/v2/comments/`
10. `/v2/licenses/`
11. `/v2/actions/`
12. `/v2/addons/`
13. `/v2/applications/`
14. `/v2/citations/`
15. `/v2/identifiers/`
16. `/v2/schemas/`
17. `/v2/schema_responses/`
18. `/v2/wikis/`
19. `/v2/draft_registrations/`
20. `/v2/regions/`
21. `/v2/scopes/`
22. `/v2/subjects/`

### Additional special/internal family shown in the docs
- The reviewed docs also expose CEDAR metadata routes under `/_/cedar_metadata_records/...` and taxonomy / token routes beneath the broader API tree.

## Path patterns explicitly visible in the official docs
Examples visible in the reviewed docs include:
- `GET /v2/users/me/`
- `GET /v2/nodes/`
- `GET /v2/institutions/`
- `GET /v2/actions/reviews/`
- `GET|POST /v2/applications/`
- `GET|PATCH|DELETE /v2/applications/{client_id}/`
- `POST /v2/applications/{client_id}/reset/`
- `POST /v2/files/{file_id}/cedar_metadata_records/`
- `POST /v2/nodes/{node_id}/cedar_metadata_records/`
- `GET /v2/citations/styles/`
- `GET /v2/comments/{comment_id}/`
- `GET /v2/collections/`
- `GET /v2/providers/collections/{provider_id}/submissions/`
- `GET /v2/files/{file_id}/versions/`
- `GET /v2/licenses/`
- `GET /v2/institutions/{institution_id}/users/`
- `GET /v2/institutions/{institution_id}/nodes/`
- `GET /v2/institutions/{institution_id}/registrations/`

## Common parameters and request conventions
### Pagination
- The reviewed docs say all entity-collection endpoints respond to the `page` query parameter according to the JSON:API spec.
- The docs encourage clients to follow the pagination links returned in the response instead of manually constructing page URLs.

### Filtering
- The reviewed docs show `filter[<fieldname>]` style filters.
- The filtering section says string queries use substring matching.

### JSON:API / response conventions
- The docs explicitly reference the JSON API specification.
- The reviewed JSON:API guidance says meta information is exposed at a top-level `meta` object.
- The `meta` object includes totals and current page sizing information.

### Embedding / sparse-fieldset conventions
- The navigation and usage sections reviewed in the official docs show dedicated sections for filtering, sparse fieldsets, embedding, request formatting, and entities/collections, indicating these are first-class API features across many resources.

## Error notes
The reviewed official docs explicitly describe at least these errors:
- `400 Bad Request` - malformed or unacceptable request data.
- `401 Unauthorized` - authentication required but not provided.
- `403 Forbidden` - request understood but not permitted.

## Usage notes
- OSF API v2 is broad; many documented resources also expose nested `relationships` and subresource URLs that are not practical to enumerate fully in a short fireROUTE summary.
- Public read access exists for some resources, but authenticated write and account-specific endpoints use OAuth 2.0.
- The docs are organized by resource family plus shared cross-cutting features, so integrations should treat OSF as a large JSON:API platform rather than a single-purpose endpoint.

## fireROUTE normalization notes
- Normalize the provider around the shared base `https://api.osf.io/v2/`.
- Preserve the JSON:API response model and link-based pagination behavior.
- Keep route families grouped by top-level resource (`users`, `nodes`, `registrations`, `files`, etc.) rather than collapsing them into one generic search surface.
- Expose OAuth 2.0 only where the upstream docs require authenticated access; leave public read routes unauthenticated when appropriate.
