# Mediastack

## Overview
- Provider: Mediastack API
- Category: News
- Official docs: `https://mediastack.com/documentation`
- Base URL: `https://api.mediastack.com/v1`
- Auth: API access key via query parameter `access_key`
- HTTPS: yes
- Response format: JSON
- Pagination: `limit` and `offset`
- Rate limits: no single public numeric limit was shown on the pages reviewed

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/news` | required `access_key`; optional filters including `keywords`, `countries`, `languages`, `categories`, `sources`, `date`, `sort`, `limit`, `offset` | Single news endpoint used for both recent and filtered/historical retrieval. |

## Request notes
- The product documentation describes Mediastack as a single-endpoint REST API.
- The quickstart guide shows the canonical auth shape as `https://api.mediastack.com/v1/news?access_key=YOUR_ACCESS_KEY`.
- Filtering is query-driven rather than path-driven.

## Integration notes for fireROUTE
- Keep this provider modeled as one query-heavy GET endpoint.
- Preserve the provider's native `access_key` query auth instead of rewriting it.
- Date, source, keyword, and country filtering should remain passthrough-style parameters.

## Route-count note
- The official docs currently expose `1` confirmed endpoint.

## Sources inspected
- `https://mediastack.com/documentation`
- `https://docs.apilayer.com/mediastack/docs/mediastack-api-v-1-0-0`
- `https://docs.apilayer.com/mediastack/docs/quickstart-guide`
