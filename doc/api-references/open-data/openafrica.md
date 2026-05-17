# openAFRICA

## Provider metadata
- Category: `Open Data`
- Provider slug: `openafrica`
- Description: `CKAN-based open data catalog for datasets, resources, organizations, and discovery on open.africa`
- Official docs/pages used:
  - `https://africaopendata.org/` (indexed URL; redirects to the official site `https://open.africa/`)
  - `https://open.africa/` (official homepage reviewed manually in-browser)
  - `https://open.africa/api/3` (official API root)
  - `https://open.africa/api/3/action/help_show?name=package_search` (official live help endpoint)
  - `http://docs.ckan.org/en/2.11/api/` (official CKAN API reference linked from the openAFRICA homepage footer)
- Public API base URL confirmed from the reviewed official pages: `https://open.africa/api/3/action`
- Auth model: public GET access is available for the reviewed discovery endpoints; the reviewed openAFRICA pages did not publish a site-specific API-key requirement for these routes
- Methods officially documented on the reviewed pages: `GET` for the routes confirmed below; the linked CKAN docs indicate the Action API also supports POST for many actions, but this file only counts the live GET routes manually confirmed on open.africa in this pass
- Response formats officially documented on the reviewed pages: JSON responses from the Action API
- Rate limits: no numeric quota published on the reviewed openAFRICA pages; some Action API requests can trigger Cloudflare bot verification in-browser
- Manually confirmed route count: `8`

## API shape and behavior
- openAFRICA is explicitly running `CKAN 2.11.4`, confirmed by the homepage HTML and `status_show` response.
- The homepage footer links directly to the official CKAN API reference, and the live site exposes the CKAN Action API under `/api/3/action`.
- Action responses include a top-level `help` URL, a `success` boolean, and a `result` payload.
- The reviewed live endpoints cover catalog status, dataset search, dataset detail, resource detail, autocomplete, organization listing, tag listing, and current-package listing.
- Some actions on the same public host are intermittently shielded by Cloudflare verification pages in-browser, so route coverage below is limited to the endpoints I could confirm directly from the official host during this run.

## Canonical endpoints
1. `GET /status_show`
   - Returns site metadata such as title, description, URL, extensions, and CKAN version.
2. `GET /package_search`
   - Searches datasets and returns count plus matching package records.
3. `GET /package_show`
   - Returns one dataset/package by identifier.
4. `GET /current_package_list_with_resources`
   - Returns recently modified packages including embedded resource records.
5. `GET /package_autocomplete`
   - Returns lightweight package name/title matches for a text prefix.
6. `GET /organization_list`
   - Returns organization identifiers.
7. `GET /tag_list`
   - Returns tag strings.
8. `GET /resource_show`
   - Returns metadata for a single resource by resource ID.

## Confirmed parameters
### `GET /status_show`
- No required parameters documented by the live response used in this review.

### `GET /package_search`
Confirmed from the live `help_show?name=package_search` response and a successful live query:
- `q` - optional Solr query; default `*:*`
- `fq` - optional filter-query string
- `fq_list` - optional list of filter-query strings
- `sort` - optional sort expression; default `score desc, metadata_modified desc`
- `rows` - optional result count; default `10`, upper limit `1000` unless the site config overrides it
- `start` - optional result offset
- `facet` - optional faceting toggle
- `facet.mincount` - optional facet minimum count
- `facet.limit` - optional facet-value limit
- `facet.field` - optional list of facet fields
- `include_drafts` - optional boolean
- `include_deleted` - optional boolean
- `include_private` - optional boolean
- `use_default_schema` - optional boolean
- Advanced Solr parameters explicitly listed by the official help output: `qf`, `wt`, `bf`, `boost`, `tie`, `defType`, `mm`

### `GET /package_show`
- `id` - required package identifier; confirmed by successful live request using package name `sensorsafrica-airquality-archive-ado-ekiti`.

### `GET /current_package_list_with_resources`
- `limit` - confirmed by successful live request with `limit=1`.

### `GET /package_autocomplete`
- `q` - required search prefix / term.
- `limit` - optional result count; confirmed by successful live request with `limit=2`.

### `GET /organization_list`
- No required parameters confirmed during this review.

### `GET /tag_list`
- No required parameters confirmed during this review.

### `GET /resource_show`
- `id` - required resource identifier; confirmed by successful live request using resource ID `9b106b71-2dd8-4fb5-84f1-f906b4a30428`.

## Response and pagination notes
- Action API responses consistently follow the CKAN pattern:
  - `help`
  - `success`
  - `result`
- `package_search` returns at least:
  - `count`
  - `facets`
  - `results`
- `package_autocomplete` returns an array of match objects containing `name`, `title`, `match_field`, and `match_displayed`.
- `package_show` and `current_package_list_with_resources` embed rich package metadata, including nested `organization`, `groups`, and `resources` objects.
- `resource_show` returns resource-level metadata such as `format`, `mimetype`, `size`, `url`, `package_id`, and timestamps.
- Pagination on `package_search` is offset-based via `rows` and `start`.

## Error and access notes
- The live API root `/api/3` returned `{"version": 3}` and no auth challenge.
- Several reviewed action endpoints returned normal JSON success payloads with no credentials.
- During this pass, `group_list` hit a Cloudflare verification page instead of a JSON result, so it is not counted among the confirmed routes even though it likely exists in CKAN.
- The official CKAN Action API pattern also exposes `help_show`, but I used it here as supporting documentation rather than counting it as a canonical fireROUTE route.

## Important usage notes
- Treat openAFRICA as a CKAN Action API instance rooted at `/api/3/action`.
- Preserve CKAN action names exactly instead of trying to restyle them into nested REST nouns.
- Preserve CKAN's top-level `success`/`result` envelope because it is part of the provider contract.
- Expect rich package records to contain nested resource download URLs rather than direct file bytes from the action endpoints themselves.
- Be prepared for occasional anti-bot interstitials on some routes even though the site is public.

## fireROUTE normalization notes
- Preserve the `/api/3/action` base path exactly.
- Keep `package_*`, `resource_*`, `organization_*`, and taxonomy actions as distinct route families.
- Normalize `rows` + `start` as CKAN-native pagination rather than renaming to `limit` + `offset`.
- Preserve the top-level CKAN response envelope in raw passthrough mode.
- If more openAFRICA routes are added later, confirm them from the live host or `help_show` output before extending this file.