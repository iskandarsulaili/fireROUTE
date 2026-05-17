# BitWarden

## Provider metadata
- Category: `Security`
- Provider slug: `bitwarden`
- Docs used manually:
  - `https://bitwarden.com/help/api/`
  - the same official page's built-in authorization dialog and operation list
- Confirmed API server bases from the reviewed official page:
  - US: `https://api.bitwarden.com`
  - EU: `https://api.bitwarden.eu`
- Confirmed token endpoints from the official authorization dialog:
  - US identity server: `https://identity.bitwarden.com/connect/token`
  - EU identity server: `https://identity.bitwarden.eu/connect/token`
- Primary response format: JSON exposed through an OpenAPI/Swagger-style reference UI
- Authentication model confirmed from the reviewed official page:
  - OAuth2 `clientCredentials`
  - required scope: `api.organization`
  - server region and token region must match
- Manually confirmed routes in this pass: `28`

## Authentication
- The official `Authorize` dialog on Bitwarden's public API page documents two OAuth2 client-credentials configurations:
  - `US_server (OAuth2, clientCredentials)` with token URL `https://identity.bitwarden.com/connect/token`
  - `EU_server (OAuth2, clientCredentials)` with token URL `https://identity.bitwarden.eu/connect/token`
- Confirmed scope from the official dialog:
  - `api.organization`
- The official page explicitly warns:
  - `your authorization must match the server you have selected`
- This provider file documents the **Public API** only. The official page separately points users looking for the Vault Management API to a different Bitwarden document.

## Common request/response conventions
- All reviewed routes live under `/public/...` on the selected API server.
- The official page describes the Public API as organization-management tooling for:
  - members
  - collections
  - groups
  - event logs
  - policies
  - organization subscription/import tasks
- The reviewed documentation is an OpenAPI-style UI, so operation titles and route paths are very clear, while some cross-cutting prose details (for example rate limits) are sparse.

## Manually confirmed endpoint inventory

### Collections
1. `GET /public/collections/{id}` - retrieve a collection
2. `PUT /public/collections/{id}` - update a collection
3. `DELETE /public/collections/{id}` - delete a collection
4. `GET /public/collections` - list all collections

### Events
5. `GET /public/events` - list all events

### Groups
6. `GET /public/groups/{id}` - retrieve a group
7. `PUT /public/groups/{id}` - update a group
8. `DELETE /public/groups/{id}` - delete a group
9. `GET /public/groups/{id}/member-ids` - retrieve a group's member IDs
10. `PUT /public/groups/{id}/member-ids` - update a group's members
11. `GET /public/groups` - list all groups
12. `POST /public/groups` - create a group

### Members
13. `GET /public/members/{id}` - retrieve a member
14. `PUT /public/members/{id}` - update a member
15. `DELETE /public/members/{id}` - remove a member
16. `GET /public/members/{id}/group-ids` - retrieve a member's group IDs
17. `PUT /public/members/{id}/group-ids` - update a member's groups
18. `GET /public/members` - list all members
19. `POST /public/members` - create a member
20. `POST /public/members/{id}/reinvite` - re-invite a member
21. `POST /public/members/{id}/revoke` - revoke a member's access to an organization
22. `POST /public/members/{id}/restore` - restore a member

### Organization
23. `GET /public/organization/subscription` - retrieve the current organization subscription details
24. `PUT /public/organization/subscription` - update the organization's Password Manager and/or Secrets Manager subscription
25. `POST /public/organization/import` - import members and groups

### Policies
26. `GET /public/policies/{type}` - retrieve a policy
27. `PUT /public/policies/{type}` - update a policy
28. `GET /public/policies` - list all policies

## Path and body parameter notes
- Confirmed path parameters directly visible from the reviewed route list:
  - `{id}` - used across collection, group, and member detail routes
  - `{type}` - used for policy retrieval/update routes
- The reviewed page clearly exposes method/path/operation titles for all `28` routes above.
- In this browser session, the public docs UI did **not** expose one easy flat text dump of every request-body field without expanding each operation individually, so this file documents the route inventory and the auth model exactly as confirmed, without inventing undocumented body schemas.
- Operational semantics directly visible from the official route titles include:
  - collection/group/member detail routes are ID-addressed
  - group membership is managed through `/member-ids`
  - member group assignments are managed through `/group-ids`
  - policy selection uses a typed path parameter rather than a numeric ID

## Pagination
- The reviewed official page did not expose a standalone pagination guide.
- The operation list clearly distinguishes collection/list endpoints such as `/public/events`, `/public/groups`, `/public/members`, `/public/collections`, and `/public/policies`.
- The reviewed UI also surfaced response-model names containing `PagedListResponseModel` for some list operations, which suggests paged response envelopes, but the visible page text in this pass did not clearly expose the exact page-query parameters. This file therefore records pagination support only at that conservative level.

## Rate limits
- No explicit rate-limit table was visible on the reviewed official public API page in this pass.
- This file does not infer undocumented throttling numbers.

## Error and response notes
- The official page is strongest on route inventory and auth setup; it is less explicit in the visible anonymous session about one global error envelope.
- Because the reference is OpenAPI/Swagger-based, responses are presented as structured JSON models tied to each operation.
- The reviewed page did not surface a single global prose error section with published HTTP code semantics comparable to some other providers, so this file avoids inventing a canonical error table.

## Response format notes
- The reviewed page labels the API as `latest OAS 3.0`.
- Responses are documented in JSON model terms within the Bitwarden reference UI.
- List operations are represented as collection/list response models, and some list-model names surfaced in the UI include paged-list wording.

## Important usage notes
- The Bitwarden page reviewed here documents the **Public API**, not the separate Vault Management API.
- Region matters twice:
  - choose the correct API server (`api.bitwarden.com` or `api.bitwarden.eu`)
  - obtain OAuth2 tokens from the matching identity host
- The authorization dialog on the official page is a critical part of the documentation because it is where the token URLs, OAuth flow, and required scope are actually spelled out.

## Verification notes
This file was manually rebuilt from Bitwarden's current official Public API page and its built-in official authorization dialog, replacing the earlier generated placeholder summary.