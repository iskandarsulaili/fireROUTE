# Quarantine

## Provider metadata
- Category: `Health`
- Provider slug: `quarantine`
- Official docs/pages reviewed in this re-review:
  - `https://quarantine.country/coronavirus/api/` (official docs path from the category index)
  - `https://quarantine.country/` (official site root as the alternate official page)
- Result: both reviewed first-party URLs still failed at DNS resolution in this environment
- Manually confirmed route count: `0`

## What I could verify manually
- Re-checking the indexed docs path returned the browser error page `This site can’t be reached`.
- Re-checking the official root returned the same browser error page.
- The visible error text said `quarantine.country’s server IP address could not be found` and surfaced `ERR_NAME_NOT_RESOLVED`.
- Because the same first-party domain failed on both the docs path and the site root, I still could not reach any provider-controlled route inventory, auth guide, or schema reference.

## Blocker note
The official Quarantine domain remains unavailable at DNS level in this environment. I therefore could not manually confirm:
- the live API base URL
- published endpoint paths or methods
- request parameters or schemas
- authentication requirements
- rate limits, pagination, or shared error behavior

## fireROUTE guidance
- Treat this provider as manually re-reviewed and still blocked by first-party DNS failure on the official domain.
- Keep route count at `0` until `quarantine.country` resolves again and the live official docs can be inspected directly.
- Do not backfill routes from third-party mirrors, stale blog posts, or unofficial API wrappers.