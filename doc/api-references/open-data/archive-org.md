# Archive.org

## Provider metadata
- Category: `Open Data`
- Provider slug: `archive-org`
- Official docs/pages used:
  - `https://archive.readme.io/reference/getting-started` (official service overview)
  - `https://archive.readme.io/reference/item` (Item Metadata API)
  - `https://archive.readme.io/reference/website-snapshots` (Wayback snapshot lookup)
  - `https://archive.readme.io/reference/creating-a-snapshot` (Wayback snapshot creation)
  - `https://archive.readme.io/reference/book-covers` (book-cover routes)
  - `https://archive.readme.io/reference/book-manifests` (Book Data / manifest flow)
  - `https://archive.readme.io/reference/availability-borrowing` (book availability API)
  - `https://archive.readme.io/reference/do-we-have-it` (book holdings / do-we-have-it API)
- Current public API base URLs confirmed from the reviewed official docs:
  - `https://archive.org`
  - `https://pragma.archivelab.org`
  - `http://{server}` for BookReader book-manifest JSON after the metadata endpoint reveals the item’s storage server
- Auth model: no authentication documented on the reviewed routes
- Methods confirmed from the reviewed official docs: `GET`, `POST`
- Response formats confirmed from the reviewed official docs/pages: JSON, JSONP (Wayback availability), direct image responses for cover routes, and JSON request/response bodies for snapshot creation and book availability
- Rate-limit notes: no numeric public quota or throttling rules are published on the reviewed official pages
- Manually confirmed route count: `8`

## Canonical endpoints
1. `GET /metadata/{id}`
   - Retrieve Archive.org metadata for an item identifier.
2. `GET /wayback/available?url={url}[&timestamp={timestamp}][&callback={callback}]`
   - Check Wayback Machine capture availability for a URL.
3. `POST https://pragma.archivelab.org/`
   - Create a Wayback snapshot; the official example sends JSON with `url` and an optional `annotation` object.
4. `GET /services/img/{itemid}`
   - Return the automatically chosen cover / representative image for a text item.
5. `GET /download/{itemid}/page/cover_t.jpg`
   - Directly fetch the cover-page JPEG for a known book item.
6. `GET http://{server}/BookReader/BookReaderJSON.php?server={server}&itemPath={itemPath}&itemId={itemId}`
   - Retrieve Archive.org Book Data / manifest JSON for a text item.
7. `POST /services/loans/beta/loan/index.php`
   - Book availability API for availability/media URL checks across one or more identifiers.
8. `GET /services/book/v1/do_we_have_it/?isbn={isbn}[&debug={debug}][&include_unscanned_books={include_unscanned_books}]`
   - Holdings / “do we have it” lookup by ISBN or ASIN.

## Parameters confirmed from the reviewed official docs
### Item metadata
- `{id}`: Archive.org item identifier

### Wayback availability
- `url` (required): URL whose capture availability should be checked
- `timestamp`: 1-14 digit string in `YYYYMMDDhhmmss` format; if omitted, the most recent capture is returned
- `callback`: optional JSONP callback name

### Snapshot creation
- JSON body `url` (required): URL to archive
- JSON body `annotation` (optional): official example shows an object with fields like `id` and `message`

### Book cover and manifest routes
- `{itemid}`: archive.org item identifier for a text item
- `server`: storage host obtained from the metadata response
- `itemPath`: item directory / path obtained from the metadata response
- `itemId`: item identifier repeated for BookReader JSON lookups

### Book availability API (`/services/loans/beta/loan/index.php`)
The docs UI labels these as request parameters even though the request URL itself is fixed:
- `action` (required, default `availability`): `media_url` or `availability`
- `exact` (required, default `0`): `0` or `1`; whether to require or omit ACS availability checks
- `validate` (required, default `0`): `0` or `1`; whether to filter by restricted-collection membership
- `identifiers` (required): comma-separated list of Internet Archive item IDs / OCAIDs

### Book holdings / do-we-have-it
- `isbn`: 10- or 13-character ISBN without dashes/spaces, or a 10-character ASIN
- `debug` (default `false`): return internal query/debug detail when `true`
- `include_unscanned_books` (default `false`): include books not yet scanned

## Response and data notes
- `GET /metadata/{id}` returns JSON item metadata; the reviewed Book Manifest docs explicitly use it first to discover the `server` and `dir`/`itemPath` values needed for BookReader requests.
- `GET /wayback/available` returns JSON by default and JSONP when `callback` is supplied.
- `POST https://pragma.archivelab.org/` is documented as returning JSON and accepts a JSON request body.
- `GET /services/img/{itemid}` is the official fast thumbnail/preview route used to automatically select an item image.
- `GET /download/{itemid}/page/cover_t.jpg` returns a direct book-cover image when the item is known to be a text.
- `GET http://{server}/BookReader/BookReaderJSON.php...` returns book-structure JSON with fields such as `archiveFormat`, `coverImages`, `numPages`, `pageHeights`, `pageWidths`, `previewImage`, `title`, and `zip`.
- `POST /services/loans/beta/loan/index.php` is the official book-availability endpoint documented with `200` and `400` responses.
- `GET /services/book/v1/do_we_have_it/` returns fields such as `status`, `response`, `message`, `ia_identifiers`, and `response_time`; with `debug=true`, additional structures like `books`, `component_response_times`, and the internal `query` string are documented.

## Error, pagination, and format notes
- The reviewed pages expose `200` and `400` response cases for the item metadata, snapshot creation, book availability, and several book-service routes.
- No pagination parameters are documented on the eight reviewed route families.
- No numeric rate-limit headers or retry policies are published on the reviewed official pages.
- The do-we-have-it docs explicitly define `response` values `-1` (invalid input), `0` (we have this book), and `1` (we do not have this book).

## Usage notes
- For text items, call `/metadata/{id}` first when you need the BookReader manifest; the official manifest docs depend on metadata-derived `server` and `itemPath` values.
- Prefer `/services/img/{itemid}` when you just need a quick preview image; use `/download/{itemid}/page/cover_t.jpg` when you specifically need the cover page for a known book item.
- The official overview links additional APIs (for example Memento, CDX, IIIF, Open Library, fulltext search, and reverse-image search). This file documents the eight route families manually reviewed in this run from the official reference pages above.
- The Wayback snapshot-creation route is documented on the official Archive Labs-hosted `pragma.archivelab.org` service rather than under the main `archive.org` host.

## fireROUTE normalization notes
- Normalize Archive.org as a multi-base provider rather than forcing all routes under one host.
- Keep item metadata, Wayback, and book-service routes as separate route families because their hosts, request styles, and payloads differ.
- Preserve the official request-field names for the book availability and do-we-have-it APIs.
- Treat the book-manifest route as a derived route whose inputs come from a preceding metadata lookup.
