# Digimon TCG

## Overview
- Provider: digimoncard.io Digimon TCG API
- Category: Games & Comics
- Official docs: `https://documenter.getpostman.com/view/14059948/TzecB4fH`
- Official collection JSON exposed by the Postman documenter page: `https://documenter.gw.postman.com/api/collections/14059948/TzecB4fH?segregateAuth=true&versionTag=latest`
- Base URL: `https://digimoncard.io/api-public`
- Auth: none documented in the official Postman collection
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `2` public `GET` routes
- Pagination: none documented
- Rate limits: `15 requests per 10 seconds`; the docs warn that exceeding this limit blocks access for `1 hour`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/search` | optional `n`, `desc`, `color`, `type`, `attribute`, `card`, `pack`, `sort`, `sortdirection`, `series`, `digitype`, `evocost`, `evocolor` | Searches card records. The docs say an error is returned when no search parameters are provided. |
| GET | `/getAllCards` | optional `sort`, `series`, `sortdirection` | Returns a light list of card names and card numbers. |

## Parameter notes
- `n` — card name.
- `desc` — description search across Source Effect and Main Effect.
- `color` and `evocolor` — documented values: `Black`, `Blue`, `Colorless`, `Green`, `Purple`, `Red`, `White`, `Yellow`.
- `type` — documented values: `Digimon`, `Option`, `Tamer`, `Digi-Egg`.
- `attribute` — card attribute.
- `card` — card number, for example `BT4-016`.
- `pack` — pack name.
- `sort` on `/search` — documented values: `name`, `power`, `code`, `color`, `random`.
- `sort` on `/getAllCards` — the docs only document `name`.
- `sortdirection` — `asc` or `desc`.
- `series` — documented values: `Digimon Card Game`, `Digimon Digi-Battle Card Game`, `Digimon Collectible Card Game`.
- `digitype` — card Digi-Type.
- `evocost` — card evolution cost.

## Response and format notes
- The official examples return `application/json`.
- `/search` returns full card objects. The official sample includes fields such as `name`, `type`, `id`, `level`, `play_cost`, `evolution_cost`, `evolution_color`, `color`, `digi_type`, `form`, `dp`, `attribute`, `rarity`, `stage`, `main_effect`, `source_effect`, `series`, `pretty_url`, and TCGPlayer identifiers.
- `/getAllCards` returns lightweight JSON objects with `name` and `cardnumber`.
- The Postman example responses include `access-control-allow-origin: *` and `access-control-allow-methods: GET`.

## Error handling
- The official docs explicitly say `/search` returns an error when no parameters are supplied.
- A direct anonymous check of `GET https://digimoncard.io/api-public/search` during this review returned JSON body `{"error":"No cards found for this search."}`.
- The official collection does not publish a broader shared error schema or a separate rate-limit error payload example.

## Important usage notes
- This is a very small public API surface: one flexible search route plus one lightweight all-cards listing route.
- The docs do not describe pagination, so consumers should assume large responses are returned in a single payload.
- Because `/search` accepts many optional filters, fireROUTE should preserve the raw query parameter names instead of trying to rename them.
- The public docs are hosted in Postman Documenter; the collection JSON embedded by that page was sufficient to confirm both live routes and all officially described query parameters.

## Live checks performed
- `GET https://digimoncard.io/api-public/search?n=Aldamon`
- `GET https://digimoncard.io/api-public/getAllCards?sort=name&series=Digimon%20Card%20Game&sortdirection=asc`
- `GET https://digimoncard.io/api-public/search`

## fireROUTE integration notes
- Treat `/search` as the primary route and forward provider-native filters unchanged.
- Treat `/getAllCards` as a lightweight index endpoint rather than a full card-details feed.
- Preserve the documented rate limit in adapter-level throttling because the upstream warns about hour-long temporary blocking.

## Sources inspected
- `https://documenter.getpostman.com/view/14059948/TzecB4fH`
- `https://documenter.gw.postman.com/api/collections/14059948/TzecB4fH?segregateAuth=true&versionTag=latest`
- `https://digimoncard.io/api-public/search?n=Aldamon`
- `https://digimoncard.io/api-public/getAllCards?sort=name&series=Digimon%20Card%20Game&sortdirection=asc`
- `https://digimoncard.io/api-public/search`
