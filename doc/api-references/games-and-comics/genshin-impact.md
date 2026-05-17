# Genshin Impact

## Overview
- Provider: genshin.dev API
- Category: Games & Comics
- Official site: `https://genshin.dev/`
- Official site browser/API link surfaced on the homepage: `https://genshin.jmp.blue/`
- Base URL used by the official API browser: `https://genshin.jmp.blue`
- Auth: none
- HTTPS: yes
- Response formats: JSON for metadata/data endpoints; `image/webp` for image endpoints
- Pagination: none observed or documented on the official homepage or API browser
- Rate limits: none documented on the official homepage or API browser

## Official-docs/site notes
- The official homepage says `Or check out the genshin.dev API documentation Soon™️`, so there is no standalone formal reference page yet.
- The same official homepage links directly to the live API browser at `https://genshin.jmp.blue/`, which is the authoritative public API surface currently exposed by the project.
- Because the homepage is sparse, the route inventory below is based on manual inspection of the official homepage plus live checks against the linked official API browser.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | Returns the top-level `types` array. |
| GET | `/artifacts` | none | Lists artifact set slugs. |
| GET | `/artifacts/all` | none | Returns all artifact set objects. |
| GET | `/artifacts/{set}` | optional `lang` | Returns one artifact set object. |
| GET | `/artifacts/{set}/{piece}` | none | Returns a WebP image for a specific artifact-piece slug. |
| GET | `/boss` | none | Lists boss category slugs. |
| GET | `/boss/all` | none | Exists, but a live check returned an empty array. |
| GET | `/boss/{category}` | none | Lists boss slugs within a category such as `weekly-boss`. |
| GET | `/boss/{category}/all` | none | Returns all boss entries for the category. |
| GET | `/boss/{category}/{boss}` | optional `lang` | Returns one boss entry. |
| GET | `/characters` | none | Lists character slugs. |
| GET | `/characters/all` | none | Returns all character objects. |
| GET | `/characters/{character}` | optional `lang` | Returns one character object. |
| GET | `/characters/{character}/{image}` | none | Returns a WebP character image asset such as `icon`, `icon-big`, `icon-side`, `card`, `gacha-splash`, `constellation-1`, or `namecard-background`. |
| GET | `/consumables` | none | Lists consumable categories. |
| GET | `/consumables/all` | none | Returns all consumable category payloads. |
| GET | `/consumables/{category}` | optional `lang` | Returns a keyed object of consumables in that category, such as `food` or `potions`. |
| GET | `/consumables/{category}/{item}` | none | Returns the consumable item image directly as WebP. |
| GET | `/domains` | none | Lists domain slugs. |
| GET | `/domains/all` | none | Returns all domain objects. |
| GET | `/domains/{domain}` | optional `lang` | Returns one domain object. |
| GET | `/elements` | none | Lists element slugs. |
| GET | `/elements/all` | none | Returns all element objects. |
| GET | `/elements/{element}` | optional `lang` | Returns one element object. |
| GET | `/elements/{element}/icon` | none | Returns the element icon as WebP. |
| GET | `/enemies` | none | Lists enemy slugs. |
| GET | `/enemies/all` | none | Returns all enemy objects. |
| GET | `/enemies/{enemy}` | optional `lang` | Returns one enemy object. |
| GET | `/materials` | none | Lists material categories. |
| GET | `/materials/all` | none | Returns all top-level material category payloads. |
| GET | `/materials/{category}` | optional `lang` | Returns one material-category payload, such as `character-ascension` or `weapon-ascension`. |
| GET | `/materials/{category}/all` | none | Exists, but a live check returned an empty array for `character-ascension`. |
| GET | `/materials/{category}/{item}` | none | Returns a WebP image asset for the material slug. |
| GET | `/nations` | none | Lists nation slugs. |
| GET | `/nations/all` | none | Returns all nation objects. |
| GET | `/nations/{nation}` | optional `lang` | Returns one nation object. |
| GET | `/nations/{nation}/icon` | none | Returns the nation icon as WebP. |
| GET | `/weapons` | none | Lists weapon slugs. |
| GET | `/weapons/all` | none | Returns all weapon objects. |
| GET | `/weapons/{weapon}` | optional `lang` | Returns one weapon object. |
| GET | `/weapons/{weapon}/icon` | none | Returns the weapon icon as WebP. |

## Parameter notes
- `lang`
  - Optional query parameter observed on several entity endpoints.
  - Live checks confirmed `?lang=fr` works for at least `/characters/{character}`.
  - Language coverage is incomplete; `/characters/albedo?lang=ja` returned `404` saying language `ja` was not found while `en` exists.
  - Some grouped endpoints do not appear to support alternate languages consistently; for example `/materials/weapon-ascension?lang=fr` returned `404`.
- No auth headers, POST bodies, or pagination parameters were observed.

## Response and format notes
- Root and list endpoints typically return slug arrays.
- `/all` endpoints usually return fully expanded arrays or grouped payloads, but some category-specific `/all` routes currently return empty arrays.
- Entity endpoints return JSON objects.
- Many image-style routes return raw `image/webp` payloads.
- Unknown image names return JSON errors that often include an `availableImages` array, which is useful for discovering valid image variants.
- `consumables/{category}/{item}` returns the item image directly instead of a JSON detail object.
- `artifacts/{set}/{piece}` and `materials/{category}/{item}` also behave as image routes.

## Error handling
- Error responses are JSON with an `error` string.
- Observed error patterns include:
  - `Entity ... for language en not found`
  - `Entity ... for language fr not found, language en would exist`
  - `Image ... doesn't exist`
  - `No images for ... exist`
  - `ENOTDIR: not a directory...` for invalid nested consumable image probing
- Unknown image probes may include `availableImages` to enumerate supported image names.

## Important usage notes
- The API surface mixes structured JSON endpoints and binary image endpoints under similar path patterns.
- Characters expose many image variants; weapons, nations, and elements are more limited.
- Some top-level resource families are flat (`characters`, `domains`, `elements`, `enemies`, `nations`, `weapons`), while others are grouped (`boss`, `consumables`, `materials`).
- The homepage does not publish rate limits, auth requirements, or a formal schema reference.
- The API browser currently exposes English-first coverage with selective alternate-language support.

## Live checks performed
- `GET https://genshin.dev/`
- `GET https://genshin.jmp.blue/`
- `GET https://genshin.jmp.blue/characters`
- `GET https://genshin.jmp.blue/characters/all`
- `GET https://genshin.jmp.blue/characters/albedo`
- `GET https://genshin.jmp.blue/characters/albedo/icon`
- `GET https://genshin.jmp.blue/characters/albedo/icon-big`
- `GET https://genshin.jmp.blue/characters/albedo/icon-side`
- `GET https://genshin.jmp.blue/characters/albedo/constellation-1`
- `GET https://genshin.jmp.blue/characters/albedo/namecard-background`
- `GET https://genshin.jmp.blue/characters/albedo?lang=fr`
- `GET https://genshin.jmp.blue/characters/albedo?lang=ja`
- `GET https://genshin.jmp.blue/artifacts`
- `GET https://genshin.jmp.blue/artifacts/all`
- `GET https://genshin.jmp.blue/artifacts/adventurer`
- `GET https://genshin.jmp.blue/artifacts/adventurer/flower-of-life`
- `GET https://genshin.jmp.blue/boss`
- `GET https://genshin.jmp.blue/boss/all`
- `GET https://genshin.jmp.blue/boss/weekly-boss`
- `GET https://genshin.jmp.blue/boss/weekly-boss/all`
- `GET https://genshin.jmp.blue/consumables`
- `GET https://genshin.jmp.blue/consumables/all`
- `GET https://genshin.jmp.blue/consumables/food`
- `GET https://genshin.jmp.blue/consumables/food/pile-em-up`
- `GET https://genshin.jmp.blue/domains`
- `GET https://genshin.jmp.blue/domains/all`
- `GET https://genshin.jmp.blue/elements`
- `GET https://genshin.jmp.blue/elements/all`
- `GET https://genshin.jmp.blue/elements/anemo`
- `GET https://genshin.jmp.blue/elements/anemo/icon`
- `GET https://genshin.jmp.blue/enemies`
- `GET https://genshin.jmp.blue/enemies/all`
- `GET https://genshin.jmp.blue/enemies/abyss-herald`
- `GET https://genshin.jmp.blue/materials`
- `GET https://genshin.jmp.blue/materials/all`
- `GET https://genshin.jmp.blue/materials/character-ascension`
- `GET https://genshin.jmp.blue/materials/character-ascension/all`
- `GET https://genshin.jmp.blue/materials/character-ascension/agnidus-agate-fragment`
- `GET https://genshin.jmp.blue/nations`
- `GET https://genshin.jmp.blue/nations/all`
- `GET https://genshin.jmp.blue/nations/mondstadt`
- `GET https://genshin.jmp.blue/nations/mondstadt/icon`
- `GET https://genshin.jmp.blue/weapons`
- `GET https://genshin.jmp.blue/weapons/all`
- `GET https://genshin.jmp.blue/weapons/dull-blade`
- `GET https://genshin.jmp.blue/weapons/dull-blade/icon`

## fireROUTE integration notes
- Treat this provider as a mixed JSON-plus-image API rather than a pure REST data API.
- Preserve the grouped hierarchy for `boss`, `consumables`, and `materials` instead of flattening it away.
- On image-probe failures, preserve provider error payloads because `availableImages` can be operationally useful.
- Do not assume `lang` works uniformly across every route family.

## Sources inspected
- `https://genshin.dev/`
- `https://genshin.jmp.blue/`
- `https://genshin.jmp.blue/characters/albedo`
- `https://genshin.jmp.blue/characters/albedo/icon`
- `https://genshin.jmp.blue/characters/albedo?lang=fr`
- `https://genshin.jmp.blue/artifacts/adventurer`
- `https://genshin.jmp.blue/boss/weekly-boss`
- `https://genshin.jmp.blue/consumables/food`
- `https://genshin.jmp.blue/domains/all`
- `https://genshin.jmp.blue/elements/anemo`
- `https://genshin.jmp.blue/enemies/abyss-herald`
- `https://genshin.jmp.blue/materials/character-ascension`
- `https://genshin.jmp.blue/nations/mondstadt`
- `https://genshin.jmp.blue/weapons/dull-blade`
