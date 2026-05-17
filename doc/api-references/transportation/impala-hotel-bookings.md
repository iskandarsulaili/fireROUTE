# Impala Hotel Bookings

## Provider metadata
- Category: `Transportation`
- Provider slug: `impala-hotel-bookings`
- Provider identity confirmed from the assigned row in this pass as: `Impala` booking API documentation
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://docs.impala.travel/docs/booking-api/`
  - official alternative page: `https://www.impala.travel/`
  - additional official page reviewed in this pass:
    - `https://impala.travel/`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned docs URL `https://docs.impala.travel/docs/booking-api/` failed in this environment with `net::ERR_NAME_NOT_RESOLVED`.
- The docs hostname therefore did not expose any readable booking API reference in this pass.
- The official company-domain alternative `https://www.impala.travel/` also failed before any readable documentation loaded; the browser returned `net::ERR_ABORTED`.
- The additional official root-domain retry `https://impala.travel/` failed separately with a page-navigation timeout.
- Because neither the assigned documentation host nor the official company-domain alternatives yielded a readable API reference, I could not safely confirm any provider-wide base URL, route inventory, HTTP methods, parameter model, authentication scheme, rate limits, pagination rules, error behavior, or response-format notes from official documentation in this pass.

## fireROUTE publication fields
- Provider API base URL: not safely confirmable from a readable official API reference in this pass.
- Endpoint paths: not safely confirmable from a readable official API reference in this pass.
- HTTP methods: not safely confirmable from a readable official API reference in this pass.
- Parameters: not safely confirmable from a readable official API reference in this pass.
- Authentication: not safely confirmable from a readable official API reference in this pass.
- Rate limits: not safely confirmable from a readable official API reference in this pass.
- Pagination: not safely confirmable from a readable official API reference in this pass.
- Errors and response-format notes: not safely confirmable from a readable official API reference in this pass.
- Important usage notes:
  - the assigned docs hostname was not reachable in this browser environment during this pass
  - the reviewed official company-domain alternatives also failed before exposing any readable booking API documentation

## Why this provider remains blocked
- I manually retried the assigned Impala docs URL and official company-domain alternatives in this pass.
- The docs hostname did not resolve, and the official company-domain pages did not load a readable booking API reference.
- Because no trustworthy official route-level documentation became accessible, this provider remains `manual_blocked`.

## Sources inspected
- `https://docs.impala.travel/docs/booking-api/`
- `https://www.impala.travel/`
- `https://impala.travel/`
