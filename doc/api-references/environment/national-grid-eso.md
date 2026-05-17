# National Grid ESO

## Provider metadata
- Category: `Environment`
- Provider slug: `national-grid-eso`
- Official docs inspected manually:
  - `https://data.nationalgrideso.com/`
  - official successor domain inspected manually: `https://api.neso.energy/`
- Manual review outcome: legacy host no longer resolves; successor portal redirects anonymous browsing to CKAN login
- Manually confirmed routes in this pass: `0`

## Blocker note
The legacy `data.nationalgrideso.com` hostname did not resolve during this pass. The obvious official successor portal at `api.neso.energy` was reachable, but anonymous navigation landed on a CKAN login flow rather than an open API reference or dataset catalog page. Because the inspected official pages did not expose route-level documentation, dataset-specific endpoints, authentication guidance, or response schemas in public view, a reliable manual route rewrite was blocked.

## What was still confirmed
- The National Grid ESO data platform appears to have moved under the NESO branding.
- The successor platform is CKAN-based.
- Public route documentation was not accessible without getting past the login flow during this pass.

## fireROUTE note
Treat this provider as blocked until an openly browsable NESO CKAN API reference or public dataset/API page is available.