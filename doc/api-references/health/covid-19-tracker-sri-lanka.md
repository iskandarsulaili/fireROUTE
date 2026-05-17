# COVID-19 Tracker Sri Lanka

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-tracker-sri-lanka`
- Official docs/pages used:
  - `https://www.hpb.health.gov.lk/en/api-documentation`
  - `https://hpb.health.gov.lk/`
- Current public API base URL: none confirmed from the reviewed official pages
- Auth model: no public API auth model could be confirmed because no route-level API reference was exposed during review
- Response format: HTML website pages only on the reviewed official sources
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed official pages
- Manually confirmed route count: `0`

## Why no public routes were confirmed
- The indexed documentation URL `https://www.hpb.health.gov.lk/en/api-documentation` failed in this environment with `net::ERR_ABORTED` instead of rendering an API reference.
- The official HPB site root loaded successfully, but the visible content was a general Health Promotion Bureau website rather than a route-level COVID tracker API guide.
- Manual review of the official homepage surfaced no public endpoint list, no base URL, no request examples, and no documented auth/pagination/error behavior for a COVID tracker API.

## Official pages reviewed
### `https://www.hpb.health.gov.lk/en/api-documentation`
- Browser navigation failed with `net::ERR_ABORTED`.
- No readable official API reference content was returned for route extraction.

### `https://hpb.health.gov.lk/`
- The site loaded as the general Health Promotion Bureau website.
- Manual link review found only an `eHEAPIMS` login link matching `api`-style text, but not a public COVID-19 tracker API reference.
- The reviewed homepage content focused on HPB programs, announcements, media, and bureau information rather than API documentation.

## Response, pagination, and error notes
- No public API response schema, pagination mechanism, or error contract was published on the reviewed official pages.
- Because no route-level reference was exposed, fireROUTE should treat all transport and schema details as unconfirmed.

## Usage notes from the official pages
- The current official root site appears to have shifted to broader HPB institutional content rather than a dedicated public COVID tracker developer surface.
- A fresh review would be needed if HPB restores a public API documentation page or publishes an official machine-readable spec.

## fireROUTE normalization notes
- Treat this provider as a manual blocker with zero confirmed routes.
- Do not map homepage content or unrelated login links into fireROUTE operations.
- Recheck only if the official `api-documentation` page becomes reachable again or HPB publishes an alternative official reference page.
