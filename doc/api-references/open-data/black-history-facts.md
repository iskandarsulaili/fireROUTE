# Black History Facts

## Provider metadata
- Category: `Open Data`
- Provider slug: `black-history-facts`
- Description: `Contribute or search one of the largest black history fact databases on the web`
- Official docs/pages used:
  - `https://www.blackhistoryapi.io/docs` (official Swagger UI)
  - `https://www.blackhistoryapi.io/swagger.json` (official OpenAPI/Swagger document linked from the docs page)
  - `https://www.blackhistoryapi.io/` (official product homepage)
- Current public API base URL: `https://rest.blackhistoryapi.io/v2`
- Auth model: `x-api-key: <YOUR_API_KEY>` header according to the official Swagger `securityDefinitions`
- Methods officially documented on the reviewed pages: `GET`, `POST`
- Response formats officially documented on the reviewed pages: JSON
- Rate limits: no numeric quota or throttle policy was published on the reviewed official pages
- Manually confirmed route count: `6`

## API shape and behavior
- The official Swagger UI exposes a small REST API under `/v2`.
- Metadata discovery is split into two read-only endpoints.
- Fact retrieval is split into search/random reads plus one fact-submission write endpoint.
- The official docs page exposes all routes directly; no extra hidden version tree was needed.

## Canonical endpoints
1. `GET /hc`
   - Health-check route.
2. `GET /metadata/all`
   - Return all metadata, with optional filtering.
3. `GET /metadata/search`
   - Search metadata records by type/value.
4. `POST /fact`
   - Submit a new fact payload.
5. `GET /fact/search`
   - Search approved facts.
6. `GET /fact/random`
   - Return one random approved fact.

## Parameters and payload notes
### `GET /metadata/all`
- Optional query parameters:
  - `tag` - filter to tag metadata
  - `people` - filter to people metadata

### `GET /metadata/search`
- Optional query parameters:
  - `people` - case-insensitive regex-style name search for people metadata
  - `tag` - exact tag-value search

### `GET /fact/search`
- Optional query parameters:
  - `tags` - case-insensitive regex-style tag filter
  - `people` - case-insensitive regex-style people filter
- The official description says this route returns up to `20` results.

### `POST /fact`
- Required request body: a JSON object containing a top-level `facts` array.
- The reviewed official schema shows fact objects may include:
  - `date_of_event`
  - `text`
  - `source_references[]` with `source_type`, `source_url`, `accessed_on`
  - `related_people[]` with `_id`, `type`, `value`, `created_date`, `updated_date`
  - `location`
  - `tags[]` with `_id`, `type`, `value`, `created_date`, `updated_date`
  - `created_date`
  - `updated_date`
  - `length`
  - `status`

## Response notes
- The official Swagger document declares JSON responses for every route.
- Documented response codes by route:
  - `GET /hc`: `200`
  - `GET /metadata/all`: `200`, `404`
  - `GET /metadata/search`: `200`, `404`
  - `POST /fact`: `201`
  - `GET /fact/search`: `200`, `404`
  - `GET /fact/random`: `200`, `404`
- The reviewed Swagger file does not publish detailed success schemas for every route beyond operation descriptions and the `POST /fact` body schema.
- No pagination model is documented on the reviewed official pages.

## Error notes
- A live unauthenticated request to `GET https://rest.blackhistoryapi.io/v2/hc` returned HTTP `403` with JSON body `{"message":"Forbidden"}`.
- The official Swagger reference does not publish a richer error-schema catalog beyond route-level HTTP response codes.
- Several read routes explicitly document `404` when no matching records are found.

## Usage notes
- The Swagger UI's global authorize control and the linked `swagger.json` both indicate header-based API-key auth, not query-string auth.
- The provider exposes only one write route in the reviewed docs: `POST /fact`.
- Search/filter semantics differ slightly across endpoints: metadata search mixes exact tag lookup with regex-style people search, while fact search describes regex-style matching for both `tags` and `people`.

## fireROUTE normalization notes
- Preserve the `/v2` prefix exactly as documented.
- Normalize the provider into six concrete method/path combinations.
- Keep `x-api-key` as the required auth header in any adapter.
- Treat `POST /fact` as a raw JSON passthrough surface because the official docs expose a nested fact-submission schema rather than a simplified flat form.