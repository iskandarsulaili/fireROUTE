# Améthyste

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://api.amethyste.moe/`
  - `https://api.amethyste.moe/docs`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The indexed official host does not currently accept browser connections.
- Both the root URL and an obvious same-host documentation alternative path fail with `net::ERR_CONNECTION_REFUSED` in this session.
- Because the provider-controlled host is refusing connections, no current official base URL behavior, route list, parameters, auth scheme details, rate limits, pagination rules, or error payload schema can be confirmed from live first-party pages.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://api.amethyste.moe/`
- Observed result: `net::ERR_CONNECTION_REFUSED`
- Outcome: no HTML docs, JSON payload, or landing page content was served

### Official page attempt 2
- URL: `https://api.amethyste.moe/docs`
- Observed result: `net::ERR_CONNECTION_REFUSED`
- Outcome: the obvious documentation path on the same official host also failed before any provider content loaded

## fireROUTE note
- Treat Améthyste as currently unavailable from official sources.
- Do not route traffic to historical Améthyste examples unless a provider-controlled host returns and the API can be manually reverified.

## Sources inspected
- `https://api.amethyste.moe/`
- `https://api.amethyste.moe/docs`
