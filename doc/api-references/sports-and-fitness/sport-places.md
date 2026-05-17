# Sport Places

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `sport-places`
- Official docs/pages attempted:
  - `https://developers.decathlon.com/products/sport-places` (official product page from the category index)
  - `https://developers.decathlon.com/` (official developer portal root as the alternate official page)
- Result: both official pages failed before page load with browser-level DNS resolution errors
- Manually confirmed route count: `0`

## Blocker note
In this environment, both reviewed official Decathlon developer URLs failed with `net::ERR_NAME_NOT_RESOLVED`.

Because the official product page and the official developer-portal root both failed to resolve, I could not manually confirm:
- the live API base URL
- the published endpoint set
- request or response formats
- query or path parameters
- auth requirements beyond the stale category-index hint
- rate limits or pagination behavior

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by upstream DNS unavailability in the current environment.
- Keep route count at `0` until the official Decathlon developer domain resolves again and the product docs can be inspected directly.
- Do not derive routes from cached mirrors or unofficial reposts.