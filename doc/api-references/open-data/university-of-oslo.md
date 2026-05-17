# University of Oslo

## Provider metadata
- Category: `Open Data`
- Provider slug: `university-of-oslo`
- Official docs/pages used:
  - `https://data.uio.no/`
  - `https://data.uio.no/studies/v1/`
  - live example requests from the official studies v1 page, including `courses`, `course/{code}`, and `course/{code}/semester/{semester}/messages`
- Canonical API base URL: `https://data.uio.no/studies/v1`
- Auth model: no authentication is required on the reviewed studies v1 routes
- Response format notes:
  - successful collection/item responses reviewed here return `application/json`
  - some error cases return plain text rather than JSON
- Rate-limit notes: no numeric public rate-limit policy was published on the reviewed official page
- Manually confirmed route count: `16`

## Canonical endpoints
1. `GET /courses`
2. `GET /semester/{semesterkode}/courses`
3. `GET /semesters/timeinterval/{from}/{to}/courses`
4. `GET /course/{emnekode}`
5. `GET /course/{emnekode}/semester/{semesterkode}`
6. `GET /course/{emnekode}/semester/{semesterkode}/messages`
7. `GET /course/{emnekode}/semester/{semesterkode}/schedule`
8. `GET /course/{emnekode}/semester/{semesterkode}/schedule/resources`
9. `GET /course/{emnekode}/semester/{semesterkode}/schedule/resources/fixed`
10. `GET /course/{emnekode}/semester/{semesterkode}/schedule/resources/lecture-videos`
11. `GET /course/{emnekode}/semester/{semesterkode}/exam`
12. `GET /programme/{programkode}`
13. `GET /programme/{programkode}/messages`
14. `GET /programme/{programkode}/option/{studieretningkode}`
15. `GET /programme/{programkode}/option/{studieretningkode}/messages`
16. `GET /sis/{sisElementer}`

## Confirmed parameters
### Shared/common query parameters from the official docs
- `lang` - requested language; documented values: `no`, `nn`, `en`
- `limit` - maximum number of returned items; docs say `0` means no limit
- `internal` - boolean flag for a full hierarchical/internal format on some routes; docs warn this format may change without notice

### Semester and time filters
- `semesterkode` - format `[årstall][h|v]`, for example `13h`, `14v`, or the special keyword `current`
- `from` / `to` - date or datetime bounds for the time-interval route; documented formats are `yyyy-MM-dd` or `yyyy-MM-ddThh:mm:ss`
- `term` - optional integer term selector on semester-course and semester-message routes; default `1`

### Message-route filters
- `sort` - documented values `publishedDate` or `modifiedDate`
- `allLang` - whether to fetch messages from all languages
- `publishedBefore` / `publishedAfter` - datetime filters for message publication time

### Path identifiers
- `emnekode` - valid UiO course code
- `programkode` - valid UiO programme code
- `studieretningkode` - valid programme-option/study-direction code
- `sisElementer` - SIS element composite identifier string

## Response and error notes
- Reviewed `GET /courses` returned HTTP `200`, `application/json`, and a JSON object containing a `courses` array.
- Reviewed `GET /course/EXPHIL03` returned HTTP `200`, `application/json`, and an object with `info` plus `metadata` fields.
- The `metadata` block on reviewed successful responses includes fields such as `count`, `limit`, `offset`, `status`, and `total`.
- The official docs explicitly state that invalid course-code lookups return HTTP `404`.
- Reviewed invalid lookup `GET /course/NOPE123` returned plain-text HTTP `404` with message `Not found: StudiesCourseInfoQuery(NOPE123,None)`.
- Reviewed `GET /course/EXPHIL03/semester/26v/messages?limit=1` returned a plain-text HTTP `504` timeout in this environment, which confirms that at least some heavier queries can fail with backend timeout text instead of a JSON error envelope.

## Pagination and filtering notes
- The official docs surface `limit` broadly, but they do not publish one provider-wide `offset` query parameter on the reviewed page.
- Successful JSON responses still expose `offset` inside the response `metadata`, so clients should expect metadata-driven paging/position information even where docs emphasize `limit`.
- Time-interval queries are half-open according to the official docs: `from` is inclusive and `to` is exclusive.

## Important usage notes
- The reviewed documentation page is written in Norwegian; parameter names and route structure are stable, but descriptive text and examples should be interpreted accordingly.
- Language selection is first-class through the shared `lang` parameter.
- The docs warn that `internal=true` exposes a fuller hierarchical structure whose format may change without notice.
- Semester identifiers are compact and provider-specific; adapters should preserve the native `semesterkode` format rather than trying to normalize it away.

## fireROUTE normalization notes
- Use `https://data.uio.no/studies/v1` as the canonical upstream base.
- Treat the University of Oslo studies API as a read-only `GET` surface with 16 documented routes.
- Preserve native parameter names such as `lang`, `limit`, `internal`, `term`, `sort`, `publishedBefore`, and `publishedAfter`.
- Expect mixed JSON/plain-text error handling depending on the backend failure mode.