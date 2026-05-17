# QuickMocker

## Provider metadata
- Category: `Test Data`
- Provider slug: `quickmocker`
- Official pages reviewed manually:
  - `https://quickmocker.com`
  - `https://quickmocker.com/docs`
- Current extraction outcome: explicit first-party DNS blocker
- Manually confirmed route count: `0`

## What the current official pages confirm
Manual browser review did not yield a reachable QuickMocker API or documentation set.

Observed outcomes during this pass:
- the indexed official root failed with `net::ERR_NAME_NOT_RESOLVED`
- the same-host docs path also failed with `net::ERR_NAME_NOT_RESOLVED`
- because the official hostname did not resolve, no provider-controlled homepage, docs, examples, or migration notice became available

## Blocker details
### Official docs/API page tried
- Requested: `https://quickmocker.com`
- Browser result: `Navigation failed: net::ERR_NAME_NOT_RESOLVED`
- Route extraction result: no API reference loaded

### Official alternative page tried
- Requested: `https://quickmocker.com/docs`
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
Treat QuickMocker as an explicit blocker until `quickmocker.com` resolves again and serves provider-controlled documentation. The current first-party availability state does not provide a trustworthy basis for route extraction.

## Verification note
This file was manually rebuilt from the indexed QuickMocker root and an official same-host docs path using browser inspection only. No exact routes were counted because both reviewed official URLs failed DNS resolution in this environment.
