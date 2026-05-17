# Intelligence X

## Provider metadata
- Category: `Security`
- Provider slug: `intelligence-x`
- Manual review outcome: `manually_documented`
- Confirmed routes in this pass: `22`
- Official sources manually reviewed with browser tools:
  - `https://github.com/IntelligenceX/SDK/blob/master/openapi.md`
  - `https://raw.githubusercontent.com/IntelligenceX/SDK/master/openapi.yaml`
  - `https://intelx.io/`

## API overview
The current official Intelligence X SDK repository exposes a documented Search API/OpenAPI surface with two server groups:
- `https://2.intelx.io` for the main search/file/selector/phonebook API family
- `https://3.intelx.io` for live-search and leaked-account workflows

The official product root `https://intelx.io/` is also live and matches the provider identity. The OpenAPI description notes additional service-instance context for `public.intelx.io` and `free.intelx.io`, but the documented server URLs in the current spec are `2.intelx.io` and `3.intelx.io`.

## Authentication
The official spec documents two API-key mechanisms:
- Header auth: `X-Key: YOUR_API_KEY`
- Query auth: `?k=YOUR_API_KEY`

Important auth notes from the official docs:
- The API returns `401 Unauthorized` when the key is invalid or not authorized.
- POST initializers such as `/intelligent/search` and `/phonebook/search` use header auth in the spec.
- Many GET endpoints use query-param auth (`k`) in the spec.
- Some GET endpoints still use header auth, including `/file/read`, `/item/selector/list`, `/live/search/*`, and `/accounts/*`.

## Common parameters and format notes
The current official OpenAPI spec repeatedly uses these shared request conventions:
- Search/job identifier: `id` query parameter, UUID format.
- Bucket filters:
  - `buckets` for multi-bucket search
  - `bucket` for a single bucket
- Result caps:
  - `limit` default `100`, min `1`, max `1000`
  - `l` default `100`, min `1`, max `1000` on some export/result endpoints
- Timeout:
  - `timeout` integer query parameter on async initializers
  - docs say omitted or `0` uses the default timeout
- Dates use `YYYY-mm-dd HH:ii:ss` strings, explicitly not RFC3339 on the documented date-filtered endpoints.
- `terminate` can carry one or more previous search IDs so clients can free server resources.
- `media` is an integer selector for high-level media types; the official parameter definition lists values from `0` (all media) through `24` (text file).

Important official usage notes:
- `/intelligent/search` requires a strong selector, not a soft/generic term.
- `/live/search/internal` says `limit` is per bucket and can still return more records than requested; enforce a hard cap client-side if you need one.
- `/live/search/result` explicitly asks clients to wait about 1 second between polling requests.
- `/file/read` says bucket selection is required.
- `/accounts/1` is synchronous, can take minutes, defaults to a 10-minute timeout, and should not exceed 1 hour.

## Confirmed route inventory

### Main search/file/selectors API (`https://2.intelx.io`)
| Method | Path | Purpose | Key documented inputs |
|---|---|---|---|
| `GET` | `/authenticate/info` | Return current API capabilities and per-path credit data | auth only |
| `GET` | `/file/preview` | Preview stored file content | `sid`, optional `f`, `l`, `c`, `m`, `b`, `e` |
| `GET` | `/file/read` | Download/read raw file content | `type`, optional `name`, `size`, `storageid`, `systemid`; docs note bucket is required |
| `GET` | `/file/view` | Render/view file content in text/hex/picture/html-derived modes | `storageid`, optional `f`, `bucket`, `escape` |
| `POST` | `/intelligent/search` | Start an intelligent search job | `term`, `maxresults`, `buckets`, `timeout`, `datefrom`, `dateto`, `sort`, `media`, optional `lookuplevel`, `terminate` |
| `GET` | `/intelligent/search/export` | Export intelligent-search results as CSV or ZIP | `id`, optional `l`, required `f` format selector |
| `GET` | `/intelligent/search/result` | Poll intelligent-search results | `id`, optional `limit`, `media`, `statistics`, `previewlines`, `bucket`, `dateFrom`, `dateTo`, `reset` |
| `GET` | `/intelligent/search/statistic` | Retrieve intelligent-search statistics | `id` |
| `GET` | `/intelligent/search/terminate` | Terminate a running intelligent search | `id` |
| `GET` | `/item/selector/list` | List selectors for an item | `id` |
| `GET` | `/item/selector/list/human` | List selectors with human-readable translation | `id`, optional `bucket` |
| `GET` | `/item/selector/list/export` | Export selectors as CSV | `id` |
| `POST` | `/phonebook/search` | Start a phonebook search | `term`, `target`, optional `buckets`, `maxresults`, `timeout`, `media`, `terminate` |
| `GET` | `/phonebook/search/export` | Export phonebook search output | `id`, optional `l` |
| `GET` | `/phonebook/search/result` | Fetch phonebook search results | `id`, optional `l` |
| `GET` | `/api/item/get` | Fetch item metadata | `id` |
| `GET` | `/api/item/get/human` | Fetch item metadata with human-readable fields | `id` |

### Live search + leaked accounts API (`https://3.intelx.io`)
| Method | Path | Purpose | Key documented inputs |
|---|---|---|---|
| `GET` | `/live/search/internal` | Start internal live search | `selector`, optional `bucket`, `skipinvalid`, `limit`, `analyze`, `datefrom`, `dateto`, `terminate` |
| `GET` | `/live/search/terminate` | Terminate active live search/export | `id` |
| `GET` | `/live/search/result` | Poll live-search results | `id`, optional `format`, `limit` |
| `GET` | `/accounts/csv` | Start asynchronous leaked-account export job | `selector`, optional `bucket`, `limit`, `datefrom`, `dateto`, `terminate` |
| `GET` | `/accounts/1` | Synchronous leaked-account export | `selector`, optional `bucket`, `limit`, `timeout`, `datefrom`, `dateto`, `terminate` |

## Pagination, polling, and result-delivery model
There is no conventional page-number/cursor pagination model documented here. Instead, the API is primarily job/poll driven:

- `POST /intelligent/search` returns a search ID.
- `GET /intelligent/search/result` is then polled with that ID.
- `POST /phonebook/search` returns a search job that is later fetched/exported.
- `GET /live/search/internal` and `GET /accounts/csv` also return job-style responses that must be polled.

Documented polling/status notes:
- `GET /intelligent/search/result` uses status values:
  - `0` = success with results, continue polling
  - `1` = no more results available
  - `2` = search ID not found
  - `3` = no results yet, keep trying
  - `4` = error
- `GET /live/search/result` uses status values:
  - `0` = results in this response
  - `1` = no result yet, keep polling
  - `2` = terminated / end of results
  - `3` = search ID not found
- The live-search docs explicitly say to wait roughly 1 second before each new result fetch.

## Error and quota notes
The current official docs expose these important error/usage signals:
- `400` for invalid input or malformed requests.
- `401` for invalid API key or insufficient authorization.
- `402` on some operations when no credits are available.
- `404` for not-found items/search IDs on some routes.
- `500` appears on `GET /intelligent/search/result` for internal API errors.
- `503` appears on `GET /file/read` when no storage server is available.
- `204 No Content` appears on `GET /item/selector/list/export` when the requested item is unavailable but the API intentionally avoids redirecting a direct-download user to an error page.

Quota/rate-limit notes:
- The spec does not publish one global requests-per-minute limit.
- Instead, `GET /authenticate/info` returns path-level credit data such as `Credit`, `CreditMax`, and `CreditReset` for the authenticated user.
- Several endpoints explicitly mention credit exhaustion via `402` responses.

## Data-format notes
Officially documented output formats include:
- JSON capability/status/result objects for most search and metadata routes
- CSV export from `/item/selector/list/export`
- CSV summary or ZIP archive from `/intelligent/search/export` depending on `f`
- Binary/text/hex/html-derived output modes for `/file/read` and `/file/view`
- `live/search/result` can return text, records, or both depending on `format`; the docs say the text field is HTML-encoded and meant for direct visualization, while `format=1` is intended for machine processing

## Verification notes
This file was rebuilt from the current official Intelligence X SDK/OpenAPI sources and the live official product root using browser tools only. The confirmed route count is the current top-level path count in the official `openapi.yaml`: `22`.