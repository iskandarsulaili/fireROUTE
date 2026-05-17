# Open Government, Mexico

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-mexico-2`
- Official docs/pages used:
  - `https://www.datos.gob.mx/`
  - live official CKAN action/help endpoints under `https://www.datos.gob.mx/api/3/action/...`
- Current documented API base URL: `https://www.datos.gob.mx/api/3/action`
- Auth model: no auth requirement was published on the reviewed official pages for the routes documented here; all manually verified catalog routes were publicly accessible with simple GET requests
- Response format: JSON envelopes with `help`, `success`, and either `result` or `error`
- Manually confirmed canonical route count: `10`

## Official usage notes
- The live homepage presents the service as the `Plataforma Nacional de Datos Abiertos` and says it is `Desarrollado con Sistema Ajolote`.
- The live page source identifies the production platform as `CKAN 2.11.2`.
- The homepage does not expose a visible dedicated API documentation page in the reviewed navigation, but the official CKAN action API is live on the same `datos.gob.mx` domain.
- The live `status_show` route confirms the production API surface and reports enabled extensions such as `stats`, `resource_proxy`, `datastore`, and `xloader`.

## Authentication, parameters, and request notes
- No API key, OAuth flow, or token header requirement was published on the reviewed official Mexico pages for these catalog-read routes.
- `GET /current_package_list_with_resources`
  - live `help_show` documents `limit`, `offset`, and deprecated `page`
  - results are sorted most-recently-modified first
- `GET /package_search`
  - live `help_show` documents `q`, `fq`, `fq_list`, `sort`, `rows`, `start`, `facet`, `facet.mincount`, `facet.limit`, and `facet.field`
  - `rows` defaults to `10`; `help_show` says the upper limit is `1000` unless site configuration changes it
- `GET /package_show`
  - live `help_show` says the required dataset locator is `id`, and the underlying validation error refers to missing `name_or_id`
- `GET /organization_show`
  - requires organization `id`
- `GET /group_show`
  - requires group `id`

## Pagination, errors, and format notes
- JSON is the working format across the manually verified routes.
- `current_package_list_with_resources` supports offset pagination through `limit` + `offset`; `page` is still documented but deprecated.
- `package_search` supports pagination through `rows` + `start`.
- Verified live error behavior:
  - `409 Validation Error` from `package_show` when `name_or_id` is missing
  - `409 Validation Error` from `organization_show` when `id` is missing
- No public rate-limit policy, quota table, or throttling-header contract was published on the reviewed official Mexico pages.

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
- `package_list` returned dataset slugs such as `abasto_medicamentos_material_curacion`, `academicos_contratados_escuela`, and `accesibilidad_centros_urbanos`.
- `package_show?id=historico_catalogo_producciones_cinematograficas` returned a full dataset object including `license_id`, `organization`, `num_resources`, and resource metadata.
- `package_search?rows=1&q=parque` returned a standard CKAN search object with `count`, `facets`, and `results`.
- `current_package_list_with_resources?limit=2` returned full dataset objects with embedded resources.
- `organization_list` returned organization slugs such as `apbp`, `aicm`, `asea`, and `ccc`.
- `organization_show?id=ccc` returned organization metadata including `package_count`, `users`, and logo/image fields.
- `group_list` returned thematic groups such as `agricultura`, `cultura`, `economia`, `movilidad`, and `salud`.
- `group_show?id=agricultura` returned the group object with `package_count` and group metadata.
- `tag_list` returned a large plain list of public tags.
- `status_show` returned site metadata including `site_title`, `site_description`, enabled extensions, and `ckan_version` `2.11.2`.

## fireROUTE integration notes
- This provider is an active CKAN action API even though the public homepage does not foreground an API reference link.
- Use `package_search` and `current_package_list_with_resources` as the main bulk-discovery routes.
- Preserve provider-native JSON fields such as organization/user blocks and CKAN metadata extras rather than forcing premature normalization.
- Treat the public portal and the action API as the same official provider surface because both live on `www.datos.gob.mx`.
