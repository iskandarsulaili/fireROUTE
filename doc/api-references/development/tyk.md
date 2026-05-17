# Tyk

## Provider metadata
- Category: `Development`
- Provider slug: `tyk`
- Docs used manually:
  - `https://tyk.io/docs/tyk-gateway-api`
  - `https://raw.githubusercontent.com/TykTechnologies/tyk-docs/refs/heads/production/swagger/nightly/gateway-swagger.yml`
- Confirmed REST API base URL: `https://{tenant}` with docs default `localhost:8080`
- Primary media types: JSON request and response bodies
- Authentication model surfaced in docs: shared admin secret sent in `x-tyk-authorization` header
- Manually confirmed routes in this pass: `39`

## Authentication
From the official docs:
- the Gateway API requires the `secret` configured in `tyk.conf`
- callers must send that shared secret in header `x-tyk-authorization: <your-secret>`
- the docs explicitly warn that this API is for internal automation/integration and should not be exposed to outside parties
- the Tyk docs also note that the Gateway API is subsumed by the Dashboard API in Pro installations

## Common request/response conventions
- Base URL template from the official OpenAPI document: `https://{tenant}`
- Default server variable shown in docs: `localhost:8080`
- Reviewed routes use `GET`, `POST`, `PUT`, and `DELETE`
- Reviewed request bodies are JSON for object-creation/update flows such as API definitions, keys, policies, OAuth clients, and batch requests
- Reviewed successful responses are JSON objects or arrays
- Many admin mutation routes update stored definitions but still require a reload step before changes become live on the gateway
- The docs present the Gateway API as a low-level administrative surface for community/open-source and internal automation use cases

## Manually confirmed endpoint set

### Health, schema, reload, and batch endpoints
1. `GET /hello` - health check; docs note the endpoint name can be renamed with `health_check_endpoint_name`
2. `GET /tyk/reload` - hot-reload a single gateway node; reviewed query parameter `block` waits for completion
3. `GET /tyk/reload/group` - reload a group / cluster node set
4. `POST /{listen_path}/tyk/batch` - submit a batch request envelope to an API listen path; reviewed path parameter `listen_path`
5. `GET /tyk/schema` - fetch the OAS schema; reviewed query parameter `oasVersion`

### Classic API-definition management
6. `GET /tyk/apis` - list API definitions
7. `POST /tyk/apis` - create an API definition
8. `GET /tyk/apis/{apiID}` - fetch one API definition
9. `PUT /tyk/apis/{apiID}` - update one API definition
10. `DELETE /tyk/apis/{apiID}` - delete one API definition
11. `/tyk/apis/{apiID}/versions` - version-management path for classic definitions

Reviewed parameters and body fields visible in the classic API-definition docs include:
- path parameter `apiID`
- creation query parameters `base_api_id`, `base_api_version_name`, `new_version_name`, `set_default`
- reviewed request-body fields such as `api_id`, `name`, `org_id`, `proxy.listen_path`, `proxy.target_url`, `proxy.strip_listen_path`, `auth.auth_header_name`, `definition.key`, `definition.location`, `use_oauth2`, and `version_data`

### OAS API-definition management
12. `/tyk/apis/oas`
13. `/tyk/apis/oas/{apiID}`
14. `/tyk/apis/oas/{apiID}/export`
15. `/tyk/apis/oas/{apiID}/versions`
16. `/tyk/apis/oas/export`
17. `/tyk/apis/oas/import`

These six path templates are explicitly present in the official Gateway OpenAPI document and cover OAS listing/creation, per-API access, export, version handling, and import/export flows.

### Cache and certificate management
18. `/tyk/cache/{apiID}`
19. `/tyk/cache/jwks/{apiID}`
20. `/tyk/cache/jwks`
21. `/tyk/certs`
22. `/tyk/certs/{certID}`

These path templates are explicitly present in the official Gateway OpenAPI document for cache invalidation and certificate CRUD/listing flows, and the adjacent `/tyk/debug` admin/diagnostic path is also part of the confirmed inventory.

### Keys, debug, key preview, and organisation quotas
23. `/tyk/debug`
24. `/tyk/keys`
25. `/tyk/keys/{keyID}`
26. `/tyk/keys/create`
27. `/tyk/keys/policy/{keyID}`
28. `/tyk/keys/preview`
29. `/tyk/org/keys`
30. `/tyk/org/keys/{keyID}`

Reviewed key-management details visible in the OpenAPI document include:
- `GET|POST|PUT|DELETE /tyk/keys/{keyID}` for reading, importing/creating, updating, and deleting a specific key
- `POST /tyk/keys/create` to generate a new key
- reviewed query parameters `hashed` and `suppress_reset`
- reviewed session/policy fields such as `access_rights`, `apply_policies`, `org_id`, `alias`, `per`, `rate`, `quota_max`, `quota_renewal_rate`, `throttle_interval`, `throttle_retry_limit`, `tags`, and `meta_data`
- the key-read example explicitly surfaces rate-limit and quota counters inside the session object

### Policy management
31. `/tyk/policies`
32. `/tyk/policies/{polID}`

Reviewed policy details visible in the OpenAPI document include:
- `GET|PUT|DELETE /tyk/policies/{polID}`
- reviewed path parameter `polID`
- policy object fields such as `id`, `name`, `access_rights`, `active`, `is_inactive`, `per`, `rate`, `quota_max`, `quota_renewal_rate`, `partitions`, `tags`, and `meta_data`

### OAuth client and token management
The remaining confirmed OAuth-related path templates in the official Gateway OpenAPI document are:
- `/tyk/oauth/clients/{apiID}`
- `/tyk/oauth/clients/{apiID}/{keyName}`
- `/tyk/oauth/clients/{apiID}/{keyName}/rotate`
- `/tyk/oauth/clients/{apiID}/{keyName}/tokens`
- `/tyk/oauth/clients/apis/{appID}`
- `/tyk/oauth/clients/create`
- `/tyk/oauth/refresh/{keyName}`
- `/tyk/oauth/revoke`
- `/tyk/oauth/revoke_all`
- `/tyk/oauth/tokens`

Reviewed OAuth details visible in the OpenAPI document include:
- `POST /tyk/oauth/clients/create` to create a client
- reviewed request-body fields `api_id`, `client_id`, `description`, `redirect_uri`, `secret`, and `meta_data`
- `DELETE /tyk/oauth/tokens` with required query `scope=lapsed` to purge lapsed tokens

> Note: the manually confirmed route count for README purposes is `39` path templates from the official Gateway API OpenAPI document. The numbered inventory above intentionally mixes path-template coverage with a few method-level callouts on multi-method paths so the main admin capabilities are easier to read.

## Pagination
- the reviewed Gateway API docs did not document a general pagination protocol for the administrative endpoints examined in this pass
- reviewed listing routes (`/tyk/apis`, policy listings, certificate listings, etc.) return whole JSON collections in the examples shown

## Rate limits and quotas
- the reviewed public Gateway API docs did not publish a numeric requests-per-minute limit for the admin API itself
- the API does expose key and policy objects that contain downstream quota/rate settings (`rate`, `per`, `quota_max`, `quota_renewal_rate`, `throttle_interval`, `throttle_retry_limit`) for managed consumer credentials
- because this is an internal admin surface protected by the shared secret, the docs focus on configuration/state management rather than public-rate-limit guidance

## Error and response notes
Representative status codes explicitly visible across the reviewed official docs include:
- `400 Bad Request`
- `403 Forbidden`
- `404 Not Found`
- `405 Method Not Allowed`
- `422 Unprocessable Entity`
- `500 Internal Server Error`

Representative response patterns confirmed in reviewed route examples:
- success objects such as `{ "status": "ok", ... }`
- mutation results with fields like `action`, `key`, and `status`
- error objects with `message` and `status`
- collection responses for API lists, certificate lists, and batch-response arrays

## Important usage notes
- the Tyk Gateway API is explicitly documented as an internal automation/admin API, not a public third-party integration surface
- classic API-definition writes and updates do not automatically make changes live; the docs repeatedly pair those operations with reload behavior
- Pro installations should prefer the Dashboard API when that product layer is present
- the route inventory reviewed here mixes legacy/classic API-definition management with newer OAS-specific paths
- batch requests are scoped under an API listen path rather than the `/tyk/...` admin prefix

## Verification notes
This file was manually rebuilt from the official Tyk Gateway API documentation page and the linked official Gateway OpenAPI document using browser inspection.