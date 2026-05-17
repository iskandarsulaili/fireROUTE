# Sirv

## Overview
- Provider: Sirv REST API
- Category: Photography
- Official docs: `https://apidocs.sirv.com/`
- Base URL: `https://api.sirv.com/v2`
- Auth:
  - create an API client in Sirv
  - exchange `clientId` and `clientSecret` at `POST /v2/token`
  - send the returned bearer token in `Authorization: Bearer <token>` on subsequent requests
- Token notes: the inspected docs say bearer tokens expire after `20` minutes (`1200` seconds) and responses include `expiresIn`
- HTTPS: yes
- Response format: JSON for management endpoints; download/ZIP retrieval routes return file content or job artifacts rather than ordinary metadata objects
- Pagination/search notes:
  - file searching uses `POST /v2/files/search` and `POST /v2/files/search/scroll`
  - many list/report routes use query parameters such as `from`, `to`, `filename`, `dirname`, `alias`, `domain`, and `userId`
- Rate limits:
  - the inspected docs show global and per-route limits in response headers such as `x-global-ratelimit-limit`, `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`, and `x-ratelimit-type`
  - `GET /v2/account/limits` exposes a JSON breakdown of the current REST, S3, FTP, fetch, ZIP, and endpoint-specific limits

## Confirmed endpoints

### Auth
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v2/token` | body `clientId`, `clientSecret`; optional `expiresIn` | Obtain bearer token for all other API calls. |

### Account, billing, user, and stats
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v2/account` | none | Get account info. |
| POST | `/v2/account` | account settings body such as `fetching`, `minify`, `aliases` | Update account info. |
| GET | `/v2/account/limits` | none | Get current limit counters and quotas. |
| GET | `/v2/account/storage` | none | Get storage usage/quota details. |
| GET | `/v2/account/users` | none | List account users. |
| POST | `/v2/account/sub-account` | sub-account creation body | Create sub-account. |
| DELETE | `/v2/account/sub-account?alias={alias}` | query `alias` | Close sub-account. |
| POST | `/v2/account/custom-domain` | body/query including `alias`, `domain` | Add custom domain. |
| DELETE | `/v2/account/custom-domain?alias={alias}&domain={domain}` | query `alias`, `domain` | Remove custom domain. |
| POST | `/v2/account/events/search` | event search body | Search/list account events. |
| POST | `/v2/account/events/seen` | event IDs / selection body | Mark account events as seen. |
| GET | `/v2/billing/plan` | none | Billing plan details. |
| GET | `/v2/user?userId={userId}` | query `userId` | Get user info. |
| GET | `/v2/stats/http?from={from}&to={to}` | query `from`, `to` | Transfer statistics. |
| GET | `/v2/stats/spins/views?from={from}&to={to}` | query `from`, `to` | 360-spin views statistics. |
| GET | `/v2/stats/storage?from={from}&to={to}` | query `from`, `to` | Storage statistics. |

### Files: metadata, folders, listing, and retrieval
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v2/files/meta/approval?filename={filename}` | query `filename` | Get approval flag. |
| POST | `/v2/files/meta/approval?filename={filename}` | query `filename`; body for approval metadata | Set approval flag. |
| GET | `/v2/files/meta/description?filename={filename}` | query `filename` | Get description metadata. |
| POST | `/v2/files/meta/description?filename={filename}` | query `filename`; body with description fields | Set description metadata. |
| GET | `/v2/files/meta/product?filename={filename}` | query `filename` | Get product metadata. |
| POST | `/v2/files/meta/product?filename={filename}` | query `filename`; product metadata body | Set product metadata. |
| GET | `/v2/files/meta/tags?filename={filename}` | query `filename` | Get file tags. |
| POST | `/v2/files/meta/tags?filename={filename}` | query `filename`; tags body | Set file tags. |
| DELETE | `/v2/files/meta/tags?filename={filename}` | query `filename` | Remove file tags. |
| GET | `/v2/files/meta/title?filename={filename}` | query `filename` | Get title metadata. |
| POST | `/v2/files/meta/title?filename={filename}` | query `filename`; title body | Set title metadata. |
| GET | `/v2/files/meta?filename={filename}` | query `filename` | Get all metadata. |
| POST | `/v2/files/meta?filename={filename}` | query `filename`; combined metadata body | Set combined metadata. |
| GET | `/v2/files/options?filename={filename}` | query `filename` | Get folder/file options. |
| POST | `/v2/files/options?filename={filename}` | query `filename`; options body | Set folder/file options. |
| GET | `/v2/files/poi?filename={filename}` | query `filename` | Get image points of interest. |
| POST | `/v2/files/poi?filename={filename}` | query `filename`; POI body | Set points of interest. |
| DELETE | `/v2/files/poi?filename={filename}` | query `filename` | Remove points of interest. |
| GET | `/v2/files/readdir?dirname={dirname}` | query `dirname` | Read folder contents. |
| GET | `/v2/files/stat?filename={filename}` | query `filename` | Get file info/stat. |
| GET | `/v2/files/download?filename={filename}` | query `filename` | Download file. |
| POST | `/v2/files/upload?filename={filename}` | query `filename`; binary upload body | Upload file. |
| POST | `/v2/files/fetch` | body with remote source file details | Fetch a remote file into Sirv. |
| POST | `/v2/files/copy?from={from}&to={to}` | query `from`, `to` | Copy file. |
| POST | `/v2/files/rename?from={from}&to={to}` | query `from`, `to` | Rename or move file. |
| POST | `/v2/files/delete?filename={filename}` | query `filename` | Delete one file. |
| POST | `/v2/files/batch/delete` | batch delete body | Start batch delete job. |
| GET | `/v2/files/batch/delete?id={id}` | query `id` | Get batch delete job result/status. |
| POST | `/v2/files/mkdir?dirname={dirname}` | query `dirname` | Create folder. |
| POST | `/v2/files/jwt` | JWT/signing body | Generate file-access JWT/token material. |
| POST | `/v2/files/search` | search body | Search files. |
| POST | `/v2/files/search/scroll` | search-scroll body | Continue a scrolled search. |
| POST | `/v2/files/zip` | ZIP job body | Create ZIP job. |
| GET | `/v2/files/zip?id={id}` | query `id` | Get ZIP job result/status. |

### Files: conversion and 360 helpers
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v2/files/spin2video` | spin/video conversion body | Convert a spin to video. |
| POST | `/v2/files/video2spin` | conversion body | Convert a video to spin. |
| POST | `/v2/files/spin2amazon360` | conversion body | Export Amazon 360 assets. |
| POST | `/v2/files/spin2grainger360` | conversion body | Export Grainger 360 assets. |
| POST | `/v2/files/spin2homedepot360` | conversion body | Export Home Depot 360 assets. |
| POST | `/v2/files/spin2lowes360` | conversion body | Export Lowe's 360 assets. |
| POST | `/v2/files/spin2msc360` | conversion body | Export MSC 360 assets. |
| POST | `/v2/files/spin2walmart360` | conversion body | Export Walmart 360 assets. |

Confirmed route count: **59**.

## Parameter and auth notes
- `POST /v2/token` requires `clientId` and `clientSecret`; the docs also show an optional `expiresIn` request field and an `expiresIn` response field.
- All non-token routes shown on the inspected docs use bearer auth.
- The docs examples frequently use these query parameters:
  - `filename`
  - `dirname`
  - `from`, `to`
  - `alias`, `domain`
  - `userId`
  - `id` for batch/ZIP job polling
- Search flows are body-driven rather than ordinary query-string pagination.

## Response and rate-limit notes
- The docs examples show JSON responses for metadata and management endpoints.
- Download and ZIP retrieval endpoints return file/job artifacts rather than a normal resource object.
- Example responses on the docs page expose both global and per-endpoint rate-limit headers.
- `GET /v2/account/limits` returns a rich JSON map of current counters, including `rest:global`, route-specific REST buckets, S3/FTP buckets, fetch counters, and ZIP quotas.

## Important usage notes
- The inspected docs page describes the API as `40+` commands, but the current page examples actually expose a larger method/path inventory once all GET/POST/DELETE variants are counted.
- Bearer tokens are intentionally short-lived; integrations should refresh rather than cache them indefinitely.
- Sirv's file API mixes resource-like retrieval routes with action-style routes that encode the operation in the path and key operands in query parameters.
- Search is a two-step family: start with `/files/search`, continue with `/files/search/scroll` when necessary.

## fireROUTE integration notes
- Model Sirv as four surfaces: auth, account/billing/stats, file management, and media-conversion helpers.
- Preserve query-bearing route shapes such as `/files/meta/*?filename=...` and `/files/copy?from=...&to=...` because those are the canonical forms published in the official docs.
- Surface rate-limit headers to callers when possible; the official docs clearly expect clients to monitor them.
- Keep conversion/export helpers separate from normal CRUD because they are job-like transforms rather than plain file metadata operations.

## Sources inspected
- `https://apidocs.sirv.com/`
