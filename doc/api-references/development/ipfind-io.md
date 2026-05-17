# ipfind.io

## Manual review status
- Category: `Development`
- Provider slug: `ipfind-io`
- Official docs URL from index: `https://ipfind.io/`
- Official alternative page checked: `https://ipfind.io/docs`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://ipfind.io/`
- Manual browser review reached the first-party host directly, but not readable docs.
- The rendered title was `Just a moment...`.
- Visible first-party text included `Performing security verification` and `This website uses a security service to protect against malicious bots.`
- The Cloudflare challenge blocked access before any API docs, endpoint list, auth guide, or examples became readable.

### Official alternative page
- URL: `https://ipfind.io/docs`
- Manual browser review of the checked official docs path reached the same Cloudflare verification wall.
- The rendered title was again `Just a moment...`.
- The page exposed a `Verify you are human` challenge state instead of route-level API documentation.
- No readable first-party API reference, schema details, or usage guidance was reachable from the alternative path either.

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
- Both checked first-party URLs stop at Cloudflare bot-verification interstitials instead of readable provider docs.
- No trustworthy first-party request examples, response schemas, documented error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct ipfind.io routes from stale mirrors, cached examples, blogs, or memory while the current first-party docs remain gated behind an unreadable verification wall.
- Reattempt only if ipfind.io exposes a readable first-party documentation surface from this environment.

## Why this remains blocked
- The indexed official host and the checked official docs path both stop at Cloudflare verification before readable provider-owned documentation loads.
- Because no trustworthy first-party documentation surface was reachable beyond that gate, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until ipfind.io exposes readable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser review plus file edits only.
