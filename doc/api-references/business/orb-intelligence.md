# ORB Intelligence

## Provider metadata
- Category: `Business`
- Provider slug: `orb-intelligence`
- Official pages manually reviewed in this pass:
  - `https://api.orb-intelligence.com/docs/`
  - `https://orb-intelligence.com/`
  - `https://www.orb-intelligence.com/`
- Current official status confirmed from the reviewed pages: the official API-docs host and both obvious company domains still fail before any provider-controlled route reference can be inspected
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the official ORB Intelligence API-docs host plus the apex and `www` company domains. The docs hostname is still only reachable far enough to return an infrastructure failure page, while the company domains still fail before any product or developer content loads. There is still no trustworthy current ORB route inventory available for manual fireROUTE extraction.

## What the reviewed official pages currently confirm
1. `https://api.orb-intelligence.com/docs/` currently renders a page titled `Service Unavailable`.
2. That reviewed docs host currently shows `Service Unavailable - DNS failure` and never exposes any API reference content.
3. Because the docs host fails before any provider-controlled docs surface appears, no base URL, route list, auth guide, pagination note, or schema reference is visible there.
4. Navigating to `https://orb-intelligence.com/` failed before any provider-controlled content rendered and produced `net::ERR_CONNECTION_RESET`.
5. Navigating to `https://www.orb-intelligence.com/` failed before a page loaded with `net::ERR_NAME_NOT_RESOLVED`.
6. Because the docs host, apex domain, and `www` domain all fail before a usable product or documentation surface appears, there is no trustworthy current first-party evidence here for ORB base URLs, route paths, auth, pagination, schemas, or error models.

## Current blocker
This remains a first-party availability blocker rather than a thin-docs case:
- the official docs host is up only far enough to return a `Service Unavailable - DNS failure` page
- the apex company domain resets the connection
- the `www` hostname does not currently resolve
- no reviewed official page exposed a reachable API overview, route table, auth guide, or schema reference

Because of that blocker, I could not responsibly confirm:
- production API base URL
- endpoint paths or HTTP methods
- authentication scheme
- pagination behavior
- rate limits
- request / response schema details
- error-envelope format

## Important usage notes
- Treat ORB Intelligence as a current first-party availability failure, not as a publicly documented live API.
- Keep the docs host as the canonical first-party docs URL because it remains the clearest official API entrypoint even though it is currently failing.
- Do not infer routes from stale SDKs, cached examples, or third-party summaries while the official surfaces are unavailable.

## fireROUTE normalization notes
- Keep ORB Intelligence marked `manually_documented` with `0` confirmed current routes.
- Preserve the blocker classification as first-party infrastructure / availability failure.
- Keep the category README docs URL pointed at `https://api.orb-intelligence.com/docs/` until ORB restores a reachable official reference.
