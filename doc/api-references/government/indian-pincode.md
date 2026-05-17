# Indian Pincode

## Provider metadata
- Category: `Government`
- Provider slug: `indian-pincode`
- Official docs/pages used:
  - `https://indianpincode.com/`
  - `https://indianpincode.com/api`
  - `https://pincode.gmshaik-kw.workers.dev/api`
  - `https://pincode.gmshaik-kw.workers.dev/api/v1/pincode/110001`
  - `https://pincode.gmshaik-kw.workers.dev/api/v1/search?q=connaught&limit=2`
  - `https://pincode.gmshaik-kw.workers.dev/api/v1/pincode/123`
  - `https://pincode.gmshaik-kw.workers.dev/api/v1/search?q=a`
  - `https://pincode.gmshaik-kw.workers.dev/api/v1/search`
- Assigned docs URL: `https://indianpincode.com/`
- Current documented API host: `https://indianpincode.com/api/v1`
- Auth model: no authentication required
- Response formats confirmed from reviewed official pages and live responses: `json`
- Manually confirmed route count: `2`

## Official usage notes
- Browser navigation to `https://indianpincode.com/` currently resolves to `https://pincode.gmshaik-kw.workers.dev/`, which serves the provider's public website UI.
- Browser navigation to `https://indianpincode.com/api` currently resolves to `https://pincode.gmshaik-kw.workers.dev/api` and returns a machine-readable API descriptor.
- That official API descriptor explicitly publishes:
  - `base_url`: `https://indianpincode.com/api/v1`
  - `auth`: `None`
  - `rate_limit`: `1,000 requests per hour per IP`
  - exactly two documented endpoints
- The same official descriptor says the service is a free India PIN-code API with `165,000+` post-office records sourced from India Post.

## Canonical endpoints confirmed from the official site
1. `GET /pincode/{code}`
   - Base URL: `https://indianpincode.com/api/v1`
   - Purpose: return all post offices associated with one 6-digit Indian PIN code.
   - Path parameters:
     - `code` - required 6-digit PIN-code string
   - Live success response confirmed from the current deployment:
     - top-level fields: `pincode`, `district`, `state`, `post_offices`
     - each `post_offices[]` object can include `name`, `type`, `type_label`, `area`, `taluk`, `latitude`, `longitude`
   - Live validation error confirmed:
     - invalid code `123` returned HTTP `400` with `{"error":"Invalid pincode. Must be exactly 6 digits.","code":"123"}`

2. `GET /search`
   - Base URL: `https://indianpincode.com/api/v1`
   - Purpose: search post offices by name, area, or PIN-code prefix.
   - Query parameters confirmed from the official descriptor and live responses:
     - `q` - required search query string; the docs say minimum 2 characters
     - `limit` - optional result cap; docs say default `10`, maximum `25`
   - Live success response confirmed from the current deployment:
     - top-level fields: `query`, `results`, `count`, `_api`
     - each `results[]` object can include `pincode`, `post_office`, `type`, `area`, `district`, `state`, `latitude`, `longitude`
   - Live validation errors confirmed:
     - `q=a` returned HTTP `400` with `{"error":"Query must be at least 2 characters.","results":[]}`
     - omitting `q` returned the same HTTP `400` error body

## Parameters, pagination, and format notes
- The reviewed official descriptor documents only `q` and `limit` for the search route.
- No `offset`, `page`, or cursor parameter was published on the official descriptor page reviewed in this run.
- The search response includes a `count` field, but the published public interface reviewed here does not expose a separate documented pagination mechanism beyond `limit`.
- The reviewed public interface and live responses both used JSON only; no XML or CSV variant was published on the reviewed official pages.

## Auth, errors, and rate-limit notes
- The official API descriptor explicitly states `auth: None`.
- The official API descriptor explicitly states `1,000 requests per hour per IP`.
- Live validation failures return compact JSON error bodies rather than HTML error pages.
- The reviewed official pages did not publish a broader provider-wide error-code catalogue beyond the inline validation behavior confirmed above.

## fireROUTE normalization notes
- Treat `https://indianpincode.com/api/v1` as the canonical API host because that is the base URL published by the official API descriptor.
- Preserve the currently observed implementation detail that the official site redirects to a Cloudflare Workers deployment, but normalize routes against the official `indianpincode.com` host rather than the transient worker hostname.
- Model this provider as a small public lookup/search API with two read-only GET routes and no auth.
