# COVID-ID

## Provider metadata
- Category: `Health`
- Provider slug: `covid-id`
- Official docs/pages attempted:
  - `https://data.covid19.go.id/public/api/prov.json` (official endpoint URL from the category index)
  - `https://data.covid19.go.id/` (same official host root as the alternate official page)
- Result: both reviewed official URLs failed in this environment before a usable response body was returned
- Manually confirmed route count: `0`

## Blocker note
I re-tried the official indexed endpoint and the official host root with browser-based requests in this run.

Observed behavior in this environment:
- direct browser navigations to the official endpoint and host root failed with `net::ERR_ABORTED`
- timed browser `fetch()` attempts to the same two official URLs aborted without returning a readable payload

Because the official host could not be read successfully here, I could not manually confirm:
- whether `prov.json` is still the current public base endpoint or only one file within a larger API surface
- any additional published routes on the same host
- live response schema details beyond the stale category hint
- auth, rate-limit, pagination, or error behavior

## fireROUTE guidance
- Treat this provider as manually reviewed but blocked by official-host availability/access issues in the current environment.
- Keep route count at `0` until the official Indonesian government host can be opened and reviewed directly.
- Do not backfill route coverage from mirrors or third-party reposts.