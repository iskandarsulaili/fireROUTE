# Codeforces

## Provider metadata
- Category: `Programming`
- Provider slug: `codeforces`
- Docs used manually:
  - `https://codeforces.com/apiHelp`
  - `https://codeforces.com/api/user.info?handles=tourist`
- Confirmed API base URL from the live official endpoint: `https://codeforces.com/api`
- Primary media type confirmed from the live endpoint: JSON
- Authentication model: **blocked / not fully confirmable in this session**
- Manually confirmed routes in this pass: `1`

## Blocker summary
The official API documentation page at `https://codeforces.com/apiHelp` did not render the API reference in this browser session. It returned a Cloudflare security-verification interstitial (`Just a moment...` / `Performing security verification`) instead of the route documentation.

As the required official alternative page, I checked a live official API endpoint directly. That official endpoint responded successfully, which let me confirm the base URL, a real route path, and the public JSON envelope shape below. However, because the docs page itself was bot-blocked, I could not responsibly claim the full route catalog, auth model, or quota policy from official documentation in this pass.

## Authentication and authorization
- the indexed provider row says `apiKey`, but the official docs page that should explain this was blocked in this session
- I therefore could **not** verify whether the currently working public endpoint I tested requires signing, optional keying, or no auth for all or only some methods
- do not assume the absence of auth requirements globally from the single public route tested below

## Common request/response conventions confirmed from the live official endpoint
- Base URL: `https://codeforces.com/api`
- successful responses use a top-level JSON envelope with:
  - `status`
  - `result`
- the tested successful response returned `"status":"OK"`
- the `result` field was a JSON array of user objects for the requested handles

## Manually confirmed endpoint set
1. `GET /user.info`
   - Full URL pattern confirmed: `https://codeforces.com/api/user.info?handles={handles}`
   - Confirmed query parameter:
     - `handles` - comma-separated handle list; I manually tested it with `tourist`
   - Confirmed success envelope from the live official endpoint:
     - `status: "OK"`
     - `result: [...]`
   - Sample fields observed in the returned user object include:
     - `handle`
     - `firstName`
     - `lastName`
     - `country`
     - `city`
     - `organization`
     - `rating`
     - `maxRating`
     - `rank`
     - `maxRank`
     - `contribution`
     - `friendOfCount`
     - `registrationTimeSeconds`
     - `lastOnlineTimeSeconds`
     - `avatar`
     - `titlePhoto`

## Pagination
- not confirmable from the blocked official docs in this pass

## Rate limits
- not confirmable from the blocked official docs in this pass

## Error and response notes
- the successfully tested official endpoint returned a JSON envelope rather than a bare object
- because the official docs page was blocked, I did not verify the documented non-`OK` error envelope or status-code conventions beyond the fact that the endpoint was reachable and returned valid JSON in this session

## Important usage notes
- the provider is only partially documented in this pass because the official documentation page was blocked by Cloudflare verification
- the live API itself appears reachable from this session even though the docs page is not
- revisit this provider when `https://codeforces.com/apiHelp` becomes directly accessible so the complete route/auth/rate-limit details can be rebuilt from the official reference page

## Verification notes
This file was manually rebuilt from the blocked official docs page plus a directly tested official Codeforces API endpoint.