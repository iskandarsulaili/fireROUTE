# Bittrex

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `bittrex`
- Official pages manually reviewed in this pass:
  - `https://bittrex.github.io/api/v3`
  - `https://bittrex.com/`
  - `https://bittrexglobal.com/`
- Current first-party status confirmed from the reviewed pages: the historical API reference is gone, and the surviving official site is a wind-down / liquidation portal rather than a live developer surface
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the historical Bittrex API-doc location and the current official web presence. The old API reference now resolves to a GitHub Pages `Site not found` page, while the live official site is focused on withdrawals, liquidation updates, and customer support rather than exchange API documentation.

## What the official pages currently confirm
1. Navigating to `https://bittrex.github.io/api/v3` now returns `Site not found · GitHub Pages` with a visible `404` heading instead of a route reference.
2. Navigating to `https://bittrex.com/` redirects to `https://bittrexglobal.com/`.
3. The current official Bittrex Global site prominently states: `All trading activity on Bittrex Global has been terminated. Please log in and withdraw all assets.`
4. The same page includes the heading `IMPORTANT UPDATE REGARDING BITTREX GLOBAL` and states that Bittrex Global `has decided to wind down its operations`.
5. The reviewed official page says the Liechtenstein and Bermuda exchange entities are in liquidation and focuses on withdrawals, support, FAQs, and creditor/liquidation information.
6. The reviewed first-party pages do not expose any current REST or WebSocket route catalog, auth guide, request examples, pagination rules, rate-limit guidance, or error-schema reference.

## Blocker details
This provider is blocked by confirmed product wind-down rather than by a minor docs outage:
- the historical API-doc entrypoint is gone
- the official site still exists
- but the official site is now a liquidation / withdrawals portal instead of a developer reference

## What could not be confirmed manually
Because of that blocker, I could not responsibly confirm:
- a current REST base URL
- a current WebSocket base URL
- endpoint paths or HTTP methods
- authentication or signing requirements
- pagination behavior
- rate limits
- response formats
- application error schemas

## Important usage notes
- Treat Bittrex as a `0`-route provider for current fireROUTE integration work unless a new first-party API reference reappears.
- Prefer the current `https://bittrexglobal.com/` status surface over the dead GitHub Pages API-doc URL when describing present provider state.
- Do not backfill routes from archived community mirrors or historical SDKs without new first-party confirmation.

## fireROUTE normalization notes
- Keep Bittrex marked `manually_documented` with `0` confirmed current routes.
- Keep the category README docs URL pointed at `https://bittrexglobal.com/`, which is the best current first-party state indicator even though it is no longer a developer-doc destination.
