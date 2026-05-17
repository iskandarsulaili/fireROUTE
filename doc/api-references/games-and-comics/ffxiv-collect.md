# FFXIV Collect

## Overview
- Provider: FFXIV Collect
- Category: Games & Comics
- Official docs: `https://ffxivcollect.com/api/docs`
- API homepage: `https://ffxivcollect.com/`
- Base URL: `https://ffxivcollect.com/api`
- Auth: none for the documented public API
- HTTPS: yes
- Response format: JSON
- Confirmed public routes: `74`
- Usage restriction: official docs say the API is restricted to `non-commercial` use and attribution linking back to FFXIV Collect is appreciated

## Confirmed endpoints

The official Postman documentation publishes most content resources with three documented `GET` operations: `show`, `index`, and `search`. Search uses the same collection path as `index` but is documented as a separate request pattern with query filters, so it is counted separately here.

| Route family | Documented operations | Notes |
|---|---|---|
| achievements | `GET /api/achievements/{id}`; `GET /api/achievements`; `GET /api/achievements` with search query | Example search: `name_en_cont=thanalan` |
| titles | `GET /api/titles/{id}`; `GET /api/titles`; `GET /api/titles` with search query | Example search: `name_en_cont=caster` |
| mounts | `GET /api/mounts/{id}`; `GET /api/mounts`; `GET /api/mounts` with search query | Example search: `name_en_end=kamuy` |
| minions | `GET /api/minions/{id}`; `GET /api/minions`; `GET /api/minions` with search query | Example search: `name_en_start=wind-up` |
| orchestrions | `GET /api/orchestrions/{id}`; `GET /api/orchestrions`; `GET /api/orchestrions` with search query | Example search: `name_en_cont=oblivion` |
| frames | `GET /api/frames/{id}`; `GET /api/frames`; `GET /api/frames` with search query | Example search: `item_name_en_cont=Season Five` |
| spells | `GET /api/spells/{id}`; `GET /api/spells`; `GET /api/spells` with search query | Example search: `name_en_cont=voice` |
| emotes | `GET /api/emotes/{id}`; `GET /api/emotes`; `GET /api/emotes` with search query | Example search: `name_en_cont=ranger` |
| bardings | `GET /api/bardings/{id}`; `GET /api/bardings`; `GET /api/bardings` with search query | Example search: `name_en_cont=lominsan` |
| hairstyles | `GET /api/hairstyles/{id}`; `GET /api/hairstyles`; `GET /api/hairstyles` with search query | Example search: `name_en_cont=scion` |
| armoires | `GET /api/armoires/{id}`; `GET /api/armoires`; `GET /api/armoires` with search query | Example search: `name_en_start=lucian` |
| outfits | `GET /api/outfits/{id}`; `GET /api/outfits`; `GET /api/outfits` with search query | Example search: `name_en_start=zero` |
| fashions | `GET /api/fashions/{id}`; `GET /api/fashions`; `GET /api/fashions` with search query | Example search: `name_en_start=gold` |
| facewear | `GET /api/facewear/{id}`; `GET /api/facewear`; `GET /api/facewear` with search query | Example search: `name_en_start=shaded` |
| triad cards | `GET /api/triad/cards/{id}`; `GET /api/triad/cards`; `GET /api/triad/cards` with search query | Example search: `name_en_cont=Y'shtola` |
| triad NPCs | `GET /api/triad/npcs/{id}`; `GET /api/triad/npcs`; `GET /api/triad/npcs` with search query | Example search: `location_name_en_eq=Kugane&patch_gt=4.0` |
| triad packs | `GET /api/triad/packs/{id}`; `GET /api/triad/packs`; `GET /api/triad/packs` with search query | Example search: `name_en_cont=Bronze` |
| triad decks | `GET /api/triad/decks/{id}`; `GET /api/triad/decks`; `GET /api/triad/decks` with search query | Example search: `rule_name_en_eq=Ascension` |
| records | `GET /api/records/{id}`; `GET /api/records`; `GET /api/records` with search query | Example search: `name_en_start=mikoto` |
| survey records | `GET /api/survey_records/{id}`; `GET /api/survey_records`; `GET /api/survey_records` with search query | Example search: `name_en_cont=silkie` |
| leves | `GET /api/leves/{id}`; `GET /api/leves`; `GET /api/leves` with search query | Example search: `craft_eq=Battlecraft&category_eq=General` |
| relics | `GET /api/relics/{id}`; `GET /api/relics`; `GET /api/relics` with search query | Example search: `type_category_eq=weapons` |
| tomestones | `GET /api/tomestones`; `GET /api/tomestones` with search query | Example search: `tomestone_eq=verity`; no separate `show` request is documented |
| characters | `GET /api/characters/{id}`; `GET /api/characters/{id}/mounts/owned`; `GET /api/characters/{id}/mounts/missing` | The official docs publish mount ownership examples for character IDs |
| users | `GET /api/users/{discordUserId}`; `GET /api/users/{discordUserId}/mounts/owned`; `GET /api/users/{discordUserId}/mounts/missing` | The official docs publish mount ownership examples for Discord user IDs |

Route count math from the official collection:
- 22 resource families with `show + index + search` = `66`
- tomestones `index + search` = `2`
- characters `show + owned + missing` = `3`
- users `show + owned + missing` = `3`
- Total public routes = `74`

## Common parameters and search behavior
- `language`: optional locale selector documented on API pages. Supported values:
  - `en`
  - `fr`
  - `de`
  - `ja`
- `limit`: optional hard limit for collection endpoints; official docs show `GET /api/mounts?limit=10`
- Search format: `ATTRIBUTE_LOCALE_PREDICATE=CRITERIA`
- Documented predicate suffixes:
  - `eq`
  - `lt`, `lteq`
  - `gt`, `gteq`
  - `cont`
  - `start`, `end`
  - `in`
- Search semantics:
  - multiple query conditions are ANDed together
  - the docs explicitly say there is no OR support
  - invalid query conditions are ignored rather than rejected

## Authentication
- The reviewed public API docs do not require API keys or OAuth for the documented content routes.
- Live checks of public routes succeeded without auth headers.
- The docs also show Discord interaction endpoints for internal use only, but those target `localhost:3000/discord/interactions` and are not part of the public provider API surface.

## Pagination, limits, and errors
- The docs do not describe page-number or cursor pagination.
- For list/search endpoints, the docs say the full data set is returned by default unless you apply filters or a `limit`.
- Live list checks such as `GET /api/mounts?limit=2` returned an envelope with `query`, `count`, and `results`.
- Live search check `GET /api/tomestones?tomestone_eq=verity` returned `200` with the same `query/count/results` structure.
- Live invalid-search check `GET /api/mounts?bogus_eq=test` still returned `200`; this matches the docs note that invalid conditions are ignored.
- Live invalid-ID check `GET /api/mounts/999999999` returned `404` with JSON body `{"status":404,"error":"Not found"}`.
- No numeric rate-limit policy was published in the reviewed official docs.

## Response-format notes
- Detail routes return a single JSON object for the requested resource.
- Most collection/search routes return a JSON object with:
  - `query`
  - `count`
  - `results`
- The docs' live examples and checks show resource-specific fields inside result objects, such as names, descriptions, patch metadata, image URLs, and source arrays.
- Live check of `GET /api/characters/{id}/mounts/owned` returned a plain JSON array rather than the `query/count/results` envelope used by list/search routes.

## Important usage notes
- The official docs are hosted in Postman Documenter and expose a much larger route surface than the previous generated placeholder file captured.
- `search` is a documented request pattern on the same collection path as `index`; it should be modeled as filterable collection access, not a separate hostname or version.
- The public API docs only show `mounts` ownership subroutes under `characters` and `users`; other ownership-type subpaths were not counted without published docs examples.
- The docs include an internal Discord interaction section, but those requests point to localhost and are explicitly excluded from the public route count.
- The official acceptable-use section says this API is for non-commercial use.

## Integration notes for fireROUTE
- Treat the provider as a read-only public JSON API.
- Preserve raw search keys because the provider uses flexible Ransack-style query names such as `name_en_cont`, `patch_gt`, `type_category_eq`, and `location_name_en_eq`.
- Do not assume paginated iteration support; prefer filtered pulls with explicit `limit` where appropriate.
- Keep character/user ownership routes separate from the normal collection envelope handling because they return arrays in live checks.
- Exclude the Discord interaction examples from adapter generation because they are internal-only localhost callbacks, not provider endpoints.

## Sources inspected
- `https://ffxivcollect.com/`
- `https://ffxivcollect.com/api/docs`
- `https://documenter.getpostman.com/view/1779678/TzXzDHM1`
- official Postman collection fetched from the docs app: `https://documenter.gw.postman.com/api/collections/1779678/TzXzDHM1?segregateAuth=true&versionTag=latest`
- live checks:
  - `https://ffxivcollect.com/api/mounts/265`
  - `https://ffxivcollect.com/api/mounts?limit=2`
  - `https://ffxivcollect.com/api/tomestones?tomestone_eq=verity`
  - `https://ffxivcollect.com/api/characters/7660136/mounts/owned`
  - `https://ffxivcollect.com/api/mounts/999999999`
  - `https://ffxivcollect.com/api/mounts?bogus_eq=test`
