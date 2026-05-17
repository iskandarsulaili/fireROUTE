# ISRO

## Provider metadata
- Category: `Science & Math`
- Provider slug: `isro`
- Description: `ISRO spaceflight and organizational reference data`
- Official docs/pages used:
  - `https://isro.vercel.app/` (official landing page listing all public endpoints)
  - `https://isro.vercel.app/api/spacecrafts` (live endpoint check)
  - `https://isro.vercel.app/api/launchers` (live endpoint check)
  - `https://isro.vercel.app/api/customer_satellites` (live endpoint check)
  - `https://isro.vercel.app/api/centres` (live endpoint check)
- Current public API base URL: `https://isro.vercel.app/api`
- Auth model: no authentication documented on the reviewed official pages
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON objects containing one top-level array field per endpoint
- Rate limits: no numeric quota policy was published on the reviewed official pages
- Manually confirmed route count: `4`

## API shape and behavior
- The official landing page exposes four read-only endpoints under the `/api` prefix.
- Each endpoint returns a JSON object keyed by the plural resource name.
- The reviewed official landing page does not document any query parameters, path variables, pagination, or alternate versions.

## Canonical endpoints
1. `GET /spacecrafts`
   - Return launched spacecraft records.
2. `GET /launchers`
   - Return launcher/rocket records.
3. `GET /customer_satellites`
   - Return customer-satellite launch records.
4. `GET /centres`
   - Return ISRO centre/facility records.

## Parameters and payload notes
- No query parameters are documented on the official landing page.
- No path variables are documented on the official landing page.
- Live endpoint checks returned these top-level payload shapes:
  - `GET /spacecrafts` -> `{ "spacecrafts": [...] }`
  - `GET /launchers` -> `{ "launchers": [...] }`
  - `GET /customer_satellites` -> `{ "customer_satellites": [...] }`
  - `GET /centres` -> `{ "centres": [...] }`

## Response notes
- Live sample records observed during manual review:
  - `/spacecrafts` sample item: `{ "id": 1, "name": "Aryabhata" }`
  - `/launchers` sample item: `{ "id": "SLV-3E1" }`
  - `/customer_satellites` sample item includes `id`, `country`, `launch_date`, `mass`, `launcher`
  - `/centres` sample item includes `id`, `name`, `Place`, `State`
- The official landing page does not publish a formal error schema.
- No pagination model is documented on the reviewed official pages.

## Usage notes
- Treat the provider as a lightweight, no-auth JSON dataset service.
- Because the provider documents only four top-level collection routes, fireROUTE should preserve them as-is rather than infer unsupported detail endpoints.
- The official site links to the GitHub repository for contribution, but the landing page itself already exposes the complete public route catalog.

## fireROUTE normalization notes
- Preserve the `/api` prefix.
- Normalize the service into four GET route families only.
- Do not invent item-detail endpoints or filters that are not documented on the official landing page.
- Preserve response arrays under their provider-specific top-level keys (`spacecrafts`, `launchers`, `customer_satellites`, `centres`).