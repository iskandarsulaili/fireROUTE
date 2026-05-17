# Transport for The Netherlands

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-the-netherlands`
- Provider identity confirmed from the reviewed official pages in this pass as: `NS API Developer Portal` for `Nederlandse Spoorwegen (NS)`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://apiportal.ns.nl/`
  - official APIs page: `https://apiportal.ns.nl/apis`
  - official products page: `https://apiportal.ns.nl/products`
  - official Starter's Guide: `https://apiportal.ns.nl/startersguide`
  - official linked product details page: `https://apiportal.ns.nl/product#product=NsApp`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The official homepage loaded successfully with title `Home - NS API Developer Portal`.
- The homepage presents the portal as `NS API Portaal` and tells users to log in, find an API, subscribe through the matching product, and use the data in their app.
- The homepage publicly advertises `NS open API's` and links to `NS App API's` via `https://apiportal.ns.nl/product#product=NsApp`.
- The public APIs page loaded successfully with title `APIs: List - NS API Developer Portal`.
- In anonymous view, that page shows only the catalog shell (`Name`, `Description`, `Type`) and the body text `No APIs found`.
- The public Products page loaded successfully with title `Products: List - NS API Developer Portal`.
- In anonymous view, that page shows only the catalog shell and the body text `No products found`.
- The linked product page loaded with title `Products: Details - NS API Developer Portal` and anonymous body text including:
  - `Please select a product`
  - `You need to sign in to see your subscriptions.`
  - `This product doesn't have APIs.`
- The Starter's Guide says that before you can see the available APIs and products, `heb je een account nodig`.
- The Starter's Guide says the API overview contains detailed documentation including `parameters` and `voorbeeld-request`.
- The Starter's Guide says access is arranged through products and a personal `subscription key`.
- The Starter's Guide says the key must be sent with every request and that the operation-level `Try-It` view shows the required header usage.
- The Starter's Guide also warns that additional security measures can apply depending on the API or operation.
- Browser inspection of the same official portal pages showed the anonymous backing catalog endpoints also return empty results:
  - `GET /developer/apis?$top=50&$skip=0&api-version=2022-04-01-preview` -> `200` with `{"value":[],"nextLink":null}`
  - `GET /developer/products?$top=50&$skip=0&api-version=2022-04-01-preview` -> `200` with `{"value":[],"nextLink":null}`
  - `GET /developer/products/NsApp/apis?$top=50&api-version=2022-04-01-preview` -> `200` with `{"value":[],"nextLink":null}`
  - `GET /developer/products/NsApp?api-version=2022-04-01-preview` -> `404` with `{"code":"NotFound","message":"The requested resource was not found."}`
- Across all reviewed public pages in this pass, no trustworthy NS endpoint list, request URL catalog, method list, pagination rules, error schemas, or response-format contract became publicly readable.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://apiportal.ns.nl/`
- Public APIs page reviewed: `https://apiportal.ns.nl/apis`
- Public Products page reviewed: `https://apiportal.ns.nl/products`
- Public Starter's Guide reviewed: `https://apiportal.ns.nl/startersguide`
- Publicly linked product details page reviewed: `https://apiportal.ns.nl/product#product=NsApp`
- Publicly verifiable provider API base URL for actual NS operations: not exposed on the reviewed public pages.
- Endpoint paths: not publicly exposed on the reviewed public pages.
- HTTP methods: not publicly exposed on the reviewed public pages.
- Parameters:
  - the Starter's Guide confirms detailed parameter documentation exists inside the authenticated API overview
  - concrete parameter tables were not publicly readable in this pass
- Request bodies: not publicly exposed on the reviewed pages in this pass.
- Authentication:
  - access is arranged through products and a personal `subscription key`
  - the key must be sent with every request
  - the Starter's Guide says operation-level `Try-It` documentation shows the required header usage
  - additional security controls may apply depending on the API
- Rate limits: not publicly exposed on the reviewed pages in this pass.
- Pagination: not publicly exposed on the reviewed pages in this pass.
- Errors:
  - no public provider error table was exposed
  - the anonymous internal product lookup returned `404` / `{"code":"NotFound","message":"The requested resource was not found."}` for `NsApp`
- Response formats: not publicly exposed on the reviewed pages in this pass.
- Important usage notes:
  - NS clearly maintains an official API portal and subscription workflow
  - the public catalog currently exposes only empty anonymous results
  - the Starter's Guide confirms that detailed operation documentation exists, but it is not publicly readable from the reviewed pages in this pass

## Why this provider remains blocked
- I manually reviewed the official NS homepage, public APIs page, public Products page, Starter's Guide, and the public product-details page linked from the homepage in this pass.
- The reviewed material confirms that NS has a live portal, product/subscription onboarding, and authenticated operation documentation.
- However, the public catalog is effectively empty in anonymous view, and the route-level API contract did not become readable from the official pages or their anonymous backing catalog requests.
- Because no trustworthy public NS route inventory, base URL list, operation methods, or endpoint-level parameter reference was readable from official sources in this pass, this provider remains `manual_blocked`.

## Sources inspected
- `https://apiportal.ns.nl/`
- `https://apiportal.ns.nl/apis`
- `https://apiportal.ns.nl/products`
- `https://apiportal.ns.nl/startersguide`
- `https://apiportal.ns.nl/product#product=NsApp`
