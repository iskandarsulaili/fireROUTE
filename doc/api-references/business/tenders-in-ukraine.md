# Tenders in Ukraine

## Provider metadata
- Category: `Business`
- Provider slug: `tenders-in-ukraine`
- Official pages manually reviewed in this pass:
  - `https://tenders.guru/ua/api`
  - `https://tenders.guru/ua/`
- Current first-party status confirmed from the reviewed pages: the country API page and country root are not loading a browsable documentation or product surface in this browser session
- Manually confirmed route count: `0`

## Manual review result
I manually re-reviewed the official Tenders Guru Ukraine API page and the matching country root. In this session, the official Ukraine surfaces still did not yield a usable endpoint catalog or stable country-site content for manual fireROUTE extraction.

## What the official pages currently confirm
1. Navigating to `https://tenders.guru/ua/api` timed out before a readable API reference loaded.
2. Navigating to `https://tenders.guru/ua/` also failed before a usable country page rendered.
3. Because both official Ukraine entrypoints failed before content became inspectable, there is no trustworthy first-party evidence here for current routes, parameters, auth, pagination, or response details.

## Blocker details
This remains a first-party availability blocker rather than a partially documented API:
- the official API page did not load to a route inventory
- the official country root did not provide a stable fallback page
- no other official Ukraine Tenders Guru page surfaced from the reviewed entrypoints that exposed current API operations

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
- Keep the confirmed route count at `0` until `tenders.guru/ua` exposes a stable first-party API reference again.
- Do not infer Ukraine routes from other Tenders Guru country docs, cached copies, or unofficial client libraries.
