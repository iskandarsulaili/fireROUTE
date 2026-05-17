# Findwork

## Provider metadata
- Category: `Jobs`
- Provider slug: `findwork`
- Official pages checked:
  - `https://findwork.dev/developers/`
  - `https://findwork.dev/`
  - from the homepage, the official `REST API` navigation item was also followed
- Manually confirmed route count: `0`

## Manual review result
The developer page and the homepage's REST API entry both lead to a sign-in wall instead of public endpoint documentation.

## Explicit blocker note
- `https://findwork.dev/developers/` redirects to a login page.
- The public homepage is reachable, but the `REST API` link also lands on the same authenticated area.
- I could confirm that Findwork advertises a REST API, but I could not access any official public docs describing base URLs, endpoints, auth headers, request parameters, or schemas without an account.

## fireROUTE note
- Public manual documentation is blocked by authentication-gated docs.
- Revisit if Findwork republishes public API docs or if account-backed documentation becomes in scope.
