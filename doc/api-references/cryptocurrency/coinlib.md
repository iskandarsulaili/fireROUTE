# Coinlib

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `coinlib`
- Official pages manually reviewed in this pass:
  - `https://coinlib.io/`
  - `https://coinlib.io/apidocs`
  - `https://coinlib.io/api`
  - `https://coinlib.io/api/docs`
- Current first-party status confirmed from the reviewed pages: Coinlib's main site is live as a cryptocurrency market-data web app, but the reviewed same-domain docs-style paths now return first-party `404` pages instead of a public API reference
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked Coinlib from the official root plus the obvious same-domain documentation paths. In this pass, the root site was live and clearly operating as a consumer market-data experience, but every reviewed documentation-style URL resolved to a first-party `404` page. Because Coinlib's own current web surface did not expose a route catalog anywhere I reviewed, I could not responsibly confirm any current API operations.

## What the reviewed official pages currently confirm
1. `https://coinlib.io/` currently loads a live Coinlib market-data site titled `Cryptocurrency Prices, Charts, Analysis, News Today & Market Cap | Coinlib`.
2. The reviewed root navigation and homepage content are consumer/product oriented, with visible sections such as `Coins`, `Exchanges`, `Compare`, `Analysis`, `Widgets`, `Portfolio`, and the homepage heading `Cryptocurrency Prices by Market Cap`.
3. The reviewed root page did not expose a visible developer hub, API overview, auth guide, endpoint list, schema reference, or rate-limit section.
4. `https://coinlib.io/apidocs` currently returns a first-party `404` page with the heading `This page could not be found.`
5. `https://coinlib.io/api` currently returns the same first-party `404` page.
6. `https://coinlib.io/api/docs` currently returns the same first-party `404` page.
7. Across the reviewed official Coinlib URLs, no trustworthy current route inventory, authentication reference, pagination guide, request schema list, response examples, or error documentation was publicly visible.

## Current blocker
This is best treated as a public-docs disappearance blocker rather than a dead-root-domain case:
- Coinlib's main site is still live
- the current root behaves like a consumer market-data product, not a developer portal
- the obvious same-domain docs paths now return first-party `404` pages
- no reviewed official page exposed a readable technical reference

Because of that blocker, I could not responsibly confirm:
- current API base URL
- endpoint paths or HTTP methods
- parameters or request bodies
- authentication requirements
- pagination behavior
- numeric rate limits
- response formats
- error schemas

## Important usage notes
- Treat Coinlib as a live brand with no currently inspectable public API reference on the reviewed official URLs.
- Keep the README docs URL pointed at `https://coinlib.io/` only as the current official discovery surface, not as a confirmed API-doc endpoint.
- Do not promote historical `/apidocs` examples, stale wrappers, or third-party summaries into fireROUTE while Coinlib's own docs-style paths are `404`.
- Revisit if Coinlib restores a readable first-party technical reference.

## fireROUTE normalization notes
- Keep Coinlib marked `manually_documented` with `0` confirmed current routes.
- Preserve the blocker classification as current public-docs disappearance on first-party URLs.
- Leave the cryptocurrency README row unchanged unless Coinlib restores a public route reference.
