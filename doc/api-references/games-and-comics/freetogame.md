# FreeToGame

## Overview
- Provider: FreeToGame API
- Category: Games & Comics
- Official docs: `https://www.freetogame.com/api-doc`
- Base URL: `https://www.freetogame.com/api`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: official docs ask clients to avoid more than `10 requests per second`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/games` | optional `platform`, `category`, `sort-by` | Returns the games catalog. The docs show these filters both individually and in combination. |
| GET | `/filter` | required `tag`; optional `platform`, optional `sort-by` | Filters games by multiple tags for more personalized results. |
| GET | `/game` | required `id` | Returns details for a specific game by numeric ID. |

## Parameter notes
- `platform` — optional platform filter for `/games` and `/filter`; docs examples include `windows`, `browser`, and `all`.
- `category` — optional category/tag filter for `/games`; docs examples include `mmorpg`, `shooter`, `pvp`, and `mmofps`.
- `sort-by` — optional sort selector; docs examples include `release-date`, `popularity`, `alphabetical`, and `relevance`.
- `tag` — required on `/filter`; the docs show dot-delimited multi-tag values such as `3d.mmorpg.fantasy.pvp`.
- `id` — required game identifier for `/game`.

## Response format notes
- All documented responses are JSON.
- `/games` returns a list of game objects.
- `/game` returns one detailed game object for the requested ID.
- The docs describe the API as exposing title, genre, description, release date, developer, publisher, official website, and related metadata.

## Error and usage notes
- Official response codes documented:
  - `200` — success
  - `404` — game or endpoint not found
  - `500` — unexpected server-side failure
- The docs state the API is free for personal and commercial use, but attribution to `FreeToGame.com` with an active hyperlink is required.
- The direct API docs route users who need browser CORS support to the provider's RapidAPI listing, so consumers should not assume the primary public origin is suitable for every browser-based cross-origin use case.
- The page also shows a "Coming Soon" recommendation concept, but the stable documented route surface currently consists of `/games`, `/filter`, and `/game`.

## Integration notes for fireROUTE
- Treat `/games` as the main catalog route and model `platform`, `category`, and `sort-by` as composable query filters.
- Represent `/filter` separately from `/games` because it uses a distinct `tag`-driven search mode.
- Enforce or at least recommend the provider's soft cap of 10 requests per second in shared infrastructure.
- Preserve the attribution requirement in downstream documentation and any packaged examples.

## Sources inspected
- `https://www.freetogame.com/api-doc`
