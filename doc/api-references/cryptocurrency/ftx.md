# FTX

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `ftx`
- Official pages manually reviewed in this pass:
  - `https://docs.ftx.com/`
  - `https://ftx.com/`
- Current first-party status confirmed from the reviewed pages: both historical FTX entrypoints now resolve to the customer-claims workflow rather than to exchange API documentation
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the historical FTX docs host and the main official domain. In this pass, both routes converge on `https://claims.ftx.com/welcome`, which is the FTX Customer Claims Portal. The reachable first-party experience is administrative and post-collapse in nature, not a live exchange developer surface.

## What the official pages currently confirm
1. `https://docs.ftx.com/` now resolves to `https://claims.ftx.com/welcome`.
2. `https://ftx.com/` also resolves to `https://claims.ftx.com/welcome`.
3. The destination page presents the heading `Welcome to the FTX Customer Claims Portal`.
4. The portal explains claims-administration steps such as logging in with historical FTX credentials, confirming email, providing KYC information, viewing account balances, reviewing proof-of-claim status, tax requirements, selecting a distribution-services provider, and viewing scheduled distributions.
5. The reviewed official pages do not expose exchange REST paths, WebSocket topics, authentication headers, request-body schemas, pagination guidance, rate limits, or error-format documentation.

## Blocker details
This is a first-party product-discontinuity blocker rather than a simple rendering issue:
- the former docs host now redirects into claims administration
- the main official domain also redirects into claims administration
- the currently reachable first-party surface is legal / administrative rather than developer-facing

## What could not be confirmed manually
Because of that discontinuity, I could not responsibly confirm:
- a current exchange REST base URL
- a current exchange WebSocket base URL
- any endpoint list or HTTP methods
- authentication or signing details
- pagination behavior
- rate limits
- response envelopes
- application error objects

## Important usage notes
- Treat FTX as a discontinued exchange-API provider unless a new first-party technical reference is published.
- Use the claims portal as the current official state indicator rather than the obsolete docs hostname.
- Do not rely on historical FTX API examples without fresh first-party confirmation.

## fireROUTE normalization notes
- Keep FTX marked `manually_documented` with `0` confirmed current routes.
- Keep the category README docs URL pointed at `https://claims.ftx.com/welcome`, which reflects the provider's current first-party state.
