# Pocket

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `pocket`
- Official docs/pages reviewed manually:
  - `https://getpocket.com/developer/`
  - `https://getpocket.com/`
  - `https://support.mozilla.org/en-US/kb/future-of-pocket`
- Confirmed current provider state from official sources: Pocket has been shut down
- Manually confirmed live-route count: `0`

## What the official sources currently show
- The historical developer page no longer exposes API reference content; in this session it returned an official Pocket error page saying `Oops! Something went wrong.`
- The current official Pocket homepage explicitly says Pocket has been phased out.
- The official Mozilla support article states that Pocket was shut down on `July 8, 2025`.
- The same official support article explicitly states: `The Pocket API was disabled on November 12, 2025`.

## Authentication and route status
- The category index historically listed Pocket as an OAuth-based provider.
- In the currently reviewed first-party sources, there is no longer a live official route reference, OAuth flow page, or active endpoint catalog for current integration work.
- Because the official support article states that the API itself has been disabled, historical route inventories are not treated as current live routes.

## Explicit blocker
After reviewing the official developer page and official alternative pages, the blocker is not a temporary documentation rendering issue. The blocker is product discontinuation:
- official developer page: error state instead of API documentation
- official product homepage: shutdown notice
- official Mozilla support article: confirms the API was disabled on `2025-11-12`

Because of that, Pocket is now a shutdown blocker with `0` current live routes.

## Important usage notes
- Any future fireROUTE work for this slug should treat Pocket as a discontinued provider unless Mozilla publishes a new official API or migration path.
- Historical Pocket API docs or unofficial mirrors should not be treated as current source-of-truth routes now that the official support article confirms the API is disabled.

## Verification note
This file was manually rebuilt from current official Pocket and Mozilla support pages using browser inspection only.