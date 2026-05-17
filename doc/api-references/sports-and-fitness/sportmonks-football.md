# Sportmonks Football

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `sportmonks-football`
- Official docs/pages used:
  - `https://docs.sportmonks.com/v3`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints`
  - `https://docs.sportmonks.com/v3/welcome/authentication`
  - `https://docs.sportmonks.com/v3/api/rate-limit`
  - `https://docs.sportmonks.com/v3/api/meta-description`
  - `https://docs.sportmonks.com/v3/api/syntax`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures/get-all-fixtures`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures/get-fixture-by-id`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/livescores/get-inplay-livescores`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/leagues/get-league-by-id`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/teams/get-team-by-id`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/standings/get-standings-by-season-id`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/news/get-pre-match-news`
  - `https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/commentaries/get-commentaries-by-fixture-id`
- Current public API base URL: `https://api.sportmonks.com/v3/football`
- Auth model:
  - The official auth page says every API requires authentication.
  - The docs explicitly allow either `api_token` in the query string or an `Authorization` header carrying the token value.
- Response format: JSON.
- Public rate-limit note:
  - The official rate-limit page says limits are per entity, not per endpoint.
  - Published hourly caps reviewed in this run: `Starter 2000`, `Growth 2500`, `Pro 3000`, `Enterprise 5000` API calls per entity per hour.
  - Exceeding the cap returns `429 Too Many Requests`.
  - The reset window is one hour from the first request to that entity.
- Manually confirmed route count: `149` public `GET` routes listed on the official Football API 3.0 endpoints index

## Canonical endpoints

### Route families confirmed from the official endpoints index
- Livescores: `3`
- Fixtures: `12`
- States: `2`
- Types: `3`
- Leagues: `8`
- Seasons: `4`
- Statistics: `3`
- Schedules: `3`
- Stages: `4`
- Rounds: `4`
- Standings: `5`
- Topscorers: `2`
- Teams: `5`
- Players: `5`
- Team Squads: `3`
- Match Facts (beta): `4`
- Team Rankings (beta): `3`
- Team of the Week (TOTW) (beta): `3`
- Coaches: `5`
- Referees: `5`
- Transfers: `6`
- Transfer Rumours: `5`
- Venues: `4`
- TV Stations: `3`
- Expected (xG): `2`
- Premium Expected Lineups: `2`
- Predictions: `5`
- Standard Odds Feed - Pre-match Odds: `5`
- Standard Odds Feed - Inplay Odds: `5`
- Premium Odds Feed - Pre-match Odds: `7`
- Markets: `4`
- Bookmakers: `6`
- News: `5`
- Rivals: `2`
- Commentaries: `2`

### Representative concrete paths directly inspected in the official endpoint pages
- `GET /livescores/inplay`
- `GET /fixtures`
- `GET /fixtures/{ID}`
- `GET /leagues/{ID}`
- `GET /teams/{ID}`
- `GET /standings/seasons/{ID}`
- `GET /news/pre-match`
- `GET /commentaries/fixtures/{ID}`

### Official endpoint names shown on the index page
The reviewed index explicitly lists these route names, which together sum to the `149` confirmed `GET` routes above:
- Livescores: `GET Inplay Livescores`, `GET All Livescores`, `GET Latest Updated Livescores`
- Fixtures: `GET All Fixtures`, `GET Fixture by ID`, `GET Fixtures by Multiple IDs`, `GET Fixtures by Date`, `GET Fixtures by Date Range`, `GET Fixtures by Date Range for Team`, `GET Fixtures by Head To Head`, `GET Fixtures by Search by Name`, `GET Upcoming Fixtures by Market ID`, `GET Upcoming Fixtures by TV Station ID`, `GET Past Fixtures by TV Station ID`, `GET Latest Updated Fixtures`
- Leagues: `GET All Leagues`, `GET League by ID`, `GET Leagues by Live`, `GET Leagues by Fixture Date`, `GET Leagues by Country ID`, `GET Leagues Search by Name`, `GET All Leagues by Team ID`, `GET Current Leagues by Team ID`
- Teams / Players / Standings examples from the same index: `GET All Teams`, `GET Team by ID`, `GET Teams by Country ID`, `GET Teams by Season ID`, `GET Teams by Search by Name`, `GET All Players`, `GET Player by ID`, `GET Players by Country ID`, `GET Players by Search by Name`, `GET Last Updated Players`, `GET All Standings`, `GET Standings by Season ID`, `GET Standings by Round ID`, `GET Standing Correction by Season ID`, `GET Live Standings by League ID`
- Premium and auxiliary examples from the same index: `GET All Odds`, `GET All Inplay Odds`, `GET All Premium Odds`, `GET All Markets`, `GET All Bookmakers`, `GET Pre-Match News`, `GET Post-Match News`, `GET All Rivals`, `GET All Commentaries`

## Parameters and filtering notes
### Shared parameters explicitly documented on the reviewed endpoint pages
- `api_token` - required unless the token is supplied in the `Authorization` header.
- `include` - include related entities, for example `&include=participants;events`.
- `select` - select base-entity fields only.
- `sortBy` - sort by supported base-entity fields.
- `filters` - entity-specific filter syntax.
- `locale` - translate name fields in supported languages.

### Syntax and nested-include rules from the official syntax page
- `&select=` chooses fields on the base entity.
- `&include=` includes relations.
- `;` separates include chains, for example `&include=lineups;events`.
- `:` selects fields inside an include, for example `&include=events:player_name,minute`.
- `,` separates multiple IDs or fields, for example `&filters=eventTypes:14,18`.
- The syntax page warns that invalid field names, relations, or separators can trigger `400 Bad Request`.

### Filters and pagination explicitly shown on the reviewed fixtures pages
- The fixtures docs expose the shared filter-helper endpoint `https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN`.
- `GET /fixtures` explicitly documents pagination with:
  - `order` (`asc` or `desc`)
  - `per_page` (default `25`, max `50`)
  - `page`
  - `has_more` as the propagation signal in the response flow
- The reviewed `GET /fixtures` and `GET /fixtures/{ID}` pages show endpoint-specific filters such as `participantSearch`, `todayDate`, `venues`, `Deleted`, `IdAfter`, `markets`, `bookmakers`, `WinningOdds`, `fixturestatisticTypes`, and `eventTypes`.
- The reviewed fixtures pages state an include-depth cap of `3` nested includes.

## Authentication and access notes
- Tokens are created in MySportmonks according to the auth page.
- Tokens do not expire automatically; the docs say they stay valid until manually deleted.
- The auth page explicitly notes that query-param auth and header auth count toward the same rate limits.
- `403 Forbidden` is documented for attempts to access a feed not included in the active plan.

## Response, pagination, and error notes
- The reviewed docs are JSON-first and every reviewed endpoint page showed JSON example responses.
- The official auth page documents these common response codes: `200`, `400`, `401`, `403`, `429`, `500`.
- The official meta-description page says the response `meta.rate_limit` object exposes:
  - `requested_entity`
  - `remaining`
  - `resets_in_seconds`
- Pagination is endpoint-dependent rather than universal; the reviewed `GET /fixtures` page is paginated, while the reviewed `GET /fixtures/{ID}` page is not.

## Usage notes from the official docs
- The endpoints page describes itself as the consolidated overview of all Football API 3.0 endpoints.
- The same page says the official Postman collection is complete and always up to date.
- The official docs mix standard football data with premium/beta surfaces such as match facts, team rankings, TOTW, expected goals, expected lineups, multiple odds feeds, news, rivals, and commentaries.
- The rate-limit page repeatedly emphasizes optimizing requests with includes, caching reference data, and smart polling because limits are per entity bucket.

## fireROUTE normalization notes
- Treat Sportmonks Football as a large authenticated football-data platform, not a small public unauthenticated feed.
- Preserve the official family split between core football data, premium odds feeds, premium expected-lineup surfaces, news, and commentary-style add-ons.
- Preserve the docs' per-entity rate-limiting model; fireROUTE should not collapse this into one global quota assumption.
- Keep query parameter names exactly as documented (`include`, `select`, `sortBy`, `filters`, `locale`, `per_page`, `page`, `order`).