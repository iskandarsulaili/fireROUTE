# Open Government, Romania

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-romania`
- Official docs/pages used:
  - `https://data.gov.ro/`
  - `https://data.gov.ro/pages/developers`
  - `https://data.gov.ro/api/3/action/help_show?name=help_show`
  - `https://data.gov.ro/api/3/action/help_show?name=package_list`
  - `https://data.gov.ro/api/3/action/help_show?name=group_list`
  - `https://data.gov.ro/api/3/action/help_show?name=tag_list`
  - `https://data.gov.ro/api/3/action/help_show?name=package_show`
  - `https://data.gov.ro/api/3/action/help_show?name=package_search`
  - `https://data.gov.ro/api/3/action/help_show?name=resource_search`
  - `https://data.gov.ro/api/3/action/help_show?name=tag_show`
  - `https://data.gov.ro/api/3/action/help_show?name=group_show`
  - `https://data.gov.ro/api/3/action/help_show?name=recently_changed_packages_activity_list`
  - `https://data.gov.ro/api/3/action/help_show?name=package_create`
  - live examples linked from the official developers page:
    - `https://data.gov.ro/api/3/action/package_list`
    - `https://data.gov.ro/api/3/action/group_list`
    - `https://data.gov.ro/api/3/action/tag_list`
    - `https://data.gov.ro/api/3/action/package_show?id=traducatori-si-interpreti`
    - `https://data.gov.ro/api/3/action/tag_show?id=migratie`
    - `https://data.gov.ro/api/3/action/group_show?id=finante`
    - `https://data.gov.ro/api/3/action/package_search?q=jandarmeria`
    - `https://data.gov.ro/api/3/action/resource_search?query=name:agentia-nationala-a-functionarilor-publici`
    - `https://data.gov.ro/api/3/action/recently_changed_packages_activity_list`
    - `https://data.gov.ro/api/3/action/package_create`
- Current documented API host: `https://data.gov.ro`
- Current documented API path prefix: `/api/3/action`
- Auth model: public read routes worked without credentials; the official `package_create` example requires `Authorization: <Your Key>`
- Response format: JSON envelopes with CKAN-style top-level `help`, `success`, and `result` fields
- Manually confirmed canonical route count: `11`

## Official usage notes
- The official `Dezvoltatori` page says the portal exposes an RPC-style CKAN API and is intended for developers interacting with the platform and its datasets in code.
- That same official page explicitly links live examples for dataset lists, groups, tags, dataset lookup, tag lookup, group lookup, dataset search, resource search, recent activity, and dataset creation.
- The official footer also links the CKAN API documentation and an Atom feed at `https://data.gov.ro/feeds/dataset.atom`, but the canonical route count below is limited to the route-level JSON action API confirmed on the official developers page and the official `help_show` responses.
- No public rate-limit policy or retry/backoff guidance was published on the reviewed official pages.

## Canonical endpoints confirmed from the official portal and official developer page
1. `GET /api/3/action/help_show`
   - Purpose: return the help string for a named API action
   - Query parameters:
     - `name` - required action function name such as `package_search` or `package_create`
   - Official notes:
     - returns the help string or `None` when the action has no docstring
     - raises not found when the action name does not exist

2. `GET /api/3/action/package_list`
   - Purpose: list dataset names available on the portal
   - Official parameters:
     - `limit` - optional page size
     - `offset` - optional starting offset when paginating
   - Live confirmation:
     - the official live route returned dataset slugs/ids

3. `GET /api/3/action/group_list`
   - Purpose: list portal groups
   - Official parameters from `help_show?name=group_list`:
     - `order_by` - deprecated sort field, optional
     - `sort` - optional sort expression; allowed fields are `name`, `package_count`, and `title`
     - `limit` - optional page size
     - `offset` - optional starting offset
     - `groups` - optional list of group names to restrict results
     - `all_fields` - optional boolean to return group dictionaries instead of names
     - `include_dataset_count` - optional boolean when `all_fields=true`
     - `include_extras` - optional boolean when `all_fields=true`
     - `include_tags` - optional boolean when `all_fields=true`
     - `include_groups` - optional boolean when `all_fields=true`
     - `include_users` - optional boolean when `all_fields=true`
   - Live confirmation:
     - the reviewed live response returned `14` group slugs including `finante`, `energie`, `transport`, and `sanatate`

4. `GET /api/3/action/tag_list`
   - Purpose: list portal tags
   - Official parameters:
     - `query` - optional tag-name substring filter
     - `vocabulary_id` - optional vocabulary id or name
     - `all_fields` - optional boolean to return full tag dictionaries instead of names
   - Live confirmation:
     - the reviewed live response returned free tags including year values and topical tags

5. `GET /api/3/action/package_show`
   - Purpose: return metadata for one dataset and its resources
   - Official parameters:
     - `id` - required dataset id or dataset name
     - `use_default_schema` - optional boolean
     - `include_tracking` - optional boolean
   - Live confirmation:
     - `package_show?id=traducatori-si-interpreti` returned the dataset record and its resource metadata

6. `GET /api/3/action/tag_show`
   - Purpose: return details for one tag
   - Official parameters:
     - `id` - required tag name or id
     - `vocabulary_id` - optional vocabulary id or name
     - `include_datasets` - optional boolean; official help notes tag dataset expansion is limited to `1000`
   - Live confirmation:
     - `tag_show?id=migratie` returned the tag object for `migratie`

7. `GET /api/3/action/group_show`
   - Purpose: return details for one group
   - Official parameters:
     - `id` - required group id or name
     - `include_datasets` - optional boolean
     - `include_dataset_count` - optional boolean
     - `include_extras` - optional boolean
     - `include_users` - optional boolean
     - `include_groups` - optional boolean
     - `include_tags` - optional boolean
     - `include_followers` - optional boolean
   - Official notes:
     - the reviewed help text says only the first `1000` datasets are returned when dataset expansion is included
   - Live confirmation:
     - `group_show?id=finante` returned the finance group with user and dataset metadata

8. `GET /api/3/action/package_search`
   - Purpose: search datasets in the portal catalogue
   - Official parameters from the reviewed help text:
     - `q` - optional Solr query string, default `*:*`
     - `fq` - optional filter query string
     - `sort` - optional sort expression
     - `rows` - optional number of matching datasets to return; official hard limit `1000`
     - `start` - optional result offset
     - `facet` - optional boolean/string toggle for facets
     - `facet.mincount` - optional facet minimum count
     - `facet.limit` - optional facet value limit
     - `facet.field` - optional list of facet fields
     - `include_drafts` - optional boolean
     - `include_private` - optional boolean
     - `use_default_schema` - optional boolean
     - advanced Solr options also documented: `qf`, `wt`, `bf`, `boost`, `tie`, `defType`, `mm`
   - Live confirmation:
     - `package_search?q=jandarmeria&rows=1` returned a JSON result set with `count`, `results`, and `search_facets`
     - that reviewed query returned `count: 7`

9. `GET /api/3/action/resource_search`
   - Purpose: search resources by field/value criteria
   - Official parameters:
     - `query` - required search criterion string or list of strings in `{field}:{term}` form
     - `fields` - deprecated
     - `order_by` - optional result ordering field
     - `offset` - optional result offset
     - `limit` - optional maximum results
   - Official notes:
     - extra-field matching is limited to configured `ckan.extra_resource_fields`
     - matching is case-insensitive, and multiple criteria are ANDed together
   - Live confirmation:
     - `resource_search?query=name:agentia-nationala-a-functionarilor-publici` returned `count` plus matching resource objects

10. `GET /api/3/action/recently_changed_packages_activity_list`
   - Purpose: return recent dataset activity across the portal
   - Official parameters:
     - `offset` - optional starting activity offset, default `0`
     - `limit` - optional maximum activity items to return, default `31`
   - Live confirmation:
     - the reviewed live response returned recent package activity items with `timestamp`, `object_id`, and nested package data

11. `POST /api/3/action/package_create`
   - Purpose: create a new dataset
   - Auth:
     - the official developers page shows `Authorization: <Your Key>` in the request header
   - Official parameters called out in the reviewed help text:
     - required/core identity fields: `name`
     - common metadata fields: `title`, `private`, `author`, `author_email`, `maintainer`, `maintainer_email`, `license_id`, `notes`, `url`, `version`, `state`, `type`
     - structured payload fields: `resources`, `tags`, `extras`, `relationships_as_object`, `relationships_as_subject`, `groups`, `owner_org`
   - Official notes:
     - creating datasets requires authorization
     - if `groups` are provided, the caller must also be authorized to edit those groups
     - the official curl example posts a JSON body with `name`, `title`, `owner_org`, `private`, and `type`

## Pagination, filtering, and format notes
- Confirmed read routes return JSON with top-level `help`, `success`, and `result` fields.
- `package_list` and `group_list` support offset-based pagination through `limit` and `offset`.
- `package_search` uses Solr-style search semantics, returns a total `count`, and supports facets plus offset paging through `rows` and `start`.
- `resource_search` supports `offset` and `limit` result paging.
- `recently_changed_packages_activity_list` supports `offset` and `limit` and defaults to `31` items per call according to the reviewed help text.
- `tag_show` and `group_show` can inline related datasets, but the reviewed official help text warns those expansions are capped at `1000` datasets.

## Error, auth, and access notes
- Public read routes reviewed in this run worked without authentication.
- The official `package_create` example requires an `Authorization` header containing the user's API key.
- The reviewed `resource_search` and `package_search` help pages describe CKAN validation/search behavior but the official Romania pages do not publish a portal-specific error-code catalogue.
- The reviewed developer page does not publish rate-limit headers, quotas, or retry guidance.
- The official `help_show` help text says unknown action names raise not-found errors.

## fireROUTE integration notes
- Treat `https://data.gov.ro/api/3/action` as the canonical API surface for this provider.
- Preserve the distinction between read-only discovery routes (`package_list`, `group_list`, `tag_list`, `package_show`, `tag_show`, `group_show`, `package_search`, `resource_search`, `recently_changed_packages_activity_list`) and the authenticated write route (`package_create`).
- Keep `help_show` available in adapters because the official portal uses it as its route-level self-documentation surface.
- Do not assume every CKAN action is publicly supported just because the portal footer links generic CKAN docs; only the routes above were explicitly confirmed from the official Romania pages and live responses reviewed in this run.