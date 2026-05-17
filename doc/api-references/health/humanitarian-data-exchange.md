# Humanitarian Data Exchange

## Provider metadata
- Category: `Health`
- Provider slug: `humanitarian-data-exchange`
- Official docs/pages used:
  - `https://data.humdata.org/`
  - `https://data.humdata.org/api/3`
  - `https://data.humdata.org/api/3/action/package_search?rows=0`
  - `https://data.humdata.org/api/3/action/help_show?name=package_list`
  - `https://data.humdata.org/api/3/action/help_show?name=package_search`
  - `https://data.humdata.org/api/3/action/help_show?name=package_show`
  - `https://data.humdata.org/api/3/action/help_show?name=group_list`
  - `https://data.humdata.org/api/3/action/help_show?name=group_show`
  - `https://data.humdata.org/api/3/action/help_show?name=organization_list`
  - `https://data.humdata.org/api/3/action/help_show?name=organization_show`
  - `https://data.humdata.org/api/3/action/help_show?name=tag_list`
  - `https://data.humdata.org/api/3/action/help_show?name=tag_show`
  - `https://data.humdata.org/api/3/action/help_show?name=resource_show`
- Current public API base URL: `https://data.humdata.org/api/3/action`
- Auth model: no authentication documented or required for the reviewed public CKAN actions
- Response format: JSON
- Public rate-limit note: no numeric rate limit or quota was published on the reviewed public pages
- Manually confirmed route count: `12`

## Authentication and access
- The HDX homepage describes the service as the Humanitarian Data Exchange run by OCHA.
- The public site exposes live CKAN API responses under `https://data.humdata.org/api/3` and `https://data.humdata.org/api/3/action/...` without credentials.
- The reviewed `package_search` and `help_show` calls succeeded anonymously.

## Canonical endpoints
1. `GET /api/3` - CKAN API version endpoint
2. `GET /api/3/action/help_show` - action-specific API help text
3. `GET /api/3/action/package_list` - list dataset names
4. `GET /api/3/action/package_search` - search datasets and facets
5. `GET /api/3/action/package_show` - fetch one dataset and its resources
6. `GET /api/3/action/group_list` - list groups/locations
7. `GET /api/3/action/group_show` - fetch one group with optional datasets
8. `GET /api/3/action/organization_list` - list organizations/sources
9. `GET /api/3/action/organization_show` - fetch one organization with optional datasets
10. `GET /api/3/action/tag_list` - list tags
11. `GET /api/3/action/tag_show` - fetch one tag and optional datasets
12. `GET /api/3/action/resource_show` - fetch one resource record

## Parameters and path notes
### `GET /api/3/action/help_show`
- `name` - required action name such as `package_search`, `group_show`, or `organization_show`

### `GET /api/3/action/package_list`
- `limit` - optional page size
- `offset` - optional starting offset

### `GET /api/3/action/package_search`
- `q` - optional Solr query string; the docs say the default is `*:*`
- `fq` - optional Solr filter query
- `sort` - optional sort string
- `rows` - optional result count limit
- `start` - optional starting offset
- `facet` - optional faceting toggle/configuration
- `include_private` - optional private-dataset toggle
- `include_drafts` - optional draft-dataset toggle
- `use_default_schema` - optional schema toggle

### `GET /api/3/action/package_show`
- `id` - required dataset ID or dataset name
- `use_default_schema` - optional schema toggle
- `include_tracking` - optional tracking-data toggle

### `GET /api/3/action/group_list`
- `type` - optional group type; default `group`
- `order_by` - legacy sort field
- `sort` - optional sort string
- `limit` - optional page size
- `offset` - optional starting offset
- `all_fields` - optionally expand group objects
- `include_dataset_count` - optionally include package counts
- `include_extras` - optionally include extra fields
- `include_tags` - optionally include tags
- `include_groups` - optionally include nested groups
- `include_users` - optionally include users

### `GET /api/3/action/group_show`
- `id` - required group ID or name
- `include_datasets` - optionally include a dataset list
- `include_dataset_count` - optionally include package counts
- `include_extras` - optionally include extra fields
- `include_users` - optionally include users
- `include_groups` - optionally include nested groups
- `include_tags` - optionally include tags
- `include_followers` - optionally include followers

### `GET /api/3/action/organization_list`
- `type` - optional organization type; default `organization`
- `order_by` - legacy sort field
- `sort` - optional sort string
- `limit` - optional page size
- `offset` - optional starting offset
- `all_fields` - optionally expand organization objects
- `include_dataset_count` - optionally include package counts
- `include_extras` - optionally include extra fields
- `include_users` - optionally include users
- `include_groups` - optionally include groups
- `include_tags` - optionally include tags

### `GET /api/3/action/organization_show`
- `id` - required organization ID or name
- `include_datasets` - optionally include a dataset list
- `include_dataset_count` - optionally include package counts
- `include_extras` - optionally include extra fields
- `include_users` - optionally include users
- `include_groups` - optionally include groups
- `include_tags` - optionally include tags
- `include_followers` - optionally include followers

### `GET /api/3/action/tag_list`
- `query` - optional tag-name substring filter
- `vocabulary_id` - optional vocabulary selector
- `all_fields` - optionally expand tag objects

### `GET /api/3/action/tag_show`
- `id` - required tag name or tag ID
- `vocabulary_id` - optional vocabulary selector
- `include_datasets` - optionally include datasets associated with the tag

### `GET /api/3/action/resource_show`
- `id` - required resource ID

## Response, pagination, and error notes
- The reviewed HDX API responses use the CKAN-style JSON envelope with top-level `help`, `success`, and `result` keys.
- `GET /api/3` returned `{"version": 3}` during review.
- `GET /api/3/action/package_search?rows=0` returned a `result` object with `count`, `facets`, `expanded`, `results`, `sort`, `search_facets`, `facet_pivot`, and `facet_queries`.
- Pagination is documented as `limit` and `offset` on list routes, and `rows` and `start` on `package_search`.
- The reviewed pages did not publish a numeric quota or a common structured error schema.

## Usage notes from the official docs
- The homepage says HDX is for finding, sharing, and using humanitarian data in one place.
- The reviewed homepage publicly advertised `20,243` datasets, `254` locations, and `2,188` sources at review time.
- The homepage footer links to `Documentation` and `BUILD WITH HDX`, reinforcing that the CKAN endpoints are part of the public developer surface.

## fireROUTE normalization notes
- Normalize this provider as a read-only CKAN-style JSON API rooted at `https://data.humdata.org/api/3/action`.
- Preserve the native `help` / `success` / `result` response envelope.
- Treat datasets (`package_*`) as the main record family, with groups, organizations, tags, and resources as supporting discovery/navigation entities.
- Keep route-specific pagination names intact because HDX mixes `limit` / `offset` and `rows` / `start` conventions.
