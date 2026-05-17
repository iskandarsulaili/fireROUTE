# Beeceptor

## Provider metadata
- Category: `Development`
- Provider slug: `beeceptor`
- Docs used manually:
  - `https://beeceptor.com/docs/api/beeceptor-api/`
  - `https://beeceptor.com/docs/openapi/beeceptor-openapi-v2.yaml`
- Confirmed management API base URL: `https://api.beeceptor.com/api`
- Primary media type: JSON
- Authentication: API key in the `Authorization` header
- Manually confirmed routes in this pass: `29`

## Authentication
From Beeceptor's official v2 management API docs and OpenAPI spec:
- the management API uses an `apiKey` security scheme
- the key is sent in the HTTP header named `Authorization`
- the docs describe these APIs as endpoint-management APIs for configuring and inspecting Beeceptor mock servers, not the mocked traffic itself

## Common request/response conventions
- Full route prefix: `https://api.beeceptor.com/api/v2`
- Core path parameter:
  - `endpoint` - the Beeceptor endpoint name, e.g. `order-service` from `https://order-service.proxy.beeceptor.com`
- reviewed endpoints return JSON envelopes such as:
  - `{ "data": [...] }`
  - object payloads for created/updated resources
  - pagination objects where the route supports pagination
- documented reusable error families in the spec include `400`, `401`, `403`, `404`, and `500`
- the docs emphasize that Beeceptor evaluates rules in strict top-to-bottom order, with the first match winning
- if no rule matches, the docs say Beeceptor falls back in this order: Local Tunnel -> HTTP Proxy -> OpenAPI Spec -> default `200 OK` response

## Manually confirmed endpoint set

### Mock Rules
1. `GET /v2/endpoints/{endpoint}/rules` - list all rules in execution order
2. `POST /v2/endpoints/{endpoint}/rules` - create a new rule at the bottom of the rule list
3. `PUT /v2/endpoints/{endpoint}/rules` - bulk replace all rules
4. `DELETE /v2/endpoints/{endpoint}/rules` - delete all rules
5. `POST /v2/endpoints/{endpoint}/rules/reorder` - reorder rules
6. `GET /v2/endpoints/{endpoint}/rules/{ruleId}` - fetch one rule
7. `PUT /v2/endpoints/{endpoint}/rules/{ruleId}` - full update of a rule
8. `PATCH /v2/endpoints/{endpoint}/rules/{ruleId}` - partial update of a rule
9. `DELETE /v2/endpoints/{endpoint}/rules/{ruleId}` - delete a rule

Important rule-model details confirmed from the official docs/spec:
- rule fields include `enabled`, `method`, `description`, `conditions`, and `action`
- supported HTTP methods in the rule schema include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `TRACE`, and `*`
- the docs describe conditions as 1-5 matching criteria evaluated with AND semantics
- the docs explicitly call out matching against method, path/regex, headers, body content, and stateful conditions
- the spec says path conditions can use regex with named groups for extracted path parameters

### Blob upload
10. `POST /v2/endpoints/{endpoint}/blobs` - upload a blob file for use in mock behavior

### Request History
11. `GET /v2/endpoints/{endpoint}/requests` - list request history
12. `DELETE /v2/endpoints/{endpoint}/requests` - delete request history
13. `GET /v2/endpoints/{endpoint}/requests/{requestId}` - fetch one request log
14. `DELETE /v2/endpoints/{endpoint}/requests/{requestId}` - delete one request log
15. `GET /v2/endpoints/{endpoint}/requests/{requestId}/multipart/download` - download a multipart-uploaded file from a stored request

Request-history parameters and behavior explicitly documented:
- `limit` - default `20`, maximum `100`
- `cursor` - cursor for the next page
- the docs describe additional filters including time range, method, path, status, body search, behavior, rule-match flag, and multipart-only filtering
- request history is cursor-paginated, newest first
- the docs state request history is retained for up to `10 days`
- `mode=verbose` returns full request/response payload details, callout details, and multipart metadata
- if sensitive-header masking is enabled, masked data is marked as redacted

### Endpoint settings
16. `GET /v2/endpoints/{endpoint}/settings` - fetch endpoint settings
17. `PATCH /v2/endpoints/{endpoint}/settings` - update endpoint settings

Settings object fields explicitly visible in the official example:
- `security.enabled`, `security.headerKey`, `security.headerValue`
- `cors.origins[]`
- `locale`
- `rateLimit.enabled`, `rateLimit.rate`, `rateLimit.period`
- `crud.autoDelete`
- `customDomain.enabled`, `customDomain.domain`
- `mtls.enabled`
- `localTunnel`
- `proxy.targetUrl`, `proxy.ignoreSSLErrors`
- `rules.enabled`

### State Store
18. `GET /v2/endpoints/{endpoint}/state` - list state variables
19. `PUT /v2/endpoints/{endpoint}/state` - bulk upsert state variables
20. `DELETE /v2/endpoints/{endpoint}/state` - bulk delete state variables
21. `GET /v2/endpoints/{endpoint}/state/{type}/{key}` - fetch a single state item
22. `DELETE /v2/endpoints/{endpoint}/state/{type}/{key}` - delete a single state item

State-store parameters and schema details explicitly documented:
- list query parameters:
  - `limit`
  - `offset`
  - `type` - enum shown as `string`, `counter`, `list`
  - `keyPrefix`
- bulk upsert body shape includes `items[]`
- response examples show state items with:
  - `type`
  - `key`
  - `value`
  - `lastModified`
- list responses include a `pagination` object with `total`, `limit`, `offset`, and `hasMore`

### API specifications and async jobs
23. `GET /v2/endpoints/{endpoint}/specs` - get uploaded API-spec metadata
24. `POST /v2/endpoints/{endpoint}/specs` - upload an API specification asynchronously
25. `DELETE /v2/endpoints/{endpoint}/specs` - remove the uploaded API specification
26. `GET /v2/endpoints/{endpoint}/jobs/{jobId}` - poll background job status

Specification-upload details explicitly documented:
- upload route consumes `multipart/form-data`
- request fields:
  - `file` - binary spec file, max `2.5MB`
  - `intelligenceMock` - boolean to enable AI-driven mock response generation
- supported spec types mentioned on the reviewed page/spec: `openapi`, `grpc`, `graphql`, `wsdl`
- the async upload returns `202 Accepted` and a job object with fields such as `jobId`, `status`, `type`, and `message`

### mTLS certificates
27. `GET /v2/endpoints/{endpoint}/mtls/certificates` - list mTLS client certificates
28. `POST /v2/endpoints/{endpoint}/mtls/certificates` - generate/add an mTLS certificate
29. `DELETE /v2/endpoints/{endpoint}/mtls/certificates/{certId}` - delete an mTLS certificate

mTLS details explicitly documented:
- create body requires `name`
- list/create responses include certificate objects with:
  - `id`
  - `name`
  - `cert`
  - `key`
  - `expiry`
  - `createdAt`

## Pagination
- `GET /requests` uses cursor pagination with `limit`, `cursor`, and `pagination.hasMore`
- `GET /state` uses offset-style pagination with `limit`, `offset`, and a pagination object
- the reviewed docs did not publish a single universal pagination scheme across every endpoint

## Rate limits
- the management API docs/spec reviewed in this pass do not publish a global numeric control-plane rate limit
- the endpoint settings schema does expose runtime mock-endpoint rate-limit settings with `rateLimit.enabled`, `rateLimit.rate`, and `rateLimit.period`
- I did not infer a platform-wide admin-API quota that the official docs did not explicitly state

## Error and response notes
- the spec uses reusable error responses including `Unauthorized`, `Forbidden`, `NotFound`, `BadRequest`, and `InternalError`
- many success responses use a top-level `data` wrapper
- delete/update routes often return compact JSON result objects rather than empty responses
- spec uploads are asynchronous and must be followed by job-status polling

## Important usage notes
- these are Beeceptor management APIs, not the runtime URLs your application sends mocked traffic to
- rules are evaluated in order; creating a new rule appends it to the bottom unless you later reorder it
- request history includes behavior metadata such as `mock-rule`, `proxy`, `callout`, `grpc`, `wsdl`, `graphql`, `tunnel`, and `oas`
- request history can expose uploaded-file metadata, while actual file content is downloaded from the multipart-download route
- the docs explicitly distinguish endpoint settings, state-store data, request history, and spec-management as separate API families

## Verification notes
This file was manually rebuilt from Beeceptor's official API docs page and its linked official OpenAPI specification using browser inspection.