# Cooper Hewitt

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://collection.cooperhewitt.org/api/`
  - `https://collection.cooperhewitt.org/api/methods/`
  - `https://collection.cooperhewitt.org/api/formats/`
  - `https://collection.cooperhewitt.org/api/methods/cooperhewitt.search.objects`
- Manual review outcome: `manually_documented`
- Confirmed route count: `84`

## API overview
- Base URL: `https://api.collection.cooperhewitt.org/rest/`
- Transport pattern:
  - the reviewed docs say API requests are made by passing query parameters to `/rest/`
  - reviewed method pages document `GET` requests
  - each operation is selected with the `method` query parameter rather than with separate REST paths
- Authentication:
  - `access_token` is required on reviewed method pages
  - the intro page says the fastest path is creating an access token for yourself
  - the same page says applications for other Cooper Hewitt account holders should start by creating an API key
  - the intro page documents OAuth2 usage for applications and says supported flows are limited to implicit-grant style tokens with a fixed callback URL
- Response formats:
  - default `json`
  - optional `jsonp`
  - optional `dson`
- Pagination:
  - reviewed search docs expose `page` and `per_page`
  - `page` default: `1`
  - `per_page` default: `100`
  - `per_page` maximum: `500`
- Rate limits:
  - no numeric public rate-limit quota was published on the reviewed pages

## Confirmed endpoint model
| Method | Path | Required parameters | Notes |
|---|---|---|---|
| GET | `/rest/` | `method`, `access_token` | All reviewed API operations are dispatched through this single endpoint using a method-name query parameter. |

## Confirmed operation inventory
- The official methods index exposes `84` unique documented method names under the single `/rest/` endpoint.
- Reviewed method families visible on the official methods page include:
  - `api.spec.*`
  - `api.test.*`
  - `cooperhewitt.cafe.*`
  - `cooperhewitt.colors.palettes.*`
  - `cooperhewitt.departments.*`
  - `cooperhewitt.emoji.timeline.*`
  - `cooperhewitt.exhibitions.*`
  - `cooperhewitt.galleries.*`
  - `cooperhewitt.labs.*`
  - `cooperhewitt.objects.*`
  - `cooperhewitt.objects.locations.rooms.*`
  - `cooperhewitt.objects.locations.sites.*`
  - `cooperhewitt.objects.locations.spots.*`
  - `cooperhewitt.objects.tags.*`
  - `cooperhewitt.objects.traces.*`
  - `cooperhewitt.people.*`
  - `cooperhewitt.people.relationships.*`
  - `cooperhewitt.periods.*`
  - `cooperhewitt.roles.*`
  - `cooperhewitt.search.*`
  - `cooperhewitt.shoebox.items.*`
  - `cooperhewitt.shop.brands.*`
  - `cooperhewitt.shop.items.*`
  - `cooperhewitt.types.*`
  - `cooperhewitt.videos.*`
  - `cooperhewitt.visits.*`
  - `cooperhewitt.visits.items.*`

## Confirmed common parameters
### Global transport parameters
- `method`: selects the documented operation name
- `access_token`: required OAuth2 access token
- `format`: optional response format; supported values shown on the reviewed pages are `json`, `jsonp`, and `dson`
- `callback`: required only for JSONP responses

### Search and list behavior directly confirmed from `cooperhewitt.search.objects`
- `query`: full-text object search
- field-specific filters include `accession_number`, `color`, `department_id`, `description`, `on_display`, `display_date`, `exhibition`, `exhibition_id`, `has_images`, `has_no_known_copyright`, `justification`, `location`, `woe_id`, `medium`, `medium_id`, `period`, `period_id`, `person`, `person_id`, `role`, `role_id`, `person_role_id`, `tag`, `tag_id`, `title`, `type`, `type_id`
- numeric/range filters include `year_acquired`, `year_end`, `year_start`, `width`, `height`, `depth`, `longestside`, `shortestside`
- pagination parameters include `page` and `per_page`

## Response, pagination, and error notes
- The official formats page says `json` is the default response type.
- The same page documents JSONP callback wrapping and DSON serialization.
- The reviewed pages did not publish one centralized HTTP error table.
- The methods catalog explicitly includes `api.test.error`, which confirms the API has a documented error-test surface, but the reviewed pages did not attach a numeric status-code matrix to the global overview.

## Important usage notes
- The search method page warns that access tokens appear in request URLs, so they should not be copied into places where others can read them.
- The same page explicitly says requests should use `https://`, not plain `http://`.
- Because the API is method-dispatched through a query parameter instead of separate REST paths, fireROUTE should preserve the provider's native `method` model rather than invent synthetic path routes.

## Sources inspected
- `https://collection.cooperhewitt.org/api/`
- `https://collection.cooperhewitt.org/api/methods/`
- `https://collection.cooperhewitt.org/api/formats/`
- `https://collection.cooperhewitt.org/api/methods/cooperhewitt.search.objects`
