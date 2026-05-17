# SEC EDGAR Data

Official docs manually reviewed:
- https://www.sec.gov/edgar/sec-api-documentation
- https://www.sec.gov/developer

## Manual review outcome
Manual documentation is currently blocked.

Both reviewed official SEC pages returned the SEC rate-threshold/interstitial page instead of the actual API documentation in the browser environment used for this job. Because the official documentation could not be opened normally, I could not reliably verify the current base URLs, endpoint catalog, parameter contracts, auth requirements, pagination rules, or response/error formats directly from the provider.

## Confirmed blocker
- official docs URL `https://www.sec.gov/edgar/sec-api-documentation` returned `SEC.gov | Request Rate Threshold Exceeded`
- official developer landing page `https://www.sec.gov/developer` returned the same SEC threshold page
- the interstitial explicitly states that automated access must comply with SEC.gov privacy/security policy

## What could be confirmed
- provider name: SEC EDGAR Data
- official domain: `sec.gov`
- no API routes were manually confirmable from the blocked official pages during this pass

## Route count
Manual route count confirmed from the reviewed official pages: **0**

## fireROUTE notes
- Treat this provider as blocked in the current browser environment.
- Keep the README status in a blocked/unreachable state until the official SEC docs can be opened normally and the API routes can be verified manually.
