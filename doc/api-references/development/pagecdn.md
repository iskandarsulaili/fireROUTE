# PageCDN

## Provider metadata
- Category: `Development`
- Provider slug: `pagecdn`
- Docs used manually:
  - `https://pagecdn.com/docs/public-api`
  - `https://pagecdn.com/`
- Confirmed API base URL: none confirmed in this session
- Primary response/content types confirmed from the docs used in this pass: none
- Authentication model confirmed from the docs used in this pass: the category index says `apiKey`, but no live official API documentation was available to reconfirm that contract
- Manually confirmed routes in this pass: `0`

## Blocker summary
- The indexed official docs URL `https://pagecdn.com/docs/public-api` no longer served PageCDN API documentation in this browser session.
- The obvious official alternate `https://pagecdn.com/` also did not serve a PageCDN product site.
- Both URLs resolved to a parked/domain-sale page advertising that `pagecdn.com` is for sale via Afternic.
- Because the canonical docs path and the root domain both led to parking content instead of official documentation, I could not manually confirm any current API base URL, route path, auth header/query parameter, or response schema.

## Authentication
- The category README currently lists PageCDN as using API-key auth.
- I could not reconfirm the current auth contract from a live official API page in this pass because the official domain now appears parked.

## Confirmed endpoint set
- None manually confirmed in this session.

## Pagination
- No live official PageCDN API documentation was reachable to confirm pagination behavior.

## Rate limits
- No live official PageCDN API documentation was reachable to confirm current quotas or throttling rules.

## Error handling
- No live official PageCDN API documentation was reachable to confirm HTTP statuses, error envelopes, or retry guidance.

## Response format notes
- No live official PageCDN API documentation was reachable to confirm response formats.

## Important usage notes
- Treat this provider as blocked unless a current official PageCDN API hostname or replacement documentation source is identified.
- Do not trust older generated route guesses without a fresh official source review, because the original domain is currently parked.

## Verification notes
This file was manually rebuilt as an explicit blocker note after checking both the indexed docs path and the root domain, each of which now resolved to parked/domain-sale content instead of official PageCDN API documentation.