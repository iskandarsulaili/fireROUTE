# Sabre for Developers

## Provider metadata
- Category: `Transportation`
- Provider slug: `sabre-for-developers`
- Provider identity confirmed from the reviewed official pages in this pass as: `Sabre Developer Hub`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://developer.sabre.com/guides/travel-agency/quickstart/getting-started-in-travel`
  - official alternative page: `https://developer.sabre.com/`
  - additional official pages reviewed in this pass:
    - `https://developer.sabre.com/product-catalog`
    - `https://developer.sabre.com/guide/quickstart/quickstart.html`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned quickstart URL loaded successfully in this pass and showed title `Obsolete URL address | Developer Hub`.
- That assigned page explicitly says the URL is obsolete and that the user will be redirected to the desired page.
- The same obsolete page offers links to the home page and the product catalog instead of exposing a route-level API contract itself.
- The public Sabre root loaded successfully with title `Sabre Travel APIs | Developer Hub`.
- The Developer Hub home page publicly presents Sabre as a broad platform with top-level sections such as:
  - `Product Catalog`
  - `Guides`
  - `Support`
  - `Blog`
- The home page publicly advertises mixed platform areas and collections including:
  - `Agentic APIs`
  - `AI for Developers`
  - `Sabre IQ`
  - `NDC IT OfferPrice`
  - `Get Ancillaries - Agency`
  - `Bargain Finder Max`
  - `Revalidate Itinerary`
  - `Digital Connect Post-Booking`
  - `Get Hotel Avail`
  - `Content Services Rail`
- The public Product Catalog page loaded successfully and visibly reports `457 items`.
- The same catalog publicly breaks the inventory down into:
  - `Product Collection (22)`
  - `REST API (192)`
  - `SDK (4)`
  - `SOAP API (239)`
- The catalog also shows the platform spans multiple functions and audiences including `Search`, `Reservation`, `Pricing`, `Utility`, `Air`, `Hotel`, `Car`, `Travel Agency`, and `Airline Carrier`.
- The current quickstart guide root `https://developer.sabre.com/guide/quickstart/quickstart.html` remains within the same umbrella Developer Hub and did not expose one bounded provider-wide route inventory for this row.
- Across the reviewed public Sabre pages in this pass, no one shared base URL, one bounded route set, one unified auth model, or one unified pagination / error contract could be safely confirmed for the whole row.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://developer.sabre.com/guides/travel-agency/quickstart/getting-started-in-travel`
- Public hub root confirmed: `https://developer.sabre.com/`
- Public product catalog confirmed: `https://developer.sabre.com/product-catalog`
- Current quickstart guide root confirmed: `https://developer.sabre.com/guide/quickstart/quickstart.html`
- Provider API base URL: not safely confirmable as one provider-wide base URL for the entire Sabre Developer Hub.
- Endpoint paths: not safely confirmable as one bounded inventory for this row.
- HTTP methods: not safely confirmable as one bounded inventory for this row.
- Parameters or request bodies: not safely confirmable as one provider-wide contract for this row.
- Authentication:
  - the public hub clearly represents authenticated APIs, subscriptions, and mixed product families
  - no single provider-wide auth model was safely confirmable for the entire umbrella row from the reviewed pages alone
- Rate limits: not safely confirmable as one provider-wide model for the entire Sabre platform row.
- Pagination: not safely confirmable as one provider-wide model for the entire Sabre platform row.
- Errors: not safely confirmable as one provider-wide model for the entire Sabre platform row.
- Response formats:
  - the public catalog confirms that the platform spans REST APIs, SOAP APIs, SDKs, and product collections
  - one unified provider-wide response-format contract is not applicable from the reviewed pages
- Important usage notes:
  - the assigned row maps to Sabre's umbrella developer hub rather than one narrowly scoped API product
  - the public catalog currently exposes hundreds of distinct products
  - the assigned legacy quickstart URL is now only an obsolete-URL redirect page

## Why this provider remains blocked
- I manually reviewed the assigned obsolete quickstart page first, then the public Sabre developer hub, then the product catalog, and then the current quickstart guide root in this pass.
- The official public material now loads clearly enough to show that the row points at a very large multi-product platform, not one bounded API surface.
- Because I could not safely derive one complete shared base URL, one complete route inventory, one parameter model, one auth model, one pagination model, and one error model for the entire umbrella row, this provider remains `manual_blocked`.

## Sources inspected
- `https://developer.sabre.com/guides/travel-agency/quickstart/getting-started-in-travel`
- `https://developer.sabre.com/`
- `https://developer.sabre.com/product-catalog`
- `https://developer.sabre.com/guide/quickstart/quickstart.html`
