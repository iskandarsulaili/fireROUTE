# IEX Cloud

Official pages manually reviewed:
- https://iexcloud.io/docs/api/
- https://iexcloud.io/

## Manual review result
**Blocked by unresponsive official hosts in the browser session used for this job.**

Both the official docs URL and the official site root timed out during manual browser navigation, so I could not inspect a current provider-controlled route reference.

## What was confirmed
- The repository’s official docs URL still points at `https://iexcloud.io/docs/api/`.
- In this browser environment, both the docs path and the root host failed to complete page navigation.
- Because the official pages did not load, no current base URL, auth model, route table, pagination contract, or error schema could be manually confirmed from first-party documentation.

## Base URLs
No concrete current API base URL was manually confirmable from the reviewed official pages during this pass.

## Authentication
No current token/header contract was manually confirmable because the official pages did not load.

## Confirmed routes
No endpoint paths were manually confirmed from the official source pages in this pass.

Manual route count confirmed: **0**.

## Pagination, errors, and rate limits
No current public pagination, error, or rate-limit guidance was accessible from the official pages due the timeout blocker.

## Blocker summary
- `https://iexcloud.io/docs/api/` timed out in browser navigation
- `https://iexcloud.io/` timed out in browser navigation
- no second public official reference page was reachable from those blocked entrypoints

## fireROUTE note
Treat IEX Cloud as **official docs unreachable** until the provider’s current official documentation becomes reachable again in-browser.
