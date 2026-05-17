# Dungeons and Dragons (Alternate)

## Overview
- Provider: Open5e
- Category: Games & Comics
- Official docs: `https://open5e.com/api-docs`
- Primary site: `https://open5e.com/`
- API root: `https://api.open5e.com/v2/`
- Base URL: `https://api.open5e.com/v2`
- Auth: none for the documented public API
- HTTPS: yes
- Response format: JSON, with Django REST Framework browsable HTML docs on the same URLs
- Confirmed public routes: `67`
- Version note: the official docs say versionless API paths should default to V2, but a live browser check of `https://api.open5e.com/spells/?limit=1` returned `404 Not Found`; use explicit `/v2/` paths for fireROUTE

## Confirmed endpoints

The official V2 API root publishes `33` resource families. Manual inspection of collection pages such as `creatures` and `services` confirmed the standard read-only DRF pattern for each family: one collection `GET` route and one detail `GET` route keyed by the resource `key`. The official docs page also documents a separate global search endpoint.

| Route family | Documented operations | Notes |
|---|---|---|
| items | `GET /v2/items/`; `GET /v2/items/{key}/` | Detail route uses the resource `key` |
| magicitems | `GET /v2/magicitems/`; `GET /v2/magicitems/{key}/` | Read-only |
| itemsets | `GET /v2/itemsets/`; `GET /v2/itemsets/{key}/` | Read-only |
| itemcategories | `GET /v2/itemcategories/`; `GET /v2/itemcategories/{key}/` | Read-only |
| documents | `GET /v2/documents/`; `GET /v2/documents/{key}/` | Source-document metadata |
| licenses | `GET /v2/licenses/`; `GET /v2/licenses/{key}/` | Read-only |
| publishers | `GET /v2/publishers/`; `GET /v2/publishers/{key}/` | Read-only |
| weapons | `GET /v2/weapons/`; `GET /v2/weapons/{key}/` | Read-only |
| armor | `GET /v2/armor/`; `GET /v2/armor/{key}/` | Read-only |
| gamesystems | `GET /v2/gamesystems/`; `GET /v2/gamesystems/{key}/` | Read-only |
| backgrounds | `GET /v2/backgrounds/`; `GET /v2/backgrounds/{key}/` | Read-only |
| feats | `GET /v2/feats/`; `GET /v2/feats/{key}/` | Read-only |
| species | `GET /v2/species/`; `GET /v2/species/{key}/` | V2 uses `species`, not the old V1 `races` name |
| creatures | `GET /v2/creatures/`; `GET /v2/creatures/{key}/` | Verified live with `a5e-mm_aboleth` |
| creaturetypes | `GET /v2/creaturetypes/`; `GET /v2/creaturetypes/{key}/` | Read-only |
| creaturesets | `GET /v2/creaturesets/`; `GET /v2/creaturesets/{key}/` | Read-only |
| damagetypes | `GET /v2/damagetypes/`; `GET /v2/damagetypes/{key}/` | Read-only |
| languages | `GET /v2/languages/`; `GET /v2/languages/{key}/` | Read-only |
| alignments | `GET /v2/alignments/`; `GET /v2/alignments/{key}/` | Read-only |
| conditions | `GET /v2/conditions/`; `GET /v2/conditions/{key}/` | Read-only |
| spells | `GET /v2/spells/`; `GET /v2/spells/{key}/` | Read-only |
| spellschools | `GET /v2/spellschools/`; `GET /v2/spellschools/{key}/` | Read-only |
| classes | `GET /v2/classes/`; `GET /v2/classes/{key}/` | Read-only |
| sizes | `GET /v2/sizes/`; `GET /v2/sizes/{key}/` | Read-only |
| itemrarities | `GET /v2/itemrarities/`; `GET /v2/itemrarities/{key}/` | Read-only |
| environments | `GET /v2/environments/`; `GET /v2/environments/{key}/` | Read-only |
| abilities | `GET /v2/abilities/`; `GET /v2/abilities/{key}/` | Read-only |
| skills | `GET /v2/skills/`; `GET /v2/skills/{key}/` | Read-only |
| rules | `GET /v2/rules/`; `GET /v2/rules/{key}/` | Read-only |
| rulesets | `GET /v2/rulesets/`; `GET /v2/rulesets/{key}/` | Read-only |
| images | `GET /v2/images/`; `GET /v2/images/{key}/` | Read-only |
| weaponproperties | `GET /v2/weaponproperties/`; `GET /v2/weaponproperties/{key}/` | Read-only |
| services | `GET /v2/services/`; `GET /v2/services/{key}/` | Verified live with `srd-2024_lifestyle-aristocratic` |
| global search | `GET /v2/search/?query={term}` | Unified search across exact, fuzzy, and vector search methods |

Route count math from the official root and docs:
- `33` resource families × `2` routes each (`list` + `detail`) = `66`
- `1` documented global search route = `1`
- Total confirmed public routes = `67`

## Common parameters and filtering
- `query`: required search term for the global search endpoint
- `limit`: optional page size; the docs say the default page size is `50`
- `page`: optional page selector for paginated collection routes
- `ordering`: optional sort field; browsable API pages expose endpoint-specific sortable fields
- `name__iexact`: case-insensitive exact-match filter on endpoint collections
- `name__icontains`: case-insensitive partial-match filter on endpoint collections
- Endpoint-specific field filters are supported; the docs show `type=dragon` on `creatures`
- Nested filters use Django-style double underscores, for example `document__key__in=srd-2024`
- `fields`: include only selected top-level fields, for example `fields=name,key,document`
- Nested include selection is also supported, for example `document__fields=name,key`
- `exclude`: remove named fields from the response, for example `exclude=traits`

## Authentication
- The reviewed public Open5e API routes did not require API keys, OAuth, cookies, or custom headers.
- Live browser checks of list, detail, search, filter, and error cases all succeeded anonymously.

## Pagination, limits, and errors
- Collection and search routes return a standard DRF envelope with `count`, `next`, `previous`, and `results`.
- The official docs say find-many lookups are paginated and default to `50` results per page.
- `limit` changes page size, for example `GET /v2/creatures/?limit=10`.
- `page` selects a specific result page, for example `GET /v2/creatures/?limit=10&page=5`.
- Live check of `GET /v2/creatures/?limit=1&page=999999` returned `404` with JSON body `{"detail":"Invalid page."}`.
- Live check of `GET /v2/creatures/not-a-real-creature/` returned `404` with JSON body `{"detail":"No Creature matches the given query."}`.
- No numeric rate-limit policy was published on the reviewed official docs pages.
- Browsable API pages advertise `GET`, `HEAD`, and `OPTIONS`; the documented public data surface is read-only.

## Response-format notes
- Detail routes return a single JSON object keyed by the resource schema for that family.
- Collection routes return `count/next/previous/results` envelopes.
- The global search route returns the same pagination envelope but each result also includes search-specific metadata such as `object_pk`, `object_name`, `object_model`, `schema_version`, `route`, `highlighted`, `match_type`, `matched_term`, and `match_score`.
- Nested objects are common; examples seen in live responses include `document`, `publisher`, `gamesystem`, `type`, `size`, and other structured sub-objects.
- Live check of `GET /v2/creatures/?fields=name,key&limit=1` confirmed that field selection trims the `results` payload as documented.

## Important usage notes
- Prefer explicit `/v2/` URLs in integrations even though the site docs claim versionless paths should default to V2.
- Detail lookups use the provider's string `key` values, not numeric IDs.
- Search and filter syntax uses Django/DRF conventions, especially the double-underscore nested filter pattern.
- Sortable/filterable fields differ by resource family; the browsable API's `Filters` panel is the official source of per-endpoint sort options.
- The root `https://api.open5e.com/` still exposes the legacy V1 router, so adapters should not discover route families from the unversioned root if V2 coverage is required.

## Sources inspected
- `https://open5e.com/`
- `https://open5e.com/api-docs`
- `https://api.open5e.com/`
- `https://api.open5e.com/v2/`
- `https://api.open5e.com/v2/search/?query=goblin`
- `https://api.open5e.com/v2/creatures/?limit=1`
- `https://api.open5e.com/v2/creatures/a5e-mm_aboleth/`
- `https://api.open5e.com/v2/services/?limit=1`
- `https://api.open5e.com/v2/services/srd-2024_lifestyle-aristocratic/`
- `https://api.open5e.com/v2/creatures/?fields=name,key&limit=1`
- `https://api.open5e.com/v2/creatures/not-a-real-creature/`
- `https://api.open5e.com/v2/creatures/?limit=1&page=999999`
- `https://api.open5e.com/spells/?limit=1`
