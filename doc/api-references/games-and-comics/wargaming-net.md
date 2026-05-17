# Wargaming.net

## Overview
- Provider: Wargaming.net Public API / Developer Room
- Category: Games & Comics
- Official docs landing page inspected: `https://developers.wargaming.net/`
- Official getting-started guide inspected: `https://developers.wargaming.net/documentation/guide/getting-started/`
- Official API reference inspected: `https://developers.wargaming.net/reference/`
- Base URL patterns confirmed from official API reference request URLs:
  - `https://api.worldoftanks.eu/wot/` for World of Tanks methods shown on EU realm pages
  - `https://api.wotblitz.eu/wotb/` for World of Tanks Blitz methods shown on EU realm pages
  - `https://api-modernarmor.worldoftanks.com/wotx/` for World of Tanks Modern Armor methods
  - `https://api.worldofwarships.eu/wows/` for World of Warships methods shown on EU realm pages
  - `https://api.worldofwarplanes.eu/wowp/` for World of Warplanes methods shown on EU realm pages
  - `https://api.worldoftanks.eu/wgn/` for cross-game Wargaming.net service methods shown on EU realm pages
- Auth: `application_id` is required for all methods; `access_token` is used for authenticated methods and authenticated-user extended data
- HTTPS: yes
- Methods documented in the official getting-started guide: `GET`, `POST`
- Response format: JSON; official guide says every response uses a top-level `status` plus either `data` or `error`
- Confirmed routes: `174` documented route/path patterns in the official API reference
- Route groups confirmed from the official reference:
  - `wot`: `68`
  - `wotb`: `25`
  - `wotx`: `22`
  - `wows`: `29`
  - `wowp`: `21`
  - `wgn`: `9`
- Pagination: no single provider-wide contract; list methods commonly use `limit`, and some collections also use `page_no`
- Rate limits: official guide says requests-per-second limits are enforced per `application_id`, but no numeric limits were published on the pages reviewed in this pass

## Auth and request model
- The official getting-started guide says demo access has been terminated; test requests must use a personal `application_id` from Developer Room.
- The official request format is `http(s)://<server>/<API_name>/<method block>/<method name>/?<get params>`.
- The official guide says all text parameters should be sent in UTF-8.
- `access_token` is documented for methods that require authentication and for public methods that return extra data to an authenticated user.
- The official guide says `access_token` expires in two weeks.
- The official guide recommends sending requests with `access_token` over HTTPS.
- The World of Tanks auth login page documents OpenID-based login and parameters such as `display`, `expires_at`, `nofollow`, and `redirect_uri`.
- The World of Tanks Modern Armor route inventory includes separate auth routes under `/wotx/auth/login`, `/wotx/auth/prolongate`, and `/wotx/auth/logout`.

## Common parameter notes
- `application_id` is required on every documented API method.
- `fields` is the standard response-field selector; the guide says comma separates fields, dots select nested fields, and a leading `-` excludes fields.
- `language` appears on many public methods and defaults to `en` on the pages reviewed here.
- `limit` appears on many list/search methods and is usually capped at `100` in the route pages sampled during this review.
- `type` appears on account search methods such as `/wot/account/list` and `/wotb/account/list` to switch between prefix and exact search behavior.
- `page_no` appears on some list endpoints such as `/wows/clans/list`.
- `game` appears on `/wgn/account/list` to limit cross-game account search to one or more games.
- The docs mention additional method-specific `extra` fields on some endpoints; these are published per-route in the API reference rather than globally.

## Response format notes
- The official guide says all methods return JSON.
- The official guide documents this shared envelope:
  - `status`: `ok` or `error`
  - `data`: response payload when the request succeeds
  - `error`: object with `code`, `message`, `field`, and `value` when the request fails
- The official guide also says responses may include an `ETag` header for conditional requests.
- A live anonymous request made during this review to `GET https://api.worldoftanks.eu/wot/account/list/?search=test` returned JSON:
  - `status`: `error`
  - `error.field`: `application_id`
  - `error.message`: `APPLICATION_ID_NOT_SPECIFIED`
  - `error.code`: `402`

## Error handling
- The official getting-started guide publishes these common API errors:
  - `402 %FIELD%_NOT_SPECIFIED`
  - `404 %FIELD%_NOT_FOUND`
  - `404 METHOD_NOT_FOUND`
  - `405 METHOD_DISABLED`
  - `407 %FIELD%_LIST_LIMIT_EXCEEDED`
  - `407 APPLICATION_IS_BLOCKED`
  - `407 INVALID_%FIELD%`
  - `407 INVALID_APPLICATION_ID`
  - `407 INVALID_IP_ADDRESS`
  - `407 REQUEST_LIMIT_EXCEEDED`
  - `504 SOURCE_NOT_AVAILABLE`
- The sampled `/wot/account/list` page also publishes route-specific errors such as `SEARCH_NOT_SPECIFIED`, `NOT_ENOUGH_SEARCH_LENGTH`, and `SEARCH_LIST_LIMIT_EXCEEDED`.

## Pagination
- Pagination is method-specific, not global.
- Search/list routes commonly expose `limit`.
- Some collection routes also expose `page_no`; for example, the official `/wows/clans/list` page documents both `limit` and `page_no`.
- Many reference pages return fewer records than requested and cap maximum `limit` at `100`.

## Confirmed route inventory

### World of Tanks (`68`)
- `/wot/account/list`
- `/wot/account/info`
- `/wot/account/tanks`
- `/wot/account/achievements`
- `/wot/account/wtr`
- `/wot/auth/login`
- `/wot/auth/prolongate`
- `/wot/auth/logout`
- `/wot/stronghold/claninfo`
- `/wot/stronghold/clanreserves`
- `/wot/stronghold/activateclanreserve`
- `/wot/globalmap/fronts`
- `/wot/globalmap/provinces`
- `/wot/globalmap/claninfo`
- `/wot/globalmap/clanprovinces`
- `/wot/globalmap/clanbattles`
- `/wot/globalmap/seasons`
- `/wot/globalmap/seasonclaninfo`
- `/wot/globalmap/seasonaccountinfo`
- `/wot/globalmap/seasonrating`
- `/wot/globalmap/seasonratingneighbors`
- `/wot/globalmap/events`
- `/wot/globalmap/eventclaninfo`
- `/wot/globalmap/eventaccountinfo`
- `/wot/globalmap/eventaccountratings`
- `/wot/globalmap/eventaccountratingneighbors`
- `/wot/globalmap/eventrating`
- `/wot/globalmap/eventratingneighbors`
- `/wot/globalmap/info`
- `/wot/encyclopedia/tanks`
- `/wot/encyclopedia/tankinfo`
- `/wot/encyclopedia/vehicles`
- `/wot/encyclopedia/vehicleprofile`
- `/wot/encyclopedia/tankengines`
- `/wot/encyclopedia/tankturrets`
- `/wot/encyclopedia/tankradios`
- `/wot/encyclopedia/tankchassis`
- `/wot/encyclopedia/tankguns`
- `/wot/encyclopedia/achievements`
- `/wot/encyclopedia/info`
- `/wot/encyclopedia/arenas`
- `/wot/encyclopedia/provisions`
- `/wot/encyclopedia/personalmissions`
- `/wot/encyclopedia/boosters`
- `/wot/encyclopedia/vehicleprofiles`
- `/wot/encyclopedia/modules`
- `/wot/encyclopedia/badges`
- `/wot/encyclopedia/crewroles`
- `/wot/encyclopedia/crewskills`
- `/wot/ratings/types`
- `/wot/ratings/dates`
- `/wot/ratings/accounts`
- `/wot/ratings/neighbors`
- `/wot/ratings/top`
- `/wot/clanratings/types`
- `/wot/clanratings/dates`
- `/wot/clanratings/clans`
- `/wot/clanratings/neighbors`
- `/wot/clanratings/top`
- `/wot/tanks/stats`
- `/wot/tanks/achievements`
- `/wot/tanks/mastery`
- `/wot/clans/list`
- `/wot/clans/info`
- `/wot/clans/accountinfo`
- `/wot/clans/glossary`
- `/wot/clans/messageboard`
- `/wot/clans/memberhistory`

### World of Tanks Blitz (`25`)
- `/wotb/account/list`
- `/wotb/account/info`
- `/wotb/account/achievements`
- `/wotb/account/tankstats`
- `/wotb/encyclopedia/vehicles`
- `/wotb/encyclopedia/vehicleprofile`
- `/wotb/encyclopedia/modules`
- `/wotb/encyclopedia/provisions`
- `/wotb/encyclopedia/info`
- `/wotb/encyclopedia/achievements`
- `/wotb/encyclopedia/crewskills`
- `/wotb/encyclopedia/vehicleprofiles`
- `/wotb/clans/list`
- `/wotb/clans/info`
- `/wotb/clans/accountinfo`
- `/wotb/clans/glossary`
- `/wotb/tanks/stats`
- `/wotb/tanks/achievements`
- `/wotb/tournaments/list`
- `/wotb/tournaments/info`
- `/wotb/tournaments/teams`
- `/wotb/tournaments/stages`
- `/wotb/tournaments/matches`
- `/wotb/tournaments/standings`
- `/wotb/tournaments/tables`

### World of Tanks Modern Armor (`22`)
- `/wotx/account/list`
- `/wotx/account/info`
- `/wotx/account/achievements`
- `/wotx/account/xuidinfo`
- `/wotx/account/psninfo`
- `/wotx/auth/login`
- `/wotx/auth/prolongate`
- `/wotx/auth/logout`
- `/wotx/clans/list`
- `/wotx/clans/info`
- `/wotx/clans/accountinfo`
- `/wotx/clans/glossary`
- `/wotx/encyclopedia/crewroles`
- `/wotx/encyclopedia/vehicles`
- `/wotx/encyclopedia/vehicleupgrades`
- `/wotx/encyclopedia/achievements`
- `/wotx/encyclopedia/info`
- `/wotx/encyclopedia/modules`
- `/wotx/encyclopedia/arenas`
- `/wotx/encyclopedia/vehicleprofile`
- `/wotx/tanks/stats`
- `/wotx/tanks/achievements`

### World of Warships (`29`)
- `/wows/account/list`
- `/wows/account/info`
- `/wows/account/achievements`
- `/wows/account/statsbydate`
- `/wows/encyclopedia/info`
- `/wows/encyclopedia/ships`
- `/wows/encyclopedia/achievements`
- `/wows/encyclopedia/shipprofile`
- `/wows/encyclopedia/modules`
- `/wows/encyclopedia/accountlevels`
- `/wows/encyclopedia/crews`
- `/wows/encyclopedia/crewskills`
- `/wows/encyclopedia/crewranks`
- `/wows/encyclopedia/battletypes`
- `/wows/encyclopedia/consumables`
- `/wows/encyclopedia/collections`
- `/wows/encyclopedia/collectioncards`
- `/wows/encyclopedia/battlearenas`
- `/wows/ships/stats`
- `/wows/ships/badges`
- `/wows/seasons/info`
- `/wows/seasons/shipstats`
- `/wows/seasons/accountinfo`
- `/wows/clans/list`
- `/wows/clans/info`
- `/wows/clans/accountinfo`
- `/wows/clans/glossary`
- `/wows/clans/season`
- `/wows/clans/seasonstats`

### World of Warplanes (`21`)
- `/wowp/account/list`
- `/wowp/account/info2`
- `/wowp/account/achievements`
- `/wowp/encyclopedia/planes`
- `/wowp/encyclopedia/planeinfo`
- `/wowp/encyclopedia/planemodules`
- `/wowp/encyclopedia/planeupgrades`
- `/wowp/encyclopedia/planespecification`
- `/wowp/encyclopedia/achievements`
- `/wowp/encyclopedia/info`
- `/wowp/ratings/types`
- `/wowp/ratings/accounts`
- `/wowp/ratings/neighbors`
- `/wowp/ratings/top`
- `/wowp/ratings/dates`
- `/wowp/planes/stats`
- `/wowp/planes/achievements`
- `/wowp/clans/list`
- `/wowp/clans/info`
- `/wowp/clans/glossary`
- `/wowp/clans/accountinfo`

### Wargaming.net shared services (`9`)
- `/wgn/account/list`
- `/wgn/account/info`
- `/wgn/clans/list`
- `/wgn/clans/info`
- `/wgn/clans/membersinfo`
- `/wgn/clans/glossary`
- `/wgn/clans/messageboard`
- `/wgn/clans/memberhistory`
- `/wgn/servers/info`

## Important usage notes
- The official homepage positions Developer Room as the place to register applications, read docs, and use the request explorer.
- The official guide says demo access is gone, so fireROUTE integrations need a real application registration path rather than relying on anonymous sandbox credentials.
- Authentication is split across route families: classic Wargaming account login is documented under `/wot/auth/*`, while Modern Armor publishes console-oriented auth under `/wotx/auth/*`.
- The route surface is broad enough that fireROUTE should model this provider as a multi-product API family rather than a single small REST API.
- Realm is part of the host pattern for most products. The pages sampled here used `eu`, `na`, and `asia` for WOT/WOTB/WOWS/WOWP/WGN, while sampled Modern Armor pages used the single `api-modernarmor.worldoftanks.com` host.

## Live checks performed
- Reviewed `https://developers.wargaming.net/`
- Reviewed `https://developers.wargaming.net/documentation/guide/getting-started/`
- Reviewed `https://developers.wargaming.net/reference/`
- Reviewed route pages including:
  - `https://developers.wargaming.net/reference/all/wot/account/list/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wot/auth/login/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wows/clans/list/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wgn/account/list/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wotb/account/list/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wotx/account/list/?r_realm=wgcb`
  - `https://developers.wargaming.net/reference/all/wows/account/list/?r_realm=eu`
  - `https://developers.wargaming.net/reference/all/wowp/account/list/?r_realm=eu`
- Live-checked `GET https://api.worldoftanks.eu/wot/account/list/?search=test` without `application_id`

## Sources inspected
- `https://developers.wargaming.net/`
- `https://developers.wargaming.net/documentation/guide/getting-started/`
- `https://developers.wargaming.net/reference/`
- `https://developers.wargaming.net/reference/all/wot/account/list/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wot/auth/login/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wows/clans/list/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wgn/account/list/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wotb/account/list/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wotx/account/list/?r_realm=wgcb`
- `https://developers.wargaming.net/reference/all/wows/account/list/?r_realm=eu`
- `https://developers.wargaming.net/reference/all/wowp/account/list/?r_realm=eu`
- `https://api.worldoftanks.eu/wot/account/list/?search=test`
