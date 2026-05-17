# EmailRep

## Provider metadata
- Category: `Security`
- Provider slug: `emailrep`
- Docs used manually:
  - `https://docs.emailrep.io/` -> currently redirects to Sublime Security's hosted EmailRep docs
  - `https://docs.sublime.security/reference/emailrep-introduction`
  - `https://docs.sublime.security/reference/get_-email`
  - `https://docs.sublime.security/reference/post_report`
  - `https://emailrep.io/`
- Confirmed API base URL: `https://emailrep.io`
- Primary media type confirmed in this pass: JSON
- Authentication model confirmed in this pass: optional API key in `Key` header, plus mandatory `User-Agent` header on every request
- Manually confirmed routes in this pass: `2`

## Authentication
From the official introduction page now hosted at Sublime Security:
- an API key is not required to use the EmailRep API
- supplying an API key gives higher rate limits than anonymous usage
- the docs show the API key in the `Key` header
- every request must include a `User-Agent` header describing the consuming application
- invalid API keys return `401`
- missing `User-Agent` returns `403`

Official example from the reviewed docs:
- `GET https://emailrep.io/{email}`
- `Key: [your api key]`
- `User-Agent: [your app name]`

## Common request/response conventions
- Base URL: `https://emailrep.io`
- The GET route page shows `accept: application/json`
- The report route page shows `content-type: application/json`
- JSON is the public response format on the reviewed route pages
- The docs reviewed in this pass do not describe pagination for either public route

## Manually confirmed endpoint set

### 1) Query an email address
- Method: `GET`
- Path: `/{email}`
- Full URL pattern: `https://emailrep.io/{email}`
- Purpose: return reputation and risk information for a specific email address
- Auth notes:
  - `User-Agent` is required
  - `Key` header is optional but increases rate limits
- Path parameters:
  - `email` - required string email address being queried
- Query parameters directly confirmed on the official route page:
  - `summary` - boolean; return a human-readable summary
- Confirmed responses on the official page:
  - `200` query successful
  - `400` invalid email
  - `401` invalid API key for authenticated requests
  - `429` too many requests; docs tell users to contact EmailRep for an API key

### 2) Report an email address
- Method: `POST`
- Path: `/report`
- Full URL: `https://emailrep.io/report`
- Purpose: submit a malicious or suspicious email report
- Content type: `application/json`
- Auth notes:
  - the EmailRep introduction says API keys are optional at the API level
  - the route page documents `401 Invalid api key` when one is supplied and invalid
  - `User-Agent` requirements from the introduction apply to all requests
- Confirmed JSON body fields:
  - `email` - required string; email address being reported
  - `tags` - required array of strings
  - `description` - optional string with additional context
  - `timestamp` - optional integer UTC timestamp; defaults to now
  - `expires` - optional integer; number of hours the email should be considered risky
- Tags directly enumerated on the official route page:
  - `account_takeover`
  - `bec`
  - `brand_impersonation`
  - `browser_exploit`
  - `credential_phishing`
  - `generic_phishing`
  - `malware`
  - `scam`
  - `spam`
  - `spoofed`
  - `task_request`
  - `threat_actor`
- Important route note from the official page:
  - `expires` defaults to no expiration unless `account_takeover` is specified, in which case the default is `14` days
- Confirmed responses on the official page:
  - `200` report successful
  - `400` invalid input
  - `401` invalid API key

## Pagination
- None of the two official public routes reviewed in this pass document pagination.

## Rate limits
From the official introduction page:
- rate limits are enforced using a rolling 24-hour window, not calendar-day resets
- authenticated users can inspect remaining quota using:
  - `X-Rate-Limit-Daily-Remaining`
  - `X-Rate-Limit-Monthly-Remaining`
- exceeding rate limits returns `429`
- the reviewed official docs do not publish a fixed anonymous or authenticated numeric requests-per-minute value

## Error handling
The reviewed official pages explicitly document:
- `400` invalid email or invalid input
- `401` invalid API key
- `403` missing `User-Agent` header, from the introduction page
- `429` too many requests
- the reviewed docs are clearer about route-level status codes than about a single shared error-body schema

## Response format notes
- the GET route page explicitly shows `application/json`
- the POST report page is documented as a JSON request route
- the reviewed public docs did not expose a fully expanded sample success body for `/report` without using the interactive console

## Important usage notes
- EmailRep's public docs are currently hosted inside Sublime Security's docs platform even though the API base URL remains `https://emailrep.io`
- `User-Agent` is mandatory and should clearly identify the consuming application
- API key usage is optional for baseline access but important for higher quota
- the `summary=true` query option is the only public query parameter shown on the reviewed lookup route page

## Verification notes
This file was manually rebuilt from EmailRep's current official docs pages, which are now served through Sublime Security's documentation platform, plus the public `emailrep.io` site.