# Zen Quotes

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://zenquotes.io/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `9`

## API overview
- Base URL: `https://zenquotes.io`
- Authentication:
  - no API key is required for the basic free endpoints
  - an API key or registered IP is required for unlimited access
  - the official page also says an API key or registered IP is required to enable `Access-Control-Allow-Origin` headers
- Response formats:
  - quote endpoints return JSON arrays
  - image endpoints return image content
- Rate limits:
  - free usage is limited to `5` requests per `30` seconds
- Attribution:
  - the official page requires attribution with a link back to `https://zenquotes.io/` when using the free version

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/quotes` | Returns a JSON array of `50` random quotes. |
| GET | `/api/today` | Returns the quote of the day. |
| GET | `/api/random` | Returns one random quote. |
| GET | `/api/image` | Returns a random inspirational image. |
| GET | `/api/authors/{apiKey}` | Returns the available author list; API key required. |
| GET | `/api/quotes/author/{author}/{apiKey}` | Returns quotes for a specific author slug; API key required. |
| GET | `/api/image/author/{author}/{apiKey}` | Returns a quote image for a specific author slug; API key required. |
| GET | `/api/quotes/{apiKey}` | API-key route used for custom quotes and keyword filtering. |
| GET | `/api/image/{apiKey}` | API-key route used for keyword-filtered image generation. |

## Confirmed parameters and response fields
### Shared retrieval pattern
- The homepage documents the generic pattern `https://zenquotes.io/api/[mode]/[key]`
- Documented `mode` values on the page: `random`, `today`, `quotes`
- `key` is optional for the basic free calls and required for premium / unlimited-key flows

### `GET /api/quotes/{apiKey}`
- Documented premium usage patterns shown on the official page:
  - `custom=true` — returns your own quotes; the page says this currently supports the `random` and `quotes` calls
  - `keyword={keyword}` — filters quotes by supported keywords

### `GET /api/image/{apiKey}`
- Documented premium usage pattern shown on the official page:
  - `keyword={keyword}` — generates an image using a supported keyword filter

### Quote JSON fields
- The official example response shows each quote object containing:
  - `q` — quote text
  - `a` — author name
  - `h` — preformatted HTML blockquote output

## Response, pagination, and errors
- The official page says quote results are returned as a JSON array
- The page explicitly states that pre-formatted HTML output is included in addition to raw values
- `GET /api/quotes` is documented to return `50` random quotes per request
- No pagination model is documented on the reviewed official page
- No formal error schema or HTTP status table is published on the reviewed official page

## Important usage notes
- The quote of the day changes at `00:00 UTC`
- The homepage suggests that app developers should fetch `50` quotes with the `quotes` call, loop them locally, and refresh after a couple of hours rather than calling the API for every display
- The official page markets premium access for unlimited requests, advanced calls, and self-hosting / own-version use
- The homepage says the service requires reasonable request volume when no API key is provided

## Sources inspected
- `https://zenquotes.io/`
