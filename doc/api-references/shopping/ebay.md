# eBay

## Provider metadata
- Category: `Shopping`
- Provider slug: `ebay`
- Docs attempted manually in this pass:
  - `https://developer.ebay.com/`
  - `https://developer.ebay.com/api-docs/buy/browse/resources/methods`
  - `https://developer.ebay.com/api-docs/buy/browse/overview.html`
  - `https://developer.ebay.com/api-docs/static/authorization_guide_landing.html`
  - `https://developer.ebay.com/api-docs/static/ebay-rest-landing.html`
  - `https://developer.ebay.com/develop/get-started/api-call-limits`
- Outcome in this browser session: official docs reachable, but route-detail extraction remained incomplete for a trustworthy full provider rewrite
- Manually confirmed routes in this pass: `0`

## Blocker summary
I was able to reach eBay's official developer portal and confirm that the Buy Browse API documentation exists, including a resources index with route pages for `search`, `searchByImage`, `getItem`, `getItemByLegacyId`, `getItems`, `getItemsByItemGroup`, and `checkCompatibility`.

However, this browser session did not stay stable enough across the individual method pages to let me complete the route-by-route parameter, request-format, and absolute base-URL verification needed for a high-confidence manual rewrite of the provider as a whole.

## What was confirmed from official pages
### Official developer portal
- `https://developer.ebay.com/` loaded successfully in this session
- the portal exposes official guides for Authorization, eBay REST usage, API call limits, and Buy API documentation

### Official Browse API resources index
From `https://developer.ebay.com/api-docs/buy/browse/resources/methods`:
- the official Buy Browse reference exposes route pages for:
  - `search`
  - `searchByImage`
  - `getItem`
  - `getItemByLegacyId`
  - `getItems`
  - `getItemsByItemGroup`
  - `checkCompatibility`
- the reviewed resources page visibly paired those with relative route patterns such as:
  - `/item_summary/search`
  - `/item_summary/search_by_image`
  - `/item/{item_id}`
  - `/item/get_item_by_legacy_id`
  - `/item/`
  - `/item/get_items_by_item_group`
  - `/item/{item_id}/check_compatibility`

### Authentication and REST guidance confirmed from official guides
From the reviewed authorization and REST guide pages:
- eBay REST APIs use OAuth access tokens
- the reviewed REST guide explicitly documents an OAuth bearer `Authorization` header
- JSON is the default and only response-body format mentioned in the reviewed REST guide snippet
- `Accept: application/json` is documented
- `Content-Type` is used to declare request-body format where a body is required
- `Accept-Encoding: gzip` is recommended for large responses

### Rate-limit guidance confirmed from official pages
- eBay publishes an official `API Call Limits` guide
- the reviewed page confirms that call-limit guidance is documented officially, but I did not complete a reliable extraction of provider-wide numeric quotas in this pass

## What could not be confirmed with enough confidence in this pass
Because the browser session did not keep the method-detail pages stable long enough for reliable extraction, I did not promote this provider to a non-blocker manual route doc in this pass. I could not complete high-confidence verification of:
- the absolute production Browse API base URL string for the reviewed method set
- route-specific query/body parameters for each Browse method
- route-specific pagination semantics for the reviewed method set
- route-specific error schema details beyond the generic REST guide

## fireROUTE note
Revisit eBay with a stable official-doc session and finish the provider as a scoped manual doc, likely starting with the Buy Browse API pages already confirmed reachable in this pass.
