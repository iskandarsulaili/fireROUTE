# Shutterstock

## Overview
- Provider: Shutterstock API Reference
- Category: Photography
- Official docs: `https://api-reference.shutterstock.com/`
- Primary base URL: `https://api.shutterstock.com/v2`
- Additional official sandbox base URL seen in the docs: `https://api-sandbox.shutterstock.com/v2`
- Auth:
  - most endpoints use OAuth 2.0 bearer tokens via `Authorization: Bearer <token>`
  - some read-only endpoints that do not require customer-specific scopes accept HTTP basic auth with `consumer_key:consumer_secret`
  - OAuth helper routes and the `/v2/test*` routes do not require auth
- HTTPS: yes
- Response format: JSON
- Pagination and search notes:
  - standard commercial search/list endpoints commonly use `page` and `per_page`
  - search responses include fields such as `page`, `per_page`, `total_count`, `search_id`, and `data`
  - editorial search/livefeed flows use `cursor` and/or country-aware filters rather than only page-based pagination
  - collection and contributor listings also use paginated list parameters
- Rate limits:
  - the docs state every application has a requests-per-minute quota
  - over-limit responses return HTTP `429` with JSON fields including `message`, `limit`, `remaining`, and `reset`
  - response headers expose `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`
  - the public docs do not publish one universal numeric quota; they say to contact Shutterstock for higher limits

## Confirmed endpoints

### OAuth helpers and test routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/oauth/authorize` | `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`, optional `realm` | Start the OAuth authorization-code flow. No auth required. |
| POST | `/oauth/access_token` | body varies by flow: `client_id`, `client_secret`, `grant_type`, plus `code`/`redirect_uri` or `refresh_token`/`user_id` | Exchange auth codes for tokens or refresh expiring tokens. No auth required. |
| GET | `/test` | optional `text` | Echo endpoint for connectivity checks. No auth required. |
| GET | `/test/validate` | required `id`; optional repeated `tag` | Validation/example endpoint. No auth required. |

### User and subscription routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/user` | none | Current authenticated user details. |
| GET | `/user/access_token` | none | Inspect the active access token details. |
| GET | `/user/subscriptions` | none | List the caller's Shutterstock API subscriptions. |

### Images
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/images/search` | search filters including `query`, `page`, `per_page`, `sort`, `view`, `language`, date filters, aspect-ratio filters, safe/license filters | Main commercial image search route. |
| GET | `/images/search/suggestions` | required `query`; optional `limit` | Suggest keywords for an image search term. |
| POST | `/images/search/suggestions` | text-analysis request body | Convert free text into suggested image keywords. |
| GET | `/images/categories` | optional `language` | List image categories. |
| GET | `/images/{id}/similar` | path `id`; optional `language`, `page`, `per_page`, license/view filters | Find similar images for one image. |
| GET | `/images/recommendations` | required repeated `id`; optional `max_items`, `safe` | Get recommended images from one or more seed IDs. |
| GET | `/images/updated` | `start_date`/`end_date` or `interval`; optional `page`, `per_page` | List images changed in a time window. |
| POST | `/bulk_search/images` | bulk-search body using the same search filters as `/images/search` | Run multiple image searches in one request. |
| GET | `/images` | required repeated `id`; optional `search_id`, `view` | Batch detail lookup for one or more images. |
| GET | `/images/{id}` | path `id`; optional `language`, `search_id`, `view` | Get full details for one image. |
| POST | `/images/licenses` | licensing fields such as `subscription_id`, `size`, `search_id`, optional deprecated `format` | License one or more commercial images. |
| GET | `/images/licenses` | filters such as `image_id`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List image licenses. |
| POST | `/images/licenses/{id}/downloads` | path `id` | Download or re-download a licensed image. |
| POST | `/images/collections` | collection creation body | Create an image collection. |
| GET | `/images/collections` | optional `embed`, `page`, `per_page` | List the caller's image collections. |
| GET | `/images/collections/{id}` | path `id`; optional `embed`, `share_code` | Get one image collection. |
| POST | `/images/collections/{id}` | path `id`; rename/update body | Rename an image collection. |
| DELETE | `/images/collections/{id}` | path `id` | Delete an image collection. |
| POST | `/images/collections/{id}/items` | path `id`; body with item IDs | Add images to a collection. |
| GET | `/images/collections/{id}/items` | path `id`; optional `page`, `per_page` | List items in an image collection. |
| DELETE | `/images/collections/{id}/items` | path `id`; repeated `item_id` | Remove images from a collection. |

### Videos
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/videos/search` | search filters including `query`, `page`, `per_page`, `sort`, `view`, date filters, duration filters, `aspect_ratio`, license filters | Main commercial video search route. |
| GET | `/videos/search/suggestions` | required `query`; optional `limit` | Suggest keywords for a video search term. |
| GET | `/videos/{id}/similar` | path `id`; optional `language`, `page`, `per_page`, view filters | Find similar videos. |
| GET | `/videos/updated` | `start_date`/`end_date` or `interval`; optional `page`, `per_page` | List recently updated videos. |
| GET | `/videos` | required repeated `id`; optional `search_id`, `view` | Batch detail lookup for videos. |
| GET | `/videos/{id}` | path `id`; optional `language`, `search_id`, `view` | Get one video's details. |
| GET | `/videos/categories` | optional `language` | List video categories. |
| POST | `/videos/licenses` | `subscription_id`, `size`, `search_id` | License commercial videos. |
| GET | `/videos/licenses` | filters such as `license`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List video licenses. |
| POST | `/videos/licenses/{id}/downloads` | path `id` | Download/re-download a licensed video; docs note returned links are valid for 8 hours. |
| POST | `/videos/collections` | collection creation body | Create a video collection. |
| GET | `/videos/collections` | optional `embed`, `page`, `per_page` | List video collections. |
| GET | `/videos/collections/{id}` | path `id`; optional `embed`, `share_code` | Get one video collection. |
| POST | `/videos/collections/{id}` | path `id`; rename/update body | Rename a video collection. |
| DELETE | `/videos/collections/{id}` | path `id` | Delete a video collection. |
| POST | `/videos/collections/{id}/items` | path `id`; body with video IDs | Add videos to a collection. |
| GET | `/videos/collections/{id}/items` | path `id`; optional `page`, `per_page` | List items in a video collection. |
| DELETE | `/videos/collections/{id}/items` | path `id`; repeated `item_id` | Remove videos from a collection. |

### Audio tracks
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/audio/search` | search filters such as `query`, `artists`, `genres`, `moods`, `instruments`, `bpm_from`, `bpm_to`, `duration_from`, `duration_to`, `page`, `per_page` | Search music tracks. |
| GET | `/audio/genres` | optional `language` | List audio genres. |
| GET | `/audio/instruments` | optional `language` | List audio instruments. |
| GET | `/audio/moods` | optional `language` | List audio moods. |
| GET | `/audio` | required repeated `id`; optional `search_id`, `view` | Batch detail lookup for tracks. |
| GET | `/audio/{id}` | path `id`; optional `search_id`, `view` | Get one track's details. |
| POST | `/audio/licenses` | licensing fields such as `license`, `search_id` | License music tracks. |
| GET | `/audio/licenses` | filters such as `audio_id`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List audio licenses. |
| POST | `/audio/licenses/{id}/downloads` | path `id` | Download/re-download a licensed track. |
| POST | `/audio/collections` | collection creation body | Create an audio collection. |
| GET | `/audio/collections` | optional `embed`, `page`, `per_page` | List audio collections. |
| GET | `/audio/collections/{id}` | path `id`; optional `embed`, `share_code` | Get one audio collection. |
| POST | `/audio/collections/{id}` | path `id`; rename/update body | Rename an audio collection. |
| DELETE | `/audio/collections/{id}` | path `id` | Delete an audio collection. |
| POST | `/audio/collections/{id}/items` | path `id`; body with track IDs | Add tracks to a collection. |
| GET | `/audio/collections/{id}/items` | path `id`; optional `page`, `per_page` | List items in an audio collection. |
| DELETE | `/audio/collections/{id}/items` | path `id`; repeated `item_id` | Remove tracks from a collection. |

### Sound effects
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/sfx/search` | search filters such as `query`, `duration_from`, `duration_to`, date filters, `page`, `per_page`, `library` | Search sound effects. |
| GET | `/sfx/{id}` | path `id`; optional `language`, `library`, `search_id` | Get one sound effect. |
| GET | `/sfx` | required repeated `id`; optional `language`, `library`, `search_id`, `view` | Batch detail lookup for sound effects. |
| GET | `/sfx/licenses` | filters such as `license`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List sound-effect licenses. |
| POST | `/sfx/licenses` | licensing body | License one or more sound effects. |
| POST | `/sfx/licenses/{id}/downloads` | path `id` | Download/re-download a licensed sound effect. |

### Editorial images and livefeeds
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/editorial/images/search` | required `country`; optional `category`, `cursor`, date filters, `sort`, `view` | Search editorial images. |
| GET | `/editorial/images/updated` | required `country`; update-window filters such as `date_updated_start`, `date_updated_end` | List updated editorial image content. |
| GET | `/editorial/images/categories` | none | List editorial image categories. |
| GET | `/editorial/images/{id}` | required `country`; path `id` | Get one editorial image. |
| GET | `/editorial/images` | required `country` and repeated `id`; optional `search_id` | Batch detail lookup for editorial images. |
| GET | `/editorial/images/licenses` | filters such as `image_id`, `license`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List editorial image licenses. |
| POST | `/editorial/images/licenses` | licensing body | License editorial images. |
| GET | `/editorial/images/livefeeds` | required `country`; optional `page`, `per_page` | List editorial livefeeds. |
| GET | `/editorial/images/livefeeds/{id}` | required `country`; path `id` | Get one editorial livefeed. |
| GET | `/editorial/images/livefeeds/{id}/items` | required `country`; path `id` | Get items from one editorial livefeed. |

### Deprecated legacy editorial-image routes still published in the reference
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/editorial/{id}` | required `country`; path `id`; optional `search_id` | Deprecated legacy detail route. |
| POST | `/editorial/licenses` | licensing body | Deprecated legacy editorial licensing route. |
| GET | `/editorial/livefeeds` | required `country`; optional `page`, `per_page` | Deprecated legacy livefeed list route. |
| GET | `/editorial/livefeeds/{id}` | required `country`; path `id` | Deprecated legacy livefeed detail route. |
| GET | `/editorial/livefeeds/{id}/items` | required `country`; path `id` | Deprecated legacy livefeed-items route. |
| GET | `/editorial/search` | required `country`; optional `category`, `cursor`, date filters, `sort`, `view` | Deprecated legacy editorial search route. |
| GET | `/editorial/categories` | none | Deprecated legacy editorial categories route. |
| GET | `/editorial/updated` | required `country`; update-window filters | Deprecated legacy editorial updated-content route. |

### Editorial video
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/editorial/videos/search` | required `country`; optional `category`, `cursor`, date filters, `sort`, `view` | Search editorial videos. |
| GET | `/editorial/videos/categories` | none | List editorial video categories. |
| GET | `/editorial/videos/{id}` | required `country`; path `id`; optional `search_id` | Get one editorial video. |
| GET | `/editorial/videos` | required `country` and repeated `id`; optional `search_id` | Batch detail lookup for editorial videos. |
| GET | `/editorial/videos/licenses` | filters such as `license`, `start_date`, `end_date`, `download_availability`, `page`, `per_page` | List editorial video licenses. |
| POST | `/editorial/videos/licenses` | licensing body | License editorial videos. |

### Computer vision
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/cv/images` | upload body/file payload | Upload an image for CV-powered matching/keywording. |
| GET | `/cv/similar/images` | required `asset_id`; optional `language`, `license`, `page`, `per_page`, `view` | Find visually similar images from an uploaded or existing asset. |
| GET | `/cv/similar/videos` | required `asset_id`; optional `language`, `license`, `page`, `per_page`, `view` | Find visually similar videos. |
| GET | `/cv/keywords` | required `asset_id` | Get suggested keywords from an uploaded or existing asset. |

### Catalog
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/catalog/search` | filters such as `asset_type`, `collection_id`, `page`, `per_page` | Search the catalog-collection surface for assets. |
| GET | `/catalog/collections` | optional `page`, `per_page`, `shared` | List catalog collections. |
| POST | `/catalog/collections` | collection creation body | Create a catalog collection. |
| PATCH | `/catalog/collections/{collection_id}` | path `collection_id`; metadata body | Update catalog collection metadata. |
| DELETE | `/catalog/collections/{collection_id}` | path `collection_id` | Delete a catalog collection. |
| POST | `/catalog/collections/{collection_id}/items` | path `collection_id`; body with asset items | Add items to a catalog collection. |
| DELETE | `/catalog/collections/{collection_id}/items` | path `collection_id`; body/query identifying items | Remove items from a catalog collection. |

### Contributors
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/contributors` | required repeated `id` | Batch contributor lookup. |
| GET | `/contributors/{contributor_id}` | path `contributor_id` | Get one contributor. |
| GET | `/contributors/{contributor_id}/collections` | path `contributor_id`; optional `sort` | List a contributor's collections. |
| GET | `/contributors/{contributor_id}/collections/{id}` | path `contributor_id`, `id` | Get one contributor collection. |
| GET | `/contributors/{contributor_id}/collections/{id}/items` | path `contributor_id`, `id`; optional `page`, `per_page` | List items in a contributor collection. |

Confirmed route count: **109** total documented method/path combinations.
- Current non-deprecated routes: **101**
- Deprecated legacy editorial-image routes still present in the docs: **8**

## Auth and parameter notes
- The docs describe OAuth 2.0 as the default auth method for all endpoints and basic auth as a limited fallback for some endpoints that do not need user-specific scopes.
- Endpoints that require OAuth scopes do not accept basic auth.
- OAuth token generation can happen either from the account UI or programmatically through `/oauth/authorize` plus `/oauth/access_token`.
- Refresh requests to `/oauth/access_token` use `grant_type=refresh_token` and pass `refresh_token` plus either `client_secret` or `user_id`.
- Commercial licensing routes repeatedly reference `subscription_id`, `search_id`, media size/license choices, and sometimes historical/deprecated format fields.
- Editorial routes consistently require a three-letter ISO 3166 alpha-3 `country` code.
- Detail/list-by-ID routes widely use repeated `id` query parameters instead of nested request bodies.
- Collection routes across images, videos, and audio share the same pattern: create/list/get/rename/delete plus item add/list/remove.
- Computer-vision routes key on `asset_id`, which may be either an existing Shutterstock asset ID or an upload ID returned by `/cv/images`.

## Error, response, and pagination notes
- Successful calls return `200`, `201`, or `204` depending on the route.
- The docs show JSON error responses for standard failures, for example validation errors with an `errors` array containing `code`, `message`, and `path`.
- Common documented HTTP failures include `400`, `401`, `403`, `404`, `429`, and `500`.
- Licensing endpoints have an important special case: some licensing failures return HTTP `200` with per-item error data in the response body instead of a non-2xx status.
- Standard commercial search responses include a root-level paging envelope and a `search_id` that should be preserved for related detail/licensing actions.
- The reference explicitly documents rate-limit headers: `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`.
- The docs' example 429 body includes `limit`, `remaining`, and a millisecond UTC `reset` timestamp.

## Important usage notes
- The docs repeatedly instruct developers to carry forward `search_id` from search results into downstream detail and licensing requests for attribution/tracking.
- Shutterstock's public docs describe separate API subscriptions from ordinary website subscriptions; licensing through the API depends on having an API subscription and retrieving its ID from `/user/subscriptions`.
- The official reference exposes both production and sandbox hosts; the sandbox examples are specifically shown for image licensing flows.
- Collection-editing and other user-specific operations require OAuth scopes such as the collections-related scopes described in the auth section.
- Editorial discovery behaves differently from commercial search: country restrictions are mandatory, and cursor-based traversal appears in editorial searches/livefeeds.
- The published reference still carries older `/editorial/*` routes alongside the newer `/editorial/images/*` family, so adapter code should prefer the newer names while recognizing the legacy aliases.
- The route surface spans not only stock images but also videos, music tracks, sound effects, editorial feeds, computer-vision helpers, contributor collections, and catalog management.

## fireROUTE integration notes
- Model Shutterstock as a multi-surface provider rather than a single stock-photo search API: commercial media, editorial, CV, user/subscription, contributor, and catalog features are all first-party.
- Treat `/images`, `/videos`, `/audio`, and `/sfx` as parallel families with highly similar search/detail/license patterns.
- Preserve the distinction between commercial and editorial licensing because the docs split their paths, auth expectations, and mandatory parameters.
- Carry `search_id`, `subscription_id`, and `country` through adapters instead of trying to hide them; they are central to the official workflow.
- Prefer the newer `/editorial/images/*` and `/editorial/videos/*` paths for canonical mappings, and keep the deprecated `/editorial/*` routes only as legacy aliases if needed.

## Sources inspected
- `https://api-reference.shutterstock.com/`
- official auth/rate-limit/error sections and per-endpoint reference blocks on the same first-party docs site
