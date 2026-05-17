# Czech Television

## Provider metadata
- Category: `Video`
- Provider slug: `czech-television`
- Official docs pages used:
  - `https://www.ceskatelevize.cz/xml/tv-program/informace/`
  - `https://www.ceskatelevize.cz/xml/tv-program/registrace/`
- Main API base URL: `https://www.ceskatelevize.cz/services-old/programme/xml`
- Auth model: registered `user` identifier passed as a query parameter
- Supported request method: `GET`
- Response format: XML by default, JSON when `json=1` is supplied
- Manually confirmed route count: `1`

## Authentication and access model
- The information page's examples all include a `user` query parameter.
- The registration page states that consumers must complete the registration form to obtain access to the XML export service.
- The registration page requests a login name, email, and the URL where the XML feed will be used.
- The service terms say the registered user must not share access with third parties.

## Canonical endpoint
#### 1) TV programme export
- Method: `GET`
- Path: `/schedule.php`
- Full example host/path from the official docs: `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php`
- Purpose: export Czech Television programme data for a specific day and channel

Query parameters:
- `user` - required registered login name; the official example uses `test`
- `date` - required broadcast date in `dd.mm.rrrr` format
- `channel` - required channel code; the docs list `ct1`, `ct2`, `ct24`, `ct4`, `ct5`, `ct6`, and `ct7`
- `regiony` - optional flag shown in the docs example as `regiony=1`
- `json` - optional format switch shown in the docs example as `json=1`

Official examples shown on the docs page:
- `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=test&date=16.05.2026&channel=ct24`
- `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=test&date=16.05.2026&channel=ct1&regiony=1`
- `https://www.ceskatelevize.cz/services-old/programme/xml/schedule.php?user=test&date=16.05.2026&channel=ct6&json=1`

## Format and field notes
- The default response is an XML document describing a `<program>` collection with nested `<porad>` records.
- The information page documents top-level metadata fields such as `datum_vysilani`, `kanal`, and `generovano`.
- The same page documents representative nested content including broadcast date/time, title fields, episode numbering, genre, duration, notes, regional information, and iVysílání/program links.
- When `json=1` is supplied, the official example indicates a JSON representation is available instead of XML.

## Pagination
- No pagination parameters or paginated traversal behavior are documented on the official pages reviewed.
- The export is request-by-day and request-by-channel rather than page-based.

## Rate limits
- The registration page states that the user may load the XML data file at most `1× per minute`.

## Errors and transport notes
- The reviewed pages do not publish a structured API error schema.
- The current official documentation pages are served over HTTPS even though the category index originally listed an HTTP docs URL.
- The route itself remains under `/services-old/programme/xml/`, so fireROUTE should preserve that legacy path exactly.

## Important usage notes
- The docs explicitly require the date format `dd.mm.rrrr`.
- The docs call this an XML export service and treat JSON as an optional alternate output format.
- The service terms restrict use to Czech Television programme presentation and forbid redistribution of the machine-readable feed to third parties without permission.

## fireROUTE normalization notes
- Keep the provider-specific query shape instead of attempting REST-style path normalization.
- Preserve XML as a first-class response mode; do not assume JSON unless the caller explicitly requests `json=1`.
- Because access is tied to a registered `user` identifier rather than a conventional header token, adapters should expose that requirement clearly.
