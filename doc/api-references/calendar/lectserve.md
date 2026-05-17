# LectServe

## Provider metadata
- Category: `Calendar`
- Provider slug: `lectserve`
- Official docs used manually:
  - `https://www.lectserve.com/html/about`
  - `https://www.lectserve.com/today`
  - `https://www.lectserve.com/sunday`
  - `https://www.lectserve.com/date/2016-12-25`
- Confirmed API base URL: `https://www.lectserve.com`
- Primary response/content types confirmed in this pass: JSON on API routes, HTML on documentation pages
- Authentication model confirmed from the reviewed official docs: none
- Manually confirmed routes in this pass: `3`

## Authentication and common behavior
- The reviewed official docs do not mention API keys, bearer tokens, OAuth, cookies, or signed-request requirements for the JSON endpoints.
- The official about page states that all endpoints return JSON.
- The docs say each endpoint can accept `lect=acna` or `lect=rcl` to select the Sunday / red-letter lectionary.
- The docs say `/today` and `/date/{yyyy-mm-dd}` can also accept `dailyLect=acna-sec` or `dailyLect=acna-xian` for daily-office selection.
- Documentation nuance: the about page says `/today` is relative to the US Central Time Zone, while the documentation page for aliases says alias routes determine timezone from the caller IP and can be overridden with `tz` using an IANA timezone name such as `Europe/Moscow`.

## Confirmed API surface

### 1) Get today's lectionary payload
- Method: `GET`
- Path: `/today`
- Full URL: `https://www.lectserve.com/today`
- Purpose: return the lectionary payload for the current day
- Optional query parameters documented in this pass:
  - `lect` - `acna` or `rcl`
  - `dailyLect` - `acna-sec` or `acna-xian`
  - `tz` - timezone override for alias resolution, documented with IANA names
- Observed response shape in this pass: JSON object with top-level `sunday`, `daily`, and `red_letter` sections

### 2) Get the upcoming Sunday lectionary
- Method: `GET`
- Path: `/sunday`
- Full URL: `https://www.lectserve.com/sunday`
- Purpose: return the Sunday-only payload for the upcoming Sunday relative to "today"
- Optional query parameters documented in this pass:
  - `lect` - `acna` or `rcl`
- Observed response shape in this pass: a single JSON lectionary object

### 3) Get lectionary data for a specific date
- Method: `GET`
- Path: `/date/{yyyy-mm-dd}`
- Full URL: `https://www.lectserve.com/date/{yyyy-mm-dd}`
- Purpose: return the lectionary payload for a specific requested date
- Path parameter:
  - `yyyy-mm-dd` - four-digit year, two-digit month, two-digit day with dashes between units
- Optional query parameters documented in this pass:
  - `lect` - `acna` or `rcl`
  - `dailyLect` - `acna-sec` or `acna-xian`
- Official example: `https://www.lectserve.com/date/2016-12-25`
- Observed response shape in this pass: JSON object with `sunday`, `daily`, and `red_letter` sections

## Pagination
- No pagination mechanism was documented on the reviewed official pages.
- The reviewed API routes are direct single-date or single-period lookups and do not document paging parameters.

## Rate limits
- No numeric quota, throttling policy, or rate-limit headers were published on the reviewed official pages.
- Because the official docs do not publish a formal rate-limit contract, any production fireROUTE adapter should assume limits are undocumented and apply conservative retry behavior.

## Error handling
- The reviewed official docs do not publish a formal error-code table.
- In this manual pass, valid reviewed endpoints returned JSON successfully.
- In this manual pass, requesting an invalid date path (`/date/not-a-date`) produced HTTP `500` with an HTML error page rather than a documented JSON error contract.
- Because the provider does not publish a stable error schema in the reviewed docs, downstream integrations should treat non-200 responses as loosely specified.

## Response format notes
- The official docs state the API returns JSON.
- Human-facing documentation pages live under `/html/...`, while API routes live at the site root.
- `/today` and `/date/{yyyy-mm-dd}` return composite data that includes Sunday, daily, and red-letter sections.
- `/sunday` returns only the Sunday lectionary payload.

## Important usage notes
- The default lectionaries described on the about page are ACNA Sunday and ACNA Daily (civil-based).
- The docs explicitly support both the ACNA and Revised Common Lectionary for Sundays and red-letter days.
- The root docs URL from the category index was non-specific; the current official documentation page is `https://www.lectserve.com/html/about`.
- If timezone-sensitive alias behavior matters, test both default behavior and explicit `tz` overrides because the reviewed official pages describe timezone handling in two slightly different ways.

## Verification notes
This file was manually rebuilt from LectServe's current official about/documentation page plus live JSON endpoint responses from the provider.
