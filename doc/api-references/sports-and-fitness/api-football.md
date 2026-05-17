# API-FOOTBALL

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `api-football`
- Official docs/pages reviewed in this reattempt:
  - `https://www.api-football.com/documentation-v3` (official documentation page from the category index)
  - `https://www.api-football.com/` (official product-site root as the alternate first-party page)
- Result: both reviewed first-party pages were still blocked by the provider's Cloudflare verification wall
- Manually confirmed route count: `0`

## What I could verify manually
- The official documentation URL rendered a Cloudflare interstitial instead of route documentation.
- The page title was `Just a moment...`.
- The visible page text included `www.api-football.com`, `Performing security verification`, and `This website uses a security service to protect against malicious bots.`
- Re-checking the official homepage produced the same `Just a moment...` verification screen rather than readable product or API-reference content.

## Blocker note
Because both reviewed first-party pages stopped at upstream bot verification, I could not manually confirm any current route-level API details from provider-controlled documentation, including:
- the production API base URL
- endpoint paths or HTTP methods
- authentication headers, tokens, or query parameters
- rate limits or plan-gated quota behavior
- pagination rules
- shared error-response behavior

## fireROUTE guidance
- Treat this provider as manually re-reviewed and still blocked by the provider's anti-bot gate in the current environment.
- Keep route count at `0` until the official API-FOOTBALL documentation can be opened past the verification wall and inspected directly.
- Do not backfill coverage from RapidAPI mirrors, blogs, or unofficial reposts.