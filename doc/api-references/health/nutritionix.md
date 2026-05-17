# Nutritionix

## Provider metadata
- Category: `Health`
- Provider slug: `nutritionix`
- Official docs/pages used:
  - `https://developer.nutritionix.com/`
  - `https://docx.syndigo.com/developers/docs/nutritionix-api-guide`
  - `https://docx.syndigo.com/developers/docs/list-of-endpoints`
  - `https://docx.syndigo.com/developers/docs/obtaining-api-keys-and-authenticating-api`
  - `https://docx.syndigo.com/developers/docs/understand-request-headers`
  - `https://docx.syndigo.com/developers/docs/api-errors`
  - `https://docx.syndigo.com/developers/docs/natural-language-for-nutrients`
  - `https://docx.syndigo.com/developers/docs/instant-endpoint`
  - `https://docx.syndigo.com/developers/docs/search-item-endpoint`
  - `https://docx.syndigo.com/developers/docs/natural-language-for-exercise`
  - `https://docx.syndigo.com/developers/docs/photo-upload-api`
- Current public API base URLs published in the reviewed docs:
  - Track API: `https://trackapi.nutritionix.com`
  - Photo Upload API sample host: `https://photoapi-qa.nutritionix.com`
- Auth model: application credentials in request headers
- Primary auth headers from the reviewed docs: `x-app-id`, `x-app-key`
- Additional auth note: the Photo Upload page says to pass `x-app-id` and `x-app-password`, which conflicts with the shared request-header page that documents `x-app-id` and `x-app-key`
- Response format: JSON
- Public rate-limit note: no numeric quota is published on the reviewed pages; the official error list says `401` can also mean usage limits exceeded
- Manually confirmed route count: `5`

## Authentication and access
- The docs say every reviewed `GET` and `POST` endpoint requires authentication.
- The onboarding pages say clients must obtain an `APP ID` and `APP KEY` by signing up through the developer portal.
- The shared request-header page documents:
  - `x-app-id` - required application identifier
  - `x-app-key` - required application key
  - `x-remote-user-id` - optional billing-oriented user identifier; the docs say to set it to `0` in development mode
- The Photo Upload page documents a different second header name, `x-app-password`, so fireROUTE should preserve that discrepancy as an official-doc inconsistency rather than silently normalizing it away.

## Canonical endpoints
1. `POST /v2/natural/nutrients` - parse natural-language food text into nutrient breakdowns
2. `GET /v2/search/instant` - autocomplete/common-and-branded food search
3. `GET /v2/search/item` - fetch branded item nutrition by `upc` or `nix_item_id`
4. `POST /v2/natural/exercise` - estimate calories burned from natural-language exercise text
5. `POST /upload` - upload product photos for Nutritionix review

## Parameters and request-body notes
### Shared headers
- `x-app-id` - required on all reviewed endpoints
- `x-app-key` - required on the Track API endpoint pages
- `x-remote-user-id` - documented as optional on the shared request-header page
- `Content-Type: application/json` - shown on the natural-language Track API examples
- `Content-Type: application/x-www-form-urlencoded` - shown on the `GET /v2/search/item` example
- multipart form body - required on `POST /upload`

### Endpoint-specific inputs
#### `POST /v2/natural/nutrients`
- JSON body field `query` - natural-language food text such as `grape`
- The API guide and premium-parameter section additionally document these inputs for this endpoint:
  - `taxonomy`
  - `claims`

#### `GET /v2/search/instant`
- Query parameter `query` - free-text food search, shown in the example as `hamburger`
- The API guide documents these optional or premium add-on parameters for this endpoint:
  - `detailed`
  - `branded_region`
  - `claims`
  - `claims_query`
  - `taxonomy`
  - `taxonomy_node_id`

#### `GET /v2/search/item`
- Query parameter `upc` - shown in the example as `49000000450`
- The endpoint description also says the route can look up an item by `nix_item_id`

#### `POST /v2/natural/exercise`
- JSON body field `query` - natural-language exercise text such as `swam for 1 hour`
- The endpoint description says developers can optionally include user demographics such as age, gender, and weight for better calorie estimates

#### `POST /upload`
- Multipart body fields documented on the Photo Upload page:
  - `UPC` - required string
  - `remoteUserID` - optional string
  - `frontOfPackage` - required binary image (`image/png` or `image/jpeg`)
  - `nutritionLabel` - required binary image (`image/png` or `image/jpeg`)
  - `ingredientStatement` - optional binary image (`image/png` or `image/jpeg`)

## Response, pagination, and error notes
- The reviewed Track API pages publish JSON responses containing top-level arrays such as `foods` or `exercises`.
- The shared API error page documents these status codes: `400`, `401`, `403`, `404`, `409`, and `500`.
- The `POST /upload` page additionally documents `406`, `413`, and `415` for multipart/body/media failures.
- The upload success response is documented as HTTP `201` with a JSON body containing an upload UUID.
- The reviewed pages do not document page-number, offset, or cursor pagination for the confirmed routes.

## Usage notes from the official docs
- The API guide positions the v2 Track API around calorie intake and calorie expenditure tracking.
- The docs recommend combining `GET /v2/search/instant` with `POST /v2/natural/nutrients` or `GET /v2/search/item` depending on whether the user selected a common food or a branded item.
- The Photo Upload page requires real-time image capture as part of the UX and explicitly says the UPC should be obtained through barcode scanning.
- The Photo Upload page documents a 5 MB maximum file size in its `413 Payload Too Large` example.
- The developer landing page says the old open free-access trial has been curtailed and that new limited trials are handled through direct contact.

## fireROUTE normalization notes
- Normalize this provider as a header-authenticated JSON API with two documented host families: `https://trackapi.nutritionix.com` for Track API routes and `https://photoapi-qa.nutritionix.com` for the reviewed upload route.
- Keep `query`, `upc`, `nix_item_id`, and the documented premium add-on parameters as first-class route controls.
- Preserve the official header-name inconsistency on the upload flow (`x-app-password` vs. `x-app-key`) for follow-up verification instead of silently collapsing it.
- Treat the provider as non-paginated based on the reviewed docs, and do not infer undocumented list pagination.