# Upwork

## Provider metadata
- Category: `Jobs`
- Provider slug: `upwork`
- Official pages checked:
  - `https://developers.upwork.com/`
  - redirected docs destination `https://www.upwork.com/developer/documentation/graphql/api/docs/index.html`
- Manually confirmed route count: `0`

## Manual review result
The official developer portal redirected to Upwork's documentation host, but the docs page was blocked by a Cloudflare security challenge.

## Explicit blocker note
- The developer portal resolves to Upwork's official documentation area.
- The destination page did not expose docs content; it only showed the security-verification interstitial.
- Without access to the official docs content, I could not verify the GraphQL endpoint URL, auth flow, schema access method, or rate-limit details.

## fireROUTE note
- Manual public documentation is blocked by anti-bot protection on the official docs host.
