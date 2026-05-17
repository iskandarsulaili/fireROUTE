# BlaBlaCar

## Provider metadata
- Category: `Transportation`
- Provider slug: `blablacar`
- Provider identity confirmed from reviewed official pages in this pass as: `BlaBlaCar`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://dev.blablacar.com/`
  - official alternative page: `https://www.blablacar.com/about-us`
  - additional official page attempted in this pass:
    - `https://support.blablacar.com/en-us/contact`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned developer host `https://dev.blablacar.com/` did not expose readable API documentation in this environment and failed with `net::ERR_HTTP_RESPONSE_CODE_FAILURE` in this pass.
- The official alternative page `https://www.blablacar.com/about-us` redirected to the official newsroom property `https://newsroom.blablacar.com/about-us` and loaded with title `About us - BlaBlaCar`.
- The reachable `About us` page was a corporate / newsroom page rather than a developer reference, and no route-level API contract was exposed there in this pass.
- An additional official support-page attempt to `https://support.blablacar.com/en-us/contact` failed with `net::ERR_ABORTED` before a readable API-related page became available.
- Across the reviewed official BlaBlaCar pages in this pass, I did not reach a trustworthy public developer portal or a readable API reference exposing a base URL, endpoint inventory, methods, parameters, authentication scheme, pagination model, rate-limit policy, or error schema.

## fireROUTE publication fields
- Assigned developer host reviewed: `https://dev.blablacar.com/`
- Official alternative reviewed: `https://www.blablacar.com/about-us`
- Additional official page attempted: `https://support.blablacar.com/en-us/contact`
- Provider API base URL: not safely confirmable from a readable official API reference in this pass.
- Endpoint paths: not safely confirmable from a readable official API reference in this pass.
- HTTP methods: not safely confirmable from a readable official API reference in this pass.
- Parameters: not safely confirmable from a readable official API reference in this pass.
- Authentication: not safely confirmable from a readable official API reference in this pass.
- Rate limits: not safely confirmable from a readable official API reference in this pass.
- Pagination: not safely confirmable from a readable official API reference in this pass.
- Errors and response-format notes: not safely confirmable from a readable official API reference in this pass.
- Important usage notes:
  - the historical developer host did not yield readable documentation here
  - the reachable official alternative was corporate / newsroom content rather than a developer reference

## Why this provider remains blocked
- I manually retried the assigned developer host and one official BlaBlaCar alternative page in this pass, plus one additional official support URL.
- The historical developer host failed, the reachable official alternative was only corporate newsroom content, and the support-page attempt did not yield a readable API reference.
- Because I could not reach a trustworthy readable public API contract from official sources, this provider remains `manual_blocked`.

## Sources inspected
- `https://dev.blablacar.com/`
- `https://www.blablacar.com/about-us`
- `https://support.blablacar.com/en-us/contact`
