# Micro DB

## Manual review status
- Category: `Development`
- Provider slug: `micro-db`
- Official docs URL from index: `https://m3o.com/db`
- Official alternative pages checked:
  - `https://m3o.com/`
  - `https://docs.m3o.com/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://m3o.com/db`
- Manual CDP browser review did not reach product documentation in this pass.
- The indexed page redirected to `https://sedo.com/search/details/?domain=m3o.com&origin=domaindetails`.
- The rendered page title was `m3o.com is available for purchase - Sedo.com`.
- Visible body text included `This domain m3o.com is for sale!` and `Buy domain 12,000 USD`.
- No Micro DB product docs, API reference, endpoint list, or auth guidance became reachable from the indexed page.

### Official alternative page 1
- URL: `https://m3o.com/`
- The apex first-party host behaved the same way as the indexed DB page.
- It also redirected to Sedo's `m3o.com` domain-sale listing.
- The rendered page title was again `m3o.com is available for purchase - Sedo.com`.
- No provider-controlled Micro DB docs were exposed from the apex host either.

### Official alternative page 2
- URL: `https://docs.m3o.com/`
- The checked docs hostname failed before any provider documentation loaded.
- CDP navigation returned `net::ERR_NAME_NOT_RESOLVED`.
- No route inventory or first-party API reference was reachable from the docs host.

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
- The indexed product page and the official apex host now resolve to Sedo domain-sale infrastructure instead of M3O docs.
- The reviewed docs hostname fails DNS resolution.
- No trustworthy first-party request examples, response schemas, error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct M3O Micro DB routes from historical M3O examples or stale mirrors while the current first-party hosts no longer expose a live documentation surface.
- The current first-party evidence indicates domain-sale and DNS-failure states rather than a recoverable route reference.

## Why this remains blocked
- The indexed official page and the apex host now redirect to Sedo's `m3o.com` sale listing.
- The checked docs hostname fails with `ERR_NAME_NOT_RESOLVED`.
- Because no provider-controlled API documentation was reachable, fireROUTE could not safely verify base URL, routes, methods, parameters, authentication, pagination, rate limits, errors, or response formats.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until M3O again exposes a reachable first-party Micro DB API reference.

## Verification notes
This file was manually rewritten from live official-site browser/CDP review plus file edits only.
