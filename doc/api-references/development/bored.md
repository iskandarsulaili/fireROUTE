# Bored

## Provider metadata
- Category: `Development`
- Provider slug: `bored`
- Docs used manually:
  - `https://www.boredapi.com/`
  - `https://boredapi.com/`
- Confirmed API base URL: **not confirmable from official docs in this session**
- Primary media type: **not confirmable from official docs in this session**
- Authentication model: **not confirmable from official docs in this session**
- Manually confirmed routes in this pass: `0`

## Blocker summary
Both obvious official hostnames for the Bored API failed DNS resolution in this session:
- `https://www.boredapi.com/` -> `ERR_NAME_NOT_RESOLVED`
- `https://boredapi.com/` -> `ERR_NAME_NOT_RESOLVED`

Because both the indexed official URL and the obvious official hostname fallback were unreachable at the DNS layer, I could not manually verify any route paths, methods, parameters, authentication, pagination, rate limits, or response formats from official sources.

## Authentication and authorization
- not confirmable from official docs in this session
- I am intentionally not carrying forward community copies, mirrors, or unofficial clones as if they were the official API

## Endpoint inventory
No routes were manually confirmable from official documentation in this pass.

## Pagination
- not confirmable from official docs in this session

## Rate limits
- not confirmable from official docs in this session

## Error and response notes
- the only behavior I could confirm from the official hostnames in this session is DNS resolution failure (`ERR_NAME_NOT_RESOLVED`)

## Important usage notes
- treat this provider as unreachable for now
- revisit if the official domain returns or the maintainers publish a new official hostname
- do not substitute third-party clones without explicitly changing the provider definition

## Verification notes
This file was manually rebuilt from the official Bored API hostnames using browser inspection.