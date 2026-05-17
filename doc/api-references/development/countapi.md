# CountAPI

## Manual review status
- Category: `Development`
- Provider slug: `countapi`
- Official docs URL from index: `https://countapi.xyz/`
- Official alternative page checked: `https://www.countapi.xyz/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://countapi.xyz/`
- Manual browser review attempted the indexed first-party host directly.
- Browser navigation failed before provider-owned content loaded with `net::ERR_NAME_NOT_RESOLVED`.
- No CountAPI landing page, docs navigation, route inventory, or examples became reachable from the indexed host.

### Official alternative page
- URL: `https://www.countapi.xyz/`
- Manual CDP browser review also checked the first-party `www` host in a dedicated tab.
- That host likewise ended on Chromium's network-error page with title `www.countapi.xyz` and visible text `This site can’t be reached`, `www.countapi.xyz’s server IP address could not be found.`, and `ERR_NAME_NOT_RESOLVED`.
- No provider-owned CountAPI documentation or API surface was exposed from the alternative host either.

## Route-level findings
No trustworthy route-level API contract could be confirmed from current first-party material in this pass.

### Base URL
- None currently verifiable.

### Endpoint paths and methods
- None currently verifiable.

### Parameters and request bodies
- None currently verifiable.

### Authentication
- None currently verifiable.

### Pagination
- None currently verifiable.

### Rate limits
- None currently verifiable.

### Errors and format notes
- Both checked first-party CountAPI host variants currently fail before any provider-owned content loads.
- No trustworthy first-party request examples, response schemas, documented error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct CountAPI routes from stale mirrors, cached examples, blogs, or memory while the current first-party hosts do not expose a stable provider-owned documentation surface.
- Reattempt only if CountAPI restores reachable first-party docs or a provider-controlled API reference.

## Why this remains blocked
- The indexed official host and the checked first-party `www` host both currently fail with DNS-resolution errors instead of serving CountAPI documentation.
- Because no trustworthy provider-controlled documentation surface was reachable, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until CountAPI again exposes reachable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser/CDP review plus file edits only.
