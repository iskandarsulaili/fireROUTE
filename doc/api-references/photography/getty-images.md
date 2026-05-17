# Getty Images

## Overview
- Provider: Getty Images API
- Category: Photography
- Official docs: `https://developers.gettyimages.com/`
- Base URLs:
  - `https://api.gettyimages.com/` for content/search/download/asset-change/AI routes
  - `https://authentication.gettyimages.com/` for OAuth 2.0 authorization and token issuance
- Auth:
  - every inspected API example uses `Api-Key: <YOUR_API_KEY>`
  - protected routes also use `Authorization: Bearer <YOUR_ACCESS_TOKEN>`
  - Getty documents OAuth 2.0 authorization-code and client-credentials grants
- HTTPS: yes
- Response format: JSON for API responses; some download flows end in binary/image delivery or redirect/download URLs
- Pagination:
  - no generic page/limit scheme was documented on the inspected Getty pages
  - asset-change consumption is batch/checkpoint based rather than page based
  - AI generation/download uses polling rather than page-based pagination
- Rate limits:
  - no public numeric quota was documented on the inspected pages
  - the authorization docs say unnecessary token requests count against customer rate limits
  - the AI docs say `429 Too Many Requests` can mean either rate-limit pressure or too many concurrent pending generations and recommend retrying after about 1 second

## Confirmed endpoints
### OAuth 2.0
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/oauth2/auth` | `client_id`, `response_type=code`, `redirect_uri`, optional `state`, `code_challenge`, `code_challenge_method` | Authorization-code entrypoint on `authentication.gettyimages.com`. |
| POST | `/oauth2/token` | form `grant_type`, `client_id`, optional `client_secret` depending on client type, plus grant-specific fields | Token endpoint used for authorization-code, refresh-token, and client-credentials grants. |

### Search and download
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v3/search/images/creative` | query `phrase`; `Api-Key`; optional bearer token | Search example shown on the official Search page. |
| GET | `/v3/search/images` | query `phrase`, `fields`; `Api-Key`; bearer token in getting-started example | Search example used in the getting-started workflow. |
| POST | `/v3/downloads/images/{id}` | path image ID; query `product_type`, optional `auto_download=false`; `Api-Key`; bearer token | Download endpoint returns a redirect by default or JSON with a download URI when `auto_download=false`. |

### Asset Changes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/v3/asset-changes/channels` | bearer auth | Retrieve the client's channel list; docs recommend caching because channels are stable. |
| PUT | `/v3/assets/asset-changes/change-sets` | channel ID, batch size, bearer auth | Request the next batch of asset changes and receive a change-set identifier. |
| DELETE | `/v3/asset-changes/change-sets/{change-set-id}` | path `change-set-id`; bearer auth | Confirm that a previously received change set was processed. |

### Generative AI
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v3/ai/image-generations` | JSON body with `prompt` and optionally `aspect_ratio`; `Api-Key`; bearer token | Starts image generation. Docs say the first response may be `202 Accepted`. |
| GET | `/v3/ai/image-generations/{generationRequestId}` | path `generationRequestId`; `Api-Key`; bearer token | Poll until `200 OK` or `202 Accepted` changes to a final result. |
| GET | `/v3/ai/image-generations/{generationRequestId}/images/{index}/download-sizes` | path `generationRequestId`, `index`; auth headers | Lists available download sizes for a generated image. |
| PUT | `/v3/ai/image-generations/{generationRequestId}/images/{index}/download` | path IDs; JSON body `size_name`; auth headers | Starts a generated-image download job; initial success is `202`. |
| GET | `/v3/ai/image-generations/{generationRequestId}/images/{index}/download` | path IDs; auth headers | Poll download completion until `200` returns the final URL and generated asset ID. |

### OAuth grant variants confirmed on the docs
The same `/oauth2/token` route is explicitly documented for these grant types:
- `grant_type=authorization_code`
- `grant_type=refresh_token`
- `grant_type=client_credentials`

Confirmed route count: **15**.

## Auth and token notes
- Getty supports OAuth 2.0 authorization code and client credentials.
- Authorization-code flow uses PKCE fields `code_challenge`, `code_challenge_method`, and later `code_verifier`.
- Authorization-code token responses include:
  - `access_token`
  - `token_type`
  - `expires_in`
  - `refresh_token`
- Client-credentials token responses include:
  - `access_token`
  - `token_type`
  - `expires_in`
- Authorization-code access tokens are documented as valid for at most `30` minutes.
- Refresh tokens are documented as valid for `1` year.
- Client-credentials tokens are also documented as valid for at most `30` minutes.

## Parameter and workflow notes
### Search and download
- The Search page's public example uses:
  - `GET https://api.gettyimages.com/v3/search/images/creative?phrase=kittens`
  - header `Api-Key: <YOUR_API_KEY>`
- The getting-started page's workflow example uses:
  - `GET /v3/search/images?phrase=Kitties&fields=largest_downloads`
  - `fields=largest_downloads` so the response includes per-image download URIs
- The image download example uses:
  - `POST /v3/downloads/images/{id}?auto_download=false&product_type=easyaccess`
- When `auto_download=false`, the docs show a JSON response containing a `uri` to the actual image delivery location.

### Asset Changes workflow
The Asset Changes page documents a three-step loop:
1. `GET /v3/asset-changes/channels` to discover/cache available channels.
2. `PUT /v3/assets/asset-changes/change-sets` for a channel and batch size to retrieve the next change set.
3. `DELETE /v3/asset-changes/change-sets/{change-set-id}` after processing to acknowledge receipt.

The same page says:
- change notifications carry an `asset_lifecycle` indicating `New`, `Update`, or `Delete`
- clients should treat `New` and `Update` like upserts
- if a change set is not confirmed, Getty will return the same batch again

### Generative AI workflow
The AI pages document a polling model:
- initial generation call: `POST /v3/ai/image-generations`
- poll status/result: `GET /v3/ai/image-generations/{generationRequestId}`
- initial generated-image download request: `PUT /v3/ai/image-generations/{generationRequestId}/images/{index}/download`
- poll generated-image download result: `GET /v3/ai/image-generations/{generationRequestId}/images/{index}/download`
- list available generated-image download sizes: `GET /v3/ai/image-generations/{generationRequestId}/images/{index}/download-sizes`

The AI docs explicitly recommend:
- wait at least 1 second between polling requests
- expect up to about 60 seconds before generated images are ready
- handle `202 Accepted` as pending and `200 OK` as complete

## Response and error notes
- Search responses are JSON and include fields such as `result_count` and item arrays like `images`.
- When downloading Getty-licensed images via `/v3/downloads/images/{id}`:
  - default behavior is a `302` redirect to the image download
  - with `auto_download=false`, Getty returns JSON containing a `uri`
- Getty's example image delivery headers include:
  - `content-length`
  - `content-type`
  - `content-disposition`
- AI generation polling examples show:
  - `202` with `{ "generation_request_id": "..." }` while processing
  - `200` with `results`, `preview_urls`, and optional `original_asset`
- AI generated-download polling examples end with:
  - `200` and JSON containing `url` and `generated_asset_id`
- The AI docs explicitly document `429 Too Many Requests` and recommend retrying after about one second.

## Important usage notes
- Getty's authorization docs warn that repeated unnecessary token requests count against rate limits, so tokens should be reused until expiry.
- Redirect URIs for authorization-code clients must be registered, except for documented loopback localhost/127.0.0.1 development cases.
- Asset Changes channel layout changed in March 2025: channels are now combined by asset type/family rather than split by lifecycle.
- Getty's AI features are license-restricted; the docs say access is limited to customers/partners with an AI Generation agreement.
- The public docs homepage links to Swagger, but in this review the static documentation pages were the reliable official source used for the confirmed routes above.

## fireROUTE integration notes
- Model Getty as a dual-host provider: `authentication.gettyimages.com` for OAuth and `api.gettyimages.com` for operational routes.
- Treat `Api-Key` as mandatory on all inspected operational calls, with bearer auth layered on top where protected content or user/license context is required.
- Handle image-download routes differently from ordinary JSON endpoints because Getty may respond with redirects or opaque delivery URLs.
- Model Asset Changes as a checkpoint/acknowledgement workflow instead of cursor pagination.
- Model AI generation and AI download as asynchronous polling workflows with `202` pending states.

## Sources inspected
- `https://developers.gettyimages.com/`
- `https://developers.gettyimages.com/docs/authorization/`
- `https://developers.gettyimages.com/docs/search/`
- `https://developers.gettyimages.com/docs/gettingstarted/`
- `https://developers.gettyimages.com/asset-change/`
- `https://developers.gettyimages.com/ai-generation/`
- `https://developers.gettyimages.com/ai-generation/downloads/`
