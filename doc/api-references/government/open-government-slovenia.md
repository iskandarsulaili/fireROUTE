# Open Government, Slovenia

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-slovenia`
- Official docs/pages used:
  - `https://podatki.gov.si/`
  - `https://podatki.gov.si/api/view/store/`
  - live official CKAN action/help endpoints under `https://podatki.gov.si/api/3/action/...`
- Current documented API base URL: `https://podatki.gov.si/api/3/action`
- Auth model: no public auth requirement was published on the reviewed official Slovenia pages for the read routes documented here; all manually verified routes were publicly accessible with simple `GET` requests
- Response format: JSON envelopes with `help`, `success`, and either `result` or `error`
- Manually confirmed canonical route count: `10`

## Official usage notes
- The portal homepage is the official Slovenia open-data catalog and exposes a dedicated `OPSIapi` navigation link.
- That `OPSIapi` link resolves to `https://podatki.gov.si/api/view/store/`, an API-store front end titled `OPSIapi`.
- The portal’s live production metadata API is also available as a CKAN action API under `https://podatki.gov.si/api/3/action/...`.
- The live `status_show` route reports production `ckan_version` `2.2b` and `site_title` `OPSI`.

## Authentication, parameters, and request notes
- No API key, OAuth flow, or token header requirement was published on the reviewed official Slovenia pages for the read routes documented here.
- `GET /current_package_list_with_resources`
  - live `help_show` documents `limit`, `offset`, and deprecated `page`
  - `help_show` says the default page size is `50`
  - `help_show` says a maximum of `250` is enforced when `limit` is provided
  - results are sorted most-recently-modified first
- `GET /package_list`
  - live `help_show` documents optional `limit` and `offset`
- `GET /package_search`
  - live `help_show` documents Solr-style query parameters including `q`, `fq`, `sort`, `rows`, `start`, `facet`, `facet.mincount`, `facet.limit`, and `facet.field`
- `GET /package_show`
  - the live validation error says the required dataset locator is `name_or_id`
  - in practice `id=<dataset-slug>` worked on the live endpoint
- `GET /organization_show`
  - requires organization `id`
- `GET /group_show`
  - requires group `id`

## Pagination, errors, and format notes
- JSON is the working response format across all manually verified routes.
- `package_list` supports page-windowing through `limit` + `offset`.
- `current_package_list_with_resources` supports offset pagination through `limit` + `offset`; `page` is still documented but deprecated.
- `package_search` supports result-window pagination through `rows` + `start`.
- Verified live error behavior:
  - `409 Validation Error` from `package_show` when `name_or_id` is missing
- No public numeric quota, throttling-header contract, or retry guidance was published on the reviewed official Slovenia pages.

## Canonical endpoint inventory manually confirmed from the official site
1. `GET /api/3/action/package_list`
2. `GET /api/3/action/package_show`
3. `GET /api/3/action/package_search`
4. `GET /api/3/action/current_package_list_with_resources`
5. `GET /api/3/action/organization_list`
6. `GET /api/3/action/organization_show`
7. `GET /api/3/action/group_list`
8. `GET /api/3/action/group_show`
9. `GET /api/3/action/tag_list`
10. `GET /api/3/action/status_show`

## Example live behaviors confirmed during manual review
- `package_list` returned `8861` dataset slugs; the first results included `07_obcina_trzin_turisticne_informacije`, `11_obcina_trzin_seznam_sportnih_drustev`, and `14_obcina_trzin_seznam_otroskih_igrisc`.
- `current_package_list_with_resources?limit=2` returned full dataset objects including `namenska-raba-prostora` and `digitalni-model-visin`, each with embedded resource metadata.
- `package_show?id=namenska-raba-prostora` returned a full dataset object with custom Slovenia fields plus `organization` and `resources`.
- `package_search?rows=1&q=obcina` returned a standard CKAN search object with `count` `1756` and a first result of `obcina-makole-kulturni-objekt`.
- `organization_list` returned organization slugs such as `1a-dent_zobje_zobozdravstvena_dejavnost_d_o_o_` and `2_osnovna_sola_slovenska_bistrica`.
- `organization_show?id=ministrstvo_za_naravne_vire_in_prostor` returned organization metadata for the ministry behind the `namenska-raba-prostora` dataset.
- `group_list` returned four group slugs: `glavni_uredniki`, `podrocni_uredniki`, `sistemski_administratorji`, and `vsebinski_uredniki`.
- `group_show?id=glavni_uredniki` returned the group object with `users` count `15`.
- `tag_list` returned public tags such as `3D`, `abortus`, and `adolescenca`.
- `status_show` returned production site metadata including `site_title` `OPSI` and `ckan_version` `2.2b`.

## fireROUTE integration notes
- Treat this provider as a public CKAN catalog API even though the portal also exposes a separate `OPSIapi` store front.
- Use `package_search` and `current_package_list_with_resources` as the primary bulk-discovery routes.
- Preserve provider-native metadata fields; Slovenia dataset payloads include numerous custom extras that are not portable CKAN core fields.
- Keep `limit` sizes conservative on `current_package_list_with_resources` because the live help explicitly caps pages at `250` records.
