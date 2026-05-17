# Random Useless Facts

## Manual review status
- Category: Entertainment
- Official docs reviewed: `https://uselessfacts.jsph.pl/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `2`

## API overview
- Base URL: `https://uselessfacts.jsph.pl`
- Base API prefix: `/api/v2/facts`
- Authentication: none documented
- Response formats: `application/json` by default, or `text/plain` when requested with the `Accept` header

## Confirmed endpoints
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v2/facts/random` | optional `language` query parameter | Returns a random useless fact. |
| GET | `/api/v2/facts/today` | optional `language` query parameter | Returns the fact of the day. |

## Parameters and format details
- `language` supports the documented values `en` and `de`
- The docs show the example `GET /api/v2/facts/random?language=en`
- Supported response content types are:
  - `application/json` (default)
  - `text/plain`

## Pagination, errors, and versioning notes
- Pagination: not documented
- Rate limits: not documented
- API v1 is deprecated; the docs say the server responds with `308` and a `Location` header pointing to the v2 target URL
- The docs advise clients to follow and cache the redirect when hitting v1 endpoints

## Important usage notes
- The site presents the API as a simple public HTTP API for useless facts
- The official documentation only exposes the two v2 fact endpoints above during this review

## Sources inspected
- `https://uselessfacts.jsph.pl/`
