# UK Bank Holidays

## Provider metadata
- Category: `Calendar`
- Provider slug: `uk-bank-holidays`
- Docs used manually:
  - `https://www.gov.uk/bank-holidays.json`
- Confirmed base URL:
  - `https://www.gov.uk`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass: none
- Manually confirmed routes in this pass: `1`

## Authentication
- The official endpoint is publicly reachable and does not document any API key, OAuth flow, or custom auth header.

## Common request/response conventions
- The reviewed official source is a single JSON endpoint.
- The response is one top-level JSON object keyed by UK division.
- The top-level keys directly visible in the official response during this pass were:
  - `england-and-wales`
  - `scotland`
  - `northern-ireland`
- Each division object contains:
  - `division` - the division identifier string
  - `events` - an array of holiday objects
- The reviewed official response showed holiday-event fields:
  - `title`
  - `date`
  - `notes`
  - `bunting`

## Manually confirmed endpoint set

### 1) Retrieve UK bank holiday data for all supported divisions
- Method: `GET`
- Path: `/bank-holidays.json`
- Purpose: return bank-holiday calendars for England and Wales, Scotland, and Northern Ireland in one response
- Confirmed parameters: none
- Confirmed response notes:
  - JSON object keyed by division
  - each division object includes a `division` string and an `events` array
  - each event object includes `title`, `date`, `notes`, and `bunting`

## Pagination
- None. The reviewed official endpoint returns the full dataset in a single JSON document.

## Error handling
- The reviewed official source did not publish a separate error table or structured error schema.
- No alternate status-code documentation was visible from the reviewed endpoint page itself.

## Rate limits
- No published rate-limit or quota guidance was visible on the reviewed official source.

## Response format notes
- Dates are provided as ISO-style calendar-date strings such as `2019-01-01`.
- `notes` may be an empty string or contain text like `Substitute day`.
- `bunting` is a boolean flag.

## Important usage notes
- This API is a single-feed endpoint rather than a parameterized search API.
- Consumers need to filter by division or date range client-side after retrieving the response.

## Blockers / limitations
- The official source is essentially the JSON feed itself rather than a fuller human-written API guide, so auth, limits, and error details were not separately documented on the reviewed page.

## Verification notes
This file was manually rebuilt from the official GOV.UK bank-holidays JSON endpoint with browser inspection, replacing the earlier generated placeholder.
