# Vagalume

## Overview
- Provider: Vagalume
- Category: Music
- Official docs URL from index: `https://api.vagalume.com.br/docs/`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
Both the indexed documentation URL and the API root were reachable only as server-error pages during manual review.
- `https://api.vagalume.com.br/docs/` returned `503 Service Temporarily Unavailable`
- `https://api.vagalume.com.br/` also returned `503 Service Temporarily Unavailable`

Because the official documentation endpoint and the API host root both failed at the provider side, there was no current first-party route reference to inspect.

## What was and was not confirmable
- Host name: `api.vagalume.com.br`
- Concrete base path for public API operations: not confirmable
- Endpoint paths and methods: not confirmable
- Auth requirements: not confirmable from the unavailable docs
- Rate limits, pagination, errors, and response schema: not confirmable

## fireROUTE note
Keep Vagalume blocked until the official docs and/or API host return usable first-party documentation again.

## Sources inspected
- `https://api.vagalume.com.br/docs/`
- `https://api.vagalume.com.br/`
