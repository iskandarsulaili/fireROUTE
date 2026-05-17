# Wallhaven

## Overview
- Provider: Wallhaven API v1
- Category: Photography
- Official docs: `https://wallhaven.cc/help/api`
- Base URL: `https://wallhaven.cc/api/v1`
- Auth: optional API key for some features; the docs explicitly say NSFW search requires a valid API key, and the documented settings/collections routes are shown with `apikey`
- HTTPS: yes
- Response format: JSON
- Pagination: page-based on search/listing endpoints via `page`
- Rate limits: no numeric rate limit documented on the inspected page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/w/{id}` | path `id` | Fetch wallpaper details. The docs example uses `/w/94x38z`. |
| GET | `/search` | optional `q`, `categories`, `purity`, `sorting`, `order`, `topRange`, `atleast`, `resolutions`, `ratios`, `colors`, `page`, `seed`, optional `apikey` | Search and listing endpoint. NSFW access requires a valid API key according to the docs. |
| GET | `/tag/{id}` | path `id` | Fetch tag details. The docs example uses `/tag/1`. |
| GET | `/settings` | required `apikey` | Fetch account settings for the API key owner. |
| GET | `/collections` | required `apikey` | Fetch user collections; the docs page shows collection examples with API key auth. |

Confirmed route count: **5**.

## Search parameter notes
The official docs page explicitly lists these search parameters:
- `q` — search query
- `categories` — category bitmask-like selector such as `100`, `101`, etc.
- `purity` — purity selector such as `100`, `110`, `111`; NSFW requires valid API key
- `sorting` — includes `date_added`, `relevance`, `random`, `views`, `favorites`, `toplist`
- `order` — `desc` or `asc`
- `topRange` — `1d`, `3d`, `1w`, `1M`, `3M`, `6M`, `1y` (requires `sorting=toplist`)
- `atleast` — minimum resolution
- `resolutions` — comma-separated exact resolutions
- `ratios` — comma-separated aspect ratios
- `colors` — search by color
- `page` — pagination
- `seed` — optional six-character seed for random results
- `apikey` — used for authenticated features and some result scopes

## Response notes
- The wallpaper detail example shows a top-level `data` object with fields including `id`, `url`, `short_url`, `uploader`, `views`, `favorites`, `purity`, `category`, `resolution`, `file_type`, `path`, `thumbs`, and `tags`.
- The docs page is JSON-oriented and does not publish a separate XML or alternate response format.

## Error and usage notes
- The inspected docs page did not publish a dedicated error schema or numeric rate-limit section.
- Auth is not globally required, but some routes/features clearly depend on `apikey`.

## fireROUTE integration notes
- Wallhaven is a clean JSON provider with one main search endpoint plus four lookup/account endpoints.
- Keep API-key handling optional at the provider level but required on `/settings`, `/collections`, and NSFW-enabled searches.

## Sources inspected
- `https://wallhaven.cc/help/api`
