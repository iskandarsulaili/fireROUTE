# Google Fonts

## Provider metadata
- Category: `Development`
- Provider slug: `google-fonts`
- Docs used manually:
  - `https://developers.google.com/fonts/docs/developer_api`
  - `https://developers.google.com/fonts/docs/getting_started`
- Confirmed base URL: `https://www.googleapis.com/webfonts/v1`
- Primary response/content types confirmed from the docs: JSON responses containing `kind`, `items`, per-family metadata, and file URLs
- Authentication model confirmed from the docs used in this pass: Google API key passed as the `key` query parameter
- Manually confirmed routes in this pass: `1`

## Authentication
Google Fonts' developer API requires an API key on each request.

Confirmed auth details from the official docs:
- requests identify the application with `key=YOUR_API_KEY`
- the docs explicitly say the API key is safe to embed in URLs and does not require extra encoding
- there is no OAuth flow documented for this API reference page

## Common request/response conventions
- Base URL: `https://www.googleapis.com/webfonts/v1`
- Primary collection route: `/webfonts`
- Response encoding: UTF-8 JSON
- Top-level response shape: an object like `{"kind":"webfonts#webfontList","items":[...]}`
- Each family object can include:
  - `kind`
  - `family`
  - `subsets`
  - `menu`
  - `variants`
  - `version`
  - `axes` when variable-font capability is requested
  - `lastModified`
  - `files`
  - `color_capabilities`
  - `tags` when family-tag capability is requested

## Manually confirmed endpoint set

### 1) List font-family metadata
- Method: `GET`
- Path: `/webfonts`
- Full URL pattern: `https://www.googleapis.com/webfonts/v1/webfonts`
- Purpose: retrieve the metadata catalog for Google Fonts families
- Confirmed query parameters from the official docs:
  - `key` - required API key
  - `family` - filter to a specific font family name
  - `subset` - filter by supported subset/script
  - `category` - filter by `serif`, `sans-serif`, `monospace`, `display`, or `handwriting`
  - `capability` - feature filter / response enrichment, confirmed values include `VF`, `WOFF2`, and `FAMILY_TAGS`
  - `sort` - confirmed values: `alpha`, `date`, `popularity`, `style`, `trending`
- Important notes:
  - default ordering is unspecified unless `sort` is provided
  - `capability=VF` changes variable-font handling and exposes `axes`
  - `capability=WOFF2` requests WOFF2-compressed file URLs
  - `capability=FAMILY_TAGS` populates the `tags` field in family objects

## Pagination
- The official Google Fonts developer API page reviewed in this pass does not document pagination parameters for `/webfonts`.
- The documented contract is a single list response, optionally filtered and sorted through query parameters.

## Error handling
- The reviewed page does not publish a route-specific error table.
- Because this is a Google API-key-backed endpoint, callers should still expect standard Google API HTTP errors for invalid keys, quota exhaustion, or malformed requests, but those were not enumerated on the reviewed Google Fonts page.

## Rate limits
- The reviewed Google Fonts developer API page does not publish numeric request-per-minute or daily quota values.
- Quota enforcement is implied by the requirement to send a Google API key, but the specific limits were not stated on the reviewed page.

## Response format notes
- Response bodies are JSON.
- The main list response contains `items`, each describing one family.
- File download URLs inside the response point at Google-hosted font assets such as `fonts.gstatic.com`.

## Important usage notes
- this API returns metadata, not CSS directly; the docs separately show how to build a Fonts CSS URL from the returned family metadata
- `family`, `subset`, and `category` are filters on the metadata listing route rather than distinct resource paths
- `capability=VF` and `capability=FAMILY_TAGS` materially change the response payload by exposing `axes` and `tags`

## Verification notes
This file was manually rebuilt from Google's official Google Fonts developer documentation with browser inspection, replacing the earlier generated placeholder.
