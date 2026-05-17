# Spanish random words

## Provider metadata
- Category: `Test Data`
- Provider slug: `spanish-random-words`
- Official pages reviewed manually:
  - `https://palabras-aleatorias-public-api.herokuapp.com/`
  - `https://palabras-aleatorias-public-api.herokuapp.com/public`
- Current extraction outcome: explicit first-party hosted-app removal blocker
- Manually confirmed route count: `0`

## What the current official pages confirm
Manual browser review did not yield a reachable Spanish random words API or documentation set.

Observed outcomes during this pass:
- the indexed root URL stayed on the official Heroku hostname and loaded a page titled `No such app`
- the same-host `/public` path also loaded `No such app`
- the returned HTML on both pages consisted of a wrapper around Heroku's hosted missing-app iframe: `//www.herokucdn.com/error-pages/no-such-app.html`
- because the official hosted app no longer exists, no provider-controlled docs, endpoint list, or migration notice became available

## Blocker details
### Official docs/API page tried
- Requested: `https://palabras-aleatorias-public-api.herokuapp.com/`
- Browser result: page title `No such app`
- Visible HTML evidence: `<iframe src="//www.herokucdn.com/error-pages/no-such-app.html"></iframe>`
- Route extraction result: no API reference or provider output loaded

### Official alternative page tried
- Requested: `https://palabras-aleatorias-public-api.herokuapp.com/public`
- Browser result: page title `No such app`
- Visible HTML evidence: `<iframe src="//www.herokucdn.com/error-pages/no-such-app.html"></iframe>`
- Route extraction result: no official docs, homepage, or migration guidance loaded

## Missing information caused by the blocker
Because the reviewed official host now serves only the hosted-app removal page, I could not reliably confirm:
- current base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- rate limits
- pagination behavior
- response and error formats

## Integration note
Treat Spanish random words as an explicit blocker until the provider again serves a live app or publishes an official migration target. The historical Heroku hostname no longer exposes a trustworthy route surface.

## Verification note
This file was manually rebuilt from the indexed Spanish random words root and the official same-host `/public` path using browser inspection only. No exact routes were counted because both reviewed official URLs now serve Heroku's `No such app` page.
