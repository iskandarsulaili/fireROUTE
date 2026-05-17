# Onyx Bazaar

## Provider metadata
- Category: `Open Data`
- Provider slug: `onyx-bazaar`
- Description: `Single-query Onyx Bazaar endpoint exposed on the official onyx-actions host`
- Official docs/pages used:
  - `https://onyx-actions.onrender.com/bazaar` (indexed official provider URL)
  - `https://onyx-actions.onrender.com/docs` (official Swagger UI on the same provider-controlled host)
  - `https://onyx-actions.onrender.com/openapi.json` (official OpenAPI document exposed by the same host)
- Public API base URL confirmed from the reviewed official pages: `https://onyx-actions.onrender.com`
- Auth model: no authentication requirement is documented for `/bazaar` on the reviewed official pages; unauthenticated requests reached live validation/error responses
- Methods confirmed during manual review: `GET`
- Response formats confirmed during manual review: `JSON`
- Rate limits: no rate-limit policy published on the reviewed official pages
- Manually confirmed route count: `1`

## API shape and behavior
- The provider-controlled host exposes a live `/bazaar` endpoint.
- The same-host Swagger UI and OpenAPI document do not document `/bazaar`; they document a different `onyx-actions` API rooted under `/v1/onyx_*`.
- Despite that missing formal doc entry, the live `/bazaar` endpoint still exposes enough provider-controlled behavior to confirm one public `GET` route with a required query parameter named `request`.
- Successful request examples were not published on the reviewed official pages, so the `request` payload must currently be treated as an opaque provider-native string rather than a normalized structured schema.

## Canonical endpoint
1. `GET /bazaar`
   - Executes the Bazaar request represented by the required `request` query parameter.

## Confirmed parameters
### `GET /bazaar`
- `request` - required query parameter.
  - The live official endpoint returns a validation error when this parameter is omitted.
  - The reviewed official pages do not publish a schema, enum list, or example value set for this parameter.

## Response, pagination, and format notes
- Response media type observed from the live endpoint: `application/json`.
- No pagination parameters or pagination behavior are documented or exposed by the reviewed official pages.
- The live endpoint currently behaves like a single-operation request/response route rather than a list endpoint.

## Error notes
Observed directly from the official host during manual review:
- Missing `request` query parameter:
  - HTTP `422`
  - JSON body:
    - `{"detail":[{"type":"missing","loc":["query","request"],"msg":"Field required","input":null}]}`
- Sample unauthenticated test values for `request` such as empty string, `help`, `{}`, and `test`:
  - HTTP `500`
  - JSON body:
    - `{"error":"internal_error"}`
- Non-GET methods tested against the same path:
  - `POST /bazaar` returned HTTP `405` with `{"detail":"Method Not Allowed"}`
  - `OPTIONS /bazaar` returned HTTP `405` with `{"detail":"Method Not Allowed"}`

## Important usage notes
- The indexed official URL is the only reviewed provider-controlled page that exposes Bazaar-specific behavior.
- The official same-host Swagger UI (`/docs`) is titled `onyx-actions - Swagger UI`, but it does not list `/bazaar`.
- The official same-host OpenAPI document (`/openapi.json`) likewise omits `/bazaar` and instead catalogs the separate `/v1/onyx_*` surface.
- Because the provider has not published a Bazaar-specific request schema, fireROUTE should preserve `request` as an opaque provider-native input rather than attempting to infer subfields.
- The live host currently exposes error behavior without any documented auth wall, but that does not prove the endpoint is fully public for all valid requests; it only confirms the route exists and accepts unauthenticated validation/error traffic.

## fireROUTE normalization notes
- Preserve the base URL exactly as `https://onyx-actions.onrender.com`.
- Normalize this provider as one `GET /bazaar` route.
- Preserve the exact query parameter name `request`.
- Do not map the unrelated `/v1/onyx_*` operations from the same host into this provider entry.
- Treat the `request` payload as opaque until the provider publishes a Bazaar-specific contract.