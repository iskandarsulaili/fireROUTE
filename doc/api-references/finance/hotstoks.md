# Hotstoks

Official pages manually reviewed:
- https://hotstoks.com/?utm_source=public-apis
- https://hotstoks.com/

## Manual review result
The current official HotStoks site is reachable, but it behaves as a stock-scanner/dashboard web application rather than a published API reference.

## What was confirmed from the reviewed official site
The current official page visibly exposes:
- a live dashboard titled **HotStoks Dashboard**
- market summary panels for S&P 500, NASDAQ, and Dow Jones
- scanner sections such as watchlist counts, big drops/gains, streaks, and top performers
- no visible API documentation link
- no visible OpenAPI/Swagger export
- no published auth instructions or developer onboarding flow on the reviewed page

## Base URLs
No public API base URL was manually confirmable from the reviewed official site.

## Authentication
No public API authentication model was documented on the reviewed site.

## Confirmed routes
No concrete API endpoint paths were publicly documented on the reviewed official pages.

Manual route count confirmed: **0**.

## Pagination, errors, and rate limits
No API pagination, error, or rate-limit documentation was visible on the current official dashboard page.

## Why this remains effectively blocked
Although the site is online, the reviewed official surface is an end-user market dashboard rather than a developer portal. Without a provider-controlled docs page listing routes, methods, parameters, or auth rules, there is no reliable public API surface to document.

## fireROUTE note
Treat HotStoks as **no public API reference currently exposed**. Do not infer JSON endpoints from the dashboard UI alone.
