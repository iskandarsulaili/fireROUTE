# Dungeons and Dragons

## Overview
- Provider: D&D 5e SRD API
- Category: Games & Comics
- Official docs landing page: `https://www.dnd5eapi.co/docs/`
- Official interactive API docs resolved during this review to: `https://5e-bits.github.io/docs/api`
- Base URL: `https://www.dnd5eapi.co`
- Auth: none documented, and no auth was required for the live checks in this review
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `43` public `GET` routes/path patterns documented or directly verified in this review
- Pagination: none documented; collection responses use `count` plus `results`
- Rate limits: none documented in the official docs pages inspected in this review

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/2014` | none | Returns an object listing the available top-level resource endpoints. A live anonymous check returned `24` named resource collections. |
| GET | `/api/2014/ability-scores` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/alignments` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/backgrounds` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/classes` | none | Returns a collection envelope with `count` and `results`. |
| GET | `/api/2014/conditions` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/damage-types` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/equipment` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/equipment-categories` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/feats` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/features` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/languages` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/magic-items` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/magic-schools` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/monsters` | optional query parameter `challenge_rating` | Official docs say this collection supports filtering by one or more challenge ratings. |
| GET | `/api/2014/proficiencies` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/races` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/rule-sections` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/rules` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/skills` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/spells` | optional query parameters `level`, `school` | Official docs say this collection supports level and school filtering. |
| GET | `/api/2014/subclasses` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/subraces` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/traits` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/weapon-properties` | none | Listed by the base endpoint as an available resource collection. |
| GET | `/api/2014/{endpoint}` | required path parameter `endpoint` | Official docs enumerate valid values: `ability-scores`, `alignments`, `backgrounds`, `classes`, `conditions`, `damage-types`, `equipment`, `equipment-categories`, `feats`, `features`, `languages`, `magic-items`, `magic-schools`, `monsters`, `proficiencies`, `races`, `rule-sections`, `rules`, `skills`, `spells`, `subclasses`, `subraces`, `traits`, `weapon-properties`. |
| GET | `/api/2014/ability-scores/{index}` | required path parameter `index` | Official docs publish allowed sample values `cha`, `con`, `dex`, `int`, `str`, `wis`. |
| GET | `/api/2014/classes/{index}` | required path parameter `index` | Official docs and live checks confirm class detail objects include `class_levels` and `subclasses` references. |
| GET | `/api/2014/classes/{index}/subclasses` | required path parameter `index` | Official docs describe this as the subclass list for a class. |
| GET | `/api/2014/classes/{index}/levels` | required path parameter `index` | Official docs describe this as the class level progression route. A live anonymous check of `/classes/wizard/levels` returned an array of `20` level records in this run. |
| GET | `/api/2014/classes/{index}/spellcasting` | required path parameter `index` | Verified live with `/classes/wizard/spellcasting`, which returned `level`, `spellcasting_ability`, and `info`. |
| GET | `/api/2014/conditions/{index}` | required path parameter `index` | Official docs provide a dedicated condition-by-index page. |
| GET | `/api/2014/equipment/{index}` | required path parameter `index` | Official docs provide a dedicated equipment-item-by-index page. |
| GET | `/api/2014/feats/{index}` | required path parameter `index` | Official docs provide a dedicated feat-by-index page. |
| GET | `/api/2014/features/{index}` | required path parameter `index` | Official docs provide a dedicated feature-by-index page. |
| GET | `/api/2014/monsters/{index}` | required path parameter `index` | Official docs provide a dedicated monster-by-index page. |
| GET | `/api/2014/races/{index}` | required path parameter `index` | Official docs provide a dedicated race-by-index page. |
| GET | `/api/2014/rule-sections/{index}` | required path parameter `index` | Official docs provide a dedicated rule-section-by-index page. |
| GET | `/api/2014/spells/{index}` | required path parameter `index` | Official docs provide a dedicated spell-by-index page. |
| GET | `/api/2014/subclasses/{index}` | required path parameter `index` | Official docs provide a dedicated subclass-by-index page. |
| GET | `/api/2014/subclasses/{index}/levels` | required path parameter `index` | Confirmed from live subclass detail data, which exposed `/api/2014/subclasses/berserker/levels` as the related levels route. |
| GET | `/api/2014/subraces/{index}` | required path parameter `index` | Official docs provide a dedicated subrace-by-index page. |
| GET | `/api/2014/traits/{index}` | required path parameter `index` | Official docs provide a dedicated trait-by-index page. |

## Parameter notes
- `endpoint` is the official resource selector used by the generic collection route. The docs enumerate `24` accepted values.
- `index` is the resource slug used on detail routes, for example `barbarian`, `berserker`, `darkvision`, or `cha`.
- `challenge_rating` on `/api/2014/monsters` is documented as a number array filter. The docs show examples `1`, `1,2`, and `2,0.25`.
- `level` on `/api/2014/spells` is documented as an integer array filter.
- `school` on `/api/2014/spells` is documented as a string array filter; the docs show full values such as `illusion`, comma-separated values such as `evocation,illusion`, and partial values such as `illu`.

## Response format notes
- The official docs use JSON examples and curl commands with `Accept: application/json`.
- `GET /api/2014` returns an object mapping resource names to collection URLs.
- Collection routes return a JSON envelope with `count` and `results`.
- In live checks during this review, `GET /api/2014/classes` returned keys `count` and `results`, and the first result looked like `{ "index": "barbarian", "name": "Barbarian", "url": "/api/2014/classes/barbarian" }`.
- Detail routes return richer JSON objects. A live anonymous check of `GET /api/2014/classes/barbarian` returned fields including `hit_die`, `saving_throws`, `starting_equipment`, `class_levels`, `subclasses`, `url`, and `updated_at`.
- A live anonymous check of `GET /api/2014/classes/wizard/spellcasting` returned keys `level`, `spellcasting_ability`, and `info`.
- A live anonymous check of `GET /api/2014/classes/wizard/levels` returned an array of `20` level objects; the first object included `level`, `ability_score_bonuses`, `prof_bonus`, `features`, `spellcasting`, `class_specific`, `index`, `class`, `url`, and `updated_at`.

## Error handling
- The docs pages inspected in this review do not publish a central auth or rate-limit error section.
- A live anonymous check of `GET /api/2014/classes/not-real` returned HTTP `404` with plain-text body `Not Found`.
- A live anonymous check of `GET /api/2014/spells?level=1,2&school=illusion` returned HTTP `400` with JSON body beginning `{"error":"Invalid query parameters","details":[...]}`.

## Important usage notes
- The canonical public API host remains `https://www.dnd5eapi.co`, but the official docs UI currently resolves to the maintained docs site at `https://5e-bits.github.io/docs/api`.
- Only the `/monsters` and `/spells` collection routes are documented as supporting query filtering.
- The official spells docs show comma-separated multi-value `level` examples, but a live check in this review found `level=1,2` returned HTTP `400`; consumers should test carefully and prefer single `level` values unless upstream behavior changes.
- The API surface is read-only in the public docs inspected during this review; every documented route in this pass was a `GET` route.

## Live checks performed
- `GET https://www.dnd5eapi.co/api/2014`
- `GET https://www.dnd5eapi.co/api/2014/classes`
- `GET https://www.dnd5eapi.co/api/2014/classes/barbarian`
- `GET https://www.dnd5eapi.co/api/2014/classes/wizard/spellcasting`
- `GET https://www.dnd5eapi.co/api/2014/classes/wizard/levels`
- `GET https://www.dnd5eapi.co/api/2014/monsters?challenge_rating=1,2`
- `GET https://www.dnd5eapi.co/api/2014/monsters?challenge_rating=2,0.25`
- `GET https://www.dnd5eapi.co/api/2014/spells?level=1&school=illusion`
- `GET https://www.dnd5eapi.co/api/2014/spells?school=illu`
- `GET https://www.dnd5eapi.co/api/2014/spells?level=1,2&school=illusion`
- `GET https://www.dnd5eapi.co/api/2014/classes/not-real`
- `GET https://www.dnd5eapi.co/api/2014/subclasses/berserker`
- `GET https://www.dnd5eapi.co/api/2014/races/elf`
- `GET https://www.dnd5eapi.co/api/2014/traits/darkvision`

## Sources inspected
- `https://www.dnd5eapi.co/`
- `https://www.dnd5eapi.co/docs/`
- `https://5e-bits.github.io/docs/api`
- `https://5e-bits.github.io/docs/api/get-list-of-all-available-resources-for-an-endpoint`
- `https://5e-bits.github.io/docs/api/get-an-ability-score-by-index`
- `https://5e-bits.github.io/docs/api/get-list-of-monsters-with-optional-filtering`
- `https://5e-bits.github.io/docs/api/get-list-of-spells-with-optional-filtering`
- `https://www.dnd5eapi.co/api/2014`
- `https://www.dnd5eapi.co/api/2014/classes`
- `https://www.dnd5eapi.co/api/2014/classes/barbarian`
- `https://www.dnd5eapi.co/api/2014/classes/wizard/spellcasting`
- `https://www.dnd5eapi.co/api/2014/classes/wizard/levels`
- `https://www.dnd5eapi.co/api/2014/monsters?challenge_rating=1,2`
- `https://www.dnd5eapi.co/api/2014/spells?level=1&school=illusion`
