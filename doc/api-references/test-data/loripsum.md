# Loripsum

## Provider metadata
- Category: `Test Data`
- Provider slug: `loripsum`
- Official pages reviewed manually:
  - `http://loripsum.net/`
  - `https://loripsum.net/`
- Current extraction outcome: explicit first-party DNS blocker
- Manually confirmed route count: `0`

## What the current official pages confirm
Manual browser review did not yield a reachable Loripsum API or documentation set.

Observed outcomes during this pass:
- the indexed HTTP root failed with `net::ERR_NAME_NOT_RESOLVED`
- the HTTPS variant also failed with `net::ERR_NAME_NOT_RESOLVED`
- because neither official host variant resolved, no provider-controlled homepage, examples, docs, or migration notice became available

## Blocker details
### Official docs/API page tried
- Requested: `http://loripsum.net/`
- Browser result: `Navigation failed: net::ERR_NAME_NOT_RESOLVED`
- Route extraction result: no API page or output loaded

### Official alternative page tried
- Requested: `https://loripsum.net/`
- Browser result: `Navigation failed: net::ERR_NAME_NOT_RESOLVED`
- Route extraction result: no official HTTPS documentation or replacement guidance loaded

## Missing information caused by the blocker
Because the reviewed official hostname did not resolve on either protocol variant, I could not reliably confirm:
- current base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- rate limits
- pagination behavior
- response and error formats

## Integration note
Treat Loripsum as an explicit blocker until `loripsum.net` resolves again and serves provider-controlled content. The current first-party availability state does not provide a trustworthy basis for route extraction.

## Verification note
This file was manually rebuilt from the indexed Loripsum HTTP root and the official HTTPS variant using browser inspection only. No exact routes were counted because both reviewed official URLs failed DNS resolution in this environment.
