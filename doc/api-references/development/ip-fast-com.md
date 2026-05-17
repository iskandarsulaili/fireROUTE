# ip-fast.com

## Manual review status
- Category: `Development`
- Provider slug: `ip-fast-com`
- Official docs URL from index: `https://ip-fast.com/docs/`
- Official alternative page checked: `https://ip-fast.com/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://ip-fast.com/docs/`
- Manual browser/CDP review did not expose ip-fast.com documentation or any provider-owned API surface.
- The page redirected away from the first-party hostname to `https://mercu-wgp.com/...` tracking/redirect infrastructure.
- The live HTML exposed a meta refresh pointing to `https://mercu-wgp.com/zclkredirect?...` plus browser-fingerprinting JavaScript rather than a docs page.
- No provider-owned route catalogue, auth guide, request examples, or response-format documentation was reachable from the indexed docs URL.

### Official alternative page
- URL: `https://ip-fast.com/`
- Manual browser/CDP review for the apex host behaved the same way.
- The page again redirected into `https://mercu-wgp.com/...` infrastructure instead of an ip-fast.com documentation surface.
- No first-party API reference, endpoint inventory, or product-owned docs navigation was reachable from the alternative host either.

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
- Both checked first-party URLs currently redirect into unrelated third-party tracking/lander infrastructure rather than provider-owned docs.
- The reachable HTML is redirect/fingerprinting scaffolding, not a trustworthy API contract.
- No first-party request examples, response schemas, documented error payloads, or payload-format notes could be verified safely.

### Important usage notes
- Do not reconstruct ip-fast.com routes from stale mirrors, blogs, caches, or memory while the current first-party hosts do not expose a stable provider-owned documentation surface.
- Reattempt only if ip-fast.com restores reachable first-party docs or an official route reference.

## Why this remains blocked
- The indexed docs URL and the checked first-party apex host both now redirect into unrelated `mercu-wgp.com` tracking/redirect infrastructure.
- Because no trustworthy provider-controlled documentation surface was reachable, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until ip-fast.com again exposes reachable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser/CDP review plus file edits only.
