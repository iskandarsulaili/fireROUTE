# JCDecaux Bike

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `jcdecaux-bike`
- Official docs/pages attempted:
  - `https://developer.jcdecaux.com/` (index URL; returned a browser error page with `ERR_CONNECTION_RESET` in this environment)
  - `https://www.jcdecaux.com/` (official company root; now resolves to the unrelated Bitcambio cryptocurrency exchange site)
- Result: I could not reach a trustworthy official JCDecaux route-level API reference for the bike service from the reviewed official URLs
- Manually confirmed route count: `0`

## Blocker note
The reviewed official URLs did not expose usable API documentation for this provider:
- the developer portal failed to load and surfaced a browser error page instead of API docs
- the official company domain resolved to an unrelated third-party site, not JCDecaux corporate content or API reference pages
- as a result, the indexed auth hint (`apiKey`) could not be reconciled with any live official endpoint documentation

Because I could not reach a valid official API reference, I could not manually confirm:
- the live API base URL
- endpoint paths or HTTP methods
- required auth header/query names
- parameter schemas
- rate limits, pagination, or error behavior

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by unavailable or repurposed official web properties.
- Keep route count at `0` until an official JCDecaux API reference can be opened directly from a verified JCDecaux-controlled domain.
- Do not substitute unofficial mirrors or forum posts for the missing official route-level docs.