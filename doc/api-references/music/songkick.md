# Songkick

## Overview
- Provider: Songkick
- Category: Music
- Official docs URL from index: `https://www.songkick.com/developer/`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
The public developer entry point is currently blocked by Cloudflare rather than serving a usable API reference, and the public product site review did not expose a current first-party route inventory.

- `https://www.songkick.com/developer/` rendered a Cloudflare error page with `Error 1014` and `CNAME Cross-User Banned`
- `https://www.songkick.com/` remained a public Songkick site, but the reviewed page did not expose a browsable API endpoint reference or method list

## What was and was not confirmable
- Public product hostname: `www.songkick.com`
- Legacy developer path: `/developer/`
- Concrete API base URL: not confirmable from currently reachable first-party pages
- Endpoint paths and HTTP methods: not confirmable
- Auth model: the old index labeled the provider as `apiKey`, but the current first-party pages did not expose a working auth/reference section
- Pagination, rate limits, errors, and response format: not confirmable

## Important usage note
Songkick’s first-party developer route is currently blocked at the CDN edge, so fireROUTE should treat this provider as blocked unless Songkick restores a readable public API reference.

## Sources inspected
- `https://www.songkick.com/developer/`
- `https://www.songkick.com/`