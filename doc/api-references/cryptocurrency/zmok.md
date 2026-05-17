# ZMOK

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `zmok`
- Official pages manually reviewed in this pass:
  - `https://zmok.io/`
  - `https://www.zmok.io/`
- Current first-party status confirmed from the reviewed pages: both the apex and `www` host currently serve the same bare directory index rather than a product site or API reference
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked ZMOK from both the apex domain and the `www` variant. In the current browser session, both official hosts resolve successfully, but neither serves product or developer documentation. Instead, both pages render the same default web-server directory listing.

## What the reviewed official pages currently confirm
1. `https://zmok.io/` currently loads a page titled `Index of /`.
2. `https://www.zmok.io/` currently loads the same `Index of /` page.
3. The visible directory listing contains only one entry: `cgi-bin/`.
4. The same listing shows `Last Modified` as `2026-02-27 10:12` and no published files, docs pages, API console, Swagger UI, OpenAPI file, or product navigation.
5. Neither reviewed first-party host exposes a base URL, endpoint list, HTTP methods, authentication instructions, pagination rules, rate-limit guidance, response examples, or error documentation.

## Blocker details
This is not a total DNS or transport outage. The official domain resolves and responds. The blocker is that the current first-party web surface has collapsed to a bare directory index with no usable API documentation.

Because of that, I could not responsibly confirm:
- a production API base URL
- endpoint paths or HTTP methods
- authentication requirements
- pagination behavior
- rate limits
- request / response formats
- error schemas

## Important usage notes
- Treat ZMOK as an inactive or undocumented provider until a real provider-controlled docs surface returns.
- Do not infer routes from historical mirrors, stale SDKs, or community blog posts while the official domain exposes only a server index.
- Re-check both the apex and `www` hosts on future passes, because the domain itself is still alive even though no API reference is currently published.

## fireROUTE normalization notes
- Keep ZMOK marked as `manually_documented` with `0` confirmed current routes.
- Keep the README docs URL pointed at `https://zmok.io/`, which is still the canonical first-party host even though it no longer serves usable API docs.