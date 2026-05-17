# Cat Facts

## Overview
- Provider: Cat Fact API
- Category: Animals
- Official docs: `https://catfact.ninja/`
- Machine-readable spec inspected: `https://catfact.ninja/docs?api-docs.json`
- Base URL: `https://catfact.ninja`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: no pagination model is described in the published OpenAPI spec; list operations are modeled as JSON arrays
- Rate limits: no numeric rate limit is documented in the official spec or Swagger UI

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/breeds` | optional `limit` query integer | Returns a list of cat breeds. |
| GET | `/fact` | optional `max_length` query integer | Returns one random cat fact. |
| GET | `/facts` | optional `max_length`, `limit` query integers | Returns a list of cat facts. |

## Response schema notes
- The official spec defines the `CatFact` object with:
  - `fact` — string
  - `length` — integer
- The official spec defines the `Breed` object with:
  - `breed`
  - `country`
  - `origin`
  - `coat`
  - `pattern`
- The Swagger/OpenAPI document models `/breeds` and `/facts` responses as JSON arrays.

## Error handling
- `/fact` explicitly documents a `404` response (`Fact not found`).
- The Swagger UI does not publish a broader error envelope or numeric rate-limit policy.

## Integration notes for fireROUTE
- This is a small unauthenticated read-only API.
- Inputs are simple query filters; there are no path parameters in the published spec.
- Because the official spec models list responses as arrays instead of paginated envelopes, adapters should not assume page metadata is present.

## Sources inspected
- `https://catfact.ninja/`
- `https://catfact.ninja/docs?api-docs.json`
