# Domainsdb.info

## Provider metadata
- Category: `Business`
- Provider slug: `domainsdb-info`
- Official pages manually reviewed in this pass:
  - `https://domainsdb.info/`
  - `https://domainsdb.info/docs`
- Manually confirmed route count: `14`

## Product overview
DomainsDB currently presents a small REST-style JSON API for searching domain records, browsing per-TLD datasets, downloading update snapshots, and checking account/statistics metadata. The homepage markets it as a domain-status and availability-data service with a Google-sign-in key flow, while the docs page exposes the concrete endpoint list.

From the reviewed official pages:
- headline positioning: `Search Domain Status At Lightning Speed`
- homepage description: access a comprehensive domain database through simple HTTP requests
- developer-facing product promises include a large database, real-time updates, fast responses, and a stated `99.9% uptime SLA guarantee`

## Confirmed base URL and transport
The docs page explicitly shows:
- Base URL: `https://api.domainsdb.info/v1`
- Format: `application/json`
- API style: simple HTTP `GET` routes under `/v1`

All manually visible routes in the current public docs are `GET` endpoints.

## Authentication
The reviewed docs explicitly state:
- API access requires authenticating with a Google account to receive an API key
- most endpoints require the API key as a query parameter
- documented auth form: `?api_key=YOUR_API_KEY`

The homepage reinforces the same flow with `Continue with Google` and `Sign in with Google to get your API key instantly` CTAs.

## Confirmed endpoint inventory

| Group | Method | Path | What the official docs say |
|---|---|---|---|
| Domain search | `GET` | `/v1/domains/search` | Search the domains database with various filters |
| Domain search | `GET` | `/v1/domains/tld/{zone_id}` | Get TLD records for a specific zone |
| Domain search | `GET` | `/v1/domains/tld/{zone_id}/download` | Download whole dataset for a specific TLD |
| Domain search | `GET` | `/v1/domains/tld/{zone_id}/search` | Search domains within a specific TLD |
| Domain updates | `GET` | `/v1/domains/updates/added` | Get recently added domains; latest if date not specified |
| Domain updates | `GET` | `/v1/domains/updates/added/download` | Download added domains dataset |
| Domain updates | `GET` | `/v1/domains/updates/deleted` | Get recently deleted domains; latest if date not specified |
| Domain updates | `GET` | `/v1/domains/updates/deleted/download` | Download deleted domains dataset |
| Domain updates | `GET` | `/v1/domains/updates/list` | Get a list of all available updates |
| Information & statistics | `GET` | `/v1/info/api` | Get information about your API key |
| Information & statistics | `GET` | `/v1/info/stat/` | Get overall database statistics |
| Information & statistics | `GET` | `/v1/info/stat/{zone}` | Get statistics for a specific zone |
| Information & statistics | `GET` | `/v1/info/tld/` | Get overall TLD information |
| Information & statistics | `GET` | `/v1/info/tld/{zone}` | Get information for a specific TLD zone |

## Parameters and request patterns
The public docs are lightweight, but they do explicitly expose these request patterns:

### Shared auth/query parameters
- `api_key` — query-string API key on most endpoints

### Search example parameters shown directly in the docs
The example curl command is:

```bash
curl -X GET "https://api.domainsdb.info/v1/domains/search?api_key=YOUR_API_KEY&domain=example&limit=10"
```

That directly confirms:
- `domain` — search term on `/v1/domains/search`
- `limit` — result count limiter on `/v1/domains/search`

### Path parameters directly visible in route templates
- `zone_id` — TLD zone identifier for `/domains/tld/...` routes
- `zone` — zone/TLD selector for `/info/stat/{zone}` and `/info/tld/{zone}`

### Route-specific behavior notes the docs state explicitly
- `/v1/domains/updates/added` returns the latest added domains if no date is specified
- `/v1/domains/updates/deleted` returns the latest deleted domains if no date is specified
- `/v1/domains/tld/{zone_id}/download` and the two `/download` update routes are dataset-download endpoints rather than ordinary small JSON lookups

## Pagination
The docs do not provide a dedicated pagination guide, but the official example response exposes the live pagination contract.

Observed top-level pagination-related fields:
- `total`
- `time`
- `next_page`
- `domains`

The visible `next_page` field should be treated as an opaque continuation token rather than synthesized into page numbers.

## Response format
The docs explicitly call the API format `application/json`, and the example search response confirms a top-level object with a `domains` array.

Example response fields visible in the official docs:
- `total`
- `time`
- `next_page`
- `domains`

Example domain object fields visible in the official docs:
- `domain`
- `create_date`
- `update_date`
- `country`
- `isDead`
- `A`
- `NS`
- `MX`

The example also shows `MX` entries as structured objects with at least:
- `exchange`
- `priority`

## Errors and rate limits
The reviewed first-party docs did **not** publish:
- a numeric per-second or per-minute rate-limit table
- a formal error schema
- documented retry headers
- explicit status-code troubleshooting guidance

What is still safe to confirm from the official pages:
- JSON is the standard response format
- API-key auth is expected on most routes
- dataset downloads and search/list responses are both part of the public surface

## Important usage notes
- This is a read-only surface in the currently visible docs: all manually confirmed routes are `GET`.
- The product mixes lookup endpoints and bulk-download endpoints, so downstream adapters should preserve that distinction.
- Keep `next_page` opaque if supporting pagination in fireROUTE.
- The docs are concise and do not expose a full parameter reference for every endpoint, so integrations should avoid inventing undocumented filters.
- The README should point to `https://domainsdb.info/docs`, not just the marketing homepage, because the docs page is the actual route reference.

## fireROUTE normalization notes
- Normalize DomainsDB as a key-authenticated, query-parameter-based JSON API rooted at `https://api.domainsdb.info/v1`.
- Preserve the separate route families for global search, TLD-specific search/download, updates, and info/statistics.
- Treat bulk dataset downloads as a different usage mode from standard JSON search/list requests.
- Preserve the provider's field names exactly, including mixed casing such as `isDead`.
