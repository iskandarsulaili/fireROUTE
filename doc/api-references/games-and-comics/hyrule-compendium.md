# Hyrule Compendium

## Overview
- Provider: Hyrule Compendium API
- Category: Games & Comics
- Official docs: `https://gadhagod.github.io/Hyrule-Compendium-API/`
- Official project page: `https://github.com/gadhagod/Hyrule-Compendium-API`
- Base URL: `https://botw-compendium.herokuapp.com/api/v3`
- Auth: no API key or account documented
- HTTPS: yes
- Response format: JSON for data routes, PNG for image routes
- Pagination: none documented
- Rate limits: none documented
- Confirmed routes: `9`
- Service note: the official repo warns that v1 and v2 were being discontinued on 2024-09-29; the current docs and live checks in this review were for the documented v3 routes under the Heroku host above.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/compendium/entry/{entry}` | path `entry` = compendium entry name or numeric ID; optional `game` query | Returns one compendium entry. Names should use underscores or URL-encoded spaces when needed. |
| GET | `/compendium/all` | optional `game` query | Returns all compendium entries. |
| GET | `/compendium/category/{category}` | path `category` = `creatures`, `equipment`, `materials`, `monsters`, or `treasure`; optional `game` query | Returns all entries in one category. |
| GET | `/compendium/master_mode/entry/{entry}` | path `entry` = master-mode entry name or numeric ID | Returns one master-mode-exclusive entry. |
| GET | `/compendium/master_mode/all` | none documented | Returns all master-mode-exclusive entries. |
| GET | `/compendium/entry/{entry}/image` | path `entry` = entry name or numeric ID | Returns the entry image as a PNG file. |
| GET | `/compendium/master_mode/entry/{entry}/image` | path `entry` = master-mode entry name or numeric ID | Returns the master-mode entry image as a PNG file. |
| GET | `/regions/{region}` | path `region` = region name | Returns one Hyrule region. |
| GET | `/regions/all` | none documented | Returns all regions. |

## Parameter and query notes
- The docs say `/compendium/entry/{entry}` and `/compendium/master_mode/entry/{entry}` accept either an entry name or an entry ID.
- For name lookups, the docs tell clients to replace spaces with `_` or `%20`.
- The `game` query parameter is documented for compendium queries:
  - not set, `1`, or `botw` => query Breath of the Wild
  - `2` or `totk` => query Tears of the Kingdom
- The docs explicitly say an invalid `game` value returns `400`.
- The Regions API docs say regions currently support only the Breath of the Wild map.

## Response notes
- Data routes use a top-level JSON wrapper containing `data`.
- The compendium entry schema varies by category; the docs publish separate field sets for monsters, equipment, materials, creatures, and treasure.
- Common documented entry fields include `name`, `id`, `category`, `description`, and `image`.
- The image routes return 280x280 PNG images.
- A live official check of `/compendium/entry/white-maned_lynel` returned `200` JSON.
- A live official check of `/regions/all` returned `200` JSON with a top-level `data` array.

## Errors, auth, and pagination
- No authentication scheme is documented.
- No pagination scheme is documented for any route.
- No rate-limit policy is documented.
- A live official check of `/compendium/entry/123?game=xyz` returned `400` JSON with top-level `data`, `message`, and `status`.
- A live official check of `/compendium/entry/not_a_real_entry` returned `404` JSON with top-level `data`, `message`, and `status`.

## Integration notes for fireROUTE
- Treat the API as two families: compendium data and BOTW-only region data.
- Preserve the optional `game` selector for compendium routes rather than splitting BOTW and TOTK into separate adapters.
- Handle image routes as binary assets, not JSON.
- Expect category-dependent payload shapes for compendium entries.
- Do not assume master-mode data exists for Tears of the Kingdom; the docs present master mode as its own BOTW-oriented route family.

## Sources inspected
- `https://gadhagod.github.io/Hyrule-Compendium-API/`
- `https://gadhagod.github.io/Hyrule-Compendium-API/compendium-api.md`
- `https://gadhagod.github.io/Hyrule-Compendium-API/regions-api.md`
- `https://github.com/gadhagod/Hyrule-Compendium-API`
- `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/white-maned_lynel`
- `https://botw-compendium.herokuapp.com/api/v3/regions/all`
- `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/123?game=xyz`
- `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/not_a_real_entry`
- `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/white-maned_lynel/image`
