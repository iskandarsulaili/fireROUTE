# ModelPartFinder Error Codes

## Provider metadata
- Category: `Open Data`
- Provider slug: `modelpartfinder-error-codes`
- Description: `Lookup appliance and equipment error codes by brand and code, with recommended replacement parts`
- Official docs/pages used:
  - `https://modelpartfinder.com/docs/api`
  - `https://modelpartfinder.com/pricing`
- Confirmed public API base URL: `https://modelpartfinder.com`
- Auth model:
  - Reviewed free endpoints: no auth, no signup
  - Reviewed paid/pro access: provisioned API key via `hello@modelpartfinder.com`
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON for API routes; pricing page also mentions CSV exports for paid recall access
- Rate limits officially documented on the reviewed pages:
  - Free tier pricing page: `1,000 req/IP/day`, no key required, for `/api/v1/error-code/{brand}/{code}` plus `/api/search`
  - Pro pricing page: `100,000 req/key/day`, `99.5%` uptime SLA
  - Docs page marketing copy also says `no rate limit gotcha`, but the terms/pricing pages still warn that excessive crawling is edge-rate-limited; the quantitative pricing page is the most implementation-useful source
- Manually confirmed route count: `2`

## API shape and behavior
- The official docs page documents one fully specified public JSON endpoint for brand/code error lookup and one recall-feed endpoint family.
- The pricing page also names `/api/search` on the free tier, but the reviewed official pages do not publish a method, request schema, or parameter catalog for it, so it is not included in the confirmed route count.
- The API is positioned as a simple JSON service for repair tooling, chatbots, and dashboards.

## Canonical endpoints
1. `GET /api/v1/error-code/{brand}/{code}`
   - Look up a single error code for a brand.
   - Path parameters:
     - `brand` - matched case-insensitively.
     - `code` - normalized to uppercase by the provider.
   - Documented response fields include:
     - `ok`
     - `brand`
     - `code`
     - `description`
     - `appliance`
     - `recommended_skus[]`
     - `source_url`
   - `recommended_skus[]` objects in the official example include `sku`, `mpn`, `title`, `manufacturer`, `url`, and `price_cents`.
2. `GET /api/recalls`
   - Official docs page states that the free `/api/recalls` endpoint surfaces all indexed CPSC recalls.
   - The reviewed official page does not publish a formal parameter table for this route, but it is clearly described as a public endpoint.
   - The same page says paid recall tiers add daily delta payloads, filters, exports, real-time webhooks, and enriched recall metadata.

## Parameters and schema notes
### Error-code lookup path variables
- `brand` - brand name in the path; matched case-insensitively.
- `code` - error-code identifier; provider normalizes it to uppercase.

### Documented error-code response fields
- `ok` - boolean success flag.
- `brand`
- `code`
- `description`
- `appliance`
- `recommended_skus` - array of suggested replacement parts.
- `source_url` - canonical provider landing page for the error-code entry.

### Recall-feed notes
- The docs confirm the existence of `/api/recalls`.
- Tiered recall offerings on the same reviewed page mention brand and appliance filters, delta payloads, JSON/CSV exports, and webhook delivery, but do not publish a stable public parameter table or auth header contract for those expanded commercial capabilities.

## Response and pagination notes
- The error-code endpoint returns JSON documents.
- The official example shows one error-code lookup returning a single object with nested `recommended_skus`.
- No pagination model is documented on the reviewed official pages for either confirmed route.
- The commercial recall offering implies bulk/data-feed use cases, but the reviewed pages do not publish cursor or page-number mechanics.

## Error notes
- The docs page explicitly says the error-code route returns `404` with `{"detail":"Unknown brand/code combination"}` when the brand/code pair is missing from the index.
- The reviewed pages do not publish a broader formal error-code table for the free public API.
- The pricing/terms text also warns that excessive crawling may be rate-limited at the edge.

## Usage notes
- The docs page explicitly positions the API as free for commercial and non-commercial use, with no attribution requirement.
- The same page also says data is best-effort and should be verified before acting on it.
- The pricing page clarifies that paid API access is for higher-volume or broader-data needs and is provisioned by email.
- The docs page links part URLs in `recommended_skus`, so API consumers can jump from diagnosis to a canonical parts page.

## Excluded but noted official references
- The pricing page names `/api/search` on the free tier.
- Because the reviewed official pages did not publish request method, path semantics beyond the name, or parameter definitions for `/api/search`, that route is excluded from the confirmed fireROUTE route count in this pass.

## fireROUTE normalization notes
- Preserve the brand and code as path variables for the documented error-code endpoint.
- Preserve provider casing/normalization behavior notes: brand matching is case-insensitive and code is uppercased.
- Treat `/api/recalls` as a separate route family from the error-code lookup surface.
- Do not synthesize `/api/search` support in fireROUTE until ModelPartFinder publishes a concrete official request contract for it.