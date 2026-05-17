# Oddsmagnet

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `oddsmagnet`
- Official docs/pages attempted:
  - `https://data.oddsmagnet.com` (official docs URL from the category index)
  - `https://oddsmagnet.com/oddsdata` (public odds-data landing page reached during review)
  - `https://oddsmagnet.com/` (official site root)
- Result: the reviewed public pages expose marketing/product pages for sports data, but I did not reach a public route-level API reference or endpoint inventory
- Manually confirmed route count: `0`

## Blocker note
The official Oddsmagnet pages I reviewed are publicly reachable, but they did not expose a usable API reference in stable public text during this pass:
- the site root is a consumer-facing sportsbook-odds site with an `API` footer link
- the odds-data product page is a marketing/sales landing page titled `Get Sports Data & Betting APIs: Live & Historical Odds, Free Trial Available`
- I did not reach a public page listing concrete routes, methods, parameters, or schemas

Because a public endpoint reference was not available from the reviewed official pages, I could not manually confirm:
- the live API base URL
- route paths or HTTP methods
- whether access is actually unauthenticated, sales-gated, or key-based despite the category-index hint
- rate limits, pagination, or error behavior

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by lack of public route-level documentation on the reviewed official pages.
- Keep route count at `0` until Oddsmagnet exposes a directly reviewable API reference.
- Do not infer routes from partner dashboards or unofficial examples.
