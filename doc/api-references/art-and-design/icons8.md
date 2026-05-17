# Icons8

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://img.icons8.com/`
  - `https://developers.icons8.com/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `5`

## API overview
- Primary base URL for the reviewed provider surface: `https://img.icons8.com`
- Reviewed provider surface name on the official page: `OMG-IMG`
- Authentication:
  - no request auth is documented for the OMG-IMG image URLs
  - the official page requires either an attribution backlink or a paid Icons8 license for usage
  - the separate official developers site advertises paid REST APIs with API keys, but the indexed provider page for this entry is the unauthenticated OMG-IMG image service
- Response format:
  - direct PNG image delivery from URL-based requests
- Rate limits / quotas:
  - no request-per-second limit is published on the reviewed OMG-IMG page
  - the page says the maximum free icon size is `512px`
- Pagination:
  - none documented; this is an asset-delivery surface, not a list API

## Confirmed endpoints
| Method | Path pattern | Key parameters | Notes |
|---|---|---|---|
| GET | `/{icon}` | `icon` | Returns the requested icon in the default popular style, default size, and black color. Example: `/search`. |
| GET | `/{color}/{icon}` | `color`, `icon` | Recolors a monochrome icon using a hex color code without `#`. Example: `/2266EE/search`. |
| GET | `/{style}/{icon}` | `style`, `icon` | Requests an icon in a specific style family. Example: `/color/search`. |
| GET | `/{style}/{icon}/{sizePx}` | `style`, `icon`, `sizePx` | Requests a styled icon at a specific pixel size. Example: `/color/search/96`. |
| GET | `/{style}/{scaleFactor}/{icon}` | `style`, `scaleFactor`, `icon` | Requests a styled icon using factor sizing such as `2x` or `x2`. Example: `/color/2x/search`. |

## Confirmed parameters and behavior notes
### Icon lookup
- The official page says the browser URL itself acts as the request surface.
- For icon names made of multiple words, use `-` or `_` separators.
- The page's example and prose both point to the `search` icon as the simplest lookup.

### Color handling
- Monochrome recoloring is done by inserting a hex color segment into the path.
- The color code must be supplied without the leading `#`.

### Style handling
- The reviewed page documents style selection by inserting the style name into the path.
- The page says Icons8 has `80+` styles and points users to the web app to see the full style catalog.

### Size handling
- The page documents two size forms:
  - pixel size, for example `/color/search/96`
  - scale factor, for example `/color/2x/search`
- The documentation does not explain why the scale-factor example places the size segment before the icon name while the pixel-size example places it after the icon name, so fireROUTE should preserve the officially shown forms rather than normalize them.
- The official page says each style has a preferred pixel-perfect size and recommends using those sizes to avoid blur or washed-out colors.

## Response, errors, and limits
- The reviewed OMG-IMG page documents direct image delivery, not JSON envelopes.
- No structured error schema was published on the reviewed pages.
- No pagination model was published.
- The only hard numeric limit directly visible on the reviewed page is the free-size ceiling of `512px`.

## Important usage notes
- The official OMG-IMG page describes the service as production-scale CDN-backed icon hosting intended to be embedded directly in HTML.
- The page explicitly says users do not need to export icons or host them on their own server for this surface.
- The separate official developers site advertises broader paid REST APIs, but this provider entry should be treated as the public unauthenticated image-delivery surface unless fireROUTE intentionally adds a separate paid Icons8 API provider later.

## Sources inspected
- `https://img.icons8.com/`
- `https://developers.icons8.com/`
