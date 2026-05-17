# Warrant

Official docs manually reviewed:
- https://warrant.dev/
- https://workos.com/docs/reference/fga

## Overview
Warrant’s official domain no longer exposes a live Warrant API reference. The current official `warrant.dev` content is a decommission notice that instructs users to migrate to WorkOS FGA.

## Blocker / deprecation status
The current official page states, in substance:
- Warrant is end-of-life / decommissioned
- Warrant is now WorkOS FGA
- prior Warrant-specific API and SDK knowledge should be treated as stale
- users should migrate to WorkOS FGA documentation and APIs

Because the official Warrant domain no longer publishes a current Warrant API reference, this pass could not manually confirm any active Warrant-specific base URL or endpoint surface.

The official alternative page reviewed during this pass was:
- `https://workos.com/docs/reference/fga`

That page documents WorkOS FGA, not legacy Warrant routes.

## Confirmed endpoints
None for active Warrant-branded APIs. Manual route count confirmed from current official Warrant sources: **0**.

## Auth / rate limits / pagination
Not confirmable for Warrant itself from the current official domain, because the provider is deprecated and the official site redirects users to WorkOS migration targets.

## Important usage notes
- Do not assume older Warrant SDKs or endpoint patterns are still supported.
- Treat Warrant as a deprecated provider entry whose current official guidance is migration to WorkOS FGA.

## fireROUTE notes
- Keep this provider in blocker/deprecated status unless a preserved official Warrant API reference becomes available again.
- If fireROUTE wants a replacement integration, document WorkOS FGA as a separate provider rather than silently substituting routes under the Warrant slug.
