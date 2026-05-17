# Hasura

## Provider metadata
- Category: `Development`
- Provider slug: `hasura`
- Docs used manually:
  - `https://hasura.io/docs/2.0/api-reference/graphql-api/index/`
  - `https://hasura.io/docs/2.0/api-reference/graphql-api/query/`
  - `https://hasura.io/docs/2.0/api-reference/version/`
  - `https://hasura.io/docs/2.0/api-reference/health/`
  - `https://hasura.io/docs/2.0/api-reference/config/`
  - `https://hasura.io/docs/2.0/api-reference/explain/`
  - `https://hasura.io/docs/2.0/auth/authentication/index/`
  - `https://hasura.io/docs/2.0/auth/authentication/admin-secret-access/`
- Confirmed base URL pattern: deployment-specific Hasura host, for example `https://my-graphql-engine.com`
- Confirmed API path families: `/v1/graphql`, `/v1alpha1/graphql`, `/v1/version`, `/healthz`, `/hasura/healthz`, `/v1alpha1/config`, `/v1/graphql/explain`
- Primary format: JSON over HTTPS
- Manually confirmed routes in this pass: `7`

## Authentication
Hasura's docs are explicit that authentication is handled outside Hasura itself, while Hasura consumes session variables to enforce authorization.

Confirmed auth details from the official docs:
- User authentication can be integrated via JWT or a webhook-based auth service.
- Session variables such as `X-Hasura-Role`, `X-Hasura-User-Id`, and similar `X-Hasura-*` values drive authorization behavior.
- Admin access can bypass permissions when `X-Hasura-Admin-Secret` is sent without additional session variables.
- Admin-only routes can also be accessed through the `admin` role when the JWT/webhook-authenticated identity provides that role.
- The docs warn that the admin secret must never be exposed in front-end clients.

## Common request/response conventions
- GraphQL operations are sent as `POST` requests.
- Request bodies for JSON endpoints should use `Content-Type: application/json`.
- `GET /v1/version`, `GET /healthz`, and `GET /hasura/healthz` are public endpoints according to the reviewed docs.
- `/v1/graphql` always returns HTTP `200` responses, even when the GraphQL operation has request or internal errors; the docs explicitly contrast this with `/v1alpha1/graphql`, which used `4xx`/`5xx` for request/internal failures.
- The docs explicitly note that the GraphQL API supports batched requests by accepting an array of operations and returning an array of responses.

## Manually confirmed endpoint set

### 1) GraphQL API
- Methods: `POST`
- Paths:
  - `/v1/graphql`
  - `/v1alpha1/graphql`
- Purpose: execute queries, subscriptions, and mutations against the auto-generated GraphQL schema.
- Officially documented behavior:
  - all GraphQL requests for queries, subscriptions, and mutations go to this API
  - batching is supported by sending an array of operations
- Body format:
  - standard GraphQL JSON request payloads
  - batched arrays are also accepted
- Important note:
  - `/v1/graphql` returns `200` for all responses, while `/v1alpha1/graphql` used `4xx`/`5xx` for request and internal errors.

### 2) Query / Subscription syntax on the GraphQL API
- Method: `POST`
- Path used by the docs' GraphQL API reference: `/v1/graphql`
- Purpose: run GraphQL queries and subscriptions.
- Confirmed syntax/usage notes from the docs:
  - query and subscription operations are auto-generated from database tables and relationships
  - arguments can include filters, ordering, and pagination controls
  - `*_by_pk` forms fetch a single row by primary key
- Example operations shown by the docs include `query AuthorQuery { ... }` and `subscription AuthorSubscription { ... }`.

### 3) Version API
- Method: `GET`
- Path: `/v1/version`
- Purpose: return server type and current Hasura version.
- Auth: public; the docs say this endpoint is public and cannot be disabled.
- Sample response fields shown in the docs:
  - `server_type`
  - `version`

### 4) Health Check API
- Methods: `GET`
- Paths:
  - `/healthz`
  - `/hasura/healthz`
- Purpose: report server health.
- Query parameter:
  - `strict` - optional boolean; when `true`, metadata inconsistencies produce `500` instead of `200`
- Confirmed response semantics from the docs:
  - healthy: `200 OK`
  - inconsistent metadata with `strict=false`: `200` and `WARN: inconsistent objects in schema`
  - inconsistent metadata with `strict=true`: `500` and `ERROR: inconsistent objects in schema`
  - unhealthy: `500 ERROR`
- Auth: public and cannot be disabled according to the docs.

### 5) Config API
- Method: `GET`
- Path: `/v1alpha1/config`
- Purpose: return server configuration details.
- Auth: admin-only; the example uses `X-Hasura-Role: admin`.
- Sample response fields shown in the docs include:
  - `version`
  - `is_function_permissions_inferred`
  - `is_remote_schema_permissions_enabled`
  - `is_admin_secret_set`
  - `is_auth_hook_set`
  - `is_jwt_set`
  - `jwt`
  - `is_allow_list_enabled`
  - `live_queries`
- Availability note:
  - can be enabled/disabled through `--enabled-apis` / `HASURA_GRAPHQL_ENABLED_APIS`
  - enabled by default unless removed from the enabled API list.

### 6) Explain API
- Method: `POST`
- Path: `/v1/graphql/explain`
- Purpose: return backend-specific execution plans for queries and subscriptions.
- Auth: admin-only according to the docs.
- Request body keys confirmed in the docs:
  - `query` - required GraphQL operation to analyze
  - `user` - optional object containing `x-hasura-role` and session variables
- Response behavior confirmed from the docs:
  - query explain response is a list of plan objects with fields like `field`, `sql`, and `plan`
  - subscription explain response is a single object with `sql`, `plan`, and `variables`

### 7) Admin access behavior
- Header-driven route behavior confirmed from the official auth docs:
  - `X-Hasura-Admin-Secret` grants unrestricted admin access when sent without extra session variables
  - if admin secret is combined with `X-Hasura-Role` and user-specific headers, Hasura evaluates the request using that user/role's access-control rules instead of blanket admin bypass
- This is a cross-cutting auth rule rather than a separate transport path, but it is essential for correctly using the admin-only routes above.

## Error and response notes
- The Health API documents `200` and `500` outcomes based on health and `strict` handling.
- The Connect-style config and version pages show JSON responses.
- The Explain API examples return structured JSON objects/lists containing generated SQL and execution plans.
- For GraphQL requests on `/v1/graphql`, consumers must inspect the JSON response body for GraphQL-layer errors instead of relying solely on HTTP status.

## Pagination / rate limits
- No numeric rate-limit policy was exposed on the reviewed Hasura API reference pages.
- Pagination for GraphQL data is query-specific and exposed through GraphQL arguments rather than a platform-wide REST paging envelope.

## Important usage notes
- The provider is deployment-host-relative; there is no single shared public SaaS base for all installs.
- Hasura's docs split route semantics across GraphQL, RESTified GraphQL, health/version/config utilities, and auth guides; fireROUTE should preserve that mixed surface instead of forcing a single REST-only abstraction.
- Authentication is intentionally externalized: JWT/webhook identity feeds session variables, and those session variables drive authorization logic inside Hasura.
- Admin-only endpoints should never be proxied with a client-side admin secret.

## Verification notes
This file was manually rebuilt from official Hasura docs with browser inspection, replacing the earlier autogenerated route summary.
