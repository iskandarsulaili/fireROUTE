# WallstreetBets

Official pages manually reviewed:
- https://dashboard.nbshare.io/apps/reddit/api/
- https://tradestie.com/apps/reddit/api/

## Manual review result
**Blocked by bot-protection on the current official host.**

The original official URL redirected to Tradestie’s current host and immediately served a Cloudflare “Performing security verification” challenge instead of an API reference page.

## What was confirmed
- `https://dashboard.nbshare.io/apps/reddit/api/` now redirects to `https://tradestie.com/apps/reddit/api/`
- the current official page presents a Cloudflare verification interstitial rather than endpoint documentation
- no route list, auth instructions, parameter docs, or response examples were available before the challenge wall

## Base URLs
No API base URL was manually confirmable from the reviewed official pages because the documentation itself was blocked behind the challenge screen.

## Authentication
No auth model was publicly visible on the reviewed pages.

## Confirmed routes
No endpoint paths were manually confirmed during this pass.

Manual route count confirmed: **0**.

## Pagination, errors, and rate limits
No public pagination, error, or rate-limit guidance could be reviewed because the docs never became accessible past the Cloudflare check.

## fireROUTE note
Treat WallstreetBets / Tradestie as **challenge-blocked** for manual browser-based documentation right now. Revisit only if the provider exposes a challenge-free official reference or an official OpenAPI export.
