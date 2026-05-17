# Yes No

## Provider metadata
- Category: `Test Data`
- Provider slug: `yes-no`
- Docs used manually:
  - `https://yesno.wtf/` (official homepage API panel)
  - `https://yesno.wtf/api`
- Confirmed API base URL: `https://yesno.wtf`
- Primary media type: JSON
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the official Yes No site and API panel:
- no API key, OAuth flow, or account setup is documented
- the endpoint is presented as a public GET API

## Common request/response conventions
- Base URL: `https://yesno.wtf`
- reviewed API surface uses `GET`
- responses are JSON objects
- the official example response contains:
  - `answer`
  - `forced`
  - `image`

## Manually confirmed endpoint set

### 1) Return a yes/no/maybe decision
- Method: `GET`
- Path: `/api`
- Full URL: `https://yesno.wtf/api`
- Purpose: return a random or forced yes/no-style answer, along with a GIF image URL
- Query parameters confirmed in the official API panel:
  - `force` - optional string; allowed values documented as `yes`, `no`, or `maybe`
- Response fields confirmed in the official example:
  - `answer` - answer string such as `yes`
  - `forced` - boolean indicating whether a forced answer was used
  - `image` - GIF URL representing the answer
- Important usage notes from the official site:
  - the site says it returns `{"answer":"maybe"}` every `10,000` times to add randomness
  - without `force`, the result is presented as the normal foolproof decision response

## Pagination
- none documented

## Rate limits
- no published rate limits or quota windows were shown on the reviewed official pages

## Error and response notes
- the reviewed official API panel did not publish a dedicated error-schema table
- the documented happy-path response is a single JSON object with `answer`, `forced`, and `image`

## Important usage notes
- `force` is the only documented request parameter
- the official docs treat the API as a lightweight public endpoint suitable for embedding in apps
- the response includes an image URL, so consumers may want to surface both text and media

## Verification notes
This file was manually rebuilt from the official Yes No homepage API panel and the live `/api` endpoint using browser inspection.