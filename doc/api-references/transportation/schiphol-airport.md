# Schiphol Airport

## Provider metadata
- Category: `Transportation`
- Provider slug: `schiphol-airport`
- Provider identity confirmed from the reviewed official pages in this pass as: `Schiphol Developer Center / Schiphol Developer Portal`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://developer.schiphol.nl/`
  - official alternative page: `https://www.schiphol.nl/en/developer-center/explore-all-schiphols-apis-in-the-developer-center/`
  - additional official pages reviewed in this pass:
    - `https://www.schiphol.nl/en/developer-center/using-our-apis/`
    - `https://www.schiphol.nl/en/developer-center/our-flight-api-explored`
    - `https://developer.schiphol.nl/login`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The public overview page loaded successfully with title `Schiphol | Explore all Schiphol’s APIs`.
- That page publicly states that Schiphol discloses airport data through APIs and invites users to explore APIs and request access through the Developer Center.
- The public overview page names six API or service families:
  - `Flight API`
  - `Operational Flight API`
  - `Wait Times API`
  - `Wayfinding API`
  - `Boarding Pass Service`
  - `Beacon Registry API`
- The official `How APIs work` page was manually reviewed in this pass and publicly states that Schiphol defines different access types and user types before granting API access for security and privacy reasons.
- That same usage page explicitly says: `The Flight API is accessible to everyone, so start exploring! If you want more, request access or contact us.`
- The official `Our Flight API explored` page loaded successfully with title `Schiphol | Our Flight API explored`.
- That public product page confirms that the Flight API covers current and scheduled passenger and cargo flights and says the API provides detailed information about:
  - destinations
  - airlines operating flights to and from Schiphol
  - aircraft types
  - flight data elements
  - status of flights
- The public Flight API page also exposes a support phone number `+31 20 601 44 45` and support email `api-support@schiphol.nl`.
- The official portal login page loaded successfully at `https://developer.schiphol.nl/login` with title `Schiphol Developer Portal`.
- The login page explicitly says:
  - `To use our APIs you need to register or log in`
  - an account gives access to `all the API endpoints, documentation, video tutorials, quickstarts, application keys, downloads and more`
- The login page also displays an `Important: Developer Portal Migration in 2026` notice stating that users will need to recreate their account and re-request API access after migration.
- Across all reviewed public Schiphol pages in this pass, no public route list, request URL catalog, method table, parameter table, pagination guide, error schema, or response-format reference became readable.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://developer.schiphol.nl/`
- Public overview page confirmed: `https://www.schiphol.nl/en/developer-center/explore-all-schiphols-apis-in-the-developer-center/`
- Public usage page confirmed: `https://www.schiphol.nl/en/developer-center/using-our-apis/`
- Public product-detail page confirmed: `https://www.schiphol.nl/en/developer-center/our-flight-api-explored`
- Public portal login page confirmed: `https://developer.schiphol.nl/login`
- Provider API base URL: not publicly confirmed from a route-level official reference in this pass.
- Endpoint paths: not publicly confirmed.
- HTTP methods: not publicly confirmed.
- Parameters or request bodies: not publicly confirmed.
- Authentication:
  - registration / login is required for access to the detailed endpoint docs and application keys
  - Schiphol publicly distinguishes access types and user types
  - a public page says the `Flight API` is accessible to everyone, but no public route-level contract was exposed in this pass
- Rate limits: no numeric public quota table was exposed on the reviewed public pages in this pass.
- Pagination: not publicly confirmed.
- Errors: not publicly confirmed.
- Response formats: not publicly confirmed.
- Important usage notes:
  - Schiphol publicly markets six API or service families
  - the public product pages are capability overviews, not route reference pages
  - detailed endpoint docs and keys remain behind the developer-portal account flow
  - the portal currently carries a 2026 migration notice affecting account setup

## Why this provider remains blocked
- I manually reviewed the official Developer Center overview first, then public usage guidance, then the public Flight API overview, and then the official login page in this pass.
- The reviewed official pages confirm that Schiphol has live API programs, public product-overview pages, and an account-gated developer portal.
- However, the operation-level documentation remains behind the portal login flow, and no trustworthy public route inventory became readable from the reviewed official sources.
- Because no public route list, base URL set, method table, parameter schema, pagination model, or error model became available in this pass, this provider remains `manual_blocked`.

## Sources inspected
- `https://developer.schiphol.nl/`
- `https://developer.schiphol.nl/login`
- `https://www.schiphol.nl/en/developer-center/explore-all-schiphols-apis-in-the-developer-center/`
- `https://www.schiphol.nl/en/developer-center/using-our-apis/`
- `https://www.schiphol.nl/en/developer-center/our-flight-api-explored`
