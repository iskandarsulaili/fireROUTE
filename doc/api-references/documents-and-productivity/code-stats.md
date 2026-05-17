# Code::Stats

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `code-stats`
- Docs used manually:
  - `https://codestats.net/api-docs`
- Confirmed API base URL: `https://codestats.net/api`
- Official beta/testing base mentioned in docs: `https://beta.codestats.net/api`
- Primary media type: JSON
- Authentication: `X-API-Token` header for authenticated routes
- Manually confirmed routes in this pass: `2`

## Authentication
From the official Code::Stats API documentation:
- Code::Stats uses simple token authentication
- one token identifies both the user and the machine
- authenticated requests send the token in the `X-API-Token` header
- tokens are generated from the machine control panel
- the public profile route does not require auth; the pulse-ingest route does

## Common request/response conventions
- all API paths are prefixed with `/api`
- all requests must use HTTPS; plain HTTP is rejected
- requests with payloads send JSON in the request body
- responses are JSON
- error responses contain an `error` key with a human-readable message
- timestamps must be RFC 3339 datetimes including the timezone offset, e.g. `2016-04-24T01:43:56+12:00`

## Manually confirmed endpoint set

### 1) Read a public user profile
- Method: `GET`
- Path: `/users/{username}`
- Full URL pattern: `https://codestats.net/api/users/{username}`
- Authentication: none documented for this route
- Path parameter:
  - `username` - the public Code::Stats username to fetch
- Purpose: retrieve public profile totals for a user
- Response fields explicitly shown in the official example:
  - `user`
  - `total_xp`
  - `new_xp`
  - `machines` - keyed object of machines with `xps` and `new_xps`
  - `languages` - keyed object of languages with `xps` and `new_xps`
  - `dates` - keyed object of daily XP totals
- Response note explicitly stated by the docs:
  - `new_xps` / `new_xp` represents XP gained in the last `12` hours
- Error behavior explicitly stated:
  - `404` if the user does not exist or the profile is private

### 2) Add a pulse
- Method: `POST`
- Path: `/my/pulses`
- Full URL: `https://codestats.net/api/my/pulses`
- Authentication: required via `X-API-Token`
- Content type: JSON request body
- Purpose: submit accumulated coding XP for one machine/user
- Request body fields explicitly documented:
  - `coded_at` - RFC 3339 timestamp with the user's local UTC offset; docs explicitly say not to convert it to UTC before sending
  - `xps` - array of XP entries
- XP entry fields explicitly shown in the official example:
  - `language`
  - `xp`
- Important validation/behavior notes from the official docs:
  - pulses older than one week are rejected
  - future timestamps are ignored and their `coded_at` is set to the current moment
  - pulses should be sent periodically and may be sent later if connectivity was temporarily unavailable
- Success response explicitly documented:
  - HTTP `201`
  - body `{"ok": "Great success!"}`

## Pagination
- none documented on the reviewed official page

## Rate limits
- the reviewed official docs page does not publish numeric rate limits or quota windows

## Error and response notes
- all responses are JSON
- error responses include an `error` field containing a human-readable message
- the profile route explicitly documents `404` for nonexistent or private users
- the pulse route explicitly documents `201` with an `ok` message on success

## Important usage notes
- Code::Stats tracks XP, not levels; the docs explicitly say clients must calculate levels themselves
- XP is tied to a language string determined by the client/editor integration
- each keystroke that creates or deletes a character should contribute `1` XP; bulk edits such as deleting highlighted text count as `1` XP if the editor API supports that distinction
- for API testing, the docs specifically recommend using the beta instance

## Verification notes
This file was manually rebuilt from the official Code::Stats API documentation using browser inspection.