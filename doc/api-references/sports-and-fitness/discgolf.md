# DiscGolf

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `discgolf`
- Official docs/pages used:
  - `https://discgolfapi.com/docs/`
- Current public API base URL: `https://io.discgolfapi.com/v1`
- Auth model: no authentication required for the reviewed public endpoints
- Response format: JSON
- Public rate-limit note: the reviewed docs publish fair-use guidance but no numeric quota
- Manually confirmed route count: `6`

## Authentication and access
- The official docs explicitly say public endpoints do not require an API key.
- The docs position the API as structured course data for maps, directories, apps, tools, and research.
- A separate `POST /report` route is provided for reporting bad or missing course data.

## Canonical endpoints
1. `GET /courses` - list courses, with filtering and pagination
2. `GET /courses/{id}` - fetch one course by public ID
3. `GET /countries` - list countries represented in the API
4. `GET /regions` - list regions represented in the API
5. `GET /updates/recent` - recent data updates
6. `POST /report` - report missing, outdated, or incorrect course data

## Parameters and filters
### Query parameters for `GET /courses`
- `country` - filter by country code
- `region` - filter by region code where supported
- `limit` - positive integer page size
- `offset` - zero-or-positive record skip for pagination

### Path parameters
- `id` - stable public course identifier

## Response, pagination, and error notes
- The docs show paginated course-list responses with `count`, `total`, `offset`, and `courses` fields.
- Single-course records expose fields such as `id`, `name`, `country_code`, `region_code`, `holes`, `confidence_score`, and `verification_strength`.
- The docs include explicit `Errors` and `Fair use` sections, but no numeric rate-limit value is published in the visible page excerpt.
- Responses are JSON-based.

## Usage notes from the official docs
- The quick-start example requests `GET https://io.discgolfapi.com/v1/courses?country=GB&limit=5`.
- The docs describe the records as structured display data rather than reviews or rankings.
- `verification_strength` is documented as a human-readable confidence bucket such as `low`, `medium`, or `high`.

## fireROUTE normalization notes
- Normalize this provider as a public JSON API rooted at `/v1`.
- Preserve `country`, `region`, `limit`, and `offset` as first-class controls on the course-list route.
- Treat `/countries` and `/regions` as discovery endpoints that support valid filter construction for `/courses`.