# xeno-canto

## Overview
- Provider: xeno-canto API v3
- Category: Animals
- Official docs: `https://xeno-canto.org/explore/api`
- Base URL: `https://xeno-canto.org/api/3`
- Auth: required API key in query parameter `key`
- HTTPS: yes
- Response format: JSON
- Pagination: page-number pagination via required search results metadata plus optional `page`; optional `per_page` controls page size
- Rate limits: the official API v3 page says xeno-canto previously added a rate limiter, but after the API-v3 changes it has `lifted the strict rate limit`; no current numeric limit is published on the reviewed page

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/recordings` | required `query`, required `key`; optional `per_page`, `page` | Search recordings with xeno-canto search tags and return paginated JSON results. |

## Parameters, auth, and format notes
- `query` is required and must be a non-empty xeno-canto search-tag expression.
- The docs explicitly say API v3 only accepts search tags for queries; legacy free-text species searching without tags is discontinued.
- `key` is required on every API v3 request and is available to registered xeno-canto members with verified email addresses.
- The docs recommend creating an app-specific key instead of reusing a personal key.
- `per_page` is optional and must be between `50` and `500`; the default is `100`.
- `page` is optional and must be an integer between `1` and `numPages` from the response.
- Successful responses return a top-level JSON object with `numRecordings`, `numSpecies`, `page`, `numPages`, and `recordings`.
- Recording objects include taxonomic fields, recorder/location metadata, licensing, quality, timestamps, media links, and spectrogram URLs.

## Errors, redactions, and usage notes
- The official docs state that errors return HTTP `400` or `500` depending on whether the fault is client-side or server-side.
- The documented error payload shape is `{ "error": { "code": "...", "message": "..." } }`.
- Restricted-species records are redacted: the docs show `_meta.redacted_fields` masking exact location and audio-file fields such as `loc`, `lat`, `lon`, `file`, and `file-name`.
- Recording objects expose media URLs such as the public record page, downloadable audio file, and spectrogram images as fields in the response object rather than as separately documented API endpoints.
- The docs warn not to publish shared keys in repositories and note that prolonged abuse can lead to warnings or key revocation.
- API v3 returns unescaped UTF-8 characters and unescaped slashes in its JSON examples.

## Integration notes for fireROUTE
- Treat xeno-canto as a single search endpoint with a rich domain-specific query language rather than a multi-resource CRUD API.
- Preserve xeno-canto search-tag syntax instead of trying to normalize it into generic field filters.
- Preserve the provider's own pagination metadata (`page`, `numPages`, `numRecordings`, `numSpecies`) because downstream clients may need it for multi-page result walks.
- Keep restricted-species redaction behavior visible to callers instead of interpreting missing fields as ordinary null data.

## Route-count note
- The reviewed official API v3 page exposes `1` confirmed HTTP GET endpoint under `https://xeno-canto.org/api/3`.

## Sources inspected
- `https://xeno-canto.org/explore/api`
