# Open Data NHS Scotland

## Provider metadata
- Category: `Health`
- Provider slug: `open-data-nhs-scotland`
- Official docs/pages used:
  - `https://www.opendata.nhs.scot/`
  - `https://www.opendata.nhs.scot/api/3`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=package_search`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=package_show`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=group_list`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=group_show`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=tag_list`
  - `https://www.opendata.nhs.scot/api/3/action/help_show?name=tag_show`
  - `https://www.opendata.nhs.scot/api/3/action/package_search?rows=0`
  - `https://www.opendata.nhs.scot/api/3/action/package_list`
- Current public API base URL: `https://www.opendata.nhs.scot/api/3/action`
- Auth model: no authentication documented or required for the reviewed public CKAN actions
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed pages
- Manually confirmed route count: `9`

## Authentication and access
- The site homepage identifies the platform as Scottish Health and Social Care Open Data managed by Public Health Scotland.
- The homepage footer links directly to `CKAN API`, and the API version endpoint responded publicly without credentials.
- Reviewed `package_list`, `package_search`, and `help_show` calls succeeded without auth headers or tokens.

## Canonical endpoints
1. `GET /api/3` - CKAN API version endpoint
2. `GET /api/3/action/help_show` - action-specific API help text
3. `GET /api/3/action/package_list` - list dataset names
4. `GET /api/3/action/package_search` - search datasets with Solr-style filters
5. `GET /api/3/action/package_show` - fetch dataset metadata and resources
6. `GET /api/3/action/group_list` - list site groups
7. `GET /api/3/action/group_show` - fetch one group's details
8. `GET /api/3/action/tag_list` - list site tags
9. `GET /api/3/action/tag_show` - fetch one tag and its datasets

## Parameters and path notes
### `GET /api/3/action/help_show`
- `name` - required action name such as `package_search` or `package_show`

### `GET /api/3/action/package_list`
- `limit` - optional page size
- `offset` - optional starting offset when `limit` is used

### `GET /api/3/action/package_search`
- `q` - Solr query string
- `fq` - filter query
- `sort` - result sort order
- `rows` - result count limit
- `start` - starting offset
- `facet` - enable or adjust faceting behavior
- `include_drafts` - include draft datasets
- `include_private` - include private datasets
- `use_default_schema` - use the default package schema

### `GET /api/3/action/package_show`
- `id` - dataset ID or dataset name
- `use_default_schema` - optionally use the default package schema
- `include_tracking` - optionally include tracking information

### `GET /api/3/action/group_list`
- `order_by` - legacy sort field
- `sort` - sort string
- `limit` - optional page size
- `offset` - optional starting offset
- `all_fields` - include expanded group objects
- `include_dataset_count` - include dataset counts
- `include_extras` - include extra fields
- `include_tags` - include tag details
- `include_groups` - include nested groups
- `include_users` - include user details

### `GET /api/3/action/group_show`
- `id` - group ID or group name
- `include_datasets` - include a truncated dataset list
- `include_dataset_count` - include package count
- `include_extras` - include extra fields
- `include_users` - include user details
- `include_groups` - include nested groups
- `include_tags` - include tags
- `include_followers` - include follower information

### `GET /api/3/action/tag_list`
- `query` - tag-name substring filter
- `vocabulary_id` - vocabulary ID or name
- `all_fields` - include expanded tag fields

### `GET /api/3/action/tag_show`
- `id` - tag name or tag ID
- `vocabulary_id` - vocabulary ID or name
- `include_datasets` - include datasets associated with the tag

## Response, pagination, and error notes
- The reviewed API responses use the CKAN-style JSON envelope with top-level `help`, `success`, and `result` keys.
- `GET /api/3` returned a simple JSON version object: `{"version": 3}` during review.
- `package_search` returns a result object with keys including `count`, `sort`, `facets`, `results`, and `search_facets`.
- Pagination is explicitly documented on `package_list` and `group_list` via `limit` and `offset`, and on `package_search` via `rows` and `start`.
- The reviewed pages did not publish a numeric quota or a shared structured error schema.

## Usage notes from the official docs
- The homepage says the platform provides statistics and reference data for information and re-use.
- The site footer states that content is available under the Open Government Licence.
- The platform is explicitly identified as `Powered by CKAN`, and the action docs exposed by `help_show` are the provider's live route-level API reference.

## fireROUTE normalization notes
- Normalize this provider as a read-only CKAN-style JSON API rooted at `https://www.opendata.nhs.scot/api/3/action`.
- Preserve the provider's native `help`, `success`, and `result` envelope rather than flattening it away.
- Map dataset discovery primarily through `package_search` and `package_show`, with groups and tags treated as supporting taxonomy/navigation resources.
- Keep pagination inputs route-specific because the provider mixes `limit`/`offset` and `rows`/`start` conventions across actions.