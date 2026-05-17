# Barter.VG

## Overview
- Provider: `Barter.VG`
- Category: `Games & Comics`
- Indexed official docs URL: `https://github.com/bartervg/barter.vg/wiki`
- Official alternative page inspected in this shard: `https://github.com/bartervg/barter.vg`
- Preferred API base URL: `https://barter.vg`
- Alternate documented host: `https://bartervg.com`
- Manual status: `manually_documented`
- Confirmed route count: `28`
- Auth: no API key, OAuth flow, or auth header is documented for the public GET routes in the official wiki; the one documented POST route is listed in the route index but its route-detail page is currently missing from the public wiki, so POST auth/body requirements are not officially described there
- HTTPS: examples in the official wiki use `https://barter.vg/...`
- Response format: JSON
- Pagination: no pagination parameters are documented on the inspected public v1 route pages
- Rate limits: none documented in the inspected official wiki pages

## Verified findings from official docs
- The official GitHub wiki home page explicitly says it is "currently focused exclusively on the API".
- The official v1 route index on the wiki confirms `28` routes: `27` GET routes and `1` POST route.
- The official route pages consistently describe the host as `barter.vg or bartervg.com`.
- The official `Getting started` page says missing values may be returned as `null` for numbers, `""` for strings, or omitted entirely.
- The official `Planned changes` page says API v2 is still only planned and currently lists: `Step 1: Employ best practices. Step 2: CORS`.
- The official repository page describes the GitHub repository as the place to track site bugs, enhancements, and issues, while the API contract itself is documented in the wiki.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/app/:app_id/settings/json` | path: `app_id` | App settings lookup keyed by third-party application ID. Route page includes an `error` field example (`no JSON found`). |
| GET | `/browse/bundles/json` | none | Bundle-count index keyed by Steam app/sub SKU. |
| GET | `/browse/cards/json` | none | Trading-card count index keyed by Steam app/sub SKU. |
| GET | `/browse/dlc/json` | none | DLC-to-base-game lookup keyed by DLC Steam appid. |
| GET | `/browse/json` | none documented | Listed in the official v1 route index, but the linked route-detail page currently resolves to GitHub's `Create new page` screen, so response details were not confirmable from the public wiki page itself. |
| GET | `/browse/tag/:tag_id/json` | path: `tag_id` | Item list by tag ID. The `ID List` wiki page documents tag IDs. |
| GET | `/bundle/:bundle_id/json` | path: `bundle_id` | Single bundle record with `meta` plus `games`. |
| GET | `/bundles/json` | none | All bundles index. |
| GET | `/giveaways/json` | none documented in inspected pages | Listed in the official v1 route index. |
| GET | `/i/:item_id/json` | path: `item_id` | Primary item lookup for games/DLC and other item metadata. |
| GET | `/i/:item_id/json2` | path: `item_id` | Official route index lists `/json2`; the linked route page adds `users` group data but its request/path section currently still shows `/i/:item_id/json`, so the public wiki is internally inconsistent here. |
| GET | `/steam/:steamid/json` | path: `steamid` | SteamID64-based alias of `GET /u/:user_id/json`. |
| GET | `/steam/app/:steam_appid/json` | path: `steam_appid` | Steam appID-based alias of `GET /i/:item_id/json`. |
| GET | `/steam/sub/:steam_subid/json` | path: `steam_subid` | Steam subID-based alias of `GET /i/:item_id/json`. |
| GET | `/u/:user_id/b/json` | path: `user_id` | Officially listed in the v1 index as user blacklist lookup. |
| GET | `/u/:user_id/c/json` | path: `user_id` | Officially listed in the v1 index as user scratchpad lookup. |
| GET | `/u/:user_id/d/json` | path: `user_id` | Officially listed in the v1 index as user traded-list lookup. |
| GET | `/u/:user_id/f/json` | path: `user_id` | Officially listed in the v1 index as user fulfilled-list lookup. |
| GET | `/u/:user_id/json` | path: `user_id` | Primary user lookup by Barter hex ID. |
| GET | `/u/:user_id/l/json` | path: `user_id` | Officially listed in the v1 index as user library lookup. |
| GET | `/u/:user_id/o/:offer_id/json` | path: `user_id`, `offer_id` | Offer lookup including `items.to` and `items.from` payloads. |
| GET | `/u/:user_id/o/accepted/json` | path: `user_id` | Returns an array of accepted offer IDs. |
| GET | `/u/:user_id/o/json` | path: `user_id` | Listed in the official v1 route index, but the linked route-detail page currently resolves to GitHub's `Create new page` screen, so query/body details were not confirmable from the public wiki page itself. |
| GET | `/u/:user_id/t/f/:user_id/json/` | path: first `user_id`, second `user_id` | Officially listed in the v1 index as tradables-by-user lookup. |
| GET | `/u/:user_id/t/json` | path: `user_id` | Listed in the official v1 route index, but the linked route-detail page currently resolves to GitHub's `Create new page` screen. |
| GET | `/u/:user_id/w/json` | path: `user_id` | Officially listed in the v1 index as user wishlist lookup. |
| GET | `/u/json` | none | Returns a site-wide user index keyed by Barter hex user IDs. |
| POST | `/u/:user_id/o/json` | path: `user_id`; request body not documented on the public page inspected here | The route is listed in the official v1 index, but the linked `Send Offer (v1)` page currently resolves to GitHub's `Create new page` screen, so body/auth requirements are not published there. |

## Parameters, formats, and schema notes confirmed from the official wiki

### Host and path variables
- The inspected route pages use `Host: barter.vg or bartervg.com`.
- Documented path variables include:
  - `:app_id`
  - `:tag_id`
  - `:bundle_id`
  - `:item_id`
  - `:steamid`
  - `:steam_appid`
  - `:steam_subid`
  - `:user_id`
  - `:offer_id`
- The official `ID List` page documents supporting numeric ID catalogs for genres, giveaways, sources, and tags that are referenced by multiple API responses.

### Response shape examples verified in this shard
- `GET /u/json`
  - Returns an object keyed by hex user ID.
  - Verified fields include `redirect`, `steam_persona`, `steam_id`, `steam_id_string`, `active`, `recent_completed`, `recent_sent`, and `recent_received`.
- `GET /u/:user_id/json`
  - Returns a single user object.
  - Verified fields include `hexid`, `steam_id`, `steam_id_string`, `steam_img`, `preferences`, `enhancedbarter`, `offers_recent_count`, `sasara`, and `max_items_per_offer`.
- `GET /i/:item_id/json`
  - Returns a large item object.
  - Verified top-level fields include `id`, `source_id`, `source_name`, `source_profile`, `sku`, `title`, `item_type`, bundle counters, ownership counts, pricing fields, review counts, platform flags, `genres`, `itad`, and `collections`.
- `GET /i/:item_id/json2`
  - Official docs extend the item payload with a `users` object containing grouped user/listing data.
- `GET /bundle/:bundle_id/json`
  - Returns a `bundles` object keyed by bundle ID with `meta` and `games` children.
- `GET /bundles/json`
  - Returns a `bundles` object keyed by bundle ID.
- `GET /browse/bundles/json`
  - Returns an object keyed by Steam SKU with `bundles`, `bundles_packages`, and `bundles_notcounted` counters.
- `GET /browse/cards/json`
  - Returns an object keyed by Steam SKU with `cards`, `bundles`, and `marketable`.
- `GET /browse/dlc/json`
  - Returns an object keyed by DLC Steam appid with `base_appID` and `base_item_id`.
- `GET /browse/tag/:tag_id/json`
  - Returns an object keyed by Steam SKU, where each value includes `item_id`.
- `GET /u/:user_id/o/accepted/json`
  - Returns an array of accepted offer IDs.
- `GET /u/:user_id/o/:offer_id/json`
  - Returns offer metadata plus nested `items.to` and `items.from` structures; the route page explicitly includes an `error` field in the response table.

## Auth, rate limits, pagination, and errors
- Public GET routes:
  - No API key, bearer token, OAuth flow, or custom auth header is documented on the inspected public GET route pages.
- POST route:
  - `POST /u/:user_id/o/json` is listed in the official route index, but its route page is currently missing from the public wiki, so request-body schema and any session/auth requirements could not be confirmed there.
- Rate limits:
  - No numeric quota, burst limit, or `429` policy is documented on the inspected official wiki pages.
- Pagination:
  - No `page`, `limit`, `offset`, or cursor parameters are documented on the inspected public list/index pages.
- Error handling:
  - `GET /app/:app_id/settings/json` includes an official example error payload: `{"error": "no JSON found"}`.
  - `GET /u/:user_id/o/:offer_id/json` includes an `error` field in the documented response schema.
  - The public wiki does not publish a global HTTP-status/error model.

## Important usage notes
- The public API reference is still a v1 GitHub wiki. The official `Planned changes` page shows v2 is not yet documented beyond a short note about future best practices and CORS.
- The public docs are incomplete in places:
  - several response fields are still labeled `TODO`
  - some linked route pages are missing and currently open GitHub's `Create new page` editor instead of route docs
  - the `/i/:item_id/json2` detail page currently shows `/i/:item_id/json` in its request/path section even though the route index lists `/json2`
- The official `Getting started` page says missing values may be represented as `null`, empty strings, or omitted properties, so clients should not assume every documented field is always present.
- The `ID List` page is important for decoding `source_id`, `genre_id`, `tag_id`, and giveaway-related numeric values used throughout v1 responses.
- Because CORS is listed as a planned v2 change rather than a documented current v1 feature, cross-origin browser use should not assume CORS support from the public docs alone.

## Integration notes for fireROUTE
- Model the provider as a JSON API hosted on `https://barter.vg`, with `https://bartervg.com` as an alternate documented host.
- Keep the route inventory at `28` confirmed public v1 routes unless the official wiki changes.
- Treat `/steam/:steamid/json`, `/steam/app/:steam_appid/json`, and `/steam/sub/:steam_subid/json` as convenience aliases for the core user/item lookups.
- Do not invent pagination or rate-limit behavior that the official wiki does not publish.
- Preserve official uncertainty where the docs themselves are incomplete (`TODO` fields, missing route pages, inconsistent `/json2` page text).

## Sources inspected in this shard
- `https://github.com/bartervg/barter.vg/wiki`
- `https://github.com/bartervg/barter.vg/wiki/Getting-started`
- `https://github.com/bartervg/barter.vg/wiki/ID-List`
- `https://github.com/bartervg/barter.vg/wiki/Planned-changes`
- `https://github.com/bartervg/barter.vg/wiki/Get-App-Settings-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Bundle-Counts-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Trading-Card-Counts-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-DLC-List-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Item-List-By-Tag-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Bundle-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Bundles-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Item-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Item-And-User-Groups-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Steam-User-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Steam-App-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Steam-Sub-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-User-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Users-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Offer-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Accepted-Offer-IDs-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-Item-List-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-User-Offers-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Get-User-Tradables-(v1)`
- `https://github.com/bartervg/barter.vg/wiki/Send-Offer-(v1)`
- `https://github.com/bartervg/barter.vg`
