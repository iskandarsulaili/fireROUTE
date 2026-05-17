# FBI Wanted

## Provider metadata
- Category: `Government`
- Provider slug: `fbi-wanted`
- Official docs/pages used:
  - `https://www.fbi.gov/wanted/api` (legacy official docs URL; blocked by Cloudflare verification in this environment)
  - `https://api.fbi.gov/docs` (official Swagger UI)
  - `https://api.fbi.gov/openapi.json` (official OpenAPI document linked from the Swagger UI)
- Current public API base URL: `https://api.fbi.gov`
- Auth model: no authentication requirement is documented in the official Swagger for the wanted endpoints
- Response format: JSON
- Rate limits: no public rate-limit policy was exposed on the official pages used here
- Manually confirmed route count: `2`

## Access notes
- The legacy FBI page at `www.fbi.gov/wanted/api` was not directly usable from this environment because it presented a Cloudflare bot-verification interstitial.
- The official `api.fbi.gov` Swagger UI remained accessible and documented the same wanted API directly, so the endpoint inventory below is taken from that official source.

## Canonical endpoints
### Wanted listings
1. `GET /@wanted`
   - Official summary: get listing of wanted people
   - Official aliases documented in the OpenAPI description:
     - `https://api.fbi.gov/wanted`
     - `https://api.fbi.gov/wanted/v1`
     - `https://api.fbi.gov/wanted/v1/list`
     - `https://api.fbi.gov/wanted/list`

### Wanted-person detail
2. `GET /@wanted-person/{id}`
   - Official summary: retrieve information on a wanted person
   - Official backward-compatible alias documented in the OpenAPI description:
     - `https://api.fbi.gov/wanted/v1/object/{id}`

## Parameters
### `GET /@wanted` query parameters
The official Swagger lists all of these as optional:
- `title` - filter by title text
- `field_offices` - FBI field office filter
- `person_classification` - person classification filter
- `poster_classification` - poster classification filter
- `status` - status filter
- `height_min` - minimum height filter
- `height_max` - maximum height filter
- `weight_min` - minimum weight filter
- `weight_max` - maximum weight filter
- `sex` - sex filter
- `race` - race filter
- `build` - build filter
- `eyes` - eye-color filter
- `hair` - hair-color filter
- `age_min` - minimum age filter
- `age_max` - maximum age filter
- `possible_countries` - possible-country filter
- `possible_states` - possible-state filter
- `reward_min` - minimum reward filter
- `reward_max` - maximum reward filter
- `pageSize` - integer page size, default `20`, must be greater than `0`
- `page` - integer page number, default `1`, must be greater than `0`
- `sort_order` - `asc` or `desc`, default `desc`
- `sort_on` - `publication`, `modified`, or `_score`, default `modified`

### `GET /@wanted-person/{id}` path parameter
- `id` - required wanted-person identifier

## Response notes
### List endpoint response
The OpenAPI document defines `WantedResultSet` with:
- `total` - total matching records
- `page` - current page number
- `items[]` - array of `WantedPerson` objects

### Wanted-person object fields explicitly defined in the schema
The official `WantedPerson` schema includes fields such as:
- `uid`
- `title`
- `description`
- `status`
- `publication`
- `modified`
- `person_classification`
- `poster_classification`
- `field_offices[]`
- `files[]`
- `images[]`
- `age_min`, `age_max`
- `height_min`, `height_max`
- `weight_min`, `weight_max`
- `sex`, `race`, `hair`, `eyes`, `build`, `complexion`
- `possible_countries[]`, `possible_states[]`
- `reward_min`, `reward_max`, `reward_text`
- `dates_of_birth_used[]`
- `aliases[]` are not separately modeled in the published schema used here, but related identity fields such as `title`, `uid`, `place_of_birth`, `nationality`, and `remarks` are
- `warning_message`, `caution`, `details`, `additional_information`
- `path`, `pathId`

## Error notes
- The OpenAPI spec documents `422 Validation Error` for both wanted endpoints.
- The accessible official wanted API docs used here do not publish a separate shared rate-limit or error-code table.

## Usage notes
- The wanted API published in Swagger is read-only; both manually confirmed routes are `GET` operations.
- The official Swagger exposes only two wanted-related paths, with multiple backward-compatible aliases for the list and detail endpoints.
- The `page` and `pageSize` parameters provide straightforward list pagination.

## fireROUTE normalization notes
- Normalize the alias family for the listing route to one canonical operation rooted at `GET /@wanted`.
- Normalize the detail route to `GET /@wanted-person/{id}` while preserving the documented legacy alias `/wanted/v1/object/{id}` for compatibility.
- Treat this provider as a simple public JSON search/detail API with no documented auth handshake.
