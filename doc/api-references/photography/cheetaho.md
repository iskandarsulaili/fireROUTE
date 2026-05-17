# CheetahO

## Overview
- Provider: CheetahO
- Category: Photography
- Official docs: `https://cheetaho.com/docs/getting-started/`
- Base URL: `https://api.cheetaho.com/api/v2/media/optimization`
- Auth: API key required; the getting-started page tells users to obtain the key from the `API Credentials` section after signup
- HTTPS: yes
- Response format: JSON success/error payloads are shown on the official getting-started page
- Pagination: none documented
- Rate limits: no numeric public rate limit was visible on the inspected docs page

## Confirmed route pattern
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET / POST | `/api/v2/media/optimization` | API key plus method-specific image input fields | The getting-started page says images can be optimized in two ways and the same docs set links to optimization variants such as lossless, lossy, quality, WebP, and resizing. |

Confirmed route count: **1**.

## Confirmed behavior and parameter notes
- The getting-started page says CheetahO supports `JPEG`, `PNG`, and `GIF` image optimization.
- The same page says optimization is available in two modes:
  - optimizing an image from the internet / production URL input
  - on-the-fly processing of local user uploads / development uploads
- The visible docs snapshot confirms an authenticated account setup flow and references an `API Credentials` page for the key.
- Public docs navigation also exposes dedicated pages for `Lossless Image Optimization`, `Lossy Image Optimization`, `Custom Image Quality`, `WebP Compression`, and `Image Resizing`, indicating that these are option sets layered onto the same optimization API rather than separate public base URLs.

## Response and error notes
- The official getting-started page shows a success response with top-level `data.items[]` and `transaction_id` fields.
- Each returned item in the visible example includes `original_size`, `optimized_size`, `saved_bytes`, `saved_percent`, `url`, `optimization_status`, `web_p_url`, `valid_till`, `message`, `width`, and `height`.
- The same page also shows an error envelope shaped like `error.type` plus `error.message[]` validation details.
- The docs navigation includes a dedicated `HTTP Response Status Codes` page, but the accessible browser view in this run did not expose the status-code table contents directly.

## Important usage notes
- Treat CheetahO as a single optimization endpoint with multiple processing modes/options rather than many separate REST resources.
- Because the visible example payload includes `valid_till`, downstream integrations should assume optimized asset URLs may be time-bounded.
- The official docs reviewed in this run did not expose a public pagination model.

## Sources inspected
- `https://cheetaho.com/docs/getting-started/`
- `https://cheetaho.com/docs/lossless-image-optimization/`
- `https://cheetaho.com/docs/custom-image-quality/`
- `https://cheetaho.com/docs/http-response-status-codes/`
