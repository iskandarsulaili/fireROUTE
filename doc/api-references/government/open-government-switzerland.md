# Open Government, Switzerland

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-switzerland`
- Official docs pages used:
  - `https://handbook.opendata.swiss/de/content/nutzen/api-nutzen.html`
  - official CKAN API reference linked from that page
- Current documented API base URL: `https://ckan.opendata.swiss/api/3/action/`
- Browser example URL shown by the official handbook: `https://opendata.swiss/api/3/action/package_search?fq=tags:economy`
- Auth model: no auth documented for the metadata search/use cases shown in the handbook
- Response format: JSON
- Manually confirmed route count: `6`

## Official usage notes
- The handbook states that opendata.swiss is based on CKAN.
- It explicitly says API access targets catalog metadata rather than hosting the underlying datasets themselves.
- All calls use the `action` portion of the CKAN API.
- Responses are JSON objects with top-level fields such as `help`, `success`, and `result`.

## Canonical endpoints/actions explicitly named in the official handbook
1. `GET /status_show`
   - Listed under typical API queries for users

2. `GET /organization_list`
   - Listed under typical API queries for users

3. `GET /package_list`
   - Listed under typical API queries for users

4. `GET /package_search`
   - Example shown with query `fq=tags:economy`
   - Used to search datasets/packages

5. `GET /package_show`
   - Listed under typical API queries for users
   - Handbook shows `id` as the associated parameter

6. `GET /group_list`
   - Listed under typical API queries for users

## Query and filter notes explicitly named in the handbook
- `fq` - shown in the `package_search` example
- `organization` - listed for package search examples
- `language` - listed for package search examples
- `id` - listed for `package_show`
- `facet_field` - listed as an example query element
- `sort=relevance+asc` - listed as a sort example
- `dataset_type` and `harvest_source_id` - listed in publisher-oriented examples

## Response shape notes
The handbook explains these top-level response fields:
- `help` - documentation URL for the query
- `success` - whether the request was syntactically successful
- `result` - response payload

The handbook also describes common dataset/resource fields returned in package-style responses, including:
- `issued`
- `title_for_slug`
- `id`
- `type`
- `description`
- `groups`
- `publisher`
- `organization`
- `name`
- `accrual_periodicity`
- `resources[]`

Resource-level metadata highlighted by the handbook includes:
- `package_id`
- `issued`
- `id`
- `download_url`
- `media-type`
- `format`
- `rights`
- `created`
- `description`
- `num_resources`

## Error and result notes
- The handbook explains that `success: true` may still accompany an empty result list when the syntax is valid but no datasets match.
- No rate limit or shared HTTP error schema is published on the handbook page used here.

## fireROUTE normalization notes
- This is a CKAN action API rather than a conventional REST resource tree.
- `package_search` is the main action explicitly demonstrated and is likely the key route for read/search integration.
- Because the official handbook mostly teaches CKAN usage patterns rather than providing a full endpoint inventory, only actions explicitly named on that page are counted here.
