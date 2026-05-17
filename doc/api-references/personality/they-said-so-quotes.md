# They Said So Quotes

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://theysaidso.com/api/`
  - `https://theysaidso.com/api/inspiration`
  - attempted but not cleanly inspectable in this session: `https://theysaidso.com/api/bible`
- Manual review outcome: `manually_documented`
- Confirmed route count: `10`

## API overview
- Base URL: `https://quotes.rest`
- Product scope confirmed from the reviewed docs:
  - quote of the day
  - quote category discovery
  - random-quote retrieval
  - quote search
  - daily inspiration variants
- Authentication:
  - the quotes overview says some endpoints are public with a free limit of `10` calls per hour
  - the overview page advertises `Authorization: Bearer <your_api_key>` for higher-rate or private access
  - the quotes FAQ and quote code samples also show `X-TheySaidSo-Api-Secret: <your_api_key>`
  - the inspiration page says `Authorization: Bearer <your_api_key>` is supported and `api_key=<key>` can also be passed as a query parameter, though the header is preferred
- Response formats:
  - quotes routes explicitly support `JSON`, `XML`, and `JSONP`
  - inspiration examples are JSON
- CORS: the quotes overview says responses include `Access-Control-Allow-Origin: *`
- Pagination: no page-number or cursor pagination model was documented on the reviewed routes
- Rate limits:
  - public quote API access: `10` calls per hour
  - Premium: `2500` calls/day, bulk limit `3`
  - Ultra: `8000` calls/day, bulk limit `5`
  - Enterprise: unlimited daily calls, bulk limit `15`
  - the quotes FAQ says paid-plan limits reset at midnight UTC

## Confirmed endpoints
|| Method | Path | Notes |
||---|---|---|
|| GET | `/qod` | Quote of the Day endpoint with optional category filtering. |
|| GET | `/qod.json` | JSON quote-of-the-day variant. |
|| GET | `/qod.xml` | XML quote-of-the-day variant. |
|| GET | `/qod.js` | JSONP quote-of-the-day variant. |
|| GET | `/qod/categories` | Lists available Quote of the Day categories. |
|| GET | `/quote/random.json` | Returns one or more random quotes, subject to plan bulk limits. |
|| GET | `/quote/search.json` | Searches quotes by text and other filters described on the docs page. |
|| GET | `/inspiration/activity` | Returns the daily activity-style inspiration item. |
|| GET | `/inspiration/saying` | Returns the daily saying-style inspiration item. |
|| GET | `/inspiration/calltoaction` | Returns the daily call-to-action inspiration item. |

## Confirmed parameters and request fields
### Quote of the Day routes
- `category` - optional category selector; reviewed example uses `inspire`
- The same route family is available in extensionless, `.json`, `.xml`, and `.js` forms

### `GET /quote/random.json`
- `limit` - number of quotes requested in one call
- The reviewed docs say bulk limit depends on plan:
  - Premium `3`
  - Ultra `5`
  - Enterprise `15`

### `GET /quote/search.json`
- reviewed docs explicitly mention filtering by:
  - `query`
  - author
  - tag
  - minimum length
  - maximum length
  - `limit`
- reviewed example uses `query=courage&limit=3`

### Inspiration routes
- No route-specific request body is documented; examples are plain GET requests
- The inspiration FAQ says API auth can also be supplied as `api_key=<key>` query parameter, though the header is preferred

## Confirmed response fields
### Quote routes
- reviewed quote-of-the-day and random-quote examples include:
  - `success.total`
  - `contents.quotes[]`
  - `contents.quotes[].quote`
  - `contents.quotes[].author`
  - `contents.quotes[].length`
  - `contents.quotes[].language`
  - `contents.quotes[].tags[]`
  - `contents.quotes[].id`
  - `contents.quotes[].category` on quote-of-the-day examples
  - `contents.quotes[].date` on quote-of-the-day examples
  - `copyright.url`
  - `copyright.year`

### Inspiration routes
- reviewed inspiration examples include:
  - `success.total`
  - `contents.id`
  - `contents.inspiration`
  - `contents.type`
  - `contents.title`
  - `contents.date`
  - `copyright.url`
  - `copyright.year`

## Response, pagination, and error notes
- The reviewed docs do not publish a formal pagination scheme for the confirmed routes
- Quote-of-the-day responses return the same quote for the full calendar day according to the overview page
- The quotes overview strongly implies rate-limit enforcement on public access and per-plan bulk limits on random/search routes
- No formal HTTP error table or structured error schema was published on the reviewed quote and inspiration pages

## Important usage notes
- The current official docs use mixed authentication guidance across pages and samples:
  - `Authorization: Bearer <your_api_key>` on the main auth summary and inspiration API page
  - `X-TheySaidSo-Api-Secret: ...` in quotes FAQ and code examples
  fireROUTE consumers should preserve this inconsistency in integration notes and verify accepted header names against real credentials before hard-coding one contract.
- Browser-side use is technically possible because the overview page says CORS is open, but the same docs warn that exposing an API key client-side is insecure; a server-side proxy is recommended
- The current quote docs emphasize over `1` million quotes and `500+` categories
- The separate Bible API page was attempted in this session but did not yield a clean readable route surface through the available browser tooling, so no Bible-specific routes are counted here

## Sources inspected
- `https://theysaidso.com/api/`
- `https://theysaidso.com/api/inspiration`
- `https://theysaidso.com/api/bible`
