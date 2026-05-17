# Open Government, Italy

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-italy`
- Official docs/pages used:
  - `https://www.dati.gov.it/`
  - `https://www.dati.gov.it/api`
  - live official CKAN action/help endpoints under `https://www.dati.gov.it/opendata/api/3/action/...`
- Current documented API base URL: `https://www.dati.gov.it/opendata/api/3/action`
- Auth model: the reviewed official API page documents public CKAN catalog access and does not publish any auth requirement for the routes manually confirmed here
- Response format: JSON envelopes with `help`, `success`, and either `result` or `error`
- Manually confirmed canonical route count: `10`

## Official usage notes
- The official API page says the portal supports CKAN APIs and that results are returned in JSON.
- That same page sets the CKAN open-data base path to `https://dati.gov.it/opendata/` and then documents concrete action routes under `/api/3/action/...`.
- The official page explicitly documents these route families: `package_list`, `package_show`, `current_package_list_with_resources`, `organization_list`, `organization_show`, and `package_search`.
- The page recommends fetching `current_package_list_with_resources` in batches of at most `100` records for performance reasons.
- The live `status_show` route reports `ckan_version` `2.10.3` on the production API surface.

## Authentication, parameters, and request notes
- No auth header, OAuth flow, or API-key requirement was published on the reviewed official Italy pages for these catalog-read routes.
- `GET /current_package_list_with_resources`
  - the official API page says `limit` is required and `offset` is optional
  - the official page gives these concrete examples:
    - `.../current_package_list_with_resources?limit=10`
    - `.../current_package_list_with_resources?limit=10&offset=50`
  - the same page recommends `limit=100` maximum per call for performance
- `GET /package_show`
  - the official API page documents `id={id-dataset}`
  - live `help_show` says the id can be a dataset id or dataset name
- `GET /organization_show`
  - the official API page documents `id={id-catalogo}`
- `GET /package_search`
  - the official API page documents `facet.field`, `facet.limit`, and `fq`
  - live `help_show` additionally documents `q`, `fq_list`, `sort`, `rows`, `start`, `facet`, and `facet.mincount`
- `GET /group_show`
  - requires group `id`

## Pagination, errors, and format notes
- JSON is the working format across the manually verified routes.
- `current_package_list_with_resources` uses offset pagination through `limit` + `offset`.
- `package_search` uses result-window pagination through `rows` + `start`; live `help_show` says `rows` defaults to `10` and is capped at `1000` unless site configuration changes it.
- Verified live error behavior:
  - `409 Validation Error` from `package_show` when `name_or_id` is missing
- No public rate-limit policy, throttling-header contract, or retry guidance was published on the reviewed official Italy pages.
- The only published throughput guidance was the official recommendation to keep `current_package_list_with_resources` pages to `100` records or fewer.

## Canonical endpoint inventory manually confirmed from the official site
1. `GET /opendata/api/3/action/package_list`
2. `GET /opendata/api/3/action/package_show`
3. `GET /opendata/api/3/action/current_package_list_with_resources`
4. `GET /opendata/api/3/action/organization_list`
5. `GET /opendata/api/3/action/organization_show`
6. `GET /opendata/api/3/action/package_search`
7. `GET /opendata/api/3/action/group_list`
8. `GET /opendata/api/3/action/group_show`
9. `GET /opendata/api/3/action/tag_list`
10. `GET /opendata/api/3/action/status_show`

## Example live behaviors confirmed during manual review
- `package_list` returned dataset identifiers as a large array of slugs/hashes.
- `current_package_list_with_resources?limit=2` returned full dataset objects with fields such as `id`, `name`, `notes`, `organization`, `num_resources`, and resource metadata.
- `organization_list` returned organization slugs such as `aci`, `agenzia-delle-dogane-e-dei-monopoli`, and `anac`.
- `organization_show?id=comune-di-milano` returned organization metadata including `identifier`, `site`, `region`, and `package_count`.
- `group_list` returned the thematic groups exposed by the portal, including `agricoltura`, `economia`, `governo`, and `trasporti`.
- `group_show?id=economia` returned the group object with `package_count` and group metadata.
- `tag_list` returned a large plain list of tag strings.
- `status_show` returned core site metadata and the production extension list.

## fireROUTE integration notes
- This provider is a CKAN catalog API with a straightforward read-only public surface on the reviewed routes.
- Keep `current_package_list_with_resources` and `package_search` as the primary bulk-ingest routes because the official page documents both explicitly.
- Preserve provider-native dataset and organization payloads; the returned objects contain Italy-specific metadata fields such as `holder_name`, regional metadata, and catalog-specific extras.
- Apply sensible page sizing on `current_package_list_with_resources` in line with the official `100`-record performance guidance.
