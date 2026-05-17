# arcsecond.io

## Manual review status
- Category: `Science & Math`
- Provider slug: `arcsecond-io`
- Official pages used in this run:
  - `https://api.arcsecond.io/`
  - `https://api.arcsecond.io/schema`
  - `https://api.arcsecond.io/schema/swagger/`
  - `https://api.arcsecond.io/schema/redoc/`
  - `https://docs.arcsecond.io/`
  - `https://docs.arcsecond.io/ecosystem/`
  - `https://docs.arcsecond.io/ecosystem/apis`
- Manual review outcome: `manual_blocked`
- Confirmed route count: `0`

## Evidence from this run
- `https://api.arcsecond.io/` loaded an official landing page headed `Welcome to api.arcsecond.io`.
- That landing page explicitly advertises three API-reference entry points: `OpenAPI schema`, `Swagger UI`, and `ReDoc`.
- In this run, each advertised reference path was unusable:
  - `https://api.arcsecond.io/schema` returned `Not Found`.
  - `https://api.arcsecond.io/schema/swagger/` returned `Not Found`.
  - `https://api.arcsecond.io/schema/redoc/` returned `Not Found`.
- `https://docs.arcsecond.io/` is a live official docs site, and `https://docs.arcsecond.io/ecosystem/` is a live official page titled `APIs & Libraries`.
- The ecosystem page links to an `APIs` page, but the actual provider-controlled page at `https://docs.arcsecond.io/ecosystem/apis` still resolves to `Coming soon. | Arcsecond Docs`.
- Across the reviewed official pages, no route catalog, method list, parameter reference, auth guide, pagination rules, rate-limit policy, response-format reference, or error documentation could be confirmed.

## Why fireROUTE remains blocked
- Arcsecond signals that public APIs exist, but the official schema/reference surfaces reviewed in this run are broken or placeholder-only.
- The live docs site still does not publish the route-level contract required for safe documentation.
- fireROUTE should not infer routes from broken links or a `Coming soon.` placeholder.

## Revisit checkpoint
- Keep `arcsecond.io` as `manual_blocked` until Arcsecond restores a working official schema/reference surface or replaces the placeholder API page with live route documentation.
