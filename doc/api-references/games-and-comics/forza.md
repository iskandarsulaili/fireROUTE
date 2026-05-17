# Forza

## Overview
- Provider: forza-api.tk
- Category: Games & Comics
- Official docs: `https://docs.forza-api.tk`
- Preferred base URL: not verifiable because provider-controlled hosts are not resolving
- Auth: not verifiable because provider-controlled hosts are not resolving
- HTTPS: intended by reviewed URLs, but both provider-controlled hosts failed before serving docs or API content
- Response format: not verifiable because provider-controlled hosts are not resolving
- Pagination: not verifiable because provider-controlled hosts are not resolving
- Rate limits: not verifiable because provider-controlled hosts are not resolving
- Manual review outcome: `manual_blocked`
- Confirmed routes: `0`

## Verified findings
- Manual CloakBrowser/CDP review of `https://docs.forza-api.tk/` failed during navigation with `net::ERR_NAME_NOT_RESOLVED`.
- The resulting Chromium error page showed title `docs.forza-api.tk` and visible text `This site can’t be reached` plus `docs.forza-api.tk’s server IP address could not be found.`
- Manual CloakBrowser/CDP review of official provider-controlled alternative `https://forza-api.tk/` also failed during navigation with `net::ERR_NAME_NOT_RESOLVED`.
- The resulting Chromium error page showed title `forza-api.tk` and visible text `This site can’t be reached` plus `forza-api.tk’s server IP address could not be found.`
- Because both provider-controlled hosts failed before serving docs or API content, no official route inventory, method list, parameter definitions, authentication instructions, pagination rules, rate limits, error schema, or example responses could be confirmed.

## Browser-confirmed pages
| Method | URL | Result | Notes |
|---|---|---|---|
| GET | `https://docs.forza-api.tk/` | docs host unavailable | Navigation failed with `net::ERR_NAME_NOT_RESOLVED`; Chromium error page stated the host IP address could not be found. |
| GET | `https://forza-api.tk/` | provider host unavailable | Navigation failed with `net::ERR_NAME_NOT_RESOLVED`; Chromium error page stated the host IP address could not be found. |

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
- The indexed documentation host does not currently resolve.
- The checked provider-controlled alternative host also does not currently resolve.
- No provider-controlled docs page or API origin was reachable in this pass.
- Without a reachable official docs page or API surface, fireROUTE cannot safely confirm routes, methods, parameters, authentication, pagination, errors, format notes, or any route count above zero.

## Integration notes for fireROUTE
- Keep this provider in `manual_blocked` state until the provider restores a reachable official docs or API origin with route-level documentation.
- Do not reconstruct the contract from mirrors, community posts, or cached examples while the provider-controlled hosts remain unreachable.

## Sources inspected
- `https://docs.forza-api.tk/`
- `https://forza-api.tk/`
