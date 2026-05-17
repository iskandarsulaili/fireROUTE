# Hashnode

## Manual review status
- Category: `Social`
- Provider slug: `hashnode`
- Official docs URL from index: `https://hashnode.com`
- Official pages manually inspected in this pass:
  - `https://hashnode.com/`
  - `https://hashnode.com/graphql`
  - `https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The indexed official site does not expose a public current API reference page with a live base URL, route inventory, auth contract, or request examples.
- The public Hashnode homepage now surfaces a `WHAT'S NEW` notice that says `GraphQL API access is moving to a paid offering` and `GraphQL API access is now paid. Email us with your publication domain to request access.`
- The obvious same-host GraphQL path `https://hashnode.com/graphql` does not expose an API endpoint or schema explorer in the browser; it redirects to `https://hashnode.com/@graphql` and renders `User not found | Hashnode` / `PAGE NOT FOUND`.
- Hashnode's official changelog confirms that GraphQL API access is now paid, manually allow-listed, and requested by email rather than publicly self-serve.
- Because the reviewed official pages do not publish a self-serve public endpoint contract that can be manually confirmed from the web, I could not verify any fireROUTE-usable routes from official sources alone.

## Evidence from manual inspection
- `https://hashnode.com/` loaded with title `Hashnode — Blogging Platform for Builders in Tech`.
- The homepage visible text included `GraphQL API access is moving to a paid offering` and `GraphQL API access is now paid. Email us with your publication domain to request access.`
- `https://hashnode.com/graphql` redirected to `https://hashnode.com/@graphql`, loaded with title `User not found | Hashnode`, and visibly showed `PAGE NOT FOUND` / `This page no longer exists.` instead of a public API surface.
- `https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access` loaded with title `GraphQL API access is moving to a paid offering | Hashnode`.
- The reviewed changelog page states `We're moving GraphQL API access to a paid offering`, says pricing/onboarding are manual, and says Hashnode allow-lists the publication after payment.

## Endpoint inventory
- No public official endpoint paths were manually confirmable in this session.
- No public official method list, parameter schema, pagination contract, or response envelope was exposed on the reviewed pages.

## Authentication and authorization
- The reviewed official pages imply that API access is gated and no longer openly self-serve.
- A concrete auth model could not be confirmed from currently public official docs because the reviewed pages did not provide request headers, token flows, or an accessible public API reference.

## Pagination
- Not publicly documented on the reviewed official pages.

## Rate limits
- Not publicly documented on the reviewed official pages.

## Errors and format notes
- The blocking issue is missing public official route documentation, not a documented API error payload.
- The reviewed pages provide access-policy messaging and a same-host `PAGE NOT FOUND` result at `/graphql`, not a current public request/response contract.

## fireROUTE note
- Treat Hashnode as blocked for manual fireROUTE completion until Hashnode restores a public reference, exposes an approved reference page, or publishes a current endpoint guide with base URL and auth details.
- Do not infer live routes from historical posts, third-party examples, or community snippets in place of current official documentation.
