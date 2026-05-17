# Petfinder

## Overview
- Provider: Petfinder public GraphQL surface
- Category: Animals
- Indexed official docs URL: `https://www.petfinder.com/developers/`
- Current official product/docs page reviewed: `https://www.petfinder.com/tools-widgets/custom-pet-list/getting-started/`
- Confirmed API endpoint URL: `https://psl.petfinder.com/graphql`
- API style: GraphQL over HTTP
- Auth: no API key, bearer token, or other request-auth mechanism is published on the currently available public Petfinder pages; an anonymous `POST` GraphQL probe succeeded from the public widget page without adding auth headers. The widget-generation workflow itself requires signing in to a Petfinder account.
- HTTPS: yes
- Response format: JSON
- Pagination: provider-specific GraphQL pagination arguments are not publicly documented on the currently available Petfinder pages
- Rate limits: no public numeric rate limit was stated on the pages reviewed

## Confirmed endpoint surface

| Method | Path | Confirmed request parameter(s) | Notes |
|---|---|---|---|
| POST | `/graphql` | JSON body with GraphQL `query` string | The official widget page exposes `PSL_REBUILD_GRAPHQL_URL` as `https://psl.petfinder.com/graphql` in its runtime config, and the page makes live requests to that endpoint. |

## Confirmed behavior
- `POST https://psl.petfinder.com/graphql` with body `{"query":"{__typename}"}` returned HTTP `200` and JSON `{"data":{"__typename":"Query"}}`.
- A `GET` request to the same endpoint did not return a readable API document surface from the public page context.
- A GraphQL introspection request using `__type` returned HTTP `400` with a GraphQL validation error stating that introspection is disabled by Apollo Server.
- The official widget setup page says users must sign in and generate embed code for the Embeddable Pet List, which is the only current official product page in the reviewed Petfinder site that surfaced this API endpoint.

## Official-site documentation state
- The historical developer landing page `https://www.petfinder.com/developers/` currently redirects to the Petfinder consumer homepage instead of API documentation.
- The old v2 docs path `https://www.petfinder.com/developers/v2/docs/` currently returns `404`.
- The widget page links to `https://www.petfinder.com/Public-GraphQL-API-terms-of-service/`, but that linked terms page currently returns `404`.
- Because the old REST developer portal is gone, the currently confirmable official Petfinder API surface is the single GraphQL transport endpoint used by the Embeddable Pet List experience.

## Request and response notes
- Requests are sent over HTTPS to a single GraphQL endpoint rather than multiple REST resource paths.
- The only request-body field directly confirmed in this pass is `query`.
- Current public Petfinder pages do not publish field-level GraphQL schema docs, operation catalogs, or provider-specific argument tables.
- Successful responses return standard GraphQL JSON with a top-level `data` object.
- Validation failures return a top-level `errors` array; the introspection-disabled response included `extensions.code: GRAPHQL_VALIDATION_FAILED`.

## Authentication and usage notes
- The reviewed public Petfinder pages do not publish an API-key signup flow, OAuth flow, or bearer-token instructions for this GraphQL surface.
- The embeddable-pet-list setup flow requires a Petfinder account sign-in for widget generation, but the endpoint-level public docs do not explain whether generated widgets rely on account state, static queries, or other unpublished controls.
- Because Petfinder no longer publishes the old public developer reference, fireROUTE should treat the current official Petfinder API as a narrowly documented GraphQL transport surface rather than assuming the legacy multi-route REST API is still available.

## Error / format notes
- HTTP `200` can return GraphQL JSON data.
- HTTP `400` can return GraphQL validation errors in JSON.
- No official public page reviewed in this pass documented pagination headers, explicit error-code catalogs, or numeric throttling headers for this endpoint.

## Integration notes for fireROUTE
- Treat Petfinder as a single GraphQL POST surface.
- Do not model Petfinder as the old public v2 REST API unless Petfinder republishes official docs for that legacy surface.
- Do not assume schema introspection is available in production; the current server explicitly rejects introspection queries.
- Any fireROUTE adapter should preserve GraphQL request/response envelopes and avoid inventing undocumented field names from stale third-party references.

## Route-count note
- The current official Petfinder site exposes `1` confirmed API route surface.

## Sources inspected
- `https://www.petfinder.com/developers/`
- `https://www.petfinder.com/developers/v2/docs/`
- `https://www.petfinder.com/tools-widgets/custom-pet-list/getting-started/`
- `https://www.petfinder.com/Public-GraphQL-API-terms-of-service/`
- `https://psl.petfinder.com/graphql`
