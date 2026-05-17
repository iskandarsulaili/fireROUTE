# Contentful Images

## Provider metadata
- Category: `Development`
- Provider slug: `contentful-images`
- Docs used manually:
  - `https://www.contentful.com/developers/docs/references/images-api/`
- Confirmed REST API base URLs:
  - `https://images.ctfassets.net`
  - `https://images.eu.ctfassets.net` for EU data residency customers
- Confirmed path template surfaced in the official docs page's rendered examples: `/{space_id}/{asset_id}/{unique_id}/{name}`
- Primary media type: image bytes
- Authentication model surfaced in docs: no Images-API-specific auth is documented for retrieval; the reviewed page treats the image URL itself as the retrievable resource and points to the CMA docs for upload/deletion workflows
- Manually confirmed routes in this pass: `1`

## Authentication
From the reviewed official Images API reference:
- this is a read-only delivery API
- the page does **not** document an `Authorization` header, API key, or OAuth flow for direct image retrieval
- the retrievable resource is the asset's existing `file.url` value from Contentful asset metadata
- upload and deletion are explicitly delegated to other Contentful APIs, especially the CMA asset documentation

## Common request/response conventions
- Base delivery host: `https://images.ctfassets.net`
- EU delivery host: `https://images.eu.ctfassets.net`
- The official page instructs you to start from an asset's `file.url` and append transformation query parameters
- The documented path pattern is asset-specific rather than a generic collection route: `/{space_id}/{asset_id}/{unique_id}/{name}`
- Responses are image payloads, not JSON envelopes
- The reviewed surface is parameter-driven: one retrieval path family plus optional transformation parameters
- The page states uploaded images over `100 MB` are treated as generic assets and the Images API transformation features do not apply

## Manually confirmed endpoint set

### 1) Retrieve an original or transformed image asset
- Method: `GET`
- Path template: `/{space_id}/{asset_id}/{unique_id}/{name}`
- Full URL pattern: `https://images.ctfassets.net/{space_id}/{asset_id}/{unique_id}/{name}`
- Alternate EU pattern: `https://images.eu.ctfassets.net/{space_id}/{asset_id}/{unique_id}/{name}`
- Purpose: fetch the original asset image or a transformed derivative by adding query parameters
- Path variables confirmed from the official page's rendered URI templates:
  - `space_id` - alphanumeric space identifier
  - `asset_id` - asset identifier
  - `unique_id` - asset-specific cache/hash segment used in the published URL
  - `name` - original filename
- Query parameters confirmed from the official page's rendered URI templates and prose:
  - `fm` - output format; reviewed possible values: `jpg`, `png`, `webp`, `gif`, `avif`, `tiff`
  - `fl` - format flags; official examples on the page include `progressive` for progressive JPEGs and `png8` for 8-bit PNG output
  - `w` - width in pixels
  - `h` - height in pixels
  - `fit` - resizing mode; reviewed values: `pad`, `fill`, `scale`, `crop`, `thumb`
  - `f` - focus area for `pad`, `fill`, `crop`, or `thumb`; reviewed values include `center`, `top`, `right`, `left`, `bottom`, `top_right`, `top_left`, `bottom_right`, `bottom_left`, `face`, `faces`
  - `r` - corner radius in pixels, or `max` for full circle/ellipse cropping
  - `q` - quality percentage from `1` to `100`
  - `bg` - background color, documented as RGB values like `rgb:9090ff`
- Important parameter rules confirmed on the official page:
  - `w` and `h` each have a maximum allowed value of `4000`
  - `fit=pad` uses the background color as padding color
  - focus area defaults to `center`
  - rounded-corner background defaults to white for JPEGs and transparent for PNG/WebP unless pad-mode JPEG behavior overrides it
  - AVIF conversion is additionally limited to source images up to `9` megapixels
- Officially documented behavior notes:
  - omitting transformation params returns the original asset file
  - the default output format is the original format
  - 8-bit PNG output is intended for simple graphics such as icons or logos
  - progressive JPEG returns a progressively rendered JPEG

## Pagination
- none documented
- this is an asset-delivery endpoint family, not a list/search API

## Rate limits
- no numeric rate-limit policy is published on the reviewed Images API page
- no delivery-specific quota headers were documented on the reviewed page

## Error and response notes
- the reviewed page focuses on successful image delivery and transformation parameters rather than a structured error schema
- successful responses are image bytes in the requested or inferred format
- the page explicitly notes that images over `100 MB` do not support Images API transformations
- deletion is not handled by this API surface; the page points to CMA asset documentation instead

## Important usage notes
- the canonical integration pattern is: fetch an asset's `file.url`, then append transformation query parameters as needed
- the route is asset-specific; fireROUTE should not invent collection/list operations for this provider
- for format conversion and manipulation, the query string is the entire API surface
- AVIF support exists, but with the additional `9` megapixel source-image limit documented on the official page
- the deletion section of the reviewed page does not expose a delete route here; it redirects users to CMA documentation

## Verification notes
This file was manually rebuilt from the official Contentful Images API reference using browser inspection, including the page's rendered prose and URI-template snippets embedded in the official document.