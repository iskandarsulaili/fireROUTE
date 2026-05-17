# balldontlie

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `balldontlie`
- Official docs/pages used:
  - `https://www.balldontlie.io/`
  - `https://www.balldontlie.io/openapi.yml`
  - `https://www.balldontlie.io/webhooks-openapi.yml`
- Current public API base URL: `https://api.balldontlie.io`
- Auth model: the reviewed OpenAPI specs define API-key auth in the `Authorization` header.
- Response format: JSON. The reviewed webhooks spec also documents JSON error objects of the form `{ "error": "..." }`.
- Public rate-limit note:
  - The homepage pricing grid reviewed in this run showed published request-rate tiers of `5 req/min`, `60 req/min`, and `600 req/min` depending on plan.
  - The official webhooks OpenAPI says webhook-management endpoints are limited to `100 requests per minute` per user.
- Manually confirmed route count: `394` (`385` concrete sport-data paths in the published index spec + `9` webhook-management paths in the published webhooks spec)

## Canonical endpoints

### Sport-data API surface
The official `openapi.yml` is an index spec that publishes `385` concrete paths and points to separate per-sport OpenAPI files for:
- ATP Tennis
- Bundesliga
- CBB (College Baseball)
- CS2
- Dota 2
- EPL
- Formula 1
- FIFA World Cup
- La Liga
- Ligue 1
- League of Legends
- MLB
- MLS
- MMA
- NBA
- NCAAB
- NCAAF
- NCAAW
- NFL
- NHL
- PGA Tour
- Serie A
- UEFA Champions League
- WNBA
- WTA Tennis

Representative concrete paths visible directly in the reviewed index spec include:
- `/nba/v1/teams`
- `/nba/v1/teams/{id}`
- `/nba/v1/players`
- `/nba/v1/players/{id}`
- `/nba/v1/games`
- `/nba/v1/games/{id}`
- `/nba/v1/stats`
- `/nba/v1/season_averages`
- `/nba/v1/season_averages/{type}`
- `/nba/v1/team_season_averages/{category}`
- `/nba/v1/standings`
- `/nba/v1/players/active`
- `/nba/v1/player_injuries`
- `/nba/v1/box_scores/live`
- `/nba/v1/box_scores`
- `/nba/v1/lineups`
- `/nba/v1/leaders`
- `/nba/v2/odds`
- `/nba/v2/odds/player_props`
- `/nba/v2/stats/advanced`
- `/nba/v1/contracts/teams`
- `/nba/v1/contracts/players`
- `/nba/v1/contracts/players/aggregate`
- `/nba/v1/plays`
- `/nfl/v1/teams`
- `/nfl/v1/teams/{id}`
- `/nfl/v1/teams/{id}/roster`
- `/nfl/v1/players`
- `/nfl/v1/players/{id}`
- `/nfl/v1/players/active`
- `/nfl/v1/games`
- `/nfl/v1/games/{id}`
- `/nfl/v1/stats`
- `/nfl/v1/standings`
- `/nfl/v1/player_injuries`
- `/nfl/v1/season_stats`
- `/nfl/v1/advanced_stats/rushing`
- `/nfl/v1/advanced_stats/passing`
- `/nfl/v1/advanced_stats/receiving`
- `/nfl/v1/odds`
- `/nfl/v1/odds/player_props`
- `/nfl/v1/team_season_stats`
- `/nfl/v1/team_stats`
- `/nfl/v1/plays`
- `/mlb/v1/teams`
- `/mlb/v1/teams/{id}`
- `/mlb/v1/players`
- `/mlb/v1/players/{id}`
- `/mlb/v1/player_injuries`
- `/mlb/v1/players/active`
- `/mlb/v1/games`
- `/mlb/v1/games/{id}`
- `/mlb/v1/stats`
- `/mlb/v1/standings`
- `/mlb/v1/season_stats`
- `/mlb/v1/teams/season_stats`
- `/mlb/v1/players/splits`
- `/mlb/v1/players/versus`
- `/mlb/v1/plays`
- `/mlb/v1/plate_appearances`
- `/mlb/v1/odds`
- `/mlb/v1/odds/player_props`
- `/nhl/v1/teams`
- `/nhl/v1/teams/{id}`
- `/nhl/v1/teams/{id}/season_stats`
- `/nhl/v1/players`
- `/nhl/v1/players/{id}/season_stats`
- `/nhl/v1/games`
- `/nhl/v1/standings`
- `/nhl/v1/box_scores`
- `/nhl/v1/plays`
- `/nhl/v1/player_injuries`
- `/nhl/v1/player_stats/leaders`
- `/nhl/v1/team_stats/leaders`
- `/nhl/v1/odds`
- `/nhl/v1/odds/player_props`
- `/epl/v2/teams`
- `/epl/v2/rosters`
- `/epl/v2/players`
- `/epl/v2/player_injuries`
- `/epl/v2/standings`
- `/epl/v2/matches`
- `/epl/v2/match_events`
- `/epl/v2/match_lineups`
- `/epl/v2/player_match_stats`
- `/epl/v2/team_match_stats`
- `/epl/v2/odds`
- `/epl/v2/odds/player_props`
- `/wnba/v1/teams`
- `/wnba/v1/teams/{id}`
- `/wnba/v1/players`
- `/wnba/v1/players/active`
- `/wnba/v1/players/{id}`
- `/wnba/v1/games`
- `/wnba/v1/games/{id}`
- `/wnba/v1/player_stats`
- `/wnba/v1/team_stats`
- `/wnba/v1/player_season_stats`
- `/wnba/v1/team_season_stats`
- `/wnba/v1/standings`
- `/wnba/v1/player_injuries`
- `/wnba/v1/odds`
- `/wnba/v1/odds/player_props`
- `/wnba/v1/plays`
- `/ncaaf/v1/conferences`
- `/ncaaf/v1/conferences/{id}`
- `/ncaaf/v1/teams`
- `/ncaaf/v1/teams/{id}`
- `/ncaaf/v1/players`
- `/ncaaf/v1/players/active`
- `/ncaaf/v1/players/{id}`
- `/ncaaf/v1/standings`
- `/ncaaf/v1/games`
- `/ncaaf/v1/games/{id}`
- `/ncaaf/v1/rankings`
- `/ncaaf/v1/plays`
- `/ncaaf/v1/player_stats`
- `/ncaaf/v1/team_stats`
- `/ncaaf/v1/player_season_stats`
- `/ncaaf/v1/team_season_stats`

The remaining published sport-data routes are exposed through the same official index spec and linked per-sport OpenAPI files; the reviewed index confirmed `385` distinct data paths in total.

### Webhook-management API surface
The reviewed webhooks spec confirmed these `9` published paths:
- `/webhooks/v1/event-types`
- `/webhooks/v1/endpoints`
- `/webhooks/v1/endpoints/{endpoint_id}`
- `/webhooks/v1/endpoints/{endpoint_id}/rotate-secret`
- `/webhooks/v1/endpoints/{endpoint_id}/test`
- `/webhooks/v1/endpoints/{endpoint_id}/deliveries`
- `/webhooks/v1/deliveries/{delivery_id}`
- `/webhooks/v1/deliveries/{delivery_id}/retry`
- `/webhooks/v1/usage`

The reviewed excerpt explicitly described `POST /webhooks/v1/endpoints`, `GET /webhooks/v1/event-types`, and `GET /webhooks/v1/usage` in prose; the remaining path names were confirmed from the same official spec inventory.

## Parameters and filtering notes
### Shared auth and path parameters confirmed in the reviewed specs
- The shared auth mechanism is an API key passed in the `Authorization` header.
- The index spec directly exposes path parameters including `id`, `type`, and `category` on examples such as `/nba/v1/teams/{id}`, `/nba/v1/season_averages/{type}`, and `/nba/v1/team_season_averages/{category}`.
- The webhooks spec uses `endpoint_id` and `delivery_id` path parameters.

### Webhook request fields explicitly documented
- Creating or updating an endpoint uses `url`, optional `description`, `event_types`, and optional `filters`.
- Webhook deliveries include signature headers `X-BDL-Webhook-Id`, `X-BDL-Webhook-Timestamp`, and `X-BDL-Webhook-Signature`.
- Signature verification is documented as `HMAC-SHA256(secret, "${timestamp}.${body}")`.

### Sport-data parameter note
- The reviewed `openapi.yml` is an index spec: it confirms the concrete path inventory and shared auth, but it delegates sport-specific query/filter parameters to the linked per-sport OpenAPI documents.
- In practice, callers need to consult the relevant per-sport spec for exact filters on games, odds, standings, player stats, injuries, and advanced metrics.

## Authentication and access notes
- The reviewed main and webhook specs both use API-key auth via `Authorization`.
- The webhooks spec explicitly says webhook API access requires the `ALL-ACCESS` subscription.
- The homepage positions free, per-sport paid, and all-access plans separately.

## Response, pagination, and error notes
- The reviewed specs are JSON/OpenAPI-first and describe JSON responses.
- The webhooks spec publishes a simple shared error schema with one `error` string field.
- The reviewed index spec did not expose one single cross-sport pagination section; pagination and filtering are delegated to the individual sport specs.
- Webhook endpoints can be auto-disabled after consecutive failed/exhausted deliveries according to the schema descriptions in the reviewed webhook spec.

## Usage notes from the official docs
- The main `openapi.yml` is intentionally an index and not the full schema body for every sport; it links out to separate OpenAPI files per sport/league.
- The homepage markets the platform as one API spanning 20+ sports/leagues plus separate products such as webhooks, StoryStats, Lab, and Picks.
- The homepage pricing grid reviewed in this run showed plan-dependent request caps, so fireROUTE should not assume a single universal quota.
- Webhooks are intended to replace polling for supported event types and include signing/verification guidance in the official spec.

## fireROUTE normalization notes
- Treat balldontlie as a multi-sport API platform rather than a single-league provider.
- Keep webhook-management routes separate from sport-data routes because they have their own quota, signing model, and subscription requirement.
- Preserve sport-specific route namespaces (`/nba/...`, `/nfl/...`, `/mlb/...`, `/epl/...`, etc.) instead of flattening them into one generic sports surface.
- When implementing a specific sport, pull query/filter details from that sport's linked OpenAPI file instead of inferring them from the top-level index spec alone.