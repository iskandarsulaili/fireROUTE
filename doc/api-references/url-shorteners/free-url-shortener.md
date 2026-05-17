# Free Url Shortener

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `free-url-shortener`
- Official docs used manually: `https://ulvis.net/developer.html`
- Confirmed API base URL: `https://ulvis.net`
- Authentication: none; the page brands this as a "free api without key"
- Documented response formats: JSON and XML
- Manually confirmed routes in this pass: `5`

## Authentication and access
The official developer page explicitly states:
- this is a free API without a key
- no API token, OAuth flow, or signed-request scheme is documented
- requests can be made directly with GET or POST depending on the endpoint family

## Confirmed API surface
The developer page explicitly documents these endpoint families:
- `GET /api.php`
- `GET /API/write/get`
- `POST /api/write/post`
- `GET /API/read/get`
- `POST /api/read/post`

## 1) Simple single-endpoint shortener API
- Method: `GET`
- Path: `/api.php`
- Full example: `https://ulvis.net/api.php?url=YOUR-LONG-URL&custom=YOUR-CUSTOM-NAME&private=1`
- Purpose: shorten a URL through the simplest query-driven API entrypoint

Documented query parameters on the page's write-variable list:
- `url` - required; the URL to shorten
- `custom` - optional custom short name
- `type` - optional response type; `json` or `xml`; default `json`
- `private` - optional; mark the URL as private / not listed
- `password` - optional password; max 10 characters
- `uses` - optional usage limit
- `expire` - optional expiration date in `MM/DD/YYYY`
- `via` - optional signature to track the calling application

## 2) Write API via GET
- Method: `GET`
- Path: `/API/write/get`
- Full example shown by the docs: `https://ulvis.net/API/write/get?url=https://www.youtube.com/watch?v=&custom=mycustomname&private=1&type=xml`
- Purpose: create a shortened link through the dedicated write endpoint

Documented parameters:
- same eight write variables listed above: `url`, `custom`, `type`, `private`, `password`, `uses`, `expire`, `via`

Documented example response fields from the XML sample:
- `success`
- `data.id`
- `data.url`
- `data.full`
- `data.hits`
- `data.status`
- `data.via`
- `data.date`
- `data.last`

## 3) Write API via POST
- Method: `POST`
- Path: `/api/write/post`
- Purpose: create a shortened link with POST instead of GET

Documented request parameters:
- the page reuses the same write-variable list for both write endpoints
- response type can still be selected with `type=json|xml`

## 4) Read API via GET
- Method: `GET`
- Path: `/API/read/get`
- Full example shown by the docs: `https://ulvis.net/API/read/get?id=P&password=0000&private=1&type=xml`
- Purpose: retrieve information about an existing short URL

Documented parameters on the page's read-variable list:
- `id` - required short-link identifier
- `password` - optional password for protected URLs
- `type` - optional response type; `json` or `xml`; default `json`

Important doc inconsistency:
- the page says the read API accepts only three variables (`id`, `password`, `type`)
- however, the published GET example also includes `private=1`
- I preserved the contradiction here rather than inventing a corrected contract

Documented example response fields from the XML sample:
- `success`
- `data.id`
- `data.ads`
- `data.hits`
- `data.full`
- `data.created`
- `data.last`

## 5) Read API via POST
- Method: `POST`
- Path: `/api/read/post`
- Purpose: retrieve information about an existing short URL via POST

Documented request parameters:
- the docs tie this endpoint to the same read-variable set: `id`, optional `password`, optional `type`

## Request/response format notes
The official page explicitly documents:
- response type selection through `type=json|xml`
- `json` is the default when `type` is omitted
- XML response examples are published for both write and read APIs
- the API is parameter-driven rather than strongly resource-oriented

## Pagination, rate limits, and errors
From the reviewed official developer page:
- no pagination model is documented
- no numeric rate limits or quota windows are published
- no dedicated error-response table is published
- the visible samples focus on success payloads rather than enumerated error schemas

## fireROUTE notes
- This provider exposes both a legacy all-in-one `GET /api.php` interface and separate read/write endpoint families.
- The docs use mixed path casing: `GET` examples use `/API/...` while `POST` examples use lowercase `/api/...`; I preserved that exactly as documented.
- The API is useful for very lightweight integrations because it requires no credential setup, but the official docs are sparse on failure semantics.
- Consumers should treat the documented GET read example's extra `private=1` parameter as suspicious until verified live.

## Verification notes
This file was manually rebuilt from the live official Ulvis developer page using browser inspection.