# Universities List

## Provider metadata
- Category: `Open Data`
- Provider slug: `universities-list`
- Description: `University names, countries and domains`
- Official docs/pages used:
  - `https://raw.githubusercontent.com/Hipo/university-domains-list/master/README.md` (official dataset README)
  - `https://raw.githubusercontent.com/Hipo/university-domains-list-api/master/README.md` (official hosted-API/server README)
  - `http://universities.hipolabs.com/search?name=middle&limit=1&offset=1` (live hosted search example returning JSON)
- Current public API base URL: `http://universities.hipolabs.com`
- Auth model: no authentication mentioned on the reviewed official pages
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON arrays for search results and a JSON status object for update responses per the official API README
- Rate limits: no numeric rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `2`

## API shape and behavior
- The official dataset README says the data can be used either as a JSON file or through the free hosted API sponsored by Hipo.
- The official API README says the service provides a `search` endpoint for autocomplete-style university-name lookups and country filtering.
- The official API README also documents an `update` endpoint that forces a refresh when the underlying dataset changes.
- The reviewed live search check returns a JSON array of university objects containing fields such as `domains`, `state-province`, `country`, `name`, `web_pages`, and `alpha_two_code`.

## Canonical endpoints
1. `GET /search`
   - Search universities by name and optionally filter/paginate the result set.
2. `GET /update`
   - Force a refresh of the API dataset when the source list changes.

## Core parameters
### Search query parameters
- `name` - search string for university-name matching; the official README uses `Middle` / `middle` examples
- `country` - optional country filter; the official examples show values such as `Turkey` / `turkiye`
- `limit` - optional pagination size control
- `offset` - optional pagination offset

## Response, pagination, and format notes
- `GET /search` returns a JSON array of matching university records.
- The official examples show fields including `web_page`/`web_pages`, `country`, `domain`/`domains`, and `name`; the reviewed live hosted endpoint returns array objects using the richer dataset-style field names.
- Pagination is documented through `limit` and `offset`.
- `GET /update` returns a JSON object with:
  - `status`
  - `message`

## Error notes
- The reviewed official READMEs do not publish a formal HTTP status-code table.
- The reviewed official docs do not provide a structured error schema for failed searches or update operations.

## Usage notes
- The official examples use `http://universities.hipolabs.com` rather than HTTPS.
- The dataset README recommends the hosted API for small projects and suggests self-hosting for bigger projects.
- `GET /update` is an administrative side-effect route, not a read-only query route.
- Treat the hosted API response shape as aligned with the underlying dataset file, even though the older API README examples show slightly simpler object keys.

## fireROUTE normalization notes
- Preserve the `http://universities.hipolabs.com` origin unless the provider publishes an official HTTPS alternative.
- Model `/search` and `/update` as separate route families.
- Preserve `name`, `country`, `limit`, and `offset` as first-class query parameters.
- Consider guarding `/update` behind an explicit opt-in because it is a mutation-style maintenance operation rather than ordinary search traffic.
