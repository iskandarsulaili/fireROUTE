# scraperBox

## Manual review status
- Category: `Development`
- Provider slug: `scraperbox`
- Official docs URL from index: `https://scraperbox.com/`
- Official alternative page checked: `https://scraperbox.com/api`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://scraperbox.com/`
- Manual browser review did not expose provider-owned documentation from the indexed first-party host.
- Navigation failed before a readable provider page loaded with `net::ERR_ABORTED`.
- No official API route inventory, auth guide, schema reference, or usage notes were reachable from the indexed page in this environment.

### Official alternative page
- URL: `https://scraperbox.com/api`
- Manual browser review of the checked first-party `/api` path also failed to expose scraperBox docs.
- The browser ended at `https://triggerpublishing.com/`.
- The rendered title was `JNETOTO — Ruang Baru Situs Toto Macau 4D dengan Akses Login Cepat dan Alternatif yang Lebih Stabil`.
- Visible content was unrelated gambling / toto material, including terms such as `JNETOTO`, `SITUS TOTO`, `SITUS TOGEL`, and `TOTO MACAU`.
- No trustworthy route-level API contract was recoverable from that page.

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
- The indexed official host aborted before readable provider-owned content loaded.
- The checked first-party `/api` path now resolves to unrelated third-party gambling-style content.
- No trustworthy first-party request examples, response schemas, documented error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct scraperBox routes from caches, aggregators, old blog posts, or memory while the current first-party surfaces are unavailable or repurposed.
- Reattempt only if scraperBox restores a stable provider-controlled documentation surface.

## Why this remains blocked
- The indexed official host does not currently load readable provider-owned documentation in this environment.
- The checked first-party `/api` path resolves to unrelated third-party content instead of scraperBox docs.
- Because no trustworthy provider-controlled documentation surface was reachable, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until scraperBox restores readable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser review plus file edits only.
