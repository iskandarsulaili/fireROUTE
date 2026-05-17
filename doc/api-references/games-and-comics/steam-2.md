# Steam

## Overview
- Provider: Internal Steam Web API wiki
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::8`
- Official docs inspected: `https://github.com/Revadike/InternalSteamWebAPI/wiki`
- Additional official source page inspected: `https://github.com/Revadike/InternalSteamWebAPI`
- Canonical base URL: no single canonical host is published on the reviewed wiki home page
- Base-host notes from the reviewed docs:
  - the route inventory is documented as relative paths
  - `store.steampowered.com` is explicitly called out in the global rate-limit note
  - group/profile endpoints accept multiple URL forms such as `/gid/:groupid/*`, `/groups/:vanity_url/*`, `/profiles/:steamid/*`, `/id/:vanity_url/*`, and `/my/*`
- Auth: no API-key flow is documented; routes marked with `(*)` require an authenticated Steam session and may behave differently when logged in
- HTTPS: yes
- Response-format note: the reviewed index is focused on web/AJAX endpoints and does not publish one shared schema; many routes are clearly JSON/AJAX-style, but the home page does not define a single universal response contract
- Confirmed routes: `206`

## What the official docs confirm
- The repository describes itself as documentation for the unofficial and internal Steam Web API.
- The reviewed GitHub wiki home page lists `206` routes with explicit methods (`188` `GET` + `18` `POST`).
- The same page also lists `7` additional `TODO` entries without full method/behavior documentation:
  - `/api/addwalletcredittocart`
  - `/api/begincheckout`
  - `/api/bpeventbackground`
  - `/api/initializetransaction`
  - `/api/finalizetransaction`
  - `/api/removefromcart`
  - `/api/setcouponforcartlineitem`
- `50` of the listed routes are marked `(*)`, which the wiki explains means they require an authenticated / logged-in Steam session.

## Route inventory by family
The reviewed wiki home page does not inline every route's query parameters, but it does publish a complete top-level path inventory.

| Family | Documented routes |
|---|---:|
| `api` | 33 |
| `comment` | 24 |
| `actions` | 21 |
| `saleaction` | 18 |
| `events` | 13 |
| `broadcast` | 12 |
| `market` | 10 |
| `contenthub` | 8 |
| `profiles` | 5 |
| `checkout` | 4 |
| `gid` | 4 |
| `mobileconf` | 4 |
| `tagdata` | 4 |
| `textfilter` | 4 |
| `account` | 3 |
| `curators` | 3 |
| `sale` | 3 |
| `search` | 3 |
| `curator` | 2 |
| `default` | 2 |
| `economy` | 2 |
| `explore` | 2 |
| `forum` | 2 |
| `friends` | 2 |
| `points` | 2 |
| `wizard` | 2 |
| singleton families | 21 |

Singleton-family paths seen on the reviewed home page:
- `/about/stats`
- `/apphover/:appid`
- `/apphoverpublic/:appid`
- `/appreviewhistogram/:appid`
- `/appreviews/:appid`
- `/cart/getcartstate`
- `/dlc/:appid/ajaxgetdlclist`
- `/dynamicstore/userdata`
- `/inventory/:steamid/:appid/:contextid`
- `/itemstore/:appid/ajaxgetitemdefs`
- `/library/appcommunityfeed/:appid`
- `/miniprofile/:accountid/json`
- `/pointssummary/ajaxgetasyncconfig`
- `/reservation/ajaxgetuserstate`
- `/sharedfiles/ajaxgetmaturecontentwarningdialog`
- `/tradeoffer/new/partnerinventory`
- `/updated/ajaxgetmyappsraw`
- `/userreviews/ajaxgetvotes`
- `/wishlist/profiles/:steamid/wishlistdata`
- `/workshop/ajaxfindworkshops`
- `/ajaxrequestplaytestaccess/:appid`

## Shared path parameters and URL-shape notes
The reviewed home page exposes many path placeholders even when full per-route parameter tables live on individual wiki pages.

Common placeholders visible on the reviewed route index include:
- `:appid`
- `:steamid`
- `:accountid`
- `:clanid`
- `:groupid`
- `:gidforum`
- `:gidfeature`
- `:eventid`
- `:sharedfileid`
- `:bundleid`
- `:packageid`
- `:country`
- `:region`
- `:language`
- `:query`
- `:owner`
- `:contextid`
- `:emoticon_name`
- `:sticker_name`
- `:tab`

Special URL-variation notes published on the home page:
- Group endpoints may use:
  - `/gid/:groupid/*`
  - `/groups/:vanity_url/*`
  - `/ogg/:appid/*` for OGG groups
  - `/games/:vanity_url/*` for OGG groups
- Profile endpoints may use:
  - `/profiles/:steamid/*`
  - `/id/:vanity_url/*` when a custom profile URL exists
  - `/my/*` when logged in

## Authentication
- The home page explains that an endpoint is considered authenticated when it behaves differently while the user is logged in.
- This may mean either:
  - the returned data changes for logged-in users, or
  - the endpoint does not work at all without an authenticated session
- The `(*)` marker on the route index is the official reviewed indicator for those session-gated routes.
- The reviewed docs do not describe an API-key, OAuth, or bearer-token flow; the authentication model is browser-session / Steam-login based.

## HTTP methods, rate limits, pagination, and errors
- HTTP methods:
  - the reviewed home page says some endpoints support multiple HTTP methods
  - when the wiki displays only one method, it uses the priority order `GET` then `POST`
  - because of that note, the displayed method should be treated as the preferred / primary documented method, not necessarily the only method the backend accepts
- Rate limits:
  - the reviewed home page explicitly says `store.steampowered.com` has a limit of `300` store requests per `5` minutes
- Pagination:
  - no single global pagination scheme is documented on the reviewed home page
  - pagination, when present, is endpoint-specific and must be taken from individual route pages
- Errors:
  - no global shared error schema is documented on the reviewed home page
  - the reviewed repository README notes the wiki is community-maintained and incomplete, so route-specific behavior can vary

## Important usage notes
- The repository README explicitly says this project is not intended to document the official Steam Web API that uses API keys.
- The README instead points users wanting the official keyed API to xPaw's Steam Web API documentation.
- The README also says the wiki is incomplete and depends on community contributions to stay current.
- The wiki home page and README together make this provider best understood as an unofficial relative-path route catalog, not a polished vendor-supported developer portal.

## Integration notes for fireROUTE
- Model this provider as a large unofficial Steam web-route catalog rather than a conventional single-base REST API.
- Preserve the distinction between documented `GET`/`POST` routes and the `7` additional `TODO` placeholder entries.
- Preserve session-required behavior for all `(*)` routes; those are not public anonymous endpoints.
- Do not force one canonical host for every route because the reviewed docs only document relative paths and explicitly discuss multiple path aliases for groups/profiles.
- Keep the documented store-host rate limit separate from any assumptions about other Steam web properties.

## Sources inspected
- `https://github.com/Revadike/InternalSteamWebAPI/wiki`
- `https://github.com/Revadike/InternalSteamWebAPI`
