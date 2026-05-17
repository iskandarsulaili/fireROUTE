# Mocky

## Manual review status
- Category: `Development`
- Provider slug: `mocky`
- Official docs URL from index: `https://designer.mocky.io/`
- Official alternative pages checked:
  - `https://www.mocky.io/`
  - `https://mocky.io/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://designer.mocky.io/`
- Manual CDP browser review reached a live page, but not Mocky documentation.
- The navigation ended on `https://dev-portal.at.govt.nz/realtime-api`.
- The rendered title was `Getting started with the realtime API - Auckland Transport developer portal`.
- Visible body text described Auckland Transport GTFS realtime APIs rather than Mocky routes, payloads, auth, or docs navigation.

### Official alternative page 1
- URL: `https://www.mocky.io/`
- Manual CDP browser review of the checked first-party `www` host did not expose provider docs.
- The rendered page title was `404 Not Found`.
- The visible page body exposed a Clever Cloud diagnostic block with `"status_code": 404` and route `"GET www.mocky.io/"`.
- No first-party documentation, auth guidance, route inventory, or request examples were reachable from the alternative host.

### Official alternative page 2
- URL: `https://mocky.io/`
- Manual CDP browser review also checked the apex first-party hostname.
- That navigation ended on `https://owo.vc/api`.
- The rendered body was only `{"statusCode":404,"error":"Not Found","message":"Link not found"}`.
- This was unrelated third-party output rather than a Mocky API reference.

## Route-level findings
No trustworthy route-level API contract could be confirmed from reachable first-party material in this pass.

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
- The indexed docs hostname now misroutes to unrelated Auckland Transport developer content.
- The checked `www` and apex first-party hosts expose 404-style failure states instead of provider-owned docs.
- No trustworthy first-party request examples, response schemas, error payload definitions, or format guidance for Mocky itself could be verified safely.

### Important usage notes
- Do not reconstruct Mocky routes from stale examples, blog posts, caches, or memory while the current first-party hosts expose only unrelated or failure-state content.
- Reattempt only if Mocky restores a working provider-controlled site or developer portal.

## Why this remains blocked
- None of the reviewed first-party Mocky hosts currently expose a trustworthy Mocky API reference.
- The indexed docs hostname misroutes to unrelated Auckland Transport developer material, while the checked alternative hosts terminate in 404-style failure output.
- Because no trustworthy first-party documentation surface loaded, fireROUTE could not safely verify base URL, routes, methods, parameters, authentication, pagination, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until Mocky again exposes a working first-party documentation surface.

## Verification notes
This file was manually rewritten from live official-site browser/CDP review plus file edits only.
