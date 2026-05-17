# Hearthstone

## Overview
- Provider: Hearthstone Game Data APIs
- Category: Games & Comics
- Indexed legacy docs host inspected: `http://hearthstoneapi.com/`
- Current official docs inspected:
  - `https://community.developer.battle.net/documentation/hearthstone/game-data-apis`
  - `https://community.developer.battle.net/documentation/hearthstone/guides/card-search`
  - `https://community.developer.battle.net/documentation/hearthstone/guides/card-backs`
  - `https://community.developer.battle.net/documentation/hearthstone/guides/decks`
  - `https://community.developer.battle.net/documentation/hearthstone/guides/metadata`
  - `https://community.developer.battle.net/documentation/hearthstone/guides/game-modes`
  - `https://community.developer.battle.net/documentation/guides/getting-started`
  - `https://community.developer.battle.net/documentation/guides/using-oauth`
  - `https://community.developer.battle.net/documentation/guides/game-data-apis`
  - `https://community.developer.battle.net/documentation/guides/regionality-and-apis`
- Base URLs:
  - `https://{region}.api.blizzard.com` for non-China regions
  - `https://gateway.battlenet.com.cn` for China
- Supported non-China Hearthstone regions from the reviewed docs: `us`, `eu`, `kr`, `tw`
- Auth: Battle.net OAuth 2.0 access token, supplied either as query parameter `access_token` or in the `Authorization` header as a bearer token
- HTTPS: yes
- Response format: JSON documents
- Confirmed routes: `7`

## Important source-state note
- The indexed legacy host `http://hearthstoneapi.com/` now redirects to GoDaddy's parked-domain page for `hearthstoneapi.com`.
- The live official Hearthstone API documentation is currently published on Blizzard's Battle.net Community Developer Portal instead of the parked legacy domain.

## Confirmed endpoints
All confirmed Hearthstone routes are `GET` routes.

| Path | Key parameters | Notes |
|---|---|---|
| `/hearthstone/cards` | optional `locale`, `set`, `class`, `manaCost`, `attack`, `health`, `collectible`, `rarity`, `type`, `minionType`, `keyword`, `textFilter`, `gameMode`, `spellSchool`, `page`, `pageSize`, `sort`, deprecated `order` | Main card-search route. The official docs also use this same path for the separate “Detailed card search example”, “Battlegrounds card search”, and “Mercenaries card search” panels. |
| `/hearthstone/cards/:idorslug` | required path `:idorslug`; optional `locale`, `gameMode` | Fetches one card by numeric ID or slug. |
| `/hearthstone/cardbacks` | optional `locale`, `cardBackCategory`, `textFilter`, `sort`, `page`, `pageSize`, deprecated `order` | Searches card backs. |
| `/hearthstone/cardbacks/:idorslug` | required path `:idorslug`; optional `locale` | Fetches one card back by ID or slug. |
| `/hearthstone/deck` | optional `locale`, `code`, `ids`, `hero` | Returns deck data from either a URL-encoded deck code or a card-ID list plus optional hero card ID. |
| `/hearthstone/metadata` | optional `locale` | Returns all published Hearthstone metadata categories. |
| `/hearthstone/metadata/:type` | required path `:type`; optional `locale` | Returns one metadata category. Officially documented values include `sets`, `setGroups`, `types`, `rarities`, `classes`, `minionTypes`, and `keywords`. |

## Authentication
- The reviewed getting-started guide says developers must:
  - log in or create a Battle.net account
  - attach a Battle.net Authenticator; two-factor authentication is required for API usage
  - accept the Blizzard Developer API Terms of Use
  - create a client in the API Access tool
  - generate a client secret
- The reviewed shared game-data guide says requests to game-data APIs require either:
  - query parameter `access_token`
  - an `Authorization` header carrying a bearer token
- The reviewed OAuth guide says Battle.net uses OAuth 2.0.
- Token acquisition is handled through Battle.net OAuth client credentials; the Hearthstone route docs themselves do not publish anonymous-access support.

## Host, region, and locale notes
- The official Hearthstone page says the host format is `{region}.api.blizzard.com` for all regions except China.
- The reviewed Hearthstone page lists valid non-China Hearthstone regions as `us`, `eu`, `kr`, and `tw`.
- The same page says China uses `gateway.battlenet.com.cn`.
- `locale` appears on every reviewed Hearthstone route family.
- The docs say if localized data is requested and no `locale` is supplied, default locale behavior is typically `en_US`.
- The shared regionality guide says supported locales vary by region and align with Blizzard community-site locale support.

## Pagination
- `/hearthstone/cards`
  - official parameters: `page`, `pageSize`
  - the card-search guide says only the first page is shown if no page number is requested
  - the guide also says a default page limit controls how many cards are returned per page
- `/hearthstone/cardbacks`
  - official parameters: `page`, `pageSize`
- `/hearthstone/deck`, `/hearthstone/metadata`, and `/hearthstone/metadata/:type`
  - no pagination parameters documented

## Route-specific parameter and usage notes
- `/hearthstone/cards`
  - `textFilter` requires `locale`
  - `gameMode` is optional and the game-modes guide calls out values such as `constructed`, `battlegrounds`, and `mercenaries`
  - the card-search guide says default searches:
    - show cards from all sets in constructed play
    - return only collectible cards
    - sort by localized name ascending
  - numeric filters `manaCost`, `health`, and `attack` accept exact values or comma-separated lists
  - the card-search guide says searching with `attack=10` returns all cards with attack `10` or greater
  - Battlegrounds-specific searches on the same route can also use `tier`; valid values are `1` through `6` or `hero`
  - Mercenaries-specific searches on the same route can also use `mercenaryId`, `mercenaryRole`, and `defaultMercenary`
  - the deprecated `order` parameter still appears in the official docs, but `sort` is the primary field
- `/hearthstone/cards/:idorslug`
  - `:idorslug` can be either a numeric ID or a slug
  - the official example uses `52119-arch-villain-rafaam`
  - the game-modes guide says battlegrounds-specific card fields only appear when `gameMode=battlegrounds` is included
- `/hearthstone/cardbacks`
  - `cardBackCategory` must match a valid category
  - the reviewed card-backs guide lists categories including `base`, `achieve`, `fireside`, `heroes`, `season`, `legend`, `esports`, `game_license`, `promotion`, `pre_purchase`, `blizzard`, `golden`, and `events`
  - `textFilter` searches localized card-back name and description
- `/hearthstone/deck`
  - `code` should be URL encoded
  - `ids` is a comma-separated card ID list
  - `hero` is the hero-card ID for the deck class when using `ids`
  - if `code` is present, the docs say `ids` is ignored
  - if `hero` is omitted, the docs say the API tries to infer a default hero/class from the cards in the deck
  - the deck guide says the response also includes a computed `deckCode`
- `/hearthstone/metadata` and `/hearthstone/metadata/:type`
  - metadata is the source of slug values used by card search filters such as `set`, `rarity`, `type`, `minionType`, `keyword`, and `gameMode`
  - the metadata guide uses examples such as `/hearthstone/metadata/sets`, `/hearthstone/metadata/classes`, and `/hearthstone/metadata/keywords`

## Rate limits and errors
- The reviewed shared game-data guide documents Battle.net throttling at:
  - `36,000` requests per hour
  - `100` requests per second
- The same guide says:
  - exceeding the hourly quota results in slower service until traffic decreases
  - exceeding the per-second limit returns `429` for the remainder of the second until the quota refreshes
- The reviewed Hearthstone route pages do not publish a route-by-route HTTP error table in the exposed method summaries.
- The official Hearthstone docs reviewed for this pass do not publish a separate shared JSON error schema for these routes.

## Response-format notes
- The reviewed shared game-data guide says game-data responses are returned as JSON documents directly to the consumer.
- The same guide says responses represent a single resource in full rather than a composite wrapper of many unrelated resources.
- The card-search and card-backs guides describe paged search responses rather than raw HTML pages.
- The deck guide says deck responses include computed deck information such as a `deckCode`.
- The metadata guide shows direct JSON-resource retrieval examples at `/hearthstone/metadata` and `/hearthstone/metadata/:type`.

## Important usage notes
- The parked legacy domain should not be used as the authoritative source for fireROUTE; the current first-party source is Blizzard's Battle.net Community Developer Portal.
- The official Hearthstone route catalog exposes `7` distinct GET path patterns, but the docs intentionally show multiple specialized search examples on the same `/hearthstone/cards` route.
- The card-search guide says metadata slugs are the source of valid filter values.
- The game-modes guide says some card data is mode-specific; for example, Battlegrounds-only fields appear only when `gameMode=battlegrounds` is requested.
- The shared game-data guide says consumers may need to follow links in returned JSON resources to gather related data.

## Integration notes for fireROUTE
- Model the provider against Blizzard's current documented Hearthstone surface, not the parked `hearthstoneapi.com` host.
- Treat all confirmed Hearthstone routes as authenticated `GET` endpoints.
- Preserve the path placeholder spelling exactly as published: `:idorslug` and `:type`.
- Keep `textFilter` coupled to `locale` in validation logic.
- Do not split Battlegrounds and Mercenaries search into separate route paths; the official docs present them as specialized parameterizations of `/hearthstone/cards`.
- Preserve China host handling separately from the non-China `{region}.api.blizzard.com` host pattern.

## Sources inspected
- `http://hearthstoneapi.com/`
- `https://community.developer.battle.net/documentation/hearthstone/game-data-apis`
- `https://community.developer.battle.net/documentation/hearthstone/guides/card-search`
- `https://community.developer.battle.net/documentation/hearthstone/guides/card-backs`
- `https://community.developer.battle.net/documentation/hearthstone/guides/decks`
- `https://community.developer.battle.net/documentation/hearthstone/guides/metadata`
- `https://community.developer.battle.net/documentation/hearthstone/guides/game-modes`
- `https://community.developer.battle.net/documentation/guides/getting-started`
- `https://community.developer.battle.net/documentation/guides/using-oauth`
- `https://community.developer.battle.net/documentation/guides/game-data-apis`
- `https://community.developer.battle.net/documentation/guides/regionality-and-apis`
