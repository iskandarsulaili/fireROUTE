# Callook.info

## Provider metadata
- Category: `Open Data`
- Provider slug: `callook-info`
- Official docs/pages used:
  - `https://callook.info/` (homepage with API access links)
  - `https://callook.info/api_reference.php` (official API reference)
- Current public API base URL: `https://callook.info`
- Auth model: no authentication; the API reference says the API is publicly available and free to use
- Methods confirmed from the official site flow: `GET`
- Response formats officially offered: plain text, XML, JSON, JSONP
- Rate-limit notes: no numeric quota is published; the API reference says there are no guarantees regarding accuracy or site uptime
- Manually confirmed route count: `4`

## Canonical endpoints
The homepage's API access links resolve to `W1AW` examples that expose the stable pretty-URL route patterns:

1. `GET /{callsign}/text`
   - Plain-text response for a U.S. callsign lookup.
2. `GET /{callsign}/xml`
   - XML response for the same lookup.
3. `GET /{callsign}/json`
   - JSON response for the same lookup.
4. `GET /{callsign}/json/{callback}`
   - JSONP variant using the callback function name as a path segment.

## Path and data notes
- `{callsign}` is the lookup key.
- The official API reference states that Callook.info exclusively contains and serves **United States callsign data**.
- The API reference says the underlying callsign database is updated daily at `11:00 AM ET` using publicly available database snapshots.

## Response notes
- The official site exposes parallel representations for the same lookup in text, XML, JSON, and JSONP.
- The JSON example linked from the homepage shows these top-level sections/fields:
  - `status`
  - `type`
  - `current`
  - `previous`
  - `trustee`
  - `name`
  - `address`
  - `location`
  - `otherInfo`
- The JSON example includes fields such as:
  - `current.callsign`
  - `trustee.callsign`
  - `trustee.name`
  - `address.line1`, `address.line2`, `address.attn`
  - `location.latitude`, `location.longitude`, `location.gridsquare`
  - `otherInfo.grantDate`, `expiryDate`, `lastActionDate`, `frn`, `ulsUrl`

## Transport and browser notes
- The API reference changelog says API responses are served with `Access-Control-Allow-Origin: *`.
- The reference also states HTTPS is available and preferred; HTTP remains available for backwards compatibility.
- The API reference notes that pretty URLs were added as part of the API specification work.

## Error and reliability notes
- The reviewed official pages do not publish a formal HTTP error-code table or numeric rate limits.
- The API reference explicitly says there are no guarantees regarding data accuracy or site uptime.
- The visible JSON example uses a `status` field; the homepage example shows `status: "VALID"` for a successful lookup.

## Usage notes
- This is a format-suffixed lookup API, not a large REST resource tree.
- Use a path-based `callsign` lookup rather than query-parameter search for the canonical fireROUTE mapping.
- Keep JSONP support available for legacy/browser integrations, but prefer plain JSON for new adapters.

## fireROUTE normalization notes
- Normalize the provider as four read-only GET lookup routes keyed by `{callsign}`.
- Preserve the provider's U.S.-only scope in any metadata or adapter description.
- Prefer HTTPS and JSON by default.
