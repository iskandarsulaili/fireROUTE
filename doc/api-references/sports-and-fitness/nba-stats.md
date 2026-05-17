# NBA Stats

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `nba-stats`
- Official docs/pages attempted:
  - `https://any-api.com/nba_com/nba_com/docs/API_Description` (category-index docs URL)
  - `https://marketplace.apilayer.com/` (current official destination reached from the legacy Any-API URL)
- Result: the legacy docs URL now redirects to the APILayer marketplace home rather than to an NBA Stats product or route reference page
- Manually confirmed route count: `0`

## Blocker note
The legacy `any-api.com` documentation URL no longer exposes an NBA Stats API reference. In this run it redirected to the generic APILayer marketplace landing page, which provides marketplace navigation but no product-specific NBA Stats route inventory.

Because the reviewed official pages did not expose a current route-level product page, I could not manually confirm:
- the live base URL
- current endpoint paths or HTTP methods
- auth requirements beyond the stale category-index metadata
- request parameters, pagination, rate limits, or error schema

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by legacy-doc redirection and missing product-specific docs on the current official destination.
- Keep route count at `0` until a current official NBA Stats product page or API reference can be opened directly.
- Do not rely on the obsolete Any-API redirect as proof of a still-supported endpoint surface.