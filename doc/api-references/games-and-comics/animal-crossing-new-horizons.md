# Animal Crossing: New Horizons

## Overview
- Provider: `Animal Crossing: New Horizons`
- Category: `Games & Comics`
- Official indexed docs URL: `https://acnhapi.com/`
- Official repository inspected as the surviving first-party contract source: `https://github.com/alexislours/ACNHAPI`
- Historical public API base prefixes documented by the official README: `https://acnhapi.com/v1/` and `https://acnhapi.com/v1a/`
- Auth: none documented
- HTTPS: yes; the official README also says the endpoints were reachable over HTTP
- Response format: JSON for data routes; repository-documented image and music asset URLs for media routes
- Pagination: none documented
- Rate limits: none documented in the surviving official sources
- Confirmed routes: `26`
- Manual status: `manually_documented`

## Base URL status at inspection time
- A fresh browser check to `https://acnhapi.com/` no longer showed ACNH docs. In this pass it redirected to `https://actinia.mundialis.de/` and rendered `404 Not Found`.
- A fresh browser check to `https://acnhapi.com/v1/fish/1` no longer returned a stable JSON payload. In this pass it loaded a `Redirecting...` HTML page instead of a trustworthy API response.
- Because the live host is no longer a reliable contract source, the official archived repository is the surviving first-party source of truth for route structure, version prefixes, and payload shape.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/v1/art` | none documented | Nested-object art dataset route, confirmed from the official `art.json` repository data file and the README-documented `/v1/` prefix. |
| GET | `/v1/bugs` | none documented | Nested-object bugs dataset route. |
| GET | `/v1/fish` | none documented | Nested-object fish dataset route. |
| GET | `/v1/fossils` | none documented | Nested-object fossils dataset route. |
| GET | `/v1/hourly` | none documented | Nested-object hourly music index route. |
| GET | `/v1/houseware` | none documented | Nested-object houseware dataset route. |
| GET | `/v1/misc` | none documented | Nested-object misc dataset route. |
| GET | `/v1/music` | none documented | Nested-object music dataset route. |
| GET | `/v1/sea` | none documented | Nested-object sea-creature dataset route. |
| GET | `/v1/villagers` | none documented | Nested-object villagers dataset route. |
| GET | `/v1/wallmounted` | none documented | Nested-object wallmounted furniture dataset route. |
| GET | `/v1a/art` | none documented | Array-format art dataset route under the alternate `v1a` prefix documented by the official README. |
| GET | `/v1a/bugs` | none documented | Array-format bugs dataset route. |
| GET | `/v1a/fish` | none documented | Array-format fish dataset route. |
| GET | `/v1a/fossils` | none documented | Array-format fossils dataset route. |
| GET | `/v1a/hourly` | none documented | Array-format hourly music index route. |
| GET | `/v1a/houseware` | none documented | Array-format houseware dataset route. |
| GET | `/v1a/misc` | none documented | Array-format misc dataset route. |
| GET | `/v1a/music` | none documented | Array-format music dataset route. |
| GET | `/v1a/sea` | none documented | Array-format sea-creature dataset route. |
| GET | `/v1a/villagers` | none documented | Array-format villagers dataset route. |
| GET | `/v1a/wallmounted` | none documented | Array-format wallmounted furniture dataset route. |
| GET | `/v1/hourly/{id}` | `id` path | Confirmed directly from official `hourly.json`, whose entries expose `music_uri` links such as `https://acnhapi.com/v1/hourly/1`. |
| GET | `/v1/music/{id}` | `id` path | Confirmed directly from official `music.json`, whose entries expose `music_uri` links such as `https://acnhapi.com/v1/music/1`. |
| GET | `/v1/images/{dataset}/{identifier}` | `dataset` path, `identifier` path | Confirmed from official embedded `image_uri` values such as `/v1/images/art/academic_painting`, `/v1/images/bugs/1`, and `/v1/images/songs/1`. |
| GET | `/v1/icons/{dataset}/{id}` | `dataset` path, `id` path | Confirmed from official embedded `icon_uri` values such as `/v1/icons/bugs/1`. |

Route count note:
- The official archived repository page listed eleven top-level dataset JSON files at the repository root plus a matching `v1a` folder, which confirms `11` dataset routes under `/v1` and `11` matching dataset routes under `/v1a`.
- The raw official data files additionally expose four route families through embedded provider-authored URLs: `/v1/hourly/{id}`, `/v1/music/{id}`, `/v1/images/{dataset}/{identifier}`, and `/v1/icons/{dataset}/{id}`.
- No additional route families were counted unless they were explicitly documented by the surviving first-party sources.

## Parameter and format notes
- `v1` vs `v1a`: the official README says `/v1a/` returns the data `as an object array instead of a nested JSON` returned by `/v1/`.
- `id`: numeric item identifier used in the officially embedded `music_uri` links for `/v1/hourly/{id}` and `/v1/music/{id}`.
- `dataset`: provider-authored media URLs confirm dataset names such as `art`, `bugs`, and `songs` inside `/v1/images/...` and `bugs` inside `/v1/icons/...`.
- `identifier`: the official embedded media URLs show both numeric ids and file-name slugs depending on dataset, for example `1` for bugs and `academic_painting` for art.
- No official query parameters, filters, sorting controls, or pagination controls were documented in the surviving README or raw dataset files inspected in this pass.

## Response and schema notes
- The official `art.json` file confirms the `/v1` style is a nested JSON object keyed by file name.
- The official `v1a/art.json` file confirms the `/v1a` style is a JSON array of objects.
- The official `v1a/bugs.json` file shows critter payload fields including:
  - `id`
  - `file-name`
  - multilingual `name`
  - `availability`
  - `price`
  - `price-flick`
  - `catch-phrase`
  - `museum-phrase`
  - `image_uri`
  - `icon_uri`
- The official `hourly.json` file shows hourly music records with `id`, `file-name`, `hour`, `weather`, and `music_uri`.
- The official `music.json` file shows song records with multilingual `name`, pricing fields, `isOrderable`, `music_uri`, and `image_uri`.
- The official `v1a/art.json` file shows art records with multilingual `name`, `hasFake`, `buy-price`, `sell-price`, `image_uri`, and `museum-desc`.
- The README says the API data covers furniture, critters, fossils, art, music, and villagers from Animal Crossing: New Horizons.

## Auth, rate limits, errors, and live-behavior notes
- The official README explicitly says `No authentification is required`.
- The official README says endpoints could be accessed over HTTP or HTTPS.
- No numeric rate-limit policy is documented in the surviving first-party sources inspected in this pass.
- No official error schema is documented in the surviving first-party sources inspected in this pass.
- Current live-host behavior is unreliable for contract validation: the root redirected to an unrelated `actinia.mundialis.de` 404 page and the sample `/v1/fish/1` path returned redirect HTML instead of stable JSON.

## Important usage notes
- The repository was archived by its owner on `2023-04-20`, but it still preserves the clearest first-party contract that remains publicly visible.
- Treat this provider as repository-documented and live-host-unreliable until a new official deployment or official docs surface is restored.
- The alternate `v1a` prefix is not a separate product; it is the same dataset exposed as array output instead of the nested-object output used by `v1`.
- Embedded provider-authored `image_uri`, `icon_uri`, and `music_uri` fields are important because they preserve the published media and item path patterns even though the live host is currently unreliable.

## Integration notes for fireROUTE
- Model the provider around eleven dataset collections under `/v1`, the same eleven under `/v1a`, two item routes that are explicitly embedded in official data (`/v1/hourly/{id}` and `/v1/music/{id}`), and two media route families (`/v1/images/...` and `/v1/icons/...`).
- Preserve the distinction between `/v1` nested-object responses and `/v1a` array responses.
- Do not invent undocumented query parameters, pagination, or rate limits.
- Treat live-host responses as non-authoritative until the provider restores an official maintained deployment.

## Sources inspected
- `https://acnhapi.com/`
- `https://acnhapi.com/v1/fish/1`
- `https://github.com/alexislours/ACNHAPI`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/README.MD`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/art.json`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/v1a/art.json`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/v1a/bugs.json`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/hourly.json`
- `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/music.json`
