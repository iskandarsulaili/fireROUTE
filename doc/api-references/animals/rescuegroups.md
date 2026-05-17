# RescueGroups

## Overview
- Provider: RescueGroups.org API
- Category: Animals
- Official docs: `https://userguide.rescuegroups.org/display/APIDG/API+Developers+Guide+Home`
- Current public REST base URL: `https://api.rescuegroups.org/v5`
- Legacy documented endpoint: `https://api.rescuegroups.org/http/v2.json`
- Auth: public API key required for public data; v5 docs say the key is sent in the `Authorization` header; private access can also use account/user credentials depending on flow
- HTTPS: yes
- Response format: JSON; v5 docs explicitly say the API follows REST + JSON:API closely
- Pagination: documented in the v5 docs; examples show standard collection controls such as `limit`, `page`, sort, sparse fields, and includes
- Rate limits: no public numeric limit published; docs warn the API will return `429 Too Many Requests` for abnormal request volumes

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| POST | `/http/v2.json` | Legacy v2 JSON-over-HTTP-POST endpoint still documented on the official guide. |
| GET | `/public/petlists/{petlists.keystring}` | Get one public pet list. |
| PUT | `/public/petlists/{petlists.keystring}` | Update a pet list record. |
| GET | `/public/animals/breeds/` | List breeds. |
| GET | `/public/animals/breeds/{breeds.id}` | Get one breed. |
| GET | `/public/animals/breeds/search/dogs/` | Predefined dogs-breed search. |
| GET | `/public/animals/breeds/search/{viewName}/` | Breed search by saved view name. |
| POST | `/public/animals/breeds/search/{viewName}/` | POST search variant for breeds. |
| GET | `/public/animals/species/{species.id}/breeds/` | Breeds for a species. |
| GET | `/public/animals/patterns/` | List patterns. |
| GET | `/public/animals/patterns/{patterns.id}` | Get one pattern. |
| GET | `/public/animals/patterns/search/{viewName}/` | Pattern search by view. |
| POST | `/public/animals/patterns/search/{viewName}/` | POST search variant for patterns. |
| GET | `/public/animals/species/{species.id}/patterns/` | Patterns for a species. |
| GET | `/public/animals/species/` | List species. |
| GET | `/public/animals/species/{species.id}` | Get one species. |
| GET | `/public/orgs/{orgs.id}/animals/species/` | Species available for one organization. |
| GET | `/public/animals/statuses/` | List statuses. |
| GET | `/public/animals/statuses/{statuses.id}` | Get one status. |
| GET | `/public/animals/colors/` | List colors. |
| GET | `/public/animals/colors/{colors.id}` | Get one color. |
| GET | `/public/animals/colors/search/{viewName}/` | Color search by view. |
| POST | `/public/animals/colors/search/{viewName}/` | POST search variant for colors. |
| GET | `/public/animals/species/{species.id}/colors/` | Colors for a species. |
| GET | `/public/animals/` | List animals. |
| GET | `/public/animals/search/{viewName}/` | Animal search by saved view. |
| POST | `/public/animals/search/{viewName}/` | POST search variant for animals. |
| GET | `/public/animals/{animals.id}` | Get one animal. |
| GET | `/public/orgs/{orgs.id}/animals/` | Animals for one organization. |
| GET | `/public/orgs/{orgs.id}/animals/search/{viewName}/` | Org-scoped animal search by view. |
| POST | `/public/orgs/{orgs.id}/animals/search/{viewName}/` | POST org-scoped animal search. |
| GET | `/public/orgs/{orgs.id}/animals/{animals.id}` | One animal within an organization scope. |
| GET | `/public/orgs/` | List organizations. |
| GET | `/public/orgs/{orgs.id}` | Get one organization. |
| GET | `/public/orgs/search/{viewName}/` | Organization search by view. |
| POST | `/public/orgs/search/{viewName}/` | POST organization search by view. |

## Request and response notes
- The v5 docs explicitly describe the API as RESTful and JSON:API-like.
- Search routes commonly exist in both `GET` and `POST` forms, so adapters should not collapse them into a single synthetic route.
- The docs recommend caching relatively static taxonomy data such as breeds, species, colors, and related lookup lists.
- The legacy v2 guide documents a single POST endpoint where request intent is expressed by JSON body payloads rather than resource-specific URLs.

## Rate-limit and usage notes
- The docs do not advertise a fixed numeric limit.
- The Rate Limits section says the API may return `429 Too Many Requests` if it sees an abnormal number of requests from a key.
- Public-data access requires an API key requested from RescueGroups.org.

## Route-count note
- I manually confirmed `36` documented operations: `35` from the current v5 public docs plus the still-documented legacy v2 POST endpoint.

## Integration notes for fireROUTE
- Prefer the v5 resource URLs for new integrations.
- Keep the legacy v2 endpoint separate if backward compatibility is required; it has a materially different request model.
- Preserve saved-view search routes because they are an important part of how RescueGroups exposes filtered searches.

## Sources inspected
- `https://userguide.rescuegroups.org/display/APIDG/API+Developers+Guide+Home`
- `https://userguide.rescuegroups.org/spaces/APIDG/pages/10813505/HTTP+API`
- `https://userguide.rescuegroups.org/spaces/APIDG/pages/24053254/v5`
- `https://api.rescuegroups.org/v5/public/docs`
