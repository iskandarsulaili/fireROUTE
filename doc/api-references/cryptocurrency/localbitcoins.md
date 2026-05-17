# Localbitcoins

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `localbitcoins`
- Official pages manually reviewed in this pass:
  - `https://localbitcoins.com/api-docs/`
  - `https://localbitcoins.com/`
- Current first-party status confirmed from the reviewed pages: the historical API-docs path is gone, and the main official site now openly states that the service has been closed
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the former LocalBitcoins API-docs entrypoint and the current official root site. The API-docs URL now returns a first-party 404 page, while the root domain remains live only as a closure / FAQ surface rather than a developer reference.

## What the official pages currently confirm
1. `https://localbitcoins.com/api-docs/` currently returns `LocalBitcoins.com — 404` with the heading `404 — The page could not be found`.
2. `https://localbitcoins.com/` remains reachable and prominently displays the heading `LocalBitcoins has been closed.`
3. The official root page is now centered on closure-related FAQs, login issues, support, password recovery, data requests, and related account-help flows.
4. The reviewed first-party pages do not expose a current API base URL, endpoint inventory, authentication guidance, request examples, pagination rules, rate-limit details, or response/error schemas.

## Blocker details
This provider is blocked by official service closure rather than by a temporary docs failure:
- the historical API-docs path is gone
- the main official site explicitly announces closure
- the remaining first-party content is support / FAQ material, not developer documentation

## What could not be confirmed manually
Because of that blocker, I could not responsibly confirm:
- any current REST base URL
- endpoint paths or HTTP methods
- authentication requirements
- pagination behavior
- rate limits
- response formats
- error schemas

## Important usage notes
- Treat LocalBitcoins as a shut-down provider for fireROUTE integration purposes.
- Prefer the current closure notice on the root site over the dead `/api-docs/` path when describing present state.
- Do not reuse historical LocalBitcoins API examples without new first-party technical documentation.

## fireROUTE normalization notes
- Keep LocalBitcoins marked `manually_documented` with `0` confirmed current routes.
- Keep the category README docs URL pointed at `https://localbitcoins.com/`, which is the clearest current first-party state indicator.
