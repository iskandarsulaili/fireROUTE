# NPR One

## Overview
- Provider: NPR API / Content Distribution Service (CDS)
- Category: News
- Indexed docs URL: `http://dev.npr.org/api/`
- Current official API overview page: `https://api.npr.org/`
- Current official documentation set: `https://npr.github.io/content-distribution-service/`
- Base URL: `https://content.api.npr.org/v1`
- API style: REST over HTTPS with JSON documents and JSON Schema profile resources
- Auth: bearer-token authorization is required for CDS document endpoints and subscription confirmation; profile, schema, and client-profile endpoints are documented as open access
- HTTPS: yes
- Response format: JSON
- Pagination: `offset` + `limit`; default query size `20`; maximum `limit` `300`; `limit + offset` must be `<= 2000`
- Rate limits: no numeric public rate limit was stated on the pages reviewed; the endpoint reference warns that any endpoint may return `503 Service Unavailable` and clients should retry later

## Current official platform state
- The current official NPR API overview page states that the old Story API is retired and directs users to request access to NPR's newer API, the Content Distribution Service (CDS).
- The CDS docs describe it as NPR's proprietary system for validation, ingestion, and distribution of content.
- fireROUTE should therefore treat the currently documented NPR API surface as CDS rather than the retired Story API.

## Confirmed endpoint surfaces

| Method | Path | Auth required? | Notes |
|---|---|---|---|
| GET | `/documents/{documentId}` | Yes | Retrieve one CDS document by ID; supports `transclude`. |
| GET | `/documents` | Yes | Query documents with filtering, sorting, pagination, and optional `transclude`. |
| PUT | `/documents/{documentId}` | Yes | Create or update a document. |
| DELETE | `/documents/{documentId}` | Yes | Delete a document by ID. |
| GET | `/profiles/{profileName}` | No | Fetch one CDS profile in JSON Schema form. |
| GET | `/profiles` | No | List current CDS profiles. |
| GET | `/schemas/{schemaName}` | No | Fetch one CDS JSON schema. |
| GET | `/client-profiles/{profileName}` | No | Fetch one client profile schema. |
| GET | `/client-profiles` | No | Query client profiles with `offset` and `limit`. |
| POST | `/subscriptions/confirmations` | Yes | Confirm a CDS notification subscription. |

## Authentication and authorization
- For protected endpoints, the docs require `Authorization: Bearer YOUR-TOKEN`.
- The getting-started guide says CDS keys are issued through NPR Member Partnership.
- Read access: the docs state that authorized clients have read access to all CDS data, subject to premium-content handling rules.
- Write access is constrained by:
  - document ID prefix rules
  - `authorizedOrgServiceIds`
- The docs state that unauthorized modification/deletion attempts can be rejected with `403` when no matching `authorizedOrgServiceIds` entry exists.

## Document retrieval and querying
- Single-document retrieval path: `GET /v1/documents/{documentId}`.
- The only documented query parameter for single-document retrieval is `transclude`.
- Document-query path: `GET /v1/documents`.
- The docs describe document querying as authenticated HTTP requests against `/v1/documents` with zero or more query parameters.

## Confirmed document query parameters
### Filtering
The querying guide documents these filter parameters:
- `collectionIds`
- `editorialLastModifiedDateTime`
- `excludedOwnerHrefs`
- `excludedIds`
- `excludedProfileIds`
- `ids`
- `ownerHrefs`
- `nprWebsitePaths`
- `profileIds`
- `publishDateTime`
- `recommendUntilDateTime`
- `showDates`
- `seasonNumber`

### Filtering semantics
- Comma-separated multiple values within one parameter are treated as logical `OR`.
- Different query parameters are combined with logical `AND`.
- Repeating the same parameter separately also creates `AND` behavior.
- Some parameters have exclusion counterparts such as `excludedProfileIds`.

### Date handling
- Date/time filters accept RFC 3339 date-times.
- Some filters also accept full dates.
- Date ranges use the `...` ellipsis operator.
- The docs warn that full-date requests are currently interpreted with an automatically appended EST offset unless an explicit RFC 3339 date-time is provided.
- `showDates` accepts full-date values only, not date-time values.

## Pagination and sorting
- Query pagination uses:
  - `limit`
  - `offset`
- `offset` is 0-based.
- CDS does not support cursor-based pagination.
- Default query size is `20` documents.
- Maximum `limit` is `300`.
- CDS will not return results beyond the 2000th document, so `limit + offset` must stay `<= 2000`.
- Default sort order is `publishDateTime` descending.
- Sorting uses the `sort` parameter with documented shape:
  - `sort=<type>[:<direction>[:<missing>]][,<type2>[:<direction2>[:<missing2>]]]`

## Transclude notes
For `GET /documents/{documentId}`, the docs explicitly call out these `transclude` values:
- `collections`
- `bylines`
- `layout`
- `transcript`
- `items`

Important transclude caveats documented by NPR:
- `bylines` only works for text-only bylines and will not pull biography documents.
- `transcript` is currently not working as expected according to the docs note.

## Profiles and schemas
- `GET /v1/profiles/{profileName}` returns one CDS profile in JSON Schema form.
- `GET /v1/profiles` returns the current profile list.
- `GET /v1/schemas/{schemaName}` returns an individual CDS JSON Schema object.
- `GET /v1/client-profiles/{profileName}` returns one client profile schema.
- `GET /v1/client-profiles` supports `limit` and `offset` with the same `<= 2000` combined bound described on the page.

## Publishing / update notes
- `PUT /v1/documents/{documentId}` both updates existing documents and creates new ones.
- The docs list:
  - `200` for successful update
  - `201` for successful creation
- Validation failures return `400` with details in `meta.messages`.
- Publishing rules in the getting-started guide require valid IDs, required profiles, and organization metadata.

## Subscription confirmation
- `POST /v1/subscriptions/confirmations` is documented only for internal NPR users, not member-station scope.
- It requires authorization.
- The endpoint expects a JSON-encoded body containing data from a CDS subscription confirmation message.

## Error and status notes
Documented status behavior includes:
- `200` successful retrieval/query/update responses
- `201` successful document creation via `PUT`
- `204` successful document deletion
- `400` invalid query parameters, invalid schema/profile requests, or validation failures
- `401` invalid/unrecognized authorization token on subscription confirmation
- `403` authorization failure for writes when permissions do not match the document
- `404` document/schema/profile not found
- `503` temporary service unavailability on any endpoint, with official guidance to retry later

Other response notes:
- `GET /documents` returns `200` with an empty `resources` array when no matching documents are found.
- Error examples are typically returned under `meta.messages`.

## Integration notes for fireROUTE
- Model NPR as CDS, not the retired Story API.
- Preserve bearer-token auth for protected endpoints.
- Keep document-query filters, sort syntax, and pagination semantics intact rather than flattening them into simpler ad hoc params.
- Respect CDS's offset/limit bounds and default sorting behavior.
- Treat open profile/schema endpoints separately from the authenticated document endpoints.
- Retry on `503` rather than treating it as a permanent failure.

## Route-count note
- The current official CDS documentation exposes `10` confirmed route surfaces.

## Sources inspected
- `http://dev.npr.org/api/`
- `https://api.npr.org/`
- `https://npr.github.io/content-distribution-service/`
- `https://npr.github.io/content-distribution-service/getting-started.html`
- `https://npr.github.io/content-distribution-service/api-reference/endpoints/`
- `https://npr.github.io/content-distribution-service/api-reference/endpoints/document/`
- `https://npr.github.io/content-distribution-service/api-reference/endpoints/profile/`
- `https://npr.github.io/content-distribution-service/api-reference/endpoints/subscription/`
- `https://npr.github.io/content-distribution-service/api-reference/core-concepts/querying/`
- `https://npr.github.io/story-api-retirement/`
