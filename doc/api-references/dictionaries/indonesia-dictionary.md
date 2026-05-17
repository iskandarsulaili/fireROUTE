# Indonesia Dictionary

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `indonesia-dictionary`
- Official pages reviewed manually in this pass:
  - `https://new-kbbi-api.herokuapp.com/`
  - `https://new-kbbi-api.herokuapp.com/docs`
  - `https://new-kbbi-api.herokuapp.com/api`
- Manually confirmed current live-route count: `0`

## Current provider state
All reviewed official first-party URLs currently load the same Heroku shutdown page.
- Root page title: `No such app`
- `/docs` page title: `No such app`
- `/api` page title: `No such app`
- The visible page content exposed only Heroku’s generic `Build something amazing` error-page CTA inside the hosted error frame.

## Why the route count remains zero
Because the published official host no longer serves the application or any route reference, no current API contract could be safely recovered from first-party materials in this pass.
- No current API base URL beyond the dead Heroku host was confirmable.
- No current endpoint methods or paths were exposed.
- No request parameters, auth rules, pagination behavior, rate limits, or error schema for the actual dictionary API were visible.

The only currently verifiable behavior from the official host is Heroku’s `No such app` failure page, so the confirmed fireROUTE route count remains `0`.

## Base URL assessment
- No trustworthy live production API base could be confirmed from the reviewed official pages.
- The only published first-party host reviewed in this pass is currently unavailable.

## Authentication
- Not confirmable from the current official pages.
- Historical index metadata should not be treated as current proof while the first-party host is gone.

## Endpoint inventory
- No live endpoints were manually confirmable from current first-party materials.

## Pagination
- Not confirmable from current official sources.

## Rate limits
- Not confirmable from current official sources.

## Error and format notes
- All reviewed official URLs currently return the same hosted Heroku error experience instead of API payloads.
- The visible response is HTML error content, not dictionary JSON.

## Important usage notes
- Treat this provider as an explicit first-party continuity blocker until the maintainers restore the published host or publish a new canonical official API/docs location.
- Do not substitute unofficial mirrors, archived summaries, or guessed route lists for the missing current first-party reference.

## Verification note
This file was rebuilt manually from the current official Heroku host and two obvious first-party path variants using browser tools only.