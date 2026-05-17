# Covid-19 India

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-india`
- Official docs/pages attempted:
  - `https://data.covid19india.org/` (category-index API/docs host)
  - `https://www.covid19india.org/` (official project site used as the alternate official page)
- Result: both official domains stopped at a browser-verification challenge in this environment instead of exposing route-level API documentation
- Manually confirmed route count: `0`

## Blocker note
Both reviewed official domains returned the same anti-bot interstitial titled `Checking your browser before accessing. Just a moment...`.

Because the official pages did not progress past browser verification during this run, I could not manually inspect or confirm:
- the live API base URL and current endpoint inventory
- request methods or path structure
- query/path parameters
- auth expectations, if any
- rate limits, pagination, response formats, or shared error schema

## fireROUTE guidance
- Treat this provider as manually reviewed but currently blocked by official-site bot protection in this environment.
- Keep route count at `0` until the official site can be opened far enough to inspect a public route reference or example endpoint list.
- Do not rely on stale community mirrors without a fresh official-doc confirmation.