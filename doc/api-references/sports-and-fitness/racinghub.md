# RacingHub

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `racinghub`
- Official docs/pages used:
  - `https://racinghub.net/api/v1/docs#/`
  - `https://racinghub.net/api/v1/openapi.json` (fetched from the official Swagger page)
- Current public API base URL: `https://racinghub.net/api/v1`
- Auth model: no authentication documented in the reviewed Swagger UI or OpenAPI document
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published in the reviewed docs
- Manually confirmed route count: `24`

## Authentication and access
- The reviewed OpenAPI document does not define a security scheme or global security requirement.
- All reviewed operations are documented as public `GET` endpoints.
- The docs describe the API as an open-source Formula 1 historical-data service powered by the F1DB project.

## Canonical endpoints
### Drivers
1. `GET /drivers` - paginated driver directory
2. `GET /drivers/{driver_id}` - driver profile by reference ID
3. `GET /drivers/{driver_id}/results` - paginated race results for one driver
4. `GET /drivers/{driver_id}/seasons` - season history for one driver

### Constructors
5. `GET /constructors` - paginated constructor directory
6. `GET /constructors/{constructor_id}` - constructor profile by reference ID
7. `GET /constructors/{constructor_id}/seasons` - season history for one constructor

### Races
8. `GET /races` - paginated race directory
9. `GET /races/{race_id}` - race detail by race ID
10. `GET /races/{race_id}/results` - full race classification
11. `GET /races/{race_id}/starting-grid` - starting grid for one race
12. `GET /races/{race_id}/qualifying-results` - qualifying classification for one race
13. `GET /races/{race_id}/sprint-results` - sprint classification for one race
14. `GET /races/{race_id}/sprint-starting-grid` - sprint starting grid for one race
15. `GET /races/{race_id}/fastest-lap` - fastest-lap result for one race
16. `GET /races/{race_id}/pit-stops` - pit-stop records for one race

### Seasons
17. `GET /seasons` - paginated season directory
18. `GET /seasons/{year}` - season detail by championship year
19. `GET /seasons/{year}/drivers` - drivers participating in a season
20. `GET /seasons/{year}/constructors` - constructors participating in a season
21. `GET /seasons/{year}/races` - race calendar for a season

### Standings and health
22. `GET /standings/{year}/drivers` - final driver standings for a season
23. `GET /standings/{year}/constructors` - final constructor standings for a season
24. `GET /health` - API health check

## Parameters and path notes
### Shared pagination parameters
- `page` - optional page number on paginated collection routes; minimum `1`, default `1`
- `limit` - optional page size on paginated collection routes; minimum `1`, maximum `100`; default `100` on `/drivers`, `/drivers/{driver_id}/results`, and `/constructors`, and default `1` on `/seasons` and `/races`

### Driver-directory filters
- `order_by` - optional driver sort field on `GET /drivers`; documented enum values are `name`, `date_of_birth`, `total_championship_wins`, `total_championship_points`, `total_race_wins`, `total_podiums`, `total_points`, `total_pole_positions`, and `total_fastest_laps`
- `sort_by` - optional sort direction on `GET /drivers`; documented values are `asc` and `desc`
- `q` - optional name search on `GET /drivers`

### Path parameters
- `driver_id` - driver reference such as `hamilton` or `verstappen`
- `constructor_id` - constructor/team reference ID
- `race_id` - race identifier used by the service
- `year` - Formula 1 season year

## Response, pagination, and error notes
- The paginated schemas shown in the OpenAPI document include `data`, `page`, `limit`, `total`, `total_pages`, `has_next`, and `has_previous`.
- Detail routes return object payloads, while collection routes return paginated envelopes.
- The reviewed OpenAPI document publishes `404` responses for missing driver and constructor detail/history resources.
- Many routes publish `422` responses for invalid path or query inputs.
- The docs and OpenAPI document are JSON-centric; no XML or alternate transport was documented.

## Usage notes from the official docs
- The Swagger page describes the dataset as spanning `1950` to the present.
- The docs state that the project is independent and not affiliated with or endorsed by Formula 1®.
- The official docs link to the `MIT License` and identify the upstream open-source source as F1DB.

## fireROUTE normalization notes
- Model this provider as a public read-only JSON API rooted at `https://racinghub.net/api/v1`.
- Preserve the separate driver, constructor, race, season, and standings resource families; the official docs expose them as distinct route groups.
- Preserve page and limit parameters exactly, including the unusual default `limit=1` on the seasons and races collection endpoints.
- Map `404` and `422` distinctly in downstream adapters because the OpenAPI document documents both conditions.