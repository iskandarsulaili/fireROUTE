# Monster Hunter World

## Overview
- Provider: Monster Hunter World API
- Category: Games & Comics
- Official docs inspected: `https://docs.mhw-db.com/`
- Official alternative page inspected: `https://docs.mhw-db.com/#accessing-the-api`
- Base URL: `https://mhw-db.com`
- Confirmed routes: `25`
- Manual status: `manually_documented`
- Auth: no authentication, API key, or token requirement is documented on the inspected official pages
- HTTPS: yes
- Response format: JSON

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/ailments` | query `q`, `p` | Returns an array of ailments. |
| GET | `/ailments/{id}` | path `id`; query `p` | Returns one ailment object. |
| GET | `/armor` | query `q`, `p` | Returns an array of armor pieces. |
| GET | `/armor/{id}` | path `id`; query `p` | Returns one armor piece. |
| GET | `/armor/sets` | query `q`, `p` | Returns an array of armor sets. |
| GET | `/armor/sets/{id}` | path `id`; query `p` | Returns one armor set. |
| GET | `/charms` | query `q`, `p` | Returns an array of charms. |
| GET | `/charms/{id}` | path `id`; query `p` | Returns one charm with all ranks. |
| GET | `/decorations` | query `q`, `p` | Returns an array of decorations. |
| GET | `/decorations/{id}` | path `id`; query `p` | Returns one decoration. |
| GET | `/events` | query `q`, `p` | Returns an array of events. |
| GET | `/events/{id}` | path `id`; query `p` | Returns one event. |
| GET | `/items` | query `q`, `p` | Returns an array of items. |
| GET | `/items/{id}` | path `id`; query `p` | Returns one item. |
| GET | `/locations` | query `q`, `p` | Returns an array of locations. |
| GET | `/locations/{id}` | path `id`; query `p` | Returns one location. |
| GET | `/monsters` | query `q`, `p` | Returns an array of monsters. |
| GET | `/monsters/{id}` | path `id`; query `p` | Returns one monster. |
| GET | `/motion-values` | query `q`, `p` | Returns an array of motion values. |
| GET | `/motion-values/{id}` | path `id`; query `p` | Returns one motion value object. |
| GET | `/motion-values/{weaponType}` | path `weaponType`; query `q`, `p` | Returns motion values for a specific weapon type. |
| GET | `/skills` | query `q`, `p` | Returns an array of skills and their ranks. |
| GET | `/skills/{id}` | path `id`; query `p` | Returns one skill with all ranks. |
| GET | `/weapons` | query `q`, `p` | Returns an array of weapons. |
| GET | `/weapons/{id}` | path `id`; query `p` | Returns one weapon. |

## Access, localization, and lifecycle notes
- The docs say all data is accessed from base URL `https://mhw-db.com`.
- Any route may optionally be prefixed with a language tag.
- The inspected docs list these supported language tags:
  - default English = no prefix
  - `fr`
  - `de`
  - `zh`
  - `zh-Hant`
- Example from the docs: `https://mhw-db.com/zh-Hant/weapons/1`
- The docs warn that localized fields may still be `null` because localization is manually entered and incomplete.
- The introduction states the project is in maintenance mode, will not receive further updates, but has `no plans to discontinue the API`.

## Shared parameter behavior
### Search parameter: `q`
- The docs say any endpoint can be searched by passing a `q` parameter.
- `q` uses a MongoDB-style query document.
- Documented examples include:
  - exact match: `/skills?q={"name":"Poison Resistance"}`
  - numeric comparison: `/armor?q={"defense.base":{"$gt":50}}`
  - nested-field search: `/skills?q={"ranks.level":3}`
  - related-object search: `/armor?q={"defense.base":40}`
  - array-length search with `$size` on weapon branches
- The docs mention operator support and point to the project's GitHub repository for the full supported-operators list.

### Projection parameter: `p`
- `p` is the result-projection parameter.
- The docs say `p` must be a JSON object where each key is a field path and each value is a boolean include/exclude flag.
- Documented example:
  - `{"id":true, "name": true, "type": true, "crafting.branches": true}`
- Important projection rules documented:
  - use dot notation for nested fields
  - do not mix inclusions and exclusions in a single projection
  - unrecognized field names are silently ignored

## Response format notes
- Collection routes return arrays of resource objects.
- Detail routes return a single resource object.
- The docs are consistently JSON-oriented and show JSON examples for every confirmed route family.
- The docs also publish resource field sections for all major entities, including:
  - Ailment, Armor, ArmorSet, Charm, Decoration, Event, Item, Location, Monster, MotionValue, Skill, and Weapon field maps
- The motion-value-by-weapon route returns an array of motion values rather than a single object.

## Pagination, auth, and rate limits
- No pagination parameters are documented anywhere on the inspected official pages.
- No API key, bearer token, OAuth flow, or session auth is documented.
- No numeric rate limit or quota policy is documented.

## Error handling
- The official docs say all non-2xx responses almost always include a JSON body using this shape:
  - `{"error":{"code":"error.code_type","message":"A more verbose, human-readable error message"}}`
- The docs explicitly document these error codes:
  - `not_found` = no object matched the provided ID
  - `search.malformed_query` = invalid search-query syntax
  - `search.empty_params` = search query omitted all fields
  - `search.error` = unhandled search execution failure

## Deprecation note
- The inspected deprecation schedule lists one deprecated feature:
  - `CharmRank.name`
  - deprecated in `1.18.0`
  - planned removal `v1.19.0`

## Important usage notes
- Every confirmed route is read-only and documented as `GET`.
- Localization is path-based rather than header-based.
- Search and projection behavior are shared across the route families, so client tooling should expose `q` and `p` consistently.
- Because the API is in maintenance mode, consumers should avoid assuming rapid schema expansion or future endpoint additions.
- The docs point to `https://docs.wilds.mhdb.io` for the separate Monster Hunter Wilds API; that is a different provider and not part of this file's route count.

## Integration notes for fireROUTE
- Model this provider as `25` confirmed JSON `GET` routes under `https://mhw-db.com`.
- Preserve optional language-prefix support for all routes.
- Support `q` as a MongoDB-style query document and `p` as a JSON projection object.
- Do not invent pagination, auth requirements, or undocumented mutation routes.
- Preserve the documented structured error object and named error codes.

## Sources inspected
- `https://docs.mhw-db.com/`
- `https://docs.mhw-db.com/#accessing-the-api`
- `https://docs.mhw-db.com/#searching-the-api`
- `https://docs.mhw-db.com/#projecting-results`
- `https://docs.mhw-db.com/#errors`
