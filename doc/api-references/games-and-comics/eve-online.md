# Eve Online

## Overview
- Provider: EVE Swagger Interface (ESI)
- Category: Games & Comics
- Official docs URL from index: `https://esi.evetech.net/ui`
- Official API explorer reached from the docs URL: `https://developers.eveonline.com/api-explorer`
- Official OpenAPI document used in this pass: `https://esi.evetech.net/latest/swagger.json`
- Base URL: `https://esi.evetech.net/latest`
- Auth: mixed public and protected surface; the official Swagger security definition is `oauth2` (`evesso`) with authorization URL `https://login.eveonline.com/v2/oauth/authorize`
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `195` documented operations (`161` GET, `20` POST, `7` PUT, `7` DELETE)
- Public vs protected split: `76` public operations and `119` scope-protected operations

## Shared request conventions
- `datasource` query parameter is present on all `195` operations; the official enum/default shown in the OpenAPI is `tranquility`.
- `If-None-Match` request header is present on `160` operations for cache validation with ETags.
- The Swagger document exposes `token` query parameters on the `119` protected operations as part of the official Swagger 2.0 description of EVE SSO authorization.
- `page` query pagination appears on `40` operations.
- `Accept-Language` header plus `language` query parameter appear on `17` localization-aware routes.

## Authentication and rate limits
- Protected routes use EVE SSO scopes; examples from the official spec include `esi-assets.read_assets.v1`, `esi-mail.read_mail.v1`, `esi-wallet.read_character_wallet.v1`, `esi-fleets.write_fleet.v1`, and `esi-ui.open_window.v1`.
- The official spec expresses auth through the `evesso` OAuth2 definition and per-operation scope lists.
- A live anonymous check of `GET https://esi.evetech.net/latest/characters/2112625428/mail/?datasource=tranquility` returned `401` JSON body `{"error":"Unauthorized - No token provided"}`.
- The official explorer/spec does not publish one single global quota number for every route, but live responses expose rate-limit headers. A live check of `/status/` returned:
  - `X-Ratelimit-Group: status`
  - `X-Ratelimit-Limit: 600/15m`
  - `X-Ratelimit-Remaining: 597`
  - `X-Ratelimit-Used: 1`

## Pagination, caching, and response notes
- Many collection routes use `page`, with live pagination metadata exposed through `X-Pages`.
- A live check of `GET /markets/10000002/orders/?datasource=tranquility&page=1` returned `X-Pages: 408`.
- ESI supports ETag caching; a live `/status/` response returned an `ETag` header, matching the widespread official `If-None-Match` parameter coverage.
- All reviewed routes return JSON; the official OpenAPI top-level `produces` list is `application/json`.
- Localized routes use the documented `language` query parameter and `Accept-Language` header combination.

## Error handling
- Live protected-route failure: `401` with JSON body `{"error":"Unauthorized - No token provided"}`.
- Live not-found example: `GET https://esi.evetech.net/latest/universe/types/999999999/?datasource=tranquility` returned `404` with JSON body `{"error":"Type not found"}`.
- The official spec also documents route-specific `304` cache hits and other endpoint-level statuses in the OpenAPI responses.

## Route counts by official tag

| Tag | Total ops | Secured ops | Method split |
|---|---:|---:|---|
| Universe | 30 | 1 | GET 28, POST 2 |
| Corporation | 22 | 18 | GET 22 |
| Character | 14 | 10 | GET 12, POST 2 |
| Fleets | 14 | 14 | GET 4, POST 3, PUT 4, DELETE 3 |
| Market | 11 | 5 | GET 11 |
| Contacts | 9 | 9 | GET 6, POST 1, PUT 1, DELETE 1 |
| Contracts | 9 | 6 | GET 9 |
| Mail | 9 | 9 | GET 4, POST 2, PUT 1, DELETE 2 |
| Faction Warfare | 8 | 2 | GET 8 |
| Industry | 8 | 6 | GET 8 |
| Assets | 6 | 6 | GET 2, POST 4 |
| Wallet | 6 | 6 | GET 6 |
| Dogma | 5 | 0 | GET 5 |
| User Interface | 5 | 5 | POST 5 |
| Alliance | 4 | 0 | GET 4 |
| Calendar | 4 | 4 | GET 3, PUT 1 |
| Planetary Interaction | 4 | 3 | GET 4 |
| Skills | 3 | 3 | GET 3 |
| Sovereignty | 3 | 0 | GET 3 |
| Wars | 3 | 0 | GET 3 |
| Fittings | 3 | 3 | GET 1, POST 1, DELETE 1 |
| Killmails | 3 | 2 | GET 3 |
| Location | 3 | 3 | GET 3 |
| Clones | 2 | 2 | GET 2 |
| Loyalty | 2 | 1 | GET 2 |
| Search | 1 | 1 | GET 1 |
| Incursions | 1 | 0 | GET 1 |
| Insurance | 1 | 0 | GET 1 |
| Routes | 1 | 0 | GET 1 |
| Status | 1 | 0 | GET 1 |

## Important usage notes
- ESI is not all-or-nothing auth: a large public read-only surface coexists with many character/corporation/fleet/mail/account routes that require scope-specific EVE SSO access.
- Preserve `datasource`, `page`, `language`, `Accept-Language`, and `If-None-Match` exactly; these are first-class parts of the official API contract.
- The official Swagger document still exposes protected access through query `token` parameters, so fireROUTE should preserve the official schema even if later implementation work normalizes bearer-token handling internally.
- Some route groups are action-oriented rather than data-oriented, especially `Fleets`, `User Interface`, `Contacts`, `Mail`, and `Fittings` where POST/PUT/DELETE operations matter.

## Confirmed endpoint inventory
- Alliance (`4`): `GET /alliances/`, `GET /alliances/{alliance_id}/`, `GET /alliances/{alliance_id}/corporations/`, `GET /alliances/{alliance_id}/icons/`
- Contacts (`9`): `DELETE /characters/{character_id}/contacts/`, `GET /alliances/{alliance_id}/contacts/`, `GET /alliances/{alliance_id}/contacts/labels/`, `GET /characters/{character_id}/contacts/`, `GET /characters/{character_id}/contacts/labels/`, `GET /corporations/{corporation_id}/contacts/`, `GET /corporations/{corporation_id}/contacts/labels/`, `POST /characters/{character_id}/contacts/`, `PUT /characters/{character_id}/contacts/`
- Character (`14`): `GET /characters/{character_id}/`, `GET /characters/{character_id}/agents_research/`, `GET /characters/{character_id}/blueprints/`, `GET /characters/{character_id}/corporationhistory/`, `GET /characters/{character_id}/fatigue/`, `GET /characters/{character_id}/medals/`, `GET /characters/{character_id}/notifications/`, `GET /characters/{character_id}/notifications/contacts/`, `GET /characters/{character_id}/portrait/`, `GET /characters/{character_id}/roles/`, `GET /characters/{character_id}/standings/`, `GET /characters/{character_id}/titles/`, `POST /characters/affiliation/`, `POST /characters/{character_id}/cspa/`
- Assets (`6`): `GET /characters/{character_id}/assets/`, `GET /corporations/{corporation_id}/assets/`, `POST /characters/{character_id}/assets/locations/`, `POST /characters/{character_id}/assets/names/`, `POST /corporations/{corporation_id}/assets/locations/`, `POST /corporations/{corporation_id}/assets/names/`
- Skills (`3`): `GET /characters/{character_id}/attributes/`, `GET /characters/{character_id}/skillqueue/`, `GET /characters/{character_id}/skills/`
- Calendar (`4`): `GET /characters/{character_id}/calendar/`, `GET /characters/{character_id}/calendar/{event_id}/`, `GET /characters/{character_id}/calendar/{event_id}/attendees/`, `PUT /characters/{character_id}/calendar/{event_id}/`
- Clones (`2`): `GET /characters/{character_id}/clones/`, `GET /characters/{character_id}/implants/`
- Contracts (`9`): `GET /characters/{character_id}/contracts/`, `GET /characters/{character_id}/contracts/{contract_id}/bids/`, `GET /characters/{character_id}/contracts/{contract_id}/items/`, `GET /contracts/public/bids/{contract_id}/`, `GET /contracts/public/items/{contract_id}/`, `GET /contracts/public/{region_id}/`, `GET /corporations/{corporation_id}/contracts/`, `GET /corporations/{corporation_id}/contracts/{contract_id}/bids/`, `GET /corporations/{corporation_id}/contracts/{contract_id}/items/`
- Fittings (`3`): `DELETE /characters/{character_id}/fittings/{fitting_id}/`, `GET /characters/{character_id}/fittings/`, `POST /characters/{character_id}/fittings/`
- Fleets (`14`): `DELETE /fleets/{fleet_id}/members/{member_id}/`, `DELETE /fleets/{fleet_id}/squads/{squad_id}/`, `DELETE /fleets/{fleet_id}/wings/{wing_id}/`, `GET /characters/{character_id}/fleet/`, `GET /fleets/{fleet_id}/`, `GET /fleets/{fleet_id}/members/`, `GET /fleets/{fleet_id}/wings/`, `POST /fleets/{fleet_id}/members/`, `POST /fleets/{fleet_id}/wings/`, `POST /fleets/{fleet_id}/wings/{wing_id}/squads/`, `PUT /fleets/{fleet_id}/`, `PUT /fleets/{fleet_id}/members/{member_id}/`, `PUT /fleets/{fleet_id}/squads/{squad_id}/`, `PUT /fleets/{fleet_id}/wings/{wing_id}/`
- Faction Warfare (`8`): `GET /characters/{character_id}/fw/stats/`, `GET /corporations/{corporation_id}/fw/stats/`, `GET /fw/leaderboards/`, `GET /fw/leaderboards/characters/`, `GET /fw/leaderboards/corporations/`, `GET /fw/stats/`, `GET /fw/systems/`, `GET /fw/wars/`
- Industry (`8`): `GET /characters/{character_id}/industry/jobs/`, `GET /characters/{character_id}/mining/`, `GET /corporation/{corporation_id}/mining/extractions/`, `GET /corporation/{corporation_id}/mining/observers/`, `GET /corporation/{corporation_id}/mining/observers/{observer_id}/`, `GET /corporations/{corporation_id}/industry/jobs/`, `GET /industry/facilities/`, `GET /industry/systems/`
- Killmails (`3`): `GET /characters/{character_id}/killmails/recent/`, `GET /corporations/{corporation_id}/killmails/recent/`, `GET /killmails/{killmail_id}/{killmail_hash}/`
- Location (`3`): `GET /characters/{character_id}/location/`, `GET /characters/{character_id}/online/`, `GET /characters/{character_id}/ship/`
- Loyalty (`2`): `GET /characters/{character_id}/loyalty/points/`, `GET /loyalty/stores/{corporation_id}/offers/`
- Mail (`9`): `DELETE /characters/{character_id}/mail/labels/{label_id}/`, `DELETE /characters/{character_id}/mail/{mail_id}/`, `GET /characters/{character_id}/mail/`, `GET /characters/{character_id}/mail/labels/`, `GET /characters/{character_id}/mail/lists/`, `GET /characters/{character_id}/mail/{mail_id}/`, `POST /characters/{character_id}/mail/`, `POST /characters/{character_id}/mail/labels/`, `PUT /characters/{character_id}/mail/{mail_id}/`
- Market (`11`): `GET /characters/{character_id}/orders/`, `GET /characters/{character_id}/orders/history/`, `GET /corporations/{corporation_id}/orders/`, `GET /corporations/{corporation_id}/orders/history/`, `GET /markets/groups/`, `GET /markets/groups/{market_group_id}/`, `GET /markets/prices/`, `GET /markets/structures/{structure_id}/`, `GET /markets/{region_id}/history/`, `GET /markets/{region_id}/orders/`, `GET /markets/{region_id}/types/`
- Planetary Interaction (`4`): `GET /characters/{character_id}/planets/`, `GET /characters/{character_id}/planets/{planet_id}/`, `GET /corporations/{corporation_id}/customs_offices/`, `GET /universe/schematics/{schematic_id}/`
- Search (`1`): `GET /characters/{character_id}/search/`
- Wallet (`6`): `GET /characters/{character_id}/wallet/`, `GET /characters/{character_id}/wallet/journal/`, `GET /characters/{character_id}/wallet/transactions/`, `GET /corporations/{corporation_id}/wallets/`, `GET /corporations/{corporation_id}/wallets/{division}/journal/`, `GET /corporations/{corporation_id}/wallets/{division}/transactions/`
- Corporation (`22`): `GET /corporations/npccorps/`, `GET /corporations/{corporation_id}/`, `GET /corporations/{corporation_id}/alliancehistory/`, `GET /corporations/{corporation_id}/blueprints/`, `GET /corporations/{corporation_id}/containers/logs/`, `GET /corporations/{corporation_id}/divisions/`, `GET /corporations/{corporation_id}/facilities/`, `GET /corporations/{corporation_id}/icons/`, `GET /corporations/{corporation_id}/medals/`, `GET /corporations/{corporation_id}/medals/issued/`, `GET /corporations/{corporation_id}/members/`, `GET /corporations/{corporation_id}/members/limit/`, `GET /corporations/{corporation_id}/members/titles/`, `GET /corporations/{corporation_id}/membertracking/`, `GET /corporations/{corporation_id}/roles/`, `GET /corporations/{corporation_id}/roles/history/`, `GET /corporations/{corporation_id}/shareholders/`, `GET /corporations/{corporation_id}/standings/`, `GET /corporations/{corporation_id}/starbases/`, `GET /corporations/{corporation_id}/starbases/{starbase_id}/`, `GET /corporations/{corporation_id}/structures/`, `GET /corporations/{corporation_id}/titles/`
- Dogma (`5`): `GET /dogma/attributes/`, `GET /dogma/attributes/{attribute_id}/`, `GET /dogma/dynamic/items/{type_id}/{item_id}/`, `GET /dogma/effects/`, `GET /dogma/effects/{effect_id}/`
- Incursions (`1`): `GET /incursions/`
- Insurance (`1`): `GET /insurance/prices/`
- Routes (`1`): `GET /route/{origin}/{destination}/`
- Sovereignty (`3`): `GET /sovereignty/campaigns/`, `GET /sovereignty/map/`, `GET /sovereignty/structures/`
- Status (`1`): `GET /status/`
- User Interface (`5`): `POST /ui/autopilot/waypoint/`, `POST /ui/openwindow/contract/`, `POST /ui/openwindow/information/`, `POST /ui/openwindow/marketdetails/`, `POST /ui/openwindow/newmail/`
- Universe (`30`): `GET /universe/ancestries/`, `GET /universe/asteroid_belts/{asteroid_belt_id}/`, `GET /universe/bloodlines/`, `GET /universe/categories/`, `GET /universe/categories/{category_id}/`, `GET /universe/constellations/`, `GET /universe/constellations/{constellation_id}/`, `GET /universe/factions/`, `GET /universe/graphics/`, `GET /universe/graphics/{graphic_id}/`, `GET /universe/groups/`, `GET /universe/groups/{group_id}/`, `GET /universe/moons/{moon_id}/`, `GET /universe/planets/{planet_id}/`, `GET /universe/races/`, `GET /universe/regions/`, `GET /universe/regions/{region_id}/`, `GET /universe/stargates/{stargate_id}/`, `GET /universe/stars/{star_id}/`, `GET /universe/stations/{station_id}/`, `GET /universe/structures/`, `GET /universe/structures/{structure_id}/`, `GET /universe/system_jumps/`, `GET /universe/system_kills/`, `GET /universe/systems/`, `GET /universe/systems/{system_id}/`, `GET /universe/types/`, `GET /universe/types/{type_id}/`, `POST /universe/ids/`, `POST /universe/names/`
- Wars (`3`): `GET /wars/`, `GET /wars/{war_id}/`, `GET /wars/{war_id}/killmails/`

## Live checks performed
- `GET https://esi.evetech.net/latest/status/?datasource=tranquility`
- `GET https://esi.evetech.net/latest/universe/categories/?datasource=tranquility`
- `GET https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&page=1`
- `GET https://esi.evetech.net/latest/characters/2112625428/mail/?datasource=tranquility`
- `GET https://esi.evetech.net/latest/universe/types/999999999/?datasource=tranquility`

## fireROUTE integration notes
- Keep the official tag-group structure available internally; ESI is broad and strongly grouped by gameplay/account domain.
- Do not strip `datasource` or ETag support even when using default values.
- Preserve per-route auth scope awareness because public and protected operations are heavily intermixed.
- Preserve POST/PUT/DELETE action routes separately from GET resource fetches; several groups are not read-only.

## Sources inspected
- `https://esi.evetech.net/ui`
- `https://developers.eveonline.com/api-explorer`
- `https://esi.evetech.net/latest/swagger.json`
- `https://esi.evetech.net/latest/status/?datasource=tranquility`
- `https://esi.evetech.net/latest/universe/categories/?datasource=tranquility`
- `https://esi.evetech.net/latest/markets/10000002/orders/?datasource=tranquility&page=1`
- `https://esi.evetech.net/latest/characters/2112625428/mail/?datasource=tranquility`
- `https://esi.evetech.net/latest/universe/types/999999999/?datasource=tranquility`
