# Trace Moe

## Overview
- Provider: trace.moe API
- Category: Anime
- Official docs: `https://soruly.github.io/trace.moe-api/#/`
- Base URL: `https://api.trace.moe`
- Auth: optional API key for higher quota/priority via `x-trace-key` header; free guest usage is allowed by IP address
- Deprecated auth note: the docs explicitly say query-string `key` auth is deprecated and no longer supported
- HTTPS: yes
- Response format: JSON for API metadata endpoints; preview media endpoints return video/image content
- Primary use case: identify anime scenes from screenshots or first frames of supported media uploads

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/search` | required `url`; optional `cutBorders`, `anilistID` | Search by publicly reachable image URL. |
| POST | `/search` | raw binary upload, `multipart/form-data`, or `application/x-www-form-urlencoded` body | Search by uploaded image or media. Docs show multipart field name `image`. |
| GET | `/me` | none; optional `x-trace-key` header for account-specific limits | Returns quota/priority info for the current IP or API-key account. |
| GET | `/video/{token}` | opaque preview token from search results | Returns preview video for a matching scene. |
| GET | `/image/{token}` | opaque preview token from search results | Returns preview still image for a matching scene. |

## Search endpoint details
- `GET /search` example from the docs:
  - `https://api.trace.moe/search?url=https://images.plurk.com/32B15UXxymfSMwKGTObY5e.jpg`
- `POST /search` supports these content types per the docs:
  - `image/*`
  - `video/*`
  - `application/octet-stream`
  - `application/x-www-form-urlencoded`
  - multipart form uploads via `multipart/form-data`
- File size limit is documented as `25MB`; oversized uploads fail with `413 Payload Too Large`.
- `cutBorders` tells trace.moe to auto-crop black borders.
- `anilistID` restricts matching to a specific AniList title.
- The docs state video and GIF uploads are supported, but only the first frame is extracted for matching.

## Response format notes
- The official response example contains top-level fields:
  - `frameCount`
  - `error`
  - `result`
- Confirmed result fields from the docs table:
  - `anilist`
  - `filename`
  - `episode`
  - `duration`
  - `from`
  - `to`
  - `at`
  - `similarity`
  - `video`
  - `image`
- The `video` and `image` fields are preview URLs under `https://api.trace.moe/video/...` and `https://api.trace.moe/image/...`.

## Account, quota, and rate-limit notes
- Global HTTP rate limit: `100 requests/minute` per IP address (or IPv6 /64 block), with or without an API key.
- Hitting the HTTP request-rate limit returns `429 Too Many Requests`.
- Free tier search quota documented on the limits page: `100` searches per rolling 24 hours, concurrency `1`, priority `0`.
- If daily search quota is exhausted, `/search` fails with `402`.
- Concurrency limits also produce `402` when too many `/search` requests run in parallel for the account/tier.
- Queue saturation can reject requests with `503`.
- `/me` example response fields are `id`, `priority`, `concurrency`, `quota`, and `quotaUsed`.

## Error handling
- Explicitly documented/observed statuses in the official docs include:
  - `402` — search quota or concurrency limit reached
  - `413` — payload too large
  - `429` — HTTP request-rate limit exceeded
  - `503` — queue full / temporary rejection
  - `>=500` — server-side processing error noted in the API docs
- The docs also note that failed search requests (4xx/5xx) do not count against search quota.

## Integration notes for fireROUTE
- Preserve both `GET /search` and `POST /search`; they are materially different request modes.
- Use `/me` to expose live quota information when present.
- Treat preview URLs as derived helper routes; do not assume preview tokens are stable identifiers outside the search response.
- Queueing and backoff are important for this provider because free-tier concurrency is only `1`.

## Sources inspected
- `https://soruly.github.io/trace.moe-api/#/`
- `https://soruly.github.io/trace.moe-api/#/docs`
- `https://soruly.github.io/trace.moe-api/#/limits`
