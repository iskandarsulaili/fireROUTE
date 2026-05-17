# FIFA Ultimate Team

## Overview
- Provider: EA SPORTS FC / legacy FIFA Ultimate Team
- Category: Games & Comics
- Official docs: `https://www.easports.com/fifa/ultimate-team/api/fut/item`
- Preferred base URL: not verifiable from currently reachable EA-controlled pages
- Auth: not verifiable from currently reachable EA-controlled pages
- HTTPS: yes on reviewed pages
- Response format: not verifiable from currently reachable EA-controlled pages
- Pagination: not verifiable from currently reachable EA-controlled pages
- Rate limits: not verifiable from currently reachable EA-controlled pages
- Manual review outcome: `manual_blocked`
- Confirmed routes: `0`

## Verified findings
- Manual CloakBrowser/CDP review of `https://www.easports.com/fifa/ultimate-team/api/fut/item` returned page title `Service Unavailable`.
- The same EA docs URL rendered visible error text `Service Unavailable - DNS failure` and `The server is temporarily unable to service your request. Please try again later.` instead of an API reference.
- Manual CloakBrowser/CDP review of official EA alternative page `https://www.ea.com/games/ea-sports-fc/fc-25` returned page title `EA SPORTS FC™ 25 Home - Electronic Arts`.
- The checked EA alternative page is a product/marketing page that mentions Football Ultimate Team features, but it does not publish route-level developer documentation.
- No reviewed EA-controlled page in this pass exposed a public API base URL, endpoint inventory, HTTP methods, parameters, authentication flow, pagination rules, rate limits, error schema, or response examples for FIFA Ultimate Team / FC Ultimate Team.

## Browser-confirmed pages
| Method | URL | Result | Notes |
|---|---|---|---|
| GET | `https://www.easports.com/fifa/ultimate-team/api/fut/item` | official docs unavailable | Page title `Service Unavailable`; visible text included `Service Unavailable - DNS failure` and `The server is temporarily unable to service your request. Please try again later.` |
| GET | `https://www.ea.com/games/ea-sports-fc/fc-25` | official product page only | Page title `EA SPORTS FC™ 25 Home - Electronic Arts`; visible content described FC 25 features and Football Ultimate Team, not a developer API contract. |

## Gaps that could not be verified
- Canonical production API base URL
- Supported endpoint paths
- HTTP methods
- Path parameters
- Query parameters
- Request body requirements
- Authentication model
- Numeric rate limits or quotas
- Pagination behavior
- Error schema for intended API operations
- Successful response schemas or payload examples
- Important provider usage notes

## Explicit blocker for fireROUTE
- The indexed EA docs URL currently serves an EA error page instead of route documentation.
- The checked EA-controlled alternative page is a product page, not a developer reference.
- No reviewed EA-controlled page published a current public FIFA Ultimate Team API contract.
- Without a live official route reference, fireROUTE cannot safely confirm routes, methods, parameters, authentication, pagination, errors, format notes, or any route count above zero.

## Integration notes for fireROUTE
- Keep this provider in `manual_blocked` state until EA republishes a current official route-level reference for FIFA Ultimate Team / FC Ultimate Team.
- Do not reconstruct the contract from third-party mirrors, cached snippets, reverse-engineered endpoints, or unofficial FUT references while official EA pages remain non-verifiable.

## Sources inspected
- `https://www.easports.com/fifa/ultimate-team/api/fut/item`
- `https://www.ea.com/games/ea-sports-fc/fc-25`
