# Tenders in Hungary

## Provider metadata
- Category: `Business`
- Provider slug: `tenders-in-hungary`
- Official pages manually reviewed in this pass:
  - `https://tenders.guru/hu/api`
  - `https://tenders.guru/hu/`
- Current first-party status confirmed from the reviewed pages: the country API page and country root are not loading a browsable documentation or product surface in this browser session
- Manually confirmed route count: `0`

## Manual review result
I manually re-reviewed the official Tenders Guru Hungary API page and the matching country root. In this session, neither official page produced a usable route reference or stable site content that could support a fireROUTE endpoint inventory.

## What the official pages currently confirm
1. Navigating to `https://tenders.guru/hu/api` timed out before any route table or technical reference loaded.
2. Navigating to `https://tenders.guru/hu/` aborted before a usable country-site page rendered.
3. Because both official Hungary entrypoints failed before content became inspectable, there is no trustworthy first-party evidence here for current paths, parameters, auth, pagination, or response formats.

## Blocker details
This remains a first-party availability blocker rather than a partially documented API:
- the official API page did not load to a readable endpoint reference
- the official country root did not render a stable alternative page
- no other official Hungary Tenders Guru page was exposed from the reviewed surfaces that could replace the missing API reference

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
- Keep the confirmed route count at `0` until `tenders.guru/hu` exposes a stable first-party API reference again.
- Do not infer Hungary routes from other Tenders Guru country docs, old mirrors, or third-party client libraries.
