# BitcoinCharts

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `bitcoincharts`
- Official pages manually reviewed in this pass:
  - `https://bitcoincharts.com/about/exchanges/`
  - `https://bitcoincharts.com/`
- Current first-party status confirmed from the reviewed pages: neither the historical BitcoinCharts documentation-style page nor the site root loaded a usable provider-controlled page in this browser session
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually re-attempted BitcoinCharts from both the historical `about/exchanges` page and the site root. In this session, both official URLs failed before a browsable product or documentation surface loaded, so I could not recover a current first-party route reference.

## What the reviewed official pages currently confirm
1. Navigating to `https://bitcoincharts.com/about/exchanges/` failed before any route-level documentation or exchange-reference page rendered.
2. Navigating to `https://bitcoincharts.com/` also failed before the root site exposed any product, status, or API content.
3. Because both the historical docs-style URL and the root URL failed during manual review, no current provider-controlled API discovery surface was available from the official domain in this run.

## Blocker details
This is currently best treated as a first-party reachability / availability blocker:
- the reviewed official docs-style page did not load
- the reviewed official root page also did not load
- no trustworthy first-party fallback page on the official domain exposed a current API inventory

Because of that, I could not responsibly confirm:
- a current base URL
- endpoint paths or HTTP methods
- authentication requirements
- pagination behavior
- rate limits
- response formats
- error schemas

## Important usage notes
- Keep BitcoinCharts treated as a `0`-route blocker until the official domain again exposes a browsable first-party page.
- Do not backfill route inventories from old wrappers, archived mirrors, or stale forum posts without fresh first-party confirmation.
- If revisited later, start again from both the root site and the historical `about/exchanges` URL, because both failed in this pass.

## fireROUTE normalization notes
- Keep BitcoinCharts marked as `manually_documented` with `0` confirmed current routes.
- Keep the category README docs URL pointed at `https://bitcoincharts.com/about/exchanges/`, which remains the historical official docs-style entrypoint even though it did not load here.
- Treat the blocker as a current first-party availability problem, not as evidence of a confirmed live API.