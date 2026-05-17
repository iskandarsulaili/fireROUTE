# Tronald Dump

## Overview
- Provider: `Tronald Dump`
- Category: `Games & Comics`
- Official indexed docs URL: `https://www.tronalddump.io/`
- Official first-party source inspected as the surviving contract source: `https://github.com/tronalddump-io/client-nodejs`
- Historical API host from the official client: `https://api.tronalddump.io`
- Preferred API base path from the official client: `/`
- Auth: none documented
- HTTPS: yes
- Response format: `application/hal+json` according to the official client headers
- Pagination: none documented in the surviving first-party sources
- Rate limits: none documented in the surviving first-party sources
- Confirmed routes: `2`
- Manual status: `manually_documented`

## Base URL status at inspection time
- A fresh browser check to `https://www.tronalddump.io/` no longer showed provider content. The page title was `SLOT88 - Agen Situs Slot Gacor Terpercaya Tahun 2025 Ini Paling The Best RTP Gacor`, with visible gambling storefront copy unrelated to Tronald Dump.
- A fresh browser check to the historical API host `https://api.tronalddump.io/` failed with `ERR_NAME_NOT_RESOLVED`.
- The official `tronalddump-io/client-nodejs` repository still identifies itself as the official API client and preserves the surviving first-party route contract.
- Because the published web host is no longer trustworthy and the historical API host does not currently resolve, the route catalog below is confirmed from the official client repository.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/quote/{quoteId}` | `quoteId` path | Returns one quote by id. The official README example uses `wAgIgzV1S9OARKhfun3f0A`; the test suite uses `VHKwB8crTte7--FqtIxq9A`. |
| GET | `/search/quote` | required `query` query parameter | Free-text quote search. The official README example uses `money`; the test suite uses `Money`. |

Route count note:
- The surviving official client only exposes these two concrete HTTP operations.
- fireROUTE excludes the unresolved root host itself from the route count because the inspected first-party client does not define it as a documented data operation.

## Parameter notes
- `quoteId`: opaque quote identifier used in the path for `/quote/{quoteId}`.
- `query`: free-text search string for `/search/quote`.

## Response and schema notes
- The official client sends `Accept: application/hal+json` on both confirmed routes.
- The official client parses both responses as JSON objects.
- The official test suite only asserts object responses and does not publish a deeper field schema in the surviving sources.
- The official client repository describes the product as both an API and a web archive for Trump quotes, so consumers should expect quote-centric hypermedia JSON rather than plain text.

## Auth, headers, and live behavior notes
- The official client uses HTTPS against host `api.tronalddump.io` on port `443`.
- The official client does not send any API key, bearer token, cookie, or login credential.
- The official client sends a descriptive user agent header in the form `tronalddump-io/client-nodejs#v{version}`.
- No pagination parameters, rate-limit headers, or custom error envelopes are documented in the surviving first-party sources.
- Because the current public site is hijacked and the historical API hostname no longer resolved in this pass, live success and error payloads could not be revalidated.

## Important usage notes
- Treat this provider as repository-documented and live-host-unreliable.
- The surviving first-party contract is narrow: one quote lookup route and one quote-search route.
- Preserve the documented HAL+JSON accept header when emulating the official client behavior.
- Do not infer additional routes from third-party wrappers or stale examples while the first-party web host is no longer trustworthy.

## Integration notes for fireROUTE
- Use `https://api.tronalddump.io` as the historical canonical host when recording this provider, but mark it as currently unresolved.
- Model the API surface as two unauthenticated GET routes.
- Preserve `query` as the only confirmed search parameter and `quoteId` as the only confirmed path selector from the surviving first-party client.
- Do not invent pagination, auth, or rate-limit behavior; none is published in the surviving first-party sources.

## Sources inspected
- `https://www.tronalddump.io/`
- `https://api.tronalddump.io/`
- `https://github.com/tronalddump-io/client-nodejs`
- `https://raw.githubusercontent.com/tronalddump-io/client-nodejs/master/README.md`
- `https://raw.githubusercontent.com/tronalddump-io/client-nodejs/master/package.json`
- `https://raw.githubusercontent.com/tronalddump-io/client-nodejs/master/src/Client.js`
- `https://raw.githubusercontent.com/tronalddump-io/client-nodejs/master/test/Client.js`
