# Forismatic

## Manual review status
- Category: Personality
- Official docs reviewed: `https://forismatic.com/en/api/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `1`

## API overview
- Base URL: `http://api.forismatic.com`
- Route path: `/api/1.0/`
- Authentication: none documented
- Request methods: GET or POST with URL-encoded parameters
- Response formats supported by the provider: `xml`, `json`, `jsonp`, `html`, `text`

## Confirmed endpoint
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET or POST | `/api/1.0/` | `method=getQuote`, `format`, optional `key`, `lang`, optional `jsonp` | Returns a random quote based on the request key/language settings. |

## Parameter details from the official docs
- `method=getQuote` — required method name to invoke
- `format=<format>` — one of `xml`, `json`, `jsonp`, `html`, `text`
- `key=<integer>` — optional numeric key influencing quote selection; maximum length `6` characters
- `lang=<string>` — response language, documented values `ru` or `en`
- `jsonp=<string>` — callback function name for `jsonp` format only

## Response notes
The XML example in the official docs shows quote payload fields including:
- `quoteText`
- `quoteAuthor`
- `senderName`
- `senderLink`

## Pagination, errors, and rate limits
- Pagination: not documented.
- Error schema: not documented.
- Rate limits: not documented.

## Important usage notes
- The provider documents one API entrypoint rather than multiple REST resource paths.
- The choice of quote can be influenced by the numeric `key`; if no key is supplied, the server generates one.

## Sources inspected
- `https://forismatic.com/en/api/`
