# Warface (non-official)

## Overview
- Provider: `Warface (non-official)`
- Category: `Games & Comics`
- Assigned docs URL: `https://api.wfstats.cf`
- Official pages inspected manually in this pass:
  - `https://api.wfstats.cf/`
  - `https://api.wfstats.cf/docs`
  - `https://wfstats.cf/`
- Reachable destination observed during manual CDP browser review:
  - `https://wftoolsnotavailable.pages.dev/`
- Manual status: `manual_blocked`
- Confirmed route count: `0`

## What the official pages currently expose
- `https://api.wfstats.cf/` resolved to `https://wftoolsnotavailable.pages.dev/` during manual browser review.
- `https://api.wfstats.cf/docs` resolved to the same `https://wftoolsnotavailable.pages.dev/` page.
- `https://wfstats.cf/` also resolved to the same `https://wftoolsnotavailable.pages.dev/` page.
- The final reachable page title was `WFStats`.
- The visible page body was a shutdown notice rather than API documentation.
- The shutdown notice stated that `WFStats`, `WFCompare`, and `WFBot` were `shutdown as of 1st Sep 2024`.
- The same notice also stated that `All the official APIs were shutdown by My.Games more than a year ago and never restored`.
- No endpoint catalog, authentication guide, parameter reference, rate-limit documentation, pagination rules, error schema, OpenAPI artifact, downloadable spec, or route-by-route reference was visible on the reachable provider-controlled page.
- No documentation links or endpoint links were present on the reachable page.

## Confirmed integration details
- Stable official API base URL: not publicly confirmable from the currently reachable provider-controlled pages.
- Endpoint paths manually checked:
  - `/`
  - `/docs`
  - `https://wfstats.cf/`
- Methods confirmed in this pass:
  - anonymous browser `GET` requests to the listed public URLs
- Parameters: not publicly documented on the currently reachable provider-controlled pages.
- Authentication: not publicly documented on the currently reachable provider-controlled pages.
- Rate limits: not publicly documented on the currently reachable provider-controlled pages.
- Pagination: not publicly documented on the currently reachable provider-controlled pages.
- Errors: not publicly documented on the currently reachable provider-controlled pages.
- Format notes:
  - the currently reachable destination is a static HTML shutdown notice page
  - no machine-readable API schema or route contract is currently exposed
- Important usage notes:
  - the provider-controlled notice says the upstream official APIs were shut down and never restored
  - fireROUTE should not infer routes from old wrappers, stale mirrors, cached examples, or historical community references when the current first-party pages no longer publish a live route contract

## Why this remains blocked for fireROUTE
- fireROUTE needs a trustworthy provider-controlled route catalog before it can confirm endpoints.
- The currently reachable official pages do not publish usable API documentation.
- The only provider-controlled content exposed in this pass was a shutdown notice that explicitly says the official APIs were shut down and never restored.
- Without a current provider-published contract, fireROUTE cannot safely confirm a base URL, endpoint list, methods, parameters, auth rules, rate limits, pagination behavior, errors, or response schemas.

## fireROUTE integration note
- Keep this provider in `manual_blocked` state until a current provider-controlled API reference becomes publicly available again.
- Keep the confirmed route count at `0` until a live official route contract can be manually verified.

## Sources inspected
- `https://api.wfstats.cf/`
- `https://api.wfstats.cf/docs`
- `https://wfstats.cf/`
- final redirect destination observed manually: `https://wftoolsnotavailable.pages.dev/`
