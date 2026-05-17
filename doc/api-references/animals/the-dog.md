# The Dog

## Overview
- Provider: The Dog API
- Category: Animals
- Official docs: `https://docs.thedogapi.com/`
- Base URL: `https://api.thedogapi.com`
- Auth: API key via header `x-api-key`
- HTTPS: yes
- Response format: JSON
- Pagination: supported on multiple endpoints; the facts endpoints document `limit` and `offset`, and list/search endpoints in the OpenAPI spec expose their own collection filters
- Rate limits: no single numeric public rate limit was visible in the inspected docs and OpenAPI spec

## Confirmed endpoint families
- The official OpenAPI spec currently exposes `53` confirmed operations.
- The major route families surfaced in the spec are listed below.

| Method | Path | Notes |
|---|---|---|
| GET | `/facts` | List facts with optional `limit`, `offset`, `breed_id`, `species_id`, `include_sources`, `lang`. |
| GET | `/facts/random` | Random fact. |
| GET | `/facts/breed/{breedId}` | Breed-specific fact list. |
| GET | `/facts/breed/{breedId}/random` | Random fact for one breed. |
| GET | `/facts/species/{speciesId}/random` | Random fact for one species. |
| GET | `/facts/{id}` | Fact by ID. |
| GET, POST | `/votes` | List and create votes. |
| GET | `/votes/{vote_id}` | Vote by ID. |
| GET | `/accounts/features` | Account feature availability. |
| GET | `/accounts/quota` | Account quota information. |
| GET | `/accounts/{accountId}/overview` | Account overview. |
| GET | `/breeds/search` | Breed search. |
| GET | `/breeds` | Breed listing. |
| GET | `/breeds/breed-groups` | Breed-group metadata. |
| GET | `/breeds/{id}` | Breed by ID. |
| GET | `/breeds/bans/countries` | Country ban metadata. |
| GET | `/breeds/bans/country` | Single-country ban lookup. |
| GET | `/breeds/bans/breed/{breedId}` | Breed-specific ban lookup. |
| GET, POST | `/favourites` | List and create favourites. |
| GET, DELETE | `/favourites/{id}` | Get/delete favourite. |
| GET | `/categories` | Category listing. |
| GET | `/categories/{id}` | Category by ID. |
| GET | `/images/search` | Public image search. |
| GET, DELETE | `/images/{id}` | Image lookup / delete. |
| GET | `/images/{id}/labels` | Image labels. |
| POST | `/images/upload` | Async image upload. |
| GET | `/images/{id}/status` | Upload/status lookup. |
| POST | `/images/upload-sync` | Sync image upload. |
| POST | `/images/{imageId}/public-requests` | Public request action for an image. |
| POST, GET | `/pets` | Create/list pets. |
| GET, PATCH, DELETE | `/pets/{petId}` | Pet detail/update/delete. |
| POST | `/pets/{petId}/images` | Attach images to a pet. |
| GET | `/pets/portrait-styles` | Portrait style metadata. |
| GET | `/pets/{petId}/portraits` | Generated portrait retrieval. |
| POST | `/pets/{petId}/portrait` | Create portrait output. |
| POST | `/pets/{petId}/body-condition-score` | Pet analysis endpoint. |
| POST | `/pets/{petId}/estimated-age` | Pet analysis endpoint. |
| POST | `/pets/{petId}/genealogy` | Pet analysis endpoint. |
| POST | `/pets/{petId}/muscle-condition-score` | Pet analysis endpoint. |
| POST | `/pets/{petId}/estimated-weight` | Pet analysis endpoint. |
| GET | `/pets/{petId}/health-tips` | Pet health guidance. |
| GET | `/health-tips` | Health tips list. |
| GET | `/health-tips/{id}` | Health tip by ID. |

## Request/response notes
- The docs homepage links directly to an OpenAPI spec at `https://api.thedogapi.com/openapi-json`.
- The student/free-access page shows a live example using `GET https://pro-api.thedogapi.com/v1/images/search?...` with header `x-api-key`; the OpenAPI spec itself uses the broader `https://api.thedogapi.com` host.
- The current API surface is broader than the older image-only Dog API and now includes facts, pets, health tips, account/quota, and breed-ban metadata.

## Integration notes for fireROUTE
- Keep image search separate from the newer pet-analysis and facts surfaces; they are distinct product areas.
- Preserve native auth header `x-api-key` instead of translating it to query auth.
- Because the provider is actively evolving, route families should be sourced from the OpenAPI spec rather than assumed from older community examples.

## Sources inspected
- `https://thedogapi.com/`
- `https://thedogapi.com/en/students`
- `https://docs.thedogapi.com/`
- `https://api.thedogapi.com/openapi-json`
