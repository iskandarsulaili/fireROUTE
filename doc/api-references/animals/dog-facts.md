# Dog Facts

## Overview
- Provider: Dog Facts API
- Category: Animals
- Official docs: `https://dukengn.github.io/Dog-facts-API/`
- Base URL: `https://dog-facts-api.herokuapp.com`
- Auth: none
- HTTPS: yes
- Response format: JSON array of objects with `fact`
- Pagination: none documented
- Rate limits: none documented

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/resources/dogs/all` | none | Returns the full fact collection at once. |
| GET | `/api/v1/resources/dogs` | optional `number`, optional `index` | Returns random facts by count or one fact by zero-based/indexed lookup as documented on the official page. |

## Request and response notes
- The official page describes the service as a Flask port of `kinduff/dog-api`.
- Example responses are arrays of objects shaped like `{ "fact": "..." }`.
- The docs explicitly say to replace `all` with `?number=` for a random subset or `?index=` for a specific fact.

## Integration notes for fireROUTE
- Treat this as a tiny read-only API with two practical GET shapes.
- Preserve the provider's native query parameters instead of inventing pagination.
- The service is documented against a legacy Heroku host, so runtime availability should be rechecked before shipping an adapter.

## Route-count note
- The official docs currently expose `2` confirmed GET routes.

## Sources inspected
- `https://dukengn.github.io/Dog-facts-API/`
