# Canadian Football League (CFL)

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `canadian-football-league-cfl`
- Official docs/pages attempted:
  - `http://api.cfl.ca/` (official API host from the category index)
  - `https://www.cfl.ca/` (official CFL website used as the alternate first-party page)
- Result: the official API host failed with `ERR_NAME_NOT_RESOLVED`, and the official league website exposed stats/news content but no current public API reference or API links
- Manually confirmed route count: `0`

## Blocker note
- The official API hostname `http://api.cfl.ca/` did not resolve in this environment; the browser error page reported that the server IP address could not be found.
- The alternate official site `https://www.cfl.ca/` was reachable and exposed league pages such as standings, stats, schedules, players, and news, but I could not find any public API documentation, endpoint inventory, auth details, or API-link references on the reviewed homepage.
- Because the official API host is unavailable and the official website does not publish a live reference, I could not manually confirm any usable route surface.

Because the reviewed official pages did not expose working documentation, I could not manually confirm:
- the live API base URL beyond the non-resolving `api.cfl.ca` host
- published endpoint paths or methods
- authentication requirements
- request parameters or schema details
- rate limits or quota behavior
- pagination or error models

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by an unresolved official API host and the absence of public API docs on the official CFL website.
- Keep route count at `0` until a current first-party API reference or working official API host is restored.
- Do not fill coverage from unofficial wrappers, scraped stats sites, or third-party blog posts.