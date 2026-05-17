# Zube

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `zube`
- Docs/pages reviewed manually:
  - `https://zube.io/docs/api`
  - `view-source:https://zube.io/docs/api` (used to inspect the full official documentation source when the rendered page was difficult to read through the browser tooling)
- Confirmed API base URL: `https://zube.io/api`
- Primary exchange format: JSON over HTTPS
- Manually confirmed routes in this pass: `176`
- Route-method breakdown confirmed from the current official docs:
  - `83` `GET`
  - `31` `POST`
  - `33` `PUT`
  - `29` `DELETE`

## What the official docs confirm
- Zube publishes a single current API documentation page that was last updated `Apr 2, 2025` in the reviewed source.
- The official docs describe a JWT-based authentication flow built around a generated private key, a `Client Id`, a short-lived refresh JWT, and a 24-hour access JWT.
- The route surface currently spans `176` documented method+path operations across `14` endpoint sections:
  - `Person`
  - `Accounts`
  - `Cards`
  - `Categories`
  - `Custom Fields`
  - `Epics`
  - `Epic Lists`
  - `Labels`
  - `Notifications`
  - `Projects`
  - `Sprints`
  - `Sources`
  - `Tickets`
  - `Workspaces`

## Authentication
From the current official docs:
- To start, a user generates a private API key pair inside the Zube UI and receives a `Client Id`.
- Access-token issuance route:
  - `POST /api/users/tokens`
- Token request headers shown by the docs:
  - `Authorization: Bearer <refresh_jwt>`
  - `X-Client-ID: CLIENT_ID`
  - `Accept: application/json`
- Standard authenticated API request headers shown by the docs:
  - `Authorization: Bearer <access_jwt>`
  - `X-Client-ID: CLIENT_ID`
  - `Accept: application/json`
- The refresh JWT must be signed with the generated private key using `RS256`.
- The official docs say:
  - refresh JWT expiry can be at most `10 minutes`
  - returned access JWT is valid for `24 hours`

## Rate limits
From the current official docs:
- Maximum sustained request rate: `1 request per second`
- Short bursts slightly above that rate may be tolerated, but the docs warn against extended higher-rate usage.
- The docs explicitly say never to make concurrent requests.
- The docs warn that rate-limit violations or abuse can cause request rejection and possible suspension from future API usage.

## Pagination, filtering, ordering, selection, and caching
From the current official docs:
- Default paginated list size: `30` items per page
- Documented pagination parameters:
  - `page`
  - `per_page`
- Documented ordering parameters:
  - `order[by]`
  - `order[direction]` with `asc` or `desc`
- Documented filtering convention:
  - `where[...]` such as `where[project_id]=3`
- Documented field-selection convention:
  - `select[]` such as `select[]=id&select[]=title`
- The docs also recommend ETag-based caching:
  - responses often include `ETag`
  - clients can send `If-None-Match`
  - unchanged responses may return `304 Not Modified`

## Request body and format notes
From the current official docs:
- `POST` and `PUT` body data should be valid JSON.
- Requests with body data should include `Content-Type: application/json`.
- Example create-card body shown by the docs:
  - `{"project_id":YOUR_PROJECT_ID,"title":"Hello World"}`

## Error notes
- The reviewed official docs do not publish one centralized HTTP status-code table for the whole API.
- The current official docs do explicitly document `304 Not Modified` for conditional requests with `ETag` / `If-None-Match`.
- The current official docs also explicitly state that rate-limit and abuse violations will result in rejected requests, but the reviewed page does not publish one shared rejection-body schema.

## Important usage notes
- Zube Organizations are referred to as `accounts` in the API.
- The access-token exchange is separate from all other API routes and depends on the generated private key plus `Client Id`.
- Because the docs discourage concurrent requests and cap throughput at roughly one request per second, fireROUTE adapters should serialize calls unless a later official update says otherwise.
- The filtering, ordering, and field-selection syntax is consistent across many list routes, so raw query passthrough is important.

## Confirmed route surface summary
The current official docs expose `176` method+path operations across these endpoint sections:
- `Person` -> `1`
- `Accounts` -> `9`
- `Cards` -> `42`
- `Categories` -> `4`
- `Custom Fields` -> `10`
- `Epics` -> `16`
- `Epic Lists` -> `6`
- `Labels` -> `5`
- `Notifications` -> `3`
- `Projects` -> `32`
- `Sprints` -> `6`
- `Sources` -> `8`
- `Tickets` -> `15`
- `Workspaces` -> `19`

## Representative route examples confirmed from the current official docs
- `POST /api/users/tokens`
- `GET /api/current_person`
- `GET /api/accounts`
- `GET /api/accounts/:account_id`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/cards`
- `POST /api/cards`
- `PUT /api/cards/:card_id`
- `GET /api/projects/:project_id/tickets`
- `POST /api/projects/:project_id/epics`
- `GET /api/workspaces`
- `PUT /api/workspaces/:workspace_id`

## Integration notes for fireROUTE
- Treat Zube as a large authenticated JSON API rooted at `https://zube.io/api`.
- Preserve raw headers and query parameters because `Authorization`, `X-Client-ID`, `page`, `per_page`, `where[...]`, `order[...]`, `select[]`, and `If-None-Match` are part of the documented contract.
- Token issuance should be modeled separately from normal resource routes.
- Respect the documented non-concurrent, roughly-one-request-per-second usage policy when building adapters.