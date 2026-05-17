# MLB Records and Stats

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `mlb-records-and-stats`
- Official docs/pages used:
  - `https://appac.github.io/mlb-data-api-docs/`
- Current public API base URL: `http://lookup-service-prod.mlb.com`
- Auth model: no API key, OAuth flow, or other auth mechanism was documented on the reviewed page.
- Response format: JSON. The docs show JSON examples for every route and describe a shared `copyRight` + `queryResults` response envelope.
- Public rate-limit note: no numeric rate-limit policy was published on the reviewed page.
- Manually confirmed route count: `20`

## Canonical endpoints
1. `GET /json/named.search_player_all.bam` - search active or historic players by name.
2. `GET /json/named.player_info.bam` - fetch detailed player metadata.
3. `GET /json/named.player_teams.bam` - list teams a player appeared for in a season.
4. `GET /json/named.sport_hitting_tm.bam` - season hitting stats for one player.
5. `GET /json/named.sport_pitching_tm.bam` - season pitching stats for one player.
6. `GET /json/named.sport_career_hitting.bam` - career hitting totals for one player.
7. `GET /json/named.sport_career_pitching.bam` - career pitching totals for one player.
8. `GET /json/named.sport_career_hitting_lg.bam` - league-level career hitting splits.
9. `GET /json/named.sport_career_pitching_lg.bam` - league-level career pitching splits.
10. `GET /json/named.proj_pecota_pitching.bam` - projected pitching output for one player and season.
11. `GET /json/named.proj_pecota_batting.bam` - projected hitting output for one player and season.
12. `GET /json/named.team_all_season.bam` - list teams for a season.
13. `GET /json/named.roster_40.bam` - get a team's 40-man roster.
14. `GET /json/named.roster_team_alltime.bam` - get a team's roster across a season range.
15. `GET /json/named.org_game_type_date_info.bam` - get date information for an MLB game type.
16. `GET /json/named.transaction_all.bam` - list transactions across a date range.
17. `GET /json/named.mlb_broadcast_info.bam` - list broadcasts over a date range.
18. `GET /fantasylookup/json/json/named.wsfb_news_injury.bam` - current injuries/news feed.
19. `GET /json/named.leader_hitting_repeater.bam` - hitting leaders.
20. `GET /json/named.leader_pitching_repeater.bam` - pitching leaders.

## Parameters and filtering notes
### Shared/base request pattern
- The docs define the request structure as `Host: http://lookup-service-prod.mlb.com` plus `Path: /json/named.[endpoint].bam`.
- Many routes use quoted literal defaults such as `sport_code='mlb'` or `league_list_id='mlb'` in the examples.

### Common player/stat parameters shown in the docs
- `player_id` identifies the player for player details, team history, stats, projections, and career endpoints.
- `season` is used on season-based stats, projections, and team season queries.
- `game_type` is used on season, career, and leaders endpoints.
- `sport_code` / `league_list_id` appear across player-search and stats routes.

### Team, transaction, and broadcast parameters shown in the docs
- `team_id` identifies team roster routes.
- `start_season` and `end_season` are used on the all-time roster route.
- `start_date` and `end_date` are used on transactions and broadcast windows.
- `home_away`, `src_type`, `src_comment`, `tcid`, `sort_by`, and `season` appear on the broadcast route.
- `all_star_sw` and `sort_order` appear on the season teams route.

### Search and leader parameters shown in the docs
- `active_sw` controls active versus inactive player search.
- `name_part` is the player-name search token.
- `results` and `sort_column` are used on both leader routes.
- `current_sw` appears on the game-type date-info route.

### Column shaping parameters
- The docs explicitly describe provider-specific `col_in` and `col_ex` controls to include or exclude response columns.
- The format is `[endpoint].col_in` or `[endpoint].col_ex`, for example `search_player_all.col_in=player_id`.

## Authentication and access notes
- No auth requirements were documented on the reviewed page.
- The docs explicitly state that returned data is property of MLB / MLB Advanced Media and tell consumers to review MLB terms of use before using it in projects.
- The published host is plain HTTP, not HTTPS.

## Response and error notes
- The docs show JSON responses with a provider-specific envelope containing a top-level object named after the endpoint, plus `copyRight` and `queryResults` metadata.
- The player-search section warns that single-term searches should append `%25`; otherwise the request returns `500`.
- No standard pagination contract or rate-limit headers were documented on the reviewed page.

## Usage notes from the official docs
- The docs are focused on read-only historical and current MLB lookup/statistics retrieval.
- The `col_in` / `col_ex` feature is important for large responses and should be preserved when possible.
- Several endpoints encode MLB-specific literals directly in the examples, so a fireROUTE adapter should avoid over-normalizing those parameters away.

## fireROUTE normalization notes
- Treat this provider as a legacy read-only MLB data surface rooted at `http://lookup-service-prod.mlb.com`.
- Preserve the exact endpoint names, including the `.bam` suffixes and the separate `/fantasylookup/json/json/` injury path.
- Preserve query parameter names exactly because the docs use endpoint-specific field selectors like `leader_hitting_repeater.col_in` and literal quoted values such as `'mlb'`.
- Expect the provider's custom JSON envelope rather than a simple array-only response.