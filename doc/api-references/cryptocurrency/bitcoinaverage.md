# BitcoinAverage

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `bitcoinaverage`
- Official pages manually reviewed in this pass:
  - `https://apiv2.bitcoinaverage.com/`
  - `https://bitcoinaverage.com/`
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually re-checked BitcoinAverage from both the historical API host and the official root domain. In this session, both first-party hosts failed before any current product page, developer portal, or API reference could load.

## What the reviewed official pages currently confirm
1. Navigating to `https://apiv2.bitcoinaverage.com/` fails with `ERR_CONNECTION_REFUSED`.
2. Navigating to `https://bitcoinaverage.com/` also fails with `ERR_CONNECTION_REFUSED`.
3. Because both official hosts refuse connections immediately, the review environment never reaches a replacement landing page, deprecation notice, login page, or route-reference surface.
4. No first-party page was reachable that exposed a current BitcoinAverage base URL, endpoint inventory, authentication flow, or support / migration notice.

## Blocker details
This is currently a first-party availability blocker rather than a case of merely thin documentation:
- the historical API host is not accepting connections
- the official root domain is also not accepting connections
- no fallback official docs or successor notice is exposed through the reviewed first-party hosts

Because of that, I could not responsibly confirm:
- a current production API base URL
- endpoint paths or HTTP methods
- authentication requirements or signing rules
- rate limits
- pagination semantics
- response formats
- error models

## fireROUTE normalization notes
- Keep BitcoinAverage marked as `manually_documented` with `0` confirmed current routes.
- Treat the provider as currently unavailable for fireROUTE integration until a reachable first-party docs or product surface returns.
- Do not infer a live adapter contract from stale examples, unofficial mirrors, or archived SDKs without a new first-party verification pass.
