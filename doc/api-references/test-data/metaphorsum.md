# Metaphorsum

## Provider metadata
- Category: `Test Data`
- Provider slug: `metaphorsum`
- Official pages reviewed manually:
  - `http://metaphorpsum.com/`
  - `https://metaphorpsum.com/`
- Current extraction outcome: explicit first-party availability / certificate blocker
- Manually confirmed route count: `0`

## What the current official pages confirm
Manual browser review did not yield a trustworthy Metaphorsum API or documentation set.

Observed outcomes during this pass:
- the indexed HTTP root loaded a server failure page with title `502 Bad Gateway`
- the visible body text on that page was `502 Bad Gateway` and `nginx/1.24.0 (Ubuntu)`
- the HTTPS variant failed before loading provider content with `net::ERR_CERT_COMMON_NAME_INVALID`
- because neither official host variant produced trustworthy provider-controlled docs or API output, no current route surface could be confirmed safely

## Blocker details
### Official docs/API page tried
- Requested: `http://metaphorpsum.com/`
- Browser result: server error page with title `502 Bad Gateway`
- Visible body text: `502 Bad Gateway` and `nginx/1.24.0 (Ubuntu)`
- Route extraction result: no API reference or provider output loaded

### Official alternative page tried
- Requested: `https://metaphorpsum.com/`
- Browser result: `Navigation failed: net::ERR_CERT_COMMON_NAME_INVALID`
- Route extraction result: no official HTTPS documentation or valid API response loaded

## Missing information caused by the blocker
Because the reviewed official pages currently expose only a server error page and a certificate failure, I could not reliably confirm:
- current base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- rate limits
- pagination behavior
- response and error formats

## Integration note
Treat Metaphorsum as an explicit blocker until `metaphorpsum.com` serves valid provider-controlled content again over an official host. The current first-party availability state does not provide a trustworthy basis for route extraction.

## Verification note
This file was manually rebuilt from the indexed Metaphorsum HTTP root and the official HTTPS variant using browser inspection only. No exact routes were counted because the reviewed official pages currently expose only a server error and a certificate failure.
