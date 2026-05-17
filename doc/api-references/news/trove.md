# Trove

## Overview
- Provider: Trove API v3
- Category: News
- Official docs: `https://trove.nla.gov.au/about/create-something/using-api`
- Base URL: `https://api.trove.nla.gov.au/v3`
- Auth: API key required
- HTTPS: yes
- Response format: JSON/OpenAPI-described HTTP responses
- Pagination: documented at the platform level through result paging in API responses; the access page also notes approved custom call-rate tiers
- Rate limits: approval-tier based rather than a single universal number; the access page lists review levels and custom/Level 1 tiers

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/v3/result` | Main search/results endpoint. |
| GET | `/v3/work/{workId}` | Work detail. |
| GET | `/v3/magazine/titles` | Magazine title listing. |
| GET | `/v3/magazine/title/{id}` | Magazine title detail. |
| GET | `/v3/people/{id}` | People and organisations detail. |
| GET | `/v3/newspaper/{id}` | Newspaper article detail. |
| GET | `/v3/newspaper/titles` | Newspaper title listing. |
| GET | `/v3/newspaper/title/{id}` | Newspaper title detail. |
| GET | `/v3/gazette/{id}` | Gazette article detail. |
| GET | `/v3/gazette/titles` | Gazette title listing. |
| GET | `/v3/gazette/title/{id}` | Gazette title detail. |
| GET | `/v3/list/{id}` | List detail. |
| GET | `/v3/contributor` | Contributor listing. |
| GET | `/v3/contributor/{id}` | Contributor detail. |

## Usage notes
- The Trove access page requires an approved API key and describes an application/review workflow.
- The Swagger/OpenAPI UI for v3 exposes the route inventory directly.
- The API is broader than newspapers alone and includes works, people/organisations, magazines, gazettes, lists, and contributors.

## Integration notes for fireROUTE
- Keep Trove modeled as a multi-collection search/retrieval API rather than a single newspaper endpoint.
- API-key approval levels and allowed call rates should be tracked separately from route mapping.
- Preserve collection-specific IDs (`workId`, title IDs, contributor IDs) instead of collapsing all resources into one namespace.

## Route-count note
- The official v3 docs currently expose `14` confirmed GET endpoints.

## Sources inspected
- `https://trove.nla.gov.au/about/create-something/using-api`
- `https://api.trove.nla.gov.au/v3/`
