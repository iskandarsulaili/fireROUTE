# Quotes on Design

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://quotesondesign.com/api/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `1`

## API overview
- Base URL: `https://quotesondesign.com`
- Current API version named on the page: `5.0`
- Authentication: none documented
- Response format: JSON via the WordPress REST API
- Rate limits: no numeric limit is published on the reviewed official page

## Confirmed endpoint
| Method | Path | Notes |
|---|---|---|
| GET | `/wp-json/wp/v2/posts/?orderby=rand` | Current documented random-quote endpoint. The page says this is now just the built-in WordPress REST API with extra code so `orderby=rand` works. |

## Parameters and format notes
### `GET /wp-json/wp/v2/posts/`
- `orderby=rand` — the reviewed official page calls out this query parameter explicitly as the way to randomize responses
- The official page does not publish an additional custom auth model, wrapper format, or separate versioned path beyond the WordPress REST path shown above

## Response, pagination, and errors
- The official page identifies the current implementation as the built-in WordPress REST API v2
- Because the reviewed page only publishes the one current route pattern, no provider-specific pagination or error table is documented there
- The route returns WordPress post objects in JSON rather than a custom quote-only envelope

## Important usage notes
- The reviewed page says: `EVERY OTHER API IS SHUT DOWN.`
- The page explains that the older `4.0` API depended on the WordPress REST API v1 plugin and that those old URLs now break
- The page also says the current `5.0` API is less full-featured than earlier versions and exists primarily to keep the site online with lower maintenance debt

## Sources inspected
- `https://quotesondesign.com/api/`
