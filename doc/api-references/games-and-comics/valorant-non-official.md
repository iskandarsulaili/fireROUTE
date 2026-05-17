# Valorant (non-official)

## Overview
- Provider: Valorant-API
- Category: Games & Comics
- Official docs: `https://valorant-api.com/`
- Dashboard/docs UI: `https://dash.valorant-api.com/`
- Base URL: `https://valorant-api.com/v1`
- Auth: no API key or auth scheme documented
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `55`

## Confirmed endpoints

### Agents
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/agents` | query `language` optional; query `isPlayableCharacter` optional boolean | Returns all agents. Docs note there are two Sova entries; use `isPlayableCharacter=true` to filter the duplicate/non-playable entry. |
| GET | `/agents/{agentUuid}` | path `agentUuid`; query `language` optional | Returns one agent by UUID. |

### Buddies
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/buddies` | query `language` optional | Returns all weapon buddies. |
| GET | `/buddies/levels` | query `language` optional | Returns all weapon buddy levels. |
| GET | `/buddies/{buddyUuid}` | path `buddyUuid`; query `language` optional | Returns one weapon buddy by UUID. |
| GET | `/buddies/levels/{buddyLevelUuid}` | path `buddyLevelUuid`; query `language` optional | Returns one buddy level by UUID. |

### Bundles
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/bundles` | query `language` optional | Returns all bundles. |
| GET | `/bundles/{bundleUuid}` | path `bundleUuid`; query `language` optional | Returns one bundle by UUID. |

### Ceremonies
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/ceremonies` | query `language` optional | Returns all ceremonies. |
| GET | `/ceremonies/{ceremoniesUuid}` | path `ceremoniesUuid`; query `language` optional | Returns one ceremony by UUID. |

### Competitive tiers
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/competitivetiers` | query `language` optional | Returns all competitive tiers. |
| GET | `/competitivetiers/{competitivetierUuid}` | path `competitivetierUuid`; query `language` optional | Returns one competitive tier by UUID. |

### Content tiers
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/contenttiers` | query `language` optional | Returns all content tiers. |
| GET | `/contenttiers/{contenttierUuid}` | path `contenttierUuid`; query `language` optional | Returns one content tier by UUID. |

### Contracts
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/contracts` | query `language` optional | Returns all contracts. |
| GET | `/contracts/{contractUuid}` | path `contractUuid`; query `language` optional | Returns one contract by UUID. |

### Currencies
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/currencies` | query `language` optional | Returns all currencies. |
| GET | `/currencies/{currencyUuid}` | path `currencyUuid`; query `language` optional | Returns one currency by UUID. |

### Events
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/events` | query `language` optional | Returns all events. |
| GET | `/events/{eventUuid}` | path `eventUuid`; query `language` optional | Returns one event by UUID. |

### Flex
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/flex` | query `language` optional | Returns all Flex items. |
| GET | `/flex/{flexUuid}` | path `flexUuid`; query `language` optional | Returns one Flex item by UUID. |

### Gamemodes
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/gamemodes` | query `language` optional | Returns all gamemodes. |
| GET | `/gamemodes/equippables` | query `language` optional | Returns all gamemode equippables. |
| GET | `/gamemodes/{gamemodeUuid}` | path `gamemodeUuid`; query `language` optional | Returns one gamemode by UUID. |
| GET | `/gamemodes/equippables/{gamemodeequippableUuid}` | path `gamemodeequippableUuid`; query `language` optional | Returns one gamemode equippable by UUID. |

### Gear
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/gear` | query `language` optional | Returns all gear. |
| GET | `/gear/{gearUuid}` | path `gearUuid`; query `language` optional | Returns one gear item by UUID. |

### Level borders
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/levelborders` | none documented | Returns all level borders. |
| GET | `/levelborders/{levelborderUuid}` | path `levelborderUuid` | Returns one level border by UUID. |

### Maps
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/maps` | query `language` optional | Returns all maps. |
| GET | `/maps/{mapUuid}` | path `mapUuid`; query `language` optional | Returns one map by UUID. |

### Player cards
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/playercards` | query `language` optional | Returns all player cards. |
| GET | `/playercards/{playercardUuid}` | path `playercardUuid`; query `language` optional | Returns one player card by UUID. |

### Player titles
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/playertitles` | query `language` optional | Returns all player titles. |
| GET | `/playertitles/{playertitleUuid}` | path `playertitleUuid`; query `language` optional | Returns one player title by UUID. |

### Seasons
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/seasons` | query `language` optional | Returns all seasons. |
| GET | `/seasons/competitive` | none documented | Returns competitive seasons. |
| GET | `/seasons/{seasonUuid}` | path `seasonUuid`; query `language` optional | Returns one season by UUID. |
| GET | `/seasons/competitive/{competitiveSeasonUuid}` | path `competitiveSeasonUuid` | Returns one competitive season by UUID. |

### Sprays
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/sprays` | query `language` optional | Returns all sprays. |
| GET | `/sprays/levels` | query `language` optional | Returns all spray levels. |
| GET | `/sprays/{sprayUuid}` | path `sprayUuid`; query `language` optional | Returns one spray by UUID. |
| GET | `/sprays/levels/{sprayLevelUuid}` | path `sprayLevelUuid`; query `language` optional | Returns one spray level by UUID. |

### Themes
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/themes` | query `language` optional | Returns all themes. |
| GET | `/themes/{themeUuid}` | path `themeUuid`; query `language` optional | Returns one theme by UUID. |

### Weapons
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/weapons` | query `language` optional | Returns all weapons. |
| GET | `/weapons/skins` | query `language` optional | Returns all weapon skins. |
| GET | `/weapons/skinchromas` | query `language` optional | Returns all weapon skin chromas. |
| GET | `/weapons/skinlevels` | query `language` optional | Returns all weapon skin levels. |
| GET | `/weapons/{weaponUuid}` | path `weaponUuid`; query `language` optional | Returns one weapon by UUID. |
| GET | `/weapons/skins/{weaponSkinUuid}` | path `weaponSkinUuid`; query `language` optional | Returns one weapon skin by UUID. |
| GET | `/weapons/skinchromas/{weaponSkinChromaUuid}` | path `weaponSkinChromaUuid`; query `language` optional | Returns one weapon skin chroma by UUID. |
| GET | `/weapons/skinlevels/{weaponSkinLevelUuid}` | path `weaponSkinLevelUuid`; query `language` optional | Returns one weapon skin level by UUID. |

### Version
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/version` | none documented | Returns current manifest/build/version metadata for the live data snapshot. |

## Parameters and usage notes
- The docs dashboard says most endpoints support these language values: `ar-AE`, `de-DE`, `en-US`, `es-ES`, `es-MX`, `fr-FR`, `id-ID`, `it-IT`, `ja-JP`, `ko-KR`, `pl-PL`, `pt-BR`, `ru-RU`, `th-TH`, `tr-TR`, `vi-VN`, `zh-CN`, `zh-TW`.
- The overwhelming route pattern is collection + UUID detail lookup for static game content.
- UUID detail routes document a path UUID plus, in most cases, optional `language`.
- The docs do not publish pagination controls, which matches the API's catalog/static-data focus.
- `/agents` is the only inspected route with an extra filter parameter besides language: `isPlayableCharacter`.

## Response schema notes
- A live request to `/v1/version` returned a JSON wrapper shaped like:
  - `status`
  - `data.manifestId`
  - `data.branch`
  - `data.version`
  - `data.buildVersion`
  - `data.engineVersion`
  - `data.riotClientVersion`
  - `data.riotClientBuild`
  - `data.buildDate`
- A live request to `/v1/agents?isPlayableCharacter=true` returned `status: 200` and an array under `data`; the first object contained fields such as:
  - `uuid`
  - `displayName`
  - `description`
  - `developerName`
  - `releaseDate`
  - `characterTags`
  - `displayIcon`
  - `displayIconSmall`
  - `fullPortrait`
  - `killfeedPortrait`
  - `isPlayableCharacter`
  - `isAvailableForTest`
- A live invalid UUID lookup returned `{ "status": 404, "error": "the requested uuid was not found" }`.

## Errors, auth, and rate limits
- The official docs do not describe any authentication requirement.
- The docs do not publish any rate-limit policy.
- Per-route docs consistently show `200` and `400` response sections, and UUID detail routes also show `404`.
- The live invalid UUID response confirms the API uses a JSON error body with `status` and `error`.

## Integration notes for fireROUTE
- Treat this provider as a static metadata/catalog API rather than a search API with pagination.
- Preserve a generic `language` passthrough on nearly every adapter because localization is a core part of the official contract.
- For agents, expose `isPlayableCharacter` so consumers can avoid the duplicate/non-playable Sova entry noted in the docs.
- Expect homogeneous response wrappers (`status` + `data`) on success and (`status` + `error`) on failures.
- UUID-keyed detail routes are the natural canonical lookup surface for fireROUTE entity adapters.

## Sources inspected
- `https://valorant-api.com/`
- `https://dash.valorant-api.com/`
- `https://dash.valorant-api.com/about`
- `https://dash.valorant-api.com/endpoints/agents`
- `https://dash.valorant-api.com/endpoints/buddies`
- `https://dash.valorant-api.com/endpoints/bundles`
- `https://dash.valorant-api.com/endpoints/ceremonies`
- `https://dash.valorant-api.com/endpoints/competitivetiers`
- `https://dash.valorant-api.com/endpoints/contenttiers`
- `https://dash.valorant-api.com/endpoints/contracts`
- `https://dash.valorant-api.com/endpoints/currencies`
- `https://dash.valorant-api.com/endpoints/events`
- `https://dash.valorant-api.com/endpoints/flex`
- `https://dash.valorant-api.com/endpoints/gamemodes`
- `https://dash.valorant-api.com/endpoints/gear`
- `https://dash.valorant-api.com/endpoints/levelborders`
- `https://dash.valorant-api.com/endpoints/maps`
- `https://dash.valorant-api.com/endpoints/playercards`
- `https://dash.valorant-api.com/endpoints/playertitles`
- `https://dash.valorant-api.com/endpoints/seasons`
- `https://dash.valorant-api.com/endpoints/sprays`
- `https://dash.valorant-api.com/endpoints/themes`
- `https://dash.valorant-api.com/endpoints/weapons`
- `https://dash.valorant-api.com/endpoints/version`
- `https://valorant-api.com/v1/version`
- `https://valorant-api.com/v1/agents?isPlayableCharacter=true`
- `https://valorant-api.com/v1/agents/00000000-0000-0000-0000-000000000000`
