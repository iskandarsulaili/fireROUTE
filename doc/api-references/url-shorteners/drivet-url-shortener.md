# Drivet URL Shortener

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `drivet-url-shortener`
- Official pages reviewed manually in this pass:
  - `https://wiki.drivet.xyz/en/url-shortener/add-links`
  - `https://drivet.xyz/`
- Confirmed current status: first-party continuity / ownership blocker
- Manually confirmed route count: `0`

## What the official pages currently show
Manual browser review did not surface a current Drivet URL-shortener API reference.

Observed outcomes in this pass:
- the indexed wiki URL did not remain on a Drivet-controlled documentation page
- requesting `https://wiki.drivet.xyz/en/url-shortener/add-links` ended at a long off-domain redirect URL and rendered a generic search-style page rather than provider docs
- requesting `https://drivet.xyz/` redirected to `http://ww1.drivet.xyz/`
- the final `ww1.drivet.xyz` page rendered unrelated `LINE Developers` / `Messaging API reference` content instead of Drivet URL-shortener documentation

Because the reviewed first-party surfaces now resolve to unrelated destinations, no trustworthy Drivet API contract was reachable in this pass.

## Base URL assessment
- No live Drivet API base URL could be confirmed.
- No versioned route prefix, short-link creation endpoint, expansion endpoint, or account endpoint was visible on a provider-identifying official page.

## Authentication
- No current Drivet auth guidance was reachable from first-party material in this pass.
- I could not confirm whether the historical service used anonymous access, API keys, bearer tokens, or any other auth model.

## Route inventory
- No concrete Drivet method+path operations were visible on the reviewed official pages.
- Confirmed fireROUTE route count remains `0`.

## Parameters, pagination, errors, and limits
### Parameters
- No request parameters were documented on a trustworthy current Drivet page.

### Pagination
- No pagination behavior was visible.

### Errors
- The current blocker is continuity/ownership drift rather than a stable API error schema.
- The docs URL no longer lands on Drivet documentation, and the root host now resolves to unrelated content.

### Rate limits
- No current first-party rate-limit or quota guidance was reachable.

## Format notes
- No current JSON request/response examples or schema details were exposed on a trustworthy Drivet page.
- Unrelated content on the reviewed hosts should not be treated as a substitute for Drivet API documentation.

## Important usage notes
- Treat Drivet URL Shortener as an explicit first-party continuity blocker for now.
- Re-checking should begin with the same official wiki URL and root host once they again resolve to provider-identifying documentation.
- Do not infer current routes from stale mirrors or unrelated pages currently served from the old hostnames.

## Verification note
This file was rebuilt manually from the indexed official wiki URL and the official root host using browser tools only. No current API routes were counted because the reviewed official surfaces no longer expose a trustworthy Drivet documentation page.
