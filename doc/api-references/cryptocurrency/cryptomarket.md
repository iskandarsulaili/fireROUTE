# CryptoMarket

## Provider metadata
- Category: `cryptocurrency`
- Provider slug: `cryptomarket`
- Official pages manually reviewed in this pass:
  - `https://www.cryptomkt.com/en/`
  - `https://www.cryptomkt.com/en/support`
  - `https://api.exchange.cryptomkt.com/`
- Official alternative page linked from the provider site and manually reviewed in this pass:
  - `https://github.com/notbank-exchange`
- Current first-party status confirmed from the reviewed pages: the public exchange/support site is still live, but the provider's own API-doc destination is unresolvable and the linked GitHub organization currently returns GitHub's page-not-found screen
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked CryptoMarket using the current public site, the support page, and the API-doc link exposed by that support page. The exchange website is still live, but the route-discovery path presented by the official site is currently broken before any endpoint reference becomes available.

## What the reviewed official pages currently confirm
1. `https://www.cryptomkt.com/en/` is a live consumer exchange site, not a route-level API reference.
2. `https://www.cryptomkt.com/en/support` is live and contains a footer `Company` section with links labeled `API Doc`, `Github`, `SDK Python`, `SDK Node`, and `SDK Java`.
3. The same support page currently includes multiple article titles that mention `Notbank`, including `How to Create an Account on Notbank` and `How to Buy Cryptocurrencies with Notbank Exchange`, which indicates a visible branding/continuity transition on the official site.
4. The official support-page `API Doc` link points to `https://api.exchange.cryptomkt.com/`.
5. Navigating to `https://api.exchange.cryptomkt.com/` currently fails with `ERR_NAME_NOT_RESOLVED`, so no first-party route table, OpenAPI document, or endpoint reference loads.
6. The official support-page `Github` link points to `https://github.com/notbank-exchange`.
7. That linked GitHub page currently shows GitHub's `Page not found · GitHub · GitHub` title instead of a browsable organization or repository index.
8. The support page also links SDK package destinations for Python, Node, and Java, but those links do not substitute for a live first-party HTTP route reference.

## API surface status
CryptoMarket still has a reachable public web product, but I could not verify any current API routes because the provider's own API-doc hostname is presently unresolvable.

### Base URL
- No current base URL could be confirmed from a live first-party route reference.
- The official site points API discovery to `https://api.exchange.cryptomkt.com/`, but that hostname did not resolve in this pass.

### Endpoints and methods
- No current endpoint paths could be manually confirmed.
- No current HTTP methods could be manually confirmed.

### Parameters
- No current query parameters, path parameters, or request-body schemas could be manually confirmed.

### Authentication
- No current authentication mechanism, headers, or signing rules could be manually confirmed.

### Rate limits
- No current rate-limit policy could be manually confirmed.

### Pagination
- No current pagination behavior could be manually confirmed.

### Errors and response format
- No current error schema or response-format guarantees could be manually confirmed.

## Blocker classification
This is a first-party documentation/discovery blocker:
- the exchange site is live
- the support site still advertises an API-doc destination
- but the advertised docs hostname is unresolvable
- and the linked GitHub destination is currently nonfunctional as a browsable developer surface

Because of that combination, there is no trustworthy current first-party route inventory to document.

## Important usage notes
- Do not treat `https://api.exchange.cryptomkt.com/` as a confirmed working API base until DNS and route-level docs return.
- Do not infer a current HTTP surface solely from SDK package listings or historical examples.
- If revisiting later, start from `https://www.cryptomkt.com/en/support` and verify whether the `API Doc` and `Github` links have been repaired.

## fireROUTE normalization notes
- Keep the provider marked `manually_documented`.
- Keep the confirmed route count at `0`.
- Keep the category README docs URL as `https://www.cryptomkt.com/en/support`, because that is the current official page exposing the provider's API-discovery links.
