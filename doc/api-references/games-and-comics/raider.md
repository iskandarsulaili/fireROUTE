# Raider

## Overview
- Provider: Raider.IO Developer API
- Category: Games & Comics
- Official docs: `https://raider.io/api`
- Machine-readable spec inspected: `https://raider.io/swagger.json`
- Base URL: `https://raider.io`
- Auth: no auth required for public access; optional `access_key` query parameter is available for registered apps and higher rate limits
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `35`

## Global request notes
- Every inspected operation is `GET`.
- The Swagger spec exposes an optional `access_key` query parameter on every route. The docs describe it as the API key from `raider.io/settings/apps` for higher rate limits.
- Region-driven endpoints typically use Blizzard region codes such as `us`, `eu`, `kr`, `tw`, and `cn`.
- Many guild/character endpoints use realm and name/guild slugs or titles rather than numeric IDs.

## Confirmed endpoints

### General
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/periods` | optional `access_key` | Returns current/previous/next period IDs and date ranges by region. |

### Character and guild profiles
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/characters/profile` | required `region`, `realm`, `name`; optional `fields`, `access_key` | Character profile lookup; `fields` is a comma-separated expansion selector for gear, talents, guild, raid progression, Mythic+ scores/ranks/runs, and related expansions/seasons. |
| GET | `/api/v1/guilds/boss-kill` | required `region`, `realm`, `guild`, `raid`, `boss`, `difficulty`; optional `access_key` | Guild boss-kill lookup for a specific raid encounter. |
| GET | `/api/v1/guilds/profile` | required `region`, `realm`, `name`; optional `fields`, `access_key` | Guild profile lookup with optional field expansion. |

### Raiding
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/raiding/boss-rankings` | required `raid`, `boss`, `difficulty`, `region`; optional `realm`, `access_key` | Boss rankings for a raid encounter and region. |
| GET | `/api/v1/raiding/hall-of-fame` | required `raid`, `difficulty`, `region`; optional `access_key` | Hall of fame for a raid. |
| GET | `/api/v1/raiding/progression` | required `raid`, `difficulty`, `region` | Progression milestone summary for a raid. |
| GET | `/api/v1/raiding/raid-rankings` | required `raid`, `difficulty`, `region`; optional `realm`, `guilds`, `limit`, `page`, `access_key` | Raid leaderboard with explicit pagination via `page` and `limit`. |
| GET | `/api/v1/raiding/static-data` | required `expansion_id`; optional `access_key` | Static raid and boss metadata for an expansion. |

### Mythic+
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/mythic-plus/affixes` | required `region`; optional `locale`, `access_key` | Current affixes for a region; `locale` defaults to `en`. |
| GET | `/api/v1/mythic-plus/leaderboard-capacity` | required `region`; optional `scope`, `realm`, `access_key` | Leaderboard capacity/qualification thresholds. |
| GET | `/api/v1/mythic-plus/run-details` | required `season`, `id`; optional `access_key` | One Mythic+ run by season slug and run ID. |
| GET | `/api/v1/mythic-plus/runs` | optional `season`, `region`, `dungeon`, `affixes`, `page`, `access_key` | Top runs listing; supports paging with `page`. |
| GET | `/api/v1/mythic-plus/score-tiers` | optional `season`, `access_key` | Score-tier color definitions. |
| GET | `/api/v1/mythic-plus/season-cutoffs` | required `region`; optional `season`, `access_key` | Season cutoffs for a region. |
| GET | `/api/v1/mythic-plus/static-data` | required `expansion_id`; optional `access_key` | Static season and dungeon metadata for an expansion. |

### Live Tracking - General
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/live-tracking/character/loadout` | required `region`, `realm`, `name`; optional `access_key` | Character loadout snapshot from combat-log uploads. |
| GET | `/api/v1/live-tracking/guild/gear-summary` | required `raid`; optional `difficulty`, `scope`, `advanced_search`, `before_date`, `boss`, `first_kill`, `period`, `pull_id`, `guild_id`, `region`, `realm`, `guild`, `access_key` | Guild roster gear summary; `scope` can be `pull` or `armory`. |

### Live Tracking - Raiding
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/live-tracking/guild/boss-attempts` | required `raid`, `boss`, `difficulty`, `region`, `realm`, `guild`; optional `period`, `access_key` | Simplified timeline of boss attempts. |
| GET | `/api/v1/live-tracking/guild/boss-progress` | required `raid`, `boss`, `difficulty`; optional `period`, `guild_id`, `region`, `realm`, `guild`, `access_key` | Best guild progress on a specific boss. |
| GET | `/api/v1/live-tracking/guild/boss-pulls` | required `raid`, `boss`, `difficulty`, `region`, `realm`, `guild`; optional `period`, `min_date`, `max_date`, `access_key` | Detailed pull history with date-range filters. |
| GET | `/api/v1/live-tracking/guild/loot` | required `raid`, `region`, `realm`, `guild`; optional `duration_minutes`, `start_time`, `end_time`, `count`, `item_types`, `access_key` | Recent loot drops; supports time-range and item-type filtering. |
| GET | `/api/v1/live-tracking/guild/raid-comps` | required `raid`; optional `difficulty`, `id`, `guild_id`, `region`, `realm`, `boss`, `guild`, `access_key` | Raid composition for a specific pull or guild context. |
| GET | `/api/v1/live-tracking/guild/raid-progress` | required `raid`, `difficulty`; optional `guild_id`, `region`, `realm`, `guild`, `period`, `access_key` | Overall raid progress across all bosses. |
| GET | `/api/v1/live-tracking/guild/raid-pulls` | required `raid`, `difficulty`; optional `period`, `start_range`, `end_range`, `region`, `realm`, `guild`, `guild_id`, `access_key` | Raid-wide pull history across encounters. |
| GET | `/api/v1/live-tracking/rwf-event/feed` | required `raid`, `guild_ids`, `after`; optional `difficulty`, `types`, `border_style`, `test`, `access_key` | Race to World First event feed; `after` acts as a polling cursor. |
| GET | `/api/v1/live-tracking/rwf-event/last` | required `raid`; optional `access_key` | Returns the latest RWF event ID for cursor bootstrapping. |
| GET | `/api/v1/live-tracking/raiding/bot-commands/{cmd}` | path `cmd` required; query requires `raid`, `boss`, `difficulty`; optional `period`, `guild_id`, `region`, `realm`, `guild`, `template`, `access_key` | Preformatted bot-command output; `cmd` enum includes `best-percent`, `pull-count`, `percent-and-pulls`, `itemlevel`. |
| GET | `/api/v1/live-tracking/user/activities/raiding` | required `raid`, `user_id`, `types`; optional `access_key` | Raiding combat-log contribution activity feed for a user. |
| GET | `/api/v1/live-tracking/user/activity/raiding` | required `raid`, `encounter_id`; optional `access_key` | One detailed raid encounter from live-tracking uploads. |

### Live Tracking - Mythic+
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/live-tracking/heatmaps/floors` | optional `access_key` | Floor geometry for all dungeons. |
| GET | `/api/v1/live-tracking/heatmaps/grid` | required `type`, `challengeModeId`, `season`; optional `dataType`, `region`, `minMythicLevel`, `maxMythicLevel`, `minItemLevel`, `maxItemLevel`, `minPeriod`, `maxPeriod`, `minTimerFraction`, `maxTimerFraction`, `minPlayerDeaths`, `maxPlayerDeaths`, `includeSpecIds`, `excludeSpecIds`, `includeClassIds`, `excludeClassIds`, `excludePlayerDeathSpecIds`, `includePlayerDeathSpecIds`, `excludePlayerDeathClassIds`, `includePlayerDeathClassIds`, `includePlayerSpellIds`, `includeAffixIds`, `excludeAffixIds`, `minRequiredSamplesFactor`, `floorsAsArray`, `token`, `access_key` | Aggregated spatial heatmap data for Mythic+ dungeons. |
| GET | `/api/v1/live-tracking/mythic-plus/current-dungeon` | required `season`; optional `teamId`, `platoonId`, `access_key` | Returns the current dungeon for an active team/platoon, or null if inactive. |
| GET | `/api/v1/live-tracking/user/activities/mythic-plus` | required `season`, `user_id`, `types`; optional `access_key` | Mythic+ combat-log contribution activity feed for a user. |
| GET | `/api/v1/live-tracking/user/activity/mythic-plus` | required `season`, `run_id`; optional `access_key` | One detailed Mythic+ run from live-tracking uploads. |

## Response schema notes
- A live request to `/api/v1/periods` returned JSON with a top-level `periods` array.
- Each array item contained:
  - `region`
  - `current.period`, `current.start`, `current.end`
  - `previous.period`, `previous.start`, `previous.end`
  - `next.period`, `next.start`, `next.end`
- The official Swagger spec publishes response schemas for success cases, but it does not provide a full cross-endpoint error-object catalog in the human-readable summary.

## Authentication, rate limits, pagination, and errors
- Unauthenticated requests are limited to `200 requests per minute`.
- The docs state that exceeding the limit returns HTTP `429` and advise retry/backoff handling.
- Registering an app at `https://raider.io/settings/apps` provides an `access_key` and higher limits.
- Public-facing apps using the API must include attribution linking back to Raider.IO.
- Explicit pagination controls are documented on:
  - `/api/v1/raiding/raid-rankings` via `page` and `limit`
  - `/api/v1/mythic-plus/runs` via `page`
- Several live-tracking feeds use cursor/time-window style traversal rather than classic pagination, especially:
  - `/api/v1/live-tracking/rwf-event/feed` via `after`
  - loot/pulls endpoints via time/date filters
- The docs warn that live-tracking endpoints depend on Raider.IO Desktop App combat-log uploads.

## Important usage notes
- Raider.IO explicitly prohibits building competing services, reselling data, or scraping beyond the published endpoints.
- Data is sourced from Blizzard APIs, Raider.IO Live Tracking, and community contributions, and is provided without timeliness/accuracy guarantees.
- Many `fields` parameters accept colon-qualified subselectors and aliases such as `current`, `previous`, expansion IDs, raid slugs, and season slugs.
- Raid/guild/character routes often accept either realm slugs or title-form realm names.

## Integration notes for fireROUTE
- Support optional `access_key` passthrough globally rather than modeling Raider.IO as a fully authenticated API.
- Preserve Raider.IO's route families separately: static rankings/profiles vs. live-tracking telemetry.
- Model `region`, `realm`, and human-readable entity names as first-class query inputs; many endpoints are not numeric-ID-first.
- Treat live-tracking routes as conditional availability surfaces because they require Desktop App upload participation.
- Add rate-limit aware retry logic for `429` responses and polling-aware cursor handling for RWF feeds.

## Sources inspected
- `https://raider.io/api`
- `https://raider.io/swagger.json`
- `https://raider.io/api/v1/periods`
