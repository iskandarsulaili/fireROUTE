# Web Series Quotes Generator

## Provider metadata
- Category: `Video`
- Provider slug: `web-series-quotes-generator`
- Official docs pages used:
  - `https://github.com/yogeshwaran01/web-series-quotes`
  - `https://raw.githubusercontent.com/yogeshwaran01/web-series-quotes/main/README.md`
  - `https://raw.githubusercontent.com/yogeshwaran01/web-series-quotes/main/api/main.py`
  - `https://raw.githubusercontent.com/yogeshwaran01/web-series-quotes/main/api/routes/quote.py`
  - `https://raw.githubusercontent.com/yogeshwaran01/web-series-quotes/main/api/routes/image.py`
  - `https://raw.githubusercontent.com/yogeshwaran01/web-series-quotes/main/api/utils/generate_image.py`
- Main API base URL: `https://api.seriesquotes.10cyrilc.me`
- Auth model: none
- Supported request method: `GET`
- Response formats: JSON for quote/listing endpoints, `image/jpeg` for generated-image endpoints
- Manually confirmed route count: `7`

## Authentication
- The official README presents the API as public and unauthenticated.
- No API key, bearer token, OAuth flow, or signed-request scheme is documented in the reviewed official sources.

## Canonical endpoints

### 1) Get one or more quotes
- Method: `GET`
- Path: `/quote/`
- Purpose: return random quotes, all quotes from a series, or a specific quote ID within a series

Query parameters:
- `series` - optional string series key; the source code uses the internal available-series list
- `count` - optional integer; defaults to `1` when omitted
- `id` - optional integer; returns a specific quote ID when `series` is also supplied
- `all` - optional boolean-style flag; when truthy and `series` is valid, returns all quotes for that series

Response notes:
- Success responses are JSON arrays or a single JSON object, depending on the branch taken by the handler.
- If `series` is invalid, the handler returns a JSON object with `message: "series not found"` and the available series list.

### 2) List all quotes across all series
- Method: `GET`
- Path: `/all`
- Purpose: return the flattened quote dataset

### 3) List available series keys
- Method: `GET`
- Path: `/series`
- Purpose: return the list of supported series identifiers accepted by `series`

### 4) List supported color names
- Method: `GET`
- Path: `/colors`
- Purpose: return the Pillow color-name list accepted by the image-generation routes

### 5) Generate a quote image with a solid background
- Method: `GET`
- Path: `/pic/solid`
- Purpose: render a quote onto a solid-color background and return a JPEG image

Query parameters:
- `series` - optional string series key
- `id` - optional integer quote ID within the chosen series
- `background_color` - optional string; defaults to `black`
- `text_color` - optional string; defaults to `white`
- `text_size` - optional integer; defaults to `200`
- `x` - optional integer output width; defaults to `3600`
- `y` - optional integer output height; defaults to `2400`

Behavior notes:
- Unsupported `text_color` falls back to `white`.
- Unsupported `background_color` triggers the code path that sets `text_color` to `black`; the reviewed source does not document a separate error response for that case.
- If `series` is missing or invalid, the route falls back to a random quote from the full dataset.

### 6) Generate a quote image on top of a remote background image
- Method: `GET`
- Path: `/pic/image`
- Purpose: fetch a background image URL, place a quote on it, and return a JPEG image

Query parameters:
- `series` - optional string series key
- `id` - optional integer quote ID within the chosen series
- `background_img_url` - optional URL; defaults to `https://www.gstatic.com/webp/gallery/3.png`
- `text_color` - optional string; defaults to `black`
- `text_size` - optional integer; defaults to `200`

Behavior notes:
- Unsupported `text_color` falls back to `white`.
- If `series` is missing or invalid, the route falls back to a random quote from the full dataset.

### 7) Generate a custom text image
- Method: `GET`
- Path: `/pic/custom`
- Purpose: render caller-supplied text on a colored or remote-image background and return a JPEG image

Query parameters:
- `text` - optional string; defaults to `Hello World`
- `background_color` - optional string; defaults to `white`
- `image_url` - optional URL background image
- `text_color` - optional string; defaults to `black`
- `text_size` - optional integer; defaults to `200`
- `x` - optional integer output width; defaults to `3600`
- `y` - optional integer output height; defaults to `2400`

Error notes:
- If `image_url` is supplied but the remote image fetch/open fails, the route returns JSON `{"msg": "invalid url"}` instead of a JPEG.

## Request and response notes
- The image endpoints use FastAPI `Response(..., media_type="image/jpeg")`.
- Quote/listing endpoints return plain JSON values without a top-level envelope.
- The reviewed official source does not define POST, PUT, PATCH, or DELETE routes.
- The app root `/` redirects to `/docs`, but the meaningful API surface is the seven routes listed above.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented in the reviewed official sources.
- Error handling is provider-specific and minimal; several invalid-input branches fall back to defaults instead of returning structured validation errors.

## fireROUTE normalization notes
- Preserve the provider's mixed response types: JSON for metadata/quote lookup and `image/jpeg` for rendering routes.
- Treat `series` as a provider-specific domain key rather than trying to canonicalize it to a global title ID.
- Keep `/pic/custom` separate from quote-selection routes because it can operate without using the quote dataset at all.
