# Orion Health

## Provider metadata
- Category: `Health`
- Provider slug: `orion-health`
- Official docs/pages reviewed in this reattempt:
  - `https://developer.orionhealth.io/` (official developer-portal landing page from the category index)
  - `https://developer.orionhealth.io/apis` (direct API-listing path attempted as the official route-reference follow-up)
  - `https://orionhealth.com/global/` (official corporate site as the alternate official page)
- Result: the public developer landing page is reachable, but I still could not reach a public route-level API reference
- Manually confirmed route count: `0`

## What I could verify manually
- The public developer portal rendered an `Orion Health Open APIs` landing page.
- The landing page markets open APIs and includes copy such as `Build innovative applications for different healthcare scenarios.` plus a visible `View all our APIs` call-to-action.
- In this reattempt, the directly targeted `/apis` path still did not yield a usable public endpoint inventory.
- The corporate site remains a product/marketing surface rather than a route reference.

## Blocker note
Even though the official developer landing page is public, the reviewed official pages still did not expose a route-by-route API reference that I could manually verify. Because of that, I could not confirm:
- the current API base URL or host pattern
- endpoint paths and HTTP methods
- OAuth or other auth flow details at request level
- request/response schemas
- pagination behavior
- rate limits or shared error conventions

## fireROUTE guidance
- Treat this provider as manually re-reviewed and still blocked by the absence of a publicly reachable route-level reference in the reviewed official pages.
- Keep route count at `0` until a public Orion Health API inventory or reference page can be opened directly and inspected.
- Do not backfill coverage from sales collateral, partner decks, or third-party summaries.