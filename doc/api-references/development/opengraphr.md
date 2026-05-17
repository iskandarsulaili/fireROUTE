# OpenGraphr

## Provider metadata
- Category: `Development`
- Provider slug: `opengraphr`
- Docs used manually:
  - `https://opengraphr.com/docs/1.0/overview`
  - `https://opengraphr.com`
- Confirmed API base URL: none confirmed in this session
- Primary response/content types confirmed from the docs used in this pass: none
- Authentication model confirmed from the docs used in this pass: the category index says `apiKey`, but no live official API reference remained reachable to verify how the key is currently passed
- Manually confirmed routes in this pass: `0`

## Blocker summary
- The indexed official docs URL `https://opengraphr.com/docs/1.0/overview` no longer resolved to provider docs in this browser session; it redirected to `https://heine.familiedeelstra.com/`, an unrelated personal blog.
- The provider root `https://opengraphr.com` also redirected to that same unrelated blog.
- Because both the listed docs URL and the root domain now resolve away from the provider, I could not confirm a current official API site, current API base URL, or any live route definitions.

## Authentication
- The category README currently records this provider as API-key authenticated.
- I could not confirm the header/query parameter name or onboarding flow from current official docs because the provider domain no longer points at a live OpenGraphr property in this session.

## Confirmed endpoint set
- None manually confirmed in this session.

## Pagination
- No current official documentation was reachable to confirm pagination behavior.

## Rate limits
- No current official documentation was reachable to confirm rate limits or quotas.

## Error handling
- No current official documentation was reachable to confirm status codes, error schema, or retry semantics.

## Response format notes
- No current official documentation was reachable to confirm response formats.

## Important usage notes
- Treat this provider as effectively blocked or potentially retired until a current official OpenGraphr property is identified.
- The current domain behavior strongly suggests the historical docs URL is stale.

## Verification notes
This file was manually rebuilt as an explicit blocker note after checking both the indexed official docs path and the provider root, both of which redirected to an unrelated site in this session.
