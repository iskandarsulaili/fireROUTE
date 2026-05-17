# Code.gov

## Provider metadata
- Category: `Government`
- Provider slug: `code-gov`
- Assigned docs URL: `https://code.gov`
- Official docs/pages reviewed in this run:
  - `https://code.gov/`
  - `https://code.gov/about/`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official Code.gov pages in this run
- Authentication model: no public API authentication contract was published on the reviewed official pages in this run
- Response format: no route-level API response format was published on the reviewed official pages in this run
- Rate limits: no public API rate-limit policy was published on the reviewed official pages in this run
- Pagination: no public API pagination scheme was published on the reviewed official pages in this run
- Error format: no provider-owned API error schema was published on the reviewed official pages in this run
- Manually confirmed canonical route count: `0`

## What was confirmed from the official site
- `https://code.gov/` resolved during this review to the official Digital.gov resource `https://digital.gov/resources/requirements-for-achieving-efficiency-transparency-and-innovation-through-reusable-and-open-source-software/`.
- `https://code.gov/about/` resolved to that same official Digital.gov resource.
- The resolved official page title was `Requirements for achieving efficiency, transparency, and innovation through reusable and open source software | Digital.gov`.
- The reviewed official content was policy/program guidance about the Federal Source Code Policy rather than a route-level API reference.
- A direct link scan on the resolved official page found no `code.gov` or `api` links to continue route discovery from the current official surface.

## Why this remains blocked
- In the current official review, Code.gov behaved as a policy/program landing surface rather than a documented public API product.
- Because the reachable official content was policy guidance rather than interface documentation, no canonical base URL, endpoints, methods, parameters, auth model, pagination contract, rate limits, or error payloads can be confirmed safely for fireROUTE.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable from the reviewed official pages.
- Rate limits: not confirmable from the reviewed official pages.
- Pagination: not confirmable from the reviewed official pages.
- Errors: no provider-owned API error response was available to inspect because no route-level API surface was exposed.
- Format notes: no official machine-readable API response format or schema was published on the reviewed Code.gov pages.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until an official Code.gov property exposes a stable route-level API or developer reference.
- Do not normalize routes from policy prose alone.
