# WhatPulse

## Provider metadata
- Category: `Tracking`
- Provider slug: `whatpulse`
- Official docs used manually:
  - `https://developer.whatpulse.org/#web-api`
  - `https://whatpulse.org/help/api/client-api`
  - `https://whatpulse.org/help/api/intro`
- Confirmed API base URL: local WhatPulse client server, default `http://localhost:3490`
- Primary response format: JSON
- Authentication: none for the API itself, but the local client API must be enabled and the calling IP must be allowed in client settings
- Manually confirmed routes in this pass: `9`

## Access model
The reviewed official documentation describes the Client API as:
- a lightweight JSON HTTP and WebSocket API embedded in the desktop WhatPulse client
- disabled by default until enabled in client settings
- intended for local-machine access at `http://localhost:3490/` by default
- unauthenticated at the HTTP layer, but restricted by the client-side allow-list for connecting IP addresses

## Confirmed API surface
The reviewed client API docs explicitly document these HTTP endpoints:
- `GET /`
- `GET /v1/account-totals`
- `GET /v1/unpulsed`
- `GET /v1/all-stats`
- `GET /v1/profiles`
- `POST /v1/pulse`
- `POST /v1/open-window`
- `POST /v1/profiles/activate`
- `POST /v1/realtime`

## 1) API index
- Method: `GET`
- Path: `/`
- Purpose: open the local Swagger UI index listing available API calls

Important note from the docs:
- the index is available only when the Client API has been enabled in the desktop client

## 2) Get account totals
- Method: `GET`
- Path: `/v1/account-totals`
- Purpose: retrieve total account statistics synchronized from the WhatPulse website

Documented response notes:
- returns total keys, clicks, download, upload, uptime, and ranking values
- example response fields include `clicks`, `clicks_formatted`, `distance_formatted`, `distance_miles`, `download`, `download_formatted`, `keys`, `keys_formatted`, and a nested `ranks` object
- docs state these values update each time the client pulses

## 3) Get real-time rates
- Method: `POST`
- Path: `/v1/realtime`
- Purpose: retrieve current keys/clicks per second and current transfer rates

Documented response notes:
- available from client version `2.8` and up
- returns a JSON object with current `keys`, `clicks`, `download`, and `upload` rates
- docs say the values are averaged over the last 5 seconds

## 4) Get unpulsed statistics
- Method: `GET`
- Path: `/v1/unpulsed`
- Purpose: retrieve stats accumulated since the last pulse

Documented response notes:
- returns unpulsed `keys`, `clicks`, `download`, `upload`, and `uptime`
- the docs state these values update in real time

## 5) Get combined statistics
- Method: `GET`
- Path: `/v1/all-stats`
- Purpose: retrieve the combined stats described by the top-level endpoint table as a combination of the other stats calls

Documentation note:
- the reviewed page's route table explicitly lists this endpoint even though the excerpt reviewed in detail focuses more on the surrounding route sections

## 6) List profiles
- Method: `GET`
- Path: `/v1/profiles`
- Purpose: list all configured profiles and indicate which one is active

Documented response notes:
- response includes a `profiles` array
- example profile objects include `name`, `id`, `active`, `created_at`, and `updated_at`

## 7) Activate a profile
- Method: `POST`
- Path: `/v1/profiles/activate`
- Purpose: switch the client to a specific profile

Documented request body:
- `profile_id` - required numeric profile identifier

Documented response notes:
- success example returns `{ "msg": "Profile 'profileName' activated." }`
- error example returns `{ "error": "Profile id doesn't exist." }`

## 8) Trigger a pulse
- Method: `POST`
- Path: `/v1/pulse`
- Purpose: ask the client to pulse immediately

Documented response notes:
- success returns a JSON object with a `msg` field
- docs warn this call is asynchronous and currently always returns a success-style message such as `Pulse executed.` rather than the final pulse result

## 9) Open the WhatPulse client window
- Method: `POST`
- Path: `/v1/open-window`
- Purpose: ask the client to open its desktop window

Documentation note:
- the reviewed route inventory table explicitly lists this endpoint and method

## Status codes and formatting notes
The reviewed docs explicitly document these status codes:
- `200` - success; result is in the body
- `401` - connecting IP address not allowed in client settings
- `404` - invalid URL
- `405` - invalid HTTP method; only `GET` and `POST` are allowed

Formatting notes from the docs:
- the API is JSON over HTTP
- many statistics responses include `_formatted` fields
- `_formatted` fields use the client's locale and unit preferences, including number separators and metric/imperial formatting

## Pagination, rate limits, and WebSocket notes
From the reviewed official pages:
- no pagination model is documented
- no numeric rate limits are published for the local client API
- the docs recommend the WebSocket if real-time stats should flow continuously to the calling application
- the same article describes both HTTP and WebSocket access, but the routes above are the explicitly documented HTTP endpoints

## fireROUTE notes
- This is not a remote SaaS REST API; it is a local service exposed by the WhatPulse desktop client.
- Consumers should not assume `localhost:3490` is always reachable unless the user has enabled the API and allowed the caller IP.
- `POST /v1/realtime` is a read-style operation despite using POST.
- The most stable machine-readable values are the unformatted numeric fields rather than the locale-sensitive `_formatted` ones.

## Verification notes
This file was manually rebuilt from the live official WhatPulse client API documentation using browser inspection.