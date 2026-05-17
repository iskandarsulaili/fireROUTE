# Makeup

## Provider metadata
- Category: `Health`
- Provider slug: `makeup`
- Official docs/pages used:
  - `http://makeup-api.herokuapp.com/`
- Current public API base URL: `http://makeup-api.herokuapp.com/api/v1`
- Auth model: no authentication required
- Transport note from official docs: `HTTP`
- Response format: JSON
- Public rate-limit note: no rate-limit policy was published on the reviewed official page
- Manually confirmed route count: `1`

## Authentication and access
- The official page describes the API as public and does not document API keys, bearer tokens, or account setup.
- The reviewed page explicitly says the transport is HTTP and that the API follows REST principles.

## Canonical endpoint
1. `GET /api/v1/products.json` - search makeup products and return matching product records

## Query parameters
The official page documents the following search filters for `GET /api/v1/products.json`:
- `product_type` - makeup type such as lipstick or eyeliner
- `product_category` - sub-category within a product type
- `product_tags` - comma-separated tag list such as `vegan`
- `brand` - brand name
- `price_greater_than` - exclusive lower price bound
- `price_less_than` - exclusive upper price bound
- `rating_greater_than` - exclusive lower rating bound
- `rating_less_than` - exclusive upper rating bound

Official examples shown on the page:
- `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline`
- `http://makeup-api.herokuapp.com/api/v1/products.json?brand=covergirl&product_type=lipstick`

## Response, pagination, and error notes
- The official page says responses are `json`.
- The reviewed official page does not document pagination parameters.
- The reviewed official page does not publish structured error codes or a response schema.

## Usage notes from the official docs
- The official page explicitly says there is currently one API call: search makeup products.
- The page also publishes long enumerations of valid tags, brands, and product types to help with filtering.
- The docs mention that visual representations of the JSON data are available on the site, but they do not expose separate API routes for those lists.

## fireROUTE normalization notes
- Normalize this provider as a single public `GET` collection-search endpoint.
- Preserve the documented filter names exactly because the API is query-driven rather than path-driven.
- Do not infer undocumented item-detail or metadata endpoints from example data pages; the reviewed official page only documents `/api/v1/products.json`.