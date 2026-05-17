# RSS feed to JSON

## Manual review status
- Category: `Development`
- Provider slug: `rss-feed-to-json`
- Official docs URL from index: `https://rss-to-json-serverless-api.vercel.app/`
- Official alternative page checked: `https://rss-to-json-serverless-api.vercel.app/api`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://rss-to-json-serverless-api.vercel.app/`
- Manual browser review did not expose provider-owned API documentation.
- The browser ended at `https://newsroom.blablacar.com/about-us`.
- The rendered title was `About us - BlaBlaCar`.
- That landing page was unrelated third-party content rather than RSS-to-JSON API docs, route inventory, or examples.

### Official alternative page
- URL: `https://rss-to-json-serverless-api.vercel.app/api`
- Manual browser review of the checked first-party `/api` path also failed to expose provider-owned documentation.
- The rendered title was `Beste Online Casino Zonder Cruks 2025 – Veilig Spelen Zonder Beperkingen Casino020`.
- Visible content was a Dutch gambling / casino article rather than an API reference.
- No trustworthy base URL, endpoint documentation, auth guide, request schema, or response examples were available from the alternative path.

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
- The indexed official deployment now resolves to unrelated BlaBlaCar content instead of provider docs.
- The checked first-party `/api` path renders unrelated casino-content HTML rather than an API surface.
- No trustworthy first-party request examples, response schemas, documented error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct RSS feed to JSON routes from stale mirrors, blog posts, cached examples, or memory while the current first-party deployment is repurposed.
- Reattempt only if the provider restores a readable first-party documentation surface.

## Why this remains blocked
- The indexed official deployment no longer exposes RSS-to-JSON material and instead lands on unrelated third-party content.
- The checked first-party `/api` path also renders unrelated non-provider content.
- Because no trustworthy provider-controlled documentation surface was reachable, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until the RSS feed to JSON provider restores readable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser review plus file edits only.
