# Tenders in Spain

## Provider metadata
- Category: `Business`
- Provider slug: `tenders-in-spain`
- Official pages manually reviewed in this pass:
  - `https://tenders.guru/es/api`
  - `https://tenders.guru/es/`
- Current first-party status confirmed from the reviewed pages: the country API page and country root are not loading a browsable documentation or product surface in this browser session
- Manually confirmed route count: `0`

## Manual review result
I manually re-reviewed the official Tenders Guru Spain API page and the matching country root. In this session, both official Spain entrypoints still failed before any route-level documentation or usable country-site content became available.

## What the official pages currently confirm
1. Navigating to `https://tenders.guru/es/api` timed out before any API documentation loaded.
2. Navigating to `https://tenders.guru/es/` also timed out before a usable page rendered.
3. Because both official Spain entrypoints timed out, there is no trustworthy first-party evidence here for current routes, parameters, auth, pagination, or response details.

## Blocker details
This remains a first-party availability blocker rather than a thin-docs case:
- the official API page did not load to a route inventory
- the official country root did not provide a stable fallback page
- no other official Spain Tenders Guru page was exposed from the reviewed surfaces that could replace the missing API reference

## What could not be confirmed manually
- production API base URL
- endpoint paths and HTTP methods
- query parameters or request bodies
- authentication requirements
- pagination behavior
- rate limits
- response format or error schema

## fireROUTE normalization notes
- Keep this provider marked `manually_documented` with an explicit blocker narrative.
- Keep the confirmed route count at `0` until `tenders.guru/es` exposes a stable first-party API reference again.
- Do not infer Spain routes from other Tenders Guru country docs, cached copies, or unofficial SDKs.
