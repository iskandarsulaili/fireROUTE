# Pokéapi

## Overview
- Provider: PokéAPI
- Category: Games & Comics
- Official docs landing page: `https://pokeapi.co/docs/v2`
- Base URL: `https://pokeapi.co`
- Auth: none documented, and no authentication was required for the live checks in this review
- HTTPS: yes
- Public methods documented: `GET` only
- Response formats observed in this review:
  - JSON for successful API responses
  - plain-text `Not Found` for missing resources/routes
- Confirmed routes: `98` public `GET` routes/path patterns documented or directly verified in this review
- Pagination: generic list pagination with `limit` and `offset`; docs say default page size is `20`
- Rate limits: the official docs say rate limiting was removed after the move to static hosting in November 2018, but the fair-use policy still asks clients to cache and avoid abusive traffic

## Confirmed collection routes

These routes are documented as list endpoints. The generic collection contract is split in the docs into “Named” and “Unnamed” variants, but both use the same path shape.

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v2/{endpoint}/` | required path parameter `endpoint`; optional query parameters `limit`, `offset` | Generic collection route documented for every resource collection. The docs explicitly say `characteristic`, `contest-effect`, `evolution-chain`, `machine`, and `super-contest-effect` are unnamed collections; the rest are named collections. |
| GET | `/api/v2/ability/` | optional query parameters `limit`, `offset` | Paginated named resource collection for abilities. |
| GET | `/api/v2/berry/` | optional query parameters `limit`, `offset` | Paginated named resource collection for berries. |
| GET | `/api/v2/berry-firmness/` | optional query parameters `limit`, `offset` | Paginated named resource collection for berry firmnesses. |
| GET | `/api/v2/berry-flavor/` | optional query parameters `limit`, `offset` | Paginated named resource collection for berry flavors. |
| GET | `/api/v2/contest-type/` | optional query parameters `limit`, `offset` | Paginated named resource collection for contest types. |
| GET | `/api/v2/contest-effect/` | optional query parameters `limit`, `offset` | Paginated unnamed resource collection for contest effects. |
| GET | `/api/v2/super-contest-effect/` | optional query parameters `limit`, `offset` | Paginated unnamed resource collection for super contest effects. |
| GET | `/api/v2/encounter-method/` | optional query parameters `limit`, `offset` | Paginated named resource collection for encounter methods. |
| GET | `/api/v2/encounter-condition/` | optional query parameters `limit`, `offset` | Paginated named resource collection for encounter conditions. |
| GET | `/api/v2/encounter-condition-value/` | optional query parameters `limit`, `offset` | Paginated named resource collection for encounter condition values. |
| GET | `/api/v2/evolution-chain/` | optional query parameters `limit`, `offset` | Paginated unnamed resource collection for evolution chains. |
| GET | `/api/v2/evolution-trigger/` | optional query parameters `limit`, `offset` | Paginated named resource collection for evolution triggers. |
| GET | `/api/v2/generation/` | optional query parameters `limit`, `offset` | Paginated named resource collection for generations. |
| GET | `/api/v2/pokedex/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokédexes. |
| GET | `/api/v2/version/` | optional query parameters `limit`, `offset` | Paginated named resource collection for game versions. |
| GET | `/api/v2/version-group/` | optional query parameters `limit`, `offset` | Paginated named resource collection for version groups. |
| GET | `/api/v2/item/` | optional query parameters `limit`, `offset` | Paginated named resource collection for items. |
| GET | `/api/v2/item-attribute/` | optional query parameters `limit`, `offset` | Paginated named resource collection for item attributes. |
| GET | `/api/v2/item-category/` | optional query parameters `limit`, `offset` | Paginated named resource collection for item categories. |
| GET | `/api/v2/item-fling-effect/` | optional query parameters `limit`, `offset` | Paginated named resource collection for item fling effects. |
| GET | `/api/v2/item-pocket/` | optional query parameters `limit`, `offset` | Paginated named resource collection for item pockets. |
| GET | `/api/v2/location/` | optional query parameters `limit`, `offset` | Paginated named resource collection for locations. |
| GET | `/api/v2/location-area/` | optional query parameters `limit`, `offset` | Paginated named resource collection for location areas. |
| GET | `/api/v2/pal-park-area/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pal Park areas. |
| GET | `/api/v2/region/` | optional query parameters `limit`, `offset` | Paginated named resource collection for regions. |
| GET | `/api/v2/machine/` | optional query parameters `limit`, `offset` | Paginated unnamed resource collection for machines. |
| GET | `/api/v2/move/` | optional query parameters `limit`, `offset` | Paginated named resource collection for moves. |
| GET | `/api/v2/move-ailment/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move ailments. |
| GET | `/api/v2/move-battle-style/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move battle styles. |
| GET | `/api/v2/move-category/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move categories. |
| GET | `/api/v2/move-damage-class/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move damage classes. |
| GET | `/api/v2/move-learn-method/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move learn methods. |
| GET | `/api/v2/move-target/` | optional query parameters `limit`, `offset` | Paginated named resource collection for move targets. |
| GET | `/api/v2/characteristic/` | optional query parameters `limit`, `offset` | Paginated unnamed resource collection for characteristics. |
| GET | `/api/v2/egg-group/` | optional query parameters `limit`, `offset` | Paginated named resource collection for egg groups. |
| GET | `/api/v2/gender/` | optional query parameters `limit`, `offset` | Paginated named resource collection for genders. |
| GET | `/api/v2/growth-rate/` | optional query parameters `limit`, `offset` | Paginated named resource collection for growth rates. |
| GET | `/api/v2/nature/` | optional query parameters `limit`, `offset` | Paginated named resource collection for natures. |
| GET | `/api/v2/pokeathlon-stat/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokéathlon stats. |
| GET | `/api/v2/pokemon/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon. |
| GET | `/api/v2/pokemon-color/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon colors. |
| GET | `/api/v2/pokemon-form/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon forms. |
| GET | `/api/v2/pokemon-habitat/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon habitats. |
| GET | `/api/v2/pokemon-shape/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon shapes. |
| GET | `/api/v2/pokemon-species/` | optional query parameters `limit`, `offset` | Paginated named resource collection for Pokémon species. |
| GET | `/api/v2/stat/` | optional query parameters `limit`, `offset` | Paginated named resource collection for stats. |
| GET | `/api/v2/type/` | optional query parameters `limit`, `offset` | Paginated named resource collection for types. |
| GET | `/api/v2/language/` | optional query parameters `limit`, `offset` | Paginated named resource collection for languages. |

## Confirmed detail and special routes

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v2/berry/{id or name}/` | required path parameter `id or name` | Berry detail route. |
| GET | `/api/v2/berry-firmness/{id or name}/` | required path parameter `id or name` | Berry firmness detail route. |
| GET | `/api/v2/berry-flavor/{id or name}/` | required path parameter `id or name` | Berry flavor detail route. |
| GET | `/api/v2/contest-type/{id or name}/` | required path parameter `id or name` | Contest type detail route. |
| GET | `/api/v2/contest-effect/{id}/` | required numeric path parameter `id` | Contest effect detail route. Docs do not publish a `name` lookup for this resource. |
| GET | `/api/v2/super-contest-effect/{id}/` | required numeric path parameter `id` | Super contest effect detail route. Docs do not publish a `name` lookup for this resource. |
| GET | `/api/v2/encounter-method/{id or name}/` | required path parameter `id or name` | Encounter method detail route. |
| GET | `/api/v2/encounter-condition/{id or name}/` | required path parameter `id or name` | Encounter condition detail route. |
| GET | `/api/v2/encounter-condition-value/{id or name}/` | required path parameter `id or name` | Encounter condition value detail route. |
| GET | `/api/v2/evolution-chain/{id}/` | required numeric path parameter `id` | Evolution chain detail route. Docs do not publish a `name` lookup for this resource. |
| GET | `/api/v2/evolution-trigger/{id or name}/` | required path parameter `id or name` | Evolution trigger detail route. |
| GET | `/api/v2/generation/{id or name}/` | required path parameter `id or name` | Generation detail route. |
| GET | `/api/v2/pokedex/{id or name}/` | required path parameter `id or name` | Pokédex detail route. |
| GET | `/api/v2/version/{id or name}/` | required path parameter `id or name` | Game version detail route. |
| GET | `/api/v2/version-group/{id or name}/` | required path parameter `id or name` | Version group detail route. |
| GET | `/api/v2/item/{id or name}/` | required path parameter `id or name` | Item detail route. |
| GET | `/api/v2/item-attribute/{id or name}/` | required path parameter `id or name` | Item attribute detail route. |
| GET | `/api/v2/item-category/{id or name}/` | required path parameter `id or name` | Item category detail route. |
| GET | `/api/v2/item-fling-effect/{id or name}/` | required path parameter `id or name` | Item fling effect detail route. |
| GET | `/api/v2/item-pocket/{id or name}/` | required path parameter `id or name` | Item pocket detail route. |
| GET | `/api/v2/location/{id or name}/` | required path parameter `id or name` | Location detail route. |
| GET | `/api/v2/location-area/{id or name}/` | required path parameter `id or name` | Location area detail route. |
| GET | `/api/v2/pal-park-area/{id or name}/` | required path parameter `id or name` | Pal Park area detail route. |
| GET | `/api/v2/region/{id or name}/` | required path parameter `id or name` | Region detail route. |
| GET | `/api/v2/machine/{id}/` | required numeric path parameter `id` | Machine detail route. Docs do not publish a `name` lookup for this resource. |
| GET | `/api/v2/move/{id or name}/` | required path parameter `id or name` | Move detail route. |
| GET | `/api/v2/move-ailment/{id or name}/` | required path parameter `id or name` | Move ailment detail route. |
| GET | `/api/v2/move-battle-style/{id or name}/` | required path parameter `id or name` | Move battle style detail route. |
| GET | `/api/v2/move-category/{id or name}/` | required path parameter `id or name` | Move category detail route. |
| GET | `/api/v2/move-damage-class/{id or name}/` | required path parameter `id or name` | Move damage class detail route. |
| GET | `/api/v2/move-learn-method/{id or name}/` | required path parameter `id or name` | Move learn method detail route. |
| GET | `/api/v2/move-target/{id or name}/` | required path parameter `id or name` | Move target detail route. |
| GET | `/api/v2/ability/{id or name}/` | required path parameter `id or name` | Ability detail route. |
| GET | `/api/v2/characteristic/{id}/` | required numeric path parameter `id` | Characteristic detail route. Docs do not publish a `name` lookup for this resource. |
| GET | `/api/v2/egg-group/{id or name}/` | required path parameter `id or name` | Egg group detail route. |
| GET | `/api/v2/gender/{id or name}/` | required path parameter `id or name` | Gender detail route. |
| GET | `/api/v2/growth-rate/{id or name}/` | required path parameter `id or name` | Growth rate detail route. |
| GET | `/api/v2/nature/{id or name}/` | required path parameter `id or name` | Nature detail route. |
| GET | `/api/v2/pokeathlon-stat/{id or name}/` | required path parameter `id or name` | Pokéathlon stat detail route. |
| GET | `/api/v2/pokemon/{id or name}/` | required path parameter `id or name` | Pokémon detail route. |
| GET | `/api/v2/pokemon/{id or name}/encounters` | required path parameter `id or name` | Special subresource that returns encounter-location data for a Pokémon. |
| GET | `/api/v2/pokemon-color/{id or name}/` | required path parameter `id or name` | Pokémon color detail route. |
| GET | `/api/v2/pokemon-form/{id or name}/` | required path parameter `id or name` | Pokémon form detail route. |
| GET | `/api/v2/pokemon-habitat/{id or name}/` | required path parameter `id or name` | Pokémon habitat detail route. |
| GET | `/api/v2/pokemon-shape/{id or name}/` | required path parameter `id or name` | Pokémon shape detail route. |
| GET | `/api/v2/pokemon-species/{id or name}/` | required path parameter `id or name` | Pokémon species detail route. |
| GET | `/api/v2/stat/{id or name}/` | required path parameter `id or name` | Stat detail route. |
| GET | `/api/v2/type/{id or name}/` | required path parameter `id or name` | Type detail route. |
| GET | `/api/v2/language/{id or name}/` | required path parameter `id or name` | Language detail route. |

## Parameter notes
- `endpoint` selects the collection under the generic route. The docs surface the following values through the resource sections reviewed here: `ability`, `berry`, `berry-firmness`, `berry-flavor`, `contest-type`, `contest-effect`, `super-contest-effect`, `encounter-method`, `encounter-condition`, `encounter-condition-value`, `evolution-chain`, `evolution-trigger`, `generation`, `pokedex`, `version`, `version-group`, `item`, `item-attribute`, `item-category`, `item-fling-effect`, `item-pocket`, `location`, `location-area`, `pal-park-area`, `region`, `machine`, `move`, `move-ailment`, `move-battle-style`, `move-category`, `move-damage-class`, `move-learn-method`, `move-target`, `characteristic`, `egg-group`, `gender`, `growth-rate`, `nature`, `pokeathlon-stat`, `pokemon`, `pokemon-color`, `pokemon-form`, `pokemon-habitat`, `pokemon-shape`, `pokemon-species`, `stat`, `type`, and `language`.
- `limit` and `offset` are the documented list query parameters across collection routes. The docs say the default page size is `20` and show examples such as `?limit=60` and `?limit=60&offset=60`.
- `id or name` means most detail routes accept either a numeric resource ID or a canonical resource name/slug.
- ID-only detail routes are explicitly documented for `contest-effect`, `super-contest-effect`, `evolution-chain`, `machine`, and `characteristic`.
- `/api/v2/pokemon/{id or name}/encounters` is documented separately from the standard Pokémon detail route.

## Response format notes
- The docs describe PokéAPI as a read-only consumption API and all live checks in this review returned anonymous `GET` responses.
- Named collection routes return a JSON envelope shaped like `NamedAPIResourceList` with `count`, `next`, `previous`, and `results`, where each result contains `name` and `url`.
- Unnamed collection routes return a JSON envelope shaped like `APIResourceList` with `count`, `next`, `previous`, and `results`, where each result contains only `url`.
- A live anonymous check of `GET https://pokeapi.co/api/v2/ability?limit=1` returned HTTP `200` and JSON with `count`, `next`, `previous`, and one `results` item: `{ "name": "stench", "url": "https://pokeapi.co/api/v2/ability/1/" }`.
- A live anonymous check of `GET https://pokeapi.co/api/v2/evolution-chain/?limit=1` returned the unnamed list envelope with a single `url` entry in `results`.
- A live anonymous check of `GET https://pokeapi.co/api/v2/pokemon/1/` returned JSON with fields including `abilities`, `base_experience`, `cries`, `forms`, `game_indices`, `height`, `held_items`, `id`, `is_default`, `location_area_encounters`, `moves`, and `name`.

## Error handling
- The docs page reviewed in this pass does not publish a central machine-readable error schema.
- Live checks in this review observed missing resources returning HTTP `404` with content type `text/plain; charset=utf-8` and body `Not Found`.
- Confirmed examples:
  - `GET https://pokeapi.co/api/v2/pokemon/not-a-real-pokemon/` -> HTTP `404`, plain-text `Not Found`
  - `GET https://pokeapi.co/api/v2/contest-effect/foo/` -> HTTP `404`, plain-text `Not Found`

## Important usage notes
- The official docs explicitly state that PokéAPI is a consumption-only API and only supports HTTP `GET`.
- No authentication is required.
- The official docs explicitly say rate limiting was removed after the static-hosting migration, but the fair-use policy asks consumers to cache locally and avoid abusive request rates.
- The docs recommend using browser find-on-page to locate resource types because the v2 docs are a single long resource index.
- Collection pagination is offset-based, not cursor-based.
- The docs distinguish between named and unnamed collections, but both collection styles share the same generic route shape `/api/v2/{endpoint}/`.

## Live checks performed
- `GET https://pokeapi.co/api/v2/ability?limit=1`
- `GET https://pokeapi.co/api/v2/evolution-chain/?limit=1`
- `GET https://pokeapi.co/api/v2/pokemon/1/`
- `GET https://pokeapi.co/api/v2/pokemon/not-a-real-pokemon/`
- `GET https://pokeapi.co/api/v2/contest-effect/foo/`

## Sources inspected
- `https://pokeapi.co/docs/v2`
- `https://pokeapi.co/api/v2/ability?limit=1`
- `https://pokeapi.co/api/v2/evolution-chain/?limit=1`
- `https://pokeapi.co/api/v2/pokemon/1/`
- `https://pokeapi.co/api/v2/pokemon/not-a-real-pokemon/`
- `https://pokeapi.co/api/v2/contest-effect/foo/`
