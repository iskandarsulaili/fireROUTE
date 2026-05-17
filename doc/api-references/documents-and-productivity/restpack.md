# Restpack

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `restpack`
- Docs/pages reviewed manually:
  - `https://restpack.io/`
  - `https://restpack.io/html2pdf`
  - `https://restpack.io/html2pdf/docs`
  - `https://restpack.io/screenshot`
  - `https://restpack.io/screenshot/docs`
  - `https://restpack.io/browsermockup`
  - `https://restpack.io/browsermockup/docs`
- Confirmed API base URL families:
  - `https://restpack.io/api/html2pdf/v7`
  - `https://restpack.io/api/screenshot/v7`
  - `https://restpack.io/api/browsermockup/v1`
  - usage helpers also documented at unversioned paths under `https://restpack.io/api/html2pdf/usage` and `https://restpack.io/api/screenshot/usage`
- Primary exchange formats: query-string or JSON request input with raw PDF/image binary or JSON URL response modes
- Manually confirmed routes in this pass: `8`
- Route-method breakdown confirmed from the current official docs:
  - `5` `GET`
  - `3` `POST`

## What the official docs confirm
- The current Restpack homepage actively markets three documented API products:
  - Screenshot API
  - HTML to PDF API
  - Browser Mockup API
- The reviewed official site did not expose a separate current content-extraction API reference.
- Across the three currently documented products, the official docs expose `8` concrete method+path operations.

## Authentication
From the current official docs for the reviewed Restpack products:
- Authentication token can be passed either as:
  - query parameter `access_token`
  - header `X-Access-Token` / `x-access-token`
- The docs say callers should use a `Direct Access Token` from the account dashboard

## Error notes
From the current official docs:
- `401` -> no access token provided
- `402` -> insufficient account balance for the API call
- `403` -> invalid or revoked access token
- The reviewed docs did not publish one broader shared error-envelope schema beyond these auth/quota errors

## Rate limits and quota notes
- The reviewed docs do not publish a per-second global rate-limit number.
- The official marketing FAQ says requests fail after the plan's request volume is exhausted.
- The HTML-to-PDF and Screenshot products both expose usage-inspection endpoints.

## Request, format, and parameter conventions
From the reviewed product docs:
- HTML to PDF and Screenshot both support:
  - simple `GET` with query-string parameters
  - `POST` with JSON body
  - raw binary response by default
  - `json=true` to receive a JSON object with a CDN URL instead of raw binary output
- Browser Mockup supports:
  - `GET` and `POST` on the same create route
  - `image_url` input
  - `format` output selection (`jpg`, `png`, `pdf`)
  - `json` boolean for URL-response mode
  - margin, grayscale, background, and panel configuration
- HTML to PDF and Screenshot docs both emphasize browser-based rendering and support many rendering parameters via query string / JSON body.

## Important usage notes
- HTML to PDF and Screenshot responses can either stream the final binary directly or return a cached/public CDN URL in JSON mode.
- The HTML to PDF API docs explicitly say raw HTML can be submitted with `POST`, so the source page does not need to be publicly reachable.
- Restpack's homepage FAQ says generated content is not stored permanently for the conversion itself; temporary job context is removed after completion.
- The currently reviewed official site does not expose a separate first-party route reference for a content-extraction product, so only the three currently documented APIs were counted.

## Confirmed route surface summary
The current official docs expose `8` operations across these service families:
- `HTML to PDF API` -> `3`
- `Screenshot API` -> `3`
- `Browser Mockup API` -> `2`

## Exact route inventory confirmed from the current official docs

### HTML to PDF API (`3` routes)
- `GET /api/html2pdf/v7/convert`
- `POST /api/html2pdf/v7/convert`
- `GET /api/html2pdf/usage`

### Screenshot API (`3` routes)
- `GET /api/screenshot/v7/capture`
- `POST /api/screenshot/v7/capture`
- `GET /api/screenshot/usage`

### Browser Mockup API (`2` routes)
- `GET /api/browsermockup/v1/create`
- `POST /api/browsermockup/v1/create`

## Representative parameter notes from the reviewed docs
### HTML to PDF
Representative documented options include:
- `url`
- `json`
- page/layout settings such as `pdf_page`
- media/render controls such as `emulate_media`
- optional CSS/headers/delay/TTL-related controls from the feature docs

### Screenshot
Representative documented options include:
- `url`
- `json`
- render modes such as full page / viewport / element
- output format and thumbnail-related settings
- delay / TTL / custom headers

### Browser Mockup
Representative documented options include:
- `image_url`
- `access_token`
- `format`
- `json`
- `vertical_margin`
- `horizontal_margin`
- `grayscale`
- `background_color`
- `panel_type`

## Integration notes for fireROUTE
- Treat Restpack as a small multi-product provider rather than a single canonical endpoint.
- Preserve binary-vs-JSON response mode controls (`json=true`).
- Keep HTML to PDF and Screenshot route families distinct because their parameters and outputs differ despite similar auth/transport patterns.
- Do not assume a current content-extraction route family unless Restpack republishes first-party docs for it.