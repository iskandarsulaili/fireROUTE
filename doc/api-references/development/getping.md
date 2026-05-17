# GETPing

## Manual review status
- Category: `Development`
- Provider slug: `getping`
- Official docs URL from index: `https://www.getping.info/`
- Official alternative page checked: `https://getping.info/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://www.getping.info/`
- Manual browser/CDP review reached only a Chrome network-error page.
- The page ended on `chrome-error://chromewebdata/`.
- The rendered title was `www.getping.info`.
- Visible error text reported: `This site can’t be reached`, `www.getping.info refused to connect.`, and `ERR_CONNECTION_REFUSED`.
- No provider-owned docs, endpoint inventory, auth guidance, or examples were reachable from the indexed host.

### Official alternative page
- URL: `https://getping.info/`
- Manual browser/CDP review for the apex host reached the same failure class.
- The page again ended on `chrome-error://chromewebdata/`.
- The rendered title was `getping.info`.
- Visible error text reported: `This site can’t be reached`, `getping.info refused to connect.`, and `ERR_CONNECTION_REFUSED`.
- No first-party API reference or alternative documentation surface was reachable from the alternative host either.

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
- Both checked first-party host variants currently refuse the browser connection before any provider-owned page loads.
- No trustworthy first-party request examples, response schemas, error payload definitions, or format guidance could be verified safely.

### Important usage notes
- Do not reconstruct GETPing routes from stale examples, caches, or memory while the current first-party hosts expose only connection-refused states.
- Reattempt only if GETPing restores a working first-party site or official developer portal.

## Why this remains blocked
- Both reviewed official host variants fail with `ERR_CONNECTION_REFUSED` before any provider-owned documentation loads.
- Because no trustworthy first-party documentation surface was reachable, fireROUTE could not safely verify base URL, routes, methods, parameters, authentication, pagination, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until GETPing again exposes a reachable first-party documentation surface.

## Verification notes
This file was manually rewritten from live official-site browser/CDP review plus file edits only.
