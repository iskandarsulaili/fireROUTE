# Fortnite

## Overview
- Provider: Fortnite Tracker / Tracker Network
- Category: Games & Comics
- Official docs: `https://fortnitetracker.com/site-api`
- Preferred base URL: not verifiable for Fortnite from currently reachable Tracker-owned docs
- Auth: Tracker developer onboarding requires a `TRN-Api-Key` header, but no current Fortnite route reference was exposed
- HTTPS: yes on reviewed pages
- Response format: not verifiable for Fortnite from currently reachable Tracker-owned docs
- Pagination: not verifiable for Fortnite from currently reachable Tracker-owned docs
- Rate limits: not verifiable for Fortnite from currently reachable Tracker-owned docs
- Manual review outcome: `manual_blocked`
- Confirmed routes: `0`

## Verified findings
- Manual CloakBrowser/CDP review of `https://fortnitetracker.com/site-api` redirected to `https://fortnitetracker.com/Error/NotFound?aspxerrorpath=/site-api`.
- The legacy docs URL rendered visible error text `Page Not Found - Sorry!` instead of a Fortnite route reference.
- Manual CloakBrowser/CDP review of `https://tracker.gg/developers/docs` resolved to `https://tracker.gg/developers/docs/getting-started` with page title `Getting Started - Tracker Network APIs for Developers > Documentation`.
- The reviewed current Tracker developer docs page states Tracker Network APIs are available for registered apps and, in its visible `Game APIs` list, only exposed `Apex Legends` and `The Division 2` during this pass.
- Manual CloakBrowser/CDP review of `https://tracker.gg/developers/docs/authentication` states requests must send a `TRN-Api-Key` header.
- Manual CloakBrowser/CDP review of `https://tracker.gg/developers/docs/titles/fortnite` returned page title `404 - Not Found - Tracker Network` with visible text `PAGE NOT FOUND`.
- No reviewed Tracker-owned page in this pass exposed a current public Fortnite endpoint inventory, base URL, parameter reference, pagination rules, rate limits, error schema, or example responses.

## Browser-confirmed pages
| Method | URL | Result | Notes |
|---|---|---|---|
| GET | `https://fortnitetracker.com/site-api` | legacy docs unavailable | Redirected to `https://fortnitetracker.com/Error/NotFound?aspxerrorpath=/site-api`; visible page text included `Page Not Found - Sorry!`; no Fortnite route documentation was exposed. |
| GET | `https://tracker.gg/developers/docs` | live Tracker docs index | Resolved to `https://tracker.gg/developers/docs/getting-started`; page title `Getting Started - Tracker Network APIs for Developers > Documentation`; visible `Game APIs` list exposed `Apex Legends` and `The Division 2`, not a Fortnite route catalog. |
| GET | `https://tracker.gg/developers/docs/authentication` | live Tracker auth guide | Page title `Getting Started - Tracker Network APIs for Developers > Documentation`; page content requires a `TRN-Api-Key` header; this is general onboarding rather than a Fortnite route catalog. |
| GET | `https://tracker.gg/developers/docs/titles/fortnite` | Fortnite title docs unavailable | Page title `404 - Not Found - Tracker Network`; visible page text included `PAGE NOT FOUND`; no route reference was published there. |

## Gaps that could not be verified
- Canonical Fortnite API base URL
- Supported Fortnite endpoint paths
- HTTP methods
- Path parameters
- Query parameters
- Request body requirements
- Fortnite-specific authentication scope beyond the general `TRN-Api-Key` onboarding guidance
- Numeric rate limits or quotas
- Pagination behavior
- Error schema for intended Fortnite operations
- Successful response schemas or payload examples
- Important provider usage notes

## Explicit blocker for fireROUTE
- The indexed legacy Fortnite docs URL now resolves to a not-found page instead of route documentation.
- Tracker's current developer docs still expose general onboarding, but the reviewed official pages do not publish a current Fortnite route catalog.
- The reviewed Tracker-owned Fortnite title-docs path returns a 404 page instead of route-level documentation.
- Without an official Fortnite route reference on Tracker-owned pages, fireROUTE cannot safely confirm routes, methods, parameters, pagination, errors, format notes, or any route count above zero.

## Integration notes for fireROUTE
- Keep this provider in `manual_blocked` state until Tracker Network republishes a public Fortnite route reference.
- Do not reconstruct the contract from third-party wrappers, reverse-engineered examples, or stale copies of removed legacy docs.

## Sources inspected
- `https://fortnitetracker.com/site-api`
- `https://tracker.gg/developers/docs`
- `https://tracker.gg/developers/docs/authentication`
- `https://tracker.gg/developers/docs/titles/fortnite`
