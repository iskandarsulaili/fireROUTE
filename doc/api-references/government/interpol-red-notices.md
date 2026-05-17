# Interpol Red Notices

## Provider metadata
- Category: `Government`
- Provider slug: `interpol-red-notices`
- Official docs/pages used:
  - `https://interpol.api.bund.dev/`
  - `https://interpol.api.bund.dev/openapi.yaml`
  - `https://www.interpol.int/en/How-we-work/Notices/Red-Notices/View-Red-Notices`
  - `https://ws-public.interpol.int/notices/v1/red?resultPerPage=1&page=1`
  - `https://ws-public.interpol.int/notices/v1/red?forename=DARLAN&name=LIMA%20SANT%20ANA&nationality=BR&sexId=M&ageMin=18&ageMax=40&page=1&resultPerPage=5`
  - `https://ws-public.interpol.int/notices/v1/red/2026-30151`
  - `https://ws-public.interpol.int/notices/v1/red/2026-30151/images`
- Assigned docs URL: `https://interpol.api.bund.dev/`
- Current documented API host: `https://ws-public.interpol.int`
- Current documented API path prefix: `/notices/v1/red`
- Auth model: no auth was required for the reviewed public Red Notices routes
- Response format: JSON on successful responses; invalid detail/image requests returned HTML 404 pages on the reviewed host
- Manually confirmed route count: `3`

## Official usage notes
- The assigned docs URL is a third-party OpenAPI wrapper, but its OpenAPI document points at the official INTERPOL host `https://ws-public.interpol.int`.
- The official INTERPOL public Red Notices page embeds the same `ws-public.interpol.int/notices/v1/red` route family directly in the page HTML, so the wrapper and the official site matched during this run.
- The official filter form on the INTERPOL page exposed the same search fields documented in the OpenAPI file: `name`, `forename`, `nationality`, `sexId`, `ageMin`, `ageMax`, `arrestWarrantCountryId`, and `freeText`.
- Successful list/detail/image responses use a HAL-like JSON shape with `_links` and, for list/image collections, `_embedded` objects.
- The list payload’s `entity_id` field uses slash notation such as `2026/30151`, but the official `_links.self.href` uses the hyphenated route id `2026-30151`. Use the hyphenated path form for detail and image requests.

## Canonical endpoints confirmed from the official site and live official API host
1. `GET /notices/v1/red`
   - Base URL: `https://ws-public.interpol.int`
   - Purpose: search and page through public Red Notices
   - Query parameters confirmed from the official INTERPOL page and reviewed OpenAPI document:
     - `name` - family name / last name, optional
     - `forename` - first name, optional
     - `nationality` - two-letter country code, optional
     - `sexId` - gender filter, optional; reviewed values were empty string, `F`, `M`, or `U`
     - `ageMin` - minimum age, optional
     - `ageMax` - maximum age, optional
     - `arrestWarrantCountryId` - two-letter requesting-country code, optional
     - `freeText` - keyword search, optional
     - `page` - page number, optional; the OpenAPI file says paging starts at `1`
     - `resultPerPage` - requested page size, optional
   - Live confirmation:
     - `GET /notices/v1/red?resultPerPage=1&page=1` returned `total`, `query`, `_embedded.notices`, and `_links.first/next/last`
     - `GET /notices/v1/red?forename=DARLAN&name=LIMA%20SANT%20ANA&nationality=BR&sexId=M&ageMin=18&ageMax=40&page=1&resultPerPage=5` returned a single matching notice

2. `GET /notices/v1/red/{noticeID}`
   - Base URL: `https://ws-public.interpol.int`
   - Purpose: return one public Red Notice detail record
   - Path parameters:
     - `noticeID` - hyphenated notice identifier such as `2026-30151`
   - Live confirmation:
     - `GET /notices/v1/red/2026-30151` returned a JSON record containing fields such as `entity_id`, `name`, `forename`, `nationalities`, `arrest_warrants`, `_embedded`, and `_links`

3. `GET /notices/v1/red/{noticeID}/images`
   - Base URL: `https://ws-public.interpol.int`
   - Purpose: return the image collection metadata for one public Red Notice
   - Path parameters:
     - `noticeID` - hyphenated notice identifier such as `2026-30151`
   - Live confirmation:
     - `GET /notices/v1/red/2026-30151/images` returned JSON with `_embedded` and `_links`, including `thumbnail` and back-link `notice` references

## Pagination, filtering, and format notes
- List responses include HAL-style pagination links such as `self`, `first`, `next`, and `last`.
- The official INTERPOL website stated during this run that the browser page displays up to `160` notices per search result, while the reviewed OpenAPI file showed an example `resultPerPage` value of `200`; no official hard API maximum was explicitly published on the reviewed pages.
- Successful API responses were JSON on all reviewed list/detail/image routes.
- The official public page showed the public Red Notice total as `6436` during this run.

## Error, auth, and access notes
- Public read access worked anonymously on all reviewed routes.
- The reviewed pages did not publish a rate-limit policy.
- A malformed detail/image path using slash-form ids such as `/notices/v1/red/2026/30151` returned HTTP `404` with an HTML error page, reinforcing that clients should follow the hyphenated ids published in `_links.self.href`.
- The reviewed materials did not publish a richer machine-readable error schema beyond the host’s HTTP-level failures.

## fireROUTE normalization notes
- Treat `https://ws-public.interpol.int` as the canonical upstream host for this provider.
- Keep the provider scoped to the public Red Notices family only; the reviewed OpenAPI file also documents Yellow and UN notices, but those are outside this provider file.
- Preserve the official query parameter names exactly rather than remapping them into a custom search schema.
- Derive follow-up detail/image ids from the official `_links.self.href` values instead of the slash-form `entity_id` field.