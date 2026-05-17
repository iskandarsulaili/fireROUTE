# Bruzu

## Overview
- Provider: Bruzu
- Category: Photography
- Official docs URL from index: `https://docs.bruzu.com`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
Bruzu's published documentation hostname is no longer reachable, and the root brand domain was also unreachable during manual review.

- `https://docs.bruzu.com` failed in the browser with `ERR_NAME_NOT_RESOLVED`
- `https://bruzu.com/` also failed in the browser with `ERR_NAME_NOT_RESOLVED`

## What was and was not confirmable
- Historical documentation hostname: `docs.bruzu.com`
- Historical brand hostname: `bruzu.com`
- Current API base URL: not confirmable
- Endpoint paths and HTTP methods: not confirmable
- Auth model: the old index labeled the provider as `apiKey`, but no current first-party docs were reachable to confirm header/query usage
- Rate limits, pagination, errors, and response format: not confirmable

## Important usage note
With both the docs host and the main domain failing DNS resolution, fireROUTE should treat Bruzu as blocked until a working first-party site or API reference reappears.

## Sources inspected
- `https://docs.bruzu.com`
- `https://bruzu.com/`