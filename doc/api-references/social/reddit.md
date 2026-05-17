# Reddit

## Manual review status
- Category: `Social`
- Provider slug: `reddit`
- Official docs URL from index: `https://www.reddit.com/dev/api`
- Official pages manually inspected in this pass:
  - `https://www.reddit.com/dev/api`
  - `https://www.reddit.com/dev/api/oauth`
  - `https://old.reddit.com/dev/api`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The indexed official docs URL and both official alternatives currently stop on Reddit's network-security interstitial instead of exposing the API reference.
- Because every reviewed official docs URL was blocked before endpoint tables or request examples loaded, I could not manually confirm a trustworthy base URL, route inventory, auth contract, pagination rules, rate limits, error schema, or response format from current official material in this pass.

## Evidence from manual inspection
- `https://www.reddit.com/dev/api` loaded with visible text `You've been blocked by network security.` followed by `If you think you've been blocked by mistake, file a ticket below and we'll look into it.`
- `https://www.reddit.com/dev/api/oauth` loaded with the same visible block text: `You've been blocked by network security.`
- `https://old.reddit.com/dev/api` also loaded with the same visible block text: `You've been blocked by network security.`
- None of the reviewed official pages exposed endpoint tables, OAuth parameter lists, request examples, or schema details behind the block page.

## Endpoint inventory
- No official Reddit HTTPS routes were manually confirmable from the reviewed documentation pages in this browser session.
- I did not backfill historical endpoints from memory, third-party summaries, or unofficial mirrors because this fireROUTE pass requires current official-source confirmation.

## Authentication and authorization
- The blocked official path naming still indicates Reddit keeps OAuth docs under `/dev/api/oauth`, but the reviewed page did not expose current token endpoints, scope definitions, or request-header requirements.
- No bearer-token flow or app-registration parameter list was manually confirmable from the current official docs surface in this run.

## Pagination
- Not confirmable from the reviewed official pages in this run.

## Rate limits
- Not confirmable from the reviewed official pages in this run.

## Errors and format notes
- The only observable behavior on the reviewed official docs URLs was Reddit's network-security block interstitial.
- That page is a documentation-access failure, not a trustworthy representation of Reddit's API error schema.

## fireROUTE note
- Keep Reddit blocked until the official docs hosts are reachable from this browser worker again.
- On a future retry, start with `/dev/api`, then `/dev/api/oauth`, then `old.reddit.com/dev/api` before treating the provider as unresolved for that session.
