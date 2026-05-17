# Hackerearth

## Provider metadata
- Category: `Programming`
- Provider slug: `hackerearth`
- Docs used manually:
  - `https://www.hackerearth.com/docs/wiki/developers/v4/`
  - `https://www.hackerearth.com/docs/wiki/developers/`
- Confirmed API base URL: **not confirmable from official docs in this session**
- Primary media type: **not confirmable from official docs in this session**
- Authentication model: **not confirmable from official docs in this session**
- Manually confirmed routes in this pass: `0`

## Blocker summary
Both official HackerEarth developer pages I tried in this session returned a plain `403 Forbidden` page instead of the API documentation:
- `https://www.hackerearth.com/docs/wiki/developers/v4/`
- `https://www.hackerearth.com/docs/wiki/developers/`

Because the official documentation was blocked at both the indexed page and the obvious official fallback page, I could not manually verify route paths, methods, parameters, authentication details, pagination, or rate limits from official sources in this pass.

## Authentication and authorization
- the category index says this provider exists under HackerEarth developer docs, but the official docs pages were inaccessible in this session
- I am therefore not carrying forward any unverified assumptions about auth headers, tokens, or OAuth flows

## Endpoint inventory
No routes were manually confirmable from official documentation in this pass because both official docs URLs returned `403 Forbidden`.

## Pagination
- not confirmable from official docs in this session

## Rate limits
- not confirmable from official docs in this session

## Error and response notes
- the only response behavior I could confirm from the official documentation hosts in this session is that both returned `403 Forbidden` HTML pages instead of API reference content

## Important usage notes
- treat this provider as blocked for now
- revisit when the official HackerEarth developer documentation becomes reachable without the current `403 Forbidden` response

## Verification notes
This file was manually rebuilt from official HackerEarth documentation URLs that were both inaccessible in this session.