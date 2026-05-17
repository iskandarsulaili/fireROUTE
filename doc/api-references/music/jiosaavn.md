# JioSaavn

## Overview
- Provider: JioSaavn
- Category: Music
- Official docs URL from index: `https://github.com/cyberboysumanjay/JioSaavnAPI`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
The indexed URL is an unofficial GitHub repository rather than a first-party JioSaavn developer portal. In this run, reachable first-party JioSaavn pages did not provide a usable public API reference.

- `https://www.jiosaavn.com/` failed in the browser with `ERR_ABORTED`
- `https://www.jiosaavn.com/about` also failed with `ERR_ABORTED`
- `https://api.jiosaavn.com/` failed with `ERR_ABORTED`
- no readable first-party developer portal or route inventory was confirmed from the inspected official hostnames

## What was and was not confirmable
- Official consumer hostname: `https://www.jiosaavn.com/`
- Possible first-party API hostname: `https://api.jiosaavn.com/`
- Concrete public API base URL: not confirmable
- Endpoint paths and HTTP methods: not confirmable
- Auth details: the old index labeled the provider `No`, but the reachable first-party pages in this run did not expose a public request format
- Rate limits, pagination, errors, and response format: not confirmable

## Important usage note
fireROUTE should keep JioSaavn blocked until JioSaavn republishes a readable public API/developer reference on first-party infrastructure.

## Sources inspected
- `https://www.jiosaavn.com/`
- `https://www.jiosaavn.com/about`
- `https://api.jiosaavn.com/`
- `https://github.com/cyberboysumanjay/JioSaavnAPI`
