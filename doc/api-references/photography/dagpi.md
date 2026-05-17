# Dagpi

## Overview
- Provider: Dagpi
- Category: Photography
- Official docs URL from index: `https://dagpi.xyz`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
Dagpi's public homepage is still live and clearly markets an image-manipulation/data API, but the reachable public pages inspected in this run did not expose a concrete API route reference.

- `https://dagpi.xyz/` is live and describes Dagpi as a fast API for image manipulation and curated data
- the homepage advertises a `Docs` entry point, but the reachable `https://dagpi.xyz/docs` path returned `404: NOT FOUND`
- the inspected public homepage content exposed product claims, premium messaging, wrappers, and links, but no concrete method + path inventory, base URL, or auth header/query details

## What was and was not confirmable
- Brand/product hostname: `dagpi.xyz`
- Product type: image manipulation and data API platform
- Concrete API base URL: not confirmable from the inspected public pages
- Endpoint paths and HTTP methods: not confirmable
- Auth details: the old index labeled the provider as `apiKey`, but the reachable public pages did not expose the request format
- Rate limits, pagination, errors, and response format: not confirmable

## Important usage note
fireROUTE should treat Dagpi as blocked until the provider restores a readable first-party docs path or publishes a public endpoint reference.

## Sources inspected
- `https://dagpi.xyz/`
- `https://dagpi.xyz/docs`