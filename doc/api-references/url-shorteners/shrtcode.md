# Shrtcode

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `shrtcode`
- Official pages reviewed manually in this pass:
  - `https://shrtco.de/`
  - `https://shrtco.de/docs`
  - `https://shrtco.de/v2/shorten?url=example.org`
- Confirmed API base URL in this pass: none
- Manually confirmed route count: `0`

## Manual review result
I could not recover a trustworthy current Shrtcode API surface from the live first-party domain. In this re-review, the official root page, the historical docs page, and a direct official-host endpoint candidate all rendered the same empty shell rather than product content or API output.

## What the official pages currently show
Across all three reviewed first-party URLs, the browser received the same minimal HTML pattern:
- empty page title
- empty body text
- favicon assets under `/assets/favicon/white/`
- a deferred analytics script from `https://t.elitedomains.de/js/script.manual.js`
- inline JavaScript that sends a Plausible pageview with `u: "https://elitedomains.de/redirector/shrtco.de"`

No reviewed page exposed:
- a shortening form
- API documentation
- JSON output
- route tables
- auth guidance
- parameter definitions
- error examples

## Official pages reviewed
### 1) Root domain
- URL: `https://shrtco.de/`
- Result: blank shell page with the shared `elitedomains.de` analytics/redirector markup

### 2) Historical docs page
- URL: `https://shrtco.de/docs`
- Result: same blank shell page and no documentation content

### 3) Official-host endpoint candidate
- URL: `https://shrtco.de/v2/shorten?url=example.org`
- Result: same blank shell page and no API payload or route-level error response

## What could not be confirmed manually
Because the reviewed first-party pages no longer expose a real application or docs surface, I could not responsibly confirm:
- a live API base URL
- any current endpoint path or method
- request parameters
- authentication requirements
- rate limits
- pagination behavior
- response formats
- error semantics

## Important usage notes
- Treat this provider as an explicit first-party continuity blocker.
- The current official host behaves like an empty redirector shell, not a live shortening API.
- Do not rely on historical Shrtcode route patterns unless a current provider-controlled reference or working product surface reappears.

## fireROUTE normalization notes
- Keep `Shrtcode` marked `manually_documented` with `0` confirmed current routes.
- The blocker is not merely sparse docs; the reviewed official root, docs page, and endpoint candidate all failed to expose any usable API surface.

## Verification note
This file was rebuilt from live manual browser review of the current official root page, docs page, and an official-host shortening endpoint candidate.