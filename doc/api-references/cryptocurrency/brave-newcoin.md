# Brave NewCoin

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `brave-newcoin`
- Official pages manually reviewed in this pass:
  - `https://bravenewcoin.com/developers`
  - `https://bravenewcoin.com/contact`
  - `https://bravenewcoin.com/`
- Current official status confirmed from the reviewed pages: Brave New Coin's site and data-marketing surfaces are live, but the historical developer entrypoint now redirects into a contact-led sales flow and still does not expose a public route reference
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked Brave New Coin from the historical `developers` entrypoint, the resulting contact flow, and the live root site. The reviewed first-party pages confirm that BNC still operates a current crypto news and market-data presence and still markets APIs as part of that offering. However, public API discovery is still routed through enquiry rather than a browsable endpoint reference, so I could not verify any concrete routes.

## What the reviewed official pages currently confirm
1. `https://bravenewcoin.com/developers` currently redirects to `https://bravenewcoin.com/contact`.
2. The resulting first-party page currently renders `Contact us - Brave New Coin`.
3. That contact page includes a dedicated `Data Enquiry` section that asks whether the request is related to BNC's `Market Data, Newsfeed and range of APIs`.
4. The same contact page distinguishes that API / data enquiry flow from `General Inquiries`, `Technical Support`, `Insights and News`, and `Events`, which confirms that BNC still treats data / API access as a current product path.
5. `https://bravenewcoin.com/` currently renders a live first-party homepage titled `Crypto News Powering Blockchain Finance - Brave New Coin`.
6. The reviewed root site visibly exposes current `data-and-charts` surfaces such as `Market Cap`, `Bitcoin Price (BTC)`, `Ethereum Price (ETH)`, `Gainers & Losers`, and `All Assets`, which confirms that BNC still operates current market-data content under the same brand.
7. Even with those live site and data pages, the reviewed public pages did not expose a route-by-route API reference, OpenAPI file, authentication guide, pagination guide, rate-limit table, request-schema catalog, or error reference.
8. Because the historical developer entrypoint now leads into contact rather than documentation, there is still no trustworthy public first-party route inventory available for fireROUTE extraction.

## Current blocker
This is a commercial / contact-gated API-discovery blocker, not a dead-provider case:
- Brave New Coin still operates a live first-party site
- the site still markets data-oriented content and a `range of APIs`
- the historical `developers` URL is still under first-party control and routes into contact
- but the reviewed public pages do not expose a browsable technical route reference

Because of that blocker, I could not responsibly confirm:
- a public API base URL
- endpoint paths or HTTP methods
- request parameters or body schema
- authentication headers or token format
- pagination behavior
- rate limits
- response-envelope structure
- error-schema details

## Important usage notes
- Treat Brave New Coin as an active provider with contact-gated API access, not as a discontinued API.
- Keep `https://bravenewcoin.com/developers` as the canonical official developer entrypoint even though it currently redirects into contact.
- Do not infer routes from historical examples, cached docs, or customer-only materials until BNC republishes a public first-party route reference.

## fireROUTE normalization notes
- Keep Brave NewCoin marked `manually_documented` with `0` confirmed public routes.
- Preserve the blocker classification as commercial / enquiry-gated API discovery.
- Keep the category README docs URL pointed at `https://bravenewcoin.com/developers` unless Brave New Coin restores a browsable developer reference.
