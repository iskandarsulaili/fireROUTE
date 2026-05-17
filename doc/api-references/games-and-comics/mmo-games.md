# MMO Games

## Overview
- Provider: MMO Games API by MMOBomb
- Category: Games & Comics
- Official docs: `https://www.mmobomb.com/api`
- Base URL: `https://www.mmobomb.com/api1`
- Auth: no API key or account documented
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: `Please avoid doing more than 4 requests per second.`
- CORS note: the official docs direct browser users to the RapidAPI proxy if they need cross-origin support
- Confirmed routes: `5`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/games` | optional `platform`, optional `category`, optional `sort-by` | Main games collection route. The docs show it as the base games list plus the filtered/sorted variants. |
| GET | `/filter` | required `tag`; optional `platform`; optional `sort` | Multi-tag filtering route. The official example uses dot-separated tag values such as `3d.mmorpg.fantasy.pvp`. |
| GET | `/game` | required `id` | Returns one specific game by numeric ID. |
| GET | `/giveaways` | none documented | Returns live MMO giveaways. |
| GET | `/latestnews` | none documented | Returns the latest MMO-related news. |

## Parameter notes
- `/games`
  - `platform` examples: `windows`, `browser`, `all`
  - `category` examples: `mmorpg`, `shooter`, `pvp`, `mmofps`
  - `sort-by` examples: `release-date`, `popularity`, `alphabetical`, `relevance`
- `/filter`
  - `tag` is the primary filter input and the docs example shows dot-separated values in a single query parameter
  - the docs say `platform` and `sort` can also be used with this route
- `/game`
  - `id` is the game identifier from the catalog

## Response notes
- The docs describe the API as JSON over simple GET requests.
- A live official check of `/api1/games?platform=windows&category=mmorpg&sort-by=release-date` returned `200` JSON.
- A live official check of `/api1/filter?tag=3d.mmorpg.fantasy.pvp&platform=windows` returned `200` JSON.
- A live official check of `/api1/game?id=452` returned `200` JSON for `Call of Duty: Warzone`.
- A live official check of `/api1/giveaways` returned `200` JSON.
- A live official check of `/api1/latestnews` returned `200` JSON.

## Errors, auth, and pagination
- No authentication scheme is documented.
- No pagination mechanism is documented.
- Official documented status outcomes:
  - `200` — success
  - `404` — game or endpoint not found
  - `500` — unexpected server error on MMOBomb's side
- A live official check of `/api1/game?id=999999999` returned `404` JSON with `status` and `status_message`.

## Usage notes
- The docs say the API is available for everyone to use without restrictions.
- The docs ask users to attribute `MMOBomb.com` as the source of the data.
- If a browser integration needs CORS, the docs send users to the RapidAPI-hosted proxy instead of promising direct-site CORS.

## Integration notes for fireROUTE
- Treat `/games` as the main catalog route and preserve the official `sort-by` parameter spelling.
- Treat `/filter` as distinct from `/games`; its documented filter style is tag-centric and uses dot-separated values.
- Handle `/game` as the single-record lookup endpoint keyed by numeric `id`.
- Do not invent pagination behavior; the official docs do not describe any.
- Stay under the documented 4 requests/second ceiling.

## Sources inspected
- `https://www.mmobomb.com/api`
- `https://www.mmobomb.com/api1/games?platform=windows&category=mmorpg&sort-by=release-date`
- `https://www.mmobomb.com/api1/filter?tag=3d.mmorpg.fantasy.pvp&platform=windows`
- `https://www.mmobomb.com/api1/game?id=452`
- `https://www.mmobomb.com/api1/giveaways`
- `https://www.mmobomb.com/api1/latestnews`
- `https://www.mmobomb.com/api1/game?id=999999999`
