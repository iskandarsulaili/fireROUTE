# Bay Area Rapid Transit

## Provider metadata
- Category: `Transportation`
- Provider slug: `bay-area-rapid-transit`
- Provider identity confirmed from reviewed official pages in this pass as: `Bay Area Rapid Transit (BART)`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://api.bart.gov/`
  - official alternative page: `https://www.bart.gov/schedules/developers/api`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned official API host `https://api.bart.gov/` did not expose readable BART API documentation in this environment during this pass.
- In this pass, the assigned host rendered a browser error state whose visible title was `api-docs.pgamerx.com` and whose body said that `api-docs.pgamerx.com`'s server IP address could not be found.
- Because the assigned host did not surface a trustworthy BART-controlled documentation page in this pass, it could not be used as a route-level source.
- The official alternative page `https://www.bart.gov/schedules/developers/api` did load, but it stopped at Cloudflare bot protection instead of exposing API documentation.
- The readable title on the alternative page was `Just a moment...`.
- The readable body text on the alternative page included `Performing security verification` and stated that the website was verifying the browser before access.
- No readable BART route inventory, request examples, parameter tables, auth guidance, pagination notes, rate-limit notes, or error schemas were exposed on either reviewed official page in this pass.

## fireROUTE publication fields
- Intended provider docs host: `https://api.bart.gov/`
- Official alternative docs page reviewed: `https://www.bart.gov/schedules/developers/api`
- Provider API base URL: not safely confirmable from a readable official route reference in this pass.
- Endpoint paths: not publicly confirmed.
- HTTP methods: not publicly confirmed.
- Parameters or request bodies: not publicly confirmed.
- Authentication: not publicly confirmed from readable official documentation in this pass.
- Rate limits: not publicly confirmed.
- Pagination: not publicly confirmed.
- Errors: not publicly confirmed.
- Response formats: not publicly confirmed.
- Important usage notes:
  - the assigned BART API host did not surface a trustworthy BART documentation page in this environment during this pass
  - the official alternative page is still blocked by bot protection before any route-level documentation renders

## Why this provider remains blocked
- I manually retried the assigned official BART API host and one official BART alternative page in this pass.
- The assigned host did not yield a trustworthy readable BART documentation page, and the alternative page stopped at Cloudflare verification.
- Because no trustworthy readable BART endpoint inventory or request contract became available from official sources, this provider remains `manual_blocked`.

## Sources inspected
- `https://api.bart.gov/`
- `https://www.bart.gov/schedules/developers/api`
