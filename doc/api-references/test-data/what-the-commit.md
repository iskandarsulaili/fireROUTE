# What The Commit

## Provider metadata
- Category: `Test Data`
- Provider slug: `what-the-commit`
- Docs used manually:
  - `https://whatthecommit.com/`
  - `https://whatthecommit.com/index.txt`
- Confirmed base URL: `https://whatthecommit.com`
- Primary media types confirmed from the reviewed official pages:
  - `text/plain` for the API-like endpoint
  - HTML for the homepage
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the reviewed official site and plain-text endpoint:
- no API key is required
- no OAuth flow is documented
- no custom auth header is documented

## Common request/response conventions
- The official docs URL from the category index redirects from HTTP to HTTPS.
- The site is route-light and exposes a plain-text random-message endpoint rather than a structured JSON API.
- The homepage shows a random commit-style message and a permalink link, but the site does not publish a broader formal API reference.

## Manually confirmed endpoint set

### 1) Get a random commit message
- Method: `GET`
- Path: `/index.txt`
- Full URL: `https://whatthecommit.com/index.txt`
- Purpose: return a random plaintext faux commit message
- Response format confirmed from the official endpoint:
  - `text/plain`
- Query parameters: none documented on the reviewed official pages
- Authentication: none

## Pagination
- None documented.

## Rate limits
- The reviewed official site did not publish a numeric rate-limit policy, quota window, or rate-limit headers.

## Error and response notes
- The reviewed official route returns a plain-text body rather than JSON.
- The homepage itself is a lightweight HTML page that surfaces the same joke-message concept plus a permalink.
- The reviewed official pages did not publish a formal error schema.

## Important usage notes
- The route is best treated as a single public random-message endpoint.
- Although the homepage exposes permalink-style message URLs, the reviewed official pages do not present those permalink paths as a supported API contract, so they are not counted here.
- Because the route is plaintext-only, fireROUTE adapters should avoid assuming JSON parsing.

## Verification notes
This file was manually rebuilt from the current official homepage and the current official `index.txt` endpoint using browser-based review only.
