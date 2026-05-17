# Random Data

## Provider metadata
- Category: `Test Data`
- Provider slug: `random-data`
- Official pages reviewed manually:
  - `https://random-data-api.com`
  - `https://random-data-api.com/documentation`
- Current extraction outcome: explicit first-party DNS blocker
- Manually confirmed route count: `0`

## What the current official pages confirm
Manual browser review did not yield a reachable Random Data API or documentation set.

Observed outcomes during this pass:
- the indexed official root failed with `net::ERR_NAME_NOT_RESOLVED`
- the same-host documentation path also failed with `net::ERR_NAME_NOT_RESOLVED`
- because the official hostname did not resolve, no provider-controlled landing page, docs, or migration notice became available

## Blocker details
### Official docs/API page tried
- Requested: `https://random-data-api.com`
- Browser result: `Navigation failed: net::ERR_NAME_NOT_RESOLVED`
- Route extraction result: no API reference loaded

### Official alternative page tried
- Requested: `https://random-data-api.com/documentation`
- Browser result: `Navigation failed: net::ERR_NAME_NOT_RESOLVED`
- Route extraction result: no same-host documentation or replacement guidance loaded

## Missing information caused by the blocker
Because the reviewed official hostname did not resolve, I could not reliably confirm:
- current base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- rate limits
- pagination behavior
- response and error formats

## Integration note
Treat Random Data as an explicit blocker until `random-data-api.com` resolves again and serves provider-controlled documentation. The current first-party availability state does not provide a trustworthy basis for route extraction.

## Verification note
This file was manually rebuilt from the indexed Random Data hostname and an official same-host documentation path using browser inspection only. No exact routes were counted because both reviewed official URLs failed DNS resolution in this environment.
