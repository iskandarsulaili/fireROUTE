# Dota 2

## Overview
- Provider: OpenDota API
- Category: Games & Comics
- Official docs: `https://docs.opendota.com/`
- Official OpenAPI document: `https://api.opendota.com/api`
- Base URL: `https://api.opendota.com/api`
- Auth: optional API key via query `api_key` or header `Authorization: Bearer YOUR-API-KEY`
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `55`

## Global notes from the official docs
- The official Redoc docs at `https://docs.opendota.com/` are backed by the live OpenAPI document served from `https://api.opendota.com/api`.
- The API provides Dota 2 player, match, hero, league, team, metadata, health, and analysis-style endpoints.
- The official intro says the API can be used without a key, but registering for a key removes monthly call limits and provides higher rate limits.
- The official `api_key` security scheme description says the key may be sent either as query `api_key` or as `Authorization: Bearer YOUR-API-KEY`.
- The docs point integrators to the official `dotaconstants` repository for hero IDs, abilities, and other constant mappings.

## Auth and rate limits
- Authentication is optional for the documented routes in the inspected OpenAPI spec.
- Official auth scheme:
  - query `api_key`
  - or header `Authorization: Bearer YOUR-API-KEY`
- The official docs explicitly say API keys remove monthly call limits and increase rate limits.
- The inspected docs/spec did not publish one exact numeric global rate-limit quota.

## Confirmed endpoint inventory

### matches (1)
- GET `/matches/{match_id}` — /matches/{match_id}; params: match_id* {path}; auth: none; responses: 200.

### players (15)
- GET `/players/{account_id}` — /players/{account_id}; params: account_id* {path}; auth: none; responses: 200.
- GET `/players/{account_id}/wl` — /players/{account_id}/wl; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/recentMatches` — /players/{account_id}/recentMatches; params: account_id* {path}; auth: none; responses: 200.
- GET `/players/{account_id}/matches` — /players/{account_id}/matches; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}, project {query}; auth: none; responses: 200.
- GET `/players/{account_id}/heroes` — /players/{account_id}/heroes; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/peers` — /players/{account_id}/peers; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/pros` — /players/{account_id}/pros; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/totals` — /players/{account_id}/totals; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/counts` — /players/{account_id}/counts; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/histograms/{field}` — /players/{account_id}/histograms; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}, field* {path}; auth: none; responses: 200.
- GET `/players/{account_id}/wardmap` — /players/{account_id}/wardmap; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/wordcloud` — /players/{account_id}/wordcloud; params: account_id* {path}, limit {query}, offset {query}, win {query}, patch {query}, game_mode {query}, lobby_type {query}, region {query}, date {query}, lane_role {query}, hero_id {query}, is_radiant {query}, included_account_id {query}, excluded_account_id {query}, with_hero_id {query}, against_hero_id {query}, significant {query}, having {query}, sort {query}; auth: none; responses: 200.
- GET `/players/{account_id}/ratings` — /players/{account_id}/ratings; params: account_id* {path}; auth: none; responses: 200.
- GET `/players/{account_id}/rankings` — /players/{account_id}/rankings; params: account_id* {path}; auth: none; responses: 200.
- POST `/players/{account_id}/refresh` — /players/{account_id}/refresh; params: account_id* {path}; auth: none; responses: 200.

### top players (1)
- GET `/topPlayers` — /topPlayers; params: turbo {query}; auth: none; responses: 200.

### pro players (1)
- GET `/proPlayers` — /proPlayers; params: none; auth: none; responses: 200.

### pro matches (1)
- GET `/proMatches` — /proMatches; params: less_than_match_id {query}; auth: none; responses: 200.

### public matches (1)
- GET `/publicMatches` — /publicMatches; params: less_than_match_id {query}, min_rank {query}, max_rank {query}; auth: none; responses: 200.

### parsed matches (1)
- GET `/parsedMatches` — /parsedMatches; params: less_than_match_id {query}; auth: none; responses: 200.

### explorer (1)
- GET `/explorer` — /explorer; params: sql {query}; auth: none; responses: 200.

### metadata (1)
- GET `/metadata` — /metadata; params: none; auth: none; responses: 200.

### distributions (1)
- GET `/distributions` — /distributions; params: none; auth: none; responses: 200.

### search (1)
- GET `/search` — /search; params: q* {query}; auth: none; responses: 200.

### rankings (1)
- GET `/rankings` — /rankings; params: hero_id* {query}; auth: none; responses: 200.

### benchmarks (1)
- GET `/benchmarks` — /benchmarks; params: hero_id* {query}; auth: none; responses: 200.

### health (1)
- GET `/health` — /health; params: none; auth: none; responses: 200.

### request (2)
- GET `/request/{jobId}` — /request/{jobId}; params: jobId* {path}; auth: none; responses: 200.
- POST `/request/{match_id}` — /request/{match_id}; params: match_id* {path}; auth: none; responses: 200.

### findMatches (1)
- GET `/findMatches` — /; params: teamA {query}, teamB {query}; auth: none; responses: 200.

### heroes (6)
- GET `/heroes` — /heroes; params: none; auth: none; responses: 200.
- GET `/heroes/{hero_id}/matches` — /heroes/{hero_id}/matches; params: hero_id* {path}; auth: none; responses: 200.
- GET `/heroes/{hero_id}/matchups` — /heroes/{hero_id}/matchups; params: hero_id* {path}; auth: none; responses: 200.
- GET `/heroes/{hero_id}/durations` — /heroes/{hero_id}/durations; params: hero_id* {path}; auth: none; responses: 200.
- GET `/heroes/{hero_id}/players` — /heroes/{hero_id}/players; params: hero_id* {path}; auth: none; responses: 200.
- GET `/heroes/{hero_id}/itemPopularity` — /heroes/{hero_id}/itemPopularity; params: hero_id* {path}; auth: none; responses: 200.

### hero stats (1)
- GET `/heroStats` — /heroStats; params: none; auth: none; responses: 200.

### leagues (5)
- GET `/leagues` — /leagues; params: none; auth: none; responses: 200.
- GET `/leagues/{league_id}` — /leagues/{league_id}; params: league_id* {path}; auth: none; responses: 200.
- GET `/leagues/{league_id}/matches` — /leagues/{league_id}/matches; params: league_id* {path}; auth: none; responses: 200.
- GET `/leagues/{league_id}/matchIds` — /leagues/{league_id}/matchIds; params: league_id* {path}; auth: none; responses: 200.
- GET `/leagues/{league_id}/teams` — /leagues/{league_id}/teams; params: league_id* {path}; auth: none; responses: 200.

### teams (5)
- GET `/teams` — /teams; params: page {query}; auth: none; responses: 200.
- GET `/teams/{team_id}` — /teams/{team_id}; params: team_id* {path}; auth: none; responses: 200.
- GET `/teams/{team_id}/matches` — /teams/{team_id}/matches; params: team_id* {path}; auth: none; responses: 200.
- GET `/teams/{team_id}/players` — /teams/{team_id}/players; params: team_id* {path}; auth: none; responses: 200.
- GET `/teams/{team_id}/heroes` — /teams/{team_id}/heroes; params: team_id* {path}; auth: none; responses: 200.

### records (1)
- GET `/records/{field}` — /records/{field}; params: field* {path}; auth: none; responses: 200.

### live (1)
- GET `/live` — /live; params: none; auth: none; responses: 200.

### scenarios (3)
- GET `/scenarios/itemTimings` — /scenarios/itemTimings; params: item {query}, hero_id {query}; auth: none; responses: 200.
- GET `/scenarios/laneRoles` — /scenarios/laneRoles; params: lane_role {query}, hero_id {query}; auth: none; responses: 200.
- GET `/scenarios/misc` — /scenarios/misc; params: scenario {query}; auth: none; responses: 200.

### schema (1)
- GET `/schema` — /schema; params: none; auth: none; responses: 200.

### constants (1)
- GET `/constants/{resource}` — /constants; params: resource* {path}; auth: none; responses: 200.

## Pagination, format, and error notes
- The official spec uses JSON throughout the inspected API surface.
- Many list/filter endpoints use query pagination or cursor-like selectors such as `limit`, `offset`, `page`, and `less_than_match_id` rather than one single global pagination scheme.
- Player split-stat endpoints reuse a common filter family: `limit`, `offset`, `win`, `patch`, `game_mode`, `lobby_type`, `region`, `date`, `lane_role`, `hero_id`, `is_radiant`, `included_account_id`, `excluded_account_id`, `with_hero_id`, `against_hero_id`, `significant`, `having`, and `sort`.
- Async parsing/request flows use `POST /request/{match_id}` to enqueue work and `GET /request/{jobId}` to read status.
- Live check: `GET /matches/271145478` returned `200` JSON with full match data.
- Live check: `GET /matches/0` returned `404` JSON `{"error":"Not Found"}`.
- Live check: `GET /heroes` returned `200` JSON array data.
- Live check: `GET /health` returned `200` JSON health/usage metrics.

## Important usage notes
- Treat the API key as an account-level quota and limit upgrade rather than a route-by-route requirement.
- Some endpoints expose raw exploratory or SQL-style access patterns such as `/explorer`; pass user-controlled values carefully.
- Several resources are analytical summaries rather than canonical Valve ground truth; preserve provider-specific semantics in any fireROUTE adapter.
- The docs point to the `dotaconstants` repository for many ID-to-name/resource mappings that the API responses themselves do not fully explain.

## Integration notes for fireROUTE
- Model OpenDota as one shared JSON API rooted at `https://api.opendota.com/api`.
- Support optional API credentials in either query or bearer-header form.
- Preserve provider-native filter names instead of flattening them too aggressively because the reused player filter family is broad and meaningful.
- Handle `404` JSON not-found payloads distinctly from successful but empty result sets.
- For queued parse/request flows, expose polling semantics rather than pretending the initial POST is synchronous.

## Sources inspected
- `https://docs.opendota.com/`
- `https://api.opendota.com/api`
- Live checks via browser fetch against:
  - `https://api.opendota.com/api/matches/271145478`
  - `https://api.opendota.com/api/matches/0`
  - `https://api.opendota.com/api/heroes`
  - `https://api.opendota.com/api/health`
  - `https://www.opendota.com/api-keys`
