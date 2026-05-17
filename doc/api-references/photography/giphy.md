# Giphy

## Overview
- Provider: GIPHY API
- Category: Photography
- Official docs: `https://developers.giphy.com/docs/`
- Official endpoint reference inspected: `https://developers.giphy.com/docs/api/endpoint/`
- Base URLs published on the inspected docs:
  - content API: `https://api.giphy.com/v1/`
  - emoji API: `https://api.giphy.com/v2/`
  - upload API: `https://upload.giphy.com/v1/`
  - analytics pingback URL family: `https://giphy-analytics.giphy.com/v2/`
- Auth: required API key via the `api_key` query parameter
- HTTPS: yes
- Response format: JSON for API responses; the upload endpoint returns JSON metadata; analytics uses a pingback URL rather than a normal content payload
- Pagination: supported on list/search endpoints with `limit` and `offset`
- Rate limits:
  - beta keys are limited to `100` API calls per hour according to the inspected docs
  - beta keys are limited to `10` uploads per day on the upload endpoint
  - higher limits require production approval from the GIPHY dashboard

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v1/gifs/trending` | `api_key`; optional `limit`, `offset`, `rating`, `random_id`, `bundle`, `country_code`, `region`, `remove_low_contrast` | Trending GIF feed. Docs say this call must be made client-side. |
| GET | `/v1/stickers/trending` | same as GIF trending | Trending sticker feed. |
| GET | `/v1/gifs/search` | `api_key`, `q`; optional `limit`, `offset`, `rating`, `lang`, `random_id`, `bundle`, `country_code`, `region`, `remove_low_contrast` | Search GIFs. Query length max `50` chars. |
| GET | `/v1/stickers/search` | same as GIF search | Search stickers. |
| GET | `/v1/gifs/translate` | `api_key`, `s`; optional `rating`, `random_id`, `country_code`, `region` | Single best-match GIF for a phrase. |
| GET | `/v1/stickers/translate` | same as GIF translate | Single best-match sticker. |
| GET | `/v1/gifs/random` | `api_key`; optional `tag`, `rating`, `random_id`, `country_code`, `region` | Random GIF, optionally tag-filtered. |
| GET | `/v1/stickers/random` | same as GIF random | Random sticker. |
| POST | `/v2/pingback_simple` | `analytics_response_payload`, `action_type`, plus timestamp and `random_id` in the built pingback URL | Action Register / analytics endpoint for `SEEN`, `CLICK`, and `SENT` events. Host is `giphy-analytics.giphy.com`, not `api.giphy.com`. |
| GET | `/v1/randomid` | `api_key` | Generates a privacy-preserving per-user random ID. |
| GET | `/v2/emoji` | optional `limit`, `offset` | Returns the GIPHY Emoji set. The inspected docs do not show an `api_key` field on this section. |
| GET | `/v2/emoji/{gif_id}/variations` | path `gif_id` | Returns emoji skin-tone / style variations for an emoji GIF. |
| GET | `/v1/gifs/{gif_id}` | `api_key`; path `gif_id`; optional `random_id`, `rating`, `country_code`, `region` | Get one GIF by ID. |
| GET | `/v1/gifs` | `api_key`, `ids`; optional `random_id`, `rating`, `country_code`, `region` | Get multiple GIFs by comma-separated IDs; docs say max `100` GIF IDs. |
| POST | `/v1/gifs` | `api_key`; optional `username`, `file`, `source_image_url`, `tags`, `source_post_url`, `country_code`, `region` | Upload endpoint on `upload.giphy.com`; accepts GIFs or video files up to `100MB`. |
| GET | `/v1/gifs/categories` | `api_key` | Lists GIF categories. |
| GET | `/v1/gifs/search/tags` | `api_key`, `q`; optional `limit`, `offset` | Autocomplete endpoint for tag completion. |
| GET | `/v1/channels/search` | `api_key`, `q`; optional `limit`, `offset` | Channel search endpoint. |
| GET | `/v1/tags/related/{term}` | `api_key`; path `term` | Search-suggestion endpoint for related terms. |
| GET | `/v1/trending/searches` | `api_key` | Returns trending search terms. |

Confirmed route count: **20**.

## Parameter and behavior notes
- Shared auth parameter: `api_key`.
- Shared pagination fields on list/search endpoints: `limit` and `offset`.
- Shared personalization/localization fields across many content endpoints: `rating`, `random_id`, `country_code`, and `region`.
- Search-specific controls:
  - `q` for `/search`
  - `lang` for `/search`
  - query length maximum `50` characters
- Translate uses `s` instead of `q`.
- Random uses `tag`.
- Rendition filtering is available through `bundle` on supported feed/search endpoints.
- The docs note that GIPHY uses `random_id` to tailor results without exposing the user's identity.

## Response and error notes
- Success payloads use `data`, `pagination` when applicable, and `meta` objects.
- Documented response codes on the inspected docs page:
  - `200 OK`
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `414 URI Too Long`
  - `429 Too Many Requests`
- The GIF-by-ID section explicitly says that a rating mismatch can return an empty `data` array with a `meta` object containing a 4xx code.

## Important usage notes
- The docs explicitly say Trending and Search API calls must be made from the client side.
- GIPHY requires attribution: integrations must display “Powered by GIPHY”.
- Production upgrades are handled through the developer dashboard and may involve pricing review.
- Uploads from rate-limited keys cannot specify a GIPHY channel username unless the app has been approved for production access.
- The Action Register flow is not a standard search/content route; it uses analytics URLs returned inside GIF payloads and then appends a timestamp and random ID.

## fireROUTE integration notes
- Model GIPHY as four surfaces: search/feed retrieval, ID lookup, upload, and analytics pingbacks.
- Keep GIF and sticker endpoints separate even when parameter sets match, because the docs publish them as separate URLs.
- Treat `random_id`, `rating`, and location fields as first-class optional parameters for personalization/compliance-sensitive adapters.
- Do not assume the emoji endpoints use the exact same auth contract as the v1 GIF endpoints; the inspected emoji section omitted the `api_key` field even though most of the API requires one.

## Sources inspected
- `https://developers.giphy.com/docs/`
- `https://developers.giphy.com/docs/api/`
- `https://developers.giphy.com/docs/api/endpoint/`
- `https://developers.giphy.com/docs/api/schema/`
