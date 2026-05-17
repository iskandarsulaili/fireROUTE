# GamerPower

## Overview
- Provider: GamerPower Free Games & Giveaways API
- Category: Games & Comics
- Official docs: `https://www.gamerpower.com/api-read`
- Base URL documented on the official page: `https://gamerpower.com/api`
- Working example URLs on the same page use: `https://www.gamerpower.com/api`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented on the official page
- Rate limits: `Please avoid doing more than 4 requests per second.`
- CORS note: the official page says cross-origin access is available through the RapidAPI proxy, not the direct site endpoint

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/giveaway` | required `id` query parameter | Returns details for one specific giveaway. |
| GET | `/giveaways` | optional `platform`, `type`, `sort-by` | Returns live giveaways; filters and sorting are optional. |
| GET | `/filter` | optional `platform`, optional `type` | Filter/group endpoint for personalized results; docs example uses dot-separated multi-values. |
| GET | `/worth` | optional `platform`, optional `type` | Returns total live giveaways and estimated USD worth. |

## Query parameter notes
- `/giveaway`
  - `id` — required numeric giveaway identifier shown in the official example (`/api/giveaway?id=525`).
- `/giveaways`
  - `platform` — documented examples include values such as `pc`, `steam`, `epic-games-store`, `ubisoft`, `gog`, `itchio`, `ps4`, `ps5`, `xbox-one`, `xbox-series-xs`, `switch`, `android`, `ios`, `vr`, `battlenet`, `origin`, `drm-free`, `xbox-360`
  - `type` — documented values: `game`, `loot`, `beta`
  - `sort-by` — documented values: `date`, `value`, `popularity`
- `/filter`
  - Official example: `/api/filter?platform=epic-games-store.steam.android&type=game.loot`
  - The example shows multi-value grouping with dot-separated lists.
- `/worth`
  - The docs explicitly say `platform` and `type` can also be used here, for example `/api/worth?platform=pc&type=game`.

## Response notes
- The page describes the API as JSON-over-HTTP GET only.
- The docs market the payload as “rich giveaway data,” including fields such as giveaway type, giveaway status, instructions, expiration dates, and similar listing metadata.
- No formal JSON schema table is published on the page, but the examples and prose clearly position the API as structured giveaway listing data rather than plain text.

## Error handling
- The official page documents these status outcomes:
  - `200` — success
  - `201` — no active giveaways available at the moment
  - `404` — giveaway or endpoint not found
  - `500` — unexpected server error on GamerPower’s side
- The page does not publish a more detailed structured error-body schema.

## Usage notes
- The API is free to use without keys or accounts.
- The official page asks users to attribute `GamerPower.com` as the source of the data.
- If a browser-based integration requires CORS support, the official page directs users to the RapidAPI-hosted proxy instead of promising direct-site CORS.
- All examples on the docs page use simple GET requests and query strings; no POST bodies or auth headers are documented.

## Integration notes for fireROUTE
- Treat `/giveaways` as the main collection route and `/giveaway` as the single-item lookup route.
- Preserve `sort-by` exactly with its hyphenated name.
- The `/filter` endpoint appears to support grouped multi-value filtering using dot-separated tokens; do not normalize those separators away without testing.
- Consumers should be prepared for the unusual `201` no-active-giveaways condition.

## Sources inspected
- `https://www.gamerpower.com/api-read`
- `https://www.gamerpower.com/api/giveaway?id=525`
- `https://www.gamerpower.com/api/giveaways`
- `https://www.gamerpower.com/api/filter?platform=epic-games-store.steam.android&type=game.loot`
- `https://www.gamerpower.com/api/worth`
