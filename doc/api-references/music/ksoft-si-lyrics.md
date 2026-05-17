# KSoft.Si Lyrics

## Overview
- Provider: KSoft.Si Lyrics
- Category: Music
- Official docs URL from index: `https://docs.ksoft.si/api/lyrics-api`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
The original KSoft.Si lyrics API documentation host is no longer reachable, and the current official KSoft site now presents a software-agency business site rather than a public lyrics API reference.

- `https://docs.ksoft.si/api/lyrics-api` failed in the browser with `ERR_NAME_NOT_RESOLVED`
- `https://www.ksoft.tech/en/` loaded successfully, but the visible site content is general agency marketing (`Websites & Portals`, `Custom Software Development`, `AI & Machine Learning`, `Analytics & Cybersecurity`) with no public lyrics API documentation or endpoint inventory

## What was and was not confirmable
- Historical documentation hostname: `docs.ksoft.si`
- Current public company site: `https://www.ksoft.tech/en/`
- Concrete API base URL: not confirmable from currently reachable first-party pages
- Endpoint paths and HTTP methods: not confirmable
- Auth details: the old index classified the API as `apiKey`, but the current first-party pages do not expose the request format or header/query name
- Pagination, rate limits, errors, and response format: not confirmable

## Important usage note
fireROUTE should treat this provider as blocked until KSoft republishes a reachable first-party lyrics API reference or a current public API portal.

## Sources inspected
- `https://docs.ksoft.si/api/lyrics-api`
- `https://www.ksoft.tech/en/`