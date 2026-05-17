# ApiMedic

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `apimedic`
- Official docs/pages attempted:
  - `https://apimedic.com/` (official product site and developer landing page from the category index)
  - `http://priaid.com/` (official legacy brand/domain referenced by the ApiMedic homepage)
- Result: the homepage is reachable, but it only advertises the product and says the API documentation lives in an account-only knowledge base; the alternate official `priaid.com` page fails with an ASP.NET runtime error instead of serving documentation
- Manually confirmed route count: `0`

## Blocker note
- The reviewed public homepage describes the product, pricing, and signup flow, but it does not publish endpoint paths, methods, parameter schemas, auth header names, or base URLs.
- The same homepage says subscribers receive access to a knowledge base with the API documentation, which indicates the detailed reference is not publicly exposed.
- The alternate official page at `http://priaid.com/` returned a server-side `Runtime Error` page instead of usable API documentation.

Because the public official pages available in this environment did not expose the reference docs, I could not manually confirm:
- the live API base URL
- the published endpoint inventory
- request methods, parameters, or schemas
- concrete auth header names or signing rules
- rate limits or quota behavior
- pagination or error models

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by non-public documentation and an unusable official alternate domain.
- Keep route count at `0` until the official knowledge-base pages can be opened directly with valid account access or the public docs are restored.
- Do not backfill route coverage from unofficial blog posts, SDKs, or third-party mirrors.