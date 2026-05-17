# Ciprand

## Provider metadata
- Category: `Development`
- Provider slug: `ciprand`
- Docs used manually:
  - `https://github.com/polarspetroll/ciprand`
  - attempted live service check: `https://ciprand.p3p.repl.co/api?len=20&count=2`
- Documented base URL from the official repository README: `https://ciprand.p3p.repl.co`
- Primary media type: JSON
- Authentication: none documented
- Manually confirmed routes in this pass: `1`

## Authentication
From the official repository README:
- no API key, OAuth flow, or auth header is documented
- the published example is a direct unauthenticated `curl` request

## Common request/response conventions
- Base URL documented in the README example: `https://ciprand.p3p.repl.co`
- reviewed API surface is a single query-parameter-driven endpoint under `/api`
- successful responses are JSON objects containing:
  - `Strings` - array of generated random strings
  - `Count` - number of returned strings
  - `Length` - string length used for generation
- the repository README also notes that the API sits behind a reverse proxy and that callers must pass the URL parameters

## Manually confirmed endpoint set

### 1) Generate random strings
- Method: `GET`
- Path: `/api`
- Full URL pattern: `https://ciprand.p3p.repl.co/api`
- Purpose: generate one or more random strings
- Query parameters confirmed in the official README:
  - `len` - length of generated strings; default `10`
  - `count` - number of random strings to generate; default `1`
- Response fields explicitly shown in the official example:
  - `Strings[]`
  - `Count`
  - `Length`
- Important usage notes from the official README:
  - the example call is `https://ciprand.p3p.repl.co/api?len=20&count=10`
  - the README says the service uses a reverse proxy and that URL parameters must be forwarded correctly

## Pagination
- none documented
- the number of generated items is controlled by `count`, not by page or cursor controls

## Rate limits
- the reviewed official repository page did not publish numeric rate limits

## Error and availability notes
- the official README does not publish an error schema or status-code table
- in this browser session, the documented live host `ciprand.p3p.repl.co` failed to resolve (`ERR_NAME_NOT_RESOLVED`)
- because the official repository still documents the route contract, the endpoint shape above is preserved, but live availability should be treated as currently blocked/unverified

## Important usage notes
- the only environment variable documented in the README is `PORT`, described as the listen port
- no alternate host, versioned path, or POST variant was documented on the reviewed official sources
- this provider currently looks more like a small single-endpoint utility service than a broader REST surface

## Verification notes
This file was manually rebuilt from the official Ciprand GitHub repository README, with an additional live check of the documented service host.